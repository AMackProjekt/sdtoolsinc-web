"use client";
import { DesktopPortalLayout } from "@/components/desktop-demo/DesktopPortalLayout";
import { LayoutDashboard, Heart, Users, Calendar, BookOpen, Award, ClipboardList, Settings } from "lucide-react";

const NAV = [
  { href: "/desktop-demo/hr/dashboard",   label: "Dashboard",    icon: LayoutDashboard },
  { href: "/desktop-demo/hr/employees",   label: "Employees",    icon: Users },
  { href: "/desktop-demo/hr/onboarding",  label: "Onboarding",   icon: ClipboardList },
  { href: "/desktop-demo/hr/leave",       label: "Leave",        icon: Calendar },
  { href: "/desktop-demo/hr/training",    label: "Training",     icon: BookOpen },
  { href: "/desktop-demo/hr/performance", label: "Performance",  icon: Award },
  { href: "/desktop-demo/hr/wellness",    label: "Wellness",     icon: Heart },
  { href: "/desktop-demo/hr/settings",    label: "Settings",     icon: Settings },
];

export default function DesktopHRLayout({ children }: { children: React.ReactNode }) {
  return (
    <DesktopPortalLayout
      config={{
        label: "HR Portal",
        homeHref: "/desktop-demo",
        navItems: NAV,
        TitleIcon: Heart,
        theme: {
          sidebar:    "bg-slate-950 border-pink-800/30",
          border:     "border-pink-800/30",
          iconBg:     "bg-pink-500/20",
          iconFg:     "text-pink-400",
          activeBg:   "bg-pink-700",
          navFg:      "text-pink-300/60",
          hoverBg:    "hover:bg-pink-900/40",
          userChipBg: "bg-pink-900/30",
          brandFg:    "text-pink-400",
        },
      }}
    >
      {children}
    </DesktopPortalLayout>
  );
}
