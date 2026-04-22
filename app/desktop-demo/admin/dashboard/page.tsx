"use client";
import { DesktopDemoDashboard } from "@/components/desktop-demo/DesktopDemoDashboard";
import { Users, ShieldCheck, BarChart2, ScrollText, AlertTriangle } from "lucide-react";

const CHART = [
  { name: "Jan", value: 340, secondary: 290 },
  { name: "Feb", value: 380, secondary: 310 },
  { name: "Mar", value: 420, secondary: 360 },
  { name: "Apr", value: 390, secondary: 350 },
  { name: "May", value: 460, secondary: 400 },
  { name: "Jun", value: 510, secondary: 440 },
  { name: "Jul", value: 490, secondary: 430 },
];

export default function AdminDashboardPage() {
  return (
    <DesktopDemoDashboard
      portalName="Admin"
      chartLabel="Platform Users (monthly)"
      chartColor="rgba(167,139,250,.85)"
      kpis={[
        { label: "Total Users", value: "1,284", delta: "+47", trend: "up", icon: Users, iconBg: "bg-violet-500/20", iconFg: "text-violet-400" },
        { label: "Compliance Rate", value: "97.4%", delta: "+0.8%", trend: "up", icon: ShieldCheck, iconBg: "bg-teal-500/20", iconFg: "text-teal-400" },
        { label: "Open Incidents", value: "3", delta: "-2", trend: "down", icon: AlertTriangle, iconBg: "bg-rose-500/20", iconFg: "text-rose-400" },
        { label: "Audit Events (30d)", value: "4,820", delta: "", trend: "flat", icon: ScrollText, iconBg: "bg-sky-500/20", iconFg: "text-sky-400" },
      ]}
      chartData={CHART}
      activity={[
        { id: "1", title: "User Role Updated: M. Chen → Admin", meta: "Today, 10:12 AM", badge: "IAM", badgeColor: "bg-violet-500/20 text-violet-300" },
        { id: "2", title: "Compliance Report Exported", meta: "Today, 8:00 AM", badge: "Compliance", badgeColor: "bg-teal-500/20 text-teal-300" },
        { id: "3", title: "Security Alert Resolved: #S-1041", meta: "Yesterday, 6:45 PM", badge: "Resolved", badgeColor: "bg-emerald-500/20 text-emerald-300" },
        { id: "4", title: "New User Registration: 12 pending", meta: "Yesterday, 3:00 PM", badge: "Pending", badgeColor: "bg-amber-500/20 text-amber-300" },
        { id: "5", title: "Audit Log Export: Jan–Jun", meta: "2 days ago", badge: "Audit", badgeColor: "bg-sky-500/20 text-sky-300" },
      ]}
      quickLinks={[
        { label: "Users", href: "/desktop-demo/admin/users", icon: Users, iconBg: "bg-violet-500/20", iconFg: "text-violet-400" },
        { label: "Compliance", href: "/desktop-demo/admin/compliance", icon: ShieldCheck, iconBg: "bg-teal-500/20", iconFg: "text-teal-400" },
        { label: "Analytics", href: "/desktop-demo/admin/analytics", icon: BarChart2, iconBg: "bg-sky-500/20", iconFg: "text-sky-400" },
        { label: "Audit Logs", href: "/desktop-demo/admin/audit", icon: ScrollText, iconBg: "bg-amber-500/20", iconFg: "text-amber-400" },
      ]}
    />
  );
}
