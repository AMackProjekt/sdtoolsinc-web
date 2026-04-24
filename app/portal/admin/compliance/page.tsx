"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, ShieldX, Search } from "lucide-react";
import { cn } from "@/lib/cn";

type ComplianceStatus = "Compliant" | "Due Soon" | "Overdue";

interface ComplianceRecord {
  id: string;
  name: string;
  role: string;
  certification: string;
  completedDate: string | null;
  dueDate: string;
  status: ComplianceStatus;
}

const RECORDS: ComplianceRecord[] = [
  { id: "1",  name: "Aaliyah Torres",  role: "Case Manager II",       certification: "Mandated Reporter Training",    completedDate: "2025-11-10", dueDate: "2026-11-10", status: "Compliant" },
  { id: "2",  name: "Aaliyah Torres",  role: "Case Manager II",       certification: "HIPAA Refresher",               completedDate: "2026-01-05", dueDate: "2027-01-05", status: "Compliant" },
  { id: "3",  name: "Marcus Chen",     role: "Systems Administrator", certification: "Cybersecurity Awareness",        completedDate: "2025-09-20", dueDate: "2026-05-20", status: "Due Soon" },
  { id: "4",  name: "Destiny Brown",   role: "Program Coordinator",   certification: "First Aid / CPR",               completedDate: "2024-04-01", dueDate: "2026-04-01", status: "Overdue" },
  { id: "5",  name: "Jordan Williams", role: "Outreach Specialist",   certification: "Trauma-Informed Care",          completedDate: "2026-02-14", dueDate: "2027-02-14", status: "Compliant" },
  { id: "6",  name: "Elijah Roberts",  role: "Executive Assistant",   certification: "Data Privacy & Compliance",     completedDate: null,         dueDate: "2026-04-15", status: "Overdue" },
  { id: "7",  name: "Simone Hayward",  role: "Case Manager I",        certification: "Mandated Reporter Training",    completedDate: "2025-12-03", dueDate: "2026-12-03", status: "Compliant" },
  { id: "8",  name: "Derek Okafor",    role: "IT Support Specialist", certification: "Cybersecurity Awareness",        completedDate: "2026-03-01", dueDate: "2027-03-01", status: "Compliant" },
  { id: "9",  name: "Naomi Luckett",   role: "Outreach Lead",         certification: "First Aid / CPR",               completedDate: "2026-01-18", dueDate: "2028-01-18", status: "Compliant" },
  { id: "10", name: "Tyrese Fountain", role: "Program Director",      certification: "HIPAA Refresher",               completedDate: "2025-08-22", dueDate: "2026-05-01", status: "Due Soon" },
];

const STATUS_STYLE: Record<ComplianceStatus, { badge: string; icon: typeof ShieldCheck }> = {
  "Compliant": { badge: "bg-green-500/20 text-green-300",  icon: ShieldCheck },
  "Due Soon":  { badge: "bg-yellow-500/20 text-yellow-300", icon: ShieldAlert },
  "Overdue":   { badge: "bg-red-500/20 text-red-300",       icon: ShieldX },
};

const KPI_CARDS = [
  { label: "Total Requirements", value: RECORDS.length,                                         color: "text-text",         bg: "bg-white/[0.04]",       border: "border-border" },
  { label: "Compliant",          value: RECORDS.filter(r => r.status === "Compliant").length,   color: "text-green-400",    bg: "bg-green-500/10",       border: "border-green-500/20" },
  { label: "Due Soon",           value: RECORDS.filter(r => r.status === "Due Soon").length,    color: "text-yellow-400",   bg: "bg-yellow-500/10",      border: "border-yellow-500/20" },
  { label: "Overdue",            value: RECORDS.filter(r => r.status === "Overdue").length,     color: "text-red-400",      bg: "bg-red-500/10",         border: "border-red-500/20" },
];

export default function CompliancePage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | ComplianceStatus>("All");

  const filtered = RECORDS.filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.certification.toLowerCase().includes(search.toLowerCase()) ||
      r.role.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-gradient-to-r from-emerald-900/50 to-slate-900/40 p-6"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-emerald-600/20 p-3 border border-emerald-500/30">
            <ShieldCheck className="h-6 w-6 text-emerald-300" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-text">Compliance Tracker</h1>
            <p className="text-sm text-muted mt-0.5">Staff certification & training requirements</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 border border-emerald-500/20">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-300">
              {Math.round((RECORDS.filter(r => r.status === "Compliant").length / RECORDS.length) * 100)}% Compliant
            </span>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {KPI_CARDS.map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className={cn("rounded-xl border p-4", k.bg, k.border)}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">{k.label}</p>
            <p className={cn("mt-2 text-3xl font-extrabold tracking-tight", k.color)}>{k.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="flex flex-wrap gap-3"
      >
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, certification…"
            className="w-full rounded-lg border border-border bg-panel pl-9 pr-4 py-2.5 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
          />
        </div>
        <div className="flex gap-2">
          {(["All", "Compliant", "Due Soon", "Overdue"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "rounded-lg border px-3 py-2 text-xs font-semibold transition",
                statusFilter === s
                  ? "bg-emerald-600/20 border-emerald-500/40 text-emerald-300"
                  : "border-border bg-panel text-muted hover:text-text"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className="rounded-2xl border border-border bg-panel overflow-hidden"
      >
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-white/[0.02]">
              <th className="px-5 py-3.5 font-semibold text-muted">Staff Member</th>
              <th className="px-5 py-3.5 font-semibold text-muted hidden md:table-cell">Certification</th>
              <th className="px-5 py-3.5 font-semibold text-muted hidden lg:table-cell">Completed</th>
              <th className="px-5 py-3.5 font-semibold text-muted hidden lg:table-cell">Due Date</th>
              <th className="px-5 py-3.5 font-semibold text-muted">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-muted text-sm">No records match your filters.</td>
              </tr>
            ) : (
              filtered.map((rec, i) => {
                const { badge, icon: Icon } = STATUS_STYLE[rec.status];
                return (
                  <motion.tr
                    key={rec.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-border/50 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-text">{rec.name}</p>
                      <p className="text-xs text-muted">{rec.role}</p>
                    </td>
                    <td className="px-5 py-4 text-muted hidden md:table-cell">{rec.certification}</td>
                    <td className="px-5 py-4 text-muted hidden lg:table-cell">
                      {rec.completedDate ?? <span className="text-red-400/80">—</span>}
                    </td>
                    <td className="px-5 py-4 text-muted hidden lg:table-cell">{rec.dueDate}</td>
                    <td className="px-5 py-4">
                      <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold", badge)}>
                        <Icon className="h-3.5 w-3.5" />
                        {rec.status}
                      </span>
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
        <div className="px-5 py-3 border-t border-border/50 text-xs text-muted">
          Showing {filtered.length} of {RECORDS.length} records
        </div>
      </motion.div>
    </div>
  );
}
