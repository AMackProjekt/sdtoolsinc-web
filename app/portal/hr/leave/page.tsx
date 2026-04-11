"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";
import { cn } from "@/lib/cn";
import {
  CalendarClock, CheckCircle2, XCircle, Clock, Plus, X, AlertTriangle,
} from "lucide-react";

// ─── Types & Mock Data ────────────────────────────────────────────────────────

type LeaveStatus = "pending" | "approved" | "denied";
type LeaveType = "Vacation" | "PTO" | "Medical" | "Sick" | "Bereavement" | "FMLA";

interface LeaveRequest {
  id: string;
  employee: string;
  dept: string;
  type: LeaveType;
  from: string;
  to: string;
  days: number;
  status: LeaveStatus;
  notes: string;
  submitted: string;
}

const INITIAL_REQUESTS: LeaveRequest[] = [
  { id: "lr1", employee: "Devon Clarke",   dept: "Client Services", type: "Medical",    from: "Jul 8, 2025",  to: "Jul 19, 2025",  days: 10, status: "approved", notes: "Scheduled medical procedure & recovery",  submitted: "Jul 1, 2025"  },
  { id: "lr2", employee: "Marcus Johnson", dept: "Client Services", type: "Vacation",   from: "Jul 22, 2025", to: "Jul 25, 2025",  days: 4,  status: "pending",  notes: "Family vacation",                         submitted: "Jul 5, 2025"  },
  { id: "lr3", employee: "Sandra Nguyen",  dept: "Technology",      type: "PTO",        from: "Aug 1, 2025",  to: "Aug 2, 2025",   days: 2,  status: "pending",  notes: "Personal errands",                        submitted: "Jul 8, 2025"  },
  { id: "lr4", employee: "Priya Sharma",   dept: "Operations",      type: "Sick",       from: "Jul 10, 2025", to: "Jul 10, 2025",  days: 1,  status: "approved", notes: "Sick day",                                submitted: "Jul 10, 2025" },
  { id: "lr5", employee: "Naomi Luckett",  dept: "Human Resources", type: "Bereavement",from: "Jun 30, 2025", to: "Jul 3, 2025",   days: 3,  status: "approved", notes: "",                                        submitted: "Jun 30, 2025" },
  { id: "lr6", employee: "James Thornton", dept: "Finance",         type: "Vacation",   from: "Aug 11, 2025", to: "Aug 15, 2025",  days: 5,  status: "pending",  notes: "Annual vacation",                         submitted: "Jul 3, 2025"  },
];

const BALANCE_DATA: Record<string, Record<string, { used: number; total: number }>> = {
  "Marcus Johnson":  { PTO: { used: 0, total: 10 }, Vacation: { used: 4, total: 15 }, Sick: { used: 1, total: 8 } },
  "Priya Sharma":    { PTO: { used: 2, total: 10 }, Vacation: { used: 0, total: 15 }, Sick: { used: 1, total: 8 } },
  "Devon Clarke":    { PTO: { used: 1, total: 10 }, Vacation: { used: 0, total: 15 }, Sick: { used: 10, total: 8 } },
  "Sandra Nguyen":   { PTO: { used: 2, total: 10 }, Vacation: { used: 3, total: 15 }, Sick: { used: 0, total: 8 } },
  "James Thornton":  { PTO: { used: 0, total: 10 }, Vacation: { used: 5, total: 15 }, Sick: { used: 0, total: 8 } },
  "Aaliyah Brooks":  { PTO: { used: 1, total: 10 }, Vacation: { used: 0, total: 15 }, Sick: { used: 0, total: 8 } },
};

const STATUS_STYLES: Record<LeaveStatus, string> = {
  pending:  "bg-amber-900/40 text-amber-400 border border-amber-700/40",
  approved: "bg-emerald-900/40 text-emerald-400 border border-emerald-700/40",
  denied:   "bg-red-900/40 text-red-400 border border-red-700/40",
};

const LEAVE_TYPE_COLORS: Record<LeaveType, string> = {
  Vacation:    "bg-sky-900/30 text-sky-300",
  PTO:         "bg-purple-900/30 text-purple-300",
  Medical:     "bg-rose-900/30 text-rose-300",
  Sick:        "bg-orange-900/30 text-orange-300",
  Bereavement: "bg-slate-700/40 text-slate-300",
  FMLA:        "bg-teal-900/30 text-teal-300",
};

const EMPLOYEES = ["Marcus Johnson","Priya Sharma","Devon Clarke","Sandra Nguyen","James Thornton","Aaliyah Brooks","Tyler Reed","Fatima Ali","Carlos Vega"];

type FilterTab = "All" | LeaveStatus;

const EMPTY_FORM = { employee: EMPLOYEES[0], type: "Vacation" as LeaveType, from: "", to: "", notes: "" };

// ─── Component ────────────────────────────────────────────────────────────────

export default function LeavePage() {
  const [requests, setRequests] = useState<LeaveRequest[]>(INITIAL_REQUESTS);
  const [tab, setTab] = useState<FilterTab>("All");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [balanceEmp, setBalanceEmp] = useState("Marcus Johnson");

  const filtered = useMemo(() =>
    tab === "All" ? requests : requests.filter(r => r.status === tab),
    [requests, tab]
  );

  function setStatus(id: string, status: LeaveStatus) {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  }

  function handleAdd() {
    if (!form.employee || !form.from || !form.to) return;
    setSaving(true);
    setTimeout(() => {
      setRequests(prev => [...prev, {
        id: `lr${Date.now()}`,
        employee: form.employee,
        dept: "—",
        type: form.type,
        from: form.from,
        to: form.to,
        days: 1,
        status: "pending",
        notes: form.notes,
        submitted: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      }]);
      setSaving(false);
      setShowAdd(false);
      setForm(EMPTY_FORM);
    }, 600);
  }

  const pending  = requests.filter(r => r.status === "pending").length;
  const approved = requests.filter(r => r.status === "approved").length;
  const daysOut  = requests.filter(r => r.status === "approved").reduce((a, r) => a + r.days, 0);
  const balanceData = BALANCE_DATA[balanceEmp];

  const TABS: FilterTab[] = ["All", "pending", "approved", "denied"];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Leave Requests</h1>
          <p className="mt-1 text-sm text-slate-400">Review and manage employee time-off requests</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 rounded-lg bg-amber-600 hover:bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition"
        >
          <Plus size={15} /> New Request
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {[
          { label: "Pending Approval",  value: pending,  color: "text-amber-400" },
          { label: "Approved YTD",      value: approved, color: "text-emerald-400" },
          { label: "Days Out (Approved)",value: daysOut,  color: "text-sky-400" },
        ].map(({ label, value, color }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <GlowCard className="p-4">
              <div className={cn("text-2xl font-extrabold", color)}>{value}</div>
              <div className="mt-0.5 text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</div>
            </GlowCard>
          </motion.div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
        {/* Requests Table */}
        <div className="space-y-4">
          {/* Tabs */}
          <div className="flex gap-2">
            {TABS.map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "rounded-lg px-3.5 py-1.5 text-sm font-semibold capitalize transition",
                  tab === t
                    ? "bg-amber-600 text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-700/40"
                )}
              >
                {t === "All" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          <GlowCard className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-border bg-slate-900/40">
                    <th className="px-5 py-3 text-xs font-semibold text-slate-400">Employee</th>
                    <th className="px-5 py-3 text-xs font-semibold text-slate-400">Type</th>
                    <th className="px-5 py-3 text-xs font-semibold text-slate-400">Dates</th>
                    <th className="px-5 py-3 text-xs font-semibold text-slate-400">Days</th>
                    <th className="px-5 py-3 text-xs font-semibold text-slate-400">Status</th>
                    <th className="px-5 py-3 text-xs font-semibold text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence initial={false}>
                    {filtered.map(r => (
                      <motion.tr
                        key={r.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-b border-border/50 hover:bg-slate-800/20 transition"
                      >
                        <td className="px-5 py-3">
                          <div className="font-semibold text-white">{r.employee}</div>
                          <div className="text-xs text-slate-500">{r.dept}</div>
                        </td>
                        <td className="px-5 py-3">
                          <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", LEAVE_TYPE_COLORS[r.type])}>
                            {r.type}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-slate-300 whitespace-nowrap">
                          {r.from} → {r.to}
                        </td>
                        <td className="px-5 py-3 text-slate-300">{r.days}d</td>
                        <td className="px-5 py-3">
                          <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize", STATUS_STYLES[r.status])}>
                            {r.status}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          {r.status === "pending" && (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => setStatus(r.id, "approved")}
                                className="flex items-center gap-1 rounded-lg bg-emerald-800/40 hover:bg-emerald-700/50 px-2.5 py-1 text-xs font-semibold text-emerald-400 transition"
                              >
                                <CheckCircle2 size={12} /> Approve
                              </button>
                              <button
                                onClick={() => setStatus(r.id, "denied")}
                                className="flex items-center gap-1 rounded-lg bg-red-900/30 hover:bg-red-800/40 px-2.5 py-1 text-xs font-semibold text-red-400 transition"
                              >
                                <XCircle size={12} /> Deny
                              </button>
                            </div>
                          )}
                          {r.status !== "pending" && (
                            <span className="text-xs text-slate-500">No action required</span>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="py-12 text-center text-sm text-slate-500">No requests in this category.</div>
              )}
            </div>
          </GlowCard>

          {/* Pending alerts */}
          {pending > 0 && tab === "All" && (
            <div className="flex items-center gap-2.5 rounded-xl border border-amber-700/40 bg-amber-900/20 px-4 py-3 text-sm text-amber-300">
              <AlertTriangle size={15} />
              <span>{pending} request{pending > 1 ? "s" : ""} awaiting your approval.</span>
            </div>
          )}
        </div>

        {/* Leave Balance Panel */}
        <div className="space-y-4">
          <GlowCard className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <CalendarClock size={15} className="text-amber-400" />
              <span className="text-sm font-semibold text-white">Leave Balances</span>
            </div>
            <select
              value={balanceEmp}
              onChange={e => setBalanceEmp(e.target.value)}
              className="mb-4 w-full rounded-lg border border-border bg-slate-800/60 px-3 py-2 text-sm text-text focus:outline-none focus:border-amber-500"
            >
              {Object.keys(BALANCE_DATA).map(e => <option key={e}>{e}</option>)}
            </select>
            {balanceData && (
              <div className="space-y-3">
                {Object.entries(balanceData).map(([type, { used, total }]) => {
                  const remaining = total - used;
                  const pct = Math.min(100, Math.round((used / total) * 100));
                  const overused = used > total;
                  return (
                    <div key={type}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-300">{type}</span>
                        <span className={cn("font-semibold", overused ? "text-red-400" : "text-emerald-400")}>
                          {remaining >= 0 ? remaining : 0}d remaining
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-700/50">
                        <div
                          className={cn("h-full rounded-full", overused ? "bg-red-500" : "bg-amber-500")}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="mt-0.5 text-xs text-slate-500">{used} used / {total} total</div>
                    </div>
                  );
                })}
              </div>
            )}
          </GlowCard>

          {/* Quick calendar summary */}
          <GlowCard className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <Clock size={15} className="text-amber-400" />
              <span className="text-sm font-semibold text-white">Out This Week</span>
            </div>
            <div className="space-y-2">
              {requests.filter(r => r.status === "approved").map(r => (
                <div key={r.id} className="flex items-start justify-between text-xs gap-2">
                  <span className="font-semibold text-slate-300 truncate">{r.employee.split(" ")[0]}</span>
                  <span className="text-slate-500 whitespace-nowrap">{r.from}</span>
                </div>
              ))}
            </div>
          </GlowCard>
        </div>
      </div>

      {/* Add Request Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-2xl border border-border bg-panel p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-white">New Leave Request</h2>
                <button onClick={() => setShowAdd(false)} className="rounded-lg p-2 text-slate-400 hover:text-white transition"><X size={18} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-400">Employee</label>
                  <select value={form.employee} onChange={e => setForm({ ...form, employee: e.target.value })}
                    className="w-full rounded-lg border border-border bg-slate-800/60 px-3 py-2 text-sm text-text focus:outline-none focus:border-amber-500">
                    {EMPLOYEES.map(e => <option key={e}>{e}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-400">Leave Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as LeaveType })}
                    className="w-full rounded-lg border border-border bg-slate-800/60 px-3 py-2 text-sm text-text focus:outline-none focus:border-amber-500">
                    {(["Vacation","PTO","Medical","Sick","FMLA","Bereavement"] as LeaveType[]).map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-400">From *</label>
                    <input type="text" placeholder="Jul 1, 2025" value={form.from} onChange={e => setForm({ ...form, from: e.target.value })}
                      className="w-full rounded-lg border border-border bg-slate-800/60 px-3 py-2 text-sm text-text focus:outline-none focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-400">To *</label>
                    <input type="text" placeholder="Jul 5, 2025" value={form.to} onChange={e => setForm({ ...form, to: e.target.value })}
                      className="w-full rounded-lg border border-border bg-slate-800/60 px-3 py-2 text-sm text-text focus:outline-none focus:border-amber-500" />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-400">Notes</label>
                  <textarea rows={3} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                    className="w-full rounded-lg border border-border bg-slate-800/60 px-3 py-2 text-sm text-text focus:outline-none focus:border-amber-500 resize-none" />
                </div>
              </div>
              <div className="mt-5 flex justify-end gap-3">
                <button onClick={() => setShowAdd(false)} className="rounded-lg border border-border px-4 py-2 text-sm text-slate-400 hover:text-white transition">Cancel</button>
                <button
                  onClick={handleAdd} disabled={saving || !form.from || !form.to}
                  className="rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-50 px-5 py-2 text-sm font-semibold text-white transition"
                >
                  {saving ? "Submitting…" : "Submit Request"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
