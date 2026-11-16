"use client";

import { useEffect, useState } from "react";

const key = "toolsinc_analytics_consent_v1";

export function PrivacyBanner() {
  const [choice, setChoice] = useState<"granted" | "denied" | null>("denied");
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    try {
      const existing = localStorage.getItem(key);
      setChoice(existing === "granted" ? "granted" : existing === "denied" ? "denied" : null);
      setVisible(existing !== "granted" && existing !== "denied");
    } catch { setVisible(true); setChoice(null); }
    setReady(true);
  }, []);
  const save = (value: "granted" | "denied") => {
    try { localStorage.setItem(key, value); } catch {}
    setChoice(value);
    setVisible(false);
    window.dispatchEvent(new Event("toolsinc:analytics-consent"));
  };
  if (!ready) return null;
  return <>
    {visible && <aside aria-label="Analytics privacy preferences" role="dialog" aria-modal="false" className="fixed bottom-3 left-3 right-3 z-[150] mx-auto max-w-2xl rounded-2xl border border-sky-300/30 bg-[#0B172A] p-4 text-slate-100 shadow-2xl sm:p-5">
      <h2 className="text-base font-extrabold text-white">Analytics preferences</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-200">
        We use optional Google Analytics to understand website visits and improve access to services. We do not send client intake details to Google Analytics. You can decline without losing access.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button onClick={()=>save("denied")} className="rounded-lg border border-white/35 px-4 py-2 text-sm font-bold hover:bg-white/10">Decline analytics</button>
        <button onClick={()=>save("granted")} className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-bold text-[#0B172A] hover:bg-amber-300">Allow analytics</button>
        <a href="/privacy-policy" className="px-2 text-xs text-sky-200 underline">Privacy policy</a>
      </div>
    </aside>}
    <button type="button" onClick={()=>setVisible(true)} className="sr-only focus:not-sr-only focus:fixed focus:bottom-20 focus:left-4 focus:z-[160] focus:rounded-md focus:bg-slate-950 focus:p-3 focus:text-white">Change analytics preferences{choice ? ` (currently ${choice})` : ""}</button>
  </>;
}
