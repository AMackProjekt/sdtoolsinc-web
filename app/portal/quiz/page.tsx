"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import { getQuizByCourseId, calculateScore, isPassing, QuizAttempt } from "@/lib/quizData";
import { QuizQuestion } from "@/components/ui/QuizQuestion";
import { QuizResults } from "@/components/ui/QuizResults";
import { cn } from "@/lib/cn";

export const dynamic = "force-static";

export default function QuizPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, updateProfile } = useAuth();
  const courseId = searchParams?.get("courseId") as string;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizStartTime, setQuizStartTime] = useState<Date | null>(null);
  const [score, setScore] = useState(0);

  const quiz = getQuizByCourseId(courseId);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/portal/auth");
      return;
    }

    if (!quiz) {
      router.push("/portal/courses");
      return;
    }

    // Initialize answers array
    if (answers.length === 0) {
      setAnswers(new Array(quiz.totalQuestions).fill(null));
      setQuizStartTime(new Date());
    }
  }, [isAuthenticated, quiz, router, answers.length]);

  if (!quiz || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-muted">Loading...</div>
      </div>
    );
  }

  if (showResults) {
    const passed = isPassing(score, quiz.passingScore);
    const currentAttempts = user.completedLessons?.filter(l => l.includes(courseId + "-attempt"))?.length + 1 || 1;

    return (
      <div className="min-h-screen bg-bg">
        <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />

        <header className="border-b border-border bg-panel/50 backdrop-blur-xl">
          <div className="mx-auto max-w-container px-7 py-4">
            <button
              onClick={() => router.push("/portal/courses")}
              className="text-brand hover:text-brand2"
            >
              ← Back to Courses
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-2xl px-7 py-12">
          <QuizResults
            quiz={quiz}
            score={score}
            passed={passed}
            totalAttempts={currentAttempts}
            onRetry={() => {
              setCurrentQuestion(0);
              setAnswers(new Array(quiz.totalQuestions).fill(null));
              setShowResults(false);
              setShowExplanation(false);
              setQuizStartTime(new Date());
            }}
            onDone={() => {
              if (passed) {
                // Certificate download would go here
                router.push(`/portal/certificates?course=${courseId}`);
              } else {
                router.push(`/portal/course?id=${courseId}`);
              }
            }}
          />
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const selectedAnswer = answers[currentQuestion];
  const isAnswered = selectedAnswer !== null;
  const isLastQuestion = currentQuestion === quiz.totalQuestions - 1;

  const handleSelectAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // Calculate final score
      const finalScore = calculateScore({
        id: Date.now().toString(),
        courseId,
        userId: user.id,
        startTime: quizStartTime?.toISOString() || new Date().toISOString(),
        answers,
      } as QuizAttempt, quiz);

      setScore(finalScore);

      // Save certificate if passed
      if (isPassing(finalScore, quiz.passingScore)) {
        const newCert = {
          courseId,
          courseName: quiz.courseName,
          completionDate: new Date().toISOString().split('T')[0],
          certificateId: `CERT-${Date.now()}`,
          score: finalScore,
        };

        updateProfile({
          certificates: [...(user.certificates || []), newCert],
          completedLessons: [
            ...(user.completedLessons || []),
            `${courseId}-completed`,
          ],
        });
      }

      setShowResults(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowExplanation(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />

      {/* Header */}
      <header className="border-b border-border bg-panel/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="mx-auto max-w-container px-7 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-text">{quiz.courseName}</h1>
            <p className="text-sm text-muted">Quiz Assessment</p>
          </div>
          <button
            onClick={() => router.push("/portal/courses")}
            className="text-sm text-muted hover:text-text transition-colors"
          >
            Exit Quiz
          </button>
        </div>
      </header>

      {/* Quiz Container */}
      <div className="mx-auto max-w-2xl px-7 py-12">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <QuizQuestion
            question={question}
            questionNumber={currentQuestion + 1}
            totalQuestions={quiz.totalQuestions}
            selectedAnswer={selectedAnswer}
            onSelectAnswer={handleSelectAnswer}
            showExplanation={showExplanation}
          />
        </motion.div>

        {/* Controls */}
        <motion.div
          className="flex gap-4 mt-12 justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className={cn(
              "px-6 py-3 rounded-lg font-semibold transition-all",
              currentQuestion === 0
                ? "opacity-50 cursor-not-allowed text-muted"
                : "text-brand border border-brand hover:bg-brand/10"
            )}
          >
            ← Previous
          </button>

          <div className="text-sm text-muted">
            {currentQuestion + 1} / {quiz.totalQuestions}
          </div>

          <motion.button
            onClick={handleNext}
            disabled={!isAnswered}
            whileHover={isAnswered ? { y: -2 } : {}}
            className={cn(
              "px-6 py-3 rounded-lg font-semibold transition-all",
              isAnswered
                ? "bg-gradient-to-r from-brand to-brand2 text-[#02131a] hover:shadow-glow"
                : "opacity-50 cursor-not-allowed bg-gray-600/50 text-muted"
            )}
          >
            {isLastQuestion ? "Finish Quiz" : "Next →"}
          </motion.button>
        </motion.div>

        {/* Info */}
        <div className="mt-8 p-4 rounded-lg bg-panel border border-border text-center text-sm text-muted">
          <p>📝 Passing score: <span className="text-brand font-semibold">{quiz.passingScore}%</span></p>
          <p className="mt-1">⏱️ Estimated time: <span className="font-semibold">{quiz.estimatedTime} minutes</span></p>
        </div>
      </div>
    </div>
  );
}
