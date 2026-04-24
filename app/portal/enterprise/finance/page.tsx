"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  Download,
} from "lucide-react";

interface FinanceData {
  summary: {
    totalBudget: number;
    spent: number;
    remaining: number;
    ytdRevenue: number;
    netPosition: number;
    lastUpdated: string;
  };
  grants: {
    id: string;
    name: string;
    funder: string;
    amount: number;
    received: number;
    status: string;
    expires: string;
    category: string;
  }[];
  budgetLines: {
    category: string;
    allocated: number;
    spent: number;
    percent: number;
  }[];
  monthlyFlow: {
    month: string;
    revenue: number;
    expenses: number;
  }[];
  compliance: {
    irs990Status: string;
    irs990Due: string;
    lastAudit: string;
    auditor: string;
    boardApproval: string;
    nextBoardReview: string;
  };
  recentTransactions: {
    id: string;
    date: string;
    description: string;
    category: string;
    amount: number;
    type: "credit" | "debit";
  }[];
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const statusColor: Record<string, string> = {
  Active: "text-emerald-400 bg-emerald-400/10",
  Pending: "text-amber-400 bg-amber-400/10",
  Closed: "text-slate-400 bg-slate-400/10",
  "In Review": "text-sky-400 bg-sky-400/10",
};

export default function EnterpriseFinancePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<FinanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "grants" | "budget" | "transactions" | "compliance">("overview");

  useEffect(() => {
    if (!isAuthenticated) router.replace("/portal/enterprise/auth");
  }, [isAuthenticated, router]);

  useEffect(() => {
    fetch("/api/enterprise/finance")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-64 items-center justify-center text-muted">
        Failed to load finance data.
      </div>
    );
  }

  const { summary, grants, budgetLines, monthlyFlow, compliance, recentTransactions } = data;
  const spentPct = Math.round((summary.spent / summary.totalBudget) * 100);

  const kpis = [
    {
      label: "Total Budget (FY)",
      value: fmt(summary.totalBudget),
      sub: "Fiscal Year 2024–2025",
      icon: DollarSign,
      color: "text-cyan-400",
      bg: "bg-cyan-400/10",
    },
    {
      label: "YTD Spent",
      value: fmt(summary.spent),
      sub: `${spentPct}% of budget`,
      icon: TrendingDown,
      color: "text-rose-400",
      bg: "bg-rose-400/10",
    },
    {
      label: "Remaining",
      value: fmt(summary.remaining),
      sub: `${100 - spentPct}% available`,
      icon: BarChart3,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
    },
    {
      label: "YTD Revenue",
      value: fmt(summary.ytdRevenue),
      sub: "All sources combined",
      icon: TrendingUp,
      color: "text-brand",
      bg: "bg-brand/10",
    },
  ];

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "grants", label: "Grants" },
    { id: "budget", label: "Budget Lines" },
    { id: "transactions", label: "Transactions" },
    { id: "compliance", label: "Compliance" },
  ] as const;

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 md:px-7">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-text">
              Finance Division
            </h1>
            <p className="mt-1.5 text-sm text-muted">
              Non-Profit Financial Management · Last updated: {summary.lastUpdated}
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-700 transition-colors">
            <Download size={15} />
            Export Report
          </button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <GlowCard className="p-5">
              <div className={`mb-3 inline-flex rounded-xl p-2.5 ${kpi.bg}`}>
                <kpi.icon size={20} className={kpi.color} />
              </div>
              <div className="text-2xl font-extrabold tracking-tight text-text">{kpi.value}</div>
              <div className="mt-0.5 text-sm font-semibold text-text/80">{kpi.label}</div>
              <div className="mt-1 text-xs text-muted">{kpi.sub}</div>
            </GlowCard>
          </motion.div>
        ))}
      </div>

      {/* Budget Progress Bar */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <GlowCard className="mb-8 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-text">Annual Budget Utilization</span>
            <span className="text-sm font-bold text-text">{spentPct}%</span>
          </div>
          <div className="h-3 w-full rounded-full bg-slate-800">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-cyan-500 to-brand transition-all"
              style={{ width: `${spentPct}%` }}
            />
          </div>
          <div className="mt-3 flex justify-between text-xs text-muted">
            <span>Spent: {fmt(summary.spent)}</span>
            <span>Remaining: {fmt(summary.remaining)}</span>
          </div>
        </GlowCard>
      </motion.div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-xl bg-slate-900/60 p-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              activeTab === tab.id
                ? "bg-slate-700 text-white"
                : "text-muted hover:text-text"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB: Overview */}
      {activeTab === "overview" && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Monthly Revenue vs Expenses */}
          <GlowCard className="p-5">
            <h3 className="mb-4 text-sm font-bold text-text flex items-center gap-2">
              <BarChart3 size={16} className="text-brand" />
              Monthly Cash Flow
            </h3>
            <div className="space-y-3">
              {monthlyFlow.map((m) => (
                <div key={m.month} className="grid grid-cols-[52px_1fr_1fr] items-center gap-3">
                  <span className="text-xs font-semibold text-muted">{m.month}</span>
                  <div className="col-span-2 grid grid-cols-2 gap-1">
                    {/* Revenue bar */}
                    <div className="relative h-5 rounded bg-slate-800 overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 rounded bg-emerald-500/60"
                        style={{ width: `${Math.min((m.revenue / 200000) * 100, 100)}%` }}
                      />
                      <span className="absolute inset-0 flex items-center px-1.5 text-[10px] font-semibold text-white/90">
                        {fmt(m.revenue)}
                      </span>
                    </div>
                    {/* Expenses bar */}
                    <div className="relative h-5 rounded bg-slate-800 overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 rounded bg-rose-500/50"
                        style={{ width: `${Math.min((m.expenses / 200000) * 100, 100)}%` }}
                      />
                      <span className="absolute inset-0 flex items-center px-1.5 text-[10px] font-semibold text-white/90">
                        {fmt(m.expenses)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-4 text-xs text-muted">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />Revenue</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-500 inline-block" />Expenses</span>
            </div>
          </GlowCard>

          {/* Compliance snapshot */}
          <GlowCard className="p-5">
            <h3 className="mb-4 text-sm font-bold text-text flex items-center gap-2">
              <Shield size={16} className="text-brand" />
              Compliance Status
            </h3>
            <div className="space-y-3">
              {[
                { label: "IRS Form 990", value: compliance.irs990Status, icon: compliance.irs990Status === "Filed" ? CheckCircle2 : Clock, color: compliance.irs990Status === "Filed" ? "text-emerald-400" : "text-amber-400" },
                { label: "Last Financial Audit", value: compliance.lastAudit, icon: CheckCircle2, color: "text-emerald-400" },
                { label: "Auditor", value: compliance.auditor, icon: FileText, color: "text-sky-400" },
                { label: "Board Approval", value: compliance.boardApproval, icon: CheckCircle2, color: "text-emerald-400" },
                { label: "Next Board Review", value: compliance.nextBoardReview, icon: Clock, color: "text-amber-400" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm text-muted">{item.label}</span>
                  <span className={`flex items-center gap-1.5 text-sm font-semibold ${item.color}`}>
                    <item.icon size={14} />
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </GlowCard>

          {/* Top Grants */}
          <GlowCard className="p-5 lg:col-span-2">
            <h3 className="mb-4 text-sm font-bold text-text flex items-center gap-2">
              <TrendingUp size={16} className="text-brand" />
              Active Grants Summary
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {grants.filter((g) => g.status !== "Closed").map((grant) => (
                <div key={grant.id} className="rounded-xl bg-slate-900/60 p-4 border border-border">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <span className="text-xs font-semibold text-muted">{grant.category}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${statusColor[grant.status] ?? "text-slate-400 bg-slate-400/10"}`}>
                      {grant.status}
                    </span>
                  </div>
                  <div className="text-base font-extrabold text-text">{fmt(grant.amount)}</div>
                  <div className="mt-0.5 text-xs text-muted">{grant.funder}</div>
                  <div className="mt-2 h-1.5 rounded-full bg-slate-800">
                    <div
                      className="h-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-brand"
                      style={{ width: `${Math.round((grant.received / grant.amount) * 100)}%` }}
                    />
                  </div>
                  <div className="mt-1 text-[10px] text-muted">
                    Received: {fmt(grant.received)} of {fmt(grant.amount)}
                  </div>
                </div>
              ))}
            </div>
          </GlowCard>
        </div>
      )}

      {/* TAB: Grants */}
      {activeTab === "grants" && (
        <GlowCard className="overflow-hidden p-0">
          <div className="border-b border-border px-6 py-4">
            <h3 className="text-sm font-bold text-text">All Grants & Funding Sources</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border/60 bg-slate-900/40">
                <tr>
                  {["Funder", "Category", "Amount", "Received", "Progress", "Status", "Expires"].map((h) => (
                    <th key={h} className="px-5 py-3 text-xs font-bold text-muted tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {grants.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-900/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-text">{g.name}</div>
                      <div className="text-xs text-muted">{g.funder}</div>
                    </td>
                    <td className="px-5 py-3.5 text-muted">{g.category}</td>
                    <td className="px-5 py-3.5 font-bold text-text">{fmt(g.amount)}</td>
                    <td className="px-5 py-3.5 text-emerald-400 font-semibold">{fmt(g.received)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 rounded-full bg-slate-800">
                          <div
                            className="h-1.5 rounded-full bg-brand"
                            style={{ width: `${Math.round((g.received / g.amount) * 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted">{Math.round((g.received / g.amount) * 100)}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${statusColor[g.status] ?? "text-slate-400 bg-slate-400/10"}`}>
                        {g.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-muted text-xs">{g.expires}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlowCard>
      )}

      {/* TAB: Budget Lines */}
      {activeTab === "budget" && (
        <GlowCard className="p-6">
          <h3 className="mb-5 text-sm font-bold text-text flex items-center gap-2">
            <PieChart size={16} className="text-brand" />
            Budget Allocation by Category
          </h3>
          <div className="space-y-4">
            {budgetLines.map((line) => {
              const pct = line.percent;
              const color = pct > 90 ? "bg-rose-500" : pct > 70 ? "bg-amber-500" : "bg-emerald-500";
              return (
                <div key={line.category}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-sm font-semibold text-text">{line.category}</span>
                    <span className="text-xs text-muted">
                      {fmt(line.spent)} / {fmt(line.allocated)}
                      <span className={`ml-2 font-bold ${pct > 90 ? "text-rose-400" : pct > 70 ? "text-amber-400" : "text-emerald-400"}`}>
                        ({pct}%)
                      </span>
                    </span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-800">
                    <div
                      className={`h-2.5 rounded-full transition-all ${color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-5 flex gap-4 text-xs text-muted border-t border-border pt-4">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />On track (&lt;70%)</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500 inline-block" />Watch (70–90%)</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-500 inline-block" />At limit (&gt;90%)</span>
          </div>
        </GlowCard>
      )}

      {/* TAB: Transactions */}
      {activeTab === "transactions" && (
        <GlowCard className="overflow-hidden p-0">
          <div className="border-b border-border px-6 py-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-text">Recent Transactions</h3>
            <span className="text-xs text-muted">Showing latest {recentTransactions.length}</span>
          </div>
          <div className="divide-y divide-border/40">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-900/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tx.type === "credit" ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400"}`}>
                    {tx.type === "credit" ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-text">{tx.description}</div>
                    <div className="text-xs text-muted">{tx.category} · {tx.date}</div>
                  </div>
                </div>
                <div className={`text-sm font-bold ${tx.type === "credit" ? "text-emerald-400" : "text-rose-400"}`}>
                  {tx.type === "credit" ? "+" : "−"}{fmt(Math.abs(tx.amount))}
                </div>
              </div>
            ))}
          </div>
        </GlowCard>
      )}

      {/* TAB: Compliance */}
      {activeTab === "compliance" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <GlowCard className="p-6">
            <h3 className="mb-5 text-sm font-bold text-text flex items-center gap-2">
              <Shield size={16} className="text-brand" />
              IRS & Tax Compliance
            </h3>
            <div className="space-y-4">
              {[
                { label: "Form 990 Status", value: compliance.irs990Status, positive: compliance.irs990Status === "Filed" },
                { label: "990 Due Date", value: compliance.irs990Due, positive: true },
                { label: "Last Financial Audit", value: compliance.lastAudit, positive: true },
                { label: "Audit Firm", value: compliance.auditor, positive: true },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-xl bg-slate-900/40 px-4 py-3">
                  <span className="text-sm text-muted">{item.label}</span>
                  <span className={`flex items-center gap-1.5 text-sm font-semibold ${item.positive ? "text-emerald-400" : "text-amber-400"}`}>
                    {item.positive ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </GlowCard>

          <GlowCard className="p-6">
            <h3 className="mb-5 text-sm font-bold text-text flex items-center gap-2">
              <FileText size={16} className="text-brand" />
              Board & Governance
            </h3>
            <div className="space-y-4">
              {[
                { label: "Board Budget Approval", value: compliance.boardApproval, positive: true },
                { label: "Next Board Review", value: compliance.nextBoardReview, positive: false },
                { label: "Financial Policy", value: "Adopted 2023", positive: true },
                { label: "Conflict of Interest Policy", value: "Current", positive: true },
                { label: "Whistleblower Policy", value: "In Place", positive: true },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-xl bg-slate-900/40 px-4 py-3">
                  <span className="text-sm text-muted">{item.label}</span>
                  <span className={`flex items-center gap-1.5 text-sm font-semibold ${item.positive ? "text-emerald-400" : "text-amber-400"}`}>
                    {item.positive ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </GlowCard>

          <GlowCard className="p-6 lg:col-span-2">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400">
                <AlertCircle size={24} />
              </div>
              <div>
                <h3 className="font-bold text-text">Annual Compliance Notice</h3>
                <p className="mt-1.5 text-sm text-muted leading-relaxed">
                  As a 501(c)(3) organization, T.O.O.L.S Inc. is required to file Form 990 annually
                  with the IRS and maintain transparent financial reporting practices. All financial
                  data is reviewed quarterly by the Board of Directors and annually by an independent
                  auditor. Records are retained for a minimum of 7 years per IRS requirements.
                </p>
                <div className="mt-3 flex gap-3">
                  <button className="text-xs font-semibold text-brand hover:underline">View Full Audit Report →</button>
                  <button className="text-xs font-semibold text-brand hover:underline">Download 990 →</button>
                </div>
              </div>
            </div>
          </GlowCard>
        </div>
      )}
    </div>
  );
}
