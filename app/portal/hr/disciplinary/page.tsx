"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";
import { cn } from "@/lib/cn";
import {
  ShieldAlert, AlertTriangle, X, ChevronDown, ChevronUp,
  Plus, Calendar, User, FileText, CheckCircle2, Target,
  TriangleAlert, Scale, EyeOff, RefreshCw,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ActionType = "Verbal Warning" | "Written Warning" | "PIP" | "Final Written Warning" | "Suspension" | "Termination Notice";
type RecordStatus = "Open" | "Active" | "Resolved" | "Closed" | "Appealed";

interface DiscRecord {
  id: string;
  employee: string;
  employeeId: string;
  dept: string;
  supervisor: string;
  date: string;
  actionType: ActionType;
  category: string;
  description: string;
  witnesses: string;
  status: RecordStatus;
  confidential: boolean;
  resolution?: string;
  resolutionDate?: string;
}

interface PIPGoal {
  id: string;
  goal: string;
  targetDate: string;
  checkIns: { date: string; status: "met" | "partial" | "missed" }[];
}

interface PIPRecord {
  employeeId: string;
  employee: string;
  dept: string;
  supervisor: string;
  startDate: string;
  reviewDate: string;
  status: "Active" | "Completed" | "Extended" | "Escalated";
  goals: PIPGoal[];
  notes: string;
}

interface HRMatter {
  id: string;
  date: string;
  type: "Complaint" | "Investigation" | "Policy Violation" | "Status Change" | "Accommodation";
  subject: string;
  involvedParties: string;
  description: string;
  status: "Open" | "Under Review" | "Resolved" | "Closed";
  assignedTo: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INITIAL_RECORDS: DiscRecord[] = [
  {
    id: "d1", employee: "Devon Clarke", employeeId: "s3", dept: "Client Services",
    supervisor: "Marcus Johnson", date: "Apr 12, 2025",
    actionType: "Written Warning", category: "Attendance / Tardiness",
    description: "Employee has been late to shift 7 times in the past 60 days, exceeding the 3-occurrence policy threshold. Prior verbal warning was issued on Feb 28, 2025.",
    witnesses: "Marcus Johnson (Supervisor)", status: "Open", confidential: false,
  },
  {
    id: "d2", employee: "Tyler Reed", employeeId: "s7", dept: "Client Services",
    supervisor: "Marcus Johnson", date: "Mar 3, 2025",
    actionType: "Verbal Warning", category: "Attendance / Tardiness",
    description: "Employee arrived 20 minutes late on three separate occasions without advance notice during the first month of employment.",
    witnesses: "N/A", status: "Resolved", confidential: false,
    resolution: "Employee acknowledged and has maintained punctuality since.", resolutionDate: "Apr 15, 2025",
  },
  {
    id: "d3", employee: "Carlos Vega", employeeId: "s9", dept: "Operations",
    supervisor: "Priya Sharma", date: "May 8, 2025",
    actionType: "Verbal Warning", category: "Documentation Quality",
    description: "Multiple client intake forms were submitted with missing required fields and inconsistent data, resulting in backlog and call-back work for the team.",
    witnesses: "Priya Sharma (Supervisor)", status: "Open", confidential: false,
  },
  {
    id: "d4", employee: "Marcus Johnson", employeeId: "s1", dept: "Client Services",
    supervisor: "Program Director", date: "Feb 14, 2025",
    actionType: "PIP", category: "Performance Below Standard",
    description: "Case load metrics for Q4 2024 fell 22% below department benchmarks. Supervisor coaching sessions on Jan 10 and Feb 1 did not produce the expected improvement.",
    witnesses: "HR Representative (Aaliyah Brooks)", status: "Active", confidential: true,
  },
  {
    id: "d5", employee: "Naomi Luckett", employeeId: "s10", dept: "Client Services",
    supervisor: "Marcus Johnson", date: "Jan 20, 2025",
    actionType: "Written Warning", category: "Workplace Conflict",
    description: "Following a formal complaint from a peer, investigation confirmed a pattern of dismissive and disrespectful communication during team meetings.",
    witnesses: "James Thornton, HR (Aaliyah Brooks)", status: "Closed", confidential: true,
    resolution: "Employee completed conflict resolution coaching. No further incidents.", resolutionDate: "Mar 10, 2025",
  },
];

const PIP_DATA: PIPRecord[] = [
  {
    employeeId: "s1", employee: "Marcus Johnson", dept: "Client Services",
    supervisor: "Program Director", startDate: "Feb 14, 2025", reviewDate: "May 14, 2025",
    status: "Active",
    notes: "30/60/90-day check-ins scheduled. Employee has shown moderate improvement in April.",
    goals: [
      {
        id: "g1", goal: "Maintain case load at or above 95% of department benchmark for 60 consecutive days",
        targetDate: "Apr 15, 2025",
        checkIns: [
          { date: "Mar 15, 2025", status: "partial" },
          { date: "Apr 15, 2025", status: "met" },
        ],
      },
      {
        id: "g2", goal: "Complete case documentation within 24 hours of client contact, verified by supervisor review",
        targetDate: "May 14, 2025",
        checkIns: [
          { date: "Mar 15, 2025", status: "missed" },
          { date: "Apr 15, 2025", status: "partial" },
        ],
      },
      {
        id: "g3", goal: "Attend all scheduled team meetings and contribute at least one agenda item per meeting",
        targetDate: "May 14, 2025",
        checkIns: [
          { date: "Mar 15, 2025", status: "met" },
          { date: "Apr 15, 2025", status: "met" },
        ],
      },
    ],
  },
];

const HR_MATTERS: HRMatter[] = [
  {
    id: "m1", date: "Jan 15, 2025", type: "Complaint",
    subject: "Alleged hostile team environment – Client Services",
    involvedParties: "Naomi Luckett (complainant), Marcus Johnson (team)",
    description: "Formal complaint filed via anonymous tip line citing dismissive behavior in team settings.",
    status: "Resolved", assignedTo: "Aaliyah Brooks",
  },
  {
    id: "m2", date: "Mar 18, 2025", type: "Investigation",
    subject: "Potential HIPAA breach — unauthorized record access",
    involvedParties: "Under review — staff role TBD",
    description: "Audit flagged an access log anomaly on Mar 12. IT and HR conducting joint review.",
    status: "Under Review", assignedTo: "Aaliyah Brooks + IT Dept",
  },
  {
    id: "m3", date: "Apr 30, 2025", type: "Status Change",
    subject: "Leave — Extended Medical — Devon Clarke",
    involvedParties: "Devon Clarke",
    description: "Employee requested and was granted extended medical leave through Jun 30, 2025. FMLA paperwork submitted.",
    status: "Closed", assignedTo: "HR File",
  },
  {
    id: "m4", date: "May 20, 2025", type: "Accommodation",
    subject: "ADA Accommodation Request — Sandra Nguyen",
    involvedParties: "Sandra Nguyen",
    description: "Employee submitted formal request for ergonomic equipment and adjusted remote schedule for recurring RSI.",
    status: "Open", assignedTo: "Aaliyah Brooks",
  },
];

// ─── Styles ───────────────────────────────────────────────────────────────────

const ACTION_BADGE: Record<ActionType, string> = {
  "Verbal Warning":        "bg-amber-900/40 text-amber-400 border border-amber-700/30",
  "Written Warning":       "bg-orange-900/40 text-orange-400 border border-orange-700/30",
  "PIP":                   "bg-red-900/40 text-red-400 border border-red-700/30",
  "Final Written Warning": "bg-red-900/60 text-red-300 border border-red-600/60",
  "Suspension":            "bg-purple-900/40 text-purple-400 border border-purple-700/30",
  "Termination Notice":    "bg-red-800/60 text-red-200 border border-red-500/60",
};

const STATUS_BADGE: Record<RecordStatus, string> = {
  Open:     "bg-amber-900/40 text-amber-400",
  Active:   "bg-red-900/40 text-red-400",
  Resolved: "bg-emerald-900/40 text-emerald-400",
  Closed:   "bg-slate-700/40 text-slate-400",
  Appealed: "bg-purple-900/40 text-purple-400",
};

const MATTER_STATUS_BADGE: Record<string, string> = {
  "Open":         "bg-amber-900/40 text-amber-400",
  "Under Review": "bg-sky-900/40 text-sky-400",
  "Resolved":     "bg-emerald-900/40 text-emerald-400",
  "Closed":       "bg-slate-700/40 text-slate-400",
};

const CHECKIN_BADGE: Record<"met" | "partial" | "missed", string> = {
  met:     "bg-emerald-900/40 text-emerald-400",
  partial: "bg-amber-900/40 text-amber-400",
  missed:  "bg-red-900/40 text-red-400",
};

// ─── Blank form ───────────────────────────────────────────────────────────────

const BLANK: Omit<DiscRecord, "id"> = {
  employee: "", employeeId: "", dept: "Client Services", supervisor: "",
  date: "", actionType: "Verbal Warning", category: "Attendance / Tardiness",
  description: "", witnesses: "", status: "Open", confidential: false,
};

const EMPLOYEES = [
  "Marcus Johnson", "Priya Sharma", "Devon Clarke", "Sandra Nguyen",
  "James Thornton", "Aaliyah Brooks", "Tyler Reed", "Fatima Ali", "Carlos Vega", "Naomi Luckett",
];

const CATEGORIES = [
  "Attendance / Tardiness", "Performance Below Standard", "Documentation Quality",
  "Workplace Conflict", "Policy Violation", "Insubordination", "Code of Conduct",
  "HIPAA / Compliance Breach", "Other",
];

type TabView = "log" | "pip" | "matters";

// ─── Component ────────────────────────────────────────────────────────────────

export default function DisciplinaryPage() {
  const [records, setRecords] = useState<DiscRecord[]>(INITIAL_RECORDS);
  const [activeTab, setActiveTab] = useState<TabView>("log");
  const [showAdd, setShowAdd] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<DiscRecord, "id">>({ ...BLANK });
  const [saving, setSaving] = useState(false);

  const openCases    = records.filter(r => r.status === "Open" || r.status === "Active").length;
  const activePIPs   = PIP_DATA.filter(p => p.status === "Active").length;
  const resolvedQtr  = records.filter(r => r.status === "Resolved" || r.status === "Closed").length;

  function handleSubmit() {
    if (!form.employee || !form.description || !form.date) return;
    setSaving(true);
    setTimeout(() => {
      setRecords(prev => [...prev, { ...form, id: `d${Date.now()}` }]);
      setSaving(false);
      setShowAdd(false);
      setForm({ ...BLANK });
    }, 700);
  }

  function resolveRecord(id: string) {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: "Resolved", resolutionDate: "Jul 14, 2025" } : r));
  }

  return (
    <div className="p-6 space-y-6">
      {/* Confidentiality Banner */}
      <div className="flex items-center gap-3 rounded-xl border border-amber-700/40 bg-amber-900/20 px-5 py-3.5">
        <EyeOff size={16} className="shrink-0 text-amber-400" />
        <p className="text-sm text-amber-200">
          <span className="font-bold">Confidential HR Records.</span>{" "}
          Access to disciplinary files is restricted to HR personnel and authorized supervisors only.
        </p>
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Disciplinary & HR Matters</h1>
          <p className="mt-1 text-sm text-slate-400">Manage disciplinary actions, PIPs, and formal HR matters</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 rounded-lg bg-amber-600 hover:bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition"
        >
          <Plus size={15} />
          Log Incident
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Open Cases",             value: openCases,         color: "text-amber-400" },
          { label: "Active PIPs",            value: activePIPs,        color: "text-red-400" },
          { label: "Resolved / Closed",      value: resolvedQtr,       color: "text-emerald-400" },
          { label: "Total Records",          value: records.length,    color: "text-white" },
        ].map(({ label, value, color }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <GlowCard className="p-4">
              <div className={cn("text-2xl font-extrabold", color)}>{value}</div>
              <div className="mt-0.5 text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</div>
            </GlowCard>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-border bg-slate-900/40 p-1 w-fit">
        {([["log", "Disciplinary Log"], ["pip", "PIP Tracking"], ["matters", "HR Matters"]] as [TabView, string][]).map(([tab, label]) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-semibold transition",
              activeTab === tab ? "bg-amber-600 text-white" : "text-slate-400 hover:text-white"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Disciplinary Log Tab ── */}
      {activeTab === "log" && (
        <div className="space-y-3">
          {records.map(r => (
            <GlowCard key={r.id} className="p-0 overflow-hidden">
              <button
                className="flex w-full items-start gap-4 px-5 py-4 text-left hover:bg-slate-800/20 transition"
                onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-900/30 mt-0.5">
                  <ShieldAlert size={15} className="text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-bold text-white">{r.employee}</span>
                    {r.confidential && (
                      <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold bg-purple-900/40 text-purple-400 border border-purple-700/30">
                        <EyeOff size={10} /> Confidential
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", ACTION_BADGE[r.actionType])}>
                      {r.actionType}
                    </span>
                    <span className="text-xs text-slate-400">{r.category}</span>
                    <span className="text-xs text-slate-500">·</span>
                    <span className="flex items-center gap-1 text-xs text-slate-400"><Calendar size={11} />{r.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", STATUS_BADGE[r.status])}>{r.status}</span>
                  {expandedId === r.id ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
                </div>
              </button>

              <AnimatePresence>
                {expandedId === r.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}
                    className="overflow-hidden border-t border-border"
                  >
                    <div className="px-5 py-4 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">Supervisor</div>
                          <div className="text-slate-300">{r.supervisor}</div>
                        </div>
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">Department</div>
                          <div className="text-slate-300">{r.dept}</div>
                        </div>
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">Witnesses</div>
                          <div className="text-slate-300">{r.witnesses || "None"}</div>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">Description</div>
                        <p className="text-sm text-slate-300 leading-relaxed">{r.description}</p>
                      </div>
                      {r.resolution && (
                        <div className="rounded-lg border border-emerald-700/30 bg-emerald-900/20 p-3">
                          <div className="flex items-center gap-1.5 mb-1 text-xs font-semibold text-emerald-400">
                            <CheckCircle2 size={12} /> Resolution ({r.resolutionDate})
                          </div>
                          <p className="text-sm text-slate-300">{r.resolution}</p>
                        </div>
                      )}
                      {(r.status === "Open" || r.status === "Active") && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => resolveRecord(r.id)}
                            className="rounded-lg bg-emerald-700/40 hover:bg-emerald-700/60 border border-emerald-700/40 px-3 py-1.5 text-xs font-semibold text-emerald-400 transition"
                          >
                            Mark Resolved
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlowCard>
          ))}
        </div>
      )}

      {/* ── PIP Tracking Tab ── */}
      {activeTab === "pip" && (
        <div className="space-y-4">
          {PIP_DATA.map(pip => (
            <GlowCard key={pip.employeeId} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-900/30">
                    <Target size={16} className="text-red-400" />
                  </div>
                  <div>
                    <div className="font-bold text-white">{pip.employee}</div>
                    <div className="text-xs text-slate-400">{pip.dept} · Supervisor: {pip.supervisor}</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                  <span className={cn("rounded-full px-2.5 py-0.5 font-semibold", pip.status === "Active" ? "bg-red-900/40 text-red-400" : "bg-emerald-900/40 text-emerald-400")}>{pip.status}</span>
                  <span className="flex items-center gap-1"><Calendar size={11} />Start: {pip.startDate}</span>
                  <span className="flex items-center gap-1"><Calendar size={11} />Review: {pip.reviewDate}</span>
                </div>
              </div>

              <div className="space-y-4">
                {pip.goals.map((goal, gi) => (
                  <div key={goal.id} className="rounded-xl border border-border bg-slate-900/40 p-4">
                    <div className="flex items-start gap-2 mb-3">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-900/40 text-xs font-bold text-amber-400 mt-0.5">{gi + 1}</span>
                      <div>
                        <p className="text-sm font-semibold text-white leading-snug">{goal.goal}</p>
                        <p className="text-xs text-slate-400 mt-0.5">Target: {goal.targetDate}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {goal.checkIns.map(ci => (
                        <div key={ci.date} className={cn("flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold", CHECKIN_BADGE[ci.status])}>
                          <Calendar size={10} />
                          {ci.date} — <span className="capitalize">{ci.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {pip.notes && (
                <div className="mt-4 rounded-lg border border-slate-700/40 bg-slate-800/30 p-3">
                  <div className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">HR Notes</div>
                  <p className="text-sm text-slate-300">{pip.notes}</p>
                </div>
              )}
            </GlowCard>
          ))}
          {PIP_DATA.length === 0 && (
            <GlowCard className="py-12 text-center">
              <p className="text-slate-500 text-sm">No active PIPs on file.</p>
            </GlowCard>
          )}
        </div>
      )}

      {/* ── HR Matters Tab ── */}
      {activeTab === "matters" && (
        <div className="space-y-3">
          {HR_MATTERS.map(m => (
            <GlowCard key={m.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-900/30">
                    <Scale size={15} className="text-sky-400" />
                  </div>
                  <div>
                    <div className="font-bold text-white">{m.subject}</div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="rounded-full px-2 py-0.5 text-xs font-semibold bg-slate-700/40 text-slate-300 border border-slate-600/30">{m.type}</span>
                      <span className="flex items-center gap-1 text-xs text-slate-400"><Calendar size={11} />{m.date}</span>
                    </div>
                  </div>
                </div>
                <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", MATTER_STATUS_BADGE[m.status])}>{m.status}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <span className="text-xs text-slate-500 uppercase tracking-widest">Involved Parties: </span>
                  <span className="text-slate-300">{m.involvedParties}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 uppercase tracking-widest">Assigned To: </span>
                  <span className="text-slate-300">{m.assignedTo}</span>
                </div>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">{m.description}</p>
            </GlowCard>
          ))}
        </div>
      )}

      {/* ── Add Incident Modal ── */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-panel p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-white">Log Disciplinary Incident</h2>
                <button onClick={() => setShowAdd(false)} className="rounded-lg p-2 text-slate-400 hover:text-white transition"><X size={18} /></button>
              </div>
              <p className="text-xs text-amber-400 mb-5 flex items-center gap-1.5"><TriangleAlert size={12} /> This record is stored in the confidential HR file.</p>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-400">Employee *</label>
                    <select
                      value={form.employee}
                      onChange={e => setForm({ ...form, employee: e.target.value })}
                      className="w-full rounded-lg border border-border bg-slate-800/60 px-3 py-2 text-sm text-text focus:outline-none focus:border-amber-500"
                    >
                      <option value="">Select employee…</option>
                      {EMPLOYEES.map(e => <option key={e}>{e}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-400">Incident Date *</label>
                    <input
                      type="text" placeholder="e.g. Jul 14, 2025"
                      value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                      className="w-full rounded-lg border border-border bg-slate-800/60 px-3 py-2 text-sm text-text focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-400">Action Type</label>
                    <select
                      value={form.actionType}
                      onChange={e => setForm({ ...form, actionType: e.target.value as ActionType })}
                      className="w-full rounded-lg border border-border bg-slate-800/60 px-3 py-2 text-sm text-text focus:outline-none focus:border-amber-500"
                    >
                      {(["Verbal Warning", "Written Warning", "PIP", "Final Written Warning", "Suspension", "Termination Notice"] as ActionType[]).map(t => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-400">Category</label>
                    <select
                      value={form.category}
                      onChange={e => setForm({ ...form, category: e.target.value })}
                      className="w-full rounded-lg border border-border bg-slate-800/60 px-3 py-2 text-sm text-text focus:outline-none focus:border-amber-500"
                    >
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-400">Supervisor</label>
                    <input
                      type="text" placeholder="Supervisor name"
                      value={form.supervisor} onChange={e => setForm({ ...form, supervisor: e.target.value })}
                      className="w-full rounded-lg border border-border bg-slate-800/60 px-3 py-2 text-sm text-text focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-400">Witnesses</label>
                    <input
                      type="text" placeholder="Names of witnesses, or N/A"
                      value={form.witnesses} onChange={e => setForm({ ...form, witnesses: e.target.value })}
                      className="w-full rounded-lg border border-border bg-slate-800/60 px-3 py-2 text-sm text-text focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-400">Description *</label>
                  <textarea
                    rows={4} placeholder="Describe the incident in detail, including dates, prior discussions, and policy references…"
                    value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                    className="w-full rounded-lg border border-border bg-slate-800/60 px-3 py-2 text-sm text-text focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.confidential}
                    onChange={e => setForm({ ...form, confidential: e.target.checked })}
                    className="h-4 w-4 rounded accent-amber-500"
                  />
                  <span className="text-sm text-slate-300">Mark as confidential (restricted access)</span>
                </label>
              </div>

              <div className="mt-5 flex justify-end gap-3">
                <button onClick={() => setShowAdd(false)} className="rounded-lg border border-border px-4 py-2 text-sm text-slate-400 hover:text-white transition">Cancel</button>
                <button
                  onClick={handleSubmit}
                  disabled={saving || !form.employee || !form.description || !form.date}
                  className="flex items-center gap-2 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-50 px-5 py-2 text-sm font-semibold text-white transition"
                >
                  {saving && <RefreshCw size={14} className="animate-spin" />}
                  {saving ? "Saving…" : "Log Incident"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
