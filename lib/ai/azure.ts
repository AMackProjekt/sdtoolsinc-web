/**
 * Azure OpenAI Client
 * Wrapper for Azure OpenAI API with streaming support, error handling, and rate limiting
 */

import type {
  AIConfig,
  AIChatOptions,
  AIResponse,
  AIError,
  AIProvider,
  AIMessage,
  AIModel
} from './types';

export class AzureOpenAIClient {
  private config: AIConfig;
  private requestCount: Map<string, { minute: number; hour: number; lastReset: Date }> = new Map();

  constructor(config?: Partial<AIConfig>) {
    // Load from environment variables - Auto-detect provider
    const provider: AIProvider = config?.provider || 
      (process.env.NEXT_PUBLIC_AI_PROVIDER === 'ollama' ? 'mock' : // Ollama handled separately
       process.env.AZURE_OPENAI_API_KEY ? 'azure-openai' : 
       process.env.OPENAI_API_KEY ? 'openai' : 'mock');

    this.config = {
      provider,
      azure: {
        apiKey: process.env.AZURE_OPENAI_API_KEY || '',
        endpoint: process.env.AZURE_OPENAI_ENDPOINT || '',
        deploymentGPT4: process.env.AZURE_OPENAI_DEPLOYMENT_GPT4 || 'gpt-4-turbo',
        deploymentGPT35: process.env.AZURE_OPENAI_DEPLOYMENT_GPT35 || 'gpt-35-turbo',
        apiVersion: process.env.AZURE_OPENAI_API_VERSION || '2024-02-15-preview',
      },
      openai: {
        apiKey: process.env.OPENAI_API_KEY || '',
        organization: process.env.OPENAI_ORG_ID,
      },
      defaults: {
        model: 'gpt-35-turbo' as AIModel,
        temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
        maxTokens: parseInt(process.env.AI_MAX_TOKENS || '2000'),
        topP: parseFloat(process.env.AI_TOP_P || '0.95'),
      },
      rateLimit: {
        perMinute: parseInt(process.env.AI_RATE_LIMIT_PER_MINUTE || '20'),
        perHour: parseInt(process.env.AI_RATE_LIMIT_PER_HOUR || '500'),
      },
      ...config,
    };
  }

  /**
   * Chat completion with streaming support
   */
  async chat(options: AIChatOptions): Promise<AIResponse> {
    const startTime = Date.now();

    // Check feature flag
    if (process.env.NEXT_PUBLIC_AI_ENABLED !== 'true') {
      return this.getMockResponse(options);
    }

    // Use Ollama if configured (FREE local AI)
    if (process.env.NEXT_PUBLIC_AI_PROVIDER === 'ollama') {
      return this.useOllamaFallback(options, startTime);
    }

    // Rate limit check
    if (options.user) {
      this.checkRateLimit(options.user);
    }

    const {
      messages,
      model = this.config.defaults.model,
      temperature = this.config.defaults.temperature,
      maxTokens = this.config.defaults.maxTokens,
      topP = this.config.defaults.topP,
      stream = false,
      onToken,
      onComplete,
      onError,
    } = options;

    try {
      if (this.config.provider === 'azure-openai') {
        return await this.azureOpenAIRequest({
          messages,
          model,
          temperature,
          maxTokens,
          topP,
          stream,
          onToken,
          onComplete,
          startTime,
        });
      } else if (this.config.provider === 'openai') {
        return await this.openAIRequest({
          messages,
          model,
          temperature,
          maxTokens,
          topP,
          stream,
          onToken,
          onComplete,
          startTime,
        });
      } else {
        return this.getMockResponse(options);
      }
    } catch (error) {
      const aiError = this.handleError(error);
      onError?.(aiError);
      throw aiError;
    }
  }

  /**
   * Azure OpenAI API request
   */
  private async azureOpenAIRequest(params: {
    messages: AIMessage[];
    model: AIModel;
    temperature: number;
    maxTokens: number;
    topP: number;
    stream: boolean;
    onToken?: (token: string) => void;
    onComplete?: (fullResponse: string) => void;
    startTime: number;
  }): Promise<AIResponse> {
    const { messages, model, temperature, maxTokens, topP, stream, onToken, onComplete, startTime } = params;

    // Map model to deployment name
    const deployment = model.includes('4') 
      ? this.config.azure!.deploymentGPT4 
      : this.config.azure!.deploymentGPT35;

    const url = `${this.config.azure!.endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${this.config.azure!.apiVersion}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': this.config.azure!.apiKey,
      },
      body: JSON.stringify({
        messages,
        temperature,
        max_tokens: maxTokens,
        top_p: topP,
        stream,
        frequency_penalty: 0,
        presence_penalty: 0,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw this.createAIError(
        errorData.error?.message || `Azure OpenAI API error: ${response.status}`,
        'AZURE_API_ERROR',
        response.status
      );
    }

    if (!stream) {
      // Non-streaming response
      const data = await response.json();
      const content = data.choices[0]?.message?.content || '';
      
      onComplete?.(content);

      return {
        content,
        model: data.model,
        tokensUsed: {
          prompt: data.usage?.prompt_tokens || 0,
          completion: data.usage?.completion_tokens || 0,
          total: data.usage?.total_tokens || 0,
        },
        finishReason: data.choices[0]?.finish_reason || 'stop',
        processingTime: Date.now() - startTime,
        provider: 'azure-openai',
      };
    } else {
      // Streaming response
      return await this.handleStreamingResponse(response, startTime, onToken, onComplete);
    }
  }

  /**
   * OpenAI API request (direct)
   */
  private async openAIRequest(params: {
    messages: AIMessage[];
    model: AIModel;
    temperature: number;
    maxTokens: number;
    topP: number;
    stream: boolean;
    onToken?: (token: string) => void;
    onComplete?: (fullResponse: string) => void;
    startTime: number;
  }): Promise<AIResponse> {
    const { messages, model, temperature, maxTokens, topP, stream, onToken, onComplete, startTime } = params;

    const url = 'https://api.openai.com/v1/chat/completions';

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.config.openai!.apiKey}`,
    };

    if (this.config.openai!.organization) {
      headers['OpenAI-Organization'] = this.config.openai!.organization;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: model === 'gpt-35-turbo' ? 'gpt-3.5-turbo' : model,
        messages,
        temperature,
        max_tokens: maxTokens,
        top_p: topP,
        stream,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw this.createAIError(
        errorData.error?.message || `OpenAI API error: ${response.status}`,
        'OPENAI_API_ERROR',
        response.status
      );
    }

    if (!stream) {
      const data = await response.json();
      const content = data.choices[0]?.message?.content || '';
      
      onComplete?.(content);

      return {
        content,
        model: data.model,
        tokensUsed: {
          prompt: data.usage?.prompt_tokens || 0,
          completion: data.usage?.completion_tokens || 0,
          total: data.usage?.total_tokens || 0,
        },
        finishReason: data.choices[0]?.finish_reason || 'stop',
        processingTime: Date.now() - startTime,
        provider: 'openai',
      };
    } else {
      return await this.handleStreamingResponse(response, startTime, onToken, onComplete);
    }
  }

  /**
   * Handle streaming response
   */
  private async handleStreamingResponse(
    response: Response,
    startTime: number,
    onToken?: (token: string) => void,
    onComplete?: (fullResponse: string) => void
  ): Promise<AIResponse> {
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullContent = '';
    let tokensUsed = { prompt: 0, completion: 0, total: 0 };
    let modelName = '';
    let finishReason: AIResponse['finishReason'] = 'stop';

    if (!reader) {
      throw this.createAIError('No response body', 'NO_RESPONSE_BODY');
    }

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim().startsWith('data:'));

        for (const line of lines) {
          const data = line.replace(/^data: /, '').trim();
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta;
            const content = delta?.content || '';

            if (content) {
              fullContent += content;
              onToken?.(content);
            }

            if (parsed.model) modelName = parsed.model;
            if (parsed.choices?.[0]?.finish_reason) {
              finishReason = parsed.choices[0].finish_reason;
            }
            if (parsed.usage) {
              tokensUsed = {
                prompt: parsed.usage.prompt_tokens || 0,
                completion: parsed.usage.completion_tokens || 0,
                total: parsed.usage.total_tokens || 0,
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
        model: modelName || 'gpt-35-turbo',
        tokensUsed,
        finishReason,
        processingTime: Date.now() - startTime,
        provider: this.config.provider,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Rate limiting check
   */
  private checkRateLimit(userId: string): void {
    const now = new Date();
    const userLimits = this.requestCount.get(userId);

    if (!userLimits || now.getTime() - userLimits.lastReset.getTime() > 60 * 60 * 1000) {
      // Reset hour
      this.requestCount.set(userId, { minute: 1, hour: 1, lastReset: now });
      return;
    }

    // Check minute limit
    const timeSinceLastReset = (now.getTime() - userLimits.lastReset.getTime()) / 1000;
    if (timeSinceLastReset < 60) {
      if (userLimits.minute >= this.config.rateLimit.perMinute) {
        throw this.createAIError(
          `Rate limit exceeded: ${this.config.rateLimit.perMinute} requests per minute`,
          'RATE_LIMIT_EXCEEDED',
          429
        );
      }
      userLimits.minute++;
    } else {
      // Reset minute counter
      userLimits.minute = 1;
    }

    // Check hour limit
    if (userLimits.hour >= this.config.rateLimit.perHour) {
      throw this.createAIError(
        `Rate limit exceeded: ${this.config.rateLimit.perHour} requests per hour`,
        'RATE_LIMIT_EXCEEDED',
        429
      );
    }

    userLimits.hour++;
    userLimits.lastReset = now;
    this.requestCount.set(userId, userLimits);
  }

  /**
   * Mock response for development/fallback
   */
  private getMockResponse(options: AIChatOptions): AIResponse {
    const lastUserMessage = options.messages.filter(m => m.role === 'user').pop()?.content || '';
    
    return {
      content: `[MOCK AI RESPONSE] I received your message: "${lastUserMessage}". This is a simulated response because AI is not configured. For FREE AI, install Ollama: https://ollama.ai - or set up Azure OpenAI credentials.`,
      model: 'mock',
      tokensUsed: {
        prompt: 50,
        completion: 50,
        total: 100,
      },
      finishReason: 'stop',
      processingTime: 100,
      provider: 'mock',
    };
  }

  /**
   * Use Ollama for free local AI
   */
  private async useOllamaFallback(options: AIChatOptions, startTime: number): Promise<AIResponse> {
    try {
      // Dynamic import to avoid bundling Ollama client unnecessarily
      const { ollama } = await import('./ollama');
      
      // Check if Ollama is available
      const isAvailable = await ollama.isAvailable();
      
      if (!isAvailable) {
        return {
          content: `Ollama is not running. To use FREE AI:\n\n1. Install Ollama: https://ollama.ai\n2. Download a model: ollama pull llama3.1:8b\n3. Ollama starts automatically\n\nSee AI_FREE_SETUP.md for details.`,
          model: 'ollama-unavailable',
          tokensUsed: { prompt: 0, completion: 0, total: 0 },
          finishReason: 'stop',
          processingTime: Date.now() - startTime,
          provider: 'mock',
        };
      }

      // Use Ollama
      return await ollama.chat(options);
    } catch (error) {
      console.error('Ollama error:', error);
      return this.getMockResponse(options);
    }
  }

  /**
   * Error handling
   */
  private handleError(error: unknown): AIError {
    if ((error as AIError).code) {
      return error as AIError;
    }

    const message = error instanceof Error ? error.message : 'Unknown AI error';
    return this.createAIError(message, 'UNKNOWN_ERROR');
  }

  private createAIError(message: string, code: string, status?: number): AIError {
    const error = new Error(message) as AIError;
    error.code = code;
    error.status = status;
    error.provider = this.config.provider;
    error.retryable = status === 429 || status === 503 || status === 500;
    return error;
  }

  /**
   * Get current configuration
   */
  getConfig(): AIConfig {
    return { ...this.config };
  }

  /**
   * Check if real AI is configured
   */
  isConfigured(): boolean {
    if (this.config.provider === 'azure-openai') {
      return !!(this.config.azure?.apiKey && this.config.azure?.endpoint);
    }
    if (this.config.provider === 'openai') {
      return !!this.config.openai?.apiKey;
    }
    return false;
  }
}

// Singleton instance
let azureOpenAIInstance: AzureOpenAIClient | null = null;

export function getAzureOpenAI(config?: Partial<AIConfig>): AzureOpenAIClient {
  if (!azureOpenAIInstance) {
    azureOpenAIInstance = new AzureOpenAIClient(config);
  }
  return azureOpenAIInstance;
}

export function resetAzureOpenAI(): void {
  azureOpenAIInstance = null;
}

// Default export
export const azureOpenAI = getAzureOpenAI();
