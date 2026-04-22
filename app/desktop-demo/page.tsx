"use client";

/**
 * app/desktop-demo/page.tsx
 *
 * Desktop demo home — portal selector launched inside the Electron shell.
 * Mirrors /portal/page.tsx but uses demo auth, has no real back-end calls,
 * and includes a "Request Full Access" CTA that opens the company website.
 */

import { motion } from "framer-motion";
import Link from "next/link";
import {
  UserCheck, Users, ShieldCheck, Building2, DollarSign,
  Heart, Newspaper, ArrowRight, LogOut,
} from "lucide-react";
import { cn } from "@/lib/cn";

const PORTALS = [
  {
    id: "participant",
    href: "/desktop-demo/participant/dashboard",
    icon: UserCheck,
    label: "Participant Portal",
    description: "Wellness tracking, goal setting, courses, journaling, and self-care tools.",
    accent: "from-teal-500 to-teal-700",
    bg: "bg-teal-950/60 border-teal-800/40",
    iconBg: "bg-teal-500/20 text-teal-400",
    badge: "bg-teal-500/20 text-teal-300",
  },
  {
    id: "staff",
    href: "/desktop-demo/staff/dashboard",
    icon: Users,
    label: "Staff Portal",
    description: "Caseload management, case notes, program oversight, and participant tracking.",
    accent: "from-sky-500 to-sky-700",
    bg: "bg-slate-900/60 border-sky-800/30",
    iconBg: "bg-sky-500/20 text-sky-400",
    badge: "bg-sky-500/20 text-sky-300",
  },
  {
    id: "admin",
    href: "/desktop-demo/admin/dashboard",
    icon: ShieldCheck,
    label: "Admin Portal",
    description: "User management, analytics, compliance, audit logs, and system settings.",
    accent: "from-violet-500 to-violet-700",
    bg: "bg-slate-900/60 border-violet-800/30",
    iconBg: "bg-violet-500/20 text-violet-400",
    badge: "bg-violet-500/20 text-violet-300",
  },
  {
    id: "enterprise",
    href: "/desktop-demo/enterprise/dashboard",
    icon: Building2,
    label: "Enterprise Portal",
    description: "Executive dashboards, org-wide HR, legal, finance, and identity management.",
    accent: "from-cyan-500 to-cyan-700",
    bg: "bg-slate-900/60 border-cyan-800/30",
    iconBg: "bg-cyan-500/20 text-cyan-400",
    badge: "bg-cyan-500/20 text-cyan-300",
  },
  {
    id: "finance",
    href: "/desktop-demo/finance/dashboard",
    icon: DollarSign,
    label: "Finance Portal",
    description: "Budgets, invoicing, payroll, transactions, and financial reporting.",
    accent: "from-emerald-500 to-emerald-700",
    bg: "bg-slate-900/60 border-emerald-800/30",
    iconBg: "bg-emerald-500/20 text-emerald-400",
    badge: "bg-emerald-500/20 text-emerald-300",
  },
  {
    id: "hr",
    href: "/desktop-demo/hr/dashboard",
    icon: Heart,
    label: "HR Portal",
    description: "Onboarding, leave, performance reviews, training, and compliance.",
    accent: "from-pink-500 to-pink-700",
    bg: "bg-slate-900/60 border-pink-800/30",
    iconBg: "bg-pink-500/20 text-pink-400",
    badge: "bg-pink-500/20 text-pink-300",
  },
  {
    id: "news",
    href: "/desktop-demo/news/dashboard",
    icon: Newspaper,
    label: "Newsroom Portal",
    description: "Internal communications, announcements, press releases, and media assets.",
    accent: "from-orange-500 to-orange-700",
    bg: "bg-slate-900/60 border-orange-800/30",
    iconBg: "bg-orange-500/20 text-orange-400",
    badge: "bg-orange-500/20 text-orange-300",
  },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

function handleRequestAccess() {
  if (typeof window !== "undefined" && window.electronBridge) {
    // In Electron — open in system browser
    window.open("https://sdtoolsinc.org/#contact");
  }
}

export default function DesktopDemoHome() {
  return (
    <main className="min-h-screen bg-bg">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />

      {/* Header */}
      <div className="border-b border-border bg-bg/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-brand to-brand2" />
            <span className="text-sm font-bold text-text">T.O.O.L.S Inc</span>
            <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400">
              Preview
            </span>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRequestAccess}
              className="rounded-lg bg-gradient-to-r from-brand to-brand2 px-4 py-1.5 text-xs font-bold text-[#02131a] shadow"
            >
              Request Full Access
            </motion.button>
            <button
              onClick={() => {
                if (typeof window !== "undefined" && window.electronBridge) {
                  window.electronBridge.quit();
                }
              }}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <LogOut size={12} />
              Exit
            </button>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="mx-auto max-w-[1200px] px-6 pb-8 pt-12 text-center">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <h1 className="h1 text-text">
            Platform Preview
            <br />
            <span className="bg-gradient-to-r from-brand to-brand2 bg-clip-text text-transparent">
              All 7 Portals
            </span>
          </h1>
          <p className="p-lead mx-auto mt-3 max-w-xl">
            All data is simulated for preview purposes. Click any portal to explore. This preview
            is covered by your signed confidentiality agreement.
          </p>
        </motion.div>
      </section>

      {/* Portal Grid */}
      <section className="mx-auto max-w-[1200px] px-6 pb-20">
        <motion.div
          className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
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
                      portal.bg,
                    )}
                  >
                    <div
                      className={cn(
                        "absolute left-0 top-0 h-0.5 w-full bg-gradient-to-r opacity-70",
                        portal.accent,
                      )}
                    />
                    <div className="mb-4 flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-xl",
                          portal.iconBg,
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-base font-bold text-text">{portal.label}</div>
                        <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", portal.badge)}>
                          Preview
                        </span>
                      </div>
                    </div>
                    <p className="mb-4 text-sm text-muted">{portal.description}</p>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-brand">
                      Explore portal <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </section>
    </main>
  );
}
