/**
 * MackAi - Hybrid AI System
 * Combining Cursor, Grok, ChatGPT, and Cascade with Self-Learning and Quantum-Inspired Optimization
 * 
 * @module mackai
 */

export { MackAiService, getMackAiInstance, resetMackAiInstance } from './service';
export { CursorModule } from './modules/cursor';
export { GrokModule } from './modules/grok';
export { ChatGPTModule } from './modules/chatgpt';
export { CascadeModule } from './modules/cascade';
export { QuantumModule } from './modules/quantum';
export { SelfLearningCore } from './selfLearning';
export { DEFAULT_CONFIG, MODULE_CAPABILITIES } from './config';

export type {
  AIModule,
  AIRequest,
  AIResponse,
  FeedbackData,
  LearningData,
  QuantumOptimizationConfig,
  MackAiConfig,
  ModuleCapability,
} from './types';
