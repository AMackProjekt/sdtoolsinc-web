"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";
import { Certificate } from "@/components/certificates/Certificate";
import { cn } from "@/lib/cn";

interface CertificateData {
  id: string;
  course_id: string;
  courseName: string;
  programName: string;
  certificateNumber: string;
  issued_date: string;
  completion_date: string;
}

export default function CertificatesPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [certificates, setCertificates] = useState<CertificateData[]>([]);
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/portal/auth");
      return;
    }

    // Mock certificates - in production, fetch from Supabase
    const mockCertificates: CertificateData[] = [
      {
        id: "cert-1",
        course_id: "course-1",
        courseName: "Job Readiness Fundamentals",
        programName: "Reentry & Resettlement Program",
        certificateNumber: "TOOLS-2026-001234",
        issued_date: new Date().toISOString(),
        completion_date: new Date(Date.now() - 86400000).toISOString(),
      }
    ];
    
    setCertificates(mockCertificates);
    setLoading(false);
  }, [isAuthenticated, user, router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-muted">Loading...</div>
      </div>
    );
  }

  const handleDownload = (cert: CertificateData) => {
    // In production: Generate PDF using html2canvas or similar library
    alert("Certificate download will be implemented with PDF generation");
  };

  return (
    <div className="min-h-screen bg-bg">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />

      {/* Header */}
      <header className="border-b border-border bg-panel/50 backdrop-blur-xl">
        <div className="mx-auto max-w-container px-7 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push("/portal/dashboard")} className="text-brand hover:text-brand2">
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
          className="mb-8"
        >
          <h1 className="text-3xl font-extrabold tracking-tight text-text mb-2">
            My Certificates
          </h1>
          <p className="text-muted">
            View and download your course completion certificates
          </p>
        </motion.div>

        {/* Certificate Modal */}
        {selectedCertificate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedCertificate(null)}
          >
            <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setSelectedCertificate(null)}
                className="absolute -top-12 right-0 text-white hover:text-brand transition-colors text-2xl"
              >
                ✕
              </button>
              <Certificate
                userName={user.name || "Student Name"}
                courseName={selectedCertificate.courseName}
                programName={selectedCertificate.programName}
                completionDate={selectedCertificate.completion_date}
                certificateNumber={selectedCertificate.certificateNumber}
                onDownload={() => handleDownload(selectedCertificate)}
              />
            </div>
          </motion.div>
        )}

        {/* Certificates Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin mb-4">
                <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full"></div>
              </div>
              <p className="text-muted">Loading certificates...</p>
            </div>
          </div>
        ) : certificates.length === 0 ? (
          <GlowCard className="p-12 text-center">
            <div className="text-6xl mb-4">🎓</div>
            <h3 className="text-xl font-bold text-text mb-2">
              No Certificates Yet
            </h3>
            <p className="text-muted mb-6">
              Complete a course to earn your first certificate!
            </p>
            <button
              onClick={() => router.push("/portal/courses")}
              className={cn(
                "px-6 py-3 rounded-lg font-semibold transition-all",
                "bg-gradient-to-br from-brand to-brand2 text-[#02131a]",
                "hover:shadow-glow"
              )}
            >
              Browse Courses →
            </button>
          </GlowCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlowCard className="p-6 hover:border-brand/50 transition-all cursor-pointer group">
                  <div className="aspect-[1.414/1] rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-600/10 border-2 border-amber-500/30 mb-4 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <div className="text-6xl">🏆</div>
                  </div>

                  <h3 className="text-lg font-extrabold tracking-tight text-text mb-2 line-clamp-2">
                    {cert.courseName}
                  </h3>

                  <div className="text-sm text-muted mb-4">
                    {cert.programName}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted mb-4">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Issued: {new Date(cert.issued_date).toLocaleDateString()}</span>
                  </div>

                  <div className="text-xs text-muted font-mono mb-4 p-2 bg-bg rounded border border-border">
                    {cert.certificateNumber}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedCertificate(cert)}
                      className="flex-1 px-4 py-2 rounded-lg font-semibold text-sm bg-brand/20 text-brand border border-brand/30 hover:bg-brand/30 transition-all"
                    >
                      👁️ View
                    </button>
                    <button
                      onClick={() => handleDownload(cert)}
                      className="flex-1 px-4 py-2 rounded-lg font-semibold text-sm bg-gradient-to-br from-brand to-brand2 text-[#02131a] hover:shadow-glow transition-all"
                    >
                      📥 Download
                    </button>
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        )}

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <GlowCard className="p-6">
            <h3 className="text-lg font-extrabold tracking-tight text-text mb-3">
              About Your Certificates
            </h3>
            <div className="space-y-3 text-sm text-muted">
              <p>
                ✓ All certificates are digitally signed and verified by T.O.O.L.S Inc
              </p>
              <p>
                ✓ Each certificate has a unique verification number for authenticity
              </p>
              <p>
                ✓ Certificates can be shared with employers and educational institutions
              </p>
              <p>
                ✓ Download your certificates in PDF format for printing or sharing
              </p>
            </div>
          </GlowCard>
        </motion.div>
      </div>
    </div>
  );
}
