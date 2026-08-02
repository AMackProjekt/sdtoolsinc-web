import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getPortalStats, getRecentActivity } from "@/lib/supabase";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const [stats, activity] = await Promise.all([
      getPortalStats(),
      getRecentActivity(10),
    ]);
    return NextResponse.json({ stats, activity });
  } catch (err) {
    console.error("[api/enterprise/dashboard]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
