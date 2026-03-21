"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  Calendar, 
  Upload, 
  MessageSquare, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  FileText, 
  ShieldCheck, 
  Zap, 
  Bot,
  Video,
  Quote,
  BookOpen,
  Heart,
  Smile,
  Megaphone,
  Lightbulb,
  Frown,
  Plus
} from "lucide-react";
import Link from "next/link";
import { useStaff } from "@/context/StaffContext";

const QUOTES = [
  "Your current situation is not your final destination. The best is yet to come.",
  "Every small step is progress. Keep moving forward.",
  "You are stronger than you think. DFC is here with you.",
  "Rise up and attack the day with an enthusiastic spirit.",
  "The only way to do great work is to love what you do. Or to start doing it today.",
  "Your progress is not a sprint, it's a journey. Every mile counts."
];

const SELF_CARE_TIPS = [
  { title: "Breathe Deep", text: "Take 5 deep breaths before your daily check-in." },
  { title: "Hydrate", text: "Drink a glass of water before starting your tasks." },
  { title: "Walk", text: "A 10-minute walk can reset your mental clarity." },
  { title: "Acknowledge", text: "Write down one thing you are proud of today." }
];

export default function ClientDashboard() {
  const { 
    caseNotes, 
    documents, 
    journals, 
    addJournal, 
    addFeedback, 
    addShoutOut,
    addRequest 
  } = useStaff();
  
  const [quote, setQuote] = useState(QUOTES[0]);
  const [activeTab, setActiveTab] = useState("overview");

  // Motivational check on load
  useEffect(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  // Journal State
  const [journalContent, setJournalContent] = useState("");
  const [mood, setMood] = useState("neutral");

  // Feedback State
  const [feedbackType, setFeedbackType] = useState<'complaint' | 'suggestion'>('suggestion');
  const [feedbackContent, setFeedbackContent] = useState("");

  const mySlot = "A3"; 
  const myJournals = journals.filter(j => j.client === mySlot);
  const myDocs = documents.filter(d => d.client.includes(mySlot));

  const handleAddJournal = () => {
    if (!journalContent.trim()) return;
    addJournal({
      id: Date.now(),
      client: mySlot,
      date: new Date().toLocaleDateString(),
      mood,
      content: journalContent
    });
    setJournalContent("");
  };

  const handleAddFeedback = () => {
    if (!feedbackContent.trim()) return;
    addFeedback({
      id: Date.now(),
      client: mySlot,
      type: feedbackType,
      content: feedbackContent,
      date: new Date().toLocaleDateString()
    });
    setFeedbackContent("");
    alert("Thank you for your feedback. We will review it shortly.");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* INSPIRATIONAL BANNER */}
      <div className="relative bg-gradient-to-br from-charcoal-900 via-charcoal-950 to-indigo-950 rounded-[2.5rem] p-10 text-white shadow-2xl overflow-hidden group">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[120px] -mr-40 -mt-40 transition-all duration-1000 group-hover:bg-teal-500/20"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="p-2 bg-teal-500/20 text-teal-400 rounded-xl border border-teal-500/30">
               <Quote className="w-5 h-5" />
            </span>
            <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">Daily Inspiration</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight max-w-3xl leading-tight italic font-serif text-teal-100">
            \"{quote}\"
          </h1>
          <div className="flex flex-wrap items-center gap-6">
             <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center font-bold text-xs text-charcoal-900">M</div>
                <div className="text-xs">
                   <p className="font-bold text-white">Advice of the Day</p>
                   <p className="text-white/60">From Mack: \"One page at a time.\"</p>
                </div>
             </div>
             <button onClick={() => setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)])} className="text-xs font-bold text-teal-400 hover:text-white transition flex items-center gap-2">
                Get New Quote <Zap className="w-3 h-3" />
             </button>
          </div>
        </div>
      </div>

      {/* DASHBOARD NAVIGATION */}
      <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto no-scrollbar">
         {[
           { id: 'overview', label: 'Progress Explorer', icon: Zap },
           { id: 'wellness', label: 'Wellness & Journal', icon: Heart },
           { id: 'feedback', label: 'Support & Suggestions', icon: Megaphone },
           { id: 'community', label: 'Shout Outs', icon: Smile }
         ].map(tab => (
           <button 
             key={tab.id}
             onClick={() => setActiveTab(tab.id)}
             className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                activeTab === tab.id ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20' : 'text-slate-500 hover:bg-slate-50 hover:text-charcoal-900'
             }`}
           >
             <tab.icon className="w-4 h-4" /> {tab.label}
           </button>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* MAIN CONTENT AREA */}
        <div className="lg:col-span-2">
           {activeTab === 'overview' && (
              <div className="space-y-8 animate-in slide-in-from-bottom-4">
                  {/* Progress Roadmap (Expanded) */}
                  <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 relative z-10">
                        <div>
                           <h2 className="text-2xl font-black text-charcoal-900 tracking-tighter flex items-center gap-3">
                               <Zap className="w-6 h-6 text-amber-500" /> My Housing Roadmap
                           </h2>
                           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Current Phase: Stabilization Audit</p>
                        </div>
                        <div className="flex items-center gap-4 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 shadow-inner group-hover:bg-teal-50 group-hover:border-teal-100 transition-colors">
                           <div className="text-right">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Overall Progress</p>
                              <p className="text-2xl font-black text-charcoal-900 leading-none group-hover:text-teal-600 transition-colors">82%</p>
                           </div>
                           <div className="w-1.5 h-10 bg-teal-500 rounded-full"></div>
                        </div>
                     </div>

                     <div className="relative mb-14 px-4">
                        <div className="absolute top-5 left-10 right-10 h-1.5 bg-slate-100 hidden md:block rounded-full"></div>
                        <div className="absolute top-5 left-10 w-[82%] h-1.5 bg-gradient-to-r from-teal-500 to-indigo-500 hidden md:block rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(20,184,166,0.3)]"></div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
                           {[
                             { label: 'Intake', status: 'completed', date: 'Jan 15' },
                             { label: 'SOP Packet', status: 'completed', date: 'Feb 10' },
                             { label: 'Verification', status: 'current', date: 'Active' },
                             { label: 'Placement', status: 'future', date: 'Upcoming' }
                           ].map((step, i) => (
                              <div key={i} className="flex flex-col items-center md:items-start group/step">
                                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 border-4 transition-all duration-500 ${
                                   step.status === 'completed' ? 'bg-teal-500 border-teal-50 text-white shadow-lg shadow-teal-500/10' : 
                                   step.status === 'current' ? 'bg-white border-teal-500 text-teal-600 scale-125 shadow-xl ring-8 ring-teal-50 transition-transform' : 
                                   'bg-white border-slate-100 text-slate-300'
                                 }`}>
                                    {step.status === 'completed' ? <CheckCircle2 className="w-6 h-6" /> : <span className="text-sm font-black">{i+1}</span>}
                                 </div>
                                 <div className="text-center md:text-left">
                                    <p className={`text-sm font-black tracking-tight ${step.status === 'current' ? 'text-charcoal-900' : 'text-slate-500'}`}>{step.label}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{step.date}</p>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>

                     {/* AI INSIGHT PULSE */}
                     <div className="bg-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-900/40">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-teal-400/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                           <div className="flex items-center gap-5">
                              <div className="w-14 h-14 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center text-teal-400 shadow-inner">
                                 <Bot className="w-8 h-8 animate-bounce duration-3000" />
                              </div>
                              <div>
                                 <h4 className="text-lg font-bold tracking-tight mb-1">AI Journey Navigator <span className="text-[10px] bg-teal-500/20 text-teal-400 px-2 py-0.5 rounded-full border border-teal-500/30 uppercase tracking-widest ml-2">Active</span></h4>
                                 <p className="text-xs text-white/50 leading-relaxed max-w-md italic font-medium">"You are 2 signatures away from final verification. Upload your DMV receipt today to hit 90%."</p>
                              </div>
                           </div>
                           <Link href="/portal/client/goals/smart" className="px-8 py-3 bg-white text-indigo-900 font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-teal-400 hover:text-charcoal-900 transition-all shadow-xl active:scale-95 text-center">
                              Fast-Track This Milestone
                           </Link>
                        </div>
                     </div>
                  </div>

                 {/* Mental Health Quick Check */}
                 <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-charcoal-900 mb-6 flex items-center gap-2">
                       <Smile className="w-5 h-5 text-indigo-500" /> How are you feeling today?
                    </h3>
                    <div className="flex gap-4">
                       {[
                         { id: 'happy', icon: '😊', color: 'bg-green-100 text-green-700' },
                         { id: 'good', icon: '🙂', color: 'bg-teal-100 text-teal-700' },
                         { id: 'neutral', icon: '😐', color: 'bg-slate-100 text-slate-700' },
                         { id: 'stressed', icon: '😟', color: 'bg-amber-100 text-amber-700' },
                         { id: 'bad', icon: '😔', color: 'bg-rose-100 text-rose-700' }
                       ].map(e => (
                          <button 
                            key={e.id}
                            onClick={() => setMood(e.id)}
                            className={`flex flex-col items-center gap-2 flex-1 p-4 rounded-2xl border-2 transition-all ${
                              mood === e.id ? `border-indigo-500 scale-105 shadow-md ${e.color}` : 'border-slate-100 hover:border-slate-200'
                            }`}
                          >
                            <span className="text-2xl">{e.icon}</span>
                            <span className="text-[10px] font-bold uppercase">{e.id}</span>
                          </button>
                       ))}
                    </div>
                 </div>
              </div>
           )}

           {activeTab === 'wellness' && (
              <div className="space-y-8 animate-in slide-in-from-bottom-4">
                 {/* Journal Input */}
                 <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                    <h3 className="text-xl font-bold text-charcoal-900 mb-6 flex items-center gap-2">
                       <BookOpen className="w-5 h-5 text-indigo-600" /> My Daily Journal
                    </h3>
                    <textarea 
                      value={journalContent}
                      onChange={(e) => setJournalContent(e.target.value)}
                      placeholder="Write your thoughts for today... What was your biggest win?"
                      className="w-full h-40 bg-slate-50 border border-slate-100 rounded-2xl p-6 text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-teal-500/20 transition mb-4 font-serif text-lg leading-relaxed shadow-inner"
                    />
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Entry Mood:</span>
                          <span className="text-lg">{mood === 'happy' ? '😊' : mood === 'neutral' ? '😐' : mood === 'good' ? '🙂' : mood === 'stressed' ? '😟' : '😔'}</span>
                       </div>
                       <button 
                         onClick={handleAddJournal}
                         className="bg-indigo-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-indigo-700 transition flex items-center gap-2 shadow-lg shadow-indigo-500/20"
                       >
                         Save Journal Entry <Plus className="w-4 h-4" />
                       </button>
                    </div>
                 </div>

                 {/* Journal History */}
                 <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-4">Past Entries</h4>
                    {myJournals.map(entry => (
                       <div key={entry.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm group hover:shadow-md transition">
                          <div className="flex items-center justify-between mb-2">
                             <div className="flex items-center gap-2">
                                <span className="text-lg">{entry.mood === 'happy' ? '😊' : entry.mood === 'neutral' ? '😐' : entry.mood === 'good' ? '🙂' : entry.mood === 'stressed' ? '😟' : '😔'}</span>
                                <span className="text-xs font-bold text-charcoal-900">{entry.date}</span>
                             </div>
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed font-serif">{entry.content}</p>
                       </div>
                    ))}
                    {myJournals.length === 0 && <p className="text-center py-8 text-slate-300 font-medium italic">Your journal is waiting for its first entry.</p>}
                 </div>
              </div>
           )}

           {activeTab === 'feedback' && (
              <div className="space-y-8 animate-in slide-in-from-bottom-4">
                 <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                    <h3 className="text-xl font-bold text-charcoal-900 mb-4 flex items-center gap-2">
                       <Megaphone className="w-5 h-5 text-rose-500" /> Send Feedback or Suggestion
                    </h3>
                    <p className="text-sm text-slate-500 mb-8">Your voice matters at Dreams for Change. Tell us how we can improve.</p>
                    
                    <div className="flex gap-4 mb-6">
                       <button 
                         onClick={() => setFeedbackType('suggestion')}
                         className={`flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                           feedbackType === 'suggestion' ? 'bg-emerald-50 text-emerald-700 border-2 border-emerald-200' : 'bg-slate-50 text-slate-500 border-2 border-transparent'
                         }`}
                       >
                         <Lightbulb className="w-4 h-4" /> Suggestion
                       </button>
                       <button 
                         onClick={() => setFeedbackType('complaint')}
                         className={`flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                           feedbackType === 'complaint' ? 'bg-rose-50 text-rose-700 border-2 border-rose-200' : 'bg-slate-50 text-slate-500 border-2 border-transparent'
                         }`}
                       >
                         <Frown className="w-4 h-4" /> Grievance
                       </button>
                    </div>

                    <textarea 
                      value={feedbackContent}
                      onChange={(e) => setFeedbackContent(e.target.value)}
                      placeholder={feedbackType === 'suggestion' ? "I would like to suggest..." : "I have a complaint about..."}
                      className="w-full h-32 bg-slate-50 border border-slate-100 rounded-2xl p-6 text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-teal-500/20 transition mb-6 shadow-inner"
                    />

                    <button 
                      onClick={handleAddFeedback}
                      className={`w-full py-4 rounded-2xl font-bold text-white transition shadow-lg ${
                         feedbackType === 'suggestion' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20'
                      }`}
                    >
                      Submit To Management
                    </button>
                 </div>
              </div>
           )}

           {activeTab === 'community' && (
              <div className="space-y-8 animate-in slide-in-from-bottom-4">
                 <div className="bg-charcoal-900 p-8 rounded-[2rem] text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-teal-400/10 rounded-full blur-3xl"></div>
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                       <Smile className="w-5 h-5 text-teal-400" /> Give a Shout Out
                    </h3>
                    <p className="text-sm text-slate-400 mb-8 max-w-lg">Highlight a fellow participant or a staff member who made an impact today.</p>
                    
                    <div className="space-y-4">
                       <input 
                         type="text" 
                         placeholder="Who are you shouting out? (e.g. Mack, Alex, A2...)" 
                         className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-400/50"
                       />
                       <textarea 
                         placeholder="What was their impact?" 
                         className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-sm h-24 outline-none focus:ring-2 focus:ring-teal-400/50"
                       />
                       <button className="w-full py-4 bg-teal-500 text-charcoal-900 font-bold rounded-xl hover:bg-teal-400 transition shadow-xl shadow-teal-500/20">Post Shout Out</button>
                    </div>
                 </div>
                 
                 <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-4">Live Community Feed</h4>
                    {[
                      { from: 'J8 (Alisa)', to: 'Mack', msg: 'Thanks for staying late to help me with my DMV docs. You are a lifesaver!' },
                      { from: 'D9 (John)', to: 'A3 (Brett)', msg: 'Congrats on your housing match milestone, brother! Keep going.' }
                    ].map((so, i) => (
                       <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex gap-4">
                          <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center shrink-0 border border-teal-100 text-teal-600 font-bold text-[10px] uppercase">
                             {so.from.split(' ')[0]}
                          </div>
                          <div>
                             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">To <span className="text-teal-600">{so.to}</span></p>
                             <p className="text-sm font-bold text-charcoal-900 italic">\"{so.msg}\"</p>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           )}
        </div>

        {/* SIDEBAR TOOLS */}
        <div className="space-y-8">
           
           {/* Self-Care Corner */}
           <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-charcoal-900 mb-6 flex items-center gap-2">
                 <Heart className="w-5 h-5 text-rose-500" /> Self-Care Corner
              </h3>
              <div className="space-y-4">
                 {SELF_CARE_TIPS.map((tip, i) => (
                    <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-teal-500/30 transition cursor-default">
                       <p className="text-xs font-bold text-charcoal-900 mb-1">{tip.title}</p>
                       <p className="text-[11px] text-slate-500 leading-relaxed">{tip.text}</p>
                    </div>
                 ))}
              </div>
           </div>

           {/* Meeting Hub (Launchpad) */}
           <div className="bg-indigo-900 p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-400/20 rounded-full blur-3xl -mr-10 -mt-10 transition-transform duration-1000 group-hover:scale-150"></div>
              <h3 className="text-md font-bold mb-4 flex items-center gap-2">
                 <Bot className="w-5 h-5 text-teal-400" /> CaseFlow AI Assistant
              </h3>
              <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                 Need help with your housing roadmap? Ask me anything about Section 8 or DMV vouchers.
              </p>
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md mb-4 flex items-center text-xs text-white/40">
                 Type your question...
              </div>
              <button className="w-full py-4 bg-teal-500 hover:bg-teal-400 text-charcoal-900 font-bold rounded-xl text-xs transition uppercase tracking-widest shadow-lg shadow-teal-500/20">Start Chat session</button>
           </div>

           {/* LIVE REQUEST BRIDGE */}
           <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <h3 className="text-lg font-black text-charcoal-900 mb-6 flex items-center gap-3 tracking-tighter">
                 <Zap className="w-5 h-5 text-indigo-600" /> Case Request Hub
              </h3>
              
              <div className="space-y-4 relative z-10">
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Request Type</label>
                    <select 
                      id="requestType"
                      className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl text-xs font-bold text-charcoal-900 outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                       <option>Face-to-Face Session</option>
                       <option>DMV/ID Voucher</option>
                       <option>Housing Audit Review</option>
                       <option>Emergency Resource</option>
                    </select>
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Internal Note (Ref: Mack)</label>
                    <textarea 
                      id="requestNote"
                      placeholder="Brief context for the request..." 
                      className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl text-xs h-24 outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                 </div>
                 <button 
                   onClick={() => {
                     const type = (document.getElementById('requestType') as HTMLSelectElement).value;
                     const note = (document.getElementById('requestNote') as HTMLTextAreaElement).value;
                     if(!note) return alert("Please provide a note for Mack.");
                     addRequest({
                        id: Date.now(),
                        client: "Brett Purettman (A3)",
                        type,
                        note,
                        status: 'pending',
                        date: new Date().toLocaleDateString()
                     });
                     (document.getElementById('requestNote') as HTMLTextAreaElement).value = "";
                     alert("Request submitted to Mack. You will be notified of approval.");
                   }}
                   className="w-full py-4 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20 active:scale-95"
                 >
                    Submit Request
                 </button>
              </div>
           </div>

           {/* Feedback Stats... (Existing) */}

        </div>

      </div>
    </div>
  );
}
