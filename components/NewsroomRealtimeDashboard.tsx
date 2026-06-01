"use client";

import { useEffect, useState } from "react";
import { Megaphone, AlertTriangle, Clock3, Send, Newspaper } from "lucide-react";
import { CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

type NewsroomResponse = {
  kpis: {
    pendingApprovals: number;
    overdueApprovals: number;
    criticalApprovals: number;
    readyToPublish: number;
    publishedThisCycle: number;
  };
  publicationPipeline: Array<{ stage: string; count: number }>;
  channelPerformance: Array<{ channel: string; reach: number; engagement: number }>;
  approvals: { source: "live" | "mock" };
  updatedAt: string;
};

const POLL_MS = 15000;
const COLORS = ["#0284C7", "#0369A1", "#7DD3FC", "#0EA5E9", "#38BDF8"];

export default function NewsroomRealtimeDashboard() {
  const [data, setData] = useState<NewsroomResponse | null>(null);

  const load = async () => {
    const res = await fetch("/api/enterprise/dashboard/newsroom", { cache: "no-store" });
    if (!res.ok) return;
    setData((await res.json()) as NewsroomResponse);
  };

  useEffect(() => {
    void load();
    const timer = setInterval(() => void load(), POLL_MS);
    return () => clearInterval(timer);
  }, []);

  if (!data) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Loading newsroom analytics...</div>;
  }

  const cards = [
    { label: "Pending Approvals", value: data.kpis.pendingApprovals, icon: Clock3 },
    { label: "Overdue", value: data.kpis.overdueApprovals, icon: AlertTriangle },
    { label: "Critical", value: data.kpis.criticalApprovals, icon: Megaphone },
    { label: "Ready to Publish", value: data.kpis.readyToPublish, icon: Send },
    { label: "Published This Cycle", value: data.kpis.publishedThisCycle, icon: Newspaper },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{card.label}</p>
                <Icon className="h-4 w-4 text-sky-600" />
              </div>
              <p className="mt-3 text-3xl font-black text-slate-900">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-semibold text-slate-700">Publication Pipeline</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.publicationPipeline}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stage" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#0EA5E9" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-semibold text-slate-700">Channel Reach Mix</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.channelPerformance} dataKey="reach" nameKey="channel" cx="50%" cy="50%" outerRadius={95}>
                  {data.channelPerformance.map((entry, idx) => (
                    <Cell key={entry.channel} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-500">Approvals source {data.approvals.source}. Updated {new Date(data.updatedAt).toLocaleTimeString()}.</p>
    </div>
  );
}
