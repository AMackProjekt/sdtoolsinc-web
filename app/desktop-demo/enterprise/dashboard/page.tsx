"use client";
import { DesktopDemoDashboard } from "@/components/desktop-demo/DesktopDemoDashboard";
import { Building2, Users, BarChart3, ShieldCheck, Zap } from "lucide-react";

const CHART = [
  { name: "Q1", value: 2400, secondary: 1800 },
  { name: "Q2", value: 3100, secondary: 2300 },
  { name: "Q3", value: 2800, secondary: 2100 },
  { name: "Q4", value: 3800, secondary: 2900 },
  { name: "Q1+", value: 4200, secondary: 3200 },
];

export default function EnterpriseDashboardPage() {
  return (
    <DesktopDemoDashboard
      portalName="Enterprise"
      chartLabel="Platform Engagement (quarterly)"
      chartColor="rgba(34,211,238,.85)"
      kpis={[
        { label: "Active Sites", value: "18", delta: "+2", trend: "up", icon: Building2, iconBg: "bg-cyan-500/20", iconFg: "text-cyan-400" },
        { label: "Org Members", value: "3,247", delta: "+124", trend: "up", icon: Users, iconBg: "bg-sky-500/20", iconFg: "text-sky-400" },
        { label: "SLA Compliance", value: "99.2%", delta: "+0.3%", trend: "up", icon: ShieldCheck, iconBg: "bg-teal-500/20", iconFg: "text-teal-400" },
        { label: "Active Integrations", value: "24", delta: "+5", trend: "up", icon: Zap, iconBg: "bg-violet-500/20", iconFg: "text-violet-400" },
      ]}
      chartData={CHART}
      activity={[
        { id: "1", title: "New Site Onboarded: Phoenix, AZ", meta: "Today, 9:00 AM", badge: "Site", badgeColor: "bg-cyan-500/20 text-cyan-300" },
        { id: "2", title: "SSO Integration: Azure AD Updated", meta: "Yesterday, 4:00 PM", badge: "Integration", badgeColor: "bg-violet-500/20 text-violet-300" },
        { id: "3", title: "Executive Report: Q2 Outcomes", meta: "Yesterday, 11:00 AM", badge: "Report", badgeColor: "bg-sky-500/20 text-sky-300" },
        { id: "4", title: "Org Policy Updated: Data Retention", meta: "3 days ago", badge: "Policy", badgeColor: "bg-teal-500/20 text-teal-300" },
        { id: "5", title: "Audit: Enterprise Access Review", meta: "1 week ago", badge: "Audit", badgeColor: "bg-amber-500/20 text-amber-300" },
      ]}
      quickLinks={[
        { label: "Organization", href: "/desktop-demo/enterprise/org", icon: Building2, iconBg: "bg-cyan-500/20", iconFg: "text-cyan-400" },
        { label: "Metrics", href: "/desktop-demo/enterprise/metrics", icon: BarChart3, iconBg: "bg-sky-500/20", iconFg: "text-sky-400" },
        { label: "Integrations", href: "/desktop-demo/enterprise/integrations", icon: Zap, iconBg: "bg-violet-500/20", iconFg: "text-violet-400" },
        { label: "Compliance", href: "/desktop-demo/enterprise/compliance", icon: ShieldCheck, iconBg: "bg-teal-500/20", iconFg: "text-teal-400" },
      ]}
    />
  );
}
