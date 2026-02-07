'use client'

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

const mockData = [
  { day: 'Mon', engagements: 12, meetings: 5, calls: 8 },
  { day: 'Tue', engagements: 15, meetings: 7, calls: 10 },
  { day: 'Wed', engagements: 18, meetings: 6, calls: 12 },
  { day: 'Thu', engagements: 14, meetings: 8, calls: 9 },
  { day: 'Fri', engagements: 20, meetings: 9, calls: 14 },
  { day: 'Sat', engagements: 8, meetings: 2, calls: 5 },
  { day: 'Sun', engagements: 6, meetings: 1, calls: 4 },
]

export function WeeklyEngagementChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={mockData}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.06)" />
        <XAxis 
          dataKey="day"
          tick={{ fill: "rgba(148,163,184,.85)", fontSize: 12 }}
          axisLine={{ stroke: "rgba(255,255,255,.12)" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "rgba(148,163,184,.85)", fontSize: 12 }}
          axisLine={{ stroke: "rgba(255,255,255,.12)" }}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: "rgba(12,15,23,.95)",
            border: "1px solid rgba(255,255,255,.12)",
            borderRadius: 8,
            padding: "8px 12px"
          }}
          labelStyle={{ color: "rgba(248,250,252,.96)", fontWeight: 600 }}
          itemStyle={{ color: "rgba(148,163,184,.92)" }}
        />
        <Line
          type="monotone"
          dataKey="engagements"
          stroke="rgba(56,189,248,.85)"
          strokeWidth={2}
          dot={{ fill: "rgba(56,189,248,.85)", r: 4 }}
          activeDot={{ r: 6 }}
          name="Total Engagements"
        />
        <Line
          type="monotone"
          dataKey="meetings"
          stroke="rgba(45,212,191,.85)"
          strokeWidth={2}
          dot={{ fill: "rgba(45,212,191,.85)", r: 4 }}
          activeDot={{ r: 6 }}
          name="Meetings"
        />
        <Line
          type="monotone"
          dataKey="calls"
          stroke="rgba(167,139,250,.85)"
          strokeWidth={2}
          dot={{ fill: "rgba(167,139,250,.85)", r: 4 }}
          activeDot={{ r: 6 }}
          name="Calls"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
