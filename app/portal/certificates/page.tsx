"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import { Certificate } from "@/components/ui/Certificate";
import { GlowCard } from "@/components/ui/GlowCard";

export default function CertificatesPage() {
  return (
    <Suspense fallback={null}>
      <CertificatesPageContent />
    </Suspense>
  );
}

function CertificatesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const [selectedCert, setSelectedCert] = useState<string | null>(
    searchParams.get("certificate") || null
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/portal/auth");
      return;
    }
  }, [isAuthenticated, router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-muted">Loading...</div>
      </div>
    );
  }

  const certificates = user.certificates || [];
  const selectedCertificate = selectedCert
    ? certificates.find((c) => c.certificateId === selectedCert)
    : null;

  const handleDownload = async () => {
    if (!selectedCertificate) return;

    // In production, generate actual PDF
    // For now, show success message
    const element = document.createElement("a");
    const file = new Blob(
      [
        `Certificate\n${selectedCertificate.courseName}\n${selectedCertificate.certificateId}\n${selectedCertificate.completionDate}`,
      ],
      { type: "text/plain" }
    );
    element.href = URL.createObjectURL(file);
    element.download = `${selectedCertificate.certificateId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-bg">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />

      {/* Header */}
      <header className="border-b border-border bg-panel/50 backdrop-blur-xl">
        <div className="mx-auto max-w-container px-7 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push("/portal/dashboard")}
            className="text-brand hover:text-brand2"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-2xl font-extrabold text-text">My Certificates</h1>
          <div />
        </div>
      </header>

      <div className="mx-auto max-w-container px-7 py-12">
        {/* Empty State */}
        {certificates.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto text-center py-16"
          >
            <div className="text-6xl mb-6">📜</div>
            <h2 className="text-2xl font-bold text-text mb-3">No Certificates Yet</h2>
            <p className="text-muted mb-8">
              Complete a course and pass the assessment to earn your certificate!
            </p>
            <motion.button
              onClick={() => router.push("/portal/courses")}
              whileHover={{ y: -2 }}
              className="px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-brand to-brand2 text-[#02131a] hover:shadow-glow transition-all"
            >
              🎓 Start a Course
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-12">
            {selectedCertificate ? (
              // Certificate Detail View
              <motion.div
                key="detail"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <button
                  onClick={() => setSelectedCert(null)}
                  className="mb-8 text-brand hover:text-brand2 font-semibold"
                >
                  ← Back to All Certificates
                </button>
                <Certificate
                  name={user.name}
                  courseName={selectedCertificate.courseName}
                  certificateId={selectedCertificate.certificateId}
                  completionDate={selectedCertificate.completionDate}
                  score={selectedCertificate.score}
                  onDownload={handleDownload}
                />
              </motion.div>
            ) : (
              // Certificates Grid
              <>
                <div>
                  <h2 className="text-2xl font-extrabold text-text mb-2">
                    {certificates.length} Certificate{certificates.length !== 1 ? "s" : ""} Earned
                  </h2>
                  <p className="text-muted">Click any certificate to view and download</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {certificates.map((cert, index) => (
                    <motion.div
                      key={cert.certificateId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setSelectedCert(cert.certificateId)}
                      className="cursor-pointer"
                    >
                      <GlowCard className="p-6 h-full flex flex-col hover:scale-105 transition-transform">
                        <div className="text-4xl mb-4">🏆</div>
                        <h3 className="text-lg font-bold text-text mb-2 flex-grow">
                          {cert.courseName}
                        </h3>
                        <div className="space-y-2 mb-4">
                          <div className="text-sm text-muted">
                            <span className="text-brand font-semibold">Score:</span>{" "}
                            {cert.score}%
                          </div>
                          <div className="text-sm text-muted">
                            <span className="text-brand font-semibold">Earned:</span>{" "}
                            {new Date(cert.completionDate).toLocaleDateString()}
                          </div>
                        </div>
                        <button className="w-full px-4 py-2 rounded-lg text-sm font-semibold bg-brand/20 text-brand hover:bg-brand/30 transition-colors">
                          View Certificate →
                        </button>
                      </GlowCard>
                    </motion.div>
                  ))}
                </div>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-3 gap-4 p-6 bg-panel rounded-lg border border-border"
                >
                  <div className="text-center">
                    <div className="text-3xl font-extrabold text-brand">
                      {certificates.length}
                    </div>
                    <div className="text-sm text-muted">Total Certificates</div>
                  </div>
                  <div className="text-center border-l border-r border-border">
                    <div className="text-3xl font-extrabold text-brand2">
                      {Math.round(
                        certificates.reduce((sum, c) => sum + (c.score || 0), 0) /
                          certificates.length
                      )}
                      %
                    </div>
                    <div className="text-sm text-muted">Average Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-extrabold text-accent">
                      100%
                    </div>
                    <div className="text-sm text-muted">Pass Rate</div>
                  </div>
                </motion.div>

                {/* Next Steps */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 bg-panel rounded-lg border border-border space-y-4"
                >
                  <h3 className="text-lg font-bold text-text">What's Next?</h3>
                  <ul className="space-y-3 text-muted">
                    <li className="flex gap-3">
                      <span className="text-brand font-bold">✓</span>
                      <span>Share your certificates on LinkedIn to boost your profile</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-brand font-bold">✓</span>
                      <span>Complete additional courses to expand your skills</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-brand font-bold">✓</span>
                      <span>Use these credentials when applying for jobs</span>
                    </li>
                  </ul>
                </motion.div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
