"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/lib/auth";

const RESEND_COOLDOWN_SECONDS = 45;

export default function ClientForgotPasswordPage() {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (!cooldown) return;
    const timer = window.setInterval(() => {
      setCooldown((value) => (value > 0 ? value - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (cooldown > 0) {
      setError(`Please wait ${cooldown}s before requesting another reset link.`);
      return;
    }

    setLoading(true);

    try {
      if (!email.trim()) {
        setError("Please enter your email address.");
        return;
      }

      await requestPasswordReset(email.trim());
      setSent(true);
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch {
      setError("Unable to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-8 w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-brand to-brand2 bg-clip-text text-transparent">
            Reset Password
          </h2>
          <p className="text-sm text-muted">We’ll email a secure reset link.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-panel border border-border text-text focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition"
              placeholder="you@example.com"
              required
            />
          </div>

          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          {sent && !error && (
            <div className="px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm space-y-1">
              <p>If an account exists for {email}, a reset link has been sent.</p>
              <p className="text-xs text-emerald-200/90">Check spam/promotions folders and verify your mailbox is typed correctly.</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || cooldown > 0}
            className="w-full px-6 py-3 bg-brand text-bg font-semibold rounded-lg hover:bg-brand2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : cooldown > 0 ? `Try again in ${cooldown}s` : "Send Reset Link"}
          </button>

          <div className="text-center space-y-2">
            <Link href="/auth/login" className="text-sm text-brand hover:text-brand2 transition block">
              ← Back to sign in
            </Link>
            <p className="text-xs text-muted">Still stuck? Contact support or ask your case manager to verify your account status.</p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
