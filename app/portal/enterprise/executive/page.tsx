"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { GlowCard } from "@/components/ui/GlowCard";
import { cn } from "@/lib/cn";
import { BarChart3, Users, TrendingUp, FileDown, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const ENROLLMENT_TREND = [
  { month: "Jan", value: 18 },
  { month: "Feb", value: 22 },
  { month: "Mar", value: 30 },
  { month: "Apr", value: 27 },
  { month: "May", value: 40 },
  { month: "Jun", value: 36 },
  { month: "Jul", value: 47 },
];

const PORTAL_USAGE = [
  { name: "Participant Portal", pct: 68, color: "bg-teal-500" },
  { name: "Staff Portal",       pct: 24, color: "bg-sky-500" },
  { name: "Admin Portal",       pct: 8,  color: "bg-violet-500" },
];

const maxEnroll = Math.max(...ENROLLMENT_TREND.map((e) => e.value));

export default function ExecutivePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [exporting, setExporting] = useState(false);
  const [exportDone, setExportDone] = useState(false);
  const [metrics, setMetrics] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isAuthenticated) router.replace("/portal/enterprise/auth");
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetch("/api/enterprise/metrics")
      .then((r) => r.json())
      .then((data) => { if (data.metrics) setMetrics(data.metrics); })
      .catch(() => {});
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  const handleExport = () => {
    setExporting(true);
    setExportDone(false);
    setTimeout(() => {
      setExporting(false);
      setExportDone(true);
      setTimeout(() => setExportDone(false), 3000);
    }, 2000);
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
            <BarChart3 size={22} className="text-cyan-400" /> Executive Command
          </h1>
          <p className="mt-1 text-sm text-slate-400">High-level KPIs, program performance, and resource utilization</p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-2 rounded-xl bg-cyan-900/40 border border-cyan-700/40 px-4 py-2.5 text-sm font-semibold text-cyan-400 hover:bg-cyan-900/60 disabled:opacity-60 transition"
        >
          {exporting ? <><Loader2 size={14} className="animate-spin" /> Generating…</> : exportDone ? "✓ Report Ready" : <><FileDown size={14} /> Export PDF Report</>}
        </button>
      </div>

      {/* KPI Scorecards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Monthly Active Users", value: metrics.activeUsers      ?? "247",  sub: "↑ 18% vs last month",  color: "text-cyan-400"    },
          { label: "Program Completions",  value: metrics.completionRate   ?? "89%",  sub: "↑ 4 pts vs last month", color: "text-emerald-400" },
          { label: "Staff Efficiency",     value: metrics.staffEfficiency  ?? "91%",  sub: "Task completion rate",  color: "text-sky-400"     },
          { label: "Grant Utilization",    value: metrics.grantUtilization ?? "$84K", sub: "of $100K allocated",    color: "text-violet-400"  },
        ].map(({ label, value, sub, color }) => (
          <GlowCard key={label} className="bg-slate-900 border-slate-800 p-5">
            <div className={cn("text-3xl font-extrabold", color)}>{value}</div>
            <div className="mt-1 text-sm font-semibold text-white">{label}</div>
            <div className="mt-1 text-xs text-slate-500">{sub}</div>
          </GlowCard>
        ))}
      </div>

      {/* Enrollment trend + Portal usage */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly enrollment bar chart */}
        <GlowCard className="bg-slate-900 border-slate-800 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={14} className="text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Monthly New Enrollments</h3>
          </div>
          <div className="flex items-end justify-around gap-2 h-32">
            {ENROLLMENT_TREND.map(({ month, value }) => {
              const h = Math.round((value / maxEnroll) * 100);
              return (
                <div key={month} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-[10px] font-semibold text-slate-400">{value}</span>
                  <motion.div
                    initial={{ height: "0%" }}
                    animate={{ height: `${Math.max(h, 4)}%` }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
                    className="w-full rounded-t bg-gradient-to-t from-cyan-600 to-cyan-400/70"
                    style={{ minHeight: "4px" }}
                  />
                  <span className="text-[10px] text-slate-600">{month}</span>
                </div>
              );
            })}
          </div>
        </GlowCard>

        {/* Portal usage breakdown */}
        <GlowCard className="bg-slate-900 border-slate-800 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Users size={14} className="text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Portal Usage Breakdown</h3>
          </div>
          <div className="space-y-4 pt-2">
            {PORTAL_USAGE.map(({ name, pct, color }) => (
              <div key={name} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">{name}</span>
                  <span className="font-bold text-white">{pct}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                    className={cn("h-full rounded-full", color)}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 pt-1">Based on sessions in the last 30 days (n=1,840)</p>
        </GlowCard>
      </div>

      {/* Program summary table */}
      <div>
        <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-400">Program Summary</h2>
        <GlowCard className="bg-slate-900 border-slate-800 p-0 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60">
                {["Program", "Enrolled", "Completed", "Avg Score", "Status"].map((h) => (
                  <th key={h} className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Re-Entry Fundamentals",   enrolled: 84,  completed: 71,  score: "88%",  status: "Active" },
                { name: "Workforce Readiness",      enrolled: 62,  completed: 58,  score: "91%",  status: "Active" },
                { name: "Financial Literacy",       enrolled: 49,  completed: 39,  score: "84%",  status: "Active" },
                { name: "Digital Skills Bootcamp",  enrolled: 31,  completed: 18,  score: "79%",  status: "Active" },
                { name: "Housing Navigation",       enrolled: 21,  completed: 21,  score: "96%",  status: "Completed" },
              ].map((row, i) => (
                <tr key={i} className="border-b border-slate-800/60 last:border-0 hover:bg-slate-800/30">
                  <td className="px-5 py-3 font-semibold text-white">{row.name}</td>
                  <td className="px-5 py-3 text-slate-300">{row.enrolled}</td>
                  <td className="px-5 py-3 text-slate-300">{row.completed}</td>
                  <td className="px-5 py-3 text-cyan-400 font-semibold">{row.score}</td>
                  <td className="px-5 py-3">
                    <span className={cn(
                      "rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                      row.status === "Active"
                        ? "bg-emerald-900/40 text-emerald-400 border-emerald-700/40"
                        : "bg-slate-800 text-slate-400 border-slate-700"
                    )}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlowCard>
      </div>

      {/* Resource utilization */}
      <div>
        <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-400">Resource Utilization</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "Storage",  used: 68,  total: "100 GB",  color: "bg-cyan-500"   },
            { label: "API Calls", used: 43, total: "50K/day",  color: "bg-violet-500" },
            { label: "Compute",  used: 31,  total: "4 vCPU",   color: "bg-sky-500"    },
          ].map(({ label, used, total, color }) => (
            <GlowCard key={label} className="bg-slate-900 border-slate-800 p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-white">{label}</span>
                <span className="text-slate-400 text-xs">{used}% of {total}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: `${used}%` }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className={cn("h-full rounded-full", color)}
                />
              </div>
            </GlowCard>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
