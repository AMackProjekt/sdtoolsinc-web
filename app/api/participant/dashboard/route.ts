import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const data = {
    kpis: {
      wellnessScore: 72,
      physicalProgress: 65,
      goalsCompleted: 3,
      totalGoals: 5,
      supportContacts: 4,
    },
    learningProgress: [
      { name: "Life Skills 101", pct: 80 },
      { name: "Job Readiness", pct: 55 },
      { name: "Financial Foundations", pct: 30 },
    ],
    quickStats: {
      coursesEnrolled: 3,
      lessonsDone: 17,
      certificates: 1,
      streakDays: 5,
    },
    activityFeed: [
      { id: 1, type: "course", message: "Completed Lesson 8 in Life Skills 101", time: "2 hours ago" },
      { id: 2, type: "goal", message: "Goal marked complete: Resume updated", time: "Yesterday" },
      { id: 3, type: "message", message: "New message from Case Manager Maria C.", time: "2 days ago" },
    ],
  };

  return NextResponse.json(data);
}
