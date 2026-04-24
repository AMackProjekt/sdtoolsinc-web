"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";
import {
  Target,
  Plus,
  CheckCircle2,
  Circle,
  Pencil,
  Trash2,
  X,
  ChevronDown,
  ChevronUp,
  TrendingUp,
} from "lucide-react";

type GoalStatus = "active" | "completed" | "paused";

interface SmartGoal {
  id: string;
  title: string;
  specific: string;
  measurable: string;
  achievable: string;
  relevant: string;
  timeBound: string;
  dueDate: string;
  progress: number;
  status: GoalStatus;
  createdAt: string;
}

const INITIAL_GOALS: SmartGoal[] = [
  {
    id: "1",
    title: "Complete GED Certification",
    specific: "Pass all 4 sections of the GED exam to earn my high school equivalency diploma",
    measurable: "Score 145+ on each of the 4 test subjects (Reasoning, Math, Science, Social Studies)",
    achievable: "Attend weekly tutoring sessions and complete 30 min of practice daily",
    relevant: "Required for the job training program and better employment opportunities",
    timeBound: "Complete by June 30, 2026",
    dueDate: "2026-06-30",
    progress: 60,
    status: "active",
    createdAt: "2026-01-15",
  },
  {
    id: "2",
    title: "Secure Stable Housing",
    specific: "Move into a permanent, affordable apartment in the city",
    measurable: "Submit 5 rental applications and save $1,200 for deposit and first month",
    achievable: "Work with housing coordinator and use housing voucher program",
    relevant: "Stable housing is the foundation for all other recovery and employment goals",
    timeBound: "Move in by May 15, 2026",
    dueDate: "2026-05-15",
    progress: 40,
    status: "active",
    createdAt: "2026-02-01",
  },
  {
    id: "3",
    title: "30-Day Wellness Streak",
    specific: "Complete daily wellness check-in and self-care routine for 30 consecutive days",
    measurable: "Log self-care activities in the app every day without missing a day",
    achievable: "Set phone reminders and start with just 10 minutes of mindfulness per day",
    relevant: "Builds mental resilience and healthy habits for long-term recovery",
    timeBound: "Complete by April 30, 2026",
    dueDate: "2026-04-30",
    progress: 100,
    status: "completed",
    createdAt: "2026-03-01",
  },
];

const STATUS_CONFIG: Record<GoalStatus, { label: string; color: string; bg: string }> = {
  active: { label: "Active", color: "text-teal-400", bg: "bg-teal-400/15" },
  completed: { label: "Completed", color: "text-emerald-400", bg: "bg-emerald-400/15" },
  paused: { label: "Paused", color: "text-amber-400", bg: "bg-amber-400/15" },
};

const EMPTY_FORM: Omit<SmartGoal, "id" | "createdAt"> = {
  title: "",
  specific: "",
  measurable: "",
  achievable: "",
  relevant: "",
  timeBound: "",
  dueDate: "",
  progress: 0,
  status: "active",
};

export default function GoalsPage() {
  const [goals, setGoals] = useState<SmartGoal[]>(INITIAL_GOALS);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState<typeof EMPTY_FORM>({ ...EMPTY_FORM });
  const [filter, setFilter] = useState<GoalStatus | "all">("all");

  const filtered = filter === "all" ? goals : goals.filter((g) => g.status === filter);
  const totalActive = goals.filter((g) => g.status === "active").length;
  const totalCompleted = goals.filter((g) => g.status === "completed").length;
  const avgProgress = goals.filter(g => g.status === "active").reduce((sum, g) => sum + g.progress, 0) / Math.max(totalActive, 1);

  function openNew() {
    setForm({ ...EMPTY_FORM });
    setEditingId(null);
    setShowForm(true);
  }

  function openEdit(goal: SmartGoal) {
    const { id, createdAt, ...rest } = goal;
    setForm({ ...rest });
    setEditingId(id);
    setShowForm(true);
  }

  function saveGoal() {
    if (!form.title.trim()) return;
    if (editingId) {
      setGoals((prev) =>
        prev.map((g) => (g.id === editingId ? { ...g, ...form } : g))
      );
    } else {
      const newGoal: SmartGoal = {
        ...form,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split("T")[0],
      };
      setGoals((prev) => [newGoal, ...prev]);
    }
    setShowForm(false);
    setEditingId(null);
  }

  function deleteGoal(id: string) {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }

  function toggleComplete(id: string) {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === id
          ? { ...g, status: g.status === "completed" ? "active" : "completed", progress: g.status === "completed" ? g.progress : 100 }
          : g
      )
    );
  }

  return (
    <div className="min-h-screen bg-bg p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="h2 text-text flex items-center gap-3">
            <Target className="text-teal-400" size={28} />
            S.M.A.R.T. Goals
          </h1>
          <p className="p-lead mt-1">Specific · Measurable · Achievable · Relevant · Time-Bound</p>
        </div>
        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ y: 0 }}
          onClick={openNew}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg"
        >
          <Plus size={16} />
          New Goal
        </motion.button>
      </div>

      {/* Stats Row */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        {[
          { label: "Active Goals", value: totalActive, color: "text-teal-400" },
          { label: "Completed", value: totalCompleted, color: "text-emerald-400" },
          { label: "Avg Progress", value: `${Math.round(avgProgress)}%`, color: "text-sky-400" },
        ].map((stat) => (
          <GlowCard key={stat.label} className="p-4 text-center">
            <div className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</div>
            <div className="mt-1 text-xs text-muted">{stat.label}</div>
          </GlowCard>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2">
        {(["all", "active", "completed", "paused"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${
              filter === f
                ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                : "bg-panel text-muted border border-border hover:text-text"
            }`}
          >
            {f === "all" ? "All Goals" : f}
          </button>
        ))}
      </div>

      {/* Goal Cards */}
      <div className="space-y-4">
        <AnimatePresence>
          {filtered.map((goal) => {
            const sc = STATUS_CONFIG[goal.status];
            const expanded = expandedId === goal.id;
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                layout
              >
                <GlowCard className="p-5">
                  <div className="flex items-start gap-4">
                    <button onClick={() => toggleComplete(goal.id)} className="mt-0.5 shrink-0">
                      {goal.status === "completed" ? (
                        <CheckCircle2 className="text-emerald-400" size={22} />
                      ) : (
                        <Circle className="text-muted hover:text-teal-400 transition" size={22} />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`font-bold text-base ${goal.status === "completed" ? "line-through text-muted" : "text-text"}`}>
                          {goal.title}
                        </h3>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${sc.bg} ${sc.color}`}>
                          {sc.label}
                        </span>
                        <span className="text-xs text-muted">Due {goal.dueDate}</span>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${goal.progress}%` }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className={`h-full rounded-full ${goal.status === "completed" ? "bg-emerald-400" : "bg-gradient-to-r from-teal-500 to-teal-400"}`}
                          />
                        </div>
                        <span className="text-xs font-semibold text-muted w-10 text-right">{goal.progress}%</span>
                      </div>

                      {/* Expanded SMART fields */}
                      <AnimatePresence>
                        {expanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 overflow-hidden"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {[
                                { key: "S", label: "Specific", value: goal.specific },
                                { key: "M", label: "Measurable", value: goal.measurable },
                                { key: "A", label: "Achievable", value: goal.achievable },
                                { key: "R", label: "Relevant", value: goal.relevant },
                                { key: "T", label: "Time-Bound", value: goal.timeBound },
                              ].map((item) => (
                                <div key={item.key} className="rounded-lg bg-white/4 p-3">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-500/20 text-xs font-bold text-teal-400">
                                      {item.key}
                                    </span>
                                    <span className="text-xs font-semibold text-muted uppercase tracking-wide">{item.label}</span>
                                  </div>
                                  <p className="text-sm text-text leading-relaxed">{item.value || "—"}</p>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => setExpandedId(expanded ? null : goal.id)}
                        className="rounded-lg p-1.5 text-muted hover:text-text transition hover:bg-white/5"
                        title={expanded ? "Collapse" : "Expand"}
                      >
                        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      <button
                        onClick={() => openEdit(goal)}
                        className="rounded-lg p-1.5 text-muted hover:text-teal-400 transition hover:bg-teal-500/10"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="rounded-lg p-1.5 text-muted hover:text-red-400 transition hover:bg-red-500/10"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </GlowCard>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="py-16 text-center text-muted">
            <Target className="mx-auto mb-3 opacity-30" size={40} />
            <p className="text-sm">No goals yet. Click <strong className="text-teal-400">New Goal</strong> to get started.</p>
          </div>
        )}
      </div>

      {/* Goal Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass rounded-2xl border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6"
            >
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-bold text-text">
                  {editingId ? "Edit Goal" : "Create S.M.A.R.T. Goal"}
                </h2>
                <button onClick={() => setShowForm(false)} className="text-muted hover:text-text transition">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1">Goal Title *</label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Complete job training program"
                    className="w-full rounded-xl bg-white/6 border border-border px-4 py-2.5 text-sm text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                  />
                </div>

                {[
                  { key: "specific" as const, letter: "S", label: "Specific", placeholder: "What exactly do you want to accomplish?" },
                  { key: "measurable" as const, letter: "M", label: "Measurable", placeholder: "How will you track and measure progress?" },
                  { key: "achievable" as const, letter: "A", label: "Achievable", placeholder: "Is this realistic? What resources do you need?" },
                  { key: "relevant" as const, letter: "R", label: "Relevant", placeholder: "Why does this goal matter to your overall growth?" },
                  { key: "timeBound" as const, letter: "T", label: "Time-Bound", placeholder: "What is the specific deadline or timeline?" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1">
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-teal-500/20 text-teal-400 mr-1 text-[10px] font-bold">
                        {field.letter}
                      </span>
                      {field.label}
                    </label>
                    <textarea
                      value={form[field.key]}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      rows={2}
                      className="w-full rounded-xl bg-white/6 border border-border px-4 py-2.5 text-sm text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-teal-500/50 resize-none"
                    />
                  </div>
                ))}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1">Due Date</label>
                    <input
                      type="date"
                      value={form.dueDate}
                      onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                      className="w-full rounded-xl bg-white/6 border border-border px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1">Progress ({form.progress}%)</label>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={form.progress}
                      onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })}
                      className="w-full mt-3 accent-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as GoalStatus })}
                    className="w-full rounded-xl bg-white/6 border border-border px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                  >
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex gap-3 justify-end">
                <button
                  onClick={() => setShowForm(false)}
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-muted hover:text-text border border-border transition"
                >
                  Cancel
                </button>
                <button
                  onClick={saveGoal}
                  disabled={!form.title.trim()}
                  className="rounded-xl px-5 py-2 text-sm font-semibold bg-gradient-to-r from-teal-500 to-teal-600 text-white disabled:opacity-50 transition"
                >
                  {editingId ? "Save Changes" : "Create Goal"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
