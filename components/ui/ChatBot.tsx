"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import { getMackAiInstance } from "@/lib/mackai";
import type { AIModule } from "@/lib/mackai";

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  requestId?: string;
  module?: AIModule;
};

// Initialize MackAi service
const mackaiService = getMackAiInstance();

async function getBotResponse(userMessage: string): Promise<{ text: string; requestId: string; module: AIModule }> {
  try {
    // Use cascade module for intelligent routing
    const response = await mackaiService.processRequest({
      module: 'cascade',
      input: userMessage,
      sessionId: typeof window !== 'undefined' ? window.sessionStorage.getItem('mackai_session') || undefined : undefined,
    });

    return {
      text: response.output,
      requestId: response.metadata?.requestId || '',
      module: response.module,
    };
  } catch (error) {
    console.error('MackAi error:', error);
    return {
      text: "I'd be happy to help you with information about our programs, support services, or how to get started. You can also visit our Interest Form page or Contact us directly for personalized assistance.",
      requestId: '',
      module: 'chatgpt',
    };
  }
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hi! I'm MackAi, your T.O.O.L.S Inc assistant. Ask me about our programs, how to get support, or anything else!",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userInput = input;
    setInput("");
    setIsTyping(true);

    try {
      // Get response from MackAi
      const response = await getBotResponse(userInput);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: "bot",
        timestamp: new Date(),
        requestId: response.requestId,
        module: response.module,
      };
      
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize for the inconvenience. Please try again or contact support if the issue persists.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    "Programs",
    "Get Support",
    "Referral Process",
    "Contact Info",
  ];

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50",
          "flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full",
          "bg-gradient-to-br from-brand to-brand2 text-white shadow-glow",
          "hover:shadow-xl transition-shadow"
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open chat"
      >
        {isOpen ? (
          <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "fixed z-50 bg-panel border border-border shadow-glow overflow-hidden flex flex-col",
              "inset-0 rounded-none sm:inset-auto",
              "sm:bottom-20 sm:right-4 sm:w-[360px] sm:h-[550px] sm:rounded-xl",
              "md:bottom-24 md:right-6 md:w-[380px] md:h-[600px]",
              "lg:w-[400px] lg:h-[650px]"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border bg-bg/50 backdrop-blur-sm">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-brand to-brand2 flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                  MA
                </div>
                <div>
                  <div className="font-semibold text-text text-sm sm:text-base">MackAi</div>
                  <div className="text-xs text-muted">Always here to help</div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex",
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] sm:max-w-[80%] rounded-lg px-3 py-2 sm:px-4 text-xs sm:text-sm",
                      msg.sender === "user"
                        ? "bg-gradient-to-br from-brand to-brand2 text-white"
                        : "glass text-text"
                    )}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="glass rounded-lg px-3 py-2 sm:px-4 text-xs sm:text-sm">
                    <div className="flex gap-1">
                      <span className="animate-bounce [animation-delay:0ms]">●</span>
                      <span className="animate-bounce [animation-delay:150ms]">●</span>
                      <span className="animate-bounce [animation-delay:300ms]">●</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length <= 2 && (
              <div className="px-3 sm:px-4 pb-2">
                <div className="text-xs text-muted mb-2">Quick questions:</div>
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action) => (
                    <button
                      key={action}
                      onClick={() => {
                        setInput(action);
                        setTimeout(() => handleSend(), 100);
                      }}
                      className="text-xs px-3 py-1 rounded-full glass hover:shadow-glow transition-shadow text-text"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-3 sm:p-4 border-t border-border bg-bg/50 backdrop-blur-sm">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 rounded-lg bg-panel border border-border px-3 py-2 sm:px-4 text-xs sm:text-sm text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand/50"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className={cn(
                    "px-3 py-2 sm:px-4 rounded-lg font-semibold text-xs sm:text-sm transition-all",
                    input.trim()
                      ? "bg-gradient-to-br from-brand to-brand2 text-white hover:shadow-glow"
                      : "bg-panel text-muted cursor-not-allowed"
                  )}
                >
                  Send
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
