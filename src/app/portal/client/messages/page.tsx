"use client";

import { ExternalLink, MessageSquare, ShieldCheck, Users } from "lucide-react";

const CHANNEL_URL = "https://chat.google.com/u/2/app/chat/AAQABMc-VMI";

export default function ClientMessages() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">

      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-charcoal-900 tracking-tight">
          Messaging <span className="text-blue-500">Channel</span>.
        </h1>
        <p className="text-slate-500 mt-2 font-medium">
          Communicate with your Case Manager through the Dreams for Change Google Chat space.
        </p>
      </div>

      {/* Channel Card */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl p-10 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="w-20 h-20 bg-blue-50 rounded-[1.75rem] flex items-center justify-center shrink-0 border border-blue-100 shadow-inner">
          <MessageSquare className="w-10 h-10 text-blue-500" />
        </div>

        <div className="flex-1 relative z-10">
          <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.25em] mb-2">Dreams for Change</p>
          <h2 className="text-2xl font-black text-charcoal-900 tracking-tighter mb-2">
            Champions
          </h2>
          <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-xl">
            Champions is your official Google Chat space with your Case Manager. Use it for housing updates, 
            check-ins, document questions, and daily support.
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2">
              <ShieldCheck className="w-4 h-4 text-teal-500" />
              <span className="text-xs font-bold text-slate-600">Google Workspace Secured</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2">
              <Users className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-bold text-slate-600">Staff-Moderated</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => window.open(CHANNEL_URL, '_blank')}
          className="shrink-0 flex items-center gap-3 px-10 py-5 bg-blue-600 text-white font-black rounded-2xl text-sm uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-500/20 active:scale-95 transition-all group"
        >
          Open Channel
          <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </button>
      </div>

      {/* Invite Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-[1.75rem] p-8 flex items-start gap-5">
        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-lg">📩</span>
        </div>
        <div>
          <p className="font-black text-amber-900 text-sm mb-1">Invitation Required</p>
          <p className="text-amber-800 text-sm leading-relaxed font-medium">
            Access to Champions requires a staff invitation to the channel. 
            If you haven&apos;t been added yet, let your Case Manager know at your next check-in.
          </p>
        </div>
      </div>

    </div>
  );
}
