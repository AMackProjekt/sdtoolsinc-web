"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { getPortalUrlForUser } from "@/lib/portal-routing";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const { signInWithAzure, signInWithPassword, signInWithMagicLink, isLoading, error, user, profile } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<"azure" | "magic" | "password">("azure");
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  // Redirect to appropriate portal after successful login
  useEffect(() => {
    if (user && profile) {
      const portalInfo = getPortalUrlForUser(profile, user.email || "");
      if (portalInfo) {
        // Redirect to appropriate portal
        if (typeof window !== "undefined") {
          window.location.href = portalInfo.portalUrl;
        }
      }
    }
  }, [user, profile]);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithPassword(email, password);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithMagicLink(email);
      setMagicLinkSent(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAzureLogin = async () => {
    try {
      await signInWithAzure();
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
            <h1 className="h2 mb-2 text-center">Welcome Back</h1>
            <p className="p-lead mb-8 text-center">
              Sign in to access your T.O.O.L.S Inc portal
            </p>

            {/* Portal Access Requirements */}
            <div className="mb-6 p-4 bg-panel border border-border rounded-lg">
              <p className="text-xs font-semibold text-brand mb-2">PORTAL ACCESS:</p>
              <ul className="text-xs text-muted space-y-1">
                <li>🔵 <strong>Client Portal:</strong> Any email</li>
                <li>👥 <strong>Case Manager:</strong> @sdtoolsinc.org emails only</li>
                <li>⚙️ <strong>Admin Portal:</strong> dmack@sdtoolsinc.org only</li>
              </ul>
            </div>

            {error && (
              <div className="mb-6 rounded-lg bg-red-500/10 p-4 text-red-400">
                {error}
              </div>
            )}

            {/* Tab Navigation */}
            <div className="mb-6 flex gap-2 border-b border-border">
              {[
                { id: "azure", label: "Azure" },
                { id: "magic", label: "Magic Link" },
                { id: "password", label: "Email & Password" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTab(t.id as any);
                    setMagicLinkSent(false);
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

            {/* Azure Tab */}
            {tab === "azure" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <Button
                  onClick={handleAzureLogin}
                  disabled={isLoading}
                  variant="primary"
                  className="w-full"
                >
                  {isLoading ? "Signing in..." : "Sign in with Microsoft"}
                </Button>
              </motion.div>
            )}

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
                    Check your email for a sign-in link!
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
                <form onSubmit={handlePasswordLogin} className="space-y-4">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg bg-panel border border-border px-4 py-3 text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg bg-panel border border-border px-4 py-3 text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || !email || !password}
                    variant="primary"
                    className="w-full"
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </motion.div>
            )}

            <p className="mt-6 text-center text-muted">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-brand hover:text-brand2">
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
