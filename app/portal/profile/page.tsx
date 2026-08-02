"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";
import { cn } from "@/lib/cn";

export default function ProfilePage() {
  const { user, isAuthenticated, updateProfile, logout } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/portal/auth");
      return;
    }
    if (user?.name) {
      setFullName(user.name);
    }
  }, [isAuthenticated, user, router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-muted">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  const handleSave = async () => {
    try {
      updateProfile({ name: fullName });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />

      {/* Header */}
      <header className="border-b border-border bg-panel/50 backdrop-blur-xl">
        <div className="mx-auto max-w-container px-7 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push("/portal/dashboard")} className="text-brand hover:text-brand2">
              ← Back to Dashboard
            </button>
          </div>
          <button
            onClick={() => {
              logout();
            }}
            className="text-sm font-semibold text-muted hover:text-text transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-7 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-extrabold tracking-tight text-text mb-2">
            Profile Settings
          </h1>
          <p className="text-muted">Manage your account and preferences</p>
        </motion.div>

        <div className="mt-8 space-y-6">
          {/* Profile Info */}
          <GlowCard className="p-6">
            <h2 className="text-lg font-extrabold tracking-tight text-text mb-4">
              Personal Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-text mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-lg bg-bg border border-border px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-brand/50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user.email || ""}
                  disabled
                  className="w-full rounded-lg bg-bg/50 border border-border px-4 py-3 text-muted cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-muted">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text mb-2">
                  Role
                </label>
                <input
                  type="text"
                  value="User"
                  disabled
                  className="w-full rounded-lg bg-bg/50 border border-border px-4 py-3 text-muted cursor-not-allowed capitalize"
                />
                <p className="mt-1 text-xs text-muted">Role is set by administrators</p>
              </div>
            </div>
          </GlowCard>

          {/* Security */}
          <GlowCard className="p-6">
            <h2 className="text-lg font-extrabold tracking-tight text-text mb-4">
              Security
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <svg className="h-5 w-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-text">Supabase + Azure Authentication Enabled</span>
              </div>

              <div className="text-xs text-muted">
                <p>Your account is secured with enterprise-grade encryption and multi-factor authentication support.</p>
              </div>

              <button className="text-sm text-brand hover:text-brand2 transition-colors font-semibold">
                Change Password →
              </button>
            </div>
          </GlowCard>

          {/* Account Info */}
          <GlowCard className="p-6">
            <h2 className="text-lg font-extrabold tracking-tight text-text mb-4">
              Account Information
            </h2>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Email</span>
                <span className="text-text">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Status</span>
                <span className="text-green-400">Active ✓</span>
              </div>
            </div>
          </GlowCard>

          {/* Save Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleSave}
              className={cn(
                "px-6 py-3 rounded-lg font-semibold transition-all",
                "bg-gradient-to-br from-brand to-brand2 text-[#02131a]",
                "hover:shadow-glow"
              )}
            >
              Save Changes
            </button>
            
            {saved && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm text-brand"
              >
                ✓ Saved successfully
              </motion.span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
