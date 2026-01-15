/**
 * MackAi Service - Main Orchestration Layer
 * Combines all AI modules into a unified interface
 */

import type { AIModule, AIRequest, AIResponse, FeedbackData, MackAiConfig } from './types';
import { DEFAULT_CONFIG } from './config';
import { CursorModule } from './modules/cursor';
import { GrokModule } from './modules/grok';
import { ChatGPTModule } from './modules/chatgpt';
import { CascadeModule } from './modules/cascade';
import { QuantumModule } from './modules/quantum';
import { SelfLearningCore } from './selfLearning';

export class MackAiService {
  private config: MackAiConfig;
  private cursorModule: CursorModule;
  private grokModule: GrokModule;
  private chatgptModule: ChatGPTModule;
  private cascadeModule: CascadeModule;
  private quantumModule: QuantumModule;
  private selfLearningCore: SelfLearningCore;
  private requestHistory: Map<string, AIRequest & { response: AIResponse }> = new Map();

  constructor(config?: Partial<MackAiConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };

    // Initialize modules
    this.cursorModule = new CursorModule(
      this.config.modules.cursor.enabled,
      this.config.modules.cursor.model
    );

    this.grokModule = new GrokModule(
      this.config.modules.grok.enabled,
      this.config.modules.grok.model
    );

    this.chatgptModule = new ChatGPTModule(
      this.config.modules.chatgpt.enabled,
      this.config.modules.chatgpt.model
    );

    this.cascadeModule = new CascadeModule(
      this.config.modules.cascade.enabled,
      this.cursorModule,
      this.grokModule,
      this.chatgptModule
    );

    this.quantumModule = new QuantumModule(this.config.modules.quantum);

    this.selfLearningCore = new SelfLearningCore(
      this.config.selfLearning.enabled,
      this.config.selfLearning.feedbackThreshold,
      this.config.selfLearning.retrainingInterval
    );

    // Load persisted learning data
    this.selfLearningCore.loadPersistedData();
  }

  /**
   * Process an AI request through the appropriate module(s)
   */
  async processRequest(request: AIRequest): Promise<AIResponse> {
    const { module, input, context, sessionId } = request;

    let response: AIResponse;

    try {
      switch (module) {
        case 'cursor':
          response = await this.cursorModule.process(input, context);
          break;

        case 'grok':
          response = await this.grokModule.process(input, context);
          break;

        case 'chatgpt':
          response = await this.chatgptModule.process(input, context);
          break;

        case 'cascade':
          response = await this.cascadeModule.process(input, context);
          break;

        case 'quantum':
          response = await this.quantumModule.process(input, context);
          break;

        default:
          // Default to cascade for intelligent routing
          response = await this.cascadeModule.process(input, context);
      }

      // Apply quantum optimization if enabled and appropriate
      if (this.config.modules.quantum.enabled && this.shouldApplyQuantumOptimization(input)) {
        response = await this.enhanceWithQuantum(response, input, context);
      }

      // Store request and response for learning
      const requestId = this.generateRequestId();
      this.requestHistory.set(requestId, { ...request, response });

      // Add request ID to response metadata
      response.metadata = {
        ...response.metadata,
        requestId,
        sessionId,
      };

      return response;
    } catch (error) {
      console.error('MackAi processing error:', error);

      // Fallback response
      return {
        module: 'chatgpt',
        output: "I apologize, but I encountered an error processing your request. Please try rephrasing your question or contact support if the issue persists.",
        confidence: 0.1,
        processingTime: 0,
        metadata: {
          error: true,
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  }

  /**
   * Add user feedback for a specific request
   */
  addFeedback(requestId: string, feedback: Omit<FeedbackData, 'requestId' | 'timestamp'>): void {
    const request = this.requestHistory.get(requestId);
    if (!request) {
      console.warn('Request not found:', requestId);
      return;
    }

    const fullFeedback: FeedbackData = {
      ...feedback,
      requestId,
      timestamp: new Date(),
    };

    this.selfLearningCore.addFeedback(fullFeedback);
    this.selfLearningCore.recordInteraction(
      request.input,
      request.response.output,
      request.response.module,
      fullFeedback
    );

    // Check if retraining is needed
    if (this.selfLearningCore.shouldRetrain()) {
      this.performRetraining();
    }
  }

  /**
   * Perform self-learning retraining
   */
  private performRetraining(): void {
    const result = this.selfLearningCore.performRetraining();
    if (result.success) {
      console.log('MackAi retraining completed:', result.message);
    }
  }

  /**
   * Get learning statistics
   */
  getStatistics() {
    return this.selfLearningCore.getStatistics();
  }

  /**
   * Get feedback patterns analysis
   */
  analyzeFeedback() {
    return this.selfLearningCore.analyzeFeedbackPatterns();
  }

  /**
   * Get current configuration
   */
  getConfig(): MackAiConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<MackAiConfig>): void {
    this.config = { ...this.config, ...newConfig };

    // Update module states if needed
    if (newConfig.modules?.quantum) {
      this.quantumModule.updateConfig(newConfig.modules.quantum);
    }
  }

  /**
   * Get available modules and their status
   */
  getModuleStatus() {
    return {
      cursor: {
        enabled: this.cursorModule.isEnabled(),
        model: this.cursorModule.getModel(),
      },
      grok: {
        enabled: this.grokModule.isEnabled(),
        model: this.grokModule.getModel(),
      },
      chatgpt: {
        enabled: this.chatgptModule.isEnabled(),
        model: this.chatgptModule.getModel(),
      },
      cascade: {
        enabled: this.cascadeModule.isEnabled(),
      },
      quantum: {
        enabled: this.quantumModule.isEnabled(),
        config: this.quantumModule.getConfig(),
      },
      selfLearning: {
        enabled: this.selfLearningCore.isEnabled(),
        stats: this.selfLearningCore.getStatistics(),
      },
    };
  }

  private shouldApplyQuantumOptimization(input: string): boolean {
    const quantumKeywords = ['optimize', 'best', 'maximum', 'minimum', 'find optimal', 'decide'];
    const lowerInput = input.toLowerCase();
    return quantumKeywords.some(keyword => lowerInput.includes(keyword));
  }

  private async enhanceWithQuantum(
    response: AIResponse,
    input: string,
    context?: Record<string, any>
  ): Promise<AIResponse> {
    try {
      const quantumResponse = await this.quantumModule.process(input, context);

      // Combine responses
      return {
        ...response,
        output: `${response.output}\n\n**Quantum-Enhanced Insight:**\n${quantumResponse.output}`,
        confidence: (response.confidence + quantumResponse.confidence) / 2,
        metadata: {
          ...response.metadata,
          quantumEnhanced: true,
          quantumMetadata: quantumResponse.metadata,
        },
      };
    } catch (error) {
      console.warn('Quantum enhancement failed:', error);
      return response;
    }
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Singleton instance for easy access
let mackaiInstance: MackAiService | null = null;

export function getMackAiInstance(config?: Partial<MackAiConfig>): MackAiService {
  if (!mackaiInstance) {
    mackaiInstance = new MackAiService(config);
  }
  return mackaiInstance;
}

export function resetMackAiInstance(): void {
  mackaiInstance = null;
}
