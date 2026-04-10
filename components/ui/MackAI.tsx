"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  text: string;
}

const MACKAI_RESPONSES: Record<string, string> = {
  greeting:
    "Hey! I'm Mack — your AI guide here at T.O.O.LS Inc. I can help you navigate the portal, find courses, or just chat. What's on your mind?",
  help: "Sure! Here are a few things I can help with:\n• Finding and enrolling in courses\n• Understanding your progress and goals\n• Locating resources and documents\n• Navigating the portal\n• Connecting with your case manager\nWhat would you like to explore?",
  courses:
    "Your course catalog is packed! Browse everything from life skills and financial literacy to job readiness and digital skills. Head to **My Courses** in the sidebar to get started. Want a recommendation?",
  resources:
    "Resources include downloadable guides, community referrals, emergency support contacts, and partner organization links. Check the **Resources** tab in your portal for the full library.",
  profile:
    "Your profile keeps track of your progress, goals, and personal details. You can update it anytime in **My Profile** — including your contact info, preferences, and privacy settings.",
  progress:
    "Tracking progress is key! Your dashboard shows wellness scores, course completion, and goal milestones at a glance. Keep building — every step forward counts!",
  casemgr:
    "Your case manager is your primary support contact. Use the **Messages** tab to send them a note or request a meeting. They're here for you.",
  polite:
    "You're very welcome! It's my pleasure to help. Feel free to ask anything — I'm here whenever you need me. 😊",
  default:
    "That's a great question! I'm still learning, but I can point you toward courses, resources, or your case manager for more specific help. What would you like to do?",
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  if (/hello|hi|hey|good morning|good afternoon|what.*your name|who are you/.test(lower))
    return MACKAI_RESPONSES.greeting;
  if (/help|what can you do|assist|support/.test(lower))
    return MACKAI_RESPONSES.help;
  if (/course|class|lesson|learn|enroll|module/.test(lower))
    return MACKAI_RESPONSES.courses;
  if (/resource|document|guide|referral|download/.test(lower))
    return MACKAI_RESPONSES.resources;
  if (/profile|account|settings|update my/.test(lower))
    return MACKAI_RESPONSES.profile;
  if (/progress|score|goal|milestone|achievement|streak/.test(lower))
    return MACKAI_RESPONSES.progress;
  if (/case manager|caseworker|manager|staff|counselor|meeting/.test(lower))
    return MACKAI_RESPONSES.casemgr;
  if (/thank|thanks|appreciate|great|awesome/.test(lower))
    return MACKAI_RESPONSES.polite;
  return MACKAI_RESPONSES.default;
}

export function MackAI() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Hi! I'm Mack, your AI assistant 👋 How can I help you today?" },
  ]);
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const reply = getResponse(trimmed);
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
      setTyping(false);
    }, 900 + Math.random() * 500);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="w-80 rounded-2xl border border-slate-700/60 bg-slate-900 shadow-2xl flex flex-col overflow-hidden"
            style={{ height: 420 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50 bg-gradient-to-r from-sky-600/20 to-violet-600/20">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-500 to-violet-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white leading-none">Mack AI</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">T.O.O.LS Inc Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-700/50"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2 scrollbar-thin scrollbar-thumb-slate-700">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-line ${
                      m.role === "user"
                        ? "bg-sky-600 text-white rounded-br-sm"
                        : "bg-slate-700/80 text-slate-100 rounded-bl-sm"
                    }`}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-slate-700/80 rounded-2xl rounded-bl-sm px-3 py-2.5 flex gap-1 items-center">
                    {[0, 1, 2].map((d) => (
                      <motion.span
                        key={d}
                        className="w-1.5 h-1.5 rounded-full bg-slate-400 block"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: d * 0.15 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="px-3 py-2 border-t border-slate-700/50 flex gap-2 items-center">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Mack anything…"
                className="flex-1 bg-slate-800 border border-slate-700/50 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-sky-500/60 transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500 to-violet-600 flex items-center justify-center text-white hover:opacity-90 transition-opacity disabled:opacity-40 flex-shrink-0"
                aria-label="Send message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((v) => !v)}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-sky-500 to-violet-600 shadow-lg shadow-violet-900/40 flex items-center justify-center text-white relative"
        aria-label="Open Mack AI"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
              <X className="w-6 h-6" />
            </motion.span>
          ) : (
            <motion.span key="bot" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
              <Sparkles className="w-6 h-6" />
            </motion.span>
          )}
        </AnimatePresence>
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-slate-900 animate-pulse" />
        )}
      </motion.button>
    </div>
  );
}
