import { http, HttpResponse } from "msw";

const DEMO_USER = {
  id: "demo-1",
  name: "Demo Client",
  email: "demo@sdtoolsinc.org",
  role: "admin",
};

export const handlers = [
  http.post("/api/login", async () => {
    return HttpResponse.json({
      user: DEMO_USER,
      token: "mock-jwt-token",
    });
  }),

  http.get("/api/tools", () => {
    return HttpResponse.json([
      { id: 1, name: "Drill X1", status: "Available" },
      { id: 2, name: "Welder Pro", status: "In Use" },
      { id: 3, name: "Safety Kit", status: "Available" },
    ]);
  }),

  http.get("/api/search", ({ request }) => {
    const url = new URL(request.url);
    const q = (url.searchParams.get("q") ?? "").toLowerCase().trim();
    const role = (url.searchParams.get("role") ?? "any").toLowerCase();

    if (q.length < 2) {
      return HttpResponse.json({ results: [], groups: {} });
    }

    const items = [
      { id: "d1", title: "Admin Dashboard", description: "Demo admin overview", href: "/demo/admin/dashboard", category: "Admin", role: "admin" },
      { id: "d2", title: "Staff Dashboard", description: "Demo staff workspace", href: "/demo/staff/dashboard", category: "Staff", role: "staff" },
      { id: "d3", title: "Participant Dashboard", description: "Demo participant workspace", href: "/demo/participant/dashboard", category: "Participant", role: "participant" },
      { id: "d4", title: "Enterprise Workspace", description: "Demo enterprise workspace", href: "/demo/enterprise/dashboard", category: "Enterprise", role: "enterprise" },
      { id: "d5", title: "HR Dashboard", description: "Demo HR workspace", href: "/demo/hr/dashboard", category: "HR", role: "hr" },
      { id: "d6", title: "Finance Dashboard", description: "Demo finance workspace", href: "/demo/finance/dashboard", category: "Finance", role: "finance" },
      { id: "d7", title: "News Dashboard", description: "Demo newsroom workspace", href: "/demo/news/dashboard", category: "News", role: "news" },
    ].filter((item) => role === "any" || item.role === role || item.role === "admin");

    const filtered = items.filter((item) =>
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );

    const groups: Record<string, typeof filtered> = {};
    for (const item of filtered) {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    }

    return HttpResponse.json({ results: filtered, groups });
  }),

  http.get("/api/admin/dashboard", () => {
    return HttpResponse.json({
      stats: {
        totalUsers: 312,
        activeStaff: 18,
        activeParticipants: 274,
        activeCourses: 14,
        pendingRegistrations: 9,
        newThisMonth: 37,
      },
      recentRegistrations: [
        { id: "1", name: "Tanya Brooks", email: "tanya.b@example.com", role: "participant", date: "Today", status: "active" },
      ],
      staffActivity: [
        { id: "1", name: "Maria Chen", role: "Case Manager", caseload: 12, lastLogin: "2h ago", status: "online" },
      ],
      auditLog: [
        { id: "1", user: "admin@sdtoolsinc.org", action: "Updated user role", target: "demo target", time: "5m ago", severity: "info" },
      ],
      systemHealth: { uptime: "99.97%", responseTime: "142ms", activeConnections: 38, errorRate: "0.02%" },
      participantStats: {
        enrolled: 274,
        matched: 189,
        exited: 43,
        referralsPending: 17,
        referralAgencies: 8,
        writeUps: 5,
        milestones: 62,
        appeals: 3,
      },
    });
  }),
];
