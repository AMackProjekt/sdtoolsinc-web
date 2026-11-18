"use client";

import { useState } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";

/**
 * Pre-intake acknowledgment: no PII stored, no network call, no implied
 * consent to clinical assessment, eligibility decision, or referral.
 * This is distinct from consent to process data at final submission.
 */
export function IntakeTransitionConsent({ onContinue, onBack }: {
  onContinue: () => void;
  onBack: () => void;
}) {
  const [acknowledged, setAcknowledged] = useState(false);
  return (
    <section className="mt-5 rounded-2xl border border-blue-200 bg-[#F4F8FC] p-5 sm:p-7"
      aria-labelledby="intake-consent-title">
      <div className="flex items-center gap-3">
        <ShieldCheck className="shrink-0 text-blue-800" size={28} aria-hidden="true" />
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wider text-blue-800">Before you continue</p>
          <h4 id="intake-consent-title" className="mt-1 text-xl font-black text-slate-950">
            A quick understanding about your intake
          </h4>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-slate-800">
        You have already made progress with DocuReady. We want you to spend less time
        repeating answers and more time getting support.
      </p>
      <ul className="mt-3 list-inside list-disc space-y-2 text-sm leading-relaxed text-slate-800">
        <li>Your DocuReady track and completed tasks will be carried into the separate Intake Eligibility Form where applicable. Please review and correct anything that has changed.</li>
        <li>We ask a few additional questions to understand your needs and determine which T.O.O.L.S. Inc. services may be appropriate.</li>
        <li>Demographic questions are voluntary. You may choose “Prefer not to answer” without losing the ability to apply.</li>
        <li>Some circumstances may prompt additional questions. Share only what is requested, and do not enter private case or medical records into this public page.</li>
        <li>Completing an application does not guarantee acceptance or portal access. Authorized staff review eligibility; if our services are not the right fit, we may offer referral information or a warm handoff with your permission.</li>
        <li>This acknowledgment is not your final consent to submit information. The protected application will provide its own privacy notice and submission consent.</li>
      </ul>
      <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-300 bg-white p-4 text-sm font-medium text-slate-900">
        <input type="checkbox" checked={acknowledged} onChange={e => setAcknowledged(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-blue-800" />
        <span>I understand that DocuReady and the Intake Eligibility Form are separate steps, that my existing task information will be reused where applicable, and that I will review the information before submitting an application.</span>
      </label>
      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" onClick={onContinue} disabled={!acknowledged}
          className="inline-flex items-center gap-2 rounded-xl bg-[#101F34] px-5 py-3 text-sm font-bold text-white hover:bg-[#1D416B] disabled:cursor-not-allowed disabled:opacity-45">
          Continue to eligibility review <ArrowRight size={17} />
        </button>
        <button type="button" onClick={onBack}
          className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-900">
          Back to DocuReady
        </button>
      </div>
    </section>
  );
}
