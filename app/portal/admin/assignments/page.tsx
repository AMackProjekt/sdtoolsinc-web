"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList, Users, UserCheck, AlertCircle, Search, X, Check, ChevronDown } from "lucide-react";
import { GlowCard } from "@/components/ui/GlowCard";
import { cn } from "@/lib/cn";
import { useAuth } from "@/lib/auth";

// ─── Types ────────────────────────────────────────────────────────────────────

type ClientStatus = "Active" | "Inactive" | "Crisis";
type Program = "Case Management" | "Crisis Support" | "Housing" | "Employment";

interface Assignment {
  clientId: string;
  clientName: string;
  clientStatus: ClientStatus;
  staffId: string;
  staffName: string;
  program: Program;
  assignedDate: string;
}

interface StaffMember {
  id: string;
  name: string;
}

// ─── Seed data ────────────────────────────────────────────────────────────────

const STAFF: StaffMember[] = [
  { id: "s1", name: "Marcus Rivera" },
  { id: "s2", name: "Yolanda Tran" },
  { id: "s3", name: "Devon Okafor" },
  { id: "s4", name: "Priya Nair" },
];

const SEED_ASSIGNMENTS: Assignment[] = [
  { clientId: "c01", clientName: "Aaliyah Brooks", clientStatus: "Active",   staffId: "s1", staffName: "Marcus Rivera", program: "Case Management",  assignedDate: "2025-01-14" },
  { clientId: "c02", clientName: "Jerome Mitchell", clientStatus: "Crisis",  staffId: "s1", staffName: "Marcus Rivera", program: "Crisis Support",    assignedDate: "2025-03-02" },
  { clientId: "c03", clientName: "Destiny Chang",   clientStatus: "Active",  staffId: "s2", staffName: "Yolanda Tran",  program: "Housing",            assignedDate: "2025-02-07" },
  { clientId: "c04", clientName: "Raymond Flores",  clientStatus: "Inactive",staffId: "s2", staffName: "Yolanda Tran",  program: "Employment",         assignedDate: "2024-11-20" },
  { clientId: "c05", clientName: "Sasha Monroe",    clientStatus: "Active",  staffId: "s2", staffName: "Yolanda Tran",  program: "Case Management",    assignedDate: "2025-01-30" },
  { clientId: "c06", clientName: "Liam Patterson",  clientStatus: "Active",  staffId: "s3", staffName: "Devon Okafor", program: "Employment",          assignedDate: "2025-02-18" },
  { clientId: "c07", clientName: "Nadia Kozlov",    clientStatus: "Crisis",  staffId: "s3", staffName: "Devon Okafor", program: "Crisis Support",      assignedDate: "2025-04-01" },
  { clientId: "c08", clientName: "Theo Williams",   clientStatus: "Active",  staffId: "s4", staffName: "Priya Nair",   program: "Housing",             assignedDate: "2025-01-05" },
  { clientId: "c09", clientName: "Camille Dubois",  clientStatus: "Active",  staffId: "s4", staffName: "Priya Nair",   program: "Case Management",     assignedDate: "2025-03-15" },
  { clientId: "c10", clientName: "Isaac Osei",      clientStatus: "Inactive",staffId: "s4", staffName: "Priya Nair",   program: "Employment",          assignedDate: "2024-12-10" },
];

const STATUS_STYLES: Record<ClientStatus, string> = {
  Active:   "border-emerald-700/60 bg-emerald-900/30 text-emerald-400",
  Inactive: "border-slate-700/60  bg-slate-800/40    text-slate-400",
  Crisis:   "border-rose-700/60   bg-rose-900/30     text-rose-400",
};

const PROGRAMS: ("All" | Program)[] = ["All", "Case Management", "Crisis Support", "Housing", "Employment"];
const STATUSES: ("All" | ClientStatus)[] = ["All", "Active", "Inactive", "Crisis"];

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminAssignmentsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.replace("/portal/admin/auth");
  }, [user, isLoading, router]);

  const [assignments, setAssignments] = useState<Assignment[]>(SEED_ASSIGNMENTS);
  const [search, setSearch] = useState("");
  const [filterProgram, setFilterProgram] = useState<"All" | Program>("All");
  const [filterStatus, setFilterStatus] = useState<"All" | ClientStatus>("All");

  // Reassign modal state
  const [reassigning, setReassigning] = useState<Assignment | null>(null);
  const [newStaffId, setNewStaffId] = useState("");

  const filtered = useMemo(() => {
    return assignments.filter((a) => {
      const q = search.toLowerCase();
      const matchSearch =
        a.clientName.toLowerCase().includes(q) ||
        a.staffName.toLowerCase().includes(q) ||
        a.program.toLowerCase().includes(q);
      const matchProgram = filterProgram === "All" || a.program === filterProgram;
      const matchStatus = filterStatus === "All" || a.clientStatus === filterStatus;
      return matchSearch && matchProgram && matchStatus;
    });
  }, [assignments, search, filterProgram, filterStatus]);

  // Workload per staff
  const workload = useMemo(() => {
    return STAFF.map((s) => ({
      ...s,
      count: assignments.filter((a) => a.staffId === s.id).length,
    }));
  }, [assignments]);
  const maxLoad = Math.max(...workload.map((w) => w.count), 1);

  const unassigned = 0; // all seed clients are assigned; kept for future dynamic data
  const crisisCount = assignments.filter((a) => a.clientStatus === "Crisis").length;

  function openReassign(a: Assignment) {
    setReassigning(a);
    setNewStaffId(a.staffId);
  }

  function confirmReassign() {
    if (!reassigning || !newStaffId) return;
    const staff = STAFF.find((s) => s.id === newStaffId);
    if (!staff) return;
    setAssignments((prev) =>
      prev.map((a) =>
        a.clientId === reassigning.clientId
          ? { ...a, staffId: staff.id, staffName: staff.name }
          : a
      )
    );
    setReassigning(null);
  }

  if (isLoading || !user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6"
    >
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-white">
          <ClipboardList size={22} className="text-violet-400" /> Client Assignments
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Manage client-to-staff assignments, monitor workloads, and reassign as needed
        </p>
      </div>

      {/* ── Stats row ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Clients",      value: assignments.length, icon: Users,       color: "text-violet-400" },
          { label: "Unassigned",         value: unassigned,         icon: AlertCircle, color: "text-amber-400" },
          { label: "Active Assignments", value: assignments.filter((a) => a.clientStatus === "Active").length,
                                                                    icon: UserCheck,   color: "text-emerald-400" },
          { label: "Crisis Cases",       value: crisisCount,        icon: AlertCircle, color: "text-rose-400" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <GlowCard key={s.label} className="bg-slate-900 border-slate-800 p-4 flex flex-col items-center text-center gap-1">
              <Icon size={18} className={s.color} />
              <p className={cn("text-2xl font-extrabold", s.color)}>{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </GlowCard>
          );
        })}
      </div>

      {/* ── Workload bars ───────────────────────────────────────────────── */}
      <GlowCard className="bg-slate-900 border-slate-800 p-5">
        <h2 className="mb-4 text-sm font-bold text-slate-300">Staff Workload</h2>
        <div className="space-y-3">
          {workload.map((w) => (
            <div key={w.id} className="flex items-center gap-3">
              <span className="w-32 shrink-0 truncate text-sm text-slate-300">{w.name}</span>
              <div className="relative flex-1 h-2.5 rounded-full bg-slate-800 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(w.count / maxLoad) * 100}%` }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className={cn("h-full rounded-full", w.count === maxLoad ? "bg-amber-500" : "bg-violet-500")}
                />
              </div>
              <span className="w-6 text-right text-sm font-bold text-slate-400">{w.count}</span>
            </div>
          ))}
        </div>
      </GlowCard>

      {/* ── Filters ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search client or staff name…"
            className="w-full rounded-xl border border-slate-700 bg-slate-900 pl-9 pr-4 py-2.5 text-sm text-white outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition"
          />
        </div>
        <div className="relative">
          <select
            value={filterProgram}
            title="Filter by program"
            onChange={(e) => setFilterProgram(e.target.value as typeof filterProgram)}
            className="appearance-none rounded-xl border border-slate-700 bg-slate-900 pl-4 pr-8 py-2.5 text-sm text-white outline-none focus:border-violet-500/50 transition"
          >
            {PROGRAMS.map((p) => <option key={p}>{p}</option>)}
          </select>
          <ChevronDown size={12} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
        </div>
        <div className="relative">
          <select
            value={filterStatus}
            title="Filter by status"
            onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
            className="appearance-none rounded-xl border border-slate-700 bg-slate-900 pl-4 pr-8 py-2.5 text-sm text-white outline-none focus:border-violet-500/50 transition"
          >
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <ChevronDown size={12} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
        </div>
      </div>

      {/* ── Assignments table ───────────────────────────────────────────── */}
      <GlowCard className="bg-slate-900 border-slate-800 p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3">Client</th>
                <th className="px-5 py-3">Staff Member</th>
                <th className="px-5 py-3">Program</th>
                <th className="px-5 py-3">Assigned</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-slate-500">
                    No assignments match your filters.
                  </td>
                </tr>
              )}
              {filtered.map((a) => (
                <tr key={a.clientId} className="border-b border-slate-800/60 hover:bg-slate-800/30 transition">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-white">{a.clientName}</p>
                      <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-semibold", STATUS_STYLES[a.clientStatus])}>
                        {a.clientStatus}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-300">{a.staffName}</td>
                  <td className="px-5 py-3">
                    <span className="rounded-full bg-violet-900/30 border border-violet-700/40 px-2.5 py-0.5 text-xs font-semibold text-violet-400">
                      {a.program}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-500">
                    {new Date(a.assignedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => openReassign(a)}
                      className="rounded-xl border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:border-violet-600/60 hover:text-violet-400 transition"
                    >
                      Reassign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlowCard>

      {/* ── Reassign modal ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {reassigning && (
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.93, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 12 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-white">Reassign Client</h3>
                <button
                  type="button"
                  title="Close"
                  onClick={() => setReassigning(null)}
                  className="text-slate-500 hover:text-white transition"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <p className="text-xs text-slate-500 mb-1">Client</p>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-white">{reassigning.clientName}</p>
                    <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-semibold", STATUS_STYLES[reassigning.clientStatus])}>
                      {reassigning.clientStatus}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{reassigning.program}</p>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-400">Assign to Staff Member</label>
                  <div className="relative">
                    <select
                      value={newStaffId}
                      title="Select staff member"
                      onChange={(e) => setNewStaffId(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-950 pl-4 pr-8 py-2.5 text-sm text-white outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition"
                    >
                      {STAFF.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                    <ChevronDown size={12} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReassigning(null)}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition"
                  >
                    <X size={12} /> Cancel
                  </button>
                  <button
                    type="button"
                    onClick={confirmReassign}
                    disabled={newStaffId === reassigning.staffId}
                    className="flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-500 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Check size={12} /> Confirm Reassignment
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
