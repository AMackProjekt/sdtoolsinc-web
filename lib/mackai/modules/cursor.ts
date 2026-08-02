/**
 * Cursor Module - Code Writing and Editing Assistant
 * Inspired by Cursor AI, optimized for code generation
 */

import type { AIResponse } from '../types';

export class CursorModule {
  private enabled: boolean;
  private model: string;

  constructor(enabled: boolean = true, model: string = 'gpt4all') {
    this.enabled = enabled;
    this.model = model;
  }

  async process(input: string, context?: Record<string, any>): Promise<AIResponse> {
    if (!this.enabled) {
      throw new Error('Cursor module is disabled');
    }

    const startTime = Date.now();

    // Detect if input is code-related
    const isCodeRelated = this.isCodeQuery(input);

    let output: string;
    let confidence: number;

    if (isCodeRelated) {
      output = await this.generateCodeResponse(input, context);
      confidence = 0.85;
    } else {
      output = "I'm optimized for code-related tasks. For general questions, try the ChatGPT or Grok modules.";
      confidence = 0.3;
    }

    const processingTime = Date.now() - startTime;

    return {
      module: 'cursor',
      output,
      confidence,
      processingTime,
      metadata: {
        model: this.model,
        isCodeRelated,
      },
    };
  }

  private isCodeQuery(input: string): boolean {
    const codeKeywords = [
      'code', 'function', 'class', 'variable', 'debug', 'error',
      'syntax', 'compile', 'runtime', 'algorithm', 'implement',
      'refactor', 'optimize', 'javascript', 'typescript', 'python',
      'java', 'react', 'component', 'api', 'endpoint', 'database',
      'query', 'bug', 'fix', 'test', 'unit test', 'integration',
    ];

    const lowerInput = input.toLowerCase();
    return codeKeywords.some(keyword => lowerInput.includes(keyword));
  }

  private async generateCodeResponse(input: string, context?: Record<string, any>): Promise<string> {
    // Simulate code generation with example responses
    // In production, this would integrate with GPT4ALL or similar models

    const responses: Record<string, string> = {
      'function': `Here's an example function implementation:

\`\`\`typescript
function exampleFunction(param: string): string {
  // Your implementation here
  return param.toUpperCase();
}
\`\`\`

This is a basic template. Let me know what specific functionality you need!`,

      'component': `Here's a React component template:

\`\`\`typescript
import React from 'react';

export function ExampleComponent({ title }: { title: string }) {
  return (
    <div className="p-4">
      <h2>{title}</h2>
    </div>
  );
}
\`\`\`

What specific component do you need help with?`,

      'debug': `To debug your code effectively:

1. Check console for error messages
2. Use \`console.log()\` to inspect values
3. Use browser DevTools debugger
4. Verify data types and null checks
5. Review recent changes

Can you share the specific error message or code snippet?`,

      'api': `Here's a basic API endpoint pattern:

\`\`\`typescript
// Using Next.js App Router
export async function GET(request: Request) {
  try {
    const data = await fetchData();
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
\`\`\`

What kind of API are you building?`,
    };

    // Find matching response based on keywords
    const lowerInput = input.toLowerCase();
    for (const [keyword, response] of Object.entries(responses)) {
      if (lowerInput.includes(keyword)) {
        return response;
      }
    }

    return `I can help with code-related tasks including:
- Writing functions and components
- Debugging code
- Creating API endpoints
- Code optimization
- Testing strategies

What specific coding task can I help you with?`;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  getModel(): string {
    return this.model;
  }
}
