"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { GlowCard } from "@/components/ui/GlowCard";
import { cn } from "@/lib/cn";
import { motion } from "framer-motion";
import {
  KeyRound, Building2, DollarSign, Plug, ScrollText, Rocket, Shield,
  Briefcase, Globe, SlidersHorizontal, UserCog, Users, Activity,
  CheckCircle2, AlertTriangle, Clock, ChevronRight, Server,
  Mic2, Scale, MessageSquare, Calendar, Zap, TrendingUp, Lock,
} from "lucide-react";

const SECTIONS = [
  { href: "/portal/enterprise/identity",      label: "Identity & Access",      icon: KeyRound,          color: "text-cyan-400",    bg: "bg-cyan-950/40 border-cyan-800/30",    desc: "SSO, MFA, directory sync" },
  { href: "/portal/enterprise/organization",  label: "Organization & Tenant",  icon: Building2,         color: "text-sky-400",     bg: "bg-sky-950/40 border-sky-800/30",      desc: "Workspace config, branding" },
  { href: "/portal/enterprise/finance",       label: "Finance Division",       icon: DollarSign,        color: "text-emerald-400", bg: "bg-emerald-950/40 border-emerald-800/30", desc: "Budgets, billing, reports" },
  { href: "/portal/enterprise/integrations",  label: "Integration Hub",        icon: Plug,              color: "text-violet-400",  bg: "bg-violet-950/40 border-violet-800/30",  desc: "MackChat, Google, M365, apps" },
  { href: "/portal/enterprise/audit",         label: "Audit & Governance",     icon: ScrollText,        color: "text-amber-400",   bg: "bg-amber-950/40 border-amber-800/30",    desc: "Compliance logs, policies" },
  { href: "/portal/enterprise/operations",    label: "Platform Operations",    icon: Rocket,            color: "text-rose-400",    bg: "bg-rose-950/40 border-rose-800/30",      desc: "Deploy, incidents, uptime" },
  { href: "/portal/enterprise/executive",     label: "Executive Command",      icon: Shield,            color: "text-cyan-300",    bg: "bg-slate-900/60 border-cyan-900/30",     desc: "KPIs, strategic overview" },
  { href: "/portal/enterprise/hr",            label: "HR Operations",          icon: Briefcase,         color: "text-teal-400",    bg: "bg-teal-950/40 border-teal-800/30",      desc: "Workforce, onboarding" },
  { href: "/portal/enterprise/newsroom",      label: "News & Media Kit",       icon: Globe,             color: "text-indigo-400",  bg: "bg-indigo-950/40 border-indigo-800/30",  desc: "Press releases, assets" },
  { href: "/portal/enterprise/settings",      label: "Workspace Settings",     icon: SlidersHorizontal, color: "text-slate-300",   bg: "bg-slate-800/60 border-slate-700/30",    desc: "Config, policies, API keys" },
  { href: "/portal/voice",                    label: "Your Voice Is Heard",    icon: Mic2,              color: "text-pink-400",    bg: "bg-pink-950/40 border-pink-800/30",      desc: "Feedback, roadmap requests" },
  { href: "/portal/legal",                    label: "Legal & Compliance",     icon: Scale,             color: "text-orange-400",  bg: "bg-orange-950/40 border-orange-800/30",  desc: "Contracts, policies, DPA" },
];

const MANAGED_PORTALS = [
  { href: "/portal/admin/dashboard",       label: "Admin Portal",       icon: UserCog,   color: "text-sky-400",     status: "Online" },
  { href: "/portal/staff/dashboard",       label: "Staff Portal",       icon: Briefcase, color: "text-amber-400",   status: "Online" },
  { href: "/portal/participant/dashboard", label: "Participant Portal", icon: Users,     color: "text-emerald-400", status: "Online" },
];

const SYSTEM_HEALTH = [
  { label: "API Gateway",        status: "Operational", icon: Server,       color: "text-emerald-400" },
  { label: "Auth Service",       status: "Operational", icon: Lock,         color: "text-emerald-400" },
  { label: "MackChat",           status: "Operational", icon: MessageSquare, color: "text-emerald-400" },
  { label: "Calendar Sync",      status: "Operational", icon: Calendar,     color: "text-emerald-400" },
  { label: "Integration Bus",    status: "Operational", icon: Zap,          color: "text-emerald-400" },
  { label: "Analytics Pipeline", status: "Operational", icon: TrendingUp,   color: "text-emerald-400" },
];

const RECENT_EVENTS = [
  { time: "2 min ago",  event: "SSO login from enterprise.tools.inc",  type: "info" },
  { time: "14 min ago", event: "MFA policy enforced — 3 sessions",     type: "success" },
  { time: "27 min ago", event: "Google Workspace sync completed",       type: "success" },
  { time: "1 hr ago",   event: "Billing report generated — Q1",        type: "info" },
  { time: "3 hr ago",   event: "New staff member onboarded",           type: "success" },
  { time: "5 hr ago",   event: "Audit log export requested",           type: "info" },
];

const EVENT_STYLES = {
  info:    "text-sky-400",
  success: "text-emerald-400",
  warn:    "text-amber-400",
  error:   "text-rose-400",
};

const KPI_TILES = [
  { label: "Active Users",       value: "1,248",  sub: "+12 this week",      color: "text-cyan-400",    icon: Users },
  { label: "Integrations Live",  value: "24",     sub: "8 configured today", color: "text-violet-400",  icon: Plug },
  { label: "Policy Compliance",  value: "99.4%",  sub: "All portals",        color: "text-emerald-400", icon: Shield },
  { label: "Audit Events (24h)", value: "1,893",  sub: "0 critical",         color: "text-amber-400",   icon: ScrollText },
  { label: "Uptime (30d)",       value: "99.97%", sub: "All services",       color: "text-teal-400",    icon: Activity },
  { label: "Pending Actions",    value: "3",      sub: "Requires review",    color: "text-rose-400",    icon: AlertTriangle },
];

const fade = { hidden: { opacity: 0, y: 14 }, show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] } }) };

export default function WorkspaceControlPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [now, setNow] = useState("");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/portal/enterprise/auth");
      return;
    }
    const d = new Date();
    setNow(d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) + " · " + d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-8"
    >
      {/* Page header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-extrabold tracking-tight text-white">
            <Shield size={22} className="text-cyan-400" />
            Workspace Control
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Enterprise global command — every system, every portal, every policy.
          </p>
        </div>
        {now && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Clock size={12} />
            {now}
          </div>
        )}
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {KPI_TILES.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div key={kpi.label} custom={i} variants={fade} initial="hidden" animate="show">
              <GlowCard className="bg-slate-900 border-slate-800 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">{kpi.label}</span>
                  <Icon size={14} className={kpi.color} />
                </div>
                <p className={cn("mt-2 text-2xl font-extrabold tracking-tight", kpi.color)}>{kpi.value}</p>
                <p className="mt-0.5 text-[11px] text-slate-500">{kpi.sub}</p>
              </GlowCard>
            </motion.div>
          );
        })}
      </div>

      {/* Control sections grid + right panel */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">

        {/* Main: sections command grid */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Command Center</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SECTIONS.map((sec, i) => {
              const Icon = sec.icon;
              return (
                <motion.button
                  key={sec.href}
                  custom={i}
                  variants={fade}
                  initial="hidden"
                  animate="show"
                  onClick={() => router.push(sec.href)}
                  className={cn(
                    "group flex items-start gap-3.5 rounded-xl border p-4 text-left transition hover:brightness-110 active:scale-[0.98]",
                    sec.bg
                  )}
                >
                  <span className={cn("mt-0.5 shrink-0 rounded-lg bg-slate-900/70 p-2", sec.color)}>
                    <Icon size={16} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-white">{sec.label}</span>
                      <ChevronRight size={14} className="shrink-0 text-slate-600 group-hover:text-slate-400 transition" />
                    </div>
                    <p className="mt-0.5 text-[11px] text-slate-500">{sec.desc}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Right column: system health + portals + recent events */}
        <div className="space-y-5">

          {/* Managed portals */}
          <GlowCard className="bg-slate-900 border-slate-800 p-5">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Managed Portals</h3>
            <div className="space-y-2">
              {MANAGED_PORTALS.map((p) => {
                const Icon = p.icon;
                return (
                  <button
                    key={p.href}
                    onClick={() => router.push(p.href)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-slate-800"
                  >
                    <Icon size={15} className={p.color} />
                    <span className="flex-1 text-sm font-medium text-white">{p.label}</span>
                    <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      {p.status}
                    </span>
                  </button>
                );
              })}
            </div>
          </GlowCard>

          {/* System health */}
          <GlowCard className="bg-slate-900 border-slate-800 p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">System Health</h3>
              <span className="flex items-center gap-1 rounded-full bg-emerald-900/40 border border-emerald-700/40 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                <CheckCircle2 size={10} /> All Systems Go
              </span>
            </div>
            <div className="space-y-1.5">
              {SYSTEM_HEALTH.map((svc) => {
                const Icon = svc.icon;
                return (
                  <div key={svc.label} className="flex items-center gap-2.5 rounded-lg px-2 py-1.5">
                    <Icon size={13} className={svc.color} />
                    <span className="flex-1 text-xs text-slate-300">{svc.label}</span>
                    <span className="text-[11px] text-emerald-400">{svc.status}</span>
                  </div>
                );
              })}
            </div>
          </GlowCard>

          {/* Recent audit events */}
          <GlowCard className="bg-slate-900 border-slate-800 p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Recent Events</h3>
              <button
                onClick={() => router.push("/portal/enterprise/audit")}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 transition"
              >
                View all →
              </button>
            </div>
            <div className="space-y-2.5">
              {RECENT_EVENTS.map((ev, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className={cn("mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full", ev.type === "success" ? "bg-emerald-400" : ev.type === "warn" ? "bg-amber-400" : ev.type === "error" ? "bg-rose-400" : "bg-sky-400")} />
                  <div className="min-w-0">
                    <p className="text-xs text-slate-300 leading-snug">{ev.event}</p>
                    <p className="text-[10px] text-slate-600">{ev.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlowCard>
        </div>
      </div>
    </motion.div>
  );
}
