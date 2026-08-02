"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";

const existingMessages = [
  { id: 1, sender: "casemgr", text: "Hi Marcus! Just checking in. How did your interview go yesterday?", time: "2 days ago" },
  { id: 2, sender: "client", text: "It went really well! They seemed interested and said they'll get back to me next week.", time: "2 days ago" },
  { id: 3, sender: "casemgr", text: "That's fantastic news! Let's schedule a follow-up to prepare for the next steps.", time: "1 day ago" },
];

export default function ConnectionDemoPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [messages, setMessages] = useState(existingMessages);
  const [newMessage, setNewMessage] = useState("");
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduled, setScheduled] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;

    if (currentStep === 0) {
      setTimeout(() => setCurrentStep(1), 2500);
    } else if (currentStep === 1) {
      setTimeout(() => {
        setNewMessage("Can we schedule a meeting to discuss next steps?");
        setTimeout(() => setCurrentStep(2), 2000);
      }, 2000);
    } else if (currentStep === 2) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          sender: "client",
          text: "Can we schedule a meeting to discuss next steps?",
          time: "Just now"
        }]);
        setNewMessage("");
        setTimeout(() => setCurrentStep(3), 2000);
      }, 1500);
    } else if (currentStep === 3) {
      setTimeout(() => {
        setShowSchedule(true);
        setTimeout(() => setCurrentStep(4), 3000);
      }, 1000);
    } else if (currentStep === 4) {
      setTimeout(() => {
        setScheduled(true);
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          sender: "system",
          text: "📅 Meeting scheduled: Tomorrow at 2:00 PM with Sarah (Case Manager)",
          time: "Just now"
        }]);
        setTimeout(() => setCurrentStep(5), 3000);
      }, 1500);
    } else if (currentStep === 5) {
      setTimeout(() => {
        setCurrentStep(0);
        setMessages(existingMessages);
        setNewMessage("");
        setShowSchedule(false);
        setScheduled(false);
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
            setMessages(existingMessages);
            setNewMessage("");
            setShowSchedule(false);
            setScheduled(false);
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
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-8xl mb-6"
              >
                🔗
              </motion.div>
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-5xl font-extrabold tracking-tight text-text mb-4"
              >
                Secure Connection
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="text-xl text-muted"
              >
                Client ↔ Case Manager Communication
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messaging Interface */}
      {currentStep >= 1 && (
        <div className="mx-auto max-w-5xl px-7 py-8 h-screen flex flex-col">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <GlowCard className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand to-brand2 flex items-center justify-center text-2xl">
                  👤
                </div>
                <div>
                  <h2 className="text-lg font-bold text-text">Sarah Williams</h2>
                  <p className="text-sm text-green-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400"></span>
                    Your Case Manager • Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg glass hover:bg-brand/10 transition">
                  <span className="text-xl">📞</span>
                </button>
                <button className="p-2 rounded-lg glass hover:bg-brand/10 transition">
                  <span className="text-xl">📹</span>
                </button>
              </div>
            </GlowCard>
          </motion.div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto mb-6 space-y-4">
            <AnimatePresence>
              {messages.map((msg, idx) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className={`flex ${msg.sender === "client" ? "justify-end" : "justify-start"}`}
                >
                  {msg.sender === "system" ? (
                    <div className="max-w-[80%] rounded-lg bg-brand/10 border border-brand/30 px-6 py-4 text-center">
                      <p className="text-sm text-text">{msg.text}</p>
                      <p className="text-xs text-muted mt-2">{msg.time}</p>
                    </div>
                  ) : (
                    <div className="max-w-[70%]">
                      <div
                        className={`rounded-2xl px-6 py-4 ${
                          msg.sender === "client"
                            ? "bg-gradient-to-r from-brand to-brand2 text-bg"
                            : "glass text-text"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                      </div>
                      <p className="text-xs text-muted mt-1 px-2">{msg.time}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Schedule Modal */}
          <AnimatePresence>
            {showSchedule && !scheduled && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur z-50"
              >
                <GlowCard className="max-w-md w-full mx-4 p-6">
                  <h3 className="text-xl font-bold text-text mb-4">Schedule Meeting</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-muted mb-2 block">Date</label>
                      <div className="glass rounded-lg px-4 py-3 text-text">
                        Tomorrow - January 29, 2026
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-muted mb-2 block">Time</label>
                      <div className="glass rounded-lg px-4 py-3 text-text">
                        2:00 PM - 3:00 PM
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-muted mb-2 block">Meeting Type</label>
                      <div className="glass rounded-lg px-4 py-3 text-text">
                        Video Call
                      </div>
                    </div>
                    <button className="w-full py-3 rounded-lg bg-gradient-to-r from-brand to-brand2 text-bg font-semibold hover:shadow-glow transition">
                      Confirm Meeting
                    </button>
                  </div>
                </GlowCard>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Actions */}
          {currentStep >= 3 && !showSchedule && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              <div className="flex gap-2">
                {[
                  { icon: "📅", label: "Schedule", active: true },
                  { icon: "📎", label: "Attach" },
                  { icon: "📋", label: "Resources" },
                  { icon: "🔔", label: "Reminders" },
                ].map((action, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 * idx }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition ${
                      action.active
                        ? "bg-brand/20 text-brand border border-brand/30"
                        : "glass text-text hover:bg-brand/10"
                    }`}
                  >
                    <span>{action.icon}</span>
                    <span>{action.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Input Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlowCard className="p-4 flex items-center gap-4">
              <button className="p-2 text-2xl hover:scale-110 transition">📎</button>
              <input
                type="text"
                value={newMessage}
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
                className="mb-8"
              >
                <h2 className="text-5xl font-extrabold tracking-tight text-text mb-4">
                  Stay Connected.
                </h2>
                <h2 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-brand to-brand2 bg-clip-text text-transparent mb-6">
                  Achieve Together.
                </h2>
                <p className="text-xl text-muted">
                  Secure communication between clients and case managers
                </p>
              </motion.div>

              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="px-8 py-4 rounded-lg bg-gradient-to-r from-brand to-brand2 text-bg font-semibold text-lg hover:shadow-glow transition-all"
              >
                Start Messaging
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
