"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { GlowCard } from "@/components/ui/GlowCard";
import { cn } from "@/lib/cn";
import { ShieldCheck, AlertTriangle, Info, Download, Search, Filter } from "lucide-react";
import { motion } from "framer-motion";

type Severity = "info" | "warning" | "error";

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  ip: string;
  severity: Severity;
}


const SEV_STYLES: Record<Severity, string> = {
  info:    "bg-sky-900/40 text-sky-400 border-sky-700/40",
  warning: "bg-amber-900/40 text-amber-400 border-amber-700/40",
  error:   "bg-rose-900/40 text-rose-400 border-rose-700/40",
};

const SEV_ICON: Record<Severity, React.ReactNode> = {
  info:    <Info size={11} />,
  warning: <AlertTriangle size={11} />,
  error:   <AlertTriangle size={11} />,
};

export default function AuditPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState<"all" | Severity>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) router.replace("/portal/enterprise/auth");
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetch("/api/enterprise/audit?limit=50")
      .then((r) => r.json())
      .then((data) => { if (data.logs) setLogs(data.logs as AuditLog[]); })
      .catch(() => {})
      .finally(() => setLoadingData(false));
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  const filtered = useMemo(() => {
    return logs.filter((log) => {
      const matchQ = !query || log.user.includes(query) || log.action.includes(query.toUpperCase()) || log.resource.includes(query);
      const matchSev = severityFilter === "all" || log.severity === severityFilter;
      const matchFrom = !dateFrom || log.timestamp >= dateFrom;
      const matchTo = !dateTo || log.timestamp <= dateTo + " 23:59:59";
      return matchQ && matchSev && matchFrom && matchTo;
    });
  }, [query, severityFilter, dateFrom, dateTo, logs]);

  const handleExport = () => {
    const header = "ID,Timestamp,User,Action,Resource,IP,Severity";
    const rows = filtered.map((l) => `${l.id},${l.timestamp},${l.user},${l.action},${l.resource},${l.ip},${l.severity}`);
    const csv = [header, ...rows].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url; a.download = "audit-log.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-white">
            <ShieldCheck size={22} className="text-cyan-400" /> Audit & Governance
          </h1>
          <p className="mt-1 text-sm text-slate-400">Full activity log for compliance, security review, and incident investigation</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 rounded-xl bg-cyan-900/40 border border-cyan-700/40 px-4 py-2.5 text-sm font-semibold text-cyan-400 hover:bg-cyan-900/60 transition"
        >
          <Download size={15} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <GlowCard className="bg-slate-900 border-slate-800 p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[180px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search user, action, resource…"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-9 pr-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={13} className="text-slate-500" />
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as "all" | Severity)}
              className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-500/50 cursor-pointer"
            >
              <option value="all">All levels</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-500/50"
          />
          <span className="text-slate-600 text-sm">—</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-500/50"
          />
          <span className="text-xs text-slate-500">{filtered.length} of {logs.length} entries</span>
        </div>
      </GlowCard>

      {/* Log table */}
      <GlowCard className="bg-slate-900 border-slate-800 p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60">
                {["Severity", "Timestamp", "User", "Action", "Resource", "IP"].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-widest text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loadingData ? (
                [1, 2, 3, 4].map((n) => (
                  <tr key={n}>
                    <td colSpan={6}>
                      <div className="h-8 animate-pulse rounded-lg bg-slate-800/50 mx-4 my-1" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-500">
                    No log entries match your filters
                  </td>
                </tr>
              ) : (
                filtered.map((log) => (
                  <tr key={log.id} className="border-b border-slate-800/60 hover:bg-slate-800/30 transition">
                    <td className="px-4 py-3">
                      <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold", SEV_STYLES[log.severity])}>
                        {SEV_ICON[log.severity]} {log.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs font-mono whitespace-nowrap">{log.timestamp}</td>
                    <td className="px-4 py-3 text-slate-300 text-xs">{log.user}</td>
                    <td className="px-4 py-3 font-mono text-cyan-300 text-xs">{log.action}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs max-w-[180px] truncate">{log.resource}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs font-mono">{log.ip}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlowCard>

      {/* Compliance status cards */}
      <div>
        <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-400">Compliance Status</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { name: "HIPAA", score: 98, status: "Compliant",     color: "emerald" },
            { name: "SOC 2",  score: 94, status: "Compliant",     color: "emerald" },
            { name: "GDPR",   score: 71, status: "In Progress",   color: "amber"   },
          ].map(({ name, score, status, color }) => (
            <GlowCard key={name} className="bg-slate-900 border-slate-800 p-5 text-center">
              <div className={cn("mb-2 text-3xl font-extrabold", color === "emerald" ? "text-emerald-400" : "text-amber-400")}>
                {score}%
              </div>
              <p className="font-bold text-white">{name}</p>
              <span className={cn(
                "mt-2 inline-block rounded-full border px-3 py-0.5 text-xs font-semibold",
                color === "emerald"
                  ? "bg-emerald-900/40 text-emerald-400 border-emerald-700/40"
                  : "bg-amber-900/40 text-amber-400 border-amber-700/40"
              )}>
                {status}
              </span>
            </GlowCard>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
