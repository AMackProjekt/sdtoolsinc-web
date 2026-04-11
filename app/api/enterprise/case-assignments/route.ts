import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { getCaseAssignments, assignParticipant, unassignParticipant } from "@/lib/supabase";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const staff_id = searchParams.get("staff_id") ?? undefined;

  try {
    const assignments = await getCaseAssignments(staff_id);
    return NextResponse.json({ assignments });
  } catch (err) {
    console.error("[api/enterprise/case-assignments GET]", err);
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
    const { participant_id, staff_id, notes } = body as {
      participant_id: string;
      staff_id: string;
      notes?: string;
    };
    if (!participant_id || !staff_id) {
      return NextResponse.json({ error: "participant_id and staff_id are required" }, { status: 400 });
    }
    const assignment = await assignParticipant({
      participant_id,
      staff_id,
      notes,
      assigned_by: (session.user as { email?: string }).email,
    });
    return NextResponse.json({ assignment }, { status: 201 });
  } catch (err) {
    console.error("[api/enterprise/case-assignments POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if ((session.user as { role?: string }).role !== "enterprise_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const participant_id = searchParams.get("participant_id");
    if (!participant_id) {
      return NextResponse.json({ error: "participant_id is required" }, { status: 400 });
    }
    await unassignParticipant(participant_id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[api/enterprise/case-assignments DELETE]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
