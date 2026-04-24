"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Lock } from "lucide-react";

export function DesktopSectionPlaceholder({
  portal,
  section,
  dashboardHref,
}: {
  portal: string;
  section: string;
  dashboardHref: string;
}) {
  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mx-auto max-w-2xl rounded-2xl border border-border bg-panel p-8 text-center"
      >
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/15">
          <Lock className="h-6 w-6 text-amber-400" />
        </div>
        <h1 className="text-xl font-extrabold tracking-tight text-text">
          {portal} · {section}
        </h1>
        <p className="mt-2 text-sm text-muted">
          This section is available in the full licensed platform. Preview build currently highlights
          the dashboard experience and core navigation model.
        </p>
        <Link
          href={dashboardHref}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-brand to-brand2 px-4 py-2 text-sm font-bold text-[#02131a]"
        >
          <ArrowLeft size={14} />
          Back to Dashboard
        </Link>
      </motion.div>
    </div>
  );
}
