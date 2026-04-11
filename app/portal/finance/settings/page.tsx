"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings, DollarSign, Bell, Users, Shield, CalendarDays, Check, ChevronDown
} from "lucide-react";
import { GlowCard } from "@/components/ui/GlowCard";
import { cn } from "@/lib/cn";

type Section = "fiscal" | "currency" | "approvals" | "notifications" | "roles";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const CURRENCIES = ["USD — US Dollar", "CAD — Canadian Dollar", "EUR — Euro", "GBP — British Pound", "AUD — Australian Dollar"];

const ROLES = [
  { name: "Jordan Mitchell", email: "jordan@toolsinc.org", role: "Finance Manager", canApprove: true, canExport: true },
  { name: "Sara Chen", email: "sara@toolsinc.org", role: "Accountant", canApprove: false, canExport: true },
  { name: "Marcus Thompson", email: "marcus@toolsinc.org", role: "Viewer", canApprove: false, canExport: false },
];

export default function FinanceSettingsPage() {
  const [saved, setSaved] = useState<Section | null>(null);
  const [fiscalMonth, setFiscalMonth] = useState("January");
  const [currency, setCurrency] = useState("USD — US Dollar");
  const [approvalThreshold, setApprovalThreshold] = useState("5000");
  const [managerThreshold, setManagerThreshold] = useState("2000");
  const [notifs, setNotifs] = useState({
    overdueInvoices: true,
    budgetAlerts: true,
    payrollReminders: true,
    monthlyReports: false,
    lowBalance: true,
  });

  function handleSave(section: Section) {
    setSaved(section);
    setTimeout(() => setSaved(null), 2000);
  }

  function toggle(key: keyof typeof notifs) {
    setNotifs(p => ({ ...p, [key]: !p[key] }));
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-text">Finance Settings</h1>
        <p className="text-sm text-muted">Configure fiscal year, currency, approval thresholds, and permissions</p>
      </div>

      {/* Fiscal Year */}
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <GlowCard className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-xl bg-emerald-500/10 p-2.5"><CalendarDays className="h-5 w-5 text-emerald-400" /></div>
            <h2 className="text-base font-extrabold text-text">Fiscal Year</h2>
          </div>
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-muted mb-1">Fiscal Year Start Month</label>
            <div className="relative max-w-xs">
              <select value={fiscalMonth} onChange={e => setFiscalMonth(e.target.value)} className="w-full appearance-none rounded-lg border border-border bg-bg px-3 py-2 pr-8 text-sm text-text focus:border-emerald-500/60 focus:outline-none">
                {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted" />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <SaveButton onSave={() => handleSave("fiscal")} saved={saved === "fiscal"} />
          </div>
        </GlowCard>
      </motion.div>

      {/* Currency */}
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.10 }}>
        <GlowCard className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-xl bg-emerald-500/10 p-2.5"><DollarSign className="h-5 w-5 text-emerald-400" /></div>
            <h2 className="text-base font-extrabold text-text">Currency</h2>
          </div>
          <div className="relative max-w-xs">
            <select value={currency} onChange={e => setCurrency(e.target.value)} className="w-full appearance-none rounded-lg border border-border bg-bg px-3 py-2 pr-8 text-sm text-text focus:border-emerald-500/60 focus:outline-none">
              {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted" />
          </div>
          <div className="mt-4 flex justify-end">
            <SaveButton onSave={() => handleSave("currency")} saved={saved === "currency"} />
          </div>
        </GlowCard>
      </motion.div>

      {/* Approval Thresholds */}
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <GlowCard className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-xl bg-emerald-500/10 p-2.5"><Shield className="h-5 w-5 text-emerald-400" /></div>
            <h2 className="text-base font-extrabold text-text">Approval Thresholds</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted">Board Approval Required Above ($)</label>
              <input type="number" min="0" value={approvalThreshold} onChange={e => setApprovalThreshold(e.target.value)} className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-emerald-500/60 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted">Manager Approval Required Above ($)</label>
              <input type="number" min="0" value={managerThreshold} onChange={e => setManagerThreshold(e.target.value)} className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-emerald-500/60 focus:outline-none" />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <SaveButton onSave={() => handleSave("approvals")} saved={saved === "approvals"} />
          </div>
        </GlowCard>
      </motion.div>

      {/* Notification Preferences */}
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.20 }}>
        <GlowCard className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-xl bg-emerald-500/10 p-2.5"><Bell className="h-5 w-5 text-emerald-400" /></div>
            <h2 className="text-base font-extrabold text-text">Notification Preferences</h2>
          </div>
          <div className="space-y-3">
            {([
              { key: "overdueInvoices" as const, label: "Overdue invoice alerts" },
              { key: "budgetAlerts" as const, label: "Budget utilization warnings (≥90%)" },
              { key: "payrollReminders" as const, label: "Upcoming payroll reminders" },
              { key: "monthlyReports" as const, label: "Auto-send monthly report summary" },
              { key: "lowBalance" as const, label: "Low account balance alerts" },
            ]).map(n => (
              <div key={n.key} className="flex items-center justify-between py-1">
                <span className="text-sm text-text">{n.label}</span>
                <button
                  onClick={() => toggle(n.key)}
                  className={cn("relative h-5 w-9 rounded-full transition-colors focus:outline-none", notifs[n.key] ? "bg-emerald-500" : "bg-border")}
                >
                  <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform", notifs[n.key] ? "translate-x-4" : "translate-x-0.5")} />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <SaveButton onSave={() => handleSave("notifications")} saved={saved === "notifications"} />
          </div>
        </GlowCard>
      </motion.div>

      {/* User Roles */}
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <GlowCard className="p-0 overflow-hidden">
          <div className="flex items-center gap-3 p-5 border-b border-border">
            <div className="rounded-xl bg-emerald-500/10 p-2.5"><Users className="h-5 w-5 text-emerald-400" /></div>
            <h2 className="text-base font-extrabold text-text">User Roles & Permissions</h2>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-panel/50">
              <tr className="border-b border-border">
                <th className="py-3 px-5 text-xs font-semibold text-muted uppercase tracking-wider">User</th>
                <th className="py-3 px-4 text-xs font-semibold text-muted uppercase tracking-wider">Role</th>
                <th className="py-3 px-4 text-xs font-semibold text-muted uppercase tracking-wider text-center">Approve</th>
                <th className="py-3 px-4 text-xs font-semibold text-muted uppercase tracking-wider text-center">Export</th>
              </tr>
            </thead>
            <tbody>
              {ROLES.map((r, i) => (
                <tr key={i} className="border-b border-border/60 last:border-0">
                  <td className="py-3 px-5">
                    <p className="font-semibold text-text">{r.name}</p>
                    <p className="text-xs text-muted">{r.email}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-300">{r.role}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {r.canApprove ? <Check className="h-4 w-4 text-emerald-400 mx-auto" /> : <span className="text-muted">—</span>}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {r.canExport ? <Check className="h-4 w-4 text-emerald-400 mx-auto" /> : <span className="text-muted">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlowCard>
      </motion.div>
    </div>
  );
}

function SaveButton({ onSave, saved }: { onSave: () => void; saved: boolean }) {
  return (
    <button
      onClick={onSave}
      className={cn(
        "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all",
        saved
          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
          : "bg-emerald-500 text-white hover:bg-emerald-400"
      )}
    >
      {saved ? <><Check className="h-4 w-4" />Saved!</> : "Save Changes"}
    </button>
  );
}
