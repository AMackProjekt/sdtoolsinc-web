"use client";

import { Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/cn";
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

function AuthPageInner() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [signingIn, setSigningIn] = useState<"google" | "azure-ad" | null>(null);
  const router = useRouter();

  const { login, signup, isAuthenticated, isLoading } = useAuth();
  const searchParams = useSearchParams();
  const callbackUrl = getSafeCallbackUrl(searchParams.get("callbackUrl"), "/portal");

  useEffect(() => {
    setEmail("");
    setPassword("");
    setName("");
    setError("");
  }, []);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(callbackUrl);
    }
  }, [isLoading, isAuthenticated, callbackUrl, router]);

  const handleSignIn = async (provider: "google" | "azure-ad") => {
    setSigningIn(provider);
    await signIn(provider, { callbackUrl });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const success = isLogin
        ? await login(email, password)
        : await signup(email, password, name);

      if (success) {
        router.push(callbackUrl);
      } else {
        setError(isLogin ? "Invalid credentials" : "Signup failed");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-7">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-text">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {isLogin
              ? "Sign in to access your learning portal"
              : "Start your journey with T.O.O.L.S Inc"}
          </p>
        </div>

        <div className="rounded-xl bg-panel border border-border p-8 shadow-glow">
          {/* OAuth buttons */}
          <div className="mb-6 space-y-3">
            <button
              type="button"
              disabled={loading || signingIn !== null}
              onClick={() => handleSignIn("google")}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-bg px-4 py-3 text-sm font-semibold text-text transition hover:border-brand/40 hover:bg-bg/80 disabled:cursor-not-allowed disabled:opacity-50"
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
              disabled={loading || signingIn !== null}
              onClick={() => handleSignIn("azure-ad")}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-bg px-4 py-3 text-sm font-semibold text-text transition hover:border-brand/40 hover:bg-bg/80 disabled:cursor-not-allowed disabled:opacity-50"
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
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-panel px-2 text-muted">or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-6">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-text mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  autoComplete="off"
                  className="w-full rounded-lg bg-bg border border-border px-4 py-3 text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand/50"
                  placeholder="Enter your name"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-text mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="off"
                className="w-full rounded-lg bg-bg border border-border px-4 py-3 text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand/50"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-text mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full rounded-lg bg-bg border border-border px-4 py-3 text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand/50"
                placeholder="••••••••"
              />
              {!isLogin && (
                <p className="mt-1 text-xs text-muted">Must be at least 8 characters</p>
              )}
            </div>

            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full rounded-lg px-6 py-3 font-semibold transition-all",
                "bg-gradient-to-br from-brand to-brand2 text-[#02131a]",
                "hover:shadow-glow",
                loading && "opacity-50 cursor-not-allowed"
              )}
            >
              {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-sm text-brand hover:text-brand2 transition-colors"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-muted">
              <svg className="h-4 w-4 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Secured with AES-256 encryption</span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-muted hover:text-text transition-colors">
            ← Back to home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-bg text-sm text-muted">Loading auth…</div>}>
      <AuthPageInner />
    </Suspense>
  );
}
