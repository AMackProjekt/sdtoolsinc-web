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

      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-charcoal-900 tracking-tight">Messaging <span className="text-blue-500">Bridge</span>.</h1>
          <p className="text-slate-500 mt-2 font-medium">Communicate with your Case Manager via Google Chat & Video.</p>
        </div>
        <button 
          onClick={() => window.open('https://chat.google.com/u/1/app/chat/AAQABMc-VMI', '_blank')}
          className="bg-blue-600 shadow-blue-500/20 shadow-xl text-white px-8 py-4 rounded-3xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-3 active:scale-95 group"
        >
          Launch Google Chat App <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8 overflow-hidden">
        
        {/* Left: Communication Hubs */}
        <div className="lg:col-span-1 space-y-6 overflow-y-auto pr-4 custom-scrollbar">
           
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-500/30 transition">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold shadow-sm">
                    CM
                 </div>
                 <div>
                    <h3 className="font-bold text-charcoal-900 text-sm">Case Manager</h3>
                    <div className="flex items-center gap-1.5 mt-1">
                       <span className="w-2 h-2 rounded-full bg-green-500"></span>
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Online Hub</span>
                    </div>
                 </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-6 font-medium">Primary channel for housing updates and daily check-ins.</p>
              <button 
                onClick={() => window.open('https://chat.google.com/u/1/app/chat/AAQABMc-VMI', '_blank')}
                className="w-full py-3 bg-blue-50 text-blue-700 font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-blue-100 transition shadow-inner"
              >
                Open Direct Channel
              </button>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group hover:border-teal-500/30 transition">
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center font-bold shadow-sm">
                    <Video className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="font-bold text-charcoal-900 text-sm">Video Session Hub</h3>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1 inline-block italic">Next: Friday at 2:30 PM</span>
                 </div>
              </div>
              <button className="w-full py-3 bg-teal-600 text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-teal-700 transition shadow-lg shadow-teal-500/20">
                Join Case Review
              </button>
           </div>

        </div>

        {/* Right: Message Logic History (Mocked for current view) */}
        <div className="lg:col-span-3 bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl flex flex-col overflow-hidden">
           
           <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs ring-2 ring-white shadow-md">M</div>
                 <h2 className="font-bold text-charcoal-900">Direct Message Archive</h2>
              </div>
              <div className="flex items-center gap-4">
                 <div className="relative">
                    <Search className="w-4 h-4 text-slate-300 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="text" placeholder="Search archive..." className="bg-white border border-slate-200 text-xs rounded-xl pl-9 pr-4 py-2 outline-none" />
                 </div>
              </div>
           </div>

           <div className="flex-1 p-10 overflow-y-auto space-y-8 custom-scrollbar">
              <div className="flex flex-col items-center py-8">
                 <Clock className="w-12 h-12 text-slate-100 mb-4" />
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">All communication is end-to-end encrypted.</p>
              </div>

              {/* Message groups */}
              <div className="space-y-6">
                 <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-[10px] text-indigo-600 shrink-0">CM</div>
                    <div className="max-w-xl bg-slate-50 p-5 rounded-3xl rounded-tl-lg text-sm text-slate-700 leading-relaxed border border-slate-100 shadow-inner">
                       I received your paperwork update. Please complete the required consent form before tomorrow's check-in.
                    </div>
                 </div>

                 <div className="flex gap-4 justify-end">
                    <div className="max-w-xl bg-blue-600 p-5 rounded-3xl rounded-tr-lg text-sm text-white leading-relaxed shadow-lg shadow-blue-500/10 font-medium">
                       Thanks, I will have it ready before the scheduled follow-up.
                    </div>
                 </div>
              </div>
           </div>

           <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex items-center gap-6">
              <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shadow-inner">
                 <input type="text" placeholder="Type a secure message..." className="flex-1 text-sm bg-transparent outline-none text-slate-700 placeholder:text-slate-400" />
                 <button title="Send message" className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition">
                    <Send className="w-5 h-5" />
                 </button>
              </div>
              <button 
                title="Open Google Chat"
                onClick={() => window.open('https://chat.google.com/u/1/app/chat/AAQABMc-VMI', '_blank')}
                className="p-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition active:scale-95 group"
              >
                 <ExternalLink className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </button>
           </div>
        </div>

      </div>
    </div>
  );
}
