"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";
import { MessagingWidget } from "@/components/ui/MessagingWidget";
import { AgentMonitor } from "@/components/ui/AgentMonitor";
import { WeeklyEngagementChart } from "@/components/ui/WeeklyEngagementChart";
import {
  Users,
  CalendarClock,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Circle,
  RefreshCw,
  Stethoscope,
  MessageSquare,
  Mic,
} from "lucide-react";

interface StaffData {
  caseload: { id: string; name: string; status: string; program: string; lastContact: string; risk: string }[];
  schedule: { id: string; time: string; client: string; type: string; duration: string; confirmed: boolean }[];
  recentCheckIns: { id: string; client: string; note: string; time: string; mood: string }[];
  programs: { id: string; name: string; enrolled: number; completed: number; progress: number }[];
  stats: { totalCaseload: number; activeThisWeek: number; appointmentsToday: number; pendingFollowUps: number };
}

const MOCK_STAFF_DATA: StaffData = {
  stats: { totalCaseload: 24, activeThisWeek: 18, appointmentsToday: 5, pendingFollowUps: 7 },
  caseload: [
    { id: "1", name: "Jordan M.", status: "active", program: "Job Readiness", lastContact: "2 days ago", risk: "medium" },
    { id: "2", name: "Alex R.", status: "active", program: "Life Skills 101", lastContact: "Today", risk: "high" },
    { id: "3", name: "Sam T.", status: "active", program: "Financial Literacy", lastContact: "Yesterday", risk: "low" },
    { id: "4", name: "Priya D.", status: "active", program: "Job Readiness", lastContact: "3 days ago", risk: "low" },
    { id: "5", name: "Marcus W.", status: "inactive", program: "Housing Support", lastContact: "1 week ago", risk: "medium" },
  ],
  schedule: [
    { id: "1", time: "9:00 AM", client: "Jordan M.", type: "Check-in", duration: "30 min", confirmed: true },
    { id: "2", time: "11:00 AM", client: "Alex R.", type: "Risk Assessment", duration: "1 hr", confirmed: true },
    { id: "3", time: "2:00 PM", client: "Sam T.", type: "Goal Review", duration: "45 min", confirmed: false },
    { id: "4", time: "3:30 PM", client: "Priya D.", type: "Progress Review", duration: "30 min", confirmed: true },
  ],
  recentCheckIns: [
    { id: "1", client: "Jordan M.", note: "Feeling more confident about upcoming interview. Reviewed resume together.", time: "2h ago", mood: "good" },
    { id: "2", client: "Alex R.", note: "Expressed anxiety about housing situation. Referred to housing specialist.", time: "5h ago", mood: "concern" },
    { id: "3", client: "Sam T.", note: "Completed module 3. On track for certification.", time: "Yesterday", mood: "good" },
  ],
  programs: [
    { id: "1", name: "Job Readiness", enrolled: 12, completed: 8, progress: 0.67 },
    { id: "2", name: "Financial Literacy", enrolled: 9, completed: 5, progress: 0.56 },
    { id: "3", name: "Life Skills 101", enrolled: 15, completed: 13, progress: 0.87 },
    { id: "4", name: "Housing Support", enrolled: 7, completed: 2, progress: 0.29 },
  ],
};

const riskBadge = (r: string) => {
  const map: Record<string, string> = {
    high: "bg-rose-500/15 text-rose-400",
    medium: "bg-amber-500/15 text-amber-400",
    low: "bg-emerald-500/15 text-emerald-400",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${map[r] ?? map.low}`}>
      {r.charAt(0).toUpperCase() + r.slice(1)}
    </span>
  );
};

const moodIcon = (m: string) => {
  if (m === "good") return <CheckCircle2 size={14} className="text-emerald-400" />;
  if (m === "concern") return <AlertCircle size={14} className="text-rose-400" />;
  return <Circle size={14} className="text-amber-400" />;
};

export default function StaffDashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<StaffData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/portal/staff/auth");
  }, [isLoading, isAuthenticated, router]);

  const load = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await fetch("/api/staff/dashboard");
      if (res.ok) setData(await res.json());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (isLoading || !isAuthenticated) return null;

  const displayData = data ?? MOCK_STAFF_DATA;
  const kpis = [
    { label: "Total Caseload", value: displayData.stats.totalCaseload, icon: Users, color: "text-sky-400", bg: "bg-sky-500/15" },
    { label: "Active This Week", value: displayData.stats.activeThisWeek, icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/15" },
    { label: "Today's Appointments", value: displayData.stats.appointmentsToday, icon: CalendarClock, color: "text-violet-400", bg: "bg-violet-500/15" },
    { label: "Pending Follow-Ups", value: displayData.stats.pendingFollowUps, icon: AlertCircle, color: "text-rose-400", bg: "bg-rose-500/15" },
  ];

  return (
    <div className="mx-auto max-w-[1300px] px-6 py-8 space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/15">
              <Stethoscope size={16} className="text-sky-400" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-sky-400/70">Staff Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text">My Dashboard</h1>
          <p className="mt-1 text-sm text-muted">Good to see you, {user?.name}. Here&apos;s your day at a glance.</p>
        </div>
        <button
          onClick={() => load(true)}
          disabled={refreshing || loading}
          className="flex items-center gap-2 rounded-lg border border-sky-900/40 bg-sky-900/20 px-4 py-2 text-sm font-semibold text-sky-300 hover:bg-sky-900/40 transition disabled:opacity-50"
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-muted">Loading dashboard…</div>
      ) : (
        <>
          <MessagingWidget className="max-w-4xl" />

          {/* KPI Row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="grid grid-cols-2 gap-4 sm:grid-cols-4"
          >
            {kpis.map((k) => (
              <GlowCard key={k.label} className="p-5">
                <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${k.bg}`}>
                  <k.icon size={18} className={k.color} />
                </div>
                <div className="text-2xl font-extrabold tracking-tight text-text">{k.value}</div>
                <div className="mt-1 text-xs text-muted">{k.label}</div>
              </GlowCard>
            ))}
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Today's Schedule */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <GlowCard className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <CalendarClock size={15} className="text-sky-400" />
                  <h2 className="text-sm font-extrabold tracking-tight text-text uppercase">Today&apos;s Schedule</h2>
                </div>
                <div className="space-y-2">
                  {displayData.schedule.map((s) => (
                    <div key={s.id} className="flex items-center gap-3 rounded-lg bg-white/[0.02] p-3">
                      <div className="w-16 shrink-0 text-xs font-semibold text-sky-400">{s.time}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-text truncate">{s.client}</div>
                        <div className="text-[11px] text-muted">{s.type} · {s.duration}</div>
                      </div>
                      {s.confirmed ? (
                        <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                      ) : (
                        <AlertCircle size={14} className="text-amber-400 shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </GlowCard>
            </motion.div>

            {/* Recent Check-ins */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <GlowCard className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <MessageSquare size={15} className="text-sky-400" />
                  <h2 className="text-sm font-extrabold tracking-tight text-text uppercase">Recent Check-Ins</h2>
                </div>
                <div className="space-y-3">
                  {displayData.recentCheckIns.map((c) => (
                    <div key={c.id} className="flex items-start gap-3 rounded-lg bg-white/[0.02] p-3">
                      <div className="mt-0.5 shrink-0">{moodIcon(c.mood)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-sky-300">{c.client}</div>
                        <div className="mt-0.5 text-[11px] leading-relaxed text-muted line-clamp-2">{c.note}</div>
                      </div>
                      <span className="shrink-0 text-[11px] text-muted">{c.time}</span>
                    </div>
                  ))}
                </div>
              </GlowCard>
            </motion.div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Caseload Table */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <GlowCard className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users size={15} className="text-sky-400" />
                    <h2 className="text-sm font-extrabold tracking-tight text-text uppercase">My Caseload</h2>
                  </div>
                  <button
                    onClick={() => router.push("/portal/staff/participants")}
                    className="text-xs text-sky-400 hover:text-sky-300 transition"
                  >
                    All participants →
                  </button>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-[11px] font-semibold uppercase tracking-wider text-muted">
                      <th className="pb-2 pr-3">Name</th>
                      <th className="pb-2 pr-3">Program</th>
                      <th className="pb-2 pr-3">Last Contact</th>
                      <th className="pb-2">Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayData.caseload.map((p) => (
                      <tr key={p.id} className="border-b border-border/40 last:border-0">
                        <td className="py-2.5 pr-3 font-semibold text-text">{p.name}</td>
                        <td className="py-2.5 pr-3 text-xs text-muted">{p.program}</td>
                        <td className="py-2.5 pr-3 text-xs text-muted">{p.lastContact}</td>
                        <td className="py-2.5">{riskBadge(p.risk)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </GlowCard>
            </motion.div>

            {/* Program Progress */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <GlowCard className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <TrendingUp size={15} className="text-sky-400" />
                  <h2 className="text-sm font-extrabold tracking-tight text-text uppercase">Program Progress</h2>
                </div>
                <div className="space-y-4">
                  {displayData.programs.map((p) => (
                    <div key={p.id}>
                      <div className="mb-1.5 flex items-center justify-between text-xs">
                        <span className="font-semibold text-text">{p.name}</span>
                        <span className="text-muted">
                          {p.completed}/{p.enrolled} completed ({Math.round(p.progress * 100)}%)
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-sky-500 to-sky-400 transition-all"
                          style={{ width: `${p.progress * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </GlowCard>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <WeeklyEngagementChart />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.33 }}>
            <Link href="/portal/staff/interview-ready">
              <GlowCard className="group cursor-pointer border border-sky-700/30 p-6 hover:border-sky-500/50 transition">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-sky-300/75">
                      <Mic size={13} />
                      Employment Readiness Module
                    </div>
                    <h3 className="text-lg font-extrabold text-text">InterviewReady AI Coach Review Panel</h3>
                    <p className="mt-1 text-sm text-muted">
                      View mock interview attempts, confidence trends, and AI coaching insights for your caseload.
                    </p>
                  </div>
                  <span className="rounded-full border border-sky-500/40 bg-sky-500/20 px-3 py-1 text-xs font-semibold text-sky-200">
                    Open Panel
                  </span>
                </div>
              </GlowCard>
            </Link>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <AgentMonitor />
          </motion.div>
        </>
      )}
    </div>
  );
}
