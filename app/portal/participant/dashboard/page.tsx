"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";
import Link from "next/link";

export default function ParticipantDashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/portal/participant/auth");
    }
  }, [isAuthenticated, router]);

  if (!user) return null;

  const stats = [
    { label: "Courses Enrolled", value: "0", icon: "📚" },
    { label: "Lessons Completed", value: "0", icon: "✅" },
    { label: "Certificates", value: "0", icon: "🏆" },
    { label: "Progress", value: "45%", icon: "📈" },
  ];

  return (
    <div className="mx-auto max-w-container px-7 py-8">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-extrabold tracking-tight text-text">
          Welcome back, {user.name}!
        </h1>
        <p className="mt-2 text-muted">Continue your learning journey</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlowCard className="p-5">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{stat.icon}</div>
                <div>
                  <div className="text-xl font-extrabold tracking-tight text-text">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted mt-0.5">{stat.label}</div>
                </div>
              </div>
            </GlowCard>
          </motion.div>
        ))}
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/portal/participant/courses">
          <GlowCard className="p-6 cursor-pointer">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-lg font-extrabold tracking-tight text-text">My Courses</h3>
            <p className="mt-2 text-sm text-muted">
              Access your enrolled courses and continue learning
            </p>
          </GlowCard>
        </Link>

        <Link href="/portal/participant/profile">
          <GlowCard className="p-6 cursor-pointer">
            <div className="text-4xl mb-4">👤</div>
            <h3 className="text-lg font-extrabold tracking-tight text-text">Profile Settings</h3>
            <p className="mt-2 text-sm text-muted">Manage your account and preferences</p>
          </GlowCard>
        </Link>

        <GlowCard className="p-6">
          <div className="text-4xl mb-4">🎓</div>
          <h3 className="text-lg font-extrabold tracking-tight text-text">Certificates</h3>
          <p className="mt-2 text-sm text-muted">View and download your achievements</p>
        </GlowCard>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8"
      >
        <h2 className="text-xl font-extrabold tracking-tight text-text mb-4">
          Recent Activity
        </h2>
        <GlowCard className="p-6">
          <div className="text-center py-8 text-muted">
            <p>No recent activity yet. Start a course to see your progress here!</p>
          </div>
        </GlowCard>
      </motion.div>
    </div>
  );
}
