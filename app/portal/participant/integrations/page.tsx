"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { IntegrationsPanel } from "@/components/ui/IntegrationsPanel";
import { GlowCard } from "@/components/ui/GlowCard";
import { Puzzle } from "lucide-react";

export default function ParticipantIntegrationsPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/portal/participant/auth");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-8 p-6 lg:p-8"
    >
      {/* Page header */}
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-white">
          <Puzzle size={22} className="text-teal-400" />
          Connected Apps &amp; Tools
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Link your favourite apps to get the most out of your portal — sync your calendar,
          connect your email, and stay organised from one place.
        </p>
      </div>

      {/* Quick-tip card */}
      <GlowCard className="border border-teal-800/30 bg-teal-950/40 p-4">
        <p className="text-xs leading-relaxed text-teal-300/80">
          <span className="font-semibold text-teal-300">Tip:</span> Connect Google Calendar or
          Microsoft 365 to automatically sync your program appointments and session reminders.
          All connections are private to your account and can be removed at any time.
        </p>
      </GlowCard>

      {/* Participant panel — enterprise HR/HMIS tools excluded */}
      <IntegrationsPanel
        portalName="participant"
        accentColor="text-teal-400"
        excludeIds={["adp-workforce", "clarity-hmis"]}
      />
    </motion.div>
  );
}
