"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  UserCog, Search, ChevronDown, Eye, Users, BarChart2,
  AlertCircle, CheckCircle2, TrendingUp, ClipboardList, UserCheck,
} from "lucide-react";
import { cn } from "@/lib/cn";

// ─── Types ────────────────────────────────────────────────────────────────────

type EmpStatus = "Active" | "On Leave" | "Departed";
type Department = "All" | "Case Management" | "IT" | "Administration" | "Programs" | "Outreach";
type ClientStatus = "Active" | "Inactive" | "Crisis";
type Program = "Case Management" | "Crisis Support" | "Housing" | "Employment";

interface Employee {
  id: string;
  name: string;
  role: string;
  department: Exclude<Department, "All">;
  startDate: string;
  status: EmpStatus;
  email: string;
}

interface CaseAssignment {
  clientId: string;
  clientName: string;
  clientStatus: ClientStatus;
  managerId: string;
  managerName: string;
  program: Program;
  assignedDate: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const EMPLOYEES: Employee[] = [
  { id: "1",  name: "Aaliyah Torres",   role: "Case Manager II",        department: "Case Management", startDate: "2023-03-12", status: "Active",   email: "atorres@sdtoolsinc.org" },
  { id: "2",  name: "Marcus Chen",      role: "Systems Administrator",  department: "IT",              startDate: "2022-08-01", status: "Active",   email: "mchen@sdtoolsinc.org" },
  { id: "3",  name: "Destiny Brown",    role: "Program Coordinator",    department: "Programs",        startDate: "2023-11-07", status: "Active",   email: "dbrown@sdtoolsinc.org" },
  { id: "4",  name: "Jordan Williams",  role: "Outreach Specialist",    department: "Outreach",        startDate: "2024-01-15", status: "Active",   email: "jwilliams@sdtoolsinc.org" },
  { id: "5",  name: "Elijah Roberts",   role: "Executive Assistant",    department: "Administration",  startDate: "2024-02-20", status: "Active",   email: "eroberts@sdtoolsinc.org" },
  { id: "6",  name: "Simone Hayward",   role: "Case Manager I",         department: "Case Management", startDate: "2023-06-18", status: "On Leave", email: "shayward@sdtoolsinc.org" },
  { id: "7",  name: "Derek Okafor",     role: "IT Support Specialist",  department: "IT",              startDate: "2021-05-03", status: "Active",   email: "dokafor@sdtoolsinc.org" },
  { id: "8",  name: "Naomi Luckett",    role: "Outreach Lead",          department: "Outreach",        startDate: "2022-01-10", status: "Active",   email: "nluckett@sdtoolsinc.org" },
  { id: "9",  name: "Tyrese Fountain",  role: "Program Director",       department: "Programs",        startDate: "2020-09-14", status: "Active",   email: "tfountain@sdtoolsinc.org" },
  { id: "10", name: "Brianna Keith",    role: "Office Manager",         department: "Administration",  startDate: "2019-11-01", status: "Departed", email: "bkeith@sdtoolsinc.org" },
];

const CASELOAD: CaseAssignment[] = [
  { clientId: "c01", clientName: "Aaliyah Brooks",   clientStatus: "Active",   managerId: "cm1", managerName: "Marcus Rivera",  program: "Case Management",  assignedDate: "2025-01-14" },
  { clientId: "c02", clientName: "Jerome Mitchell",  clientStatus: "Crisis",   managerId: "cm1", managerName: "Marcus Rivera",  program: "Crisis Support",   assignedDate: "2025-03-02" },
  { clientId: "c03", clientName: "Destiny Chang",    clientStatus: "Active",   managerId: "cm2", managerName: "Yolanda Tran",   program: "Housing",          assignedDate: "2025-02-07" },
  { clientId: "c04", clientName: "Raymond Flores",   clientStatus: "Inactive", managerId: "cm2", managerName: "Yolanda Tran",   program: "Employment",       assignedDate: "2024-11-20" },
  { clientId: "c05", clientName: "Sasha Monroe",     clientStatus: "Active",   managerId: "cm2", managerName: "Yolanda Tran",   program: "Case Management",  assignedDate: "2025-01-30" },
  { clientId: "c06", clientName: "Liam Patterson",   clientStatus: "Active",   managerId: "cm3", managerName: "Devon Okafor",   program: "Employment",       assignedDate: "2025-02-18" },
  { clientId: "c07", clientName: "Nadia Kozlov",     clientStatus: "Crisis",   managerId: "cm3", managerName: "Devon Okafor",   program: "Crisis Support",   assignedDate: "2025-04-01" },
  { clientId: "c08", clientName: "Theo Williams",    clientStatus: "Active",   managerId: "cm4", managerName: "Priya Nair",     program: "Housing",          assignedDate: "2025-01-05" },
  { clientId: "c09", clientName: "Camille Dubois",   clientStatus: "Active",   managerId: "cm4", managerName: "Priya Nair",     program: "Case Management",  assignedDate: "2025-03-15" },
  { clientId: "c10", clientName: "Isaac Osei",       clientStatus: "Inactive", managerId: "cm4", managerName: "Priya Nair",     program: "Employment",       assignedDate: "2024-12-10" },
];

const CASE_MANAGERS = [
  { id: "cm1", name: "Marcus Rivera",  title: "Case Manager II" },
  { id: "cm2", name: "Yolanda Tran",   title: "Case Manager I" },
  { id: "cm3", name: "Devon Okafor",   title: "Case Manager II" },
  { id: "cm4", name: "Priya Nair",     title: "Case Manager I" },
];

// ─── Style maps ───────────────────────────────────────────────────────────────

const EMP_STATUS_COLOR: Record<EmpStatus, string> = {
  "Active":   "bg-green-500/20 text-green-300",
  "On Leave": "bg-yellow-500/20 text-yellow-300",
  "Departed": "bg-slate-600/40 text-slate-400",
};

const CLIENT_STATUS_COLOR: Record<ClientStatus, string> = {
  Active:   "bg-emerald-500/20 text-emerald-300",
  Inactive: "bg-slate-600/40 text-slate-400",
  Crisis:   "bg-rose-500/20 text-rose-300",
};

const DEPARTMENTS: Department[] = ["All", "Case Management", "IT", "Administration", "Programs", "Outreach"];

// ─── Sub-components ───────────────────────────────────────────────────────────

function Avatar({ name, size = 8 }: { name: string; size?: number }) {
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div
      className={cn(
        "rounded-full bg-violet-700/40 border border-violet-500/30 flex items-center justify-center text-xs font-bold text-violet-200 shrink-0",
        size === 10 ? "h-10 w-10" : "h-8 w-8"
      )}
    >
      {initials}
    </div>
  );
}

function KpiCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div className={cn("rounded-xl border p-4", color)}>
      <p className="text-xs font-semibold uppercase tracking-widest text-muted">{label}</p>
      <p className="mt-1 text-3xl font-extrabold tracking-tight text-text">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-muted">{sub}</p>}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function PersonnelPage() {
  const [tab, setTab] = useState<"directory" | "caseload">("directory");

  // Directory state
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState<Department>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | EmpStatus>("All");

  const filteredEmployees = useMemo(() => EMPLOYEES.filter((e) => {
    const q = search.toLowerCase();
    return (
      (e.name.toLowerCase().includes(q) || e.role.toLowerCase().includes(q) || e.email.toLowerCase().includes(q)) &&
      (dept === "All" || e.department === dept) &&
      (statusFilter === "All" || e.status === statusFilter)
    );
  }), [search, dept, statusFilter]);

  // Caseload analytics derived data
  const caseloadByManager = useMemo(() =>
    CASE_MANAGERS.map((cm) => {
      const clients = CASELOAD.filter((c) => c.managerId === cm.id);
      const active   = clients.filter((c) => c.clientStatus === "Active").length;
      const inactive = clients.filter((c) => c.clientStatus === "Inactive").length;
      const crisis   = clients.filter((c) => c.clientStatus === "Crisis").length;
      const programs = [...new Set(clients.map((c) => c.program))];
      return { ...cm, clients, total: clients.length, active, inactive, crisis, programs };
    }),
    []
  );

  const totalClients  = CASELOAD.length;
  const totalActive   = CASELOAD.filter((c) => c.clientStatus === "Active").length;
  const totalCrisis   = CASELOAD.filter((c) => c.clientStatus === "Crisis").length;
  const avgCaseload   = (totalClients / CASE_MANAGERS.length).toFixed(1);

  return (
    <div className="space-y-6 p-6">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-gradient-to-r from-violet-900/50 to-slate-900/40 p-6"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-violet-600/20 p-3 border border-violet-500/30">
            <UserCog className="h-6 w-6 text-violet-300" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-text">Personnel</h1>
            <p className="text-sm text-muted mt-0.5">
              {EMPLOYEES.filter((e) => e.status !== "Departed").length} active staff · {CASE_MANAGERS.length} case managers
            </p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 rounded-full bg-violet-500/10 px-3 py-1 border border-violet-500/20">
            <Users className="h-3.5 w-3.5 text-violet-400" />
            <span className="text-xs font-semibold text-violet-300">{EMPLOYEES.length} Total</span>
          </div>
        </div>
      </motion.div>

      {/* ── Tab switcher ────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex gap-1 rounded-xl border border-border bg-panel p-1 w-fit"
      >
        {[
          { key: "directory", label: "Directory",         icon: Users },
          { key: "caseload",  label: "Caseload Analytics", icon: BarChart2 },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key as "directory" | "caseload")}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition",
              tab === key
                ? "bg-violet-600/30 text-violet-200 border border-violet-500/30"
                : "text-muted hover:text-text"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </motion.div>

      {/* ══════════════════════════════════════════════════════════════════
          DIRECTORY TAB
      ══════════════════════════════════════════════════════════════════ */}
      {tab === "directory" && (
        <>
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="flex flex-wrap gap-3"
          >
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, role, email…"
                className="w-full rounded-lg border border-border bg-panel pl-9 pr-4 py-2.5 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-violet-500/40"
              />
            </div>
            <div className="relative">
              <select
                value={dept}
                onChange={(e) => setDept(e.target.value as Department)}
                className="appearance-none rounded-lg border border-border bg-panel pl-3 pr-8 py-2.5 text-sm text-text focus:outline-none focus:ring-1 focus:ring-violet-500/40 cursor-pointer"
              >
                {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted" />
            </div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as "All" | EmpStatus)}
                className="appearance-none rounded-lg border border-border bg-panel pl-3 pr-8 py-2.5 text-sm text-text focus:outline-none focus:ring-1 focus:ring-violet-500/40 cursor-pointer"
              >
                {["All", "Active", "On Leave", "Departed"].map((s) => <option key={s}>{s}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="rounded-2xl border border-border bg-panel overflow-hidden"
          >
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-white/[0.02]">
                  <th className="px-5 py-3.5 font-semibold text-muted">Employee</th>
                  <th className="px-5 py-3.5 font-semibold text-muted hidden md:table-cell">Department</th>
                  <th className="px-5 py-3.5 font-semibold text-muted hidden lg:table-cell">Start Date</th>
                  <th className="px-5 py-3.5 font-semibold text-muted">Status</th>
                  <th className="px-5 py-3.5 font-semibold text-muted text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-muted text-sm">No employees match your filters.</td>
                  </tr>
                ) : (
                  filteredEmployees.map((emp, i) => (
                    <motion.tr
                      key={emp.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="border-b border-border/50 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={emp.name} />
                          <div>
                            <p className="font-semibold text-text">{emp.name}</p>
                            <p className="text-xs text-muted">{emp.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-muted hidden md:table-cell">{emp.department}</td>
                      <td className="px-5 py-4 text-muted hidden lg:table-cell">{emp.startDate}</td>
                      <td className="px-5 py-4">
                        <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", EMP_STATUS_COLOR[emp.status])}>
                          {emp.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-muted hover:text-text hover:border-violet-500/40 transition">
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="px-5 py-3 border-t border-border/50 text-xs text-muted">
              Showing {filteredEmployees.length} of {EMPLOYEES.length} employees
            </div>
          </motion.div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          CASELOAD ANALYTICS TAB
      ══════════════════════════════════════════════════════════════════ */}
      {tab === "caseload" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="space-y-6"
        >
          {/* Summary KPIs */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <KpiCard label="Total Clients"    value={totalClients} sub="across all managers"   color="border-border bg-panel" />
            <KpiCard label="Active"           value={totalActive}  sub="currently enrolled"    color="border-emerald-700/40 bg-emerald-900/10" />
            <KpiCard label="Crisis Flags"     value={totalCrisis}  sub="need immediate action" color="border-rose-700/40 bg-rose-900/10" />
            <KpiCard label="Avg Caseload"     value={avgCaseload}  sub="clients per manager"   color="border-sky-700/40 bg-sky-900/10" />
          </div>

          {/* Per-manager cards */}
          <div className="grid gap-4 md:grid-cols-2">
            {caseloadByManager.map((cm, i) => {
              const maxBar = Math.max(...caseloadByManager.map((m) => m.total), 1);
              return (
                <motion.div
                  key={cm.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.06 }}
                  className="rounded-2xl border border-border bg-panel p-5 space-y-4"
                >
                  {/* Manager header */}
                  <div className="flex items-center gap-3">
                    <Avatar name={cm.name} size={10} />
                    <div className="flex-1">
                      <p className="font-bold text-text">{cm.name}</p>
                      <p className="text-xs text-muted">{cm.title}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-extrabold text-text">{cm.total}</p>
                      <p className="text-xs text-muted">clients</p>
                    </div>
                  </div>

                  {/* Caseload bar */}
                  <div>
                    <div className="mb-1 flex items-center justify-between text-xs text-muted">
                      <span>Caseload share</span>
                      <span>{Math.round((cm.total / (totalClients || 1)) * 100)}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/5">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-sky-400 transition-all"
                        style={{ width: `${(cm.total / maxBar) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Status breakdown */}
                  <div className="flex gap-3">
                    {[
                      { label: "Active",   count: cm.active,   color: "text-emerald-300" },
                      { label: "Inactive", count: cm.inactive, color: "text-slate-400" },
                      { label: "Crisis",   count: cm.crisis,   color: "text-rose-300" },
                    ].map(({ label, count, color }) => (
                      <div key={label} className="flex-1 rounded-lg border border-border bg-white/[0.03] p-2 text-center">
                        <p className={cn("text-lg font-extrabold", color)}>{count}</p>
                        <p className="text-[10px] font-semibold text-muted uppercase tracking-widest">{label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Programs */}
                  <div>
                    <p className="mb-1.5 text-xs font-semibold text-muted uppercase tracking-widest">Programs</p>
                    <div className="flex flex-wrap gap-1.5">
                      {cm.programs.map((p) => (
                        <span key={p} className="rounded-full bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 text-[11px] font-semibold text-sky-300">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Client list */}
                  <div>
                    <p className="mb-2 text-xs font-semibold text-muted uppercase tracking-widest">Assigned Clients</p>
                    <div className="space-y-1.5">
                      {cm.clients.map((client) => (
                        <div key={client.clientId} className="flex items-center justify-between rounded-lg border border-border/60 bg-white/[0.02] px-3 py-2">
                          <div>
                            <p className="text-sm font-semibold text-text">{client.clientName}</p>
                            <p className="text-[11px] text-muted">{client.program}</p>
                          </div>
                          <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold", CLIENT_STATUS_COLOR[client.clientStatus])}>
                            {client.clientStatus}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Assignment overview table */}
          <div className="rounded-2xl border border-border bg-panel overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-violet-400" />
              <h2 className="font-bold text-text">All Assignments</h2>
              <span className="ml-auto text-xs text-muted">{CASELOAD.length} total</span>
            </div>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-white/[0.02]">
                  <th className="px-5 py-3 font-semibold text-muted">Client</th>
                  <th className="px-5 py-3 font-semibold text-muted hidden md:table-cell">Case Manager</th>
                  <th className="px-5 py-3 font-semibold text-muted hidden lg:table-cell">Program</th>
                  <th className="px-5 py-3 font-semibold text-muted">Status</th>
                  <th className="px-5 py-3 font-semibold text-muted hidden xl:table-cell">Assigned</th>
                </tr>
              </thead>
              <tbody>
                {CASELOAD.map((c, i) => (
                  <motion.tr
                    key={c.clientId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-border/50 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-3 font-semibold text-text">{c.clientName}</td>
                    <td className="px-5 py-3 text-muted hidden md:table-cell">{c.managerName}</td>
                    <td className="px-5 py-3 text-muted hidden lg:table-cell">{c.program}</td>
                    <td className="px-5 py-3">
                      <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", CLIENT_STATUS_COLOR[c.clientStatus])}>
                        {c.clientStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-muted hidden xl:table-cell">{c.assignedDate}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
