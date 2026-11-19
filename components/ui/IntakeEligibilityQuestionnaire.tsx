"use client";

import { useMemo, useState } from "react";
import type { PublicKrucialProgress } from "@/lib/docuready/flow";
import type { IntakeAcknowledgmentSignature } from "@/components/ui/IntakeTransitionConsent";
import { DOCUREADY_STEPS } from "@/lib/docuready/flow";
import type { IntakeEligibilityAnswers, OptionalAnswer, RequestedService } from "@/lib/intake/assessment";
import { DEMOGRAPHIC_DECLINE, SERVICE_LABELS } from "@/lib/intake/assessment";
import { CompletionProgress } from "@/components/ui/CompletionProgress";

const optionalOptions: {value:OptionalAnswer;label:string}[] = [
  {value:"yes",label:"Yes"},{value:"no",label:"No"},
  {value:"unsure",label:"Not sure"},{value:"prefer_not_to_answer",label:"Prefer not to answer"}
];
const inputClass = "mt-1 w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-800";
const labelClass = "block text-sm font-semibold text-slate-800";
const serviceKeys: RequestedService[] = [
  "identification","transportation","housing","employment","resume","benefits","education","banking","reentry","other"
];
const initial = (progress:PublicKrucialProgress):IntakeEligibilityAnswers=>({
 fullName:"",preferredName:"",email:"",phone:"",city:"",postalCode:"",
 contactPreference:"no_safe_contact",age18OrOlder:"unsure",
 demographics:{raceEthnicity:DEMOGRAPHIC_DECLINE,gender:DEMOGRAPHIC_DECLINE,veteranStatus:"prefer_not_to_answer",language:""},
 situation:{housing:"",employment:"",transportation:"",supportNetwork:"prefer_not_to_answer",financialBarrier:"prefer_not_to_answer"},
 justiceInvolvement:"prefer_not_to_answer",requestedServices:[],immediatePriority:"",additionalContext:"",
 consentToProcessing:false,consentToReferral:false,docuReady:progress
});
function YesNo({value,onChange}:{value:OptionalAnswer;onChange:(value:OptionalAnswer)=>void}){
 return <select className={inputClass} value={value} onChange={e=>onChange(e.target.value as OptionalAnswer)}>
  {optionalOptions.map(option=><option key={option.value} value={option.value}>{option.label}</option>)}
 </select>;
}
export function IntakeEligibilityQuestionnaire({progress,signature}:{progress:PublicKrucialProgress;signature:IntakeAcknowledgmentSignature}){
 const [form,setForm]=useState<IntakeEligibilityAnswers>(()=>({...initial(progress),fullName:signature.fullName}));
 const merged=useMemo(()=>({...form,docuReady:progress}),[form,progress]);
 // Only essential application items count; optional demographics do not reduce completion.
 const requiredFields = [
  Boolean(merged.fullName.trim()),
  Boolean(merged.email.trim() || merged.phone.trim()),
  Boolean(merged.city.trim()),
  merged.age18OrOlder==="yes" || merged.age18OrOlder==="no",
  Boolean(merged.situation.housing),
  Boolean(merged.situation.employment),
  Boolean(merged.situation.transportation),
  merged.requestedServices.length>0,
  Boolean(merged.immediatePriority.trim()),
  merged.consentToProcessing,
 ];
 const answeredCount=requiredFields.filter(Boolean).length;
 const update=(key:keyof IntakeEligibilityAnswers,value:unknown)=>setForm(current=>({...current,[key]:value}));
 const updateSituation=(key:keyof IntakeEligibilityAnswers["situation"],value:string)=>setForm(current=>({...current,situation:{...current.situation,[key]:value}}));
 const updateDemographics=(key:keyof IntakeEligibilityAnswers["demographics"],value:string)=>setForm(current=>({...current,demographics:{...current.demographics,[key]:value}}));
 const serviceToggle=(id:RequestedService)=>setForm(current=>({...current,requestedServices:current.requestedServices.includes(id)?current.requestedServices.filter(x=>x!==id):[...current.requestedServices,id]}));
 return <div className="mt-6 rounded-xl border border-slate-300 bg-white p-5 text-[#101F34] sm:p-7">
  <p className="text-xs font-extrabold uppercase tracking-wider text-blue-800">Separate applicant application · draft UI</p>
  <h4 className="mt-2 text-xl font-black">Intake Eligibility Form</h4>
  <div className="mt-4"><CompletionProgress label="Intake application completion" completed={answeredCount} total={requiredFields.length} note="Calculated from essential answers only. Optional demographics and referral consent are not required. 100% means ready for staff submission review—not submitted or approved."/></div>
  <p className="mt-2 text-sm text-slate-700">Your signed name and earlier 72-Hour Action Plan responses were carried forward. Review and correct any information before completing the remaining eligibility questions. Secure submission is not yet enabled; use only test information.</p>
  <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-slate-900"><strong>Previously completed — no need to start over</strong><p className="mt-1">Service track: {progress.track}</p><p className="mt-1">72-Hour tasks marked complete: {progress.completedMilestones.length} of {DOCUREADY_STEPS.length}</p><p className="mt-1 text-xs text-slate-700">{progress.completedMilestones.length?progress.completedMilestones.map(x=>x.replaceAll("_"," ").toLowerCase()).join(" · "):"No tasks marked complete yet"}</p><p className="mt-2 text-xs text-slate-700">Consent acknowledged by {signature.fullName} on {signature.signedDate}. You can correct your name in the form below. Action-plan progress is not proof of DocuReady status or eligibility.</p></div>
  <fieldset className="mt-6 grid gap-4 md:grid-cols-2">
   <legend className="mb-3 text-base font-extrabold">1. General information</legend>
   {([{key:"fullName",label:"Legal name"},{key:"preferredName",label:"Preferred name (optional)"},{key:"email",label:"Email"},{key:"phone",label:"Phone"},{key:"city",label:"City"},{key:"postalCode",label:"ZIP code"}] as const).map(field=>
    <label key={field.key} className={labelClass}>{field.label}
     <input className={inputClass} autoComplete="off" value={merged[field.key]} onChange={e=>update(field.key,e.target.value)} placeholder={field.label}/>
    </label>)}
   <label className={labelClass}>Safe contact method
    <select className={inputClass} value={merged.contactPreference} onChange={e=>update("contactPreference",e.target.value)}>
      <option value="no_safe_contact">No safe contact method</option><option value="email">Email</option><option value="phone">Phone</option><option value="text">Text</option>
    </select>
   </label>
   <label className={labelClass}>Are you 18 or older?
    <YesNo value={merged.age18OrOlder} onChange={value=>update("age18OrOlder",value)}/>
   </label>
  </fieldset>
  <fieldset className="mt-7 grid gap-4 md:grid-cols-2">
   <legend className="mb-3 text-base font-extrabold">2. Voluntary demographics</legend>
   <label className={labelClass}>Race or ethnicity (optional)
    <select className={inputClass} value={merged.demographics.raceEthnicity} onChange={e=>updateDemographics("raceEthnicity",e.target.value)}>
     {[DEMOGRAPHIC_DECLINE,"Black or African American","Hispanic or Latino","White","Asian","American Indian or Alaska Native","Native Hawaiian or Pacific Islander","Multiracial","Another description"].map(x=><option key={x}>{x}</option>)}
    </select>
   </label>
   <label className={labelClass}>Gender (optional)
    <select className={inputClass} value={merged.demographics.gender} onChange={e=>updateDemographics("gender",e.target.value)}>
     {[DEMOGRAPHIC_DECLINE,"Woman","Man","Nonbinary","Self-describe"].map(x=><option key={x}>{x}</option>)}
    </select>
   </label>
   <label className={labelClass}>Veteran status (optional)
    <YesNo value={merged.demographics.veteranStatus} onChange={value=>updateDemographics("veteranStatus",value)}/>
   </label>
   <label className={labelClass}>Preferred language (optional)
    <input className={inputClass} value={merged.demographics.language} onChange={e=>updateDemographics("language",e.target.value)} placeholder="Language"/>
   </label>
  </fieldset>
  <fieldset className="mt-7 grid gap-4 md:grid-cols-2">
   <legend className="mb-3 text-base font-extrabold">3. Current circumstances</legend>
   <label className={labelClass}>Housing situation
    <select className={inputClass} value={merged.situation.housing} onChange={e=>updateSituation("housing",e.target.value)}>
     <option value="">Select an option</option>
     <option value="stable">Stable housing</option><option value="temporary">Temporary housing</option><option value="sheltered">Shelter</option>
     <option value="unsheltered">Unsheltered</option><option value="other">Other</option><option value="prefer_not_to_answer">Prefer not to answer</option>
    </select>
   </label>
   <label className={labelClass}>Employment situation
    <select className={inputClass} value={merged.situation.employment} onChange={e=>updateSituation("employment",e.target.value)}>
     <option value="">Select an option</option><option value="employed">Employed</option><option value="seeking">Looking for work</option>
     <option value="training">Training or education</option><option value="not_seeking">Not currently seeking</option><option value="prefer_not_to_answer">Prefer not to answer</option>
    </select>
   </label>
   <label className={labelClass}>Transportation access
    <select className={inputClass} value={merged.situation.transportation} onChange={e=>updateSituation("transportation",e.target.value)}>
     <option value="">Select an option</option><option value="available">Reliable access</option><option value="limited">Limited access</option>
     <option value="none">No transportation</option><option value="prefer_not_to_answer">Prefer not to answer</option>
    </select>
   </label>
   <label className={labelClass}>Is financial hardship a barrier to services?
    <YesNo value={merged.situation.financialBarrier} onChange={value=>updateSituation("financialBarrier",value)}/>
   </label>
   <label className={labelClass}>Do you have someone you can rely on for support?
    <YesNo value={merged.situation.supportNetwork} onChange={value=>updateSituation("supportNetwork",value)}/>
   </label>
  </fieldset>
  <fieldset className="mt-7">
   <legend className="mb-3 text-base font-extrabold">4. Special circumstances (optional)</legend>
   <label className={labelClass}>Would justice-system-related circumstances affect how we coordinate services for you?
    <YesNo value={merged.justiceInvolvement} onChange={value=>update("justiceInvolvement",value)}/>
   </label>
   {merged.justiceInvolvement==="yes" && <div className="mt-4 grid gap-4 rounded-xl bg-blue-50 p-4 md:grid-cols-2">
    <label className={labelClass}>Current setting
     <select className={inputClass} value={merged.justiceContext?.setting??""}
      onChange={e=>update("justiceContext",{...merged.justiceContext,setting:e.target.value,needsCoordination:merged.justiceContext?.needsCoordination??"prefer_not_to_answer"})}>
      <option value="">Select an option</option><option value="recently_released">Recently released</option><option value="probation">Probation</option><option value="parole">Parole</option><option value="pretrial">Pretrial or diversion</option><option value="other">Other</option><option value="prefer_not_to_answer">Prefer not to answer</option>
     </select>
    </label>
    <label className={labelClass}>Would help coordinating with a supervising professional be useful?
     <YesNo value={merged.justiceContext?.needsCoordination??"prefer_not_to_answer"} onChange={value=>update("justiceContext",{setting:merged.justiceContext?.setting??"",needsCoordination:value})}/>
    </label>
   </div>}
  </fieldset>
  <fieldset className="mt-7">
   <legend className="mb-3 text-base font-extrabold">5. Services requested</legend>
   <div className="grid gap-2 md:grid-cols-2">{serviceKeys.map(id=><label key={id} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
     <input type="checkbox" checked={merged.requestedServices.includes(id)} onChange={()=>serviceToggle(id)} className="h-4 w-4 accent-blue-800"/>{SERVICE_LABELS[id]}
   </label>)}</div>
   <label className={labelClass+" mt-4"}>Most urgent priority
    <textarea className={inputClass} rows={2} maxLength={500} value={merged.immediatePriority} onChange={e=>update("immediatePriority",e.target.value)} placeholder="What is your first goal?"/>
   </label>
   <label className={labelClass+" mt-4"}>Anything else we should know? (optional)
    <textarea className={inputClass} rows={3} maxLength={1000} value={merged.additionalContext} onChange={e=>update("additionalContext",e.target.value)} placeholder="Only share what is relevant to requesting assistance."/>
   </label>
  </fieldset>
  <fieldset className="mt-7 space-y-3">
   <legend className="mb-3 text-base font-extrabold">6. Notice and consent</legend>
   <label className="flex items-start gap-3 text-sm"><input type="checkbox" checked={merged.consentToProcessing} onChange={e=>update("consentToProcessing",e.target.checked)} className="mt-1 h-4 w-4"/>
    I consent to T.O.O.L.S. Inc. using my application information to review my request for services. Submission does not guarantee acceptance.
   </label>
   <label className="flex items-start gap-3 text-sm"><input type="checkbox" checked={merged.consentToReferral} onChange={e=>update("consentToReferral",e.target.checked)} className="mt-1 h-4 w-4"/>
    I authorize staff to contact me about a possible referral to another provider if the requested services are unavailable (optional).
   </label>
  </fieldset>
  <div className="mt-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950" role="status">
   <strong>Draft interface — submissions disabled.</strong> Secure identity verification, encrypted storage, role-restricted staff review, and acknowledgment delivery must pass integration testing before this form accepts real applications. Entries here are in-memory only and are not saved.
  </div>
  <button disabled type="button" className="mt-4 rounded-xl bg-slate-400 px-5 py-3 text-sm font-bold text-white" title="Protected submission backend not yet verified">Submit for eligibility review (not yet enabled)</button>
 </div>;
}
