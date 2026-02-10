"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function PendingApprovalPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string>("");
  const [userStatus, setUserStatus] = useState<string>("pending");

  useEffect(() => {
    // Try to get user info from localStorage or session
    const authToken = localStorage.getItem("auth_token");
    const authUser = localStorage.getItem("auth_user");
    
    if (authUser) {
      try {
        const user = JSON.parse(authUser);
        setUserEmail(user.email || "");
      } catch {
        // Ignore parse errors
      }
    }

    // If no auth, redirect to login
    if (!authToken) {
      router.push("/portal/auth");
    }
  }, [router]);

  return (
    <main className="min-h-screen bg-bg flex items-center justify-center">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto px-6 py-12"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-20 h-20 mx-auto bg-yellow-500/20 rounded-full flex items-center justify-center mb-6"
        >
          <span className="text-4xl">⏳</span>
        </motion.div>

        {/* Title */}
        <h1 className="h1 text-center mb-4">
          Account Pending Approval
        </h1>

        {/* Description */}
        <p className="text-center text-lg text-muted mb-8">
          Thank you for verifying your email. Your account is currently under review
          by our team.
        </p>

        {/* Status Card */}
        <div className="glass rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-brand/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-text mb-2">
                What happens next?
              </h3>
              <ul className="space-y-2 text-sm text-muted">
                <li className="flex items-start gap-2">
                  <span className="text-brand mt-0.5">✓</span>
                  <span>Our team will review your application</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand mt-0.5">✓</span>
                  <span>You'll receive an email notification once approved</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand mt-0.5">✓</span>
                  <span>Approval typically takes 1-2 business days</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Info Boxes */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {/* Current Status */}
          <div className="bg-panel rounded-lg p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-yellow-500">⚠️</span>
              <h4 className="font-semibold text-text">Current Status</h4>
            </div>
            <p className="text-sm text-muted">
              Your account status is: 
              <span className="font-semibold text-yellow-500 ml-2 capitalize">
                {userStatus}
              </span>
            </p>
          </div>

          {/* Account Email */}
          <div className="bg-panel rounded-lg p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-brand">📧</span>
              <h4 className="font-semibold text-text">Account Email</h4>
            </div>
            <p className="text-sm text-muted break-words">
              {userEmail || "Not available"}
            </p>
          </div>
        </div>

        {/* Need Help Section */}
        <div className="bg-gradient-to-br from-brand/10 to-brand2/10 border border-brand/30 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-text mb-3 flex items-center gap-2">
            <span>💬</span>
            Need help or have questions?
          </h3>
          <p className="text-sm text-muted mb-4">
            If you have any questions about your application status or need assistance,
            please don't hesitate to contact our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="mailto:support@sdtoolsinc.org"
              className="flex-1 px-4 py-2.5 bg-brand text-white font-medium rounded-lg hover:bg-brand/90 transition text-center"
            >
              Email Support
            </a>
            <a
              href="tel:+1234567890"
              className="flex-1 px-4 py-2.5 glass hover:border-brand/40 text-text font-medium rounded-lg transition text-center"
            >
              Call Us
            </a>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-xs text-muted mb-4">
            For security reasons, you cannot access portal features until your account
            is approved.
          </p>
          <button
            onClick={() => {
              localStorage.removeItem("auth_token");
              localStorage.removeItem("auth_user");
              router.push("/portal/auth");
            }}
            className="text-sm text-brand hover:text-brand2 transition"
          >
            Sign out and return to login
          </button>
        </div>
      </motion.div>
    </main>
  );
}
