"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";
import { AgentMonitor } from "@/components/ui/AgentMonitor";
import {
  Users,
  UserCheck,
  BookOpen,
  ShieldCheck,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  TrendingUp,
  RefreshCw,
  Wifi,
  WifiOff,
  Circle,
} from "lucide-react";

interface DashData {
  stats: {
    totalUsers: number;
    activeStaff: number;
    activeParticipants: number;
    activeCourses: number;
    pendingRegistrations: number;
    newThisMonth: number;
  };
  recentRegistrations: { id: string; name: string; email: string; role: string; date: string; status: string }[];
  staffActivity: { id: string; name: string; role: string; caseload: number; lastLogin: string; status: string }[];
  auditLog: { id: string; user: string; action: string; target: string; time: string; severity: string }[];
  systemHealth: { uptime: string; responseTime: string; activeConnections: number; errorRate: string };
}

const MOCK_ADMIN_DATA: DashData = {
  stats: { totalUsers: 312, activeStaff: 18, activeParticipants: 274, activeCourses: 14, pendingRegistrations: 9, newThisMonth: 37 },
  recentRegistrations: [
    { id: "1", name: "Tanya Brooks", email: "tanya.b@example.com", role: "participant", date: "Today", status: "active" },
    { id: "2", name: "Luis Vega", email: "luis.v@example.com", role: "participant", date: "Yesterday", status: "pending" },
    { id: "3", name: "Sarah Kim", email: "sarah.k@example.com", role: "staff", date: "2 days ago", status: "active" },
    { id: "4", name: "Michael T.", email: "michael.t@example.com", role: "participant", date: "3 days ago", status: "active" },
  ],
  staffActivity: [
    { id: "1", name: "Maria Chen", role: "Case Manager", caseload: 12, lastLogin: "2h ago", status: "online" },
    { id: "2", name: "Robert Torres", role: "Job Coach", caseload: 9, lastLogin: "Today", status: "online" },
    { id: "3", name: "Deja Williams", role: "Peer Mentor", caseload: 6, lastLogin: "Yesterday", status: "away" },
    { id: "4", name: "Dr. Ahmed K.", role: "Counselor", caseload: 14, lastLogin: "3h ago", status: "online" },
  ],
  auditLog: [
    { id: "1", user: "admin@sdtools.io", action: "Updated user role", target: "luis.v@example.com", time: "5m ago", severity: "info" },
    { id: "2", user: "maria.chen@sdtools.io", action: "Submitted case report", target: "Participant #274", time: "22m ago", severity: "info" },
    { id: "3", user: "admin@sdtools.io", action: "Flagged registration", target: "unknown@temp.io", time: "1h ago", severity: "warning" },
    { id: "4", user: "system", action: "Auto-archived inactive record", target: "Participant #198", time: "3h ago", severity: "info" },
  ],
  systemHealth: { uptime: "99.97%", responseTime: "142ms", activeConnections: 38, errorRate: "0.02%" },
};

const statusDot = (s: string) => {
  if (s === "online") return <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />;
  if (s === "away") return <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />;
  return <span className="inline-block h-2 w-2 rounded-full bg-slate-500" />;
};

const statusBadge = (s: string) => {
  const cls =
    s === "active"
      ? "bg-emerald-500/15 text-emerald-400"
      : s === "pending"
      ? "bg-amber-500/15 text-amber-400"
      : "bg-slate-500/15 text-slate-400";
  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${cls}`}>
      {s.charAt(0).toUpperCase() + s.slice(1)}
    </span>
  );
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [data, setData] = useState<DashData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) router.replace("/portal/admin/auth");
  }, [isAuthenticated, router]);

  const load = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await fetch("/api/admin/dashboard");
      if (res.ok) setData(await res.json());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (!isAuthenticated) return null;

  const displayData = data ?? MOCK_ADMIN_DATA;
  const kpis = [
    { label: "Total Users", value: displayData.stats.totalUsers, icon: Users, color: "text-violet-400", bg: "bg-violet-500/15" },
    { label: "Active Staff", value: displayData.stats.activeStaff, icon: UserCheck, color: "text-sky-400", bg: "bg-sky-500/15" },
    { label: "Participants", value: displayData.stats.activeParticipants, icon: Activity, color: "text-teal-400", bg: "bg-teal-500/15" },
    { label: "Active Courses", value: displayData.stats.activeCourses, icon: BookOpen, color: "text-amber-400", bg: "bg-amber-500/15" },
    { label: "Pending Reg.", value: displayData.stats.pendingRegistrations, icon: Clock, color: "text-rose-400", bg: "bg-rose-500/15" },
    { label: "New This Month", value: displayData.stats.newThisMonth, icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/15" },
  ];

  return (
    <div className="mx-auto max-w-[1300px] px-6 py-8 space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/15">
              <ShieldCheck size={16} className="text-violet-400" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-violet-400/70">Admin Control</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text">
            Platform Overview
          </h1>
          <p className="mt-1 text-sm text-muted">Welcome back, {user?.name}. Here&apos;s everything happening right now.</p>
        </div>
        <button
          onClick={() => load(true)}
          disabled={refreshing || loading}
          className="flex items-center gap-2 rounded-lg border border-violet-900/40 bg-violet-900/20 px-4 py-2 text-sm font-semibold text-violet-300 hover:bg-violet-900/40 transition disabled:opacity-50"
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-muted">Loading dashboard…</div>
      ) : (
        <>
          {/* KPI Grid */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
          >
            {kpis.map((k, i) => (
              <GlowCard key={k.label} className="p-5">
                <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${k.bg}`}>
                  <k.icon size={18} className={k.color} />
                </div>
                <div className="text-2xl font-extrabold tracking-tight text-text">{k.value.toLocaleString()}</div>
                <div className="mt-1 text-xs text-muted">{k.label}</div>
              </GlowCard>
            ))}
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Registrations */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <GlowCard className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-sm font-extrabold tracking-tight text-text uppercase">Recent Registrations</h2>
                  <button
                    onClick={() => router.push("/portal/admin/users")}
                    className="text-xs text-violet-400 hover:text-violet-300 transition"
                  >
                    View all →
                  </button>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-[11px] font-semibold uppercase tracking-wider text-muted">
                      <th className="pb-2 pr-3">Name</th>
                      <th className="pb-2 pr-3">Role</th>
                      <th className="pb-2 pr-3">Date</th>
                      <th className="pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayData.recentRegistrations.map((r) => (
                      <tr key={r.id} className="border-b border-border/40 last:border-0">
                        <td className="py-2.5 pr-3">
                          <div className="font-semibold text-text">{r.name}</div>
                          <div className="text-[11px] text-muted">{r.email}</div>
                        </td>
                        <td className="py-2.5 pr-3 text-xs capitalize text-muted">{r.role}</td>
                        <td className="py-2.5 pr-3 text-xs text-muted">{r.date}</td>
                        <td className="py-2.5">{statusBadge(r.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </GlowCard>
            </motion.div>

            {/* Staff Activity */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <GlowCard className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-sm font-extrabold tracking-tight text-text uppercase">Staff Activity</h2>
                  <button
                    onClick={() => router.push("/portal/admin/staff")}
                    className="text-xs text-violet-400 hover:text-violet-300 transition"
                  >
                    Manage staff →
                  </button>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-[11px] font-semibold uppercase tracking-wider text-muted">
                      <th className="pb-2 pr-3">Staff Member</th>
                      <th className="pb-2 pr-3">Caseload</th>
                      <th className="pb-2 pr-3">Last Login</th>
                      <th className="pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayData.staffActivity.map((s) => (
                      <tr key={s.id} className="border-b border-border/40 last:border-0">
                        <td className="py-2.5 pr-3">
                          <div className="font-semibold text-text">{s.name}</div>
                          <div className="text-[11px] text-muted">{s.role}</div>
                        </td>
                        <td className="py-2.5 pr-3 text-xs text-muted">{s.caseload} clients</td>
                        <td className="py-2.5 pr-3 text-xs text-muted">{s.lastLogin}</td>
                        <td className="py-2.5">{statusDot(s.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </GlowCard>
            </motion.div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Audit Log */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <GlowCard className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Activity size={15} className="text-violet-400" />
                  <h2 className="text-sm font-extrabold tracking-tight text-text uppercase">Recent Audit Log</h2>
                </div>
                <div className="space-y-3">
                  {displayData.auditLog.map((entry) => (
                    <div key={entry.id} className="flex items-start gap-3 rounded-lg bg-white/[0.02] p-3">
                      <div className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${entry.severity === "warning" ? "bg-amber-400" : "bg-violet-500"}`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-text">
                          <span className="text-violet-300">{entry.user}</span>
                          {" · "}{entry.action}
                        </div>
                        <div className="mt-0.5 text-[11px] text-muted">
                          Target: <span className="text-text/80">{entry.target}</span>
                        </div>
                      </div>
                      <span className="shrink-0 text-[11px] text-muted">{entry.time}</span>
                    </div>
                  ))}
                </div>
              </GlowCard>
            </motion.div>

            {/* System Health + Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="space-y-4"
            >
              <GlowCard className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Wifi size={15} className="text-emerald-400" />
                  <h2 className="text-sm font-extrabold tracking-tight text-text uppercase">System Health</h2>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Uptime", value: displayData.systemHealth.uptime, ok: true },
                    { label: "Response Time", value: displayData.systemHealth.responseTime, ok: true },
                    { label: "Live Connections", value: String(displayData.systemHealth.activeConnections), ok: true },
                    { label: "Error Rate", value: displayData.systemHealth.errorRate, ok: true },
                  ].map((h) => (
                    <div key={h.label} className="flex items-center justify-between text-sm">
                      <span className="text-muted">{h.label}</span>
                      <div className="flex items-center gap-1.5">
                        {h.ok ? (
                          <CheckCircle size={13} className="text-emerald-400" />
                        ) : (
                          <AlertTriangle size={13} className="text-amber-400" />
                        )}
                        <span className="font-semibold text-text">{h.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </GlowCard>

              <GlowCard className="p-6">
                <h2 className="mb-4 text-sm font-extrabold tracking-tight text-text uppercase">Audit Portal Access</h2>
                <div className="space-y-2">
                  <button
                    onClick={() => router.push("/portal/staff/dashboard")}
                    className="flex w-full items-center justify-between rounded-lg bg-sky-500/10 px-4 py-3 text-sm font-semibold text-sky-300 hover:bg-sky-500/20 transition"
                  >
                    <div className="flex items-center gap-2">
                      <Eye size={15} />
                      View Staff Portal
                    </div>
                    <span className="text-xs">→</span>
                  </button>
                  <button
                    onClick={() => router.push("/portal/participant/dashboard")}
                    className="flex w-full items-center justify-between rounded-lg bg-teal-500/10 px-4 py-3 text-sm font-semibold text-teal-300 hover:bg-teal-500/20 transition"
                  >
                    <div className="flex items-center gap-2">
                      <Eye size={15} />
                      View Participant Portal
                    </div>
                    <span className="text-xs">→</span>
                  </button>
                  <button
                    onClick={() => router.push("/portal/enterprise")}
                    className="flex w-full items-center justify-between rounded-lg bg-violet-500/10 px-4 py-3 text-sm font-semibold text-violet-300 hover:bg-violet-500/20 transition"
                  >
                    <div className="flex items-center gap-2">
                      <Eye size={15} />
                      View Enterprise Portal
                    </div>
                    <span className="text-xs">→</span>
                  </button>
                </div>
              </GlowCard>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <AgentMonitor />
          </motion.div>
        </>
      )}
    </div>
  );
}
