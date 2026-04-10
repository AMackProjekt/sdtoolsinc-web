"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  Users,
  UserPlus,
  BookOpen,
  TrendingUp,
  Clock,
  Star,
  Search,
} from "lucide-react";
import { cn } from "@/lib/cn";

// ── Mock Data ────────────────────────────────────────────────────────────────

const KPI_CARDS = [
  { label: "Total Employees",   value: "148",  sub: "Active headcount",      icon: Users,     color: "text-amber-400", bg: "bg-amber-500/10" },
  { label: "New Hires (30d)",   value: "12",   sub: "+3 from last month",     icon: UserPlus,  color: "text-green-400", bg: "bg-green-500/10" },
  { label: "Onboarding Active", value: "7",    sub: "In orientation phase",   icon: BookOpen,  color: "text-blue-400",  bg: "bg-blue-500/10"  },
  { label: "Open Positions",    value: "5",    sub: "Actively recruiting",     icon: Briefcase, color: "text-rose-400",  bg: "bg-rose-500/10"  },
];

const STATS = [
  { label: "Avg Tenure",            value: "2.4 yrs" },
  { label: "Satisfaction Score",    value: "4.3 / 5" },
  { label: "Training Completion",   value: "87 %"    },
  { label: "Retention Rate (12m)",  value: "91 %"    },
];

const RECENT_HIRES = [
  { name: "Jordan Williams",  role: "Case Manager",        startDate: "Jun 10, 2025", status: "Onboarding"  },
  { name: "Aaliyah Torres",   role: "Program Coordinator", startDate: "Jun 3, 2025",  status: "Active"      },
  { name: "Marcus Chen",      role: "Data Analyst",        startDate: "May 28, 2025", status: "Active"      },
  { name: "Destiny Brown",    role: "Community Liaison",   startDate: "May 20, 2025", status: "Active"      },
  { name: "Elijah Roberts",   role: "Intake Specialist",   startDate: "May 12, 2025", status: "Active"      },
];

const STATUS_COLOR: Record<string, string> = {
  Onboarding: "bg-yellow-500/20 text-yellow-300",
  Active:     "bg-green-500/20 text-green-300",
  Departed:   "bg-slate-600/40 text-slate-400",
};

// ── Page ─────────────────────────────────────────────────────────────────────

export default function HRConsolePage() {
  const [search, setSearch] = useState("");

  const filtered = RECENT_HIRES.filter(
    (h) =>
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-bg p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div className="rounded-2xl bg-gradient-to-r from-amber-900/60 to-orange-900/40 border border-amber-700/40 p-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">HR Console</h1>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                HR Operations Live Console
              </span>
            </div>
          </div>
          <p className="text-slate-400 text-sm mt-2">
            Monitor workforce metrics, onboarding status, and HR activity in real time.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {KPI_CARDS.map((k) => (
            <motion.div
              key={k.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
            >
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-3", k.bg)}>
                <k.icon className={cn("w-4.5 h-4.5", k.color)} />
              </div>
              <p className="text-2xl font-black text-white tracking-tight">{k.value}</p>
              <p className="text-xs font-semibold text-slate-300 mt-0.5">{k.label}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{k.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white">Workforce Metrics</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-xl bg-slate-800/60 p-4 text-center">
                <p className="text-lg font-black text-amber-300">{s.value}</p>
                <p className="text-[11px] text-slate-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Hires Table */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-white">Recent Hires</h2>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500 w-44 transition"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs">
                  <th className="pb-3 pr-4 font-semibold">Name</th>
                  <th className="pb-3 pr-4 font-semibold">Role</th>
                  <th className="pb-3 pr-4 font-semibold">Start Date</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((h) => (
                  <tr key={h.name} className="border-b border-slate-800/60 hover:bg-slate-800/40 transition">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                          <Star className="w-3.5 h-3.5 text-amber-400" />
                        </div>
                        <span className="font-semibold text-white">{h.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-slate-300">{h.role}</td>
                    <td className="py-3 pr-4 text-slate-400 text-xs">{h.startDate}</td>
                    <td className="py-3">
                      <span className={cn("text-[11px] font-bold px-2.5 py-1 rounded-full", STATUS_COLOR[h.status])}>
                        {h.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-500 text-sm">
                      No employees match &ldquo;{search}&rdquo;
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
