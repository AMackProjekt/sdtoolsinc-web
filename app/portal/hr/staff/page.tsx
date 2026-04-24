"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";
import { cn } from "@/lib/cn";
import {
  Search, UserPlus, X, ChevronDown, ChevronUp,
  Mail, Phone, Briefcase, Calendar, Building2, User, Edit2,
} from "lucide-react";
import { STAFF_DATA, DEPARTMENTS, type StaffMember } from "@/lib/hr-data";


const STATUS_COLORS: Record<string, string> = {
  active:     "bg-emerald-900/40 text-emerald-400 border border-emerald-700/40",
  "on-leave": "bg-amber-900/40 text-amber-400 border border-amber-700/40",
  onboarding: "bg-sky-900/40 text-sky-400 border border-sky-700/40",
  terminated: "bg-red-900/40 text-red-400 border border-red-700/40",
};

const STATUS_LABELS: Record<string, string> = {
  active: "Active", "on-leave": "On Leave", onboarding: "Onboarding", terminated: "Terminated",
};

const EMPTY_FORM: Omit<StaffMember, "id"> = {
  name: "", title: "", dept: "Client Services", status: "active",
  hire: "", email: "", phone: "", supervisor: "", type: "Full-time",
  location: "Main Office", emergency_name: "", emergency_phone: "", emergency_rel: "",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function HRStaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>(STAFF_DATA);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<StaffMember | null>(null);
  const [form, setForm] = useState<Omit<StaffMember, "id">>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() =>
    staff.filter((s) => {
      const q = search.toLowerCase();
      return (
        (!q || s.name.toLowerCase().includes(q) || s.title.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)) &&
        (deptFilter === "All" || s.dept === deptFilter) &&
        (statusFilter === "All" || s.status === statusFilter)
      );
    }),
    [staff, search, deptFilter, statusFilter]
  );

  function openAdd() { setForm(EMPTY_FORM); setEditTarget(null); setShowModal(true); }
  function openEdit(s: StaffMember) { setForm({ ...s }); setEditTarget(s); setShowModal(true); }

  function handleSubmit() {
    if (!form.name || !form.email || !form.title) return;
    setSaving(true);
    setTimeout(() => {
      if (editTarget) {
        setStaff((prev) => prev.map((s) => s.id === editTarget.id ? { ...s, ...form } : s));
      } else {
        setStaff((prev) => [...prev, { ...form, id: `s${Date.now()}` }]);
      }
      setSaving(false);
      setShowModal(false);
    }, 600);
  }

  function handleStatusChange(id: string, status: StaffMember["status"]) {
    setStaff((prev) => prev.map((s) => s.id === id ? { ...s, status } : s));
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Staff Directory</h1>
          <p className="mt-1 text-sm text-slate-400">Manage employee records, roles, and contact information</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 rounded-lg bg-amber-600 hover:bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition"
        >
          <UserPlus size={15} /> Add Staff
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Staff",  value: staff.length },
          { label: "Active",       value: staff.filter(s => s.status === "active").length },
          { label: "On Leave",     value: staff.filter(s => s.status === "on-leave").length },
          { label: "Onboarding",   value: staff.filter(s => s.status === "onboarding").length },
        ].map(({ label, value }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <GlowCard className="p-4">
              <div className="text-2xl font-extrabold text-white">{value}</div>
              <div className="mt-0.5 text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</div>
            </GlowCard>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <GlowCard className="p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, title, email…"
              className="w-full rounded-lg border border-border bg-slate-800/60 pl-9 pr-3 py-2 text-sm text-text placeholder:text-muted focus:outline-none focus:border-amber-500"
            />
          </div>
          <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} title="Filter by department"
            className="rounded-lg border border-border bg-slate-800/60 px-3 py-2 text-sm text-text focus:outline-none focus:border-amber-500">
            {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} title="Filter by status"
            className="rounded-lg border border-border bg-slate-800/60 px-3 py-2 text-sm text-text focus:outline-none focus:border-amber-500">
            <option value="All">All Statuses</option>
            {["active","on-leave","onboarding","terminated"].map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
        </div>
      </GlowCard>

      {/* Table */}
      <GlowCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-slate-900/40">
                <th className="px-5 py-3 text-xs font-semibold text-slate-400">Employee</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-400 hidden md:table-cell">Department</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-400 hidden lg:table-cell">Type</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-400 hidden lg:table-cell">Hire Date</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-400">Status</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <>
                  <tr
                    key={s.id}
                    className="border-b border-border/50 hover:bg-slate-800/20 transition cursor-pointer"
                    onClick={() => setExpandedId(expandedId === s.id ? null : s.id)}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-900/40 text-xs font-bold text-amber-300">
                          {s.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{s.name}</div>
                          <div className="text-xs text-slate-400">{s.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-400 hidden md:table-cell">{s.dept}</td>
                    <td className="px-5 py-3 text-slate-400 hidden lg:table-cell">{s.type}</td>
                    <td className="px-5 py-3 text-slate-400 hidden lg:table-cell">{s.hire}</td>
                    <td className="px-5 py-3">
                      <select
                        value={s.status}
                        title="Update employee status"
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => handleStatusChange(s.id, e.target.value as StaffMember["status"])}
                        className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold border-0 cursor-pointer focus:outline-none", STATUS_COLORS[s.status])}
                      >
                        {["active","on-leave","onboarding","terminated"].map((v) => (
                          <option key={v} value={v} className="bg-slate-900 text-white">{STATUS_LABELS[v]}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); openEdit(s); }}
                          className="rounded-lg p-1.5 text-slate-400 hover:text-amber-400 hover:bg-amber-900/30 transition"
                          title="Edit"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setExpandedId(expandedId === s.id ? null : s.id); }}
                          className="rounded-lg p-1.5 text-slate-400 hover:text-amber-400 hover:bg-amber-900/30 transition"
                          title="Details"
                        >
                          {expandedId === s.id ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                        </button>
                      </div>
                    </td>
                  </tr>

                  <AnimatePresence>
                    {expandedId === s.id && (
                      <motion.tr
                        key={`${s.id}-exp`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <td colSpan={6} className="bg-slate-900/40 px-5 pb-5 pt-3">
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="space-y-2">
                              <div className="text-xs font-semibold uppercase tracking-widest text-slate-500">Contact</div>
                              <div className="flex items-center gap-2 text-sm text-slate-300"><Mail size={13} className="text-amber-400 shrink-0" />{s.email}</div>
                              <div className="flex items-center gap-2 text-sm text-slate-300"><Phone size={13} className="text-amber-400 shrink-0" />{s.phone}</div>
                            </div>
                            <div className="space-y-2">
                              <div className="text-xs font-semibold uppercase tracking-widest text-slate-500">Employment</div>
                              <div className="flex items-center gap-2 text-sm text-slate-300"><Briefcase size={13} className="text-amber-400 shrink-0" />{s.type}</div>
                              <div className="flex items-center gap-2 text-sm text-slate-300"><Building2 size={13} className="text-amber-400 shrink-0" />{s.location}</div>
                              <div className="flex items-center gap-2 text-sm text-slate-300"><Calendar size={13} className="text-amber-400 shrink-0" />Hired {s.hire}</div>
                            </div>
                            <div className="space-y-2">
                              <div className="text-xs font-semibold uppercase tracking-widest text-slate-500">Reports To</div>
                              <div className="flex items-center gap-2 text-sm text-slate-300"><User size={13} className="text-amber-400 shrink-0" />{s.supervisor}</div>
                            </div>
                            <div className="space-y-2">
                              <div className="text-xs font-semibold uppercase tracking-widest text-slate-500">Emergency Contact</div>
                              <div className="text-sm font-semibold text-white">{s.emergency_name} <span className="font-normal text-slate-400">({s.emergency_rel})</span></div>
                              <div className="flex items-center gap-2 text-sm text-slate-300"><Phone size={13} className="text-amber-400 shrink-0" />{s.emergency_phone}</div>
                            </div>
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-slate-500">No staff match your filters.</div>
          )}
        </div>
      </GlowCard>

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-panel p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-white">{editTarget ? "Edit Staff Member" : "Add Staff Member"}</h2>
                <button
                  type="button"
                  aria-label="Close modal"
                  title="Close modal"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg p-2 text-slate-400 hover:text-white transition"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {([
                  { label: "Full Name *", key: "name", type: "text" },
                  { label: "Job Title *", key: "title", type: "text" },
                  { label: "Email *", key: "email", type: "email" },
                  { label: "Phone", key: "phone", type: "tel" },
                  { label: "Hire Date", key: "hire", type: "text", placeholder: "e.g. Jul 1, 2025" },
                  { label: "Supervisor", key: "supervisor", type: "text" },
                  { label: "Emergency Contact Name", key: "emergency_name", type: "text" },
                  { label: "Emergency Phone", key: "emergency_phone", type: "tel" },
                  { label: "Relationship", key: "emergency_rel", type: "text" },
                ] as Array<{ label: string; key: keyof typeof EMPTY_FORM; type: string; placeholder?: string }>).map(({ label, key, type, placeholder }) => (
                  <div key={key}>
                    <label className="mb-1 block text-xs font-semibold text-slate-400">{label}</label>
                    <input
                      type={type} placeholder={placeholder ?? ""}
                      value={(form[key] as string) ?? ""}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      className="w-full rounded-lg border border-border bg-slate-800/60 px-3 py-2 text-sm text-text focus:outline-none focus:border-amber-500"
                    />
                  </div>
                ))}
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-400">Department</label>
                  <select value={form.dept} onChange={(e) => setForm({ ...form, dept: e.target.value })} title="Department"
                    className="w-full rounded-lg border border-border bg-slate-800/60 px-3 py-2 text-sm text-text focus:outline-none focus:border-amber-500">
                    {DEPARTMENTS.filter(d => d !== "All").map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-400">Employment Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as typeof form.type })} title="Employment type"
                    className="w-full rounded-lg border border-border bg-slate-800/60 px-3 py-2 text-sm text-text focus:outline-none focus:border-amber-500">
                    {["Full-time","Part-time","Contract"].map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-400">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as typeof form.status })} title="Status"
                    className="w-full rounded-lg border border-border bg-slate-800/60 px-3 py-2 text-sm text-text focus:outline-none focus:border-amber-500">
                    {["active","on-leave","onboarding","terminated"].map((s) => (
                      <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-400">Location</label>
                  <select value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} title="Location"
                    className="w-full rounded-lg border border-border bg-slate-800/60 px-3 py-2 text-sm text-text focus:outline-none focus:border-amber-500">
                    {["Main Office","Remote","Hybrid"].map((l) => <option key={l}>{l}</option>)}
                  </select>
                </div>
              </div>
              <div className="mt-5 flex justify-end gap-3">
                <button onClick={() => setShowModal(false)} className="rounded-lg border border-border px-4 py-2 text-sm text-slate-400 hover:text-white transition">Cancel</button>
                <button
                  onClick={handleSubmit}
                  disabled={saving || !form.name || !form.email || !form.title}
                  className="rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-50 px-5 py-2 text-sm font-semibold text-white transition"
                >
                  {saving ? "Saving…" : editTarget ? "Save Changes" : "Add Staff"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
