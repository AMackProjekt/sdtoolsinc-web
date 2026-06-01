"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, Briefcase, Users, UserPlus, ShieldCheck, ClipboardCheck } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar, BarChart } from "recharts";

type HrResponse = {
  kpis: {
    totalUsers: number;
    licensedUsers: number;
    managersAssigned: number;
    pendingInvites: number;
    complianceRate: number;
    approvalQueue: number;
  };
  staffingTrend: Array<{ month: string; headcount: number; onboarding: number; trainingCompletion: number }>;
  identity: { source: "live" | "mock" };
  approvals: { source: "live" | "mock" };
  updatedAt: string;
};

const POLL_MS = 15000;

export default function HRRealtimeDashboard() {
  const [data, setData] = useState<HrResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const res = await fetch("/api/enterprise/dashboard/hr", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load HR dashboard");
      const json = (await res.json()) as HrResponse;
      setData(json);
      setError(null);
    } catch {
      setError("Unable to load HR staffing analytics.");
    }
  };

  useEffect(() => {
    void load();
    const timer = setInterval(() => void load(), POLL_MS);
    return () => clearInterval(timer);
  }, []);

  if (!data) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">{error ?? "Loading HR dashboard..."}</div>;
  }

  const cards = [
    { label: "Workforce Headcount", value: data.kpis.totalUsers, icon: Users },
    { label: "Licensed Users", value: data.kpis.licensedUsers, icon: BadgeCheck },
    { label: "Managers Assigned", value: data.kpis.managersAssigned, icon: Briefcase },
    { label: "Pending Invites", value: data.kpis.pendingInvites, icon: UserPlus },
    { label: "Compliance Rate", value: `${data.kpis.complianceRate}%`, icon: ShieldCheck },
    { label: "Approval Queue", value: data.kpis.approvalQueue, icon: ClipboardCheck },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{card.label}</p>
                <Icon className="h-4 w-4 text-amber-600" />
              </div>
              <p className="mt-3 text-3xl font-black text-slate-900">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-semibold text-slate-700">Headcount and Onboarding Trend</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.staffingTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line dataKey="headcount" stroke="#B45309" strokeWidth={2} />
                <Line dataKey="onboarding" stroke="#F59E0B" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-semibold text-slate-700">Training Completion %</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.staffingTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="trainingCompletion" fill="#D97706" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-500">Identity source {data.identity.source}, approvals source {data.approvals.source}. Updated {new Date(data.updatedAt).toLocaleTimeString()}.</p>
    </div>
  );
}
