"use client";
import { DesktopPortalLayout } from "@/components/desktop-demo/DesktopPortalLayout";
import { LayoutDashboard, Users, ShieldCheck, BarChart2, Settings2, ScrollText, FileText, Lock } from "lucide-react";

const NAV = [
  { href: "/desktop-demo/admin/dashboard",   label: "Dashboard",    icon: LayoutDashboard },
  { href: "/desktop-demo/admin/users",       label: "Users",        icon: Users },
  { href: "/desktop-demo/admin/compliance",  label: "Compliance",   icon: ShieldCheck },
  { href: "/desktop-demo/admin/analytics",   label: "Analytics",    icon: BarChart2 },
  { href: "/desktop-demo/admin/audit",       label: "Audit Logs",   icon: ScrollText },
  { href: "/desktop-demo/admin/content",     label: "Content",      icon: FileText },
  { href: "/desktop-demo/admin/security",    label: "Security",     icon: Lock },
  { href: "/desktop-demo/admin/settings",    label: "Settings",     icon: Settings2 },
];

export default function DesktopAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DesktopPortalLayout
      config={{
        label: "Admin Portal",
        homeHref: "/desktop-demo",
        navItems: NAV,
        TitleIcon: ShieldCheck,
        theme: {
          sidebar:    "bg-slate-950 border-violet-800/30",
          border:     "border-violet-800/30",
          iconBg:     "bg-violet-500/20",
          iconFg:     "text-violet-400",
          activeBg:   "bg-violet-700",
          navFg:      "text-violet-300/60",
          hoverBg:    "hover:bg-violet-900/40",
          userChipBg: "bg-violet-900/30",
          brandFg:    "text-violet-400",
        },
      }}
    >
      {children}
    </DesktopPortalLayout>
  );
}
