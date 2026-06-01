export type ApprovalItem = {
  id: string;
  type: "finance" | "policy" | "staffing" | "media";
  status: "pending" | "approved" | "rejected";
  owner: string;
  priority: "low" | "medium" | "high" | "critical";
  createdAt: string;
  dueAt: string;
};

export type ApprovalMetrics = {
  source: "live" | "mock";
  pendingTotal: number;
  approved7d: number;
  rejected7d: number;
  overdue: number;
  criticalOpen: number;
  approvalCycleHoursAvg: number;
  byType: Array<{ type: string; pending: number; approved: number; rejected: number }>;
  trend7d: Array<{ day: string; created: number; closed: number }>;
  updatedAt: string;
};

function makeMockItems(): ApprovalItem[] {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  return [
    { id: "apr-001", type: "finance", status: "pending", owner: "ops@org.com", priority: "critical", createdAt: new Date(now - 2 * dayMs).toISOString(), dueAt: new Date(now + dayMs).toISOString() },
    { id: "apr-002", type: "policy", status: "pending", owner: "compliance@org.com", priority: "high", createdAt: new Date(now - 3 * dayMs).toISOString(), dueAt: new Date(now - 2 * 60 * 60 * 1000).toISOString() },
    { id: "apr-003", type: "staffing", status: "approved", owner: "hr@org.com", priority: "medium", createdAt: new Date(now - 4 * dayMs).toISOString(), dueAt: new Date(now - dayMs).toISOString() },
    { id: "apr-004", type: "media", status: "pending", owner: "newsroom@org.com", priority: "high", createdAt: new Date(now - dayMs).toISOString(), dueAt: new Date(now + 2 * dayMs).toISOString() },
    { id: "apr-005", type: "policy", status: "rejected", owner: "legal@org.com", priority: "low", createdAt: new Date(now - 5 * dayMs).toISOString(), dueAt: new Date(now - 4 * dayMs).toISOString() },
  ];
}

export async function fetchApprovalMetrics(): Promise<ApprovalMetrics> {
  const items = makeMockItems();
  const now = Date.now();

  const pending = items.filter((x) => x.status === "pending");
  const approved7d = items.filter((x) => x.status === "approved").length;
  const rejected7d = items.filter((x) => x.status === "rejected").length;
  const overdue = pending.filter((x) => new Date(x.dueAt).getTime() < now).length;
  const criticalOpen = pending.filter((x) => x.priority === "critical").length;

  const byTypeMap = new Map<string, { pending: number; approved: number; rejected: number }>();
  for (const item of items) {
    const row = byTypeMap.get(item.type) ?? { pending: 0, approved: 0, rejected: 0 };
    if (item.status === "pending") row.pending += 1;
    if (item.status === "approved") row.approved += 1;
    if (item.status === "rejected") row.rejected += 1;
    byTypeMap.set(item.type, row);
  }

  const trend7d = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(now - (6 - i) * 24 * 60 * 60 * 1000);
    return {
      day: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      created: Math.max(1, Math.round(4 + Math.sin(i) * 2)),
      closed: Math.max(1, Math.round(3 + Math.cos(i) * 2)),
    };
  });

  return {
    source: "mock",
    pendingTotal: pending.length,
    approved7d,
    rejected7d,
    overdue,
    criticalOpen,
    approvalCycleHoursAvg: 31,
    byType: Array.from(byTypeMap.entries()).map(([type, values]) => ({ type, ...values })),
    trend7d,
    updatedAt: new Date().toISOString(),
  };
}
