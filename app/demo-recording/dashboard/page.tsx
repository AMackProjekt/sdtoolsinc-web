"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";

const steps = [
  {
    id: 1,
    title: "Personal Dashboard Overview",
    duration: 3000,
    content: "Case Manager Dashboard - Managing 12 Active Cases"
  },
  {
    id: 2,
    title: "Case Selection",
    duration: 3000,
    content: "Viewing Client: Marcus Johnson - Progress: 75%"
  },
  {
    id: 3,
    title: "Progress Tracking",
    duration: 4000,
    content: "Employment Program: 8/10 milestones complete"
  },
  {
    id: 4,
    title: "Quick Actions",
    duration: 3000,
    content: "Schedule Meeting • Send Message • Update Status"
  },
  {
    id: 5,
    title: "Success",
    duration: 3000,
    content: "Stay Organized. Track Progress. Make Impact."
  }
];

const mockCases = [
  { id: 1, name: "Marcus Johnson", status: "Active", progress: 75, program: "Employment", lastContact: "2 days ago" },
  { id: 2, name: "Sarah Williams", status: "Active", progress: 60, program: "Education", lastContact: "1 day ago" },
  { id: 3, name: "David Martinez", status: "Active", progress: 90, program: "Housing", lastContact: "Today" },
  { id: 4, name: "Lisa Anderson", status: "Review", progress: 45, program: "Employment", lastContact: "3 days ago" },
];

export default function DashboardDemoPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCase, setSelectedCase] = useState<number | null>(null);
  const [showActions, setShowActions] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setTimeout(() => {
      if (currentStep === 0) {
        // Step 1: Show dashboard
        setTimeout(() => setCurrentStep(1), 2000);
      } else if (currentStep === 1) {
        // Step 2: Select a case
        setSelectedCase(0);
        setTimeout(() => setCurrentStep(2), 3000);
      } else if (currentStep === 2) {
        // Step 3: Show progress details
        setTimeout(() => setCurrentStep(3), 4000);
      } else if (currentStep === 3) {
        // Step 4: Show quick actions
        setShowActions(true);
        setTimeout(() => setCurrentStep(4), 3000);
      } else if (currentStep === 4) {
        // Step 5: Show closing message
        setTimeout(() => {
          // Loop back
          setCurrentStep(0);
          setSelectedCase(null);
          setShowActions(false);
        }, 3000);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [currentStep, autoPlay]);

  return (
    <div className="min-h-screen bg-bg overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />

      {/* Controls */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => setAutoPlay(!autoPlay)}
          className="px-4 py-2 rounded-lg bg-panel border border-border text-text text-sm font-medium hover:bg-brand/10 transition"
        >
          {autoPlay ? "⏸ Pause" : "▶ Play"}
        </button>
        <button
          onClick={() => {
            setCurrentStep(0);
            setSelectedCase(null);
            setShowActions(false);
          }}
          className="px-4 py-2 rounded-lg bg-panel border border-border text-text text-sm font-medium hover:bg-brand/10 transition"
        >
          🔄 Restart
        </button>
      </div>

      {/* Title Card - Step 0 */}
      <AnimatePresence>
        {currentStep === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-bg z-40"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-8xl mb-6"
              >
                📊
              </motion.div>
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-5xl font-extrabold tracking-tight text-text mb-4"
              >
                Personal Dashboard
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="text-xl text-muted"
              >
                Case Manager Preview
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Dashboard - Steps 1-3 */}
      {currentStep >= 1 && currentStep <= 3 && (
        <div className="mx-auto max-w-7xl px-7 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-extrabold tracking-tight text-text">
              Welcome back, Sarah!
            </h1>
            <p className="mt-2 text-muted">Managing 12 active cases</p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-4 gap-4 mb-8"
          >
            {[
              { label: "Active Cases", value: "12", icon: "👥" },
              { label: "This Week", value: "8", icon: "📅" },
              { label: "Success Rate", value: "87%", icon: "📈" },
              { label: "Avg Progress", value: "68%", icon: "✅" },
            ].map((stat, idx) => (
              <GlowCard key={idx} className="p-6">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{stat.icon}</div>
                  <div>
                    <div className="text-2xl font-extrabold tracking-tight text-text">
                      {stat.value}
                    </div>
                    <div className="text-xs text-muted mt-1">{stat.label}</div>
                  </div>
                </div>
              </GlowCard>
            ))}
          </motion.div>

          {/* Cases Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 gap-4"
          >
            {mockCases.map((case_, idx) => (
              <motion.div
                key={case_.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{
                  opacity: 1,
                  scale: selectedCase === idx ? 1.05 : 1,
                }}
                transition={{ delay: 0.1 * idx }}
              >
                <GlowCard
                  className={`p-6 cursor-pointer transition-all ${
                    selectedCase === idx ? "ring-2 ring-brand shadow-2xl" : ""
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-text">{case_.name}</h3>
                      <p className="text-sm text-muted">{case_.program} Program</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        case_.status === "Active"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {case_.status}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted">Progress</span>
                      <span className="text-xs font-semibold text-brand">
                        {case_.progress}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-bg rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${case_.progress}%` }}
                        transition={{ delay: 0.5 + 0.1 * idx, duration: 1 }}
                        className="h-full bg-gradient-to-r from-brand to-brand2"
                      />
                    </div>
                  </div>

                  <div className="text-xs text-muted">
                    Last contact: {case_.lastContact}
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {selectedCase === idx && currentStep >= 2 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-border"
                      >
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-muted mb-1">Recent Activity</p>
                            <p className="text-sm text-text">
                              ✅ Completed job interview training
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted mb-1">Next Milestone</p>
                            <p className="text-sm text-text">
                              📋 Submit job applications (Due: 3 days)
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted mb-1">Upcoming</p>
                            <p className="text-sm text-text">
                              📅 Check-in meeting - Tomorrow 2:00 PM
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </GlowCard>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Actions */}
          <AnimatePresence>
            {showActions && currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
              >
                <GlowCard className="flex items-center gap-4 p-6 shadow-2xl">
                  {[
                    { icon: "💬", label: "Send Message" },
                    { icon: "📅", label: "Schedule Meeting" },
                    { icon: "📝", label: "Update Notes" },
                    { icon: "📊", label: "View Reports" },
                  ].map((action, idx) => (
                    <motion.button
                      key={idx}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1 * idx }}
                      className="flex flex-col items-center gap-2 px-6 py-4 rounded-lg bg-bg hover:bg-brand/10 transition-all group"
                    >
                      <span className="text-3xl group-hover:scale-110 transition-transform">
                        {action.icon}
                      </span>
                      <span className="text-xs text-muted group-hover:text-text transition-colors">
                        {action.label}
                      </span>
                    </motion.button>
                  ))}
                </GlowCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Closing Card - Step 4 */}
      <AnimatePresence>
        {currentStep === 4 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-bg/95 backdrop-blur z-40"
          >
            <div className="text-center max-w-2xl px-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-8"
              >
                <h2 className="text-5xl font-extrabold tracking-tight text-text mb-4">
                  Stay Organized.
                </h2>
                <h2 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-brand to-brand2 bg-clip-text text-transparent mb-6">
                  Track Progress.
                </h2>
                <p className="text-xl text-muted">
                  Manage all your cases from one powerful dashboard
                </p>
              </motion.div>

              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="px-8 py-4 rounded-lg bg-gradient-to-r from-brand to-brand2 text-bg font-semibold text-lg hover:shadow-glow transition-all"
              >
                Get Started Today
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Indicator */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-50">
        {steps.map((_, idx) => (
          <div
            key={idx}
            className={`h-2 rounded-full transition-all ${
              idx === currentStep
                ? "w-8 bg-brand"
                : idx < currentStep
                ? "w-2 bg-brand/50"
                : "w-2 bg-muted/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
