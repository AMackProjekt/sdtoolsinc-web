"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function CheckEmailPage() {
  return (
    <Suspense fallback={null}>
      <CheckEmailPageContent />
    </Suspense>
  );
}

function CheckEmailPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "your email";

  return (
    <main className="min-h-screen bg-bg flex items-center justify-center">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto px-6 py-12 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-16 h-16 mx-auto bg-brand/20 rounded-full flex items-center justify-center mb-6"
        >
          <span className="text-3xl">📧</span>
        </motion.div>

        <h1 className="h2 mb-2">Check Your Email</h1>

        <p className="text-muted mb-6">
          We sent a verification link to <strong>{email}</strong>. Click the
          link to activate your account.
        </p>

        <div className="bg-panel rounded-lg p-4 mb-6 text-left text-sm text-muted">
          <p className="mb-3">
            <strong>Didn’t receive the email?</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Check your spam folder</li>
            <li>Double-check your email address</li>
            <li>The link expires in 24 hours</li>
          </ul>
        </div>

        <button
          onClick={() => router.push("/auth/login")}
          className="btn btn-secondary w-full"
        >
          Back to Login
        </button>
      </motion.div>
    </main>
  );
}
