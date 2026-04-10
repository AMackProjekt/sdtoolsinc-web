"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { signIn } from "next-auth/react";
import { DollarSign, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/cn";

// Google logo SVG
const GoogleLogo = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

// Microsoft logo SVG
const MicrosoftLogo = () => (
  <svg width="18" height="18" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
    <rect x="11" y="1" width="9" height="9" fill="#00a4ef"/>
    <rect x="1" y="11" width="9" height="9" fill="#7fba00"/>
    <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
  </svg>
);

export default function FinanceAuthPage() {
  const router = useRouter();
  const { login, signup, isLoading } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await signup(name, email, password);
      }
      router.push("/portal/finance/dashboard");
    } catch {
      setError(mode === "login" ? "Invalid credentials. Please try again." : "Could not create account. Try again.");
    }
  };

  const handleOAuth = async (provider: "google" | "azure-ad") => {
    await signIn(provider, { callbackUrl: "/portal/finance/dashboard" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_900px_600px_at_50%_-100px,rgba(16,185,129,0.13),transparent_70%)]" />

      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-2xl border border-border bg-panel p-8 shadow-[0_0_0_1px_rgba(16,185,129,.08),0_24px_64px_rgba(0,0,0,.4)]">
          {/* Brand */}
          <div className="mb-7 flex flex-col items-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-900/50 text-emerald-400">
              <DollarSign size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-text">Finance Portal</h1>
              <p className="mt-1 text-sm text-muted">
                {mode === "login" ? "Sign in to your finance account" : "Create a finance account"}
              </p>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="mb-5 grid grid-cols-2 gap-3">
            <button
              onClick={() => handleOAuth("google")}
              className="flex items-center justify-center gap-2.5 rounded-lg border border-border bg-glass px-4 py-2.5 text-sm font-medium text-text transition hover:border-emerald-500/40 hover:bg-emerald-900/10"
            >
              <GoogleLogo />
              Google
            </button>
            <button
              onClick={() => handleOAuth("azure-ad")}
              className="flex items-center justify-center gap-2.5 rounded-lg border border-border bg-glass px-4 py-2.5 text-sm font-medium text-text transition hover:border-emerald-500/40 hover:bg-emerald-900/10"
            >
              <MicrosoftLogo />
              Microsoft
            </button>
          </div>

          {/* Divider */}
          <div className="mb-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted">or continue with email</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted">Full name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Smith"
                  className="w-full rounded-lg border border-border bg-glass px-4 py-2.5 text-sm text-text placeholder:text-muted/40 focus:border-emerald-500/60 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
                />
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@organization.org"
                className="w-full rounded-lg border border-border bg-glass px-4 py-2.5 text-sm text-text placeholder:text-muted/40 focus:border-emerald-500/60 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-border bg-glass px-4 py-2.5 pr-10 text-sm text-text placeholder:text-muted/40 focus:border-emerald-500/60 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition hover:text-text"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-red-900/20 px-3 py-2 text-xs text-red-400 border border-red-800/40">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition",
                isLoading ? "opacity-60 cursor-wait" : "hover:from-emerald-500 hover:to-teal-500 hover:shadow-[0_0_24px_rgba(16,185,129,.3)]"
              )}
            >
              {isLoading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          {/* Mode toggle */}
          <p className="mt-5 text-center text-sm text-muted">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
              className="font-semibold text-emerald-400 hover:text-emerald-300 transition"
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-muted/50">
          <button onClick={() => router.push("/portal")} className="hover:text-emerald-400 transition">
            ← Back to Portal Hub
          </button>
        </p>
      </div>
    </div>
  );
}
