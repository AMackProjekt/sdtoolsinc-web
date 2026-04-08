"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import Link from "next/link";

export default function StaffAuthPage() {
  const { login, signup, isAuthenticated } = useAuth();
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/portal/staff/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await signup(email, password, name);
      }
      router.push("/portal/staff/dashboard");
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-lg border border-border bg-bg/50 px-4 py-3 text-sm text-text placeholder-muted outline-none focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 transition"
              />
            )}
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-bg/50 px-4 py-3 text-sm text-text placeholder-muted outline-none focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 transition"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
