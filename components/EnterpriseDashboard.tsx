"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Building2,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  Users,
  XCircle,
} from "lucide-react";
import {
  fetchEnterpriseControlCenter,
  type EnterpriseControlCenterResponse,
} from "@/lib/enterprise-control-client";

function statusTone(ok: boolean) {
  return ok ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700";
}

export default function EnterpriseDashboard() {
  const [data, setData] = useState<EnterpriseControlCenterResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function load() {
    setLoading(true);
    setMessage("");
    try {
      setData(await fetchEnterpriseControlCenter());
    } catch {
      setMessage("Failed to load enterprise dashboard.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const integrationSummary = useMemo(() => {
    if (!data) return { connected: 0, total: 0 };
    const connectorItems = data.integrations.connectors;
    return {
      connected: connectorItems.filter((c) => c.configured).length,
      total: connectorItems.length,
    };
  }, [data]);

  if (loading || !data) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        Loading enterprise dashboard...
      </div>
    );
  }

  const complianceApproved = data.compliance.overall === "approved";
  const identityReady = data.identityAccess.workspaceDomainConfigured && data.identityAccess.hasTwoFactorSecret;
  const operationsReady =
    data.platformOperations.canReseedStaff &&
    data.platformOperations.canReseedCaseload &&
    data.platformOperations.canExportCaseload;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Enterprise Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Real-time enterprise posture across compliance, identity, integrations, and operations.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
        >
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Compliance</p>
          <p className="mt-2 text-lg font-semibold text-slate-800">{data.compliance.overall}</p>
          <span className={`mt-3 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${statusTone(complianceApproved)}`}>
            {complianceApproved ? "Approved" : "Action Required"}
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Identity & Access</p>
          <p className="mt-2 text-lg font-semibold text-slate-800">{identityReady ? "Ready" : "Needs Setup"}</p>
          <p className="mt-2 text-xs text-slate-500">
            Domain: {data.identityAccess.workspaceDomain} · 2FA secret {data.identityAccess.hasTwoFactorSecret ? "set" : "missing"}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Connector Coverage</p>
          <p className="mt-2 text-lg font-semibold text-slate-800">
            {integrationSummary.connected}/{integrationSummary.total}
          </p>
          <p className="mt-2 text-xs text-slate-500">Configured enterprise integrations and plug-ins.</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Platform Operations</p>
          <p className="mt-2 text-lg font-semibold text-slate-800">{operationsReady ? "Ready" : "Partial"}</p>
          <p className="mt-2 text-xs text-slate-500">Reseed and export actions are {operationsReady ? "available" : "limited"}.</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
            <ShieldCheck className="h-4 w-4 text-cyan-600" /> Compliance Checks
          </h2>
          <div className="mt-4 space-y-2">
            {Object.entries(data.compliance.checks).map(([key, ok]) => (
              <div key={key} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                <span className="text-xs text-slate-600">{key}</span>
                {ok ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <XCircle className="h-4 w-4 text-rose-600" />}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Users className="h-4 w-4 text-cyan-600" /> Access Snapshot
          </h2>
          <div className="mt-4 grid gap-2">
            <div className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">Admin allowlist: {data.identityAccess.adminAllowlistCount}</div>
            <div className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">Staff allowlist: {data.identityAccess.staffAllowlistCount}</div>
            <div className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">Client allowlist: {data.identityAccess.clientAllowlistCount}</div>
            <div className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">Session timeout: {data.identityAccess.sessionTimeoutHours}h</div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Building2 className="h-4 w-4 text-cyan-600" /> Enterprise System Health
          </h2>
          <div className="mt-4 grid gap-2">
            <div className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600 inline-flex items-center justify-between">
              <span>Data encrypted</span>
              {data.security.data_encrypted ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <XCircle className="h-4 w-4 text-rose-600" />}
            </div>
            <div className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600 inline-flex items-center justify-between">
              <span>Auth configured</span>
              {data.security.auth_configured ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <XCircle className="h-4 w-4 text-rose-600" />}
            </div>
            <div className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600 inline-flex items-center justify-between">
              <span>Secure transport</span>
              {data.security.secure_transport ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <XCircle className="h-4 w-4 text-rose-600" />}
            </div>
            <div className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">Environment: {data.environment.nodeEnv}</div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 inline-flex items-center gap-2">
        <Activity className="h-4 w-4" />
        {message || "Enterprise dashboard is online."}
      </div>
    </div>
  );
}
