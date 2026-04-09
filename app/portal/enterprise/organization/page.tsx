"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { GlowCard } from "@/components/ui/GlowCard";
import { cn } from "@/lib/cn";
import { Building2, Save, Check } from "lucide-react";
import { motion } from "framer-motion";

const TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Anchorage",
  "Pacific/Honolulu",
];

const RETENTION_OPTIONS = [
  { label: "30 days",  value: "30" },
  { label: "60 days",  value: "60" },
  { label: "90 days",  value: "90" },
  { label: "1 year",   value: "365" },
  { label: "Indefinite", value: "0" },
];

type Theme = "dark-slate" | "light" | "high-contrast";

interface OrgSettings {
  orgName: string;
  subdomain: string;
  contactEmail: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  timezone: string;
  dataRetention: string;
  theme: Theme;
  mfaRequired: boolean;
  sessionTimeout: string;
  publicDirectory: boolean;
}

const DEFAULT: OrgSettings = {
  orgName: "",
  subdomain: "",
  contactEmail: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  timezone: "America/Los_Angeles",
  dataRetention: "90",
  theme: "dark-slate",
  mfaRequired: true,
  sessionTimeout: "60",
  publicDirectory: false,
};

export default function OrganizationPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [settings, setSettings] = useState<OrgSettings>(DEFAULT);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) { router.replace("/portal/enterprise/auth"); return; }
    fetch("/api/enterprise/org")
      .then((r) => r.json())
      .then((data) => { if (data.settings) setSettings((prev) => ({ ...prev, ...data.settings })); })
      .catch(() => {});
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const update = <K extends keyof OrgSettings>(key: K, value: OrgSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
    setSaved(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    fetch("/api/enterprise/org", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    }).catch(() => {});
    setSaved(true);
    setDirty(false);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-white">
            <Building2 size={22} className="text-cyan-400" /> Organization Settings
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Configure your tenant identity, branding, security, and data policies
          </p>
        </div>
        {dirty && (
          <span className="rounded-full bg-amber-900/40 border border-amber-700/40 px-3 py-1 text-xs font-semibold text-amber-300">
            Unsaved changes
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Organization Identity */}
        <GlowCard className="bg-slate-900 border-slate-800 p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">Organization Identity</h2>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-400">Organization Name</label>
              <input
                value={settings.orgName}
                onChange={(e) => update("orgName", e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-400">Subdomain</label>
              <div className="flex items-center rounded-xl border border-slate-700 bg-slate-950 overflow-hidden">
                <span className="px-3 text-sm text-slate-600 border-r border-slate-700 py-2.5">sdtools.org/</span>
                <input
                  value={settings.subdomain}
                  onChange={(e) => update("subdomain", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  className="flex-1 bg-transparent px-3 py-2.5 text-sm text-white outline-none"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-400">Contact Email</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => update("contactEmail", e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-400">Timezone</label>
              <select
                value={settings.timezone}
                onChange={(e) => update("timezone", e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500/50 cursor-pointer"
              >
                {TIMEZONES.map((tz) => <option key={tz}>{tz}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-400">Street Address</label>
            <input
              value={settings.address}
              onChange={(e) => update("address", e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {(["city", "state", "zipCode"] as const).map((field) => (
              <div key={field}>
                <label className="mb-1.5 block text-xs font-semibold capitalize text-slate-400">
                  {field === "zipCode" ? "ZIP Code" : field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  value={settings[field]}
                  onChange={(e) => update(field, e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition"
                />
              </div>
            ))}
          </div>
        </GlowCard>

        {/* Theme */}
        <GlowCard className="bg-slate-900 border-slate-800 p-6 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">Portal Theme</h2>
          <div className="flex gap-3 flex-wrap">
            {([
              { value: "dark-slate",     label: "Dark Slate",     bg: "bg-slate-950", border: "border-slate-700" },
              { value: "light",          label: "Light",          bg: "bg-white",     border: "border-slate-300" },
              { value: "high-contrast",  label: "High Contrast",  bg: "bg-black",     border: "border-white" },
            ] as const).map(({ value, label, bg, border }) => (
              <button
                key={value}
                type="button"
                onClick={() => update("theme", value)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border-2 px-5 py-3 text-xs font-semibold transition",
                  settings.theme === value
                    ? "border-cyan-500 text-cyan-300"
                    : "border-slate-700 text-slate-400 hover:border-slate-600"
                )}
              >
                <div className={cn("h-8 w-12 rounded-lg border", bg, border)} />
                {label}
              </button>
            ))}
          </div>
        </GlowCard>

        {/* Security & Data */}
        <GlowCard className="bg-slate-900 border-slate-800 p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">Security & Data Policies</h2>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-400">Data Retention Period</label>
              <select
                value={settings.dataRetention}
                onChange={(e) => update("dataRetention", e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500/50 cursor-pointer"
              >
                {RETENTION_OPTIONS.map(({ label, value }) => <option key={value} value={value}>{label}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-400">Session Timeout (minutes)</label>
              <input
                type="number"
                min={15}
                max={480}
                value={settings.sessionTimeout}
                onChange={(e) => update("sessionTimeout", e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition"
              />
            </div>
          </div>

          {/* Toggles */}
          {([
            { key: "mfaRequired",      label: "Require MFA for all portal users",         desc: "Users must set up multi-factor authentication" },
            { key: "publicDirectory",  label: "Enable public participant directory",        desc: "Allow participants to search for peers by name" },
          ] as const).map(({ key, label, desc }) => (
            <div key={key} className="flex items-start justify-between gap-4 rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-slate-200">{label}</p>
                <p className="text-xs text-slate-500">{desc}</p>
              </div>
              <button
                type="button"
                onClick={() => update(key, !settings[key])}
                className={cn(
                  "relative h-6 w-11 shrink-0 rounded-full transition",
                  settings[key] ? "bg-cyan-600" : "bg-slate-700"
                )}
              >
                <span className={cn(
                  "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
                  settings[key] ? "left-5" : "left-0.5"
                )} />
              </button>
            </div>
          ))}
        </GlowCard>

        {/* Save */}
        <div className="flex justify-end">
          <button
            type="submit"
            className={cn(
              "flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition",
              saved
                ? "bg-emerald-700 text-white"
                : "bg-cyan-600 text-white hover:bg-cyan-500"
            )}
          >
            {saved ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Save Settings</>}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
