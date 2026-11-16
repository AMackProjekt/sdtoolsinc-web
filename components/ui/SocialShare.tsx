"use client";

import { useState } from "react";
import { Share2, Copy, Check, X } from "lucide-react";

const homeUrl = "https://sdtoolsinc.org/";
const message = "T.O.O.L.S. Inc. — essential services, reentry, displaced veterans and community support in San Diego";
const providers = [
  { name: "Facebook", href: "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(homeUrl) },
  { name: "LinkedIn", href: "https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(homeUrl) },
  { name: "X", href: "https://twitter.com/intent/tweet?text=" + encodeURIComponent(message) + "&url=" + encodeURIComponent(homeUrl) },
  { name: "WhatsApp", href: "https://wa.me/?text=" + encodeURIComponent(message + " " + homeUrl) },
  { name: "Email", href: "mailto:?subject=" + encodeURIComponent("T.O.O.L.S. Inc. | San Diego Community Support") + "&body=" + encodeURIComponent(message + "\n" + homeUrl) },
];

export function SocialShare() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const share = () => setOpen(current => !current);
  const shareNative = async () => {
    if (!navigator.share) return;
    try { await navigator.share({ title: "T.O.O.L.S. Inc.", text: message, url: homeUrl }); setOpen(false); }
    catch { /* visitor canceled or platform does not support this share */ }
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(homeUrl); setCopied(true); }
    catch { setCopied(false); }
  };
  return <div className="relative inline-flex items-center">
    <button type="button" onClick={share} aria-label="Share T.O.O.L.S. Inc. on social media" aria-expanded={open} className="inline-flex items-center gap-2 rounded-xl border border-sky-300/40 bg-sky-300/15 px-4 py-2.5 text-sm font-bold text-sky-100 transition hover:bg-sky-300/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300"><Share2 size={17}/> Share</button>
    {open && <div role="group" aria-label="Share this website" className="absolute right-0 top-full z-[90] mt-2 w-56 rounded-xl border border-white/20 bg-[#0B172A] p-2 text-sm shadow-2xl">
      <div className="flex items-center justify-between px-2 py-1"><strong className="text-white">Share our mission</strong><button aria-label="Close share menu" onClick={()=>setOpen(false)} className="rounded p-1 text-slate-200 hover:bg-white/10"><X size={16}/></button></div>
      {providers.map(p=><a key={p.name} href={p.href} target={p.name==="Email"?undefined:"_blank"} rel={p.name==="Email"?undefined:"noopener noreferrer"} onClick={()=>setOpen(false)} className="block rounded-lg px-3 py-2 text-slate-100 hover:bg-white/10">{p.name}</a>)}
      <button type="button" onClick={shareNative} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sky-200 hover:bg-white/10">Share using device</button>
      <button onClick={copy} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-amber-200 hover:bg-white/10">{copied?<Check size={15}/>:<Copy size={15}/>} {copied?"Link copied":"Copy website link"}</button>
    </div>}
  </div>;
}
