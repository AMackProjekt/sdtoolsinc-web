"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/cn";
import {
  LayoutDashboard,
  BookOpen,
  User,
  FileText,
  MessageSquare,
  Settings,
  ArrowLeft,
  Menu,
  X,
  LogOut,
  Bell,
  Target,
  PenLine,
  Heart,
  Plug,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { GlobalSearch } from "@/components/ui/GlobalSearch";
import { InternalChat } from "@/components/ui/InternalChat";
import { MackAI } from "@/components/ui/MackAI";

const NAV = [
  { href: "/demo/participant/dashboard",    label: "Dashboard",    icon: LayoutDashboard },
  { href: "/demo/participant/courses",      label: "My Courses",   icon: BookOpen },
  { href: "/demo/participant/goals",        label: "My Goals",     icon: Target },
  { href: "/demo/participant/journal",      label: "Daily Journal",icon: PenLine },
  { href: "/demo/participant/self-care",    label: "Self-Care",    icon: Heart },
  { href: "/demo/participant/messages",     label: "Messages",     icon: MessageSquare },
  { href: "/demo/participant/profile",      label: "Profile",      icon: User },
  { href: "/demo/participant/resources",    label: "Resources",    icon: FileText },
  { href: "/demo/participant/integrations", label: "Integrations", icon: Plug },
  { href: "/demo/participant/settings",     label: "Settings",     icon: Settings },
];

export default function DemoParticipantLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-bg">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-teal-950 border-r border-teal-900/40 transition-transform duration-300 lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-teal-900/40 px-5 py-5">
          <Link href="/demo" className="flex items-center gap-3 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/20">
              <LayoutDashboard className="h-4 w-4 text-teal-400" />
            </div>
            <div className="leading-tight">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-teal-400/70">
                T.O.O.L.S Inc
              </div>
              <div className="text-sm font-bold text-white">Participant Portal</div>
            </div>
          </Link>
          <button
            type="button"
            aria-label="Close sidebar"
            title="Close sidebar"
            onClick={() => setSidebarOpen(false)}
            className="text-teal-300/50 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User chip */}
        {user && (
          <div className="border-b border-teal-900/40 px-5 py-4">
            <div className="flex items-center gap-3 rounded-xl bg-teal-900/40 px-3 py-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-500/30 text-sm font-bold text-teal-300">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-white">{user.name}</div>
                <div className="truncate text-xs text-teal-400/60">{user.email}</div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-4">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  active
                    ? "bg-teal-700 text-white shadow-sm"
                    : "text-teal-300/60 hover:bg-teal-900/60 hover:text-white"
                )}
              >
                <Icon className={cn("h-4 w-4", active ? "text-white" : "text-teal-400/60")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-teal-900/40 px-4 py-4 space-y-1">
          <Link
            href="/demo"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-teal-300/50 hover:bg-teal-900/40 hover:text-white transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Demo Home
          </Link>
          <button
            onClick={() => router.push("/demo")}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-teal-300/50 hover:bg-teal-900/40 hover:text-white transition-all"
          >
            <LogOut className="h-4 w-4" />
            Exit Demo
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-panel/70 backdrop-blur-xl px-6 py-3">
          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Open sidebar"
              title="Open sidebar"
              onClick={() => setSidebarOpen(true)}
              className="text-muted hover:text-text lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="text-sm font-semibold text-muted hidden sm:block">Participant Portal</span>
          </div>
          <div className="flex items-center gap-3">
            <GlobalSearch role="participant" />
            <button
              type="button"
              aria-label="Notifications"
              title="Notifications"
              className="relative rounded-lg p-2 text-muted hover:text-text hover:bg-white/5 transition-colors"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-teal-400" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>

      <InternalChat currentUser="Alex Rivera" role="participant" />
      <MackAI />
    </div>
  );
}
