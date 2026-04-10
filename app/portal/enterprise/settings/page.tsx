"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import {
  Settings,
  Bell,
  Plug,
  CreditCard,
  Save,
  Check,
  Copy,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

const TABS = [
  { id: "preferences", label: "Portal Preferences", icon: Settings },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "integrations", label: "Integrations", icon: Plug },
  { id: "billing", label: "Billing", icon: CreditCard },
] as const;

type TabId = typeof TABS[number]["id"];

interface NotifToggle {
  id: string;
  label: string;
  description: string;
  email: boolean;
  inApp: boolean;
}

const DEFAULT_NOTIFS: NotifToggle[] = [
  { id: "new_enrollment", label: "New Enrollment", description: "When a new participant enrolls in a program.", email: true, inApp: true },
  { id: "goal_completed", label: "Goal Completed", description: "When a participant completes a goal.", email: false, inApp: true },
  { id: "at_risk", label: "At-Risk Flag", description: "When a participant is flagged as high risk.", email: true, inApp: true },
  { id: "report_ready", label: "Report Ready", description: "When a scheduled report finishes generating.", email: true, inApp: false },
  { id: "staff_joined", label: "Staff Member Joined", description: "When a new staff member accepts their invite.", email: false, inApp: true },
];

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${checked ? "bg-sky-600" : "bg-slate-600"}`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : "translate-x-1"}`}
      />
    </button>
  );
}

export default function EnterpriseSettingsPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("preferences");
  const [saved, setSaved] = useState(false);
  const [apiKeyCopied, setApiKeyCopied] = useState(false);

  // Preferences state
  const [defaultLanding, setDefaultLanding] = useState("/portal/enterprise/dashboard");
  const [language, setLanguage] = useState("en");
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");
  const [compactMode, setCompactMode] = useState(false);

  // Notifications state
  const [notifs, setNotifs] = useState<NotifToggle[]>(DEFAULT_NOTIFS);

  // Integrations state
  const [webhookUrl, setWebhookUrl] = useState("");
  const [ssoEnabled, setSsoEnabled] = useState(false);

  const SAMPLE_API_KEY = "ent_live_••••••••••••••••••••••••••••";

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/portal/enterprise/auth");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) return null;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleCopyKey = () => {
    setApiKeyCopied(true);
    setTimeout(() => setApiKeyCopied(false), 2000);
  };

  const toggleNotif = (id: string, field: "email" | "inApp", val: boolean) => {
    setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, [field]: val } : n));
  };

  const LANDING_OPTIONS = [
    { label: "Dashboard", value: "/portal/enterprise/dashboard" },
    { label: "Programs", value: "/portal/enterprise/programs" },
    { label: "Participants", value: "/portal/enterprise/participants" },
    { label: "Analytics", value: "/portal/enterprise/analytics" },
    { label: "Reports", value: "/portal/enterprise/reports" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-100">Settings</h1>
        <p className="mt-1 text-sm text-slate-400">
          Manage your portal preferences, notifications, integrations, and billing.
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 rounded-xl border border-slate-700/40 bg-slate-800/40 p-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
              activeTab === id
                ? "bg-sky-700/60 text-sky-100 shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* TAB: Preferences */}
      {activeTab === "preferences" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-700/40 bg-slate-800/40 p-6 space-y-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Default Landing Page</h2>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {LANDING_OPTIONS.map((o) => (
                <label
                  key={o.value}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all ${
                    defaultLanding === o.value
                      ? "border-sky-600/60 bg-sky-900/30"
                      : "border-slate-700/40 bg-slate-800/30 hover:border-sky-800/40"
                  }`}
                >
                  <input type="radio" className="sr-only" checked={defaultLanding === o.value} onChange={() => setDefaultLanding(o.value)} />
                  <div className={`h-3 w-3 rounded-full border-2 ${defaultLanding === o.value ? "border-sky-400 bg-sky-400" : "border-slate-500"}`} />
                  <span className="text-sm text-slate-200">{o.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-700/40 bg-slate-800/40 p-5 space-y-3">
              <label className="text-sm font-semibold text-slate-400">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-lg border border-slate-700/50 bg-slate-900/60 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-600/50"
              >
                <option value="en">English (US)</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="pt">Portuguese</option>
              </select>
            </div>

            <div className="rounded-xl border border-slate-700/40 bg-slate-800/40 p-5 space-y-3">
              <label className="text-sm font-semibold text-slate-400">Date Format</label>
              <select
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
                className="w-full rounded-lg border border-slate-700/50 bg-slate-900/60 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-600/50"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-700/40 bg-slate-800/40 p-5">
            <div>
              <p className="text-sm font-semibold text-slate-200">Compact Mode</p>
              <p className="text-xs text-slate-500 mt-0.5">Reduce spacing and padding across the portal UI.</p>
            </div>
            <ToggleSwitch checked={compactMode} onChange={setCompactMode} />
          </div>
        </div>
      )}

      {/* TAB: Notifications */}
      {activeTab === "notifications" && (
        <div className="rounded-xl border border-slate-700/40 bg-slate-800/40 divide-y divide-slate-700/30">
          <div className="grid grid-cols-[1fr_auto_auto] gap-6 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <span>Event</span>
            <span>Email</span>
            <span>In-App</span>
          </div>
          {notifs.map((n) => (
            <div key={n.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-6 px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-slate-200">{n.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{n.description}</p>
              </div>
              <ToggleSwitch checked={n.email} onChange={(v) => toggleNotif(n.id, "email", v)} />
              <ToggleSwitch checked={n.inApp} onChange={(v) => toggleNotif(n.id, "inApp", v)} />
            </div>
          ))}
        </div>
      )}

      {/* TAB: Integrations */}
      {activeTab === "integrations" && (
        <div className="space-y-5">
          <div className="rounded-xl border border-slate-700/40 bg-slate-800/40 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-slate-300">API Key</h2>
            <div className="flex items-center gap-3">
              <input
                readOnly
                value={SAMPLE_API_KEY}
                className="flex-1 rounded-lg border border-slate-700/50 bg-slate-900/60 px-3 py-2 text-sm font-mono text-slate-400 focus:outline-none"
              />
              <button
                onClick={handleCopyKey}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700/50 bg-slate-800 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 transition"
              >
                {apiKeyCopied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                {apiKeyCopied ? "Copied" : "Copy"}
              </button>
              <button className="flex items-center gap-1.5 rounded-lg border border-slate-700/50 bg-slate-800 px-3 py-2 text-sm text-rose-400 hover:bg-slate-700 transition">
                <RefreshCw className="h-4 w-4" />
                Rotate
              </button>
            </div>
            <p className="text-xs text-slate-600">Never expose your API key in client-side code.</p>
          </div>

          <div className="rounded-xl border border-slate-700/40 bg-slate-800/40 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-slate-300">Webhook Endpoint</h2>
            <input
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://your-app.com/api/webhooks/tools"
              className="w-full rounded-lg border border-slate-700/50 bg-slate-900/60 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-600/50"
            />
            <p className="text-xs text-slate-600">Receives POST events for enrollments, goals, and flags.</p>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-700/40 bg-slate-800/40 p-5">
            <div>
              <p className="text-sm font-semibold text-slate-200">Single Sign-On (SSO)</p>
              <p className="text-xs text-slate-500 mt-0.5">Enable SAML / OIDC SSO for enterprise staff login.</p>
            </div>
            <ToggleSwitch checked={ssoEnabled} onChange={setSsoEnabled} />
          </div>

          {ssoEnabled && (
            <div className="rounded-xl border border-sky-800/40 bg-sky-950/30 p-5 text-sm text-sky-300">
              SSO configuration requires an Enterprise plan.{" "}
              <a href="#billing" onClick={() => setActiveTab("billing")} className="underline hover:no-underline">
                Upgrade your plan
              </a>{" "}
              to enable SAML/OIDC login.
            </div>
          )}
        </div>
      )}

      {/* TAB: Billing */}
      {activeTab === "billing" && (
        <div className="space-y-5">
          <div className="rounded-xl border border-sky-700/40 bg-sky-950/30 p-6 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-sky-500">Current Plan</p>
                <p className="mt-1 text-2xl font-extrabold text-sky-100">Professional</p>
                <p className="mt-0.5 text-sm text-slate-400">Up to 5 staff accounts · 500 participants · Standard SLA</p>
              </div>
              <span className="rounded-full bg-sky-900/40 px-3 py-1 text-xs font-semibold text-sky-400 border border-sky-700/30">
                Active
              </span>
            </div>
            <div className="pt-2 border-t border-sky-800/30 flex flex-wrap gap-3">
              <button className="flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-500 transition">
                Upgrade to Enterprise
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-slate-700/50 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 transition">
                <ExternalLink className="h-4 w-4" /> Manage Billing
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-slate-700/40 bg-slate-800/40 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-slate-400">Billing Contact</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-500">Contact Name</label>
                <input
                  placeholder="Jane Smith"
                  className="w-full rounded-lg border border-slate-700/50 bg-slate-900/60 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-600/50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-slate-500">Billing Email</label>
                <input
                  type="email"
                  placeholder="billing@yourorg.com"
                  className="w-full rounded-lg border border-slate-700/50 bg-slate-900/60 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-600/50"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-700/40 bg-slate-800/40 p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-400">Invoice History</h2>
              <button className="text-xs text-sky-400 hover:underline">View all</button>
            </div>
            <div className="space-y-2">
              {["June 2025", "May 2025", "April 2025"].map((month) => (
                <div key={month} className="flex items-center justify-between rounded-lg bg-slate-900/40 px-4 py-2.5">
                  <div>
                    <p className="text-sm text-slate-200">{month}</p>
                    <p className="text-xs text-slate-600">Professional Plan</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-300">$149.00</span>
                    <button className="text-xs text-sky-400 hover:underline flex items-center gap-1">
                      <ExternalLink className="h-3 w-3" /> PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Save button (not shown on billing tab) */}
      {activeTab !== "billing" && (
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-500 transition"
          >
            {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      )}
    </div>
  );
}
