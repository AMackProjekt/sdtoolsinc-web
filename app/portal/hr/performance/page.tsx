"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";
import { cn } from "@/lib/cn";
import {
  Star, TrendingUp, CheckCircle2, ClipboardList, X, Plus, ChevronDown, ChevronUp,
} from "lucide-react";

// ─── Types & Mock Data ────────────────────────────────────────────────────────

type ReviewStatus = "not-started" | "in-progress" | "completed";

interface Competency {
  label: string;
  score: number; // 1–5
}

interface Goal {
  description: string;
  met: boolean;
}

interface Review {
  id: string;
  employee: string;
  title: string;
  dept: string;
  reviewer: string;
  status: ReviewStatus;
  overall: number; // 1–5
  competencies: Competency[];
  goals: Goal[];
  notes: string;
  period: string;
}

const BASE_COMPETENCIES = (
  c: number, t: number, i: number, j: number, r: number
): Competency[] => [
  { label: "Communication",  score: c },
  { label: "Teamwork",       score: t },
  { label: "Initiative",     score: i },
  { label: "Job Knowledge",  score: j },
  { label: "Reliability",    score: r },
];

const INITIAL_REVIEWS: Review[] = [
  {
    id: "rv1", employee: "Marcus Johnson", title: "Case Manager II", dept: "Client Services",
    reviewer: "Priya Sharma", status: "completed", overall: 4, period: "Annual 2025",
    competencies: BASE_COMPETENCIES(4, 5, 3, 4, 5),
    goals: [
      { description: "Reduce client wait time by 15%", met: true },
      { description: "Complete advanced case management certification", met: false },
    ],
    notes: "Marcus continues to be a reliable team lead. Encourages others well.",
  },
  {
    id: "rv2", employee: "Priya Sharma", title: "Program Coordinator", dept: "Operations",
    reviewer: "James Thornton", status: "in-progress", overall: 5, period: "Annual 2025",
    competencies: BASE_COMPETENCIES(5, 5, 5, 5, 5),
    goals: [
      { description: "Launch new client intake workflow", met: true },
      { description: "Mentor 2 junior coordinators", met: true },
    ],
    notes: "Exceptional performance across all competencies.",
  },
  {
    id: "rv3", employee: "Devon Clarke", title: "Intake Specialist", dept: "Client Services",
    reviewer: "Marcus Johnson", status: "not-started", overall: 0, period: "Annual 2025",
    competencies: BASE_COMPETENCIES(0, 0, 0, 0, 0),
    goals: [
      { description: "Improve documentation accuracy to 95%", met: false },
      { description: "Complete Trauma-Informed Care training", met: false },
    ],
    notes: "",
  },
  {
    id: "rv4", employee: "Sandra Nguyen", title: "Data Analyst", dept: "Technology",
    reviewer: "James Thornton", status: "completed", overall: 4, period: "Annual 2025",
    competencies: BASE_COMPETENCIES(3, 4, 5, 5, 4),
    goals: [
      { description: "Build automated reporting dashboard", met: true },
      { description: "Reduce data entry errors by 20%", met: true },
    ],
    notes: "Sandra's technical contributions have significantly improved our reporting.",
  },
  {
    id: "rv5", employee: "James Thornton", title: "Finance Manager", dept: "Finance",
    reviewer: "Director", status: "in-progress", overall: 4, period: "Annual 2025",
    competencies: BASE_COMPETENCIES(4, 4, 4, 5, 5),
    goals: [
      { description: "Complete audit with no findings", met: true },
      { description: "Implement new budget variance process", met: false },
    ],
    notes: "Strong fiscal management. Audit completed flawlessly.",
  },
  {
    id: "rv6", employee: "Aaliyah Brooks", title: "HR Generalist", dept: "Human Resources",
    reviewer: "Priya Sharma", status: "not-started", overall: 0, period: "Annual 2025",
    competencies: BASE_COMPETENCIES(0, 0, 0, 0, 0),
    goals: [
      { description: "Complete HR certification exam", met: false },
      { description: "Develop updated onboarding checklist", met: false },
    ],
    notes: "",
  },
];

const RATING_LABEL: Record<number, string> = { 0: "N/A", 1: "Unsatisfactory", 2: "Needs Improvement", 3: "Meets Expectations", 4: "Exceeds Expectations", 5: "Outstanding" };
const RATING_COLOR: Record<number, string> = { 0: "text-slate-500", 1: "text-red-400", 2: "text-orange-400", 3: "text-amber-400", 4: "text-sky-400", 5: "text-emerald-400" };

const STATUS_STYLES: Record<ReviewStatus, string> = {
  "not-started": "bg-slate-700/40 text-slate-400 border border-slate-600/40",
  "in-progress":  "bg-amber-900/40 text-amber-400 border border-amber-700/40",
  "completed":    "bg-emerald-900/40 text-emerald-400 border border-emerald-700/40",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function PerformancePage() {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [activeReview, setActiveReview] = useState<Review | null>(null);
  const [scratch, setScratch] = useState<{ overall: number; scores: number[]; notes: string; goalsChecked: boolean[] }>({
    overall: 3, scores: [3, 3, 3, 3, 3], notes: "", goalsChecked: [false, false],
  });

  const completed  = reviews.filter(r => r.status === "completed").length;
  const inProgress = reviews.filter(r => r.status === "in-progress").length;
  const notStarted = reviews.filter(r => r.status === "not-started").length;
  const avgRating  = useMemo(() => {
    const done = reviews.filter(r => r.status === "completed" && r.overall > 0);
    return done.length ? (done.reduce((a, r) => a + r.overall, 0) / done.length).toFixed(1) : "—";
  }, [reviews]);

  function openReview(r: Review) {
    setActiveReview(r);
    setScratch({
      overall: r.overall || 3,
      scores: r.competencies.map(c => c.score || 3),
      notes: r.notes,
      goalsChecked: r.goals.map(g => g.met),
    });
    setShowReviewModal(true);
  }

  function submitReview() {
    if (!activeReview) return;
    const updated: Review = {
      ...activeReview,
      status: "completed",
      overall: scratch.overall,
      notes: scratch.notes,
      competencies: activeReview.competencies.map((c, i) => ({ ...c, score: scratch.scores[i] })),
      goals: activeReview.goals.map((g, i) => ({ ...g, met: scratch.goalsChecked[i] })),
    };
    setReviews(prev => prev.map(r => r.id === activeReview.id ? updated : r));
    setShowReviewModal(false);
  }

  function StarRow({ score, size = 14 }: { score: number; size?: number }) {
    return (
      <span className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(n => (
          <Star key={n} size={size} className={n <= score ? "text-amber-400 fill-amber-400" : "text-slate-700"} />
        ))}
      </span>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Performance Reviews</h1>
          <p className="mt-1 text-sm text-slate-400">Annual review cycle — 2025</p>
        </div>
        <span className="rounded-full border border-amber-700/40 bg-amber-900/30 px-3.5 py-1.5 text-xs font-semibold text-amber-300">
          Cycle: Annual 2025
        </span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Completed",   value: completed,  color: "text-emerald-400" },
          { label: "In Progress", value: inProgress, color: "text-amber-400" },
          { label: "Not Started", value: notStarted, color: "text-slate-400" },
          { label: "Avg Rating",  value: avgRating,  color: "text-sky-400" },
        ].map(({ label, value, color }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <GlowCard className="p-4">
              <div className={cn("text-2xl font-extrabold", color)}>{value}</div>
              <div className="mt-0.5 text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</div>
            </GlowCard>
          </motion.div>
        ))}
      </div>

      {/* Review Cards */}
      <div className="space-y-3">
        {reviews.map(r => (
          <GlowCard key={r.id} className="p-0 overflow-hidden">
            <div
              className="flex flex-wrap items-center gap-4 p-5 cursor-pointer hover:bg-slate-800/10 transition"
              onClick={() => setExpanded(expanded === r.id ? null : r.id)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-bold text-white">{r.employee}</span>
                  <span className="text-xs text-slate-400">{r.title} · {r.dept}</span>
                  <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize", STATUS_STYLES[r.status])}>
                    {r.status.replace("-", " ")}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                  <span>Reviewer: <span className="text-slate-300">{r.reviewer}</span></span>
                  {r.status === "completed" && (
                    <span className={cn("font-semibold", RATING_COLOR[r.overall])}>
                      {r.overall}/5 — {RATING_LABEL[r.overall]}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {r.status === "completed" && <StarRow score={r.overall} />}
                {r.status !== "completed" && (
                  <button
                    onClick={e => { e.stopPropagation(); openReview(r); }}
                    className="rounded-lg bg-amber-600 hover:bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white transition"
                  >
                    {r.status === "in-progress" ? "Continue Review" : "Start Review"}
                  </button>
                )}
                {expanded === r.id ? <ChevronUp size={15} className="text-slate-400" /> : <ChevronDown size={15} className="text-slate-400" />}
              </div>
            </div>

            {/* Expanded detail */}
            <AnimatePresence>
              {expanded === r.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-t border-border"
                >
                  <div className="grid grid-cols-1 gap-6 p-5 lg:grid-cols-2">
                    {/* Competencies */}
                    <div>
                      <div className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">Competency Scores</div>
                      <div className="space-y-2.5">
                        {r.competencies.map(c => (
                          <div key={c.label} className="flex items-center justify-between">
                            <span className="text-sm text-slate-300">{c.label}</span>
                            <div className="flex items-center gap-2">
                              <StarRow score={c.score} size={12} />
                              <span className={cn("text-xs font-semibold w-4 text-right", RATING_COLOR[c.score])}>{c.score || "—"}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Goals */}
                    <div>
                      <div className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">Goals</div>
                      <div className="space-y-2">
                        {r.goals.map((g, i) => (
                          <div key={i} className="flex items-start gap-2.5">
                            <CheckCircle2 size={14} className={cn("mt-0.5 shrink-0", g.met ? "text-emerald-400" : "text-slate-600")} />
                            <span className={cn("text-sm", g.met ? "text-slate-200" : "text-slate-400 line-through")}>{g.description}</span>
                          </div>
                        ))}
                      </div>
                      {r.notes && (
                        <div className="mt-4">
                          <div className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">Notes</div>
                          <div className="text-sm text-slate-300 leading-relaxed">{r.notes}</div>
                        </div>
                      )}
                    </div>
                  </div>
                  {r.status === "completed" && (
                    <div className="border-t border-border px-5 py-3 flex justify-end">
                      <button
                        onClick={() => openReview(r)}
                        className="text-xs text-amber-400 hover:text-amber-300 transition"
                      >
                        Edit Review
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </GlowCard>
        ))}
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && activeReview && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-panel p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white">Performance Review</h2>
                  <p className="text-sm text-slate-400">{activeReview.employee} · {activeReview.period}</p>
                </div>
                <button onClick={() => setShowReviewModal(false)} className="rounded-lg p-2 text-slate-400 hover:text-white transition"><X size={18} /></button>
              </div>

              {/* Overall Rating */}
              <div className="mb-5">
                <label className="mb-2 block text-xs font-semibold text-slate-400">Overall Rating</label>
                <div className="flex items-center gap-3">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      onClick={() => setScratch(s => ({ ...s, overall: n }))}
                      className={cn("flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold border transition",
                        scratch.overall === n
                          ? "border-amber-500 bg-amber-600 text-white"
                          : "border-border bg-slate-800/60 text-slate-400 hover:border-amber-600"
                      )}
                    >{n}</button>
                  ))}
                  <span className={cn("text-sm font-semibold ml-1", RATING_COLOR[scratch.overall])}>
                    {RATING_LABEL[scratch.overall]}
                  </span>
                </div>
              </div>

              {/* Competencies */}
              <div className="mb-5">
                <div className="mb-2 text-xs font-semibold text-slate-400">Competency Scores</div>
                <div className="space-y-3">
                  {activeReview.competencies.map((c, i) => (
                    <div key={c.label} className="flex items-center justify-between gap-3">
                      <span className="text-sm text-slate-300 w-36">{c.label}</span>
                      <div className="flex items-center gap-1.5">
                        {[1,2,3,4,5].map(n => (
                          <button
                            key={n}
                            onClick={() => setScratch(s => { const scores = [...s.scores]; scores[i] = n; return { ...s, scores }; })}
                            className={cn("h-7 w-7 rounded text-xs font-bold border transition",
                              scratch.scores[i] === n
                                ? "border-amber-500 bg-amber-600 text-white"
                                : "border-border bg-slate-800/60 text-slate-500 hover:border-amber-600"
                            )}
                          >{n}</button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Goals */}
              <div className="mb-5">
                <div className="mb-2 text-xs font-semibold text-slate-400">Goals Achieved</div>
                <div className="space-y-2">
                  {activeReview.goals.map((g, i) => (
                    <label key={i} className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={scratch.goalsChecked[i]}
                        onChange={e => setScratch(s => { const g2 = [...s.goalsChecked]; g2[i] = e.target.checked; return { ...s, goalsChecked: g2 }; })}
                        className="mt-0.5 accent-amber-500"
                      />
                      <span className={cn("text-sm", scratch.goalsChecked[i] ? "text-slate-200" : "text-slate-400")}>{g.description}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="mb-5">
                <label className="mb-1 block text-xs font-semibold text-slate-400">Reviewer Notes</label>
                <textarea
                  rows={3}
                  value={scratch.notes}
                  onChange={e => setScratch(s => ({ ...s, notes: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-slate-800/60 px-3 py-2 text-sm text-text focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button onClick={() => setShowReviewModal(false)} className="rounded-lg border border-border px-4 py-2 text-sm text-slate-400 hover:text-white transition">Cancel</button>
                <button
                  onClick={submitReview}
                  className="rounded-lg bg-amber-600 hover:bg-amber-500 px-5 py-2 text-sm font-semibold text-white transition"
                >
                  Submit Review
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
