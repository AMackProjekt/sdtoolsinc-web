"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/cn";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

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
