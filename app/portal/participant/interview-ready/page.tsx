"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  CircleCheck,
  Download,
  Headphones,
  Loader2,
  Mic,
  MessageCircle,
  Play,
  Save,
  Send,
  Sparkles,
  Square,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { GlowCard } from "@/components/ui/GlowCard";
import {
  FEEDBACK_GENERATION_PROMPT,
  INTERVIEW_COACH_SYSTEM_PROMPT,
  INTERVIEWREADY_TAGLINE,
  INTERVIEW_TYPES,
  analyzeVoiceAndTone,
  averageScore,
  buildAdaptiveFollowUp,
  buildMockInterviewQuestionSet,
  detectBarrierFlag,
  generateInterviewFeedback,
  type InterviewAttemptRecord,
  type InterviewFeedback,
  type InterviewType,
  type StarAnswer,
} from "@/lib/interview-ready";

const emptyStar: StarAnswer = {
  situation: "",
  task: "",
  action: "",
  result: "",
};

const progressClasses = [
  "w-[12.5%]",
  "w-[25%]",
  "w-[37.5%]",
  "w-[50%]",
  "w-[62.5%]",
  "w-[75%]",
  "w-[87.5%]",
  "w-full",
];

function scoreBadge(score: number) {
  if (score >= 4.5) return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
  if (score >= 3.5) return "bg-teal-500/20 text-teal-300 border-teal-500/40";
  if (score >= 2.5) return "bg-amber-500/20 text-amber-300 border-amber-500/40";
  return "bg-rose-500/20 text-rose-300 border-rose-500/40";
}

export default function InterviewReadyParticipantPage() {
  const { user } = useAuth();

  const [jobType, setJobType] = useState<InterviewType>(INTERVIEW_TYPES[0]);
  const [started, setStarted] = useState(false);
  const [sessionQuestions, setSessionQuestions] = useState<string[]>(
    buildMockInterviewQuestionSet(INTERVIEW_TYPES[0], 6)
  );
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [star, setStar] = useState<StarAnswer>(emptyStar);
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const [savedAttempts, setSavedAttempts] = useState<InterviewAttemptRecord[]>([]);
  const [saving, setSaving] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [inputMode, setInputMode] = useState<"type" | "record">("type");
  const [conversation, setConversation] = useState<Array<{ role: "ai" | "client"; text: string }>>(
    []
  );
  const [todayGoal] = useState("Complete 1 interview path and submit to Case Manager");
  const [isRecording, setIsRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const question = sessionQuestions[index] ?? "Press Start Interview to begin.";
  const progressClass = started ? progressClasses[Math.min(index, progressClasses.length - 1)] : "w-0";
  const completionPercent = started
    ? Math.round(((index + 1) / Math.max(sessionQuestions.length, 1)) * 100)
    : 0;

  const scoreSummary = useMemo(() => {
    if (!savedAttempts.length) {
      return {
        confidenceScore: 0,
        topStrengths: [] as string[],
        commonNeeds: [] as string[],
      };
    }

    const categories = [
      { key: "clarity", label: "Clarity" },
      { key: "professionalism", label: "Professional Tone" },
      { key: "jobRelevance", label: "Job Relevance" },
      { key: "growthMindset", label: "Growth Mindset" },
    ] as const;

    const scored = categories.map((cat) => ({
      ...cat,
      score: averageScore(savedAttempts, cat.key),
    }));

    const sorted = [...scored].sort((a, b) => b.score - a.score);

    return {
      confidenceScore: Number(
        (
          (averageScore(savedAttempts, "clarity") +
            averageScore(savedAttempts, "professionalism") +
            averageScore(savedAttempts, "jobRelevance") +
            averageScore(savedAttempts, "growthMindset")) /
          4
        ).toFixed(2)
      ),
      topStrengths: sorted.slice(0, 2).map((item) => item.label),
      commonNeeds: sorted.slice(-2).map((item) => item.label),
    };
  }, [savedAttempts]);

  const resetForNext = () => {
    setAnswer("");
    setStar(emptyStar);
    setFeedback(null);
  };

  const startInterview = () => {
    const nextQuestions = buildMockInterviewQuestionSet(jobType, 6);
    setStarted(true);
    setIndex(0);
    setSessionQuestions(nextQuestions);
    setSavedAttempts([]);
    setConversation([{ role: "ai", text: nextQuestions[0] }]);
    resetForNext();
  };

  const startRecording = async () => {
    if (typeof window === "undefined") return;
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      alert("Microphone access is required for voice recording.");
      return;
    }
    chunksRef.current = [];
    const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
      ? "audio/webm;codecs=opus"
      : MediaRecorder.isTypeSupported("audio/webm")
      ? "audio/webm"
      : "";
    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = async () => {
      stream.getTracks().forEach((t) => t.stop());
      const blob = new Blob(chunksRef.current, { type: mimeType || "audio/webm" });
      setIsRecording(false);
      setTranscribing(true);
      try {
        const form = new FormData();
        form.append("audio", blob, "recording.webm");
        const res = await fetch("/api/interview-ready/transcribe", {
          method: "POST",
          body: form,
        });
        const json = (await res.json()) as { transcript?: string };
        if (json.transcript) setAnswer((prev) => (prev ? prev + " " + json.transcript : json.transcript!));
      } finally {
        setTranscribing(false);
      }
    };
    recorderRef.current = recorder;
    recorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    recorderRef.current?.stop();
  };

  const speakQuestion = () => {
    if (typeof window === "undefined" || !question) return;
    const utterance = new SpeechSynthesisUtterance(question);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const onImproveAnswer = () => {
    const nextFeedback = generateInterviewFeedback(answer, question, jobType, star);
    setFeedback(nextFeedback);
    setAnswer(nextFeedback.improvedAnswer);
  };

  const saveCurrentAnswer = async (submitToCaseManager = false) => {
    if (!feedback || !answer.trim()) return;
    const record: InterviewAttemptRecord = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      sessionId: `IR-${Date.now()}`,
      tenantId: "toolsinc",
      clientId: user?.id ?? "participant-demo-1",
      clientName: user?.name ?? "Participant",
      tentUID: user?.id ?? "TENT-DEMO-1",
      caseManager: "Assigned Case Manager",
      industryPath: jobType,
      interviewType: jobType,
      jobType,
      questionAsked: question,
      transcriptJson: JSON.stringify(conversation),
      clientAnswer: answer.trim(),
      aiImprovedAnswer: feedback.improvedAnswer,
      clarityScore: feedback.score.clarity,
      professionalismScore: feedback.score.professionalism,
      jobRelevanceScore: feedback.score.jobRelevance,
      growthMindsetScore: feedback.score.growthMindset,
      confidenceScore: feedback.score.confidence,
      completenessScore: feedback.score.completeness,
      averageReadinessScore: feedback.jobReadiness,
      barrierFlag: detectBarrierFlag(question, answer.trim()),
      cmReviewed: false,
      feedbackSummary: `${feedback.superpowers} ${feedback.polishFactor.join(" ")}`,
      createdDate: new Date().toISOString(),
      submittedToCaseManager: submitToCaseManager,
      caseManagerNotes: "",
      followUpNeeded: false,
    };

    setSaving(true);
    try {
      await fetch("/api/interview-ready/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });
    } finally {
      setSaving(false);
    }

    setSavedAttempts((prev) => [record, ...prev]);
    setConversation((prev) => [...prev, { role: "client", text: answer.trim() }]);

    if (index < sessionQuestions.length - 1) {
      const adaptive = buildAdaptiveFollowUp(question, answer.trim(), jobType);
      setSessionQuestions((prev) => {
        const copy = [...prev];
        if (detectBarrierFlag(question, answer.trim()) || index === 1) {
          copy[index + 1] = adaptive;
        }
        return copy;
      });
      setIndex((v) => v + 1);
      setConversation((prev) => [...prev, { role: "ai", text: adaptive }]);
      resetForNext();
    }
  };

  const downloadPracticeSheet = () => {
    const lines = [
      "InterviewReady AI Coach - Practice Sheet",
      `Client: ${user?.name ?? "Participant"}`,
      `Job Type: ${jobType}`,
      `Date: ${new Date().toLocaleString()}`,
      `Tagline: ${INTERVIEWREADY_TAGLINE}`,
      "",
      ...savedAttempts.flatMap((item, idx) => [
        `Question ${idx + 1}: ${item.questionAsked}`,
        `My Answer: ${item.clientAnswer}`,
        `AI Improved Answer: ${item.aiImprovedAnswer}`,
        `Scores -> Clarity ${item.clarityScore}/5 | Professionalism ${item.professionalismScore}/5 | Job Relevance ${item.jobRelevanceScore}/5 | Growth Mindset ${item.growthMindsetScore}/5`,
        `Feedback: ${item.feedbackSummary}`,
        "",
      ]),
    ].join("\n");

    const blob = new Blob([lines], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `interview-practice-${Date.now()}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-[1300px] px-6 py-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-extrabold tracking-tight text-text">
          Practice Makes Progress, {user?.name ?? "Client"}!
        </h1>
        <p className="mt-2 max-w-4xl text-sm text-slate-300/85 leading-relaxed">
          {INTERVIEWREADY_TAGLINE}
        </p>
        <div className="mt-3 inline-flex items-center gap-2 rounded-xl border border-teal-600/40 bg-teal-900/20 px-4 py-2 text-sm text-teal-300">
          <Sparkles size={13} />
          Have a real job posting?{" "}
          <Link
            href="/portal/participant/interview-ready/jd-coach"
            className="ml-1 font-semibold underline underline-offset-2 hover:text-teal-100"
          >
            Generate custom questions from any job description →
          </Link>
        </div>
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <GlowCard className="p-6 border border-teal-700/30 bg-gradient-to-b from-[#093237]/65 to-[#10151f]/85">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-teal-300/75 font-semibold">Start Mock Interview</div>
                <div className="mt-1 text-lg text-white font-extrabold">Choose Job Type and Practice One Question at a Time</div>
              </div>
              <button
                onClick={startInterview}
                className="inline-flex items-center gap-2 rounded-xl bg-teal-400 px-5 py-3 font-bold text-slate-900 hover:bg-teal-300 transition"
              >
                <Sparkles size={16} />
                Start Interview
              </button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Choose Job Type</span>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value as InterviewType)}
                  className="w-full rounded-xl border border-teal-700/30 bg-[#081a1f] px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-400/70"
                >
                  {INTERVIEW_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>

              <div className="rounded-xl border border-slate-700/50 bg-slate-900/55 p-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Practice Progress</div>
                <div className="mt-2 text-sm text-slate-200">
                  {started ? `Question ${index + 1} of ${sessionQuestions.length}` : "Not started yet"}
                </div>
                <div className="mt-3 h-2 rounded-full bg-slate-800">
                  <div className={`h-full rounded-full bg-gradient-to-r from-teal-400 to-cyan-300 ${progressClass}`} />
                </div>
                <div className="mt-2 text-xs text-teal-200">Interview Completion: {completionPercent}%</div>
              </div>
            </div>
          </GlowCard>

          <GlowCard className="p-6 border border-slate-700/50">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-slate-400 font-semibold">Practice Interview Questions</div>
                <div className="mt-1 text-base font-bold text-white">{question}</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={speakQuestion}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-600/70 bg-slate-800/60 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                >
                  <Headphones size={14} />
                  Read Question
                </button>
                <button
                  onClick={() => {
                    setVoiceMode((v) => !v);
                  }}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold border transition ${
                    voiceMode
                      ? "border-teal-400/60 bg-teal-500/20 text-teal-200"
                      : "border-slate-600/70 bg-slate-800/60 text-slate-300"
                  }`}
                >
                  <Mic size={14} />
                  Voice Mode {voiceMode ? "On" : "Off"}
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => setInputMode("type")}
                className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition ${
                  inputMode === "type"
                    ? "bg-teal-400 text-slate-900"
                    : "border border-slate-600 bg-slate-800 text-slate-200"
                }`}
              >
                <MessageCircle size={15} />
                Type Answer
              </button>
              <button
                onClick={() => {
                  setInputMode("record");
                  if (inputMode === "record" && !isRecording && !transcribing) startRecording();
                }}
                className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition ${
                  inputMode === "record"
                    ? "bg-emerald-300 text-slate-900"
                    : "border border-slate-600 bg-slate-800 text-slate-200"
                }`}
              >
                <Play size={15} />
                Record Answer
              </button>
            </div>

            {inputMode === "record" && (
              <div className="mt-3 flex items-center gap-3">
                {isRecording ? (
                  <>
                    <span className="relative flex h-3 w-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-rose-500" />
                    </span>
                    <span className="text-xs font-semibold text-rose-300">Recording…</span>
                    <button
                      onClick={stopRecording}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/60 bg-rose-500/20 px-3 py-1.5 text-xs font-bold text-rose-200 hover:bg-rose-500/30"
                    >
                      <Square size={12} />
                      Stop &amp; Transcribe
                    </button>
                  </>
                ) : transcribing ? (
                  <>
                    <Loader2 size={14} className="animate-spin text-teal-400" />
                    <span className="text-xs text-teal-200">Transcribing audio…</span>
                  </>
                ) : (
                  <button
                    onClick={startRecording}
                    className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/60 bg-emerald-500/20 px-4 py-2 text-xs font-bold text-emerald-200 hover:bg-emerald-500/30"
                  >
                    <Mic size={14} />
                    Start Recording
                  </button>
                )}
              </div>
            )}

            {conversation.length > 0 && (
              <div className="mt-4 max-h-52 space-y-2 overflow-auto rounded-lg border border-slate-700/70 bg-slate-950/60 p-3">
                {conversation.slice(-6).map((entry, idx) => (
                  <div
                    key={`${entry.role}-${idx}`}
                    className={`rounded-lg p-2 text-xs ${
                      entry.role === "ai"
                        ? "border border-cyan-600/35 bg-cyan-900/20 text-cyan-100"
                        : "border border-teal-600/35 bg-teal-900/20 text-teal-100"
                    }`}
                  >
                    <span className="mr-2 font-semibold uppercase">{entry.role === "ai" ? "Coach" : "You"}</span>
                    {entry.text}
                  </div>
                ))}
              </div>
            )}

            {voiceMode && (
              <div className="mt-3 rounded-lg border border-teal-700/35 bg-teal-900/20 p-3 text-xs text-teal-100/90">
                Voice coaching preview uses pacing, filler words, and confidence calibration to provide supportive guidance.
              </div>
            )}

            <div className="mt-4 space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Your Answer</label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={6}
                placeholder={
                  inputMode === "record"
                    ? "Recording mode enabled. Paste transcript here or type while you practice aloud..."
                    : "Type your answer here in your own words..."
                }
                className="w-full rounded-xl border border-slate-700/70 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-400/60"
              />
            </div>

            {voiceMode && answer.trim().length > 0 && (
              <div className="mt-3 rounded-lg border border-teal-700/35 bg-teal-900/20 p-3 text-xs text-teal-100/90">
                {analyzeVoiceAndTone(answer).tips.map((tip) => (
                  <div key={tip} className="mb-1 last:mb-0">{tip}</div>
                ))}
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => setFeedback(generateInterviewFeedback(answer, question, jobType, star))}
                disabled={!answer.trim()}
                className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-teal-400 disabled:opacity-50"
              >
                View AI Feedback
              </button>
              <button
                onClick={onImproveAnswer}
                disabled={!answer.trim()}
                className="rounded-lg border border-cyan-400/45 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-200 hover:bg-cyan-500/20 disabled:opacity-50"
              >
                Improve My Answer
              </button>
              <button
                onClick={resetForNext}
                className="rounded-lg border border-slate-600/60 bg-slate-800/70 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-700"
              >
                Try Again
              </button>
            </div>
          </GlowCard>

          <GlowCard className="p-6 border border-slate-700/50">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-400 font-semibold">STAR Answer Builder</div>
            <div className="mt-1 text-sm text-slate-300">When a behavioral question feels hard, use STAR to build your story with confidence.</div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {([
                ["situation", "Situation / Task", "What was the problem you needed to solve?"],
                ["task", "Task Details", "What were you responsible for?"],
                ["action", "Action", "What specific steps did you take?"],
                ["result", "Result", "How did it turn out?"],
              ] as const).map(([key, title, helper]) => (
                <label key={key} className="space-y-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</span>
                  <textarea
                    rows={3}
                    value={star[key]}
                    onChange={(e) =>
                      setStar((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                    placeholder={helper}
                    className="w-full rounded-lg border border-slate-700/70 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-400/60"
                  />
                </label>
              ))}
            </div>
          </GlowCard>
        </div>

        <div className="space-y-6">
          <GlowCard className="p-6 border border-slate-700/50">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-400 font-semibold">Confidence-First Feedback Scorecard</div>
            {!feedback ? (
              <p className="mt-3 text-sm text-slate-400">Generate feedback to view scores, suggestions, and a stronger rewritten answer.</p>
            ) : (
              <>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {[
                    ["Clarity", feedback.score.clarity],
                    ["Professional Tone", feedback.score.professionalism],
                    ["Job Relevance", feedback.score.jobRelevance],
                    ["Growth Mindset", feedback.score.growthMindset],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className={`rounded-lg border px-3 py-2 text-xs font-semibold ${scoreBadge(Number(value))}`}
                    >
                      {label}: {value}/5
                    </div>
                  ))}
                </div>

                <div className="mt-4 space-y-3 text-sm">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Your Superpowers</div>
                    <p className="mt-1 text-slate-200">{feedback.superpowers}</p>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">The Polish Factor</div>
                    <ul className="mt-1 list-disc space-y-1 pl-4 text-slate-200">
                      {feedback.polishFactor.map((tip) => (
                        <li key={tip}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">The Pro-Rewrite (Before and After)</div>
                    <div className="mt-1 rounded-lg border border-slate-700/50 bg-slate-900/60 p-3 text-slate-300">
                      <div className="mb-2 text-[11px] uppercase tracking-wider text-slate-400">Before</div>
                      <p>{feedback.proRewriteBefore}</p>
                      <div className="mb-2 mt-3 text-[11px] uppercase tracking-wider text-slate-400">After</div>
                      <p className="rounded-lg border border-sky-500/30 bg-sky-900/20 p-3 text-sky-100">{feedback.proRewriteAfter}</p>
                    </div>
                  </div>
                  <div className="rounded-lg border border-emerald-500/30 bg-emerald-900/20 p-3 text-emerald-100">
                    <div className="text-xs uppercase tracking-wider text-emerald-300 font-semibold">Confidence-building note</div>
                    <p className="mt-1">{feedback.encouragement}</p>
                  </div>
                  <div className="text-slate-300">Practice recommendation: {feedback.recommendation}</div>
                  <div className="text-slate-300">Job Readiness Score: {feedback.jobReadiness}/5</div>
                  <div className="rounded-lg border border-teal-500/30 bg-teal-900/20 p-2 text-xs text-teal-100">
                    Share this with your Case Manager to celebrate your progress.
                  </div>
                </div>
              </>
            )}

            <div className="mt-5 grid gap-2">
              <button
                onClick={() => saveCurrentAnswer(false)}
                disabled={!feedback || saving}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-white disabled:opacity-50"
              >
                {saving ? <Loader2 className="animate-spin" size={15} /> : <Save size={15} />}
                Save Practice Session
              </button>
              <button
                onClick={() => saveCurrentAnswer(true)}
                disabled={!feedback || saving}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-teal-400/45 bg-teal-500/20 px-4 py-2.5 text-sm font-semibold text-teal-100 hover:bg-teal-500/30 disabled:opacity-50"
              >
                <Send size={15} />
                Submit to Case Manager
              </button>
              <button
                onClick={downloadPracticeSheet}
                disabled={!savedAttempts.length}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-600/70 bg-slate-800/70 px-4 py-2.5 text-sm font-semibold text-slate-200 hover:bg-slate-700 disabled:opacity-50"
              >
                <Download size={15} />
                Download Practice Sheet
              </button>
            </div>
          </GlowCard>

          <GlowCard className="p-6 border border-slate-700/50">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-400 font-semibold">Interview Readiness Progress Tracker</div>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-lg bg-slate-900/60 p-3">
                <span className="text-slate-300">Mock interviews completed</span>
                <span className="font-bold text-white">{savedAttempts.length}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-900/60 p-3">
                <span className="text-slate-300">Interview confidence score</span>
                <span className="font-bold text-white">{scoreSummary.confidenceScore || 0}/5</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-900/60 p-3">
                <span className="text-slate-300">Today&apos;s Goal</span>
                <span className="text-right text-xs font-semibold text-teal-200">{todayGoal}</span>
              </div>
              <div className="rounded-lg bg-slate-900/60 p-3">
                <div className="text-slate-300">Top strengths</div>
                <div className="mt-1 flex flex-wrap gap-2">
                  {(scoreSummary.topStrengths.length ? scoreSummary.topStrengths : ["In progress"]).map((item) => (
                    <span key={item} className="rounded-full border border-emerald-500/40 bg-emerald-500/15 px-2 py-1 text-xs text-emerald-200">{item}</span>
                  ))}
                </div>
              </div>
              <div className="rounded-lg bg-slate-900/60 p-3">
                <div className="text-slate-300">Common improvement areas</div>
                <div className="mt-1 flex flex-wrap gap-2">
                  {(scoreSummary.commonNeeds.length ? scoreSummary.commonNeeds : ["In progress"]).map((item) => (
                    <span key={item} className="rounded-full border border-amber-500/40 bg-amber-500/15 px-2 py-1 text-xs text-amber-200">{item}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-900/60 p-3">
                <span className="text-slate-300">Job types practiced</span>
                <span className="font-semibold text-white">{savedAttempts.length ? new Set(savedAttempts.map((a) => a.jobType)).size : 0}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-900/60 p-3">
                <span className="text-slate-300">Case manager review status</span>
                <span className="inline-flex items-center gap-1 rounded-full border border-teal-500/40 bg-teal-500/20 px-2.5 py-1 text-xs font-semibold text-teal-200">
                  <CircleCheck size={12} />
                  {savedAttempts.some((a) => a.submittedToCaseManager) ? "Submitted" : "Not submitted"}
                </span>
              </div>
            </div>
          </GlowCard>

          <GlowCard className="p-6 border border-cyan-700/35 bg-cyan-950/20">
            <div className="flex items-center gap-2 text-cyan-200 font-semibold">
              <Briefcase size={15} />
              AI Prompt Logic
            </div>
            <p className="mt-2 text-xs leading-relaxed text-cyan-100/90">{INTERVIEW_COACH_SYSTEM_PROMPT}</p>
            <p className="mt-2 text-xs leading-relaxed text-cyan-100/90">{FEEDBACK_GENERATION_PROMPT}</p>
            <div className="mt-3 text-xs text-cyan-100/80 flex items-center gap-1.5">
              <Star size={12} />
              No shaming language. Practical, respectful coaching with a 3:1 positive-to-constructive ratio.
            </div>
          </GlowCard>
        </div>
      </div>
    </div>
  );
}
