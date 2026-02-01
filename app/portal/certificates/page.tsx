"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";
import { CertificatePreview } from "@/components/certificates/Certificate";
import { cn } from "@/lib/cn";

interface CompletedCourse {
  id: string;
  title: string;
  completionDate: string;
  credits?: number;
  instructorName: string;
  certificateId: string;
}

// Mock completed courses - in production, fetch from API/Supabase
const MOCK_COMPLETED_COURSES: CompletedCourse[] = [
  {
    id: "d4e5f6a7-b8c9-4d8e-bf0a-2b1c0d9e8f7a",
    title: "Job Readiness Fundamentals",
    completionDate: "2024-01-15",
    credits: 3,
    instructorName: "Sarah Johnson",
    certificateId: "CERT-2024-JRF-001234",
  },
  {
    id: "e5f6a7b8-c9da-4e9f-c01b-3c2d1e0f9a8b",
    title: "Financial Literacy",
    completionDate: "2024-01-28",
    credits: 2,
    instructorName: "James Williams",
    certificateId: "CERT-2024-FIN-001235",
  },
];

export default function CertificatesPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [completedCourses, setCompletedCourses] = useState<CompletedCourse[]>(MOCK_COMPLETED_COURSES);
  const [selectedCourse, setSelectedCourse] = useState<CompletedCourse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/portal/auth");
      return;
    }

    // In production: Fetch completed courses from API
    // const fetchCompletedCourses = async () => {
    //   const courses = await getCompletedCourses(user.id);
    //   setCompletedCourses(courses);
    // };
    // fetchCompletedCourses();
  }, [isAuthenticated, router, user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-muted">Loading...</div>
      </div>
    );
  }

  const handleDownloadCertificate = (course: CompletedCourse) => {
    // In production: Generate PDF and trigger download
    // For now, we'll just show an alert
    alert(`Downloading certificate for ${course.title}...`);
    
    // Implementation would use a library like jsPDF or html2canvas
    // to convert the Certificate component to a PDF
  };

  const handlePrintCertificate = (course: CompletedCourse) => {
    setSelectedCourse(course);
    setTimeout(() => {
      window.print();
    }, 100);
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
          <button
            onClick={() => {
              logout();
            }}
            className="text-sm font-semibold text-muted hover:text-text transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-7 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-extrabold tracking-tight text-text mb-2">
            My Certificates
          </h1>
          <p className="text-muted mb-8">
            View and download certificates for completed courses
          </p>
        </motion.div>

        {completedCourses.length === 0 ? (
          <GlowCard className="p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-text mb-2">No Certificates Yet</h3>
            <p className="text-muted mb-6">
              Complete courses to earn certificates that you can share and download
            </p>
            <button
              onClick={() => router.push("/portal/courses")}
              className={cn(
                "px-6 py-3 rounded-lg font-semibold transition-all",
                "bg-gradient-to-br from-brand to-brand2 text-[#02131a]",
                "hover:shadow-glow"
              )}
            >
              Browse Courses
            </button>
          </GlowCard>
        ) : (
          <div className="space-y-8">
            {/* Certificates Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {completedCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlowCard className="p-6 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-extrabold text-text mb-1">
                          {course.title}
                        </h3>
                        <p className="text-sm text-muted">
                          Completed: {new Date(course.completionDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand to-brand2 flex items-center justify-center text-2xl">
                        🏆
                      </div>
                    </div>

                    <div className="space-y-2 mb-6 flex-1">
                      <div className="flex items-center gap-2 text-sm text-muted">
                        <svg className="w-4 h-4 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Instructor: {course.instructorName}
                      </div>
                      {course.credits && (
                        <div className="flex items-center gap-2 text-sm text-muted">
                          <svg className="w-4 h-4 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                          {course.credits} CE {course.credits === 1 ? "Credit" : "Credits"}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-xs text-muted font-mono">
                        <svg className="w-4 h-4 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                        {course.certificateId}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setSelectedCourse(course)}
                        className="flex-1 px-4 py-3 rounded-lg font-semibold text-sm bg-brand/20 text-brand border border-brand/30 hover:bg-brand/30 transition-all"
                      >
                        View Certificate
                      </button>
                      <button
                        onClick={() => handleDownloadCertificate(course)}
                        className="px-4 py-3 rounded-lg font-semibold text-sm bg-gradient-to-br from-brand to-brand2 text-[#02131a] hover:shadow-glow transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                    </div>
                  </GlowCard>
                </motion.div>
              ))}
            </div>

            {/* Selected Certificate Preview */}
            {selectedCourse && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12"
              >
                <GlowCard className="p-8">
                  <CertificatePreview
                    userName={user.name}
                    courseName={selectedCourse.title}
                    completionDate={selectedCourse.completionDate}
                    courseId={selectedCourse.id}
                    certificateId={selectedCourse.certificateId}
                    instructorName={selectedCourse.instructorName}
                    credits={selectedCourse.credits}
                    onDownload={() => handleDownloadCertificate(selectedCourse)}
                  />

                  <div className="mt-6 flex items-center gap-4">
                    <button
                      onClick={() => handlePrintCertificate(selectedCourse)}
                      className="px-6 py-3 rounded-lg font-semibold border border-border text-text hover:bg-panel transition-all flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                      Print Certificate
                    </button>
                    <button
                      onClick={() => setSelectedCourse(null)}
                      className="px-6 py-3 rounded-lg font-semibold border border-border text-muted hover:text-text hover:bg-panel transition-all"
                    >
                      Close Preview
                    </button>
                  </div>
                </GlowCard>
              </motion.div>
            )}

            {/* Info Box */}
            <GlowCard className="p-6 bg-brand/5 border-brand/30">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-brand flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-text">
                  <div className="font-semibold mb-2">About Your Certificates</div>
                  <ul className="space-y-1 text-muted">
                    <li>• Certificates are available immediately upon course completion</li>
                    <li>• Each certificate has a unique verification ID</li>
                    <li>• Download certificates in high-quality PDF format</li>
                    <li>• Share your achievements on LinkedIn, resume, or portfolio</li>
                    <li>• Certificates never expire and can be downloaded anytime</li>
                  </ul>
                </div>
              </div>
            </GlowCard>
          </div>
        )}
      </div>
    </div>
  );
}
