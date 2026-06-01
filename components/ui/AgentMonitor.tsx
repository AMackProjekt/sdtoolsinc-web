"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { shouldShowAgents } from "@/lib/agents/visibility";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, ChevronDown, ChevronUp, Power, RefreshCw } from "lucide-react";
import { GlowCard } from "@/components/ui/GlowCard";

interface Agent {
  id: string;
  name: string;
  type: "scheduled" | "event";
  enabled: boolean;
  status: "running" | "idle" | "paused" | "error";
  progress?: number;
  nextRun?: Date;
  lastRun?: Date;
  tasksCompleted: number;
}

const INITIAL_AGENTS: Agent[] = [
  {
    id: "1",
    name: "Case Review Agent",
    type: "scheduled",
    enabled: true,
    status: "running",
    progress: 62,
    nextRun: new Date(Date.now() + 12 * 60 * 1000),
    lastRun: new Date(Date.now() - 4 * 60 * 60 * 1000),
    tasksCompleted: 148,
  },
  {
    id: "2",
    name: "Follow-up Reminder",
    type: "event",
    enabled: true,
    status: "idle",
    nextRun: new Date(Date.now() + 45 * 60 * 1000),
    lastRun: new Date(Date.now() - 1 * 60 * 60 * 1000),
    tasksCompleted: 312,
  },
  {
    id: "3",
    name: "Risk Assessment AI",
    type: "scheduled",
    enabled: true,
    status: "running",
    progress: 35,
    nextRun: new Date(Date.now() + 30 * 60 * 1000),
    lastRun: new Date(Date.now() - 6 * 60 * 60 * 1000),
    tasksCompleted: 89,
  },
  {
    id: "4",
    name: "Report Generator",
    type: "scheduled",
    enabled: false,
    status: "paused",
    lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000),
    tasksCompleted: 56,
  },
  {
    id: "5",
    name: "Intake Processor",
    type: "event",
    enabled: true,
    status: "idle",
    nextRun: new Date(Date.now() + 5 * 60 * 1000),
    lastRun: new Date(Date.now() - 30 * 60 * 1000),
    tasksCompleted: 203,
  },
  {
    id: "6",
    name: "Sweep & Audit Agent",
    type: "scheduled",
    enabled: true,
    status: "running",
    progress: 0,
    nextRun: new Date(Date.now() + 60 * 1000),
    lastRun: new Date(Date.now() - 2 * 60 * 1000),
    tasksCompleted: 0,
  },
  {
    id: "7",
    name: "Security Defense Agent",
    type: "event",
    enabled: true,
    status: "running",
    nextRun: new Date(Date.now() + 1 * 1000),
    lastRun: new Date(Date.now() - 1 * 60 * 1000),
    tasksCompleted: 0,
  },
  {
    id: "8",
    name: "Encryption Agent",
    type: "event",
    enabled: true,
    status: "running",
    nextRun: new Date(Date.now() + 1 * 1000),
    lastRun: new Date(Date.now()),
    tasksCompleted: 0,
  },
];

function formatNextRun(date?: Date): string {
  if (!date) return "—";
  const diff = date.getTime() - Date.now();
  if (diff <= 0) return "now";
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ${mins % 60}m`;
}

function formatLastRun(date?: Date): string {
  if (!date) return "never";
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const STATUS_CONFIG = {
  running: { dot: "bg-emerald-400 animate-pulse", label: "Running", text: "text-emerald-400" },
  idle: { dot: "bg-slate-400", label: "Idle", text: "text-slate-400" },
  paused: { dot: "bg-amber-400", label: "Paused", text: "text-amber-400" },
  error: { dot: "bg-rose-400 animate-pulse", label: "Error", text: "text-rose-400" },
};

export function AgentMonitor() {
  const pathname = usePathname() ?? "";
  if (!shouldShowAgents(pathname)) return null;

  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Simulate live progress ticks
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents((prev) =>
        prev.map((a) => {
          if (a.status !== "running" || a.progress == null) return a;
          const next = (a.progress + Math.floor(Math.random() * 4 + 1)) % 100;
          return { ...a, progress: next };
        })
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  function toggleAgent(id: string) {
    setAgents((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, enabled: !a.enabled, status: a.enabled ? "paused" : "idle" }
          : a
      )
    );
  }

  function handleRefresh() {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }

  const activeCount = agents.filter((a) => a.status === "running").length;
  const totalTasks = agents.reduce((s, a) => s + a.tasksCompleted, 0);

  return (
    <GlowCard className="p-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-500/15 flex items-center justify-center">
            <Bot className="w-4 h-4 text-sky-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Agent Monitor</h3>
            <p className="text-[11px] text-slate-400">
              {activeCount} active · {totalTasks.toLocaleString()} tasks completed
            </p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
          aria-label="Refresh agents"
        >
          <motion.div animate={refreshing ? { rotate: 360 } : {}} transition={{ duration: 0.8 }}>
            <RefreshCw className="w-4 h-4" />
          </motion.div>
        </button>
      </div>

      {/* Agent List */}
      <div className="divide-y divide-slate-700/30">
        {agents.map((agent) => {
          const cfg = STATUS_CONFIG[agent.status];
          const isExpanded = expanded === agent.id;

          return (
            <div key={agent.id} className="px-5 py-3">
              <div className="flex items-center gap-3">
                {/* Status dot */}
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />

                {/* Name + type badge */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white truncate">{agent.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700/60 text-slate-400 flex-shrink-0">
                      {agent.type}
                    </span>
                  </div>
                  {/* Progress bar */}
                  {agent.status === "running" && agent.progress != null && (
                    <div className="mt-1.5 h-1 bg-slate-700 rounded-full overflow-hidden w-full">
                      <motion.div
                        className="h-full bg-gradient-to-r from-sky-500 to-emerald-400 rounded-full"
                        animate={{ width: `${agent.progress}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                  )}
                </div>

                {/* Next run */}
                <div className="hidden sm:block text-right flex-shrink-0 mr-2">
                  <p className="text-[10px] text-slate-500">Next run</p>
                  <p className="text-xs text-slate-300">{formatNextRun(agent.nextRun)}</p>
                </div>

                {/* Toggle */}
                <button
                  onClick={() => toggleAgent(agent.id)}
                  className={`flex-shrink-0 p-1.5 rounded-lg transition-colors ${
                    agent.enabled
                      ? "text-sky-400 bg-sky-500/10 hover:bg-sky-500/20"
                      : "text-slate-500 bg-slate-700/40 hover:bg-slate-700/70"
                  }`}
                  aria-label={`${agent.enabled ? "Disable" : "Enable"} ${agent.name}`}
                >
                  <Power className="w-3.5 h-3.5" />
                </button>

                {/* Expand */}
                <button
                  onClick={() => setExpanded((v) => (v === agent.id ? null : agent.id))}
                  className="flex-shrink-0 p-1 text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label="Toggle details"
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {/* Expanded details */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 pt-3 border-t border-slate-700/40 grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-800/50 rounded-lg p-2.5">
                        <p className="text-slate-500 mb-0.5">Status</p>
                        <p className={`font-medium ${cfg.text}`}>{cfg.label}</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-2.5">
                        <p className="text-slate-500 mb-0.5">Last run</p>
                        <p className="text-slate-200 font-medium">{formatLastRun(agent.lastRun)}</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-2.5">
                        <p className="text-slate-500 mb-0.5">Tasks done</p>
                        <p className="text-slate-200 font-medium">{agent.tasksCompleted}</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-2.5">
                        <p className="text-slate-500 mb-0.5">Trigger</p>
                        <p className="text-slate-200 font-medium capitalize">{agent.type}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </GlowCard>
  );
}
