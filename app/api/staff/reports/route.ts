import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const data = {
    summary: {
      totalParticipants: 63,
      activePrograms: 4,
      sessionsThisMonth: 142,
      successRate: 78,
    },
    monthlyEnrollments: [
      { month: "Oct", enrollments: 8, completions: 3 },
      { month: "Nov", enrollments: 11, completions: 5 },
      { month: "Dec", enrollments: 7, completions: 4 },
      { month: "Jan", enrollments: 14, completions: 6 },
      { month: "Feb", enrollments: 12, completions: 5 },
      { month: "Mar", enrollments: 11, completions: 8 },
    ],
    outcomesByProgram: [
      { name: "Life Skills", successRate: 85, avgDaysToComplete: 92 },
      { name: "Job Readiness", successRate: 72, avgDaysToComplete: 118 },
      { name: "Mental Wellness", successRate: 80, avgDaysToComplete: 145 },
      { name: "Housing Support", successRate: 75, avgDaysToComplete: 76 },
    ],
    riskDistribution: [
      { level: "Low", count: 38 },
      { level: "Medium", count: 17 },
      { level: "High", count: 8 },
    ],
  };
  return NextResponse.json(data);
}
