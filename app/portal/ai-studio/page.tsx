"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/hooks/useAuth";
import { Navbar } from "@/components/ui/Navbar";
import { GlowCard } from "@/components/ui/GlowCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function AIStudioPage() {
  const { user, profile, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [openWebUIUrl, setOpenWebUIUrl] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    // Get Open WebUI URL from environment
    const url = process.env.NEXT_PUBLIC_OPENWEBUI_URL || 'http://localhost:8080';
    setOpenWebUIUrl(url);

    // Check if Open WebUI is accessible
    const checkConnection = async () => {
      try {
        const response = await fetch(`${url}/health`, { mode: 'no-cors' });
        setIsConnected(true);
      } catch (error) {
        console.warn('Open WebUI not accessible:', error);
        setIsConnected(false);
      }
    };

    checkConnection();
  }, []);

  if (!isAuthenticated) return null;

  const features = [
    {
      icon: "🤖",
      title: "Multi-Model Support",
      description: "Access multiple AI models including GPT-4, GPT-3.5, and more"
    },
    {
      icon: "📚",
      title: "RAG (Retrieval Augmented Generation)",
      description: "Upload documents and chat with your own knowledge base"
    },
    {
      icon: "💬",
      title: "Advanced Chat Interface",
      description: "Full-featured chat with conversation history and sharing"
    },
    {
      icon: "🎨",
      title: "Customizable",
      description: "Personalize your AI experience with custom prompts and settings"
    },
    {
      icon: "🔒",
      title: "Secure & Private",
      description: "Self-hosted solution with full data control"
    },
    {
      icon: "⚡",
      title: "Real-Time Streaming",
      description: "See responses as they're generated for faster interactions"
    },
  ];

  return (
    <main className="min-h-screen bg-bg">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />
      <Navbar />

      <section className="mx-auto max-w-[1800px] px-7 pt-24 pb-16">
        <SectionHeading
          eyebrow="AI Studio"
          title="Full AI Interface"
          subtitle="Powered by Open WebUI - Advanced AI chat, document Q&A, and multi-model support"
        />

        {/* Connection Status */}
        <div className="mt-6">
          <GlowCard className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-sm text-muted">
                {isConnected ? 'Connected to AI Studio' : 'AI Studio not available - Start with docker-compose'}
              </span>
            </div>
            {!isConnected && (
              <a
                href="https://github.com/open-webui/open-webui"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-4 py-2 rounded-lg glass hover:shadow-glow transition-shadow text-brand"
              >
                Setup Guide →
              </a>
            )}
          </GlowCard>
        </div>

        {/* Features Grid */}
        <div className="mt-10">
          <h3 className="text-xl font-bold mb-4">AI Studio Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: idx * 0.1 }}
              >
                <GlowCard className="p-5 h-full">
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <div className="text-lg font-bold mb-2">{feature.title}</div>
                  <div className="text-sm text-muted">{feature.description}</div>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI Interface */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">AI Interface</h3>
            {isConnected && (
              <a
                href={openWebUIUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm px-4 py-2 rounded-lg bg-gradient-to-br from-brand to-brand2 text-white font-semibold hover:shadow-glow transition-shadow"
              >
                Open in New Tab →
              </a>
            )}
          </div>

          <GlowCard className="p-0 overflow-hidden" style={{ minHeight: '800px' }}>
            {isConnected ? (
              <iframe
                src={openWebUIUrl}
                className="w-full h-full border-0"
                style={{ minHeight: '800px' }}
                title="Open WebUI AI Studio"
                allow="clipboard-read; clipboard-write"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-[800px] p-10 text-center">
                <div className="text-6xl mb-6">🚀</div>
                <h3 className="text-2xl font-bold mb-4">AI Studio Not Running</h3>
                <p className="text-muted mb-6 max-w-md">
                  Open WebUI needs to be started locally or deployed to Azure. 
                  Follow the setup instructions below to get started.
                </p>

                <div className="glass rounded-lg p-6 max-w-2xl text-left">
                  <div className="text-sm font-bold mb-3 text-brand2">Quick Start:</div>
                  <div className="space-y-2 text-sm text-muted font-mono">
                    <div># 1. Set up environment variables</div>
                    <div className="text-text">cp .env.example .env</div>
                    
                    <div className="mt-4"># 2. Start Open WebUI</div>
                    <div className="text-text">docker-compose -f docker-compose.openwebui.yml up -d</div>
                    
                    <div className="mt-4"># 3. Access at http://localhost:8080</div>
                    
                    <div className="mt-4"># 4. For production deployment:</div>
                    <div className="text-text">See AI_IMPLEMENTATION_GUIDE.md</div>
                  </div>
                </div>

                <div className="mt-8 flex gap-4">
                  <a
                    href="https://github.com/open-webui/open-webui"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-lg glass hover:shadow-glow transition-shadow text-text font-semibold"
                  >
                    Open WebUI Docs
                  </a>
                  <a
                    href="/AI_IMPLEMENTATION_GUIDE.md"
                    target="_blank"
                    className="px-6 py-3 rounded-lg bg-gradient-to-br from-brand to-brand2 text-white font-semibold hover:shadow-glow transition-shadow"
                  >
                    Implementation Guide
                  </a>
                </div>
              </div>
            )}
          </GlowCard>
        </div>

        {/* Quick Links */}
        <div className="mt-10">
          <h3 className="text-xl font-bold mb-4">Alternative AI Interfaces</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlowCard className="p-6">
              <div className="flex items-start gap-4">
                <div className="text-4xl">💬</div>
                <div className="flex-1">
                  <div className="text-lg font-bold mb-2">ChatBot (Floating AI)</div>
                  <p className="text-sm text-muted mb-4">
                    Quick AI assistant available on every page. Click the chat button 
                    in the bottom-right corner of any page.
                  </p>
                  <span className="text-xs glass px-3 py-1 rounded-full">Always Available</span>
                </div>
              </div>
            </GlowCard>

            <GlowCard className="p-6">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🧠</div>
                <div className="flex-1">
                  <div className="text-lg font-bold mb-2">MackAi Dashboard</div>
                  <p className="text-sm text-muted mb-4">
                    Test and configure the hybrid AI system with multiple modules 
                    (Cursor, Grok, ChatGPT, Cascade, Quantum).
                  </p>
                  <a
                    href="/portal/mackai"
                    className="text-xs glass px-3 py-1 rounded-full hover:shadow-glow transition-shadow inline-block"
                  >
                    Go to MackAi →
                  </a>
                </div>
              </div>
            </GlowCard>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-10">
          <GlowCard className="p-6 bg-brand/5 border-brand/20">
            <div className="flex items-start gap-4">
              <div className="text-3xl">ℹ️</div>
              <div className="flex-1">
                <div className="text-lg font-bold mb-2 text-brand">About AI Studio</div>
                <p className="text-sm text-muted leading-relaxed">
                  AI Studio is powered by Open WebUI, an open-source alternative to ChatGPT's interface. 
                  It connects to your Azure OpenAI deployment and provides advanced features like:
                </p>
                <ul className="mt-3 text-sm text-muted space-y-1 list-disc list-inside">
                  <li>Upload documents and chat with them (RAG)</li>
                  <li>Save and organize conversations</li>
                  <li>Share conversations with team members</li>
                  <li>Use custom prompts and personas</li>
                  <li>Switch between multiple AI models</li>
                  <li>Full conversation history and search</li>
                </ul>
                <p className="mt-4 text-xs text-muted">
                  <strong>Privacy Note:</strong> All conversations stay within your Azure environment. 
                  No data is sent to external services.
                </p>
              </div>
            </div>
          </GlowCard>
        </div>
      </section>
    </main>
  );
}
