"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Bell, Lock, Palette, Save, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/cn";
import { GlowCard } from "@/components/ui/GlowCard";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "password", label: "Password", icon: Lock },
  { id: "appearance", label: "Appearance", icon: Palette },
];

export default function ParticipantSettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  // Profile state
  const [name, setName] = useState("Jordan Avery");
  const [email, setEmail] = useState("jordan.avery@example.com");
  const [phone, setPhone] = useState("(404) 555-0182");
  const [bio, setBio] = useState("Participant in the T.O.O.LS Inc Skills & Employment Program.");
  const [profileSaved, setProfileSaved] = useState(false);

  // Notifications state
  const [notif, setNotif] = useState({
    courseUpdates: true,
    messageAlerts: true,
    goalReminders: true,
    weeklyDigest: false,
    staffMessages: true,
  });

  // Password state
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);

  // Appearance state
  const [colorScheme, setColorScheme] = useState("teal");
  const [fontSize, setFontSize] = useState("medium");
  const [reduceMotion, setReduceMotion] = useState(false);

  async function saveProfile() {
    await new Promise((r) => setTimeout(r, 600));
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  }

  async function savePassword() {
    if (!currentPw || !newPw || newPw !== confirmPw) return;
    await new Promise((r) => setTimeout(r, 600));
    setCurrentPw(""); setNewPw(""); setConfirmPw("");
    setPwSaved(true);
    setTimeout(() => setPwSaved(false), 2500);
  }

  return (
    <div className="min-h-screen px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-2xl font-extrabold tracking-tight text-text">Settings</h1>
          <p className="text-sm text-muted mt-1">Manage your account and preferences</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-xl bg-white/5 p-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition-all sm:text-sm",
                  activeTab === tab.id
                    ? "bg-teal-600/80 text-white shadow-sm"
                    : "text-muted hover:text-text"
                )}
              >
                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Profile */}
        {activeTab === "profile" && (
          <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <GlowCard className="p-6 space-y-5">
              <h2 className="text-base font-bold text-text">Personal Information</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { label: "Full Name", value: name, setter: setName, type: "text" },
                  { label: "Email Address", value: email, setter: setEmail, type: "email" },
                  { label: "Phone Number", value: phone, setter: setPhone, type: "tel" },
                ].map(({ label, value, setter, type }) => (
                  <div key={label}>
                    <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wider">{label}</label>
                    <input
                      type={type}
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      className="w-full rounded-xl border border-border bg-white/5 px-4 py-2.5 text-sm text-text focus:border-teal-500/50 focus:outline-none focus:ring-1 focus:ring-teal-500/30"
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wider">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-border bg-white/5 px-4 py-2.5 text-sm text-text focus:border-teal-500/50 focus:outline-none focus:ring-1 focus:ring-teal-500/30 resize-none"
                />
              </div>
              <button
                onClick={saveProfile}
                className="flex items-center gap-2 rounded-xl bg-teal-500/20 px-5 py-2.5 text-sm font-semibold text-teal-300 hover:bg-teal-500/30 transition-colors"
              >
                <Save className="h-4 w-4" />
                {profileSaved ? "Saved!" : "Save Changes"}
              </button>
            </GlowCard>
          </motion.div>
        )}

        {/* Notifications */}
        {activeTab === "notifications" && (
          <motion.div key="notifications" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <GlowCard className="p-6 space-y-4">
              <h2 className="text-base font-bold text-text">Notification Preferences</h2>
              {[
                { key: "courseUpdates", label: "Course updates & new lessons" },
                { key: "messageAlerts", label: "New messages from staff" },
                { key: "goalReminders", label: "Goal check-in reminders" },
                { key: "weeklyDigest", label: "Weekly progress digest" },
                { key: "staffMessages", label: "Staff announcements" },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <span className="text-sm text-text">{label}</span>
                  <button
                    onClick={() => setNotif((p) => ({ ...p, [key]: !p[key as keyof typeof notif] }))}
                    className={`relative h-5 w-9 rounded-full transition-colors ${notif[key as keyof typeof notif] ? "bg-teal-500" : "bg-white/10"}`}
                  >
                    <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${notif[key as keyof typeof notif] ? "translate-x-4" : "translate-x-0.5"}`} />
                  </button>
                </div>
              ))}
            </GlowCard>
          </motion.div>
        )}

        {/* Password */}
        {activeTab === "password" && (
          <motion.div key="password" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <GlowCard className="p-6 space-y-4">
              <h2 className="text-base font-bold text-text">Change Password</h2>
              {[
                { label: "Current Password", value: currentPw, setter: setCurrentPw },
                { label: "New Password", value: newPw, setter: setNewPw },
                { label: "Confirm New Password", value: confirmPw, setter: setConfirmPw },
              ].map(({ label, value, setter }) => (
                <div key={label}>
                  <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wider">{label}</label>
                  <div className="relative">
                    <input
                      type={showPw ? "text" : "password"}
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      className="w-full rounded-xl border border-border bg-white/5 px-4 py-2.5 pr-10 text-sm text-text focus:border-teal-500/50 focus:outline-none focus:ring-1 focus:ring-teal-500/30"
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text">
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              ))}
              {newPw && confirmPw && newPw !== confirmPw && (
                <p className="text-xs text-rose-400">Passwords do not match</p>
              )}
              <button
                onClick={savePassword}
                disabled={!currentPw || !newPw || newPw !== confirmPw}
                className="flex items-center gap-2 rounded-xl bg-teal-500/20 px-5 py-2.5 text-sm font-semibold text-teal-300 hover:bg-teal-500/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Lock className="h-4 w-4" />
                {pwSaved ? "Password Updated!" : "Update Password"}
              </button>
            </GlowCard>
          </motion.div>
        )}

        {/* Appearance */}
        {activeTab === "appearance" && (
          <motion.div key="appearance" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <GlowCard className="p-6 space-y-6">
              <h2 className="text-base font-bold text-text">Appearance</h2>
              <div>
                <label className="block text-xs font-semibold text-muted mb-3 uppercase tracking-wider">Portal Color</label>
                <div className="flex gap-3">
                  {[
                    { id: "teal", color: "bg-teal-500", label: "Teal" },
                    { id: "sky", color: "bg-sky-500", label: "Sky" },
                    { id: "violet", color: "bg-violet-500", label: "Violet" },
                  ].map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setColorScheme(c.id)}
                      className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold border transition-all ${colorScheme === c.id ? "border-white/30 bg-white/10 text-text" : "border-border text-muted hover:bg-white/5"}`}
                    >
                      <span className={`h-3 w-3 rounded-full ${c.color}`} />
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted mb-3 uppercase tracking-wider">Font Size</label>
                <div className="flex gap-2">
                  {["small", "medium", "large"].map((size) => (
                    <button
                      key={size}
                      onClick={() => setFontSize(size)}
                      className={cn(
                        "rounded-xl px-4 py-2 text-sm font-semibold capitalize border transition-all",
                        fontSize === size ? "bg-teal-500/20 text-teal-300 border-teal-500/40" : "border-border text-muted hover:bg-white/5"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-text">Reduce Motion</p>
                  <p className="text-xs text-muted mt-0.5">Minimize animation effects throughout the portal</p>
                </div>
                <button
                  onClick={() => setReduceMotion(!reduceMotion)}
                  className={`relative h-5 w-9 rounded-full transition-colors ${reduceMotion ? "bg-teal-500" : "bg-white/10"}`}
                >
                  <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${reduceMotion ? "translate-x-4" : "translate-x-0.5"}`} />
                </button>
              </div>
            </GlowCard>
          </motion.div>
        )}
      </div>
    </div>
  );
}
