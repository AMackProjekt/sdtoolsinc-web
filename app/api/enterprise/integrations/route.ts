import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { getIntegrations, createSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const integrations = await getIntegrations();
    return NextResponse.json({ integrations });
  } catch (err) {
    console.error("[api/enterprise/integrations]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if ((session.user as { role?: string }).role !== "enterprise_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body as { id: string; [key: string]: unknown };
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

    const db = createSupabaseAdmin();
    const { data, error } = await db
      .from("integrations")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ integration: data });
  } catch (err) {
    console.error("[api/enterprise/integrations PUT]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
