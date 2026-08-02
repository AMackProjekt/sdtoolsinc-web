import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getEnterpriseUsers, createSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const users = await getEnterpriseUsers();
    return NextResponse.json({ users });
  } catch (err) {
    console.error("[api/enterprise/users]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await auth();
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
      .from("enterprise_users")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ user: data });
  } catch (err) {
    console.error("[api/enterprise/users PATCH]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
