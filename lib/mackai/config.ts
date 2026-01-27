/**
 * MackAi Configuration
 * Default configuration for the hybrid AI system
 */

import type { MackAiConfig, ModuleCapability } from './types';

export const DEFAULT_CONFIG: MackAiConfig = {
  modules: {
    cursor: {
      enabled: true,
      model: 'gpt4all', // Open-source alternative for code generation
    },
    grok: {
      enabled: true,
      model: 'grok-1', // xAI's open-source model
    },
    chatgpt: {
      enabled: true,
      model: 'llama-3', // Meta's LLaMA 3 as open-source alternative
    },
    cascade: {
      enabled: true,
    },
    quantum: {
      enabled: false, // Quantum-inspired algorithms (disabled by default)
      algorithm: 'annealing',
      iterations: 100,
    },
  },
  selfLearning: {
    enabled: true,
    feedbackThreshold: 3, // Minimum rating to consider feedback positive
    retrainingInterval: 1440, // 24 hours in minutes
  },
  apiEndpoint: '/api/v1/mackai',
};

export const MODULE_CAPABILITIES: Record<string, ModuleCapability> = {
  cursor: {
    name: 'Cursor Module',
    description: 'AI-powered code writing and editing assistant',
    strengths: [
      'Code generation and completion',
      'Bug detection and fixing',
      'Code refactoring',
      'Documentation generation',
    ],
    useCases: [
      'Writing new code',
      'Debugging existing code',
      'Code reviews',
      'Learning programming concepts',
    ],
  },
  grok: {
    name: 'Grok Module',
    description: 'Real-time data processor with unique personality',
    strengths: [
      'Quick, witty responses',
      'Real-time information processing',
      'Concise insights',
      'Personality-driven interactions',
    ],
    useCases: [
      'Quick questions',
      'Real-time data analysis',
      'Conversational interactions',
      'Information lookup',
    ],
  },
  chatgpt: {
    name: 'ChatGPT Module',
    description: 'Natural language understanding and generation',
    strengths: [
      'Fluent conversational AI',
      'Complex reasoning',
      'Detailed explanations',
      'Context-aware responses',
    ],
    useCases: [
      'Detailed discussions',
      'Learning and education',
      'Content creation',
      'Problem solving',
    ],
  },
  cascade: {
    name: 'Cascade Module',
    description: 'Modular task orchestration framework',
    strengths: [
      'Multi-module coordination',
      'Task delegation',
      'Context management',
      'Retrieval-augmented generation',
    ],
    useCases: [
      'Complex multi-step tasks',
      'Information synthesis',
      'Cross-module operations',
      'Knowledge management',
    ],
  },
  quantum: {
    name: 'Quantum Layer',
    description: 'Quantum-inspired optimization algorithms',
    strengths: [
      'Enhanced pattern recognition',
      'Optimization problems',
      'Decision-making support',
      'Complex problem solving',
    ],
    useCases: [
      'Hyperparameter tuning',
      'Pattern discovery',
      'Resource optimization',
      'Advanced analytics',
    ],
  },
};
