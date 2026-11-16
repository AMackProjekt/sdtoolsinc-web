"use client";

import { useState } from "react";
import { PROGRAM_PHASES, type ProgramPhase } from "@/lib/workshops/program-roadmap";
import { ChevronDown, ClipboardList, Download, GraduationCap } from "lucide-react";

function downloadPlan(phase: ProgramPhase) {
  const lines = [
    "T.O.O.L.S. INC. | DOCUREADY WORK-READINESS PROGRAM",
    phase.label + " — " + phase.subtitle,
    "Participant: _____________________________________",
    "Staff / Mentor (if assigned): _____________________",
    "Review date: _____________________________________",
    "",
    "PHASE OBJECTIVE",
    phase.objective,
    "",
    ...phase.weeks.flatMap(week => [
      week.week + " — " + week.focus,
      ...week.lessons.map(item => "  LEARN: " + item),
      "  ACTION: " + week.assignment,
      "  EVIDENCE: " + week.evidence,
      "  Notes: _________________________________________",
      "",
    ]),
    "STAFF REVIEW",
    ...phase.review.map(item => "[ ] " + item),
    "",
    "Next step: " + phase.nextStep,
    "",
    "This planning worksheet is not proof of enrollment, graduation, placement or credential issuance.",
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "DocuReady_" + phase.id + "_Action_Plan.txt";
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function ProgramRoadmap() {
  const [active, setActive] = useState("days-1-30");
  const [expandedWeeks, setExpandedWeeks] = useState<string[]>([]);
  const toggleWeek = (key: string) => setExpandedWeeks(prev => prev.includes(key) ? prev.filter(x => x !== key) : [...prev, key]);
  const phase = PROGRAM_PHASES.find(p => p.id === active) ?? PROGRAM_PHASES[0];
  return <section className="mt-10 rounded-2xl border border-slate-300 bg-white p-5 text-slate-950 shadow-sm sm:p-7" aria-label="DocuReady extended program roadmap">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="max-w-3xl">
        <p className="text-xs font-extrabold uppercase tracking-widest text-blue-800">Beyond the introduction</p>
        <h3 className="mt-2 flex items-center gap-2 text-2xl font-black"><GraduationCap size={26} className="text-blue-900"/> DocuReady: 30 / 60 / 90 / Completion / Mentorship</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">A structured readiness program with 12 weeks of practical work, individualized reviews, an evidence-based completion decision, and optional mentorship. Completing the four introductory quizzes alone does <strong>not</strong> complete the full program.</p>
      </div>
      <div className="rounded-xl bg-amber-100 px-3 py-2 text-xs font-bold text-amber-950">Proposed curriculum · Staff review required</div>
    </div>
    <div role="tablist" aria-label="Program phases" className="mt-6 flex flex-wrap gap-2">
      {PROGRAM_PHASES.map(item => <button key={item.id} role="tab" type="button" id={"phase-tab-"+item.id} aria-selected={phase.id===item.id} aria-controls="program-phase-panel" onClick={()=>{setActive(item.id);setExpandedWeeks([])}} className={`rounded-xl border px-3 py-3 text-left text-xs font-extrabold transition sm:px-4 sm:text-sm ${phase.id===item.id?"border-slate-950 bg-[#101F34] text-white":"border-slate-300 bg-slate-100 text-slate-800 hover:border-amber-500"}`}>{item.label}</button>)}
    </div>
    <div role="tabpanel" id="program-phase-panel" aria-labelledby={"phase-tab-"+phase.id} className="mt-5 space-y-5">
      <div className="rounded-xl border border-blue-200 bg-[#EDF4FC] p-5">
        <h4 className="text-xl font-extrabold">{phase.label}: {phase.subtitle}</h4>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">{phase.objective}</p>
        <p className="mt-3 text-xs font-bold text-blue-900">Transition: {phase.nextStep}</p>
      </div>
      <div className="space-y-3">{phase.weeks.map(week => {
        const key=phase.id+":"+week.week;
        const isOpen=expandedWeeks.includes(key);
        return <article key={key} className="overflow-hidden rounded-xl border border-slate-200">
          <button type="button" aria-expanded={isOpen} onClick={()=>toggleWeek(key)} className="flex w-full items-center gap-3 bg-white p-4 text-left hover:bg-slate-50">
            <span className="min-w-20 shrink-0 rounded-lg bg-amber-100 px-2 py-2 text-center text-xs font-black text-amber-950">{week.week}</span>
            <span className="flex-1 text-sm font-bold">{week.focus}</span>
            <ChevronDown size={18} className={`shrink-0 transition-transform ${isOpen?"rotate-180":""}`}/>
          </button>
          {isOpen&&<div className="space-y-4 border-t border-slate-200 bg-slate-50 p-4 text-sm">
            <div><h5 className="font-extrabold">Lessons and practice</h5><ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">{week.lessons.map(item=><li key={item}>{item}</li>)}</ul></div>
            <div className="rounded-lg border border-amber-200 bg-white p-3"><h5 className="font-bold text-amber-950">Weekly action assignment</h5><p className="mt-1 text-slate-800">{week.assignment}</p></div>
            <div className="rounded-lg border border-slate-200 bg-white p-3"><h5 className="font-bold">Evidence for staff review</h5><p className="mt-1 text-slate-700">{week.evidence}</p></div>
          </div>}
        </article>;
      })}</div>
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <h5 className="flex items-center gap-2 text-sm font-extrabold text-emerald-950"><ClipboardList size={18}/> Phase review checklist</h5>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-emerald-950">{phase.review.map(item=><li key={item}>{item}</li>)}</ul>
      </div>
      <button type="button" onClick={()=>downloadPlan(phase)} className="inline-flex items-center gap-2 rounded-xl bg-[#101F34] px-5 py-3 text-sm font-bold text-white hover:bg-[#1B385B]"><Download size={17}/> Download {phase.label} action plan</button>
    </div>
    <p className="mt-5 text-xs text-slate-600">Action plans download to your device only. Phase reviews, certificates, mentorship matching, and official progress records require staff verification in the protected program system. Timelines may be adapted for individual circumstances.</p>
  </section>;
}
