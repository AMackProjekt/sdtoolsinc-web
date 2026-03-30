import { Megaphone } from "lucide-react";
import { getAuthContext } from "@/lib/authz";
import { EnterpriseAccessGuard } from "@/components/EnterpriseAccessGuard";
import NewsroomRealtimeDashboard from "@/components/NewsroomRealtimeDashboard";

export default async function NewsroomPage() {
  const auth = await getAuthContext();

  return (
    <EnterpriseAccessGuard suite="newsroom" userRole={auth.coreRole} enterpriseRoles={auth.enterpriseRoles}>
      <div className="space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-sky-50 via-white to-violet-50 p-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-sky-700">
              <Megaphone className="h-3.5 w-3.5" /> News & Media Live Console
            </div>
            <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900">Real-time newsroom operations and publication KPI flash cards.</h1>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              Approval pipelines, publishing stages, and channel performance are refreshed continuously for dashboard-grade newsroom control.
            </p>
          </div>
        </section>

        <NewsroomRealtimeDashboard />
      </div>
    </EnterpriseAccessGuard>
  );
}