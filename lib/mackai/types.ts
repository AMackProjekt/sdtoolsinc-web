/**
 * MackAi Type Definitions
 * Core types for the hybrid AI system
 */

export type AIModule = 'cursor' | 'grok' | 'chatgpt' | 'cascade' | 'quantum';

export interface AIRequest {
  module: AIModule;
  input: string;
  context?: Record<string, any>;
  userId?: string;
  sessionId?: string;
}

export interface AIResponse {
  module: AIModule;
  output: string;
  confidence: number;
  processingTime: number;
  metadata?: Record<string, any>;
}

export interface FeedbackData {
  requestId: string;
  userId?: string;
  rating: number; // 1-5 scale
  helpful: boolean;
  comment?: string;
  timestamp: Date;
}

export interface LearningData {
  input: string;
  output: string;
  feedback: FeedbackData;
  module: AIModule;
}

export interface QuantumOptimizationConfig {
  enabled: boolean;
  algorithm: 'annealing' | 'vqe' | 'qaoa';
  iterations: number;
}

export interface MackAiConfig {
  modules: {
    cursor: { enabled: boolean; model?: string };
    grok: { enabled: boolean; model?: string };
    chatgpt: { enabled: boolean; model?: string };
    cascade: { enabled: boolean };
    quantum: QuantumOptimizationConfig;
  };
  selfLearning: {
    enabled: boolean;
    feedbackThreshold: number;
    retrainingInterval: number; // in minutes
  };
  apiEndpoint?: string;
}

export interface ModuleCapability {
  name: string;
  description: string;
  strengths: string[];
  useCases: string[];
}
