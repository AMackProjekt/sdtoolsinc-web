"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import type { Doc } from "../../../../../convex/_generated/dataModel";
import {
  Users,
  UserCheck,
  Home,
  FileText,
  ClipboardList,
  ScrollText,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  Flag,
  BarChart3,
  GraduationCap,
  Printer,
  Download,
  Search,
  HeartHandshake,
  Activity,
  Target,
  Star,
  ChevronRight,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

// ─── Mini horizontal bar chart ───────────────────────────────────────────────
function MiniBar({
  label,
  value,
  max,
  color = "bg-violet-500",
}: {
  label: string;
  value: number;
  max: number;
  color?: string;
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="text-sm text-slate-600 w-44 shrink-0 truncate" title={label}>
        {label}
      </span>
      <div className="flex-1 bg-slate-100 rounded-full h-2">
        <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm font-bold text-slate-700 w-8 text-right">{value}</span>
      <span className="text-xs text-slate-400 w-10 text-right">{pct}%</span>
    </div>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function Kpi({
  label,
  value,
  sub,
  icon: Icon,
  color,
  trend,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  color: string;
  trend?: "up" | "down" | "neutral";
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className={`text-xs font-semibold flex items-center gap-0.5 ${
            trend === "up" ? "text-emerald-600" : trend === "down" ? "text-rose-500" : "text-slate-400"
          }`}>
            {trend === "up" ? <ArrowUpRight className="w-3.5 h-3.5" /> : trend === "down" ? <ArrowDownRight className="w-3.5 h-3.5" /> : null}
            {trend === "up" ? "Positive" : trend === "down" ? "Needs Attn." : "Stable"}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-800 mt-3">{value}</p>
      <p className="text-xs font-semibold text-slate-600 mt-0.5">{label}</p>
      {sub && <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────
function SectionHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="border-l-4 border-violet-500 pl-3 mb-4">
      <h2 className="text-base font-bold text-slate-800">{title}</h2>
      {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
    </div>
  );
}

// ─── Stat row ─────────────────────────────────────────────────────────────────
function StatRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string | number;
  highlight?: string;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
      <span className="text-sm text-slate-600">{label}</span>
      {highlight ? (
        <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${highlight}`}>{value}</span>
      ) : (
        <span className="text-sm font-bold text-slate-800">{value}</span>
      )}
    </div>
  );
}

// ─── Tab definitions ──────────────────────────────────────────────────────────
const TABS = [
  { id: "overview",     label: "Executive Overview",  icon: Star },
  { id: "program",      label: "Program Metrics",     icon: TrendingUp },
  { id: "demographics", label: "Demographics",         icon: Users },
  { id: "workforce",    label: "Workforce",            icon: GraduationCap },
  { id: "compliance",   label: "Compliance & Risk",    icon: ShieldCheck },
  { id: "audit",        label: "Full Audit Trail",     icon: ScrollText },
];

const ACTION_COLOR: Record<string, string> = {
  login:  "bg-blue-100 text-blue-700",
  logout: "bg-slate-100 text-slate-600",
  create: "bg-emerald-100 text-emerald-700",
  update: "bg-amber-100 text-amber-700",
  delete: "bg-rose-100 text-rose-700",
  view:   "bg-violet-100 text-violet-700",
  upload: "bg-teal-100 text-teal-700",
  export: "bg-indigo-100 text-indigo-700",
};

function actionColor(action: string) {
  const key = Object.keys(ACTION_COLOR).find((k) => action.toLowerCase().startsWith(k));
  return key ? ACTION_COLOR[key] : "bg-slate-100 text-slate-600";
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AuditQueryMachine() {
  const [tab, setTab]                   = useState("overview");
  const [search, setSearch]             = useState("");
  const [roleFilter, setRoleFilter]     = useState("all");
  const [actionFilter, setActionFilter] = useState("all");

  // ── Data queries ─────────────────────────────────────────────────────────
  const participants   = (useQuery(api.functions.listParticipants)   ?? []) as Doc<"participants">[];
  const demographics   = (useQuery(api.functions.listDemographics)   ?? []) as Doc<"demographics">[];
  const caseNotes      = (useQuery(api.functions.listCaseNotes)      ?? []) as Doc<"caseNotes">[];
  const documents      = (useQuery(api.functions.listDocuments)      ?? []) as Doc<"documents">[];
  const teamMembers    = (useQuery(api.functions.listTeamMembers)    ?? []) as Doc<"teamMembers">[];
  const housingMatches = (useQuery(api.functions.listHousingMatches) ?? []) as Doc<"housingMatches">[];
  const auditLogs      = (useQuery(api.functions.listAuditLogs)      ?? []) as Doc<"auditLogs">[];
  const requests       = (useQuery(api.functions.listRequests)       ?? []) as Doc<"requests">[];
  const smartGoals     = (useQuery(api.functions.listSmartGoals)     ?? []) as Doc<"smartGoals">[];
  const grievances     = (useQuery(api.functions.listGrievances)     ?? []) as Doc<"grievances">[];
  const enrollments    = (useQuery(api.functions.listEnrollments)    ?? []) as Doc<"enrollments">[];
  const exits          = (useQuery(api.functions.listExits)          ?? []) as Doc<"exits">[];
  const trainingLog    = (useQuery(api.functions.listTrainingLog)    ?? []) as Doc<"trainingLog">[];

  // ── Derived: Program ─────────────────────────────────────────────────────
  const activeClients     = participants.filter((p) => p.status === "active").length;
  const housed            = housingMatches.filter((h) => h.status === "active").length;
  const housingRate       = participants.length > 0 ? Math.round((housed / participants.length) * 100) : 0;
  const activeEnrollments = enrollments.filter((e) => e.status === "active");

  const exitsByReason = exits.reduce<Record<string, number>>((acc, e) => {
    acc[e.exitReason] = (acc[e.exitReason] ?? 0) + 1; return acc;
  }, {});
  const exitsByDest = exits.reduce<Record<string, number>>((acc, e) => {
    const d = e.exitDestination ?? "Not specified";
    acc[d] = (acc[d] ?? 0) + 1; return acc;
  }, {});
  const enrollsByLocation = enrollments.reduce<Record<string, number>>((acc, e) => {
    acc[e.location] = (acc[e.location] ?? 0) + 1; return acc;
  }, {});

  // ── Derived: Goals ───────────────────────────────────────────────────────
  const completedGoals  = smartGoals.filter((g) => g.status === "completed").length;
  const activeGoals     = smartGoals.filter((g) => g.status === "active").length;
  const missedGoals     = smartGoals.filter((g) => g.status === "missed").length;
  const goalSuccessRate = smartGoals.length > 0 ? Math.round((completedGoals / smartGoals.length) * 100) : 0;

  // ── Derived: Demographics ────────────────────────────────────────────────
  const genderMap = demographics.reduce<Record<string, number>>((acc, d) => {
    if (d.gender) acc[d.gender] = (acc[d.gender] ?? 0) + 1; return acc;
  }, {});
  const raceMap = demographics.reduce<Record<string, number>>((acc, d) => {
    if (d.race) acc[d.race] = (acc[d.race] ?? 0) + 1; return acc;
  }, {});
  const housingStatusMap = demographics.reduce<Record<string, number>>((acc, d) => {
    if (d.housingStatus) acc[d.housingStatus] = (acc[d.housingStatus] ?? 0) + 1; return acc;
  }, {});
  const employmentMap = demographics.reduce<Record<string, number>>((acc, d) => {
    if (d.employmentStatus) acc[d.employmentStatus] = (acc[d.employmentStatus] ?? 0) + 1; return acc;
  }, {});
  const langMap = demographics.reduce<Record<string, number>>((acc, d) => {
    if (d.preferredLanguage) acc[d.preferredLanguage] = (acc[d.preferredLanguage] ?? 0) + 1; return acc;
  }, {});
  const referralMap = demographics.reduce<Record<string, number>>((acc, d) => {
    if (d.referralSource) acc[d.referralSource] = (acc[d.referralSource] ?? 0) + 1; return acc;
  }, {});
  const veteranCount = demographics.filter((d) => d.veteranStatus === "Yes").length;

  // ── Derived: Grievances ──────────────────────────────────────────────────
  const openGrievances     = grievances.filter((g) => g.status === "open").length;
  const resolvedGrievances = grievances.filter((g) => g.status === "resolved").length;
  const grievanceResRate   = grievances.length > 0 ? Math.round((resolvedGrievances / grievances.length) * 100) : 0;
  const clientGrievances   = grievances.filter((g) => g.reporterType === "client");
  const staffGrievances    = grievances.filter((g) => g.reporterType === "staff");
  const grievanceCatMap    = grievances.reduce<Record<string, number>>((acc, g) => {
    acc[g.category] = (acc[g.category] ?? 0) + 1; return acc;
  }, {});

  // ── Derived: Workforce ───────────────────────────────────────────────────
  const notesByStaff = caseNotes.reduce<Record<string, number>>((acc, n) => {
    acc[n.staff] = (acc[n.staff] ?? 0) + 1; return acc;
  }, {});
  const trainingByStaff = trainingLog.reduce<Record<string, number>>((acc, t) => {
    acc[t.staffName] = (acc[t.staffName] ?? 0) + 1; return acc;
  }, {});
  const avgCaseload = teamMembers.length > 0
    ? Math.round((activeClients / teamMembers.length) * 10) / 10
    : 0;

  // ── Derived: Audit ───────────────────────────────────────────────────────
  const auditByAction = auditLogs.reduce<Record<string, number>>((acc, l) => {
    const key = l.action.split(" ")[0].toLowerCase();
    acc[key] = (acc[key] ?? 0) + 1; return acc;
  }, {});
  const roles   = Array.from(new Set(auditLogs.map((l) => l.actorRole))).sort();
  const actions = Array.from(new Set(auditLogs.map((l) => l.action.split(" ")[0].toLowerCase()))).sort();
  const filteredAudit = auditLogs.filter((l) => {
    const matchSearch =
      l.actor.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      (l.target ?? "").toLowerCase().includes(search.toLowerCase());
    const matchRole   = roleFilter === "all"   || l.actorRole === roleFilter;
    const matchAction = actionFilter === "all" || l.action.toLowerCase().startsWith(actionFilter);
    return matchSearch && matchRole && matchAction;
  });

  const reportDate = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
  const pendingCount  = requests.filter((r) => r.status === "pending").length;
  const approvalRate  = requests.length > 0
    ? Math.round((requests.filter((r) => r.status === "approved").length / requests.length) * 100)
    : 0;

  return (
    <div className="space-y-6">

      {/* ── Page header ────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-violet-500" />
            Audit &amp; Analytics Query Engine
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Dreams For Change · {reportDate} · Prepared for stakeholder review
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white text-sm rounded-lg hover:bg-violet-700 transition font-medium print:hidden"
        >
          <Printer className="w-4 h-4" /> Print / Export PDF
        </button>
      </div>

      {/* ── Tab navigation ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-0.5 border-b border-slate-200 overflow-x-auto print:hidden">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition ${
              tab === id
                ? "border-violet-500 text-violet-700"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          TAB: EXECUTIVE OVERVIEW
      ════════════════════════════════════════════════════════════════════ */}
      {tab === "overview" && (
        <div className="space-y-8">

          {/* Impact hero */}
          <div className="bg-gradient-to-r from-violet-700 to-indigo-700 rounded-2xl p-6 text-white">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 mb-1">
              Dreams For Change · Stakeholder Impact Report
            </p>
            <h2 className="text-2xl font-extrabold mb-5 leading-tight">
              Serving Our Community with Accountability &amp; Transparency
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Clients Served",  value: participants.length },
                { label: "Currently Housed",      value: housed },
                { label: "Housing Success Rate",  value: `${housingRate}%` },
                { label: "SMART Goals Completed", value: completedGoals },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white/10 backdrop-blur rounded-xl p-4">
                  <p className="text-3xl font-black">{value}</p>
                  <p className="text-xs opacity-75 mt-1 leading-snug">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* KPI grid */}
          <div>
            <SectionHeader title="Key Performance Indicators" sub="Real-time metrics drawn from all program data — updated live" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <Kpi label="Total Enrolled"       value={participants.length}      icon={Users}         color="bg-violet-100 text-violet-700"   trend="up" />
              <Kpi label="Active Clients"        value={activeClients}            icon={UserCheck}     color="bg-teal-100 text-teal-700"       trend="up" />
              <Kpi label="Stably Housed"         value={housed}                   icon={Home}          color="bg-emerald-100 text-emerald-700" trend="up"      sub={`${housingRate}% placement rate`} />
              <Kpi label="Staff Members"         value={teamMembers.length}       icon={Users}         color="bg-blue-100 text-blue-700"       trend="neutral" />
              <Kpi label="Case Notes Filed"      value={caseNotes.length}         icon={ClipboardList} color="bg-indigo-100 text-indigo-700"   trend="up"      sub="Service documentation" />
              <Kpi label="Documents on File"     value={documents.length}         icon={FileText}      color="bg-amber-100 text-amber-700"     trend="neutral" />
              <Kpi label="Goals Completed"       value={completedGoals}           icon={Target}        color="bg-emerald-100 text-emerald-700" trend="up"      sub={`${goalSuccessRate}% success rate`} />
              <Kpi label="Open Grievances"       value={openGrievances}           icon={Flag}          color="bg-rose-100 text-rose-600"       trend={openGrievances > 3 ? "down" : "neutral"} sub="Needs resolution" />
              <Kpi label="Active Enrollments"    value={activeEnrollments.length} icon={Activity}      color="bg-violet-100 text-violet-600"   trend="up" />
              <Kpi label="Program Exits"         value={exits.length}             icon={ChevronRight}  color="bg-slate-100 text-slate-600"     trend="neutral" />
              <Kpi label="Pending Requests"      value={pendingCount}             icon={AlertCircle}   color="bg-amber-100 text-amber-600"     trend={pendingCount > 5 ? "down" : "neutral"} />
              <Kpi label="Training Records"      value={trainingLog.length}       icon={GraduationCap} color="bg-teal-100 text-teal-700"       trend="up"      sub="Staff completions" />
            </div>
          </div>

          {/* Two-column summary */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <SectionHeader title="Enrollment by Program Site" />
              {Object.entries(enrollsByLocation).length === 0 ? (
                <p className="text-sm text-slate-400">No enrollments recorded yet.</p>
              ) : (
                Object.entries(enrollsByLocation).sort((a, b) => b[1] - a[1]).map(([loc, count]) => (
                  <MiniBar key={loc} label={loc} value={count} max={enrollments.length} color="bg-violet-500" />
                ))
              )}
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <SectionHeader title="Service Request Pipeline" />
              <StatRow label="Pending Review" value={requests.filter((r) => r.status === "pending").length}  highlight="bg-amber-100 text-amber-700" />
              <StatRow label="Approved"        value={requests.filter((r) => r.status === "approved").length} highlight="bg-emerald-100 text-emerald-700" />
              <StatRow label="Denied"          value={requests.filter((r) => r.status === "denied").length}   highlight="bg-rose-100 text-rose-600" />
              <StatRow label="Total Requests"  value={requests.length} />
              <StatRow label="Approval Rate"   value={requests.length > 0 ? `${approvalRate}%` : "—"} />
              <div className="mt-3 bg-slate-100 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${approvalRate}%` }} />
              </div>
            </div>
          </div>

          {/* Grievance + goals */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <SectionHeader title="Grievance Resolution" sub="Accountability and due process tracking" />
              <StatRow label="Open"          value={openGrievances}    highlight={openGrievances > 0 ? "bg-rose-100 text-rose-600" : undefined} />
              <StatRow label="Under Review"  value={grievances.filter((g) => g.status === "under-review").length} highlight="bg-amber-100 text-amber-700" />
              <StatRow label="Resolved"      value={resolvedGrievances} highlight="bg-emerald-100 text-emerald-700" />
              <StatRow label="Resolution Rate" value={`${grievanceResRate}%`} />
              <div className="mt-3 bg-slate-100 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${grievanceResRate}%` }} />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <SectionHeader title="Client Goal Outcomes" sub="SMART goal progress — all active clients" />
              <StatRow label="Active Goals" value={activeGoals}    highlight="bg-blue-100 text-blue-700" />
              <StatRow label="Completed"    value={completedGoals} highlight="bg-emerald-100 text-emerald-700" />
              <StatRow label="Missed"       value={missedGoals}    highlight="bg-rose-100 text-rose-600" />
              <StatRow label="Success Rate" value={`${goalSuccessRate}%`} />
              <div className="mt-3 bg-slate-100 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${goalSuccessRate}%` }} />
              </div>
            </div>
          </div>

          {/* Recent activity */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <SectionHeader title="Recent System Activity" sub="Last 10 audit events" />
            {auditLogs.length === 0 ? (
              <p className="text-sm text-slate-400">No events recorded yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[580px]">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      {["Time", "Actor", "Role", "Action", "Target"].map((h) => (
                        <th key={h} className="text-left px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.slice(0, 10).map((log) => (
                      <tr key={log._id} className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="px-3 py-2 text-xs text-slate-400 whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </td>
                        <td className="px-3 py-2 font-medium text-slate-700">{log.actor}</td>
                        <td className="px-3 py-2">
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 font-semibold">{log.actorRole}</span>
                        </td>
                        <td className="px-3 py-2">
                          <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${actionColor(log.action)}`}>{log.action}</span>
                        </td>
                        <td className="px-3 py-2 text-slate-400 text-xs">{log.target ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          TAB: PROGRAM METRICS
      ════════════════════════════════════════════════════════════════════ */}
      {tab === "program" && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-4 gap-4">
            <Kpi label="Total Enrollments"  value={enrollments.length}       icon={Activity}     color="bg-violet-100 text-violet-700"   trend="up" />
            <Kpi label="Active Now"         value={activeEnrollments.length} icon={UserCheck}    color="bg-emerald-100 text-emerald-700" trend="up" />
            <Kpi label="Total Exits"        value={exits.length}             icon={ChevronRight} color="bg-slate-100 text-slate-600"     trend="neutral" />
            <Kpi label="Housing Placements" value={housed}                   icon={Home}         color="bg-teal-100 text-teal-700"       trend="up" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <SectionHeader title="Enrollments by Program Site" sub="All-time count by location" />
              {Object.keys(enrollsByLocation).length === 0 ? (
                <p className="text-sm text-slate-400">No enrollment data yet.</p>
              ) : (
                Object.entries(enrollsByLocation).sort((a, b) => b[1] - a[1]).map(([loc, count]) => (
                  <MiniBar key={loc} label={loc} value={count} max={enrollments.length} color="bg-violet-500" />
                ))
              )}
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <SectionHeader title="Enrollment Status" />
              <StatRow label="Active"   value={enrollments.filter((e) => e.status === "active").length}   highlight="bg-emerald-100 text-emerald-700" />
              <StatRow label="On Hold"  value={enrollments.filter((e) => e.status === "on-hold").length}  highlight="bg-amber-100 text-amber-700" />
              <StatRow label="Exited"   value={enrollments.filter((e) => e.status === "exited").length}   highlight="bg-slate-100 text-slate-600" />
              <StatRow label="Total"    value={enrollments.length} />
              <StatRow label="Retention Rate" value={enrollments.length > 0 ? `${Math.round((activeEnrollments.length / enrollments.length) * 100)}%` : "—"} />
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <SectionHeader title="Exit Reasons" sub="Why clients transitioned out of program" />
              {Object.keys(exitsByReason).length === 0 ? (
                <p className="text-sm text-slate-400">No exits recorded yet.</p>
              ) : (
                Object.entries(exitsByReason).sort((a, b) => b[1] - a[1]).map(([reason, count]) => (
                  <MiniBar key={reason} label={reason} value={count} max={exits.length} color="bg-indigo-500" />
                ))
              )}
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <SectionHeader title="Exit Destinations" sub="Where clients go after program exit" />
              {Object.keys(exitsByDest).length === 0 ? (
                <p className="text-sm text-slate-400">No exits recorded yet.</p>
              ) : (
                Object.entries(exitsByDest).sort((a, b) => b[1] - a[1]).map(([dest, count]) => (
                  <MiniBar key={dest} label={dest} value={count} max={exits.length} color="bg-teal-500" />
                ))
              )}
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <SectionHeader title="Housing Match Status" sub="Current housing pipeline" />
              <StatRow label="Active Placements" value={housingMatches.filter((h) => h.status === "active").length}  highlight="bg-emerald-100 text-emerald-700" />
              <StatRow label="Pending Match"     value={housingMatches.filter((h) => h.status === "pending").length} highlight="bg-amber-100 text-amber-700" />
              <StatRow label="Exited Housing"    value={housingMatches.filter((h) => h.status === "exited").length}  highlight="bg-slate-100 text-slate-600" />
              <StatRow label="Total Matches"     value={housingMatches.length} />
              <StatRow label="Placement Rate"    value={participants.length > 0 ? `${housingRate}%` : "—"} />
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <SectionHeader title="Service Delivery Metrics" />
              <StatRow label="Total Case Notes"      value={caseNotes.length} />
              <StatRow label="Avg. Notes / Client"   value={participants.length > 0 ? (caseNotes.length / participants.length).toFixed(1) : "—"} />
              <StatRow label="Documents on File"     value={documents.length} />
              <StatRow label="Requests Approved"     value={requests.filter((r) => r.status === "approved").length} />
              <StatRow label="Request Approval Rate" value={`${approvalRate}%`} />
            </div>
          </div>

          {/* Enrollment registry */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
            <div className="px-5 py-4 border-b border-slate-100">
              <SectionHeader title="Enrollment Registry" sub="All program participants on file" />
            </div>
            {enrollments.length === 0 ? (
              <p className="text-center text-slate-400 py-10 text-sm">No enrollments on file.</p>
            ) : (
              <table className="w-full text-sm min-w-[720px]">
                <thead className="bg-slate-50">
                  <tr>
                    {["Client", "Location", "Enrolled", "Case Manager", "Status", "Notes"].map((h) => (
                      <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map((e) => (
                    <tr key={e._id} className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-700">{e.clientName}</td>
                      <td className="px-4 py-3 text-slate-500">{e.location}</td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{e.enrolledDate}</td>
                      <td className="px-4 py-3 text-slate-500">{e.caseManager}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                          e.status === "active"  ? "bg-emerald-100 text-emerald-700" :
                          e.status === "on-hold" ? "bg-amber-100 text-amber-700" :
                          "bg-slate-100 text-slate-600"
                        }`}>{e.status}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs max-w-[200px] truncate">{e.notes ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Exit registry */}
          {exits.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
              <div className="px-5 py-4 border-b border-slate-100">
                <SectionHeader title="Exit Registry" sub="All program exits on file" />
              </div>
              <table className="w-full text-sm min-w-[760px]">
                <thead className="bg-slate-50">
                  <tr>
                    {["Client", "Location", "Exit Date", "Reason", "Destination", "Case Manager"].map((h) => (
                      <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {exits.map((e) => (
                    <tr key={e._id} className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-700">{e.clientName}</td>
                      <td className="px-4 py-3 text-slate-500">{e.location}</td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{e.exitDate}</td>
                      <td className="px-4 py-3 text-slate-500">{e.exitReason}</td>
                      <td className="px-4 py-3 text-slate-500">{e.exitDestination ?? "—"}</td>
                      <td className="px-4 py-3 text-slate-500">{e.caseManager}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          TAB: DEMOGRAPHICS
      ════════════════════════════════════════════════════════════════════ */}
      {tab === "demographics" && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <Kpi label="Demographics Filed" value={demographics.length} icon={Users}          color="bg-blue-100 text-blue-700"     trend="neutral" />
            <Kpi label="Veterans Served"    value={veteranCount}        icon={HeartHandshake} color="bg-indigo-100 text-indigo-700" trend="up" />
            <Kpi label="Data Completeness"  value={participants.length > 0 ? `${Math.round((demographics.length / participants.length) * 100)}%` : "—"} icon={FileText} color="bg-teal-100 text-teal-700" trend="up" sub="Demographics vs. participants" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <SectionHeader title="Gender Identity" />
              {Object.keys(genderMap).length === 0 ? (<p className="text-sm text-slate-400">No data on file.</p>) : (
                Object.entries(genderMap).sort((a, b) => b[1] - a[1]).map(([g, n]) => (
                  <MiniBar key={g} label={g} value={n} max={demographics.length} color="bg-blue-500" />
                ))
              )}
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <SectionHeader title="Race / Ethnicity" />
              {Object.keys(raceMap).length === 0 ? (<p className="text-sm text-slate-400">No data on file.</p>) : (
                Object.entries(raceMap).sort((a, b) => b[1] - a[1]).map(([r, n]) => (
                  <MiniBar key={r} label={r} value={n} max={demographics.length} color="bg-indigo-500" />
                ))
              )}
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <SectionHeader title="Housing Status at Intake" sub="Client situation at time of program entry" />
              {Object.keys(housingStatusMap).length === 0 ? (<p className="text-sm text-slate-400">No data on file.</p>) : (
                Object.entries(housingStatusMap).sort((a, b) => b[1] - a[1]).map(([s, n]) => (
                  <MiniBar key={s} label={s} value={n} max={demographics.length} color="bg-amber-500" />
                ))
              )}
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <SectionHeader title="Employment Status" />
              {Object.keys(employmentMap).length === 0 ? (<p className="text-sm text-slate-400">No data on file.</p>) : (
                Object.entries(employmentMap).sort((a, b) => b[1] - a[1]).map(([e, n]) => (
                  <MiniBar key={e} label={e} value={n} max={demographics.length} color="bg-teal-500" />
                ))
              )}
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <SectionHeader title="Language Access" sub="Preferred language distribution" />
              {Object.keys(langMap).length === 0 ? (<p className="text-sm text-slate-400">No data on file.</p>) : (
                Object.entries(langMap).sort((a, b) => b[1] - a[1]).map(([l, n]) => (
                  <MiniBar key={l} label={l} value={n} max={demographics.length} color="bg-violet-500" />
                ))
              )}
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <SectionHeader title="Referral Sources" sub="How clients entered the program" />
              {Object.keys(referralMap).length === 0 ? (<p className="text-sm text-slate-400">No data on file.</p>) : (
                Object.entries(referralMap).sort((a, b) => b[1] - a[1]).map(([r, n]) => (
                  <MiniBar key={r} label={r} value={n} max={demographics.length} color="bg-rose-400" />
                ))
              )}
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 flex items-start gap-4">
            <HeartHandshake className="w-6 h-6 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-indigo-800 mb-1">Veteran Services Highlight</h3>
              <p className="text-sm text-indigo-700">
                <strong>{veteranCount}</strong> veteran{veteranCount !== 1 ? "s" : ""} currently enrolled in our programs.
                {veteranCount > 0 && demographics.length > 0
                  ? ` That is ${Math.round((veteranCount / demographics.length) * 100)}% of all clients with demographics on file — demonstrating our commitment to serving those who served.`
                  : " Dreams For Change is committed to serving veterans experiencing homelessness."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          TAB: WORKFORCE
      ════════════════════════════════════════════════════════════════════ */}
      {tab === "workforce" && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <Kpi label="Staff Members"         value={teamMembers.length} icon={Users}         color="bg-blue-100 text-blue-700"     trend="neutral" />
            <Kpi label="Avg. Caseload / Staff"  value={avgCaseload}        icon={ClipboardList} color="bg-violet-100 text-violet-700" trend="neutral" sub="Active clients ÷ staff" />
            <Kpi label="Training Completions"   value={trainingLog.length} icon={GraduationCap} color="bg-teal-100 text-teal-700"     trend="up" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <SectionHeader title="Case Notes by Staff Member" sub="Service documentation accountability" />
              {Object.keys(notesByStaff).length === 0 ? (<p className="text-sm text-slate-400">No case notes recorded yet.</p>) : (
                Object.entries(notesByStaff).sort((a, b) => b[1] - a[1]).map(([staff, count]) => (
                  <MiniBar key={staff} label={staff} value={count} max={caseNotes.length} color="bg-indigo-500" />
                ))
              )}
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <SectionHeader title="Training Completions by Staff" sub="Professional development records" />
              {Object.keys(trainingByStaff).length === 0 ? (<p className="text-sm text-slate-400">No training records on file.</p>) : (
                Object.entries(trainingByStaff).sort((a, b) => b[1] - a[1]).map(([staff, count]) => (
                  <MiniBar key={staff} label={staff} value={count} max={trainingLog.length} color="bg-teal-500" />
                ))
              )}
            </div>
          </div>

          {/* Staff roster */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
            <div className="px-5 py-4 border-b border-slate-100">
              <SectionHeader title="Staff Roster &amp; Productivity" sub="Credentialed team members and their output" />
            </div>
            {teamMembers.length === 0 ? (
              <p className="text-center text-slate-400 py-10 text-sm">No team members on file.</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    {["Name", "Role", "Case Notes", "Training Completions"].map((h) => (
                      <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {teamMembers.map((m) => (
                    <tr key={m._id} className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-700">{m.name}</td>
                      <td className="px-4 py-3 text-slate-500">{m.role}</td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-slate-700">{notesByStaff[m.name] ?? 0}</span>
                        <span className="text-slate-400 text-xs ml-1">notes</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-slate-700">{trainingByStaff[m.name] ?? 0}</span>
                        <span className="text-slate-400 text-xs ml-1">courses</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Training log */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
            <div className="px-5 py-4 border-b border-slate-100">
              <SectionHeader title="Complete Training Log" sub="All staff professional development records" />
            </div>
            {trainingLog.length === 0 ? (
              <p className="text-center text-slate-400 py-10 text-sm">No training records on file.</p>
            ) : (
              <table className="w-full text-sm min-w-[620px]">
                <thead className="bg-slate-50">
                  <tr>
                    {["Staff", "Course", "Platform", "Completed", "Certificate"].map((h) => (
                      <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {trainingLog.map((t) => (
                    <tr key={t._id} className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-700">{t.staffName}</td>
                      <td className="px-4 py-3 text-slate-600">{t.courseName}</td>
                      <td className="px-4 py-3">
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 font-semibold">{t.platform}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{t.completedDate}</td>
                      <td className="px-4 py-3">
                        {t.certificateUrl ? (
                          <a href={t.certificateUrl} target="_blank" rel="noreferrer"
                            className="text-xs text-violet-600 hover:underline flex items-center gap-1">
                            <Download className="w-3 h-3" /> View
                          </a>
                        ) : (
                          <span className="text-xs text-slate-300">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          TAB: COMPLIANCE & RISK
      ════════════════════════════════════════════════════════════════════ */}
      {tab === "compliance" && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-4 gap-4">
            <Kpi label="Open Grievances"      value={openGrievances}          icon={Flag}         color="bg-rose-100 text-rose-600"       trend={openGrievances > 0 ? "down" : "neutral"} />
            <Kpi label="Resolution Rate"      value={`${grievanceResRate}%`}  icon={CheckCircle2} color="bg-emerald-100 text-emerald-700"  trend={grievanceResRate >= 80 ? "up" : "down"} />
            <Kpi label="Pending Requests"     value={pendingCount}            icon={Clock}        color="bg-amber-100 text-amber-700"      trend={pendingCount > 5 ? "down" : "neutral"} />
            <Kpi label="Audit Events Logged"  value={auditLogs.length}        icon={ScrollText}   color="bg-violet-100 text-violet-700"    trend="up" sub="Immutable system record" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <SectionHeader title="Client Grievances" sub="Formal complaints from program participants" />
              <StatRow label="Open"         value={clientGrievances.filter((g) => g.status === "open").length}          highlight="bg-rose-100 text-rose-600" />
              <StatRow label="Under Review" value={clientGrievances.filter((g) => g.status === "under-review").length}  highlight="bg-amber-100 text-amber-700" />
              <StatRow label="Resolved"     value={clientGrievances.filter((g) => g.status === "resolved").length}      highlight="bg-emerald-100 text-emerald-700" />
              <StatRow label="Total"        value={clientGrievances.length} />
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <SectionHeader title="Staff Grievances" sub="Internal HR reports and concerns" />
              <StatRow label="Open"         value={staffGrievances.filter((g) => g.status === "open").length}          highlight="bg-rose-100 text-rose-600" />
              <StatRow label="Under Review" value={staffGrievances.filter((g) => g.status === "under-review").length}  highlight="bg-amber-100 text-amber-700" />
              <StatRow label="Resolved"     value={staffGrievances.filter((g) => g.status === "resolved").length}      highlight="bg-emerald-100 text-emerald-700" />
              <StatRow label="Total"        value={staffGrievances.length} />
            </div>
          </div>

          {grievances.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <SectionHeader title="Grievance Categories" sub="Issue type distribution across all grievances" />
              {Object.entries(grievanceCatMap).sort((a, b) => b[1] - a[1]).map(([cat, count]) => (
                <MiniBar key={cat} label={cat} value={count} max={grievances.length} color="bg-rose-400" />
              ))}
            </div>
          )}

          {/* Grievance registry */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
            <div className="px-5 py-4 border-b border-slate-100">
              <SectionHeader title="Grievance Registry" sub="Complete formal record of all filed grievances" />
            </div>
            {grievances.length === 0 ? (
              <p className="text-center text-slate-400 py-10 text-sm">No grievances on file.</p>
            ) : (
              <table className="w-full text-sm min-w-[740px]">
                <thead className="bg-slate-50">
                  <tr>
                    {["Date", "Reported By", "Type", "Category", "Status", "Description"].map((h) => (
                      <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {grievances.map((g) => (
                    <tr key={g._id} className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">{g.date}</td>
                      <td className="px-4 py-3 font-medium text-slate-700">{g.reportedBy}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                          g.reporterType === "client" ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-700"
                        }`}>{g.reporterType}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{g.category}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                          g.status === "open"         ? "bg-rose-100 text-rose-600" :
                          g.status === "under-review" ? "bg-amber-100 text-amber-700" :
                          "bg-emerald-100 text-emerald-700"
                        }`}>{g.status}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs max-w-[200px] truncate">{g.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Risk summary */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <h3 className="font-bold text-amber-800">Risk &amp; Compliance Summary</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div>
                <p className="font-semibold text-amber-700 mb-1">Grievance Risk Level</p>
                <p className="text-amber-600">
                  {openGrievances === 0
                    ? "Low — No open grievances. All matters resolved."
                    : openGrievances <= 2
                    ? "Moderate — 1–2 open cases under active management."
                    : "High — Multiple open grievances require immediate attention."}
                </p>
              </div>
              <div>
                <p className="font-semibold text-amber-700 mb-1">Request Backlog</p>
                <p className="text-amber-600">
                  {pendingCount} pending service request{pendingCount !== 1 ? "s" : ""} awaiting staff review.
                  {pendingCount > 5 ? " Backlog exceeds threshold — escalate." : " Within acceptable range."}
                </p>
              </div>
              <div>
                <p className="font-semibold text-amber-700 mb-1">HIPAA &amp; Data Security</p>
                <p className="text-amber-600">
                  Full HIPAA posture check available in the Compliance Center. All system events are immutably logged with timestamps and IP addresses.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          TAB: FULL AUDIT TRAIL
      ════════════════════════════════════════════════════════════════════ */}
      {tab === "audit" && (
        <div className="space-y-5">

          {/* Action volume KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(auditByAction).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([action, count]) => (
              <div key={action} className="bg-white border border-slate-200 rounded-xl p-4">
                <p className="text-xl font-bold text-slate-800">{count}</p>
                <p className="text-xs text-slate-500 capitalize mt-0.5">{action} events</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 flex-wrap print:hidden">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search actor, action, target…"
                className="pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 w-64"
              />
            </div>
            <select title="Filter by role" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400">
              <option value="all">All Roles</option>
              {roles.map((r) => <option key={r}>{r}</option>)}
            </select>
            <select title="Filter by action type" value={actionFilter} onChange={(e) => setActionFilter(e.target.value)}
              className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400">
              <option value="all">All Actions</option>
              {actions.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
            <span className="text-xs text-slate-400 ml-auto">
              {filteredAudit.length} of {auditLogs.length} events
            </span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
            {auditLogs.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <ScrollText className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No audit events recorded yet.</p>
                <p className="text-xs mt-1 text-slate-300">
                  Events are logged automatically as staff and clients interact with the portal.
                </p>
              </div>
            ) : (
              <table className="w-full text-sm min-w-[760px]">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    {["Timestamp", "Actor", "Role", "Action", "Target", "Detail", "IP"].map((h) => (
                      <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredAudit.map((log) => (
                    <tr key={log._id} className="border-b border-slate-50 hover:bg-violet-50/20">
                      <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString([], {
                          month: "short", day: "numeric",
                          hour: "2-digit", minute: "2-digit", second: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800 max-w-[160px] truncate">{log.actor}</td>
                      <td className="px-4 py-3">
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 font-semibold">{log.actorRole}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${actionColor(log.action)}`}>{log.action}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 max-w-[130px] truncate">{log.target ?? "—"}</td>
                      <td className="px-4 py-3 text-slate-400 text-xs max-w-[180px] truncate">{log.detail ?? "—"}</td>
                      <td className="px-4 py-3 text-slate-400 font-mono text-xs">{log.ip ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
