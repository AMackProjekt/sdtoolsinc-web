type AuditLevel = "info" | "warning" | "error";

export type AuditEventName =
  | "auth.signin.success"
  | "auth.signin.failed"
  | "auth.signup.started"
  | "auth.signup.pending"
  | "auth.signout"
  | "auth.session.timeout"
  | "auth.unverified.blocked"
  | "auth.unapproved.blocked"
  | "security.new_device"
  | "password.reset.requested"
  | "verification.resend.requested";

interface AuditPayload {
  event: AuditEventName;
  level?: AuditLevel;
  metadata?: Record<string, unknown>;
  createdAt?: string;
}

const STORAGE_KEY = "portal_audit_events";

function enqueueLocalEvent(payload: AuditPayload) {
  if (typeof window === "undefined") {
    return;
  }

  const existingRaw = window.localStorage.getItem(STORAGE_KEY);
  const existing = existingRaw ? (JSON.parse(existingRaw) as AuditPayload[]) : [];
  const next = [...existing.slice(-99), payload];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export async function logAuditEvent(event: AuditEventName, metadata?: Record<string, unknown>, level: AuditLevel = "info") {
  const payload: AuditPayload = {
    event,
    level,
    metadata,
    createdAt: new Date().toISOString(),
  };

  enqueueLocalEvent(payload);

  const apiBase = process.env.NEXT_PUBLIC_API_BASE;
  if (!apiBase || typeof window === "undefined") {
    return;
  }

  const url = `${apiBase}/v1/audit-events`;

  try {
    if (window.navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
      window.navigator.sendBeacon(url, blob);
      return;
    }

    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // Keep silent and rely on local queue.
  }
}
