"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { Quiz } from "@/lib/quizData";

interface QuizResultsProps {
  quiz: Quiz;
  score: number;
  passed: boolean;
  totalAttempts: number;
  onRetry: () => void;
  onDone: () => void;
}

export function QuizResults({
  quiz,
  score,
  passed,
  totalAttempts,
  onRetry,
  onDone,
}: QuizResultsProps) {
  const percentageOfMax = Math.round(score);
  const correctAnswers = Math.round((score / 100) * quiz.totalQuestions);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8 max-w-2xl mx-auto"
    >
      {/* Result Header */}
      <div className="text-center space-y-4">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.6 }}
          className={cn(
            "inline-flex items-center justify-center w-24 h-24 rounded-full text-6xl",
            passed ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
          )}
        >
          {passed ? "🎉" : "📚"}
        </motion.div>

        <div>
          <h1 className={cn(
            "text-4xl font-extrabold mb-2",
            passed ? "text-green-400" : "text-yellow-400"
          )}>
            {passed ? "Excellent Work!" : "Keep Practicing"}
          </h1>
          <p className="text-xl text-muted">
            {passed
              ? `You've mastered "${quiz.courseName}"`
              : `Review the material and try again`}
          </p>
        </div>
      </div>

      {/* Score Display */}
      <motion.div
        className="grid grid-cols-3 gap-4 p-6 bg-panel rounded-lg border border-border"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="text-center">
          <div className="text-4xl font-extrabold text-brand mb-2">{percentageOfMax}%</div>
          <div className="text-sm text-muted">Your Score</div>
        </div>
        <div className="text-center border-l border-r border-border">
          <div className="text-4xl font-extrabold text-brand2 mb-2">{correctAnswers}/{quiz.totalQuestions}</div>
          <div className="text-sm text-muted">Correct Answers</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-extrabold text-accent mb-2">{quiz.passingScore}%</div>
          <div className="text-sm text-muted">Passing Score</div>
        </div>
      </motion.div>

      {/* Circular Progress */}
      <div className="flex justify-center">
        <div className="relative inline-flex items-center justify-center">
          <svg className="w-40 h-40" viewBox="0 0 200 200">
            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="4"
            />
            {/* Progress circle */}
            <motion.circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="url(#scoreGradient)"
              strokeWidth="4"
              strokeDasharray={`${2 * Math.PI * 90}`}
              initial={{ strokeDashoffset: `${2 * Math.PI * 90}` }}
              animate={{
                strokeDashoffset: `${2 * Math.PI * 90 * (1 - percentageOfMax / 100)}`,
              }}
              transition={{ duration: 1, ease: "easeOut" }}
              strokeLinecap="round"
              transform="rotate(-90 100 100)"
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#2dd4bf" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl font-extrabold text-brand">{percentageOfMax}%</div>
              <div className="text-xs text-muted mt-1">Complete</div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-panel border border-border">
          <div className="text-sm text-muted mb-1">Status</div>
          <div className={cn(
            "text-lg font-bold",
            passed ? "text-green-400" : "text-yellow-400"
          )}>
            {passed ? "✓ PASSED" : "✗ REVIEW"}
          </div>
        </div>
        <div className="p-4 rounded-lg bg-panel border border-border">
          <div className="text-sm text-muted mb-1">Attempts</div>
          <div className="text-lg font-bold text-text">{totalAttempts}</div>
        </div>
      </div>

      {/* Feedback */}
      {!passed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/50 text-yellow-400"
        >
          <div className="font-semibold mb-2">💡 Keep Going!</div>
          <p className="text-sm text-yellow-400/80">
            You're close! Review the material and try again. Each attempt helps reinforce your learning.
          </p>
        </motion.div>
      )}

      {passed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 rounded-lg bg-green-500/10 border border-green-500/50 text-green-400"
        >
          <div className="font-semibold mb-2">🏆 Certificate Earned!</div>
          <p className="text-sm text-green-400/80">
            You've successfully completed this course. Your certificate is ready to download.
          </p>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        {!passed && (
          <motion.button
            onClick={onRetry}
            whileHover={{ y: -2 }}
            className="px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-brand to-brand2 text-[#02131a] hover:shadow-glow transition-all"
          >
            🔄 Try Again
          </motion.button>
        )}
        <motion.button
          onClick={onDone}
          whileHover={{ y: -2 }}
          className={cn(
            "px-6 py-3 rounded-lg font-semibold transition-all",
            passed
              ? "bg-gradient-to-r from-brand to-brand2 text-[#02131a] hover:shadow-glow"
              : "border border-brand text-brand hover:bg-brand/10"
          )}
        >
          {passed ? "📜 Download Certificate" : "← Back to Course"}
        </motion.button>
      </div>
    </motion.div>
  );
}
