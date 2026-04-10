"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { IntegrationsPanel } from "@/components/ui/IntegrationsPanel";
import { GlowCard } from "@/components/ui/GlowCard";
import { Puzzle } from "lucide-react";

export default function AdminIntegrationsPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/portal/admin/auth");
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
          <Puzzle size={22} className="text-violet-400" />
          Integrations &amp; Connected Apps
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Manage productivity tool connections for your admin portal workspace.
          Integrations are scoped per portal user session.
        </p>
      </div>

      {/* Quick-tip card */}
      <GlowCard className="border border-violet-800/30 bg-violet-950/40 p-4">
        <p className="text-xs leading-relaxed text-violet-300/80">
          <span className="font-semibold text-violet-300">Admin tip:</span> Enable Microsoft 365
          or Google Workspace SSO first to allow staff and participants to authenticate with
          their existing accounts. Configure API keys in the enterprise portal settings for
          organisation-wide access.
        </p>
      </GlowCard>

      {/* Shared integrations panel */}
      <IntegrationsPanel portalName="admin" accentColor="text-violet-400" />
    </motion.div>
  );
}
