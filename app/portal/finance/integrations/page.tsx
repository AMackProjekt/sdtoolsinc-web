"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Zap, CheckCircle, Clock, XCircle, RefreshCw, Link2, Unlink, PlusCircle, AlertCircle
} from "lucide-react";
import { GlowCard } from "@/components/ui/GlowCard";
import { cn } from "@/lib/cn";

type IntStatus = "Connected" | "Pending" | "Error";

interface Integration {
  id: number;
  name: string;
  category: string;
  description: string;
  status: IntStatus;
  lastSync: string;
  color: string;
  abbr: string;
}

const INITIAL_INTEGRATIONS: Integration[] = [
  { id: 1, name: "QuickBooks Online", category: "Accounting", description: "Sync chart of accounts, journal entries, and financial reports.", status: "Connected", lastSync: "Jun 15, 2025 — 8:02 AM", color: "bg-green-500/20 text-green-300", abbr: "QB" },
  { id: 2, name: "Stripe", category: "Payments", description: "Pull payment transactions and reconcile income automatically.", status: "Connected", lastSync: "Jun 15, 2025 — 9:30 AM", color: "bg-violet-500/20 text-violet-300", abbr: "ST" },
  { id: 3, name: "ADP Payroll", category: "Payroll", description: "Sync payroll disbursements, benefits, and employee records.", status: "Connected", lastSync: "Jun 14, 2025 — 6:00 PM", color: "bg-red-500/20 text-red-300", abbr: "ADP" },
  { id: 4, name: "Plaid Banking", category: "Banking", description: "Live bank feed from First National — transactions and balances.", status: "Pending", lastSync: "Awaiting authorization", color: "bg-sky-500/20 text-sky-300", abbr: "PL" },
  { id: 5, name: "Concur Expenses", category: "Expenses", description: "Import employee expense reports and reimbursements.", status: "Error", lastSync: "Jun 10, 2025 — failed", color: "bg-amber-500/20 text-amber-300", abbr: "EX" },
];

const STATUS_CONFIG: Record<IntStatus, { icon: React.ComponentType<{ className?: string }>, color: string, bg: string, label: string }> = {
  Connected: { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/20", label: "Connected" },
  Pending: { icon: Clock, color: "text-amber-400", bg: "bg-amber-500/20", label: "Pending Setup" },
  Error: { icon: AlertCircle, color: "text-red-400", bg: "bg-red-500/20", label: "Auth Error" },
};

export default function IntegrationsPage() {
  const [syncing, setSyncing] = useState<number | null>(null);
  const [integrations, setIntegrations] = useState(INITIAL_INTEGRATIONS);

  function handleSync(id: number) {
    setSyncing(id);
    setTimeout(() => {
      setIntegrations(prev => prev.map(i => i.id === id ? { ...i, lastSync: `Just now`, status: "Connected" as IntStatus } : i));
      setSyncing(null);
    }, 2000);
  }

  function handleDisconnect(id: number) {
    setIntegrations(prev => prev.map(i => i.id === id ? { ...i, status: "Pending" as IntStatus, lastSync: "Disconnected" } : i));
  }

  const connected = integrations.filter(i => i.status === "Connected").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-text">Integrations</h1>
          <p className="text-sm text-muted">Connect third-party services to your finance portal</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400 transition-colors">
          <PlusCircle className="h-4 w-4" /> Add Integration
        </button>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlowCard className="p-5 flex items-center gap-4">
          <div className="rounded-xl bg-emerald-500/10 p-3"><Zap className="h-6 w-6 text-emerald-400" /></div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">Connected</p>
            <p className="mt-0.5 text-2xl font-extrabold text-emerald-400">{connected}</p>
          </div>
        </GlowCard>
        <GlowCard className="p-5 flex items-center gap-4">
          <div className="rounded-xl bg-amber-500/10 p-3"><Clock className="h-6 w-6 text-amber-400" /></div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">Pending</p>
            <p className="mt-0.5 text-2xl font-extrabold text-amber-400">{integrations.filter(i => i.status === "Pending").length}</p>
          </div>
        </GlowCard>
        <GlowCard className="p-5 flex items-center gap-4">
          <div className="rounded-xl bg-red-500/10 p-3"><XCircle className="h-6 w-6 text-red-400" /></div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">Errors</p>
            <p className="mt-0.5 text-2xl font-extrabold text-red-400">{integrations.filter(i => i.status === "Error").length}</p>
          </div>
        </GlowCard>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((int, i) => {
          const S = STATUS_CONFIG[int.status];
          return (
            <motion.div
              key={int.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <GlowCard className="p-5">
                <div className="flex items-start gap-4">
                  {/* Abbr logo */}
                  <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl text-sm font-extrabold shrink-0", int.color)}>
                    {int.abbr}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-extrabold text-text">{int.name}</h3>
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-muted">{int.category}</span>
                      <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold", S.bg, S.color)}>
                        <S.icon className="h-3 w-3" />{S.label}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted">{int.description}</p>
                    <p className="mt-1 text-[11px] text-muted">Last sync: <span className="text-text">{int.lastSync}</span></p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleSync(int.id)}
                    disabled={syncing === int.id}
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/30 transition-colors disabled:opacity-60"
                  >
                    <RefreshCw className={cn("h-3.5 w-3.5", syncing === int.id && "animate-spin")} />
                    {syncing === int.id ? "Syncing…" : "Sync Now"}
                  </button>
                  {int.status === "Connected" && (
                    <button onClick={() => handleDisconnect(int.id)} className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted hover:text-red-400 hover:border-red-500/40 transition-colors">
                      <Unlink className="h-3.5 w-3.5" /> Disconnect
                    </button>
                  )}
                  {int.status !== "Connected" && (
                    <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted hover:text-emerald-300 hover:border-emerald-500/40 transition-colors">
                      <Link2 className="h-3.5 w-3.5" /> Authorize
                    </button>
                  )}
                </div>
              </GlowCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
