"use client";
import { DesktopPortalLayout } from "@/components/desktop-demo/DesktopPortalLayout";
import { LayoutDashboard, Newspaper, Megaphone, ImageIcon, Rss, FileText, Archive, Settings } from "lucide-react";

const NAV = [
  { href: "/desktop-demo/news/dashboard",      label: "Dashboard",    icon: LayoutDashboard },
  { href: "/desktop-demo/news/articles",       label: "Articles",     icon: Newspaper },
  { href: "/desktop-demo/news/announcements",  label: "Announcements",icon: Megaphone },
  { href: "/desktop-demo/news/media",          label: "Media Assets", icon: ImageIcon },
  { href: "/desktop-demo/news/feeds",          label: "Feeds",        icon: Rss },
  { href: "/desktop-demo/news/press",          label: "Press Kits",   icon: FileText },
  { href: "/desktop-demo/news/archive",        label: "Archive",      icon: Archive },
  { href: "/desktop-demo/news/settings",       label: "Settings",     icon: Settings },
];

export default function DesktopNewsLayout({ children }: { children: React.ReactNode }) {
  return (
    <DesktopPortalLayout
      config={{
        label: "Newsroom Portal",
        homeHref: "/desktop-demo",
        navItems: NAV,
        TitleIcon: Newspaper,
        theme: {
          sidebar:    "bg-slate-950 border-orange-800/30",
          border:     "border-orange-800/30",
          iconBg:     "bg-orange-500/20",
          iconFg:     "text-orange-400",
          activeBg:   "bg-orange-700",
          navFg:      "text-orange-300/60",
          hoverBg:    "hover:bg-orange-900/40",
          userChipBg: "bg-orange-900/30",
          brandFg:    "text-orange-400",
        },
      }}
    >
      {children}
    </DesktopPortalLayout>
  );
}
