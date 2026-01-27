"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { Navbar } from "@/components/ui/Navbar";
import { GlowCard } from "@/components/ui/GlowCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getMackAiInstance, MODULE_CAPABILITIES } from "@/lib/mackai";
import type { AIModule } from "@/lib/mackai";

export default function MackAiPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [mackaiService] = useState(() => getMackAiInstance());
  const [moduleStatus, setModuleStatus] = useState<any>(null);
  const [statistics, setStatistics] = useState<any>(null);
  const [testInput, setTestInput] = useState("");
  const [testOutput, setTestOutput] = useState("");
  const [selectedModule, setSelectedModule] = useState<AIModule>("cascade");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/portal/auth");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const loadStatus = () => {
      const status = mackaiService.getModuleStatus();
      const stats = mackaiService.getStatistics();
      setModuleStatus(status);
      setStatistics(stats);
    };
    
    loadStatus();
  }, [mackaiService]);

  const handleTest = async () => {
    if (!testInput.trim()) return;

    setIsProcessing(true);
    setTestOutput("");

    try {
      const response = await mackaiService.processRequest({
        module: selectedModule,
        input: testInput,
      });

      setTestOutput(`**Module**: ${response.module}
**Confidence**: ${(response.confidence * 100).toFixed(1)}%
**Processing Time**: ${response.processingTime}ms

**Response**:
${response.output}

**Metadata**: ${JSON.stringify(response.metadata, null, 2)}`);
    } catch (error) {
      setTestOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <main className="min-h-screen bg-bg">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />
      <Navbar />

      <section className="mx-auto max-w-container px-7 pt-24 pb-16">
        <SectionHeading
          eyebrow="AI System"
          title="MackAi Dashboard"
          subtitle="Configure and monitor the hybrid AI system combining Cursor, Grok, ChatGPT, Cascade, and Quantum-inspired optimization"
        />

        {/* System Status */}
        <div className="mt-10">
          <h3 className="text-xl font-bold mb-4">System Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {moduleStatus && Object.entries(moduleStatus).map(([moduleName, status]: [string, any]) => (
              <GlowCard key={moduleName} className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-lg font-bold capitalize">{moduleName}</div>
                  <div className={`h-3 w-3 rounded-full ${status.enabled ? 'bg-green-500' : 'bg-red-500'}`} />
                </div>
                <div className="text-sm text-muted space-y-1">
                  {status.model && <div>Model: {status.model}</div>}
                  {status.config && (
                    <div>
                      Algorithm: {status.config.algorithm}
                      <br />
                      Iterations: {status.config.iterations}
                    </div>
                  )}
                  {status.stats && (
                    <div>
                      Interactions: {status.stats.totalInteractions}
                      <br />
                      Avg Rating: {status.stats.averageRating}/5
                    </div>
                  )}
                </div>
              </GlowCard>
            ))}
          </div>
        </div>

        {/* Module Capabilities */}
        <div className="mt-10">
          <h3 className="text-xl font-bold mb-4">Module Capabilities</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {Object.entries(MODULE_CAPABILITIES).map(([key, capability]) => (
              <GlowCard key={key} className="p-5">
                <div className="text-lg font-bold mb-2">{capability.name}</div>
                <div className="text-sm text-muted mb-3">{capability.description}</div>
                
                <div className="mb-3">
                  <div className="text-xs font-semibold text-brand2 uppercase mb-1">Strengths</div>
                  <ul className="text-sm text-muted list-disc list-inside space-y-1">
                    {capability.strengths.map((strength, idx) => (
                      <li key={idx}>{strength}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="text-xs font-semibold text-brand2 uppercase mb-1">Use Cases</div>
                  <ul className="text-sm text-muted list-disc list-inside space-y-1">
                    {capability.useCases.map((useCase, idx) => (
                      <li key={idx}>{useCase}</li>
                    ))}
                  </ul>
                </div>
              </GlowCard>
            ))}
          </div>
        </div>

        {/* Learning Statistics */}
        {statistics && (
          <div className="mt-10">
            <h3 className="text-xl font-bold mb-4">Self-Learning Statistics</h3>
            <GlowCard className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="text-3xl font-bold text-brand">{statistics.totalInteractions}</div>
                  <div className="text-sm text-muted mt-1">Total Interactions</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-brand2">{statistics.totalFeedback}</div>
                  <div className="text-sm text-muted mt-1">Feedback Received</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent">{statistics.averageRating.toFixed(1)}/5</div>
                  <div className="text-sm text-muted mt-1">Average Rating</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-brand">
                    {statistics.nextRetraining ? new Date(statistics.nextRetraining).toLocaleDateString() : 'N/A'}
                  </div>
                  <div className="text-sm text-muted mt-1">Next Retraining</div>
                </div>
              </div>

              {statistics.moduleBreakdown && Object.keys(statistics.moduleBreakdown).length > 0 && (
                <div className="mt-6">
                  <div className="text-sm font-semibold text-brand2 uppercase mb-2">Module Usage</div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {Object.entries(statistics.moduleBreakdown).map(([moduleName, count]) => (
                      <div key={moduleName} className="glass p-3 rounded-lg">
                        <div className="text-lg font-bold capitalize">{moduleName}</div>
                        <div className="text-sm text-muted">{String(count)} uses</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </GlowCard>
          </div>
        )}

        {/* Test Interface */}
        <div className="mt-10">
          <h3 className="text-xl font-bold mb-4">Test Interface</h3>
          <GlowCard className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Select Module</label>
                <select
                  value={selectedModule}
                  onChange={(e) => setSelectedModule(e.target.value as AIModule)}
                  className="w-full rounded-lg bg-panel border border-border px-4 py-2 text-text"
                >
                  <option value="cascade">Cascade (Auto-Route)</option>
                  <option value="cursor">Cursor (Code Assistant)</option>
                  <option value="grok">Grok (Quick Insights)</option>
                  <option value="chatgpt">ChatGPT (Detailed Responses)</option>
                  <option value="quantum">Quantum (Optimization)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Test Input</label>
                <textarea
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  placeholder="Enter your test query here..."
                  className="w-full rounded-lg bg-panel border border-border px-4 py-3 text-text min-h-[120px] resize-y"
                />
              </div>

              <motion.button
                onClick={handleTest}
                disabled={isProcessing || !testInput.trim()}
                whileHover={{ y: -1 }}
                whileTap={{ y: 0 }}
                className="px-6 py-3 rounded-lg bg-gradient-to-br from-brand to-brand2 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Test Module'}
              </motion.button>

              {testOutput && (
                <div>
                  <label className="block text-sm font-semibold mb-2">Output</label>
                  <div className="rounded-lg bg-panel border border-border px-4 py-3 text-sm text-text whitespace-pre-wrap">
                    {testOutput}
                  </div>
                </div>
              )}
            </div>
          </GlowCard>
        </div>

        {/* Architecture Overview */}
        <div className="mt-10">
          <h3 className="text-xl font-bold mb-4">System Architecture</h3>
          <GlowCard className="p-6">
            <div className="space-y-4 text-sm text-muted">
              <p>
                MackAi is a hybrid AI system that combines the strengths of multiple AI approaches:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="glass p-4 rounded-lg">
                  <div className="text-base font-bold text-text mb-2">🧠 Core Modules</div>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Cursor</strong>: Code generation and debugging</li>
                    <li><strong>Grok</strong>: Quick, witty real-time responses</li>
                    <li><strong>ChatGPT</strong>: Detailed conversational AI</li>
                    <li><strong>Cascade</strong>: Intelligent task orchestration</li>
                  </ul>
                </div>

                <div className="glass p-4 rounded-lg">
                  <div className="text-base font-bold text-text mb-2">⚡ Advanced Features</div>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Self-Learning</strong>: Improves from user feedback</li>
                    <li><strong>Quantum Layer</strong>: Optimization algorithms</li>
                    <li><strong>Context Memory</strong>: Maintains conversation history</li>
                    <li><strong>Multi-Modal</strong>: Handles diverse tasks</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 p-4 bg-brand/10 border border-brand/20 rounded-lg">
                <div className="text-sm font-semibold text-brand mb-2">📚 Open-Source Foundation</div>
                <p className="text-xs">
                  Built on open-source technologies including GPT4ALL, LLaMA 3, Grok-1, with quantum-inspired 
                  algorithms from Qiskit and PennyLane frameworks. All models run locally for privacy and control.
                </p>
              </div>
            </div>
          </GlowCard>
        </div>
      </section>
    </main>
  );
}
