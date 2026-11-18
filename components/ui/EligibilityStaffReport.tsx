import type { IndividualEligibilityReport } from "@/lib/intake/assessment";
import { NEED_LABELS, SERVICE_LABELS, needsSummary } from "@/lib/intake/assessment";
import { matchServices } from "@/lib/intake/service-matcher";

/**
 * Read-only internal report component.
 * Mount ONLY under an authenticated staff page whose API independently
 * checks signed user identity, role and record authorization.
 * Never render applicant records on public .ORG routes.
 */
export function EligibilityStaffReport({report}:{report:IndividualEligibilityReport}){
 const summary=needsSummary(report);
 const navigation=matchServices(report.application);
 const {application:a,screening:s}=report;
 return <article className="mx-auto max-w-4xl space-y-6 rounded-xl bg-white p-8 text-slate-950 print:max-w-none print:shadow-none">
  <header className="border-b-2 border-slate-900 pb-5">
   <p className="text-xs font-bold uppercase tracking-[.2em] text-blue-900">T.O.O.L.S. Inc. · Confidential staff review</p>
   <h1 className="mt-2 text-2xl font-black">Individual Eligibility & Needs Report</h1>
   <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
    <div><dt className="font-bold">Application reference</dt><dd>{summary.caseReference}</dd></div>
    <div><dt className="font-bold">Received</dt><dd>{summary.dateReceived}</dd></div>
    <div><dt className="font-bold">Staff decision</dt><dd>{summary.decision.replaceAll("_"," ")}</dd></div>
    <div><dt className="font-bold">Service track</dt><dd>{summary.programTrack}</dd></div>
   </dl>
  </header>
  <section>
   <h2 className="border-b pb-2 text-lg font-bold">Applicant overview</h2>
   <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
    <div><dt className="font-semibold">Name</dt><dd>{a.fullName || "Not provided"}</dd></div>
    <div><dt className="font-semibold">Preferred name</dt><dd>{a.preferredName || "Not provided"}</dd></div>
    <div><dt className="font-semibold">Contact</dt><dd>{a.email || a.phone || "Not provided"}</dd></div>
    <div><dt className="font-semibold">Location</dt><dd>{[a.city,a.postalCode].filter(Boolean).join(" ") || "Not provided"}</dd></div>
    <div><dt className="font-semibold">Demographics</dt><dd>Voluntary; see protected applicant record</dd></div>
    <div><dt className="font-semibold">Justice-system coordination</dt><dd>{a.justiceInvolvement.replaceAll("_"," ")}</dd></div>
   </dl>
  </section>
  <section>
   <h2 className="border-b pb-2 text-lg font-bold">Services and stabilization needs</h2>
   <p className="mt-3 text-sm"><strong>Priority:</strong> {a.immediatePriority || "Not specified"}</p>
   <div className="mt-3 grid gap-4 text-sm sm:grid-cols-2">
    <div><h3 className="font-semibold">Services requested</h3><ul className="mt-2 list-inside list-disc">
     {a.requestedServices.length ? a.requestedServices.map(service=><li key={service}>{SERVICE_LABELS[service]}</li>) : <li>Not specified</li>}
    </ul></div>
    <div><h3 className="font-semibold">Current circumstances</h3><p className="mt-2">Housing: {a.situation.housing || "Unanswered"}</p><p>Employment: {a.situation.employment || "Unanswered"}</p><p>Transportation: {a.situation.transportation || "Unanswered"}</p></div>
   </div>
  </section>
  <section>
   <h2 className="border-b pb-2 text-lg font-bold">DocuReady context</h2>
   <p className="mt-3 text-sm">Previously entered DocuReady milestone selections ({summary.completedDocuReadyMilestones.length}):</p>
   <p className="mt-1 text-sm">{summary.completedDocuReadyMilestones.join(", ").replaceAll("_"," ") || "No milestones transferred"}</p>
   <p className="mt-2 text-xs text-slate-600">Self-reported task progress is not independently verified identification or eligibility.</p>
  </section>
  <section className="rounded-xl border border-blue-200 bg-blue-50 p-5">
   <h2 className="text-lg font-bold">Staff-only assessment and service matching</h2>
   <p className="mt-1 text-xs text-slate-700">Adapted RNR-oriented needs domains for service coordination; not an official CJ-TRAK/GAIN clinical assessment or risk score.</p>
   {s ? <>
    <h3 className="mt-4 font-bold">Domains identified</h3>
    <ul className="mt-2 list-inside list-disc text-sm">{s.needDomains.map(domain=><li key={domain}>{NEED_LABELS[domain]}</li>)}</ul>
    <p className="mt-4 text-sm"><strong>Supportive factors:</strong> {s.protectiveSupports.join("; ") || "Not documented"}</p>
    <p className="mt-2 text-sm"><strong>Barriers:</strong> {s.barriers.join("; ") || "Not documented"}</p>
    <p className="mt-2 text-sm"><strong>Staff narrative:</strong> {s.staffNarrative || "Not entered"}</p>
    {s.documentedRiskLevel && s.documentedRiskLevel!=="not_assessed" && <p className="mt-2 text-sm"><strong>Externally documented assessment:</strong> {s.instrumentName||"Instrument unspecified"} · {s.documentedRiskLevel.replaceAll("_"," ")} · {s.assessmentDate||"Date unspecified"}</p>}
   </> : <p className="mt-4 text-sm font-medium">Awaiting authorized staff review. No needs screening or risk estimate has been performed.</p>}
  </section>
  <section className="rounded-xl border border-slate-300 bg-slate-50 p-5">
   <h2 className="text-lg font-bold">T.O.O.L.S. Service Navigation Recommendations</h2>
   <p className="mt-2 text-sm">{navigation.overview}</p>
   {navigation.strengths.length>0 && <p className="mt-3 text-sm"><strong>Reported strengths:</strong> {navigation.strengths.join("; ")}</p>}
   {navigation.barriers.length>0 && <p className="mt-2 text-sm"><strong>Reported barriers:</strong> {navigation.barriers.join("; ")}</p>}
   <div className="mt-4 space-y-3">
    {navigation.matches.map(match=><div key={match.id} className="rounded-lg border border-slate-200 bg-white p-4">
     <div className="flex flex-wrap items-center justify-between gap-2">
      <strong className="text-sm">{match.title}</strong>
      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold uppercase">{match.priority}</span>
     </div>
     <p className="mt-1 text-xs text-slate-700">{match.rationale}</p>
     <ul className="mt-2 list-inside list-disc text-xs text-slate-800">{match.suggestedActions.map(action=><li key={action}>{action}</li>)}</ul>
    </div>)}
   </div>
   <p className="mt-4 text-xs text-slate-600">{navigation.caveat}</p>
  </section>
  <section>
   <h2 className="border-b pb-2 text-lg font-bold">Disposition and next steps</h2>
   <p className="mt-3 text-sm"><strong>Decision:</strong> {summary.decision.replaceAll("_"," ")}</p>
   <p className="mt-2 text-sm"><strong>Reason:</strong> {summary.decisionReason || "Staff review pending"}</p>
   <p className="mt-2 text-sm"><strong>Follow-up:</strong> {s?.followUpDate || "To be scheduled"}</p>
   <p className="mt-2 text-sm"><strong>Warm referral:</strong> {summary.decision==="warm_referral" ? "Coordinate with an appropriate provider according to applicant consent and program policy." : "Not designated"}</p>
  </section>
  <footer className="border-t pt-4 text-xs text-slate-500">Confidential internal document. Do not distribute outside authorized program personnel. This report alone does not establish a diagnosis, recidivism probability, or eligibility.</footer>
 </article>;
}
