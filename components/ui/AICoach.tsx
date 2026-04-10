"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronDown, ChevronUp, Trophy, Target, Star } from "lucide-react";
import { GlowCard } from "@/components/ui/GlowCard";

interface AICoachProps {
  clientName?: string;
  progress?: number;
  recentAchievements?: string[];
  goals?: string[];
}

const QUOTES = [
  "Every step forward, no matter how small, is progress worth celebrating.",
  "You are not defined by where you've been — you're shaped by where you're headed.",
  "Courage doesn't always roar. Sometimes it's the quiet voice saying 'I'll try again tomorrow.'",
  "Growth is not always visible, but it's always happening.",
  "The most powerful thing you can do today is show up — you're already here!",
];

const TIPS = [
  "Try breaking big goals into 3 smaller steps. Progress feels more real that way.",
  "Check in with your case manager this week — they have resources just waiting for you.",
  "A 10-minute walk can shift your mood and mindset more than you'd expect.",
  "Celebrate every completed lesson — each one is a building block for your future.",
  "Writing down one thing you're grateful for each morning builds long-term resilience.",
];

const CELEBRATIONS = [
  "You're crushing it! Keep this momentum going — your goals are within reach.",
  "Look at that progress! This is what showing up every day looks like. Incredible!",
  "You've come so far. Seriously — this level of consistency is something to be proud of.",
  "Outstanding! Your dedication is paying off. Every point of progress is real change.",
];

const ENCOURAGEMENT = [
  "You're doing better than you think. Keep going — progress is rarely a straight line.",
  "Hard days are part of the journey. What matters is that you're still here, still trying.",
  "It's okay to take it one day at a time. Small effort, consistently, builds big results.",
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getCoachMessage(progress: number): string {
  if (progress >= 70) return pickRandom(CELEBRATIONS);
  if (progress >= 40) return pickRandom(TIPS);
  return pickRandom(ENCOURAGEMENT);
}

export function AICoach({
  clientName,
  progress = 0,
  recentAchievements = [],
  goals = [],
}: AICoachProps) {
  const [open, setOpen] = useState(true);
  const [message, setMessage] = useState(() => getCoachMessage(progress));
  const [refreshing, setRefreshing] = useState(false);

  const displayName = clientName ? clientName.split(" ")[0] : "there";

  function refreshMessage() {
    setRefreshing(true);
    setTimeout(() => {
      setMessage(getCoachMessage(progress));
      setRefreshing(false);
    }, 400);
  }

  return (
    <GlowCard className="p-0 overflow-hidden">
      {/* Header */}
      <button
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-500/15 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-semibold text-white leading-none">AI Coach</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Hey {displayName} — here's your daily check-in</p>
          </div>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-slate-500 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4 border-t border-slate-700/40 pt-4">
              {/* Progress ring / bar */}
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 flex-shrink-0">
                  <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                    <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(148,163,184,0.15)" strokeWidth="4" />
                    <motion.circle
                      cx="28"
                      cy="28"
                      r="22"
                      fill="none"
                      stroke="url(#tealGrad)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 22}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 22 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 22 * (1 - progress / 100) }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                    <defs>
                      <linearGradient id="tealGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#2dd4bf" />
                        <stop offset="100%" stopColor="#34d399" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-teal-400">
                    {progress}%
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Overall progress</p>
                  <div className="h-1.5 w-40 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">{progress >= 70 ? "Excellent work!" : progress >= 40 ? "Keep building!" : "Great start!"}</p>
                </div>
              </div>

              {/* Coach message */}
              <div className="bg-teal-500/8 border border-teal-500/20 rounded-xl p-3.5">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={message}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm text-slate-200 leading-relaxed"
                  >
                    {message}
                  </motion.p>
                </AnimatePresence>
                <button
                  onClick={refreshMessage}
                  disabled={refreshing}
                  className="mt-2 text-[11px] text-teal-400 hover:text-teal-300 transition-colors disabled:opacity-50"
                >
                  {refreshing ? "Getting new tip…" : "↻ New tip"}
                </button>
              </div>

              {/* Quote of the day */}
              <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/30">
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                  <Star className="w-3 h-3 text-amber-400" /> Quote of the day
                </p>
                <p className="text-xs text-slate-300 leading-relaxed italic">{pickRandom(QUOTES)}</p>
              </div>

              {/* Achievements */}
              {recentAchievements.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-2">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" /> Recent achievements
                  </p>
                  <ul className="space-y-1.5">
                    {recentAchievements.map((a, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        <span className="text-teal-400 flex-shrink-0 mt-0.5">✓</span>
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Active goals */}
              {goals.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-2">
                    <Target className="w-3.5 h-3.5 text-sky-400" /> Active goals
                  </p>
                  <ul className="space-y-1.5">
                    {goals.map((g, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        <span className="w-4 h-4 rounded-full border border-sky-500/40 bg-sky-500/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-[9px] text-sky-400 font-bold">
                          {i + 1}
                        </span>
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlowCard>
  );
}
