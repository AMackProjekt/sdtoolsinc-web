import { NextRequest, NextResponse } from "next/server";

// Searchable mock data categorized by role context
const SEARCH_INDEX = [
  // Admin
  { id: "a1", title: "User Management", description: "Manage portal user accounts and roles", href: "/portal/admin/users", category: "Admin", role: "admin" },
  { id: "a2", title: "Platform Settings", description: "System config, security, and audit retention", href: "/portal/admin/settings", category: "Admin", role: "admin" },
  { id: "a3", title: "Admin Dashboard", description: "Overview of platform KPIs and activity", href: "/portal/admin/dashboard", category: "Admin", role: "admin" },
  { id: "a4", title: "Participant Accounts", description: "View and manage all participant profiles", href: "/portal/admin/participants", category: "Admin", role: "admin" },
  { id: "a5", title: "Staff Accounts", description: "Manage staff users and their assignments", href: "/portal/admin/staff", category: "Admin", role: "admin" },

  // Staff
  { id: "s1", title: "My Caseload", description: "View and manage your assigned participants", href: "/portal/staff/caseload", category: "Staff", role: "staff" },
  { id: "s2", title: "Staff Dashboard", description: "Your personal staff overview and activity feed", href: "/portal/staff/dashboard", category: "Staff", role: "staff" },
  { id: "s3", title: "Internal Chat", description: "Message participants and other staff members", href: "/portal/staff/messages", category: "Staff", role: "staff" },
  { id: "s4", title: "Staff Settings", description: "Update profile, notifications, and preferences", href: "/portal/staff/settings", category: "Staff", role: "staff" },
  { id: "s5", title: "Scheduling", description: "Manage appointments and check-in schedules", href: "/portal/staff/scheduling", category: "Staff", role: "staff" },

  // Participant
  { id: "p1", title: "My Dashboard", description: "Your program progress and upcoming goals", href: "/portal/participant/dashboard", category: "Participant", role: "participant" },
  { id: "p2", title: "My Courses", description: "Access and continue your enrolled courses", href: "/portal/participant/courses", category: "Participant", role: "participant" },
  { id: "p3", title: "Participant Settings", description: "Profile, notifications, and appearance", href: "/portal/participant/settings", category: "Participant", role: "participant" },
  { id: "p4", title: "Goals Tracker", description: "View and log progress on your active goals", href: "/portal/participant/goals", category: "Participant", role: "participant" },
  { id: "p5", title: "Resources", description: "Downloadable guides and support materials", href: "/portal/participant/resources", category: "Participant", role: "participant" },

  // Enterprise
  { id: "e1", title: "Enterprise Dashboard", description: "Organization-wide metrics and program health", href: "/portal/enterprise/dashboard", category: "Enterprise", role: "enterprise" },
  { id: "e2", title: "Finance Overview", description: "Budget, invoices, and cost tracking", href: "/portal/enterprise/finance", category: "Enterprise", role: "enterprise" },
  { id: "e3", title: "Voice & Feedback", description: "Leadership feedback and anonymous submissions", href: "/portal/enterprise/voice", category: "Enterprise", role: "enterprise" },
  { id: "e4", title: "Legal Documents", description: "Terms, privacy policy, and compliance docs", href: "/portal/enterprise/legal", category: "Enterprise", role: "enterprise" },
  { id: "e5", title: "Partner Program", description: "Referral partnership details and tracking", href: "/referral", category: "Enterprise", role: "enterprise" },

  // Global
  { id: "g1", title: "Partnerships", description: "View strategic partnership information", href: "/partnerships", category: "General", role: "any" },
  { id: "g2", title: "Interest Form", description: "Submit interest in T.O.O.LS Inc programs", href: "/interest", category: "General", role: "any" },
  { id: "g3", title: "Home", description: "Return to the T.O.O.LS Inc homepage", href: "/", category: "General", role: "any" },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim().toLowerCase();
  const role = (searchParams.get("role") ?? "any").toLowerCase();

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const filtered = SEARCH_INDEX.filter((item) => {
    // Role filter
    if (role !== "any" && item.role !== "any" && item.role !== role) return false;
    // Text match
    return (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  // Group by category
  const groups: Record<string, typeof SEARCH_INDEX> = {};
  for (const item of filtered) {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
  }

  return NextResponse.json({ results: filtered, groups });
}
