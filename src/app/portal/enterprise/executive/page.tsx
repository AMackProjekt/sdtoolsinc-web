import Link from "next/link";
import { ArrowRight, Building2, CalendarDays, ShieldCheck, TrendingUp } from "lucide-react";

const SCORECARDS = [
  { label: "Portfolio Health", value: "92%", note: "Programs on-track across housing, retention, and audit readiness." },
  { label: "Exec Actions", value: "14", note: "Open approvals spanning finance, policy, and strategic initiatives." },
  { label: "Cross-Suite Readiness", value: "Green", note: "Google Workspace, Microsoft 365, and service delivery controls aligned." },
];

const CADENCE = [
  "Board packet prep with KPI narrative and variance flags",
  "Weekly portfolio review with admin, HR, and compliance owners",
  "Strategic initiative tracker covering grants, partnerships, and facilities",
  "Executive briefing room linking enterprise operations to field performance",
];

export default function ExecutivePortalPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-900 p-8 text-white">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-700/50 bg-cyan-500/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-cyan-300">
              <Building2 className="h-3.5 w-3.5" /> Executive Command
            </div>
            <h1 className="mt-5 text-3xl font-black tracking-tight">Leadership oversight with Google Workspace and Microsoft 365 context built in.</h1>
            <p className="mt-4 text-sm leading-relaxed text-slate-300">
              This suite is the boardroom view of CaseFlow: portfolio performance, enterprise risk, approval cadence, and strategic execution across every managed portal.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:w-[480px]">
            {SCORECARDS.map((card) => (
              <div key={card.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-300">{card.label}</p>
                <p className="mt-3 text-2xl font-black">{card.value}</p>
                <p className="mt-2 text-xs leading-relaxed text-slate-300">{card.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700"><TrendingUp className="h-4 w-4 text-cyan-600" /> Executive Operating Cadence</h2>
          <div className="mt-5 grid gap-3">
            {CADENCE.map((item) => (
              <div key={item} className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">{item}</div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700"><ShieldCheck className="h-4 w-4 text-cyan-600" /> Decision Surfaces</h2>
            <div className="mt-4 grid gap-3">
              <Link href="/portal/enterprise/audit" className="rounded-xl border border-slate-100 p-4 hover:bg-slate-50">
                <p className="text-sm font-semibold text-slate-800">Audit & Governance</p>
                <p className="mt-1 text-xs text-slate-500">Review compliance posture, transport security, and enforcement status.</p>
              </Link>
              <Link href="/portal/enterprise/integrations" className="rounded-xl border border-slate-100 p-4 hover:bg-slate-50">
                <p className="text-sm font-semibold text-slate-800">Workspace Integrations</p>
                <p className="mt-1 text-xs text-slate-500">Track Google Workspace Admin, Microsoft 365, email, and realtime service readiness.</p>
              </Link>
              <Link href="/portal/admin" className="rounded-xl border border-slate-100 p-4 hover:bg-slate-50">
                <p className="text-sm font-semibold text-slate-800">Operational Admin Portal</p>
                <p className="mt-1 text-xs text-slate-500">Drop directly into caseload, compliance, and personnel oversight.</p>
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-300">Board Packet Mode</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              Use this suite to synthesize KPIs, governance posture, workforce readiness, and communications launch state into one executive brief.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300">
              Ready for briefing <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700"><CalendarDays className="h-4 w-4 text-cyan-600" /> Leadership Calendar</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">Monday: executive standup with operations, HR, and compliance owners.</div>
          <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">Wednesday: grant, revenue, and partnership review with enterprise stakeholders.</div>
          <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">Friday: board narrative, risk register, and media readiness alignment.</div>
        </div>
      </section>
    </div>
  );
}