"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";

const courses = [
  {
    id: 1,
    title: "Resume Building Essentials",
    category: "Employment",
    duration: "2 hours",
    lessons: 8,
    progress: 75,
    color: "from-blue-500 to-cyan-500",
    icon: "📝"
  },
  {
    id: 2,
    title: "Interview Skills Mastery",
    category: "Employment",
    duration: "1.5 hours",
    lessons: 6,
    progress: 60,
    color: "from-purple-500 to-pink-500",
    icon: "🎯"
  },
  {
    id: 3,
    title: "Financial Literacy 101",
    category: "Life Skills",
    duration: "3 hours",
    lessons: 12,
    progress: 30,
    color: "from-green-500 to-emerald-500",
    icon: "💰"
  },
  {
    id: 4,
    title: "Communication Excellence",
    category: "Soft Skills",
    duration: "2.5 hours",
    lessons: 10,
    progress: 0,
    color: "from-orange-500 to-red-500",
    icon: "💬"
  },
];

export default function EducationalDemoPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [showEnroll, setShowEnroll] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setTimeout(() => {
      if (currentStep === 0) {
        setTimeout(() => setCurrentStep(1), 2000);
      } else if (currentStep === 1) {
        setSelectedCourse(0);
        setTimeout(() => setCurrentStep(2), 3000);
      } else if (currentStep === 2) {
        setShowEnroll(true);
        setTimeout(() => setCurrentStep(3), 3000);
      } else if (currentStep === 3) {
        setEnrolled(true);
        setTimeout(() => setCurrentStep(4), 3000);
      } else if (currentStep === 4) {
        setTimeout(() => setCurrentStep(5), 4000);
      } else if (currentStep === 5) {
        setTimeout(() => {
          setCurrentStep(0);
          setSelectedCourse(null);
          setShowEnroll(false);
          setEnrolled(false);
        }, 3000);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [currentStep, autoPlay]);

  return (
    <div className="min-h-screen bg-bg overflow-hidden">
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
            setSelectedCourse(null);
            setShowEnroll(false);
            setEnrolled(false);
          }}
          className="px-4 py-2 rounded-lg bg-panel border border-border text-text text-sm font-medium hover:bg-brand/10 transition"
        >
          🔄 Restart
        </button>
      </div>

      {/* Title Card */}
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
                📚
              </motion.div>
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-5xl font-extrabold tracking-tight text-text mb-4"
              >
                Educational Resources
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="text-xl text-muted"
              >
                Learn at Your Own Pace
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Course Catalog */}
      {currentStep >= 1 && currentStep <= 4 && (
        <div className="mx-auto max-w-7xl px-7 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-extrabold tracking-tight text-text">
              Course Catalog
            </h1>
            <p className="mt-2 text-muted">Browse and enroll in courses designed for your success</p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4">
              <div className="flex-1 glass rounded-lg px-4 py-3 flex items-center gap-3">
                <span className="text-muted">🔍</span>
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="bg-transparent border-none outline-none text-text w-full"
                  disabled
                />
              </div>
              <button className="glass rounded-lg px-6 py-3 text-text font-medium hover:shadow-glow transition">
                Filter
              </button>
            </div>
          </motion.div>

          {/* Courses Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 gap-6"
          >
            {courses.map((course, idx) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{
                  opacity: 1,
                  scale: selectedCourse === idx ? 1.02 : 1,
                }}
                transition={{ delay: 0.1 * idx }}
              >
                <GlowCard
                  className={`overflow-hidden cursor-pointer transition-all ${
                    selectedCourse === idx ? "ring-2 ring-brand shadow-2xl" : ""
                  }`}
                >
                  {/* Course Header with Icon */}
                  <div className={`h-32 bg-gradient-to-br ${course.color} opacity-20 flex items-center justify-center relative`}>
                    <div className="text-6xl">{course.icon}</div>
                    {course.progress > 0 && (
                      <div className="absolute top-2 right-2 bg-bg/80 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-green-400">
                        {course.progress}% Complete
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="mb-3">
                      <span className="text-xs px-3 py-1 rounded-full bg-brand/10 text-brand font-semibold">
                        {course.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-text mb-2">{course.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted mb-4">
                      <span>⏱️ {course.duration}</span>
                      <span>📖 {course.lessons} lessons</span>
                    </div>

                    {/* Progress Bar */}
                    {course.progress > 0 && (
                      <div className="mb-4">
                        <div className="w-full h-2 bg-bg rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${course.progress}%` }}
                            transition={{ delay: 0.5 + 0.1 * idx, duration: 1 }}
                            className="h-full bg-gradient-to-r from-brand to-brand2"
                          />
                        </div>
                      </div>
                    )}

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {selectedCourse === idx && currentStep >= 2 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t border-border"
                        >
                          <div className="space-y-3 mb-4">
                            <div>
                              <p className="text-xs text-muted mb-2">Course Modules:</p>
                              <ul className="space-y-1 text-sm text-text">
                                <li>✅ Module 1: Introduction</li>
                                <li>✅ Module 2: Core Concepts</li>
                                <li>⏳ Module 3: Advanced Topics</li>
                                <li>🔒 Module 4: Final Project</li>
                              </ul>
                            </div>
                            <div>
                              <p className="text-xs text-muted mb-1">What You'll Learn:</p>
                              <p className="text-sm text-text">
                                Master essential skills with hands-on practice and real-world examples.
                              </p>
                            </div>
                          </div>

                          {showEnroll && !enrolled && (
                            <motion.button
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="w-full py-3 rounded-lg bg-gradient-to-r from-brand to-brand2 text-bg font-semibold hover:shadow-glow transition-all"
                            >
                              Enroll Now
                            </motion.button>
                          )}

                          {enrolled && (
                            <motion.div
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="w-full py-3 rounded-lg bg-green-500/20 text-green-400 font-semibold text-center"
                            >
                              ✓ Enrolled Successfully!
                            </motion.div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </motion.div>

          {/* Progress View */}
          {enrolled && currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <GlowCard className="p-6">
                <h3 className="text-xl font-bold text-text mb-4">Your Progress</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl mb-2">📚</div>
                    <div className="text-2xl font-bold text-text">4</div>
                    <div className="text-xs text-muted">Enrolled Courses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">✅</div>
                    <div className="text-2xl font-bold text-text">12</div>
                    <div className="text-xs text-muted">Completed Lessons</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">🏆</div>
                    <div className="text-2xl font-bold text-text">2</div>
                    <div className="text-xs text-muted">Certificates Earned</div>
                  </div>
                </div>
              </GlowCard>
            </motion.div>
          )}
        </div>
      )}

      {/* Closing Card */}
      <AnimatePresence>
        {currentStep === 5 && (
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
                  Learn at Your Pace.
                </h2>
                <h2 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-brand to-brand2 bg-clip-text text-transparent mb-6">
                  Achieve Your Goals.
                </h2>
                <p className="text-xl text-muted">
                  Access quality education designed for your success
                </p>
              </motion.div>

              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="px-8 py-4 rounded-lg bg-gradient-to-r from-brand to-brand2 text-bg font-semibold text-lg hover:shadow-glow transition-all"
              >
                Start Learning Today
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Indicator */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-50">
        {[0, 1, 2, 3, 4, 5].map((idx) => (
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
