"use client";

import { FormEvent, useState } from "react";

const API_BASE = "https://api.sdtoolsinc.com";

type Reply = { role: "assistant" | "user"; content: string };
export function MackAiNavigator() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Reply[]>([{ role: "assistant", content: "Welcome to MackAI. I can help you find San Diego reentry, benefits, housing, and job-readiness resources. Please do not share private client information here." }]);
  const [busy, setBusy] = useState(false);
  const [available, setAvailable] = useState<"unknown" | "online" | "offline">("unknown");
  async function ask(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const question = prompt.trim().slice(0, 1000);
    if (!question || busy) return;
    setPrompt("");
    setMessages(previous => [...previous, { role: "user", content: question }]);
    setBusy(true);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);
      let response: Response;
      try {
        response = await fetch(`${API_BASE}/api/mackai`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: question }), signal: controller.signal, cache: "no-store" });
      } finally { clearTimeout(timeout); }
      if (!response.ok) throw new Error("MackAI service unavailable");
      const data: { reply?: unknown; ok?: boolean } = await response.json();
      if (!data.ok || typeof data.reply !== "string") throw new Error("Invalid AI response");
      setAvailable("online");
      setMessages(previous => [...previous, { role: "assistant", content: data.reply as string }]);
    } catch {
      setAvailable("offline");
      setMessages(previous => [...previous, { role: "assistant", content: "MackAI is temporarily unavailable. For San Diego shelter and food referrals call 2-1-1; for emotional crisis support call or text 9-8-8; for T.O.O.L.S. Inc. intake call (619) 350-7638 during office hours." }]);
    } finally { setBusy(false); }
  }
  return <section id="mackai" aria-label="MackAI assistant" className="rounded-[26px] border border-sky-400/40 bg-[#0B172A]/95 p-5 shadow-2xl shadow-sky-900/30 sm:p-7">
    <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
      <div><h2 className="text-xl font-extrabold text-white">✦ MackAI</h2><p className="text-xs text-slate-300">San Diego stabilization &amp; resource navigator</p></div>
      <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${available === "online" ? "bg-emerald-400/20 text-emerald-200" : available === "offline" ? "bg-amber-400/20 text-amber-200" : "bg-sky-400/20 text-sky-200"}`}>{available === "online" ? "MackAI responding" : available === "offline" ? "Temporarily unavailable" : "Ready to assist"}</span>
    </div>
    <div aria-live="polite" className="mt-4 max-h-72 min-h-44 space-y-3 overflow-auto">
      {messages.map((item, i) => <p key={i} className={`rounded-xl p-3 text-sm leading-relaxed ${item.role === "user" ? "ml-8 bg-sky-500/20 text-white" : "mr-5 bg-white/10 text-slate-100"}`}>{item.content}</p>)}
      {busy && <p className="text-sm text-slate-300">Checking resources…</p>}
    </div>
    <form onSubmit={ask} className="mt-4 flex gap-2">
      <input required aria-label="Question for MackAI" maxLength={1000} value={prompt} onChange={event => setPrompt(event.target.value)} placeholder="Ask about ID, CalFresh, housing, jobs…" className="min-w-0 flex-1 rounded-xl border border-white/20 bg-[#060D1A] px-3 py-3 text-sm text-white placeholder:text-slate-400 focus:border-sky-400 focus:outline-none" />
      <button type="submit" disabled={busy} className="rounded-xl bg-sky-400 px-4 py-3 text-sm font-extrabold text-[#060D1A] disabled:opacity-50">Ask</button>
    </form>
    <p className="mt-3 text-[11px] text-slate-400">Information only. Not for emergencies or confidential case records. AI responses may require verification.</p>
  </section>;
}
