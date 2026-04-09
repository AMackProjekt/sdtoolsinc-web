import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const data = {
    stats: {
      totalUsers: 247,
      activeStaff: 12,
      activeParticipants: 189,
      activeCourses: 24,
      pendingRegistrations: 8,
      newThisMonth: 31,
    },
    recentRegistrations: [
      { id: "u1", name: "Maria Chen", email: "m.chen@example.com", role: "participant", date: "Jan 15", status: "active" },
      { id: "u2", name: "James Rivera", email: "j.rivera@example.com", role: "staff", date: "Jan 14", status: "active" },
      { id: "u3", name: "Aaliyah Johnson", email: "a.j@example.com", role: "participant", date: "Jan 14", status: "pending" },
      { id: "u4", name: "Carlos Meza", email: "c.meza@example.com", role: "participant", date: "Jan 13", status: "active" },
      { id: "u5", name: "Tanya Williams", email: "t.w@example.com", role: "participant", date: "Jan 12", status: "active" },
    ],
    staffActivity: [
      { id: "s1", name: "Robin Foster", role: "Case Manager", caseload: 18, lastLogin: "2 hours ago", status: "online" },
      { id: "s2", name: "David Park", role: "Program Coordinator", caseload: 22, lastLogin: "Yesterday", status: "away" },
      { id: "s3", name: "Simone Hayes", role: "Program Manager", caseload: 0, lastLogin: "3 hours ago", status: "online" },
      { id: "s4", name: "Kevin Morris", role: "Case Manager", caseload: 15, lastLogin: "1 day ago", status: "offline" },
      { id: "s5", name: "Latasha Green", role: "Coordinator", caseload: 20, lastLogin: "Today", status: "online" },
    ],
    auditLog: [
      { id: "a1", user: "Robin Foster", action: "Updated participant record", target: "Maria Chen", time: "10 min ago", severity: "info" },
      { id: "a2", user: "System", action: "New user registration", target: "Aaliyah Johnson", time: "3 hrs ago", severity: "info" },
      { id: "a3", user: "David Park", action: "Course marked complete", target: "Carlos Meza", time: "5 hrs ago", severity: "info" },
      { id: "a4", user: "Simone Hayes", action: "New program created", target: "Life Skills Q1", time: "Yesterday", severity: "info" },
      { id: "a5", user: "System", action: "Settings updated", target: "Portal config", time: "2 days ago", severity: "warning" },
    ],
    systemHealth: {
      uptime: "99.97%",
      responseTime: "142ms",
      activeConnections: 38,
      errorRate: "0.03%",
    },
  };

  return NextResponse.json(data);
}
