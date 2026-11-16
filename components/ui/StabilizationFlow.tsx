"use client";

import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, LockKeyhole, RotateCcw } from "lucide-react";
import { toPublicProgress } from "@/lib/docuready/flow";
import { WorkshopAcademy } from "@/components/ui/WorkshopAcademy";

const milestones = [
 {icon:"🪪",name:"Get Your California ID",detail:"Gather identification documents and check DMV or authorized agency options for available fee reductions.",tips:["Check whether you have an existing state ID","Collect birth certificate or other accepted identity proof","For Track A, ask your authorized reentry professional about supporting documentation"]},
 {icon:"🚊",name:"Get PRONTO Transit Access",detail:"Find a PRONTO vending machine, a participating retailer, or the MTS Transit Store.",tips:["Check current fares and discount eligibility with MTS","Register your card if available","Plan transportation to upcoming appointments"]},
 {icon:"🍎",name:"Apply for Food Assistance",detail:"Review CalFresh eligibility and application options with BenefitsCal or an authorized assistance provider.",tips:["Check whether expedited processing applies","Collect the documents your county requests","Save your application confirmation"]},
 {icon:"📱",name:"Establish Communication",detail:"Check phone service and accessible contact options before arranging appointments.",tips:["Confirm a reliable callback method","Review California LifeLine eligibility","Make a safe contact plan"]},
 {icon:"🏠",name:"Housing & Essentials",detail:"Explore shelter and housing navigation through 2-1-1 San Diego and relevant agencies.",tips:["List immediate housing needs","Contact appropriate resource navigators","Keep the names of agencies you have contacted"]},
 {icon:"💼",name:"Employment & Next Steps",detail:"Prepare for job readiness, resume support, and workshops.",tips:["List skills and job interests","Identify interview or resume preparation needs","Explore accessible training opportunities"]}
];

type Track = "A" | "B";
const storageKey="toolsinc-public-milestones-v1";
export function StabilizationFlow() {
 const [track,setTrack]=useState<Track>("A");
 const [done,setDone]=useState<number[]>([]);
 const [active,setActive]=useState(0);
 const [stage,setStage]=useState<1|2|3>(1);
 const [loaded,setLoaded]=useState(false);
 useEffect(()=>{
  try {const raw=window.localStorage.getItem(storageKey);if(raw){const value=JSON.parse(raw);if(value.track==="A"||value.track==="B")setTrack(value.track);if(Array.isArray(value.done))setDone(value.done.filter((n:unknown): n is number => typeof n === "number" && Number.isInteger(n) && n >= 0 && n < 6));}}catch{}
  setLoaded(true);
 },[]);
 useEffect(()=>{if(!loaded)return;try{window.localStorage.setItem(storageKey,JSON.stringify({track,done}));}catch{}},[done,track,loaded]);
 const toggle=(i:number)=>setDone(curr=>curr.includes(i)?curr.filter(n=>n!==i):[...curr,i]);
 const percent=Math.round(done.length/milestones.length*100);
 const draft=toPublicProgress(track,done);
 return <section id="docuready" className="scroll-mt-20 bg-[#EDF2F7] px-5 py-14 text-[#101F34]">
  <div className="mx-auto max-w-7xl"><span id="first-steps" className="relative -top-20 block h-0" aria-hidden="true"/>
   <span className="rounded-full bg-[#101F34] px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-amber-300">Full-stack .ORG ↔ .COM hub</span>
   <div className="mt-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
    <div><p className="text-xs font-extrabold uppercase tracking-[.14em] text-blue-800">DocuReady PrePlan and Intake</p><h2 className="mt-2 max-w-3xl text-3xl font-black leading-tight md:text-4xl">DocuReady PrePlan and Intake (Track A and Track B)</h2><p className="mt-3 max-w-3xl text-sm text-slate-700">Begin with six essential-service milestones. Track A supports justice-involved individuals and reentry. Track B supports displaced veterans and community members. Protected intake and approval follow when authorized.</p></div>
    <a className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-900 hover:border-amber-500" href="https://sdtoolsinc.com"><LockKeyhole size={16}/> Open protected Portals <ArrowRight size={16}/></a>
   </div>
   <div className="mt-7 grid gap-3 rounded-2xl border border-slate-300 bg-white p-3 md:grid-cols-3">
    {[
     {n:1,name:"Krucial 72-Hr Tracker",detail:"Milestones and track selection"},
     {n:2,name:"DocuReady Intake Review",detail:"Protected submission and staff review"},
     {n:3,name:"Client Portal (Workshops & Resume)",detail:"Four workshops and protected client access"}
    ].map(item=><button key={item.n} type="button" onClick={()=>setStage(item.n as 1|2|3)} aria-current={stage===item.n?"step":undefined} className={`rounded-xl px-4 py-3 text-left transition ${stage===item.n?"bg-[#101F34] text-white":"bg-slate-100 hover:bg-slate-200"}`}><span className="block text-sm font-extrabold">{item.n}. {item.name}</span><span className={`mt-1 block text-xs ${stage===item.n?"text-amber-200":"text-slate-600"}`}>{item.detail}</span></button>)}
   </div>
   {stage===1?<div className="mt-6 rounded-2xl border border-slate-300 bg-white p-5 shadow-sm sm:p-7">
    <div className="flex flex-wrap items-center justify-between gap-4"><div><h3 className="text-xl font-extrabold">Krucial 72-Hour Quick Form & Client Milestone Tracker</h3><p className="mt-1 text-sm text-slate-600">Track your progress on this device. No personal identity or health information is collected here.</p></div><span className="font-mono text-sm font-black text-emerald-700">{done.length} / 6 Steps</span></div>
    <div role="progressbar" aria-label="Milestone progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} className="mt-5 h-2.5 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-amber-500 transition-all" style={{width:`${percent}%`}}/></div>
    <fieldset className="mt-5"><legend className="text-sm font-extrabold">Service Track</legend><div className="mt-2 flex flex-wrap gap-2">{(["A","B"] as Track[]).map(t=><label key={t} className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold ${track===t?"border-amber-500 bg-amber-100":"border-slate-300 bg-white"}`}><input type="radio" name="track" value={t} checked={track===t} onChange={()=>setTrack(t)} className="accent-amber-600"/>Track {t} — {t==="A"?"Justice-Involved / Reentry":"Displaced Veterans / Community Support"}</label>)}</div></fieldset>
    <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]"><div className="space-y-2">{milestones.map((m,i)=><button key={m.name} onClick={()=>setActive(i)} aria-pressed={active===i} className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left ${active===i?"border-amber-400 bg-amber-50":"border-slate-200 hover:bg-slate-50"}`}><span className="text-xl">{m.icon}</span><span className="flex-1 text-sm font-bold">Step {i+1}. {m.name}</span>{done.includes(i)?<CheckCircle2 size={20} className="text-emerald-600"/>:<span className="text-xs text-slate-400">View</span>}</button>)}</div><article className="rounded-2xl border border-slate-200 bg-[#F4F7FB] p-5"><p className="text-xs font-bold uppercase tracking-wide text-blue-700">Step {active+1} of 6</p><h4 className="mt-2 text-xl font-extrabold">{milestones[active].icon} {milestones[active].name}</h4><p className="mt-3 text-sm text-slate-700">{milestones[active].detail}</p><ul className="mt-4 space-y-2">{milestones[active].tips.map(t=><li key={t} className="flex gap-2 text-sm text-slate-700"><span aria-hidden="true" className="font-black text-amber-600">•</span>{t}</li>)}</ul><button onClick={()=>toggle(active)} className="mt-6 rounded-xl bg-[#101F34] px-4 py-3 text-sm font-bold text-white hover:bg-[#1D416B]">{done.includes(active)?"Mark as not completed":"Mark this step complete"}</button></article></div>
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5"><button onClick={()=>{setDone([]);setActive(0)}} className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-950"><RotateCcw size={15}/> Reset progress</button><button onClick={()=>setStage(2)} className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-extrabold text-[#101F34] hover:bg-amber-300">Next: DocuReady Intake <ArrowRight size={17}/></button></div>
   </div>:<div className="mt-6 rounded-2xl border border-slate-300 bg-white p-7">
    <div className="flex items-center gap-3"><LockKeyhole size={28} className="text-blue-800"/><div><h3 className="text-xl font-extrabold">{stage===2?"DocuReady PrePlan and Intake — Track "+track+" Review":"Approved Client Portal Access"}</h3><p className="mt-1 text-sm text-slate-600">{stage===2?"The next step is a secure identity-verified intake and staff approval.":"After approval, authorized clients can access workshops and resume services."}</p></div></div>
    {stage===2?<div className="mt-5 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-slate-800"><strong>Secure integration pending.</strong> The public site will not collect legal names, birth dates, phone numbers, release/DPO records, or private case notes until authenticated intake and protected storage have been verified. Selected track and checklist progress stay on this device only; they are not sent to the .COM API.</div>:<div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-slate-800">Client workshops, resume tools, and individual access are available only through your organization's approved portal process. No public PIN or access-code bypass is provided.</div>}
    {stage===3 && <div className="mt-6 space-y-4">
      <a href="/portal/workshops" className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-extrabold text-white hover:bg-emerald-600"><LockKeyhole size={17}/> Sign in to save official workshop progress <ArrowRight size={16}/></a>
      <WorkshopAcademy mode="public" />
    </div>}
    <div className="mt-5 flex flex-wrap gap-3"><a href="https://sdtoolsinc.com" className="inline-flex items-center gap-2 rounded-xl bg-[#101F34] px-5 py-3 text-sm font-bold text-white">Continue to protected Portals <ArrowRight size={16}/></a><button onClick={()=>setStage(stage===2?1:2)} className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold">{stage===2?"Back to tracker":"Back to intake overview"}</button></div>
   </div>}
   <div aria-live="polite" className="mt-5 rounded-xl border border-slate-300 bg-white/80 p-4 text-xs text-slate-700">
    <strong className="block text-sm text-slate-900">Intake prepopulation preview — not submitted</strong>
    <span className="mt-1 block">Selected pathway: {draft.track} · Completed steps: {draft.completedMilestones.length} of 6</span>
    <span className="mt-1 block">Milestones for the eventual protected intake: {draft.completedMilestones.length ? draft.completedMilestones.map(step=>step.replace(/_/g," ").toLowerCase()).join(", ") : "None selected yet"}</span>
    <p className="mt-2 text-slate-600">This preview shows only non-sensitive checklist selections. Client identity fields will be entered in the authorized secure intake experience.</p>
   </div>
   <p className="mt-4 text-xs text-slate-600">This tracker is a planning tool, not proof of enrollment, eligibility, approval, or service delivery. Clear your progress on shared devices. Old referral pages remain available separately but are not part of this homepage flow.</p>
  </div>
 </section>;
}
