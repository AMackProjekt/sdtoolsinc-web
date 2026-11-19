"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import Link from "next/link";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { signInWithPassword } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithPassword(email, password);
      router.push("/portal/access");
    } catch (err) {
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
            Approved Client Sign-In
          </h1>
          <p className="mt-2 text-sm text-muted">
            Sign in after Board approval and activation of your portal account.
          </p>
        </div>

        <div className="rounded-xl bg-panel border border-border p-8 shadow-glow">
          <form onSubmit={handleSubmit} className="space-y-6">


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
              {loading ? "Please wait..." : "Sign In"}
            </button>

            <div className="text-center">
                <Link
                  href="/portal/auth/forgot-password"
                  className="text-sm text-brand hover:text-brand2 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
          </form>

          <p className="mt-6 text-center text-sm text-muted">No self-registration is available. After Intake/Eligibility Review Board approval, follow your secure activation invitation to establish your sign-in credentials.</p>


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
