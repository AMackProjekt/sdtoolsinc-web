export type ApprovalStatus = "approved" | "pending" | "rejected";

const DEFAULT_SESSION_TIMEOUT_MINUTES = 30;

export function getSessionTimeoutMs(): number {
  const envMinutes = Number(process.env.NEXT_PUBLIC_SESSION_TIMEOUT_MINUTES || DEFAULT_SESSION_TIMEOUT_MINUTES);
  const safeMinutes = Number.isFinite(envMinutes) && envMinutes > 0 ? envMinutes : DEFAULT_SESSION_TIMEOUT_MINUTES;
  return safeMinutes * 60 * 1000;
}

export function getInviteCodesFromEnv(): string[] {
  const raw = process.env.NEXT_PUBLIC_PORTAL_INVITE_CODES || "";
  return raw
    .split(",")
    .map((code) => code.trim())
    .filter(Boolean);
}

export function isInviteRequired(): boolean {
  const value = (process.env.NEXT_PUBLIC_REQUIRE_INVITE_CODE || "true").toLowerCase();
  return value !== "false";
}

export function isInviteCodeValid(code: string): boolean {
  if (!isInviteRequired()) {
    return true;
  }

  const inviteCodes = getInviteCodesFromEnv();
  if (inviteCodes.length === 0) {
    return false;
  }

  return inviteCodes.includes(code.trim());
}

export function getAllowedDomainsFromEnv(): string[] {
  const raw = process.env.NEXT_PUBLIC_ALLOWED_EMAIL_DOMAINS || "";
  return raw
    .split(",")
    .map((domain) => domain.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowedEmailDomain(email: string): boolean {
  const allowedDomains = getAllowedDomainsFromEnv();
  if (allowedDomains.length === 0) {
    return true;
  }

  const atIndex = email.lastIndexOf("@");
  if (atIndex === -1) {
    return false;
  }

  const domain = email.slice(atIndex + 1).toLowerCase();
  return allowedDomains.includes(domain);
}

export function getApprovalStatusFromMetadata(metadata?: Record<string, unknown> | null): ApprovalStatus {
  const raw = typeof metadata?.approval_status === "string" ? metadata.approval_status.toLowerCase() : "approved";
  if (raw === "pending" || raw === "rejected") {
    return raw;
  }
  return "approved";
}

export function buildDeviceFingerprint(): string {
  if (typeof window === "undefined") {
    return "server";
  }

  const parts = [
    window.navigator.userAgent,
    window.navigator.language,
    window.navigator.platform,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  ];

  return btoa(parts.join("|"));
}
