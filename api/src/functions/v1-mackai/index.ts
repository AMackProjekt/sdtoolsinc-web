import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { ok, fail } from "../../shared/http";

/**
 * MackAi Process Endpoint
 * Processes AI requests through the appropriate MackAi module
 */

// Type definitions
interface AIRequest {
  module: 'cursor' | 'grok' | 'chatgpt' | 'cascade' | 'quantum';
  input: string;
  context?: Record<string, any>;
  userId?: string;
  sessionId?: string;
}

interface AIResponse {
  module: string;
  output: string;
  confidence: number;
  processingTime: number;
  metadata?: Record<string, any>;
}

// In-memory storage for feedback and learning data (replace with database in production)
const feedbackStore: any[] = [];
const learningStore: any[] = [];

/**
 * Process AI request
 */
export async function v1MackaiProcess(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  if (req.method?.toUpperCase() !== "POST") {
    return fail("method_not_allowed", "Only POST method is allowed.", 405);
  }

  let body: AIRequest;
  try {
    body = await req.json() as AIRequest;
  } catch {
    return fail("invalid_json", "Request body must be valid JSON.", 400);
  }

  // Validate request
  if (!body.module || !body.input) {
    return fail("validation_error", "Fields 'module' and 'input' are required.", 422);
  }

  const validModules = ['cursor', 'grok', 'chatgpt', 'cascade', 'quantum'];
  if (!validModules.includes(body.module)) {
    return fail("validation_error", `Invalid module. Must be one of: ${validModules.join(', ')}`, 422);
  }

  try {
    const startTime = Date.now();

    // Simulate AI processing (in production, integrate with actual AI models)
    const response: AIResponse = await processAIRequest(body);
    
    const processingTime = Date.now() - startTime;
    response.processingTime = processingTime;

    context.log(`MackAi processed ${body.module} request in ${processingTime}ms`);

    return ok(response);
  } catch (error) {
    context.error('MackAi processing error:', error);
    return fail("processing_error", "Failed to process AI request.", 500);
  }
}

/**
 * Add feedback for a request
 */
export async function v1MackaiFeedback(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  if (req.method?.toUpperCase() !== "POST") {
    return fail("method_not_allowed", "Only POST method is allowed.", 405);
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return fail("invalid_json", "Request body must be valid JSON.", 400);
  }

  // Validate feedback
  if (!body.requestId || typeof body.rating !== 'number' || typeof body.helpful !== 'boolean') {
    return fail("validation_error", "Fields 'requestId', 'rating' (number), and 'helpful' (boolean) are required.", 422);
  }

  if (body.rating < 1 || body.rating > 5) {
    return fail("validation_error", "Rating must be between 1 and 5.", 422);
  }

  // Store feedback
  const feedback = {
    requestId: body.requestId,
    rating: body.rating,
    helpful: body.helpful,
    comment: body.comment || '',
    userId: body.userId,
    timestamp: new Date().toISOString(),
  };

  feedbackStore.push(feedback);
  context.log(`Stored feedback for request ${body.requestId}`);

  return ok({ success: true, message: 'Feedback recorded successfully' });
}

/**
 * Get statistics
 */
export async function v1MackaiStatistics(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  if (req.method?.toUpperCase() !== "GET") {
    return fail("method_not_allowed", "Only GET method is allowed.", 405);
  }

  const stats = {
    totalInteractions: learningStore.length,
    totalFeedback: feedbackStore.length,
    averageRating: feedbackStore.length > 0 
      ? feedbackStore.reduce((sum, f) => sum + f.rating, 0) / feedbackStore.length 
      : 0,
    moduleBreakdown: calculateModuleBreakdown(),
  };

  return ok(stats);
}

/**
 * Get module status
 */
export async function v1MackaiStatus(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  if (req.method?.toUpperCase() !== "GET") {
    return fail("method_not_allowed", "Only GET method is allowed.", 405);
  }

  const status = {
    cursor: { enabled: true, model: 'gpt4all' },
    grok: { enabled: true, model: 'grok-1' },
    chatgpt: { enabled: true, model: 'llama-3' },
    cascade: { enabled: true },
    quantum: { enabled: false, algorithm: 'annealing', iterations: 100 },
    selfLearning: { enabled: true },
  };

  return ok(status);
}

// Helper functions

async function processAIRequest(request: AIRequest): Promise<AIResponse> {
  // This is a simplified simulation
  // In production, integrate with actual AI models via appropriate libraries

  const responses: Record<string, string> = {
    cursor: "I can help with code-related tasks. Please provide more details about what you need.",
    grok: "Quick insight: That's an interesting question! Let me help you with that. 🚀",
    chatgpt: "I'd be happy to provide a detailed response. Please share more about what you'd like to know.",
    cascade: "I'll route your request to the most appropriate AI module for the best response.",
    quantum: "Quantum-inspired optimization can help with complex problems. What would you like to optimize?",
  };

  const output = responses[request.module] || "Response from MackAi";
  
  // Store interaction for learning
  learningStore.push({
    module: request.module,
    input: request.input,
    output: output,
    timestamp: new Date().toISOString(),
    sessionId: request.sessionId,
  });

  return {
    module: request.module,
    output: output,
    confidence: 0.85,
    processingTime: 0, // Will be set by caller
    metadata: {
      requestId: crypto.randomUUID(),
      sessionId: request.sessionId,
      timestamp: new Date().toISOString(),
    },
  };
}

function calculateModuleBreakdown(): Record<string, number> {
  const breakdown: Record<string, number> = {};
  
  learningStore.forEach(interaction => {
    const module = interaction.module;
    breakdown[module] = (breakdown[module] || 0) + 1;
  });

  return breakdown;
}

// Register Azure Functions
app.http("v1-mackai-process", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "v1/mackai/process",
  handler: v1MackaiProcess
});

app.http("v1-mackai-feedback", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "v1/mackai/feedback",
  handler: v1MackaiFeedback
});

app.http("v1-mackai-statistics", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "v1/mackai/statistics",
  handler: v1MackaiStatistics
});

app.http("v1-mackai-status", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "v1/mackai/status",
  handler: v1MackaiStatus
});
