"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/cn";
import {
  Settings2,
  SlidersHorizontal,
  Building2,
  KeyRound,
  Palette,
  Plug,
  ScrollText,
  Rocket,
  UserCog,
  Briefcase,
  Users,
  Shield,
  LogOut,
  ArrowLeft,
  Menu,
  X,
  Bell,
  DollarSign,
  MessageSquare,
  Mic2,
  Scale,
  Heart,
} from "lucide-react";
import { GlobalSearch } from "@/components/ui/GlobalSearch";
import { InternalChat } from "@/components/ui/InternalChat";
import { MackAI } from "@/components/ui/MackAI";

const NAV = [
  { href: "/portal/enterprise", label: "Workspace Control", icon: Settings2, exact: true },
  { href: "/portal/enterprise/identity", label: "Identity & Access", icon: KeyRound },
  { href: "/portal/enterprise/organization", label: "Organization & Tenant", icon: Palette },
  { href: "/portal/enterprise/finance", label: "Finance Division", icon: DollarSign },
  { href: "/portal/enterprise/integrations", label: "Integrations", icon: Plug },
  { href: "/portal/enterprise/audit", label: "Audit & Governance", icon: ScrollText },
  { href: "/portal/enterprise/operations", label: "Platform Operations", icon: Rocket },
  { href: "/portal/enterprise/executive", label: "Executive Command", icon: Building2 },
  { href: "/portal/enterprise/hr", label: "HR Operations", icon: Briefcase },
  { href: "/portal/enterprise/newsroom", label: "News & Media Kit", icon: ScrollText },
  { href: "/portal/enterprise/settings", label: "Settings", icon: SlidersHorizontal },
  { href: "/portal/enterprise/self-care", label: "Self-Care", icon: Heart },
  { href: "/portal/enterprise/voice", label: "Your Voice Is Heard", icon: Mic2 },
  { href: "/portal/enterprise/legal", label: "Legal & Compliance", icon: Scale },
];

const PORTAL_NAV = [
  { href: "/portal/admin/dashboard", label: "Admin Portal", icon: UserCog },
  { href: "/portal/staff/dashboard", label: "Staff Portal", icon: Briefcase },
  { href: "/portal/participant/dashboard", label: "Participant Portal", icon: Users },
];

export default function EnterpriseLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAuthPage = pathname === "/portal/enterprise/auth" || pathname === "/portal/enterprise/auth/";

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isAuthPage) {
      router.replace("/portal/enterprise/auth");
    }
  }, [isLoading, isAuthenticated, isAuthPage, router]);

  if (isAuthPage) {
    return <>{children}</>;
  }

  if (isLoading || !isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    router.push("/portal");
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
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
          "fixed inset-y-0 left-0 z-30 flex w-72 flex-col bg-slate-950 text-slate-100 transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand */}
        <div className="flex h-16 items-center gap-2.5 border-b border-slate-800 px-5">
          <Shield className="h-5 w-5 text-cyan-400" />
          <div>
            <p className="text-sm font-semibold text-white">Enterprise Workspace</p>
            <p className="text-[11px] text-slate-400">Global Control Plane</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto text-slate-400 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
          {/* Main nav */}
          <div className="mb-2 px-3 pt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Workspace
          </div>
          {NAV.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <button
                key={item.href}
                onClick={() => { router.push(item.href); setSidebarOpen(false); }}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition",
                  active ? "bg-cyan-600 text-white" : "text-slate-300 hover:bg-slate-800"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </button>
            );
          })}

          {/* Managed Portals */}
          <div className="mb-2 mt-4 px-3 pt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 border-t border-slate-800">
            Managed Portals
          </div>
          {PORTAL_NAV.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.href}
                onClick={() => { router.push(item.href); setSidebarOpen(false); }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 transition"
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-800 p-3 space-y-1">
          {user && (
            <div className="mb-2 rounded-lg bg-slate-900 p-2">
              <p className="text-slate-200 text-xs font-semibold">{user.name}</p>
              <p className="truncate text-[11px] text-slate-400">{user.email}</p>
            </div>
          )}
          <button
            onClick={() => router.push("/portal")}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <ArrowLeft className="h-4 w-4" /> Portal Hub
          </button>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col lg:ml-72">
        {/* Top bar */}
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-400 hover:text-slate-700 transition lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="inline-flex items-center gap-2 text-sm text-slate-600">
              <Building2 className="h-4 w-4 text-cyan-600" />
              Enterprise Workspace Administration
            </div>
          </div>
          <div className="flex items-center gap-3">
            <GlobalSearch role="enterprise" />
            <button className="relative rounded-lg p-2 text-slate-400 hover:text-slate-700 transition">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-cyan-500" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
      <InternalChat currentUser={user?.name ?? "Enterprise"} role="admin" />
      <MackAI />
    </div>
  );
}
