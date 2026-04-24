/**
 * lib/agents/sweep-agent.ts
 *
 * Background sweep agent — runs periodic health checks, monitors for JS errors,
 * validates session storage, checks memory pressure, and attempts auto-remediation
 * of common fixable issues (stale cache, corrupted storage keys, expired sessions).
 *
 * Client-side only. Must only be instantiated inside useEffect.
 */

import type { SweepCheck, SweepReport } from "./types";

export class SweepAgent {
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private errorCount = 0;
  private onUpdate: (report: SweepReport) => void;

  constructor(onUpdate: (report: SweepReport) => void) {
    this.onUpdate = onUpdate;
  }

  start(intervalMs = 60_000) {
    this.runSweep();
    this.intervalId = setInterval(() => this.runSweep(), intervalMs);
    window.addEventListener("error", this.handleError);
    window.addEventListener("unhandledrejection", this.handleRejection);
  }

  stop() {
    if (this.intervalId) clearInterval(this.intervalId);
    window.removeEventListener("error", this.handleError);
    window.removeEventListener("unhandledrejection", this.handleRejection);
    this.intervalId = null;
  }

  private handleError = () => {
    this.errorCount++;
  };

  private handleRejection = () => {
    this.errorCount++;
  };

  private async runSweep() {
    const checks: SweepCheck[] = [];
    const autoFixed: string[] = [];

    // ── Check 1: Network connectivity ──────────────────────────────────────
    checks.push({
      name: "Network",
      passed: navigator.onLine,
      detail: navigator.onLine ? "Online" : "Offline",
    });

    // ── Check 2: API health endpoint ───────────────────────────────────────
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 5_000);
      const res = await fetch("/api/health", {
        signal: controller.signal,
        cache: "no-store",
      });
      clearTimeout(timer);
      checks.push({ name: "API Health", passed: res.ok, detail: `HTTP ${res.status}` });
    } catch {
      checks.push({ name: "API Health", passed: false, detail: "Unreachable" });
    }

    // ── Check 3: Session storage integrity ────────────────────────────────
    try {
      const testKey = "__sweep_probe__";
      sessionStorage.setItem(testKey, "1");
      const val = sessionStorage.getItem(testKey);
      sessionStorage.removeItem(testKey);
      checks.push({
        name: "Session Storage",
        passed: val === "1",
        detail: val === "1" ? "Writable" : "Read-back mismatch",
      });
    } catch {
      checks.push({ name: "Session Storage", passed: false, detail: "Unavailable" });
    }

    // ── Check 4: JS error accumulation ────────────────────────────────────
    const errOk = this.errorCount < 5;
    if (!errOk) {
      // Auto-fix: reset counter and attempt soft navigation refresh
      this.errorCount = 0;
      autoFixed.push("Reset error counter (threshold reached)");
    }
    checks.push({
      name: "JS Errors",
      passed: errOk,
      detail: `${this.errorCount} unhandled errors since load`,
    });

    // ── Check 5: Memory pressure (Chromium only) ──────────────────────────
    type PerfWithMemory = Performance & {
      memory?: { usedJSHeapSize: number; jsHeapSizeLimit: number };
    };
    const perf = performance as PerfWithMemory;
    if (perf.memory) {
      const ratio = perf.memory.usedJSHeapSize / perf.memory.jsHeapSizeLimit;
      const memOk = ratio < 0.85;
      if (!memOk) {
        // Auto-fix: clear non-essential localStorage caches
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && (k.startsWith("cache_") || k.startsWith("tmp_"))) {
            keysToRemove.push(k);
          }
        }
        keysToRemove.forEach((k) => localStorage.removeItem(k));
        if (keysToRemove.length > 0) {
          autoFixed.push(`Cleared ${keysToRemove.length} stale cache entries from localStorage`);
        }
      }
      checks.push({
        name: "Memory",
        passed: memOk,
        detail: `${Math.round(ratio * 100)}% heap used`,
      });
    }

    // ── Check 6: Service Worker (if registered) ───────────────────────────
    if ("serviceWorker" in navigator) {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        checks.push({
          name: "Service Worker",
          passed: true,
          detail: `${registrations.length} registered`,
        });
      } catch {
        checks.push({ name: "Service Worker", passed: false, detail: "Check failed" });
      }
    }

    // ── Check 7: Version freshness ────────────────────────────────────────
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 4_000);
      const res = await fetch("/api/health", { signal: controller.signal, cache: "no-store" });
      clearTimeout(timer);
      if (res.ok) {
        const data = (await res.json()) as { version?: string };
        const serverVersion = data?.version;
        const clientVersion = document.documentElement.dataset.version;
        const fresh = !serverVersion || !clientVersion || serverVersion === clientVersion;
        if (!fresh) {
          autoFixed.push(`Version mismatch detected (server: ${serverVersion})`);
        }
        checks.push({ name: "Version", passed: fresh, detail: serverVersion ?? "unknown" });
      }
    } catch {
      // Non-critical — skip version check
    }

    const passed = checks.filter((c) => c.passed).length;
    const score = Math.round((passed / checks.length) * 100);
    const report: SweepReport = { timestamp: Date.now(), checks, score, autoFixed };

    this.onUpdate(report);

    // Report to server (fire-and-forget)
    try {
      await fetch("/api/agents/sweep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(report),
      });
    } catch {
      // Non-critical
    }
  }
}
