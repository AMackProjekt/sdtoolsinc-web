"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  DollarSign,
  FileSpreadsheet,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import {
  fetchEnterpriseControlCenter,
  type EnterpriseControlCenterResponse,
} from "@/lib/enterprise-control-client";

export default function EnterpriseFinancePage() {
  const [data, setData] = useState<EnterpriseControlCenterResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function load() {
    setLoading(true);
    setMessage("");
    try {
      setData(await fetchEnterpriseControlCenter());
    } catch {
      setMessage("Failed to load enterprise finance workspace.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  if (loading || !data) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        Loading finance workspace...
      </div>
    );
  }

  const financeConnectors = data.integrations.connectors.filter((c) => c.category === "finance");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Finance Department Workspace</h1>
          <p className="mt-1 text-sm text-slate-500">
            Enterprise-grade finance readiness, accounting connectors, and governance posture.
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

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Finance Connectors</p>
          <p className="mt-2 text-lg font-semibold text-slate-800">{financeConnectors.length}</p>
          <p className="mt-2 text-xs text-slate-500">Configured for accounting and reconciliation pipelines.</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Compliance Posture</p>
          <p className="mt-2 text-lg font-semibold text-slate-800">{data.compliance.overall}</p>
          <p className="mt-2 text-xs text-slate-500">Shared enterprise controls and retention governance.</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Security</p>
          <p className="mt-2 text-lg font-semibold text-slate-800">
            {data.security.data_encrypted && data.security.secure_transport ? "Hardened" : "Needs attention"}
          </p>
          <p className="mt-2 text-xs text-slate-500">Encryption and transport posture for financial workflows.</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
          <DollarSign className="h-4 w-4 text-cyan-600" /> Finance Integrations
        </h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {financeConnectors.map((connector) => (
            <div key={connector.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-sm font-semibold text-slate-800 inline-flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-cyan-600" /> {connector.label}
              </p>
              <p className="mt-2 text-xs text-slate-600">{connector.description}</p>
              <p className="mt-3 text-xs font-medium text-slate-500">Required env</p>
              <p className="mt-1 text-[11px] text-slate-500">{connector.requiredEnv.join(", ")}</p>
              <p className="mt-2 text-xs font-semibold text-slate-700">
                Status: {connector.configured ? "Connected" : "Not configured"}
              </p>
            </div>
          ))}
          {financeConnectors.length === 0 && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
              No finance connectors are registered yet.
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
          <ShieldCheck className="h-4 w-4 text-cyan-600" /> Production Finance Recommendations
        </h2>
        <ul className="mt-4 grid gap-3 text-xs text-slate-600 md:grid-cols-2">
          <li className="rounded-lg bg-slate-50 p-3">Enable dual-control approval for disbursements and write-offs.</li>
          <li className="rounded-lg bg-slate-50 p-3">Set immutable audit export schedule to secure storage and SIEM ingestion.</li>
          <li className="rounded-lg bg-slate-50 p-3">Implement department-level cost-center tagging for all transaction records.</li>
          <li className="rounded-lg bg-slate-50 p-3">Enforce service-account rotation and key expiration for all financial APIs.</li>
        </ul>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 inline-flex items-center gap-2">
        <Building2 className="h-4 w-4" />
        {message || "Enterprise finance workspace is online."}
      </div>
    </div>
  );
}
