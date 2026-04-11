"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3, TrendingUp, PieChart, DollarSign, FileText, Download, RefreshCw, Calendar, ChevronDown
} from "lucide-react";
import { GlowCard } from "@/components/ui/GlowCard";
import { cn } from "@/lib/cn";

interface Report {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  lastGenerated: string;
  category: string;
}

const REPORTS: Report[] = [
  { id: 1, title: "Profit & Loss Summary", description: "Revenue, expenses, and net income overview for the selected period.", icon: TrendingUp, lastGenerated: "Jun 15, 2025 — 9:14 AM", category: "Financial" },
  { id: 2, title: "Budget vs Actual", description: "Compare planned budget allocations against actual spending by department.", icon: BarChart3, lastGenerated: "Jun 14, 2025 — 4:02 PM", category: "Financial" },
  { id: 3, title: "Cash Flow Statement", description: "Month-by-month cash inflows and outflows across all accounts.", icon: DollarSign, lastGenerated: "Jun 13, 2025 — 11:45 AM", category: "Financial" },
  { id: 4, title: "Grant Spending Report", description: "Track funded project expenditures, compliance, and remaining balances.", icon: PieChart, lastGenerated: "Jun 10, 2025 — 2:30 PM", category: "Grants" },
  { id: 5, title: "YTD Financial Overview", description: "Year-to-date summary of revenue, expenses, headcount costs, and margin.", icon: FileText, lastGenerated: "Jun 8, 2025 — 10:00 AM", category: "Financial" },
  { id: 6, title: "Accounts Payable Aging", description: "Aged analysis of outstanding vendor invoices and payment obligations.", icon: Calendar, lastGenerated: "Jun 6, 2025 — 3:17 PM", category: "Invoices" },
];

const DATE_RANGES = ["Q2 2025", "Q1 2025", "YTD 2025", "FY 2024", "Last 30 Days", "Last 90 Days"];

export default function ReportsPage() {
  const [loading, setLoading] = useState<number | null>(null);
  const [dateRanges, setDateRanges] = useState<Record<number, string>>({});

  function handleGenerate(id: number) {
    setLoading(id);
    setTimeout(() => setLoading(null), 1800);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-text">Reports</h1>
          <p className="text-sm text-muted">Generate and export financial reports for any date range</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400 transition-colors">
          <RefreshCw className="h-4 w-4" /> Refresh All
        </button>
      </div>

      {/* Category labels */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {REPORTS.map((r, i) => {
          const range = dateRanges[r.id] ?? "Q2 2025";
          return (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <GlowCard className="p-5 h-full flex flex-col gap-4">
                {/* Top row */}
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-emerald-500/10 p-3 shrink-0">
                    <r.icon className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <span className={cn("text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full", r.category === "Grants" ? "bg-amber-500/20 text-amber-300" : r.category === "Invoices" ? "bg-blue-500/20 text-blue-300" : "bg-emerald-500/20 text-emerald-300")}>
                      {r.category}
                    </span>
                    <h3 className="mt-1 text-base font-extrabold text-text">{r.title}</h3>
                    <p className="text-xs text-muted leading-relaxed">{r.description}</p>
                  </div>
                </div>

                {/* Date range selector */}
                <div className="relative">
                  <select
                    value={range}
                    onChange={e => setDateRanges(p => ({ ...p, [r.id]: e.target.value }))}
                    className="w-full appearance-none rounded-lg border border-border bg-bg px-3 py-2 pr-8 text-sm text-text focus:border-emerald-500/60 focus:outline-none"
                  >
                    {DATE_RANGES.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted" />
                </div>

                {/* Actions */}
                <div className="mt-auto space-y-2">
                  <p className="text-[11px] text-muted">Last generated: <span className="text-text">{r.lastGenerated}</span></p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleGenerate(r.id)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-500/20 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/30 transition-colors"
                    >
                      {loading === r.id ? (
                        <><RefreshCw className="h-3.5 w-3.5 animate-spin" /> Generating…</>
                      ) : (
                        <><FileText className="h-3.5 w-3.5" /> Generate PDF</>
                      )}
                    </button>
                    <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-muted hover:text-text transition-colors">
                      <Download className="h-3.5 w-3.5" /> CSV
                    </button>
                  </div>
                </div>
              </GlowCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
