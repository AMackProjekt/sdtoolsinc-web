"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";
import { CourseFilter } from "@/components/courses/CourseFilter";

interface Program {
  id: string;
  name: string;
  description: string;
  overview: string;
  thumbnail: string;
  color: string;
  level: string;
  duration: string;
  target_audience: string;
  outcomes?: string[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  program_id: string;
  type: string;
  level: string;
  duration: string;
  thumbnail: string;
  outline?: Record<string, any>;
  prerequisites?: string[];
  credits?: number;
  instructors?: string[];
  schedule?: {
    meetDays?: string[];
    startTime?: string;
    endTime?: string;
    location?: string;
  };
}

export default function CoursesPage() {
  const { user, isAuthenticated, updateProfile } = useAuth();
  const router = useRouter();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [activeTab, setActiveTab] = useState<"catalog" | "programs">("programs");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/portal/auth");
    }
  }, [isAuthenticated, router]);

  // Fetch programs and courses
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [programsRes, coursesRes] = await Promise.all([
          fetch('/api/programs'),
          fetch('/api/courses'),
        ]);

        if (!programsRes.ok || !coursesRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const programsData = await programsRes.json();
        const coursesData = await coursesRes.json();

        setPrograms(programsData);
        setCourses(coursesData);
        setFilteredCourses(coursesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (!user) return null;

  const handleFilterChange = async (filters?: {
    programId?: string;
    type?: string;
    level?: string;
    search?: string;
  }) => {
    try {
      const query = new URLSearchParams();
      if (filters?.programId) query.append('programId', filters.programId);
      if (filters?.type) query.append('type', filters.type);
      if (filters?.level) query.append('level', filters.level);
      if (filters?.search) query.append('search', filters.search);

      const response = await fetch(`/api/courses?${query.toString()}`);
      if (!response.ok) throw new Error('Failed to filter courses');

      const filtered = await response.json();
      setFilteredCourses(filtered);
    } catch (err) {
      console.error('Error filtering courses:', err);
    }
  };

  const enrollCourse = async (courseId: string) => {
    try {
      if (!user.enrolledCourses.includes(courseId)) {
        const response = await fetch('/api/enrollments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            courseId,
            userId: user.id,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Enrollment failed');
        }

        // Update local state
        updateProfile({
          enrolledCourses: [...user.enrolledCourses, courseId],
        });
      }
    } catch (err) {
      console.error('Enrollment error:', err);
      alert(err instanceof Error ? err.message : 'Failed to enroll');
    }
  };

  const getCourseTypeColor = (type: string) => {
    switch (type) {
      case "online":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "in-class":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "hybrid":
        return "bg-teal-500/20 text-teal-400 border-teal-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const getCourseTypeIcon = (type: string) => {
    switch (type) {
      case "online":
        return "🌐";
      case "in-class":
        return "🏫";
      case "hybrid":
        return "🔄";
      default:
        return "📚";
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />

      {/* Header */}
      <header className="border-b border-border bg-panel/50 backdrop-blur-xl">
        <div className="mx-auto max-w-container px-7 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/portal/dashboard")}
              className="text-brand hover:text-brand2"
            >
              ← Back to Dashboard
            </button>
          </div>
          <div className="flex items-center gap-4">
            {loading && <span className="text-sm text-muted">Loading...</span>}
            <button
              onClick={() => router.push("/portal/dashboard")}
              className="text-sm font-semibold text-muted hover:text-text transition-colors"
            >
              Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Error Message */}
      {error && (
        <div className="mx-auto max-w-container px-7 py-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
          {error}
        </div>
      )}

      <div className="mx-auto max-w-container px-7 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-text mb-4">
            Learning Portal
          </h1>
          <p className="text-lg text-muted max-w-2xl mb-8">
            Unlock your potential with our comprehensive programs and courses designed to support your
            success in career and personal growth.
          </p>

          {/* Tab Navigation */}
          <div className="flex gap-4 border-b border-border">
            <button
              onClick={() => setActiveTab("programs")}
              className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                activeTab === "programs"
                  ? "text-brand border-brand"
                  : "text-muted border-transparent hover:text-text"
              }`}
            >
              Programs
            </button>
            <button
              onClick={() => setActiveTab("catalog")}
              className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                activeTab === "catalog"
                  ? "text-brand border-brand"
                  : "text-muted border-transparent hover:text-text"
              }`}
            >
              Course Catalog
            </button>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin mb-4">
                <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full"></div>
              </div>
              <p className="text-muted">Loading courses and programs...</p>
            </div>
          </div>
        )}

        {/* PROGRAMS TAB */}
        {!loading && activeTab === "programs" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {programs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted">No programs available</p>
              </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {programs.map((program, index) => {
                const programCourses = courses.filter((c) => c.program_id === program.id);
                const isEnrolledInProgram = programCourses.some((c) =>
                  user.enrolledCourses.includes(c.id)
                );

                return (
                  <motion.div
                    key={program.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <GlowCard className="p-6 h-full flex flex-col hover:border-brand/50 transition-all">
                      <div className="text-5xl mb-4">{program.thumbnail}</div>

                      <h3 className="text-xl font-extrabold tracking-tight text-text mb-2">
                        {program.name}
                      </h3>

                      <p className="text-sm text-muted leading-relaxed mb-4">
                        {program.description}
                      </p>

                      <div className="flex items-center gap-3 text-xs text-muted mb-4 flex-wrap">
                        <span className="px-2 py-1 rounded-full bg-brand/10 text-brand text-[10px] font-semibold uppercase">
                          {program.level}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {program.duration}
                        </span>
                        <span className="text-[10px]">{programCourses.length} courses</span>
                      </div>

                      <p className="text-xs text-muted mb-4 flex-1">{program.target_audience}</p>

                      <Link
                        href={`/portal/programs/${program.id}`}
                        className="w-full px-4 py-3 rounded-lg font-semibold text-sm bg-gradient-to-br from-brand to-brand2 text-[#02131a] hover:shadow-glow transition-all text-center"
                      >
                        View Program Details →
                      </Link>
                    </GlowCard>
                  </motion.div>
                );
              })}
            </div>
            )}
          </motion.div>
        )}

        {/* COURSE CATALOG TAB */}
        {!loading && activeTab === "catalog" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <CourseFilter onFilterChange={handleFilterChange} />

            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course, index) => {
                  const isEnrolled = user.enrolledCourses.includes(course.id);
                  const program = programs.find((p) => p.id === course.program_id);

                  return (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <GlowCard className="p-6 h-full flex flex-col group hover:border-brand/50 transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <div className="text-4xl">{course.thumbnail}</div>
                          <span
                            className={`px-2 py-1 rounded-full text-[10px] font-semibold uppercase border ${getCourseTypeColor(
                              course.type
                            )}`}
                          >
                            {getCourseTypeIcon(course.type)} {course.type}
                          </span>
                        </div>

                        <h3 className="text-lg font-extrabold tracking-tight text-text mb-2 line-clamp-2">
                          {course.title}
                        </h3>

                        <p className="text-sm text-muted leading-relaxed mb-4 flex-1 line-clamp-2">
                          {course.description}
                        </p>

                        {program && (
                          <Link
                            href={`/portal/programs/${program.id}`}
                            className="text-xs text-brand hover:text-brand2 mb-3 transition-colors"
                          >
                            → {program.name}
                          </Link>
                        )}

                        <div className="flex flex-wrap gap-3 text-xs text-muted mb-4">
                          <span className="flex items-center gap-1">
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                              />
                            </svg>
                            Lessons available
                          </span>
                          <span className="flex items-center gap-1">
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {course.duration}
                          </span>
                          <span className="px-2 py-1 rounded-full bg-brand/10 text-brand text-[10px] font-semibold uppercase">
                            {course.level}
                          </span>
                        </div>

                        {course.schedule && (
                          <div className="text-xs text-muted mb-4 p-3 bg-bg rounded-lg">
                            <div className="font-semibold text-text mb-1">📍 Schedule</div>
                            {course.schedule.meetDays && (
                              <div>{course.schedule.meetDays.join(", ")}</div>
                            )}
                            {course.schedule.startTime && course.schedule.endTime && (
                              <div>
                                {course.schedule.startTime} - {course.schedule.endTime}
                              </div>
                            )}
                            {course.schedule.location && <div>{course.schedule.location}</div>}
                          </div>
                        )}

                        <div className="flex gap-2 mt-auto">
                          <Link
                            href={`/portal/courses/${course.id}`}
                            className="flex-1 px-4 py-3 rounded-lg font-semibold text-sm bg-brand/20 text-brand border border-brand/30 hover:bg-brand/30 transition-all text-center"
                          >
                            View Details
                          </Link>
                          <button
                            onClick={() => enrollCourse(course.id)}
                            className={
                              isEnrolled
                                ? "flex-1 px-4 py-3 rounded-lg font-semibold text-sm bg-brand/10 text-brand border border-brand/20 cursor-default"
                                : "flex-1 px-4 py-3 rounded-lg font-semibold text-sm bg-gradient-to-br from-brand to-brand2 text-[#02131a] hover:shadow-glow transition-all"
                            }
                          >
                            {isEnrolled ? "✓ Enrolled" : "Enroll"}
                          </button>
                        </div>
                      </GlowCard>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-text mb-2">No courses found</h3>
                <p className="text-muted">
                  Try adjusting your filters to find more courses
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
