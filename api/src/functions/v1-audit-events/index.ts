import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { fail, ok } from "../../shared/http";
import { query } from "../../shared/database";
import { requirePortalAuth } from "../../shared/auth";
import { ensureClientDataTables } from "../../shared/client-data";

const rateStore = new Map<string, { count: number; resetAt: number }>();

function consumeRateLimit(key: string, limit = 100, windowMs = 60000): boolean {
  const now = Date.now();
  const existing = rateStore.get(key);

  if (!existing || now > existing.resetAt) {
    rateStore.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  existing.count += 1;
  return existing.count <= limit;
}

export async function auditEvents(req: HttpRequest): Promise<HttpResponseInit> {
  if (req.method?.toUpperCase() !== "POST") {
    return fail("method_not_allowed", "Unsupported method", 405);
  }

  const auth = await requirePortalAuth(req, { requireApproved: false });
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const rateKey = auth.user?.id || ip;

  if (!consumeRateLimit(rateKey)) {
    return fail("rate_limited", "Too many requests", 429);
  }

  await ensureClientDataTables();

  let body: any;
  try {
    body = await req.json();
  } catch {
    return fail("invalid_json", "Request body must be valid JSON", 400);
  }

  const eventType = typeof body.event === "string" ? body.event : body.event_type;
  if (!eventType) {
    return fail("validation_error", "event_type is required", 422);
  }

  await query(
    `INSERT INTO ClientAuditEvents (UserId, EventType, EventData, [Level], IpAddress, UserAgent)
     VALUES (@userId, @eventType, @eventData, @level, @ipAddress, @userAgent)`,
    {
      userId: auth.user?.id || null,
      eventType,
      eventData: JSON.stringify(body.metadata || body.event_data || {}),
      level: body.level || null,
      ipAddress: ip,
      userAgent: req.headers.get("user-agent") || null,
    }
  );

  return ok({ success: true }, 202);
}

app.http("v1-audit-events", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "v1/audit-events",
  handler: auditEvents,
});
