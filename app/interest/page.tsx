import type { Metadata } from "next";
import { Navbar } from "@/components/ui/Navbar";

const careerForm =
  "https://docs.google.com/forms/d/e/1FAIpQLSfFz2bgW-UJvBTnYtxgVtlQi0AaAZ_mIfD04Uc6YxnNnnLOgQ/viewform";

export const metadata: Metadata = {
  title: "Get Started | T.O.O.L.S. Inc.",
  description: "Choose MasterResumeBuilder V4 career intake or DocuReady stabilization planning with T.O.O.L.S. Inc.",
  alternates: { canonical: "https://sdtoolsinc.org/get-started" }
};

export default function InterestPage() {
  return (
    <main className="min-h-screen bg-[#07101F] text-white">
      <Navbar />
      <section className="relative overflow-hidden px-5 py-16 sm:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_5%,rgba(56,189,248,.17),transparent_48%)]" />
        <div className="relative mx-auto max-w-6xl">
          <p className="text-xs font-extrabold uppercase tracking-[.19em] text-amber-400">Empowering Individuals. Unlocking Potential.</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight sm:text-6xl">Let&apos;s build your next step.</h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-300">
            Choose the pathway that fits your needs. Career and résumé preparation uses MasterResumeBuilder V4 intake;
            stabilization planning starts with the DocuReady 72-Hour PrePlan. You should not have to repeat an unrelated form.
          </p>
          <div className="mt-9 grid gap-5 md:grid-cols-2">
            <article className="rounded-3xl border border-amber-400/50 bg-[#152842] p-6 shadow-xl sm:p-9">
              <span className="text-xs font-black uppercase tracking-widest text-amber-300">Career readiness</span>
              <h2 className="mt-3 text-2xl font-extrabold">MasterResumeBuilder V4</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-200">
                Start a tailored résumé and job-readiness packet using the current T.O.O.L.S. Inc. career intake process.
                Submitted information is handled through the existing internal review workflow.
              </p>
              <ol className="mt-5 list-decimal space-y-2 pl-5 text-sm text-slate-200">
                <li>Provide your work, volunteer, or military experience and job goals.</li>
                <li>The career team reviews generated materials before release.</li>
                <li>Receive appropriate follow-up through approved channels.</li>
              </ol>
              <a href={careerForm} target="_blank" rel="noopener noreferrer"
                className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl bg-amber-400 px-6 py-3 text-sm font-extrabold text-[#07101F] hover:bg-amber-300">
                Start Career Intake →
              </a>
              <p className="mt-3 text-xs text-slate-400">The current Google Form requires sign-in. Do not submit confidential case records or identity documents here.</p>
            </article>
            <article className="rounded-3xl border border-sky-400/40 bg-[#152842] p-6 shadow-xl sm:p-9">
              <span className="text-xs font-black uppercase tracking-widest text-sky-300">Stabilization &amp; reentry</span>
              <h2 className="mt-3 text-2xl font-extrabold">DocuReady: Your First 72 Hours</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-200">
                Build a practical plan for identification, benefits, phone access, transportation, housing, and employment.
                Choose Track A (reentry) or Track B (displaced veterans and community support).
              </p>
              <ol className="mt-5 list-decimal space-y-2 pl-5 text-sm text-slate-200">
                <li>Choose your pathway and review six priorities.</li>
                <li>Save or print the milestone checklist.</li>
                <li>Contact T.O.O.L.S. Inc. for intake and staff follow-up.</li>
              </ol>
              <a href="/#docuready"
                className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl bg-sky-400 px-6 py-3 text-sm font-extrabold text-[#07101F] hover:bg-sky-300">
                Build My Stabilization Plan →
              </a>
              <p className="mt-3 text-xs text-slate-400">This public pre-plan is not a submitted case application. Protected intake and staff approval are separate.</p>
            </article>
          </div>
          <div className="mt-8 rounded-2xl border border-white/15 bg-white/5 p-5 text-sm text-slate-300">
            <strong className="text-white">Need help choosing?</strong>{" "}
            Call <a className="font-bold text-sky-300 underline" href="tel:+16193507638">(619) 350-7638</a>{" "}
            or <a className="font-bold text-sky-300 underline" href="mailto:info@sdtoolsinc.org">email the team</a>.
            For community resources call <a className="font-bold text-sky-300 underline" href="tel:211">2-1-1</a>.
          </div>
        </div>
      </section>
    </main>
  );
}
