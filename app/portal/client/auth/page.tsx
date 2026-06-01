"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/cn";
import { getSafeCallbackUrl } from "@/lib/portal-auth";

function ClientAuthPageInner() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = getSafeCallbackUrl(searchParams.get("callbackUrl"), "/portal/client/dashboard");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("client-credentials", {
      username,
      password,
      callbackUrl,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Login failed. Check your username and password.");
      return;
    }

    if (result?.url) {
      router.push(result.url);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6 py-10">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 rounded-3xl border border-border bg-panel/90 p-8 shadow-glow backdrop-blur-xl">
          <div className="mb-6 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Client Portal</p>
            <h1 className="mt-3 text-3xl font-extrabold text-text">Secure Client Access</h1>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Log in with your assigned DF Client username and change your temporary password on first use.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-text mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="dfclientA1"
                autoComplete="username"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-text focus:border-brand/50 focus:outline-none focus:ring-2 focus:ring-brand/20"
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
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your temporary password"
                autoComplete="current-password"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-text focus:border-brand/50 focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
            </div>

            {error ? (
              <div className="rounded-2xl bg-rose-500/10 border border-rose-500/20 px-4 py-3 text-sm text-rose-200">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full rounded-2xl px-4 py-3 text-sm font-semibold transition",
                "bg-gradient-to-r from-brand to-brand2 text-slate-950",
                loading && "opacity-70 cursor-not-allowed"
              )}
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            <Link href="/portal" className="text-brand hover:text-brand2">Back to Portal</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ClientAuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg flex items-center justify-center">Loading…</div>}>
      <ClientAuthPageInner />
    </Suspense>
  );
}
