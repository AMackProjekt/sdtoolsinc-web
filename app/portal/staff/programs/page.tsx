"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { GlowCard } from "@/components/ui/GlowCard";
import { cn } from "@/lib/cn";
import { BookOpen, Users, CheckCircle, CalendarDays, RefreshCw, Search, Filter } from "lucide-react";
import { motion } from "framer-motion";

/* ── Types ─────────────────────────────────────────────────────────── */
interface Program {
  id: string;
  name: string;
  description: string;
  enrolled: number;
  capacity: number;
  completed: number;
  active: number;
  startDate: string;
  endDate: string;
  facilitator: string;
  status: string;
}

/* ── Helpers ─────────────────────────────────────────────────────── */
const statusBadge = (s: string) => {
  const map: Record<string, string> = {
    active:    "bg-emerald-500/15 text-emerald-400",
    upcoming:  "bg-sky-500/15 text-sky-400",
    completed: "bg-slate-500/15 text-slate-400",
    paused:    "bg-amber-500/15 text-amber-400",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${map[s.toLowerCase()] ?? map.upcoming}`}>
      {s}
    </span>
  );
};

const STATUS_FILTERS = ["all", "active", "upcoming", "completed", "paused"];

/* ── Component ───────────────────────────────────────────────────── */
export default function StaffProgramsPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/portal/staff/auth");
  }, [isLoading, isAuthenticated, router]);

  const load = useCallback((refresh = false) => {
    if (refresh) setRefreshing(true); else setLoading(true);
    fetch("/api/staff/programs")
      .then((r) => r.json())
      .then((d) => { if (d.programs) setPrograms(d.programs as Program[]); })
      .catch(() => {})
      .finally(() => { setLoading(false); setRefreshing(false); });
  }, []);

  useEffect(() => { if (!isLoading && isAuthenticated) load(); }, [isLoading, isAuthenticated, load]);

  if (isLoading || !isAuthenticated) return null;

  const filtered = programs.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.facilitator.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status.toLowerCase() === statusFilter;
    return matchSearch && matchStatus;
  });

  const activeCount = programs.filter((p) => p.status.toLowerCase() === "active").length;
  const totalEnrolled = programs.reduce((sum, p) => sum + p.enrolled, 0);
  const totalCompleted = programs.reduce((sum, p) => sum + p.completed, 0);

  const kpis = [
    { label: "Total Programs",   value: programs.length,  icon: BookOpen,      bg: "bg-sky-900/40",     color: "text-sky-400"     },
    { label: "Active Programs",  value: activeCount,       icon: CheckCircle,   bg: "bg-emerald-900/40", color: "text-emerald-400" },
    { label: "Total Enrolled",   value: totalEnrolled,     icon: Users,         bg: "bg-violet-900/40",  color: "text-violet-400"  },
    { label: "Completions",      value: totalCompleted,    icon: CalendarDays,  bg: "bg-amber-900/40",   color: "text-amber-400"   },
  ];

  return (
    <div className="min-h-screen bg-[#06070b] p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6 flex flex-wrap items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Programs</h1>
          <p className="mt-1 text-sm text-slate-400">Track capacity, enrollment, and program outcomes.</p>
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

      {/* KPI Row */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <GlowCard className="p-5">
              <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${k.bg}`}>
                <k.icon size={18} className={k.color} />
              </div>
              <div className="text-2xl font-extrabold tracking-tight text-white">{loading ? "—" : k.value}</div>
              <div className="mt-1 text-xs text-slate-400">{k.label}</div>
            </GlowCard>
          </motion.div>
        ))}
      </div>

      {/* Search + Filter */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="mb-5">
        <GlowCard className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or facilitator…"
                className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm text-white placeholder-slate-500 outline-none focus:border-sky-500/60"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="h-4 w-4 text-slate-500" />
              {STATUS_FILTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs font-semibold capitalize transition",
                    statusFilter === s ? "bg-sky-600 text-white" : "bg-white/5 text-slate-400 hover:bg-white/10"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </GlowCard>
      </motion.div>

      {/* Program Cards */}
      {loading ? (
        <GlowCard className="p-12 text-center text-slate-500">Loading programs…</GlowCard>
      ) : filtered.length === 0 ? (
        <GlowCard className="p-12 text-center text-slate-500">No programs found.</GlowCard>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filtered.map((p, i) => {
            const pct = p.capacity > 0 ? Math.min(p.enrolled / p.capacity, 1) : 0;
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 + i * 0.05 }}
              >
                <GlowCard className="p-5">
                  {/* Title row */}
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-bold text-white">{p.name}</h2>
                      <p className="mt-0.5 text-xs text-slate-400">{p.description}</p>
                    </div>
                    {statusBadge(p.status)}
                  </div>

                  {/* Facilitator */}
                  <div className="mb-4 text-xs text-slate-400">
                    <span className="font-semibold text-slate-300">Facilitator: </span>{p.facilitator}
                  </div>

                  {/* Capacity progress */}
                  <div className="mb-3">
                    <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
                      <span>Enrollment</span>
                      <span className="font-semibold text-slate-300">{p.enrolled}/{p.capacity}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-sky-500 to-sky-400 transition-all"
                        style={{ width: `${pct * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="mb-4 grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-emerald-900/20 px-3 py-2 text-center">
                      <div className="text-lg font-extrabold text-emerald-400">{p.active}</div>
                      <div className="text-[11px] text-slate-400">Active</div>
                    </div>
                    <div className="rounded-lg bg-sky-900/20 px-3 py-2 text-center">
                      <div className="text-lg font-extrabold text-sky-400">{p.completed}</div>
                      <div className="text-[11px] text-slate-400">Completed</div>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="flex gap-4 text-xs text-slate-500">
                    <span><span className="font-semibold text-slate-400">Start:</span> {p.startDate}</span>
                    <span><span className="font-semibold text-slate-400">End:</span> {p.endDate}</span>
                  </div>
                </GlowCard>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
