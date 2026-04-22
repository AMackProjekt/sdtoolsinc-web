"use client";
import { DesktopPortalLayout } from "@/components/desktop-demo/DesktopPortalLayout";
import { LayoutDashboard, Building2, Users, BarChart3, Settings, ScrollText, ShieldCheck, Zap } from "lucide-react";

const NAV = [
  { href: "/desktop-demo/enterprise/dashboard",    label: "Dashboard",     icon: LayoutDashboard },
  { href: "/desktop-demo/enterprise/org",          label: "Organization",  icon: Building2 },
  { href: "/desktop-demo/enterprise/users",        label: "Users & Roles", icon: Users },
  { href: "/desktop-demo/enterprise/metrics",      label: "Metrics",       icon: BarChart3 },
  { href: "/desktop-demo/enterprise/audit",        label: "Audit",         icon: ScrollText },
  { href: "/desktop-demo/enterprise/compliance",   label: "Compliance",    icon: ShieldCheck },
  { href: "/desktop-demo/enterprise/integrations", label: "Integrations",  icon: Zap },
  { href: "/desktop-demo/enterprise/settings",     label: "Settings",      icon: Settings },
];

export default function DesktopEnterpriseLayout({ children }: { children: React.ReactNode }) {
  return (
    <DesktopPortalLayout
      config={{
        label: "Enterprise Portal",
        homeHref: "/desktop-demo",
        navItems: NAV,
        TitleIcon: Building2,
        theme: {
          sidebar:    "bg-slate-950 border-cyan-800/30",
          border:     "border-cyan-800/30",
          iconBg:     "bg-cyan-500/20",
          iconFg:     "text-cyan-400",
          activeBg:   "bg-cyan-700",
          navFg:      "text-cyan-300/60",
          hoverBg:    "hover:bg-cyan-900/40",
          userChipBg: "bg-cyan-900/30",
          brandFg:    "text-cyan-400",
        },
      }}
    >
      {children}
    </DesktopPortalLayout>
  );
}
