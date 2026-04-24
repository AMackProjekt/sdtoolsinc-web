"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import {
  LayoutDashboard,
  Users,
  UserCog,
  UserCheck,
  Briefcase,
  FileText,
  BarChart2,
  ShieldCheck,
  ClipboardList,
  BookOpen,
  Heart,
  Plug,
  Wrench,
  GraduationCap,
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
import { MackAI } from "@/components/ui/MackAI";

const NAV = [
  { href: "/demo/admin/dashboard",    label: "Overview",      icon: LayoutDashboard },
  { href: "/demo/admin/users",        label: "Users",         icon: Users },
  { href: "/demo/admin/staff",        label: "Staff",         icon: UserCog },
  { href: "/demo/admin/personnel",    label: "Personnel",     icon: UserCheck },
  { href: "/demo/admin/hr",           label: "HR",            icon: Briefcase },
  { href: "/demo/admin/content",      label: "Content",       icon: FileText },
  { href: "/demo/admin/analytics",    label: "Analytics",     icon: BarChart2 },
  { href: "/demo/admin/compliance",   label: "Compliance",    icon: ShieldCheck },
  { href: "/demo/admin/audit",        label: "Audit Log",     icon: ClipboardList },
  { href: "/demo/admin/assignments",  label: "Assignments",   icon: BookOpen },
  { href: "/demo/admin/casenotes",    label: "Case Notes",    icon: ClipboardList },
  { href: "/demo/admin/self-care",    label: "Self-Care",     icon: Heart },
  { href: "/demo/admin/integrations", label: "Integrations",  icon: Plug },
  { href: "/demo/admin/pro-dev",      label: "Pro Dev",       icon: GraduationCap },
  { href: "/demo/admin/settings",     label: "Settings",      icon: Settings },
];

export default function DemoAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-violet-950">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-violet-800/30 bg-violet-950 transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand */}
        <div className="flex h-16 items-center gap-3 border-b border-violet-800/30 px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/20 text-violet-400">
            <Wrench size={16} />
          </div>
          <div className="leading-tight">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-violet-400/70">T.O.O.L.S Inc</div>
            <div className="text-sm font-bold text-white">Admin Portal</div>
          </div>
          <button
            type="button"
            aria-label="Close sidebar"
            title="Close sidebar"
            onClick={() => setSidebarOpen(false)}
            className="ml-auto text-violet-300/50 hover:text-white lg:hidden"
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
                  <button
                    onClick={() => { router.push(href); setSidebarOpen(false); }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                      active ? "bg-violet-700/70 text-white" : "text-violet-300/60 hover:bg-violet-900/50 hover:text-violet-100"
                    )}
                  >
                    <Icon size={16} />
                    {label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-violet-800/30 p-4 space-y-1">
          {user && (
            <div className="flex items-center gap-3 rounded-lg bg-violet-900/40 px-3 py-2.5 mb-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-500/30 text-xs font-bold text-violet-300">
                {user.name?.charAt(0).toUpperCase() ?? "A"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-semibold text-violet-200">{user.name}</div>
                <div className="truncate text-[11px] text-violet-400/60">{user.email}</div>
              </div>
            </div>
          )}
          <button
            onClick={() => router.push("/demo")}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-violet-300/60 hover:bg-violet-900/50 hover:text-violet-100 transition-all"
          >
            <ArrowLeft size={16} />
            Demo Home
          </button>
          <button
            onClick={() => router.push("/demo")}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-violet-300/60 hover:bg-violet-900/50 hover:text-violet-100 transition-all"
          >
            <LogOut size={16} />
            Exit Demo
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col min-w-0 lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-violet-800/30 bg-violet-950/80 backdrop-blur-xl px-5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Open sidebar"
              title="Open sidebar"
              onClick={() => setSidebarOpen(true)}
              className="text-violet-400 hover:text-white lg:hidden"
            >
              <Menu size={20} />
            </button>
            <span className="text-sm font-semibold text-violet-200 hidden sm:block">Admin Portal</span>
          </div>
          <div className="flex items-center gap-3">
            <GlobalSearch role="admin" />
            <button
              type="button"
              aria-label="Notifications"
              title="Notifications"
              className="relative rounded-lg p-2 text-violet-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Bell size={18} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-violet-400" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>

      <InternalChat currentUser="Alex Rivera" role="admin" />
      <MackAI />
    </div>
  );
}
