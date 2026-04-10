"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/cn";
import {
  Brain,
  Wind,
  Music,
  Activity,
  Sparkles,
  Heart,
  Timer,
  ExternalLink,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";

// ── Data ────────────────────────────────────────────────────────────────────

const AFFIRMATIONS = [
  "Clarity comes to those who take time to be still.",
  "The best decision you make today may be the one to pause.",
  "You build organisations — don't forget to build yourself.",
  "Vision and rest are not opposites; they are partners.",
  "The leaders who last are the ones who know how to restore.",
  "Your greatest competitive advantage is a rested, focused mind.",
  "Investing in your well-being is the highest-return investment you'll make.",
  "You set the culture. A well-rested leader sets a healthier one.",
  "Even high-performance machines require downtime. You do too.",
  "Strategic stillness is still strategy.",
];

const STRETCHES = [
  { name: "Neck Roll", desc: "Slowly roll your head in a circle, 3× each direction. Release tension from your neck and shoulders." },
  { name: "Shoulder Shrug", desc: "Raise both shoulders to your ears, hold 3 seconds, release. Repeat 5 times." },
  { name: "Chest Opener", desc: "Clasp hands behind your back, squeeze shoulder blades together, hold 10 seconds." },
  { name: "Seated Spinal Twist", desc: "Sit tall, twist to the right hand on left knee, hold 15 seconds. Switch sides." },
  { name: "Wrist Circles", desc: "Extend arms, rotate wrists forward and backward 10 times each. Great for typing breaks." },
  { name: "Eye Focus Reset", desc: "Look away from screens. Focus on something 20 feet away for 20 seconds. Blink slowly 20 times." },
  { name: "Deep Belly Breath", desc: "Hand on stomach. Breathe in slowly for 4 counts until your belly rises. Exhale for 4. Repeat 5×." },
];

const PLAYLISTS = [
  { name: "Lo-Fi Focus", desc: "Calm beats for strategic thinking", url: "https://www.youtube.com/watch?v=jfKfPfyJRdk" },
  { name: "Ambient Peace", desc: "Relaxing soundscapes between calls", url: "https://www.youtube.com/watch?v=5qap5aO4i9A" },
  { name: "Deep Work", desc: "Instrumental for deep concentration", url: "https://www.youtube.com/watch?v=FXQX78fBpuQ" },
  { name: "Nature Sounds", desc: "Rain, forests, and flowing water", url: "https://www.youtube.com/watch?v=eKFTSSKCzWA" },
  { name: "Uplifting Jazz", desc: "Warm jazz for a positive mood boost", url: "https://www.youtube.com/watch?v=DSGyEsJ17cI" },
];

const REFLECTIONS = [
  "What strategic decision made today reflects my organisation's true values?",
  "Where did I create the most leverage for my team this week?",
  "What am I holding onto that I could let go of or delegate?",
  "How did I model the leadership culture I want to build?",
  "What does tomorrow need from me, and what do I need first?",
];

// ── Breath types ─────────────────────────────────────────────────────────────

type BreathPhase = "idle" | "inhale" | "hold1" | "exhale" | "hold2";

const BREATH_SEQUENCE: { phase: BreathPhase; label: string; color: string; duration: number }[] = [
  { phase: "inhale", label: "Breathe In",  color: "text-cyan-300",     duration: 4000 },
  { phase: "hold1",  label: "Hold",        color: "text-yellow-300",   duration: 4000 },
  { phase: "exhale", label: "Breathe Out", color: "text-blue-300",     duration: 4000 },
  { phase: "hold2",  label: "Hold",        color: "text-purple-300",   duration: 4000 },
];

// ── Pomodoro ──────────────────────────────────────────────────────────────────

type PomodoroMode = "work" | "break";
const POMODORO_DURATIONS: Record<PomodoroMode, number> = { work: 25 * 60, break: 5 * 60 };
const CIRCUMFERENCE = 2 * Math.PI * 44; // r=44

// ── Components ───────────────────────────────────────────────────────────────

function SectionCard({
  icon: Icon,
  title,
  color,
  children,
}: {
  icon: React.ElementType;
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm p-6">
      <div className="flex items-center gap-2 mb-5">
        <Icon className={cn("w-5 h-5", color)} />
        <h2 className="text-sm font-bold text-white tracking-wide">{title}</h2>
      </div>
      {children}
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function EnterpriseSelfCarePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [affirmIdx, setAffirmIdx] = useState(0);
  const [stretchIdx, setStretchIdx] = useState(0);
  const [reflectionIdx, setReflectionIdx] = useState(0);
  const [reflectionText, setReflectionText] = useState("");
  const [brainDump, setBrainDump] = useState("");

  // Box breathing
  const [breathPhase, setBreathPhase] = useState<BreathPhase>("idle");
  const [breathLabel, setBreathLabel] = useState("Start");
  const [breathColor, setBreathColor] = useState("text-cyan-400");
  const [breathCount, setBreathCount] = useState(0);
  const breathRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const breathIdxRef = useRef(0);
  const runningRef = useRef(false);

  // Pomodoro
  const [pomMode, setPomMode] = useState<PomodoroMode>("work");
  const [pomSecondsLeft, setPomSecondsLeft] = useState(POMODORO_DURATIONS.work);
  const [pomRunning, setPomRunning] = useState(false);
  const [pomSessions, setPomSessions] = useState(0);
  const pomIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/portal/enterprise/auth");
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => () => { if (breathRef.current) clearTimeout(breathRef.current); }, []);

  // Pomodoro tick
  useEffect(() => {
    if (pomRunning) {
      pomIntervalRef.current = setInterval(() => {
        setPomSecondsLeft((s) => {
          if (s <= 1) {
            clearInterval(pomIntervalRef.current!);
            setPomRunning(false);
            setPomSessions((prev) => {
              const next = pomMode === "work" ? prev + 1 : prev;
              return next;
            });
            const nextMode: PomodoroMode = pomMode === "work" ? "break" : "work";
            setPomMode(nextMode);
            setPomSecondsLeft(POMODORO_DURATIONS[nextMode]);
            return POMODORO_DURATIONS[nextMode];
          }
          return s - 1;
        });
      }, 1000);
    } else {
      if (pomIntervalRef.current) clearInterval(pomIntervalRef.current);
    }
    return () => { if (pomIntervalRef.current) clearInterval(pomIntervalRef.current); };
  }, [pomRunning, pomMode]);

  const pomReset = useCallback(() => {
    if (pomIntervalRef.current) clearInterval(pomIntervalRef.current);
    setPomRunning(false);
    setPomMode("work");
    setPomSecondsLeft(POMODORO_DURATIONS.work);
  }, []);

  const pomTotal = POMODORO_DURATIONS[pomMode];
  const pomProgress = (pomTotal - pomSecondsLeft) / pomTotal;
  const dashOffset = CIRCUMFERENCE * (1 - pomProgress);
  const pomMin = String(Math.floor(pomSecondsLeft / 60)).padStart(2, "0");
  const pomSec = String(pomSecondsLeft % 60).padStart(2, "0");

  if (isLoading || !isAuthenticated) return null;

  // Breathing helpers
  const runBreath = () => {
    const step = BREATH_SEQUENCE[breathIdxRef.current % BREATH_SEQUENCE.length];
    setBreathPhase(step.phase);
    setBreathLabel(step.label);
    setBreathColor(step.color);
    setBreathCount((c) => breathIdxRef.current % 4 === 0 && breathIdxRef.current > 0 ? c + 1 : c);
    breathIdxRef.current += 1;
    breathRef.current = setTimeout(() => {
      if (runningRef.current) runBreath();
    }, step.duration);
  };

  const startBreathing = () => {
    if (runningRef.current) {
      runningRef.current = false;
      if (breathRef.current) clearTimeout(breathRef.current);
      setBreathPhase("idle");
      setBreathLabel("Start");
      setBreathColor("text-cyan-400");
      breathIdxRef.current = 0;
      setBreathCount(0);
      return;
    }
    runningRef.current = true;
    breathIdxRef.current = 0;
    runBreath();
  };

  const isBreathing = breathPhase !== "idle";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-bg p-6 md:p-10"
    >
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
            <Heart className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Executive Self-Care</h1>
            <p className="text-sm text-slate-400">High performance is built on a foundation of well-being.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Affirmation */}
          <SectionCard icon={Sparkles} title="Executive Affirmation" color="text-pink-400">
            <AnimatePresence mode="wait">
              <motion.div
                key={affirmIdx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="min-h-[64px] flex items-center"
              >
                <p className="text-slate-200 text-base leading-relaxed italic">
                  &ldquo;{AFFIRMATIONS[affirmIdx]}&rdquo;
                </p>
              </motion.div>
            </AnimatePresence>
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs text-slate-500">{affirmIdx + 1} of {AFFIRMATIONS.length}</span>
              <button
                onClick={() => setAffirmIdx((i) => (i + 1) % AFFIRMATIONS.length)}
                className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Next
              </button>
            </div>
          </SectionCard>

          {/* Pomodoro Timer */}
          <SectionCard icon={Timer} title="Pomodoro Focus Timer" color="text-cyan-400">
            <div className="flex flex-col items-center gap-4">
              {/* SVG ring */}
              <div className="relative w-28 h-28">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {/* Track */}
                  <circle
                    cx="50" cy="50" r="44"
                    fill="none"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="6"
                  />
                  {/* Progress */}
                  <circle
                    cx="50" cy="50" r="44"
                    fill="none"
                    stroke={pomMode === "work" ? "#22d3ee" : "#34d399"}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={dashOffset}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold tabular-nums text-white">
                    {pomMin}:{pomSec}
                  </span>
                  <span className={cn("text-[10px] font-semibold uppercase tracking-wider mt-0.5",
                    pomMode === "work" ? "text-cyan-400" : "text-emerald-400"
                  )}>
                    {pomMode === "work" ? "Focus" : "Break"}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500">
                Sessions completed: <span className="text-cyan-400 font-bold">{pomSessions}</span>
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPomRunning((r) => !r)}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-sm transition",
                    pomRunning
                      ? "bg-slate-700 text-slate-200 hover:bg-slate-600"
                      : "bg-cyan-500 text-slate-900 hover:bg-cyan-400"
                  )}
                >
                  {pomRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {pomRunning ? "Pause" : "Start"}
                </button>
                <button
                  onClick={pomReset}
                  className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition"
                  title="Reset"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>
          </SectionCard>

          {/* Box Breathing */}
          <SectionCard icon={Wind} title="Box Breathing" color="text-blue-400">
            <div className="flex flex-col items-center gap-4">
              <motion.div
                animate={isBreathing ? { scale: breathPhase === "inhale" ? 1.25 : breathPhase === "exhale" ? 0.85 : 1 } : { scale: 1 }}
                transition={{ duration: 3.8, ease: "easeInOut" }}
                className="w-24 h-24 rounded-full border-2 border-cyan-500/40 bg-cyan-500/10 flex items-center justify-center"
              >
                <span className={cn("text-sm font-semibold transition-colors", breathColor)}>
                  {breathLabel}
                </span>
              </motion.div>
              <p className="text-xs text-slate-500">
                {isBreathing ? `Cycles completed: ${breathCount}` : "4s in · 4s hold · 4s out · 4s hold"}
              </p>
              <button
                onClick={startBreathing}
                className={cn(
                  "px-5 py-2 rounded-xl font-bold text-sm transition",
                  isBreathing
                    ? "bg-slate-700 text-slate-200 hover:bg-slate-600"
                    : "bg-cyan-500 text-slate-900 hover:bg-cyan-400"
                )}
              >
                {isBreathing ? "Stop" : "Start Breathing"}
              </button>
            </div>
          </SectionCard>

          {/* Stretch Break */}
          <SectionCard icon={Activity} title="Stretch Break" color="text-orange-400">
            <AnimatePresence mode="wait">
              <motion.div
                key={stretchIdx}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
              >
                <p className="text-white font-semibold text-base mb-2">{STRETCHES[stretchIdx].name}</p>
                <p className="text-slate-400 text-sm leading-relaxed">{STRETCHES[stretchIdx].desc}</p>
              </motion.div>
            </AnimatePresence>
            <div className="flex items-center justify-between mt-5">
              <button
                onClick={() => setStretchIdx((i) => (i - 1 + STRETCHES.length) % STRETCHES.length)}
                className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition"
              >
                <ChevronLeft className="w-4 h-4 text-slate-400" />
              </button>
              <span className="text-xs text-slate-500">{stretchIdx + 1} / {STRETCHES.length}</span>
              <button
                onClick={() => setStretchIdx((i) => (i + 1) % STRETCHES.length)}
                className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition"
              >
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </SectionCard>

        </div>

        {/* Focus Playlists */}
        <SectionCard icon={Music} title="Focus Playlists" color="text-purple-400">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PLAYLISTS.map((p) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 transition group"
              >
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
                  <Music className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{p.name}</p>
                  <p className="text-xs text-slate-400 truncate">{p.desc}</p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition shrink-0" />
              </a>
            ))}
          </div>
        </SectionCard>

        {/* Brain Dump */}
        <SectionCard icon={Brain} title="Brain Dump" color="text-yellow-400">
          <p className="text-slate-400 text-sm mb-3">Clear the cognitive load. No judgment, no saving — just release.</p>
          <textarea
            value={brainDump}
            onChange={(e) => setBrainDump(e.target.value)}
            rows={4}
            placeholder="Type anything on your mind..."
            className="w-full rounded-xl bg-slate-800 border border-slate-700 text-white text-sm px-4 py-3 focus:outline-none focus:border-cyan-500 placeholder:text-slate-500 resize-none transition"
          />
          <div className="flex justify-end mt-2">
            <button onClick={() => setBrainDump("")} className="text-xs text-slate-500 hover:text-slate-300 transition">
              Clear
            </button>
          </div>
        </SectionCard>

        {/* Reflection */}
        <SectionCard icon={Sparkles} title="Strategic Reflection" color="text-cyan-400">
          <div className="flex items-start gap-3 mb-4">
            <AnimatePresence mode="wait">
              <motion.p
                key={reflectionIdx}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-white font-medium text-base flex-1"
              >
                {REFLECTIONS[reflectionIdx]}
              </motion.p>
            </AnimatePresence>
            <button
              onClick={() => setReflectionIdx((i) => (i + 1) % REFLECTIONS.length)}
              className="text-cyan-400 hover:text-cyan-300 transition shrink-0 mt-0.5"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          <textarea
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            rows={3}
            placeholder="Your thoughts..."
            className="w-full rounded-xl bg-slate-800 border border-slate-700 text-white text-sm px-4 py-3 focus:outline-none focus:border-cyan-500 placeholder:text-slate-500 resize-none transition"
          />
        </SectionCard>

      </div>
    </motion.div>
  );
}
