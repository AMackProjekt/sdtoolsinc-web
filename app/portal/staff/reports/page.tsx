"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import {
  BarChart2,
  Download,
  Calendar,
  TrendingUp,
  Users,
  FileText,
  Clock,
  ChevronDown,
} from "lucide-react";

type ReportType = {
  id: string;
  label: string;
  description: string;
  category: string;
  icon: React.ElementType;
  color: string;
  bg: string;
};

const REPORT_TYPES: ReportType[] = [
  {
    id: "caseload",
    label: "Caseload Summary",
    description: "Overview of active, on-hold, completed, and inactive cases in your caseload.",
    category: "Case Management",
    icon: Users,
    color: "text-sky-400",
    bg: "bg-sky-900/30",
  },
  {
    id: "outcomes",
    label: "Participant Outcomes",
    description: "Goal completion rates, milestones reached, and program exit outcomes.",
    category: "Outcomes",
    icon: TrendingUp,
    color: "text-emerald-400",
    bg: "bg-emerald-900/30",
  },
  {
    id: "activity",
    label: "Activity Log Report",
    description: "Log of case notes, contacts, appointments, and interventions by date range.",
    category: "Activity",
    icon: Clock,
    color: "text-violet-400",
    bg: "bg-violet-900/30",
  },
  {
    id: "program",
    label: "Program Enrollment Report",
    description: "Enrollment and participation data broken down by program and cohort.",
    category: "Programs",
    icon: FileText,
    color: "text-amber-400",
    bg: "bg-amber-900/30",
  },
  {
    id: "referrals",
    label: "Referral Tracking Report",
    description: "Status of all outbound referrals and community partner connections.",
    category: "Community",
    icon: BarChart2,
    color: "text-pink-400",
    bg: "bg-pink-900/30",
  },
  {
    id: "risk",
    label: "Risk & Priority Report",
    description: "Current distribution of high, medium, and low risk cases across your caseload.",
    category: "Case Management",
    icon: Users,
    color: "text-rose-400",
    bg: "bg-rose-900/30",
  },
];

const DATE_RANGES = [
  "This Week",
  "Last 7 Days",
  "This Month",
  "Last 30 Days",
  "Last 90 Days",
  "This Year",
  "Custom Range",
];

// Placeholder summary stats
const SUMMARY = [
  { label: "Active Cases", value: 24, trend: "+2", up: true },
  { label: "Goals Met (MTD)", value: 38, trend: "+5", up: true },
  { label: "Appointments", value: 12, trend: "-1", up: false },
  { label: "Pending Referrals", value: 7, trend: "+3", up: false },
];

export default function StaffReportsPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState("This Month");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [dateDropdown, setDateDropdown] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/portal/staff/auth");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) return null;

  const handleGenerate = () => {
    if (!selectedReport) return;
    setGenerating(true);
    setGenerated(false);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 1200);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-sky-100">Reports</h1>
        <p className="mt-1 text-sm text-slate-400">
          Generate and export reports for caseload, outcomes, and program activity.
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {SUMMARY.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-slate-700/40 bg-slate-800/50 p-4"
          >
            <p className="text-xs text-slate-500 font-medium">{s.label}</p>
            <p className="mt-1 text-2xl font-extrabold text-sky-100">{s.value}</p>
            <p className={`mt-0.5 text-xs font-semibold ${s.up ? "text-emerald-400" : "text-rose-400"}`}>
              {s.trend} vs previous period
            </p>
          </div>
        ))}
      </div>

      {/* Date range selector */}
      <div className="flex flex-wrap items-center gap-4">
        <span className="text-sm font-medium text-slate-400">Report period:</span>
        <div className="relative">
          <button
            onClick={() => setDateDropdown((v) => !v)}
            className="flex items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-800/60 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800 transition"
          >
            <Calendar className="h-4 w-4 text-slate-400" />
            {dateRange}
            <ChevronDown className="h-4 w-4 text-slate-500" />
          </button>
          {dateDropdown && (
            <div className="absolute top-full left-0 z-20 mt-1 w-44 rounded-xl border border-slate-700/50 bg-slate-900 py-1 shadow-xl">
              {DATE_RANGES.map((r) => (
                <button
                  key={r}
                  onClick={() => { setDateRange(r); setDateDropdown(false); setGenerated(false); }}
                  className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                    dateRange === r
                      ? "bg-sky-900/40 text-sky-300"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Report type selector */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-slate-400 uppercase tracking-wider">
          Select Report Type
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {REPORT_TYPES.map((rt) => {
            const Icon = rt.icon;
            const isSelected = selectedReport === rt.id;
            return (
              <button
                key={rt.id}
                onClick={() => { setSelectedReport(rt.id); setGenerated(false); }}
                className={`flex items-start gap-4 rounded-xl border p-4 text-left transition-all ${
                  isSelected
                    ? "border-sky-600/60 bg-sky-900/30 ring-1 ring-sky-600/40"
                    : "border-slate-700/40 bg-slate-800/40 hover:border-sky-800/40 hover:bg-slate-800/60"
                }`}
              >
                <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${rt.bg}`}>
                  <Icon className={`h-5 w-5 ${rt.color}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-sky-100">{rt.label}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{rt.description}</p>
                  <span className="mt-1.5 inline-block rounded-full bg-slate-700/50 px-2 py-0.5 text-[10px] text-slate-400">
                    {rt.category}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Generate + export */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-700/40 bg-slate-800/40 p-5">
        <div className="flex-1 min-w-[200px]">
          <p className="text-sm font-semibold text-sky-100">
            {selectedReport
              ? `Ready: ${REPORT_TYPES.find((r) => r.id === selectedReport)?.label} — ${dateRange}`
              : "Select a report type above to generate"}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            Reports are generated based on your assigned caseload data.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            disabled={!selectedReport || generating}
            onClick={handleGenerate}
            className="flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-500 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <BarChart2 className="h-4 w-4" />
            {generating ? "Generating…" : "Generate"}
          </button>
          <button
            disabled={!generated}
            className="flex items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-800/60 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Generated result placeholder */}
      {generated && (
        <div className="rounded-xl border border-emerald-800/40 bg-emerald-950/30 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-300">
                {REPORT_TYPES.find((r) => r.id === selectedReport)?.label} — {dateRange}
              </p>
              <p className="text-xs text-slate-500">Generated just now · Showing sample data</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {SUMMARY.map((s) => (
              <div key={s.label} className="rounded-lg bg-slate-800/60 p-3">
                <p className="text-xs text-slate-500">{s.label}</p>
                <p className="text-xl font-extrabold text-sky-100 mt-0.5">{s.value}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-600">
            Connect your API endpoint to replace sample data with live caseload metrics.
          </p>
        </div>
      )}
    </div>
  );
}
