"use client";
import { DesktopDemoDashboard } from "@/components/desktop-demo/DesktopDemoDashboard";
import { Users, FileText, ClipboardList, BarChart2, Calendar } from "lucide-react";

const CHART = [
  { name: "Mon", value: 12, secondary: 8 },
  { name: "Tue", value: 15, secondary: 10 },
  { name: "Wed", value: 11, secondary: 9 },
  { name: "Thu", value: 18, secondary: 14 },
  { name: "Fri", value: 20, secondary: 16 },
  { name: "Sat", value: 6, secondary: 5 },
  { name: "Sun", value: 4, secondary: 3 },
];

export default function StaffDashboardPage() {
  return (
    <DesktopDemoDashboard
      portalName="Staff"
      chartLabel="Case Interactions (7-day)"
      chartColor="rgba(56,189,248,.85)"
      kpis={[
        { label: "Active Participants", value: "47", delta: "+3", trend: "up", icon: Users, iconBg: "bg-sky-500/20", iconFg: "text-sky-400" },
        { label: "Open Cases", value: "12", delta: "-2", trend: "down", icon: ClipboardList, iconBg: "bg-violet-500/20", iconFg: "text-violet-400" },
        { label: "Notes This Week", value: "34", delta: "+8", trend: "up", icon: FileText, iconBg: "bg-teal-500/20", iconFg: "text-teal-400" },
        { label: "Upcoming Sessions", value: "9", delta: "", trend: "flat", icon: Calendar, iconBg: "bg-amber-500/20", iconFg: "text-amber-400" },
      ]}
      chartData={CHART}
      activity={[
        { id: "1", title: "Case Note: Alex R. — Weekly Check-in", meta: "Today, 11:45 AM", badge: "Note", badgeColor: "bg-sky-500/20 text-sky-300" },
        { id: "2", title: "New Participant: Jordan M. Assigned", meta: "Today, 9:00 AM", badge: "New", badgeColor: "bg-teal-500/20 text-teal-300" },
        { id: "3", title: "Program Update: Recovery Track B", meta: "Yesterday, 4:30 PM", badge: "Program", badgeColor: "bg-violet-500/20 text-violet-300" },
        { id: "4", title: "Report: Monthly Outcomes Submitted", meta: "Yesterday, 2:00 PM", badge: "Report", badgeColor: "bg-emerald-500/20 text-emerald-300" },
        { id: "5", title: "Session Rescheduled: Dana L.", meta: "2 days ago", badge: "Schedule", badgeColor: "bg-amber-500/20 text-amber-300" },
      ]}
      quickLinks={[
        { label: "Participants", href: "/desktop-demo/staff/participants", icon: Users, iconBg: "bg-sky-500/20", iconFg: "text-sky-400" },
        { label: "Case Notes", href: "/desktop-demo/staff/case-notes", icon: FileText, iconBg: "bg-teal-500/20", iconFg: "text-teal-400" },
        { label: "Programs", href: "/desktop-demo/staff/programs", icon: ClipboardList, iconBg: "bg-violet-500/20", iconFg: "text-violet-400" },
        { label: "Reports", href: "/desktop-demo/staff/reports", icon: BarChart2, iconBg: "bg-emerald-500/20", iconFg: "text-emerald-400" },
      ]}
    />
  );
}
