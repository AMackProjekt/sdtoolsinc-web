"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/cn";
import {
  Users,
  UserCheck,
  ShieldCheck,
  Building2,
  DollarSign,
  Heart,
  Newspaper,
  ArrowRight,
  Play,
} from "lucide-react";

const PORTALS = [
  {
    id: "participant",
    label: "Participant Portal",
    description:
      "Personal wellness tracking, goal setting, daily journaling, course progress, and self-care tools.",
    icon: Users,
    color: "teal",
    href: "/demo/participant/dashboard",
    features: ["Mental Wellness Dashboard", "Goal Tracker", "Daily Journal", "Self-Care Tools", "Courses"],
    accent: "from-teal-500 to-teal-700",
    bg: "bg-teal-950/60 border-teal-900/40",
    badge: "bg-teal-500/20 text-teal-300",
    iconBg: "bg-teal-500/20 text-teal-400",
  },
  {
    id: "staff",
    label: "Staff Portal",
    description:
      "Caseload management, participant tracking, schedules, case notes, and program oversight.",
    icon: UserCheck,
    color: "sky",
    href: "/demo/staff/dashboard",
    features: ["Caseload Overview", "Participant Manager", "Case Notes", "Programs", "Reports"],
    accent: "from-sky-500 to-sky-700",
    bg: "bg-slate-900/60 border-sky-900/30",
    badge: "bg-sky-500/20 text-sky-300",
    iconBg: "bg-sky-500/20 text-sky-400",
  },
  {
    id: "admin",
    label: "Admin Portal",
    description:
      "Full organizational oversight — users, staff, analytics, compliance, audit logs, and system settings.",
    icon: ShieldCheck,
    color: "violet",
    href: "/demo/admin/dashboard",
    features: ["User Management", "Analytics", "Compliance", "Audit Log", "Assignments"],
    accent: "from-violet-500 to-violet-700",
    bg: "bg-slate-900/60 border-violet-900/30",
    badge: "bg-violet-500/20 text-violet-300",
    iconBg: "bg-violet-500/20 text-violet-400",
  },
  {
    id: "enterprise",
    label: "Enterprise Portal",
    description:
      "Executive dashboards, org-wide HR, legal, finance summaries, identity management, and voice analytics.",
    icon: Building2,
    color: "cyan",
    href: "/demo/enterprise/dashboard",
    features: ["Executive Suite", "Org Overview", "Legal", "Identity & SSO", "Voice Analytics"],
    accent: "from-cyan-500 to-cyan-700",
    bg: "bg-slate-900/60 border-cyan-900/30",
    badge: "bg-cyan-500/20 text-cyan-300",
    iconBg: "bg-cyan-500/20 text-cyan-400",
  },
  {
    id: "finance",
    label: "Finance Portal",
    description:
      "Budgets, invoicing, payroll, transactions, financial reports, and accounting integrations.",
    icon: DollarSign,
    color: "emerald",
    href: "/demo/finance/dashboard",
    features: ["Budget Manager", "Invoicing", "Payroll", "Transactions", "Reports"],
    accent: "from-emerald-500 to-emerald-700",
    bg: "bg-slate-900/60 border-emerald-900/30",
    badge: "bg-emerald-500/20 text-emerald-300",
    iconBg: "bg-emerald-500/20 text-emerald-400",
  },
  {
    id: "hr",
    label: "HR Portal",
    description:
      "Staff onboarding, leave management, performance reviews, training, compliance, and disciplinary records.",
    icon: Heart,
    color: "pink",
    href: "/demo/hr/dashboard",
    features: ["Onboarding", "Leave Management", "Performance Reviews", "Training", "Compliance"],
    accent: "from-pink-500 to-pink-700",
    bg: "bg-slate-900/60 border-pink-900/30",
    badge: "bg-pink-500/20 text-pink-300",
    iconBg: "bg-pink-500/20 text-pink-400",
  },
  {
    id: "news",
    label: "Newsroom Portal",
    description:
      "Internal communications, announcements, press releases, and organizational news management.",
    icon: Newspaper,
    color: "orange",
    href: "/demo/news/dashboard",
    features: ["Announcements", "Press Releases", "Internal Comms", "Media Assets"],
    accent: "from-orange-500 to-orange-700",
    bg: "bg-slate-900/60 border-orange-900/30",
    badge: "bg-orange-500/20 text-orange-300",
    iconBg: "bg-orange-500/20 text-orange-400",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export default function DemoLandingPage() {
  return (
    <main className="min-h-screen bg-bg">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />

      {/* Hero */}
      <section className="mx-auto max-w-[1200px] px-6 pb-10 pt-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-amber-400">
            <Play className="h-3 w-3" />
            Interactive Demo — No Login Needed
          </div>
          <h1 className="h1 text-text">
            T.O.O.L.S Inc
            <br />
            <span className="bg-gradient-to-r from-brand to-brand2 bg-clip-text text-transparent">
              Platform Demo
            </span>
          </h1>
          <p className="p-lead mx-auto mt-4 max-w-xl">
            Explore every portal with a fully functional demo. All data is pre-populated and
            simulated — no account, no login, just click and explore.
          </p>
        </motion.div>
      </section>

      {/* Portal Cards */}
      <section className="mx-auto max-w-[1200px] px-6 pb-24">
        <motion.div
          className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {PORTALS.map((portal) => {
            const Icon = portal.icon;
            return (
              <motion.div key={portal.id} variants={item}>
                <Link href={portal.href} className="group block">
                  <div
                    className={cn(
                      "relative overflow-hidden rounded-2xl border p-6 transition-all duration-300",
                      "hover:-translate-y-1 hover:shadow-glow",
                      portal.bg
                    )}
                  >
                    {/* Gradient accent bar */}
                    <div
                      className={cn(
                        "absolute left-0 top-0 h-1 w-full bg-gradient-to-r opacity-70",
                        portal.accent
                      )}
                    />

                    {/* Icon + Label */}
                    <div className="mb-4 flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-xl",
                          portal.iconBg
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-base font-bold text-text">{portal.label}</div>
                        <div
                          className={cn(
                            "mt-0.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest",
                            portal.badge
                          )}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
                          Live Demo
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="mb-4 text-sm leading-relaxed text-muted">
                      {portal.description}
                    </p>

                    {/* Feature pills */}
                    <div className="mb-5 flex flex-wrap gap-1.5">
                      {portal.features.map((f) => (
                        <span
                          key={f}
                          className={cn(
                            "rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                            portal.badge
                          )}
                        >
                          {f}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-text/70 transition group-hover:text-text">
                      Explore Demo
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Footer note */}
        <motion.p
          className="mt-12 text-center text-xs text-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Demo user: <span className="font-mono text-brand">alex.rivera@sdtoolsinc.org</span> ·
          All interactions are client-side only · No data is persisted
        </motion.p>
      </section>
    </main>
  );
}
