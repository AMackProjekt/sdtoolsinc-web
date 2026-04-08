"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/cn";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

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

export default function AdminAuthPage() {
  const router = useRouter();
  const { login, signup, isAuthenticated } = useAuth();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [signingIn, setSigningIn] = useState<"google" | "azure-ad" | null>(null);

  const handleSignIn = async (provider: "google" | "azure-ad") => {
    setSigningIn(provider);
    await signIn(provider, { callbackUrl: "/portal/admin/dashboard" });
  };

  useEffect(() => {
    if (isAuthenticated) router.replace("/portal/admin/dashboard");
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        if (!name.trim()) { setError("Name is required."); setLoading(false); return; }
        await signup(email, password, name);
      }
      router.push("/portal/admin/dashboard");
    } catch {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow opacity-60" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm"
      >
        {/* Icon + heading */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-400">
            <ShieldCheck size={28} />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-text">Admin Portal</h1>
          <p className="mt-1 text-sm text-muted">Restricted access — administrators only</p>
        </div>

        {/* Mode toggle */}
        <div className="mb-6 flex rounded-xl bg-panel p-1">
          {(["login", "signup"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => { setMode(m); setError(""); }}
              className={cn(
                "flex-1 rounded-lg py-2 text-sm font-semibold transition",
                mode === m ? "bg-violet-600/80 text-white" : "text-muted hover:text-text"
              )}
            >
              {m === "login" ? "Sign In" : "Register"}
            </button>
          ))}
        </div>

        {/* OAuth buttons */}
        <div className="mb-5 space-y-3">
          <button
            type="button"
            disabled={loading || signingIn !== null}
            onClick={() => handleSignIn("google")}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-panel px-4 py-3 text-sm font-semibold text-text transition hover:border-violet-500/40 hover:bg-panel/80 disabled:cursor-not-allowed disabled:opacity-50"
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
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-panel px-4 py-3 text-sm font-semibold text-text transition hover:border-violet-500/40 hover:bg-panel/80 disabled:cursor-not-allowed disabled:opacity-50"
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
            <span className="bg-bg px-2 text-muted">or continue with email</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full rounded-xl border border-border bg-panel px-4 py-3 text-sm text-text placeholder:text-muted/50 outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition"
              />
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@sdtools.org"
              required
              className="w-full rounded-xl border border-border bg-panel px-4 py-3 text-sm text-text placeholder:text-muted/50 outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-xl border border-border bg-panel px-4 py-3 pr-11 text-sm text-text placeholder:text-muted/50 outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text transition"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-accent py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => router.push("/portal")}
          className="mt-6 flex w-full items-center justify-center gap-1.5 text-xs text-muted hover:text-text transition"
        >
          ← Back to Portal Hub
        </button>
      </motion.div>
    </div>
  );
}
