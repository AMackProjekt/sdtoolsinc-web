"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";

export default function StaffDashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/portal/staff/auth");
    }
  }, [isAuthenticated, router]);

  if (!user) return null;

  return (
    <div className="mx-auto max-w-container px-7 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-text">
          Staff Dashboard
        </h1>
        <p className="mt-2 text-muted">Welcome, {user.name}</p>
      </motion.div>

      <GlowCard className="p-10 text-center">
        <div className="text-5xl mb-4">🚧</div>
        <h2 className="text-xl font-extrabold tracking-tight text-text mb-2">Coming Soon</h2>
        <p className="text-muted text-sm">
          The Staff Portal dashboard is under active development. Check back soon!
        </p>
      </GlowCard>
    </div>
  );
}
