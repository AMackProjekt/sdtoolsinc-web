"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";
import { getCourseById, getProgramById, getLessonsByCourse } from "@/lib/courseData";
import { getCourseContent, Lesson } from "@/lib/courseContent";
import { cn } from "@/lib/cn";

export const dynamic = "force-static";
export const dynamicParams = true;

export default function CourseDetailPage() {
  const { user, isAuthenticated, updateProfile, logout } = useAuth();
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;

  const course = getCourseById(courseId);
  const program = course ? getProgramById(course.programId) : null;
  const lessons = course ? getLessonsByCourse(courseId) : [];
  const materials = getCourseContent(courseId);

  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/portal/auth");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (materials?.lessons?.length && !selectedLessonId) {
      setSelectedLessonId(materials.lessons[0]?.id || null);
    }
  }, [materials, selectedLessonId]);

  if (!user || !course || !program) {
    return null;
  }

  const isEnrolled = user.enrolledCourses.includes(courseId);

  const enrollCourse = () => {
    if (!isEnrolled) {
      updateProfile({
        enrolledCourses: [...user.enrolledCourses, courseId],
      });
    }
  };

  const getCourseTypeLabel = () => {
    switch (course.type) {
      case "online":
        return "🌐 Online Self-Paced";
      case "in-class":
        return "🏫 In-Class";
      case "hybrid":
        return "🔄 Hybrid (Online + In-Class)";
    }
  };

  const selectedLesson = useMemo<Lesson | null>(() => {
    if (!materials?.lessons?.length) return null;
    if (!selectedLessonId) return materials.lessons[0] || null;
    return materials.lessons.find((lesson) => lesson.id === selectedLessonId) || null;
  }, [materials, selectedLessonId]);

  const completionPercentage = materials?.lessons?.length
    ? Math.round((completedLessonIds.length / materials.lessons.length) * 100)
    : 0;

  const handleLessonComplete = () => {
    if (selectedLesson && !completedLessonIds.includes(selectedLesson.id)) {
      setCompletedLessonIds([...completedLessonIds, selectedLesson.id]);
    }
  };

  const renderLessonContent = (content: string) => {
    return content
      .replace(/^# (.*)$/gm, "<h1>$1</h1>")
      .replace(/^## (.*)$/gm, "<h2>$1</h2>")
      .replace(/^### (.*)$/gm, "<h3>$1</h3>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n\n/g, "</p><p>")
      .replace(/^- (.*)$/gm, "<li>$1</li>")
      .replace(/<li>([^<]+)<\/li>/g, "<ul><li>$1</li></ul>")
      .replace(/\n/g, "<br />")
      .replace(/^/, "<p>")
      .replace(/$/, "</p>");
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
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-sm text-muted mb-8"
        >
          <Link href="/portal/courses" className="hover:text-brand">
            Courses
          </Link>
          <span>/</span>
          <Link href={`/portal/programs/${program.id}`} className="hover:text-brand">
            {program.name}
          </Link>
          <span>/</span>
          <span className="text-text">{course.title}</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Hero */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="text-6xl mb-4">{course.thumbnail}</div>
                  <h1 className="text-4xl font-extrabold tracking-tight text-text mb-3">
                    {course.title}
                  </h1>
                  <p className="text-lg text-muted">{course.description}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-3 py-1 rounded-full bg-brand/10 text-brand text-sm font-semibold uppercase">
                  {course.level}
                </span>
                <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-400 text-sm font-semibold">
                  {getCourseTypeLabel()}
                </span>
                <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm font-semibold">
                  {course.duration}
                </span>
                {course.credits && (
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm font-semibold">
                    {course.credits} Credits
                  </span>
                )}
              </div>
            </motion.div>

            {/* Course Outline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <GlowCard className="p-8">
                <h2 className="text-2xl font-extrabold text-text mb-6">Course Overview</h2>

                <div className="mb-8">
                  <h3 className="text-lg font-bold text-text mb-3">About This Course</h3>
                  <p className="text-muted leading-relaxed">{course.outline.overview}</p>
                </div>

                {course.outline.objectives.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-text mb-3">Learning Objectives</h3>
                    <ul className="space-y-2">
                      {course.outline.objectives.map((obj, i) => (
                        <li key={i} className="flex gap-3 text-muted">
                          <span className="text-brand font-bold">✓</span>
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {course.outline.topics.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-text mb-3">Topics Covered</h3>
                    <div className="flex flex-wrap gap-2">
                      {course.outline.topics.map((topic, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full bg-brand/10 text-brand text-sm"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {course.outline.requirements && course.outline.requirements.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-text mb-3">Requirements</h3>
                    <ul className="space-y-2">
                      {course.outline.requirements.map((req, i) => (
                        <li key={i} className="flex gap-3 text-muted">
                          <span className="text-yellow-400">○</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {course.prerequisites && course.prerequisites.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-text mb-3">Prerequisites</h3>
                    <ul className="space-y-2">
                      {course.prerequisites.map((prereq) => {
                        const prereqCourse = getCourseById(prereq);
                        return (
                          <li key={prereq} className="text-muted">
                            {prereqCourse ? (
                              <Link href={`/portal/courses/${prereq}`} className="text-brand hover:text-brand2">
                                {prereqCourse.title}
                              </Link>
                            ) : (
                              prereq
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </GlowCard>
            </motion.div>

            {/* Schedule for In-Class/Hybrid */}
            {course.schedule && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <GlowCard className="p-8 border-teal-500/30">
                  <h2 className="text-2xl font-extrabold text-text mb-6">📍 Schedule & Location</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-muted mb-1">Start Date</p>
                      <p className="text-lg font-semibold text-text">
                        {course.schedule.startDate
                          ? new Date(course.schedule.startDate).toLocaleDateString()
                          : "To Be Announced"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted mb-1">End Date</p>
                      <p className="text-lg font-semibold text-text">
                        {course.schedule.endDate
                          ? new Date(course.schedule.endDate).toLocaleDateString()
                          : "To Be Announced"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted mb-1">Meeting Days</p>
                      <p className="text-lg font-semibold text-text">
                        {course.schedule.meetDays.join(", ")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted mb-1">Time</p>
                      <p className="text-lg font-semibold text-text">
                        {course.schedule.startTime} - {course.schedule.endTime}
                      </p>
                    </div>
                    {course.schedule.location && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-muted mb-1">Location</p>
                        <p className="text-lg font-semibold text-text">{course.schedule.location}</p>
                      </div>
                    )}
                    {course.schedule.instructor && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-muted mb-1">Instructor</p>
                        <p className="text-lg font-semibold text-text">{course.schedule.instructor}</p>
                      </div>
                    )}
                    {course.schedule.currentEnrollment !== undefined && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-muted mb-1">Enrollment</p>
                        <p className="text-lg font-semibold text-text">
                          {course.schedule.currentEnrollment}/{course.schedule.maxCapacity || "Unlimited"} enrolled
                        </p>
                      </div>
                    )}
                  </div>
                </GlowCard>
              </motion.div>
            )}

            {/* Course Materials (Activated) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <GlowCard className="p-8">
                <h2 className="text-2xl font-extrabold text-text mb-6">
                  Course Materials {materials?.lessons?.length ? `(${materials.lessons.length} lessons)` : ""}
                </h2>

                {!isEnrolled && (
                  <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400">
                    Enroll to unlock lesson materials and begin learning.
                  </div>
                )}

                {isEnrolled && materials?.lessons?.length ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-muted">Progress</span>
                          <span className="text-xs font-bold text-brand">{completionPercentage}%</span>
                        </div>
                        <div className="w-full h-2 bg-bg rounded-full overflow-hidden border border-border">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${completionPercentage}%` }}
                            className="h-full bg-gradient-to-r from-brand to-brand2"
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>

                      {materials.lessons.map((lesson, index) => {
                        const isCompleted = completedLessonIds.includes(lesson.id);
                        const isSelected = selectedLesson?.id === lesson.id;

                        return (
                          <button
                            key={lesson.id}
                            onClick={() => setSelectedLessonId(lesson.id)}
                            className={cn(
                              "w-full p-4 rounded-lg text-left transition-all",
                              isSelected
                                ? "bg-brand/20 border border-brand"
                                : "border border-border hover:border-brand/50",
                              isCompleted ? "opacity-70" : ""
                            )}
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand/20 text-brand flex items-center justify-center text-sm font-semibold">
                                {isCompleted ? "✓" : index + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-text line-clamp-2">{lesson.title}</p>
                                <p className="text-xs text-muted mt-1">{lesson.duration} · {lesson.type}</p>
                              </div>
                            </div>
                          </button>
                        );
                      })}

                      {completionPercentage === 100 && (
                        <motion.button
                          onClick={() => router.push(`/portal/courses/${courseId}/quiz`)}
                          whileHover={{ y: -2 }}
                          className="w-full px-4 py-3 rounded-lg font-semibold text-sm bg-gradient-to-r from-brand to-brand2 text-[#02131a] hover:shadow-glow transition-all"
                        >
                          📝 Take Quiz
                        </motion.button>
                      )}
                    </div>

                    <div className="lg:col-span-2">
                      {selectedLesson ? (
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-2xl font-bold text-text mb-2">{selectedLesson.title}</h3>
                            <p className="text-muted">{selectedLesson.description}</p>
                          </div>

                          <div className="flex gap-3">
                            <span className={cn(
                              "px-3 py-1 rounded-lg text-xs font-semibold",
                              selectedLesson.type === "video" && "bg-blue-500/20 text-blue-400",
                              selectedLesson.type === "reading" && "bg-purple-500/20 text-purple-400",
                              selectedLesson.type === "interactive" && "bg-green-500/20 text-green-400",
                              selectedLesson.type === "exercise" && "bg-orange-500/20 text-orange-400"
                            )}>
                              {selectedLesson.type.toUpperCase()}
                            </span>
                            <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-panel border border-border text-muted">
                              ⏱️ {selectedLesson.duration}
                            </span>
                          </div>

                          <GlowCard className="p-6">
                            <div
                              className="text-text space-y-4 prose prose-invert max-w-none prose-headings:text-text prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-p:text-muted prose-li:text-muted prose-strong:text-brand"
                              dangerouslySetInnerHTML={{ __html: renderLessonContent(selectedLesson.content) }}
                            />
                          </GlowCard>

                          <div className="flex items-center justify-between">
                            <button
                              className="px-4 py-2 rounded-lg text-sm border border-brand text-brand hover:bg-brand/10 transition-all"
                              onClick={() => {
                                const currentIndex = materials.lessons.findIndex((lesson) => lesson.id === selectedLesson.id);
                                const previous = materials.lessons[currentIndex - 1];
                                if (previous) setSelectedLessonId(previous.id);
                              }}
                              disabled={materials.lessons[0]?.id === selectedLesson.id}
                            >
                              ← Previous Lesson
                            </button>

                            {!completedLessonIds.includes(selectedLesson.id) ? (
                              <motion.button
                                onClick={handleLessonComplete}
                                whileHover={{ y: -2 }}
                                className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-brand to-brand2 text-[#02131a] hover:shadow-glow transition-all"
                              >
                                ✓ Mark as Complete
                              </motion.button>
                            ) : (
                              <div className="px-4 py-2 rounded-lg text-sm font-semibold bg-green-500/20 text-green-400 border border-green-500/50">
                                ✓ Completed
                              </div>
                            )}

                            <button
                              className="px-4 py-2 rounded-lg text-sm border border-brand text-brand hover:bg-brand/10 transition-all"
                              onClick={() => {
                                const currentIndex = materials.lessons.findIndex((lesson) => lesson.id === selectedLesson.id);
                                const next = materials.lessons[currentIndex + 1];
                                if (next) setSelectedLessonId(next.id);
                              }}
                              disabled={materials.lessons[materials.lessons.length - 1]?.id === selectedLesson.id}
                            >
                              Next Lesson →
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-muted">Select a lesson to begin.</div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-lg bg-bg border border-border text-muted">
                    Lesson materials are being prepared for this course.
                  </div>
                )}
              </GlowCard>
            </motion.div>

            {/* Lessons (legacy list) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <GlowCard className="p-8">
                <h2 className="text-2xl font-extrabold text-text mb-6">
                  Course Content ({lessons.length} lessons)
                </h2>

                <div className="space-y-3">
                  {lessons.map((lesson, index) => (
                    <Link
                      key={lesson.id}
                      href={isEnrolled ? `/portal/courses/${courseId}/lessons/${lesson.id}` : "#"}
                      onClick={(e) => !isEnrolled && e.preventDefault()}
                      className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                        isEnrolled
                          ? "bg-bg hover:bg-bg/80 border border-border hover:border-brand cursor-pointer"
                          : "bg-bg/50 border border-border opacity-60 cursor-not-allowed"
                      }`}
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand/20 text-brand flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-text">{lesson.title}</p>
                        <p className="text-sm text-muted truncate">{lesson.description}</p>
                      </div>
                      <div className="flex-shrink-0 flex items-center gap-2 text-sm text-muted">
                        <span>⏱️ {lesson.duration}m</span>
                        {isEnrolled && <span className="text-brand">→</span>}
                      </div>
                    </Link>
                  ))}
                </div>
              </GlowCard>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Enrollment Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="sticky top-6"
            >
              <GlowCard className="p-6 border-brand/50">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-text mb-4">Course Details</h3>

                  <div className="space-y-4 text-sm">
                    <div>
                      <p className="text-muted mb-1">Lessons</p>
                      <p className="text-lg font-semibold text-text">{lessons.length}</p>
                    </div>
                    <div>
                      <p className="text-muted mb-1">Duration</p>
                      <p className="text-lg font-semibold text-text">{course.duration}</p>
                    </div>
                    <div>
                      <p className="text-muted mb-1">Level</p>
                      <p className="text-lg font-semibold text-text">{course.level}</p>
                    </div>
                    <div>
                      <p className="text-muted mb-1">Format</p>
                      <p className="text-lg font-semibold text-text">{getCourseTypeLabel()}</p>
                    </div>
                    {course.instructors && course.instructors.length > 0 && (
                      <div>
                        <p className="text-muted mb-1">Instructors</p>
                        <p className="text-sm font-semibold text-text">
                          {course.instructors.join(", ")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={enrollCourse}
                  className={
                    isEnrolled
                      ? "w-full px-4 py-3 rounded-lg font-semibold text-sm bg-brand/20 text-brand border border-brand/30"
                      : "w-full px-4 py-3 rounded-lg font-semibold text-sm bg-gradient-to-br from-brand to-brand2 text-[#02131a] hover:shadow-glow transition-all"
                  }
                >
                  {isEnrolled ? "✓ Enrolled" : "Enroll Now"}
                </button>

                {isEnrolled && lessons.length > 0 && (
                  <Link
                    href={`/portal/courses/${courseId}/lessons/${lessons[0].id}`}
                    className="block w-full mt-3 px-4 py-3 rounded-lg font-semibold text-sm bg-bg border border-border text-text text-center hover:border-brand transition-all"
                  >
                    Start Learning →
                  </Link>
                )}
              </GlowCard>

              {/* Program Card */}
              <GlowCard className="p-6 mt-6">
                <h3 className="text-lg font-bold text-text mb-4">Part of Program</h3>
                <div className="flex items-start gap-3 mb-4">
                  <div className="text-3xl">{program.thumbnail}</div>
                  <div>
                    <Link href={`/portal/programs/${program.id}`} className="font-semibold text-brand hover:text-brand2">
                      {program.name}
                    </Link>
                    <p className="text-sm text-muted mt-1">{program.duration}</p>
                  </div>
                </div>
                <Link
                  href={`/portal/programs/${program.id}`}
                  className="text-sm text-brand hover:text-brand2 font-semibold"
                >
                  View Full Program →
                </Link>
              </GlowCard>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";
import { getCourseById, getProgramById, getLessonsByCourse } from "@/lib/courseData";

export default function CourseDetailPage() {
  const { user, isAuthenticated, updateProfile, logout } = useAuth();
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;

  const course = getCourseById(courseId);
  const program = course ? getProgramById(course.programId) : null;
  const lessons = course ? getLessonsByCourse(courseId) : [];

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/portal/auth");
    }
  }, [isAuthenticated, router]);

  if (!user || !course || !program) {
    return null;
  }

  const isEnrolled = user.enrolledCourses.includes(courseId);

  const enrollCourse = () => {
    if (!isEnrolled) {
      updateProfile({
        enrolledCourses: [...user.enrolledCourses, courseId],
      });
    }
  };

  const getCourseTypeLabel = () => {
    switch (course.type) {
      case "online":
        return "🌐 Online Self-Paced";
      case "in-class":
        return "🏫 In-Class";
      case "hybrid":
        return "🔄 Hybrid (Online + In-Class)";
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
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-sm text-muted mb-8"
        >
          <Link href="/portal/courses" className="hover:text-brand">
            Courses
          </Link>
          <span>/</span>
          <Link href={`/portal/programs/${program.id}`} className="hover:text-brand">
            {program.name}
          </Link>
          <span>/</span>
          <span className="text-text">{course.title}</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Hero */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="text-6xl mb-4">{course.thumbnail}</div>
                  <h1 className="text-4xl font-extrabold tracking-tight text-text mb-3">
                    {course.title}
                  </h1>
                  <p className="text-lg text-muted">{course.description}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-3 py-1 rounded-full bg-brand/10 text-brand text-sm font-semibold uppercase">
                  {course.level}
                </span>
                <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-400 text-sm font-semibold">
                  {getCourseTypeLabel()}
                </span>
                <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm font-semibold">
                  {course.duration}
                </span>
                {course.credits && (
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm font-semibold">
                    {course.credits} Credits
                  </span>
                )}
              </div>
            </motion.div>

            {/* Course Outline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <GlowCard className="p-8">
                <h2 className="text-2xl font-extrabold text-text mb-6">Course Overview</h2>

                <div className="mb-8">
                  <h3 className="text-lg font-bold text-text mb-3">About This Course</h3>
                  <p className="text-muted leading-relaxed">{course.outline.overview}</p>
                </div>

                {course.outline.objectives.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-text mb-3">Learning Objectives</h3>
                    <ul className="space-y-2">
                      {course.outline.objectives.map((obj, i) => (
                        <li key={i} className="flex gap-3 text-muted">
                          <span className="text-brand font-bold">✓</span>
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {course.outline.topics.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-text mb-3">Topics Covered</h3>
                    <div className="flex flex-wrap gap-2">
                      {course.outline.topics.map((topic, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full bg-brand/10 text-brand text-sm"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {course.outline.requirements && course.outline.requirements.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-text mb-3">Requirements</h3>
                    <ul className="space-y-2">
                      {course.outline.requirements.map((req, i) => (
                        <li key={i} className="flex gap-3 text-muted">
                          <span className="text-yellow-400">○</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {course.prerequisites && course.prerequisites.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-text mb-3">Prerequisites</h3>
                    <ul className="space-y-2">
                      {course.prerequisites.map((prereq) => {
                        const prereqCourse = getCourseById(prereq);
                        return (
                          <li key={prereq} className="text-muted">
                            {prereqCourse ? (
                              <Link href={`/portal/courses/${prereq}`} className="text-brand hover:text-brand2">
                                {prereqCourse.title}
                              </Link>
                            ) : (
                              prereq
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </GlowCard>
            </motion.div>

            {/* Schedule for In-Class/Hybrid */}
            {course.schedule && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <GlowCard className="p-8 border-teal-500/30">
                  <h2 className="text-2xl font-extrabold text-text mb-6">📍 Schedule & Location</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-muted mb-1">Start Date</p>
                      <p className="text-lg font-semibold text-text">
                        {course.schedule.startDate
                          ? new Date(course.schedule.startDate).toLocaleDateString()
                          : "To Be Announced"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted mb-1">End Date</p>
                      <p className="text-lg font-semibold text-text">
                        {course.schedule.endDate
                          ? new Date(course.schedule.endDate).toLocaleDateString()
                          : "To Be Announced"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted mb-1">Meeting Days</p>
                      <p className="text-lg font-semibold text-text">
                        {course.schedule.meetDays.join(", ")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted mb-1">Time</p>
                      <p className="text-lg font-semibold text-text">
                        {course.schedule.startTime} - {course.schedule.endTime}
                      </p>
                    </div>
                    {course.schedule.location && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-muted mb-1">Location</p>
                        <p className="text-lg font-semibold text-text">{course.schedule.location}</p>
                      </div>
                    )}
                    {course.schedule.instructor && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-muted mb-1">Instructor</p>
                        <p className="text-lg font-semibold text-text">{course.schedule.instructor}</p>
                      </div>
                    )}
                    {course.schedule.currentEnrollment !== undefined && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-muted mb-1">Enrollment</p>
                        <p className="text-lg font-semibold text-text">
                          {course.schedule.currentEnrollment}/
                          {course.schedule.maxCapacity || "Unlimited"} enrolled
                        </p>
                      </div>
                    )}
                  </div>
                </GlowCard>
              </motion.div>
            )}

            {/* Lessons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GlowCard className="p-8">
                <h2 className="text-2xl font-extrabold text-text mb-6">
                  Course Content ({lessons.length} lessons)
                </h2>

                <div className="space-y-3">
                  {lessons.map((lesson, index) => (
                    <Link
                      key={lesson.id}
                      href={isEnrolled ? `/portal/courses/${courseId}/lessons/${lesson.id}` : "#"}
                      onClick={(e) => !isEnrolled && e.preventDefault()}
                      className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                        isEnrolled
                          ? "bg-bg hover:bg-bg/80 border border-border hover:border-brand cursor-pointer"
                          : "bg-bg/50 border border-border opacity-60 cursor-not-allowed"
                      }`}
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand/20 text-brand flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-text">{lesson.title}</p>
                        <p className="text-sm text-muted truncate">{lesson.description}</p>
                      </div>
                      <div className="flex-shrink-0 flex items-center gap-2 text-sm text-muted">
                        <span>⏱️ {lesson.duration}m</span>
                        {isEnrolled && <span className="text-brand">→</span>}
                      </div>
                    </Link>
                  ))}
                </div>
              </GlowCard>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Enrollment Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="sticky top-6"
            >
              <GlowCard className="p-6 border-brand/50">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-text mb-4">Course Details</h3>

                  <div className="space-y-4 text-sm">
                    <div>
                      <p className="text-muted mb-1">Lessons</p>
                      <p className="text-lg font-semibold text-text">{lessons.length}</p>
                    </div>
                    <div>
                      <p className="text-muted mb-1">Duration</p>
                      <p className="text-lg font-semibold text-text">{course.duration}</p>
                    </div>
                    <div>
                      <p className="text-muted mb-1">Level</p>
                      <p className="text-lg font-semibold text-text">{course.level}</p>
                    </div>
                    <div>
                      <p className="text-muted mb-1">Format</p>
                      <p className="text-lg font-semibold text-text">{getCourseTypeLabel()}</p>
                    </div>
                    {course.instructors && course.instructors.length > 0 && (
                      <div>
                        <p className="text-muted mb-1">Instructors</p>
                        <p className="text-sm font-semibold text-text">
                          {course.instructors.join(", ")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={enrollCourse}
                  className={
                    isEnrolled
                      ? "w-full px-4 py-3 rounded-lg font-semibold text-sm bg-brand/20 text-brand border border-brand/30"
                      : "w-full px-4 py-3 rounded-lg font-semibold text-sm bg-gradient-to-br from-brand to-brand2 text-[#02131a] hover:shadow-glow transition-all"
                  }
                >
                  {isEnrolled ? "✓ Enrolled" : "Enroll Now"}
                </button>

                {isEnrolled && lessons.length > 0 && (
                  <Link
                    href={`/portal/courses/${courseId}/lessons/${lessons[0].id}`}
                    className="block w-full mt-3 px-4 py-3 rounded-lg font-semibold text-sm bg-bg border border-border text-text text-center hover:border-brand transition-all"
                  >
                    Start Learning →
                  </Link>
                )}
              </GlowCard>

              {/* Program Card */}
              <GlowCard className="p-6 mt-6">
                <h3 className="text-lg font-bold text-text mb-4">Part of Program</h3>
                <div className="flex items-start gap-3 mb-4">
                  <div className="text-3xl">{program.thumbnail}</div>
                  <div>
                    <Link href={`/portal/programs/${program.id}`} className="font-semibold text-brand hover:text-brand2">
                      {program.name}
                    </Link>
                    <p className="text-sm text-muted mt-1">{program.duration}</p>
                  </div>
                </div>
                <Link
                  href={`/portal/programs/${program.id}`}
                  className="text-sm text-brand hover:text-brand2 font-semibold"
                >
                  View Full Program →
                </Link>
              </GlowCard>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
