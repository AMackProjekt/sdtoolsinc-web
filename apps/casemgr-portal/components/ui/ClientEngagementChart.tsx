'use client'

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

const mockData = [
  { month: 'Jan', activeClients: 28, employed: 12, programCompletion: 8 },
  { month: 'Feb', activeClients: 32, employed: 15, programCompletion: 10 },
  { month: 'Mar', activeClients: 35, employed: 18, programCompletion: 12 },
  { month: 'Apr', activeClients: 38, employed: 20, programCompletion: 14 },
  { month: 'May', activeClients: 42, employed: 24, programCompletion: 17 },
  { month: 'Jun', activeClients: 45, employed: 27, programCompletion: 19 },
]

export function ClientEngagementChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={mockData}>
        <defs>
          <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="rgba(56,189,248,.4)" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="rgba(56,189,248,.4)" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorEmployed" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="rgba(45,212,191,.4)" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="rgba(45,212,191,.4)" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorCompletion" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="rgba(167,139,250,.4)" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="rgba(167,139,250,.4)" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.06)" />
        <XAxis 
          dataKey="month"
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
        <Area
          type="monotone"
          dataKey="activeClients"
          stroke="rgba(56,189,248,.85)"
          fillOpacity={1}
          fill="url(#colorActive)"
          strokeWidth={2}
          name="Active Clients"
        />
        <Area
          type="monotone"
          dataKey="employed"
          stroke="rgba(45,212,191,.85)"
          fillOpacity={1}
          fill="url(#colorEmployed)"
          strokeWidth={2}
          name="Employed"
        />
        <Area
          type="monotone"
          dataKey="programCompletion"
          stroke="rgba(167,139,250,.85)"
          fillOpacity={1}
          fill="url(#colorCompletion)"
          strokeWidth={2}
          name="Program Completions"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
