"use client";

import { useStaff } from "@/context/StaffContext";
import { 
  User, 
  MapPin, 
  ShieldCheck, 
  FileText, 
  History, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Phone, 
  Mail, 
  AlertCircle,
  ExternalLink,
  Table,
  FileSpreadsheet,
  FileBox,
  BrainCircuit,
  Heart,
  Megaphone,
  Plus
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ClientProfile() {
  const { slot } = useParams();
  const { participants, documents, caseNotes, journals, feedback } = useStaff();
  
  const client = participants.find(p => p.slot === slot);
  const clientDocs = documents.filter(d => d.client.includes(String(slot)));
  const clientNotes = caseNotes.filter(n => n.clientName.includes(String(slot)));

  if (!client) return <div className="p-8">Participant not found.</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Header / Profile Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-full -mr-20 -mt-20 opacity-50"></div>
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-teal-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-teal-500/20">
            {client.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold text-charcoal-900 tracking-tight">{client.name}</h1>
              <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-bold uppercase tracking-wider">{client.slot}</span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500">
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {client.environment}</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-500" /> {client.status}</span>
              <span className="flex items-center gap-1.5 text-indigo-600 underline font-bold cursor-pointer"><Phone className="w-4 h-4" /> Secure Call</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 relative z-10">
          <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold hover:bg-slate-50 transition flex items-center gap-2 text-sm">
            <User className="w-4 h-4" /> Demographics
          </button>
          <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold hover:bg-slate-50 transition flex items-center gap-2 text-sm">
            <FileSpreadsheet className="w-4 h-4" /> MSFT Excel
          </button>
          <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold hover:bg-slate-50 transition flex items-center gap-2 text-sm">
            <Table className="w-4 h-4" /> Google Sheet
          </button>
          <Link href="/portal/staff/casenote/new" className="bg-teal-600 text-white px-5 py-2 rounded-xl font-bold hover:bg-teal-700 shadow-lg shadow-teal-500/20 transition flex items-center gap-2 text-sm">
            <PlusIcon className="w-4 h-4" /> New Intake / Action Note
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Demographics & Needs */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-charcoal-900 mb-4 flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-indigo-500" /> Priority: What Needs Done
            </h3>
            {/* ... needs content ... */}
          </div>

          {/* WELLNESS MONITORING */}
          <div className="bg-white p-6 rounded-2xl border border-indigo-200 shadow-sm shadow-indigo-500/5">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-charcoal-900 flex items-center gap-2 uppercase tracking-widest">
                   <Heart className="w-4 h-4 text-rose-500" /> Wellness Pulse
                </h3>
                <Link href="/portal/staff/activity" className="text-[10px] font-bold text-indigo-600 uppercase">View Trends</Link>
             </div>
             
             {journals.filter((j: any) => String(slot).includes(j.client)).length === 0 ? (
                <div className="py-8 text-center bg-slate-50 rounded-xl border border-slate-100 italic text-slate-400 text-xs">
                   No wellness check-ins logged by participant.
                </div>
             ) : (
                <div className="space-y-4">
                   <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 italic text-xs text-indigo-900 leading-relaxed font-serif">
                      \"{journals.find((j: any) => String(slot).includes(j.client))?.content}\"
                   </div>
                   <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Current Mood:</span>
                      <span className="text-lg">
                         {journals.find((j: any) => String(slot).includes(j.client))?.mood === 'happy' ? '😊' : '😐'}
                      </span>
                   </div>
                </div>
             )}
          </div>
        </div>

        {/* Center: Recent Case Notes */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-charcoal-900">Recent Action Notes</h2>
            <Link href="/portal/staff/casenote/new" className="text-sm font-bold text-teal-600 hover:text-teal-700">+ Add Note</Link>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100 h-[600px] overflow-y-auto custom-scrollbar">
             {clientNotes.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center">
                <History className="w-12 h-12 text-slate-200 mb-4" />
                <p className="text-slate-400 font-medium">No case notes found for this participant.</p>
                <button className="mt-4 text-sm font-bold text-teal-600">Start First Entry</button>
              </div>
            ) : (
              clientNotes.map((note, idx) => (
                <div key={idx} className="p-6 hover:bg-slate-50 transition">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded-lg">{note.date}</span>
                    <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">{note.type}</span>
                  </div>
                  <p className="text-sm text-charcoal-900 font-bold mb-1">Entry Summary</p>
                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">{note.summary}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Files & Plug-ins Context */}
        <div className="space-y-6">
          {/* COMMUNITY PULSE */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
             <h3 className="text-sm font-bold text-charcoal-900 mb-4 flex items-center gap-2 uppercase tracking-widest leading-none">
                <Megaphone className="w-4 h-4 text-emerald-500" /> Community Voice
             </h3>
             <div className="space-y-3">
                {feedback.filter((f: any) => String(slot).includes(f.client)).length === 0 ? (
                   <p className="text-[10px] text-slate-400 italic">No feedback or grievances submitted.</p>
                ) : (
                   feedback.filter((f: any) => String(slot).includes(f.client)).map((f: any, i: number) => (
                      <div key={i} className={`p-3 rounded-xl border text-[10px] font-bold ${f.type === 'complaint' ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
                         [{f.type.toUpperCase()}] {f.content}
                      </div>
                   ))
                )}
             </div>
          </div>

          <div className="bg-charcoal-900 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl"></div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <FileBox className="w-5 h-5 text-teal-400" /> Secured Documents
            </h3>
            <div className="space-y-3">
              {clientDocs.length === 0 ? (
                 <div className="py-8 text-center bg-white/5 rounded-xl border border-white/10 italic text-white/40 text-sm font-medium">
                   No documents linked yet.
                 </div>
              ) : (
                clientDocs.map((doc, idx) => (
                  <div key={idx} className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition cursor-pointer flex items-center justify-between border border-white/5 group">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-teal-400" />
                      <span className="text-xs font-bold truncate max-w-[120px]">{doc.name}</span>
                    </div>
                    <ExternalLink className="w-3 h-3 text-white/40 group-hover:text-white" />
                  </div>
                ))
              )}
              <Link href="/portal/staff/documents" className="block text-center mt-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-xs transition">
                Secure Upload Hub
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-charcoal-900 mb-4">Integrated Plug-ins</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl hover:bg-indigo-50 transition border border-slate-100 group">
                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold text-slate-500">ChatGPT AI</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl hover:bg-amber-50 transition border border-slate-100 group">
                <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <FileBox className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold text-slate-500">Curiosity</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlusIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
