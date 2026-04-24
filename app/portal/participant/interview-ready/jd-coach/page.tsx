"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit, FileText, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { GlowCard } from "@/components/ui/GlowCard";
import { INTERVIEW_TYPES, type InterviewType } from "@/lib/interview-ready";

const PLACEHOLDER = `Paste a job description here. For example:

We are looking for a full-time Customer Service Representative to join our team. 
Responsibilities include answering incoming calls, resolving customer complaints, 
and documenting interactions in our CRM. Strong communication skills required. 
Must be reliable, punctual, and able to work in a fast-paced environment.`;

export default function JDCoachPage() {
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!jd.trim()) return;
    setLoading(true);
    setError("");
    setQuestions([]);
    setRole("");
    try {
      const res = await fetch("/api/interview-ready/jd-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription: jd }),
      });
      const json = (await res.json()) as { questions?: string[]; role?: string; message?: string };
      if (json.questions?.length) {
        setQuestions(json.questions);
        setRole(json.role ?? "This Role");
      } else {
        setError(json.message ?? "Could not generate questions. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyAll = () => {
    const text = questions.map((q, i) => `${i + 1}. ${q}`).join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Derive the closest matching InterviewType for the "Start Practicing" link
  const matchedType: InterviewType = (() => {
    const roleLower = role.toLowerCase();
    for (const type of INTERVIEW_TYPES) {
      if (roleLower.includes(type.toLowerCase().split(" ")[0].toLowerCase())) return type;
    }
    return INTERVIEW_TYPES[0];
  })();

  return (
    <div className="mx-auto max-w-[900px] px-6 py-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <BrainCircuit className="text-teal-400" size={28} />
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-text">
              JD-to-Interview Coach
            </h1>
            <p className="mt-0.5 text-sm text-slate-400">
              Paste any job description and get 8 targeted practice questions tailored to that role.
            </p>
          </div>
        </div>
      </motion.div>

      <GlowCard className="p-6 border border-teal-700/30 bg-gradient-to-b from-[#093237]/65 to-[#10151f]/85">
        <label className="block space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            <FileText size={13} className="mr-1 inline-block" />
            Paste Job Description
          </span>
          <textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            rows={10}
            placeholder={PLACEHOLDER}
            className="w-full rounded-xl border border-teal-700/30 bg-[#081a1f] px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-400/70 resize-y"
          />
        </label>

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={generate}
            disabled={loading || !jd.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-400 px-5 py-3 font-bold text-slate-900 hover:bg-teal-300 disabled:opacity-50 transition"
          >
            {loading ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Sparkles size={15} />
            )}
            {loading ? "Generating…" : "Generate Questions"}
          </button>

          <Link
            href="/portal/participant/interview-ready"
            className="text-xs text-slate-400 underline-offset-4 hover:text-slate-200 hover:underline"
          >
            ← Back to Interview Coach
          </Link>
        </div>

        {error && (
          <p className="mt-3 rounded-lg border border-rose-700/40 bg-rose-900/20 px-4 py-2 text-sm text-rose-300">
            {error}
          </p>
        )}
      </GlowCard>

      {questions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <GlowCard className="p-6 border border-slate-700/50">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-slate-400 font-semibold">
                  Tailored Practice Questions
                </div>
                <div className="mt-0.5 text-base font-bold text-white">
                  {role} — {questions.length} Questions
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={copyAll}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-600/70 bg-slate-800/60 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition"
                >
                  {copied ? "Copied!" : "Copy All"}
                </button>
                <Link
                  href={`/portal/participant/interview-ready?type=${encodeURIComponent(matchedType)}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-400 px-4 py-2 text-xs font-bold text-slate-900 hover:bg-emerald-300 transition"
                >
                  <ArrowRight size={13} />
                  Start Practicing
                </Link>
              </div>
            </div>

            <ol className="space-y-3">
              {questions.map((q, idx) => (
                <li
                  key={idx}
                  className="flex gap-3 rounded-xl border border-slate-700/50 bg-slate-900/60 px-4 py-3 text-sm text-slate-100"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-500/20 text-xs font-bold text-teal-300">
                    {idx + 1}
                  </span>
                  <span>{q}</span>
                </li>
              ))}
            </ol>

            <p className="mt-4 text-xs text-slate-500 leading-relaxed">
              These questions were generated from the job description you provided. Use them in a
              practice session to build confidence before your real interview.
            </p>
          </GlowCard>
        </motion.div>
      )}
    </div>
  );
}
