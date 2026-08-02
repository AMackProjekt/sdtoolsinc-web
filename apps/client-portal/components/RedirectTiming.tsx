"use client";

import { useEffect } from "react";

const STORAGE_KEY = "portal_redirect_start_ms";
const RESULT_KEY = "portal_redirect_result";

export function RedirectTiming({ portal }: { portal: string }) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    const startMs = Number(raw);
    if (Number.isNaN(startMs)) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }

    const durationMs = Date.now() - startMs;
    const result = {
      portal,
      durationMs,
      completedAt: new Date().toISOString(),
      url: window.location.href,
    };

    window.localStorage.setItem(RESULT_KEY, JSON.stringify(result));
    window.localStorage.removeItem(STORAGE_KEY);

    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.info("[Portal Redirect Timing]", result);
    }
  }, [portal]);

  return null;
}
