"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, Shield, ChevronDown, ChevronUp, ThumbsUp, Clock } from "lucide-react";
import { GlowCard } from "@/components/ui/GlowCard";

interface LeaderResponse {
  id: string;
  author: string;
  title: string;
  avatar: string;
  date: string;
  message: string;
  likes: number;
  category: string;
}

const LEADER_RESPONSES: LeaderResponse[] = [
  {
    id: "1",
    author: "Marcus Reid",
    title: "Chief Executive Officer",
    avatar: "MR",
    date: "Dec 10, 2024",
    message:
      "Thank you for the feedback regarding onboarding timelines. We have heard your concerns and are implementing a streamlined 2-week onboarding track starting Q1 2025. Your voice directly shaped this decision.",
    likes: 24,
    category: "Onboarding",
  },
  {
    id: "2",
    author: "Priya Okonkwo",
    title: "Chief Operating Officer",
    avatar: "PO",
    date: "Dec 5, 2024",
    message:
      "Several of you raised concerns about communication gaps between departments. We are launching weekly cross-team syncs and a shared Slack channel for enterprise participants beginning next month.",
    likes: 31,
    category: "Communication",
  },
  {
    id: "3",
    author: "Jerome Tate",
    title: "VP of People & Culture",
    avatar: "JT",
    date: "Nov 28, 2024",
    message:
      "Your feedback on mental wellness resources has been received. We are expanding counseling hours and adding two new certified coaches to the support network effective January 1st.",
    likes: 47,
    category: "Wellness",
  },
];

const CATEGORIES = ["General", "Onboarding", "Communication", "Wellness", "Resources", "Policy", "Other"];

export default function VoicePage() {
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("General");
  const [anonymous, setAnonymous] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>("1");
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  const MAX_CHARS = 1000;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 900));
    setSending(false);
    setSubmitted(true);
    setMessage("");
  }

  function toggleLike(id: string) {
    setLikedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div className="min-h-screen px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20">
              <MessageSquare className="h-5 w-5 text-violet-400" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-text">Your Voice Is Heard</h1>
              <p className="text-sm text-muted">Direct feedback to T.O.O.LS Inc leadership</p>
            </div>
          </div>
        </motion.div>

        {/* Submission Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <GlowCard className="p-6">
            <h2 className="text-base font-bold text-text mb-4">Share Your Feedback</h2>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-3 py-8 text-center"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-500/20">
                    <ThumbsUp className="h-7 w-7 text-violet-400" />
                  </div>
                  <p className="text-lg font-bold text-text">Thank you for your feedback!</p>
                  <p className="text-sm text-muted max-w-xs">
                    Your message has been received by leadership. Responses are typically posted within 5–7 business days.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-2 rounded-lg bg-violet-500/20 px-5 py-2.5 text-sm font-semibold text-violet-300 hover:bg-violet-500/30 transition-colors"
                  >
                    Submit Another
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  {/* Category */}
                  <div>
                    <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wider">
                      Category
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCategory(cat)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                            category === cat
                              ? "bg-violet-500/30 text-violet-300 border border-violet-500/50"
                              : "bg-white/5 text-muted hover:bg-white/10 border border-transparent"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wider">
                      Your Message
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value.slice(0, MAX_CHARS))}
                      rows={5}
                      placeholder="Share your thoughts, concerns, ideas, or appreciation with leadership..."
                      className="w-full rounded-xl border border-border bg-white/5 px-4 py-3 text-sm text-text placeholder:text-muted/50 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/30 resize-none"
                    />
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-muted/60">
                        {message.length > 0 && (
                          <span className={message.length > MAX_CHARS * 0.9 ? "text-rose-400" : ""}>
                            {message.length}/{MAX_CHARS}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Anonymous toggle */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setAnonymous(!anonymous)}
                      className={`relative h-5 w-9 rounded-full transition-colors ${
                        anonymous ? "bg-violet-500" : "bg-white/10"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                          anonymous ? "translate-x-4" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted" />
                      <span className="text-sm text-muted">
                        Submit anonymously
                        {anonymous && (
                          <span className="ml-2 text-xs text-violet-400 font-semibold">• Identity hidden</span>
                        )}
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!message.trim() || sending}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-500/20 px-5 py-3 text-sm font-semibold text-violet-300 hover:bg-violet-500/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {sending ? (
                      <span className="h-4 w-4 rounded-full border-2 border-violet-300/30 border-t-violet-300 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    {sending ? "Sending…" : "Send to Leadership"}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </GlowCard>
        </motion.div>

        {/* Leadership Responses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-base font-bold text-text mb-4">Leadership Responses</h2>
          <div className="space-y-3">
            {LEADER_RESPONSES.map((resp, i) => (
              <motion.div
                key={resp.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <GlowCard className="p-5">
                  <div
                    className="flex items-start justify-between cursor-pointer"
                    onClick={() => setExpandedId(expandedId === resp.id ? null : resp.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-sm font-bold text-violet-300">
                        {resp.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-text">{resp.author}</p>
                        <p className="text-xs text-muted">{resp.title}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="hidden sm:block rounded-md bg-violet-500/10 px-2 py-0.5 text-xs font-semibold text-violet-400 border border-violet-900/40">
                        {resp.category}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-muted">
                        <Clock className="h-3 w-3" />
                        {resp.date}
                      </div>
                      {expandedId === resp.id ? (
                        <ChevronUp className="h-4 w-4 text-muted" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted" />
                      )}
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedId === resp.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="mt-4 text-sm text-muted leading-relaxed border-t border-border pt-4">
                          {resp.message}
                        </p>
                        <div className="mt-3 flex items-center justify-end">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLike(resp.id);
                            }}
                            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                              likedIds.has(resp.id)
                                ? "bg-violet-500/20 text-violet-300"
                                : "bg-white/5 text-muted hover:bg-white/10"
                            }`}
                          >
                            <ThumbsUp className="h-3.5 w-3.5" />
                            {resp.likes + (likedIds.has(resp.id) ? 1 : 0)} Helpful
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
