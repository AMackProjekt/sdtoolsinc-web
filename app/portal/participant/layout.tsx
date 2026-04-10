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
  Target,
  PenLine,
  Heart,
  HelpCircle,
  Plug,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { GlobalSearch } from "@/components/ui/GlobalSearch";
import { InternalChat } from "@/components/ui/InternalChat";
import { MackAI } from "@/components/ui/MackAI";
import { PortalWalkthrough } from "@/components/ui/PortalWalkthrough";

const NAV = [
  { href: "/portal/participant/dashboard", label: "Dashboard", icon: LayoutDashboard, tourId: "p-dashboard" },
  { href: "/portal/participant/courses", label: "My Courses", icon: BookOpen, tourId: "p-courses" },
  { href: "/portal/participant/goals", label: "My Goals", icon: Target, tourId: "p-goals" },
  { href: "/portal/participant/journal", label: "Daily Journal", icon: PenLine, tourId: "p-journal" },
  { href: "/portal/participant/self-care", label: "Self-Care", icon: Heart, tourId: "p-selfcare" },
  { href: "/portal/participant/messages", label: "Messages", icon: MessageSquare, tourId: "p-messages" },
  { href: "/portal/participant/profile", label: "Profile", icon: User },
  { href: "/portal/participant/resources", label: "Resources", icon: FileText },
  { href: "/portal/participant/integrations", label: "Integrations", icon: Plug },
  { href: "/portal/participant/settings", label: "Settings", icon: Settings },
];

const TOUR_STEPS = [
  { target: '[data-tour="p-dashboard"]', title: "Dashboard", body: "Your home base — see your progress, goals, and key updates at a glance.", placement: "right" as const },
  { target: '[data-tour="p-courses"]', title: "My Courses", body: "Browse and complete courses assigned to you. Track progress as you learn.", placement: "right" as const },
  { target: '[data-tour="p-goals"]', title: "My Goals", body: "Set S.M.A.R.T. goals and celebrate milestones as you achieve them.", placement: "right" as const },
  { target: '[data-tour="p-journal"]', title: "Daily Journal", body: "Reflect on your day. Private notes only you and your care team can see.", placement: "right" as const },
  { target: '[data-tour="p-selfcare"]', title: "Self-Care", body: "Breathing exercises, affirmations, and wellness tools to recharge.", placement: "right" as const },
  { target: '[data-tour="p-messages"]', title: "Messages", body: "Stay connected with your case manager and support team.", placement: "right" as const },
];

export default function ParticipantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showTour, setShowTour] = useState(false);

  useState(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("tools_participant_onboarded")) {
      setTimeout(() => setShowWelcome(true), 800);
    }
  });

  const startTour = () => { setShowWelcome(false); setShowTour(true); };
  const completeTour = () => {
    localStorage.setItem("tools_participant_onboarded", "1");
    setShowTour(false);
  };

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
                data-tour={item.tourId}
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
        <MackAI />

        {/* Welcome modal on first visit */}
        {showWelcome && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-teal-800/40 shadow-2xl p-8 mx-4 text-center">
              <div className="w-16 h-16 rounded-full bg-teal-500/20 flex items-center justify-center mx-auto mb-5">
                <Heart className="w-8 h-8 text-teal-400" />
              </div>
              <h2 className="text-2xl font-black text-white mb-2">Welcome to your Portal</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                This is your personal space to track goals, journal your journey, access self-care tools, and stay connected with your support team.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={startTour}
                  className="flex-1 py-3 rounded-xl bg-teal-500 text-slate-900 font-bold text-sm hover:bg-teal-400 transition"
                >
                  Take the Tour
                </button>
                <button
                  onClick={completeTour}
                  className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 font-semibold text-sm hover:bg-slate-700 transition"
                >
                  Skip for now
                </button>
              </div>
            </div>
          </div>
        )}

        {showTour && (
          <PortalWalkthrough steps={TOUR_STEPS} onComplete={completeTour} />
        )}
      </div>
    </div>
  );
}
