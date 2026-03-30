import { Briefcase } from "lucide-react";
import { getAuthContext } from "@/lib/authz";
import { EnterpriseAccessGuard } from "@/components/EnterpriseAccessGuard";
import HRRealtimeDashboard from "@/components/HRRealtimeDashboard";

export default async function HROperationsPage() {
  const auth = await getAuthContext();

  return (
    <EnterpriseAccessGuard suite="hr" userRole={auth.coreRole} enterpriseRoles={auth.enterpriseRoles}>
      <div className="space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-amber-50 via-white to-rose-50 p-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-amber-700">
              <Briefcase className="h-3.5 w-3.5" /> HR Operations Live Console
            </div>
            <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900">Comprehensive real-time staffing and compliance KPI flash cards.</h1>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              Workforce and onboarding analytics now stream from Microsoft Graph identity telemetry and internal approvals.
            </p>
          </div>
        </section>

        <HRRealtimeDashboard />
      </div>
    </EnterpriseAccessGuard>
  );
}