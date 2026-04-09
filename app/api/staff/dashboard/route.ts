import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const data = {
    caseload: [
      { id: "p1", name: "Participant #001", status: "active", program: "Life Skills", lastContact: "Today", risk: "low" },
      { id: "p2", name: "Participant #002", status: "active", program: "Job Readiness", lastContact: "Yesterday", risk: "medium" },
      { id: "p3", name: "Participant #003", status: "on-hold", program: "Mental Wellness", lastContact: "3 days ago", risk: "high" },
      { id: "p4", name: "Participant #004", status: "active", program: "Life Skills", lastContact: "Today", risk: "low" },
      { id: "p5", name: "Participant #005", status: "active", program: "Housing Support", lastContact: "2 days ago", risk: "medium" },
      { id: "p6", name: "Participant #006", status: "active", program: "Job Readiness", lastContact: "Yesterday", risk: "low" },
    ],
    schedule: [
      { id: "sc1", time: "9:00 AM", client: "Participant #001", type: "Check-in Call", duration: "30 min", confirmed: true },
      { id: "sc2", time: "10:30 AM", client: "Participant #003", type: "Crisis Follow-up", duration: "60 min", confirmed: true },
      { id: "sc3", time: "1:00 PM", client: "Participant #002", type: "Goal Review", duration: "45 min", confirmed: false },
      { id: "sc4", time: "3:00 PM", client: "Team Meeting", type: "Staff Sync", duration: "30 min", confirmed: true },
    ],
    recentCheckIns: [
      { id: "c1", client: "Participant #004", note: "Completed Week 4 of Life Skills module. Positive engagement.", time: "1 hour ago", mood: "good" },
      { id: "c2", client: "Participant #005", note: "Housing documentation submitted. Awaiting approval from HUD.", time: "3 hours ago", mood: "neutral" },
      { id: "c3", client: "Participant #006", note: "Resume workshop attended. Updating portfolio this week.", time: "Yesterday", mood: "good" },
      { id: "c4", client: "Participant #003", note: "Missed appointment. Follow-up call needed.", time: "Yesterday", mood: "concern" },
    ],
    programs: [
      { id: "pr1", name: "Life Skills", enrolled: 24, completed: 8, progress: 0.65 },
      { id: "pr2", name: "Job Readiness", enrolled: 18, completed: 5, progress: 0.48 },
      { id: "pr3", name: "Mental Wellness", enrolled: 12, completed: 3, progress: 0.38 },
      { id: "pr4", name: "Housing Support", enrolled: 9, completed: 2, progress: 0.55 },
    ],
    stats: {
      totalCaseload: 18,
      activeThisWeek: 14,
      appointmentsToday: 3,
      pendingFollowUps: 4,
    },
  };

  return NextResponse.json(data);
}
