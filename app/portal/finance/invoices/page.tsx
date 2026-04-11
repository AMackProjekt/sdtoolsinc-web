"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  FileText, DollarSign, AlertCircle, CheckCircle, Clock, X, PlusCircle, Download, Send, Filter
} from "lucide-react";
import { GlowCard } from "@/components/ui/GlowCard";
import { cn } from "@/lib/cn";

type InvoiceStatus = "Paid" | "Pending" | "Overdue" | "Draft";

interface Invoice {
  id: number;
  ref: string;
  vendor: string;
  description: string;
  amount: number;
  dueDate: string;
  issuedDate: string;
  status: InvoiceStatus;
}

const INITIAL_INVOICES: Invoice[] = [
  { id: 1, ref: "INV-3041", vendor: "Adobe Inc.", description: "Software License — Creative Suite Annual", amount: 8400, dueDate: "2025-06-20", issuedDate: "2025-06-01", status: "Pending" },
  { id: 2, ref: "INV-3040", vendor: "DataSay Consulting", description: "IT Consulting — May Hours", amount: 3200, dueDate: "2025-06-15", issuedDate: "2025-05-31", status: "Overdue" },
  { id: 3, ref: "INV-3039", vendor: "Premier Catering Co.", description: "Board Meeting Catering — Q2", amount: 1850, dueDate: "2025-06-10", issuedDate: "2025-05-28", status: "Paid" },
  { id: 4, ref: "INV-3038", vendor: "SecureAudit Group", description: "Annual Security Audit — Phase 1", amount: 12000, dueDate: "2025-07-01", issuedDate: "2025-06-05", status: "Pending" },
  { id: 5, ref: "INV-3037", vendor: "CloudHost Corp", description: "Hosting & CDN — June", amount: 640, dueDate: "2025-06-30", issuedDate: "2025-06-01", status: "Draft" },
  { id: 6, ref: "INV-3036", vendor: "Office Depot Supply", description: "Office Supplies Bulk Order", amount: 425, dueDate: "2025-05-30", issuedDate: "2025-05-15", status: "Paid" },
];

const STATUS_CONFIG: Record<InvoiceStatus, { icon: React.ComponentType<{ className?: string }>, color: string, bg: string }> = {
  Paid: { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/20" },
  Pending: { icon: Clock, color: "text-amber-400", bg: "bg-amber-500/20" },
  Overdue: { icon: AlertCircle, color: "text-red-400", bg: "bg-red-500/20" },
  Draft: { icon: FileText, color: "text-slate-400", bg: "bg-slate-500/20" },
};

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [statusFilter, setStatusFilter] = useState<"All" | InvoiceStatus>("All");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ vendor: "", description: "", amount: "", dueDate: "", status: "Draft" as InvoiceStatus });

  const filtered = useMemo(() => {
    if (statusFilter === "All") return invoices;
    return invoices.filter(i => i.status === statusFilter);
  }, [invoices, statusFilter]);

  const totalPaid = invoices.filter(i => i.status === "Paid").reduce((s, i) => s + i.amount, 0);
  const totalPending = invoices.filter(i => i.status === "Pending").reduce((s, i) => s + i.amount, 0);
  const totalOverdue = invoices.filter(i => i.status === "Overdue").reduce((s, i) => s + i.amount, 0);

  function markPaid(id: number) {
    setInvoices(prev => prev.map(i => i.id === id ? { ...i, status: "Paid" } : i));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const n = invoices.length;
    setInvoices(prev => [...prev, {
      id: Date.now(),
      ref: `INV-${3042 + n}`,
      vendor: form.vendor,
      description: form.description,
      amount: Number(form.amount),
      dueDate: form.dueDate,
      issuedDate: new Date().toISOString().slice(0, 10),
      status: form.status,
    }]);
    setShowModal(false);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-text">Invoices</h1>
          <p className="text-sm text-muted">Track vendor invoices, approvals, and payments</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-lg border border-border bg-panel px-3 py-2 text-sm text-muted hover:text-text transition-colors">
            <Download className="h-4 w-4" /> Export
          </button>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400 transition-colors">
            <PlusCircle className="h-4 w-4" /> Create Invoice
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlowCard className="p-5 flex items-center gap-4">
          <div className="rounded-xl bg-emerald-500/10 p-3"><CheckCircle className="h-6 w-6 text-emerald-400" /></div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">Paid</p>
            <p className="mt-0.5 text-2xl font-extrabold text-emerald-400">{fmt(totalPaid)}</p>
          </div>
        </GlowCard>
        <GlowCard className="p-5 flex items-center gap-4">
          <div className="rounded-xl bg-amber-500/10 p-3"><Clock className="h-6 w-6 text-amber-400" /></div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">Pending</p>
            <p className="mt-0.5 text-2xl font-extrabold text-amber-400">{fmt(totalPending)}</p>
          </div>
        </GlowCard>
        <GlowCard className="p-5 flex items-center gap-4">
          <div className="rounded-xl bg-red-500/10 p-3"><AlertCircle className="h-6 w-6 text-red-400" /></div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">Overdue</p>
            <p className="mt-0.5 text-2xl font-extrabold text-red-400">{fmt(totalOverdue)}</p>
          </div>
        </GlowCard>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="h-4 w-4 text-muted" />
        {(["All", "Paid", "Pending", "Overdue", "Draft"] as const).map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
            statusFilter === s ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" : "bg-panel border border-border text-muted hover:text-text"
          )}>{s}</button>
        ))}
      </div>

      {/* Invoice list */}
      <div className="space-y-3">
        {filtered.map((inv, i) => {
          const S = STATUS_CONFIG[inv.status];
          return (
            <motion.div
              key={inv.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlowCard className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="rounded-xl bg-emerald-500/10 p-2.5">
                      <FileText className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-muted">{inv.ref}</span>
                        <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold", S.bg, S.color)}>
                          <S.icon className="h-3 w-3" />{inv.status}
                        </span>
                      </div>
                      <p className="font-semibold text-text">{inv.vendor}</p>
                      <p className="text-xs text-muted">{inv.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xs text-muted">Amount</p>
                      <p className="text-lg font-extrabold text-text">{fmt(inv.amount)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted">Due</p>
                      <p className="text-sm font-semibold text-text">{inv.dueDate}</p>
                    </div>
                    <div className="flex gap-2">
                      {inv.status !== "Paid" && (
                        <button onClick={() => markPaid(inv.id)} className="flex items-center gap-1 rounded-lg bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/30 transition-colors">
                          <CheckCircle className="h-3.5 w-3.5" /> Mark Paid
                        </button>
                      )}
                      <button className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted hover:text-text transition-colors">
                        <Send className="h-3.5 w-3.5" /> Send
                      </button>
                    </div>
                  </div>
                </div>
              </GlowCard>
            </motion.div>
          );
        })}
        {filtered.length === 0 && (
          <GlowCard className="p-8 text-center">
            <p className="text-muted">No invoices match the selected filter.</p>
          </GlowCard>
        )}
      </div>

      {/* Create Invoice Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-md rounded-2xl border border-border bg-panel p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-text">Create Invoice</h2>
              <button onClick={() => setShowModal(false)} className="rounded-lg p-1.5 text-muted hover:text-text transition-colors"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-muted">Vendor / Client</label>
                <input required value={form.vendor} onChange={e => setForm(p => ({ ...p, vendor: e.target.value }))} className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-emerald-500/60 focus:outline-none" placeholder="Vendor name" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-muted">Description</label>
                <input required value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-emerald-500/60 focus:outline-none" placeholder="Invoice description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-muted">Amount ($)</label>
                  <input required type="number" min="0" step="0.01" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-emerald-500/60 focus:outline-none" placeholder="0.00" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-muted">Due Date</label>
                  <input type="date" value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-emerald-500/60 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-muted">Status</label>
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as InvoiceStatus }))} className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-emerald-500/60 focus:outline-none">
                  <option value="Draft">Draft</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="rounded-lg border border-border px-4 py-2 text-sm text-muted hover:text-text transition-colors">Cancel</button>
                <button type="submit" className="rounded-lg bg-emerald-500 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-400 transition-colors">Create Invoice</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
