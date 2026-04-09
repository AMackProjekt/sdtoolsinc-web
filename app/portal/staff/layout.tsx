"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/cn";
import { InternalChat } from "@/components/ui/InternalChat";
import {
  LayoutDashboard,
  Users,
  Layers,
  FileText,
  BarChart2,
  Settings,
  Menu,
  X,
  Bell,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import { GlobalSearch } from "@/components/ui/GlobalSearch";

const NAV = [
  { href: "/portal/staff/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/staff/participants", label: "Participants", icon: Users },
  { href: "/portal/staff/programs", label: "Programs", icon: Layers },
  { href: "/portal/staff/resources", label: "Resources", icon: FileText },
  { href: "/portal/staff/reports", label: "Reports", icon: BarChart2 },
  { href: "/portal/staff/settings", label: "Settings", icon: Settings },
];

export default function StaffPortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated && !pathname.endsWith("/auth")) {
      router.replace("/portal/staff/auth");
    }
  }, [isAuthenticated, pathname, router]);

  const handleLogout = () => {
    logout();
    router.push("/portal");
  };

  // Don't render the layout wrapper on the auth page
  if (pathname.endsWith("/auth")) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-bg">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-sky-900/30 bg-slate-900 transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo / Brand */}
        <div className="flex h-16 items-center gap-3 border-b border-sky-900/30 px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/20 text-sky-400">
            <Users size={16} />
          </div>
          <span className="text-sm font-bold tracking-tight text-sky-200">Staff Portal</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <ul className="space-y-1">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <li key={href}>
                  <button
                    onClick={() => {
                      router.push(href);
                      setSidebarOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                      active
                        ? "bg-sky-900/60 text-sky-200"
                        : "text-slate-400/70 hover:bg-slate-800/60 hover:text-sky-200"
                    )}
                  >
                    <Icon size={17} />
                    {label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-sky-900/30 p-4 space-y-2">
          {user && (
            <div className="flex items-center gap-3 rounded-lg bg-sky-950/40 px-3 py-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-500/30 text-xs font-bold text-sky-300">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-semibold text-sky-200">{user.name}</div>
                <div className="truncate text-[11px] text-slate-400/60">{user.email}</div>
              </div>
            </div>
          )}
          <button
            onClick={() => router.push("/portal")}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-400/60 hover:text-sky-300 transition"
          >
            <ArrowLeft size={14} />
            Portal Hub
          </button>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-400/60 hover:text-sky-300 transition"
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-panel/70 px-5 backdrop-blur-xl">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-muted hover:text-text transition lg:hidden"
          >
            <Menu size={20} />
          </button>
          <div className="ml-auto flex items-center gap-3">
            <GlobalSearch role="staff" />
            <button className="relative rounded-lg p-2 text-muted hover:text-text transition">
              <Bell size={18} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-sky-400" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
        <InternalChat currentUser={user?.name ?? "Staff"} role="staff" />
      </div>
    </div>
  );
}
