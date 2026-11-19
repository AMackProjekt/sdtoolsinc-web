"use client";

import { useState } from "react";

const topics = [
  {title:"Identity documents",category:"First steps",summary:"Replacing identification can be an important first step toward employment, housing, and benefits.",action:"California DMV",url:"https://www.dmv.ca.gov/portal/"},
  {title:"Birth certificates",category:"Documents",summary:"Certified vital records may be required to obtain identification or complete an employment document checklist.",action:"California Department of Public Health",url:"https://www.cdph.ca.gov/Programs/CHSI/Pages/Vital-Records.aspx"},
  {title:"Public benefits",category:"Benefits",summary:"California residents can apply for or manage eligible food and other benefits through BenefitsCal.",action:"BenefitsCal",url:"https://benefitscal.com/"},
  {title:"Housing navigation",category:"Stabilization",summary:"Dial 211 to locate local housing-navigation, food, and other resource referrals. Availability varies.",action:"211 San Diego",url:"https://211sandiego.org/"},
  {title:"Job search",category:"Employment",summary:"CalJOBS connects California job seekers to employment listings and workforce tools.",action:"CalJOBS",url:"https://www.caljobs.ca.gov/"},
  {title:"Transit options",category:"Transportation",summary:"San Diego's PRONTO program provides a way to pay fares across participating transit services.",action:"PRONTO",url:"https://www.ridepronto.com/"},
  {title:"Resume readiness",category:"Workforce",summary:"A resume can be built around transferable skills, training, volunteer service, and measurable accomplishments.",action:"Explore our programs",url:"/#programs"},
  {title:"Reentry resources",category:"Community",summary:"People returning to the community may benefit from coordinated help with documents, employment, transportation, and support systems.",action:"Start your plan",url:"/#docuready"},
  {title:"Career development",category:"Education",summary:"Workshops and vocational training can help build job-ready skills. T.O.O.L.S. Inc. portal learning tools are available after enrollment approval.",action:"Portal access",url:"/portal/access"},
] as const;

export function DidYouKnowWidget() {
  const [selected,setSelected]=useState(0);
  const item=topics[selected];
  return <section aria-labelledby="did-you-know-title" className="relative overflow-hidden rounded-3xl border border-amber-300/25 bg-[#0D2036] p-5 text-white shadow-xl sm:p-7">
    <div className="relative z-10">
      <p className="text-xs font-bold uppercase tracking-[.18em] text-amber-300">Interactive community resource guide</p>
      <h2 id="did-you-know-title" className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Did You Know?</h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-200">Explore nine practical topics that may help you take your next step. Select a topic below.</p>
      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3" role="group" aria-label="Choose a resource topic">
        {topics.map((topic,index)=><button key={topic.title} type="button" aria-pressed={selected===index} onClick={()=>setSelected(index)} className={`min-h-14 rounded-xl border px-3 py-3 text-left text-xs font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 sm:text-sm ${selected===index?"border-amber-300 bg-amber-300 text-[#0B172A]":"border-white/20 bg-white/5 text-white hover:border-amber-300/70 hover:bg-white/10"}`}>{topic.title}</button>)}
      </div>
      <article className="mt-5 rounded-2xl border border-white/15 bg-white/[.07] p-5" aria-live="polite">
        <p className="text-xs font-extrabold uppercase tracking-widest text-amber-300">{item.category}</p>
        <h3 className="mt-2 text-xl font-extrabold">{item.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-slate-200">{item.summary}</p>
        <a href={item.url} className="mt-5 inline-flex rounded-xl bg-amber-300 px-4 py-3 text-sm font-extrabold text-[#071425] hover:bg-amber-200">{item.action} <span aria-hidden="true" className="ml-2">↗</span></a>
      </article>
      <p className="mt-4 text-xs leading-relaxed text-slate-400">General education and navigation only. Program access and service eligibility are subject to review and availability.</p>
    </div>
  </section>;
}
