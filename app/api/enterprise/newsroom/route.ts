import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getPressReleases, createSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const releases = await getPressReleases();
    return NextResponse.json({ releases });
  } catch (err) {
    console.error("[api/enterprise/newsroom]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if ((session.user as { role?: string }).role !== "enterprise_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const db = createSupabaseAdmin();
    const { data, error } = await db
      .from("press_releases")
      .insert({ ...body, author_email: session.user?.email })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ release: data }, { status: 201 });
  } catch (err) {
    console.error("[api/enterprise/newsroom POST]", err);
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
      .from("press_releases")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ release: data });
  } catch (err) {
    console.error("[api/enterprise/newsroom PATCH]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
