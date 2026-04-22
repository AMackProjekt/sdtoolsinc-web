/**
 * lib/agents/use-bg-agents.ts
 *
 * React hook that bootstraps all background agents (sweep + security + encryption)
 * and exposes live system state. Mount once near the top of the component tree.
 *
 * Must be used inside a client component.
 */

import { useEffect, useRef, useState } from "react";
import { SweepAgent } from "./sweep-agent";
import { SecurityAgent } from "./security-agent";
import { generateKey } from "./encryption-agent";
import type { AgentSystemState, SweepReport, ThreatEvent, ThreatLevel } from "./types";

const SWEEP_INTERVAL_MS = 60_000; // 1 minute

const DEFAULT_STATE: AgentSystemState = {
  sweep: { status: "idle", lastRun: null, score: 100, autoFixed: [] },
  security: { status: "idle", threatLevel: "none", threatsBlocked: 0 },
  encryption: { status: "idle", keysActive: 0 },
};

function maxSeverity(a: ThreatLevel, b: ThreatLevel): ThreatLevel {
  const order: ThreatLevel[] = ["none", "low", "medium", "high", "critical"];
  return order.indexOf(a) >= order.indexOf(b) ? a : b;
}

export function useBgAgents() {
  const [state, setState] = useState<AgentSystemState>(DEFAULT_STATE);
  const sweepRef = useRef<SweepAgent | null>(null);
  const securityRef = useRef<SecurityAgent | null>(null);

  useEffect(() => {
    // ── Boot encryption agent ────────────────────────────────────────────
    setState((s) => ({ ...s, encryption: { status: "running", keysActive: 0 } }));
    generateKey()
      .then(() => {
        setState((s) => ({
          ...s,
          encryption: { status: "running", keysActive: 1 },
        }));
      })
      .catch(() => {
        setState((s) => ({
          ...s,
          encryption: { status: "error", keysActive: 0 },
        }));
      });

    // ── Boot sweep agent ─────────────────────────────────────────────────
    const sweepAgent = new SweepAgent((report: SweepReport) => {
      setState((s) => ({
        ...s,
        sweep: {
          status: report.score >= 80 ? "running" : report.score >= 50 ? "idle" : "error",
          lastRun: report.timestamp,
          score: report.score,
          autoFixed: report.autoFixed ?? [],
        },
      }));
    });
    sweepRef.current = sweepAgent;
    setState((s) => ({ ...s, sweep: { ...s.sweep, status: "running" } }));
    sweepAgent.start(SWEEP_INTERVAL_MS);

    // ── Boot security agent ──────────────────────────────────────────────
    const securityAgent = new SecurityAgent((threat: ThreatEvent) => {
      setState((s) => ({
        ...s,
        security: {
          status: "alert",
          threatLevel: maxSeverity(s.security.threatLevel, threat.severity),
          threatsBlocked: s.security.threatsBlocked + 1,
        },
      }));
      // After 30s without new threats, downgrade alert to idle
      setTimeout(() => {
        setState((s) => {
          if (s.security.status === "alert") {
            return { ...s, security: { ...s.security, status: "idle" } };
          }
          return s;
        });
      }, 30_000);
    });
    securityRef.current = securityAgent;
    setState((s) => ({ ...s, security: { ...s.security, status: "running" } }));
    securityAgent.start();

    return () => {
      sweepAgent.stop();
      securityAgent.stop();
    };
  }, []);

  return {
    state,
    /** Expose the security agent so components can call checkRateLimit / scanInput */
    securityAgent: securityRef.current,
  };
}
