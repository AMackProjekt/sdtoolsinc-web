"use client";

import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";
import {
  Users2,
  Clock,
  CalendarClock,
  UserPlus,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from "lucide-react";

const KPIs = [
  { label: "Active Staff",       value: "47",    change: "+2 this month",  up: true,  icon: Users2        },
  { label: "Pending Reviews",    value: "8",     change: "Due this week",   up: false, icon: Clock         },
  { label: "Leave Requests",     value: "5",     change: "3 pending approval", up: false, icon: CalendarClock },
  { label: "Open Positions",     value: "3",     change: "2 in interview",  up: true,  icon: UserPlus      },
];

const STAFF = [
  { name: "Marcus Johnson",   title: "Case Manager",          dept: "Client Services",  status: "active",   start: "Mar 2022" },
  { name: "Priya Sharma",     title: "Program Coordinator",   dept: "Operations",       status: "active",   start: "Jul 2021" },
  { name: "Devon Clarke",     title: "Intake Specialist",     dept: "Client Services",  status: "on-leave", start: "Jan 2023" },
  { name: "Sandra Nguyen",    title: "Data Analyst",          dept: "Technology",       status: "active",   start: "Sep 2023" },
  { name: "James Thornton",   title: "Finance Manager",       dept: "Finance",          status: "active",   start: "May 2020" },
  { name: "Aaliyah Brooks",   title: "HR Generalist",         dept: "Human Resources",  status: "active",   start: "Feb 2024" },
];

const ONBOARDING = [
  { name: "Tyler Reed",    role: "Support Specialist",   stage: "Background Check",  pct: 40 },
  { name: "Fatima Ali",    role: "Case Manager",         stage: "Orientation",       pct: 75 },
  { name: "Carlos Vega",   role: "Program Assistant",    stage: "IT Setup",          pct: 60 },
];

const LEAVE = [
  { name: "Devon Clarke",  type: "Medical Leave",  from: "Jul 8",  to: "Jul 19",  status: "approved"  },
  { name: "Marcus Johnson", type: "Vacation",      from: "Jul 22", to: "Jul 25",  status: "pending"   },
  { name: "Sandra Nguyen",  type: "PTO",           from: "Aug 1",  to: "Aug 2",   status: "pending"   },
  { name: "Priya Sharma",   type: "Sick Leave",    from: "Jul 10", to: "Jul 10",  status: "approved"  },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  active:   { label: "Active",    color: "bg-emerald-900/40 text-emerald-400 border border-emerald-700/40" },
  "on-leave": { label: "On Leave", color: "bg-amber-900/40 text-amber-400 border border-amber-700/40" },
  inactive: { label: "Inactive",  color: "bg-slate-800/60 text-slate-400 border border-slate-700/40" },
  approved: { label: "Approved",  color: "bg-emerald-900/40 text-emerald-400 border border-emerald-700/40" },
  pending:  { label: "Pending",   color: "bg-amber-900/40 text-amber-400 border border-amber-700/40" },
  denied:   { label: "Denied",    color: "bg-red-900/40 text-red-400 border border-red-700/40" },
};

const LeaveIcon = ({ status }: { status: string }) => {
  if (status === "approved") return <CheckCircle2 size={14} className="text-emerald-400" />;
  if (status === "denied")   return <XCircle size={14} className="text-red-400" />;
  return <AlertCircle size={14} className="text-amber-400" />;
};

export default function HRDashboardPage() {
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">HR Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">Staff management, onboarding, and workforce compliance</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {KPIs.map(({ label, value, change, up, icon: Icon }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
          >
            <GlowCard className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-900/50 text-amber-400">
                  <Icon size={18} />
                </div>
                <ArrowUpRight
                  size={14}
                  className={up ? "text-emerald-400" : "text-amber-400"}
                />
              </div>
              <div className="mt-3 text-2xl font-extrabold tracking-tight text-white">{value}</div>
              <div className="mt-0.5 text-xs font-semibold tracking-[0.14em] text-slate-400 uppercase">{label}</div>
              <div className="mt-1 text-xs text-slate-500">{change}</div>
            </GlowCard>
          </motion.div>
        ))}
      </div>

      {/* Staff Roster + Onboarding */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Staff Table */}
        <div className="lg:col-span-2">
          <GlowCard className="overflow-hidden p-0">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="text-sm font-bold text-white">Staff Roster</h2>
              <span className="rounded-full bg-amber-900/40 px-2.5 py-0.5 text-xs font-semibold text-amber-400">
                {STAFF.length} members
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-5 py-3 text-xs font-semibold text-slate-400">Name</th>
                    <th className="px-5 py-3 text-xs font-semibold text-slate-400 hidden md:table-cell">Department</th>
                    <th className="px-5 py-3 text-xs font-semibold text-slate-400 hidden lg:table-cell">Start</th>
                    <th className="px-5 py-3 text-xs font-semibold text-slate-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {STAFF.map((s) => (
                    <tr key={s.name} className="border-b border-border/50 hover:bg-slate-800/20 transition">
                      <td className="px-5 py-3">
                        <div className="font-semibold text-white">{s.name}</div>
                        <div className="text-xs text-slate-400">{s.title}</div>
                      </td>
                      <td className="px-5 py-3 text-slate-400 hidden md:table-cell">{s.dept}</td>
                      <td className="px-5 py-3 text-slate-400 hidden lg:table-cell">{s.start}</td>
                      <td className="px-5 py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusConfig[s.status]?.color}`}>
                          {statusConfig[s.status]?.label ?? s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlowCard>
        </div>

        {/* Onboarding */}
        <div>
          <GlowCard className="p-5">
            <h2 className="mb-4 text-sm font-bold text-white">Onboarding Pipeline</h2>
            <div className="space-y-5">
              {ONBOARDING.map((o) => (
                <div key={o.name}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div>
                      <span className="font-semibold text-white">{o.name}</span>
                      <span className="ml-2 text-slate-400">{o.role}</span>
                    </div>
                    <span className="text-amber-400 font-semibold">{o.pct}%</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mb-1.5">{o.stage}</div>
                  <div className="h-1.5 w-full rounded-full bg-slate-800">
                    <div
                      className="h-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 transition-all"
                      style={{ width: `${o.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlowCard>
        </div>
      </div>

      {/* Leave Requests */}
      <GlowCard className="overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-sm font-bold text-white">Leave Requests</h2>
          <span className="rounded-full bg-amber-900/40 px-2.5 py-0.5 text-xs font-semibold text-amber-400">
            {LEAVE.filter((l) => l.status === "pending").length} pending
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-5 py-3 text-xs font-semibold text-slate-400">Employee</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-400">Type</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-400 hidden md:table-cell">From</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-400 hidden md:table-cell">To</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {LEAVE.map((l, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-slate-800/20 transition">
                  <td className="px-5 py-3 font-semibold text-white">{l.name}</td>
                  <td className="px-5 py-3 text-slate-400">{l.type}</td>
                  <td className="px-5 py-3 text-slate-400 hidden md:table-cell">{l.from}</td>
                  <td className="px-5 py-3 text-slate-400 hidden md:table-cell">{l.to}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      <LeaveIcon status={l.status} />
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusConfig[l.status]?.color}`}>
                        {statusConfig[l.status]?.label ?? l.status}
                      </span>
                    </div>
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
