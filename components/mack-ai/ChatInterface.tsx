'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, User, Bot, RefreshCcw } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
}

export const MackAiChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // This is where you call your Supabase Edge Function / API
    // For now, we simulate the "Phenomenal" response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Based on your welding background and the 2026 San Diego Housing First initiative, I've found 3 local SLEs (Sober Living Environments) with immediate openings near Chula Vista. Would you like the contact info?",
        sources: ['SD_Housing_2026.pdf', 'CalAIM_Manual_v2']
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 p-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <Sparkles className="text-blue-400 w-5 h-5" />
          <h2 className="font-bold tracking-tight">MackAi 2.0</h2>
        </div>
        <button onClick={() => setMessages([])} className="hover:rotate-180 transition-transform duration-500">
          <RefreshCcw size={18} className="text-slate-400" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${
                msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  {msg.role === 'user' ? <User size={12} /> : <Bot size={12} className="text-blue-600" />}
                  <span className="text-[10px] uppercase font-bold tracking-widest opacity-70">
                    {msg.role}
                  </span>
                </div>
                <p className="text-sm leading-relaxed">{msg.content}</p>
                {msg.sources && (
                  <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                    {msg.sources.map(s => (
                      <span key={s} className="text-[9px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-500 italic">
                        Source: {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white text-slate-800 border border-slate-200 rounded-2xl rounded-tl-none p-3 shadow-sm">
              <div className="flex items-center gap-2">
                <Bot size={12} className="text-blue-600" />
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask MackAi about San Diego resources..."
            className="w-full p-3 pr-12 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
          />
          <button 
            type="submit" 
            disabled={isTyping}
            className="absolute right-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};
