"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { GlowCard } from "@/components/ui/GlowCard";
import { cn } from "@/lib/cn";
import {
  NotebookPen,
  Plus,
  Search,
  X,
  ChevronDown,
  Clock,
  User,
  Tag,
  FileText,
  CheckCircle2,
  AlertCircle,
  Save,
  Trash2,
  Filter,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────

type NoteType = "Progress" | "Intake" | "Crisis" | "Assessment" | "Discharge" | "Contact";
type NoteStatus = "draft" | "finalized";

interface CaseNote {
  id: string;
  clientId: string;
  clientName: string;
  date: string;
  type: NoteType;
  summary: string;
  content: string;
  author: string;
  tags: string[];
  status: NoteStatus;
}

// ─── Static seed data ────────────────────────────────────────────────────────

const SEED_NOTES: CaseNote[] = [
  {
    id: "cn-001",
    clientId: "c-101",
    clientName: "Alex Rivera",
    date: "2025-07-10",
    type: "Progress",
    summary: "Weekly check-in — housing stability improving",
    content:
      "Client reports stable housing for the past 30 days. Employment application submitted to three local employers. Mood appears improved; no crisis indicators noted. Next session scheduled for 2025-07-17.",
    author: "Staff Member",
    tags: ["housing", "employment", "check-in"],
    status: "finalized",
  },
  {
    id: "cn-002",
    clientId: "c-102",
    clientName: "Jordan Lee",
    date: "2025-07-08",
    type: "Intake",
    summary: "Initial intake completed — transition-age youth",
    content:
      "Completed full intake assessment. Client is 21 years old, recently aged out of foster care. Identified immediate needs: stable housing, benefits enrollment, and educational re-engagement. Goal plan drafted and signed.",
    author: "Staff Member",
    tags: ["intake", "youth", "housing", "benefits"],
    status: "finalized",
  },
  {
    id: "cn-003",
    clientId: "c-103",
    clientName: "Morgan Patel",
    date: "2025-07-12",
    type: "Crisis",
    summary: "Crisis intervention — housing loss",
    content:
      "Client contacted office in distress after receiving eviction notice. Coordinated emergency hotel voucher through county. Submitted priority housing application. Follow-up call scheduled for 2025-07-13.",
    author: "Staff Member",
    tags: ["crisis", "eviction", "emergency-housing"],
    status: "finalized",
  },
  {
    id: "cn-004",
    clientId: "c-101",
    clientName: "Alex Rivera",
    date: "2025-07-14",
    type: "Contact",
    summary: "Phone contact — employment update",
    content: "Brief call. Client confirmed interview scheduled for 2025-07-16 at Sunrise Logistics.",
    author: "Staff Member",
    tags: ["employment", "phone"],
    status: "draft",
  },
];

const NOTE_TYPES: NoteType[] = ["Progress", "Intake", "Crisis", "Assessment", "Discharge", "Contact"];

const TYPE_COLORS: Record<NoteType, string> = {
  Progress: "bg-sky-900/50 text-sky-300",
  Intake: "bg-teal-900/50 text-teal-300",
  Crisis: "bg-red-900/50 text-red-300",
  Assessment: "bg-amber-900/50 text-amber-300",
  Discharge: "bg-purple-900/50 text-purple-300",
  Contact: "bg-slate-700/60 text-slate-300",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateId() {
  return `cn-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function today() {
  return new Date().toISOString().split("T")[0];
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: NoteType }) {
  return (
    <span className={cn("rounded px-2 py-0.5 text-[11px] font-semibold", TYPE_COLORS[type])}>
      {type}
    </span>
  );
}

function StatusBadge({ status }: { status: NoteStatus }) {
  return (
    <span
      className={cn(
        "flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-semibold",
        status === "finalized"
          ? "bg-green-900/50 text-green-300"
          : "bg-yellow-900/40 text-yellow-300"
      )}
    >
      {status === "finalized" ? (
        <CheckCircle2 size={10} />
      ) : (
        <AlertCircle size={10} />
      )}
      {status === "finalized" ? "Finalized" : "Draft"}
    </span>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function StaffCaseNotesPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [notes, setNotes] = useState<CaseNote[]>(SEED_NOTES);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<NoteType | "All">("All");
  const [filterStatus, setFilterStatus] = useState<NoteStatus | "All">("All");
  const [selectedNote, setSelectedNote] = useState<CaseNote | null>(null);
  const [showModal, setShowModal] = useState(false);

  // New-note form state
  const [form, setForm] = useState<Omit<CaseNote, "id" | "author">>({
    clientId: "",
    clientName: "",
    date: today(),
    type: "Progress",
    summary: "",
    content: "",
    tags: [],
    status: "draft",
  });
  const [tagInput, setTagInput] = useState("");
  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/portal/staff/auth");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) return null;

  // ── Filtered note list ─────────────────────────────────────────────────────
  const filtered = notes.filter((n) => {
    const matchSearch =
      search === "" ||
      n.clientName.toLowerCase().includes(search.toLowerCase()) ||
      n.summary.toLowerCase().includes(search.toLowerCase()) ||
      n.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchType = filterType === "All" || n.type === filterType;
    const matchStatus = filterStatus === "All" || n.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  // Sort newest first
  const sorted = [...filtered].sort((a, b) => b.date.localeCompare(a.date));

  // ── Handlers ───────────────────────────────────────────────────────────────
  function openNew() {
    setForm({ clientId: "", clientName: "", date: today(), type: "Progress", summary: "", content: "", tags: [], status: "draft" });
    setTagInput("");
    setSelectedNote(null);
    setShowModal(true);
  }

  function openEdit(note: CaseNote) {
    setForm({ clientId: note.clientId, clientName: note.clientName, date: note.date, type: note.type, summary: note.summary, content: note.content, tags: [...note.tags], status: note.status });
    setTagInput("");
    setSelectedNote(note);
    setShowModal(true);
  }

  function saveNote(asDraft: boolean) {
    const status: NoteStatus = asDraft ? "draft" : "finalized";
    if (selectedNote) {
      setNotes((prev) =>
        prev.map((n) => (n.id === selectedNote.id ? { ...n, ...form, status } : n))
      );
    } else {
      const newNote: CaseNote = { ...form, status, id: generateId(), author: "Staff Member" };
      setNotes((prev) => [newNote, ...prev]);
    }
    setShowModal(false);
  }

  function deleteNote(id: string) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (selectedNote?.id === id) setShowModal(false);
  }

  function addTag() {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (t && !form.tags.includes(t)) {
      setForm((f) => ({ ...f, tags: [...f.tags, t] }));
    }
    setTagInput("");
  }

  function removeTag(tag: string) {
    setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }));
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-6 p-6 lg:p-8"
      >
        {/* Page header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-white">
              <NotebookPen size={22} className="text-sky-400" />
              Case Notes
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Document client interactions, progress, and critical events.
            </p>
          </div>
          <button
            onClick={openNew}
            className="flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-500 transition-colors"
          >
            <Plus size={16} />
            New Note
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Total Notes", value: notes.length, color: "text-sky-400" },
            { label: "Drafts", value: notes.filter((n) => n.status === "draft").length, color: "text-yellow-300" },
            { label: "Finalized", value: notes.filter((n) => n.status === "finalized").length, color: "text-green-300" },
            { label: "Clients", value: new Set(notes.map((n) => n.clientId)).size, color: "text-violet-300" },
          ].map(({ label, value, color }) => (
            <GlowCard key={label} className="p-4">
              <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</div>
              <div className={cn("mt-1 text-2xl font-extrabold", color)}>{value}</div>
            </GlowCard>
          ))}
        </div>

        {/* Search & filters */}
        <GlowCard className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by client, keyword, or tag…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg bg-slate-800/60 py-2 pl-9 pr-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <div className="relative">
                <Filter size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as NoteType | "All")}
                  className="appearance-none rounded-lg bg-slate-800/60 py-2 pl-8 pr-6 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500"
                >
                  <option value="All">All Types</option>
                  {NOTE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <ChevronDown size={10} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as NoteStatus | "All")}
                  className="appearance-none rounded-lg bg-slate-800/60 py-2 px-3 pr-6 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500"
                >
                  <option value="All">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="finalized">Finalized</option>
                </select>
                <ChevronDown size={10} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          </div>
        </GlowCard>

        {/* Notes list */}
        {sorted.length === 0 ? (
          <GlowCard className="flex flex-col items-center gap-3 py-16 text-center">
            <FileText size={32} className="text-slate-600" />
            <p className="text-slate-400">No case notes found.</p>
            <button
              onClick={openNew}
              className="mt-1 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-500 transition-colors"
            >
              Create your first note
            </button>
          </GlowCard>
        ) : (
          <div className="space-y-3">
            {sorted.map((note, i) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
              >
                <div onClick={() => openEdit(note)}>
                <GlowCard
                  className="cursor-pointer p-4 hover:border-sky-700/40 transition-colors"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-white">{note.clientName}</span>
                        <TypeBadge type={note.type} />
                        <StatusBadge status={note.status} />
                      </div>
                      <p className="mt-1 text-sm text-slate-300">{note.summary}</p>
                      {note.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {note.tags.map((tag) => (
                            <span
                              key={tag}
                              className="flex items-center gap-0.5 rounded bg-slate-700/60 px-1.5 py-0.5 text-[10px] text-slate-400"
                            >
                              <Tag size={9} />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500 sm:flex-col sm:items-end">
                      <Clock size={11} />
                      <span>{note.date}</span>
                    </div>
                  </div>
                </GlowCard>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* ─── Note Modal ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 pt-12 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowModal(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-2xl rounded-2xl border border-slate-700/60 bg-slate-900 p-6 shadow-2xl"
            >
              {/* Modal header */}
              <div className="mb-5 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-extrabold text-white">
                  <NotebookPen size={18} className="text-sky-400" />
                  {selectedNote ? "Edit Case Note" : "New Case Note"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <div className="space-y-4">
                {/* Client name + date row */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-400">
                      <User size={11} className="mr-1 inline" />Client Name
                    </label>
                    <input
                      type="text"
                      placeholder="Full name"
                      value={form.clientName}
                      onChange={(e) => setForm((f) => ({ ...f, clientName: e.target.value }))}
                      className="w-full rounded-lg bg-slate-800/60 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-400">
                      <Clock size={11} className="mr-1 inline" />Date
                    </label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                      className="w-full rounded-lg bg-slate-800/60 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                </div>

                {/* Note type */}
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-400">Note Type</label>
                  <div className="flex flex-wrap gap-2">
                    {NOTE_TYPES.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, type: t }))}
                        className={cn(
                          "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                          form.type === t
                            ? "bg-sky-600 text-white"
                            : "bg-slate-800/60 text-slate-400 hover:text-white"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-400">Summary</label>
                  <input
                    type="text"
                    placeholder="One-line summary of this note"
                    value={form.summary}
                    onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
                    className="w-full rounded-lg bg-slate-800/60 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-400">Note Content</label>
                  <textarea
                    ref={contentRef}
                    rows={6}
                    placeholder="Document the interaction, observations, action steps, and follow-ups…"
                    value={form.content}
                    onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                    className="w-full resize-none rounded-lg bg-slate-800/60 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-400">
                    <Tag size={11} className="mr-1 inline" />Tags
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add tag & press Enter"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                      className="flex-1 rounded-lg bg-slate-800/60 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="rounded-lg bg-slate-700 px-3 py-2 text-xs text-slate-300 hover:bg-slate-600 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  {form.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {form.tags.map((tag) => (
                        <span
                          key={tag}
                          className="flex items-center gap-1 rounded bg-slate-700/60 px-2 py-0.5 text-xs text-slate-300"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="text-slate-500 hover:text-red-400 transition-colors"
                          >
                            <X size={10} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer actions */}
              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-2">
                  {selectedNote && (
                    <button
                      type="button"
                      onClick={() => deleteNote(selectedNote.id)}
                      className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-950/40 transition-colors"
                    >
                      <Trash2 size={13} />
                      Delete
                    </button>
                  )}
                </div>
                <div className="flex gap-2 sm:ml-auto">
                  <button
                    type="button"
                    onClick={() => saveNote(true)}
                    className="flex items-center gap-1.5 rounded-lg bg-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-600 transition-colors"
                  >
                    <Save size={13} />
                    Save Draft
                  </button>
                  <button
                    type="button"
                    onClick={() => saveNote(false)}
                    disabled={!form.clientName || !form.summary || !form.content}
                    className="flex items-center gap-1.5 rounded-lg bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-500 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <CheckCircle2 size={13} />
                    Finalize Note
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
