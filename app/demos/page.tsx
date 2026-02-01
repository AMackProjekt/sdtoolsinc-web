"use client";

import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";
import { useMemo, useState } from "react";
import { demoVideos } from "@/lib/demoVideos";

interface SelectedDemo {
  id: string;
  title: string;
}

const demoDetails: Record<string, string[]> = {
  "dashboard-overview": [
    "View case overview and status",
    "Track client progress metrics",
    "Access quick actions and tools",
    "Monitor upcoming appointments",
    "View case history timeline",
  ],
  "enrollment-process": [
    "Course catalog and search",
    "Lesson modules and videos",
    "Interactive learning materials",
    "Progress tracking",
    "Certificate of completion",
  ],
  "ai-coach-demo": [
    "AI conversation interface",
    "Personalized motivational messages",
    "Goal setting assistance",
    "Real-time feedback and support",
    "Learning recommendations",
  ],
  "communication-platform": [
    "Secure messaging system",
    "Schedule appointments",
    "Share documents and resources",
    "Real-time notifications",
    "Communication history",
  ],
  "profile-setup": [
    "Demographics & contact details",
    "Learning preferences",
    "Account setup checklist",
    "Profile completion tips",
    "Privacy controls",
  ],
  "quiz-system": [
    "75-question assessments",
    "Instant scoring feedback",
    "Certificate generation",
    "Progress tracking",
    "Shareable achievements",
  ],
};

export default function DemosPage() {
  const [selectedDemo, setSelectedDemo] = useState<SelectedDemo | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const selectedVideo = useMemo(() => {
    if (!selectedDemo) return null;
    return demoVideos.find((demo) => demo.id === selectedDemo.id) || null;
  }, [selectedDemo]);

  return (
    <div className="min-h-screen bg-bg">
      {/* Fixed background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />

      {/* Header */}
      <header className="border-b border-border bg-panel/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="mx-auto max-w-container px-7 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-text">Video Demonstrations</h1>
              <p className="text-sm text-muted mt-1">Explore features with short video clips (1-2 minutes each)</p>
            </div>
            <a
              href="/"
              className="text-sm font-medium text-muted hover:text-text transition-colors"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-container px-7 pt-12 pb-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="h2 mb-4">See What's Possible</h2>
          <p className="p-lead mx-auto max-w-2xl">
            Quick video walkthroughs of T.O.O.L.S Inc's key features. Each demo is under two minutes,
            perfect for getting a quick understanding of how the platform works.
          </p>
        </motion.div>

        {/* Demo Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16"
        >
          {demoVideos.map((demo) => (
            <motion.div key={demo.id} variants={itemVariants}>
              <GlowCard
                className="h-full cursor-pointer hover:shadow-glow transition-all"
                onClick={() => setSelectedDemo({ id: demo.id, title: demo.title })}
              >
                <div className="flex flex-col h-full">
                  {/* Demo Preview */}
                  <div className="relative w-full h-40 rounded-lg overflow-hidden mb-4 bg-gradient-to-br from-brand/20 to-brand2/10">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-5xl">{demo.thumbnail}</div>
                    </div>
                    <div className="absolute top-2 right-2 bg-bg/80 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-brand">
                      {demo.duration}
                    </div>
                    <div className="absolute top-2 left-2 bg-green-500/20 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-green-400">
                      ✓ Ready
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="h3 text-lg mb-2">{demo.title}</h3>
                  <p className="text-sm text-muted mb-4">{demo.description}</p>

                  {/* Features List */}
                  <div className="space-y-2 mb-6 pb-6 border-b border-border/50 flex-grow">
                    {(demoDetails[demo.id] || []).map((detail, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-muted">
                        <span className="text-brand mt-1">•</span>
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => setSelectedDemo({ id: demo.id, title: demo.title })}
                    className="w-full inline-flex items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold transition glass text-text hover:shadow-glow hover:-translate-y-1"
                  >
                    Watch Demo →
                  </button>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Video Player Modal */}
        {selectedDemo && selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedDemo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-panel rounded-2xl border border-border overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedDemo(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-bg/80 backdrop-blur hover:bg-bg text-muted hover:text-text transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Video Container */}
              <div className="w-full bg-black aspect-video flex flex-col items-center justify-center relative">
                <video
                  controls
                  className="w-full h-full"
                  src={selectedVideo.videoUrl}
                >
                  <p>Your browser doesn't support HTML5 video. Please check back later.</p>
                </video>
              </div>

              {/* Video Info Footer */}
              <div className="p-6 border-t border-border">
                <h3 className="text-lg font-semibold text-text mb-2">
                  {selectedVideo.title}
                </h3>
                <p className="text-sm text-muted mb-4">
                  {selectedVideo.description}
                </p>
                <div className="text-xs text-muted/70">Duration: {selectedVideo.duration}</div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 pt-12 border-t border-border text-center"
        >
          <p className="text-muted mb-6">Ready to see more? Explore the platform:</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/portal/dashboard"
              className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold transition glass text-text hover:shadow-glow hover:-translate-y-1"
            >
              Dashboard →
            </a>
            <a
              href="/portal/courses"
              className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold transition glass text-text hover:shadow-glow hover:-translate-y-1"
            >
              Courses →
            </a>
            <a
              href="/portal/portals"
              className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold transition glass text-text hover:shadow-glow hover:-translate-y-1"
            >
              All Portals →
            </a>
          </div>
        </motion.div>
      </main>
    </div>
  );
}"use client";

import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";
import { useState } from "react";

interface Demo {
  id: string;
  title: string;
  description: string;
  icon: string;
  duration: string;
  color: string;
  details: string[];
  videoPlaceholder: string;
  status: "planned" | "recording" | "completed";
}

const demos: Demo[] = [
  {
    id: "dashboard",
    title: "Personal Dashboard",
    description: "Case Manager Preview - Navigate your client cases, track progress, and manage outcomes",
    icon: "📊",
    duration: "20-30 seconds",
    color: "from-blue-500 to-cyan-500",
    status: "planned",
    videoPlaceholder: "personal-dashboard-demo",
    details: [
      "View case overview and status",
      "Track client progress metrics",
      "Access quick actions and tools",
      "Monitor upcoming appointments",
      "View case history timeline"
    ]
  },
  {
    id: "educational",
    title: "Educational Resources",
    description: "Browse and enroll in courses, access learning materials, and track your progress",
    icon: "📚",
    duration: "20-30 seconds",
    color: "from-purple-500 to-pink-500",
    status: "planned",
    videoPlaceholder: "educational-resources-demo",
    details: [
      "Course catalog and search",
      "Lesson modules and videos",
      "Interactive learning materials",
      "Progress tracking",
      "Certificate of completion"
    ]
  },
  {
    id: "mackai",
    title: "MackAI Motivational Coach",
    description: "LLM-powered AI assistant providing personalized motivation, guidance, and support",
    icon: "🤖",
    duration: "20-30 seconds",
    color: "from-green-500 to-emerald-500",
    status: "planned",
    videoPlaceholder: "mackai-coach-demo",
    details: [
      "AI conversation interface",
      "Personalized motivational messages",
      "Goal setting assistance",
      "Real-time feedback and support",
      "Learning recommendations"
    ]
  },
  {
    id: "connection",
    title: "Client-Case Manager Connection",
    description: "Secure communication and collaboration between clients and their case managers",
    icon: "🔗",
    duration: "20-30 seconds",
    color: "from-orange-500 to-red-500",
    status: "planned",
    videoPlaceholder: "client-casemgr-connection-demo",
    details: [
      "Secure messaging system",
      "Schedule appointments",
      "Share documents and resources",
      "Real-time notifications",
      "Communication history"
    ]
  }
];

interface SelectedDemo {
  id: string;
  title: string;
}

export default function DemosPage() {
  const [selectedDemo, setSelectedDemo] = useState<SelectedDemo | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* Fixed background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />

      {/* Header */}
      <header className="border-b border-border bg-panel/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="mx-auto max-w-container px-7 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-text">Video Demonstrations</h1>
              <p className="text-sm text-muted mt-1">Explore features with short video clips (20-30 seconds each)</p>
            </div>
            <a
              href="/"
              className="text-sm font-medium text-muted hover:text-text transition-colors"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-container px-7 pt-12 pb-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="h2 mb-4">See What's Possible</h2>
          <p className="p-lead mx-auto max-w-2xl">
            Quick video walkthroughs of T.O.O.L.S Inc's key features. Each demo is under 30 seconds, perfect for getting a quick understanding of how the platform works.
          </p>
        </motion.div>

        {/* Demo Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16"
        >
          {demos.map((demo) => (
            <motion.div key={demo.id} variants={itemVariants}>
              <GlowCard
                className="h-full cursor-pointer hover:shadow-glow transition-all"
                onClick={() => setSelectedDemo({ id: demo.id, title: demo.title })}
              >
                <div className="flex flex-col h-full">
                  {/* Demo Preview */}
                  <div className={`relative w-full h-40 rounded-lg overflow-hidden mb-4 bg-gradient-to-br ${demo.color} opacity-20`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-5xl">{demo.icon}</div>
                    </div>
                    <div className="absolute top-2 right-2 bg-bg/80 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-brand">
                      {demo.duration}
                    </div>
                    {demo.status === "completed" && (
                      <div className="absolute top-2 left-2 bg-green-500/20 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-green-400">
                        ✓ Ready
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <h3 className="h3 text-lg mb-2">{demo.title}</h3>
                  <p className="text-sm text-muted mb-4">{demo.description}</p>

                  {/* Features List */}
                  <div className="space-y-2 mb-6 pb-6 border-b border-border/50 flex-grow">
                    {demo.details.map((detail, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-muted">
                        <span className="text-brand mt-1">•</span>
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => setSelectedDemo({ id: demo.id, title: demo.title })}
                    className="w-full inline-flex items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold transition glass text-text hover:shadow-glow hover:-translate-y-1"
                  >
                    Watch Demo →
                  </button>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Video Player Modal */}
        {selectedDemo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedDemo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-4xl max-h-[90vh] bg-panel rounded-2xl border border-border overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedDemo(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-bg/80 backdrop-blur hover:bg-bg text-muted hover:text-text transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Video Container */}
              <div className="w-full bg-black aspect-video flex flex-col items-center justify-center relative">
                <video
                  controls
                  className="w-full h-full"
                  src={`/videos/demos/${demos.find(d => d.id === selectedDemo.id)?.videoPlaceholder}.mp4`}
                  onError={() => {
                    // Fallback if video not found
                  }}
                >
                  <p>Your browser doesn't support HTML5 video. Please check back later.</p>
                </video>
                
                {/* Fallback if video not available */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-black/40 to-black/60 text-center pointer-events-none">
                  <div className="text-6xl mb-4">
                    {demos.find(d => d.id === selectedDemo.id)?.icon}
                  </div>
                  <p className="text-lg font-semibold text-white mb-2">{selectedDemo.title}</p>
                  <p className="text-sm text-gray-300">Video Demo</p>
                </div>
              </div>

              {/* Video Info Footer */}
              <div className="p-6 border-t border-border">
                <h3 className="text-lg font-semibold text-text mb-2">
                  {demos.find(d => d.id === selectedDemo.id)?.title}
                </h3>
                <p className="text-sm text-muted mb-4">
                  {demos.find(d => d.id === selectedDemo.id)?.description}
                </p>
                <div className="text-xs text-muted/70">
                  Duration: {demos.find(d => d.id === selectedDemo.id)?.duration}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 pt-12 border-t border-border text-center"
        >
          <p className="text-muted mb-6">Ready to see more? Explore the platform:</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/portal/dashboard"
              className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold transition glass text-text hover:shadow-glow hover:-translate-y-1"
            >
              Dashboard →
            </a>
            <a
              href="/portal/courses"
              className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold transition glass text-text hover:shadow-glow hover:-translate-y-1"
            >
              Courses →
            </a>
            <a
              href="/portal/portals"
              className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold transition glass text-text hover:shadow-glow hover:-translate-y-1"
            >
              All Portals →
            </a>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
