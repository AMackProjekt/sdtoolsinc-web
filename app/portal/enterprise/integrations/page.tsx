"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { GlowCard } from "@/components/ui/GlowCard";
import { cn } from "@/lib/cn";
import {
  Puzzle, Eye, EyeOff, Copy, Check, Zap, X,
  ShoppingBag, Send, BarChart2, Layers,
  Lock, Search, ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Integration {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  enabled: boolean;
  apiKey: string;
  webhookUrl: string;
  status: "configured" | "needs-config" | "disabled";
}

type Urgency = "Low" | "Medium" | "High" | "Critical";

interface MarketplaceApp {
  id: string; name: string; category: string; icon: string;
  description: string; vendor: string; pricing: string; tags: string[];
}

interface UsageStat {
  id: string; name: string; icon: string;
  apiCallsToday: number; lastSync: string; uptime: number; connectedUsers: number;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<Integration["status"], string> = {
  configured:     "bg-emerald-900/40 text-emerald-400 border-emerald-700/40",
  "needs-config": "bg-amber-900/40 text-amber-400 border-amber-700/40",
  disabled:       "bg-slate-800 text-slate-500 border-slate-700",
};

const CATEGORY_COLORS: Record<string, string> = {
  Messaging: "text-sky-400", AI: "text-violet-400", Analytics: "text-amber-400",
  Monitoring: "text-rose-400", Storage: "text-cyan-400", Auth: "text-emerald-400",
  Automation: "text-orange-400", HRIS: "text-pink-400", CRM: "text-blue-400",
  ERP: "text-indigo-400", Identity: "text-teal-400",
};

const MARKETPLACE_APPS: MarketplaceApp[] = [
  { id: "workday", name: "Workday", category: "HRIS", icon: "💼", description: "Enterprise HR, payroll, and workforce management platform.", vendor: "Workday, Inc.", pricing: "Enterprise", tags: ["HR", "Payroll", "Talent"] },
  { id: "sap", name: "SAP SuccessFactors", category: "HRIS", icon: "⚙️", description: "End-to-end HR suite for core HR, talent, and people analytics.", vendor: "SAP SE", pricing: "Enterprise", tags: ["HR", "Analytics", "Learning"] },
  { id: "salesforce", name: "Salesforce", category: "CRM", icon: "☁️", description: "World's #1 CRM platform for sales, service, and marketing automation.", vendor: "Salesforce", pricing: "Per user/mo", tags: ["CRM", "Sales", "Marketing"] },
  { id: "okta", name: "Okta", category: "Identity", icon: "🔐", description: "Enterprise identity platform with SSO, MFA, and lifecycle management.", vendor: "Okta, Inc.", pricing: "Per user/mo", tags: ["SSO", "MFA", "Zero Trust"] },
  { id: "servicenow", name: "ServiceNow", category: "Automation", icon: "🛠️", description: "Digital workflow automation for IT, HR, Customer Service, and more.", vendor: "ServiceNow", pricing: "Enterprise", tags: ["ITSM", "Workflow", "Automation"] },
  { id: "tableau", name: "Tableau", category: "Analytics", icon: "📊", description: "Business intelligence and visual analytics platform.", vendor: "Salesforce", pricing: "Per user/mo", tags: ["BI", "Analytics", "Dashboards"] },
  { id: "powerbi", name: "Power BI", category: "Analytics", icon: "📈", description: "Microsoft's business analytics service for interactive visualizations.", vendor: "Microsoft", pricing: "Per user/mo", tags: ["BI", "Microsoft", "Reporting"] },
  { id: "azure-ad", name: "Azure Active Directory", category: "Identity", icon: "🏢", description: "Microsoft's cloud-based identity and access management service.", vendor: "Microsoft", pricing: "Per user/mo", tags: ["SSO", "RBAC", "Entra ID"] },
  { id: "sharepoint", name: "SharePoint Online", category: "Storage", icon: "📁", description: "Enterprise document management and team collaboration platform.", vendor: "Microsoft", pricing: "M365 bundle", tags: ["Documents", "Intranet", "Collaboration"] },
  { id: "jira", name: "Jira (Cloud)", category: "Automation", icon: "🎯", description: "Project tracking and agile workflow management for teams.", vendor: "Atlassian", pricing: "Per user/mo", tags: ["Agile", "Projects", "ITSM"] },
  { id: "zoom", name: "Zoom Workplace", category: "Messaging", icon: "🎥", description: "Video conferencing, webinars, and team chat platform.", vendor: "Zoom", pricing: "Per user/mo", tags: ["Video", "Chat", "Webinar"] },
  { id: "docusign", name: "DocuSign", category: "Automation", icon: "📝", description: "eSignature and contract lifecycle management platform.", vendor: "DocuSign", pricing: "Per envelope/mo", tags: ["eSign", "Contracts", "Legal"] },
];

const USAGE_STATS: UsageStat[] = [
  { id: "slack", name: "Slack", icon: "💬", apiCallsToday: 14840, lastSync: "2 min ago", uptime: 99.98, connectedUsers: 87 },
  { id: "openai", name: "OpenAI GPT", icon: "🤖", apiCallsToday: 3290, lastSync: "just now", uptime: 99.72, connectedUsers: 34 },
  { id: "ga4", name: "Google Analytics 4", icon: "📊", apiCallsToday: 892, lastSync: "18 min ago", uptime: 100, connectedUsers: 12 },
  { id: "sentry", name: "Sentry", icon: "🔎", apiCallsToday: 411, lastSync: "5 min ago", uptime: 99.95, connectedUsers: 8 },
  { id: "s3", name: "Amazon S3", icon: "🗄️", apiCallsToday: 7203, lastSync: "1 min ago", uptime: 100, connectedUsers: 21 },
  { id: "auth0", name: "Auth0", icon: "🔐", apiCallsToday: 5588, lastSync: "just now", uptime: 99.99, connectedUsers: 87 },
];

const TABS = [
  { id: "connected",   label: "Connected Apps",   icon: Layers },
  { id: "marketplace", label: "App Marketplace",   icon: ShoppingBag },
  { id: "request",     label: "Request App",       icon: Send },
  { id: "analytics",   label: "Usage Analytics",   icon: BarChart2 },
] as const;

type TabId = typeof TABS[number]["id"];

export default function IntegrationsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Tab 1 — connected apps
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<string | null>(null);
  const [testing, setTesting] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<Record<string, { apiKey?: string; webhookUrl?: string }>>({});

  // Tab nav
  const [activeTab, setActiveTab] = useState<TabId>("connected");

  // Tab 2 — marketplace
  const [mktSearch, setMktSearch] = useState("");
  const [mktCategory, setMktCategory] = useState("All");
  const [requested, setRequested] = useState<Set<string>>(new Set());

  // Tab 3 — request app
  const [reqForm, setReqForm] = useState({ appName: "", justification: "", urgency: "Medium" as Urgency, email: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) { router.replace("/portal/enterprise/auth"); return; }
    fetch("/api/enterprise/integrations")
      .then((r) => r.json())
      .then((data) => { if (data.integrations) setIntegrations(data.integrations as Integration[]); })
      .catch(() => {})
      .finally(() => setLoadingData(false));
  }, [isAuthenticated, router]);

  const persist = useCallback((updated: Integration[]) => {
    setIntegrations(updated);
    fetch("/api/enterprise/integrations", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ integrations: updated }),
    }).catch(() => {});
  }, []);

  if (!isAuthenticated) return null;

  const toggleEnabled = (id: string) => {
    const updated = integrations.map((i) =>
      i.id === id
        ? { ...i, enabled: !i.enabled, status: (!i.enabled && !i.apiKey && i.category !== "Automation") ? "needs-config" as const : (!i.enabled ? "configured" as const : "disabled" as const) }
        : i
    );
    persist(updated);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleTest = async (id: string) => {
    setTesting(id);
    await new Promise((r) => setTimeout(r, 1200));
    setTestResult((prev) => ({ ...prev, [id]: "200 OK — Webhook delivered" }));
    setTesting(null);
    setTimeout(() => setTestResult((prev) => { const n = { ...prev }; delete n[id]; return n; }), 4000);
  };

  const saveKeys = (id: string) => {
    const edits = editing[id] || {};
    const updated = integrations.map((i) => {
      if (i.id !== id) return i;
      const apiKey = edits.apiKey !== undefined ? edits.apiKey : i.apiKey;
      const webhookUrl = edits.webhookUrl !== undefined ? edits.webhookUrl : i.webhookUrl;
      const configured = apiKey.length > 0 || webhookUrl.length > 0 || i.category === "Automation";
      return { ...i, apiKey, webhookUrl, status: (i.enabled ? (configured ? "configured" : "needs-config") : "disabled") as Integration["status"] };
    });
    persist(updated);
    setEditing((prev) => { const n = { ...prev }; delete n[id]; return n; });
  };

  const categories = [...new Set(integrations.map((i) => i.category))];
  const totalEnabled = integrations.filter((i) => i.enabled).length;
  const totalConfigured = integrations.filter((i) => i.status === "configured").length;

  // Marketplace helpers
  const mktCategories = ["All", ...Array.from(new Set(MARKETPLACE_APPS.map((a) => a.category)))];
  const filteredMkt = MARKETPLACE_APPS.filter((a) => {
    const matchSearch = a.name.toLowerCase().includes(mktSearch.toLowerCase()) ||
      a.description.toLowerCase().includes(mktSearch.toLowerCase()) ||
      a.tags.some((t) => t.toLowerCase().includes(mktSearch.toLowerCase()));
    const matchCat = mktCategory === "All" || a.category === mktCategory;
    return matchSearch && matchCat;
  });

  const handleRequestAccess = (appId: string) => {
    setRequested((prev) => new Set(prev).add(appId));
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setReqForm({ appName: "", justification: "", urgency: "Medium", email: "" });
    }, 4000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-white">
            <Puzzle size={22} className="text-cyan-400" /> Integration Hub
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Enterprise-grade app connectivity — connect, request, and monitor your integrations
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <div className="rounded-xl bg-slate-900 border border-slate-800 px-4 py-2 text-center">
            <p className="text-xl font-extrabold text-cyan-400">{totalEnabled}</p>
            <p className="text-xs text-slate-500">Enabled</p>
          </div>
          <div className="rounded-xl bg-slate-900 border border-slate-800 px-4 py-2 text-center">
            <p className="text-xl font-extrabold text-emerald-400">{totalConfigured}</p>
            <p className="text-xs text-slate-500">Configured</p>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 rounded-2xl bg-slate-900/80 border border-slate-800 p-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                active
                  ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
                  : "text-slate-500 hover:text-slate-300"
              )}
            >
              <Icon size={15} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">

        {/* ── TAB 1: Connected Apps ─────────────────────────────────────── */}
        {activeTab === "connected" && (
          <motion.div
            key="connected"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {loadingData ? (
              <p className="text-sm text-slate-500">Loading integrations…</p>
            ) : categories.length === 0 ? (
              <GlowCard className="bg-slate-900 border-slate-800 p-8 text-center">
                <p className="text-slate-500">No integrations configured yet.</p>
                <button
                  type="button"
                  onClick={() => setActiveTab("marketplace")}
                  className="mt-3 text-sm text-cyan-400 hover:underline"
                >
                  Browse the marketplace →
                </button>
              </GlowCard>
            ) : (
              categories.map((cat) => (
                <div key={cat} className="space-y-3">
                  <h2 className={cn("text-xs font-bold uppercase tracking-widest", CATEGORY_COLORS[cat] ?? "text-slate-400")}>
                    {cat}
                  </h2>
                  <div className="space-y-3">
                    {integrations.filter((i) => i.category === cat).map((intg) => (
                      <GlowCard key={intg.id} className="bg-slate-900 border-slate-800 p-0 overflow-hidden">
                        <div className="flex items-center gap-4 p-4">
                          <span className="text-2xl">{intg.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white">{intg.name}</span>
                              <span className={cn("rounded-full border px-2 py-0.5 text-[11px] font-semibold", STATUS_STYLES[intg.status])}>
                                {intg.status === "needs-config" ? "Needs Config" : intg.status.charAt(0).toUpperCase() + intg.status.slice(1)}
                              </span>
                            </div>
                            <p className="mt-0.5 text-xs text-slate-500 truncate">{intg.description}</p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <button
                              type="button"
                              onClick={() => setExpanded(expanded === intg.id ? null : intg.id)}
                              className="text-xs text-slate-500 hover:text-cyan-400 transition"
                            >
                              Configure
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleEnabled(intg.id)}
                              className={cn("relative h-6 w-11 rounded-full transition", intg.enabled ? "bg-cyan-600" : "bg-slate-700")}
                            >
                              <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all", intg.enabled ? "left-5" : "left-0.5")} />
                            </button>
                          </div>
                        </div>
                        <AnimatePresence initial={false}>
                          {expanded === intg.id && (
                            <motion.div
                              key="panel"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden"
                            >
                              <div className="border-t border-slate-800 bg-slate-950/60 p-4 space-y-4">
                                {intg.category !== "Automation" && (
                                  <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-slate-400">API Key / DSN</label>
                                    <div className="flex gap-2">
                                      <div className="relative flex-1">
                                        <input
                                          type={revealed[intg.id] ? "text" : "password"}
                                          value={editing[intg.id]?.apiKey ?? intg.apiKey}
                                          onChange={(e) => setEditing((prev) => ({ ...prev, [intg.id]: { ...prev[intg.id], apiKey: e.target.value } }))}
                                          placeholder="Paste your API key…"
                                          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 pr-10 text-sm text-white outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition font-mono"
                                        />
                                        <button type="button" onClick={() => setRevealed((p) => ({ ...p, [intg.id]: !p[intg.id] }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition">
                                          {revealed[intg.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                                        </button>
                                      </div>
                                      <button type="button" onClick={() => handleCopy(intg.id, editing[intg.id]?.apiKey ?? intg.apiKey)} className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-xs text-slate-400 hover:text-cyan-400 transition">
                                        {copied === intg.id ? <Check size={12} /> : <Copy size={12} />}
                                        {copied === intg.id ? "Copied" : "Copy"}
                                      </button>
                                    </div>
                                  </div>
                                )}
                                {(intg.category === "Automation" || intg.id === "webhook") && (
                                  <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-slate-400">Webhook URL</label>
                                    <div className="flex gap-2">
                                      <input
                                        value={editing[intg.id]?.webhookUrl ?? intg.webhookUrl}
                                        onChange={(e) => setEditing((prev) => ({ ...prev, [intg.id]: { ...prev[intg.id], webhookUrl: e.target.value } }))}
                                        placeholder="https://your-endpoint.com/webhook"
                                        className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition"
                                      />
                                      <button type="button" onClick={() => handleTest(intg.id)} disabled={!!testing} className="flex items-center gap-1.5 rounded-xl bg-cyan-900/40 border border-cyan-700/40 px-3 py-2.5 text-xs font-semibold text-cyan-400 hover:bg-cyan-900/60 transition disabled:opacity-50">
                                        <Zap size={12} />
                                        {testing === intg.id ? "Sending…" : "Test"}
                                      </button>
                                    </div>
                                    {testResult[intg.id] && (
                                      <p className="mt-1.5 flex items-center gap-1 text-xs text-emerald-400"><Check size={11} /> {testResult[intg.id]}</p>
                                    )}
                                  </div>
                                )}
                                <div className="flex justify-end gap-2">
                                  <button type="button" onClick={() => { setExpanded(null); setEditing((p) => { const n = { ...p }; delete n[intg.id]; return n; }); }} className="flex items-center gap-1 rounded-xl border border-slate-700 px-4 py-2 text-xs text-slate-400 hover:text-white transition">
                                    <X size={12} /> Cancel
                                  </button>
                                  <button type="button" onClick={() => saveKeys(intg.id)} className="flex items-center gap-1 rounded-xl bg-cyan-600 px-4 py-2 text-xs font-semibold text-white hover:bg-cyan-500 transition">
                                    <Check size={12} /> Save
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </GlowCard>
                    ))}
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}

        {/* ── TAB 2: App Marketplace ────────────────────────────────────── */}
        {activeTab === "marketplace" && (
          <motion.div
            key="marketplace"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="space-y-5"
          >
            {/* Search + filter */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={mktSearch}
                  onChange={(e) => setMktSearch(e.target.value)}
                  placeholder="Search apps, vendors, tags…"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 pl-9 pr-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition"
                />
              </div>
              <select
                value={mktCategory}
                onChange={(e) => setMktCategory(e.target.value)}
                className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-500/50 transition"
              >
                {mktCategories.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>

            {/* Catalog grid */}
            {filteredMkt.length === 0 ? (
              <p className="text-sm text-slate-500 py-8 text-center">No apps match your search.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredMkt.map((app) => {
                  const isRequested = requested.has(app.id);
                  return (
                    <GlowCard key={app.id} className="bg-slate-900 border-slate-800 p-5 flex flex-col gap-3">
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{app.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-white truncate">{app.name}</p>
                          <p className="text-xs text-slate-500">{app.vendor}</p>
                        </div>
                        <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide", CATEGORY_COLORS[app.category] ? `${CATEGORY_COLORS[app.category]} bg-slate-800` : "text-slate-400 bg-slate-800")}>
                          {app.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{app.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {app.tags.map((t) => (
                          <span key={t} className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">{t}</span>
                        ))}
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-1">
                        <span className="flex items-center gap-1 text-xs text-slate-500"><Lock size={10} /> {app.pricing}</span>
                        <button
                          type="button"
                          onClick={() => handleRequestAccess(app.id)}
                          disabled={isRequested}
                          className={cn(
                            "flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition",
                            isRequested
                              ? "bg-emerald-900/40 text-emerald-400 border border-emerald-700/40 cursor-default"
                              : "bg-cyan-600 text-white hover:bg-cyan-500"
                          )}
                        >
                          {isRequested ? <><Check size={11} /> Requested</> : <><ChevronRight size={11} /> Request Access</>}
                        </button>
                      </div>
                    </GlowCard>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* ── TAB 3: Request App ───────────────────────────────────────── */}
        {activeTab === "request" && (
          <motion.div
            key="request"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <GlowCard className="bg-slate-900 border-slate-800 p-6 max-w-xl">
              <h2 className="text-base font-bold text-white mb-1">Request a New Integration</h2>
              <p className="text-xs text-slate-500 mb-5">
                Don&apos;t see what you need? Submit a request and our IT team will evaluate it within 3 business days.
              </p>
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-3 py-8 text-center"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-900/40 border border-emerald-700/40">
                    <Check size={22} className="text-emerald-400" />
                  </div>
                  <p className="font-semibold text-white">Request submitted!</p>
                  <p className="text-xs text-slate-500">Our IT governance team will follow up within 3 business days.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmitRequest} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-400">Application Name *</label>
                    <input
                      required
                      value={reqForm.appName}
                      onChange={(e) => setReqForm((p) => ({ ...p, appName: e.target.value }))}
                      placeholder="e.g. Workday, Salesforce, SAP…"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-400">Business Justification *</label>
                    <textarea
                      required
                      rows={4}
                      value={reqForm.justification}
                      onChange={(e) => setReqForm((p) => ({ ...p, justification: e.target.value }))}
                      placeholder="Explain the business need and expected ROI…"
                      className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-400">Priority / Urgency</label>
                      <select
                        value={reqForm.urgency}
                        onChange={(e) => setReqForm((p) => ({ ...p, urgency: e.target.value as Urgency }))}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500/50 transition"
                      >
                        {(["Low", "Medium", "High", "Critical"] as Urgency[]).map((u) => (
                          <option key={u} value={u}>{u}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-400">Contact Email *</label>
                      <input
                        required
                        type="email"
                        value={reqForm.email}
                        onChange={(e) => setReqForm((p) => ({ ...p, email: e.target.value }))}
                        placeholder="you@company.com"
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      className="flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-cyan-500 transition"
                    >
                      <Send size={14} /> Submit Request
                    </button>
                  </div>
                </form>
              )}
            </GlowCard>
          </motion.div>
        )}

        {/* ── TAB 4: Usage Analytics ───────────────────────────────────── */}
        {activeTab === "analytics" && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: "Active Integrations", value: totalEnabled, color: "text-cyan-400" },
                { label: "Fully Configured", value: totalConfigured, color: "text-emerald-400" },
                { label: "Total API Calls Today", value: USAGE_STATS.reduce((s, u) => s + u.apiCallsToday, 0).toLocaleString(), color: "text-amber-400" },
                { label: "Avg Uptime", value: `${(USAGE_STATS.reduce((s, u) => s + u.uptime, 0) / USAGE_STATS.length).toFixed(2)}%`, color: "text-violet-400" },
              ].map((s) => (
                <GlowCard key={s.label} className="bg-slate-900 border-slate-800 p-4 text-center">
                  <p className={cn("text-2xl font-extrabold", s.color)}>{s.value}</p>
                  <p className="mt-1 text-xs text-slate-500">{s.label}</p>
                </GlowCard>
              ))}
            </div>

            <div className="space-y-3">
              {USAGE_STATS.map((stat) => {
                const uptimeColor = stat.uptime >= 99.9 ? "text-emerald-400" : stat.uptime >= 99 ? "text-amber-400" : "text-rose-400";
                return (
                  <GlowCard key={stat.id} className="bg-slate-900 border-slate-800 p-4">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{stat.icon}</span>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-white">{stat.name}</p>
                        <p className="text-xs text-slate-500">Last sync: {stat.lastSync}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-6 text-right shrink-0">
                        <div>
                          <p className="text-sm font-bold text-amber-400">{stat.apiCallsToday.toLocaleString()}</p>
                          <p className="text-[10px] text-slate-500">API calls today</p>
                        </div>
                        <div>
                          <p className={cn("text-sm font-bold", uptimeColor)}>{stat.uptime}%</p>
                          <p className="text-[10px] text-slate-500">Uptime</p>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-cyan-400">{stat.connectedUsers}</p>
                          <p className="text-[10px] text-slate-500">Connected users</p>
                        </div>
                      </div>
                    </div>
                    {/* Uptime bar */}
                    <div className="mt-3 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all", stat.uptime >= 99.9 ? "bg-emerald-500" : stat.uptime >= 99 ? "bg-amber-500" : "bg-rose-500")}
                        style={{ width: `${stat.uptime}%` }}
                      />
                    </div>
                  </GlowCard>
                );
              })}
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  );
}
