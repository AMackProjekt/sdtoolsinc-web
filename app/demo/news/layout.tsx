"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Megaphone,
  Images,
  Calendar,
  BarChart3,
  Settings,
  ArrowLeft,
  Menu,
  X,
  LogOut,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useAuth } from "@/lib/auth";
import { GlobalSearch } from "@/components/ui/GlobalSearch";
import { InternalChat } from "@/components/ui/InternalChat";
import { MackAI } from "@/components/ui/MackAI";
import Link from "next/link";

const NAV = [
  { href: "/demo/news/dashboard",     label: "Dashboard",      icon: LayoutDashboard },
  { href: "/demo/news/articles",      label: "Articles",       icon: FileText },
  { href: "/demo/news/announcements",  label: "Announcements",  icon: Megaphone },
  { href: "/demo/news/media",         label: "Media Library",  icon: Images },
  { href: "/demo/news/calendar",      label: "Calendar",       icon: Calendar },
  { href: "/demo/news/analytics",     label: "Analytics",      icon: BarChart3 },
  { href: "/demo/news/settings",      label: "Settings",       icon: Settings },
];

export default function DemoNewsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-900">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-rose-900/30 bg-slate-900 transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand */}
        <div className="flex h-16 items-center gap-3 border-b border-rose-900/30 px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400">
            <FileText size={16} />
          </div>
          <div className="leading-tight">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-rose-400/70">T.O.O.L.S Inc</div>
            <div className="text-sm font-bold text-white">News Portal</div>
          </div>
          <button
            type="button"
            aria-label="Close sidebar"
            title="Close sidebar"
            onClick={() => setSidebarOpen(false)}
            className="ml-auto text-rose-300/50 hover:text-white lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-0.5">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                      active
                        ? "bg-rose-900/60 text-rose-200"
                        : "text-slate-400/70 hover:bg-slate-800/60 hover:text-rose-200"
                    )}
                  >
                    <Icon size={16} />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-rose-900/30 p-4 space-y-1">
          {user && (
            <div className="flex items-center gap-3 rounded-lg bg-rose-950/40 px-3 py-2.5 mb-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-500/30 text-xs font-bold text-rose-200">
                {user.name?.charAt(0).toUpperCase() ?? "N"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-semibold text-rose-200">{user.name}</div>
                <div className="truncate text-[11px] text-slate-400/60">{user.email}</div>
              </div>
            </div>
          )}
          <button
            onClick={() => router.push("/demo")}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400/70 hover:bg-slate-800/60 hover:text-rose-200 transition-all"
          >
            <ArrowLeft size={16} />
            Demo Home
          </button>
          <button
            onClick={() => router.push("/demo")}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400/70 hover:bg-slate-800/60 hover:text-rose-200 transition-all"
          >
            <LogOut size={16} />
            Exit Demo
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col min-w-0 lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-rose-900/30 bg-slate-900/80 backdrop-blur-xl px-5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Open sidebar"
              title="Open sidebar"
              onClick={() => setSidebarOpen(true)}
              className="text-slate-400 hover:text-white lg:hidden"
            >
              <Menu size={20} />
            </button>
            <span className="text-sm font-semibold text-slate-300 hidden sm:block">News Portal</span>
          </div>
          <div className="flex items-center gap-3">
            <GlobalSearch role="admin" />
            <button
              type="button"
              aria-label="Notifications"
              title="Notifications"
              className="relative rounded-lg p-2 text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Bell size={18} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-400" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-slate-900">{children}</main>
      </div>

      <InternalChat currentUser="Alex Rivera" role="staff" />
      <MackAI />
    </div>
  );
}
