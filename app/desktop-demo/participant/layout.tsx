"use client";
import { DesktopPortalLayout } from "@/components/desktop-demo/DesktopPortalLayout";
import { LayoutDashboard, BookOpen, Target, PenLine, Heart, MessageSquare, User, FileText, Settings, Plug } from "lucide-react";

const NAV = [
  { href: "/desktop-demo/participant/dashboard",    label: "Dashboard",      icon: LayoutDashboard },
  { href: "/desktop-demo/participant/courses",      label: "My Courses",     icon: BookOpen },
  { href: "/desktop-demo/participant/goals",        label: "My Goals",       icon: Target },
  { href: "/desktop-demo/participant/journal",      label: "Daily Journal",  icon: PenLine },
  { href: "/desktop-demo/participant/self-care",    label: "Self-Care",      icon: Heart },
  { href: "/desktop-demo/participant/messages",     label: "Messages",       icon: MessageSquare },
  { href: "/desktop-demo/participant/profile",      label: "Profile",        icon: User },
  { href: "/desktop-demo/participant/resources",    label: "Resources",      icon: FileText },
  { href: "/desktop-demo/participant/integrations", label: "Integrations",   icon: Plug },
  { href: "/desktop-demo/participant/settings",     label: "Settings",       icon: Settings },
];

export default function DesktopParticipantLayout({ children }: { children: React.ReactNode }) {
  return (
    <DesktopPortalLayout
      config={{
        label: "Participant Portal",
        homeHref: "/desktop-demo",
        navItems: NAV,
        TitleIcon: LayoutDashboard,
        theme: {
          sidebar:     "bg-teal-950 border-teal-900/40",
          border:      "border-teal-900/40",
          iconBg:      "bg-teal-500/20",
          iconFg:      "text-teal-400",
          activeBg:    "bg-teal-700",
          navFg:       "text-teal-300/60",
          hoverBg:     "hover:bg-teal-900/60",
          userChipBg:  "bg-teal-900/40",
          brandFg:     "text-teal-400",
        },
      }}
    >
      {children}
    </DesktopPortalLayout>
  );
}
