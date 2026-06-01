"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation } from "convex/react";
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import {
  GraduationCap, ExternalLink, Plus, Trash2, X, Save, BookOpen, CheckCircle2,
} from "lucide-react";

const NICHE_URL = "https://my.nicheacademy.com/dreamsforchangeca";

const FEATURED_COURSES = [
  { name: "Housing Navigation Essentials",            category: "Housing"           },
  { name: "Trauma-Informed Care in Practice",         category: "Clinical"          },
  { name: "Motivational Interviewing (MI) Basics",    category: "Clinical"          },
  { name: "HMIS Data Quality & Compliance",           category: "Data & Compliance" },
  { name: "HIPAA for Nonprofit Staff",                category: "Compliance"        },
  { name: "Case Management Fundamentals",             category: "Case Management"   },
  { name: "Harm Reduction Strategies",                category: "Clinical"          },
  { name: "Diversity, Equity & Inclusion at Work",    category: "DEI"               },
  { name: "Safe Parking Program Best Practices",      category: "Program Specific"  },
  { name: "Crisis De-escalation Techniques",          category: "Safety"            },
  { name: "Mental Health First Aid",                  category: "Safety"            },
  { name: "Fiscal Management for Nonprofits",         category: "Operations"        },
];

const CATEGORY_COLORS: Record<string, string> = {
  Housing:         "bg-violet-100 text-violet-700",
  Clinical:        "bg-blue-100 text-blue-700",
  "Data & Compliance": "bg-amber-100 text-amber-700",
  Compliance:      "bg-amber-100 text-amber-700",
  "Case Management": "bg-teal-100 text-teal-700",
  DEI:             "bg-pink-100 text-pink-700",
  "Program Specific": "bg-emerald-100 text-emerald-700",
  Safety:          "bg-rose-100 text-rose-700",
  Operations:      "bg-slate-100 text-slate-600",
};

type TrainingEntry = {
  _id: Id<"trainingLog">;
  staffEmail: string;
  staffName: string;
  courseName: string;
  platform: string;
  completedDate: string;
  certificateUrl?: string;
};

const EMPTY_FORM = {
  courseName: "",
  platform: "Niche Academy",
  completedDate: new Date().toISOString().slice(0, 10),
  certificateUrl: "",
};

export default function AdminTrainingsPage() {
  const { data: session } = useSession();
  const allLog     = (useQuery(api.functions.listTrainingLog) ?? []) as TrainingEntry[];
  const addTraining    = useMutation(api.functions.addTrainingLog);
  const deleteTraining = useMutation(api.functions.deleteTrainingLog);

  const [adding, setAdding] = useState(false);
  const [form, setForm]     = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  async function handleAdd() {
    if (!form.courseName || !session?.user) return;
    setSaving(true);
    try {
      await addTraining({
        staffEmail: session.user.email ?? "",
        staffName:  session.user.name  ?? session.user.email ?? "",
        courseName: form.courseName,
        platform:   form.platform,
        completedDate: form.completedDate,
        certificateUrl: form.certificateUrl || undefined,
      });
      setForm(EMPTY_FORM);
      setAdding(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-violet-500" /> Workforce Trainings
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Access Niche Academy courses and track completed staff trainings across the organization
        </p>
      </div>

      {/* Niche Academy Launch Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 p-6 text-white shadow-lg">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 70% 50%, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-white/70 text-xs uppercase tracking-widest font-semibold mb-1">T.O.O.LS INC</p>
            <h2 className="text-2xl font-black">Niche Academy</h2>
            <p className="text-white/80 text-sm mt-1">
              Access your professional development courses, certifications, and learning paths
            </p>
          </div>
          <a
            href={NICHE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-white text-violet-700 rounded-xl font-bold text-sm hover:bg-violet-50 transition shadow"
          >
            Open Niche Academy <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Courses Available */}
      <div>
        <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
          <BookOpen className="w-4 h-4 text-violet-500" /> Available Courses
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FEATURED_COURSES.map((course) => (
            <a
              key={course.name}
              href={NICHE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 bg-white border border-slate-200 rounded-xl p-4 hover:border-violet-300 hover:shadow-sm transition group"
            >
              <GraduationCap className="w-4 h-4 text-slate-400 group-hover:text-violet-500 mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800 group-hover:text-violet-700 transition">{course.name}</p>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${CATEGORY_COLORS[course.category] ?? "bg-slate-100 text-slate-600"}`}>
                  {course.category}
                </span>
              </div>
            </a>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-3">
          Course availability may vary. Log in to Niche Academy to see your full course catalog.
        </p>
      </div>

      {/* All Staff Training Log */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> All Staff — Training Log
            <span className="text-xs font-normal text-slate-400">({allLog.length} records)</span>
          </h2>
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-violet-600 text-white rounded-xl text-xs font-semibold hover:bg-violet-700 transition"
          >
            <Plus className="w-3.5 h-3.5" /> Log My Training
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {["Staff Member", "Course", "Platform", "Completed", "Certificate", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allLog.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                      No training records yet. Be the first to log a completed course.
                    </td>
                  </tr>
                ) : (
                  allLog.map((entry) => (
                    <tr key={entry._id} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-800 text-xs">{entry.staffName}</p>
                        <p className="text-[11px] text-slate-400">{entry.staffEmail}</p>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-700 text-xs">{entry.courseName}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">
                          {entry.platform}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{entry.completedDate}</td>
                      <td className="px-4 py-3">
                        {entry.certificateUrl ? (
                          <a
                            href={entry.certificateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-violet-600 hover:underline flex items-center gap-1"
                          >
                            View <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {entry.staffEmail === session?.user?.email && (
                          <button
                            onClick={() => deleteTraining({ id: entry._id })}
                            className="p-1 text-slate-400 hover:text-rose-500 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Log Training Modal */}
      {adding && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-slate-800 text-lg">Log Completed Training</h2>
              <button onClick={() => setAdding(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Course Name *</label>
                <input
                  value={form.courseName}
                  onChange={(e) => setForm((f) => ({ ...f, courseName: e.target.value }))}
                  placeholder="e.g. Trauma-Informed Care"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Platform</label>
                  <select
                    value={form.platform}
                    onChange={(e) => setForm((f) => ({ ...f, platform: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white"
                  >
                    <option>Niche Academy</option>
                    <option>In-Person Training</option>
                    <option>Webinar</option>
                    <option>Conference</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Completion Date</label>
                  <input
                    type="date"
                    value={form.completedDate}
                    onChange={(e) => setForm((f) => ({ ...f, completedDate: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Certificate URL (optional)</label>
                <input
                  value={form.certificateUrl}
                  onChange={(e) => setForm((f) => ({ ...f, certificateUrl: e.target.value }))}
                  placeholder="https://…"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setAdding(false)}
                className="flex-1 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={saving || !form.courseName}
                className="flex-1 py-2 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
