"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { ShieldCheck, WifiOff } from "lucide-react";

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

export default function ClientLogin() {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl: "/portal/client" });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* ── Left brand panel (desktop only) ── */}
      <aside className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 bg-slate-800 border-r border-slate-700/50 p-10">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 mb-14">
            <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center shadow-lg shadow-teal-900/40">
              <span className="text-teal-950 font-black text-xs tracking-tight">DFC</span>
            </div>
            <div>
              <span className="font-bold text-white block text-sm leading-none">CaseFlow</span>
              <span className="text-[10px] text-teal-400 font-bold uppercase tracking-widest">Participant Portal</span>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white leading-snug mb-4">
            Your journey<br />forward starts here.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Access your goals, messages, and case support resources — all in one secure place.
          </p>
        </div>

        {/* Feature list */}
        <div className="space-y-3.5">
          {[
            { emoji: "🎯", label: "Track your SMART goals" },
            { emoji: "💬", label: "Message your case manager" },
            { emoji: "👤", label: "Update your profile & contact info" },
            { emoji: "📲", label: "Install for offline access on any device" },
          ].map((f) => (
            <div key={f.label} className="flex items-center gap-3 text-slate-300 text-sm">
              <span className="text-base leading-none">{f.emoji}</span>
              {f.label}
            </div>
          ))}
          <div className="pt-4 mt-1 border-t border-slate-700/50 flex items-center gap-2 text-xs text-teal-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            HIPAA-compliant · End-to-end encrypted
          </div>
        </div>
      </aside>

      {/* ── Right: sign-in form ── */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center">
              <span className="text-teal-950 font-black text-xs">DFC</span>
            </div>
            <div>
              <span className="font-bold text-white block text-sm leading-none">CaseFlow</span>
              <span className="text-[10px] text-teal-400 font-bold uppercase tracking-widest">Participant Portal</span>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-slate-400 text-sm mb-8">Sign in to continue to your portal.</p>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 active:scale-[0.98] text-slate-800 font-semibold py-3 px-4 rounded-xl transition-all shadow-md disabled:opacity-60 text-sm"
          >
            <GoogleG />
            {loading ? "Signing in…" : "Continue with Google"}
          </button>

          <div className="mt-8 space-y-3 text-center text-sm text-slate-500">
            <p>
              No account yet?{" "}
              <Link href="/request-access" className="text-teal-400 hover:text-teal-300 font-semibold transition-colors">
                Request Access
              </Link>
            </p>
            <p>
              Staff member?{" "}
              <Link href="/login/staff" className="text-slate-400 hover:text-slate-200 font-semibold transition-colors">
                Staff Login →
              </Link>
            </p>
          </div>

          <div className="mt-10 flex items-center justify-center gap-1.5 text-xs text-slate-600">
            <WifiOff className="w-3 h-3" />
            <span>Offline access available after first sign-in</span>
          </div>
        </div>
      </div>
    </div>
  );
}
