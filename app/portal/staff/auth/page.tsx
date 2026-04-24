"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import Link from "next/link";
import { getSafeCallbackUrl } from "@/lib/portal-auth";

const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const MicrosoftLogo = () => (
  <svg viewBox="0 0 21 21" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="9" height="9" fill="#F25022" />
    <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
    <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
    <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
  </svg>
);

function StaffAuthPageInner() {
  const { login, signup, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = getSafeCallbackUrl(searchParams.get("callbackUrl"), "/portal/staff/dashboard");

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [signingIn, setSigningIn] = useState<"google" | "azure-ad" | null>(null);

  useEffect(() => {
    setEmail("");
    setPassword("");
    setName("");
    setError("");
  }, []);

  const handleSignIn = async (provider: "google" | "azure-ad") => {
    setSigningIn(provider);
    await signIn(provider, { callbackUrl });
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(callbackUrl);
    }
  }, [isAuthenticated, callbackUrl, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await signup(email, password, name);
      }
      router.push(callbackUrl);
    } catch {
      setError(mode === "login" ? "Invalid credentials" : "Could not create account");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Back link */}
        <Link
          href="/portal"
          className="mb-6 flex items-center gap-2 text-sm text-muted hover:text-sky-400 transition"
        >
          ← Back to Portal Hub
        </Link>

        <div className="rounded-2xl border border-border bg-panel/80 p-8 backdrop-blur-xl">
          {/* Header */}
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/20 text-2xl">
              👥
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-text">Staff Portal</h1>
            <p className="mt-1 text-sm text-muted">Staff & Case Managers</p>
          </div>

          {/* Mode Toggle */}
          <div className="mb-5 flex rounded-lg border border-border p-1">
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 rounded-md py-2 text-xs font-semibold capitalize transition ${
                  mode === m ? "bg-sky-600/80 text-white" : "text-muted hover:text-text"
                }`}
              >
                {m === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          {/* OAuth buttons */}
          <div className="mb-5 space-y-3">
            <button
              type="button"
              disabled={signingIn !== null}
              onClick={() => handleSignIn("google")}
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-bg/50 px-4 py-3 text-sm font-semibold text-text transition hover:border-sky-500/40 hover:bg-bg/80 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {signingIn === "google" ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              ) : (
                <GoogleLogo />
              )}
              {signingIn === "google" ? "Redirecting…" : "Sign in with Google"}
            </button>
            <button
              type="button"
              disabled={signingIn !== null}
              onClick={() => handleSignIn("azure-ad")}
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-bg/50 px-4 py-3 text-sm font-semibold text-text transition hover:border-sky-500/40 hover:bg-bg/80 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {signingIn === "azure-ad" ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              ) : (
                <MicrosoftLogo />
              )}
              {signingIn === "azure-ad" ? "Redirecting…" : "Sign in with Microsoft"}
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-panel px-2 text-muted">or continue with email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
            {mode === "signup" && (
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="off"
                className="w-full rounded-lg border border-border bg-bg/50 px-4 py-3 text-sm text-text placeholder-muted outline-none focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 transition"
              />
            )}
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
              className="w-full rounded-lg border border-border bg-bg/50 px-4 py-3 text-sm text-text placeholder-muted outline-none focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 transition"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              className="w-full rounded-lg border border-border bg-bg/50 px-4 py-3 text-sm text-text placeholder-muted outline-none focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 transition"
            />

            {error && <p className="text-xs text-red-400">{error}</p>}

            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ y: 0 }}
              type="submit"
              className="w-full rounded-lg bg-gradient-to-r from-sky-500 to-brand py-3 text-sm font-semibold text-[#02131a] hover:opacity-90 transition"
            >
              {mode === "login" ? "Sign In" : "Create Account"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default function StaffAuthPage() {
  return (
    <Suspense
      fallback={<div className="flex min-h-screen items-center justify-center bg-bg text-sm text-muted">Loading auth…</div>}
    >
      <StaffAuthPageInner />
    </Suspense>
  );
}
