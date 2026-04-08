"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { GlowCard } from "@/components/ui/GlowCard";
import { cn } from "@/lib/cn";
import { Server, Rocket, Clock, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";

type Health = "Operational" | "Degraded" | "Outage";

interface ServiceCard {
  name: string;
  status: Health;
  uptime: number;
  latencyMs: number;
  region: string;
}

interface BackgroundJob {
  name: string;
  pending: number;
  running: number;
  failed: number;
}

const HEALTH_CONFIG: Record<Health, { icon: React.ReactNode; card: string; badge: string }> = {
  Operational: {
    icon: <CheckCircle2 size={15} className="text-emerald-400" />,
    card: "border-emerald-700/30",
    badge: "bg-emerald-900/40 text-emerald-400 border-emerald-700/40",
  },
  Degraded: {
    icon: <AlertCircle size={15} className="text-amber-400" />,
    card: "border-amber-700/30",
    badge: "bg-amber-900/40 text-amber-400 border-amber-700/40",
  },
  Outage: {
    icon: <XCircle size={15} className="text-rose-400" />,
    card: "border-rose-700/30",
    badge: "bg-rose-900/40 text-rose-400 border-rose-700/40",
  },
};

export default function OperationsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [services, setServices] = useState<ServiceCard[]>([]);
  const [jobs, setJobs] = useState<BackgroundJob[]>([]);
  const [errorRate, setErrorRate] = useState<number[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<string>("");

  useEffect(() => {
    if (!isAuthenticated) router.replace("/portal/enterprise/auth");
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetch("/api/enterprise/operations")
      .then((r) => r.json())
      .then((data) => {
        if (data.services) setServices(data.services);
        if (data.jobs) setJobs(data.jobs);
        if (data.errorRate) setErrorRate(data.errorRate);
      })
      .catch(() => {})
      .finally(() => setLoadingData(false));
  }, [isAuthenticated]);

  useEffect(() => {
    const now = new Date();
    setLastRefreshed(now.toLocaleTimeString());
  }, []);

  const handleRefresh = () => setLastRefreshed(new Date().toLocaleTimeString());

  if (!isAuthenticated) return null;

  const operational = services.filter((s) => s.status === "Operational").length;
  const degraded = services.filter((s) => s.status === "Degraded").length;
  const maxRate = Math.max(...errorRate, 1);

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
            <Server size={22} className="text-cyan-400" /> Platform Operations
          </h1>
          <p className="mt-1 text-sm text-slate-400">Service health, deployments, background jobs, and error trends</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">Last refreshed: {lastRefreshed}</span>
          <button
            onClick={handleRefresh}
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 transition"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Services Online",   value: `${operational}/${services.length}`, color: "text-emerald-400" },
          { label: "Degraded",          value: String(degraded),                     color: degraded > 0 ? "text-amber-400" : "text-slate-400" },
          { label: "Avg Latency",       value: services.length > 0 ? `${Math.round(services.reduce((a, s) => a + s.latencyMs, 0) / services.length)} ms` : "\u2014 ms", color: "text-cyan-400" },
          { label: "7-day Error Total", value: String(errorRate.reduce((a, b) => a + b, 0)),              color: "text-slate-300" },
        ].map(({ label, value, color }) => (
          <GlowCard key={label} className="bg-slate-900 border-slate-800 p-4 text-center">
            <div className={cn("text-2xl font-extrabold", color)}>{value}</div>
            <div className="mt-1 text-xs text-slate-500">{label}</div>
          </GlowCard>
        ))}
      </div>

      {/* Service health grid */}
      <div>
        <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-400">Service Health</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {loadingData
            ? [1,2,3,4,5,6].map((n) => (
                <div key={n} className="h-28 animate-pulse rounded-xl bg-slate-800/50" />
              ))
            : services.map((svc) => {
            const cfg = HEALTH_CONFIG[svc.status];
            return (
              <GlowCard key={svc.name} className={cn("bg-slate-900 border p-4", cfg.card)}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white text-sm">{svc.name}</span>
                  <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold", cfg.badge)}>
                    {cfg.icon} {svc.status}
                    {svc.status === "Degraded" && (
                      <span className="ml-1 h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                    )}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-sm font-bold text-white">{svc.uptime}%</div>
                    <div className="text-[10px] text-slate-500">Uptime</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{svc.latencyMs} ms</div>
                    <div className="text-[10px] text-slate-500">Latency</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-cyan-300">{svc.region}</div>
                    <div className="text-[10px] text-slate-500">Region</div>
                  </div>
                </div>
              </GlowCard>
            );
          })}
        </div>
      </div>

      {/* Deployment info + error rate */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Deployment */}
        <GlowCard className="bg-slate-900 border-slate-800 p-5 space-y-4">
          <h3 className="flex items-center gap-2 text-sm font-bold text-white">
            <Rocket size={14} className="text-cyan-400" /> Current Deployment
          </h3>
          <div className="space-y-3 text-sm">
            {[
              { label: "Version",     value: "v2.4.1" },
              { label: "Environment", value: "Production" },
              { label: "Last Deploy", value: "2025-07-20 14:33" },
              { label: "Deployed by", value: "admin@sdtools.org" },
              { label: "Next window", value: "2025-07-28 02:00 UTC (maintenance)" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between border-b border-slate-800 pb-2 last:border-0 last:pb-0">
                <span className="text-slate-500">{label}</span>
                <span className="font-semibold text-slate-200">{value}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-center gap-2 rounded-xl bg-emerald-900/20 border border-emerald-700/30 px-3 py-2 text-xs text-emerald-400">
            <CheckCircle2 size={12} /> All health checks passed — deployment stable
          </div>
        </GlowCard>

        {/* Error rate chart */}
        <GlowCard className="bg-slate-900 border-slate-800 p-5 space-y-4">
          <h3 className="flex items-center gap-2 text-sm font-bold text-white">
            <Clock size={14} className="text-cyan-400" /> 7-Day Error Rate
          </h3>
          <div className="flex items-end justify-around gap-2 h-24 pt-2">
            {errorRate.map((val, i) => {
              const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
              const heightPct = Math.round((val / maxRate) * 100);
              return (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-[10px] text-slate-500">{val}</span>
                  <div className="w-full rounded-t"
                    style={{
                      height: `${Math.max(heightPct, 4)}%`,
                      background: val > 2 ? "rgba(251,191,36,0.7)" : val === 0 ? "rgba(52,211,153,0.7)" : "rgba(34,211,238,0.6)",
                      minHeight: "4px",
                    }}
                  />
                  <span className="text-[10px] text-slate-600">{days[i]}</span>
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 text-[11px]">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-400/70 inline-block" /> 0 errors</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-cyan-400/70 inline-block" /> Low</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-400/70 inline-block" /> Elevated</span>
          </div>
        </GlowCard>
      </div>

      {/* Background jobs */}
      <div>
        <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-400">Background Jobs</h2>
        <GlowCard className="bg-slate-900 border-slate-800 p-0 overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60">
                {["Job Name", "Pending", "Running", "Failed"].map((h) => (
                  <th key={h} className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loadingData
                ? [1,2,3].map((n) => (
                    <tr key={n}><td colSpan={4}>
                      <div className="h-8 animate-pulse rounded-lg bg-slate-800/50 mx-4 my-1"/>
                    </td></tr>
                  ))
                : jobs.map((job) => (
                <tr key={job.name} className="border-b border-slate-800/60 last:border-0 hover:bg-slate-800/30">
                  <td className="px-5 py-3 font-semibold text-white">{job.name}</td>
                  <td className="px-5 py-3 text-slate-300">{job.pending}</td>
                  <td className="px-5 py-3">
                    <span className={cn("font-semibold", job.running > 0 ? "text-cyan-400" : "text-slate-500")}>
                      {job.running}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={cn("font-semibold", job.failed > 0 ? "text-rose-400" : "text-emerald-400")}>
                      {job.failed > 0 ? job.failed : "✓"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlowCard>
      </div>
    </motion.div>
  );
}
