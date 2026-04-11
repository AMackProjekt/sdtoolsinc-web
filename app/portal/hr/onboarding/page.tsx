"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";
import { cn } from "@/lib/cn";
import {
  UserPlus, CheckCircle2, Circle, ChevronDown, ChevronUp,
  X, Clock, AlertTriangle, Users,
} from "lucide-react";

// ─── Types & Mock Data ────────────────────────────────────────────────────────

interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

interface OnboardingHire {
  id: string;
  name: string;
  role: string;
  dept: string;
  supervisor: string;
  startDate: string;
  checklist: ChecklistItem[];
}

const mkChecklist = (overrides: Record<string, boolean> = {}): ChecklistItem[] =>
  [
    { id: "offer",       label: "Offer Letter Signed"           },
    { id: "bg",          label: "Background Check Cleared"      },
    { id: "i9",          label: "I-9 & Tax Forms (W-4) Filed"   },
    { id: "direct",      label: "Direct Deposit Enrolled"       },
    { id: "hipaa",       label: "HIPAA Training Completed"      },
    { id: "orientation", label: "Orientation Day Attended"      },
    { id: "it",          label: "IT Equipment Assigned"         },
    { id: "access",      label: "System Access Granted"         },
    { id: "badge",       label: "Building Access / Badge"       },
    { id: "checkin30",   label: "30-Day Check-in Scheduled"     },
  ].map((item) => ({ ...item, completed: overrides[item.id] ?? false }));

const INITIAL_HIRES: OnboardingHire[] = [
  {
    id: "ob1",
    name: "Tyler Reed",
    role: "Support Specialist",
    dept: "Client Services",
    supervisor: "Marcus Johnson",
    startDate: "Jul 1, 2025",
    checklist: mkChecklist({ offer: true, bg: true, i9: true, direct: true }),
  },
  {
    id: "ob2",
    name: "Fatima Ali",
    role: "Case Manager I",
    dept: "Client Services",
    supervisor: "Marcus Johnson",
    startDate: "Jul 1, 2025",
    checklist: mkChecklist({ offer: true, bg: true, i9: true, direct: true, hipaa: true, orientation: true, it: true }),
  },
  {
    id: "ob3",
    name: "Carlos Vega",
    role: "Program Assistant",
    dept: "Operations",
    supervisor: "Priya Sharma",
    startDate: "Aug 1, 2025",
    checklist: mkChecklist({ offer: true, bg: true, i9: true, direct: true, hipaa: true, orientation: true }),
  },
];

const PROGRESS_COLOR = (pct: number) =>
  pct === 100 ? "bg-emerald-500" : pct >= 60 ? "bg-amber-500" : "bg-sky-500";

const EMPTY_FORM = { name: "", role: "", dept: "Client Services", supervisor: "", start: "" };

// ─── Component ────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const [hires, setHires] = useState<OnboardingHire[]>(INITIAL_HIRES);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  function pct(hire: OnboardingHire) {
    const done = hire.checklist.filter(c => c.completed).length;
    return Math.round((done / hire.checklist.length) * 100);
  }

  function toggleTask(hireId: string, taskId: string) {
    setHires(prev =>
      prev.map(h =>
        h.id !== hireId ? h :
        { ...h, checklist: h.checklist.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t) }
      )
    );
  }

  function completeOnboarding(hireId: string) {
    setCompletedIds(prev => [...prev, hireId]);
    setTimeout(() => {
      setHires(prev => prev.filter(h => h.id !== hireId));
      setCompletedIds(prev => prev.filter(id => id !== hireId));
    }, 1200);
  }

  function handleAdd() {
    if (!form.name || !form.role) return;
    setSaving(true);
    setTimeout(() => {
      setHires(prev => [...prev, {
        id: `ob${Date.now()}`,
        name: form.name, role: form.role, dept: form.dept,
        supervisor: form.supervisor, startDate: form.start,
        checklist: mkChecklist(),
      }]);
      setSaving(false);
      setShowAdd(false);
      setForm(EMPTY_FORM);
    }, 600);
  }

  const onTrack = hires.filter(h => pct(h) >= 50).length;
  const needsAttn = hires.filter(h => pct(h) < 50).length;
  const allDone = (id: string) => hires.find(h => h.id === id)?.checklist.every(t => t.completed) ?? false;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Onboarding Pipeline</h1>
          <p className="mt-1 text-sm text-slate-400">Track new hire progress through the onboarding checklist</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 rounded-lg bg-amber-600 hover:bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition"
        >
          <UserPlus size={15} /> Add New Hire
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "In Onboarding",       value: hires.length,                  color: "text-sky-400" },
          { label: "On Track (≥50%)",     value: onTrack,                        color: "text-emerald-400" },
          { label: "Needs Attention",      value: needsAttn,                      color: "text-amber-400" },
          { label: "Completed This Month", value: 4,                              color: "text-slate-300" },
        ].map(({ label, value, color }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <GlowCard className="p-4">
              <div className={cn("text-2xl font-extrabold", color)}>{value}</div>
              <div className="mt-0.5 text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</div>
            </GlowCard>
          </motion.div>
        ))}
      </div>

      {/* Hire Cards */}
      <div className="space-y-4">
        <AnimatePresence>
          {hires.map((hire) => {
            const progress = pct(hire);
            const expanded = expandedId === hire.id;
            const isCompleting = completedIds.includes(hire.id);

            return (
              <motion.div
                key={hire.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: isCompleting ? 0.5 : 1, scale: isCompleting ? 0.98 : 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
              >
                <GlowCard className="p-5">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-900/40 text-sm font-bold text-amber-300">
                        {hire.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{hire.name}</div>
                        <div className="text-xs text-slate-400">{hire.role} · {hire.dept}</div>
                        <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><Users size={11} />{hire.supervisor}</span>
                          <span className="flex items-center gap-1"><Clock size={11} />Start: {hire.startDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {progress < 50 && (
                        <span className="flex items-center gap-1 rounded-full bg-amber-900/40 px-2.5 py-0.5 text-xs font-semibold text-amber-400 border border-amber-700/40">
                          <AlertTriangle size={11} /> Needs Attention
                        </span>
                      )}
                      <button
                        onClick={() => setExpandedId(expanded ? null : hire.id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:text-amber-400 hover:bg-amber-900/30 transition"
                      >
                        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="mb-1.5 flex items-center justify-between text-xs text-slate-400">
                      <span>{hire.checklist.filter(t => t.completed).length} / {hire.checklist.length} tasks completed</span>
                      <span className="font-semibold text-white">{progress}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-700/50">
                      <motion.div
                        className={cn("h-full rounded-full", PROGRESS_COLOR(progress))}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  {/* Checklist (expanded) */}
                  <AnimatePresence>
                    {expanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 border-t border-border pt-4">
                          {hire.checklist.map((task) => (
                            <button
                              key={task.id}
                              onClick={() => toggleTask(hire.id, task.id)}
                              className={cn(
                                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition text-left",
                                task.completed
                                  ? "bg-emerald-900/20 text-emerald-300 border border-emerald-700/30"
                                  : "bg-slate-800/40 text-slate-300 border border-border hover:border-amber-700/40",
                              )}
                            >
                              {task.completed
                                ? <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                                : <Circle size={15} className="text-slate-500 shrink-0" />
                              }
                              {task.label}
                            </button>
                          ))}
                        </div>

                        {allDone(hire.id) && (
                          <div className="mt-4 flex justify-end">
                            <button
                              onClick={() => completeOnboarding(hire.id)}
                              disabled={isCompleting}
                              className="flex items-center gap-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 px-4 py-2 text-sm font-semibold text-white transition"
                            >
                              <CheckCircle2 size={15} />
                              {isCompleting ? "Completing…" : "Complete Onboarding"}
                            </button>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </GlowCard>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {hires.length === 0 && (
          <GlowCard className="py-16 text-center">
            <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-3" />
            <div className="text-white font-semibold">All caught up!</div>
            <div className="mt-1 text-sm text-slate-400">No active onboarding hires at this time.</div>
          </GlowCard>
        )}
      </div>

      {/* Add New Hire Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-2xl border border-border bg-panel p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-white">Add New Hire</h2>
                <button onClick={() => setShowAdd(false)} className="rounded-lg p-2 text-slate-400 hover:text-white transition"><X size={18} /></button>
              </div>
              <div className="space-y-4">
                {([
                  { label: "Full Name *", key: "name", type: "text" },
                  { label: "Job Title *", key: "role", type: "text" },
                  { label: "Supervisor", key: "supervisor", type: "text" },
                  { label: "Start Date", key: "start", type: "text", placeholder: "e.g. Aug 1, 2025" },
                ] as Array<{ label: string; key: keyof typeof EMPTY_FORM; type: string; placeholder?: string }>).map(({ label, key, type, placeholder }) => (
                  <div key={key}>
                    <label className="mb-1 block text-xs font-semibold text-slate-400">{label}</label>
                    <input
                      type={type} placeholder={placeholder ?? ""}
                      value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      className="w-full rounded-lg border border-border bg-slate-800/60 px-3 py-2 text-sm text-text focus:outline-none focus:border-amber-500"
                    />
                  </div>
                ))}
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-400">Department</label>
                  <select value={form.dept} onChange={(e) => setForm({ ...form, dept: e.target.value })}
                    className="w-full rounded-lg border border-border bg-slate-800/60 px-3 py-2 text-sm text-text focus:outline-none focus:border-amber-500">
                    {["Client Services","Operations","Finance","Technology","Human Resources","Outreach"].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div className="mt-5 flex justify-end gap-3">
                <button onClick={() => setShowAdd(false)} className="rounded-lg border border-border px-4 py-2 text-sm text-slate-400 hover:text-white transition">Cancel</button>
                <button
                  onClick={handleAdd} disabled={saving || !form.name || !form.role}
                  className="rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-50 px-5 py-2 text-sm font-semibold text-white transition"
                >
                  {saving ? "Adding…" : "Add New Hire"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
