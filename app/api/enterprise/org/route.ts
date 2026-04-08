import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { getOrgSettings, upsertOrgSettings } from "@/lib/supabase";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const settings = await getOrgSettings();
    return NextResponse.json({ settings });
  } catch (err) {
    console.error("[api/enterprise/org]", err);
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
    const updated = await upsertOrgSettings(body);
    return NextResponse.json({ settings: updated });
  } catch (err) {
    console.error("[api/enterprise/org PUT]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
