"use client";

import { useState } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";

/**
 * Versioned pre-intake notice and acknowledgment. This is an in-memory navigation
 * gate, NOT a durable legal consent record or consent to submit personal information.
 * A separate, secure, auditable final-submission consent is required.
 */
export const INTAKE_TRANSITION_NOTICE_VERSION = "2026-11-18-v2";

export function IntakeTransitionConsent({ onContinue, onBack }: {
  onContinue: () => void;
  onBack: () => void;
}) {
  const [understood, setUnderstood] = useState(false);
  const [accurate, setAccurate] = useState(false);
  return (
    <section className="mt-5 rounded-2xl border border-blue-200 bg-[#F4F8FC] p-5 sm:p-7"
      aria-labelledby="intake-consent-title">
      <div className="flex items-center gap-3">
        <ShieldCheck className="shrink-0 text-blue-800" size={28} aria-hidden="true" />
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wider text-blue-800">T.O.O.L.S. Inc. · Before you continue</p>
          <h4 id="intake-consent-title" className="mt-1 text-xl font-black text-slate-950">
            Intake Eligibility — Consent & Understanding
          </h4>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-slate-800">
        You have already taken steps with DocuReady. We want your next step to be clear, respectful,
        and as simple as possible. Please read this notice before continuing to the separate Intake Eligibility Form.
      </p>
      <div className="mt-5 space-y-4 text-sm leading-relaxed text-slate-800">
        <div>
          <h5 className="font-extrabold text-slate-950">1. Why we ask</h5>
          <p>T.O.O.L.S. Inc. asks for basic contact information, current circumstances, the services you need,
            and information needed to review eligibility. Some questions appear only when relevant to your situation.
            Please provide accurate information to the best of your knowledge.</p>
        </div>
        <div>
          <h5 className="font-extrabold text-slate-950">2. Your DocuReady information</h5>
          <p>Relevant answers you have already entered, such as your service track and completed tasks,
            will be carried forward where available. You can review and correct them before submitting.
            This step does not automatically submit DocuReady information or a new application.</p>
        </div>
        <div>
          <h5 className="font-extrabold text-slate-950">3. Your choice to answer</h5>
          <p>Demographic questions are voluntary, including questions about race or ethnicity and gender.
            You may select “Prefer not to answer” without losing the ability to apply. Some information
            is necessary to contact you or determine eligibility; staff may request clarification later.</p>
        </div>
        <div>
          <h5 className="font-extrabold text-slate-950">4. Sensitive or special circumstances</h5>
          <p>Justice involvement and other circumstances may affect service coordination.
            Answer only what is requested. Do not provide medical records, detailed offense narratives,
            Social Security numbers, or other highly sensitive documents in this public step.
            Any additional screening should be explained and handled separately by authorized personnel.</p>
        </div>
        <div>
          <h5 className="font-extrabold text-slate-950">5. How information is used</h5>
          <p>If you decide to submit the eventual protected form, authorized program personnel will use
            the information to review your request, identify appropriate services, contact you using your
            chosen safe method, and coordinate next steps. We do not promise acceptance or immediate services.
            This public acknowledgment is not authorization to send sensitive information or share it with outside organizations.</p>
        </div>
        <div>
          <h5 className="font-extrabold text-slate-950">6. Eligibility decisions and referrals</h5>
          <p>Application submission does not enroll you or open a client portal. Staff determine eligibility
            after reviewing the information provided. If T.O.O.L.S. Inc. cannot meet your needs, we may
            suggest another resource. Any warm handoff involving your personal details requires separate permission.</p>
        </div>
        <div>
          <h5 className="font-extrabold text-slate-950">7. Privacy, questions, and stopping</h5>
          <p>You may return to DocuReady instead of continuing. Before final submission you should be given
            the applicable privacy and record-retention notice, a chance to review your answers, and a separate
            submission consent. Questions about this process can be directed to{" "}
            <a className="font-bold text-blue-900 underline" href="mailto:info@sdtoolsinc.org">info@sdtoolsinc.org</a>.
            This page does not save a signed consent record or submit an eligibility application.</p>
        </div>
      </div>
      <fieldset className="mt-5 space-y-3 rounded-xl border border-slate-300 bg-white p-4">
        <legend className="px-1 text-sm font-extrabold text-slate-950">My acknowledgments</legend>
        <label className="flex cursor-pointer items-start gap-3 text-sm font-medium text-slate-900">
          <input type="checkbox" checked={understood} onChange={e=>setUnderstood(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-blue-800" />
          <span>I have read and understand the information above, including that applying does not guarantee acceptance and that demographic questions are voluntary.</span>
        </label>
        <label className="flex cursor-pointer items-start gap-3 text-sm font-medium text-slate-900">
          <input type="checkbox" checked={accurate} onChange={e=>setAccurate(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-blue-800" />
          <span>I understand that relevant DocuReady answers will be prefilled where available, and I will have the opportunity to review or correct them.</span>
        </label>
      </fieldset>
      <p className="mt-3 text-xs text-slate-600">This acknowledgment only allows you to continue. Your decision about submitting the actual application and any optional referrals will be requested separately.</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" onClick={onContinue} disabled={!understood || !accurate}
          className="inline-flex items-center gap-2 rounded-xl bg-[#101F34] px-5 py-3 text-sm font-bold text-white hover:bg-[#1D416B] disabled:cursor-not-allowed disabled:opacity-45">
          Continue to eligibility review <ArrowRight size={17} />
        </button>
        <button type="button" onClick={onBack}
          className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-900">
          Back to DocuReady
        </button>
      </div>
      <p className="mt-4 text-[11px] text-slate-500">Notice version {INTAKE_TRANSITION_NOTICE_VERSION}</p>
    </section>
  );
}
