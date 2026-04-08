import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { getMetrics } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = request.nextUrl;
    const period = searchParams.get("period") ?? undefined;
    const metrics = await getMetrics(period);
    return NextResponse.json({ metrics });
  } catch (err) {
    console.error("[api/enterprise/metrics]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
