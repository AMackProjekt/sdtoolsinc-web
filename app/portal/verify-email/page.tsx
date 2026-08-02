"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function VerifyEmailPage() {
  return <Suspense fallback={<main className="min-h-screen bg-bg" />}><VerifyEmailContent /></Suspense>;
}

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setStatus("error");
        setMessage("Verification token not found");
        return;
      }

      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (data.success) {
          setStatus("success");
          setMessage(data.message);
          // Redirect to login after 3 seconds
          setTimeout(() => {
            router.push("/portal/auth?verified=true");
          }, 3000);
        } else {
          setStatus("error");
          setMessage(data.error || "Verification failed");
        }
      } catch (error) {
        setStatus("error");
        setMessage("An error occurred during verification");
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <main className="min-h-screen bg-bg flex items-center justify-center">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto px-6 py-12 text-center"
      >
        {status === "loading" && (
          <div>
            <div className="mb-6">
              <div className="w-12 h-12 mx-auto mb-4 border-4 border-brand border-t-transparent rounded-full animate-spin" />
            </div>
            <h1 className="h2 mb-2">Verifying Your Email</h1>
            <p className="text-muted">Please wait...</p>
          </div>
        )}

        {status === "success" && (
          <div>
            <div className="mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="w-16 h-16 mx-auto bg-green-500/20 rounded-full flex items-center justify-center"
              >
                <span className="text-3xl">✓</span>
              </motion.div>
            </div>
            <h1 className="h2 mb-2">Email Verified!</h1>
            <p className="text-muted mb-6">{message}</p>
            <p className="text-sm text-muted">
              Redirecting to login in 3 seconds...
            </p>
          </div>
        )}

        {status === "error" && (
          <div>
            <div className="mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center"
              >
                <span className="text-3xl">✕</span>
              </motion.div>
            </div>
            <h1 className="h2 mb-2">Verification Failed</h1>
            <p className="text-muted mb-6">{message}</p>
            <button
              onClick={() => router.push("/portal/auth")}
              className="btn btn-primary w-full"
            >
              Back to Login
            </button>
          </div>
        )}
      </motion.div>
    </main>
  );
}
