import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { getStaff, createSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const staff = await getStaff();
    return NextResponse.json({ staff });
  } catch (err) {
    console.error("[api/enterprise/staff]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
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
      .from("staff")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ member: data });
  } catch (err) {
    console.error("[api/enterprise/staff PATCH]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if ((session.user as { role?: string }).role !== "enterprise_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const db = createSupabaseAdmin();
    const { data, error } = await db.from("staff").insert(body).select().single();
    if (error) throw error;
    return NextResponse.json({ member: data }, { status: 201 });
  } catch (err) {
    console.error("[api/enterprise/staff POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
