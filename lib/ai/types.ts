/**
 * AI Integration Types
 * TypeScript types for Azure OpenAI and AI service interactions
 */

export type AIProvider = 'azure-openai' | 'openai' | 'mock';

export type AIModel = 
  | 'gpt-4-turbo' 
  | 'gpt-4' 
  | 'gpt-35-turbo' 
  | 'gpt-3.5-turbo';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant' | 'function';
  content: string;
  name?: string;
}

export interface AIChatOptions {
  messages: AIMessage[];
  model?: AIModel;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  stream?: boolean;
  onToken?: (token: string) => void;
  onComplete?: (fullResponse: string) => void;
  onError?: (error: Error) => void;
  user?: string; // For rate limiting and tracking
}

export interface AIResponse {
  content: string;
  model: string;
  tokensUsed: {
    prompt: number;
    completion: number;
    total: number;
  };
  finishReason: 'stop' | 'length' | 'content_filter' | 'function_call';
  processingTime: number;
  provider: AIProvider;
}

export interface AIStreamChunk {
  content: string;
  done: boolean;
  model?: string;
}

export interface AIConfig {
  provider: AIProvider;
  azure?: {
    apiKey: string;
    endpoint: string;
    deploymentGPT4?: string;
    deploymentGPT35?: string;
    apiVersion: string;
  };
  openai?: {
    apiKey: string;
    organization?: string;
  };
  defaults: {
    model: AIModel;
    temperature: number;
    maxTokens: number;
    topP: number;
  };
  rateLimit: {
    perMinute: number;
    perHour: number;
  };
}

export interface AIError extends Error {
  code: string;
  status?: number;
  provider: AIProvider;
  retryable: boolean;
}

export interface AIUsageLog {
  timestamp: Date;
  userId?: string;
  model: string;
  tokensUsed: number;
  cost: number; // Estimated cost in USD
  requestType: string;
  success: boolean;
  errorMessage?: string;
}
