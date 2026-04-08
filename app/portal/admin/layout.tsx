"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/cn";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  BookOpen,
  BarChart2,
  Settings,
  Menu,
  Bell,
  LogOut,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

const NAV = [
  { href: "/portal/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/portal/admin/users", label: "Users", icon: Users },
  { href: "/portal/admin/staff", label: "Staff", icon: UserCheck },
  { href: "/portal/admin/content", label: "Content", icon: BookOpen },
  { href: "/portal/admin/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/portal/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminPortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated && !pathname.endsWith("/auth")) {
      router.replace("/portal/admin/auth");
    }
  }, [isAuthenticated, pathname, router]);

  const handleLogout = () => {
    logout();
    router.push("/portal");
  };

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
          "fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-violet-900/40 bg-violet-950 transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo / Brand */}
        <div className="flex h-16 items-center gap-3 border-b border-violet-900/40 px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/20 text-violet-400">
            <ShieldCheck size={16} />
          </div>
          <span className="text-sm font-bold tracking-tight text-violet-200">Admin Portal</span>
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
                        ? "bg-violet-900 text-violet-100"
                        : "text-violet-300/60 hover:bg-violet-900/60 hover:text-violet-100"
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
        <div className="border-t border-violet-900/40 p-4 space-y-2">
          {user && (
            <div className="flex items-center gap-3 rounded-lg bg-violet-900/40 px-3 py-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-500/30 text-xs font-bold text-violet-300">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-semibold text-violet-200">{user.name}</div>
                <div className="truncate text-[11px] text-violet-300/50">{user.email}</div>
              </div>
            </div>
          )}
          <button
            onClick={() => router.push("/portal")}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-violet-300/50 hover:text-violet-300 transition"
          >
            <ArrowLeft size={14} />
            Portal Hub
          </button>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-violet-300/50 hover:text-violet-300 transition"
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
          <div className="ml-auto">
            <button className="relative rounded-lg p-2 text-muted hover:text-text transition">
              <Bell size={18} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-violet-400" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
