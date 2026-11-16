"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { WorkshopAcademy } from "@/components/ui/WorkshopAcademy";

export default function ClientWorkshopsPage() {
  const router=useRouter();
  const {user,profile,isAuthenticated,isLoading}=useAuth();
  const [completed,setCompleted]=useState<number[]>([]);
  const [loaded,setLoaded]=useState(false);
  const [availability,setAvailability]=useState<"online"|"offline">("offline");

  const request=useCallback(async (method:"GET"|"POST",body?:object) => {
    const {data:{session},error}=await supabase.auth.getSession();
    if(error || !session?.access_token)throw Error("A verified client session is required");
    const res=await fetch("/api/workshops/progress",{
      method,
      headers:{"Authorization":`Bearer ${session.access_token}`,...(body?{"Content-Type":"application/json"}:{})},
      body:body?JSON.stringify(body):undefined,
      cache:"no-store",
    });
    if(!res.ok)throw Error("Workshop cloud sync is unavailable");
    return res.json();
  },[]);

  useEffect(()=>{
    if(!isLoading && !isAuthenticated)router.replace("/portal/auth");
  },[isLoading,isAuthenticated,router]);

  useEffect(()=>{
    if(isLoading || !user || profile?.role!=="client")return;
    let cancelled=false;
    request("GET").then(result=>{
      if(!cancelled){setCompleted(result.completed ?? []);setAvailability("online");setLoaded(true);}
    }).catch(()=>{if(!cancelled){setAvailability("offline");setLoaded(true);}});
    return ()=>{cancelled=true;};
  },[isLoading,user,profile?.role,request]);

  if(isLoading || !user)return <main className="min-h-screen bg-[#060D1A] p-10 text-white">Verifying client access…</main>;
  if(profile?.role!=="client")return <main className="min-h-screen bg-[#060D1A] p-10 text-white"><h1 className="text-2xl font-bold">Client role required</h1><p className="mt-3">Your account is not authorized to use this workshop progress portal.</p><Link href="/portal/portals" className="mt-5 inline-block text-sky-300 underline">Return to portals</Link></main>;
  if(!loaded)return <main className="min-h-screen bg-[#060D1A] p-10 text-white">Loading authorized workshop progress…</main>;

  const save=async (moduleId:number,answers:number[]):Promise<number[]>=>{
    const result=await request("POST",{moduleId,answers});
    if(!result.passed||!Array.isArray(result.completed))throw Error("No confirmed server completion");
    return result.completed;
  };

  return <main className="min-h-screen bg-[#EDF2F7] px-4 py-12 text-[#101F34]">
    <div className="mx-auto max-w-6xl">
      <Link href="/portal/dashboard" className="text-sm font-bold text-blue-800 underline">Back to client dashboard</Link>
      <h1 className="mt-4 text-3xl font-black">DocuReady Client Portal — Work-Readiness Workshops</h1>
      <p className="mt-2 text-sm text-slate-700">Signed in as {user.email}. This page uses verified Supabase authentication, not a browser-stored mock PIN.</p>
      {availability==="offline"&&<div role="alert" className="my-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
        <strong>Google Sheets synchronization is not yet active.</strong> Lessons, worksheets, and practice quizzes remain available, but workshop completions cannot be counted as official records until the secure server integration is activated and verified.
      </div>}
      <div className="mt-6"><WorkshopAcademy key={completed.join("-")} mode="client" initialCompleted={completed} onProgressChange={save}/></div>
    </div>
  </main>;
}
