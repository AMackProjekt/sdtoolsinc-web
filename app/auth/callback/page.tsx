"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, getCurrentProfile } from "@/lib/supabase";
import { getPortalUrlForUser } from "@/lib/portal-routing";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Finalizing sign-in...");

  useEffect(() => {
    const finalizeSignIn = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const user = sessionData.session?.user;

        if (!user) {
          setStatus("error");
          setMessage("No active session found. Please sign in again.");
          return;
        }

        const profile = await getCurrentProfile(user.id);
        if (profile && user.email) {
          const portalInfo = getPortalUrlForUser(profile, user.email);
          if (portalInfo) {
            setStatus("success");
            setMessage("Redirecting to your portal...");
            window.location.href = portalInfo.portalUrl;
            return;
          }
        }

        setStatus("success");
        setMessage("Redirecting to your dashboard...");
        router.push("/portal/dashboard");
      } catch (error) {
        setStatus("error");
        setMessage("Unable to complete sign-in. Please try again.");
      }
    };

    finalizeSignIn();
  }, [router]);

  return (
    <main className="min-h-screen bg-bg flex items-center justify-center px-7">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />
      <div className="max-w-md text-center">
        <div className="mb-6">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-brand border-t-transparent rounded-full animate-spin" />
        </div>
        <h1 className="h2 mb-2">Signing You In</h1>
        <p className="text-muted">{message}</p>
        {status === "error" && (
          <button
            onClick={() => router.push("/auth/login")}
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-gradient-to-br from-brand to-brand2 px-5 py-3 text-sm font-semibold text-[#02131a] hover:shadow-glow"
          >
            Back to Login
          </button>
        )}
      </div>
    </main>
  );
}
