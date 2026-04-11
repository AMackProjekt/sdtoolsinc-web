"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search, Filter, Download, PlusCircle, X, ArrowUpDown,
  CheckCircle, Clock, AlertCircle, XCircle
} from "lucide-react";
import { GlowCard } from "@/components/ui/GlowCard";
import { cn } from "@/lib/cn";

type Status = "Cleared" | "Pending" | "Void";
type Category = "Supplies" | "Technology" | "Services" | "Marketing" | "Facilities" | "Revenue";

interface Transaction {
  id: number;
  ref: string;
  description: string;
  category: Category;
  amount: number;
  type: "debit" | "credit";
  date: string;
  status: Status;
  account: string;
}

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 1, ref: "TXN-2841", description: "Office Supplies — Staples Order", category: "Supplies", amount: 342.50, type: "debit", date: "2025-06-18", status: "Cleared", account: "Operations" },
  { id: 2, ref: "TXN-2840", description: "Azure Cloud Services — June", category: "Technology", amount: 4820.00, type: "debit", date: "2025-06-17", status: "Cleared", account: "Technology" },
  { id: 3, ref: "TXN-2839", description: "Grant Reimbursement — Q2", category: "Revenue", amount: 12500.00, type: "credit", date: "2025-06-16", status: "Cleared", account: "Grants" },
  { id: 4, ref: "TXN-2838", description: "Marketing Agency — Campaign", category: "Marketing", amount: 3200.00, type: "debit", date: "2025-06-15", status: "Pending", account: "Marketing" },
  { id: 5, ref: "TXN-2837", description: "Building Maintenance — HVAC", category: "Facilities", amount: 1450.75, type: "debit", date: "2025-06-14", status: "Cleared", account: "Facilities" },
  { id: 6, ref: "TXN-2836", description: "Consulting Services — IT Audit", category: "Services", amount: 6800.00, type: "debit", date: "2025-06-13", status: "Cleared", account: "Technology" },
  { id: 7, ref: "TXN-2835", description: "Printer Paper — Bulk Order", category: "Supplies", amount: 215.00, type: "debit", date: "2025-06-12", status: "Void", account: "Operations" },
  { id: 8, ref: "TXN-2834", description: "Software License — Adobe CC", category: "Technology", amount: 599.88, type: "debit", date: "2025-06-11", status: "Cleared", account: "Technology" },
  { id: 9, ref: "TXN-2833", description: "Donations Received — Annual Drive", category: "Revenue", amount: 8750.00, type: "credit", date: "2025-06-10", status: "Cleared", account: "Donations" },
  { id: 10, ref: "TXN-2832", description: "Catering — Board Meeting", category: "Facilities", amount: 620.00, type: "debit", date: "2025-06-09", status: "Pending", account: "Operations" },
];

const STATUS_CONFIG: Record<Status, { icon: React.ComponentType<{ className?: string }>, color: string, bg: string }> = {
  Cleared: { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/20" },
  Pending: { icon: Clock, color: "text-amber-400", bg: "bg-amber-500/20" },
  Void: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/20" },
};

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | Status>("All");
  const [categoryFilter, setCategoryFilter] = useState<"All" | Category>("All");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ description: "", category: "Supplies" as Category, amount: "", type: "debit" as "debit" | "credit", date: "", status: "Pending" as Status, account: "" });

  const filtered = useMemo(() => {
    let list = transactions;
    if (search) list = list.filter(t => t.description.toLowerCase().includes(search.toLowerCase()) || t.ref.toLowerCase().includes(search.toLowerCase()));
    if (statusFilter !== "All") list = list.filter(t => t.status === statusFilter);
    if (categoryFilter !== "All") list = list.filter(t => t.category === categoryFilter);
    return [...list].sort((a, b) => sortDir === "desc" ? new Date(b.date).getTime() - new Date(a.date).getTime() : new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [transactions, search, statusFilter, categoryFilter, sortDir]);

  const totalCredits = filtered.filter(t => t.type === "credit" && t.status !== "Void").reduce((s, t) => s + t.amount, 0);
  const totalDebits = filtered.filter(t => t.type === "debit" && t.status !== "Void").reduce((s, t) => s + t.amount, 0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const entry: Transaction = {
      id: Date.now(),
      ref: `TXN-${Math.floor(2800 + Math.random() * 100)}`,
      description: form.description,
      category: form.category,
      amount: Number(form.amount),
      type: form.type,
      date: form.date || new Date().toISOString().slice(0, 10),
      status: form.status,
      account: form.account || form.category,
    };
    setTransactions(prev => [entry, ...prev]);
    setShowModal(false);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-text">Transactions</h1>
          <p className="text-sm text-muted">Full general ledger — search, filter, and export</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-lg border border-border bg-panel px-3 py-2 text-sm text-muted hover:text-text transition-colors">
            <Download className="h-4 w-4" /> Export CSV
          </button>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400 transition-colors">
            <PlusCircle className="h-4 w-4" /> Add Transaction
          </button>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Credits", value: fmt(totalCredits), color: "text-emerald-400" },
          { label: "Debits", value: fmt(totalDebits), color: "text-red-400" },
          { label: "Net", value: fmt(totalCredits - totalDebits), color: totalCredits - totalDebits >= 0 ? "text-emerald-400" : "text-red-400" },
        ].map(k => (
          <GlowCard key={k.label} className="p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">{k.label}</p>
            <p className={cn("mt-1 text-2xl font-extrabold tracking-tight", k.color)}>{k.value}</p>
          </GlowCard>
        ))}
      </div>

      {/* Filters */}
      <GlowCard className="p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search transactions..."
              className="w-full rounded-lg border border-border bg-bg pl-9 pr-3 py-2 text-sm text-text focus:border-emerald-500/60 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-1">
            <Filter className="h-4 w-4 text-muted" />
            {(["All", "Cleared", "Pending", "Void"] as const).map(s => (
              <button key={s} onClick={() => setStatusFilter(s)} className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
                statusFilter === s ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" : "bg-panel border border-border text-muted hover:text-text"
              )}>{s}</button>
            ))}
          </div>
          <button onClick={() => setSortDir(d => d === "desc" ? "asc" : "desc")} className="flex items-center gap-1 rounded-lg border border-border bg-panel px-3 py-2 text-xs text-muted hover:text-text transition-colors">
            <ArrowUpDown className="h-4 w-4" /> Date {sortDir === "desc" ? "↓" : "↑"}
          </button>
        </div>
      </GlowCard>

      {/* Table */}
      <GlowCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-panel/50">
                <th className="px-5 py-3 font-semibold text-muted">Ref</th>
                <th className="px-5 py-3 font-semibold text-muted">Description</th>
                <th className="px-5 py-3 font-semibold text-muted">Category</th>
                <th className="px-5 py-3 font-semibold text-muted">Date</th>
                <th className="px-5 py-3 font-semibold text-muted text-right">Amount</th>
                <th className="px-5 py-3 font-semibold text-muted">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => {
                const S = STATUS_CONFIG[t.status];
                return (
                  <motion.tr
                    key={t.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-border/60 hover:bg-panel/40 transition-colors"
                  >
                    <td className="px-5 py-3 font-mono text-xs text-muted">{t.ref}</td>
                    <td className="px-5 py-3 font-medium text-text">{t.description}</td>
                    <td className="px-5 py-3 text-muted">{t.category}</td>
                    <td className="px-5 py-3 text-muted">{t.date}</td>
                    <td className={cn("px-5 py-3 font-semibold text-right", t.type === "credit" ? "text-emerald-400" : "text-red-400")}>
                      {t.type === "credit" ? "+" : "−"}{fmt(t.amount)}
                    </td>
                    <td className="px-5 py-3">
                      <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold", S.bg, S.color)}>
                        <S.icon className="h-3 w-3" />{t.status}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-muted">No transactions match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t border-border/60 px-5 py-3 text-xs text-muted">{filtered.length} transactions</div>
      </GlowCard>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-lg rounded-2xl border border-border bg-panel p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-text">Add Transaction</h2>
              <button onClick={() => setShowModal(false)} className="rounded-lg p-1.5 text-muted hover:text-text transition-colors"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-muted">Description</label>
                <input required value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-emerald-500/60 focus:outline-none" placeholder="Transaction description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-muted">Category</label>
                  <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value as Category }))} className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-emerald-500/60 focus:outline-none">
                    {(["Supplies", "Technology", "Services", "Marketing", "Facilities", "Revenue"] as Category[]).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-muted">Type</label>
                  <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as "debit" | "credit" }))} className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-emerald-500/60 focus:outline-none">
                    <option value="debit">Debit (Expense)</option>
                    <option value="credit">Credit (Income)</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-muted">Amount ($)</label>
                  <input required type="number" min="0" step="0.01" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-emerald-500/60 focus:outline-none" placeholder="0.00" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-muted">Date</label>
                  <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-emerald-500/60 focus:outline-none" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="rounded-lg border border-border px-4 py-2 text-sm text-muted hover:text-text transition-colors">Cancel</button>
                <button type="submit" className="rounded-lg bg-emerald-500 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-400 transition-colors">Add Transaction</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
