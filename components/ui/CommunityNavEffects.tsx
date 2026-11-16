"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Compass, FileCheck2, Handshake, Home, LayoutGrid, Mail, Phone, Shield, Sparkles, CalendarDays, HeartHandshake, ChartNoAxesColumnIncreasing, X } from "lucide-react";

const navItems = [
  {label:"Home", href:"#home"},
  {label:"72-Hour Plan", href:"#first-steps"},
  {label:"Programs", href:"#programs"},
  {label:"MackAI", href:"#mackai"},
  {label:"Contact", href:"#contact"},
];
const navCards=[
 {heading:"About Us", icon:Compass, links:[{label:"Mission & Vision",href:"#mission"},{label:"Resources",href:"#first-steps"}]},
 {heading:"Programs", icon:FileCheck2, links:[{label:"Krucial 72-Hour Plan",href:"#first-steps"},{label:"DocuReady Track A & B",href:"#programs"},{label:"Workshops & Resume",href:"#programs"}]},
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
 const [selected,setSelected]=useState("Home");
 return <nav aria-label="Section navigation" className="flex flex-wrap items-center gap-1 rounded-full border border-white/10 bg-[#132440]/80 p-1">{navItems.map(item=><a key={item.label} href={item.href} onClick={()=>setSelected(item.label)} className={`relative isolate whitespace-nowrap rounded-full px-3 py-2 text-xs font-bold ${selected===item.label?"text-[#07101d]":"text-slate-200 hover:text-amber-200"}`}>{selected===item.label&&<motion.span layoutId="tools-gooey-nav-blob" className="absolute inset-0 -z-10 rounded-full bg-amber-400" transition={{type:"spring",stiffness:350,damping:26}}/>}{item.label}</a>)}</nav>;
}
const updates=[
 {title:"Stabilization essentials",detail:"Identification, food, communication, and housing guidance",href:"#first-steps"},
 {title:"DocuReady pathways",detail:"Separate Track A reentry and Track B community support",href:"#programs"},
 {title:"Employment preparation",detail:"Workshop information and resume readiness",href:"#programs"},
 {title:"Contact & referrals",detail:"Speak with the T.O.O.L.S. team about support",href:"#contact"},
];
export function AnimatedList(){
 return <div className="grid gap-3 sm:grid-cols-2">{updates.map((item,i)=><motion.a key={item.title} href={item.href} initial={{opacity:0,translateY:20}} whileInView={{opacity:1,translateY:0}} viewport={{once:true,amount:.1}} transition={{duration:.3,delay:i*.09}} className="group flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-amber-300/40 hover:bg-white/10"><span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-400/20 text-amber-200">{i+1}</span><span><strong className="block text-sm text-white">{item.title}</strong><span className="mt-1 block text-xs text-slate-300">{item.detail}</span></span><span className="ml-auto text-amber-300 transition group-hover:translate-x-1">→</span></motion.a>)}</div>;
}
const dock=[{href:"#home",label:"Home",icon:Home},{href:"#first-steps",label:"72-Hour Plan",icon:Shield},{href:"#programs",label:"Programs",icon:LayoutGrid},{href:"#impact",label:"Our Impact",icon:ChartNoAxesColumnIncreasing},{href:"#events",label:"Events",icon:CalendarDays},{href:"#mackai",label:"MackAI",icon:Sparkles},{href:"#contact",label:"Contact",icon:Mail},{href:"/partnerships",label:"Partner",icon:HeartHandshake},{href:"https://sdtoolsinc.com",label:"Portals",icon:Compass}];
export function FloatingDock() {
 const [footerVisible,setFooterVisible]=useState(false);
 useEffect(()=>{
  const footer=document.querySelector(".mack-footer");
  if(!footer)return;
  const observer=new IntersectionObserver(([entry])=>setFooterVisible(entry.isIntersecting),{threshold:0,rootMargin:"0px 0px 95px 0px"});
  observer.observe(footer);
  return ()=>observer.disconnect();
 },[]);
 return <nav aria-label="Floating quick navigation" aria-hidden={footerVisible} className={`pointer-events-none fixed inset-x-0 bottom-3 z-[75] flex justify-center px-2 transition-opacity duration-300 ${footerVisible?"opacity-0 invisible":"opacity-100 visible"}`}>
  <div className="pointer-events-auto flex max-w-full items-center gap-2 overflow-x-auto rounded-2xl border border-white/25 bg-slate-100/10 p-2 shadow-[0_8px_32px_rgba(0,0,0,.12)] backdrop-blur-md supports-[backdrop-filter]:bg-white/10">
   {dock.map(({href,label,icon:Icon})=><motion.a key={label} href={href} title={label} aria-label={label} tabIndex={footerVisible?-1:0} whileHover={{scale:1.12,y:-3}} whileTap={{scale:.95}} className="flex h-14 min-w-12 items-center justify-center rounded-xl border border-white/15 bg-slate-950/25 px-3 text-white drop-shadow-sm transition hover:border-amber-300/60 hover:bg-sky-400/25 hover:text-amber-200"><Icon size={24}/></motion.a>)}
  </div>
 </nav>;
}
