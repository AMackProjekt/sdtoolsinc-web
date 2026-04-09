import { NextResponse } from "next/server";

export const runtime = "nodejs";

const COURSES = [
  {
    id: "job-readiness",
    title: "Job Readiness Fundamentals",
    description:
      "Build essential workplace skills including resume writing, interview preparation, and professional communication.",
    lessons: 12,
    duration: "4 weeks",
    level: "Beginner",
  },
  {
    id: "financial-literacy",
    title: "Financial Literacy",
    description:
      "Learn to manage your finances effectively including budgeting, saving, and understanding credit.",
    lessons: 8,
    duration: "3 weeks",
    level: "Beginner",
  },
  {
    id: "personal-development",
    title: "Personal Development",
    description:
      "Develop self-awareness, set goals, and build the mindset needed for long-term success.",
    lessons: 10,
    duration: "3 weeks",
    level: "All Levels",
  },
  {
    id: "digital-skills",
    title: "Digital Skills",
    description:
      "Master essential computer and internet skills required in today's workplace.",
    lessons: 15,
    duration: "5 weeks",
    level: "Beginner",
  },
];

export async function GET() {
  return NextResponse.json({ courses: COURSES });
}
