"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";

const conversation = [
  { role: "user", text: "I need motivation today", delay: 1000 },
  { role: "ai", text: "I understand you're looking for motivation. Remember, every step forward, no matter how small, is progress. Your journey with T.O.O.L.S Inc shows incredible courage and commitment. What specific challenge are you facing today?", delay: 3000 },
  { role: "user", text: "Help me set goals for this month", delay: 2000 },
  { role: "ai", text: "Great initiative! Let's break down your goals into achievable steps:\n\n1. **Career**: Complete 2 job applications\n2. **Skills**: Finish Resume Building course\n3. **Personal**: Attend weekly check-ins\n4. **Growth**: Practice interview skills\n\nWhich area would you like to focus on first?", delay: 4000 },
];

export default function MackAIDemoPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [messages, setMessages] = useState<typeof conversation>([]);
  const [typing, setTyping] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;

    if (currentStep === 0) {
      setTimeout(() => setCurrentStep(1), 2500);
    } else if (currentStep === 1) {
      // Start conversation
      let messageIndex = 0;
      const addMessage = () => {
        if (messageIndex < conversation.length) {
          const msg = conversation[messageIndex];
          
          if (msg.role === "ai") setTyping(true);
          
          setTimeout(() => {
            setMessages(prev => [...prev, msg]);
            if (msg.role === "ai") setTyping(false);
            messageIndex++;
            if (messageIndex < conversation.length) {
              addMessage();
            } else {
              setTimeout(() => setCurrentStep(2), 3000);
            }
          }, msg.delay);
        }
      };
      addMessage();
    } else if (currentStep === 2) {
      setTimeout(() => {
        setCurrentStep(0);
        setMessages([]);
        setTyping(false);
      }, 3000);
    }
  }, [currentStep, autoPlay]);

  return (
    <div className="min-h-screen bg-bg overflow-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />

      {/* Controls */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => setAutoPlay(!autoPlay)}
          className="px-4 py-2 rounded-lg bg-panel border border-border text-text text-sm font-medium"
        >
          {autoPlay ? "⏸ Pause" : "▶ Play"}
        </button>
        <button
          onClick={() => {
            setCurrentStep(0);
            setMessages([]);
            setTyping(false);
          }}
          className="px-4 py-2 rounded-lg bg-panel border border-border text-text text-sm font-medium"
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
                animate={{ scale: 1, opacity: 1, rotate: [0, 10, -10, 0] }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-8xl mb-6"
              >
                🤖
              </motion.div>
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-5xl font-extrabold tracking-tight text-text mb-4"
              >
                MackAI Coach
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="text-xl text-muted"
              >
                Your Personal AI Motivational Coach
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Interface */}
      {currentStep >= 1 && (
        <div className="mx-auto max-w-4xl px-7 py-8 h-screen flex flex-col">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <GlowCard className="p-4 flex items-center gap-4">
              <div className="text-4xl">🤖</div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-text">MackAI Coach</h2>
                <p className="text-sm text-green-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  Online • Ready to help
                </p>
              </div>
            </GlowCard>
          </motion.div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto mb-6 space-y-4">
            <AnimatePresence>
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-6 py-4 ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-brand to-brand2 text-bg"
                        : "glass text-text"
                    }`}
                  >
                    {msg.role === "ai" && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">🤖</span>
                        <span className="text-xs font-semibold text-brand">MackAI</span>
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-line leading-relaxed">{msg.text}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {typing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="glass rounded-2xl px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-brand animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 rounded-full bg-brand animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 rounded-full bg-brand animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Suggested Actions */}
          {messages.length >= 4 && currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              <p className="text-xs text-muted mb-2">Suggested Actions:</p>
              <div className="flex gap-2">
                {["Set Weekly Goals", "Track Progress", "Get Motivated", "Learn More"].map((action, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 * idx }}
                    className="px-4 py-2 rounded-lg glass text-sm text-text hover:bg-brand/10 transition"
                  >
                    {action}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Input Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlowCard className="p-4 flex items-center gap-4">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 bg-transparent border-none outline-none text-text"
                disabled
              />
              <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-brand to-brand2 text-bg font-semibold hover:shadow-glow transition">
                Send
              </button>
            </GlowCard>
          </motion.div>
        </div>
      )}

      {/* Closing Card */}
      <AnimatePresence>
        {currentStep === 2 && (
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
                className="mb-8"
              >
                <h2 className="text-5xl font-extrabold tracking-tight text-text mb-4">
                  Available 24/7.
                </h2>
                <h2 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-brand to-brand2 bg-clip-text text-transparent mb-6">
                  Always Here to Help.
                </h2>
                <p className="text-xl text-muted">
                  Your personal AI coach for motivation, guidance, and support
                </p>
              </motion.div>

              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="px-8 py-4 rounded-lg bg-gradient-to-r from-brand to-brand2 text-bg font-semibold text-lg hover:shadow-glow transition-all"
              >
                Start Chatting
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Indicator */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-50">
        {[0, 1, 2].map((idx) => (
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
