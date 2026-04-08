"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  UserCheck,
  Users,
  ShieldCheck,
  Shield,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/cn";

const PORTALS = [
  {
    href: "/portal/participant/dashboard",
    authHref: "/portal/participant/auth",
    icon: UserCheck,
    accent: "teal",
    label: "Participant Portal",
    description:
      "Access your courses, track your progress, and manage your T.O.O.L.S Inc program journey.",
    badge: "Enrolled participants",
  },
  {
    href: "/portal/staff/dashboard",
    authHref: "/portal/staff/auth",
    icon: Users,
    accent: "sky",
    label: "Staff Portal",
    description:
      "Manage caseloads, schedule appointments, review documents, and support program participants.",
    badge: "Staff & Case Managers",
  },
  {
    href: "/portal/admin/dashboard",
    authHref: "/portal/admin/auth",
    icon: ShieldCheck,
    accent: "violet",
    label: "Admin Portal",
    description:
      "Oversee operations, manage personnel, review compliance reports, and configure program settings.",
    badge: "Administrators only",
  },
  {
    href: "/portal/enterprise/dashboard",
    authHref: "/portal/enterprise/auth",
    icon: Shield,
    accent: "cyan",
    label: "Enterprise Workspace",
    description:
      "Identity, compliance, integrations, and executive analytics for enterprise administrators.",
    badge: "Enterprise Administrators",
  },
];

const accentMap: Record<
  string,
  { card: string; icon: string; badge: string; arrow: string }
> = {
  teal: {
    card: "hover:border-teal-500/50 hover:shadow-[0_0_0_1px_rgba(20,184,166,.35),0_12px_40px_rgba(0,0,0,.5)]",
    icon: "bg-teal-900/60 text-teal-400",
    badge: "bg-teal-900/40 text-teal-400 border border-teal-700/50",
    arrow: "text-teal-400",
  },
  sky: {
    card: "hover:border-sky-500/50 hover:shadow-[0_0_0_1px_rgba(14,165,233,.35),0_12px_40px_rgba(0,0,0,.5)]",
    icon: "bg-sky-900/60 text-sky-400",
    badge: "bg-sky-900/40 text-sky-400 border border-sky-700/50",
    arrow: "text-sky-400",
  },
  violet: {
    card: "hover:border-violet-500/50 hover:shadow-[0_0_0_1px_rgba(167,139,250,.35),0_12px_40px_rgba(0,0,0,.5)]",
    icon: "bg-violet-900/60 text-violet-400",
    badge: "bg-violet-900/40 text-violet-400 border border-violet-700/50",
    arrow: "text-violet-400",
  },
  cyan: {
    card: "hover:border-cyan-500/50 hover:shadow-[0_0_0_1px_rgba(6,182,212,.35),0_12px_40px_rgba(0,0,0,.5)]",
    icon: "bg-cyan-900/60 text-cyan-400",
    badge: "bg-cyan-900/40 text-cyan-400 border border-cyan-700/50",
    arrow: "text-cyan-400",
  },
};

export default function PortalHubPage() {
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-7 py-16">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mb-12 text-center"
      >
        <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
          <img
            src="/logos/main-logo.png"
            alt="T.O.O.L.S Inc"
            className="h-10 w-auto object-contain"
          />
          <span className="text-lg font-extrabold tracking-tight text-text group-hover:text-brand transition-colors">
            T.O.O.L.S Inc
          </span>
        </Link>

        <h1 className="text-4xl font-extrabold tracking-tight text-text">
          Portal Access
        </h1>
        <p className="mt-3 text-muted max-w-md mx-auto">
          Select your portal to access your personalized T.O.O.L.S Inc
          workspace.
        </p>
      </motion.div>

      {/* Portal Cards */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {PORTALS.map((portal, i) => {
          const colors = accentMap[portal.accent];
          const Icon = portal.icon;
          return (
            <motion.div
              key={portal.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
            >
              <Link
                href={portal.authHref}
                className={cn(
                  "group relative flex flex-col rounded-2xl border border-white/10 bg-[#0c0f17]/80 backdrop-blur-sm p-7 transition-all duration-300",
                  colors.card
                )}
              >
                {/* Icon */}
                <div
                  className={cn(
                    "mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl",
                    colors.icon
                  )}
                >
                  <Icon className="h-6 w-6" />
                </div>

                {/* Badge */}
                <span
                  className={cn(
                    "mb-4 inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    colors.badge
                  )}
                >
                  {portal.badge}
                </span>

                {/* Label */}
                <h2 className="text-lg font-extrabold tracking-tight text-text">
                  {portal.label}
                </h2>

                {/* Description */}
                <p className="mt-2 text-sm text-muted leading-relaxed flex-1">
                  {portal.description}
                </p>

                {/* Arrow */}
                <div
                  className={cn(
                    "mt-6 flex items-center gap-1.5 text-sm font-semibold transition-all",
                    colors.arrow,
                    "group-hover:gap-2.5"
                  )}
                >
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-14 text-xs text-muted/60"
      >
        Need help?{" "}
        <Link href="/#contact" className="underline underline-offset-2 hover:text-muted">
          Contact support
        </Link>
      </motion.p>
    </div>
  );
}
