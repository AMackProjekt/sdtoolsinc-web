"use client";
import { DesktopDemoDashboard } from "@/components/desktop-demo/DesktopDemoDashboard";
import { Newspaper, Megaphone, ImageIcon, Eye, FileText, Rss } from "lucide-react";

const CHART = [
  { name: "Mon", value: 1240, secondary: 890 },
  { name: "Tue", value: 1580, secondary: 1100 },
  { name: "Wed", value: 2100, secondary: 1600 },
  { name: "Thu", value: 1870, secondary: 1400 },
  { name: "Fri", value: 2340, secondary: 1900 },
  { name: "Sat", value: 980, secondary: 700 },
  { name: "Sun", value: 820, secondary: 600 },
];

export default function NewsDashboardPage() {
  return (
    <DesktopDemoDashboard
      portalName="Newsroom"
      chartLabel="Article Views (daily)"
      chartColor="rgba(251,146,60,.85)"
      kpis={[
        { label: "Published Articles", value: "148", delta: "+12", trend: "up", icon: Newspaper, iconBg: "bg-orange-500/20", iconFg: "text-orange-400" },
        { label: "Total Views (7d)", value: "11.0K", delta: "+18%", trend: "up", icon: Eye, iconBg: "bg-sky-500/20", iconFg: "text-sky-400" },
        { label: "Active Announcements", value: "6", delta: "+1", trend: "up", icon: Megaphone, iconBg: "bg-amber-500/20", iconFg: "text-amber-400" },
        { label: "Media Assets", value: "892", delta: "+34", trend: "up", icon: ImageIcon, iconBg: "bg-violet-500/20", iconFg: "text-violet-400" },
      ]}
      chartData={CHART}
      activity={[
        { id: "1", title: "Published: Q3 Program Outcomes Update", meta: "Today, 11:00 AM", badge: "Published", badgeColor: "bg-orange-500/20 text-orange-300" },
        { id: "2", title: "Announcement: Staff Training Aug 20", meta: "Today, 9:00 AM", badge: "Announcement", badgeColor: "bg-amber-500/20 text-amber-300" },
        { id: "3", title: "Press Kit Updated: Brand Assets 2024", meta: "Yesterday", badge: "Media", badgeColor: "bg-violet-500/20 text-violet-300" },
        { id: "4", title: "Article Drafted: Wellness Initiative", meta: "Yesterday", badge: "Draft", badgeColor: "bg-slate-500/20 text-slate-300" },
        { id: "5", title: "RSS Feed Synced: 3 new external items", meta: "2 days ago", badge: "Feed", badgeColor: "bg-sky-500/20 text-sky-300" },
      ]}
      quickLinks={[
        { label: "Articles", href: "/desktop-demo/news/articles", icon: Newspaper, iconBg: "bg-orange-500/20", iconFg: "text-orange-400" },
        { label: "Announcements", href: "/desktop-demo/news/announcements", icon: Megaphone, iconBg: "bg-amber-500/20", iconFg: "text-amber-400" },
        { label: "Media Assets", href: "/desktop-demo/news/media", icon: ImageIcon, iconBg: "bg-violet-500/20", iconFg: "text-violet-400" },
        { label: "Feeds", href: "/desktop-demo/news/feeds", icon: Rss, iconBg: "bg-sky-500/20", iconFg: "text-sky-400" },
        { label: "Press Kits", href: "/desktop-demo/news/press", icon: FileText, iconBg: "bg-teal-500/20", iconFg: "text-teal-400" },
      ]}
    />
  );
}
