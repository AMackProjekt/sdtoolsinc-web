"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  LogOut,
  ShieldCheck,
  ShieldAlert,
  ShieldOff,
} from "lucide-react";
import { StaffProvider } from "@/context/StaffContext";
import { signOut } from "next-auth/react";
import type { SecuritySummary } from "@/app/api/compliance/status/route";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [security, setSecurity] = useState<SecuritySummary | null>(null);

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
