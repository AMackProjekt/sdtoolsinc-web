"use client";

import { useState, useRef } from "react";
import {
  Brain, Wind, Music, Activity, Sparkles, Flame, ExternalLink, ChevronDown, ChevronUp, X
} from "lucide-react";

const AFFIRMATIONS: string[] = [
  "I am making a real difference today.",
  "I show up fully for the people in my care.",
  "My work changes lives, even when I can't see it.",
  "I protect my energy so I can protect others.",
  "I am trauma-informed, compassionate, and effective.",
  "I am doing extraordinary work in ordinary moments.",
  "Rest is not laziness — it is how I stay effective.",
  "I lead with empathy and follow through with action.",
  "My consistency builds the trust my clients have never had.",
  "I chose this work because the people matter.",
];

const STRETCHES: string[] = [
  "Roll your shoulders back 5 times. Breathe deep.",
  "Drop your chin slowly to your chest. Hold 10 sec.",
  "Reach both arms overhead. Stretch and hold 10 sec.",
  "Rotate your neck gently left-to-right 3 times.",
  "Stand up and shake out your hands and arms. Reset.",
  "Interlace fingers, push palms outward. Hold 10 sec.",
  "Look away from your screen. Focus far away 20 sec.",
];

const FOCUS_PLAYLISTS = [
  { name: "Lo-Fi Hip Hop",  url: "https://www.youtube.com/watch?v=jfKfPfyJRdk", emoji: "🎧" },
  { name: "Ambient Focus",  url: "https://open.spotify.com/playlist/37i9dQZF1DX3Ogo9pFvBkY", emoji: "🌊" },
  { name: "Deep Work Mix",  url: "https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ", emoji: "🔥" },
  { name: "Nature Sounds",  url: "https://www.youtube.com/watch?v=eKFTSSKCzWA", emoji: "🌿" },
  { name: "Jazz for Focus", url: "https://open.spotify.com/playlist/37i9dQZF1DXbITWG1ZJKYt", emoji: "🎷" },
];

const DEBRIEF_PROMPTS: string[] = [
  "What's one win from today — big or small?",
  "What's one thing I'm intentionally leaving at work?",
  "How did I show up for my clients today?",
  "What would I do differently tomorrow?",
  "Who on my caseload deserves extra attention next shift?",
];

type BreathStep = "idle" | "inhale" | "hold1" | "exhale" | "hold2";

interface WellnessCornerProps {
  /** When true, renders a compact sidebar-friendly vertical layout */
  compact?: boolean;
}

export default function WellnessCorner({ compact = false }: WellnessCornerProps) {
  const [brainDump, setBrainDump]             = useState("");
  const [breathStep, setBreathStep]           = useState<BreathStep>("idle");
  const breathTimers                          = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [affirmIdx, setAffirmIdx]             = useState(0);
  const [stretchIdx, setStretchIdx]           = useState(0);
  const [debriefIdx, setDebriefIdx]           = useState(0);
  const [debriefText, setDebriefText]         = useState("");

  const startBoxBreath = () => {
    if (breathStep !== "idle") return;
    breathTimers.current.forEach(clearTimeout);
    setBreathStep("inhale");
    breathTimers.current = [
      setTimeout(() => setBreathStep("hold1"),  4000),
      setTimeout(() => setBreathStep("exhale"), 8000),
      setTimeout(() => setBreathStep("hold2"),  12000),
      setTimeout(() => setBreathStep("idle"),   16000),
    ];
  };

  // ── COMPACT (sidebar) mode ────────────────────────────────────────────────
  if (compact) {
    return (
      <div className="space-y-3 py-2">

        {/* Affirmation */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-rose-400 shrink-0" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Affirmation</span>
          </div>
          <p className="text-[10px] text-slate-300 italic leading-relaxed px-0.5">
            &ldquo;{AFFIRMATIONS[affirmIdx]}&rdquo;
          </p>
          <button
            onClick={() => setAffirmIdx(i => (i + 1) % AFFIRMATIONS.length)}
            className="text-[9px] font-black text-rose-400 hover:text-rose-300 uppercase tracking-widest transition"
          >
            New ✦
          </button>
        </div>

        <div className="border-t border-charcoal-800" />

        {/* Brain Dump */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <Brain className="w-3 h-3 text-indigo-400 shrink-0" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Brain Dump</span>
          </div>
          <textarea
            value={brainDump}
            onChange={e => setBrainDump(e.target.value)}
            placeholder="Clear your mind…"
            className="w-full h-16 text-[10px] p-2 rounded-lg border border-charcoal-700 bg-charcoal-800 text-slate-300 placeholder-slate-600 resize-none focus:outline-none focus:border-indigo-500 transition leading-relaxed"
          />
          {brainDump && (
            <button
              onClick={() => setBrainDump("")}
              className="text-[9px] font-black text-slate-500 hover:text-rose-400 uppercase tracking-widest transition flex items-center gap-0.5"
            >
              <X className="w-2.5 h-2.5" /> Clear
            </button>
          )}
        </div>

        <div className="border-t border-charcoal-800" />

        {/* Box Breathing */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <Wind className="w-3 h-3 text-teal-400 shrink-0" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Box Breathing</span>
          </div>
          {breathStep !== "idle" && (
            <p className={`text-[10px] font-black uppercase tracking-widest ${
              breathStep === "inhale" ? "text-blue-400" :
              breathStep === "hold1"  ? "text-amber-400" :
              breathStep === "exhale" ? "text-teal-400" : "text-purple-400"
            }`}>
              {breathStep === "inhale" ? "⬆ Inhale…" : breathStep === "hold1" ? "⏸ Hold…" : breathStep === "exhale" ? "⬇ Exhale…" : "⏸ Hold…"}
            </p>
          )}
          <button
            onClick={startBoxBreath}
            disabled={breathStep !== "idle"}
            className="w-full text-[9px] font-black uppercase tracking-widest py-1.5 rounded-lg bg-teal-700 text-white hover:bg-teal-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            {breathStep === "idle" ? "Begin 4-4-4-4" : "Breathing…"}
          </button>
        </div>

        <div className="border-t border-charcoal-800" />

        {/* Micro Stretch */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Stretch</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">{STRETCHES[stretchIdx]}</p>
          <button
            onClick={() => setStretchIdx(i => (i + 1) % STRETCHES.length)}
            className="text-[9px] font-black text-amber-400 hover:text-amber-300 uppercase tracking-widest transition"
          >
            Next →
          </button>
        </div>

        <div className="border-t border-charcoal-800" />

        {/* Focus Playlists */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <Music className="w-3 h-3 text-purple-400 shrink-0" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Focus Music</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {FOCUS_PLAYLISTS.slice(0, 3).map((pl, i) => (
              <a key={i} href={pl.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 bg-charcoal-800 border border-charcoal-700 hover:border-purple-600/50 rounded-lg px-2 py-1 transition text-[9px] font-bold text-slate-400 hover:text-purple-300"
                title={pl.name}
              >
                <span>{pl.emoji}</span>
              </a>
            ))}
            <a href={FOCUS_PLAYLISTS[3].url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 bg-charcoal-800 border border-charcoal-700 hover:border-purple-600/50 rounded-lg px-2 py-1 transition text-[9px] font-bold text-slate-400 hover:text-purple-300"
              title={FOCUS_PLAYLISTS[3].name}
            ><span>{FOCUS_PLAYLISTS[3].emoji}</span></a>
            <a href={FOCUS_PLAYLISTS[4].url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 bg-charcoal-800 border border-charcoal-700 hover:border-purple-600/50 rounded-lg px-2 py-1 transition text-[9px] font-bold text-slate-400 hover:text-purple-300"
              title={FOCUS_PLAYLISTS[4].name}
            ><span>{FOCUS_PLAYLISTS[4].emoji}</span></a>
          </div>
        </div>

        <div className="border-t border-charcoal-800" />

        {/* Shift Debrief */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <Flame className="w-3 h-3 text-orange-400 shrink-0" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Debrief</span>
          </div>
          <p className="text-[10px] text-slate-400 italic leading-relaxed">{DEBRIEF_PROMPTS[debriefIdx]}</p>
          <textarea
            value={debriefText}
            onChange={e => setDebriefText(e.target.value)}
            placeholder="Your reflection…"
            className="w-full h-12 text-[10px] p-2 rounded-lg border border-charcoal-700 bg-charcoal-800 text-slate-300 placeholder-slate-600 resize-none focus:outline-none focus:border-orange-500 transition"
          />
          <button
            onClick={() => { setDebriefIdx(i => (i + 1) % DEBRIEF_PROMPTS.length); setDebriefText(""); }}
            className="text-[9px] font-black text-orange-400 hover:text-orange-300 uppercase tracking-widest transition"
          >
            Next prompt →
          </button>
        </div>

      </div>
    );
  }

  // ── FULL (dashboard) mode ──────────────────────────────────────────────────
  return (
    <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
      <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-violet-50 rounded-xl flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-violet-600" />
          </div>
          <div>
            <h3 className="font-black text-sm text-charcoal-900 uppercase tracking-tight">Wellness &amp; Productivity Corner</h3>
            <p className="text-[10px] text-slate-400 font-medium">Recharge, refocus, and reset between sessions</p>
          </div>
        </div>
      </div>
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

        {/* Brain Dump */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-indigo-500" />
            <h4 className="text-xs font-black text-charcoal-900 uppercase tracking-wide">Brain Dump</h4>
            <span className="text-[9px] text-slate-400 font-medium">Clear your mind before a session</span>
          </div>
          <textarea
            value={brainDump}
            onChange={e => setBrainDump(e.target.value)}
            placeholder="Dump everything on your mind here — worries, tasks, random thoughts. Get it out so you can focus fully."
            className="w-full h-32 text-xs p-3 rounded-xl border border-slate-200 bg-slate-50/60 resize-none focus:outline-none focus:border-indigo-300 focus:bg-white transition leading-relaxed"
          />
          <button
            onClick={() => setBrainDump("")}
            className="text-[10px] font-black text-slate-400 hover:text-rose-500 uppercase tracking-widest transition"
          >
            ✕ Clear &amp; Release
          </button>
        </div>

        {/* Box Breathing */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-teal-500" />
            <h4 className="text-xs font-black text-charcoal-900 uppercase tracking-wide">Box Breathing</h4>
            <span className="text-[9px] text-slate-400 font-medium">4-4-4-4 for calm &amp; clarity</span>
          </div>
          <div className={`rounded-xl p-5 text-center transition-all duration-700 ${
            breathStep === "idle"   ? "bg-slate-50 border border-slate-200" :
            breathStep === "inhale" ? "bg-blue-50 border border-blue-200" :
            breathStep === "hold1"  ? "bg-amber-50 border border-amber-200" :
            breathStep === "exhale" ? "bg-teal-50 border border-teal-200" :
            "bg-purple-50 border border-purple-200"
          }`}>
            <p className="text-3xl mb-1.5">
              {breathStep === "idle" ? "🌬️" : breathStep === "inhale" ? "⬆️" : breathStep === "hold1" ? "⏸️" : breathStep === "exhale" ? "⬇️" : "⏸️"}
            </p>
            <p className={`text-xs font-black uppercase tracking-widest ${
              breathStep === "idle"   ? "text-slate-400" :
              breathStep === "inhale" ? "text-blue-600" :
              breathStep === "hold1"  ? "text-amber-600" :
              breathStep === "exhale" ? "text-teal-600" : "text-purple-600"
            }`}>
              {breathStep === "idle"   ? "Ready when you are" :
               breathStep === "inhale" ? "Inhale… 4 counts" :
               breathStep === "hold1"  ? "Hold… 4 counts" :
               breathStep === "exhale" ? "Exhale… 4 counts" : "Hold… 4 counts"}
            </p>
          </div>
          <button
            onClick={startBoxBreath}
            disabled={breathStep !== "idle"}
            className="w-full text-[11px] font-black uppercase tracking-widest py-2.5 rounded-xl bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            {breathStep === "idle" ? "Begin Breath Cycle" : "Breathing…"}
          </button>
        </div>

        {/* Focus Playlists */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4 text-purple-500" />
            <h4 className="text-xs font-black text-charcoal-900 uppercase tracking-wide">Focus Playlists</h4>
            <span className="text-[9px] text-slate-400 font-medium">Music for deep work</span>
          </div>
          <div className="space-y-2">
            {FOCUS_PLAYLISTS.map((pl, i) => (
              <a key={i} href={pl.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/50 transition text-xs font-bold text-charcoal-900 group"
              >
                <span className="text-base">{pl.emoji}</span>
                <span className="flex-1">{pl.name}</span>
                <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-purple-500 transition" />
              </a>
            ))}
          </div>
        </div>

        {/* Micro Stretch */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-500" />
            <h4 className="text-xs font-black text-charcoal-900 uppercase tracking-wide">Micro Stretch</h4>
            <span className="text-[9px] text-slate-400 font-medium">30-sec desk breaks</span>
          </div>
          <div className="p-5 bg-amber-50 rounded-xl border border-amber-100 text-center">
            <p className="text-3xl mb-2">🤸</p>
            <p className="text-sm font-bold text-charcoal-900 leading-snug">{STRETCHES[stretchIdx]}</p>
          </div>
          <button
            onClick={() => setStretchIdx(i => (i + 1) % STRETCHES.length)}
            className="w-full text-[11px] font-black uppercase tracking-widest py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white transition"
          >
            Next Stretch →
          </button>
        </div>

        {/* Staff Affirmation */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-400" />
            <h4 className="text-xs font-black text-charcoal-900 uppercase tracking-wide">Your Affirmation</h4>
            <span className="text-[9px] text-slate-400 font-medium">Tap to refresh</span>
          </div>
          <div className="p-5 bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl border border-rose-100 min-h-[88px] flex items-center justify-center">
            <p className="text-sm text-center font-bold text-rose-800 italic leading-snug">
              &ldquo;{AFFIRMATIONS[affirmIdx]}&rdquo;
            </p>
          </div>
          <button
            onClick={() => setAffirmIdx(i => (i + 1) % AFFIRMATIONS.length)}
            className="w-full text-[11px] font-black uppercase tracking-widest py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white transition"
          >
            New Affirmation ✦
          </button>
        </div>

        {/* Shift Debrief */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" />
            <h4 className="text-xs font-black text-charcoal-900 uppercase tracking-wide">Shift Debrief</h4>
            <span className="text-[9px] text-slate-400 font-medium">Reflect before you log off</span>
          </div>
          <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
            <p className="text-[10px] font-black text-orange-600 uppercase tracking-wider mb-2">Prompt {debriefIdx + 1}/{DEBRIEF_PROMPTS.length}</p>
            <p className="text-xs font-bold text-charcoal-900 leading-snug">{DEBRIEF_PROMPTS[debriefIdx]}</p>
          </div>
          <textarea
            value={debriefText}
            onChange={e => setDebriefText(e.target.value)}
            placeholder="Your reflection…"
            className="w-full h-16 text-xs p-3 rounded-xl border border-slate-200 bg-slate-50/60 resize-none focus:outline-none focus:border-orange-300 focus:bg-white transition"
          />
          <button
            onClick={() => { setDebriefIdx(i => (i + 1) % DEBRIEF_PROMPTS.length); setDebriefText(""); }}
            className="w-full text-[11px] font-black uppercase tracking-widest py-2 rounded-xl border border-orange-200 text-orange-600 hover:bg-orange-50 transition"
          >
            Next Prompt →
          </button>
        </div>

      </div>
    </div>
  );
}
