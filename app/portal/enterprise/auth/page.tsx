"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useAuth } from "@/lib/auth";
import { Shield, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { getSafeCallbackUrl } from "@/lib/portal-auth";

// Google "G" SVG logo
const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

// Microsoft logo
const MicrosoftLogo = () => (
  <svg viewBox="0 0 21 21" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="9" height="9" fill="#F25022" />
    <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
    <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
    <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
  </svg>
);

function EnterpriseAuthPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading } = useAuth();
  const [signingIn, setSigningIn] = useState<"google" | "azure-ad" | null>(null);
  const callbackUrl = getSafeCallbackUrl(searchParams.get("callbackUrl"), "/portal/enterprise/dashboard");

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(callbackUrl);
    }
  }, [isAuthenticated, isLoading, callbackUrl, router]);

  const handleSignIn = async (provider: "google" | "azure-ad") => {
    setSigningIn(provider);
    await signIn(provider, { callbackUrl });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(6,182,212,.15),transparent)]" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm"
      >
        {/* Icon + heading */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-400">
            <Shield size={28} />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-white">
            Enterprise Workspace
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Global control plane — authorized access only
          </p>
        </div>

        {/* Security notice */}
        <div className="mb-8 flex items-center gap-2 rounded-xl border border-cyan-800/40 bg-cyan-950/40 px-4 py-3">
          <Lock size={14} className="shrink-0 text-cyan-400" />
          <p className="text-xs text-cyan-300">
            Sign in with your <strong>@sdtoolsinc.org</strong> or <strong>@sdtoolsinc.com</strong> account.
            All access attempts are logged.
          </p>
        </div>

        {/* OAuth buttons */}
        <div className="space-y-3">
          <button
            type="button"
            disabled={signingIn !== null}
            onClick={() => handleSignIn("google")}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white transition hover:border-slate-600 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {signingIn === "google" ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            ) : (
              <GoogleLogo />
            )}
            {signingIn === "google" ? "Redirecting…" : "Sign in with Google Workspace"}
          </button>

          <button
            type="button"
            disabled={signingIn !== null}
            onClick={() => handleSignIn("azure-ad")}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white transition hover:border-slate-600 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {signingIn === "azure-ad" ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            ) : (
              <MicrosoftLogo />
            )}
            {signingIn === "azure-ad" ? "Redirecting…" : "Sign in with Microsoft 365"}
          </button>
        </div>

        <p className="mt-8 text-center text-xs text-slate-500">
          Only <strong className="text-slate-400">@sdtoolsinc.org</strong> and{" "}
          <strong className="text-slate-400">@sdtoolsinc.com</strong> accounts may access
          this workspace.
        </p>

        <p className="mt-6 text-center text-xs text-slate-600">
          <a href="/portal" className="hover:text-slate-400 transition">
            ← Back to Portal Hub
          </a>
        </p>
      </motion.div>
    </div>
  );
}

export default function EnterpriseAuthPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-bg text-sm text-muted">Loading auth…</div>}>
      <EnterpriseAuthPageInner />
    </Suspense>
  );
}
