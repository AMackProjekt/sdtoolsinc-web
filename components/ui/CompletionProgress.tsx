"use client";

export function CompletionProgress({label,completed,total,note}:{label:string;completed:number;total:number;note?:string}){
 const safeTotal=Math.max(1,total);
 const percent=Math.max(0,Math.min(100,Math.round(completed/safeTotal*100)));
 return <div className="rounded-xl border border-slate-200 bg-white p-4" aria-label={label+" completion"}>
  <div className="flex items-center justify-between gap-3">
   <span className="text-sm font-bold text-slate-900">{label}</span>
   <span className="font-mono text-lg font-extrabold tabular-nums text-blue-900">{percent}%</span>
  </div>
  <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100}
   aria-valuenow={percent} className="mt-2 h-3 overflow-hidden rounded-full bg-slate-200">
   <div className="h-full rounded-full bg-blue-700 transition-[width] duration-200" style={{width:percent+"%"}}/>
  </div>
  {note && <p className="mt-2 text-xs leading-relaxed text-slate-600">{note}</p>}
 </div>;
}
