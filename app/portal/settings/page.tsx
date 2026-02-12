"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";
import { cn } from "@/lib/cn";

const FONT_SIZES = [
  { value: "small", label: "Small", example: "text-sm" },
  { value: "medium", label: "Medium", example: "text-base" },
  { value: "large", label: "Large", example: "text-lg" },
];

const ACCENT_COLORS = [
  { value: "#38bdf8", label: "Sky Blue", class: "bg-[#38bdf8]" },
  { value: "#2dd4bf", label: "Teal", class: "bg-[#2dd4bf]" },
  { value: "#a78bfa", label: "Purple", class: "bg-[#a78bfa]" },
  { value: "#fb923c", label: "Orange", class: "bg-[#fb923c]" },
  { value: "#f472b6", label: "Pink", class: "bg-[#f472b6]" },
  { value: "#34d399", label: "Green", class: "bg-[#34d399]" },
];

export default function SettingsPage() {
  const { user, isAuthenticated, updateProfile } = useAuth();
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  
  // Settings state
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">("medium");
  const [accentColor, setAccentColor] = useState("#38bdf8");
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/portal/auth");
      return;
    }
    
    // Load existing preferences
    if (user?.preferences) {
      setFontSize(user.preferences.fontSize || "medium");
      setAccentColor(user.preferences.accentColor || "#38bdf8");
      setNotifications(user.preferences.notifications ?? true);
      setEmailUpdates(user.preferences.emailUpdates ?? true);
      setTheme(user.preferences.theme || "dark");
    }
  }, [isAuthenticated, user, router]);

  const handleSave = () => {
    updateProfile({
      preferences: {
        fontSize,
        accentColor,
        notifications,
        emailUpdates,
        theme,
      },
    });
    
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-muted">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />

      {/* Header */}
      <header className="border-b border-border bg-panel/50 backdrop-blur-xl">
        <div className="mx-auto max-w-container px-7 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/portal/dashboard")}
              className="text-brand hover:text-brand2"
            >
              ← Back to Dashboard
            </button>
          </div>
          <h1 className="text-2xl font-extrabold text-text">Settings</h1>
          <div className="w-32" />
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-7 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Display Preferences */}
          <GlowCard className="p-6">
            <h2 className="text-xl font-extrabold text-text mb-6">Display Preferences</h2>
            
            <div className="space-y-6">
              {/* Font Size */}
              <div>
                <label className="block text-sm font-semibold text-text mb-3">
                  Font Size
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {FONT_SIZES.map((size) => (
                    <button
                      key={size.value}
                      onClick={() => setFontSize(size.value as any)}
                      className={cn(
                        "p-4 rounded-lg border-2 transition-all",
                        fontSize === size.value
                          ? "border-brand bg-brand/10"
                          : "border-border hover:border-brand/50"
                      )}
                    >
                      <div className={cn("font-semibold text-text mb-2", size.example)}>
                        {size.label}
                      </div>
                      <div className={cn("text-muted", size.example)}>
                        Sample text
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent Color */}
              <div>
                <label className="block text-sm font-semibold text-text mb-3">
                  Accent Color
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                  {ACCENT_COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setAccentColor(color.value)}
                      className={cn(
                        "p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2",
                        accentColor === color.value
                          ? "border-brand bg-brand/10"
                          : "border-border hover:border-brand/50"
                      )}
                    >
                      <div className={cn("w-8 h-8 rounded-full", color.class)} />
                      <div className="text-xs text-muted">{color.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme */}
              <div>
                <label className="block text-sm font-semibold text-text mb-3">
                  Theme
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setTheme("dark")}
                    className={cn(
                      "p-4 rounded-lg border-2 transition-all",
                      theme === "dark"
                        ? "border-brand bg-brand/10"
                        : "border-border hover:border-brand/50"
                    )}
                  >
                    <div className="font-semibold text-text mb-1">🌙 Dark</div>
                    <div className="text-xs text-muted">Easier on the eyes</div>
                  </button>
                  <button
                    onClick={() => setTheme("light")}
                    className={cn(
                      "p-4 rounded-lg border-2 transition-all",
                      theme === "light"
                        ? "border-brand bg-brand/10"
                        : "border-border hover:border-brand/50"
                    )}
                  >
                    <div className="font-semibold text-text mb-1">☀️ Light</div>
                    <div className="text-xs text-muted">Bright and clear</div>
                  </button>
                </div>
              </div>
            </div>
          </GlowCard>

          {/* Notification Preferences */}
          <GlowCard className="p-6">
            <h2 className="text-xl font-extrabold text-text mb-6">Notification Preferences</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-panel border border-border">
                <div>
                  <div className="font-semibold text-text mb-1">
                    In-App Notifications
                  </div>
                  <div className="text-sm text-muted">
                    Receive notifications for messages, updates, and activities
                  </div>
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
                      "absolute top-1 w-6 h-6 rounded-full bg-white transition-transform",
                      notifications ? "left-7" : "left-1"
                    )}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-panel border border-border">
                <div>
                  <div className="font-semibold text-text mb-1">
                    Email Updates
                  </div>
                  <div className="text-sm text-muted">
                    Receive course updates, reminders, and announcements via email
                  </div>
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
                      "absolute top-1 w-6 h-6 rounded-full bg-white transition-transform",
                      emailUpdates ? "left-7" : "left-1"
                    )}
                  />
                </button>
              </div>
            </div>
          </GlowCard>

          {/* Privacy & Security */}
          <GlowCard className="p-6">
            <h2 className="text-xl font-extrabold text-text mb-4">Privacy & Security</h2>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3 text-muted">
                <span className="text-brand mt-0.5">🔒</span>
                <span>Your data is encrypted and stored securely using industry-standard protocols.</span>
              </div>
              <div className="flex items-start gap-3 text-muted">
                <span className="text-brand mt-0.5">👁️</span>
                <span>You control your privacy settings and can submit reports anonymously.</span>
              </div>
              <div className="flex items-start gap-3 text-muted">
                <span className="text-brand mt-0.5">🛡️</span>
                <span>We never share your personal information without your explicit consent.</span>
              </div>
            </div>
          </GlowCard>

          {/* Account Information */}
          <GlowCard className="p-6">
            <h2 className="text-xl font-extrabold text-text mb-4">Account Information</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted">Email</span>
                <span className="text-text font-semibold">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Name</span>
                <span className="text-text font-semibold">{user.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Status</span>
                <span className="text-green-400 font-semibold">Active ✓</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <button
                onClick={() => router.push("/portal/profile")}
                className="text-sm text-brand hover:text-brand2 transition-colors font-semibold"
              >
                Edit Profile Information →
              </button>
            </div>
          </GlowCard>

          {/* Save Button */}
          <div className="flex items-center gap-4 sticky bottom-8">
            <button
              onClick={handleSave}
              className={cn(
                "px-8 py-4 rounded-lg font-semibold transition-all",
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
                className="text-sm text-brand font-semibold"
              >
                ✓ Settings saved successfully
              </motion.span>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
