"use client";

import { GlowCard } from "@/components/ui/GlowCard";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Receipt,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/cn";

const KPIS = [
  { label: "Total Budget", value: "$485,000", icon: Wallet, change: "+2.4%", up: true, hint: "FY 2025 allocation" },
  { label: "YTD Spending", value: "$312,450", icon: TrendingUp, change: "+8.1%", up: false, hint: "64.4% of total budget" },
  { label: "Pending Invoices", value: "14", icon: Receipt, change: "-3", up: true, hint: "vs. last month" },
  { label: "Net Position", value: "$172,550", icon: DollarSign, change: "-5.7%", up: false, hint: "Remaining budget" },
];

const TRANSACTIONS = [
  { id: "TXN-2841", vendor: "Office Supplies Co.", category: "Operations", amount: -1240.0, date: "Jun 15", status: "cleared" },
  { id: "TXN-2840", vendor: "Azure Cloud Services", category: "Technology", amount: -4800.0, date: "Jun 14", status: "cleared" },
  { id: "TXN-2839", vendor: "Grant Reimbursement", category: "Income", amount: 15000.0, date: "Jun 13", status: "cleared" },
  { id: "TXN-2838", vendor: "Marketing Agency", category: "Marketing", amount: -2100.0, date: "Jun 12", status: "pending" },
  { id: "TXN-2837", vendor: "Building Maintenance", category: "Facilities", amount: -780.0, date: "Jun 11", status: "cleared" },
  { id: "TXN-2836", vendor: "Consulting Services", category: "Professional", amount: -3500.0, date: "Jun 10", status: "cleared" },
];

const BUDGETS = [
  { name: "Operations", allocated: 120000, spent: 87450, color: "bg-emerald-400" },
  { name: "Technology", allocated: 95000, spent: 76200, color: "bg-teal-400" },
  { name: "Personnel", allocated: 200000, spent: 118500, color: "bg-cyan-400" },
  { name: "Marketing", allocated: 45000, spent: 19600, color: "bg-sky-400" },
  { name: "Facilities", allocated: 25000, spent: 10700, color: "bg-blue-400" },
];

const PENDING_INVOICES = [
  { vendor: "Software License Renewal", amount: "$8,400", due: "Jun 20", days: 5, priority: "high" },
  { vendor: "Consultant Invoice #14", amount: "$3,200", due: "Jun 23", days: 8, priority: "medium" },
  { vendor: "Catering – Annual Gala", amount: "$1,850", due: "Jun 28", days: 13, priority: "low" },
  { vendor: "Security Audit Services", amount: "$12,000", due: "Jul 1", days: 16, priority: "medium" },
];

export default function FinanceDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-text">Finance Overview</h1>
        <p className="mt-1 text-sm text-muted">Fiscal Year 2025 · Updated {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {KPIS.map(({ label, value, icon: Icon, change, up, hint }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <GlowCard className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-900/50 text-emerald-400">
                  <Icon size={18} />
                </div>
                <span className={cn("flex items-center gap-0.5 text-xs font-semibold", up ? "text-emerald-400" : "text-red-400")}>
                  {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                  {change}
                </span>
              </div>
              <div className="mt-4 text-2xl font-extrabold tracking-tight text-text">{value}</div>
              <div className="mt-0.5 text-xs font-semibold uppercase tracking-widest text-muted">{label}</div>
              <div className="mt-1.5 text-xs text-muted/60">{hint}</div>
            </GlowCard>
          </motion.div>
        ))}
      </div>

      {/* Budget Allocation + Pending Invoices */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Budget allocation */}
        <GlowCard className="p-5">
          <h2 className="text-sm font-semibold text-text">Budget Allocation</h2>
          <p className="mb-4 mt-0.5 text-xs text-muted">Spending by department</p>
          <div className="space-y-4">
            {BUDGETS.map(({ name, allocated, spent, color }) => {
              const pct = Math.round((spent / allocated) * 100);
              return (
                <div key={name}>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="font-medium text-text">{name}</span>
                    <span className="text-muted">
                      ${spent.toLocaleString()} / ${allocated.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-700/40">
                    <div
                      className={cn("h-full rounded-full transition-all", color)}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="mt-1 text-right text-[11px] text-muted/60">{pct}%</div>
                </div>
              );
            })}
          </div>
        </GlowCard>

        {/* Pending invoices */}
        <GlowCard className="p-5">
          <h2 className="text-sm font-semibold text-text">Pending Invoices</h2>
          <p className="mb-4 mt-0.5 text-xs text-muted">Upcoming due dates</p>
          <div className="space-y-3">
            {PENDING_INVOICES.map(({ vendor, amount, due, days, priority }) => (
              <div key={vendor} className="flex items-center justify-between rounded-lg bg-slate-800/40 px-3 py-2.5">
                <div className="min-w-0 flex-1 pr-3">
                  <div className="truncate text-sm font-medium text-text">{vendor}</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Clock size={11} className="text-muted/40" />
                    <span className="text-xs text-muted">Due {due} · {days} days</span>
                  </div>
                </div>
                <div className="shrink-0 flex flex-col items-end gap-1">
                  <span className="text-sm font-bold text-text">{amount}</span>
                  <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                    priority === "high" ? "bg-red-900/40 text-red-400" :
                    priority === "medium" ? "bg-amber-900/40 text-amber-400" :
                    "bg-emerald-900/40 text-emerald-400"
                  )}>
                    {priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </GlowCard>
      </div>

      {/* Recent Transactions */}
      <GlowCard className="p-5">
        <h2 className="text-sm font-semibold text-text">Recent Transactions</h2>
        <p className="mb-4 mt-0.5 text-xs text-muted">Last 30 days</p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted">
                <th className="pb-3 pr-4 font-semibold">ID</th>
                <th className="pb-3 pr-4 font-semibold">Vendor</th>
                <th className="pb-3 pr-4 font-semibold">Category</th>
                <th className="pb-3 pr-4 font-semibold">Date</th>
                <th className="pb-3 pr-4 font-semibold">Status</th>
                <th className="pb-3 text-right font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {TRANSACTIONS.map(({ id, vendor, category, amount, date, status }) => (
                <tr key={id} className="border-b border-border/40 text-sm last:border-0">
                  <td className="py-3 pr-4 font-mono text-xs text-muted/60">{id}</td>
                  <td className="py-3 pr-4 font-medium text-text">{vendor}</td>
                  <td className="py-3 pr-4 text-muted">{category}</td>
                  <td className="py-3 pr-4 text-muted">{date}</td>
                  <td className="py-3 pr-4">
                    <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize",
                      status === "cleared" ? "bg-emerald-900/40 text-emerald-400" : "bg-amber-900/40 text-amber-400"
                    )}>
                      {status}
                    </span>
                  </td>
                  <td className={cn("py-3 text-right font-semibold", amount >= 0 ? "text-emerald-400" : "text-text")}>
                    {amount >= 0 ? "+" : ""}${Math.abs(amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlowCard>
    </div>
  );
}
