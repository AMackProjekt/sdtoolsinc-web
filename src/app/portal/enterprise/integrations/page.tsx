"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Cloud,
  FileText,
  RefreshCw,
  SendHorizonal,
  ShieldCheck,
  Workflow,
  XCircle,
} from "lucide-react";
import { fetchEnterpriseControlCenter, type EnterpriseControlCenterResponse } from "@/lib/enterprise-control-client";

export default function EnterpriseIntegrationsPage() {
  const [data, setData] = useState<EnterpriseControlCenterResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  async function load() {
    setLoading(true);
    setMessage("");
    try {
      const payload = await fetchEnterpriseControlCenter();
      setData(payload);
      setEmail(payload.settings.admin_email);
    } catch {
      setMessage("Failed to load integrations.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function sendTestEmail() {
    setSending(true);
    setMessage("");
    try {
      const res = await fetch("/api/enterprise/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, subject: "Enterprise Workspace Test Email" }),
      });
      if (!res.ok) throw new Error();
      setMessage("Test email sent.");
    } catch {
      setMessage("Failed to send test email.");
    } finally {
      setSending(false);
    }
  }

  if (loading || !data) {
    return <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Loading integrations...</div>;
  }

  const featuredItems = [
    {
      id: "google-workspace",
      label: "Google Workspace",
      ok: data.integrations.googleWorkspace,
      icon: Cloud,
      detail: "Directory, security posture, and operational telemetry from Google Workspace.",
    },
    {
      id: "microsoft-365",
      label: "Microsoft 365",
      ok: data.integrations.microsoft365,
      icon: ShieldCheck,
      detail: "Tenant identity, licensing, and workforce insights via Microsoft Graph.",
    },
    {
      id: "adobe-acrobat",
      label: "Adobe Acrobat",
      ok: data.integrations.adobeAcrobat,
      icon: FileText,
      detail: "PDF automation, document conversions, and enterprise document workflows.",
    },
  ];

  const pluginItems = data.integrations.connectors.filter(
    (connector) => !featuredItems.some((featured) => featured.id === connector.id)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Integrations and Connectors</h1>
          <p className="mt-1 text-sm text-slate-500">Connector health, outbound delivery, and workspace service dependencies.</p>
        </div>
        <button type="button" onClick={() => void load()} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {featuredItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800"><Icon className="h-4 w-4 text-cyan-600" /> {item.label}</div>
                {item.ok ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <XCircle className="h-4 w-4 text-rose-600" />}
              </div>
              <p className="mt-3 text-xs text-slate-500">{item.detail}</p>
              <p className={`mt-3 text-xs font-semibold ${item.ok ? "text-emerald-700" : "text-rose-700"}`}>{item.ok ? "Connected" : "Attention needed"}</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-700">Additional Plug-ins</h2>
            <p className="mt-1 text-xs text-slate-500">Ready-to-configure enterprise connectors with environment-based activation logic.</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">
            <Workflow className="h-3.5 w-3.5" /> {pluginItems.length} Available
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {pluginItems.map((plugin) => (
            <div key={plugin.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-slate-800">{plugin.label}</p>
                {plugin.configured ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                    <CheckCircle2 className="h-3 w-3" /> Connected
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                    <XCircle className="h-3 w-3" /> Not Configured
                  </span>
                )}
              </div>
              <p className="mt-2 text-xs text-slate-600">{plugin.description}</p>
              <p className="mt-3 text-[11px] font-medium text-slate-500">Required env:</p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{plugin.requiredEnv.join(", ")}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-700">Outbound Email Validation</h2>
          <p className="text-xs text-slate-500">Send a live test through the configured email provider using enterprise admin privileges.</p>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@sdtoolsinc.org" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          <button type="button" onClick={() => void sendTestEmail()} disabled={sending || !data.platformOperations.canTestEmail} className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-3 py-2 text-sm text-white hover:bg-cyan-700 disabled:opacity-60">
            <SendHorizonal className="h-4 w-4" /> {sending ? "Sending..." : "Send Test Email"}
          </button>
          {!data.platformOperations.canTestEmail && <p className="text-xs text-amber-700">Email provider credentials are not configured in the current environment.</p>}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-700">Connector Notes</h2>
          <ul className="space-y-3 text-xs text-slate-600">
            <li className="rounded-lg bg-slate-50 p-3">Google Workspace and Microsoft 365 can run side-by-side for identity telemetry and executive dashboard coverage.</li>
            <li className="rounded-lg bg-slate-50 p-3">Adobe Acrobat enables document automation across consent packets, intake bundles, and compliance-ready PDF workflows.</li>
            <li className="rounded-lg bg-slate-50 p-3">Additional plug-ins activate automatically when required environment variables are present.</li>
          </ul>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">{message || "Enterprise connectors are online."}</div>
    </div>
  );
}
