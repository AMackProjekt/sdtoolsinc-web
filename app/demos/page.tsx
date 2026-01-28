"use client";

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

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mt-20"
        >
          <h2 className="h2 mb-8">Recording & Production Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recording Setup */}
            <GlowCard>
              <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                <span>🎬</span> Recording Setup
              </h3>
              <div className="space-y-3 text-sm text-muted">
                <div>
                  <p className="font-medium text-text mb-1">Recommended Tools:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>OBS Studio (Free, open-source)</li>
                    <li>ScreenFlow (macOS)</li>
                    <li>Camtasia</li>
                    <li>ShareX (Windows)</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-text mb-1">Settings:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Resolution: 1920x1080 (16:9)</li>
                    <li>Frame Rate: 30fps</li>
                    <li>Format: MP4 (H.264)</li>
                  </ul>
                </div>
              </div>
            </GlowCard>

            {/* Content Guide */}
            <GlowCard>
              <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                <span>📝</span> Content Guide
              </h3>
              <div className="space-y-3 text-sm text-muted">
                <div>
                  <p className="font-medium text-text mb-1">Each Demo Should Cover:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Opening screen/interface</li>
                    <li>Main features (3-4 key actions)</li>
                    <li>Real-world use case</li>
                    <li>Call-to-action</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-text mb-1">Timing:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Total: 20-30 seconds</li>
                    <li>Intro: 2-3 seconds</li>
                    <li>Demo: 15-20 seconds</li>
                    <li>CTA: 3-5 seconds</li>
                  </ul>
                </div>
              </div>
            </GlowCard>

            {/* Editing Tips */}
            <GlowCard>
              <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                <span>✨</span> Editing Tips
              </h3>
              <div className="space-y-3 text-sm text-muted">
                <ul className="list-disc list-inside space-y-2">
                  <li>Add text overlays for key features</li>
                  <li>Use consistent background music (royalty-free)</li>
                  <li>Include cursor highlights for actions</li>
                  <li>Add fade in/out transitions</li>
                  <li>Maintain consistent branding colors</li>
                  <li>Use captions for accessibility</li>
                </ul>
              </div>
            </GlowCard>

            {/* File Management */}
            <GlowCard>
              <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                <span>📁</span> File Management
              </h3>
              <div className="space-y-3 text-sm text-muted">
                <div>
                  <p className="font-medium text-text mb-1">Video Storage Location:</p>
                  <p className="font-mono text-xs bg-bg/50 p-2 rounded mt-1 break-all">
                    /public/videos/demos/
                  </p>
                </div>
                <div>
                  <p className="font-medium text-text mb-1">Naming Convention:</p>
                  <p className="font-mono text-xs bg-bg/50 p-2 rounded mt-1">
                    {demos[0].videoPlaceholder}.mp4
                  </p>
                </div>
              </div>
            </GlowCard>
          </div>
        </motion.div>

        {/* Implementation Guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-12"
        >
          <GlowCard className="bg-gradient-to-br from-brand/10 to-brand2/10 border border-brand/30">
            <h3 className="text-lg font-semibold text-text mb-4">
              🚀 How to Add Videos to This Page
            </h3>
            <div className="space-y-4 text-sm text-muted">
              <div>
                <p className="font-medium text-text mb-2">1. Upload Video Files</p>
                <p>
                  Record your 20-30 second demos and save them as MP4 files in <code className="bg-bg/50 px-2 py-1 rounded text-xs">/public/videos/demos/</code>
                </p>
              </div>
              <div>
                <p className="font-medium text-text mb-2">2. Update Video Player</p>
                <p>
                  Modify the video player component in <code className="bg-bg/50 px-2 py-1 rounded text-xs">app/demos/page.tsx</code> to embed videos from the public folder
                </p>
              </div>
              <div>
                <p className="font-medium text-text mb-2">3. Embed Options</p>
                <p>Use HTML5 video tag, YouTube embeds, or Vimeo embeds depending on where videos are hosted</p>
              </div>
              <div>
                <p className="font-medium text-text mb-2">4. Test & Deploy</p>
                <p>Test the demos locally, then commit and push to trigger Azure Static Web Apps deployment</p>
              </div>
            </div>
          </GlowCard>
        </motion.div>

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
