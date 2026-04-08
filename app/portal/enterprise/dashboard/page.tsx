"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { PortalStat, ActivityEntry } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { GlowCard } from "@/components/ui/GlowCard";
import { cn } from "@/lib/cn";
import {
  Users, Shield, CheckCircle, Activity, ArrowUpRight,
  Building2, UserCog, Layers, Key, ClipboardList, Settings,
  BarChart3, UserPlus, Newspaper, AlertTriangle, TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const QUICK_LINKS = [
  { label: "Identity & Access",    href: "/portal/enterprise/identity",     icon: UserCog,     color: "bg-cyan-900/40 text-cyan-400" },
  { label: "Organization",         href: "/portal/enterprise/organization", icon: Building2,   color: "bg-sky-900/40 text-sky-400" },
  { label: "Integrations",         href: "/portal/enterprise/integrations", icon: Layers,      color: "bg-indigo-900/40 text-indigo-400" },
  { label: "Audit & Governance",   href: "/portal/enterprise/audit",        icon: ClipboardList,color: "bg-violet-900/40 text-violet-400" },
  { label: "Platform Operations",  href: "/portal/enterprise/operations",   icon: Activity,    color: "bg-emerald-900/40 text-emerald-400" },
  { label: "Executive Command",    href: "/portal/enterprise/executive",    icon: BarChart3,   color: "bg-amber-900/40 text-amber-400" },
  { label: "HR Operations",        href: "/portal/enterprise/hr",           icon: UserPlus,    color: "bg-rose-900/40 text-rose-400" },
  { label: "Newsroom",             href: "/portal/enterprise/newsroom",     icon: Newspaper,   color: "bg-slate-800 text-slate-400" },
];

const TYPE_STYLES: Record<string, string> = {
  info:    "bg-cyan-900/40 text-cyan-300 border-cyan-800/50",
  warning: "bg-amber-900/40 text-amber-300 border-amber-800/50",
  error:   "bg-red-900/40 text-red-300 border-red-800/50",
};

export default function EnterpriseDashboardPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<PortalStat[]>([]);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) router.replace("/portal/enterprise/auth");
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetch("/api/enterprise/dashboard")
      .then((r) => r.json())
      .then((data) => {
        if (data.stats) setStats(data.stats);
        if (data.activity) setActivity(data.activity);
      })
      .catch(() => {})
      .finally(() => setLoadingData(false));
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  const totalPortalUsers = stats.reduce((sum, p) => sum + (typeof p.value === "number" ? p.value : 0), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Workspace Control
          </h1>
          <p className="mt-0.5 text-sm text-slate-400">
            Welcome back, {user?.name ?? "Administrator"} — global operations overview
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-900/50 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-800/40">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            All Systems Operational
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Portal Users", value: totalPortalUsers.toString(), icon: Users,      sub: "+12 this month",  color: "text-cyan-400",    bg: "bg-cyan-900/30" },
          { label: "Active Portals",      value: "3",                        icon: Shield,     sub: "All healthy",     color: "text-emerald-400", bg: "bg-emerald-900/30" },
          { label: "System Uptime",       value: "99.7%",                    icon: Activity,   sub: "Last 30 days",    color: "text-sky-400",     bg: "bg-sky-900/30" },
          { label: "Compliance Score",    value: "94 / 100",                 icon: CheckCircle,sub: "HIPAA + SOC2",    color: "text-violet-400",  bg: "bg-violet-900/30" },
        ].map(({ label, value, icon: Icon, sub, color, bg }) => (
          <GlowCard key={label} className="p-5 bg-slate-900 border-slate-800">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{label}</p>
                <p className="mt-2 text-2xl font-extrabold tracking-tight text-white">{value}</p>
                <p className="mt-1 text-xs text-slate-500">{sub}</p>
              </div>
              <div className={cn("rounded-xl p-2.5", bg)}>
                <Icon size={18} className={color} />
              </div>
            </div>
          </GlowCard>
        ))}
      </div>

      {/* Portal Status + Quick Links */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Portal Status */}
        <GlowCard className="bg-slate-900 border-slate-800 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-slate-400">
            <TrendingUp size={14} /> Portal Status
          </h2>
          <div className="space-y-3">
            {loadingData ? (
              [1, 2, 3].map((n) => (
                <div key={n} className="h-14 animate-pulse rounded-xl bg-slate-800/50" />
              ))
            ) : stats.length === 0 ? (
              <p className="text-sm text-slate-500">No portal data available.</p>
            ) : (
              stats.map((p) => (
                <Link key={p.label} href={"#"} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3 transition hover:border-slate-700">
                  <div className="flex items-center gap-3">
                    <Users size={15} className="text-slate-500" />
                    <span className="text-sm font-semibold text-slate-200">{p.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{p.value}</span>
                    <span className={cn("rounded-full border px-2 py-0.5 text-xs font-semibold", "bg-slate-800 border-slate-700 text-slate-300")}>
                      {p.trend != null ? (p.trend >= 0 ? `+${p.trend}%` : `${p.trend}%`) : "—"}
                    </span>
                    <ArrowUpRight size={13} className="text-slate-600" />
                  </div>
                </Link>
              ))
            )}
          </div>
        </GlowCard>

        {/* Quick Links */}
        <GlowCard className="bg-slate-900 border-slate-800 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-slate-400">
            <Settings size={14} /> Enterprise Modules
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {QUICK_LINKS.map(({ label, href, icon: Icon, color }) => (
              <Link
                key={label}
                href={href}
                className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-950/50 px-3 py-3 transition hover:border-slate-700 hover:bg-slate-900/80"
              >
                <div className={cn("rounded-lg p-1.5", color.split(" ")[0])}>
                  <Icon size={13} className={color.split(" ")[1]} />
                </div>
                <span className="text-xs font-semibold text-slate-300">{label}</span>
              </Link>
            ))}
          </div>
        </GlowCard>
      </div>

      {/* Recent Activity */}
      <GlowCard className="bg-slate-900 border-slate-800 p-6">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-slate-400">
          <Key size={14} /> Recent Activity
        </h2>
        <div className="space-y-2">
          {loadingData ? (
            [1, 2, 3, 4].map((n) => (
              <div key={n} className="h-12 animate-pulse rounded-xl bg-slate-800/50" />
            ))
          ) : activity.length === 0 ? (
            <p className="text-sm text-slate-500">No recent activity.</p>
          ) : (
            activity.map((item) => (
              <div key={item.id} className="flex items-center gap-3 rounded-xl border border-slate-800/60 bg-slate-950/40 px-4 py-3">
                {item.severity === "warning" && <AlertTriangle size={13} className="shrink-0 text-amber-400" />}
                {item.severity === "error"   && <AlertTriangle size={13} className="shrink-0 text-red-400" />}
                {item.severity === "info"    && <CheckCircle   size={13} className="shrink-0 text-cyan-400" />}
                <div className="flex flex-1 flex-wrap items-baseline justify-between gap-x-4">
                  <span className="text-sm text-slate-300">
                    <span className="font-semibold text-white">{item.user_name}</span>
                    {" — "}{item.action}
                  </span>
                  <span className="shrink-0 text-xs text-slate-600">{item.timestamp}</span>
                </div>
                <span className={cn("rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase", TYPE_STYLES[item.severity ?? "info"] ?? "")}>
                  {item.severity}
                </span>
              </div>
            ))
          )}
        </div>
      </GlowCard>
    </motion.div>
  );
}
