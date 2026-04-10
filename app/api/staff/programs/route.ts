import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const data = {
    programs: [
      {
        id: "pr1",
        name: "Life Skills",
        description: "Essential daily living skills and self-sufficiency training",
        enrolled: 24,
        capacity: 30,
        completed: 8,
        active: 16,
        startDate: "Jan 6, 2026",
        endDate: "Jun 30, 2026",
        facilitator: "Taylor M.",
        status: "active",
      },
      {
        id: "pr2",
        name: "Job Readiness",
        description: "Resume building, interview preparation, and job placement assistance",
        enrolled: 18,
        capacity: 25,
        completed: 5,
        active: 13,
        startDate: "Feb 1, 2026",
        endDate: "Jul 31, 2026",
        facilitator: "Jordan L.",
        status: "active",
      },
      {
        id: "pr3",
        name: "Mental Wellness",
        description: "Cognitive behavioral therapy, stress management, and coping strategies",
        enrolled: 12,
        capacity: 15,
        completed: 3,
        active: 9,
        startDate: "Jan 15, 2026",
        endDate: "Dec 31, 2026",
        facilitator: "Alex R.",
        status: "active",
      },
      {
        id: "pr4",
        name: "Housing Support",
        description: "Housing placement assistance and tenant rights education",
        enrolled: 9,
        capacity: 20,
        completed: 2,
        active: 7,
        startDate: "Mar 1, 2026",
        endDate: "Aug 31, 2026",
        facilitator: "Taylor M.",
        status: "active",
      },
      {
        id: "pr5",
        name: "Financial Literacy",
        description: "Budgeting, credit repair, and financial planning",
        enrolled: 0,
        capacity: 20,
        completed: 0,
        active: 0,
        startDate: "May 1, 2026",
        endDate: "Sep 30, 2026",
        facilitator: "TBD",
        status: "upcoming",
      },
    ],
  };
  return NextResponse.json(data);
}
