/**
 * Ollama Client - FREE Local AI Integration
 * Zero cost alternative to Azure OpenAI
 * Uses locally-running open-source LLMs
 */

import type {
  AIConfig,
  AIChatOptions,
  AIResponse,
  AIError,
  AIMessage,
} from './types';

export class OllamaClient {
  private baseUrl: string;
  private defaultModel: string;

  constructor(config?: { baseUrl?: string; model?: string }) {
    this.baseUrl = config?.baseUrl || process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    this.defaultModel = config?.model || process.env.OLLAMA_MODEL || 'llama3.1:8b';
  }

  /**
   * Chat completion with Ollama
   */
  async chat(options: AIChatOptions): Promise<AIResponse> {
    const startTime = Date.now();

    const {
      messages,
      model = this.defaultModel,
      temperature = 0.7,
      maxTokens = 2000,
      stream = false,
      onToken,
      onComplete,
      onError,
    } = options;

    // Convert messages to Ollama format
    const prompt = this.convertMessagesToPrompt(messages);

    try {
      if (!stream) {
        return await this.ollamaRequest({
          prompt,
          model,
          temperature,
          maxTokens,
          startTime,
        });
      } else {
        return await this.ollamaStreamRequest({
          prompt,
          model,
          temperature,
          maxTokens,
          startTime,
          onToken,
          onComplete,
        });
      }
    } catch (error) {
      const aiError = this.handleError(error);
      onError?.(aiError);
      throw aiError;
    }
  }

  /**
   * Regular (non-streaming) request
   */
  private async ollamaRequest(params: {
    prompt: string;
    model: string;
    temperature: number;
    maxTokens: number;
    startTime: number;
  }): Promise<AIResponse> {
    const { prompt, model, temperature, maxTokens, startTime } = params;

    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        prompt,
        temperature,
        max_tokens: maxTokens,
        stream: false,
        options: {
          num_ctx: parseInt(process.env.OLLAMA_NUM_CTX || '4096'),
          num_thread: parseInt(process.env.OLLAMA_NUM_THREADS || '8'),
        },
      }),
    });

    if (!response.ok) {
      throw this.createAIError(
        `Ollama API error: ${response.status}`,
        'OLLAMA_API_ERROR',
        response.status
      );
    }

    const data = await response.json();

    return {
      content: data.response || '',
      model: data.model || model,
      tokensUsed: {
        prompt: data.prompt_eval_count || 0,
        completion: data.eval_count || 0,
        total: (data.prompt_eval_count || 0) + (data.eval_count || 0),
      },
      finishReason: data.done ? 'stop' : 'length',
      processingTime: Date.now() - startTime,
      provider: 'ollama' as any,
    };
  }

  /**
   * Streaming request
   */
  private async ollamaStreamRequest(params: {
    prompt: string;
    model: string;
    temperature: number;
    maxTokens: number;
    startTime: number;
    onToken?: (token: string) => void;
    onComplete?: (fullResponse: string) => void;
  }): Promise<AIResponse> {
    const { prompt, model, temperature, maxTokens, startTime, onToken, onComplete } = params;

    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        prompt,
        temperature,
        max_tokens: maxTokens,
        stream: true,
        options: {
          num_ctx: parseInt(process.env.OLLAMA_NUM_CTX || '4096'),
          num_thread: parseInt(process.env.OLLAMA_NUM_THREADS || '8'),
        },
      }),
    });

    if (!response.ok) {
      throw this.createAIError(
        `Ollama API error: ${response.status}`,
        'OLLAMA_API_ERROR',
        response.status
      );
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullContent = '';
    let tokensUsed = { prompt: 0, completion: 0, total: 0 };

    if (!reader) {
      throw this.createAIError('No response body', 'NO_RESPONSE_BODY');
    }

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          try {
            const parsed = JSON.parse(line);
            const content = parsed.response || '';

            if (content) {
              fullContent += content;
              onToken?.(content);
            }

            if (parsed.done) {
              tokensUsed = {
                prompt: parsed.prompt_eval_count || 0,
                completion: parsed.eval_count || 0,
                total: (parsed.prompt_eval_count || 0) + (parsed.eval_count || 0),
              };
            }
          } catch (e) {
            // Ignore JSON parse errors for incomplete chunks
            continue;
          }
        }
      }

      onComplete?.(fullContent);

      return {
        content: fullContent,
        model,
        tokensUsed,
        finishReason: 'stop',
        processingTime: Date.now() - startTime,
        provider: 'ollama' as any,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Convert OpenAI-style messages to Ollama prompt
   */
  private convertMessagesToPrompt(messages: AIMessage[]): string {
    let prompt = '';

    for (const message of messages) {
      if (message.role === 'system') {
        prompt += `System: ${message.content}\n\n`;
      } else if (message.role === 'user') {
        prompt += `User: ${message.content}\n\n`;
      } else if (message.role === 'assistant') {
        prompt += `Assistant: ${message.content}\n\n`;
      }
    }

    prompt += 'Assistant: ';
    return prompt;
  }

  /**
   * Check if Ollama is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: 'GET',
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * List available models
   */
  async listModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: 'GET',
      });

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data.models?.map((m: any) => m.name) || [];
    } catch {
      return [];
    }
  }

  /**
   * Error handling
   */
  private handleError(error: unknown): AIError {
    if ((error as AIError).code) {
      return error as AIError;
    }

    const message = error instanceof Error ? error.message : 'Unknown Ollama error';
    return this.createAIError(message, 'UNKNOWN_ERROR');
  }

  private createAIError(message: string, code: string, status?: number): AIError {
    const error = new Error(message) as AIError;
    error.code = code;
    error.status = status;
    error.provider = 'ollama' as any;
    error.retryable = status === 503 || status === 500;
    return error;
  }

  /**
   * Get current configuration
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }

  getDefaultModel(): string {
    return this.defaultModel;
  }
}

// Singleton instance
let ollamaInstance: OllamaClient | null = null;

export function getOllamaClient(config?: { baseUrl?: string; model?: string }): OllamaClient {
  if (!ollamaInstance) {
    ollamaInstance = new OllamaClient(config);
  }
  return ollamaInstance;
}

export function resetOllamaClient(): void {
  ollamaInstance = null;
}

// Default export
export const ollama = getOllamaClient();
