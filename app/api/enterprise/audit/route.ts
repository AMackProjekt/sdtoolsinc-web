import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAuditLogs } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = request.nextUrl;
    const limit = Math.min(Number(searchParams.get("limit") ?? 50), 200);
    const offset = Number(searchParams.get("offset") ?? 0);
    const { logs, total } = await getAuditLogs(limit, offset);
    return NextResponse.json({ logs, total, limit, offset });
  } catch (err) {
    console.error("[api/enterprise/audit]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
