"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Bell, Lock, Briefcase, Save, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/cn";
import { GlowCard } from "@/components/ui/GlowCard";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "password", label: "Password", icon: Lock },
  { id: "preferences", label: "Work Preferences", icon: Briefcase },
];

export default function StaffSettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  // Profile state
  const [name, setName] = useState("Taylor Morgan");
  const [email, setEmail] = useState("t.morgan@sdtoolsinc.org");
  const [department, setDepartment] = useState("Case Management");
  const [title, setTitle] = useState("Senior Case Manager");
  const [phone, setPhone] = useState("(404) 555-0117");
  const [profileSaved, setProfileSaved] = useState(false);

  // Notifications
  const [notif, setNotif] = useState({
    newCases: true,
    caseUpdates: true,
    participantMessages: true,
    schedulingAlerts: true,
    adminAnnouncements: false,
    weeklyReport: true,
  });

  // Password
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);

  // Work Preferences
  const [defaultView, setDefaultView] = useState("caseload");
  const [caseloadDisplay, setCaseloadDisplay] = useState("card");
  const [autoAssign, setAutoAssign] = useState(true);
  const [language, setLanguage] = useState("en");

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
          <h1 className="text-2xl font-extrabold tracking-tight text-text">Account Settings</h1>
          <p className="text-sm text-muted mt-1">Manage your staff profile and preferences</p>
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
                    ? "bg-sky-600/80 text-white shadow-sm"
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
              <h2 className="text-base font-bold text-text">Staff Profile</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { label: "Full Name", value: name, setter: setName, type: "text" },
                  { label: "Email Address", value: email, setter: setEmail, type: "email" },
                  { label: "Department", value: department, setter: setDepartment, type: "text" },
                  { label: "Job Title", value: title, setter: setTitle, type: "text" },
                  { label: "Phone Number", value: phone, setter: setPhone, type: "tel" },
                ].map(({ label, value, setter, type }) => (
                  <div key={label}>
                    <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wider">{label}</label>
                    <input
                      type={type}
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      className="w-full rounded-xl border border-border bg-white/5 px-4 py-2.5 text-sm text-text focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/30"
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={saveProfile}
                className="flex items-center gap-2 rounded-xl bg-sky-500/20 px-5 py-2.5 text-sm font-semibold text-sky-300 hover:bg-sky-500/30 transition-colors"
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
              <h2 className="text-base font-bold text-text">Notification Settings</h2>
              {[
                { key: "newCases", label: "New case assignments" },
                { key: "caseUpdates", label: "Case status updates" },
                { key: "participantMessages", label: "Participant messages" },
                { key: "schedulingAlerts", label: "Scheduling conflicts & alerts" },
                { key: "adminAnnouncements", label: "Admin-wide announcements" },
                { key: "weeklyReport", label: "Weekly caseload report" },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <span className="text-sm text-text">{label}</span>
                  <button
                    onClick={() => setNotif((p) => ({ ...p, [key]: !p[key as keyof typeof notif] }))}
                    className={`relative h-5 w-9 rounded-full transition-colors ${notif[key as keyof typeof notif] ? "bg-sky-500" : "bg-white/10"}`}
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
              <p className="text-xs text-muted">Password must be at least 12 characters and meet complexity requirements.</p>
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
                      className="w-full rounded-xl border border-border bg-white/5 px-4 py-2.5 pr-10 text-sm text-text focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/30"
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
                className="flex items-center gap-2 rounded-xl bg-sky-500/20 px-5 py-2.5 text-sm font-semibold text-sky-300 hover:bg-sky-500/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Lock className="h-4 w-4" />
                {pwSaved ? "Password Updated!" : "Update Password"}
              </button>
            </GlowCard>
          </motion.div>
        )}

        {/* Work Preferences */}
        {activeTab === "preferences" && (
          <motion.div key="preferences" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <GlowCard className="p-6 space-y-6">
              <h2 className="text-base font-bold text-text">Work Preferences</h2>

              <div>
                <label className="block text-xs font-semibold text-muted mb-3 uppercase tracking-wider">Default Dashboard View</label>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { id: "caseload", label: "Caseload" },
                    { id: "schedule", label: "Schedule" },
                    { id: "analytics", label: "Analytics" },
                  ].map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setDefaultView(v.id)}
                      className={cn(
                        "rounded-xl px-4 py-2 text-sm font-semibold border transition-all",
                        defaultView === v.id ? "bg-sky-500/20 text-sky-300 border-sky-500/40" : "border-border text-muted hover:bg-white/5"
                      )}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted mb-3 uppercase tracking-wider">Caseload Display</label>
                <div className="flex gap-2">
                  {[
                    { id: "card", label: "Card View" },
                    { id: "list", label: "List View" },
                    { id: "table", label: "Table View" },
                  ].map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setCaseloadDisplay(v.id)}
                      className={cn(
                        "rounded-xl px-4 py-2 text-sm font-semibold border transition-all",
                        caseloadDisplay === v.id ? "bg-sky-500/20 text-sky-300 border-sky-500/40" : "border-border text-muted hover:bg-white/5"
                      )}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wider">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="rounded-xl border border-border bg-white/5 px-4 py-2.5 text-sm text-text focus:border-sky-500/50 focus:outline-none focus:ring-1 focus:ring-sky-500/30"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="pt">Portuguese</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-text">Auto-accept case assignments</p>
                  <p className="text-xs text-muted mt-0.5">New cases assigned to you will be automatically accepted</p>
                </div>
                <button
                  onClick={() => setAutoAssign(!autoAssign)}
                  className={`relative h-5 w-9 rounded-full transition-colors ${autoAssign ? "bg-sky-500" : "bg-white/10"}`}
                >
                  <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${autoAssign ? "translate-x-4" : "translate-x-0.5"}`} />
                </button>
              </div>
            </GlowCard>
          </motion.div>
        )}
      </div>
    </div>
  );
}
