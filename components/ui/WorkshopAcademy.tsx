"use client";

import { useMemo, useState } from "react";
import { WORKSHOP_MODULES, type WorkshopModule } from "@/lib/workshops/modules";
import { ArrowRight, CheckCircle2, Download, LockKeyhole, PlayCircle, RefreshCw } from "lucide-react";

type Panel = "lesson" | "quiz" | null;
type QuizResult = { answers:number[]; score:number };
type CloudStatus = "idle" | "saving" | "saved" | "error";

function worksheetDownload(module: WorkshopModule) {
  const header = `T.O.O.L.S. INC. WORK-READINESS ACADEMY
Date: ${new Date().toLocaleDateString()}

`;
  const blob = new Blob([header + module.worksheetContent], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `TOOLS_Inc_Module_0${module.num}_Worksheet.txt`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

type Props = {
  /** Public mode: interactive practice is allowed but nothing is sent to cloud. */
  mode?: "public" | "client";
  /** Server-authenticated client save adapter; never pass a raw access code here. */
  onProgressChange?: (moduleId: number, answers: number[]) => Promise<number[]>;
  initialCompleted?: number[];
};

export function WorkshopAcademy({ mode = "public", onProgressChange, initialCompleted = [] }: Props) {
  const [completed, setCompleted] = useState<number[]>(initialCompleted.filter(n => n >= 1 && n <= 4));
  const [panels, setPanels] = useState<Record<number, Panel>>({});
  const [chapters, setChapters] = useState<Record<number, number>>({});
  const [answers, setAnswers] = useState<Record<number, Record<number, number>>>({});
  const [results, setResults] = useState<Record<number, QuizResult>>({});
  const [sync, setSync] = useState<CloudStatus>("idle");
  const [syncMessage, setSyncMessage] = useState("");
  const count = useMemo(() => new Set(completed).size, [completed]);

  async function passModule(id: number, quizAnswers: number[]) {
    const next = [...new Set([...completed, id])].sort();
    setCompleted(next);
    if (mode !== "client" || !onProgressChange) {
      setSync("idle");
      setSyncMessage(mode === "public"
        ? "Practice completed on this page only. Sign in to the authorized client portal for a persistent completion record."
        : "Cloud progress sync is not configured yet. No completion record has been saved.");
      return;
    }
    setSync("saving");
    setSyncMessage("Saving signed-in workshop progress…");
    try {
      const confirmed = await onProgressChange(id, quizAnswers);
      setCompleted(confirmed);
      setSync("saved");
      setSyncMessage("Workshop progress saved to your authorized client record.");
    } catch {
      setSync("error");
      setSyncMessage("Cloud save failed. Your result is visible here, but it is not recorded in Google Sheets. Contact program staff.");
    }
  }

  function grade(module: WorkshopModule) {
    const selected = answers[module.num] ?? {};
    if (Object.keys(selected).length !== module.quiz.length) {
      setSyncMessage("Answer all three questions before submitting your quiz.");
      return;
    }
    const score = module.quiz.reduce((total, question, index) => total + (selected[index] === question.answer ? 1 : 0), 0);
    const chosen = module.quiz.map((_, index) => selected[index]);
    setResults(previous => ({ ...previous, [module.num]: { answers: chosen, score } }));
    if (score === module.quiz.length) void passModule(module.num, chosen);
  }

  return <section aria-label="Online Work-Readiness Workshops" className="space-y-5">
    <header className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-widest text-blue-800">T.O.O.L.S. Inc. Work-Readiness Academy</p>
        <h3 className="mt-2 text-xl font-extrabold text-slate-950">Four interactive workshop modules</h3>
        <p className="mt-2 max-w-3xl text-sm text-slate-700">Open a chapter-based lesson, download its action worksheet, and score 3/3 on the completion quiz. These are interactive text lessons; recorded video media have not yet been supplied.</p>
      </div>
      <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-extrabold text-slate-900" aria-live="polite">{count} / 4 completed</div>
    </header>
    {mode === "public" && <div className="flex gap-2 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-950"><LockKeyhole className="shrink-0" size={19}/><p><strong>Public learning preview.</strong> Quiz results stay in this browser session only; this page does not enroll anyone or write to Google Sheets. Only authenticated, approved clients can save official workshop progress in the protected portal.</p></div>}
    {WORKSHOP_MODULES.map(module => {
      const panel = panels[module.num] ?? null;
      const chapterIndex = chapters[module.num] ?? 0;
      const chapter = module.videoChapters[chapterIndex];
      const result = results[module.num];
      const isComplete = completed.includes(module.num);
      const selected = answers[module.num] ?? {};
      return <article key={module.num} className="overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-950">
        <div className="flex flex-wrap items-center justify-between gap-3 p-5">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-800">Module {String(module.num).padStart(2,"0")} · {module.duration}</p>
            <h4 className="mt-1 text-lg font-extrabold">{module.title}</h4>
            <p className="mt-1 text-sm text-slate-600">{module.subtitle}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {isComplete && <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-100 px-2.5 py-2 text-xs font-bold text-emerald-900"><CheckCircle2 size={16}/> Quiz passed</span>}
            <button type="button" onClick={() => setPanels(p => ({...p,[module.num]:p[module.num]==="lesson"?null:"lesson"}))} aria-expanded={panel==="lesson"} className="inline-flex items-center gap-1 rounded-lg bg-blue-100 px-3 py-2 text-xs font-bold text-blue-950 hover:bg-blue-200"><PlayCircle size={16}/> Lesson</button>
            <button type="button" onClick={()=>worksheetDownload(module)} className="inline-flex items-center gap-1 rounded-lg bg-amber-100 px-3 py-2 text-xs font-bold text-amber-950 hover:bg-amber-200"><Download size={16}/> Worksheet</button>
            <button type="button" onClick={()=>setPanels(p=>({...p,[module.num]:p[module.num]==="quiz"?null:"quiz"}))} aria-expanded={panel==="quiz"} className="rounded-lg bg-indigo-100 px-3 py-2 text-xs font-bold text-indigo-950 hover:bg-indigo-200">Quiz</button>
          </div>
        </div>
        {panel==="lesson" && <div className="space-y-4 border-t border-slate-700 bg-[#0B172A] p-5 text-white">
          <div className="flex flex-wrap items-center justify-between gap-3"><span className="text-xs font-bold uppercase tracking-wider text-sky-300">Interactive lesson · Chapter {chapterIndex+1} of {module.videoChapters.length}</span><span className="font-mono text-xs text-amber-300">{chapter.time}</span></div>
          <div className="min-h-24 rounded-xl border border-white/15 bg-white/5 p-5"><h5 className="font-extrabold">{chapter.heading}</h5><p className="mt-2 text-sm leading-relaxed text-slate-200">{chapter.body}</p></div>
          <div className="h-2 overflow-hidden rounded-full bg-white/15" role="progressbar" aria-label="Lesson chapter progress" aria-valuenow={chapterIndex+1} aria-valuemin={0} aria-valuemax={module.videoChapters.length}><div className="h-full rounded-full bg-amber-400" style={{width:`${((chapterIndex+1)/module.videoChapters.length)*100}%`}}/></div>
          <div className="flex flex-wrap gap-2">{module.videoChapters.map((part,index)=><button type="button" key={part.time} onClick={()=>setChapters(c=>({...c,[module.num]:index}))} aria-current={index===chapterIndex?"step":undefined} className={`rounded-lg border px-3 py-2 text-xs font-semibold ${index===chapterIndex?"border-amber-300 bg-amber-400 text-slate-950":"border-white/20 bg-white/10 text-white hover:bg-white/20"}`}>Part {index+1}</button>)}</div>
          <div className="flex flex-wrap gap-2"><button type="button" onClick={()=>worksheetDownload(module)} className="rounded-lg bg-amber-400 px-4 py-2 text-xs font-bold text-slate-950">Download worksheet</button><button type="button" onClick={()=>setPanels(p=>({...p,[module.num]:"quiz"}))} className="inline-flex items-center gap-1 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950">Take quiz <ArrowRight size={15}/></button></div>
        </div>}
        {panel==="quiz" && <div className="space-y-4 border-t border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-900">Completion quiz · Pass all 3 questions</p>
          {module.quiz.map((question,index)=><fieldset key={index} className="rounded-xl border border-slate-200 bg-white p-4"><legend className="px-1 text-sm font-extrabold text-slate-950">{index+1}. {question.q}</legend><div className="mt-2 space-y-2">{question.options.map((option,optionIndex)=><label key={option} className="flex cursor-pointer items-start gap-2 text-sm text-slate-800"><input className="mt-1 accent-indigo-600" type="radio" name={`module-${module.num}-question-${index}`} checked={selected[index]===optionIndex} onChange={()=>{setAnswers(a=>({...a,[module.num]:{...(a[module.num]??{}),[index]:optionIndex}}));setResults(r=>{const next={...r};delete next[module.num];return next})}}/><span>{option}</span></label>)}</div>
            {result && <p className={`mt-3 text-xs font-semibold ${result.answers[index]===question.answer?"text-emerald-800":"text-rose-700"}`}>{result.answers[index]===question.answer?"Correct. ":"Review: "}{question.explanation}</p>}
          </fieldset>)}
          {result && <p className={`text-sm font-bold ${result.score===3?"text-emerald-800":"text-rose-800"}`} role="status">Score: {result.score}/3. {result.score===3?"Passed.":"Review the explanations and try again."}</p>}
          <button type="button" onClick={()=>grade(module)} className="inline-flex items-center gap-2 rounded-xl bg-indigo-700 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-600"><RefreshCw size={16}/> Submit & grade quiz</button>
        </div>}
      </article>;
    })}
    {syncMessage && <div role="status" aria-live="polite" className={`rounded-xl border p-4 text-sm ${sync==="error"?"border-rose-300 bg-rose-50 text-rose-900":sync==="saved"?"border-emerald-300 bg-emerald-50 text-emerald-900":"border-slate-300 bg-white text-slate-800"}`}>{syncMessage}</div>}
  </section>;
}
