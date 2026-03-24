"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
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
  Zap,
  ListTodo,
  CheckSquare,
  CalendarCheck,
  Timer,
  Plus,
  X,
  Play,
  Pause,
  RotateCcw,
  Coffee
} from "lucide-react";
import { useStaff } from "@/context/StaffContext";

type Priority = "high" | "med" | "low";
interface TodoItem { id: number; text: string; priority: Priority; done: boolean; }
const WORK_SECS = 25 * 60;
const BREAK_SECS = 5 * 60;

export default function MainDashboard() {
  const { participants, documents, caseNotes, notifications, requests, updateRequestStatus, team, mission } = useStaff();
  
  // Real Logic for Metrics
  const activeCount = participants.filter(p => (p as any).status.includes('Active')).length;
  const inProgressCount = participants.filter(p => (p as any).status === 'Active - SOP Audit').length;
  const placementCount = participants.filter(p => (p as any).status === 'Active - Housing Match').length;

  // ── Todos & Tasks ──────────────────────────────────────────────────────────
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: 1, text: "Review SOP audit for current caseload", priority: "high", done: false },
    { id: 2, text: "Follow up on housing match placements", priority: "high", done: false },
    { id: 3, text: "Update participant progress notes", priority: "med", done: false },
    { id: 4, text: "Schedule team check-in meeting", priority: "low", done: false },
  ]);
  const [tasks, setTasks] = useState<TodoItem[]>([
    { id: 1, text: "Complete compliance documentation", priority: "high", done: false },
    { id: 2, text: "Submit monthly caseload report", priority: "high", done: false },
    { id: 3, text: "Review new participant intake files", priority: "med", done: false },
    { id: 4, text: "Update shared team calendar", priority: "low", done: false },
  ]);
  const [newTodo, setNewTodo] = useState("");
  const [newTodoPriority, setNewTodoPriority] = useState<Priority>("med");
  const [newTask, setNewTask] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>("med");

  const addTodo = () => {
    if (!newTodo.trim()) return;
    setTodos(prev => [...prev, { id: Date.now(), text: newTodo.trim(), priority: newTodoPriority, done: false }]);
    setNewTodo("");
  };
  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks(prev => [...prev, { id: Date.now(), text: newTask.trim(), priority: newTaskPriority, done: false }]);
    setNewTask("");
  };
  const toggleTodo = (id: number) => setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const removeTodo = (id: number) => setTodos(prev => prev.filter(t => t.id !== id));
  const toggleTask = (id: number) => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const removeTask = (id: number) => setTasks(prev => prev.filter(t => t.id !== id));
  const priorityCounts = (items: TodoItem[]) => ({
    high: items.filter(t => t.priority === "high" && !t.done).length,
    med:  items.filter(t => t.priority === "med"  && !t.done).length,
    low:  items.filter(t => t.priority === "low"  && !t.done).length,
  });

  // ── Upcoming Events ────────────────────────────────────────────────────────
  const upcomingEvents = [
    { title: "Team Standup",           date: "Today",    time: "9:00 AM",  type: "team"       },
    { title: "SOP Audit Review",       date: "Tomorrow", time: "11:00 AM", type: "compliance" },
    { title: "Housing Partner Call",   date: "Mar 25",   time: "2:00 PM",  type: "external"   },
    { title: "Monthly Case Review",    date: "Mar 28",   time: "10:00 AM", type: "internal"   },
    { title: "Staff Training Session", date: "Mar 31",   time: "1:00 PM",  type: "training"   },
  ];
  const eventTypeColor: Record<string, string> = {
    team:       "bg-indigo-100 text-indigo-700",
    compliance: "bg-rose-100 text-rose-700",
    external:   "bg-teal-100 text-teal-700",
    internal:   "bg-amber-100 text-amber-700",
    training:   "bg-purple-100 text-purple-700",
  };

  // ── Pomodoro ───────────────────────────────────────────────────────────────
  const [pomMode, setPomMode] = useState<"work" | "break">("work");
  const [pomSeconds, setPomSeconds] = useState(WORK_SECS);
  const [pomRunning, setPomRunning] = useState(false);
  const [pomSessions, setPomSessions] = useState(0);
  const pomRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (pomRunning) {
      pomRef.current = setInterval(() => {
        setPomSeconds(s => {
          if (s <= 1) {
            clearInterval(pomRef.current!);
            const nextMode = pomMode === "work" ? "break" : "work";
            setPomMode(nextMode);
            setPomRunning(false);
            if (pomMode === "work") setPomSessions(n => n + 1);
            return nextMode === "work" ? WORK_SECS : BREAK_SECS;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(pomRef.current!);
    }
    return () => clearInterval(pomRef.current!);
  }, [pomRunning, pomMode]);

  const pomReset = () => { setPomRunning(false); setPomSeconds(WORK_SECS); setPomMode("work"); };
  const pomTotal = pomMode === "work" ? WORK_SECS : BREAK_SECS;
  const pomPct   = Math.round(((pomTotal - pomSeconds) / pomTotal) * 100);
  const pomMins  = String(Math.floor(pomSeconds / 60)).padStart(2, "0");
  const pomSecs  = String(pomSeconds % 60).padStart(2, "0");

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

      {/* ── KPI WIDGET CARDS ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        {/* TODOS */}
        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center">
                <ListTodo className="w-4 h-4 text-indigo-600" />
              </div>
              <h3 className="font-black text-sm text-charcoal-900 tracking-tight uppercase">Todos</h3>
            </div>
            <span className="text-xs font-bold text-slate-400">{todos.filter(t => !t.done).length} open</span>
          </div>
          <div className="flex gap-2">
            <span className="flex-1 text-center py-1 rounded-lg bg-rose-50 text-rose-600 text-[11px] font-black border border-rose-100">H {priorityCounts(todos).high}</span>
            <span className="flex-1 text-center py-1 rounded-lg bg-amber-50 text-amber-600 text-[11px] font-black border border-amber-100">M {priorityCounts(todos).med}</span>
            <span className="flex-1 text-center py-1 rounded-lg bg-slate-50 text-slate-500 text-[11px] font-black border border-slate-200">L {priorityCounts(todos).low}</span>
          </div>
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {todos.map(t => (
              <div key={t.id} className={`flex items-start gap-2 group ${t.done ? "opacity-40" : ""}`}>
                <button onClick={() => toggleTodo(t.id)} aria-label="Toggle todo" className="mt-0.5 shrink-0">
                  <CheckCircle2 className={`w-4 h-4 ${t.done ? "text-emerald-500" : "text-slate-200 group-hover:text-slate-300"}`} />
                </button>
                <span className={`text-[12px] flex-1 leading-snug ${t.done ? "line-through text-slate-400" : "text-slate-700"}`}>{t.text}</span>
                <div className="flex items-center gap-1 shrink-0">
                  <span className={`text-[9px] font-black px-1.5 rounded-full ${
                    t.priority === "high" ? "bg-rose-100 text-rose-600" :
                    t.priority === "med"  ? "bg-amber-100 text-amber-600" :
                    "bg-slate-100 text-slate-500"
                  }`}>{t.priority[0].toUpperCase()}</span>
                  <button onClick={() => removeTodo(t.id)} aria-label="Remove todo" className="opacity-0 group-hover:opacity-100 transition">
                    <X className="w-3 h-3 text-slate-400 hover:text-rose-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 pt-3 space-y-2">
            <div className="flex gap-1">
              {(["high", "med", "low"] as Priority[]).map(p => (
                <button key={p} onClick={() => setNewTodoPriority(p)}
                  className={`flex-1 text-[10px] font-black py-1 rounded-lg uppercase tracking-wide transition ${
                    newTodoPriority === p
                      ? p === "high" ? "bg-rose-500 text-white" : p === "med" ? "bg-amber-500 text-white" : "bg-slate-500 text-white"
                      : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                  }`}>{p}</button>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newTodo} onChange={e => setNewTodo(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addTodo()} placeholder="Add todo…"
                className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-400 bg-slate-50" />
              <button onClick={addTodo} aria-label="Add todo" className="w-8 h-8 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 transition shrink-0">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* TASKS */}
        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-teal-50 rounded-xl flex items-center justify-center">
                <CheckSquare className="w-4 h-4 text-teal-600" />
              </div>
              <h3 className="font-black text-sm text-charcoal-900 tracking-tight uppercase">Tasks</h3>
            </div>
            <span className="text-xs font-bold text-slate-400">{tasks.filter(t => !t.done).length} open</span>
          </div>
          <div className="flex gap-2">
            <span className="flex-1 text-center py-1 rounded-lg bg-rose-50 text-rose-600 text-[11px] font-black border border-rose-100">H {priorityCounts(tasks).high}</span>
            <span className="flex-1 text-center py-1 rounded-lg bg-amber-50 text-amber-600 text-[11px] font-black border border-amber-100">M {priorityCounts(tasks).med}</span>
            <span className="flex-1 text-center py-1 rounded-lg bg-slate-50 text-slate-500 text-[11px] font-black border border-slate-200">L {priorityCounts(tasks).low}</span>
          </div>
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {tasks.map(t => (
              <div key={t.id} className={`flex items-start gap-2 group ${t.done ? "opacity-40" : ""}`}>
                <button onClick={() => toggleTask(t.id)} aria-label="Toggle task" className="mt-0.5 shrink-0">
                  <CheckCircle2 className={`w-4 h-4 ${t.done ? "text-emerald-500" : "text-slate-200 group-hover:text-slate-300"}`} />
                </button>
                <span className={`text-[12px] flex-1 leading-snug ${t.done ? "line-through text-slate-400" : "text-slate-700"}`}>{t.text}</span>
                <div className="flex items-center gap-1 shrink-0">
                  <span className={`text-[9px] font-black px-1.5 rounded-full ${
                    t.priority === "high" ? "bg-rose-100 text-rose-600" :
                    t.priority === "med"  ? "bg-amber-100 text-amber-600" :
                    "bg-slate-100 text-slate-500"
                  }`}>{t.priority[0].toUpperCase()}</span>
                  <button onClick={() => removeTask(t.id)} aria-label="Remove task" className="opacity-0 group-hover:opacity-100 transition">
                    <X className="w-3 h-3 text-slate-400 hover:text-rose-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 pt-3 space-y-2">
            <div className="flex gap-1">
              {(["high", "med", "low"] as Priority[]).map(p => (
                <button key={p} onClick={() => setNewTaskPriority(p)}
                  className={`flex-1 text-[10px] font-black py-1 rounded-lg uppercase tracking-wide transition ${
                    newTaskPriority === p
                      ? p === "high" ? "bg-rose-500 text-white" : p === "med" ? "bg-amber-500 text-white" : "bg-slate-500 text-white"
                      : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                  }`}>{p}</button>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newTask} onChange={e => setNewTask(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addTask()} placeholder="Add task…"
                className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-400 bg-slate-50" />
              <button onClick={addTask} aria-label="Add task" className="w-8 h-8 bg-teal-600 text-white rounded-xl flex items-center justify-center hover:bg-teal-700 transition shrink-0">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* UPCOMING EVENTS */}
        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center">
              <CalendarCheck className="w-4 h-4 text-amber-600" />
            </div>
            <h3 className="font-black text-sm text-charcoal-900 tracking-tight uppercase">Upcoming Events</h3>
          </div>
          <div className="space-y-1 flex-1 max-h-52 overflow-y-auto pr-1">
            {upcomingEvents.map((ev, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-slate-50 last:border-0">
                <div className="text-center shrink-0 w-14">
                  <p className="text-[9px] font-black text-slate-400 uppercase leading-tight">{ev.date}</p>
                  <p className="text-[10px] font-bold text-slate-500 mt-0.5">{ev.time}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold text-charcoal-900 leading-snug truncate">{ev.title}</p>
                  <span className={`text-[9px] font-black uppercase tracking-wide px-1.5 py-0.5 rounded-full ${eventTypeColor[ev.type]}`}>{ev.type}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-1 border-t border-slate-100">
            <Link href="/portal/staff/calendar" className="text-[10px] font-black text-amber-600 uppercase tracking-widest hover:text-amber-700 flex items-center gap-1 transition">
              View Full Calendar <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* POMODORO */}
        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${pomMode === "work" ? "bg-indigo-50" : "bg-teal-50"}`}>
                {pomMode === "work" ? <Timer className="w-4 h-4 text-indigo-600" /> : <Coffee className="w-4 h-4 text-teal-600" />}
              </div>
              <h3 className="font-black text-sm text-charcoal-900 tracking-tight uppercase">Pomodoro</h3>
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(pomSessions, 4) }).map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-indigo-400" />
              ))}
              {pomSessions > 4 && <span className="text-[10px] font-black text-indigo-500 ml-1">+{pomSessions - 4}</span>}
            </div>
          </div>
          <div className={`text-center py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${pomMode === "work" ? "bg-indigo-50 text-indigo-600" : "bg-teal-50 text-teal-600"}`}>
            {pomMode === "work" ? "🎯 Focus Session" : "☕ Short Break"}
          </div>
          <div className="flex flex-col items-center gap-3">
            <span className={`text-5xl font-black tracking-tighter tabular-nums ${pomMode === "work" ? "text-indigo-700" : "text-teal-600"}`}>
              {pomMins}:{pomSecs}
            </span>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-1000 ${pomMode === "work" ? "bg-indigo-500" : "bg-teal-500"}`}
                style={{ width: `${pomPct}%` }} />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setPomRunning(r => !r)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition shadow-sm ${
                pomMode === "work" ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "bg-teal-600 hover:bg-teal-700 text-white"
              }`}>
              {pomRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {pomRunning ? "Pause" : "Start"}
            </button>
            <button onClick={pomReset} aria-label="Reset timer" className="w-9 h-9 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl flex items-center justify-center transition">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-400 font-medium">
            {pomSessions} session{pomSessions !== 1 ? "s" : ""} completed today
          </p>
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
                           onClick={() => updateRequestStatus(req._id, 'denied')}
                           className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl text-[11px] uppercase tracking-widest hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all active:scale-95"
                         >
                            Deny
                         </button>
                         <button 
                           onClick={() => updateRequestStatus(req._id, 'approved')}
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
