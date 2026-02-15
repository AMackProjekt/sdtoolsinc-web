/**
 * AI Integration Library - Barrel Export
 * Centralized exports for easy imports throughout the application
 */

// Core AI Clients
export { AzureOpenAIClient, getAzureOpenAI, resetAzureOpenAI, azureOpenAI } from './azure';
export { OllamaClient, getOllamaClient, resetOllamaClient, ollama } from './ollama';

// Types
export type {
  AIProvider,
  AIModel,
  AIMessage,
  AIChatOptions,
  AIResponse,
  AIStreamChunk,
  AIConfig,
  AIError,
  AIUsageLog,
} from './types';

// Prompts
export {
  CHATGPT_SYSTEM_PROMPT,
  GROK_SYSTEM_PROMPT,
  CURSOR_SYSTEM_PROMPT,
  CASCADE_SYSTEM_PROMPT,
  QUANTUM_SYSTEM_PROMPT,
  createConversationContext,
  enhanceWithContext,
  getSystemPrompt,
} from './prompts';

/**
 * Quick Start Examples:
 * 
 * 1. Basic Chat Usage:
 * ```typescript
 * import { azureOpenAI } from '@/lib/ai';
 * 
 * const response = await azureOpenAI.chat({
 *   messages: [
 *     { role: 'user', content: 'Tell me about T.O.O.L.S Inc programs' }
 *   ]
 * });
 * console.log(response.content);
 * ```
 * 
 * 2. Streaming Chat:
 * ```typescript
 * import { azureOpenAI } from '@/lib/ai';
 * 
 * await azureOpenAI.chat({
 *   messages: [{ role: 'user', content: 'Hello!' }],
 *   stream: true,
 *   onToken: (token) => console.log(token),
 *   onComplete: (full) => console.log('Done:', full)
 * });
 * ```
 * 
 * 3. With System Prompt:
 * ```typescript
 * import { azureOpenAI, CHATGPT_SYSTEM_PROMPT } from '@/lib/ai';
 * 
 * const response = await azureOpenAI.chat({
 *   messages: [
 *     CHATGPT_SYSTEM_PROMPT,
 *     { role: 'user', content: 'What services do you offer?' }
 *   ]
 * });
 * ```
 * 
 * 4. Check Configuration:
 * ```typescript
 * import { azureOpenAI } from '@/lib/ai';
 * 
 * if (azureOpenAI.isConfigured()) {
 *   console.log('AI is ready!');
 * } else {
 *   console.log('AI not configured, using fallback');
 * }
 * ```
 */
