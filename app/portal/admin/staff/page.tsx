"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { motion, AnimatePresence } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";
import { UserCheck, UserX, Clock, Search, Briefcase, UserPlus, Link2, X } from "lucide-react";
import { cn } from "@/lib/cn";

interface StaffMember {
  id: string;
  email: string;
  name: string;
  title: string;
  department: string;
  status: "active" | "on_leave" | "terminated";
  hire_date: string;
  manager_id?: string;
}

interface Participant {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  status: string;
  case_manager_id?: string;
}

const EMPTY_STAFF = { name: "", email: "", title: "", department: "", status: "active" as const, hire_date: "" };

const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  on_leave: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
  terminated: "bg-red-500/20 text-red-400 border border-red-500/30",
};

const STATUS_LABELS: Record<string, string> = {
  active: "Active",
  on_leave: "On Leave",
  terminated: "Terminated",
};

export default function AdminStaffPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Add Staff modal
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [addForm, setAddForm] = useState(EMPTY_STAFF);
  const [addingStaff, setAddingStaff] = useState(false);
  const [addError, setAddError] = useState("");

  // Assign Client modal
  const [assignTarget, setAssignTarget] = useState<StaffMember | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState("");
  const [savingAssign, setSavingAssign] = useState(false);
  const [assignError, setAssignError] = useState("");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/portal/admin/auth");
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetch("/api/enterprise/staff")
      .then((r) => r.json())
      .then((d) => setStaff(Array.isArray(d) ? d : d.staff ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  function refreshStaff() {
    fetch("/api/enterprise/staff")
      .then((r) => r.json())
      .then((d) => setStaff(Array.isArray(d) ? d : d.staff ?? []))
      .catch(() => {});
  }

  async function handleAddStaff(e: React.FormEvent) {
    e.preventDefault();
    setAddError("");
    if (!addForm.name || !addForm.email || !addForm.hire_date) {
      setAddError("Name, email, and hire date are required.");
      return;
    }
    setAddingStaff(true);
    try {
      const res = await fetch("/api/enterprise/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addForm),
      });
      if (!res.ok) {
        const d = await res.json();
        setAddError(d.error ?? "Failed to add staff member.");
        return;
      }
      setShowAddStaff(false);
      setAddForm(EMPTY_STAFF);
      refreshStaff();
    } catch {
      setAddError("Network error. Please try again.");
    } finally {
      setAddingStaff(false);
    }
  }

  function openAssignModal(member: StaffMember) {
    setAssignTarget(member);
    setSelectedParticipant("");
    setAssignError("");
    setParticipants([]);
    setLoadingParticipants(true);
    fetch("/api/enterprise/participants?status=enrolled")
      .then((r) => r.json())
      .then((d) => {
        const all: Participant[] = Array.isArray(d) ? d : d.participants ?? [];
        setParticipants(all.filter((p) => !p.case_manager_id));
      })
      .catch(() => setAssignError("Could not load participants."))
      .finally(() => setLoadingParticipants(false));
  }

  async function handleAssign(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedParticipant || !assignTarget) return;
    setSavingAssign(true);
    setAssignError("");
    try {
      const res = await fetch("/api/enterprise/case-assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participant_id: selectedParticipant, staff_id: assignTarget.id }),
      });
      if (!res.ok) {
        const d = await res.json();
        setAssignError(d.error ?? "Failed to assign client.");
        return;
      }
      setAssignTarget(null);
    } catch {
      setAssignError("Network error. Please try again.");
    } finally {
      setSavingAssign(false);
    }
  }

  if (isLoading || !isAuthenticated) return null;

  const filtered = staff.filter(
    (s) =>
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.department.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = staff.filter((s) => s.status === "active").length;
  const onLeaveCount = staff.filter((s) => s.status === "on_leave").length;
  const terminatedCount = staff.filter((s) => s.status === "terminated").length;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Staff Roster</h1>
          <p className="mt-1 text-sm text-slate-400">View and manage all staff members across departments.</p>
        </div>
        <button
          onClick={() => { setAddForm(EMPTY_STAFF); setAddError(""); setShowAddStaff(true); }}
          className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-violet-500 active:scale-95"
        >
          <UserPlus className="h-4 w-4" />
          Add Staff Member
        </button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Active", value: activeCount, icon: UserCheck, color: "text-emerald-400" },
          { label: "On Leave", value: onLeaveCount, icon: Clock, color: "text-amber-400" },
          { label: "Terminated", value: terminatedCount, icon: UserX, color: "text-red-400" },
        ].map(({ label, value, icon: Icon, color }) => (
          <GlowCard key={label} className="p-4">
            <div className="flex items-center gap-3">
              <Icon className={cn("h-5 w-5", color)} />
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</div>
                <div className={cn("text-2xl font-extrabold", color)}>{loading ? "—" : value}</div>
              </div>
            </div>
          </GlowCard>
        ))}
      </div>

      {/* Search */}
      <GlowCard className="p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, title, or department…"
            className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm text-white placeholder-slate-500 outline-none focus:border-violet-500/60"
          />
        </div>
      </GlowCard>

      {/* Table */}
      <GlowCard className="overflow-hidden p-0">
        {loading ? (
          <div className="flex h-48 items-center justify-center text-slate-400">Loading staff…</div>
        ) : filtered.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center gap-2 text-slate-400">
            <Briefcase className="h-8 w-8 opacity-40" />
            <span className="text-sm">No staff members found.</span>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/8 bg-white/3">
              <tr>
                {["Name", "Title", "Department", "Status", "Hire Date", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((s, i) => (
                <motion.tr
                  key={s.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-white/4 transition"
                >
                  <td className="px-5 py-3 font-semibold text-white">{s.name}</td>
                  <td className="px-5 py-3 text-slate-300">{s.title}</td>
                  <td className="px-5 py-3 text-slate-400">{s.department}</td>
                  <td className="px-5 py-3">
                    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", STATUS_COLORS[s.status])}>
                      {STATUS_LABELS[s.status]}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-400">
                    {new Date(s.hire_date).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => openAssignModal(s)}
                      className="inline-flex items-center gap-1.5 rounded-md border border-sky-500/40 px-2.5 py-1 text-xs font-semibold text-sky-400 transition hover:bg-sky-500/15"
                    >
                      <Link2 className="h-3.5 w-3.5" />
                      Assign Client
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </GlowCard>

      {/* ── Add Staff Modal ── */}
      <AnimatePresence>
        {showAddStaff && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <GlowCard className="w-full max-w-lg p-6">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">Add Staff Member</h2>
                <button onClick={() => setShowAddStaff(false)} aria-label="Close">
                  <X className="h-5 w-5 text-slate-400 transition hover:text-white" />
                </button>
              </div>
              <form onSubmit={handleAddStaff} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-400">Full Name *</label>
                    <input
                      value={addForm.name}
                      onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="Jane Doe"
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-violet-500/60"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-400">Email *</label>
                    <input
                      type="email"
                      value={addForm.email}
                      onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="jane@example.org"
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-violet-500/60"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-400">Job Title</label>
                    <input
                      value={addForm.title}
                      onChange={(e) => setAddForm((f) => ({ ...f, title: e.target.value }))}
                      placeholder="Case Manager"
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-violet-500/60"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-400">Department</label>
                    <input
                      value={addForm.department}
                      onChange={(e) => setAddForm((f) => ({ ...f, department: e.target.value }))}
                      placeholder="Programs"
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-violet-500/60"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-400">Status</label>
                    <select
                      value={addForm.status}
                      onChange={(e) => setAddForm((f) => ({ ...f, status: e.target.value as typeof addForm.status }))}
                      className="w-full rounded-lg border border-white/10 bg-[#0c0f17] px-3 py-2 text-sm text-white outline-none focus:border-violet-500/60"
                    >
                      <option value="active">Active</option>
                      <option value="on_leave">On Leave</option>
                      <option value="terminated">Terminated</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-400">Hire Date *</label>
                    <input
                      type="date"
                      value={addForm.hire_date}
                      onChange={(e) => setAddForm((f) => ({ ...f, hire_date: e.target.value }))}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-violet-500/60"
                    />
                  </div>
                </div>
                {addError && (
                  <p className="rounded-md bg-red-500/10 px-3 py-2 text-xs text-red-400">{addError}</p>
                )}
                <div className="flex justify-end gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddStaff(false)}
                    className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-slate-400 transition hover:border-white/20 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addingStaff}
                    className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:opacity-60"
                  >
                    {addingStaff ? "Adding…" : "Add Staff Member"}
                  </button>
                </div>
              </form>
            </GlowCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Assign Client Modal ── */}
      <AnimatePresence>
        {assignTarget && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <GlowCard className="w-full max-w-md p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">Assign Client</h2>
                  <p className="mt-0.5 text-xs text-slate-400">Case manager: {assignTarget.name}</p>
                </div>
                <button onClick={() => setAssignTarget(null)} aria-label="Close">
                  <X className="h-5 w-5 text-slate-400 transition hover:text-white" />
                </button>
              </div>
              <form onSubmit={handleAssign} className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-400">Select Participant</label>
                  {loadingParticipants ? (
                    <p className="text-xs text-slate-400">Loading participants…</p>
                  ) : participants.length === 0 ? (
                    <p className="rounded-md bg-amber-500/10 px-3 py-2 text-xs text-amber-400">
                      No unassigned enrolled participants available.
                    </p>
                  ) : (
                    <select
                      value={selectedParticipant}
                      onChange={(e) => setSelectedParticipant(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-[#0c0f17] px-3 py-2 text-sm text-white outline-none focus:border-sky-500/60"
                    >
                      <option value="">— Select a participant —</option>
                      {participants.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.first_name} {p.last_name}
                          {p.email ? ` (${p.email})` : ""}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                {assignError && (
                  <p className="rounded-md bg-red-500/10 px-3 py-2 text-xs text-red-400">{assignError}</p>
                )}
                <div className="flex justify-end gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setAssignTarget(null)}
                    className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-slate-400 transition hover:border-white/20 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingAssign || !selectedParticipant || loadingParticipants}
                    className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:opacity-60"
                  >
                    {savingAssign ? "Assigning…" : "Assign Client"}
                  </button>
                </div>
              </form>
            </GlowCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
