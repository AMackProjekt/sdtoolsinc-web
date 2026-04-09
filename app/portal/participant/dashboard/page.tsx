"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";
import {
  BookOpen,
  CheckSquare,
  Award,
  TrendingUp,
  Heart,
  Activity,
  Users,
  Target,
  ChevronRight,
} from "lucide-react";

/* ── 3-D Flip Card ────────────────────────────────────────────────── */
function FlipCard({
  front,
  back,
}: {
  front: React.ReactNode;
  back: React.ReactNode;
}) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      style={{ perspective: "1000px", cursor: "pointer" }}
      onClick={() => setFlipped((f) => !f)}
      className="h-40"
    >
      <div
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: "transform 0.55s cubic-bezier(0.4,0,0.2,1)",
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        {/* Front */}
        <div
          style={{ backfaceVisibility: "hidden", position: "absolute", inset: 0 }}
          className="rounded-xl border border-teal-900/40 bg-teal-950/80 p-5 flex flex-col justify-between"
        >
          {front}
          <span className="text-[10px] text-teal-600 select-none">Tap to flip</span>
        </div>
        {/* Back */}
        <div
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            position: "absolute",
            inset: 0,
          }}
          className="rounded-xl border border-teal-800/40 bg-teal-900/60 p-5 flex flex-col justify-between"
        >
          {back}
          <span className="text-[10px] text-teal-600 select-none">Tap to flip</span>
        </div>
      </div>
    </div>
  );
}

const kpiCards = [
  {
    icon: Heart,
    iconColor: "text-rose-400",
    label: "Mental Wellness",
    value: "72%",
    subtitle: "Self-reported score",
    backTitle: "7-Day Trend",
    backItems: ["Mon ▲ 68%", "Tue ▲ 71%", "Wed ▼ 65%", "Thu ▲ 72%"],
    backHint: "Reflection prompt: What made today better?",
  },
  {
    icon: Activity,
    iconColor: "text-emerald-400",
    label: "Physical Health",
    value: "65%",
    subtitle: "Activity goal progress",
    backTitle: "Weekly Goals",
    backItems: ["Walk 30 min · 4/7 days", "Sleep 7h · 5/7 days", "Hydration · 6/7 days"],
    backHint: "Keep it up — you're on track!",
  },
  {
    icon: Target,
    iconColor: "text-sky-400",
    label: "Goal Progress",
    value: "3 / 5",
    subtitle: "Goals completed",
    backTitle: "My Goals",
    backItems: ["✅ Resume updated", "✅ Job application #1", "✅ Life Skills Module 1", "☐ Housing stability plan", "☐ Interview practice"],
    backHint: "2 goals remaining this quarter",
  },
  {
    icon: Users,
    iconColor: "text-violet-400",
    label: "Support Network",
    value: "4",
    subtitle: "Active connections",
    backTitle: "My Contacts",
    backItems: ["Case Manager · Maria C.", "Job Coach · Robert T.", "Peer Mentor · Deja W.", "Counselor · Dr. Ahmed K."],
    backHint: "Reach out anytime — you're supported.",
  },
];

export default function ParticipantDashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  type DashData = {
    learningProgress: { name: string; pct: number }[];
    quickStats: { coursesEnrolled: number; lessonsDone: number; certificates: number; streakDays: number };
  };
  const [dashData, setDashData] = useState<DashData | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/portal/participant/auth");
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetch("/api/participant/dashboard")
        .then((r) => r.json())
        .then(setDashData)
        .catch(() => null);
    }
  }, [isAuthenticated]);

  if (isLoading || !isAuthenticated) return null;

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-8 space-y-8">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-extrabold tracking-tight text-text">
          Welcome back, {user?.name}!
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          How are you doing today? Your journey is tracked below.
        </p>
      </motion.div>

      {/* 3D Flip KPI Cards */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-teal-500/70">
          Your Self-Care Snapshot · tap a card to flip
        </p>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {kpiCards.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + i * 0.07 }}
            >
              <FlipCard
                front={
                  <>
                    <div className="flex items-center gap-2">
                      <c.icon size={16} className={c.iconColor} />
                      <span className="text-xs font-semibold text-teal-300/70">{c.label}</span>
                    </div>
                    <div>
                      <div className="text-2xl font-extrabold tracking-tight text-text">{c.value}</div>
                      <div className="text-[11px] text-muted">{c.subtitle}</div>
                    </div>
                  </>
                }
                back={
                  <>
                    <div className="text-xs font-extrabold tracking-tight text-teal-300">{c.backTitle}</div>
                    <ul className="space-y-1 text-[11px] text-teal-100/70">
                      {c.backItems.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <div className="text-[10px] italic text-teal-400/60">{c.backHint}</div>
                  </>
                }
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Learning Progress + Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Learning progress */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
          <GlowCard className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp size={15} className="text-teal-400" />
              <h2 className="text-sm font-extrabold uppercase tracking-tight text-text">Learning Progress</h2>
            </div>
            <div className="space-y-3">
              {(dashData?.learningProgress ?? [
                { name: "Life Skills 101", pct: 80 },
                { name: "Job Readiness", pct: 55 },
                { name: "Financial Foundations", pct: 30 },
              ]).map((c) => (
                <div key={c.name}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="font-medium text-text">{c.name}</span>
                    <span className="text-muted">{c.pct}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400"
                      style={{ width: `${c.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlowCard>
        </motion.div>

        {/* Quick Stats row */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.27 }}>
          <GlowCard className="p-6 h-full">
            <div className="mb-4 flex items-center gap-2">
              <CheckSquare size={15} className="text-teal-400" />
              <h2 className="text-sm font-extrabold uppercase tracking-tight text-text">Quick Stats</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: BookOpen, label: "Courses Enrolled", value: String(dashData?.quickStats.coursesEnrolled ?? "—"), color: "text-sky-400", bg: "bg-sky-500/10" },
                { icon: CheckSquare, label: "Lessons Done", value: String(dashData?.quickStats.lessonsDone ?? "—"), color: "text-emerald-400", bg: "bg-emerald-500/10" },
                { icon: Award, label: "Certificates", value: String(dashData?.quickStats.certificates ?? "—"), color: "text-amber-400", bg: "bg-amber-500/10" },
                { icon: TrendingUp, label: "Streak (days)", value: String(dashData?.quickStats.streakDays ?? "—"), color: "text-teal-400", bg: "bg-teal-500/10" },
              ].map((s) => (
                <div key={s.label} className={`rounded-lg ${s.bg} p-3`}>
                  <s.icon size={14} className={`mb-1 ${s.color}`} />
                  <div className="text-lg font-extrabold text-text">{s.value}</div>
                  <div className="text-[10px] text-muted">{s.label}</div>
                </div>
              ))}
            </div>
          </GlowCard>
        </motion.div>
      </div>

      {/* Navigation Cards */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.33 }}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Link href="/portal/participant/courses">
            <GlowCard className="group flex items-center justify-between p-5 cursor-pointer hover:border-teal-700/40 transition">
              <div className="flex items-center gap-3">
                <BookOpen size={18} className="text-teal-400" />
                <div>
                  <div className="text-sm font-semibold text-text">My Courses</div>
                  <div className="text-xs text-muted">Continue learning</div>
                </div>
              </div>
              <ChevronRight size={16} className="text-muted group-hover:text-teal-400 transition" />
            </GlowCard>
          </Link>
          <Link href="/portal/participant/profile">
            <GlowCard className="group flex items-center justify-between p-5 cursor-pointer hover:border-teal-700/40 transition">
              <div className="flex items-center gap-3">
                <Users size={18} className="text-teal-400" />
                <div>
                  <div className="text-sm font-semibold text-text">Profile</div>
                  <div className="text-xs text-muted">Manage your account</div>
                </div>
              </div>
              <ChevronRight size={16} className="text-muted group-hover:text-teal-400 transition" />
            </GlowCard>
          </Link>
          <Link href="/portal/participant/messages">
            <GlowCard className="group flex items-center justify-between p-5 cursor-pointer hover:border-teal-700/40 transition">
              <div className="flex items-center gap-3">
                <Award size={18} className="text-teal-400" />
                <div>
                  <div className="text-sm font-semibold text-text">Certificates</div>
                  <div className="text-xs text-muted">View achievements</div>
                </div>
              </div>
              <ChevronRight size={16} className="text-muted group-hover:text-teal-400 transition" />
            </GlowCard>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
