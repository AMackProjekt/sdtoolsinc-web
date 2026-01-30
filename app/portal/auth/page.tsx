"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const {
    signInWithPassword,
    signUp,
    signInWithAzure,
    signInWithMagicLink,
    isLoading,
    error: authError,
  } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");

    try {
      if (isLogin) {
        await signInWithPassword(email, password);
        router.push("/portal/dashboard");
      } else {
        await signUp(email, password, name);
        setInfo("Check your email to verify your account.");
      }
    } catch (err) {
      setError(authError || "An error occurred. Please try again.");
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
          <form onSubmit={handleSubmit} className="space-y-6">
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

            {info && (
              <div className="rounded-lg bg-brand/10 border border-brand/30 px-4 py-3 text-sm text-brand">
                {info}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full rounded-lg px-6 py-3 font-semibold transition-all",
                "bg-gradient-to-br from-brand to-brand2 text-[#02131a]",
                "hover:shadow-glow",
                isLoading && "opacity-50 cursor-not-allowed"
              )}
            >
              {isLoading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
            </button>

            <div className="space-y-3">
              <button
                type="button"
                onClick={async () => {
                  setError("");
                  try {
                    await signInWithAzure();
                  } catch (err) {
                    setError(authError || "Azure sign-in failed");
                  }
                }}
                disabled={isLoading}
                className={cn(
                  "w-full rounded-lg px-6 py-3 font-semibold transition-all",
                  "border border-border text-text hover:bg-panel",
                  isLoading && "opacity-50 cursor-not-allowed"
                )}
              >
                Continue with Microsoft (Azure AD)
              </button>

              <button
                type="button"
                onClick={async () => {
                  setError("");
                  setInfo("");
                  if (!email) {
                    setError("Enter your email to receive a magic link");
                    return;
                  }
                  try {
                    await signInWithMagicLink(email);
                    setInfo("Magic link sent. Check your inbox.");
                  } catch (err) {
                    setError(authError || "Magic link failed");
                  }
                }}
                disabled={isLoading}
                className={cn(
                  "w-full rounded-lg px-6 py-3 font-semibold transition-all",
                  "border border-border text-text hover:bg-panel",
                  isLoading && "opacity-50 cursor-not-allowed"
                )}
              >
                Send magic link
              </button>
            </div>
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
          <a href="/" className="text-sm text-muted hover:text-text transition-colors">
            ← Back to home
          </a>
        </div>
      </motion.div>
    </div>
  );
}
