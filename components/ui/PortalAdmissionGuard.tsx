"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/hooks/useAuth";

type State = "checking" | "approved" | "blocked";

/**
 * Client-side presentation gate for all portal screens.
 * EVERY protected server/API endpoint must independently enforce role and
 * accepted enrollment. This component is not an authorization boundary.
 */
export function PortalAdmissionGuard({ children }: { children: React.ReactNode }) {
 const path=usePathname();
 const {user,profile,isLoading}=useAuth();
 const [state,setState]=useState<State>("checking");
 const publicRoute=path==="/portal/auth"||path.startsWith("/portal/auth/")||path==="/portal/access";

 useEffect(()=>{
  if(publicRoute)return;
  if(isLoading){setState("checking");return;}
  if(!user){setState("blocked");return;}
  if(profile?.role==="admin"||profile?.role==="case_manager"){setState("approved");return;}
  let cancelled=false;
  setState("checking");
  (async()=>{
   const {data:{session}}=await supabase.auth.getSession();
   if(!session?.access_token)return false;
   const res=await fetch("/api/portal/eligibility",{headers:{Authorization:"Bearer "+session.access_token},cache:"no-store"});
   return res.ok&&(await res.json()).accepted===true;
  })().then(accepted=>{if(!cancelled)setState(accepted?"approved":"blocked")})
    .catch(()=>{if(!cancelled)setState("blocked")});
  return()=>{cancelled=true};
 },[publicRoute,isLoading,user?.id,profile?.role,path]);

 if(publicRoute||state==="approved")return <>{children}</>;
 if(state==="checking")return <main className="flex min-h-screen items-center justify-center bg-[#071425] p-8 text-white" role="status">Verifying authorized program enrollment…</main>;
 return <main className="min-h-screen bg-[#071425] px-5 py-20 text-white">
   <section className="mx-auto max-w-2xl rounded-2xl border border-amber-300/30 bg-white/5 p-8">
    <h1 className="text-3xl font-black">Program acceptance required</h1>
    <p className="mt-4 text-slate-200">Client portals remain closed until T.O.O.L.S. Inc. staff have reviewed and accepted the DocuReady intake. Submission, an access code, or creating an account does not establish approval.</p>
    <div className="mt-6 flex flex-wrap gap-3"><Link href="/#docuready" className="rounded-xl bg-amber-400 px-5 py-3 font-bold text-slate-950">Return to PrePlan & Intake</Link><Link href="/portal/access" className="rounded-xl border border-white/30 px-5 py-3 font-bold">Check acceptance</Link></div>
   </section>
 </main>;
}
