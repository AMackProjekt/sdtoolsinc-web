"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function ProgramAccessPage(){
 const [status,setStatus]=useState<"checking"|"approved"|"pending"|"signed_out"|"unavailable">("checking");
 useEffect(()=>{
  let active=true;
  (async()=>{
   const {data:{session}}=await supabase.auth.getSession();
   if(!session?.access_token){if(active)setStatus("signed_out");return;}
   const res=await fetch("/api/portal/eligibility",{cache:"no-store",headers:{Authorization:"Bearer "+session.access_token}});
   const result=await res.json().catch(()=>({accepted:false}));
   if(active)setStatus(res.status>=500?"unavailable":result.accepted===true?"approved":"pending");
  })().catch(()=>{if(active)setStatus("unavailable")});
  return()=>{active=false};
 },[]);
 return <main className="min-h-screen bg-[#071425] px-5 py-20 text-white">
  <section className="mx-auto max-w-2xl rounded-2xl border border-white/15 bg-white/5 p-8 shadow-xl">
   <h1 className="text-3xl font-black">DocuReady — Client Portal Access</h1>
   {status==="checking"?<p className="mt-5 text-slate-200">Checking program acceptance…</p>:status==="unavailable"?<div className="mt-5 space-y-4"><p className="text-rose-200 font-bold">Access verification is temporarily unavailable.</p><p className="text-slate-200">Your account has not been denied. Please try again later or contact program staff.</p><Link href="/portal/auth" className="inline-block rounded-xl border border-white/25 px-5 py-3 font-bold">Return to sign in</Link></div>:status==="signed_out"?<div className="mt-5 space-y-4"><p className="text-amber-200 font-bold">Sign in to check your program access.</p><Link href="/portal/auth" className="inline-block rounded-xl bg-amber-400 px-5 py-3 font-bold text-slate-950">Sign in</Link><p className="text-slate-200">New participants should complete the 72-hour PrePlan and intake first.</p><Link href="/#docuready" className="text-sky-200 underline">Start DocuReady intake</Link></div>:status==="approved"?<div className="mt-5 space-y-4"><p className="text-emerald-200">Staff-accepted enrollment confirmed. Your protected client learning tools are available.</p><Link href="/portal/workshops" className="inline-block rounded-xl bg-amber-400 px-5 py-3 font-bold text-slate-950">Enter approved workshops</Link></div>:<div className="mt-5 space-y-4"><p className="text-amber-200 font-bold">Acceptance required before portal entry.</p><p className="text-slate-200">The 72-hour PrePlan is part of your intake. Save or print it, carry its non-sensitive selections into the intake, and submit your completed application through the authorized secure intake process. A submission or login alone does not grant acceptance.</p><p className="text-slate-200">If you have already submitted, wait for an authorized staff decision. If you were accepted, sign in using the account approved by the program.</p><div className="flex flex-wrap gap-3"><Link href="/#docuready" className="rounded-xl bg-amber-400 px-5 py-3 font-bold text-slate-950">Continue PrePlan & Intake</Link><Link href="/portal/auth" className="rounded-xl border border-white/25 px-5 py-3 font-bold text-white">Accepted? Sign in</Link></div></div>}
  </section>
 </main>;
}
