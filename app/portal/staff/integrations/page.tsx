"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { IntegrationsPanel } from "@/components/ui/IntegrationsPanel";
import { GlowCard } from "@/components/ui/GlowCard";
import { Puzzle } from "lucide-react";

export default function StaffIntegrationsPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/portal/staff/auth");
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
          <Puzzle size={22} className="text-sky-400" />
          Integrations &amp; Connected Apps
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Connect your daily tools — calendars, communication platforms, HR systems, and case
          management software — to streamline your workflow.
        </p>
      </div>

      {/* Quick-tip card */}
      <GlowCard className="border border-sky-800/30 bg-sky-950/40 p-4">
        <p className="text-xs leading-relaxed text-sky-300/80">
          <span className="font-semibold text-sky-300">Staff tip:</span> Connect ADP Workforce Now
          to sync your schedule and benefits, and link Clarity HMIS to keep client records in
          sync with your case notes. Contact your administrator to enable enterprise-wide SSO.
        </p>
      </GlowCard>

      {/* Shared integrations panel — staff see all apps including Workforce & HMIS */}
      <IntegrationsPanel portalName="staff" accentColor="text-sky-400" />
    </motion.div>
  );
}
