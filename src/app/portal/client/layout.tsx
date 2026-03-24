"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  LogOut,
  ShieldCheck,
  ShieldAlert,
  ShieldOff,
  Home,
  ArrowLeft,
  User,
  Settings,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import { StaffProvider } from "@/context/StaffContext";
import { signOut, useSession } from "next-auth/react";
import type { SecuritySummary } from "@/app/api/compliance/status/route";

function ClientBackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      title="Go back"
      aria-label="Go back"
      className="p-2 rounded-xl text-slate-500 hover:text-charcoal-900 hover:bg-slate-100 transition"
    >
      <ArrowLeft className="w-4 h-4" />
    </button>
  );
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const [security, setSecurity] = useState<SecuritySummary | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const initials = session?.user?.name
    ? session.user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    fetch("/api/compliance/status")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: SecuritySummary | null) => setSecurity(data))
      .catch(() => setSecurity(null));
  }, []);

  return (
    <StaffProvider>
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* Top Navigation - High Fidelity Glassmorphism */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 px-6 py-4 md:px-12 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-charcoal-900 text-white rounded-2xl flex items-center justify-center font-bold shadow-lg shadow-charcoal-900/10">
              <LogOut className="w-6 h-6 rotate-180 text-teal-400" />
            </div>
            <div>
              <span className="font-bold text-xl text-charcoal-950 block leading-tight">CaseFlow</span>
              <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest leading-none">Participant Portal</span>
            </div>
          </div>
          
          <nav className="hidden lg:flex items-center gap-8">
            {/* Home + Back */}
            <div className="flex items-center gap-1 border-r border-slate-200 pr-6">
              <Link href="/portal/client" title="Home" className="p-2 rounded-xl text-slate-400 hover:text-charcoal-900 hover:bg-slate-100 transition">
                <Home className="w-4 h-4" />
              </Link>
              <ClientBackButton />
            </div>
            <Link href="/portal/client" className="text-sm font-bold text-teal-700 decoration-2 underline-offset-8 transition-all px-4 py-2 bg-teal-50 rounded-xl">
              Explorer
            </Link>
            <Link href="/portal/client/goals" className="text-sm font-bold text-slate-500 hover:text-charcoal-950 transition-all">
              Milestones
            </Link>
            <Link href="/portal/client/messages" className="text-sm font-bold text-slate-500 hover:text-charcoal-950 transition-all flex items-center gap-2">
              Google Chat <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            </Link>
          </nav>

          <div className="flex items-center gap-6">
            {/* Security status badge */}
            {security && (
              <div
                title={
                  `Encryption: ${security.data_encrypted ? "Active" : "Not configured"} · ` +
                  `Auth: ${security.auth_configured ? "Active" : "Not configured"} · ` +
                  `Session: ${security.session_active ? "Active" : "Inactive"}`
                }
                className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                  security.status === "secured"
                    ? "bg-teal-50 text-teal-700 border-teal-200"
                    : security.status === "partial"
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-rose-50 text-rose-700 border-rose-200"
                }`}
              >
                {security.status === "secured" ? (
                  <ShieldCheck className="w-3 h-3" />
                ) : security.status === "partial" ? (
                  <ShieldAlert className="w-3 h-3" />
                ) : (
                  <ShieldOff className="w-3 h-3" />
                )}
                {security.status === "secured"
                  ? "Secured"
                  : security.status === "partial"
                  ? "Partial"
                  : "Unsecured"}
              </div>
            )}

            <div className="hidden sm:flex items-center gap-3 pr-6 border-r border-slate-100">
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">My Case Manager</p>
                <p className="text-sm font-bold text-charcoal-900 leading-none">Assigned Staff</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
                M
              </div>
            </div>
            
            <button
              onClick={() => signOut({ callbackUrl: "/login/client" })}
              title="Sign out"
              className="flex items-center gap-2 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
            >
              <LogOut className="w-6 h-6" />
                        {/* Profile dropdown */}
                        <div className="relative" ref={profileRef}>
                          <button
                            onClick={() => setShowProfile(!showProfile)}
                            className="flex items-center gap-2 focus:outline-none"
                            aria-label="Open profile menu"
                          >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                              {initials}
                            </div>
                            <div className="hidden sm:block text-left">
                              <p className="text-sm font-bold text-charcoal-900 leading-none">{session?.user?.name ?? "Participant"}</p>
                              <p className="text-[10px] text-teal-600 font-bold uppercase tracking-widest mt-0.5">My Account</p>
                            </div>
                            <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
                          </button>

                          {showProfile && (
                            <div className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200">
                              <div className="px-5 py-5 border-b border-slate-100 bg-slate-50/50">
                                <div className="flex items-center gap-3">
                                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-teal-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
                                    {initials}
                                  </div>
                                  <div>
                                    <p className="font-bold text-charcoal-900 leading-tight">{session?.user?.name ?? "Participant"}</p>
                                    <p className="text-xs text-slate-500 truncate max-w-[140px]">{session?.user?.email ?? ""}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="py-2">
                                <Link
                                  href="/portal/client/profile"
                                  onClick={() => setShowProfile(false)}
                                  className="flex items-center gap-3 px-5 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-charcoal-900 transition"
                                >
                                  <User className="w-4 h-4 text-slate-400" />
                                  Profile
                                </Link>
                                <Link
                                  href="/portal/client/settings"
                                  onClick={() => setShowProfile(false)}
                                  className="flex items-center gap-3 px-5 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-charcoal-900 transition"
                                >
                                  <Settings className="w-4 h-4 text-slate-400" />
                                  Settings
                                </Link>
                                <Link
                                  href="/portal/client/help"
                                  onClick={() => setShowProfile(false)}
                                  className="flex items-center gap-3 px-5 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-charcoal-900 transition"
                                >
                                  <HelpCircle className="w-4 h-4 text-slate-400" />
                                  Help &amp; Support
                                </Link>
                              </div>
                              <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50">
                                <button
                                  onClick={() => { setShowProfile(false); signOut({ callbackUrl: "/login/client" }); }}
                                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-rose-500 hover:bg-rose-50 rounded-xl transition"
                                >
                                  <LogOut className="w-4 h-4" />
                                  Sign out
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-12 relative">
        {/* Aesthetic background glow */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-teal-500/[0.03] rounded-full blur-[160px] pointer-events-none -mr-40 -mt-40"></div>
        
        <div className="relative z-10 w-full">
          {children}
        </div>
      </main>
    </div>
    </StaffProvider>
  );
}
