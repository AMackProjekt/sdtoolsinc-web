/**
 * app/api/agents/sweep/route.ts
 * POST /api/agents/sweep — receives sweep reports from the client agent.
 *
 * In production, pipe these to your observability platform (Datadog, Azure Monitor, etc.).
 * For now, logs to the server console and maintains an in-memory ring buffer.
 */

import { NextRequest, NextResponse } from "next/server";
import type { SweepReport } from "@/lib/agents/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// In-memory ring buffer — last 50 reports (cleared on cold start)
const BUFFER_MAX = 50;
const reports: SweepReport[] = [];

function isValidSweepReport(body: unknown): body is SweepReport {
  if (!body || typeof body !== "object") return false;
  const r = body as Record<string, unknown>;
  return (
    typeof r.timestamp === "number" &&
    typeof r.score === "number" &&
    r.score >= 0 &&
    r.score <= 100 &&
    Array.isArray(r.checks) &&
    r.checks.length <= 20
  );
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isValidSweepReport(body)) {
    return NextResponse.json({ error: "Invalid sweep report" }, { status: 422 });
  }

  // Sanitize the report — only keep expected fields
  const report: SweepReport = {
    timestamp: body.timestamp,
    score: body.score,
    autoFixed: Array.isArray(body.autoFixed)
      ? (body.autoFixed as unknown[])
          .filter((s): s is string => typeof s === "string")
          .slice(0, 10)
          .map((s) => s.slice(0, 200))
      : [],
    checks: body.checks.map((c) => ({
      name: String(c.name ?? "").slice(0, 50),
      passed: Boolean(c.passed),
      detail: typeof c.detail === "string" ? c.detail.slice(0, 200) : undefined,
    })),
  };

  reports.push(report);
  if (reports.length > BUFFER_MAX) reports.shift();

  const failedChecks = report.checks.filter((c) => !c.passed);
  if (failedChecks.length > 0 || (report.autoFixed?.length ?? 0) > 0) {
    console.warn(
      `[SweepAgent] score=${report.score} failed=${failedChecks.map((c) => c.name).join(",")} autoFixed=${report.autoFixed?.join(",")}`,
    );
  }

  return NextResponse.json({ ok: true, received: report.timestamp }, { status: 200 });
}

/** GET /api/agents/sweep — return last N reports (admin use only in production) */
export async function GET() {
  return NextResponse.json({ reports: reports.slice(-10) }, { status: 200 });
}
