"use client";

import Link from "next/link";
import { 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle,
  CalendarDays,
  Clock,
  ArrowRight,
  FileText,
  Users,
  FileUp,
  Bot,
  Zap
} from "lucide-react";
import { useStaff } from "@/context/StaffContext";

export default function MainDashboard() {
  const { participants, documents, caseNotes, notifications, requests, updateRequestStatus, team, mission } = useStaff();
  
  // Real Logic for Metrics
  const activeCount = participants.filter(p => (p as any).status.includes('Active')).length;
  const inProgressCount = participants.filter(p => (p as any).status === 'Active - SOP Audit').length;
  const placementCount = participants.filter(p => (p as any).status === 'Active - Housing Match').length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* MISSION BRANDING HUB */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden">
         <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
         <div className="flex flex-col md:flex-row items-start justify-between gap-8 relative z-10">
            <div className="max-w-3xl">
               <h1 className="text-4xl font-black text-charcoal-900 tracking-tighter mb-4 uppercase italic">Dreams for Change <span className="text-indigo-600">Case Management</span></h1>
               <p className="text-slate-500 font-bold leading-relaxed italic border-l-4 border-indigo-500 pl-6 text-sm">
                  "{mission}"
               </p>
            </div>
            <Link 
              href="https://sites.google.com/d/1kyg4znPtXffPekhf49Q67uCYNi4C4r_A/p/1EkcGjy2FDmczm0Y48qGQJlxNh0U6UBtk/edit" 
              target="_blank"
              className="whitespace-nowrap flex items-center gap-3 px-8 py-4 bg-charcoal-900 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] hover:bg-slate-800 transition shadow-2xl shadow-charcoal-900/20"
            >
               Google Site Bridge <ArrowRight className="w-4 h-4" />
            </Link>
         </div>
      </div>

      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-lg font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Operational Pulse</h2>
           <p className="text-xs font-bold text-slate-300">San Diego Case Management Division</p>
        </div>
        
        <div className="flex flex-col md:flex-row items-end md:items-center gap-4">
          {/* Team Snapshot */}
          <div className="flex -space-x-3 hover:space-x-1 transition-all">
             {team.map((m, i) => (
                <div key={i} className="w-10 h-10 bg-indigo-600 border-2 border-white rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-lg cursor-default group" title={`${m.name} - ${m.role}`}>
                   {m.name[0]}
                </div>
             ))}
          </div>
          
          {/* System Health Pulse */}
          <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm border border-slate-200 px-5 py-2.5 rounded-[1.5rem] shadow-sm">
             <div className="relative">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
                <div className="w-3 h-3 bg-emerald-500 rounded-full absolute inset-0"></div>
             </div>
             <div>
                <p className="text-[10px] font-black text-charcoal-900 uppercase tracking-widest leading-none">Reliability Agent</p>
                <p className="text-[10px] text-slate-400 font-bold mt-1">Status: Monitoring Ecosystem for Runtime Errors</p>
             </div>
          </div>
        </div>
      </div>

      {/* AI CASE MANAGER ASSISTANT */}
      <div className="bg-gradient-to-br from-charcoal-900 to-indigo-950 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 relative z-10">
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 bg-white/10 border border-white/20 rounded-[1.5rem] flex items-center justify-center text-teal-400 shadow-inner group-hover:scale-110 transition-transform">
                  <Bot className="w-8 h-8 animate-pulse" />
               </div>
               <div className="max-w-xl">
                  <h3 className="text-2xl font-black tracking-tight mb-2">Case Manager <span className="text-teal-400">AI Insight</span></h3>
                  <p className="text-white/50 text-sm leading-relaxed font-medium italic">"Connect to the AI Case Manager to run caseload analysis, generate bulk follow-ups, and surface compliance gaps across all active participants."</p>
               </div>
            </div>
            <Link href="/portal/staff/terminal" className="px-8 py-4 bg-teal-500 text-charcoal-950 font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-teal-400 shadow-xl shadow-teal-500/20 active:scale-95 transition-all">
               Execute Bulk Follow-up
            </Link>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Roadmap & Live Approval Hub */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Caseload Roadmap... (Existing) */}

          {/* LIVE APPROVAL HUB */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden flex flex-col group/hub">
             <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                <div>
                   <h3 className="font-black text-xl text-charcoal-900 flex items-center gap-3 tracking-tighter">
                      <Clock className="w-6 h-6 text-indigo-500" />
                      Live Approval Queue
                   </h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Pending Participant Requests</p>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                   <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Pending Review</span>
                </div>
             </div>

             <div className="p-0 divide-y divide-slate-50">
                {requests.filter(r => r.status === 'pending').map((req, i) => (
                   <div key={i} className="p-8 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-5">
                         <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-sm border border-indigo-100 shadow-sm">
                            {req.client.split(' ')[0][0]}{req.client.split(' ').slice(-1)[0][0]}
                         </div>
                         <div>
                            <p className="text-sm font-black text-charcoal-900 tracking-tight">{req.client}</p>
                            <div className="flex flex-wrap items-center gap-3 mt-1.5">
                               <span className="text-[10px] font-black bg-indigo-600 text-white px-2.5 py-0.5 rounded-full uppercase tracking-widest">{req.type}</span>
                               <span className="text-[11px] text-slate-400 font-medium italic">"{req.note}"</span>
                            </div>
                         </div>
                      </div>
                      <div className="flex items-center gap-3">
                         <button 
                           onClick={() => updateRequestStatus(req.id, 'denied')}
                           className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl text-[11px] uppercase tracking-widest hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all active:scale-95"
                         >
                            Deny
                         </button>
                         <button 
                           onClick={() => updateRequestStatus(req.id, 'approved')}
                           className="px-8 py-2.5 bg-emerald-600 text-white font-black rounded-xl text-[11px] uppercase tracking-widest hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all"
                         >
                            Approve
                         </button>
                      </div>
                   </div>
                ))}
                {requests.filter(r => r.status === 'pending').length === 0 && (
                   <div className="py-20 text-center text-slate-300">
                      <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-slate-100" />
                      <p className="text-sm font-bold text-slate-400 italic font-serif">Queue Clear. No pending requests from participants.</p>
                   </div>
                )}
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Activity Feed (Blank) */}
        <div className="flex flex-col space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-md overflow-hidden flex flex-col h-full min-h-[400px]">
            <div className="px-8 py-8 border-b border-slate-50">
              <h3 className="font-black text-xl text-charcoal-900 tracking-tighter flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-teal-500" />
                Recent Activity
              </h3>
            </div>
            <div className="p-10 flex-1 flex flex-col items-center justify-center text-center space-y-4">
               <div className="w-16 h-16 bg-teal-50 text-teal-200 rounded-2xl flex items-center justify-center border border-teal-100 rotate-12">
                  <FileText className="w-8 h-8" />
               </div>
               <div>
                  <p className="text-sm font-bold text-slate-400 italic">No interaction logs detected yet.</p>
                  <Link href="/portal/staff/casenote/new" className="text-[10px] font-bold text-teal-600 uppercase tracking-widest mt-2 block hover:underline">Start a log manually</Link>
               </div>
            </div>
            <div className="p-6 bg-slate-50/50 border-t border-slate-100 text-center">
              <Link href="/portal/staff/caseload" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700 flex items-center justify-center gap-2 transition">
                Explore Full Roster <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
