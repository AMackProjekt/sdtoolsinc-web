"use client";

import { useEffect, useState } from "react";
import type { PublicKrucialProgress, Milestone } from "@/lib/docuready/flow";
import { DOCUREADY_STEPS } from "@/lib/docuready/flow";

const LABELS: Record<Milestone,string> = {
  CALIFORNIA_ID: "California ID",
  PRONTO_TRANSIT: "PRONTO transit access",
  CALFRESH: "Food assistance / CalFresh",
  COMMUNICATION: "Phone and communications",
  HOUSING: "Housing and essentials",
  EMPLOYMENT: "Employment and next steps",
};

/** Separate eligibility review surface; receives the DocuReady data in React memory.
 * No identity information is collected or stored on the public website.
 * The production submission endpoint must authenticate, authorize and validate
 * before any eligibility application is transmitted.
 */
export function IntakeEligibilityPrefill({ progress }: { progress: PublicKrucialProgress }) {
  const [reviewed, setReviewed] = useState(false);
  const [milestones, setMilestones] = useState<Milestone[]>(progress.completedMilestones);
  // If DocuReady changes, reapply the latest transfer, retaining user control in this form.
  useEffect(() => {
    setMilestones(progress.completedMilestones);
    setReviewed(false);
  }, [progress.track, progress.completedMilestones.join(",")]);

  const toggle = (id:Milestone) => {
    setMilestones(current => current.includes(id) ? current.filter(x => x !== id) : [...current,id]);
    setReviewed(false);
  };
  return (
    <div className="mt-5 rounded-xl border border-blue-300 bg-[#F4F8FC] p-5">
      <p className="text-xs font-extrabold uppercase tracking-widest text-blue-800">Prepopulated from your DocuReady task list</p>
      <h4 className="mt-2 text-lg font-black">Intake Eligibility Form — transferred task information</h4>
      <p className="mt-2 text-sm text-slate-700">Your track and six checklist statuses appear automatically. You can adjust the copied answers here without changing your DocuReady task list. No application has been submitted.</p>
      <div className="mt-4 rounded-lg border border-slate-200 bg-white p-3">
        <span className="block text-xs font-bold uppercase tracking-wide text-slate-600">Service track</span>
        <strong className="mt-1 block text-base text-slate-950">{progress.track}</strong>
      </div>
      <fieldset className="mt-4">
        <legend className="text-sm font-extrabold text-slate-950">DocuReady milestones — review for your eligibility application</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {DOCUREADY_STEPS.map(id => (
            <label key={id} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-800">
              <input type="checkbox" checked={milestones.includes(id)} onChange={() => toggle(id)} className="h-4 w-4 accent-blue-800"/>
              <span>{LABELS[id]}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className="mt-4 flex items-start gap-3 text-sm text-slate-800">
        <input type="checkbox" className="mt-0.5 h-4 w-4 accent-blue-800" checked={reviewed} onChange={e=>setReviewed(e.target.checked)}/>
        I have reviewed the information copied from my DocuReady task list.
      </label>
      <p className="mt-3 text-xs leading-relaxed text-slate-600" role="status">
        {reviewed ? "Review acknowledged. Secure eligibility submission is not yet enabled." :
          "This is a local prepopulation and review step only. No identity details are transmitted or stored."}
      </p>
    </div>
  );
}
