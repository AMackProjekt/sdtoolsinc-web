"use client";

import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, LockKeyhole, RotateCcw } from "lucide-react";
import { toPublicProgress } from "@/lib/docuready/flow";


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
 const saveChecklist=()=>{
  const lines=["T.O.O.L.S. Inc. — DocuReady 72-Hour PrePlan","Track "+track,"",...milestones.map((m,i)=>(done.includes(i)?"[x] ":"[ ] ")+m.name+" — "+m.detail),"","Use the separate Intake Eligibility Form to request program consideration. Your DocuReady selections are not automatically submitted.","Enrollment and portal access require written staff acceptance."];
  const url=URL.createObjectURL(new Blob([lines.join("\n")],{type:"text/plain;charset=utf-8"}));
  const a=document.createElement("a");a.href=url;a.download="DocuReady_72_Hour_Checklist_Track_"+track+".txt";document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 };
 const printChecklist=()=>{
  const win=window.open("","_blank","width=740,height=900");if(!win)return;
  const entries=milestones.map((m,i)=>"<li>"+(done.includes(i)?"&#9745; ":"&#9744; ")+m.name+"</li>").join("");
  win.document.write('<!doctype html><html><head><title>DocuReady 72-Hour Checklist</title><style>body{font:16px Arial;padding:40px;color:#0b172a}li{margin:16px 0}</style></head><body><h1>T.O.O.L.S. Inc. | DocuReady PrePlan</h1><p>Track '+track+'</p><ol>'+entries+'</ol><p>For personal use. Portal access requires staff acceptance.</p></body></html>');
  win.document.close();win.focus();win.print();
 };
 const percent=Math.round(done.length/milestones.length*100);
 const draft=toPublicProgress(track,done);
 return <section id="docuready" className="scroll-mt-20 bg-[#EDF2F7] px-5 py-14 text-[#101F34]">
  <div className="mx-auto max-w-7xl"><span id="first-steps" className="relative -top-20 block h-0" aria-hidden="true"/>
   <span className="rounded-full bg-[#101F34] px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-amber-300">Full-stack .ORG ↔ .COM hub</span>
   <div className="mt-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
    <div><p className="text-xs font-extrabold uppercase tracking-[.14em] text-blue-800">DocuReady — 72-Hour PrePlan</p><h2 className="mt-2 max-w-3xl text-3xl font-black leading-tight md:text-4xl">DocuReady: 72-Hour PrePlan (Track A and Track B)</h2><p className="mt-3 max-w-3xl text-sm text-slate-700">Begin with six essential-service milestones. Track A supports justice-involved individuals and reentry. Track B supports displaced veterans and community members. The separate Intake Eligibility Form is used to request enrollment consideration. Staff review is required.</p></div>
    <a className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-900 hover:border-amber-500" href="https://sdtoolsinc.com"><LockKeyhole size={16}/> Open protected Portals <ArrowRight size={16}/></a>
   </div>
   <div className="mt-7 grid gap-3 rounded-2xl border border-slate-300 bg-white p-3 md:grid-cols-3">
    {[
     {n:1,name:"Krucial 72-Hr Tracker",detail:"Milestones and track selection"},
     {n:2,name:"Intake Eligibility Form",detail:"Separate eligibility application and staff review"},
     {n:3,name:"Client Portal (Workshops & Resume)",detail:"Four workshops and protected client access"}
    ].map(item=><button key={item.n} type="button" onClick={()=>setStage(item.n as 1|2|3)} aria-current={stage===item.n?"step":undefined} className={`rounded-xl px-4 py-3 text-left transition ${stage===item.n?"bg-[#101F34] text-white":"bg-slate-100 hover:bg-slate-200"}`}><span className="block text-sm font-extrabold">{item.n}. {item.name}</span><span className={`mt-1 block text-xs ${stage===item.n?"text-amber-200":"text-slate-600"}`}>{item.detail}</span></button>)}
   </div>
   {stage===1?<div className="mt-6 rounded-2xl border border-slate-300 bg-white p-5 shadow-sm sm:p-7">
    <div className="flex flex-wrap items-center justify-between gap-4"><div><h3 className="text-xl font-extrabold">Krucial 72-Hour Quick Form & Client Milestone Tracker</h3><p className="mt-1 text-sm text-slate-600">Track your progress on this device. No personal identity or health information is collected here.</p></div><span className="font-mono text-sm font-black text-emerald-700">{done.length} / 6 Steps</span></div>
    <div role="progressbar" aria-label="Milestone progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} className="mt-5 h-2.5 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-amber-500 transition-all" style={{width:`${percent}%`}}/></div>
    <fieldset className="mt-5"><legend className="text-sm font-extrabold">Service Track</legend><div className="mt-2 flex flex-wrap gap-2">{(["A","B"] as Track[]).map(t=><label key={t} className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold ${track===t?"border-amber-500 bg-amber-100":"border-slate-300 bg-white"}`}><input type="radio" name="track" value={t} checked={track===t} onChange={()=>setTrack(t)} className="accent-amber-600"/>Track {t} — {t==="A"?"Justice-Involved / Reentry":"Displaced Veterans / Community Support"}</label>)}</div></fieldset>
    <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]"><div className="space-y-2">{milestones.map((m,i)=><button key={m.name} onClick={()=>setActive(i)} aria-pressed={active===i} className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left ${active===i?"border-amber-400 bg-amber-50":"border-slate-200 hover:bg-slate-50"}`}><span className="text-xl">{m.icon}</span><span className="flex-1 text-sm font-bold">Step {i+1}. {m.name}</span>{done.includes(i)?<CheckCircle2 size={20} className="text-emerald-600"/>:<span className="text-xs text-slate-400">View</span>}</button>)}</div><article className="rounded-2xl border border-slate-200 bg-[#F4F7FB] p-5"><p className="text-xs font-bold uppercase tracking-wide text-blue-700">Step {active+1} of 6</p><h4 className="mt-2 text-xl font-extrabold">{milestones[active].icon} {milestones[active].name}</h4><p className="mt-3 text-sm text-slate-700">{milestones[active].detail}</p><ul className="mt-4 space-y-2">{milestones[active].tips.map(t=><li key={t} className="flex gap-2 text-sm text-slate-700"><span aria-hidden="true" className="font-black text-amber-600">•</span>{t}</li>)}</ul><button onClick={()=>toggle(active)} className="mt-6 rounded-xl bg-[#101F34] px-4 py-3 text-sm font-bold text-white hover:bg-[#1D416B]">{done.includes(active)?"Mark as not completed":"Mark this step complete"}</button></article></div>
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5"><div className="flex flex-wrap gap-2"><button type="button" onClick={saveChecklist} className="rounded-lg border border-blue-300 bg-blue-50 px-3 py-2 text-sm font-bold text-blue-900">Save checklist</button><button type="button" onClick={printChecklist} className="rounded-lg border border-blue-300 bg-blue-50 px-3 py-2 text-sm font-bold text-blue-900">Print / Save as PDF</button></div><button onClick={()=>{setDone([]);setActive(0)}} className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-950"><RotateCcw size={15}/> Reset progress</button><button onClick={()=>setStage(2)} className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-extrabold text-[#101F34] hover:bg-amber-300">Next: Intake Eligibility Form <ArrowRight size={17}/></button></div>
   </div>:<div className="mt-6 rounded-2xl border border-slate-300 bg-white p-7">
    <div className="flex items-center gap-3"><LockKeyhole size={28} className="text-blue-800"/><div><h3 className="text-xl font-extrabold">{stage===2?"Intake Eligibility Form — Track "+track+" Review":"Approved Client Portal Access"}</h3><p className="mt-1 text-sm text-slate-600">{stage===2?"The next step is the separate Intake Eligibility Form, followed by staff review. This page does not submit that form.":"After approval, authorized clients can access workshops and resume services."}</p></div></div>
    {stage===2?<div className="mt-5 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-slate-800"><strong>Your privacy and personal information matter.</strong> For your protection, this page does not request your full legal name, date of birth, phone number, correctional or probation records, or confidential case notes. You can choose a program pathway and work through the initial checklist without submitting personal information. Your selections and checklist progress remain on this device and are not submitted through this page. When personal details are needed, you will be directed to a protected enrollment process accessible only to authorized personnel. We are committed to treating your information with respect and confidentiality.</div>:<div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-slate-800">Client workshops, resume tools, and individual access are available only through your organization's approved portal process. No public PIN or access-code bypass is provided.</div>}
    {stage===3 && <div className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-5">
     <p className="text-sm font-extrabold text-amber-950">Client workshops, resume tools, and portal access are restricted until intake acceptance.</p>
     <p className="mt-2 text-sm text-slate-800">Use the separate Intake Eligibility Form for enrollment consideration. Submission creates a pending application, not an approved account. Staff will notify accepted participants how to activate access.</p>
    </div>}
    <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={()=>setStage(2)} className="inline-flex items-center gap-2 rounded-xl bg-[#101F34] px-5 py-3 text-sm font-bold text-white">Return to eligibility overview <ArrowRight size={16}/></button><button onClick={()=>setStage(stage===2?1:2)} className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold">{stage===2?"Back to tracker":"Back to eligibility overview"}</button></div>
   </div>}
   <div aria-live="polite" className="mt-5 rounded-xl border border-slate-300 bg-white/80 p-4 text-xs text-slate-700">
    <strong className="block text-sm text-slate-900">DocuReady progress summary — not submitted</strong>
    <span className="mt-1 block">Selected pathway: {draft.track} · Completed steps: {draft.completedMilestones.length} of 6</span>
    <span className="mt-1 block">DocuReady milestones (not yet transferred to the eligibility form): {draft.completedMilestones.length ? draft.completedMilestones.map(step=>step.replace(/_/g," ").toLowerCase()).join(", ") : "None selected yet"}</span>
    <p className="mt-2 text-slate-600">This preview shows only non-sensitive checklist selections. The separate Intake Eligibility Form collects necessary applicant details in its own secured workflow.</p>
   </div>
   <p className="mt-4 text-xs text-slate-600">This tracker is a planning tool, not proof of enrollment, eligibility, approval, or service delivery. Clear your progress on shared devices. Old referral pages remain available separately but are not part of this homepage flow.</p>
  </div>
 </section>;
}
