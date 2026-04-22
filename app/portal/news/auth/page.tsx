"use client";

import { Suspense, useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useAuth } from "@/lib/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { Newspaper, Eye, EyeOff } from "lucide-react";
import { getSafeCallbackUrl } from "@/lib/portal-auth";

const GoogleLogo = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

const MicrosoftLogo = () => (
  <svg width="18" height="18" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
    <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
    <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
    <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
  </svg>
);

function NewsAuthPageInner() {
  const { login, signup, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = getSafeCallbackUrl(searchParams.get("callbackUrl"), "/portal/news/dashboard");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName("");
    setEmail("");
    setPassword("");
    setError("");
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(callbackUrl);
    }
  }, [isAuthenticated, callbackUrl, router]);

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
      setError(err instanceof Error ? err.message : "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-12"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(244,63,94,0.13), transparent), #06070b",
      }}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-slate-900/80 p-8 backdrop-blur-xl"
        style={{
          boxShadow:
            "0 0 0 1px rgba(244,63,94,.08), 0 24px 64px rgba(0,0,0,.4)",
        }}
      >
        {/* Brand */}
        <div className="mb-7 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-900/50 text-rose-400">
            <Newspaper size={22} />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-slate-50">
              {mode === "login" ? "Welcome back" : "Create account"}
            </h1>
            <p className="mt-1 text-xs text-slate-400">News &amp; Media Portal — Communications</p>
          </div>
        </div>

        {/* OAuth */}
        <div className="mb-5 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl })}
            className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-slate-700/60 bg-slate-800/60 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-rose-500/40 hover:bg-rose-900/10"
          >
            <GoogleLogo />
            Continue with Google
          </button>
          <button
            type="button"
            onClick={() => signIn("azure-ad", { callbackUrl })}
            className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-slate-700/60 bg-slate-800/60 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-rose-500/40 hover:bg-rose-900/10"
          >
            <MicrosoftLogo />
            Continue with Microsoft
          </button>
        </div>

        <div className="mb-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-700/50" />
          <span className="text-[11px] text-slate-500">or continue with email</span>
          <div className="h-px flex-1 bg-slate-700/50" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-3">
          {mode === "signup" && (
            <input
              type="text"
              required
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="off"
              className="w-full rounded-xl border border-slate-700/50 bg-slate-800/60 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 outline-none transition focus:border-rose-500/60 focus:ring-2 focus:ring-rose-500/30"
            />
          )}
          <input
            type="email"
            required
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            className="w-full rounded-xl border border-slate-700/50 bg-slate-800/60 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 outline-none transition focus:border-rose-500/60 focus:ring-2 focus:ring-rose-500/30"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              className="w-full rounded-xl border border-slate-700/50 bg-slate-800/60 px-4 py-2.5 pr-10 text-sm text-slate-200 placeholder-slate-500 outline-none transition focus:border-rose-500/60 focus:ring-2 focus:ring-rose-500/30"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          {error && (
            <div className="rounded-lg border border-red-800/40 bg-red-900/20 px-3 py-2 text-xs text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition disabled:opacity-60"
            style={{
              background: "linear-gradient(135deg, #e11d48, #be123c)",
              boxShadow: loading ? "none" : "0 4px 24px rgba(244,63,94,.3)",
            }}
          >
            {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-slate-500">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="text-rose-400 hover:text-rose-300 transition"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                className="text-rose-400 hover:text-rose-300 transition"
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default function NewsAuthPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-bg text-sm text-muted">Loading auth…</div>}>
      <NewsAuthPageInner />
    </Suspense>
  );
}
