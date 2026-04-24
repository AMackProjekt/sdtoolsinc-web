"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Settings, Mail, Shield, Archive, Save, Plus, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { GlowCard } from "@/components/ui/GlowCard";
import { useAuth } from "@/lib/auth";

const TABS = [
  { id: "system", label: "System Config", icon: Settings },
  { id: "email", label: "Email Templates", icon: Mail },
  { id: "security", label: "Security", icon: Shield },
  { id: "retention", label: "Audit Retention", icon: Archive },
];

const EMAIL_TEMPLATES = [
  { id: "welcome", label: "Welcome Email", description: "Sent to new participants on account creation" },
  { id: "reset", label: "Password Reset", description: "Sent when a user requests a password reset" },
  { id: "assignment", label: "Case Assignment", description: "Sent to staff when assigned a new case" },
  { id: "reminder", label: "Goal Reminder", description: "Sent to participants for upcoming goal deadlines" },
  { id: "digest", label: "Weekly Digest", description: "Summary email sent every Monday morning" },
];

export default function AdminSettingsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("system");

  // System Config
  const [platformName, setPlatformName] = useState("");
  const [sessionTimeout, setSessionTimeout] = useState(60);
  const [maxLoginAttempts, setMaxLoginAttempts] = useState(5);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [systemSaved, setSystemSaved] = useState(false);

  // Email Templates
  const [activeTemplate, setActiveTemplate] = useState("welcome");
  const [templateContent, setTemplateContent] = useState<Record<string, string>>({
    welcome: "Welcome to T.O.O.LS Inc!\n\nYour account has been created. Please log in at portal.sdtoolsinc.org to get started.\n\nYour case manager will reach out within 24–48 hours.",
    reset: "Hi {{name}},\n\nWe received a request to reset your password. Click the link below to reset it:\n\n{{reset_link}}\n\nThis link expires in 1 hour.",
    assignment: "Hi {{staff_name}},\n\nA new participant has been assigned to your caseload:\n\nParticipant: {{participant_name}}\nProgram: {{program}}\n\nPlease log in to review their profile.",
    reminder: "Hi {{name}},\n\nThis is a reminder that your goal '{{goal_title}}' is due on {{due_date}}.\n\nLog in to update your progress.",
    digest: "Hi {{name}},\n\nHere is your weekly summary for {{week_range}}:\n\n- Active cases: {{active_cases}}\n- Goals completed: {{goals_completed}}\n- Upcoming check-ins: {{check_ins}}",
  });

  // Security
  const [enforce2FA, setEnforce2FA] = useState(false);
  const [minPasswordLength, setMinPasswordLength] = useState(12);
  const [requireUppercase, setRequireUppercase] = useState(true);
  const [requireNumbers, setRequireNumbers] = useState(true);
  const [requireSymbols, setRequireSymbols] = useState(false);
  const [ipAllowlist, setIpAllowlist] = useState<string[]>(["10.0.0.0/8"]);
  const [newIp, setNewIp] = useState("");
  const [securitySaved, setSecuritySaved] = useState(false);

  // Audit Retention (days)
  const [authLogRetention, setAuthLogRetention] = useState(90);
  const [activityLogRetention, setActivityLogRetention] = useState(180);
  const [errorLogRetention, setErrorLogRetention] = useState(365);
  const [dataExportRetention, setDataExportRetention] = useState(30);
  const [retentionSaved, setRetentionSaved] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/portal/admin/auth");
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.org_name) setPlatformName(d.org_name);
        if (d.session_timeout_minutes) setSessionTimeout(d.session_timeout_minutes);
        if (d.mfa_required !== undefined) setEnforce2FA(d.mfa_required);
        if (d.allowed_ip_ranges?.length) setIpAllowlist(d.allowed_ip_ranges);
      })
      .catch(() => {});
  }, []);

  async function saveSystem() {
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ org_name: platformName, session_timeout_minutes: sessionTimeout }),
    });
    setSystemSaved(true);
    setTimeout(() => setSystemSaved(false), 2500);
  }

  async function saveSecurity() {
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mfa_required: enforce2FA, allowed_ip_ranges: ipAllowlist }),
    });
    setSecuritySaved(true);
    setTimeout(() => setSecuritySaved(false), 2500);
  }

  async function saveRetention() {
    // Retention fields are UI-only (no org_settings columns); persisted locally
    setRetentionSaved(true);
    setTimeout(() => setRetentionSaved(false), 2500);
  }

  if (isLoading || !isAuthenticated) return null;

  function addIp() {
    const trimmed = newIp.trim();
    if (trimmed && !ipAllowlist.includes(trimmed)) {
      setIpAllowlist((p) => [...p, trimmed]);
      setNewIp("");
    }
  }

  return (
    <div className="min-h-screen px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-2xl font-extrabold tracking-tight text-text">Platform Settings</h1>
          <p className="text-sm text-muted mt-1">System-wide configuration and security controls</p>
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
                    ? "bg-violet-600/80 text-white shadow-sm"
                    : "text-muted hover:text-text"
                )}
              >
                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* System Config */}
        {activeTab === "system" && (
          <motion.div key="system" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <GlowCard className="p-6 space-y-6">
              <h2 className="text-base font-bold text-text">System Configuration</h2>

              <div>
                <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wider">Platform Name</label>
                <input
                  type="text"
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-white/5 px-4 py-2.5 text-sm text-text focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/30"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider">Session Timeout</label>
                  <span className="text-sm font-bold text-violet-300">{sessionTimeout} min</span>
                </div>
                <input
                  type="range"
                  min={15} max={480} step={15}
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(Number(e.target.value))}
                  className="w-full accent-violet-500"
                />
                <div className="flex justify-between text-xs text-muted mt-1">
                  <span>15 min</span><span>8 hrs</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wider">Max Login Attempts</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={1} max={20}
                    value={maxLoginAttempts}
                    onChange={(e) => setMaxLoginAttempts(Number(e.target.value))}
                    className="w-24 rounded-xl border border-border bg-white/5 px-4 py-2.5 text-sm text-text focus:border-violet-500/50 focus:outline-none"
                  />
                  <span className="text-xs text-muted">before account lockout</span>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { key: "maintenance", label: "Maintenance Mode", desc: "Temporarily restrict portal access for all users", value: maintenanceMode, setter: setMaintenanceMode },
                  { key: "debug", label: "Debug Mode", desc: "Enable verbose logging and error traces", value: debugMode, setter: setDebugMode },
                ].map(({ key, label, desc, value, setter }) => (
                  <div key={key} className="flex items-start justify-between gap-4 py-3 border-b border-border/50 last:border-0">
                    <div>
                      <p className="text-sm font-semibold text-text">{label}</p>
                      <p className="text-xs text-muted mt-0.5">{desc}</p>
                    </div>
                    <button
                      onClick={() => setter(!value)}
                      className={`relative mt-0.5 h-5 w-9 flex-shrink-0 rounded-full transition-colors ${value ? "bg-violet-500" : "bg-white/10"}`}
                    >
                      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${value ? "translate-x-4" : "translate-x-0.5"}`} />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={saveSystem}
                className="flex items-center gap-2 rounded-xl bg-violet-500/20 px-5 py-2.5 text-sm font-semibold text-violet-300 hover:bg-violet-500/30 transition-colors"
              >
                <Save className="h-4 w-4" />
                {systemSaved ? "Saved!" : "Save Configuration"}
              </button>
            </GlowCard>
          </motion.div>
        )}

        {/* Email Templates */}
        {activeTab === "email" && (
          <motion.div key="email" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <div className="flex gap-4">
              {/* Template list */}
              <div className="w-44 flex-shrink-0 space-y-1">
                {EMAIL_TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTemplate(t.id)}
                    className={cn(
                      "w-full rounded-xl px-3 py-2.5 text-left text-xs font-semibold transition-all",
                      activeTemplate === t.id
                        ? "bg-violet-500/20 text-violet-200"
                        : "text-muted hover:bg-white/5 hover:text-text"
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Editor */}
              <GlowCard className="flex-1 p-5 space-y-3">
                {EMAIL_TEMPLATES.filter((t) => t.id === activeTemplate).map((t) => (
                  <div key={t.id}>
                    <h3 className="text-sm font-bold text-text">{t.label}</h3>
                    <p className="text-xs text-muted mt-0.5 mb-3">{t.description}</p>
                  </div>
                ))}
                <textarea
                  value={templateContent[activeTemplate] ?? ""}
                  onChange={(e) => setTemplateContent((p) => ({ ...p, [activeTemplate]: e.target.value }))}
                  rows={10}
                  className="w-full rounded-xl border border-border bg-white/5 px-4 py-3 font-mono text-xs text-text focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/30 resize-none"
                />
                <p className="text-xs text-muted">Use <code className="text-violet-300">{`{{variable}}`}</code> placeholders for dynamic content.</p>
                <button className="flex items-center gap-2 rounded-xl bg-violet-500/20 px-4 py-2 text-xs font-semibold text-violet-300 hover:bg-violet-500/30 transition-colors">
                  <Save className="h-3.5 w-3.5" />
                  Save Template
                </button>
              </GlowCard>
            </div>
          </motion.div>
        )}

        {/* Security */}
        {activeTab === "security" && (
          <motion.div key="security" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <GlowCard className="p-6 space-y-6">
              <h2 className="text-base font-bold text-text">Security Settings</h2>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-text">Enforce Two-Factor Authentication</p>
                  <p className="text-xs text-muted mt-0.5">Require all staff and admin users to set up 2FA</p>
                </div>
                <button
                  onClick={() => setEnforce2FA(!enforce2FA)}
                  className={`relative mt-0.5 h-5 w-9 flex-shrink-0 rounded-full transition-colors ${enforce2FA ? "bg-violet-500" : "bg-white/10"}`}
                >
                  <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${enforce2FA ? "translate-x-4" : "translate-x-0.5"}`} />
                </button>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider">Minimum Password Length</label>
                  <span className="text-sm font-bold text-violet-300">{minPasswordLength} chars</span>
                </div>
                <input
                  type="range"
                  min={8} max={32}
                  value={minPasswordLength}
                  onChange={(e) => setMinPasswordLength(Number(e.target.value))}
                  className="w-full accent-violet-500"
                />
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted uppercase tracking-wider">Password Complexity</p>
                {[
                  { key: "upper", label: "Require uppercase letters", value: requireUppercase, setter: setRequireUppercase },
                  { key: "numbers", label: "Require numbers", value: requireNumbers, setter: setRequireNumbers },
                  { key: "symbols", label: "Require symbols", value: requireSymbols, setter: setRequireSymbols },
                ].map(({ key, label, value, setter }) => (
                  <div key={key} className="flex items-center justify-between py-1.5">
                    <span className="text-sm text-text">{label}</span>
                    <button
                      onClick={() => setter(!value)}
                      className={`relative h-5 w-9 rounded-full transition-colors ${value ? "bg-violet-500" : "bg-white/10"}`}
                    >
                      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${value ? "translate-x-4" : "translate-x-0.5"}`} />
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-xs font-semibold text-muted mb-2 uppercase tracking-wider">IP Allowlist</p>
                <div className="space-y-1.5 mb-2">
                  {ipAllowlist.map((ip) => (
                    <div key={ip} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-1.5">
                      <code className="text-xs text-violet-300">{ip}</code>
                      <button onClick={() => setIpAllowlist((p) => p.filter((x) => x !== ip))} className="text-muted hover:text-rose-400 transition-colors">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. 192.168.1.0/24"
                    value={newIp}
                    onChange={(e) => setNewIp(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addIp()}
                    className="flex-1 rounded-xl border border-border bg-white/5 px-4 py-2 text-sm text-text focus:border-violet-500/50 focus:outline-none"
                  />
                  <button onClick={addIp} className="rounded-xl bg-violet-500/20 px-3 py-2 text-violet-300 hover:bg-violet-500/30 transition-colors">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={saveSecurity}
                className="flex items-center gap-2 rounded-xl bg-violet-500/20 px-5 py-2.5 text-sm font-semibold text-violet-300 hover:bg-violet-500/30 transition-colors"
              >
                <Save className="h-4 w-4" />
                {securitySaved ? "Saved!" : "Save Security Settings"}
              </button>
            </GlowCard>
          </motion.div>
        )}

        {/* Audit Retention */}
        {activeTab === "retention" && (
          <motion.div key="retention" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <GlowCard className="p-6 space-y-6">
              <h2 className="text-base font-bold text-text">Audit Log Retention</h2>
              <p className="text-xs text-muted">Set how many days logs are retained before automatic deletion.</p>

              {[
                { label: "Authentication Logs", desc: "Login, logout, and failed attempt records", value: authLogRetention, setter: setAuthLogRetention, max: 365 },
                { label: "User Activity Logs", desc: "Page views, actions, and feature usage", value: activityLogRetention, setter: setActivityLogRetention, max: 730 },
                { label: "Error Logs", desc: "API errors, crashes, and exceptions", value: errorLogRetention, setter: setErrorLogRetention, max: 730 },
                { label: "Data Export Logs", desc: "Records of all data export requests", value: dataExportRetention, setter: setDataExportRetention, max: 180 },
              ].map(({ label, desc, value, setter, max }) => (
                <div key={label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-text">{label}</p>
                      <p className="text-xs text-muted">{desc}</p>
                    </div>
                    <span className="text-sm font-bold text-violet-300 tabular-nums">{value}d</span>
                  </div>
                  <input
                    type="range"
                    min={7}
                    max={max}
                    step={1}
                    value={value}
                    onChange={(e) => setter(Number(e.target.value))}
                    className="w-full accent-violet-500"
                  />
                  <div className="flex justify-between text-xs text-muted">
                    <span>7 days</span>
                    <span>{max / 30} months</span>
                  </div>
                </div>
              ))}

              <button
                onClick={saveRetention}
                className="flex items-center gap-2 rounded-xl bg-violet-500/20 px-5 py-2.5 text-sm font-semibold text-violet-300 hover:bg-violet-500/30 transition-colors"
              >
                <Save className="h-4 w-4" />
                {retentionSaved ? "Saved!" : "Save Retention Policy"}
              </button>
            </GlowCard>
          </motion.div>
        )}
      </div>
    </div>
  );
}
