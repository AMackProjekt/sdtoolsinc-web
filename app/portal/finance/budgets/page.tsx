"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusCircle, X, TrendingUp, DollarSign, AlertTriangle, CheckCircle,
  Filter, Download, BarChart2, Edit2, Trash2
} from "lucide-react";
import { GlowCard } from "@/components/ui/GlowCard";
import { cn } from "@/lib/cn";

const DEPARTMENTS = ["All", "Operations", "Technology", "Personnel", "Marketing", "Facilities"];

const INITIAL_BUDGETS = [
  { id: 1, category: "Operations", department: "Operations", allocated: 120000, spent: 87400, period: "FY 2025", notes: "Includes utilities, supplies, and maintenance contracts" },
  { id: 2, category: "Technology", department: "Technology", allocated: 95000, spent: 76200, period: "FY 2025", notes: "Cloud services, software licenses, hardware" },
  { id: 3, category: "Personnel", department: "Personnel", allocated: 200000, spent: 118500, period: "FY 2025", notes: "Salaries, benefits, and training" },
  { id: 4, category: "Marketing", department: "Marketing", allocated: 45000, spent: 19600, period: "FY 2025", notes: "Campaigns, events, and digital advertising" },
  { id: 5, category: "Facilities", department: "Facilities", allocated: 25000, spent: 10700, period: "FY 2025", notes: "Rent, cleaning, and building improvements" },
];

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function StatusBadge({ pct }: { pct: number }) {
  if (pct >= 90) return <span className="inline-flex items-center gap-1 rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-semibold text-red-400"><AlertTriangle className="h-3 w-3" />Over 90%</span>;
  if (pct >= 75) return <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-semibold text-amber-400"><TrendingUp className="h-3 w-3" />Warning</span>;
  return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-400"><CheckCircle className="h-3 w-3" />On Track</span>;
}

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState(INITIAL_BUDGETS);
  const [dept, setDept] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ category: "", department: "Operations", allocated: "", spent: "", period: "FY 2025", notes: "" });

  const filtered = useMemo(() => dept === "All" ? budgets : budgets.filter(b => b.department === dept), [budgets, dept]);

  const totalAllocated = filtered.reduce((s, b) => s + b.allocated, 0);
  const totalSpent = filtered.reduce((s, b) => s + b.spent, 0);
  const totalRemaining = totalAllocated - totalSpent;

  function openAdd() {
    setEditId(null);
    setForm({ category: "", department: "Operations", allocated: "", spent: "", period: "FY 2025", notes: "" });
    setShowModal(true);
  }

  function openEdit(b: typeof INITIAL_BUDGETS[0]) {
    setEditId(b.id);
    setForm({ category: b.category, department: b.department, allocated: String(b.allocated), spent: String(b.spent), period: b.period, notes: b.notes });
    setShowModal(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const entry = {
      id: editId ?? Date.now(),
      category: form.category,
      department: form.department,
      allocated: Number(form.allocated),
      spent: Number(form.spent),
      period: form.period,
      notes: form.notes,
    };
    if (editId) {
      setBudgets(prev => prev.map(b => b.id === editId ? entry : b));
    } else {
      setBudgets(prev => [...prev, entry]);
    }
    setShowModal(false);
  }

  function handleDelete(id: number) {
    setBudgets(prev => prev.filter(b => b.id !== id));
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-text">Budget Management</h1>
          <p className="text-sm text-muted">Track allocations, spending, and remaining balances by department</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-lg border border-border bg-panel px-3 py-2 text-sm text-muted hover:text-text transition-colors">
            <Download className="h-4 w-4" /> Export
          </button>
          <button onClick={openAdd} className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400 transition-colors">
            <PlusCircle className="h-4 w-4" /> Add Budget Line
          </button>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Total Allocated", value: fmt(totalAllocated), icon: DollarSign, color: "text-emerald-400" },
          { label: "Total Spent", value: fmt(totalSpent), icon: BarChart2, color: "text-amber-400" },
          { label: "Remaining", value: fmt(totalRemaining), icon: TrendingUp, color: totalRemaining < 0 ? "text-red-400" : "text-emerald-400" },
        ].map(k => (
          <GlowCard key={k.label} className="flex items-center gap-4 p-5">
            <div className={cn("rounded-xl p-3 bg-emerald-500/10", k.color)}>
              <k.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted">{k.label}</p>
              <p className={cn("text-2xl font-extrabold tracking-tight", k.color)}>{k.value}</p>
            </div>
          </GlowCard>
        ))}
      </div>

      {/* Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="h-4 w-4 text-muted" />
        {DEPARTMENTS.map(d => (
          <button key={d} onClick={() => setDept(d)} className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
            dept === d ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" : "bg-panel border border-border text-muted hover:text-text"
          )}>{d}</button>
        ))}
      </div>

      {/* Budget Table */}
      <GlowCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-panel/50">
                <th className="px-5 py-3 font-semibold text-muted">Category</th>
                <th className="px-5 py-3 font-semibold text-muted">Department</th>
                <th className="px-5 py-3 font-semibold text-muted">Allocated</th>
                <th className="px-5 py-3 font-semibold text-muted">Spent</th>
                <th className="px-5 py-3 font-semibold text-muted">Remaining</th>
                <th className="px-5 py-3 font-semibold text-muted">Utilization</th>
                <th className="px-5 py-3 font-semibold text-muted">Status</th>
                <th className="px-5 py-3 font-semibold text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, i) => {
                const pct = Math.round((b.spent / b.allocated) * 100);
                const remaining = b.allocated - b.spent;
                return (
                  <motion.tr
                    key={b.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b border-border/60 hover:bg-panel/40 transition-colors"
                  >
                    <td className="px-5 py-4 font-semibold text-text">{b.category}</td>
                    <td className="px-5 py-4 text-muted">{b.department}</td>
                    <td className="px-5 py-4 text-text">{fmt(b.allocated)}</td>
                    <td className="px-5 py-4 text-amber-400">{fmt(b.spent)}</td>
                    <td className={cn("px-5 py-4 font-semibold", remaining < 0 ? "text-red-400" : "text-emerald-400")}>{fmt(remaining)}</td>
                    <td className="px-5 py-4 w-40">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className={cn("h-full rounded-full transition-all", pct >= 90 ? "bg-red-500" : pct >= 75 ? "bg-amber-500" : "bg-emerald-500")}
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted w-9 text-right">{pct}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-4"><StatusBadge pct={pct} /></td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(b)} className="p-1.5 rounded-lg text-muted hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"><Edit2 className="h-3.5 w-3.5" /></button>
                        <button onClick={() => handleDelete(b.id)} className="p-1.5 rounded-lg text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlowCard>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="w-full max-w-lg rounded-2xl border border-border bg-panel p-6 shadow-2xl">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-text">{editId ? "Edit Budget Line" : "Add Budget Line"}</h2>
                <button onClick={() => setShowModal(false)} className="rounded-lg p-1.5 text-muted hover:text-text transition-colors"><X className="h-5 w-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-muted">Category</label>
                    <input required value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-emerald-500/60 focus:outline-none" placeholder="e.g. Software" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-muted">Department</label>
                    <select value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))} className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-emerald-500/60 focus:outline-none">
                      {DEPARTMENTS.filter(d => d !== "All").map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-muted">Allocated ($)</label>
                    <input required type="number" min="0" value={form.allocated} onChange={e => setForm(p => ({ ...p, allocated: e.target.value }))} className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-emerald-500/60 focus:outline-none" placeholder="0" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-muted">Spent ($)</label>
                    <input required type="number" min="0" value={form.spent} onChange={e => setForm(p => ({ ...p, spent: e.target.value }))} className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-emerald-500/60 focus:outline-none" placeholder="0" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-muted">Period</label>
                    <input value={form.period} onChange={e => setForm(p => ({ ...p, period: e.target.value }))} className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-emerald-500/60 focus:outline-none" placeholder="FY 2025" />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-muted">Notes</label>
                  <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={2} className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-emerald-500/60 focus:outline-none resize-none" placeholder="Optional notes..." />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="rounded-lg border border-border px-4 py-2 text-sm text-muted hover:text-text transition-colors">Cancel</button>
                  <button type="submit" className="rounded-lg bg-emerald-500 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-400 transition-colors">{editId ? "Save Changes" : "Add Budget"}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
