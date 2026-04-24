"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  Loader2,
  MessageSquareQuote,
  RefreshCw,
  Save,
  ThumbsUp,
  UserRound,
} from "lucide-react";
import { GlowCard } from "@/components/ui/GlowCard";
import { averageScore, type InterviewAttemptRecord } from "@/lib/interview-ready";

function scorePill(score: number) {
  if (score >= 4.2) return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
  if (score >= 3.2) return "bg-sky-500/20 text-sky-300 border-sky-500/40";
  if (score >= 2.5) return "bg-amber-500/20 text-amber-300 border-amber-500/40";
  return "bg-rose-500/20 text-rose-300 border-rose-500/40";
}

const demoRecords: InterviewAttemptRecord[] = [
  {
    id: "demo-1",
    clientId: "participant-demo-1",
    clientName: "Jordan M.",
    tentUID: "TENT-7781",
    caseManager: "Maria C.",
    interviewType: "Customer Service Interview",
    jobType: "Customer Service Interview",
    questionAsked: "Can you explain a gap in employment?",
    clientAnswer: "I took time to stabilize housing and support my family, then completed readiness training.",
    aiImprovedAnswer:
      "I had a short employment gap while I stabilized housing and family responsibilities. During that time, I completed employment readiness training and strengthened my communication and attendance habits. I am now fully prepared and motivated to return to work.",
    clarityScore: 4,
    confidenceScore: 4,
    professionalismScore: 4,
    jobRelevanceScore: 3,
    growthMindsetScore: 4,
    completenessScore: 3,
    averageReadinessScore: 3.8,
    barrierFlag: true,
    cmReviewed: true,
    virtualHighFive: true,
    cmComment: "Excellent effort and growing confidence.",
    feedbackSummary:
      "Client communicated honestly and respectfully. Next step is adding a workplace example to increase relevance.",
    createdDate: new Date().toISOString(),
    submittedToCaseManager: true,
    caseManagerNotes: "Reviewing progress with client during next check-in.",
    followUpNeeded: true,
  },
];

export default function StaffInterviewReadyPage() {
  const [records, setRecords] = useState<InterviewAttemptRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [coachingRecommendation, setCoachingRecommendation] = useState(
    "Use one STAR-based role-play focused on explaining employment gaps and ending with a strengths statement."
  );

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/interview-ready/sessions", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load");
      const data = (await res.json()) as InterviewAttemptRecord[];
      setRecords(data.length ? data : demoRecords);
    } catch {
      setRecords(demoRecords);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const selected = records.find((record) => record.id === selectedId) ?? records[0] ?? null;

  useEffect(() => {
    if (!selectedId && records.length) {
      setSelectedId(records[0].id);
    }
  }, [records, selectedId]);

  const summary = useMemo(() => {
    if (!records.length) {
      return {
        readiness: 0,
        confidenceTrend: "No data",
        commonAreas: [] as string[],
        interviewReadyCount: 0,
        needSupportCount: 0,
        barrierCount: 0,
      };
    }

    const clarity = averageScore(records, "clarity");
    const professionalism = averageScore(records, "professionalism");
    const jobRelevance = averageScore(records, "jobRelevance");
    const growthMindset = averageScore(records, "growthMindset");

    const map = [
      { label: "Clarity", score: clarity },
      { label: "Professional Tone", score: professionalism },
      { label: "Job Relevance", score: jobRelevance },
      { label: "Growth Mindset", score: growthMindset },
    ].sort((a, b) => a.score - b.score);

    const readiness = Number(
      ((clarity + professionalism + jobRelevance + growthMindset) / 4).toFixed(2)
    );

    const interviewReadyCount = records.filter(
      (item) => (item.averageReadinessScore ?? 0) >= 3.8
    ).length;
    const needSupportCount = records.length - interviewReadyCount;
    const barrierCount = records.filter((item) => item.barrierFlag).length;

    return {
      readiness,
      confidenceTrend: growthMindset >= 3.5 ? "Improving" : "Needs reinforcement",
      commonAreas: map.slice(0, 2).map((item) => item.label),
      interviewReadyCount,
      needSupportCount,
      barrierCount,
    };
  }, [records]);

  const updateRecord = async (next: Partial<InterviewAttemptRecord>) => {
    if (!selected) return;
    setSaving(true);
    try {
      await fetch("/api/interview-ready/sessions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selected.id,
          followUpNeeded: next.followUpNeeded,
          caseManagerNotes: next.caseManagerNotes,
          cmReviewed: next.cmReviewed,
          cmComment: next.cmComment,
          virtualHighFive: next.virtualHighFive,
        }),
      });

      setRecords((prev) =>
        prev.map((record) => (record.id === selected.id ? { ...record, ...next } : record))
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1320px] px-6 py-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-extrabold tracking-tight text-text">
          Staff Portal: InterviewReady AI Coach Review Panel
        </h1>
        <p className="mt-2 text-sm text-slate-300/85 max-w-5xl">
          Review client interview attempts, readiness scores, confidence trends, and coaching needs in one place.
        </p>
      </motion.div>

      {loading ? (
        <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-10 text-center text-slate-300">
          <Loader2 className="mx-auto mb-3 animate-spin" size={20} />
          Loading interview records...
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <GlowCard className="p-5 border border-slate-700/50">
              <div className="text-xs uppercase tracking-wider text-slate-400">Client interview attempts</div>
              <div className="mt-2 text-2xl font-black text-white">{records.length}</div>
            </GlowCard>
            <GlowCard className="p-5 border border-slate-700/50">
              <div className="text-xs uppercase tracking-wider text-slate-400">Interview Ready</div>
              <div className="mt-2 text-2xl font-black text-emerald-300">{summary.interviewReadyCount}</div>
            </GlowCard>
            <GlowCard className="p-5 border border-slate-700/50">
              <div className="text-xs uppercase tracking-wider text-slate-400">Need Support</div>
              <div className="mt-2 text-2xl font-black text-amber-300">{summary.needSupportCount}</div>
            </GlowCard>
            <GlowCard className="p-5 border border-slate-700/50">
              <div className="text-xs uppercase tracking-wider text-slate-400">Barrier Flags</div>
              <div className="mt-2 text-2xl font-black text-rose-300">{summary.barrierCount}</div>
            </GlowCard>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <GlowCard className="p-5 border border-slate-700/50">
              <div className="text-xs uppercase tracking-wider text-slate-400">AI readiness summary</div>
              <div className="mt-2 text-2xl font-black text-white">{summary.readiness}/5</div>
            </GlowCard>
            <GlowCard className="p-5 border border-slate-700/50">
              <div className="text-xs uppercase tracking-wider text-slate-400">Confidence trend</div>
              <div className="mt-2 text-2xl font-black text-white">{summary.confidenceTrend}</div>
            </GlowCard>
            <GlowCard className="p-5 border border-slate-700/50">
              <div className="text-xs uppercase tracking-wider text-slate-400">Refresh records</div>
              <button
                onClick={load}
                className="mt-2 inline-flex items-center gap-2 rounded-lg border border-sky-500/45 bg-sky-500/15 px-3 py-1.5 text-sm font-semibold text-sky-200 hover:bg-sky-500/25"
              >
                <RefreshCw size={14} />
                Reload
              </button>
            </GlowCard>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
            <GlowCard className="p-6 border border-slate-700/50">
              <div className="mb-3 flex items-center gap-2 text-slate-100 font-semibold">
                <ClipboardCheck size={15} className="text-sky-300" />
                Client Interview History
              </div>

              <div className="overflow-auto">
                <table className="w-full min-w-[860px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-700/60 text-xs uppercase tracking-wider text-slate-400">
                      <th className="px-2 py-2">Client</th>
                      <th className="px-2 py-2">Job Type</th>
                      <th className="px-2 py-2">Question</th>
                      <th className="px-2 py-2">Scores</th>
                      <th className="px-2 py-2">Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((row) => {
                      const active = selected?.id === row.id;
                      const avg = Number(
                        (
                          (row.clarityScore +
                            (row.confidenceScore ?? row.clarityScore) +
                            row.professionalismScore +
                            row.jobRelevanceScore +
                            (row.completenessScore ?? row.professionalismScore)) /
                          5
                        ).toFixed(1)
                      );

                      return (
                        <tr
                          key={row.id}
                          onClick={() => setSelectedId(row.id)}
                          className={`cursor-pointer border-b border-slate-800/60 transition ${
                            active ? "bg-sky-500/10" : "hover:bg-slate-800/55"
                          }`}
                        >
                          <td className="px-2 py-3">
                            <div className="font-semibold text-slate-100">{row.clientName}</div>
                            <div className="text-xs text-slate-400">{new Date(row.createdDate).toLocaleDateString()}</div>
                          </td>
                          <td className="px-2 py-3 text-slate-300">{row.jobType}</td>
                          <td className="px-2 py-3 text-slate-300 max-w-[260px] truncate">{row.questionAsked}</td>
                          <td className="px-2 py-3">
                            <span className={`rounded-full border px-2 py-1 text-xs font-semibold ${scorePill(avg)}`}>
                              {avg}/5
                            </span>
                            {row.barrierFlag && (
                              <div className="mt-1 text-[10px] font-semibold text-rose-300">Barrier Flag</div>
                            )}
                          </td>
                          <td className="px-2 py-3">
                            {row.submittedToCaseManager ? (
                              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/20 px-2 py-1 text-xs text-emerald-200">
                                <CheckCircle2 size={12} />
                                Yes
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/20 px-2 py-1 text-xs text-amber-200">
                                <AlertTriangle size={12} />
                                Pending
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </GlowCard>

            <GlowCard className="p-6 border border-slate-700/50">
              {!selected ? (
                <p className="text-sm text-slate-400">No selected interview record.</p>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs uppercase tracking-wider text-slate-400">Selected Client</div>
                      <div className="mt-1 flex items-center gap-2 text-white font-bold">
                        <UserRound size={14} className="text-sky-300" />
                        {selected.clientName}
                      </div>
                    </div>
                    <span className={`rounded-full border px-2 py-1 text-xs font-semibold ${scorePill(Number(((selected.clarityScore + (selected.confidenceScore ?? selected.clarityScore) + selected.professionalismScore + selected.jobRelevanceScore + (selected.completenessScore ?? selected.professionalismScore)) / 5).toFixed(1)))}`}>
                      Avg {Number(((selected.clarityScore + (selected.confidenceScore ?? selected.clarityScore) + selected.professionalismScore + selected.jobRelevanceScore + (selected.completenessScore ?? selected.professionalismScore)) / 5).toFixed(1))}/5
                    </span>
                  </div>

                  <div className="rounded-lg border border-slate-700/60 bg-slate-950/55 p-3">
                    <div className="text-xs uppercase tracking-wider text-slate-400">AI readiness summary</div>
                    <p className="mt-1 text-sm text-slate-200">{selected.feedbackSummary}</p>
                  </div>

                  <div>
                    <div className="mb-1 text-xs uppercase tracking-wider text-slate-400">Scores by category</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        ["Clarity", selected.clarityScore],
                        ["Professionalism", selected.professionalismScore],
                        ["Job Relevance", selected.jobRelevanceScore],
                        ["Growth Mindset", selected.growthMindsetScore],
                      ].map(([label, value]) => (
                        <div key={label} className={`rounded-lg border px-2 py-1.5 font-semibold ${scorePill(Number(value))}`}>
                          {label}: {value}/5
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg border border-slate-700/60 bg-slate-950/55 p-3">
                    <div className="mb-1 text-xs uppercase tracking-wider text-slate-400">Common improvement areas</div>
                    <div className="flex flex-wrap gap-2">
                      {summary.commonAreas.map((area) => (
                        <span key={area} className="rounded-full border border-amber-500/40 bg-amber-500/20 px-2 py-1 text-xs text-amber-200">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  <label className="flex items-center justify-between rounded-lg border border-slate-700/60 bg-slate-950/55 px-3 py-2.5">
                    <span className="text-sm text-slate-200">Follow-up needed</span>
                    <input
                      type="checkbox"
                      checked={selected.followUpNeeded}
                      onChange={(e) => updateRecord({ followUpNeeded: e.target.checked })}
                      className="h-4 w-4 accent-sky-400"
                    />
                  </label>

                  <label className="space-y-1.5">
                    <span className="text-xs uppercase tracking-wider text-slate-400">Case manager notes</span>
                    <textarea
                      rows={3}
                      value={selected.caseManagerNotes}
                      onChange={(e) => {
                        const note = e.target.value;
                        setRecords((prev) =>
                          prev.map((row) => (row.id === selected.id ? { ...row, caseManagerNotes: note } : row))
                        );
                      }}
                      className="w-full rounded-lg border border-slate-700/70 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400/60"
                    />
                  </label>

                  <label className="space-y-1.5">
                    <span className="text-xs uppercase tracking-wider text-slate-400">Coaching recommendation field</span>
                    <textarea
                      rows={3}
                      value={coachingRecommendation}
                      onChange={(e) => setCoachingRecommendation(e.target.value)}
                      className="w-full rounded-lg border border-slate-700/70 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400/60"
                    />
                  </label>

                  <label className="space-y-1.5">
                    <span className="text-xs uppercase tracking-wider text-slate-400">Virtual High-Five / CM Comment</span>
                    <textarea
                      rows={2}
                      value={selected.cmComment ?? ""}
                      onChange={(e) => {
                        const comment = e.target.value;
                        setRecords((prev) =>
                          prev.map((row) => (row.id === selected.id ? { ...row, cmComment: comment } : row))
                        );
                      }}
                      className="w-full rounded-lg border border-slate-700/70 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400/60"
                    />
                  </label>

                  <button
                    onClick={() => {
                      const nextComment =
                        selected.cmComment && selected.cmComment.trim().length
                          ? selected.cmComment
                          : "Virtual High-Five: Great momentum. Keep practicing your story.";
                      updateRecord({ virtualHighFive: true, cmComment: nextComment, cmReviewed: true });
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-500/45 bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-200 hover:bg-emerald-500/25"
                  >
                    <ThumbsUp size={15} />
                    Send Virtual High-Five
                  </button>

                  <button
                    onClick={() =>
                      updateRecord({
                        caseManagerNotes: `${selected.caseManagerNotes}\nCoaching Recommendation: ${coachingRecommendation}\nCM Comment: ${selected.cmComment ?? ""}`.trim(),
                        cmComment: selected.cmComment,
                        virtualHighFive: selected.virtualHighFive,
                        cmReviewed: true,
                      })
                    }
                    disabled={saving}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-sky-400 px-4 py-2.5 text-sm font-bold text-slate-900 hover:bg-sky-300 disabled:opacity-60"
                  >
                    {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                    Save Case Manager Review
                  </button>

                  <div className="rounded-lg border border-cyan-700/35 bg-cyan-950/20 p-3 text-xs text-cyan-100/90">
                    <div className="mb-1 flex items-center gap-1.5 font-semibold text-cyan-200">
                      <MessageSquareQuote size={13} />
                      Example Case Manager Summary
                    </div>
                    Client completed a mock interview focused on entry-level customer service employment. Client demonstrated improved clarity and motivation but would benefit from additional coaching on explaining employment gaps and giving specific workplace examples.
                  </div>
                </div>
              )}
            </GlowCard>
          </div>

          <GlowCard className="p-5 border border-slate-700/50">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
              <BarChart3 size={16} className="text-sky-300" />
              AI Readiness Snapshot
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-5 text-xs">
              {[
                ["Clarity", averageScore(records, "clarity")],
                ["Professional Tone", averageScore(records, "professionalism")],
                ["Job Relevance", averageScore(records, "jobRelevance")],
                ["Growth Mindset", averageScore(records, "growthMindset")],
              ].map(([label, value]) => (
                <div key={label} className={`rounded-lg border px-3 py-2 text-center font-semibold ${scorePill(Number(value))}`}>
                  <div>{label}</div>
                  <div className="mt-1 text-sm">{value}/5</div>
                </div>
              ))}
            </div>
          </GlowCard>
        </>
      )}
    </div>
  );
}
