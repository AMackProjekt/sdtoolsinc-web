"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { Lock, ShieldCheck, Building2, FileText, CalendarDays, MessageSquare } from "lucide-react";

function GoogleG() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.717v2.258h2.908C16.658 14.017 17.64 11.71 17.64 9.2z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
      <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05" />
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
    </svg>
  );
}

const FEATURES = [
  { icon: Building2, label: "Caseload management & client intake" },
  { icon: FileText, label: "Secure case notes & document vault" },
  { icon: CalendarDays, label: "Calendar & scheduling tools" },
  { icon: MessageSquare, label: "Google Chat messaging integration" },
  { icon: ShieldCheck, label: "2FA enforced for all staff accounts" },
];

export default function StaffLogin() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl: "/portal/staff" });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* ── Left brand panel (desktop only) ── */}
      <aside className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 bg-slate-900 border-r border-slate-800 p-10">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 mb-14">
            <div className="w-10 h-10 rounded-xl bg-slate-700 border border-slate-600/50 flex items-center justify-center">
              <Lock className="w-5 h-5 text-slate-200" />
            </div>
            <div>
              <span className="font-bold text-white block text-sm leading-none">Dreams For Change</span>
              <span className="text-[10px] text-teal-400 font-bold uppercase tracking-widest">Staff Portal</span>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white leading-snug mb-4">
            Case management<br />starts here.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Access your caseload, write case notes, manage documents, and coordinate housing support for your clients.
          </p>
        </div>

        {/* Feature list */}
        <div className="space-y-3.5">
          {FEATURES.map((f) => (
            <div key={f.label} className="flex items-start gap-2.5 text-slate-400 text-sm">
              <f.icon className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
              {f.label}
            </div>
          ))}
          <div className="pt-4 mt-1 border-t border-slate-800 text-xs text-slate-600">
            DFC Google Workspace domain required.
          </div>
        </div>
      </aside>

      {/* ── Right: sign-in form ── */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
              <Lock className="w-5 h-5 text-slate-300" />
            </div>
            <div>
              <span className="font-bold text-white block text-sm leading-none">Dreams For Change</span>
              <span className="text-[10px] text-teal-400 font-bold uppercase tracking-widest">Staff Portal</span>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white mb-1">Staff Sign In</h1>
          <p className="text-slate-400 text-sm mb-3">Google Workspace authentication required.</p>

          <div className="inline-flex items-center gap-1.5 bg-teal-950 border border-teal-800/70 text-teal-400 text-xs font-bold px-3 py-1.5 rounded-full mb-8">
            <ShieldCheck className="w-3 h-3" />
            DFC domain · 2FA enforced
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 active:scale-[0.98] text-slate-800 font-semibold py-3 px-4 rounded-xl transition-all shadow-md disabled:opacity-60 text-sm"
          >
            <GoogleG />
            {loading ? "Signing in…" : "Continue with Google"}
          </button>

          {session?.user?.email && (
            <p className="mt-4 text-xs text-slate-500 text-center">
              Signed in as <span className="text-slate-300">{session.user.email}</span>
            </p>
          )}

          <div className="mt-8 space-y-3 text-center text-sm text-slate-500">
            <p>
              Participant?{" "}
              <Link href="/login/client" className="text-teal-400 hover:text-teal-300 font-semibold transition-colors">
                Client Login →
              </Link>
            </p>
            <p>
              Supervisor?{" "}
              <Link href="/login/admin" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
                Admin Login →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
