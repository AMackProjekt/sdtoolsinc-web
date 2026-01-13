"use client";

import { GlowCard } from "./GlowCard";
import { SectionHeading } from "./SectionHeading";
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from "recharts";

const chartData = [
  { name: "Mon", value: 22 },
  { name: "Tue", value: 35 },
  { name: "Wed", value: 28 },
  { name: "Thu", value: 46 },
  { name: "Fri", value: 41 },
  { name: "Sat", value: 52 },
  { name: "Sun", value: 48 }
];

function MiniKpi({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <GlowCard className="p-5">
      <div className="text-xs font-semibold tracking-[0.18em] text-muted uppercase">{label}</div>
      <div className="mt-2 text-2xl font-extrabold tracking-tight">{value}</div>
      <div className="mt-2 text-sm text-muted">{hint}</div>
    </GlowCard>
  );
}

export function DashboardSection() {
  return (
    <section id="dashboard" className="pt-20">
      <SectionHeading
        eyebrow="Platform"
        title="Real dashboard UI — not a placeholder"
        subtitle="DashDark-style layout with Fluent micro-motion: sidebar, command bar, KPIs, activity feed, table, and live trend chart."
      />

      <div className="mx-auto mt-10 max-w-container">
        <div className="glass overflow-hidden rounded-xl">
          <div className="grid min-h-[520px] grid-cols-1 lg:grid-cols-[280px_1fr]">
            {/* Sidebar */}
            <div className="border-b border-border p-5 lg:border-b-0 lg:border-r">
              <div className="mb-5 flex items-center justify-between">
                <div className="font-extrabold tracking-tight">CaseFlow</div>
                <div className="h-2 w-2 rounded-full bg-brand" />
              </div>

              <div className="space-y-2">
                {["Overview", "Participants", "Workflows", "Reports", "Settings"].map((x) => (
                  <div
                    key={x}
                    className="rounded-md px-3 py-2 text-sm text-muted hover:bg-white/5 hover:text-text"
                  >
                    {x}
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-lg border border-border bg-white/5 p-4">
                <div className="text-xs font-semibold tracking-[0.18em] text-muted uppercase">
                  Status
                </div>
                <div className="mt-2 text-sm text-text">
                  Audit trail enabled · Role separation active
                </div>
                <div className="mt-2 text-xs text-muted">
                  Least privilege defaults, export-ready logs.
                </div>
              </div>
            </div>

            {/* Main */}
            <div className="p-5">
              {/* Top bar */}
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-sm text-muted">Overview</div>
                  <div className="text-xl font-extrabold tracking-tight">Operational Snapshot</div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="glass rounded-md px-4 py-2 text-sm text-muted">
                    Search participants…
                  </div>
                  <div className="glass rounded-md px-4 py-2 text-sm text-muted">
                    Last 7 days
                  </div>
                </div>
              </div>

              {/* KPI row */}
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <MiniKpi label="Active workflows" value="18" hint="Running without exceptions" />
                <MiniKpi label="Pending follow-ups" value="6" hint="Auto reminders ready" />
                <MiniKpi label="Compliance checks" value="100%" hint="Policy aligned & logged" />
              </div>

              {/* Chart + Activity */}
              <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_.8fr]">
                <GlowCard className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold tracking-[0.18em] text-muted uppercase">
                        Engagement trend
                      </div>
                      <div className="mt-1 text-sm text-muted">Weekly activity index</div>
                    </div>
                    <div className="text-xs text-muted">Live preview</div>
                  </div>

                  <div className="mt-4 h-[220px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <XAxis dataKey="name" tick={{ fill: "rgba(148,163,184,.85)", fontSize: 12 }} axisLine={false} tickLine={false} />
                        <Tooltip
                          contentStyle={{
                            background: "rgba(12,15,23,.92)",
                            border: "1px solid rgba(255,255,255,.12)",
                            borderRadius: 12,
                            color: "rgba(248,250,252,.96)"
                          }}
                          labelStyle={{ color: "rgba(148,163,184,.9)" }}
                        />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="rgba(56,189,248,.85)"
                          fill="rgba(56,189,248,.14)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </GlowCard>

                <GlowCard className="p-5">
                  <div className="text-xs font-semibold tracking-[0.18em] text-muted uppercase">
                    Activity feed
                  </div>
                  <div className="mt-3 space-y-3">
                    {[
                      { t: "2m ago", m: "Follow-up scheduled for A11" },
                      { t: "18m ago", m: "Document checklist updated for B4" },
                      { t: "1h ago", m: "New intake added to Row A" },
                      { t: "3h ago", m: "Audit export generated" }
                    ].map((x) => (
                      <div key={x.m} className="rounded-lg border border-border bg-white/5 p-3">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-semibold">Update</div>
                          <div className="text-xs text-muted">{x.t}</div>
                        </div>
                        <div className="mt-1 text-sm text-muted">{x.m}</div>
                      </div>
                    ))}
                  </div>
                </GlowCard>
              </div>

              {/* Table */}
              <GlowCard className="mt-4 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold tracking-[0.18em] text-muted uppercase">
                      Queue
                    </div>
                    <div className="mt-1 text-sm text-muted">Items needing action</div>
                  </div>
                  <div className="text-xs text-muted">Auto-sorted</div>
                </div>

                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="text-muted">
                      <tr className="border-b border-border">
                        <th className="py-2 pr-4 font-semibold">UID</th>
                        <th className="py-2 pr-4 font-semibold">Item</th>
                        <th className="py-2 pr-4 font-semibold">Priority</th>
                        <th className="py-2 pr-4 font-semibold">Owner</th>
                        <th className="py-2 pr-2 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-text">
                      {[
                        ["A11", "Weekly check-in logged", "Normal", "CM", "Ready"],
                        ["B4", "Incident statement intake", "High", "CM", "Pending"],
                        ["A6", "Document verification", "Normal", "CM", "In progress"],
                        ["B3", "Safety follow-up", "High", "CM", "Pending"]
                      ].map((r) => (
                        <tr key={r[0] + r[1]} className="border-b border-border/60">
                          <td className="py-3 pr-4 font-semibold">{r[0]}</td>
                          <td className="py-3 pr-4 text-muted">{r[1]}</td>
                          <td className="py-3 pr-4">
                            <span className="rounded-md border border-border bg-white/5 px-2 py-1 text-xs">
                              {r[2]}
                            </span>
                          </td>
                          <td className="py-3 pr-4 text-muted">{r[3]}</td>
                          <td className="py-3 pr-2">
                            <span className="rounded-md border border-border bg-white/5 px-2 py-1 text-xs">
                              {r[4]}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlowCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
