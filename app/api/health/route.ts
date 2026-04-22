/**
 * app/api/health/route.ts
 * GET /api/health — lightweight liveness/readiness check for the sweep agent.
 */

import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      timestamp: Date.now(),
      version: process.env.npm_package_version ?? "1.0.0",
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    }
  );
}
