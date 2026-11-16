import { MackAiNavigator } from "@/components/ui/MackAiNavigator";
import { ElectrifiedMackProjektFooter } from "@/components/ui/ElectrifiedMackProjektFooter";
import { CardNav, GooeyNav, AnimatedList, FloatingDock } from "@/components/ui/CommunityNavEffects";
import { StabilizationFlow } from "@/components/ui/StabilizationFlow";

const offerings = [
  { label: "Krucial 72-Hour Plan", description: "Six immediate priorities to begin your stabilization journey.", tag: "FIRST STEPS", href: "#first-steps", color: "from-blue-600 to-blue-900" },
  { label: "DocuReady Track A", description: "Support for reentry and justice-involved community members.", tag: "REENTRY", href: "#first-steps", color: "from-amber-600 to-orange-900" },
  { label: "DocuReady Track B", description: "Community support for individuals who need a fresh start.", tag: "COMMUNITY", href: "#first-steps", color: "from-indigo-600 to-violet-900" },
  { label: "Workshops & Resume", description: "Career readiness, communication, digital literacy, and financial basics.", tag: "EDUCATION", href: "https://sdtoolsinc.com", color: "from-emerald-600 to-teal-900" }
];

export default function Page() {
  return <main className="min-h-screen bg-[#060D1A] text-slate-100">
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#060D1A]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-4">
        <a href="/" className="flex items-center gap-3" aria-label="T.O.O.L.S. Inc. home"><img src="/icons/tools-crest.svg" alt="" className="h-12 w-12 rounded-xl border border-amber-400/30" /><span><strong className="block text-lg font-extrabold tracking-tight text-white">T.O.O.L.S. INC.</strong><small className="block text-[10px] font-semibold text-amber-300">Together Overcoming Obstacles &amp; Limitations</small></span></a>
        <div className="flex flex-wrap items-center gap-2">
          <CardNav />
          <GooeyNav />
          <a className="rounded-xl border border-sky-400/50 bg-sky-400/15 px-4 py-2 font-extrabold text-sky-200 hover:bg-sky-400/25" href="https://sdtoolsinc.com">Portals</a>
          <a className="rounded-xl bg-amber-400 px-4 py-2 font-extrabold text-[#060D1A] hover:bg-amber-300" href="#first-steps">Get Started</a>
        </div>
      </div>
    </header>

    <section id="home" className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_75%_20%,rgba(14,165,233,.19),transparent_43%),linear-gradient(120deg,#060D1A,#0B172A,#132440)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-95" style={{backgroundImage:"linear-gradient(90deg,rgba(6,13,26,.68) 0%,rgba(6,13,26,.18) 48%,rgba(6,13,26,.22) 100%),url('https://upload.wikimedia.org/wikipedia/commons/b/bb/San_Diego_skyline_at_dusk_from_Coronado_2015.jpg')"}} />
      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-9 px-5 py-16 lg:grid-cols-12 lg:py-24">
        <div className="space-y-6 rounded-2xl bg-[#071120]/25 p-3 shadow-[0_0_24px_rgba(0,0,0,.10)] lg:col-span-7">
          <p className="inline-flex rounded-full border border-amber-400/30 bg-white/5 px-3 py-2 text-[11px] font-bold uppercase tracking-[.18em] text-amber-300">San Diego · Reentry · Community · Opportunity</p>
          <h1 className="max-w-[750px] text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">Your Past Doesn’t <span className="text-amber-400">Define Your Future.</span></h1>
          <p className="max-w-xl text-base leading-relaxed text-slate-200 sm:text-lg">A second chance is a new beginning. T.O.O.L.S. Inc. supports justice-involved individuals and community members with immediate essentials, access to resources, and pathways to education and employment.</p>
          <div className="flex flex-wrap gap-3"><a className="rounded-xl bg-amber-400 px-6 py-3 font-extrabold text-[#060D1A] hover:bg-amber-300" href="#first-steps">Get Started Today</a><a className="rounded-xl border border-white/25 bg-white/10 px-6 py-3 font-semibold text-white hover:bg-white/20" href="#contact">Contact &amp; Crisis Guide</a></div>
          <p className="text-sm font-medium text-slate-300">Track A: Justice-Involved &amp; Reentry · Track B: Community Services</p>
        </div>
        <div id="mackai" className="lg:col-span-5"><MackAiNavigator /></div>
      </div>
    </section>

    <section aria-label="Primary services" className="relative z-10 border-b border-white/10 bg-[#0B172A] px-5 py-5">
      <div className="mx-auto grid max-w-7xl gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {[
          {icon:"👥",title:"Reentry Support",detail:"Guidance, navigation & case management",href:"#first-steps",tone:"from-[#173D71] to-[#0D233E]"},
          {icon:"💼",title:"Workforce Development",detail:"Training, job readiness & employment preparation",href:"#programs",tone:"from-[#14534D] to-[#0B242D]"},
          {icon:"🏠",title:"Stabilization Resources",detail:"Housing, transportation, ID, and essential services",href:"#first-steps",tone:"from-[#402A76] to-[#1B213E]"},
          {icon:"🤝",title:"Partner With Us",detail:"Employers, organizations & community collaboration",href:"/partnerships",tone:"from-[#754019] to-[#24222B]"},
          {icon:"♡",title:"Support Our Mission",detail:"Donate, volunteer or sponsor a program",href:"#contact",tone:"from-[#742A48] to-[#27182B]"}
        ].map(item=><a href={item.href} key={item.title} className={`group flex min-h-32 items-center gap-3 rounded-xl border border-white/15 bg-gradient-to-br p-4 transition-colors hover:border-amber-300/65 ${item.tone}`}>
          <span aria-hidden="true" className="text-2xl">{item.icon}</span>
          <span className="min-w-0 flex-1"><strong className="block text-sm font-extrabold text-white">{item.title}</strong><span className="mt-1 block text-xs leading-relaxed text-slate-200">{item.detail}</span></span>
          <span aria-hidden="true" className="text-xl text-slate-200">›</span>
        </a>)}
      </div>
    </section>

    <section id="mission" className="border-b border-white/10 bg-[#0B172A] px-5 py-12">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-bold uppercase tracking-[.17em] text-amber-400">Our approach</p>
        <h2 className="mt-2 text-2xl font-extrabold text-white">Empowering Individuals. Unlocking Potential.</h2>
        <p className="mt-3 max-w-4xl text-sm leading-relaxed text-slate-300">T.O.O.L.S. Inc. helps individuals facing barriers access stabilization resources, practical guidance, and opportunities to build confidence and readiness. We serve justice-involved individuals and members of the wider community.</p>
        <div className="mt-6"><AnimatedList /></div>
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
        <p className="mt-4 text-xs leading-relaxed text-slate-400">The new Track A/B pathway starts with the 72-Hour Tracker. Sensitive intake and staff approvals remain in the protected .COM portal; no confidential case data is sent from this homepage.</p>
      </div>
    </section>

    <section id="impact" className="border-t border-white/10 bg-[#081323] px-5 py-14">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-extrabold uppercase tracking-[.18em] text-amber-400">Community progress</p>
        <h2 className="mt-2 text-3xl font-extrabold text-white">📊 Our Impact in San Diego</h2>
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {["Individuals Served","Job Placements","Training Completions","Community Partners"].map(label=><div key={label} className="rounded-2xl border border-white/10 bg-[#132440] p-5 text-center"><div className="text-4xl font-black text-sky-200">—</div><div className="mt-2 text-sm font-bold text-white">{label}</div></div>)}
        </div>
        <p className="mt-4 text-sm text-slate-400">Figures appear after verification. No unverified results are published.</p>
      </div>
    </section>
    <StabilizationFlow />

    <section id="events" className="border-t border-white/10 bg-[#0B172A] px-5 py-14">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-2">
        <article className="rounded-2xl border border-sky-300/15 bg-[#132440] p-6">
          <p className="text-xs font-extrabold uppercase tracking-widest text-sky-300">Community voice</p>
          <h2 className="mt-2 text-2xl font-extrabold text-white">✦ Participant Success Story</h2>
          <h3 className="mt-5 text-xl font-bold text-amber-200">Do you have a success story you'd like to share?</h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-200">Your journey may encourage someone who's just getting started. Whether it's a new job, stable housing, education, recovery, or a personal breakthrough, we'd welcome the chance to hear from you.</p>
          <p className="mt-3 text-xs leading-relaxed text-slate-400">Stories are shared publicly only with permission and appropriate review. Please do not include sensitive personal details in an ordinary email.</p>
          <a href="mailto:info@sdtoolsinc.org?subject=I%27d%20like%20to%20share%20my%20success%20story" className="mt-5 inline-flex rounded-xl border border-amber-400/50 bg-amber-400/10 px-5 py-3 text-sm font-extrabold text-amber-200 hover:bg-amber-400/20">Share your story →</a>
        </article>
        <article className="rounded-2xl border border-amber-400/15 bg-[#132440] p-6">
          <p className="text-xs font-extrabold uppercase tracking-widest text-amber-300">Community calendar</p>
          <h2 className="mt-2 text-2xl font-extrabold text-white">▦ Upcoming Events</h2>
          <div className="mt-5 space-y-3">
            {[{title:"Upcoming community event",detail:"Details to be announced"},{title:"Workforce readiness workshop",detail:"Schedule to be confirmed"}].map(event=><div key={event.title} className="flex items-center gap-4 rounded-xl border border-white/10 bg-[#0B172A] p-4">
              <span className="rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs font-extrabold text-amber-200">TBA</span>
              <div><strong className="block text-sm text-white">{event.title}</strong><span className="mt-1 block text-xs text-slate-400">{event.detail}</span></div>
            </div>)}
          </div>
          <a href="#contact" className="mt-4 inline-block text-sm font-bold text-amber-300 underline-offset-4 hover:underline">Ask about workshops</a>
        </article>
      </div>
    </section>

    <section id="partners" aria-label="Technology partners and BBB standing" className="border-y border-slate-300 bg-[#E5EAF0] px-5 py-7 text-[#0B172A]">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-5 lg:flex-row lg:items-center">
        <div><p className="text-[11px] font-extrabold uppercase tracking-[.14em] text-sky-800">Affiliations &amp; business standing</p><h2 className="mt-1 text-xl font-extrabold">Technology Partners &amp; BBB Standing</h2></div>
        <div className="grid w-full flex-1 gap-3 sm:grid-cols-3 lg:max-w-4xl">
          <div className="flex items-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3">
            <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xl font-black text-blue-600">G</span>
            <div><strong className="block text-sm font-extrabold">Google Cloud Partner Network</strong><p className="text-xs text-slate-600">Cloud &amp; Gemini AI ecosystem</p></div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3">
            <span aria-hidden="true" className="grid h-9 w-9 shrink-0 grid-cols-2 gap-[2px]"><span className="bg-red-500"/><span className="bg-emerald-500"/><span className="bg-blue-500"/><span className="bg-amber-400"/></span>
            <div><strong className="block text-sm font-extrabold">Microsoft</strong><p className="text-xs text-slate-600">Technology Partner</p></div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3">
            <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-950 text-sm font-black text-white">BBB</span>
            <div><strong className="block text-sm font-extrabold">Better Business Bureau</strong><p className="text-xs text-slate-600">BBB Business Standing</p></div>
          </div>
        </div>
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
    <FloatingDock />
  </main>;
}
