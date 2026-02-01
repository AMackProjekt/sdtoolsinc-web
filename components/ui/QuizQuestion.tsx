"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { Question } from "@/lib/quizData";

interface QuizQuestionProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  onSelectAnswer: (answerIndex: number) => void;
  showExplanation: boolean;
}

export function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
  showExplanation,
}: QuizQuestionProps) {
  const isAnswered = selectedAnswer !== null;
  const isCorrect = isAnswered && selectedAnswer === question.correctAnswer;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Progress Bar */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-muted">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="text-sm font-semibold text-brand">
            {Math.round((questionNumber / totalQuestions) * 100)}%
          </span>
        </div>
        <div className="w-full h-2 bg-bg rounded-full overflow-hidden border border-border">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${(questionNumber / totalQuestions) * 100}%`,
            }}
            className="h-full bg-gradient-to-r from-brand to-brand2"
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Difficulty Badge */}
      <div className="flex items-center gap-2">
        <span className={cn(
          "inline-block px-2 py-1 rounded text-xs font-semibold",
          question.difficulty === "easy" && "bg-green-500/20 text-green-400",
          question.difficulty === "medium" && "bg-yellow-500/20 text-yellow-400",
          question.difficulty === "hard" && "bg-red-500/20 text-red-400",
        )}>
          {question.difficulty.toUpperCase()}
        </span>
      </div>

      {/* Question */}
      <div>
        <h2 className="text-2xl font-bold text-text mb-8">
          {question.questionText}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectOption = index === question.correctAnswer;
            const showResult = showExplanation && isAnswered;

            return (
              <motion.button
                key={index}
                onClick={() => !isAnswered && onSelectAnswer(index)}
                whileHover={!isAnswered ? { scale: 1.02 } : {}}
                whileTap={!isAnswered ? { scale: 0.98 } : {}}
                disabled={isAnswered}
                className={cn(
                  "w-full p-4 rounded-lg border-2 text-left transition-all",
                  "disabled:cursor-default",
                  // Default state
                  !showResult && !isSelected && "border-border bg-bg/50 hover:border-brand/50 text-text",
                  // Selected but no result yet
                  !showResult && isSelected && "border-brand bg-brand/20 text-text",
                  // Showing results
                  showResult && isSelected && isCorrect && "border-green-500 bg-green-500/20 text-text",
                  showResult && isSelected && !isCorrect && "border-red-500 bg-red-500/20 text-text",
                  showResult && !isSelected && isCorrectOption && "border-green-500 bg-green-500/10 text-text",
                  showResult && !isSelected && !isCorrectOption && "border-border bg-bg/50 text-muted",
                )}
              >
                <div className="flex items-center gap-3">
                  {/* Radio Button */}
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                    !showResult && !isSelected && "border-border bg-bg",
                    !showResult && isSelected && "border-brand bg-brand",
                    showResult && isSelected && isCorrect && "border-green-500 bg-green-500",
                    showResult && isSelected && !isCorrect && "border-red-500 bg-red-500",
                    showResult && !isSelected && isCorrectOption && "border-green-500 bg-green-500/50",
                    showResult && !isSelected && !isCorrectOption && "border-border bg-bg",
                  )}>
                    {(isSelected || (showResult && isCorrectOption)) && (
                      <span className="text-[#02131a] text-sm font-bold">
                        {isCorrect || isCorrectOption ? "✓" : "✗"}
                      </span>
                    )}
                  </div>
                  <span className="text-base">{option}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Explanation */}
      {showExplanation && isAnswered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-4 rounded-lg border-l-4",
            isCorrect ? "border-l-green-500 bg-green-500/10 text-text" : "border-l-red-500 bg-red-500/10 text-text"
          )}
        >
          <div className="flex gap-2 mb-2">
            <span className="font-bold">{isCorrect ? "✓ Correct!" : "✗ Incorrect"}</span>
          </div>
          <p className="text-sm text-muted">{question.explanation}</p>
        </motion.div>
      )}
    </motion.div>
  );
}
