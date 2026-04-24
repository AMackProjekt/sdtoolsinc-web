"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/cn";

export interface TourStep {
  target: string;
  title: string;
  body: string;
  placement?: "right" | "left" | "top" | "bottom";
}

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const PAD = 8;

export function PortalWalkthrough({
  steps,
  onComplete,
}: {
  steps: TourStep[];
  onComplete: () => void;
}) {
  const [stepIdx, setStepIdx] = useState(0);
  const [spotlight, setSpotlight] = useState<SpotlightRect | null>(null);
  const [bubblePos, setBubblePos] = useState<{ top: number; left: number } | null>(null);

  const currentStep = steps[stepIdx];

  const measureStep = useCallback(() => {
    if (!currentStep) return;
    const el = document.querySelector(currentStep.target) as HTMLElement | null;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const sr: SpotlightRect = {
      top: rect.top - PAD,
      left: rect.left - PAD,
      width: rect.width + PAD * 2,
      height: rect.height + PAD * 2,
    };
    setSpotlight(sr);

    const placement = currentStep.placement ?? "right";
    const BUBBLE_W = 260;
    const BUBBLE_H = 140;
    const GAP = 16;

    let bTop = sr.top + sr.height / 2 - BUBBLE_H / 2;
    let bLeft = sr.left + sr.width + GAP;

    if (placement === "left") {
      bLeft = sr.left - BUBBLE_W - GAP;
    } else if (placement === "top") {
      bTop = sr.top - BUBBLE_H - GAP;
      bLeft = sr.left + sr.width / 2 - BUBBLE_W / 2;
    } else if (placement === "bottom") {
      bTop = sr.top + sr.height + GAP;
      bLeft = sr.left + sr.width / 2 - BUBBLE_W / 2;
    }

    // clamp to viewport
    bTop = Math.max(16, Math.min(bTop, window.innerHeight - BUBBLE_H - 16));
    bLeft = Math.max(16, Math.min(bLeft, window.innerWidth - BUBBLE_W - 16));
    setBubblePos({ top: bTop, left: bLeft });
  }, [currentStep]);

  useEffect(() => {
    measureStep();
    window.addEventListener("resize", measureStep);
    return () => window.removeEventListener("resize", measureStep);
  }, [measureStep]);

  const handleNext = () => {
    if (stepIdx < steps.length - 1) {
      setStepIdx((i) => i + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => setStepIdx((i) => Math.max(0, i - 1));

  return (
    <div className="fixed inset-0 z-[180]">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Spotlight cutout */}
      {spotlight && (
        <div
          className="absolute z-[181] rounded-lg pointer-events-none"
          style={{
            top: spotlight.top,
            left: spotlight.left,
            width: spotlight.width,
            height: spotlight.height,
            boxShadow:
              "0 0 0 3px #14b8a6, 0 0 0 8px rgba(20,184,166,0.25), 0 0 0 9999px rgba(0,0,0,0.55)",
          }}
        />
      )}

      {/* Tooltip bubble */}
      <AnimatePresence mode="wait">
        {bubblePos && (
          <motion.div
            key={stepIdx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute z-[182] w-[260px] rounded-2xl border border-slate-700 bg-slate-900/95 p-4 shadow-2xl backdrop-blur"
            style={{ top: bubblePos.top, left: bubblePos.left }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <p className="text-white font-bold text-sm leading-tight">{currentStep.title}</p>
              <button
                onClick={onComplete}
                className="text-slate-500 hover:text-white transition ml-2 shrink-0"
                aria-label="Skip tour"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-slate-300 text-xs leading-relaxed mb-4">{currentStep.body}</p>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {stepIdx + 1} of {steps.length}
              </span>
              <div className="flex items-center gap-2">
                {stepIdx > 0 && (
                  <button
                    onClick={handlePrev}
                    className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className={cn(
                    "flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition",
                    stepIdx < steps.length - 1
                      ? "bg-teal-500 text-slate-900 hover:bg-teal-400"
                      : "bg-green-500 text-slate-900 hover:bg-green-400"
                  )}
                >
                  {stepIdx < steps.length - 1 ? (
                    <>Next <ChevronRight className="w-3 h-3" /></>
                  ) : (
                    "Done!"
                  )}
                </button>
              </div>
            </div>

            {/* Progress dots */}
            <div className="flex gap-1 mt-3 justify-center">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1 rounded-full transition-all",
                    i === stepIdx ? "w-4 bg-teal-400" : "w-1.5 bg-slate-700"
                  )}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
