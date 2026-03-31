import { NextResponse } from "next/server";
import { getAuthContext } from "@/lib/authz";
import { checkEnterprisePolicy } from "@/lib/enterprise-rbac";
import { fetchGoogleWorkspaceMetrics } from "@/lib/integrations/google-workspace";
import { fetchMicrosoftGraphMetrics } from "@/lib/integrations/microsoft-graph";
import { fetchApprovalMetrics } from "@/lib/enterprise-approvals";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await getAuthContext();
  const permission = checkEnterprisePolicy(auth.allRoles, "enterprise-executive", "read");
  if (!permission.allowed) {
    return NextResponse.json({ error: permission.error }, { status: permission.status });
  }

  const [google, graph, approvals] = await Promise.all([
    fetchGoogleWorkspaceMetrics(),
    fetchMicrosoftGraphMetrics(),
    fetchApprovalMetrics(),
  ]);

  const portfolioHealth = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        100 - approvals.overdue * 4 - google.securityAlertsOpen * 2 - Math.max(0, graph.pendingInvites - 8)
      )
    )
  );

  return NextResponse.json({
    kpis: {
      portfolioHealth,
      execActionsOpen: approvals.pendingTotal,
      criticalOpen: approvals.criticalOpen,
      approvalCycleHoursAvg: approvals.approvalCycleHoursAvg,
      workspaceUsers: google.workspaceUsers,
      identityUsers: graph.totalUsers,
    },
    approvals,
    workspace: google,
    identity: graph,
    updatedAt: new Date().toISOString(),
  });
}
