/**
 * Real ChatGPT Module - Uses Azure OpenAI/OpenAI API
 * Provides detailed, empathetic conversational AI responses
 */

import type { AIResponse } from '@/lib/mackai/types';
import { azureOpenAI } from '@/lib/ai/azure';
import { CHATGPT_SYSTEM_PROMPT, createConversationContext } from '@/lib/ai/prompts';
import type { AIMessage } from '@/lib/ai/types';

export class ChatGPTModuleReal {
  private enabled: boolean;
  private model: string;
  private conversationHistory: AIMessage[] = [];

  constructor(enabled: boolean = true, model: string = 'gpt-4-turbo') {
    this.enabled = enabled;
    this.model = model;
  }

  async process(input: string, context?: Record<string, any>): Promise<AIResponse> {
    if (!this.enabled) {
      throw new Error('ChatGPT module is disabled');
    }

    // Check if we should use real AI
    if (process.env.NEXT_PUBLIC_MACKAI_REAL_AI !== 'true' || !azureOpenAI.isConfigured()) {
      return this.getFallbackResponse(input);
    }

    const startTime = Date.now();

    try {
      // Add context to conversation history if provided
      if (context?.clearHistory) {
        this.conversationHistory = [];
      }

      // Create messages array with system prompt
      const messages = createConversationContext(
        CHATGPT_SYSTEM_PROMPT,
        this.conversationHistory,
        input
      );

      // Call Azure OpenAI
      const response = await azureOpenAI.chat({
        messages,
        model: this.model as any,
        temperature: 0.7,
        maxTokens: 2000,
        stream: false,
      });

      // Update conversation history (keep last 10 messages)
      this.conversationHistory.push(
        { role: 'user', content: input },
        { role: 'assistant', content: response.content }
      );

      if (this.conversationHistory.length > 10) {
        this.conversationHistory = this.conversationHistory.slice(-10);
      }

      const processingTime = Date.now() - startTime;

      return {
        module: 'chatgpt',
        output: response.content,
        confidence: 0.95,
        processingTime,
        metadata: {
          model: response.model,
          tokensUsed: response.tokensUsed.total,
          provider: response.provider,
          conversationLength: this.conversationHistory.length,
        },
      };
    } catch (error) {
      console.error('ChatGPT module error:', error);
      
      // Fallback to hardcoded responses if API fails
      return this.getFallbackResponse(input);
    }
  }

  /**
   * Fallback response when AI is not configured or fails
   */
  private getFallbackResponse(input: string): AIResponse {
    const lowerInput = input.toLowerCase();

    let output = '';

    if (lowerInput.includes('program') || lowerInput.includes('service')) {
      output = `**T.O.O.L.S Inc Programs**

We offer four comprehensive programs:

**1. Job Readiness Training** - Resume building, mock interviews, career planning, and professional development.

**2. Continued Education** - GED preparation, trade school access, college prep, and academic support.

**3. Lived Experience Support** - Peer mentorship from individuals with shared experiences providing authentic understanding.

**4. Personal Growth Programs** - Life skills training, communication development, and goal achievement strategies.

**Special Focus: Reentry Services** - Comprehensive support for justice-involved individuals including housing assistance, family reunification, and employer partnerships.

Ready to get started? Visit our Interest Form or email info@sdtoolsinc.org`;
    } else if (lowerInput.includes('job') || lowerInput.includes('employment')) {
      output = `**Job Readiness Program**

Our comprehensive Job Readiness program prepares you for workforce success:

• **Resume Building** - Professional resumes tailored to your skills and goals
• **Mock Interviews** - Practice and feedback in a supportive environment  
• **Career Planning** - Identify pathways and build a professional roadmap
• **Skill Development** - Workplace etiquette, communication, time management
• **Job Placement** - Connections with second-chance employers

We believe in your potential and provide the tools to unlock it. Get started: www.sdtoolsinc.org/interest`;
    } else if (lowerInput.includes('education') || lowerInput.includes('learning')) {
      output = `**Continued Education Support**

Education opens doors. We provide:

• **GED Preparation** - Testing support and study materials
• **Training Access** - Trade schools, vocational programs, certifications
• **Academic Support** - Tutoring, study spaces, technology access
• **Financial Guidance** - Scholarship and financial aid assistance
• **Flexible Scheduling** - Programs that work with your commitments

Education is a journey, and we're here every step. Contact us: info@sdtoolsinc.org`;
    } else {
      output = `I'm here to provide detailed information about T.O.O.L.S Inc programs and services.

**I can help with:**
- Program details (Job Readiness, Education, Reentry Services)
- Getting started process
- Referral information
- Support services available
- Contact and next steps

What would you like to know more about?

**Note:** Real AI responses are currently unavailable. Using fallback responses. This ensures you still get helpful information!`;
    }

    return {
      module: 'chatgpt',
      output,
      confidence: 0.85,
      processingTime: 50,
      metadata: {
        model: 'fallback',
        fallbackReason: 'AI not configured or API unavailable',
      },
    };
  }

  /**
   * Process with streaming support
   */
  async processStream(
    input: string,
    context: Record<string, any> | undefined,
    onToken: (token: string) => void
  ): Promise<AIResponse> {
    if (!this.enabled || !azureOpenAI.isConfigured()) {
      return this.process(input, context);
    }

    const startTime = Date.now();

    try {
      const messages = createConversationContext(
        CHATGPT_SYSTEM_PROMPT,
        this.conversationHistory,
        input
      );

      let fullResponse = '';

      const response = await azureOpenAI.chat({
        messages,
        model: this.model as any,
        temperature: 0.7,
        maxTokens: 2000,
        stream: true,
        onToken: (token) => {
          fullResponse += token;
          onToken(token);
        },
      });

      // Update history
      this.conversationHistory.push(
        { role: 'user', content: input },
        { role: 'assistant', content: fullResponse }
      );

      if (this.conversationHistory.length > 10) {
        this.conversationHistory = this.conversationHistory.slice(-10);
      }

      return {
        module: 'chatgpt',
        output: fullResponse,
        confidence: 0.95,
        processingTime: Date.now() - startTime,
        metadata: {
          model: response.model,
          tokensUsed: response.tokensUsed.total,
          provider: response.provider,
          streamed: true,
        },
      };
    } catch (error) {
      console.error('ChatGPT streaming error:', error);
      return this.process(input, context);
    }
  }

  /**
   * Clear conversation history
   */
  clearHistory(): void {
    this.conversationHistory = [];
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  getModel(): string {
    return this.model;
  }

  setModel(model: string): void {
    this.model = model;
  }
}
