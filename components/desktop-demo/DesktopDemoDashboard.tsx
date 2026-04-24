"use client";

/**
 * components/desktop-demo/DesktopDemoDashboard.tsx
 *
 * Generic preview dashboard used across all 7 desktop-demo portal dashboards.
 * Renders KPI cards, an area chart, a recent activity table, and a quick-access grid.
 * All data is static mock data — no API calls.
 */

import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { TrendingUp, TrendingDown, Minus, LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export type KpiCard = {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down" | "flat";
  icon: LucideIcon;
  iconBg: string;
  iconFg: string;
};

export type ChartPoint = { name: string; value: number; secondary?: number };

export type ActivityRow = {
  id: string;
  title: string;
  meta: string;
  badge?: string;
  badgeColor?: string;
};

export type QuickLink = {
  label: string;
  href: string;
  icon: LucideIcon;
  iconBg: string;
  iconFg: string;
};

type Props = {
  portalName: string;
  kpis: KpiCard[];
  chartData: ChartPoint[];
  chartLabel?: string;
  chartColor?: string;
  activity: ActivityRow[];
  quickLinks?: QuickLink[];
  accentClass?: string;
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
};
const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

export function DesktopDemoDashboard({
  portalName,
  kpis,
  chartData,
  chartLabel = "Activity",
  chartColor = "rgba(56,189,248,.85)",
  activity,
  quickLinks = [],
}: Props) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-text">{portalName} Dashboard</h1>
          <p className="text-sm text-muted">{today}</p>
        </div>
        <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400">
          Preview — simulated data
        </span>
      </div>

      {/* KPI row */}
      <motion.div
        className={cn("grid gap-4", kpis.length <= 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-2 lg:grid-cols-4")}
        variants={container}
        initial="hidden"
        animate="show"
      >
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          const TrendIcon = kpi.trend === "up" ? TrendingUp : kpi.trend === "down" ? TrendingDown : Minus;
          const trendColor = kpi.trend === "up" ? "text-emerald-400" : kpi.trend === "down" ? "text-rose-400" : "text-slate-400";
          return (
            <motion.div
              key={kpi.label}
              variants={item}
              className="rounded-xl border border-border bg-panel p-5"
            >
              <div className="flex items-center justify-between">
                <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", kpi.iconBg)}>
                  <Icon className={cn("h-4 w-4", kpi.iconFg)} />
                </div>
                {kpi.delta && (
                  <div className={cn("flex items-center gap-1 text-xs font-semibold", trendColor)}>
                    <TrendIcon size={12} />
                    {kpi.delta}
                  </div>
                )}
              </div>
              <div className="mt-3 text-2xl font-extrabold tracking-tight text-text">{kpi.value}</div>
              <div className="mt-1 text-xs text-muted">{kpi.label}</div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Chart + Activity */}
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        {/* Area chart */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.45 }}
          className="rounded-xl border border-border bg-panel p-5"
        >
          <div className="mb-4 text-sm font-bold text-text">{chartLabel}</div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "rgba(148,163,184,.85)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "rgba(148,163,184,.85)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={32}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(12,15,23,.92)",
                    border: "1px solid rgba(255,255,255,.12)",
                    borderRadius: 10,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={chartColor}
                  fill={chartColor.replace(".85)", ".12)")}
                  strokeWidth={2}
                />
                {chartData[0]?.secondary !== undefined && (
                  <Area
                    type="monotone"
                    dataKey="secondary"
                    stroke="rgba(167,139,250,.7)"
                    fill="rgba(167,139,250,.07)"
                    strokeWidth={1.5}
                    strokeDasharray="4 2"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Activity table */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.45 }}
          className="rounded-xl border border-border bg-panel p-5"
        >
          <div className="mb-3 text-sm font-bold text-text">Recent Activity</div>
          <div className="space-y-3">
            {activity.map((row) => (
              <div key={row.id} className="flex items-start justify-between gap-2 border-b border-border/40 pb-3 last:border-0 last:pb-0">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-text">{row.title}</div>
                  <div className="text-xs text-muted">{row.meta}</div>
                </div>
                {row.badge && (
                  <span
                    className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold", row.badgeColor ?? "bg-slate-700 text-slate-300")}
                  >
                    {row.badge}
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick links */}
      {quickLinks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <div className="mb-3 text-sm font-bold text-text">Quick Access</div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className="group flex items-center gap-3 rounded-xl border border-border bg-panel p-4 transition-all hover:-translate-y-0.5 hover:shadow-glow"
                >
                  <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", link.iconBg)}>
                    <Icon className={cn("h-4 w-4", link.iconFg)} />
                  </div>
                  <span className="text-sm font-medium text-muted group-hover:text-text">{link.label}</span>
                </a>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
