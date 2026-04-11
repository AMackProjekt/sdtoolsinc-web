"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Users, DollarSign, Download, Filter, PlayCircle, Clock, CheckCircle, X, PlusCircle } from "lucide-react";
import { GlowCard } from "@/components/ui/GlowCard";
import { cn } from "@/lib/cn";

type PayType = "Full-time" | "Part-time" | "Contractor";
type Department = "Operations" | "Technology" | "Personnel" | "Marketing" | "Facilities";

interface Employee {
  id: number;
  name: string;
  role: string;
  department: Department;
  salary: number;
  payType: PayType;
  lastPaidDate: string;
  ytdEarnings: number;
  status: "Active" | "On Leave";
}

const INITIAL_EMPLOYEES: Employee[] = [
  { id: 1, name: "Jordan Mitchell", role: "Operations Manager", department: "Operations", salary: 78000, payType: "Full-time", lastPaidDate: "2025-06-15", ytdEarnings: 39000, status: "Active" },
  { id: 2, name: "Sara Chen", role: "Lead Developer", department: "Technology", salary: 112000, payType: "Full-time", lastPaidDate: "2025-06-15", ytdEarnings: 56000, status: "Active" },
  { id: 3, name: "Marcus Thompson", role: "HR Director", department: "Personnel", salary: 90000, payType: "Full-time", lastPaidDate: "2025-06-15", ytdEarnings: 45000, status: "Active" },
  { id: 4, name: "Priya Patel", role: "Marketing Specialist", department: "Marketing", salary: 65000, payType: "Full-time", lastPaidDate: "2025-06-15", ytdEarnings: 32500, status: "Active" },
  { id: 5, name: "Derek Williams", role: "Facilities Coordinator", department: "Facilities", salary: 52000, payType: "Full-time", lastPaidDate: "2025-06-15", ytdEarnings: 26000, status: "On Leave" },
  { id: 6, name: "Alicia Romero", role: "Data Analyst", department: "Technology", salary: 85000, payType: "Full-time", lastPaidDate: "2025-06-15", ytdEarnings: 42500, status: "Active" },
  { id: 7, name: "Kevin Park", role: "Social Media Manager", department: "Marketing", salary: 58000, payType: "Part-time", lastPaidDate: "2025-06-15", ytdEarnings: 14500, status: "Active" },
  { id: 8, name: "Linda Foster", role: "IT Consultant", department: "Technology", salary: 0, payType: "Contractor", lastPaidDate: "2025-06-01", ytdEarnings: 28000, status: "Active" },
];

const DEPARTMENTS: ("All" | Department)[] = ["All", "Operations", "Technology", "Personnel", "Marketing", "Facilities"];

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export default function PayrollPage() {
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [deptFilter, setDeptFilter] = useState<"All" | Department>("All");
  const [runSuccess, setRunSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", department: "Operations" as Department, salary: "", payType: "Full-time" as PayType });

  const filtered = useMemo(() => {
    if (deptFilter === "All") return employees;
    return employees.filter(e => e.department === deptFilter);
  }, [employees, deptFilter]);

  const totalAnnual = employees.filter(e => e.payType !== "Contractor").reduce((s, e) => s + e.salary, 0);
  const totalYTD = employees.reduce((s, e) => s + e.ytdEarnings, 0);
  const activeCount = employees.filter(e => e.status === "Active").length;

  function handleRunPayroll() {
    setRunSuccess(true);
    setTimeout(() => setRunSuccess(false), 3000);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmployees(prev => [...prev, {
      id: Date.now(),
      name: form.name,
      role: form.role,
      department: form.department,
      salary: Number(form.salary),
      payType: form.payType,
      lastPaidDate: "—",
      ytdEarnings: 0,
      status: "Active",
    }]);
    setShowModal(false);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-text">Payroll</h1>
          <p className="text-sm text-muted">Staff compensation, pay cycles, and YTD summaries</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-lg border border-border bg-panel px-3 py-2 text-sm text-muted hover:text-text transition-colors">
            <Download className="h-4 w-4" /> Export
          </button>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-300 hover:bg-emerald-500/20 transition-colors">
            <PlusCircle className="h-4 w-4" /> Add Employee
          </button>
          <button onClick={handleRunPayroll} className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400 transition-colors">
            <PlayCircle className="h-4 w-4" />{runSuccess ? "Payroll Queued!" : "Run Payroll"}
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlowCard className="p-5 flex items-center gap-4">
          <div className="rounded-xl bg-emerald-500/10 p-3"><Users className="h-6 w-6 text-emerald-400" /></div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">Active Staff</p>
            <p className="mt-0.5 text-2xl font-extrabold text-text">{activeCount}</p>
          </div>
        </GlowCard>
        <GlowCard className="p-5 flex items-center gap-4">
          <div className="rounded-xl bg-emerald-500/10 p-3"><DollarSign className="h-6 w-6 text-emerald-400" /></div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">Annual Payroll</p>
            <p className="mt-0.5 text-2xl font-extrabold text-text">{fmt(totalAnnual)}</p>
          </div>
        </GlowCard>
        <GlowCard className="p-5 flex items-center gap-4">
          <div className="rounded-xl bg-emerald-500/10 p-3"><Clock className="h-6 w-6 text-emerald-400" /></div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">YTD Disbursed</p>
            <p className="mt-0.5 text-2xl font-extrabold text-text">{fmt(totalYTD)}</p>
          </div>
        </GlowCard>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="h-4 w-4 text-muted" />
        {DEPARTMENTS.map(d => (
          <button key={d} onClick={() => setDeptFilter(d)} className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
            deptFilter === d ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" : "bg-panel border border-border text-muted hover:text-text"
          )}>{d}</button>
        ))}
      </div>

      {/* Table */}
      <GlowCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-panel/50">
                <th className="px-5 py-3 font-semibold text-muted">Name</th>
                <th className="px-5 py-3 font-semibold text-muted">Role</th>
                <th className="px-5 py-3 font-semibold text-muted">Department</th>
                <th className="px-5 py-3 font-semibold text-muted">Type</th>
                <th className="px-5 py-3 font-semibold text-muted text-right">Salary / Rate</th>
                <th className="px-5 py-3 font-semibold text-muted text-right">YTD Earnings</th>
                <th className="px-5 py-3 font-semibold text-muted">Last Paid</th>
                <th className="px-5 py-3 font-semibold text-muted">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e, i) => (
                <motion.tr
                  key={e.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-border/60 hover:bg-panel/40 transition-colors"
                >
                  <td className="px-5 py-3 font-semibold text-text">{e.name}</td>
                  <td className="px-5 py-3 text-muted">{e.role}</td>
                  <td className="px-5 py-3 text-muted">{e.department}</td>
                  <td className="px-5 py-3">
                    <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold",
                      e.payType === "Full-time" ? "bg-emerald-500/20 text-emerald-300" :
                      e.payType === "Part-time" ? "bg-amber-500/20 text-amber-300" :
                      "bg-blue-500/20 text-blue-300"
                    )}>{e.payType}</span>
                  </td>
                  <td className="px-5 py-3 text-right font-semibold text-text">{e.salary ? fmt(e.salary) : "Contract"}</td>
                  <td className="px-5 py-3 text-right text-emerald-400 font-semibold">{fmt(e.ytdEarnings)}</td>
                  <td className="px-5 py-3 text-muted font-mono text-xs">{e.lastPaidDate}</td>
                  <td className="px-5 py-3">
                    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
                      e.status === "Active" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                    )}>
                      {e.status === "Active" ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      {e.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-border/60 px-5 py-3 text-xs text-muted">{filtered.length} employees</div>
      </GlowCard>

      {/* Add Employee Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-md rounded-2xl border border-border bg-panel p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-text">Add Employee</h2>
              <button onClick={() => setShowModal(false)} className="rounded-lg p-1.5 text-muted hover:text-text transition-colors"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-muted">Full Name</label>
                <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-emerald-500/60 focus:outline-none" placeholder="First Last" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-muted">Role / Title</label>
                <input required value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-emerald-500/60 focus:outline-none" placeholder="Job title" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-muted">Department</label>
                  <select value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value as Department }))} className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-emerald-500/60 focus:outline-none">
                    {(["Operations", "Technology", "Personnel", "Marketing", "Facilities"] as Department[]).map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-muted">Pay Type</label>
                  <select value={form.payType} onChange={e => setForm(p => ({ ...p, payType: e.target.value as PayType }))} className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-emerald-500/60 focus:outline-none">
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contractor">Contractor</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-muted">Annual Salary ($)</label>
                <input type="number" min="0" value={form.salary} onChange={e => setForm(p => ({ ...p, salary: e.target.value }))} className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-emerald-500/60 focus:outline-none" placeholder="0 for contractors" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="rounded-lg border border-border px-4 py-2 text-sm text-muted hover:text-text transition-colors">Cancel</button>
                <button type="submit" className="rounded-lg bg-emerald-500 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-400 transition-colors">Add Employee</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
