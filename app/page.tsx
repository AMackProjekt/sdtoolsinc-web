import { Navbar } from "@/components/ui/Navbar";
import { GlowCard } from "@/components/ui/GlowCard";
import { Button } from "@/components/ui/Button";
import { DashboardSection } from "@/components/ui/DashboardSection";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function Page() {
  return (
    <main className="min-h-screen bg-bg">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />

      <Navbar />

      {/* HERO */}
      <section className="mx-auto max-w-container px-7 pt-24 pb-16 text-center">
        <h1 className="h1">
          Modern Systems.
          <br />
          <span className="bg-gradient-to-r from-brand to-brand2 bg-clip-text text-transparent">
            Real-World Impact.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-[760px] p-lead">
          TOOLS Inc builds operational platforms, case-flow systems, and digital infrastructure designed
          for clarity, compliance, and scale.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button variant="primary">Get Started</Button>
          <Button variant="ghost">View Platform</Button>
        </div>

        {/* KPI band */}
        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-4">
          {[
            ["99.9%", "System reliability"],
            ["10x", "Workflow efficiency"],
            ["100%", "Audit-ready logs"],
            ["∞", "Modular scaling"]
          ].map(([v, t]) => (
            <GlowCard key={t} className="p-5 text-left">
              <div className="text-2xl font-extrabold tracking-tight">{v}</div>
              <div className="mt-2 text-sm text-muted">{t}</div>
            </GlowCard>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="platform" className="mx-auto max-w-container px-7 pt-8 pb-20">
        <SectionHeading
          eyebrow="What you get"
          title="DashDark-style UI with Fluent micro-motion"
          subtitle="Glass surfaces, sharp spacing, conversion-focused sections, and components you can evolve into a full product."
        />

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            ["CaseFlow-Command", "Structured, compliant case management with real-time insights."],
            ["Automation First", "Pipelines that eliminate friction across ops and reporting."],
            ["Security-Driven", "Audit trails, role separation, and least-privilege defaults."],
            ["Modular by Design", "A clean base that scales from nonprofit to enterprise."]
          ].map(([h, p]) => (
            <GlowCard key={h}>
              <div className="text-lg font-extrabold tracking-tight">{h}</div>
              <div className="mt-2 text-sm text-muted leading-relaxed">{p}</div>
            </GlowCard>
          ))}
        </div>
      </section>

      {/* DASHBOARD */}
      <DashboardSection />

      {/* CTA */}
      <section id="contact" className="mx-auto max-w-container px-7 py-24 text-center">
        <SectionHeading
          eyebrow="Next step"
          title="Build smarter. Operate stronger."
          subtitle="Deploy TOOLS Inc systems in days — not months. Ship workflows with clarity, consistency, and compliance."
        />
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button variant="primary">Request Access</Button>
          <Button variant="ghost">Talk to Us</Button>
        </div>

        <div className="mt-10 text-xs text-muted">
          © {new Date().getFullYear()} TOOLS Inc · Built with purpose
        </div>
      </section>
    </main>
  );
}
