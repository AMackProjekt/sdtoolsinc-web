"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { GlowCard } from "@/components/ui/GlowCard";
import { cn } from "@/lib/cn";
import {
  Users, UserCheck, Clock, AlertTriangle, Search, Filter,
  RefreshCw, ChevronDown, ChevronUp, Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Types ─────────────────────────────────────────────────────────── */
interface Participant {
  id: string;
  name: string;
  program: string;
  status: string;
  risk: string;
  lastContact: string;
  caseworker: string;
  enrolled: string;
}
interface Stats {
  total: number;
  active: number;
  onHold: number;
  completed: number;
  inactive: number;
}
interface ApiData {
  participants: Participant[];
  stats: Stats;
}

/* ── Helpers ────────────────────────────────────────────────────────── */
const riskBadge = (r: string) => {
  const map: Record<string, string> = {
    high: "bg-rose-500/15 text-rose-400",
    medium: "bg-amber-500/15 text-amber-400",
    low: "bg-emerald-500/15 text-emerald-400",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${map[r] ?? map.low}`}>
      {r}
    </span>
  );
};

const statusBadge = (s: string) => {
  const map: Record<string, string> = {
    active:    "bg-emerald-500/15 text-emerald-400",
    "on-hold": "bg-amber-500/15 text-amber-400",
    "on hold": "bg-amber-500/15 text-amber-400",
    inactive:  "bg-slate-500/15 text-slate-400",
    completed: "bg-sky-500/15 text-sky-400",
  };
  const key = s.toLowerCase();
  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${map[key] ?? map.inactive}`}>
      {s}
    </span>
  );
};

const CASEWORKERS = ["Taylor M.", "Jordan L.", "Alex R."];

const STATUS_FILTERS = ["all", "active", "on-hold", "inactive", "completed"];
const RISK_FILTERS   = ["all", "high", "medium", "low"];

/* ── Component ───────────────────────────────────────────────────────── */
export default function StaffParticipantsPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [data, setData]       = useState<ApiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [riskFilter, setRiskFilter]     = useState("all");
  const [expandedId, setExpandedId]     = useState<string | null>(null);
  const [noteInputs, setNoteInputs]     = useState<Record<string, string>>({});
  const [caseNotes, setCaseNotes]       = useState<Record<string, { text: string; time: string }[]>>({});
  const [caseworkerOverrides, setCaseworkerOverrides] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/portal/staff/auth");
  }, [isLoading, isAuthenticated, router]);

  const load = useCallback((refresh = false) => {
    if (refresh) setRefreshing(true); else setLoading(true);
    fetch("/api/staff/participants")
      .then((r) => r.json())
      .then((d) => { if (d.participants) setData(d as ApiData); })
      .catch(() => {})
      .finally(() => { setLoading(false); setRefreshing(false); });
  }, []);

  useEffect(() => { if (!isLoading && isAuthenticated) load(); }, [isLoading, isAuthenticated, load]);

  if (isLoading || !isAuthenticated) return null;

  /* ── Filtered list ── */
  const filtered = (data?.participants ?? []).filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.program.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status.toLowerCase() === statusFilter;
    const matchRisk   = riskFilter === "all"   || p.risk.toLowerCase()   === riskFilter;
    return matchSearch && matchStatus && matchRisk;
  });

  const highRiskCount = (data?.participants ?? []).filter((p) => p.risk === "high").length;

  const kpis = [
    { label: "Total Participants", value: data?.stats.total ?? "—", icon: Users,       bg: "bg-sky-900/40",   color: "text-sky-400"     },
    { label: "Active",             value: data?.stats.active ?? "—", icon: UserCheck,   bg: "bg-emerald-900/40", color: "text-emerald-400" },
    { label: "On Hold",            value: data?.stats.onHold ?? "—", icon: Clock,       bg: "bg-amber-900/40", color: "text-amber-400"   },
    { label: "High Risk",          value: highRiskCount,              icon: AlertTriangle, bg: "bg-rose-900/40",  color: "text-rose-400"    },
  ];

  /* ── Handlers ── */
  const toggleRow = (id: string) => setExpandedId(expandedId === id ? null : id);

  const addNote = (id: string) => {
    const text = (noteInputs[id] ?? "").trim();
    if (!text) return;
    const time = new Date().toLocaleString();
    setCaseNotes((prev) => ({ ...prev, [id]: [...(prev[id] ?? []), { text, time }] }));
    setNoteInputs((prev) => ({ ...prev, [id]: "" }));
  };

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
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Participants</h1>
          <p className="mt-1 text-sm text-slate-400">Manage caseload, contact history, and case notes.</p>
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

      {/* Search + Filters */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="mb-4">
        <GlowCard className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[180px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or program…"
                className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm text-white placeholder-slate-500 outline-none focus:border-sky-500/60"
              />
            </div>
            {/* Status pills */}
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
            {/* Risk pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500 font-semibold">Risk:</span>
              {RISK_FILTERS.map((r) => (
                <button
                  key={r}
                  onClick={() => setRiskFilter(r)}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs font-semibold capitalize transition",
                    riskFilter === r ? "bg-rose-700 text-white" : "bg-white/5 text-slate-400 hover:bg-white/10"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </GlowCard>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
        {loading ? (
          <GlowCard className="p-12 text-center text-slate-500">Loading participants…</GlowCard>
        ) : filtered.length === 0 ? (
          <GlowCard className="p-12 text-center text-slate-500">No participants found.</GlowCard>
        ) : (
          <GlowCard className="overflow-hidden p-0">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/[0.08] bg-white/[0.03]">
                <tr>
                  {["Name", "Program", "Case Manager", "Status", "Risk", "Last Contact", "Enrolled", ""].map((h) => (
                    <th key={h} className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {filtered.map((p, i) => (
                  <>
                    <motion.tr
                      key={p.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="cursor-pointer hover:bg-white/[0.04] transition"
                      onClick={() => toggleRow(p.id)}
                    >
                      <td className="px-5 py-3 font-semibold text-white whitespace-nowrap">{p.name}</td>
                      <td className="px-5 py-3 text-slate-300">{p.program}</td>
                      <td className="px-5 py-3">
                        <select
                          value={caseworkerOverrides[p.id] ?? p.caseworker}
                          onChange={(e) => { e.stopPropagation(); setCaseworkerOverrides((prev) => ({ ...prev, [p.id]: e.target.value })); }}
                          onClick={(e) => e.stopPropagation()}
                          className="rounded-md border border-white/10 bg-[#0c0f17] px-2 py-1 text-xs text-slate-300 outline-none focus:border-sky-500/60 cursor-pointer"
                        >
                          {CASEWORKERS.map((cw) => <option key={cw} value={cw}>{cw}</option>)}
                        </select>
                      </td>
                      <td className="px-5 py-3">{statusBadge(p.status)}</td>
                      <td className="px-5 py-3">{riskBadge(p.risk)}</td>
                      <td className="px-5 py-3 text-slate-400 whitespace-nowrap">{p.lastContact}</td>
                      <td className="px-5 py-3 text-slate-400 whitespace-nowrap">{p.enrolled}</td>
                      <td className="px-5 py-3 text-slate-500">
                        {expandedId === p.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </td>
                    </motion.tr>

                    {/* Expandable Case Notes Panel */}
                    <AnimatePresence>
                      {expandedId === p.id && (
                        <motion.tr
                          key={`notes-${p.id}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <td colSpan={8} className="bg-white/[0.02] px-6 py-4">
                            <div className="max-w-2xl">
                              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-sky-400">
                                Case Notes — {p.name}
                              </h3>
                              {/* Note history */}
                              <div className="mb-3 space-y-2">
                                {(caseNotes[p.id] ?? []).length === 0 ? (
                                  <p className="text-xs text-slate-500 italic">No notes yet. Add the first one below.</p>
                                ) : (
                                  (caseNotes[p.id] ?? []).map((note, ni) => (
                                    <div key={ni} className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2">
                                      <p className="text-sm text-slate-200">{note.text}</p>
                                      <p className="mt-1 text-[11px] text-slate-500">{note.time}</p>
                                    </div>
                                  ))
                                )}
                              </div>
                              {/* Add note */}
                              <div className="flex gap-2">
                                <textarea
                                  rows={2}
                                  value={noteInputs[p.id] ?? ""}
                                  onChange={(e) => setNoteInputs((prev) => ({ ...prev, [p.id]: e.target.value }))}
                                  placeholder="Add a case note…"
                                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-sky-500/60 resize-none"
                                />
                                <button
                                  onClick={() => addNote(p.id)}
                                  disabled={!(noteInputs[p.id] ?? "").trim()}
                                  className="flex items-center gap-1.5 self-end rounded-lg bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-500 transition disabled:opacity-40"
                                >
                                  <Plus size={12} />
                                  Add
                                </button>
                              </div>
                            </div>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </>
                ))}
              </tbody>
            </table>
          </GlowCard>
        )}
      </motion.div>
    </div>
  );
}
