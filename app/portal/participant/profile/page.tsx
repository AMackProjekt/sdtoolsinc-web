"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";

export default function ParticipantProfilePage() {
  const { user, isAuthenticated, updateProfile } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/portal/participant/auth");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  if (!user) return null;

  const handleSave = () => {
    updateProfile({ name });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="mx-auto max-w-3xl px-7 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-extrabold tracking-tight text-text">Profile Settings</h1>
        <p className="mt-2 text-muted">Manage your account information and preferences</p>
      </motion.div>

      <div className="space-y-6">
        {/* Personal Information */}
        <GlowCard className="p-6">
          <h2 className="text-lg font-extrabold tracking-tight text-text mb-5">
            Personal Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-border bg-bg/50 px-4 py-3 text-sm text-text placeholder-muted outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-1.5">Email Address</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full rounded-lg border border-border bg-bg/30 px-4 py-3 text-sm text-muted cursor-not-allowed"
              />
              <p className="mt-1.5 text-xs text-muted">Email cannot be changed</p>
            </div>
          </div>
        </GlowCard>

        {/* Notification Preferences */}
        <GlowCard className="p-6">
          <h2 className="text-lg font-extrabold tracking-tight text-text mb-5">
            Notification Preferences
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-text">Push Notifications</div>
                <div className="text-xs text-muted mt-0.5">
                  Receive notifications about course updates
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-border rounded-full peer peer-checked:bg-teal-500 transition-colors" />
                <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-text">Email Updates</div>
                <div className="text-xs text-muted mt-0.5">
                  Receive weekly progress reports via email
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailUpdates}
                  onChange={(e) => setEmailUpdates(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-border rounded-full peer peer-checked:bg-teal-500 transition-colors" />
                <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
              </label>
            </div>
          </div>
        </GlowCard>

        {/* Security */}
        <GlowCard className="p-6">
          <h2 className="text-lg font-extrabold tracking-tight text-text mb-5">Security</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-text">Password</div>
                <div className="text-xs text-muted mt-0.5">Last changed never</div>
              </div>
              <button className="text-xs px-3 py-1.5 rounded-lg glass text-muted hover:text-text transition">
                Change
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-text">Two-Factor Authentication</div>
                <div className="text-xs text-muted mt-0.5">Not enabled</div>
              </div>
              <button className="text-xs px-3 py-1.5 rounded-lg glass text-muted hover:text-text transition">
                Enable
              </button>
            </div>
          </div>
        </GlowCard>

        {/* Save Button */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ y: 0 }}
            onClick={handleSave}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-teal-500 to-brand text-[#02131a] text-sm font-semibold hover:opacity-90 transition"
          >
            Save Changes
          </motion.button>

          {saved && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm text-teal-400"
            >
              ✓ Saved successfully
            </motion.span>
          )}
        </div>
      </div>
    </div>
  );
}
