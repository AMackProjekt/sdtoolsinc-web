import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { createSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

const EMPTY_RESPONSE = {
  stats: {
    totalUsers: 0,
    activeStaff: 0,
    activeParticipants: 0,
    activeCourses: 0,
    pendingRegistrations: 0,
    newThisMonth: 0,
  },
  recentRegistrations: [],
  staffActivity: [],
  auditLog: [],
  systemHealth: { uptime: "—", responseTime: "—", activeConnections: 0, errorRate: "—" },
};

function relativeTime(timestamp: string): string {
  if (!timestamp) return "—";
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hr${hours !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days !== 1 ? "s" : ""} ago`;
  return new Date(timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const db = createSupabaseAdmin();

    const [usersRes, staffRes, auditRes] = await Promise.all([
      db
        .from("enterprise_users")
        .select("id, name, email, role, status, created_at", { count: "exact" })
        .order("created_at", { ascending: false }),
      db
        .from("staff")
        .select("id, name, title, status", { count: "exact" }),
      db
        .from("audit_logs")
        .select("id, user_email, action, resource_type, resource_id, timestamp, severity")
        .order("timestamp", { ascending: false })
        .limit(5),
    ]);

    const allUsers = usersRes.data ?? [];
    const allStaff = staffRes.data ?? [];

    const activeStaff = allStaff.filter((s: { status: string }) => s.status === "active").length;
    const activeParticipants = allUsers.filter((u: { role: string }) => u.role === "participant").length;
    const pendingRegistrations = allUsers.filter((u: { status: string }) => u.status === "pending").length;

    const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
    const newThisMonth = allUsers.filter((u: { created_at: string }) => u.created_at >= firstOfMonth).length;

    const stats = {
      totalUsers: usersRes.count ?? allUsers.length,
      activeStaff,
      activeParticipants,
      activeCourses: 0,
      pendingRegistrations,
      newThisMonth,
    };

    const recentRegistrations = allUsers.slice(0, 5).map((u: {
      id: string; name: string; email: string; role: string; status: string; created_at: string;
    }) => ({
      id: u.id,
      name: u.name ?? u.email,
      email: u.email,
      role: u.role ?? "participant",
      date: new Date(u.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      status: u.status ?? "active",
    }));

    const staffActivity = allStaff.slice(0, 5).map((s: {
      id: string; name: string; title: string; status: string;
    }) => ({
      id: s.id,
      name: s.name,
      role: s.title ?? "Staff",
      caseload: 0,
      lastLogin: "—",
      status: s.status === "active" ? "online" : "offline",
    }));

    const auditLog = (auditRes.data ?? []).map((a: {
      id: string; user_email: string; action: string; resource_type: string; resource_id?: string;
      timestamp: string; severity: string;
    }) => ({
      id: a.id,
      user: a.user_email ?? "System",
      action: a.action,
      target: [a.resource_type, a.resource_id].filter(Boolean).join(" · ") || "—",
      time: relativeTime(a.timestamp),
      severity: a.severity ?? "info",
    }));

    return NextResponse.json({ stats, recentRegistrations, staffActivity, auditLog, systemHealth: EMPTY_RESPONSE.systemHealth });
  } catch (err) {
    console.error("[admin/dashboard] Supabase error:", err);
    return NextResponse.json(EMPTY_RESPONSE);
  }
}
