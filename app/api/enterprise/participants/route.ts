import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getParticipants, createParticipant, updateParticipant } from "@/lib/supabase";

export async function GET(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") ?? undefined;
  const case_manager_id = searchParams.get("case_manager_id") ?? undefined;

  try {
    const participants = await getParticipants({ status, case_manager_id });
    return NextResponse.json({ participants });
  } catch (err) {
    console.error("[api/enterprise/participants GET]", err);
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
    const participant = await createParticipant(body);
    return NextResponse.json({ participant }, { status: 201 });
  } catch (err) {
    console.error("[api/enterprise/participants POST]", err);
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
    const participant = await updateParticipant(id, updates);
    return NextResponse.json({ participant });
  } catch (err) {
    console.error("[api/enterprise/participants PATCH]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
