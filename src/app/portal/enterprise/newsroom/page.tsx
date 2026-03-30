import Link from "next/link";
import { ExternalLink, Megaphone, ScrollText, ShieldCheck, Sparkles } from "lucide-react";

const ASSETS = [
  { title: "Boilerplate", body: "Approved organization summary for press releases, grant announcements, and partner launch pages." },
  { title: "Brand Marks", body: "Primary, monochrome, and social-safe logo treatments for newsroom and campaign usage." },
  { title: "Spokesperson Notes", body: "Key talking points for executive, HR, and program leadership interviews." },
];

const CHANNELS = [
  "Press release launch checklist",
  "Social pack for LinkedIn, Google Workspace Spaces, and Teams channels",
  "Media inquiry routing and escalation",
  "Partner announcement and case-study approval flow",
];

export default function NewsroomPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-sky-50 via-white to-violet-50 p-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-sky-700">
            <Megaphone className="h-3.5 w-3.5" /> News & Media Kit
          </div>
          <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900">External messaging, press assets, and launch readiness in one governed newsroom.</h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            This suite gives leadership and communications teams a central place for approved messaging, media assets, launch checklists, and cross-functional campaign coordination.
          </p>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700"><ScrollText className="h-4 w-4 text-sky-600" /> Media Kit Contents</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {ASSETS.map((asset) => (
              <div key={asset.title} className="rounded-2xl border border-slate-100 p-4">
                <p className="text-sm font-semibold text-slate-800">{asset.title}</p>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">{asset.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700"><Sparkles className="h-4 w-4 text-sky-600" /> Launch Workflow</h2>
          <ul className="mt-5 space-y-3 text-sm text-slate-600">
            {CHANNELS.map((item) => (
              <li key={item} className="rounded-xl bg-slate-50 px-4 py-3">{item}</li>
            ))}
          </ul>
        </section>
      </div>

      <section className="grid gap-4 lg:grid-cols-3">
        <Link href="/portal/enterprise/executive" className="rounded-2xl border border-slate-200 bg-white p-5 hover:bg-slate-50">
          <p className="text-sm font-semibold text-slate-800">Executive approvals</p>
          <p className="mt-2 text-xs text-slate-500">Route board-facing announcements and strategic narratives through executive review.</p>
        </Link>
        <Link href="/portal/enterprise/hr" className="rounded-2xl border border-slate-200 bg-white p-5 hover:bg-slate-50">
          <p className="text-sm font-semibold text-slate-800">Employer brand</p>
          <p className="mt-2 text-xs text-slate-500">Coordinate hiring campaigns and employer brand assets with the HR suite.</p>
        </Link>
        <a href="https://workspace.google.com/" target="_blank" rel="noopener noreferrer" className="rounded-2xl border border-slate-200 bg-white p-5 hover:bg-slate-50">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800">Workspace publishing <ExternalLink className="h-4 w-4 text-sky-600" /></p>
          <p className="mt-2 text-xs text-slate-500">Launch supporting assets across Google Workspace and connected collaboration surfaces.</p>
        </a>
      </section>

      <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5 text-sm text-sky-800 inline-flex items-start gap-3">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
        Approved messaging belongs here so external communications stay aligned with compliance, leadership, and tenant identity.
      </div>
    </div>
  );
}