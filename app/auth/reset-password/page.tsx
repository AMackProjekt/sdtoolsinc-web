"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/cn";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) throw updateError;

      setSuccess(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to reset password.";
      setError(message);
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
            Set a New Password
          </h1>
          <p className="mt-2 text-sm text-muted">
            Create a new password to access your account.
          </p>
        </div>

        <div className="rounded-xl bg-panel border border-border p-8 shadow-glow">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-text mb-2">
                New Password
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-text mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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

            {success && !error && (
              <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-4 py-3 text-sm text-emerald-300">
                Password updated. You can now sign in.
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
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/auth/login" className="text-sm text-brand hover:text-brand2 transition-colors">
              ← Back to sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
