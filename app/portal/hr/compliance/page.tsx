"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";
import { cn } from "@/lib/cn";
import {
  AlertTriangle, CheckCircle2, Clock, X, ShieldCheck, RefreshCw,
} from "lucide-react";

// ─── Types & Mock Data ────────────────────────────────────────────────────────

type CompStatus = "compliant" | "due-soon" | "overdue" | "not-started";

interface ComplianceRecord {
  employeeId: string;
  employee: string;
  dept: string;
  items: { req: string; status: CompStatus; completedDate?: string; dueDate: string }[];
}

const REQUIREMENTS = [
  "HIPAA Certification",
  "CPR / First Aid",
  "Background Check (Annual)",
  "Policy Acknowledgment",
  "Confidentiality Agreement",
  "Mandatory Reporter Training",
  "Sexual Harassment Prevention",
];

// Due dates reference
const today = "Jul 14, 2025";
const INITIAL_DATA: ComplianceRecord[] = [
  {
    employeeId: "s1", employee: "Marcus Johnson", dept: "Client Services",
    items: [
      { req: REQUIREMENTS[0], status: "compliant", completedDate: "Jan 5, 2025",  dueDate: "Jan 5, 2026" },
      { req: REQUIREMENTS[1], status: "due-soon",  dueDate: "Aug 1, 2025" },
      { req: REQUIREMENTS[2], status: "compliant", completedDate: "Mar 1, 2025",  dueDate: "Mar 1, 2026" },
      { req: REQUIREMENTS[3], status: "compliant", completedDate: "Jan 5, 2025",  dueDate: "Jan 5, 2026" },
      { req: REQUIREMENTS[4], status: "compliant", completedDate: "Mar 1, 2022",  dueDate: "N/A" },
      { req: REQUIREMENTS[5], status: "overdue",   dueDate: "Jun 30, 2025" },
      { req: REQUIREMENTS[6], status: "compliant", completedDate: "Feb 10, 2025", dueDate: "Feb 10, 2026" },
    ],
  },
  {
    employeeId: "s2", employee: "Priya Sharma", dept: "Operations",
    items: [
      { req: REQUIREMENTS[0], status: "compliant", completedDate: "Dec 10, 2024", dueDate: "Dec 10, 2025" },
      { req: REQUIREMENTS[1], status: "compliant", completedDate: "Apr 5, 2025",  dueDate: "Apr 5, 2027" },
      { req: REQUIREMENTS[2], status: "compliant", completedDate: "Jul 15, 2024", dueDate: "Jul 15, 2025" },
      { req: REQUIREMENTS[3], status: "compliant", completedDate: "Dec 10, 2024", dueDate: "Dec 10, 2025" },
      { req: REQUIREMENTS[4], status: "compliant", completedDate: "Jul 15, 2021", dueDate: "N/A" },
      { req: REQUIREMENTS[5], status: "compliant", completedDate: "Nov 20, 2024", dueDate: "Nov 20, 2025" },
      { req: REQUIREMENTS[6], status: "due-soon",  dueDate: "Jul 31, 2025" },
    ],
  },
  {
    employeeId: "s3", employee: "Devon Clarke", dept: "Client Services",
    items: [
      { req: REQUIREMENTS[0], status: "compliant", completedDate: "Feb 1, 2025",  dueDate: "Feb 1, 2026" },
      { req: REQUIREMENTS[1], status: "overdue",   dueDate: "May 1, 2025" },
      { req: REQUIREMENTS[2], status: "overdue",   dueDate: "Jun 1, 2025" },
      { req: REQUIREMENTS[3], status: "compliant", completedDate: "Jan 20, 2023", dueDate: "Jan 20, 2024" },
      { req: REQUIREMENTS[4], status: "compliant", completedDate: "Jan 20, 2023", dueDate: "N/A" },
      { req: REQUIREMENTS[5], status: "overdue",   dueDate: "Jun 1, 2025" },
      { req: REQUIREMENTS[6], status: "compliant", completedDate: "Jan 25, 2025", dueDate: "Jan 25, 2026" },
    ],
  },
  {
    employeeId: "s4", employee: "Sandra Nguyen", dept: "Technology",
    items: [
      { req: REQUIREMENTS[0], status: "compliant", completedDate: "Oct 5, 2024",  dueDate: "Oct 5, 2025" },
      { req: REQUIREMENTS[1], status: "not-started", dueDate: "Sep 30, 2025" },
      { req: REQUIREMENTS[2], status: "compliant", completedDate: "Sep 5, 2024",  dueDate: "Sep 5, 2025" },
      { req: REQUIREMENTS[3], status: "compliant", completedDate: "Sep 5, 2023",  dueDate: "Sep 5, 2024" },
      { req: REQUIREMENTS[4], status: "compliant", completedDate: "Sep 5, 2023",  dueDate: "N/A" },
      { req: REQUIREMENTS[5], status: "compliant", completedDate: "Oct 12, 2024", dueDate: "Oct 12, 2025" },
      { req: REQUIREMENTS[6], status: "compliant", completedDate: "Oct 12, 2024", dueDate: "Oct 12, 2025" },
    ],
  },
  {
    employeeId: "s5", employee: "James Thornton", dept: "Finance",
    items: [
      { req: REQUIREMENTS[0], status: "compliant", completedDate: "Jan 3, 2025",  dueDate: "Jan 3, 2026" },
      { req: REQUIREMENTS[1], status: "compliant", completedDate: "Mar 20, 2025", dueDate: "Mar 20, 2027" },
      { req: REQUIREMENTS[2], status: "compliant", completedDate: "May 10, 2025", dueDate: "May 10, 2026" },
      { req: REQUIREMENTS[3], status: "compliant", completedDate: "Jan 3, 2025",  dueDate: "Jan 3, 2026" },
      { req: REQUIREMENTS[4], status: "compliant", completedDate: "May 10, 2020", dueDate: "N/A" },
      { req: REQUIREMENTS[5], status: "compliant", completedDate: "Jan 15, 2025", dueDate: "Jan 15, 2026" },
      { req: REQUIREMENTS[6], status: "compliant", completedDate: "Feb 5, 2025",  dueDate: "Feb 5, 2026" },
    ],
  },
  {
    employeeId: "s6", employee: "Aaliyah Brooks", dept: "Human Resources",
    items: [
      { req: REQUIREMENTS[0], status: "compliant", completedDate: "Mar 1, 2025",  dueDate: "Mar 1, 2026" },
      { req: REQUIREMENTS[1], status: "not-started", dueDate: "Aug 31, 2025" },
      { req: REQUIREMENTS[2], status: "compliant", completedDate: "Feb 12, 2025", dueDate: "Feb 12, 2026" },
      { req: REQUIREMENTS[3], status: "compliant", completedDate: "Feb 12, 2024", dueDate: "Feb 12, 2025" },
      { req: REQUIREMENTS[4], status: "compliant", completedDate: "Feb 12, 2024", dueDate: "N/A" },
      { req: REQUIREMENTS[5], status: "compliant", completedDate: "Mar 1, 2025",  dueDate: "Mar 1, 2026" },
      { req: REQUIREMENTS[6], status: "due-soon",  dueDate: "Jul 25, 2025" },
    ],
  },
];

type FilterView = "all" | "overdue" | "due-soon" | "compliant" | "not-started";

const STATUS_STYLES: Record<CompStatus, string> = {
  compliant:     "bg-emerald-900/40 text-emerald-400 border-emerald-700/40",
  "due-soon":    "bg-amber-900/40 text-amber-400 border-amber-700/40",
  overdue:       "bg-red-900/40 text-red-400 border-red-700/40",
  "not-started": "bg-slate-700/40 text-slate-400 border-slate-600/40",
};

const STATUS_ICON: Record<CompStatus, JSX.Element> = {
  compliant:     <CheckCircle2 size={13} className="text-emerald-400" />,
  "due-soon":    <Clock size={13} className="text-amber-400" />,
  overdue:       <AlertTriangle size={13} className="text-red-400" />,
  "not-started": <div className="h-3 w-3 rounded-full border border-slate-600" />,
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function CompliancePage() {
  const [data, setData] = useState<ComplianceRecord[]>(INITIAL_DATA);
  const [filter, setFilter] = useState<FilterView>("all");
  const [completing, setCompleting] = useState<string | null>(null);

  const allCells = data.flatMap(d => d.items);
  const overdueCount   = allCells.filter(c => c.status === "overdue").length;
  const dueSoonCount   = allCells.filter(c => c.status === "due-soon").length;
  const compliantCount = allCells.filter(c => c.status === "compliant").length;
  const totalCount     = allCells.length;
  const compliancePct  = Math.round((compliantCount / totalCount) * 100);

  function markComplete(employeeId: string, req: string) {
    const key = `${employeeId}:${req}`;
    setCompleting(key);
    setTimeout(() => {
      setData(prev => prev.map(d => {
        if (d.employeeId !== employeeId) return d;
        return {
          ...d,
          items: d.items.map(item =>
            item.req === req
              ? { ...item, status: "compliant", completedDate: today }
              : item
          ),
        };
      }));
      setCompleting(null);
    }, 700);
  }

  const filteredData = useMemo(() => {
    if (filter === "all") return data;
    return data.map(d => ({
      ...d,
      items: d.items.filter(item => item.status === filter),
    })).filter(d => d.items.length > 0);
  }, [data, filter]);

  const TABS: { key: FilterView; label: string; count?: number }[] = [
    { key: "all",         label: "All" },
    { key: "overdue",     label: "Overdue",   count: overdueCount },
    { key: "due-soon",    label: "Due Soon",  count: dueSoonCount },
    { key: "compliant",   label: "Compliant", count: compliantCount },
    { key: "not-started", label: "Not Started" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Compliance Tracking</h1>
          <p className="mt-1 text-sm text-slate-400">Monitor required certifications, training, and policy acknowledgments</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-emerald-700/40 bg-emerald-900/20 px-4 py-2">
          <ShieldCheck size={16} className="text-emerald-400" />
          <span className="text-sm font-bold text-emerald-400">{compliancePct}% Compliant</span>
        </div>
      </div>

      {/* Alert banner */}
      {overdueCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-xl border border-red-700/40 bg-red-900/20 px-4 py-3"
        >
          <AlertTriangle size={15} className="text-red-400 shrink-0" />
          <span className="text-sm text-red-300">
            <span className="font-bold">{overdueCount} overdue compliance item{overdueCount > 1 ? "s" : ""}</span> require immediate attention.
          </span>
        </motion.div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Overall %",    value: `${compliancePct}%`, color: "text-emerald-400" },
          { label: "Overdue",      value: overdueCount,        color: "text-red-400" },
          { label: "Due Soon",     value: dueSoonCount,        color: "text-amber-400" },
          { label: "Compliant",    value: compliantCount,      color: "text-emerald-400" },
        ].map(({ label, value, color }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <GlowCard className="p-4">
              <div className={cn("text-2xl font-extrabold", color)}>{value}</div>
              <div className="mt-0.5 text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</div>
            </GlowCard>
          </motion.div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-semibold transition border",
              filter === t.key
                ? "border-amber-500 bg-amber-600 text-white"
                : "border-border bg-slate-800/40 text-slate-400 hover:text-white"
            )}
          >
            {t.label}{t.count !== undefined ? ` (${t.count})` : ""}
          </button>
        ))}
      </div>

      {/* Compliance Grid */}
      <div className="space-y-4">
        {filteredData.map(row => (
          <GlowCard key={row.employeeId} className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-bold text-white">{row.employee}</div>
                <div className="text-xs text-slate-400">{row.dept}</div>
              </div>
              <div className="text-xs text-slate-400">
                {row.items.filter(i => i.status === "compliant").length}/{row.items.length} compliant
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {row.items.map(item => {
                const key = `${row.employeeId}:${item.req}`;
                return (
                  <div
                    key={item.req}
                    className={cn(
                      "flex items-start justify-between gap-2 rounded-lg border p-3",
                      STATUS_STYLES[item.status]
                    )}
                  >
                    <div className="flex items-start gap-2 min-w-0">
                      <span className="mt-0.5 shrink-0">{STATUS_ICON[item.status]}</span>
                      <div className="min-w-0">
                        <div className="truncate text-xs font-semibold text-white">{item.req}</div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {item.status === "compliant" && item.completedDate
                            ? `Done: ${item.completedDate}`
                            : `Due: ${item.dueDate}`}
                        </div>
                      </div>
                    </div>
                    {item.status !== "compliant" && (
                      <button
                        onClick={() => markComplete(row.employeeId, item.req)}
                        disabled={completing === key}
                        title="Mark Complete"
                        className="shrink-0 rounded-md p-1 text-slate-400 hover:text-emerald-400 hover:bg-emerald-900/30 transition disabled:opacity-50"
                      >
                        {completing === key ? <RefreshCw size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </GlowCard>
        ))}
        {filteredData.length === 0 && (
          <div className="py-12 text-center text-sm text-slate-500">No compliance items match the selected filter.</div>
        )}
      </div>
    </div>
  );
}
