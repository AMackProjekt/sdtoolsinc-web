"use client";
import { DesktopDemoDashboard } from "@/components/desktop-demo/DesktopDemoDashboard";
import { Users, Calendar, BookOpen, Award, Heart, ClipboardList } from "lucide-react";

const CHART = [
  { name: "Jan", value: 82, secondary: 74 },
  { name: "Feb", value: 85, secondary: 76 },
  { name: "Mar", value: 88, secondary: 80 },
  { name: "Apr", value: 84, secondary: 78 },
  { name: "May", value: 91, secondary: 84 },
  { name: "Jun", value: 89, secondary: 83 },
  { name: "Jul", value: 93, secondary: 86 },
];

export default function HRDashboardPage() {
  return (
    <DesktopDemoDashboard
      portalName="HR"
      chartLabel="Employee Engagement Score (monthly)"
      chartColor="rgba(244,114,182,.85)"
      kpis={[
        { label: "Total Employees", value: "312", delta: "+8", trend: "up", icon: Users, iconBg: "bg-pink-500/20", iconFg: "text-pink-400" },
        { label: "Onboarding Active", value: "14", delta: "+3", trend: "up", icon: ClipboardList, iconBg: "bg-sky-500/20", iconFg: "text-sky-400" },
        { label: "Open Leave Requests", value: "7", delta: "-2", trend: "down", icon: Calendar, iconBg: "bg-amber-500/20", iconFg: "text-amber-400" },
        { label: "Wellness Score Avg", value: "91%", delta: "+2%", trend: "up", icon: Heart, iconBg: "bg-rose-500/20", iconFg: "text-rose-400" },
      ]}
      chartData={CHART}
      activity={[
        { id: "1", title: "Onboarding Complete: Riley T.", meta: "Today, 10:00 AM", badge: "Onboarded", badgeColor: "bg-teal-500/20 text-teal-300" },
        { id: "2", title: "Leave Request: Morgan K. (Aug 5–9)", meta: "Today, 9:30 AM", badge: "Pending", badgeColor: "bg-amber-500/20 text-amber-300" },
        { id: "3", title: "Performance Review Submitted: J. Lee", meta: "Yesterday", badge: "Review", badgeColor: "bg-pink-500/20 text-pink-300" },
        { id: "4", title: "Training Completion: Safety & Compliance", meta: "2 days ago", badge: "Training", badgeColor: "bg-sky-500/20 text-sky-300" },
        { id: "5", title: "New Job Posting: Program Coordinator", meta: "3 days ago", badge: "Recruiting", badgeColor: "bg-violet-500/20 text-violet-300" },
      ]}
      quickLinks={[
        { label: "Employees", href: "/desktop-demo/hr/employees", icon: Users, iconBg: "bg-pink-500/20", iconFg: "text-pink-400" },
        { label: "Onboarding", href: "/desktop-demo/hr/onboarding", icon: ClipboardList, iconBg: "bg-sky-500/20", iconFg: "text-sky-400" },
        { label: "Training", href: "/desktop-demo/hr/training", icon: BookOpen, iconBg: "bg-violet-500/20", iconFg: "text-violet-400" },
        { label: "Performance", href: "/desktop-demo/hr/performance", icon: Award, iconBg: "bg-amber-500/20", iconFg: "text-amber-400" },
      ]}
    />
  );
}
