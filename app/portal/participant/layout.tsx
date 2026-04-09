"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { GlobalSearch } from "@/components/ui/GlobalSearch";
import { InternalChat } from "@/components/ui/InternalChat";

const NAV = [
  { href: "/portal/participant/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/participant/courses", label: "My Courses", icon: BookOpen },
  { href: "/portal/participant/profile", label: "Profile", icon: User },
  { href: "/portal/participant/resources", label: "Resources", icon: FileText },
  { href: "/portal/participant/messages", label: "Messages", icon: MessageSquare },
  { href: "/portal/participant/settings", label: "Settings", icon: Settings },
];

export default function ParticipantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-bg">
      {/* Mobile overlay */}
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
        {/* Sidebar Header */}
        <div className="flex items-center justify-between border-b border-teal-900/40 px-5 py-5">
          <Link href="/" className="flex items-center gap-3 group">
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
                <div className="truncate text-sm font-semibold text-white">
                  {user.name}
                </div>
                <div className="truncate text-xs text-teal-400/60">{user.email}</div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-4">
          {NAV.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
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

        {/* Sidebar Footer */}
        <div className="border-t border-teal-900/40 px-4 py-4 space-y-1">
          <Link
            href="/portal"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-teal-300/50 hover:bg-teal-900/40 hover:text-white transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Portal Hub
          </Link>
          {user && (
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-teal-300/50 hover:bg-teal-900/40 hover:text-white transition-all"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          )}
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-panel/70 backdrop-blur-xl px-6 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-muted hover:text-text lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="text-sm font-semibold text-muted hidden sm:block">
              Participant Portal
            </span>
          </div>

          <div className="flex items-center gap-3">
            <GlobalSearch role="participant" />
            <button className="relative rounded-lg p-2 text-muted hover:text-text hover:bg-white/5 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-teal-400" />
            </button>
            {user && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-500/20 text-sm font-bold text-teal-400">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden">
          <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />
          {children}
        </main>
        <InternalChat currentUser={user?.name ?? "Participant"} role="participant" />
      </div>
    </div>
  );
}
