"use client";
import { DesktopPortalLayout } from "@/components/desktop-demo/DesktopPortalLayout";
import { LayoutDashboard, Users, FileText, ClipboardList, Calendar, BarChart2, BookOpen, Settings } from "lucide-react";

const NAV = [
  { href: "/desktop-demo/staff/dashboard",     label: "Dashboard",    icon: LayoutDashboard },
  { href: "/desktop-demo/staff/participants",  label: "Participants", icon: Users },
  { href: "/desktop-demo/staff/case-notes",    label: "Case Notes",   icon: FileText },
  { href: "/desktop-demo/staff/programs",      label: "Programs",     icon: ClipboardList },
  { href: "/desktop-demo/staff/schedule",      label: "Schedule",     icon: Calendar },
  { href: "/desktop-demo/staff/reports",       label: "Reports",      icon: BarChart2 },
  { href: "/desktop-demo/staff/resources",     label: "Resources",    icon: BookOpen },
  { href: "/desktop-demo/staff/settings",      label: "Settings",     icon: Settings },
];

export default function DesktopStaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <DesktopPortalLayout
      config={{
        label: "Staff Portal",
        homeHref: "/desktop-demo",
        navItems: NAV,
        TitleIcon: LayoutDashboard,
        theme: {
          sidebar:    "bg-slate-950 border-sky-900/30",
          border:     "border-sky-900/30",
          iconBg:     "bg-sky-500/20",
          iconFg:     "text-sky-400",
          activeBg:   "bg-sky-700",
          navFg:      "text-sky-300/60",
          hoverBg:    "hover:bg-sky-900/40",
          userChipBg: "bg-sky-900/30",
          brandFg:    "text-sky-400",
        },
      }}
    >
      {children}
    </DesktopPortalLayout>
  );
}
