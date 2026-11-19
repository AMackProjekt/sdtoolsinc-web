import type { Metadata } from "next";
import { RECEIPT_MESSAGE_TEXT } from "@/lib/intake/submission-receipt";

export const metadata: Metadata = {
  title: "Intake/Eligibility Receipt | T.O.O.L.S. Inc.",
  description: "T.O.O.L.S. Inc. intake receipt information and next steps.",
  robots: { index: false, follow: false },
};

export default function IntakeReceivedPage() {
  return (
    <main className="min-h-screen bg-[#EDF2F7] px-4 py-12 text-[#101F34] sm:py-20">
      <article className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
        <header className="bg-[#101F34] px-6 py-9 text-center text-white">
          <img
            src="/logos/tools-inc-crown-official.svg"
            alt="T.O.O.L.S. Inc. official logo"
            width={108}
            height={112}
            className="mx-auto h-28 w-auto object-contain"
          />
          <p className="mt-4 text-xl font-extrabold tracking-wide">T.O.O.L.S. Inc.</p>
          <p className="mt-1 text-sm text-slate-200">Empowering Individuals. Unlocking Potential.</p>
        </header>
        <div className="space-y-5 px-6 py-8 sm:px-10 sm:py-10">
          <p className="text-xs font-extrabold uppercase tracking-wider text-blue-800">Application confirmation information</p>
          <h1 className="text-2xl font-black leading-tight sm:text-3xl">Intake/Eligibility Form Received</h1>
          <p className="text-sm leading-relaxed text-slate-700">{RECEIPT_MESSAGE_TEXT}</p>
          <section aria-label="Emergency and mental health crisis support" className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-slate-900">
            <h2 className="font-extrabold">Emergency and Mental Health Crisis Support</h2>
            <p className="mt-2">If you have an immediate emergency, please <a className="font-bold underline" href="tel:911">call 911</a>.</p>
            <p className="mt-2">If this is a mental health crisis in San Diego County, <a className="font-bold underline" href="tel:988">call or text 988</a> or call the San Diego Access and Crisis Line at <a className="font-bold underline" href="tel:18887247240">1-888-724-7240</a>. Ask about a Mobile Crisis Response Team (MCRT), if appropriate.</p>
            <p className="mt-2">For an emergency requiring the Psychiatric Emergency Response Team (PERT), call <a className="font-bold underline" href="tel:911">911</a> and request PERT.</p>
          </section>
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm leading-relaxed text-blue-950">
            <strong>Important:</strong> Your Intake/Eligibility Form has been received.
            This acknowledgment is issued after successful, secure submission. Our Intake/Eligibility Review Board
            will review your application and contact you regarding next steps within the stated review window.
            Receipt of an application does not mean that it has been reviewed or approved.
            A separate official decision notice is sent after the Board reaches a final decision.
          </div>
          <p className="text-xs text-slate-600">Please do not send sensitive personal or case information in a regular email or text message.</p>
          <a href="/" className="inline-flex rounded-xl bg-[#101F34] px-5 py-3 text-sm font-bold text-white hover:bg-[#1D416B]">
            Visit T.O.O.L.S. Inc.
          </a>
        </div>
      </article>
    </main>
  );
}
