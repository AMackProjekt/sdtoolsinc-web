"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { supabase } from "@/lib/supabase";

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState("dmack@sdtoolsinc.org");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!email.trim()) {
        setError("Please enter your email address.");
        return;
      }

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (resetError) throw resetError;
      setSent(true);
    } catch {
      setError("Unable to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-7 relative overflow-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-bg to-orange-950/20" />
        <motion.div
          className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-red-500/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-text">
            Admin Password Reset
          </h1>
          <p className="mt-2 text-sm text-muted">
            We’ll send a secure reset link to your admin email.
          </p>
        </div>

        <div className="rounded-2xl bg-panel/50 backdrop-blur-xl border border-border/50 p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-text mb-2">
                Admin Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full rounded-lg bg-bg/80 backdrop-blur border border-border px-4 py-3 text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all"
                placeholder="admin@sdtoolsinc.org"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {sent && !error && (
              <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-4 py-3 text-sm text-emerald-300">
                If an account exists for {email}, a reset link has been sent.
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full rounded-lg px-6 py-3 font-semibold transition-all",
                "bg-gradient-to-r from-red-500 to-orange-500 text-white",
                "hover:shadow-lg hover:shadow-red-500/30",
                loading && "opacity-50 cursor-not-allowed"
              )}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/auth/login" className="text-sm text-red-300 hover:text-red-200 transition-colors">
              ← Back to sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
