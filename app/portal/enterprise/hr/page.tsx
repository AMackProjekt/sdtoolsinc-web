"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { GlowCard } from "@/components/ui/GlowCard";
import { cn } from "@/lib/cn";
import {
  Users, Plus, Search, X, Check, ChevronDown, UserCheck,
  Clock, AlertCircle, Briefcase,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Staff = {
  id: number;
  name: string;
  role: string;
  department: string;
  email: string;
  status: "Active" | "On Leave" | "Terminated";
  hireDate: string;
};

const DEPARTMENTS = ["All", "Client Services", "Programs", "Education", "Technology", "Administration", "Development"];
const STATUSES = ["All", "Active", "On Leave", "Terminated"];

const ONBOARDING_STAGES = [
  { label: "Applied",     count: 7, color: "bg-slate-500" },
  { label: "Screening",   count: 4, color: "bg-cyan-600" },
  { label: "Interview",   count: 3, color: "bg-cyan-500" },
  { label: "Offer",       count: 2, color: "bg-emerald-500" },
  { label: "Onboarding",  count: 1, color: "bg-emerald-400" },
];

const STATUS_STYLES: Record<Staff["status"], string> = {
  Active:     "bg-emerald-900/40 text-emerald-400 border-emerald-700/40",
  "On Leave": "bg-amber-900/40 text-amber-400 border-amber-700/40",
  Terminated: "bg-rose-900/40 text-rose-400 border-rose-700/40",
};

export default function HRPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [staff, setStaff] = useState<Staff[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [query, setQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [saved, setSaved] = useState(false);

  // New hire form state
  const [form, setForm] = useState({ name: "", email: "", role: "", department: "Client Services" });

  useEffect(() => {
    if (!isAuthenticated) router.replace("/portal/enterprise/auth");
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetch("/api/enterprise/staff")
      .then((r) => r.json())
      .then((data) => { if (data.staff) setStaff(data.staff as Staff[]); })
      .catch(() => {})
      .finally(() => setLoadingData(false));
  }, [isAuthenticated]);

  const filtered = useMemo(() => {
    return staff.filter((s) => {
      const q = query.toLowerCase();
      const matchQ = !q || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.role.toLowerCase().includes(q);
      const matchDept = deptFilter === "All" || s.department === deptFilter;
      const matchStatus = statusFilter === "All" || s.status === statusFilter;
      return matchQ && matchDept && matchStatus;
    });
  }, [staff, query, deptFilter, statusFilter]);

  const counts = {
    total:   staff.length,
    active:  staff.filter((s) => s.status === "Active").length,
    onLeave: staff.filter((s) => s.status === "On Leave").length,
    open:    4,
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.role.trim()) return;
    const newMember: Staff = {
      id:         Date.now(),
      name:       form.name.trim(),
      email:      form.email.trim(),
      role:       form.role.trim(),
      department: form.department,
      status:     "Active",
      hireDate:   new Date().toISOString().slice(0, 10),
    };
    setStaff((prev) => [newMember, ...prev]);
    fetch("/api/enterprise/staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMember),
    }).catch(() => {});
    setForm({ name: "", email: "", role: "", department: "Client Services" });
    setShowForm(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!isAuthenticated) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-white">
            <Briefcase size={22} className="text-cyan-400" /> HR Operations
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Staff roster, onboarding pipeline, and workforce management
          </p>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="flex items-center gap-1 text-sm font-semibold text-emerald-400">
              <Check size={14} /> Staff added
            </span>
          )}
          <button
            onClick={() => setShowForm((v) => !v)}
            className={cn(
              "flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition",
              showForm
                ? "bg-slate-800 border-slate-700 text-slate-300"
                : "bg-cyan-900/40 border-cyan-700/40 text-cyan-400 hover:bg-cyan-900/60"
            )}
          >
            {showForm ? <><X size={14} /> Cancel</> : <><Plus size={14} /> Add Staff Member</>}
          </button>
        </div>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GlowCard className="bg-slate-900 border-cyan-700/40 p-5 overflow-hidden">
              <h3 className="mb-4 text-sm font-bold text-cyan-400">New Staff Member</h3>
              <form onSubmit={handleAddStaff} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {(["name", "email", "role"] as const).map((field) => (
                  <div key={field} className="flex flex-col gap-1">
                    <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      {field}
                    </label>
                    <input
                      value={form[field]}
                      onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                      placeholder={field === "name" ? "Full name" : field === "email" ? "email@sdtools.org" : "Job title"}
                      className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-cyan-600 focus:outline-none"
                    />
                  </div>
                ))}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">Department</label>
                  <select
                    value={form.department}
                    onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
                    className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-cyan-600 focus:outline-none"
                  >
                    {DEPARTMENTS.slice(1).map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
                  <button type="submit" className="rounded-xl bg-cyan-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-cyan-600 transition">
                    Add to Roster
                  </button>
                </div>
              </form>
            </GlowCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total Staff",    value: counts.total,   icon: Users,       color: "text-cyan-400"    },
          { label: "Active",         value: counts.active,  icon: UserCheck,   color: "text-emerald-400" },
          { label: "On Leave",       value: counts.onLeave, icon: Clock,       color: "text-amber-400"   },
          { label: "Open Positions", value: counts.open,    icon: AlertCircle, color: "text-rose-400"    },
        ].map(({ label, value, icon: Icon, color }) => (
          <GlowCard key={label} className="bg-slate-900 border-slate-800 p-4 flex flex-col gap-1">
            <Icon size={16} className={cn("mb-1", color)} />
            <div className={cn("text-3xl font-extrabold", color)}>{value}</div>
            <div className="text-xs font-semibold text-slate-400">{label}</div>
          </GlowCard>
        ))}
      </div>

      {/* Onboarding pipeline */}
      <div>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-slate-400">Hiring Pipeline</h2>
        <GlowCard className="bg-slate-900 border-slate-800 p-5">
          <div className="flex flex-wrap gap-3 sm:gap-0 sm:divide-x sm:divide-slate-800">
            {ONBOARDING_STAGES.map(({ label, count, color }) => (
              <div key={label} className="flex flex-1 flex-col items-center gap-1 py-2 sm:px-4 text-center">
                <div className={cn("w-9 h-9 rounded-full flex items-center justify-center text-sm font-extrabold text-white", color)}>
                  {count}
                </div>
                <div className="text-xs font-semibold text-slate-400">{label}</div>
              </div>
            ))}
          </div>
        </GlowCard>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, role, email…"
            className="w-full min-w-0 rounded-xl border border-slate-700 bg-slate-800 pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-600 focus:outline-none"
          />
        </div>
        <div className="relative">
          <ChevronDown size={12} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="appearance-none rounded-xl border border-slate-700 bg-slate-800 pr-7 pl-3 py-2.5 text-sm text-white focus:border-cyan-600 focus:outline-none"
          >
            {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div className="relative">
          <ChevronDown size={12} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none rounded-xl border border-slate-700 bg-slate-800 pr-7 pl-3 py-2.5 text-sm text-white focus:border-cyan-600 focus:outline-none"
          >
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <span className="text-xs text-slate-500">{filtered.length} of {staff.length}</span>
      </div>

      {/* Staff roster table */}
      <GlowCard className="bg-slate-900 border-slate-800 p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60">
                {["Name", "Role", "Department", "Email", "Hire Date", "Status"].map((h) => (
                  <th key={h} className="px-5 py-3 text-xs font-semibold uppercase tracking-widest text-slate-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loadingData ? (
                [1, 2, 3, 4].map((n) => (
                  <tr key={n}>
                    <td colSpan={6}>
                      <div className="h-8 animate-pulse rounded-lg bg-slate-800/50 mx-4 my-1" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-slate-500">No staff members match your filters.</td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="border-b border-slate-800/60 last:border-0 hover:bg-slate-800/30">
                    <td className="px-5 py-3 font-semibold text-white whitespace-nowrap">{s.name}</td>
                    <td className="px-5 py-3 text-slate-300 whitespace-nowrap">{s.role}</td>
                    <td className="px-5 py-3 text-slate-400 whitespace-nowrap">{s.department}</td>
                    <td className="px-5 py-3 text-slate-400 font-mono text-xs">{s.email}</td>
                    <td className="px-5 py-3 text-slate-500 font-mono text-xs whitespace-nowrap">{s.hireDate}</td>
                    <td className="px-5 py-3">
                      <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-semibold", STATUS_STYLES[s.status])}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlowCard>
    </motion.div>
  );
}
