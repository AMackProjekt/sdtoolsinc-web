"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { GlowCard } from "@/components/ui/GlowCard";
import { cn } from "@/lib/cn";
import {
  NotebookPen,
  Search,
  ChevronDown,
  Clock,
  Tag,
  FileText,
  CheckCircle2,
  AlertCircle,
  Filter,
  User,
  Users,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type NoteType = "Progress" | "Intake" | "Crisis" | "Assessment" | "Discharge" | "Contact";
type NoteStatus = "draft" | "finalized";

interface CaseNote {
  id: string;
  clientId: string;
  clientName: string;
  staffId: string;
  staffName: string;
  date: string;
  type: NoteType;
  summary: string;
  content: string;
  tags: string[];
  status: NoteStatus;
}

// ─── Seed data ────────────────────────────────────────────────────────────────

const ALL_NOTES: CaseNote[] = [
  {
    id: "cn-001",
    clientId: "c-101",
    clientName: "Alex Rivera",
    staffId: "s-01",
    staffName: "Jamie Torres",
    date: "2025-07-10",
    type: "Progress",
    summary: "Weekly check-in — housing stability improving",
    content:
      "Client reports stable housing for the past 30 days. Employment application submitted to three local employers. Mood appears improved; no crisis indicators noted.",
    tags: ["housing", "employment", "check-in"],
    status: "finalized",
  },
  {
    id: "cn-002",
    clientId: "c-102",
    clientName: "Jordan Lee",
    staffId: "s-02",
    staffName: "Priya Nair",
    date: "2025-07-08",
    type: "Intake",
    summary: "Initial intake completed — transition-age youth",
    content:
      "Completed full intake assessment. Client is 21 years old, recently aged out of foster care. Identified immediate needs: stable housing, benefits enrollment, education.",
    tags: ["intake", "youth", "housing", "benefits"],
    status: "finalized",
  },
  {
    id: "cn-003",
    clientId: "c-103",
    clientName: "Morgan Patel",
    staffId: "s-01",
    staffName: "Jamie Torres",
    date: "2025-07-12",
    type: "Crisis",
    summary: "Crisis intervention — housing loss",
    content:
      "Client contacted office in distress after receiving eviction notice. Coordinated emergency hotel voucher through county. Submitted priority housing application.",
    tags: ["crisis", "eviction", "emergency-housing"],
    status: "finalized",
  },
  {
    id: "cn-004",
    clientId: "c-101",
    clientName: "Alex Rivera",
    staffId: "s-01",
    staffName: "Jamie Torres",
    date: "2025-07-14",
    type: "Contact",
    summary: "Phone contact — employment update",
    content: "Brief call. Client confirmed interview scheduled for 2025-07-16.",
    tags: ["employment", "phone"],
    status: "draft",
  },
  {
    id: "cn-005",
    clientId: "c-104",
    clientName: "Casey Nguyen",
    staffId: "s-03",
    staffName: "Marcus Webb",
    date: "2025-07-09",
    type: "Assessment",
    summary: "6-month re-assessment completed",
    content:
      "Formal re-assessment using SPDAT tool. Scores improved from 14 to 8. Client has maintained sobriety for 90 days. Referral to permanent supportive housing waitlist submitted.",
    tags: ["assessment", "spdat", "housing"],
    status: "finalized",
  },
  {
    id: "cn-006",
    clientId: "c-105",
    clientName: "Reese Alvarez",
    staffId: "s-02",
    staffName: "Priya Nair",
    date: "2025-07-13",
    type: "Discharge",
    summary: "Successful discharge — permanent housing secured",
    content:
      "Client secured permanent housing unit at Horizon Apartments. Discharge paperwork completed. Warm handoff to property manager completed. Follow-up call in 30 days.",
    tags: ["discharge", "permanent-housing", "success"],
    status: "finalized",
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

// ─── Sub-components ───────────────────────────────────────────────────────────

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
      {status === "finalized" ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
      {status === "finalized" ? "Finalized" : "Draft"}
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AdminCaseNotesPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [filterStaff, setFilterStaff] = useState("All");
  const [filterType, setFilterType] = useState<NoteType | "All">("All");
  const [filterStatus, setFilterStatus] = useState<NoteStatus | "All">("All");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/portal/admin/auth");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) return null;

  // Derived lists
  const staffNames = ["All", ...Array.from(new Set(ALL_NOTES.map((n) => n.staffName))).sort()];

  const filtered = ALL_NOTES.filter((n) => {
    const q = search.toLowerCase();
    const matchSearch =
      q === "" ||
      n.clientName.toLowerCase().includes(q) ||
      n.staffName.toLowerCase().includes(q) ||
      n.summary.toLowerCase().includes(q) ||
      n.tags.some((t) => t.includes(q));
    const matchStaff = filterStaff === "All" || n.staffName === filterStaff;
    const matchType = filterType === "All" || n.type === filterType;
    const matchStatus = filterStatus === "All" || n.status === filterStatus;
    return matchSearch && matchStaff && matchType && matchStatus;
  });

  const sorted = [...filtered].sort((a, b) => b.date.localeCompare(a.date));

  // ── Type breakdown for stats ───────────────────────────────────────────────
  const typeBreakdown = NOTE_TYPES.map((t) => ({
    type: t,
    count: ALL_NOTES.filter((n) => n.type === t).length,
  })).filter((x) => x.count > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6 p-6 lg:p-8"
    >
      {/* Header */}
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-white">
          <NotebookPen size={22} className="text-violet-400" />
          Case Notes — Admin Oversight
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Read-only view of all staff case notes. Filter by staff member, note type, or date.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total Notes", value: ALL_NOTES.length, color: "text-violet-400" },
          { label: "Pending Drafts", value: ALL_NOTES.filter((n) => n.status === "draft").length, color: "text-yellow-300" },
          { label: "This Week", value: ALL_NOTES.filter((n) => n.date >= "2025-07-07").length, color: "text-sky-300" },
          { label: "Staff Members", value: new Set(ALL_NOTES.map((n) => n.staffId)).size, color: "text-teal-300" },
        ].map(({ label, value, color }) => (
          <GlowCard key={label} className="p-4">
            <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</div>
            <div className={cn("mt-1 text-2xl font-extrabold", color)}>{value}</div>
          </GlowCard>
        ))}
      </div>

      {/* Note type breakdown */}
      <GlowCard className="p-5">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
          <FileText size={13} />
          Notes by Type
        </div>
        <div className="flex flex-wrap gap-2">
          {typeBreakdown.map(({ type, count }) => (
            <button
              key={type}
              onClick={() => setFilterType(filterType === type ? "All" : type)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                filterType === type ? "ring-1 ring-violet-400/60" : "opacity-80 hover:opacity-100",
                TYPE_COLORS[type]
              )}
            >
              {type}
              <span className="rounded bg-black/20 px-1.5 py-0.5 font-bold">{count}</span>
            </button>
          ))}
        </div>
      </GlowCard>

      {/* Filters */}
      <GlowCard className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by client, staff, keyword, or tag…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg bg-slate-800/60 py-2 pl-9 pr-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {/* Staff filter */}
            <div className="relative">
              <Users size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={filterStaff}
                onChange={(e) => setFilterStaff(e.target.value)}
                className="appearance-none rounded-lg bg-slate-800/60 py-2 pl-8 pr-6 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-violet-500"
              >
                {staffNames.map((s) => <option key={s} value={s}>{s === "All" ? "All Staff" : s}</option>)}
              </select>
              <ChevronDown size={10} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>

            {/* Status filter */}
            <div className="relative">
              <Filter size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as NoteStatus | "All")}
                className="appearance-none rounded-lg bg-slate-800/60 py-2 pl-8 pr-6 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-violet-500"
              >
                <option value="All">All Status</option>
                <option value="draft">Draft</option>
                <option value="finalized">Finalized</option>
              </select>
              <ChevronDown size={10} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>
        <div className="mt-2 text-xs text-slate-500">
          Showing {sorted.length} of {ALL_NOTES.length} notes
        </div>
      </GlowCard>

      {/* Notes list */}
      {sorted.length === 0 ? (
        <GlowCard className="flex flex-col items-center gap-3 py-16 text-center">
          <FileText size={32} className="text-slate-600" />
          <p className="text-slate-400">No notes match the selected filters.</p>
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
              <GlowCard className="p-4">
                {/* Row header */}
                <button
                  className="w-full text-left"
                  onClick={() => setExpanded(expanded === note.id ? null : note.id)}
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-white">{note.clientName}</span>
                        <TypeBadge type={note.type} />
                        <StatusBadge status={note.status} />
                      </div>
                      <p className="mt-0.5 text-sm text-slate-300">{note.summary}</p>
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                        <User size={11} />
                        <span>{note.staffName}</span>
                        <span className="opacity-40">·</span>
                        <Clock size={11} />
                        <span>{note.date}</span>
                      </div>
                    </div>
                    <ChevronDown
                      size={14}
                      className={cn(
                        "mt-1 shrink-0 text-slate-500 transition-transform sm:mt-0",
                        expanded === note.id && "rotate-180"
                      )}
                    />
                  </div>
                </button>

                {/* Expanded content */}
                {expanded === note.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 space-y-3"
                  >
                    <div className="rounded-xl bg-slate-800/50 px-4 py-3 text-sm leading-relaxed text-slate-300 whitespace-pre-wrap">
                      {note.content}
                    </div>
                    {note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
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
                  </motion.div>
                )}
              </GlowCard>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
