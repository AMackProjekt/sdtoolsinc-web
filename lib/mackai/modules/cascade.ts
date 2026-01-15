/**
 * Cascade Module - Task Orchestration and Multi-Module Coordination
 * Inspired by modular AI architectures, coordinates between different AI modules
 */

import type { AIRequest, AIResponse } from '../types';
import { CursorModule } from './cursor';
import { GrokModule } from './grok';
import { ChatGPTModule } from './chatgpt';

export class CascadeModule {
  private enabled: boolean;
  private cursorModule: CursorModule;
  private grokModule: GrokModule;
  private chatgptModule: ChatGPTModule;

  constructor(
    enabled: boolean = true,
    cursorModule: CursorModule,
    grokModule: GrokModule,
    chatgptModule: ChatGPTModule
  ) {
    this.enabled = enabled;
    this.cursorModule = cursorModule;
    this.grokModule = grokModule;
    this.chatgptModule = chatgptModule;
  }

  async process(input: string, context?: Record<string, any>): Promise<AIResponse> {
    if (!this.enabled) {
      throw new Error('Cascade module is disabled');
    }

    const startTime = Date.now();

    // Analyze the input and determine which module(s) to use
    const strategy = this.determineStrategy(input, context);

    let output: string;
    let confidence: number;
    let metadata: Record<string, any> = {
      strategy: strategy.type,
      modulesUsed: strategy.modules,
    };

    switch (strategy.type) {
      case 'single':
        // Route to single best module
        const singleResult = await this.routeToModule(strategy.modules[0], input, context);
        output = singleResult.output;
        confidence = singleResult.confidence;
        metadata = { ...metadata, ...singleResult.metadata };
        break;

      case 'parallel':
        // Get responses from multiple modules and synthesize
        const parallelResults = await this.processParallel(strategy.modules, input, context);
        output = this.synthesizeResponses(parallelResults, input);
        confidence = this.calculateAverageConfidence(parallelResults);
        metadata.responses = parallelResults.map(r => ({
          module: r.module,
          confidence: r.confidence,
        }));
        break;

      case 'sequential':
        // Process through modules in sequence
        const sequentialResult = await this.processSequential(strategy.modules, input, context);
        output = sequentialResult.output;
        confidence = sequentialResult.confidence;
        metadata = { ...metadata, ...sequentialResult.metadata };
        break;

      default:
        // Fallback to ChatGPT
        const fallback = await this.chatgptModule.process(input, context);
        output = fallback.output;
        confidence = fallback.confidence;
        metadata.fallback = true;
    }

    const processingTime = Date.now() - startTime;

    return {
      module: 'cascade',
      output,
      confidence,
      processingTime,
      metadata,
    };
  }

  private determineStrategy(input: string, context?: Record<string, any>): {
    type: 'single' | 'parallel' | 'sequential';
    modules: string[];
  } {
    const lowerInput = input.toLowerCase();

    // Code-specific queries go directly to Cursor
    const codeKeywords = ['code', 'function', 'bug', 'debug', 'api', 'component', 'implement'];
    if (codeKeywords.some(k => lowerInput.includes(k))) {
      return { type: 'single', modules: ['cursor'] };
    }

    // Quick questions go to Grok
    const quickKeywords = ['what is', 'define', 'quick', 'time', 'date'];
    if (quickKeywords.some(k => lowerInput.includes(k)) && input.length < 100) {
      return { type: 'single', modules: ['grok'] };
    }

    // Complex questions benefit from multiple perspectives
    const complexKeywords = ['explain', 'compare', 'analyze', 'how does'];
    if (complexKeywords.some(k => lowerInput.includes(k))) {
      return { type: 'parallel', modules: ['grok', 'chatgpt'] };
    }

    // Multi-step tasks use sequential processing
    const multiStepIndicators = ['first', 'then', 'next', 'finally', 'step by step'];
    if (multiStepIndicators.some(k => lowerInput.includes(k))) {
      return { type: 'sequential', modules: ['grok', 'chatgpt'] };
    }

    // Default to detailed ChatGPT response
    return { type: 'single', modules: ['chatgpt'] };
  }

  private async routeToModule(moduleName: string, input: string, context?: Record<string, any>): Promise<AIResponse> {
    switch (moduleName) {
      case 'cursor':
        return await this.cursorModule.process(input, context);
      case 'grok':
        return await this.grokModule.process(input, context);
      case 'chatgpt':
        return await this.chatgptModule.process(input, context);
      default:
        return await this.chatgptModule.process(input, context);
    }
  }

  private async processParallel(
    modules: string[],
    input: string,
    context?: Record<string, any>
  ): Promise<AIResponse[]> {
    const promises = modules.map(module => this.routeToModule(module, input, context));
    return await Promise.all(promises);
  }

  private async processSequential(
    modules: string[],
    input: string,
    context?: Record<string, any>
  ): Promise<AIResponse> {
    let currentInput = input;
    let currentContext = context || {};
    let allResponses: AIResponse[] = [];

    for (const moduleName of modules) {
      const response = await this.routeToModule(moduleName, currentInput, currentContext);
      allResponses.push(response);
      
      // Use previous output as context for next module
      currentContext = {
        ...currentContext,
        previousResponse: response.output,
        previousModule: response.module,
      };
    }

    // Return the final response with enhanced metadata
    const finalResponse = allResponses[allResponses.length - 1];
    return {
      ...finalResponse,
      metadata: {
        ...finalResponse.metadata,
        sequentialSteps: allResponses.map(r => ({
          module: r.module,
          confidence: r.confidence,
        })),
      },
    };
  }

  private synthesizeResponses(responses: AIResponse[], originalInput: string): string {
    if (responses.length === 1) {
      return responses[0].output;
    }

    // Combine insights from multiple modules
    let synthesis = "Here's a comprehensive answer combining multiple perspectives:\n\n";

    responses.forEach((response, index) => {
      const moduleLabel = this.getModuleLabel(response.module);
      synthesis += `**${moduleLabel}**\n${response.output}\n\n`;
    });

    return synthesis.trim();
  }

  private getModuleLabel(moduleName: string): string {
    const labels: Record<string, string> = {
      cursor: 'Code Assistant',
      grok: 'Quick Insight',
      chatgpt: 'Detailed Analysis',
    };
    return labels[moduleName] || moduleName;
  }

  private calculateAverageConfidence(responses: AIResponse[]): number {
    const sum = responses.reduce((acc, r) => acc + r.confidence, 0);
    return sum / responses.length;
  }

  isEnabled(): boolean {
    return this.enabled;
  }
}
