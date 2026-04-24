"use client";

/**
 * components/ui/BgAgentStatus.tsx
 *
 * Minimal floating status indicator that boots all background agents and
 * shows a live status badge in the bottom-right corner of any portal page.
 * Expands on click to show sweep score, security status, and encryption state.
 */

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ChevronDown, ChevronUp, Activity, Lock, RefreshCw, AlertTriangle } from "lucide-react";
import { useBgAgents } from "@/lib/agents/use-bg-agents";
import type { AgentSystemState } from "@/lib/agents/types";
import { cn } from "@/lib/cn";

// ── Helper: derive an overall status colour from all agent states ─────────────
function systemColor(state: AgentSystemState): string {
  if (
    state.security.status === "alert" ||
    state.security.threatLevel === "high" ||
    state.security.threatLevel === "critical"
  )
    return "text-rose-400";
  if (state.sweep.score < 60 || state.sweep.status === "error") return "text-amber-400";
  if (state.security.threatLevel === "medium") return "text-amber-400";
  return "text-emerald-400";
}

function systemBg(state: AgentSystemState): string {
  if (
    state.security.status === "alert" ||
    state.security.threatLevel === "high" ||
    state.security.threatLevel === "critical"
  )
    return "bg-rose-500/10 border-rose-500/30";
  if (state.sweep.score < 60 || state.sweep.status === "error")
    return "bg-amber-500/10 border-amber-500/30";
  return "bg-emerald-500/10 border-emerald-500/30";
}

const THREAT_COLORS: Record<string, string> = {
  none: "text-emerald-400",
  low: "text-sky-400",
  medium: "text-amber-400",
  high: "text-rose-400",
  critical: "text-red-400",
};

export function BgAgentStatus() {
  const pathname = usePathname();
  const isProtectedRoute =
    pathname.startsWith("/portal") ||
    pathname.startsWith("/demo") ||
    pathname.startsWith("/dashboard");
  const { state } = useBgAgents();
  const [open, setOpen] = useState(false);
  const color = systemColor(state);
  const bg = systemBg(state);

  if (!isProtectedRoute) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-1.5">
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="mb-1 w-72 rounded-xl border border-slate-700/60 bg-slate-900/95 backdrop-blur-xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-2 border-b border-slate-700/40 px-4 py-3">
              <Shield size={14} className={color} />
              <span className="text-xs font-semibold text-white">Background Agents</span>
              <span
                className={cn(
                  "ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                  state.security.status === "alert"
                    ? "bg-rose-500/20 text-rose-400"
                    : "bg-emerald-500/20 text-emerald-400",
                )}
              >
                {state.security.status === "alert" ? "ALERT" : "SECURE"}
              </span>
            </div>

            <div className="divide-y divide-slate-800/60">
              {/* Sweep Agent */}
              <div className="flex items-start gap-3 px-4 py-3">
                <Activity size={13} className={state.sweep.status === "error" ? "text-rose-400" : "text-sky-400"} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-200">Sweep Agent</span>
                    <span className="text-[10px] text-slate-400 tabular-nums">
                      {state.sweep.score}/100
                    </span>
                  </div>
                  {/* Score bar */}
                  <div className="mt-1.5 h-1 w-full rounded-full bg-slate-700">
                    <motion.div
                      className={cn(
                        "h-full rounded-full",
                        state.sweep.score >= 80
                          ? "bg-emerald-400"
                          : state.sweep.score >= 50
                          ? "bg-amber-400"
                          : "bg-rose-400",
                      )}
                      animate={{ width: `${state.sweep.score}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                  <p className="mt-1 text-[10px] text-slate-500">
                    {state.sweep.lastRun
                      ? `Last sweep ${Math.round((Date.now() - state.sweep.lastRun) / 1000)}s ago`
                      : "Pending first sweep…"}
                  </p>
                  {state.sweep.autoFixed.length > 0 && (
                    <div className="mt-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-1">
                      <p className="text-[10px] text-emerald-400 font-medium">
                        Auto-fixed: {state.sweep.autoFixed[state.sweep.autoFixed.length - 1]}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Security Agent */}
              <div className="flex items-start gap-3 px-4 py-3">
                <AlertTriangle
                  size={13}
                  className={THREAT_COLORS[state.security.threatLevel] ?? "text-slate-400"}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-200">Security Agent</span>
                    <span
                      className={cn(
                        "text-[10px] font-semibold uppercase",
                        THREAT_COLORS[state.security.threatLevel] ?? "text-slate-400",
                      )}
                    >
                      {state.security.threatLevel}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[10px] text-slate-500">
                    {state.security.threatsBlocked} threat
                    {state.security.threatsBlocked !== 1 ? "s" : ""} blocked this session
                  </p>
                  <p className="text-[10px] text-slate-500">
                    XSS · injection · CSP · storage monitoring active
                  </p>
                </div>
              </div>

              {/* Encryption Agent */}
              <div className="flex items-start gap-3 px-4 py-3">
                <Lock
                  size={13}
                  className={
                    state.encryption.status === "error" ? "text-rose-400" : "text-violet-400"
                  }
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-200">Encryption Agent</span>
                    <span
                      className={cn(
                        "text-[10px] font-semibold uppercase",
                        state.encryption.status === "running"
                          ? "text-violet-400"
                          : state.encryption.status === "error"
                          ? "text-rose-400"
                          : "text-slate-500",
                      )}
                    >
                      {state.encryption.status}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[10px] text-slate-500">
                    AES-256-GCM · PBKDF2-SHA-256 · HMAC signing
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {state.encryption.keysActive} session key
                    {state.encryption.keysActive !== 1 ? "s" : ""} active
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold shadow-lg backdrop-blur-sm transition-colors",
          bg,
          color,
        )}
        aria-label="Toggle agent status panel"
      >
        {state.sweep.status === "running" ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          >
            <RefreshCw size={11} />
          </motion.div>
        ) : (
          <Shield size={11} />
        )}
        <span>Agents</span>
        {open ? <ChevronDown size={10} /> : <ChevronUp size={10} />}
      </motion.button>
    </div>
  );
}
