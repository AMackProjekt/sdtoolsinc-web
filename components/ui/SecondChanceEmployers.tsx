"use client";

import { motion } from "framer-motion";
import { GlowCard } from "./GlowCard";
import { SectionHeading } from "./SectionHeading";
import { Button } from "./Button";

const employers = [
  {
    id: 1,
    name: "NK Towing",
    location: "Vista / North County San Diego",
    type: "Roadside Assistance & Towing",
    badges: ["✓ Verified", "🔥 Hiring Now"],
    hiringNotes: "Background-friendly. Entry-level tow truck operator and roadside tech positions. Will train.",
    contact: "Walk-in applications preferred"
  },
  {
    id: 2,
    name: "Vons / Albertsons",
    location: "Multiple locations (Chula Vista, Euclid Ave, etc.)",
    type: "Grocery / Retail",
    badges: ["✓ Verified", "💼 Entry Level"],
    hiringNotes: "Stocker, cashier, bakery, deli positions. Case-by-case background review (not auto-reject).",
    contact: "Apply online at albertsonscompanies.com/careers"
  },
  {
    id: 3,
    name: "Second Chance Beer Co.",
    location: "San Diego (local brewery)",
    type: "Manufacturing / Sales",
    badges: ["✓ Verified", "🎯 Mission-Aligned"],
    hiringNotes: "Founded TO hire formerly incarcerated. Brewery operations, packaging, delivery, sales.",
    contact: "Apply at secondchancebeer.org"
  },
  {
    id: 4,
    name: "FedEx / UPS",
    location: "Kearny Mesa, Mira Mesa hubs",
    type: "Logistics / Warehouse",
    badges: ["✓ Verified", "🔥 Hiring Now"],
    hiringNotes: "Package handlers, sorters, drivers (CDL). Background-friendly after 7-10 years. Immediate openings.",
    contact: "Apply at fedex.com/careers or ups.com/jobs"
  },
  {
    id: 5,
    name: "Ralphs / Food 4 Less",
    location: "Euclid Ave, Mission Valley, etc.",
    type: "Grocery / Retail",
    badges: ["✓ Verified", "💼 Entry Level"],
    hiringNotes: "Similar to Vons - stocker, cashier, warehouse. Case-by-case background check.",
    contact: "Apply at ralphs.com/careers"
  },
  {
    id: 6,
    name: "Dolly (App-Based Moving)",
    location: "San Diego-wide (gig work)",
    type: "Day Labor / Delivery",
    badges: ["⚡ Same-Day Pay", "💼 Entry Level"],
    hiringNotes: "Background check required but more flexible. Moving help, furniture delivery. Cash tips daily.",
    contact: "Download Dolly Helper app"
  },
  {
    id: 7,
    name: "Instacart & Grocery Delivery",
    location: "San Diego-wide (gig work)",
    type: "Gig / Delivery",
    badges: ["⚡ Same-Day Pay", "🚗 Need Vehicle"],
    hiringNotes: "Grocery shopping + delivery. Background check but more flexible for older convictions. Bike ok for some.",
    contact: "Apply at shoppers.instacart.com"
  },
  {
    id: 8,
    name: "San Diego Temp Agencies",
    location: "Downtown, Mission Valley",
    type: "Temp / Contract Work",
    badges: ["✓ Verified", "🔥 Hiring Now"],
    hiringNotes: "Labor Ready, PeopleReady, Remedy Staffing. Warehouse, construction, events. Same-day pay options.",
    contact: "Walk-in early morning (6-7am)"
  }
];

const hiringTips = [
  {
    icon: "💬",
    tip: "Be Honest About Your Background",
    detail: "Don't lie on applications. Explain what you learned and how you've changed. Honesty builds trust."
  },
  {
    icon: "⏰",
    tip: "Show Up Early & Dress Clean",
    detail: "First impressions matter. Arrive 10 minutes early. Wear clean, simple clothes (no need for suit)."
  },
  {
    icon: "❓",
    tip: "Ask Questions About the Job",
    detail: "Show interest by asking about training, schedule, advancement. Employers want engaged workers."
  }
];

const dayLaborOptions = [
  {
    category: "Walk-In Day Labor",
    details: [
      "Labor Ready (Downtown): 6am sign-up, same-day cash",
      "PeopleReady (Mission Valley): Construction, warehouse, events",
      "Show up early (6-7am) for best jobs",
      "Bring ID, steel-toe boots if you have them"
    ]
  },
  {
    category: "Same-Day Gig Apps",
    details: [
      "Dolly: Moving help ($15-25/hr + tips)",
      "TaskRabbit: Handyman, assembly, cleaning",
      "Wonolo: Warehouse shifts posted daily",
      "Background checks vary by platform"
    ]
  }
];

export function SecondChanceEmployers() {
  return (
    <section className="mx-auto max-w-container px-7 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <SectionHeading
          eyebrow="2026 San Diego Second-Chance Employers"
          title="Companies Hiring Formerly Incarcerated"
          subtitle="Verified employers in San Diego who give real second chances. Updated January 2026."
        />

        {/* Employer Cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {employers.map((employer, idx) => (
            <motion.div
              key={employer.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.4,
                delay: idx * 0.06,
                ease: [0.22, 1, 0.36, 1]
              }}
            >
              <GlowCard className="h-full p-6 bg-gradient-to-br from-panel/80 to-bg/50 hover:from-panel hover:to-bg/80 transition-all duration-300">
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-extrabold text-text mb-1">
                        {employer.name}
                      </h3>
                      <p className="text-sm font-semibold text-brand2">
                        📍 {employer.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {employer.badges.map((badge, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full text-xs font-bold bg-brand/20 text-brand border border-brand/30"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  <p className="text-sm text-muted mb-3">
                    <span className="font-semibold text-text">Industry:</span>{" "}
                    {employer.type}
                  </p>

                  <div className="p-4 rounded-lg bg-bg/50 border border-border mb-4">
                    <p className="text-sm text-muted leading-relaxed">
                      {employer.hiringNotes}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-accent">
                    <span>📞</span>
                    <span className="font-semibold">{employer.contact}</span>
                  </div>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>

        {/* Hiring Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="mt-16"
        >
          <h3 className="text-2xl font-extrabold text-text mb-8 text-center">
            💼 Tips for Getting Hired
          </h3>

          <div className="grid gap-6 md:grid-cols-3">
            {hiringTips.map((item, idx) => (
              <GlowCard
                key={idx}
                className="p-6 bg-gradient-to-br from-bg/50 to-panel/30 text-center"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h4 className="text-lg font-bold text-text mb-2">{item.tip}</h4>
                <p className="text-sm text-muted">{item.detail}</p>
              </GlowCard>
            ))}
          </div>
        </motion.div>

        {/* Day Labor Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45, delay: 0.3 }}
          className="mt-16"
        >
          <h3 className="text-2xl font-extrabold text-text mb-8 text-center">
            ⚡ Need Money TODAY? Day Labor Options
          </h3>

          <div className="grid gap-6 md:grid-cols-2">
            {dayLaborOptions.map((option, idx) => (
              <GlowCard
                key={idx}
                className="p-6 bg-gradient-to-br from-brand/10 to-brand2/10"
              >
                <h4 className="text-xl font-bold text-text mb-4">
                  {option.category}
                </h4>
                <ul className="space-y-3">
                  {option.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-brand mt-1">→</span>
                      <span className="text-muted">{detail}</span>
                    </li>
                  ))}
                </ul>
              </GlowCard>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted mb-4">
              💡 Day labor = Immediate income while you apply to full-time jobs.
              Don't wait - start earning TODAY.
            </p>
            <Button className="bg-gradient-to-r from-brand to-brand2 text-[#02131a]">
              📄 Download Employer List (PDF)
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
