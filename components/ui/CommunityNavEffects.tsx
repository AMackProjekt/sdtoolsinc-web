"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlassSurface from "@/components/ui/ReactBitsGlassSurface";
import ReactBitsGooeyNav from "@/components/ui/ReactBitsGooeyNav";
import { ChevronDown, Compass, FileCheck2, Handshake, Home, LayoutGrid, Mail, Phone, Shield, Sparkles, CalendarDays, HeartHandshake, ChartNoAxesColumnIncreasing, X } from "lucide-react";

const navItems = [
  {label:"Home", href:"#home"},
  {label:"DocuReady", href:"#docuready"},
  {label:"Programs", href:"#programs"},
  {label:"MackAI", href:"#mackai"},
  {label:"Contact", href:"#contact"},
];
const navCards=[
 {heading:"About Us", icon:Compass, links:[{label:"Mission & Vision",href:"#mission"},{label:"Resources",href:"#first-steps"}]},
 {heading:"Programs", icon:FileCheck2, links:[{label:"DocuReady PrePlan and Intake",href:"#docuready"},{label:"Track A / Track B",href:"#docuready"},{label:"Workshops & Resume",href:"#programs"}]},
 {heading:"Connect", icon:Handshake, links:[{label:"Partners",href:"/partnerships"},{label:"Contact",href:"#contact"},{label:"Portals",href:"https://sdtoolsinc.com"}]},
];
export function CardNav() {
 const [open,setOpen]=useState(false);
 return <div className="relative z-[90]">
  <button aria-expanded={open} aria-controls="tools-cards" type="button" onClick={()=>setOpen(v=>!v)} className="inline-flex items-center gap-2 rounded-xl border border-amber-400/60 bg-[#132440] px-4 py-3 text-sm font-extrabold text-amber-200 hover:bg-[#1d355c]"><LayoutGrid size={16}/> Explore <ChevronDown size={14} className={open?"rotate-180 transition":"transition"}/></button>
  <AnimatePresence>{open&&<motion.div id="tools-cards" initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}} className="absolute left-0 top-full z-[80] mt-3 w-[min(90vw,730px)] rounded-2xl border border-sky-300/20 bg-[#091427] p-5 shadow-2xl">
   <button onClick={()=>setOpen(false)} aria-label="Close menu" className="absolute right-3 top-3 p-2 text-slate-300"><X size={17}/></button>
   <div className="grid gap-3 pt-4 sm:grid-cols-3">{navCards.map(({heading,icon:Icon,links})=><div key={heading} className="rounded-xl border border-white/10 bg-[#132440] p-4"><Icon size={21} className="mb-3 text-amber-300"/><h3 className="mb-3 font-bold text-white">{heading}</h3><div className="flex flex-col gap-2">{links.map(link=><a onClick={()=>setOpen(false)} href={link.href} key={link.label} className="text-xs leading-relaxed text-slate-300 hover:text-amber-300">{link.label} →</a>)}</div></div>)}</div>
  </motion.div>}</AnimatePresence>
 </div>;
}
export function GooeyNav() {
 return <div aria-label="Section navigation" className="max-w-full overflow-x-auto rounded-full [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
  <ReactBitsGooeyNav items={navItems} initialActiveIndex={0} theme="dark" color="#FBBF24" activeTextColor="#07101d" size="sm" frame animationTime={470} particleCount={12} gooeyness={1} hoverEffect />
 </div>;
}
const updates=[
 {title:"Stabilization essentials",detail:"Identification, food, communication, and housing guidance",href:"#first-steps"},
 {title:"DocuReady PrePlan and Intake",detail:"Track A reentry and Track B community support",href:"#docuready"},
 {title:"Employment preparation",detail:"Workshop information and resume readiness",href:"#programs"},
 {title:"Contact & referrals",detail:"Speak with the T.O.O.L.S. team about support",href:"#contact"},
];
export function AnimatedList(){
 return <div className="grid gap-3 sm:grid-cols-2">{updates.map((item,i)=><motion.a key={item.title} href={item.href} initial={{opacity:0,translateY:20}} whileInView={{opacity:1,translateY:0}} viewport={{once:true,amount:.1}} transition={{duration:.3,delay:i*.09}} className="group flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-amber-300/40 hover:bg-white/10"><span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-400/20 text-amber-200">{i+1}</span><span><strong className="block text-sm text-white">{item.title}</strong><span className="mt-1 block text-xs text-slate-300">{item.detail}</span></span><span className="ml-auto text-amber-300 transition group-hover:translate-x-1">→</span></motion.a>)}</div>;
}
const dock=[{href:"#home",label:"Home",icon:Home},{href:"#docuready",label:"DocuReady",icon:FileCheck2},{href:"#programs",label:"Programs",icon:LayoutGrid},{href:"#impact",label:"Our Impact",icon:ChartNoAxesColumnIncreasing},{href:"#events",label:"Events",icon:CalendarDays},{href:"#mackai",label:"MackAI",icon:Sparkles},{href:"#contact",label:"Contact",icon:Mail},{href:"/partnerships",label:"Partner",icon:HeartHandshake},{href:"https://sdtoolsinc.com",label:"Portals",icon:Compass}];
export function FloatingDock() {
 const [lift,setLift]=useState(12);
 useEffect(()=>{
  const footer=document.querySelector<HTMLElement>(".mack-footer");
  if(!footer)return;
  let raf=0;
  const update=()=>{
   cancelAnimationFrame(raf);
   raf=requestAnimationFrame(()=>{
    const rect=footer.getBoundingClientRect();
    // Keep the dock above the footer instead of hiding it.
    const overlap=Math.max(0,window.innerHeight-rect.top);
    setLift(Math.max(12,Math.round(overlap+12)));
   });
  };
  window.addEventListener("scroll",update,{passive:true});
  window.addEventListener("resize",update);
  update();
  return ()=>{cancelAnimationFrame(raf);window.removeEventListener("scroll",update);window.removeEventListener("resize",update);};
 },[]);
 return <nav aria-label="Floating quick navigation" className="pointer-events-none fixed inset-x-0 z-[75] flex justify-center px-2 transition-[bottom] duration-150 ease-out" style={{bottom:lift}}>
  <div className="pointer-events-auto w-[min(600px,calc(100vw-16px))]">
   <GlassSurface width="100%" height={64} borderRadius={22} borderWidth={0.06} brightness={58} opacity={0.86} blur={12} displace={0.3} backgroundOpacity={0.12} saturation={1.3} distortionScale={-90} redOffset={2} greenOffset={6} blueOffset={12} refraction renderer="auto" mixBlendMode="normal" className="border border-white/25 shadow-[0_12px_32px_rgba(0,0,0,.24)]">
    <div className="flex w-full min-w-0 items-center gap-1 overflow-x-auto overscroll-x-contain px-1 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:justify-center sm:gap-2">
     {dock.map(({href,label,icon:Icon})=><motion.a key={label} href={href} title={label} aria-label={label} whileHover={{scale:1.12,y:-3}} whileTap={{scale:.95}} className="flex h-11 min-w-11 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-slate-950/50 px-2.5 text-white transition hover:border-amber-300/60 hover:bg-sky-400/30 hover:text-amber-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-200"><Icon size={21}/></motion.a>)}
    </div>
   </GlassSurface>
  </div>
 </nav>;
}
