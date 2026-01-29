"use client";

import { useState } from "react";

// Prevent static generation for auth pages
export const dynamic = 'force-dynamic';
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

export default function SignupPage() {
  const { signUp, signInWithMagicLink, isLoading, error } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [tab, setTab] = useState<"magic" | "password">("magic");
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handlePasswordSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!fullName) {
      setValidationError("Please enter your full name");
      return;
    }

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setValidationError("Password must be at least 8 characters");
      return;
    }

    try {
      await signUp(email, password, fullName);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!email) {
      setValidationError("Please enter your email");
      return;
    }

    try {
      await signInWithMagicLink(email);
      setMagicLinkSent(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen bg-bg">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />

      <div className="flex items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="glass rounded-2xl p-8">
            <h1 className="h2 mb-2 text-center">Join T.O.O.L.S Inc</h1>
            <p className="p-lead mb-8 text-center">
              Create your account and start your journey
            </p>

            {error && (
              <div className="mb-6 rounded-lg bg-red-500/10 p-4 text-red-400">
                {error}
              </div>
            )}

            {validationError && (
              <div className="mb-6 rounded-lg bg-yellow-500/10 p-4 text-yellow-400">
                {validationError}
              </div>
            )}

            {/* Tab Navigation */}
            <div className="mb-6 flex gap-2 border-b border-border">
              {[
                { id: "magic", label: "Magic Link" },
                { id: "password", label: "Email & Password" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTab(t.id as any);
                    setMagicLinkSent(false);
                    setValidationError("");
                  }}
                  className={`px-4 py-2 text-sm font-medium transition ${
                    tab === t.id
                      ? "border-b-2 border-brand text-text"
                      : "text-muted hover:text-text"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Magic Link Tab */}
            {tab === "magic" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {magicLinkSent ? (
                  <div className="rounded-lg bg-green-500/10 p-4 text-green-400">
                    Check your email for a sign-up link!
                  </div>
                ) : (
                  <form onSubmit={handleMagicLink} className="space-y-4">
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg bg-panel border border-border px-4 py-3 text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-brand"
                    />
                    <Button
                      type="submit"
                      disabled={isLoading || !email}
                      variant="primary"
                      className="w-full"
                    >
                      {isLoading ? "Sending..." : "Send Magic Link"}
                    </Button>
                  </form>
                )}
              </motion.div>
            )}

            {/* Password Tab */}
            {tab === "password" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <form onSubmit={handlePasswordSignup} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-lg bg-panel border border-border px-4 py-3 text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg bg-panel border border-border px-4 py-3 text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                  <input
                    type="password"
                    placeholder="Password (min 8 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg bg-panel border border-border px-4 py-3 text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-lg bg-panel border border-border px-4 py-3 text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                  <Button
                    type="submit"
                    disabled={
                      isLoading ||
                      !email ||
                      !password ||
                      !fullName ||
                      !confirmPassword
                    }
                    variant="primary"
                    className="w-full"
                  >
                    {isLoading ? "Creating account..." : "Sign Up"}
                  </Button>
                </form>
              </motion.div>
            )}

            <p className="mt-6 text-center text-muted">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-brand hover:text-brand2">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
