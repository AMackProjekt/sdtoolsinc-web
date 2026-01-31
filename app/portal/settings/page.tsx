"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";
import { cn } from "@/lib/cn";

export default function SettingsPage() {
  const { user, isAuthenticated, updateProfile, logout } = useAuth();
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  
  // Preferences state
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">("medium");
  const [accentColor, setAccentColor] = useState("#38bdf8");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/portal/auth");
      return;
    }
    
    if (user?.preferences) {
      setNotifications(user.preferences.notifications ?? true);
      setEmailUpdates(user.preferences.emailUpdates ?? true);
      setFontSize(user.preferences.fontSize || "medium");
      setAccentColor(user.preferences.accentColor || "#38bdf8");
    }
  }, [isAuthenticated, user, router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-muted">Loading...</div>
      </div>
    );
  }

  const handleSave = async () => {
    try {
      updateProfile({
        preferences: {
          ...user.preferences,
          notifications,
          emailUpdates,
          fontSize,
          accentColor,
        },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Failed to update settings", err);
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
            Customization Settings
          </h1>
          <p className="text-muted">Personalize your portal experience</p>
        </motion.div>

        <div className="mt-8 space-y-6">
          {/* Appearance Settings */}
          <GlowCard className="p-6">
            <h2 className="text-lg font-extrabold tracking-tight text-text mb-4">
              Appearance
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-text mb-2">
                  Font Size
                </label>
                <div className="flex gap-3">
                  {(["small", "medium", "large"] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setFontSize(size)}
                      className={cn(
                        "px-6 py-3 rounded-lg font-semibold transition-all border",
                        fontSize === size
                          ? "bg-gradient-to-br from-brand to-brand2 text-[#02131a] border-transparent"
                          : "bg-bg/50 text-text border-border hover:border-brand/50"
                      )}
                    >
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text mb-3">
                  Accent Color
                </label>
                <div className="flex gap-3">
                  {[
                    { color: "#38bdf8", name: "Sky Blue" },
                    { color: "#2dd4bf", name: "Teal" },
                    { color: "#a78bfa", name: "Purple" },
                    { color: "#fb923c", name: "Orange" },
                    { color: "#f472b6", name: "Pink" },
                    { color: "#4ade80", name: "Green" },
                  ].map((item) => (
                    <button
                      key={item.color}
                      onClick={() => setAccentColor(item.color)}
                      className={cn(
                        "w-12 h-12 rounded-lg transition-all border-2",
                        accentColor === item.color
                          ? "border-white scale-110"
                          : "border-transparent hover:scale-105"
                      )}
                      style={{ backgroundColor: item.color }}
                      title={item.name}
                    />
                  ))}
                </div>
              </div>
            </div>
          </GlowCard>

          {/* Notification Settings */}
          <GlowCard className="p-6">
            <h2 className="text-lg font-extrabold tracking-tight text-text mb-4">
              Notifications
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-text">Push Notifications</div>
                  <div className="text-xs text-muted">Receive notifications about important updates</div>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={cn(
                    "relative w-14 h-8 rounded-full transition-colors",
                    notifications ? "bg-brand" : "bg-border"
                  )}
                >
                  <div
                    className={cn(
                      "absolute top-1 left-1 w-6 h-6 rounded-full bg-white transition-transform",
                      notifications && "translate-x-6"
                    )}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-text">Email Updates</div>
                  <div className="text-xs text-muted">Get course updates and announcements via email</div>
                </div>
                <button
                  onClick={() => setEmailUpdates(!emailUpdates)}
                  className={cn(
                    "relative w-14 h-8 rounded-full transition-colors",
                    emailUpdates ? "bg-brand" : "bg-border"
                  )}
                >
                  <div
                    className={cn(
                      "absolute top-1 left-1 w-6 h-6 rounded-full bg-white transition-transform",
                      emailUpdates && "translate-x-6"
                    )}
                  />
                </button>
              </div>
            </div>
          </GlowCard>

          {/* Privacy */}
          <GlowCard className="p-6">
            <h2 className="text-lg font-extrabold tracking-tight text-text mb-4">
              Privacy & Data
            </h2>
            
            <div className="space-y-3 text-sm text-muted">
              <p>
                Your data is securely stored and encrypted. We never share your personal information with third parties without your consent.
              </p>
              <div className="flex gap-3 mt-4">
                <button className="text-brand hover:text-brand2 transition-colors font-semibold">
                  View Privacy Policy →
                </button>
                <button className="text-brand hover:text-brand2 transition-colors font-semibold">
                  Download My Data →
                </button>
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
              Save Settings
            </button>
            
            {saved && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm text-brand"
              >
                ✓ Settings saved successfully
              </motion.span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
