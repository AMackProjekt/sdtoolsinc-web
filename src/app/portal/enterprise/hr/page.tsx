import Link from "next/link";
import { ArrowRight, BadgeCheck, Briefcase, FileCheck2, ShieldCheck, Users } from "lucide-react";

const HR_LANES = [
  {
    title: "Lifecycle Operations",
    items: ["Offer and onboarding packets", "Provisioning across Google Workspace and Microsoft 365", "Role-based portal access and 2FA readiness"],
  },
  {
    title: "Policy & Compliance",
    items: ["Handbook acknowledgements", "Training completion tracking", "Background check and document retention checkpoints"],
  },
  {
    title: "Workforce Planning",
    items: ["Open roles and succession coverage", "Manager spans and team ratios", "Shift and caseload alignment with hiring plans"],
  },
];

export default function HROperationsPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-amber-50 via-white to-rose-50 p-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-amber-700">
            <Briefcase className="h-3.5 w-3.5" /> HR Operations
          </div>
          <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900">People operations with governed identity, training, and policy workflows.</h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            The HR suite centralizes hiring readiness, onboarding, acknowledgements, training completion, and workforce planning with the same controls used across the rest of the platform.
          </p>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700"><Users className="h-4 w-4 text-amber-600" /> HR Workflow Lanes</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {HR_LANES.map((lane) => (
              <div key={lane.title} className="rounded-2xl border border-slate-100 p-4">
                <p className="text-sm font-semibold text-slate-800">{lane.title}</p>
                <ul className="mt-3 space-y-2 text-xs text-slate-500">
                  {lane.items.map((item) => (
                    <li key={item} className="rounded-lg bg-slate-50 px-3 py-2">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700"><FileCheck2 className="h-4 w-4 text-amber-600" /> HR Quick Actions</h2>
            <div className="mt-4 grid gap-3">
              <Link href="/portal/admin/personnel" className="rounded-xl border border-slate-100 p-4 hover:bg-slate-50">
                <p className="text-sm font-semibold text-slate-800">Personnel Directory</p>
                <p className="mt-1 text-xs text-slate-500">Review active staff, schedules, and staffing coverage.</p>
              </Link>
              <Link href="/portal/admin/trainings" className="rounded-xl border border-slate-100 p-4 hover:bg-slate-50">
                <p className="text-sm font-semibold text-slate-800">Training Log</p>
                <p className="mt-1 text-xs text-slate-500">Track course completion, certifications, and readiness gaps.</p>
              </Link>
              <Link href="/portal/enterprise/identity" className="rounded-xl border border-slate-100 p-4 hover:bg-slate-50">
                <p className="text-sm font-semibold text-slate-800">Identity & Access</p>
                <p className="mt-1 text-xs text-slate-500">Validate domain-scoped access and session policy before provisioning.</p>
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800"><BadgeCheck className="h-4 w-4" /> Compliance signal</p>
            <p className="mt-3 text-sm leading-relaxed text-emerald-700">
              HR readiness depends on onboarding acknowledgements, required training completion, secure identity provisioning, and enforced second-factor access.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-800">People ops aligned <ArrowRight className="h-4 w-4" /></div>
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700"><ShieldCheck className="h-4 w-4 text-amber-600" /> HR Governance Notes</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3 text-sm text-slate-600">
          <div className="rounded-xl bg-slate-50 p-4">Provision accounts only after approvals and domain validation complete.</div>
          <div className="rounded-xl bg-slate-50 p-4">Retain personnel records according to enterprise retention policy and audit requirements.</div>
          <div className="rounded-xl bg-slate-50 p-4">Use this suite to coordinate HR, admin, and compliance rather than duplicating workflows across tools.</div>
        </div>
      </section>
    </div>
  );
}