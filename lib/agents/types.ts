/**
 * lib/agents/types.ts
 * Shared types for the background agent system.
 */

export type AgentStatus = "running" | "idle" | "error" | "alert";
export type ThreatLevel = "none" | "low" | "medium" | "high" | "critical";

export interface SweepCheck {
  name: string;
  passed: boolean;
  detail?: string;
}

export interface SweepReport {
  timestamp: number;
  checks: SweepCheck[];
  score: number; // 0–100
  autoFixed?: string[]; // descriptions of auto-remediated issues
}

export type ThreatType =
  | "xss_attempt"
  | "injection_attempt"
  | "rapid_requests"
  | "storage_tamper"
  | "suspicious_nav"
  | "csp_violation";

export interface ThreatEvent {
  type: ThreatType;
  severity: ThreatLevel;
  detail: string;
  /** Only the pathname — never log query params that may contain credentials */
  path: string;
  timestamp: number;
}

export interface AuditEntry {
  action: string;
  resource: string;
  outcome: "success" | "failure" | "warning";
  detail?: string;
  timestamp: number;
}

export interface AgentSystemState {
  sweep: {
    status: AgentStatus;
    lastRun: number | null;
    score: number;
    autoFixed: string[];
  };
  security: {
    status: AgentStatus;
    threatLevel: ThreatLevel;
    threatsBlocked: number;
  };
  encryption: {
    status: AgentStatus;
    keysActive: number;
  };
}
