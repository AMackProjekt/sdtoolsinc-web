"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";
import {
  getCourseById,
  getLessonById,
  getLessonsByCourse,
  getNextLesson,
  getPreviousLesson,
  getCourseProgress,
} from "@/lib/courseData";

export const dynamic = "force-static";
export const dynamicParams = true;

// generateStaticParams for static export
export async function generateStaticParams() {
  // Return empty array for static export since courses/lessons are dynamic
  return [];
}

export default function LessonPage() {
  const { user, isAuthenticated, updateProfile, logout } = useAuth();
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;

  const course = getCourseById(courseId);
  const lesson = getLessonById(lessonId);
  const courseLessons = course ? getLessonsByCourse(courseId) : [];
  const nextLesson = course ? getNextLesson(courseId, lessonId) : null;
  const prevLesson = course ? getPreviousLesson(courseId, lessonId) : null;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/portal/auth");
    }
  }, [isAuthenticated, router]);

  if (!user || !course || !lesson) {
    return null;
  }

  const isEnrolled = user.enrolledCourses.includes(courseId);
  const completedLessons = user.completedLessons || [];
  const isLessonCompleted = completedLessons.includes(lessonId);
  const courseProgress = getCourseProgress(courseId, completedLessons);

  const handleLessonComplete = () => {
    if (!isLessonCompleted) {
      updateProfile({
        completedLessons: [...completedLessons, lessonId],
      });
    }
  };

  const currentLessonIndex = courseLessons.findIndex((l) => l.id === lessonId) + 1;

  return (
    <div className="min-h-screen bg-bg">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />

      {/* Header */}
      <header className="border-b border-border bg-panel/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="mx-auto max-w-container px-7 py-4 flex items-center justify-between">
          <Link href={`/portal/courses/${courseId}`} className="text-brand hover:text-brand2 flex items-center gap-2">
            ← Back to Course
          </Link>
          <button
            onClick={logout}
            className="text-sm font-semibold text-muted hover:text-text transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-container px-7 py-8">
        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-text">
              Lesson {currentLessonIndex} of {courseLessons.length}
            </span>
            <span className="text-sm font-semibold text-brand">{courseProgress}% Complete</span>
          </div>
          <div className="h-2 bg-bg rounded-full overflow-hidden border border-border">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${courseProgress}%` }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="h-full bg-gradient-to-r from-brand to-brand2"
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Video/Content Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <GlowCard className="p-8 bg-gradient-to-br from-bg to-panel/50">
                {lesson.videoUrl ? (
                  <div className="mb-8">
                    <div className="aspect-video bg-bg rounded-lg overflow-hidden border border-border flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl mb-3">🎥</div>
                        <p className="text-muted">Video player: {lesson.videoUrl}</p>
                        <p className="text-xs text-muted/60 mt-2">
                          (In production, this would display actual video)
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video bg-bg rounded-lg overflow-hidden border border-border flex items-center justify-center mb-8">
                    <div className="text-center">
                      <div className="text-4xl mb-3">📄</div>
                      <p className="text-muted">No video available for this lesson</p>
                    </div>
                  </div>
                )}

                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-text mb-2">
                    {lesson.title}
                  </h1>
                  <p className="text-muted mb-6">{lesson.description}</p>

                  <div className="flex items-center gap-4 text-sm text-muted mb-8 pb-8 border-b border-border">
                    <span className="flex items-center gap-2">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {lesson.duration} minutes
                    </span>
                    {isLessonCompleted && (
                      <span className="flex items-center gap-2 text-brand">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Completed
                      </span>
                    )}
                  </div>

                  {/* Lesson Content */}
                  <div className="prose prose-invert max-w-none mb-8">
                    <div className="text-muted leading-relaxed whitespace-pre-wrap">
                      {lesson.content}
                    </div>
                  </div>
                </div>
              </GlowCard>
            </motion.div>

            {/* Resources */}
            {lesson.resources.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
              >
                <GlowCard className="p-8">
                  <h2 className="text-2xl font-extrabold text-text mb-6">📚 Resources</h2>
                  <div className="space-y-3">
                    {lesson.resources.map((resource) => (
                      <a
                        key={resource.id}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 rounded-lg bg-bg border border-border hover:border-brand transition-all group"
                      >
                        <div className="flex-shrink-0 text-2xl">
                          {resource.type === "pdf"
                            ? "📄"
                            : resource.type === "document"
                            ? "📝"
                            : "🔗"}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-text group-hover:text-brand transition-colors">
                            {resource.title}
                          </p>
                          <p className="text-sm text-muted capitalize">{resource.type}</p>
                        </div>
                        <svg className="h-5 w-5 text-muted group-hover:text-brand transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    ))}
                  </div>
                </GlowCard>
              </motion.div>
            )}

            {/* Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex gap-4"
            >
              {prevLesson ? (
                <Link
                  href={`/portal/courses/${courseId}/lessons/${prevLesson.id}`}
                  className="flex-1 px-6 py-3 rounded-lg font-semibold text-sm bg-bg border border-border text-text hover:border-brand transition-all text-center"
                >
                  ← Previous Lesson
                </Link>
              ) : (
                <div className="flex-1" />
              )}

              <button
                onClick={handleLessonComplete}
                className={
                  isLessonCompleted
                    ? "flex-1 px-6 py-3 rounded-lg font-semibold text-sm bg-brand/20 text-brand border border-brand/30"
                    : "flex-1 px-6 py-3 rounded-lg font-semibold text-sm bg-brand/20 text-brand border border-brand/30 hover:bg-brand/30 transition-all"
                }
              >
                {isLessonCompleted ? "✓ Marked Complete" : "Mark as Complete"}
              </button>

              {nextLesson ? (
                <Link
                  href={`/portal/courses/${courseId}/lessons/${nextLesson.id}`}
                  className="flex-1 px-6 py-3 rounded-lg font-semibold text-sm bg-gradient-to-br from-brand to-brand2 text-[#02131a] hover:shadow-glow transition-all text-center"
                >
                  Next Lesson →
                </Link>
              ) : (
                <Link
                  href={`/portal/courses/${courseId}`}
                  className="flex-1 px-6 py-3 rounded-lg font-semibold text-sm bg-gradient-to-br from-brand to-brand2 text-[#02131a] hover:shadow-glow transition-all text-center"
                >
                  Back to Course →
                </Link>
              )}
            </motion.div>
          </div>

          {/* Sidebar - Course Navigation */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="sticky top-20"
            >
              <GlowCard className="p-6">
                <h3 className="text-lg font-bold text-text mb-4">Course Lessons</h3>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {courseLessons.map((l, index) => {
                    const isCompleted = completedLessons.includes(l.id);
                    const isActive = l.id === lessonId;

                    return (
                      <Link
                        key={l.id}
                        href={`/portal/courses/${courseId}/lessons/${l.id}`}
                        className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                          isActive
                            ? "bg-brand/20 border border-brand/50"
                            : "hover:bg-bg border border-transparent"
                        }`}
                      >
                        <div className="flex-shrink-0 mt-1">
                          {isCompleted ? (
                            <div className="w-6 h-6 rounded-full bg-brand/20 text-brand flex items-center justify-center text-xs font-bold">
                              ✓
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-bg border border-border flex items-center justify-center text-xs font-bold text-muted">
                              {index + 1}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold truncate ${isActive ? "text-brand" : "text-text"}`}>
                            {l.title}
                          </p>
                          <p className="text-xs text-muted">{l.duration}m</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                <Link
                  href={`/portal/courses/${courseId}`}
                  className="block w-full mt-4 px-4 py-3 rounded-lg font-semibold text-sm bg-bg border border-border text-text text-center hover:border-brand transition-all"
                >
                  View Course Details
                </Link>
              </GlowCard>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate static params for all lessons
