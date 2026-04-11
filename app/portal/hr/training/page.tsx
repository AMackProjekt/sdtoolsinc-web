"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";
import { cn } from "@/lib/cn";
import {
  BookOpen, CheckCircle2, Clock, Users, X, Filter,
  ChevronDown, ChevronUp, Award, BarChart2,
} from "lucide-react";

// ─── Types & Mock Data ────────────────────────────────────────────────────────

type EnrollStatus = "not-enrolled" | "enrolled" | "in-progress" | "completed";
type CourseCategory = "Mandatory" | "Professional Dev" | "Optional";

interface Course {
  id: string;
  title: string;
  category: CourseCategory;
  duration: string;
  description: string;
  provider: string;
}

interface Enrollment {
  employeeId: string;
  employee: string;
  dept: string;
  records: { courseId: string; status: EnrollStatus; completedDate?: string; progress?: number }[];
}

const COURSES: Course[] = [
  { id: "c1", title: "HIPAA & Privacy Compliance",    category: "Mandatory",       duration: "1 hr",  description: "Federal privacy law fundamentals for healthcare and social services.", provider: "Compliance HQ" },
  { id: "c2", title: "Workplace Violence Prevention", category: "Mandatory",       duration: "2 hrs", description: "Recognize, respond, and report workplace violence risks.", provider: "SafeWork Institute" },
  { id: "c3", title: "CPR & First Aid",               category: "Mandatory",       duration: "4 hrs", description: "Hands-on CPR certification and first aid protocols.", provider: "Red Cross" },
  { id: "c4", title: "Trauma-Informed Care",          category: "Professional Dev", duration: "3 hrs", description: "Support clients with trauma histories using evidence-based approaches.", provider: "SAMHSA" },
  { id: "c5", title: "Cultural Competency",           category: "Mandatory",       duration: "2 hrs", description: "Serving diverse populations with equity and cultural sensitivity.", provider: "DEI Academy" },
  { id: "c6", title: "Leadership Foundations",        category: "Optional",        duration: "8 hrs", description: "Core leadership skills for emerging managers.", provider: "SLD Training" },
  { id: "c7", title: "Motivational Interviewing",     category: "Professional Dev", duration: "4 hrs", description: "Client-centered conversation techniques to drive behavior change.", provider: "MINT Network" },
  { id: "c8", title: "Data Systems & Reporting",      category: "Mandatory",       duration: "2 hrs", description: "Using organizational data systems, dashboards, and compliance reporting.", provider: "Internal" },
];

const INITIAL_ENROLLMENTS: Enrollment[] = [
  {
    employeeId: "s1", employee: "Marcus Johnson", dept: "Client Services",
    records: [
      { courseId: "c1", status: "completed", completedDate: "Jan 5, 2025" },
      { courseId: "c2", status: "completed", completedDate: "Jan 10, 2025" },
      { courseId: "c3", status: "enrolled",  progress: 0 },
      { courseId: "c4", status: "completed", completedDate: "Mar 15, 2025" },
      { courseId: "c5", status: "in-progress", progress: 60 },
      { courseId: "c6", status: "not-enrolled" },
      { courseId: "c7", status: "in-progress", progress: 40 },
      { courseId: "c8", status: "completed", completedDate: "Feb 20, 2025" },
    ],
  },
  {
    employeeId: "s2", employee: "Priya Sharma", dept: "Operations",
    records: [
      { courseId: "c1", status: "completed", completedDate: "Dec 10, 2024" },
      { courseId: "c2", status: "completed", completedDate: "Jan 5, 2025" },
      { courseId: "c3", status: "completed", completedDate: "Apr 5, 2025" },
      { courseId: "c4", status: "completed", completedDate: "Feb 1, 2025" },
      { courseId: "c5", status: "completed", completedDate: "Dec 15, 2024" },
      { courseId: "c6", status: "in-progress", progress: 75 },
      { courseId: "c7", status: "completed", completedDate: "Mar 20, 2025" },
      { courseId: "c8", status: "completed", completedDate: "Jan 15, 2025" },
    ],
  },
  {
    employeeId: "s3", employee: "Devon Clarke", dept: "Client Services",
    records: [
      { courseId: "c1", status: "completed", completedDate: "Feb 1, 2025" },
      { courseId: "c2", status: "enrolled",  progress: 0 },
      { courseId: "c3", status: "not-enrolled" },
      { courseId: "c4", status: "in-progress", progress: 30 },
      { courseId: "c5", status: "completed", completedDate: "Feb 5, 2025" },
      { courseId: "c6", status: "not-enrolled" },
      { courseId: "c7", status: "not-enrolled" },
      { courseId: "c8", status: "enrolled", progress: 0 },
    ],
  },
  {
    employeeId: "s4", employee: "Sandra Nguyen", dept: "Technology",
    records: [
      { courseId: "c1", status: "completed", completedDate: "Oct 5, 2024" },
      { courseId: "c2", status: "completed", completedDate: "Nov 1, 2024" },
      { courseId: "c3", status: "not-enrolled" },
      { courseId: "c4", status: "not-enrolled" },
      { courseId: "c5", status: "completed", completedDate: "Oct 10, 2024" },
      { courseId: "c6", status: "not-enrolled" },
      { courseId: "c7", status: "not-enrolled" },
      { courseId: "c8", status: "completed", completedDate: "Oct 12, 2024" },
    ],
  },
  {
    employeeId: "s5", employee: "James Thornton", dept: "Finance",
    records: [
      { courseId: "c1", status: "completed", completedDate: "Jan 3, 2025" },
      { courseId: "c2", status: "completed", completedDate: "Jan 8, 2025" },
      { courseId: "c3", status: "completed", completedDate: "Mar 20, 2025" },
      { courseId: "c4", status: "not-enrolled" },
      { courseId: "c5", status: "completed", completedDate: "Jan 10, 2025" },
      { courseId: "c6", status: "completed", completedDate: "Feb 28, 2025" },
      { courseId: "c7", status: "not-enrolled" },
      { courseId: "c8", status: "completed", completedDate: "Jan 12, 2025" },
    ],
  },
  {
    employeeId: "s6", employee: "Aaliyah Brooks", dept: "Human Resources",
    records: [
      { courseId: "c1", status: "completed", completedDate: "Mar 1, 2025" },
      { courseId: "c2", status: "completed", completedDate: "Mar 5, 2025" },
      { courseId: "c3", status: "enrolled",  progress: 0 },
      { courseId: "c4", status: "in-progress", progress: 50 },
      { courseId: "c5", status: "completed", completedDate: "Mar 8, 2025" },
      { courseId: "c6", status: "enrolled",  progress: 0 },
      { courseId: "c7", status: "enrolled",  progress: 0 },
      { courseId: "c8", status: "completed", completedDate: "Mar 10, 2025" },
    ],
  },
];

type ViewMode = "catalog" | "employees";
type CategoryFilter = "All" | CourseCategory;

const ENROLL_STYLES: Record<EnrollStatus, string> = {
  "not-enrolled": "bg-slate-700/40 text-slate-400",
  enrolled:       "bg-sky-900/40 text-sky-400",
  "in-progress":  "bg-amber-900/40 text-amber-400",
  completed:      "bg-emerald-900/40 text-emerald-400",
};

const CATEGORY_BADGE: Record<CourseCategory, string> = {
  "Mandatory":       "bg-red-900/40 text-red-400 border border-red-700/30",
  "Professional Dev":"bg-sky-900/40 text-sky-400 border border-sky-700/30",
  "Optional":        "bg-slate-700/40 text-slate-400 border border-slate-600/30",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function TrainingPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>(INITIAL_ENROLLMENTS);
  const [view, setView] = useState<ViewMode>("catalog");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("All");
  const [expandedEmp, setExpandedEmp] = useState<string | null>(null);

  const totalCompleted = enrollments.flatMap(e => e.records).filter(r => r.status === "completed").length;
  const totalRecords   = enrollments.flatMap(e => e.records).length;
  const mandatoryIds   = COURSES.filter(c => c.category === "Mandatory").map(c => c.id);
  const mandatoryCompleted = enrollments.flatMap(e =>
    e.records.filter(r => mandatoryIds.includes(r.courseId) && r.status === "completed")
  ).length;
  const mandatoryTotal = enrollments.length * mandatoryIds.length;
  const mandatoryPct   = Math.round((mandatoryCompleted / mandatoryTotal) * 100);
  const avgCompletion  = Math.round((totalCompleted / totalRecords) * 100);

  function enroll(employeeId: string, courseId: string) {
    setEnrollments(prev => prev.map(e => {
      if (e.employeeId !== employeeId) return e;
      return { ...e, records: e.records.map(r => r.courseId === courseId ? { ...r, status: "enrolled", progress: 0 } : r) };
    }));
  }

  function markComplete(employeeId: string, courseId: string) {
    setEnrollments(prev => prev.map(e => {
      if (e.employeeId !== employeeId) return e;
      return { ...e, records: e.records.map(r => r.courseId === courseId ? { ...r, status: "completed", completedDate: "Jul 14, 2025", progress: 100 } : r) };
    }));
  }

  const filteredCourses = categoryFilter === "All" ? COURSES : COURSES.filter(c => c.category === categoryFilter);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Training & Development</h1>
          <p className="mt-1 text-sm text-slate-400">Track mandatory training, professional development, and course completions</p>
        </div>
        <div className="flex gap-2">
          {(["catalog", "employees"] as ViewMode[]).map(m => (
            <button
              key={m}
              onClick={() => setView(m)}
              className={cn(
                "rounded-lg border px-4 py-2 text-xs font-semibold capitalize transition",
                view === m
                  ? "border-amber-500 bg-amber-600 text-white"
                  : "border-border bg-slate-800/40 text-slate-400 hover:text-white"
              )}
            >
              {m === "catalog" ? "Course Catalog" : "By Employee"}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {[
          { label: "Total Completions",    value: totalCompleted,     color: "text-white" },
          { label: "Mandatory Compliance", value: `${mandatoryPct}%`, color: "text-amber-400" },
          { label: "Avg Completion Rate",  value: `${avgCompletion}%`,color: "text-emerald-400" },
        ].map(({ label, value, color }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <GlowCard className="p-4">
              <div className={cn("text-2xl font-extrabold", color)}>{value}</div>
              <div className="mt-0.5 text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</div>
            </GlowCard>
          </motion.div>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {(["All", "Mandatory", "Professional Dev", "Optional"] as CategoryFilter[]).map(c => (
          <button
            key={c}
            onClick={() => setCategoryFilter(c)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-semibold transition border",
              categoryFilter === c
                ? "border-amber-500 bg-amber-600 text-white"
                : "border-border bg-slate-800/40 text-slate-400 hover:text-white"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Course Catalog View */}
      {view === "catalog" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredCourses.map(course => {
            const allRecords = enrollments.flatMap(e => e.records.filter(r => r.courseId === course.id));
            const completed  = allRecords.filter(r => r.status === "completed").length;
            const inProg     = allRecords.filter(r => r.status === "in-progress").length;
            return (
              <motion.div key={course.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <GlowCard className="p-5 h-full flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-900/30">
                        <BookOpen size={16} className="text-amber-400" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm leading-tight">{course.title}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{course.provider} · {course.duration}</div>
                      </div>
                    </div>
                    <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold", CATEGORY_BADGE[course.category])}>
                      {course.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4 flex-1">{course.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex gap-3">
                      <span className="text-emerald-400"><span className="font-bold">{completed}</span> done</span>
                      <span className="text-amber-400"><span className="font-bold">{inProg}</span> in progress</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400">
                      <Users size={11} />
                      <span>{enrollments.length} staff</span>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-3 h-1.5 w-full rounded-full bg-slate-700">
                    <div
                      className="h-1.5 rounded-full bg-amber-500 transition-all duration-700"
                      style={{ width: `${Math.round((completed / enrollments.length) * 100)}%` }}
                    />
                  </div>
                  <div className="mt-1 text-right text-xs text-slate-500">
                    {Math.round((completed / enrollments.length) * 100)}% completion
                  </div>
                </GlowCard>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Employee View */}
      {view === "employees" && (
        <div className="space-y-3">
          {enrollments.map(emp => {
            const empCompleted = emp.records.filter(r => r.status === "completed").length;
            const empTotal     = emp.records.length;
            const pct          = Math.round((empCompleted / empTotal) * 100);
            const expanded     = expandedEmp === emp.employeeId;
            const shown        = categoryFilter === "All"
              ? emp.records
              : emp.records.filter(r => {
                  const course = COURSES.find(c => c.id === r.courseId);
                  return course?.category === categoryFilter;
                });

            return (
              <GlowCard key={emp.employeeId} className="p-0 overflow-hidden">
                {/* Row header */}
                <button
                  className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-slate-800/20 transition"
                  onClick={() => setExpandedEmp(expanded ? null : emp.employeeId)}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-900/40 text-xs font-bold text-amber-300">
                    {emp.employee.split(" ").map(w => w[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-white">{emp.employee}</div>
                    <div className="text-xs text-slate-400">{emp.dept}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2">
                      <div className="w-28 h-1.5 rounded-full bg-slate-700">
                        <div className="h-1.5 rounded-full bg-amber-500 transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-slate-400">{pct}%</span>
                    </div>
                    <span className="text-xs text-slate-400">{empCompleted}/{empTotal}</span>
                    {expanded ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
                  </div>
                </button>

                {/* Expanded courses */}
                <AnimatePresence>
                  {expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                      className="overflow-hidden border-t border-border"
                    >
                      <div className="p-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {shown.map(record => {
                          const course = COURSES.find(c => c.id === record.courseId)!;
                          return (
                            <div key={record.courseId} className="flex items-center justify-between rounded-lg border border-border bg-slate-800/30 p-3">
                              <div className="min-w-0 flex-1 pr-2">
                                <div className="truncate text-xs font-semibold text-white">{course.title}</div>
                                <div className={cn("mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold", ENROLL_STYLES[record.status])}>
                                  {record.status === "completed" && record.completedDate
                                    ? `Done: ${record.completedDate}`
                                    : record.status.replace("-", " ")}
                                </div>
                              </div>
                              <div className="flex gap-1">
                                {record.status === "not-enrolled" && (
                                  <button
                                    onClick={() => enroll(emp.employeeId, record.courseId)}
                                    className="rounded-md px-2 py-1 text-xs font-semibold bg-sky-900/40 text-sky-400 hover:bg-sky-800/50 transition"
                                  >
                                    Enroll
                                  </button>
                                )}
                                {(record.status === "enrolled" || record.status === "in-progress") && (
                                  <button
                                    onClick={() => markComplete(emp.employeeId, record.courseId)}
                                    className="rounded-md px-2 py-1 text-xs font-semibold bg-emerald-900/40 text-emerald-400 hover:bg-emerald-800/50 transition"
                                  >
                                    Complete
                                  </button>
                                )}
                                {record.status === "completed" && (
                                  <Award size={14} className="text-amber-400" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                        {shown.length === 0 && (
                          <div className="col-span-full text-center py-4 text-xs text-slate-500">No courses in this category.</div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlowCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
