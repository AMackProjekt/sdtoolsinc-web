"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";
import { getProgramById, getCoursesByProgram } from "@/lib/courseData";

export const dynamic = "force-static";

export default function ProgramDetailPage() {
  return (
    <Suspense fallback={null}>
      <ProgramDetailPageContent />
    </Suspense>
  );
}

function ProgramDetailPageContent() {
  const { user, isAuthenticated, updateProfile, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const programId = searchParams.get("id") as string;

  const program = getProgramById(programId);
  const programCourses = program ? getCoursesByProgram(programId) : [];

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/portal/auth");
    }
  }, [isAuthenticated, router]);

  if (!user || !program) {
    return null;
  }

  const enrolledInProgram = programCourses.filter((c) => user.enrolledCourses.includes(c.id));
  const programProgress = Math.round((enrolledInProgram.length / programCourses.length) * 100);

  const enrollCourse = (courseId: string) => {
    if (!user.enrolledCourses.includes(courseId)) {
      updateProfile({
        enrolledCourses: [...user.enrolledCourses, courseId],
      });
    }
  };

  const getCourseTypeLabel = (type: string) => {
    switch (type) {
      case "online":
        return "🌐 Online";
      case "in-class":
        return "🏫 In-Class";
      case "hybrid":
        return "🔄 Hybrid";
      default:
        return type;
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />

      {/* Header */}
      <header className="border-b border-border bg-panel/50 backdrop-blur-xl">
        <div className="mx-auto max-w-container px-7 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="text-brand hover:text-brand2 flex items-center gap-2"
          >
            ← Back
          </button>
          <button
            onClick={logout}
            className="text-sm font-semibold text-muted hover:text-text transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-container px-7 py-8">
        {/* Program Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-start justify-between mb-8">
            <div className="flex-1">
              <div className="text-6xl mb-6">{program.thumbnail}</div>
              <h1 className="text-4xl font-extrabold tracking-tight text-text mb-3">
                {program.name}
              </h1>
              <p className="text-xl text-muted mb-6 max-w-3xl">{program.overview}</p>

              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 rounded-full bg-brand/10 text-brand text-sm font-semibold uppercase">
                  {program.level}
                </span>
                <span className="px-4 py-2 rounded-full bg-teal-500/20 text-teal-400 text-sm font-semibold">
                  ⏱️ {program.duration}
                </span>
                <span className="px-4 py-2 rounded-full bg-purple-500/20 text-purple-400 text-sm font-semibold">
                  📚 {programCourses.length} courses
                </span>
              </div>
            </div>
          </div>

          {/* Progress */}
          {enrolledInProgram.length > 0 && (
            <GlowCard className="p-6 bg-brand/5 border-brand/30 mb-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-text">Your Progress</span>
                <span className="text-sm font-semibold text-brand">{programProgress}%</span>
              </div>
              <div className="h-2 bg-bg rounded-full overflow-hidden border border-border">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${programProgress}%` }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="h-full bg-gradient-to-r from-brand to-brand2"
                />
              </div>
              <p className="text-xs text-muted mt-2">
                {enrolledInProgram.length} of {programCourses.length} courses enrolled
              </p>
            </GlowCard>
          )}
        </motion.div>

        {/* Program Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlowCard className="p-6">
              <h3 className="text-lg font-bold text-text mb-4">About</h3>
              <p className="text-muted text-sm leading-relaxed">{program.description}</p>
            </GlowCard>
          </motion.div>

          {/* Target Audience */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <GlowCard className="p-6">
              <h3 className="text-lg font-bold text-text mb-4">👥 For</h3>
              <p className="text-muted text-sm leading-relaxed">{program.targetAudience}</p>
            </GlowCard>
          </motion.div>

          {/* Duration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlowCard className="p-6">
              <h3 className="text-lg font-bold text-text mb-4">⏱️ Duration</h3>
              <p className="text-muted text-sm mb-3">{program.duration}</p>
              <p className="text-xs text-muted">
                Complete at your own pace or following the recommended schedule.
              </p>
            </GlowCard>
          </motion.div>
        </div>

        {/* Learning Outcomes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-12"
        >
          <GlowCard className="p-8">
            <h2 className="text-2xl font-extrabold text-text mb-6">📈 Learning Outcomes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {program.outcomes.map((outcome, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-brand font-bold flex-shrink-0">✓</span>
                  <span className="text-muted">{outcome}</span>
                </div>
              ))}
            </div>
          </GlowCard>
        </motion.div>

        {/* Courses in Program */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-extrabold text-text mb-6">📚 Program Courses</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programCourses.map((course, index) => {
              const isEnrolled = user.enrolledCourses.includes(course.id);

              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <GlowCard className="p-6 h-full flex flex-col hover:border-brand/50 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-3xl">{course.thumbnail}</div>
                      <span className="text-xs px-2 py-1 rounded-full bg-brand/10 text-brand font-semibold uppercase">
                        {getCourseTypeLabel(course.type).split(" ")[0]}
                      </span>
                    </div>

                    <h3 className="text-lg font-extrabold tracking-tight text-text mb-2 line-clamp-2">
                      {course.title}
                    </h3>

                    <p className="text-sm text-muted leading-relaxed mb-4 flex-1 line-clamp-2">
                      {course.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4 text-xs">
                      <span className="px-2 py-1 rounded-full bg-brand/10 text-brand">
                        {course.level}
                      </span>
                      <span className="px-2 py-1 rounded-full bg-muted/10 text-muted">
                        {course.lessons.length} lessons
                      </span>
                      <span className="px-2 py-1 rounded-full bg-muted/10 text-muted">
                        {course.duration}
                      </span>
                    </div>

                    {course.schedule && (
                      <div className="text-xs text-muted mb-4 p-2 bg-bg rounded">
                        📍 {course.schedule.meetDays.join(", ")} @ {course.schedule.startTime}
                      </div>
                    )}

                    <div className="flex gap-2 mt-auto">
                      <Link
                        href={`/portal/course?id=${course.id}`}
                        className="flex-1 px-4 py-2 rounded-lg font-semibold text-sm bg-brand/20 text-brand border border-brand/30 hover:bg-brand/30 transition-all text-center"
                      >
                        Details
                      </Link>
                      <button
                        onClick={() => enrollCourse(course.id)}
                        className={
                          isEnrolled
                            ? "flex-1 px-4 py-2 rounded-lg font-semibold text-sm bg-brand/10 text-brand border border-brand/20"
                            : "flex-1 px-4 py-2 rounded-lg font-semibold text-sm bg-gradient-to-br from-brand to-brand2 text-[#02131a] hover:shadow-glow transition-all"
                        }
                      >
                        {isEnrolled ? "✓" : "Enroll"}
                      </button>
                    </div>
                  </GlowCard>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
