"use client";

import { Suspense, useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useAuth } from "@/lib/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { Users2, Eye, EyeOff } from "lucide-react";
import { getSafeCallbackUrl } from "@/lib/portal-auth";

const GoogleLogo = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

const MicrosoftLogo = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0h8.571v8.571H0z" fill="#F25022"/>
    <path d="M9.429 0H18v8.571H9.429z" fill="#7FBA00"/>
    <path d="M0 9.429h8.571V18H0z" fill="#00A4EF"/>
    <path d="M9.429 9.429H18V18H9.429z" fill="#FFB900"/>
  </svg>
);

function HRAuthPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, signup } = useAuth();
  const callbackUrl = getSafeCallbackUrl(searchParams.get("callbackUrl"), "/portal/hr/dashboard");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName("");
    setEmail("");
    setPassword("");
    setError("");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await signup(email, password, name);
      }
      router.push(callbackUrl);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = (provider: string) => {
    signIn(provider, { callbackUrl });
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center p-4"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(245,158,11,0.13), transparent), #06070b",
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-[#0c0f17] p-8"
        style={{
          boxShadow:
            "0 0 0 1px rgba(245,158,11,.08), 0 24px 64px rgba(0,0,0,.4)",
        }}
      >
        {/* Brand */}
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-900/50 text-amber-400">
            <Users2 size={24} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white">
              {mode === "login" ? "Welcome back" : "Create account"}
            </h1>
            <p className="mt-0.5 text-sm text-slate-400">HR Portal — Human Resources</p>
          </div>
        </div>

        {/* OAuth */}
        <div className="mb-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleOAuth("google")}
            className="flex items-center justify-center gap-2.5 rounded-xl border border-slate-700/60 bg-slate-800/40 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-amber-500/40 hover:bg-amber-900/10"
          >
            <GoogleLogo />
            Google
          </button>
          <button
            type="button"
            onClick={() => handleOAuth("azure-ad")}
            className="flex items-center justify-center gap-2.5 rounded-xl border border-slate-700/60 bg-slate-800/40 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-amber-500/40 hover:bg-amber-900/10"
          >
            <MicrosoftLogo />
            Microsoft
          </button>
        </div>

        <div className="mb-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-700/50" />
          <span className="text-xs text-slate-500">or continue with email</span>
          <div className="h-px flex-1 bg-slate-700/50" />
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-800/40 bg-red-900/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="off"
                placeholder="Your full name"
                className="w-full rounded-xl border border-slate-700/60 bg-slate-800/50 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/30"
              />
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
              placeholder="you@sdtoolsinc.com"
              className="w-full rounded-xl border border-slate-700/60 bg-slate-800/50 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/30"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-700/60 bg-slate-800/50 px-4 py-2.5 pr-11 text-sm text-white placeholder-slate-500 outline-none transition focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/30"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, #d97706, #ca8a04)",
              boxShadow: loading ? "none" : "0 4px 24px rgba(245,158,11,.3)",
            }}
          >
            {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
            className="font-semibold text-amber-400 hover:text-amber-300 transition"
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default function HRAuthPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-bg text-sm text-muted">Loading auth…</div>}>
      <HRAuthPageInner />
    </Suspense>
  );
}
