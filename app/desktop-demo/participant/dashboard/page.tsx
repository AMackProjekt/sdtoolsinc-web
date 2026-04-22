"use client";
import { DesktopDemoDashboard } from "@/components/desktop-demo/DesktopDemoDashboard";
import { BookOpen, Target, Heart, Activity, Award, MessageSquare } from "lucide-react";

const CHART = [
  { name: "Mon", value: 72, secondary: 60 },
  { name: "Tue", value: 68, secondary: 65 },
  { name: "Wed", value: 80, secondary: 70 },
  { name: "Thu", value: 75, secondary: 73 },
  { name: "Fri", value: 85, secondary: 78 },
  { name: "Sat", value: 90, secondary: 82 },
  { name: "Sun", value: 88, secondary: 80 },
];

export default function ParticipantDashboardPage() {
  return (
    <DesktopDemoDashboard
      portalName="Participant"
      chartLabel="Wellness Score (7-day)"
      chartColor="rgba(45,212,191,.85)"
      kpis={[
        { label: "Wellness Score", value: "88 / 100", delta: "+4 pts", trend: "up", icon: Activity, iconBg: "bg-teal-500/20", iconFg: "text-teal-400" },
        { label: "Active Goals", value: "5", delta: "2 new", trend: "up", icon: Target, iconBg: "bg-sky-500/20", iconFg: "text-sky-400" },
        { label: "Course Progress", value: "67%", delta: "+12%", trend: "up", icon: BookOpen, iconBg: "bg-violet-500/20", iconFg: "text-violet-400" },
        { label: "Self-Care Streak", value: "14 days", delta: "", trend: "flat", icon: Heart, iconBg: "bg-pink-500/20", iconFg: "text-pink-400" },
      ]}
      chartData={CHART}
      activity={[
        { id: "1", title: "Completed: Mindfulness Session", meta: "Today, 8:32 AM", badge: "Done", badgeColor: "bg-teal-500/20 text-teal-300" },
        { id: "2", title: "Goal Updated: Sleep 8h", meta: "Yesterday, 10:15 PM", badge: "Goal", badgeColor: "bg-sky-500/20 text-sky-300" },
        { id: "3", title: "Course: Stress Management — Ch. 4", meta: "Yesterday, 3:00 PM", badge: "Course", badgeColor: "bg-violet-500/20 text-violet-300" },
        { id: "4", title: "Journal Entry Added", meta: "2 days ago", badge: "Journal", badgeColor: "bg-amber-500/20 text-amber-300" },
        { id: "5", title: "Self-Care: 30-min Walk", meta: "2 days ago", badge: "Care", badgeColor: "bg-pink-500/20 text-pink-300" },
      ]}
      quickLinks={[
        { label: "My Courses", href: "/desktop-demo/participant/courses", icon: BookOpen, iconBg: "bg-violet-500/20", iconFg: "text-violet-400" },
        { label: "My Goals", href: "/desktop-demo/participant/goals", icon: Target, iconBg: "bg-sky-500/20", iconFg: "text-sky-400" },
        { label: "Self-Care", href: "/desktop-demo/participant/self-care", icon: Heart, iconBg: "bg-pink-500/20", iconFg: "text-pink-400" },
        { label: "Achievements", href: "/desktop-demo/participant/profile", icon: Award, iconBg: "bg-amber-500/20", iconFg: "text-amber-400" },
        { label: "Messages", href: "/desktop-demo/participant/messages", icon: MessageSquare, iconBg: "bg-teal-500/20", iconFg: "text-teal-400" },
      ]}
    />
  );
}
