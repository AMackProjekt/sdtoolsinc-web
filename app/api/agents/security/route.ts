/**
 * app/api/agents/security/route.ts
 * POST /api/agents/security — receives threat reports from the client security agent.
 *
 * Includes server-side rate limiting (max 30 reports per IP per minute) to prevent
 * this endpoint itself from being used as a denial-of-service vector.
 */

import { NextRequest, NextResponse } from "next/server";
import type { ThreatEvent, ThreatLevel, ThreatType } from "@/lib/agents/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ── Rate limiting ─────────────────────────────────────────────────────────────
const RATE_LIMIT = 30; // max reports per IP per minute
const ipTimestamps = new Map<string, number[]>();

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const times = (ipTimestamps.get(ip) ?? []).filter((t) => now - t < 60_000);
  if (times.length >= RATE_LIMIT) return true;
  times.push(now);
  ipTimestamps.set(ip, times);
  return false;
}

// ── Validation ────────────────────────────────────────────────────────────────
const VALID_TYPES: ThreatType[] = [
  "xss_attempt",
  "injection_attempt",
  "rapid_requests",
  "storage_tamper",
  "suspicious_nav",
  "csp_violation",
];
const VALID_SEVERITIES: ThreatLevel[] = ["none", "low", "medium", "high", "critical"];

function isValidThreatEvent(body: unknown): body is ThreatEvent {
  if (!body || typeof body !== "object") return false;
  const e = body as Record<string, unknown>;
  return (
    VALID_TYPES.includes(e.type as ThreatType) &&
    VALID_SEVERITIES.includes(e.severity as ThreatLevel) &&
    typeof e.detail === "string" &&
    typeof e.path === "string" &&
    typeof e.timestamp === "number"
  );
}

// ── In-memory threat log (ring buffer) ────────────────────────────────────────
const BUFFER_MAX = 200;
const threatLog: ThreatEvent[] = [];

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isValidThreatEvent(body)) {
    return NextResponse.json({ error: "Invalid threat event" }, { status: 422 });
  }

  // Sanitize — strip any extra fields, truncate strings
  const event: ThreatEvent = {
    type: body.type,
    severity: body.severity,
    detail: String(body.detail).slice(0, 500),
    // Validate path is a relative path only — reject any that contain "://"
    path: String(body.path).startsWith("/") && !String(body.path).includes("://")
      ? String(body.path).slice(0, 256)
      : "/[redacted]",
    timestamp: body.timestamp,
  };

  threatLog.push(event);
  if (threatLog.length > BUFFER_MAX) threatLog.shift();

  console.warn(
    `[SecurityAgent] type=${event.type} severity=${event.severity} path=${event.path} detail="${event.detail}"`,
  );

  // For high/critical threats — you could trigger alerts here (email, Slack, PagerDuty, etc.)
  if (event.severity === "high" || event.severity === "critical") {
    console.error(`[SecurityAgent] HIGH SEVERITY THREAT: ${event.type} at ${event.path}`);
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}

/** GET /api/agents/security — return recent threat log (admin only in production) */
export async function GET() {
  return NextResponse.json({ threats: threatLog.slice(-20) }, { status: 200 });
}
