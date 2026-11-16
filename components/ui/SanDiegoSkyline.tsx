"use client";

import { useEffect, useRef, useState } from "react";
import { CloudSun, MoonStar, Sunrise, Sunset } from "lucide-react";

type Phase = "dawn" | "day" | "golden" | "night";
type Selection = Phase | "auto";
const phases: { id:Phase;label:string; icon:typeof Sunrise;start:string }[] = [
  {id:"dawn",label:"Dawn",icon:Sunrise,start:"5:30 AM–8 AM"},
  {id:"day",label:"Daylight",icon:CloudSun,start:"8 AM–4:30 PM"},
  {id:"golden",label:"Golden hour",icon:Sunset,start:"4:30 PM–7:15 PM"},
  {id:"night",label:"Night lights",icon:MoonStar,start:"7:15 PM–5:30 AM"},
];
const styles:Record<Phase,{filter:string;shade:string;light:number}> = {
  dawn:{filter:"brightness(.94) contrast(1.06) saturate(1.2) hue-rotate(-10deg)",shade:"linear-gradient(90deg,rgba(15,23,42,.78),rgba(49,27,68,.38) 51%,rgba(194,65,12,.17)),linear-gradient(180deg,rgba(251,146,60,.13),rgba(6,13,26,.65))",light:.4},
  day:{filter:"brightness(1.15) contrast(1.04) saturate(1.1)",shade:"linear-gradient(90deg,rgba(6,17,36,.72),rgba(12,36,68,.27) 54%,rgba(2,132,199,.1)),linear-gradient(180deg,rgba(56,189,248,.05),rgba(6,13,26,.58))",light:0},
  golden:{filter:"brightness(1.04) contrast(1.1) saturate(1.35) sepia(.15)",shade:"linear-gradient(90deg,rgba(10,14,28,.78),rgba(67,20,7,.4) 50%,rgba(217,119,6,.22)),linear-gradient(180deg,rgba(245,158,11,.13),rgba(6,13,26,.71))",light:.55},
  night:{filter:"brightness(.66) contrast(1.2) saturate(1.16) hue-rotate(8deg)",shade:"linear-gradient(90deg,rgba(3,7,18,.88),rgba(8,16,36,.64) 54%,rgba(12,26,58,.48)),linear-gradient(180deg,rgba(2,6,23,.34),rgba(3,7,18,.8))",light:1},
};
function sanDiegoPhase():Phase {
  const parts=new Intl.DateTimeFormat("en-US",{timeZone:"America/Los_Angeles",hour:"numeric",minute:"numeric",hour12:false}).formatToParts(new Date());
  const h=Number(parts.find(x=>x.type==="hour")?.value??0)%24+Number(parts.find(x=>x.type==="minute")?.value??0)/60;
  return h>=5.5&&h<8?"dawn":h>=8&&h<16.5?"day":h>=16.5&&h<19.25?"golden":"night";
}
type Star={x:number;y:number;size:number;phase:number};
type WindowLight={x:number;y:number;gold:boolean;priority:number;offset:number};
const buildings=[
  {x:.44,w:.045,top:.34,h:.36,rows:14,cols:4,beacon:false},
  {x:.495,w:.055,top:.26,h:.44,rows:18,cols:5,beacon:true},
  {x:.56,w:.048,top:.31,h:.39,rows:15,cols:4,beacon:false},
  {x:.62,w:.062,top:.22,h:.48,rows:20,cols:6,beacon:true},
  {x:.695,w:.052,top:.29,h:.41,rows:16,cols:5,beacon:false},
  {x:.76,w:.065,top:.25,h:.45,rows:19,cols:6,beacon:true},
  {x:.835,w:.05,top:.33,h:.37,rows:14,cols:4,beacon:false},
  {x:.895,w:.06,top:.28,h:.42,rows:17,cols:5,beacon:false},
];
/** Deterministic visual positions instead of rerendering random dots on every frame. */
const stars:Star[]=Array.from({length:55},(_,i)=>({x:((i*97+17)%199)/199,y:((i*53+23)%103)/260,size:.6+(i%4)*.24,phase:i*.47}));
const windows:WindowLight[]=buildings.flatMap((b,bi)=>Array.from({length:b.rows*b.cols},(_,k)=>{
 const row=Math.floor(k/b.cols),col=k%b.cols;
 return {x:b.x+(col+.65)/(b.cols+.3)*b.w,y:b.top+(row+.6)/(b.rows+.4)*b.h,gold:(k+bi)%4!==0,priority:((k*29+bi*13)%103)/103,offset:k*.71+bi};
}).filter((_,i)=>(i*7+bi*11)%13>3));

function SkylineLights({intensity}:{intensity:number}) {
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const canvas=ref.current;if(!canvas||intensity<=0)return;
  const ctx=canvas.getContext("2d");if(!ctx)return;
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let width=0,height=0,frame=0,last=0,raf=0,visible=true;
  const resize=()=>{
   const box=canvas.getBoundingClientRect();const dpr=Math.min(window.devicePixelRatio||1,2);
   width=box.width;height=box.height;canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
  };
  const render=(time:number)=>{
   raf=0;
   if(!visible)return;
   if(!reduced && time-last<38){raf=requestAnimationFrame(render);return;}
   last=time;frame++;
   ctx.clearRect(0,0,width,height);
   if(intensity>.55){
    for(const star of stars){
     const twinkle=reduced?1:.72+.28*Math.sin(frame*.045+star.phase);
     ctx.fillStyle=`rgba(248,250,252,${((intensity-.55)/.45*twinkle*.7).toFixed(3)})`;
     ctx.beginPath();ctx.arc(star.x*width,star.y*height,star.size,0,Math.PI*2);ctx.fill();
    }
   }
   for(const light of windows){
    const alpha=Math.max(0,Math.min(1,(intensity-(1-light.priority)*.45)*1.8));
    if(alpha<.04)continue;
    const shimmer=reduced?1:.88+.12*Math.sin(frame*.075+light.offset);
    const x=light.x*width,y=light.y*height;
    ctx.fillStyle=light.gold?`rgba(253,224,71,${(alpha*shimmer*.68).toFixed(3)})`:`rgba(125,211,252,${(alpha*shimmer*.63).toFixed(3)})`;
    ctx.fillRect(x,y,2.2,3);
    const mirrorY=height*.75+(height*.7-y)*.4;
    if(mirrorY<height*.97){
     ctx.fillStyle=light.gold?`rgba(250,204,21,${(alpha*.17).toFixed(3)})`:`rgba(56,189,248,${(alpha*.16).toFixed(3)})`;
     ctx.fillRect(x+Math.sin(frame*.035+light.offset)*2,mirrorY,4.5,1);
    }
   }
   const beaconPulse=reduced?.8:.35+.65*Math.pow(Math.max(0,Math.sin(frame*.065)),2);
   for(const b of buildings.filter(b=>b.beacon)){
    const x=(b.x+b.w*.5)*width,y=(b.top-.01)*height;
    const grad=ctx.createRadialGradient(x,y,0,x,y,9);
    grad.addColorStop(0,`rgba(248,113,113,${(intensity*beaconPulse*.8).toFixed(3)})`);
    grad.addColorStop(1,"rgba(248,113,113,0)");
    ctx.fillStyle=grad;ctx.beginPath();ctx.arc(x,y,9,0,Math.PI*2);ctx.fill();
   }
   if(!reduced)raf=requestAnimationFrame(render);
  };
  const observer=new IntersectionObserver(([entry])=>{
   visible=entry.isIntersecting;
   if(visible&&!raf)raf=requestAnimationFrame(render);
   if(!visible&&raf){cancelAnimationFrame(raf);raf=0;}
  });
  const ro=new ResizeObserver(()=>{resize();if(reduced)render(performance.now());});ro.observe(canvas);
  resize();observer.observe(canvas);
  return()=>{observer.disconnect();ro.disconnect();cancelAnimationFrame(raf);};
 },[intensity]);
 return <canvas ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full opacity-80"/>;
}

/** Decorative skyline photography remains separate from the simulated lights. */
export function SanDiegoSkyline() {
 const [selection,setSelection]=useState<Selection>("auto");
 const [clockPhase,setClockPhase]=useState<Phase>("day");
 useEffect(()=>{
  const refresh=()=>setClockPhase(sanDiegoPhase());
  refresh();
  const interval=window.setInterval(refresh,60_000);
  return()=>window.clearInterval(interval);
 },[]);
 const phase=selection==="auto"?clockPhase:selection;
 const config=styles[phase];
 return <>
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-cover bg-center transition-[filter] duration-[2400ms] motion-reduce:transition-none" style={{
   backgroundImage:"url('https://upload.wikimedia.org/wikipedia/commons/b/bb/San_Diego_skyline_at_dusk_from_Coronado_2015.jpg')",
   backgroundPosition:"center 42%",filter:config.filter
  }}/>
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 transition-[background] duration-[2400ms] motion-reduce:transition-none" style={{background:config.shade}}/>
  <SkylineLights intensity={config.light}/>
  <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-transparent via-transparent to-[#060D1A]/35" aria-hidden="true"/>
  <div className="pointer-events-none absolute inset-x-0 top-3 z-[3] flex justify-center px-4 sm:justify-end sm:pr-8">
   <div className="pointer-events-auto flex max-w-full flex-wrap items-center gap-1 rounded-xl border border-white/25 bg-[#071120]/80 px-2 py-1.5 text-xs font-semibold text-white shadow-lg backdrop-blur-md" aria-label="San Diego skyline preview controls">
    <span className="mr-1 hidden text-slate-200 sm:inline">San Diego: {phases.find(p=>p.id===phase)?.label}</span>
    <button type="button" onClick={()=>setSelection("auto")} aria-pressed={selection==="auto"} className={`rounded-md px-2 py-1.5 transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300 ${selection==="auto"?"bg-amber-400 text-[#071120]":"text-slate-100"}`}>Auto</button>
    {phases.map(p=><button key={p.id} type="button" onClick={()=>setSelection(p.id)} aria-label={`Preview San Diego ${p.label} (${p.start})`} aria-pressed={selection===p.id} title={`${p.label}: ${p.start} Pacific`} className={`rounded-md p-1.5 transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300 ${selection===p.id?"bg-amber-400 text-[#071120]":"text-slate-100"}`}><p.icon size={16}/></button>)}
   </div>
  </div>
 </>;
}
