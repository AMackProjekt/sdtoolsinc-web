"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import {
  PenLine,
  Smile,
  Frown,
  Zap,
  Heart,
  Battery,
  Trash2,
  ChevronDown,
  ChevronUp,
  Plus,
  X,
} from "lucide-react";

type Mood = "Grateful" | "Productive" | "Hopeful" | "Challenged" | "Tired";

interface JournalEntry {
  id: string;
  date: string;
  mood: Mood;
  title: string;
  body: string;
  createdAt: string;
}

const MOOD_CONFIG: Record<Mood, { icon: React.ElementType; color: string; bg: string }> = {
  Grateful:   { icon: Heart,   color: "text-pink-400",   bg: "bg-pink-500/10 border-pink-500/20" },
  Productive: { icon: Zap,     color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
  Hopeful:    { icon: Smile,   color: "text-teal-400",   bg: "bg-teal-500/10 border-teal-500/20" },
  Challenged: { icon: Frown,   color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
  Tired:      { icon: Battery, color: "text-slate-400",  bg: "bg-slate-500/10 border-slate-500/20" },
};

const SEED_ENTRIES: JournalEntry[] = [
  {
    id: "1",
    date: "2025-07-14",
    mood: "Hopeful",
    title: "Starting fresh",
    body: "Today I took the first step toward completing my course. It feels good to begin. Looking forward to what's next.",
    createdAt: new Date("2025-07-14T09:30:00").toISOString(),
  },
  {
    id: "2",
    date: "2025-07-13",
    mood: "Grateful",
    title: "Support system check-in",
    body: "Had a great conversation with my case manager today. Feeling supported and seen. Grateful for this opportunity.",
    createdAt: new Date("2025-07-13T14:00:00").toISOString(),
  },
];

const PROMPTS = [
  "What went well today?",
  "What's one thing I learned about myself?",
  "What am I looking forward to tomorrow?",
  "What challenge did I face, and how did I handle it?",
  "What am I proud of this week?",
];

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>(SEED_ENTRIES);
  const [showForm, setShowForm] = useState(false);
  const [filterMood, setFilterMood] = useState<Mood | "All">("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [promptIdx, setPromptIdx] = useState(0);

  // Form state
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [mood, setMood] = useState<Mood>("Hopeful");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const filtered = useMemo(() => {
    const base = filterMood === "All" ? entries : entries.filter((e) => e.mood === filterMood);
    return [...base].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [entries, filterMood]);

  const handleSave = () => {
    if (!title.trim() || !body.trim()) return;
    const entry: JournalEntry = {
      id: Date.now().toString(),
      date,
      mood,
      title: title.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    };
    setEntries((prev) => [entry, ...prev]);
    setTitle("");
    setBody("");
    setMood("Hopeful");
    setDate(new Date().toISOString().split("T")[0]);
    setShowForm(false);
    setExpandedId(entry.id);
  };

  const handleDelete = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  return (
    <div className="min-h-screen bg-bg p-6 md:p-10">
      {/* Header */}
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
              <PenLine className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Daily Journal</h1>
              <p className="text-sm text-slate-400">{entries.length} {entries.length === 1 ? "entry" : "entries"} · Private &amp; secure</p>
            </div>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setPromptIdx(Math.floor(Math.random() * PROMPTS.length)); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500 text-slate-900 font-bold text-sm hover:bg-teal-400 transition"
          >
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? "Cancel" : "New Entry"}
          </button>
        </div>

        {/* New Entry Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden mb-6"
            >
              <div className="rounded-2xl border border-teal-800/40 bg-slate-900/80 backdrop-blur-sm p-6 space-y-4">
                <p className="text-xs font-semibold tracking-[0.15em] text-teal-400/70 uppercase">Reflection Prompt</p>
                <p className="text-slate-300 italic text-sm">✏️ &nbsp;{PROMPTS[promptIdx]}</p>

                <div className="flex gap-3 flex-wrap">
                  {(Object.keys(MOOD_CONFIG) as Mood[]).map((m) => {
                    const cfg = MOOD_CONFIG[m];
                    const Icon = cfg.icon;
                    return (
                      <button
                        key={m}
                        onClick={() => setMood(m)}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition",
                          mood === m ? `${cfg.bg} ${cfg.color} border-current` : "border-slate-700 text-slate-400 hover:border-slate-500"
                        )}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {m}
                      </button>
                    );
                  })}
                </div>

                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Entry title..."
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 text-white text-sm px-4 py-3 focus:outline-none focus:border-teal-500 placeholder:text-slate-500 transition"
                />
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={5}
                  placeholder="Write freely... this is your safe space."
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 text-white text-sm px-4 py-3 focus:outline-none focus:border-teal-500 placeholder:text-slate-500 resize-none transition"
                />

                <div className="flex items-center justify-between">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-sm px-3 py-2 focus:outline-none focus:border-teal-500"
                  />
                  <button
                    onClick={handleSave}
                    disabled={!title.trim() || !body.trim()}
                    className="px-5 py-2 rounded-xl bg-teal-500 text-slate-900 font-bold text-sm hover:bg-teal-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    Save Entry
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mood filters */}
        <div className="flex gap-2 flex-wrap mb-6">
          {(["All", ...Object.keys(MOOD_CONFIG)] as (Mood | "All")[]).map((m) => (
            <button
              key={m}
              onClick={() => setFilterMood(m)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-semibold border transition",
                filterMood === m
                  ? "bg-teal-500 text-slate-900 border-teal-500"
                  : "border-slate-700 text-slate-400 hover:border-slate-500"
              )}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Entries */}
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 text-slate-500"
              >
                <PenLine className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No entries yet</p>
                <p className="text-sm mt-1">Click &quot;New Entry&quot; to start writing</p>
              </motion.div>
            )}
            {filtered.map((entry) => {
              const cfg = MOOD_CONFIG[entry.mood];
              const Icon = cfg.icon;
              const isExpanded = expandedId === entry.id;
              return (
                <motion.div
                  key={entry.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                    className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-800/40 transition"
                  >
                    <span className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", cfg.bg)}>
                      <Icon className={cn("w-4 h-4", cfg.color)} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{entry.title}</p>
                      <p className="text-xs text-slate-500">{formatDate(entry.date)}</p>
                    </div>
                    <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full border", cfg.bg, cfg.color)}>
                      {entry.mood}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                  </button>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-1 border-t border-slate-800">
                          <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{entry.body}</p>
                          <div className="flex justify-end mt-4">
                            <button
                              onClick={() => handleDelete(entry.id)}
                              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-400 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
