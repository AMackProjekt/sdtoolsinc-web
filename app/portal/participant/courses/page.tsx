"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";

type Course = {
  id: string;
  title: string;
  description: string;
  lessons: number;
  duration: string;
  level: string;
};

export default function ParticipantCoursesPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledIds, setEnrolledIds] = useState<string[]>([]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/portal/participant/auth");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetch("/api/participant/courses")
        .then((r) => r.json())
        .then((data) => setCourses(data.courses ?? []))
        .catch(() => null);
    }
  }, [isAuthenticated]);

  if (isLoading || !isAuthenticated) return null;

  const enrollCourse = (courseId: string) => {
    if (enrolledIds.includes(courseId)) return;
    setEnrolledIds((prev) => [...prev, courseId]);
  };

  return (
    <div className="mx-auto max-w-container px-7 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-extrabold tracking-tight text-text">My Courses</h1>
        <p className="mt-2 text-muted">Enroll in courses to start your learning journey</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course, index) => {
          const isEnrolled = enrolledIds.includes(course.id);
          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlowCard className="p-6 flex flex-col h-full">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-lg font-extrabold tracking-tight text-text">
                    {course.title}
                  </h3>
                  <span className="shrink-0 text-xs px-2 py-1 rounded-full bg-brand/10 text-brand">
                    {course.level}
                  </span>
                </div>

                <p className="text-sm text-muted flex-1">{course.description}</p>

                <div className="mt-4 flex items-center gap-4 text-xs text-muted">
                  <span>📖 {course.lessons} lessons</span>
                  <span>⏱️ {course.duration}</span>
                </div>

                <button
                  onClick={() => enrollCourse(course.id)}
                  disabled={isEnrolled}
                  className={`mt-5 w-full rounded-lg py-2.5 text-sm font-semibold transition-all ${
                    isEnrolled
                      ? "bg-teal-600/20 text-teal-400 cursor-default"
                      : "bg-gradient-to-r from-teal-500 to-brand text-[#02131a] hover:opacity-90 active:opacity-75"
                  }`}
                >
                  {isEnrolled ? "✓ Enrolled" : "Enroll Now"}
                </button>
              </GlowCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
