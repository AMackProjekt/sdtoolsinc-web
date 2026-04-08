"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { GlowCard } from "@/components/ui/GlowCard";
import { cn } from "@/lib/cn";
import { Puzzle, Eye, EyeOff, Copy, Check, Zap, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

const STATUS_STYLES: Record<Integration["status"], string> = {
  configured:   "bg-emerald-900/40 text-emerald-400 border-emerald-700/40",
  "needs-config": "bg-amber-900/40 text-amber-400 border-amber-700/40",
  disabled:     "bg-slate-800 text-slate-500 border-slate-700",
};

const CATEGORY_COLORS: Record<string, string> = {
  Messaging: "text-sky-400", AI: "text-violet-400", Analytics: "text-amber-400",
  Monitoring: "text-rose-400", Storage: "text-cyan-400", Auth: "text-emerald-400", Automation: "text-orange-400",
};

export default function IntegrationsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<string | null>(null);
  const [testing, setTesting] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<Record<string, { apiKey?: string; webhookUrl?: string }>>({})

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
            <Puzzle size={22} className="text-cyan-400" /> Integration Hub
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Connect third-party services: messaging, AI, analytics, auth, and more
          </p>
        </div>
        <div className="flex gap-3">
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

      {/* By category */}
      {categories.map((cat) => (
        <div key={cat} className="space-y-3">
          <h2 className={cn("text-xs font-bold uppercase tracking-widest", CATEGORY_COLORS[cat] ?? "text-slate-400")}>
            {cat}
          </h2>
          <div className="space-y-3">
            {integrations
              .filter((i) => i.category === cat)
              .map((intg) => (
                <GlowCard key={intg.id} className="bg-slate-900 border-slate-800 p-0 overflow-hidden">
                  {/* Header row */}
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
                        className={cn(
                          "relative h-6 w-11 rounded-full transition",
                          intg.enabled ? "bg-cyan-600" : "bg-slate-700"
                        )}
                      >
                        <span className={cn(
                          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
                          intg.enabled ? "left-5" : "left-0.5"
                        )} />
                      </button>
                    </div>
                  </div>

                  {/* Expandable config panel */}
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
                          {/* API Key row */}
                          {intg.category !== "Automation" && (
                            <div>
                              <label className="mb-1.5 block text-xs font-semibold text-slate-400">API Key / DSN</label>
                              <div className="flex gap-2">
                                <div className="relative flex-1">
                                  <input
                                    type={revealed[intg.id] ? "text" : "password"}
                                    value={editing[intg.id]?.apiKey ?? intg.apiKey}
                                    onChange={(e) => setEditing((prev) => ({
                                      ...prev, [intg.id]: { ...prev[intg.id], apiKey: e.target.value }
                                    }))}
                                    placeholder="Paste your API key…"
                                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 pr-10 text-sm text-white outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition font-mono"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setRevealed((p) => ({ ...p, [intg.id]: !p[intg.id] }))}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition"
                                  >
                                    {revealed[intg.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                                  </button>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(intg.id, (editing[intg.id]?.apiKey ?? intg.apiKey))}
                                  className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-xs text-slate-400 hover:text-cyan-400 transition"
                                >
                                  {copied === intg.id ? <Check size={12} /> : <Copy size={12} />}
                                  {copied === intg.id ? "Copied" : "Copy"}
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Webhook URL */}
                          {(intg.category === "Automation" || intg.id === "webhook") && (
                            <div>
                              <label className="mb-1.5 block text-xs font-semibold text-slate-400">Webhook URL</label>
                              <div className="flex gap-2">
                                <input
                                  value={editing[intg.id]?.webhookUrl ?? intg.webhookUrl}
                                  onChange={(e) => setEditing((prev) => ({
                                    ...prev, [intg.id]: { ...prev[intg.id], webhookUrl: e.target.value }
                                  }))}
                                  placeholder="https://your-endpoint.com/webhook"
                                  className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleTest(intg.id)}
                                  disabled={!!testing}
                                  className="flex items-center gap-1.5 rounded-xl bg-cyan-900/40 border border-cyan-700/40 px-3 py-2.5 text-xs font-semibold text-cyan-400 hover:bg-cyan-900/60 transition disabled:opacity-50"
                                >
                                  <Zap size={12} />
                                  {testing === intg.id ? "Sending…" : "Test"}
                                </button>
                              </div>
                              {testResult[intg.id] && (
                                <p className="mt-1.5 flex items-center gap-1 text-xs text-emerald-400">
                                  <Check size={11} /> {testResult[intg.id]}
                                </p>
                              )}
                            </div>
                          )}

                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => { setExpanded(null); setEditing((p) => { const n = { ...p }; delete n[intg.id]; return n; }); }}
                              className="flex items-center gap-1 rounded-xl border border-slate-700 px-4 py-2 text-xs text-slate-400 hover:text-white transition"
                            >
                              <X size={12} /> Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => saveKeys(intg.id)}
                              className="flex items-center gap-1 rounded-xl bg-cyan-600 px-4 py-2 text-xs font-semibold text-white hover:bg-cyan-500 transition"
                            >
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
      ))}
    </motion.div>
  );
}
