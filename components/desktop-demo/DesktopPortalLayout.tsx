"use client";

/**
 * components/desktop-demo/DesktopPortalLayout.tsx
 *
 * Shared sidebar layout for all 7 desktop-demo portal sections.
 * Accepts per-portal config (color theme, nav items, label, icon).
 * Replaces the 7 separate /demo/* layout files with one reusable component.
 */

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { GlobalSearch } from "@/components/ui/GlobalSearch";
import {
  Menu, X, LogOut, Home, LucideIcon,
} from "lucide-react";
import { useAuth } from "@/lib/auth";

export type PortalNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export type PortalTheme = {
  sidebar: string;          // e.g. "bg-teal-950 border-teal-900/40"
  border: string;           // e.g. "border-teal-900/40"
  iconBg: string;           // e.g. "bg-teal-500/20"
  iconFg: string;           // e.g. "text-teal-400"
  activeBg: string;         // e.g. "bg-teal-700"
  navFg: string;            // inactive nav text
  hoverBg: string;
  userChipBg: string;
  brandFg: string;
};

export type PortalLayoutConfig = {
  label: string;
  homeHref: string;          // e.g. "/desktop-demo"
  navItems: PortalNavItem[];
  theme: PortalTheme;
  TitleIcon: LucideIcon;
};

export function DesktopPortalLayout({
  config,
  children,
}: {
  config: PortalLayoutConfig;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme } = config;

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
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r transition-transform duration-300 lg:static lg:translate-x-0",
          theme.sidebar, theme.border,
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Header */}
        <div className={cn("flex items-center justify-between border-b px-5 py-5", theme.border)}>
          <Link href={config.homeHref} className="group flex items-center gap-3">
            <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", theme.iconBg)}>
              <config.TitleIcon className={cn("h-4 w-4", theme.iconFg)} />
            </div>
            <div className="leading-tight">
              <div className={cn("text-[10px] font-semibold uppercase tracking-widest opacity-70", theme.iconFg)}>
                T.O.O.L.S Inc
              </div>
              <div className="text-sm font-bold text-white">{config.label}</div>
            </div>
          </Link>
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
            className={cn("lg:hidden", theme.iconFg, "opacity-50 hover:opacity-100")}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User chip */}
        {user && (
          <div className={cn("border-b px-5 py-4", theme.border)}>
            <div className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5", theme.userChipBg)}>
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
                  theme.iconBg, theme.iconFg,
                )}
              >
                {user.name?.charAt(0).toUpperCase() ?? "U"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-white">{user.name}</div>
                <div className={cn("truncate text-xs opacity-60", theme.iconFg)}>{user.email}</div>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-4">
          {config.navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  active
                    ? cn(theme.activeBg, "text-white shadow-sm")
                    : cn(theme.navFg, theme.hoverBg, "hover:text-white"),
                )}
              >
                <item.icon
                  className={cn(
                    "h-4 w-4",
                    active ? "text-white" : cn(theme.iconFg, "opacity-60"),
                  )}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={cn("space-y-1 border-t px-4 py-4", theme.border)}>
          <Link
            href={config.homeHref}
            className={cn("flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm", theme.navFg, theme.hoverBg, "hover:text-white")}
          >
            <Home className="h-4 w-4 opacity-60" />
            All Portals
          </Link>
          <button
            onClick={() => {
              if (typeof window !== "undefined" && window.electronBridge) {
                window.electronBridge.quit();
              }
            }}
            className={cn("flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm", theme.navFg, theme.hoverBg, "hover:text-white")}
          >
            <LogOut className="h-4 w-4 opacity-60" />
            Exit Preview
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex h-14 items-center justify-between border-b border-border bg-panel/70 px-4 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Open sidebar"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-1.5 text-muted hover:bg-slate-700 hover:text-white transition-colors lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="text-sm font-semibold text-text">{config.label}</span>
            <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400">
              Preview
            </span>
          </div>
          <div className="w-64">
            <GlobalSearch />
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
