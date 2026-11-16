import { MackAiNavigator } from "@/components/ui/MackAiNavigator";
import { ElectrifiedMackProjektFooter } from "@/components/ui/ElectrifiedMackProjektFooter";
import { Topography, SplitFlap, FallingText } from "@/components/ui/ReactBitsEffects";

const steps = [
  { icon: "▣", label: "California identification", detail: "Start a DMV ID application and ask an eligible service provider about no-fee or reduced-fee options." },
  { icon: "◈", label: "Food & essentials", detail: "Apply for CalFresh. Ask whether you qualify for expedited processing." },
  { icon: "◉", label: "Phone & communication", detail: "Explore California LifeLine and accessible communication options." },
  { icon: "⌁", label: "Transportation", detail: "Get a PRONTO transit card and identify routes to appointments." },
  { icon: "⌂", label: "Housing & stability", detail: "Contact 2-1-1 San Diego for shelter referrals and basic-needs resources." },
  { icon: "↗", label: "Work & opportunity", detail: "Build a resume, explore fair-chance employers and attend readiness workshops." }
];
const offerings = [
  { label: "Krucial 72-Hour Plan", description: "Six immediate priorities to begin your stabilization journey.", tag: "FIRST STEPS", href: "#first-steps", color: "from-blue-600 to-blue-900" },
  { label: "DocuReady Track A", description: "Support for reentry and justice-involved community members.", tag: "REENTRY", href: "/referral", color: "from-amber-600 to-orange-900" },
  { label: "DocuReady Track B", description: "Community support for individuals who need a fresh start.", tag: "COMMUNITY", href: "/interest", color: "from-indigo-600 to-violet-900" },
  { label: "Workshops & Resume", description: "Career readiness, communication, digital literacy, and financial basics.", tag: "EDUCATION", href: "/interest", color: "from-emerald-600 to-teal-900" }
];

export default function Page() {
  return <main className="min-h-screen bg-[#060D1A] text-slate-100">
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#060D1A]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-4">
        <a href="/" className="flex items-center gap-3" aria-label="T.O.O.L.S. Inc. home"><img src="/icons/tools-crest.svg" alt="" className="h-12 w-12 rounded-xl border border-amber-400/30" /><span><strong className="block text-lg font-extrabold tracking-tight text-white">T.O.O.L.S. INC.</strong><small className="block text-[10px] font-semibold text-amber-300">Together Overcoming Obstacles &amp; Limitations</small></span></a>
        <nav aria-label="Primary" className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-200 sm:text-sm">
          <a className="hover:text-amber-300" href="#first-steps">72-Hour Plan</a>
          <a className="hover:text-amber-300" href="#programs">Programs</a>
          <a className="hover:text-amber-300" href="#mackai">MackAI</a>
          <a className="hover:text-amber-300" href="#contact">Contact</a>
          <a className="rounded-xl border border-sky-400/50 bg-sky-400/15 px-4 py-2 font-extrabold text-sky-200 hover:bg-sky-400/25" href="https://sdtoolsinc.com">Portals</a><a className="rounded-xl bg-amber-400 px-4 py-2 font-extrabold text-[#060D1A] hover:bg-amber-300" href="/interest">Get Started</a>
        </nav>
      </div>
    </header>

    <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_75%_20%,rgba(14,165,233,.19),transparent_43%),linear-gradient(120deg,#060D1A,#0B172A,#132440)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-30" style={{backgroundImage:"linear-gradient(90deg,#060D1A 4%,rgba(6,13,26,.55) 65%,#060D1A),url('/images/san-diego-skyline.jpg')"}} />
      <Topography className="opacity-55 mix-blend-screen" />
      <div className="mx-auto grid max-w-7xl items-center gap-9 px-5 py-16 lg:grid-cols-12 lg:py-24">
        <div className="space-y-6 lg:col-span-7">
          <p className="inline-flex rounded-full border border-amber-400/30 bg-white/5 px-3 py-2 text-[11px] font-bold uppercase tracking-[.18em] text-amber-300">San Diego · Reentry · Community · Opportunity</p>
          <h1 className="max-w-[750px] text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">Your Past Doesn’t <span className="text-amber-400">Define Your Future.</span></h1>
          <p className="max-w-xl text-base leading-relaxed text-slate-200 sm:text-lg">A second chance is a new beginning. T.O.O.L.S. Inc. supports justice-involved individuals and community members with immediate essentials, access to resources, and pathways to education and employment.</p>
          <div className="flex flex-wrap gap-3"><a className="rounded-xl bg-amber-400 px-6 py-3 font-extrabold text-[#060D1A] hover:bg-amber-300" href="/interest">Get Started Today</a><a className="rounded-xl border border-white/25 bg-white/10 px-6 py-3 font-semibold text-white hover:bg-white/20" href="#contact">Contact &amp; Crisis Guide</a></div>
          <p className="text-sm font-medium text-slate-300">Track A: Justice-Involved &amp; Reentry · Track B: Community Services</p>
          <div className="flex flex-wrap items-center gap-4 pt-2"><span className="text-[11px] font-extrabold uppercase tracking-[.16em] text-sky-200">Building</span><SplitFlap /></div>
        </div>
        <div className="lg:col-span-5"><MackAiNavigator /></div>
      </div>
    </section>

    <section aria-label="Interactive message" className="relative overflow-hidden border-b border-sky-500/10 bg-[#060D1A] px-5 py-5">
      <div className="relative mx-auto max-w-7xl">
        <p className="text-center text-[10px] font-bold uppercase tracking-widest text-sky-300/75">Interact with the words</p>
        <div style={{ height: "150px", position: "relative" }}>
          <FallingText text="Some sentences are built to last. This one falls apart on contact." highlightWords={["falls", "apart"]} trigger="hover" fontSize="clamp(1rem, 2.4vw, 2rem)" gravity={1} restoreDelay={2} />
        </div>
      </div>
    </section>

    <section id="programs" className="bg-[#0B172A] px-5 py-14">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-extrabold uppercase tracking-[.2em] text-amber-400">Stabilization &amp; opportunity</p>
        <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">Start where you are. Move forward with support.</h2>
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {offerings.map(item => <a href={item.href} key={item.label} className={`group flex min-h-52 flex-col rounded-2xl border border-white/15 bg-gradient-to-br ${item.color} p-5 transition hover:-translate-y-1 hover:border-amber-300/70`}>
            <span className="text-[11px] font-extrabold tracking-[.15em] text-white/75">{item.tag}</span>
            <strong className="mt-6 text-lg font-extrabold text-white">{item.label}</strong>
            <span className="mt-2 text-sm leading-relaxed text-white/85">{item.description}</span>
            <span className="mt-auto pt-4 text-sm font-bold text-white">Explore →</span>
          </a>)}
        </div>
        <p className="mt-4 text-xs leading-relaxed text-slate-400">DocuReady intake is currently routed to existing T.O.O.L.S. Inc. forms. Secure cloud intake, approvals, and client records are not enabled on this public homepage.</p>
      </div>
    </section>

    <section id="first-steps" className="bg-[#F1F5F9] px-5 py-16 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-extrabold uppercase tracking-[.18em] text-blue-800">Krucial 72-Hour Stabilization Plan</p>
        <h2 className="mt-3 text-3xl font-extrabold text-[#0B172A] sm:text-4xl">Six first steps toward stability</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">Use this checklist to identify your next actions. A T.O.O.L.S. advocate can help you navigate eligibility and referrals. Information and availability vary.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step,i) => <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" key={step.label}>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#132440] text-xl font-bold text-amber-300">{step.icon}</span>
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-sky-700">Step {i+1}</p>
            <h3 className="mt-1 text-lg font-extrabold text-[#0B172A]">{step.label}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.detail}</p>
          </article>)}
        </div>
        <div className="mt-7 flex flex-wrap gap-3"><a className="rounded-xl bg-[#0B172A] px-6 py-3 text-sm font-bold text-white hover:bg-[#132440]" href="/interest">Request Help With Your Plan</a><a className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-800 hover:bg-slate-50" href="/referral">Submit Referral</a></div>
      </div>
    </section>

    <section id="contact" className="bg-[#060D1A] px-5 py-16">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-extrabold uppercase tracking-[.18em] text-amber-400">Who to call and when</p>
        <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">Direct program support and 24/7 resources</h2>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-amber-400/40 bg-[#132440] p-6"><p className="text-xs font-bold uppercase text-amber-300">T.O.O.L.S. Inc. Program &amp; Intake</p><a className="mt-4 block text-2xl font-extrabold text-white" href="tel:16193507638">(619) 350-7638</a><p className="mt-2 text-sm text-slate-300">Monday–Friday, 9 a.m.–5 p.m. · Program referrals and community partnerships</p></article>
          <article className="rounded-2xl border border-sky-400/40 bg-[#132440] p-6"><p className="text-xs font-bold uppercase text-sky-300">Shelter, food &amp; resources</p><a className="mt-4 block text-2xl font-extrabold text-white" href="tel:211">Dial 2-1-1</a><p className="mt-2 text-sm text-slate-300">Independent San Diego resource navigation · Available 24/7</p></article>
          <article className="rounded-2xl border border-rose-400/40 bg-[#132440] p-6"><p className="text-xs font-bold uppercase text-rose-300">Mental health crisis support</p><a className="mt-4 block text-2xl font-extrabold text-white" href="tel:988">Call or text 9-8-8</a><p className="mt-2 text-sm text-slate-300">Confidential crisis support · Available 24/7. For immediate danger, call 9-1-1.</p></article>
        </div>
        <div className="mt-8 flex flex-wrap gap-4 text-sm"><a className="text-sky-300 underline" href="/partnerships">Partnerships</a><a className="text-sky-300 underline" href="mailto:info@sdtoolsinc.org">info@sdtoolsinc.org</a><a className="text-sky-300 underline" href="https://sdtoolsinc.com">Portals</a></div>
      </div>
    </section>
    <ElectrifiedMackProjektFooter />
  </main>;
}
