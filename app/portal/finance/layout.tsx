"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/cn";
import { InternalChat } from "@/components/ui/InternalChat";
import { MackAI } from "@/components/ui/MackAI";
import {
  LayoutDashboard,
  DollarSign,
  TrendingUp,
  CreditCard,
  BarChart2,
  Settings,
  Menu,
  Bell,
  LogOut,
  ArrowLeft,
  Plug,
  Receipt,
  Users,
} from "lucide-react";
import { GlobalSearch } from "@/components/ui/GlobalSearch";

const NAV = [
  { href: "/portal/finance/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/finance/budgets", label: "Budgets", icon: TrendingUp },
  { href: "/portal/finance/transactions", label: "Transactions", icon: CreditCard },
  { href: "/portal/finance/payroll", label: "Payroll", icon: Users },
  { href: "/portal/finance/invoices", label: "Invoices", icon: Receipt },
  { href: "/portal/finance/reports", label: "Reports", icon: BarChart2 },
  { href: "/portal/finance/integrations", label: "Integrations", icon: Plug },
  { href: "/portal/finance/settings", label: "Settings", icon: Settings },
];

export default function FinancePortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAuthPage = pathname === "/portal/finance/auth" || pathname === "/portal/finance/auth/";

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isAuthPage) {
      router.replace("/portal/finance/auth");
    }
  }, [isLoading, isAuthenticated, isAuthPage, router]);

  const handleLogout = () => {
    logout();
    router.push("/portal");
  };

  if (isAuthPage) return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-bg">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-emerald-900/30 bg-slate-900 transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand */}
        <div className="flex h-16 items-center gap-3 border-b border-emerald-900/30 px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
            <DollarSign size={16} />
          </div>
          <span className="text-sm font-bold tracking-tight text-emerald-200">Finance Portal</span>
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
                        ? "bg-emerald-900/60 text-emerald-200"
                        : "text-slate-400/70 hover:bg-slate-800/60 hover:text-emerald-200"
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
        <div className="border-t border-emerald-900/30 p-4 space-y-2">
          {user && (
            <div className="flex items-center gap-3 rounded-lg bg-emerald-950/40 px-3 py-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/30 text-xs font-bold text-emerald-300">
                {user?.name?.charAt(0).toUpperCase() ?? "F"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-semibold text-emerald-200">{user.name}</div>
                <div className="truncate text-[11px] text-slate-400/60">{user.email}</div>
              </div>
            </div>
          )}
          <button
            onClick={() => router.push("/portal")}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-400/60 hover:text-emerald-300 transition"
          >
            <ArrowLeft size={14} />
            Portal Hub
          </button>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-400/60 hover:text-emerald-300 transition"
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-panel/70 px-5 backdrop-blur-xl">
          <button
            onClick={() => setSidebarOpen(true)}
            title="Open menu"
            className="rounded-lg p-2 text-muted hover:text-text transition lg:hidden"
          >
            <Menu size={20} />
          </button>
          <div className="ml-auto flex items-center gap-3">
            <GlobalSearch role="finance" />
            <button title="Notifications" className="relative rounded-lg p-2 text-muted hover:text-text transition">
              <Bell size={18} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-emerald-400" />
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
        <InternalChat currentUser={user?.name ?? "Finance"} role="staff" />
        <MackAI />
      </div>
    </div>
  );
}
