"use client";

import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";

const demos = [
  {
    id: "dashboard",
    title: "Personal Dashboard",
    description: "Case Manager view with client overview and progress tracking",
    icon: "📊",
    path: "/demo-recording/dashboard",
    color: "from-blue-500 to-cyan-500",
    duration: "25s"
  },
  {
    id: "educational",
    title: "Educational Resources",
    description: "Course catalog, enrollment, and progress tracking",
    icon: "📚",
    path: "/demo-recording/educational",
    color: "from-purple-500 to-pink-500",
    duration: "26s"
  },
  {
    id: "mackai",
    title: "MackAI Coach",
    description: "LLM-powered motivational AI assistant",
    icon: "🤖",
    path: "/demo-recording/mackai",
    color: "from-green-500 to-emerald-500",
    duration: "28s"
  },
  {
    id: "connection",
    title: "Client-Case Manager Connection",
    description: "Secure messaging and appointment scheduling",
    icon: "🔗",
    path: "/demo-recording/connection",
    color: "from-orange-500 to-red-500",
    duration: "27s"
  },
];

export default function DemoRecordingHub() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />

      <div className="mx-auto max-w-7xl px-7 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-extrabold tracking-tight text-text mb-6">
            🎬 Demo Recording Studio
          </h1>
          <p className="text-xl text-muted max-w-3xl mx-auto">
            Self-playing animated demos ready to record. Each demo automatically plays through its sequence. 
            Use OBS or any screen recorder to capture 20-30 second clips.
          </p>
        </motion.div>

        {/* Recording Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <GlowCard className="p-8 bg-gradient-to-br from-brand/5 to-brand2/5">
            <h2 className="text-2xl font-bold text-text mb-4">📹 Quick Recording Guide</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-muted">
              <div>
                <h3 className="text-text font-semibold mb-2">1. Setup</h3>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Open OBS Studio or screen recorder</li>
                  <li>Set to 1920×1080, 30 FPS</li>
                  <li>Hide browser bookmarks/tabs (F11)</li>
                  <li>Close this tab, open demo link</li>
                </ul>
              </div>
              <div>
                <h3 className="text-text font-semibold mb-2">2. Record</h3>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Start recording</li>
                  <li>Let demo auto-play (loops continuously)</li>
                  <li>Record 1-2 full loops</li>
                  <li>Stop after closing card appears</li>
                </ul>
              </div>
              <div>
                <h3 className="text-text font-semibold mb-2">3. Edit</h3>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Trim to 20-30 seconds</li>
                  <li>Optional: Add music</li>
                  <li>Export as MP4 (H.264)</li>
                  <li>Save to /public/videos/demos/</li>
                </ul>
              </div>
              <div>
                <h3 className="text-text font-semibold mb-2">4. Deploy</h3>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Name: {"{slug}"}-demo.mp4</li>
                  <li>Commit and push to main</li>
                  <li>Azure deploys automatically</li>
                  <li>Videos appear on /demos page</li>
                </ul>
              </div>
            </div>
          </GlowCard>
        </motion.div>

        {/* Demo Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {demos.map((demo, idx) => (
            <motion.a
              key={demo.id}
              href={demo.path}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
            >
              <GlowCard className="h-full cursor-pointer hover:shadow-glow transition-all group">
                {/* Preview Area */}
                <div className={`relative h-40 rounded-lg overflow-hidden bg-gradient-to-br ${demo.color} opacity-20 group-hover:opacity-30 transition-opacity`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl transform group-hover:scale-110 transition-transform">
                      {demo.icon}
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 bg-bg/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-brand">
                    {demo.duration}
                  </div>
                  <div className="absolute top-2 left-2 bg-green-500/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                    Ready
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-text mb-2">{demo.title}</h3>
                  <p className="text-sm text-muted mb-4">{demo.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-muted">
                      <span>🎬 Auto-play</span>
                      <span>♾️ Loops</span>
                      <span>⏸ Pausable</span>
                    </div>
                    <div className="text-brand font-semibold text-sm group-hover:translate-x-1 transition-transform">
                      Open →
                    </div>
                  </div>
                </div>
              </GlowCard>
            </motion.a>
          ))}
        </div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-12 text-center"
        >
          <GlowCard className="p-6 inline-block">
            <h3 className="text-lg font-semibold text-text mb-3">💡 Pro Tips</h3>
            <ul className="text-sm text-muted space-y-2 text-left">
              <li>• Each demo has Play/Pause and Restart controls in top-right</li>
              <li>• Demos auto-loop - record 1 full cycle, then edit to 20-30s</li>
              <li>• Open in fullscreen (F11) for clean recording</li>
              <li>• Free OBS Studio: <a href="https://obsproject.com" target="_blank" className="text-brand hover:underline">obsproject.com</a></li>
              <li>• See VIDEO_DEMO_GUIDE.md and DEMO_SCRIPTS.md for detailed instructions</li>
            </ul>
          </GlowCard>
        </motion.div>

        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-12 text-center"
        >
          <a
            href="/"
            className="inline-flex items-center gap-2 text-muted hover:text-text transition"
          >
            ← Back to Home
          </a>
        </motion.div>
      </div>
    </div>
  );
}
