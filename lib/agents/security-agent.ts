/**
 * lib/agents/security-agent.ts
 *
 * Client-side security agent — detects XSS/injection attempts in URLs and storage,
 * enforces client-side rate limiting, monitors CSP violations, and reports threats
 * to the server without leaking sensitive user data.
 *
 * Client-side only. Must only be instantiated inside useEffect.
 */

import type { ThreatEvent, ThreatLevel, ThreatType } from "./types";

/** Patterns that indicate injection or XSS attempts */
const INJECTION_PATTERNS: RegExp[] = [
  /<script[\s>]/i,
  /javascript:/i,
  /vbscript:/i,
  /on\w+\s*=\s*["'`{]/i,
  /union\s+select/i,
  /'\s*(or|and)\s*'?\s*\d/i,
  /--\s*$/,
  /;\s*drop\s+table/i,
  /\.\.\//,
  /%3cscript/i,
  /%27\s*(or|and)/i,
  /data:text\/html/i,
  /srcdoc\s*=/i,
];

export class SecurityAgent {
  private threatsBlocked = 0;
  private requestTimestamps: number[] = [];
  private onThreat: (event: ThreatEvent) => void;
  private storageListener: ((e: StorageEvent) => void) | null = null;
  private cspListener: ((e: SecurityPolicyViolationEvent) => void) | null = null;
  private originalPushState: typeof history.pushState | null = null;
  private originalReplaceState: typeof history.replaceState | null = null;

  constructor(onThreat: (event: ThreatEvent) => void) {
    this.onThreat = onThreat;
  }

  start() {
    this.scanCurrentUrl();
    this.monitorNavigation();
    this.monitorStorage();
    this.monitorCSP();
  }

  stop() {
    if (this.storageListener) {
      window.removeEventListener("storage", this.storageListener);
    }
    if (this.cspListener) {
      document.removeEventListener("securitypolicyviolation", this.cspListener);
    }
    // Restore original history methods
    if (this.originalPushState) history.pushState = this.originalPushState;
    if (this.originalReplaceState) history.replaceState = this.originalReplaceState;
  }

  get blockedCount() {
    return this.threatsBlocked;
  }

  /**
   * Check client-side rate limit before making an API request.
   * Returns false if the limit is exceeded — caller should abort the request.
   */
  checkRateLimit(maxPerMinute = 120): boolean {
    const now = Date.now();
    this.requestTimestamps = this.requestTimestamps.filter((t) => now - t < 60_000);
    if (this.requestTimestamps.length >= maxPerMinute) {
      this.report("rapid_requests", "high", "Client-side rate limit exceeded");
      return false;
    }
    this.requestTimestamps.push(now);
    return true;
  }

  /** Scan a user-supplied string for injection patterns. Returns threat level. */
  scanInput(value: string): ThreatLevel {
    for (const pattern of INJECTION_PATTERNS) {
      if (pattern.test(value)) return "high";
    }
    return "none";
  }

  // ── Private ──────────────────────────────────────────────────────────────

  private scanCurrentUrl() {
    try {
      const decoded = decodeURIComponent(window.location.href);
      for (const pattern of INJECTION_PATTERNS) {
        if (pattern.test(decoded)) {
          this.report("xss_attempt", "high", "Injection pattern detected in URL");
          break;
        }
      }
    } catch {
      // Invalid URI encoding — flag as suspicious
      this.report("xss_attempt", "medium", "URL contains malformed percent-encoding");
    }
  }

  private monitorNavigation() {
    const scanUrl = (url: string | URL | null | undefined) => {
      if (!url) return;
      try {
        const str = decodeURIComponent(url.toString());
        for (const pattern of INJECTION_PATTERNS) {
          if (pattern.test(str)) {
            this.report("suspicious_nav", "medium", "Suspicious target in navigation call");
            break;
          }
        }
      } catch {
        this.report("suspicious_nav", "low", "Navigation to malformed URL");
      }
    };

    this.originalPushState = history.pushState.bind(history);
    this.originalReplaceState = history.replaceState.bind(history);

    const originalPushState = this.originalPushState;
    const originalReplaceState = this.originalReplaceState;

    history.pushState = (...args) => {
      scanUrl(args[2]);
      return originalPushState!(...args);
    };
    history.replaceState = (...args) => {
      scanUrl(args[2]);
      return originalReplaceState!(...args);
    };
  }

  private monitorStorage() {
    this.storageListener = (e: StorageEvent) => {
      if (!e.key || !e.newValue) return;
      const level = this.scanInput(e.newValue);
      if (level !== "none") {
        this.report("storage_tamper", level, "Suspicious value written to browser storage");
      }
    };
    window.addEventListener("storage", this.storageListener);
  }

  private monitorCSP() {
    this.cspListener = (e: SecurityPolicyViolationEvent) => {
      this.report(
        "csp_violation",
        "medium",
        `CSP violated: ${e.violatedDirective} — blocked URI: ${e.blockedURI}`
      );
    };
    document.addEventListener("securitypolicyviolation", this.cspListener);
  }

  private report(type: ThreatType, severity: ThreatLevel, detail: string) {
    this.threatsBlocked++;
    const event: ThreatEvent = {
      type,
      severity,
      detail,
      // Use only the pathname — never include query params that may contain credentials
      path: window.location.pathname,
      timestamp: Date.now(),
    };
    this.onThreat(event);

    // Report to server (fire-and-forget, non-blocking)
    fetch("/api/agents/security", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    }).catch(() => {});
  }
}
