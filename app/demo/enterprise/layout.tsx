"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/cn";
import {
  Building2,
  ShieldCheck,
  Network,
  DollarSign,
  Plug,
  ClipboardList,
  Cog,
  BarChart2,
  Users,
  Newspaper,
  Settings,
  Heart,
  Mic,
  Scale,
  ArrowLeft,
  Menu,
  X,
  LogOut,
  Bell,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { GlobalSearch } from "@/components/ui/GlobalSearch";
import { InternalChat } from "@/components/ui/InternalChat";
import { MackAI } from "@/components/ui/MackAI";

const NAV = [
  { href: "/demo/enterprise",                  label: "Workspace",    icon: Building2 },
  { href: "/demo/enterprise/identity",         label: "Identity",     icon: ShieldCheck },
  { href: "/demo/enterprise/organization",     label: "Organization", icon: Network },
  { href: "/demo/enterprise/finance",          label: "Finance",      icon: DollarSign },
  { href: "/demo/enterprise/integrations",     label: "Integrations", icon: Plug },
  { href: "/demo/enterprise/audit",            label: "Audit",        icon: ClipboardList },
  { href: "/demo/enterprise/operations",       label: "Operations",   icon: Cog },
  { href: "/demo/enterprise/executive",        label: "Executive",    icon: BarChart2 },
  { href: "/demo/enterprise/hr",               label: "HR",           icon: Users },
  { href: "/demo/enterprise/newsroom",         label: "Newsroom",     icon: Newspaper },
  { href: "/demo/enterprise/settings",         label: "Settings",     icon: Settings },
  { href: "/demo/enterprise/self-care",        label: "Self-Care",    icon: Heart },
  { href: "/demo/enterprise/voice",            label: "Voice",        icon: Mic },
  { href: "/demo/enterprise/legal",            label: "Legal",        icon: Scale },
];

const CROSS_PORTAL_NAV = [
  { href: "/demo/admin/dashboard",       label: "Admin Portal" },
  { href: "/demo/staff/dashboard",       label: "Staff Portal" },
  { href: "/demo/participant/dashboard", label: "Participant Portal" },
];

export default function DemoEnterpriseLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-950">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex w-72 flex-col border-r border-cyan-900/30 bg-slate-950 transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand */}
        <div className="flex h-16 items-center gap-3 border-b border-cyan-900/30 px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
            <Building2 size={16} />
          </div>
          <div className="leading-tight">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-cyan-400/70">T.O.O.L.S Inc</div>
            <div className="text-sm font-bold text-white">Enterprise Portal</div>
          </div>
          <button
            type="button"
            aria-label="Close sidebar"
            title="Close sidebar"
            onClick={() => setSidebarOpen(false)}
            className="ml-auto text-cyan-300/50 hover:text-white lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-0.5">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || (href !== "/demo/enterprise" && pathname.startsWith(href + "/"));
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                      active ? "bg-cyan-900/60 text-cyan-200" : "text-slate-400/70 hover:bg-slate-800/60 hover:text-cyan-200"
                    )}
                  >
                    <Icon size={16} />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Cross-portal nav */}
          <div className="mt-6 border-t border-cyan-900/20 pt-4">
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-cyan-400/40">
              Other Portals
            </p>
            <ul className="space-y-0.5">
              {CROSS_PORTAL_NAV.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-slate-400/50 hover:bg-slate-800/40 hover:text-cyan-300 transition-all"
                  >
                    {label}
                    <ChevronRight size={14} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-cyan-900/30 p-4 space-y-1">
          {user && (
            <div className="flex items-center gap-3 rounded-lg bg-cyan-950/50 px-3 py-2.5 mb-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-500/30 text-xs font-bold text-cyan-300">
                {user.name?.charAt(0).toUpperCase() ?? "E"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-semibold text-cyan-200">{user.name}</div>
                <div className="truncate text-[11px] text-slate-400/60">{user.email}</div>
              </div>
            </div>
          )}
          <button
            onClick={() => router.push("/demo")}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400/70 hover:bg-slate-800/60 hover:text-cyan-200 transition-all"
          >
            <ArrowLeft size={16} />
            Demo Home
          </button>
          <button
            onClick={() => router.push("/demo")}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400/70 hover:bg-slate-800/60 hover:text-cyan-200 transition-all"
          >
            <LogOut size={16} />
            Exit Demo
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col min-w-0 lg:pl-72">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-cyan-900/30 bg-slate-950/80 backdrop-blur-xl px-5">
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
            <span className="text-sm font-semibold text-slate-300 hidden sm:block">Enterprise Portal</span>
          </div>
          <div className="flex items-center gap-3">
            <GlobalSearch role="enterprise" />
            <button
              type="button"
              aria-label="Notifications"
              title="Notifications"
              className="relative rounded-lg p-2 text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Bell size={18} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-cyan-400" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-slate-100">{children}</main>
      </div>

      <InternalChat currentUser="Alex Rivera" role="admin" />
      <MackAI />
    </div>
  );
}
