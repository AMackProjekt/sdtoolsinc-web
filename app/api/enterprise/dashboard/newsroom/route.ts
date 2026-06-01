import { NextResponse } from "next/server";
import { getAuthContext } from "@/lib/authz";
import { checkEnterprisePolicy } from "@/lib/enterprise-rbac";
import { fetchApprovalMetrics } from "@/lib/enterprise-approvals";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await getAuthContext();
  const permission = checkEnterprisePolicy(auth.allRoles, "enterprise-newsroom", "read");
  if (!permission.allowed) {
    return NextResponse.json({ error: permission.error }, { status: permission.status });
  }

  const approvals = await fetchApprovalMetrics();

  const publicationPipeline = [
    { stage: "Draft", count: 8 },
    { stage: "Legal Review", count: 5 },
    { stage: "Executive Approval", count: 3 },
    { stage: "Scheduled", count: 6 },
    { stage: "Published", count: 21 },
  ];

  const channelPerformance = [
    { channel: "LinkedIn", reach: 7800, engagement: 6.2 },
    { channel: "Google Workspace", reach: 5200, engagement: 7.5 },
    { channel: "Teams", reach: 4900, engagement: 5.8 },
    { channel: "Press", reach: 11200, engagement: 3.4 },
  ];

  return NextResponse.json({
    kpis: {
      pendingApprovals: approvals.pendingTotal,
      overdueApprovals: approvals.overdue,
      criticalApprovals: approvals.criticalOpen,
      readyToPublish: publicationPipeline.find((s) => s.stage === "Scheduled")?.count ?? 0,
      publishedThisCycle: publicationPipeline.find((s) => s.stage === "Published")?.count ?? 0,
    },
    publicationPipeline,
    channelPerformance,
    approvals,
    updatedAt: new Date().toISOString(),
  });
}
