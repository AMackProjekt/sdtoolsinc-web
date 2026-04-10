"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { GlowCard } from "@/components/ui/GlowCard";

const MOCK_DATA = [
  { day: "Mon", engagements: 12, meetings: 5, calls: 8 },
  { day: "Tue", engagements: 18, meetings: 7, calls: 11 },
  { day: "Wed", engagements: 14, meetings: 4, calls: 9 },
  { day: "Thu", engagements: 22, meetings: 9, calls: 14 },
  { day: "Fri", engagements: 19, meetings: 8, calls: 12 },
  { day: "Sat", engagements: 7,  meetings: 2, calls: 4 },
  { day: "Sun", engagements: 5,  meetings: 1, calls: 3 },
];

const TOOLTIP_STYLE = {
  contentStyle: {
    background: "rgba(15,23,42,0.92)",
    border: "1px solid rgba(148,163,184,0.18)",
    borderRadius: 10,
    fontSize: 12,
    color: "#e2e8f0",
  },
  labelStyle: { color: "#94a3b8", fontWeight: 600 },
  itemStyle: { color: "#e2e8f0" },
};

const AXIS_TICK = { fill: "#64748b", fontSize: 11 };

interface WeeklyEngagementChartProps {
  title?: string;
}

export function WeeklyEngagementChart({ title = "Weekly Engagement" }: WeeklyEngagementChartProps) {
  return (
    <GlowCard className="p-5">
      <h3 className="text-sm font-semibold text-slate-200 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 mb-4">Engagements, meetings & calls — this week</p>
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={MOCK_DATA} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
            <XAxis dataKey="day" tick={AXIS_TICK} axisLine={false} tickLine={false} />
            <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} />
            <Tooltip {...TOOLTIP_STYLE} />
            <Legend
              wrapperStyle={{ fontSize: 11, color: "#94a3b8", paddingTop: 8 }}
            />
            <Line
              type="monotone"
              dataKey="engagements"
              name="Engagements"
              stroke="#38bdf8"
              strokeWidth={2}
              dot={{ r: 3, fill: "#38bdf8" }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="meetings"
              name="Meetings"
              stroke="#2dd4bf"
              strokeWidth={2}
              dot={{ r: 3, fill: "#2dd4bf" }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="calls"
              name="Calls"
              stroke="#a78bfa"
              strokeWidth={2}
              dot={{ r: 3, fill: "#a78bfa" }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </GlowCard>
  );
}
