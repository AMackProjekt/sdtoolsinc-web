"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, AlertTriangle, Clock3, ShieldCheck, Users } from "lucide-react";
import { Area, AreaChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell, Bar, BarChart } from "recharts";

type ExecutiveResponse = {
  kpis: {
    portfolioHealth: number;
    execActionsOpen: number;
    criticalOpen: number;
    approvalCycleHoursAvg: number;
    workspaceUsers: number;
    identityUsers: number;
  };
  approvals: {
    pendingTotal: number;
    overdue: number;
    trend7d: Array<{ day: string; created: number; closed: number }>;
    byType: Array<{ type: string; pending: number; approved: number; rejected: number }>;
    source: "live" | "mock";
  };
  workspace: { source: "live" | "mock" };
  identity: { source: "live" | "mock" };
  updatedAt: string;
};

const POLL_MS = 15000;
const COLORS = ["#0E7490", "#14B8A6", "#67E8F9", "#155E75"];

export default function ExecutiveRealtimeDashboard() {
  const [data, setData] = useState<ExecutiveResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/enterprise/dashboard/executive", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load executive dashboard");
      const json = (await res.json()) as ExecutiveResponse;
      setData(json);
      setError(null);
    } catch {
      setError("Unable to load executive metrics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
    const timer = setInterval(() => void fetchData(), POLL_MS);
    return () => clearInterval(timer);
  }, []);

  const pieData = useMemo(() => {
    if (!data) return [];
    return [
      { name: "Pending", value: data.approvals.pendingTotal },
      { name: "Overdue", value: data.approvals.overdue },
      { name: "Critical", value: data.kpis.criticalOpen },
    ];
  }, [data]);

  if (loading) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Loading executive dashboard...</div>;
  }

  if (!data) {
    return <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">{error ?? "Dashboard unavailable."}</div>;
  }

  const cards = [
    { label: "Portfolio Health", value: `${data.kpis.portfolioHealth}%`, icon: ShieldCheck, tone: "text-teal-700 bg-teal-50" },
    { label: "Open Executive Actions", value: String(data.kpis.execActionsOpen), icon: Activity, tone: "text-cyan-700 bg-cyan-50" },
    { label: "Critical Approvals", value: String(data.kpis.criticalOpen), icon: AlertTriangle, tone: "text-amber-700 bg-amber-50" },
    { label: "Avg Cycle (hrs)", value: String(data.kpis.approvalCycleHoursAvg), icon: Clock3, tone: "text-slate-700 bg-slate-50" },
    { label: "Workspace Users", value: String(data.kpis.workspaceUsers), icon: Users, tone: "text-blue-700 bg-blue-50" },
    { label: "Identity Users", value: String(data.kpis.identityUsers), icon: Users, tone: "text-indigo-700 bg-indigo-50" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{card.label}</p>
                <span className={`rounded-lg p-2 ${card.tone}`}><Icon className="h-4 w-4" /></span>
              </div>
              <p className="mt-3 text-3xl font-black text-slate-900">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 xl:col-span-2">
          <p className="text-sm font-semibold text-slate-700">Approval Throughput (7-day)</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.approvals.trend7d}>
                <defs>
                  <linearGradient id="createdGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="created" stroke="#0F766E" fill="url(#createdGrad)" />
                <Area type="monotone" dataKey="closed" stroke="#0E7490" fill="rgba(14,116,144,0.15)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-semibold text-slate-700">Queue Pressure</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90}>
                  {pieData.map((entry, i) => (
                    <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-sm font-semibold text-slate-700">Approvals By Type</p>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.approvals.byType}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="pending" fill="#0E7490" />
              <Bar dataKey="approved" fill="#14B8A6" />
              <Bar dataKey="rejected" fill="#F97316" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <p className="text-xs text-slate-500">
        Live source flags: Google {data.workspace.source}, Microsoft {data.identity.source}, approvals {data.approvals.source}. Updated {new Date(data.updatedAt).toLocaleTimeString()}.
      </p>
    </div>
  );
}
