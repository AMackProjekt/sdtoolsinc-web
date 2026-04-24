"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";
import { TrendingUp, Users, Activity, Clock } from "lucide-react";
import { WeeklyEngagementChart } from "@/components/ui/WeeklyEngagementChart";
import { cn } from "@/lib/cn";

interface AdminStats {
  totalUsers: number;
  activeStaff: number;
  activeParticipants: number;
  activeCourses: number;
}

const METRIC_CARD_SKELETON = "animate-pulse rounded-lg bg-white/5 h-8 w-20";

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/portal/admin/auth");
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then((d) => setStats(d.stats ?? null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  if (isLoading || !isAuthenticated) return null;

  const metrics = [
    {
      label: "Total Users",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
    },
    {
      label: "Active Staff",
      value: stats?.activeStaff ?? 0,
      icon: Activity,
      color: "text-sky-400",
      bg: "bg-sky-500/10",
    },
    {
      label: "Participants",
      value: stats?.activeParticipants ?? 0,
      icon: TrendingUp,
      color: "text-teal-400",
      bg: "bg-teal-500/10",
    },
    {
      label: "Active Courses",
      value: stats?.activeCourses ?? 0,
      icon: Clock,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">Analytics</h1>
        <p className="mt-1 text-sm text-slate-400">Platform-wide usage statistics and growth trends.</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {metrics.map(({ label, value, icon: Icon, color, bg }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <GlowCard className="p-5">
              <div className={cn("mb-3 inline-flex rounded-lg p-2.5", bg)}>
                <Icon className={cn("h-5 w-5", color)} />
              </div>
              {loading ? (
                <div className={METRIC_CARD_SKELETON} />
              ) : (
                <div className={cn("text-3xl font-extrabold", color)}>{value.toLocaleString()}</div>
              )}
              <div className="mt-1 text-sm font-semibold text-slate-300">{label}</div>
            </GlowCard>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <WeeklyEngagementChart title="Platform Engagement" />
      </motion.div>
    </div>
  );
}
