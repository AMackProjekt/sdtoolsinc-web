"use client";

import { motion } from "framer-motion";
import { GlowCard } from "./GlowCard";
import { SectionHeading } from "./SectionHeading";
import { cn } from "@/lib/cn";

const steps = [
  {
    id: 1,
    title: "Get Your California ID",
    icon: "🪪",
    location: "MTS Transit Store (1255 Imperial Ave) or local DMV",
    details: [
      "Bring discharge papers or DPO letter",
      "Birth certificate (request from Vital Records if needed)",
      "Social Security card or proof",
      "CA ID fee: ~$30 (ask about fee waiver with DPO letter)"
    ],
    reentryTip: "Ask probation for fee waiver letter - many DMVs honor it"
  },
  {
    id: 2,
    title: "Get PRONTO Card for Transit",
    icon: "🚊",
    location: "Any Trolley station or MTS Transit Store",
    details: [
      "One-time $2 card purchase",
      "Load with cash, card, or benefits",
      "Register at ridepronto.com for lost card protection",
      "Discounted fares available for low-income (ORCA)"
    ],
    reentryTip: "Save $40+/month vs. Uber - essential for job hunting"
  },
  {
    id: 3,
    title: "Apply for Food Assistance (CalFresh)",
    icon: "🍎",
    location: "DHHS offices or online at GetCalFresh.org",
    details: [
      "Up to $281/month for groceries",
      "Apply same day as release (emergency 3-day approval)",
      "Need: CA ID, proof of address, income docs",
      "Use EBT card at most stores & farmers markets"
    ],
    reentryTip: "Emergency CalFresh approved in 3 days if homeless or $0 income"
  },
  {
    id: 4,
    title: "Get a Phone Number (619 or 858)",
    icon: "📱",
    location: "Free apps or prepaid stores",
    details: [
      "Google Voice: Free 619/858 number (needs wifi)",
      "TextNow: Free calling/texting with ads",
      "Metro/Cricket: $30-40/month prepaid plans",
      "Library computers have free wifi for setup"
    ],
    reentryTip: "Employers NEED to call you - get this done Day 1"
  },
  {
    id: 5,
    title: "Find Temporary Housing",
    icon: "🏠",
    location: "Transitional housing & emergency shelters",
    details: [
      "Call 211 for shelter bed availability (24/7)",
      "Rachel's Women Center (women only, downtown)",
      "Father Joe's Villages (men/women/families)",
      "Transitional housing: PATH, Veteran programs, Alpha Project"
    ],
    reentryTip: "Stable address = easier job search. Use shelter address if needed."
  },
  {
    id: 6,
    title: "Apply for Your First Job or Day Labor",
    icon: "💼",
    location: "Dolly, Instacart, or temp agencies",
    details: [
      "Day labor: Cash same-day at Labor Ready, PeopleReady",
      "Dolly: Moving gigs (need truck access or partner up)",
      "Instacart/DoorDash: Grocery delivery (bike/car)",
      "Second-chance employers: NK Towing, Vons, FedEx (see below)"
    ],
    reentryTip: "Day labor = immediate income while applying for real jobs"
  }
];

const timeline = [
  {
    period: "Hours 0-24",
    priority: "🚨 Critical First Day",
    tasks: [
      "Get CA ID paperwork started",
      "Get phone number (Google Voice if no money)",
      "Call 211 for shelter bed",
      "Apply for emergency CalFresh"
    ]
  },
  {
    period: "Hours 24-48",
    priority: "⚡ Build Foundation",
    tasks: [
      "Get PRONTO card for transit",
      "Visit library for wifi/computer access",
      "Register for day labor agencies",
      "Check in with probation officer"
    ]
  },
  {
    period: "Hours 48-72",
    priority: "💪 Start Working",
    tasks: [
      "Apply to 5-10 second-chance employers",
      "Show up at day labor sites (6am-7am)",
      "Connect with reentry services (Father Joe's, PATH)",
      "Get CalFresh EBT card (if approved)"
    ]
  }
];

export function FirstStepsChecklist() {
  return (
    <section className="mx-auto max-w-container px-7 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <SectionHeading
          eyebrow="First 72 Hours After Release"
          title="Your First Steps Checklist"
          subtitle="Concrete actions to take in your first 3 days. San Diego-specific locations and resources to get you started immediately."
        />

        {/* Main Steps */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, idx) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.4,
                delay: idx * 0.08,
                ease: [0.22, 1, 0.36, 1]
              }}
            >
              <GlowCard className="h-full p-6 bg-gradient-to-br from-panel/80 to-bg/50 hover:from-panel hover:to-bg/80 transition-all duration-300">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 text-4xl">{step.icon}</div>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-brand mb-1">
                      STEP {step.id}
                    </div>
                    <h3 className="text-xl font-extrabold text-text mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm font-semibold text-brand2 mb-3">
                      📍 {step.location}
                    </p>
                  </div>
                </div>

                <ul className="space-y-2 mb-4">
                  {step.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted">
                      <span className="text-brand mt-1">→</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4 border-t border-border">
                  <p className="text-xs font-semibold text-accent">
                    💡 Reentry Tip: {step.reentryTip}
                  </p>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>

        {/* 72-Hour Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="mt-16"
        >
          <h3 className="text-2xl font-extrabold text-text mb-8 text-center">
            ⏱️ Your 72-Hour Priority Timeline
          </h3>

          <div className="grid gap-6 md:grid-cols-3">
            {timeline.map((phase, idx) => (
              <GlowCard
                key={idx}
                className="p-6 bg-gradient-to-br from-bg/50 to-panel/30"
              >
                <div className="text-center mb-4">
                  <div className="text-sm font-bold text-brand mb-1">
                    {phase.period}
                  </div>
                  <div className="text-lg font-extrabold text-text">
                    {phase.priority}
                  </div>
                </div>

                <ul className="space-y-3">
                  {phase.tasks.map((task, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-brand2 mt-1">✓</span>
                      <span className="text-muted">{task}</span>
                    </li>
                  ))}
                </ul>
              </GlowCard>
            ))}
          </div>
        </motion.div>

        {/* Emergency Resources Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <GlowCard className="inline-block px-8 py-6 bg-gradient-to-r from-brand/10 to-brand2/10">
            <p className="text-sm font-semibold text-text mb-3">
              🚨 Emergency Resources (24/7)
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-xs text-muted">
              <span>211 - Shelter/Food/Services</span>
              <span>988 - Mental Health Crisis</span>
              <span>619-543-6222 - UCSD Emergency Dept</span>
              <span>T.O.O.L.S. Inc - Reentry Support</span>
            </div>
          </GlowCard>
        </motion.div>
      </motion.div>
    </section>
  );
}
