import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const data = {
    participants: [
      { id: "p1", name: "Participant #001", program: "Life Skills", status: "active", risk: "low", lastContact: "Today", caseworker: "Taylor M.", enrolled: "Jan 15, 2026" },
      { id: "p2", name: "Participant #002", program: "Job Readiness", status: "active", risk: "medium", lastContact: "Yesterday", caseworker: "Taylor M.", enrolled: "Feb 3, 2026" },
      { id: "p3", name: "Participant #003", program: "Mental Wellness", status: "on-hold", risk: "high", lastContact: "3 days ago", caseworker: "Taylor M.", enrolled: "Dec 10, 2025" },
      { id: "p4", name: "Participant #004", program: "Life Skills", status: "active", risk: "low", lastContact: "Today", caseworker: "Taylor M.", enrolled: "Mar 1, 2026" },
      { id: "p5", name: "Participant #005", program: "Housing Support", status: "active", risk: "medium", lastContact: "2 days ago", caseworker: "Taylor M.", enrolled: "Feb 20, 2026" },
      { id: "p6", name: "Participant #006", program: "Job Readiness", status: "active", risk: "low", lastContact: "Yesterday", caseworker: "Taylor M.", enrolled: "Mar 15, 2026" },
      { id: "p7", name: "Participant #007", program: "Mental Wellness", status: "active", risk: "low", lastContact: "Today", caseworker: "Jordan L.", enrolled: "Jan 28, 2026" },
      { id: "p8", name: "Participant #008", program: "Housing Support", status: "completed", risk: "low", lastContact: "1 week ago", caseworker: "Jordan L.", enrolled: "Nov 5, 2025" },
      { id: "p9", name: "Participant #009", program: "Life Skills", status: "active", risk: "medium", lastContact: "3 days ago", caseworker: "Alex R.", enrolled: "Mar 8, 2026" },
      { id: "p10", name: "Participant #010", program: "Job Readiness", status: "inactive", risk: "high", lastContact: "2 weeks ago", caseworker: "Alex R.", enrolled: "Oct 12, 2025" },
    ],
    stats: {
      total: 10,
      active: 7,
      onHold: 1,
      completed: 1,
      inactive: 1,
    },
  };
  return NextResponse.json(data);
}
