import { Building2 } from "lucide-react";
import { getAuthContext } from "@/lib/authz";
import { EnterpriseAccessGuard } from "@/components/EnterpriseAccessGuard";
import ExecutiveRealtimeDashboard from "@/components/ExecutiveRealtimeDashboard";

export default async function ExecutivePortalPage() {
  const auth = await getAuthContext();

  return (
    <EnterpriseAccessGuard suite="executive" userRole={auth.coreRole} enterpriseRoles={auth.enterpriseRoles}>
      <div className="space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-900 p-8 text-white">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-700/50 bg-cyan-500/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-cyan-300">
              <Building2 className="h-3.5 w-3.5" /> Executive Command Live Console
            </div>
            <h1 className="mt-5 text-3xl font-black tracking-tight">Comprehensive KPI flash cards and real-time executive analytics.</h1>
            <p className="mt-4 text-sm leading-relaxed text-slate-300">
              Live telemetry from Google Workspace Admin, Microsoft Graph, and approval workflows. Dashboards refresh continuously to support board-grade decisioning.
            </p>
          </div>
        </section>

        <ExecutiveRealtimeDashboard />
      </div>
    </EnterpriseAccessGuard>
  );
}