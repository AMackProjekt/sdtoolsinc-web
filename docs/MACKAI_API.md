# MackAi API Integration Guide

## Overview

This guide demonstrates how to integrate with the MackAi API endpoints for server-side AI processing.

## Available Endpoints

### 1. Process AI Request

**Endpoint**: `POST /api/v1/mackai/process`

Process an AI request through the specified module.

**Request Body**:
```json
{
  "module": "cascade",
  "input": "What programs does T.O.O.L.S Inc offer?",
  "context": {},
  "userId": "user-123",
  "sessionId": "session-456"
}
```

**Response**:
```json
{
  "module": "chatgpt",
  "output": "T.O.O.L.S Inc offers four core programs...",
  "confidence": 0.90,
  "processingTime": 245,
  "metadata": {
    "requestId": "req_abc123",
    "sessionId": "session-456",
    "timestamp": "2026-01-15T20:00:00.000Z"
  }
}
```

**Example (JavaScript)**:
```javascript
async function processAIRequest(module, input) {
  const response = await fetch('/api/v1/mackai/process', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      module: module,
      input: input,
      sessionId: sessionStorage.getItem('mackai_session'),
    }),
  });

  return await response.json();
}

// Usage
const result = await processAIRequest('cascade', 'Tell me about job readiness programs');
console.log(result.output);
```

### 2. Submit Feedback

**Endpoint**: `POST /api/v1/mackai/feedback`

Submit user feedback for a specific AI response.

**Request Body**:
```json
{
  "requestId": "req_abc123",
  "rating": 5,
  "helpful": true,
  "comment": "Very helpful response!",
  "userId": "user-123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Feedback recorded successfully"
}
```

**Example (JavaScript)**:
```javascript
async function submitFeedback(requestId, rating, helpful, comment) {
  const response = await fetch('/api/v1/mackai/feedback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requestId: requestId,
      rating: rating,
      helpful: helpful,
      comment: comment,
    }),
  });

  return await response.json();
}

// Usage
await submitFeedback('req_abc123', 5, true, 'Excellent response!');
```

### 3. Get Statistics

**Endpoint**: `GET /api/v1/mackai/statistics`

Retrieve learning statistics and metrics.

**Response**:
```json
{
  "totalInteractions": 1250,
  "totalFeedback": 420,
  "averageRating": 4.3,
  "moduleBreakdown": {
    "cursor": 150,
    "grok": 300,
    "chatgpt": 700,
    "cascade": 100
  }
}
```

**Example (JavaScript)**:
```javascript
async function getStatistics() {
  const response = await fetch('/api/v1/mackai/statistics');
  return await response.json();
}

// Usage
const stats = await getStatistics();
console.log(`Total interactions: ${stats.totalInteractions}`);
console.log(`Average rating: ${stats.averageRating}/5`);
```

### 4. Get Module Status

**Endpoint**: `GET /api/v1/mackai/status`

Get the status and configuration of all MackAi modules.

**Response**:
```json
{
  "cursor": {
    "enabled": true,
    "model": "gpt4all"
  },
  "grok": {
    "enabled": true,
    "model": "grok-1"
  },
  "chatgpt": {
    "enabled": true,
    "model": "llama-3"
  },
  "cascade": {
    "enabled": true
  },
  "quantum": {
    "enabled": false,
    "algorithm": "annealing",
    "iterations": 100
  },
  "selfLearning": {
    "enabled": true
  }
}
```

**Example (JavaScript)**:
```javascript
async function getModuleStatus() {
  const response = await fetch('/api/v1/mackai/status');
  return await response.json();
}

// Usage
const status = await getModuleStatus();
console.log('Cursor enabled:', status.cursor.enabled);
```

## Integration Examples

### React Component Integration

```typescript
import { useState } from 'react';

function MackAiChat() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await fetch('/api/v1/mackai/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          module: 'cascade',
          input: input,
        }),
      });

      const data = await result.json();
      setResponse(data.output);

      // Submit positive feedback automatically for successful responses
      if (data.metadata?.requestId) {
        await fetch('/api/v1/mackai/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requestId: data.metadata.requestId,
            rating: 5,
            helpful: true,
          }),
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={input} 
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask MackAi..."
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Processing...' : 'Submit'}
      </button>
      {response && <div>{response}</div>}
    </form>
  );
}
```

### Next.js API Route Integration

```typescript
// app/api/mackai/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Forward to Azure Functions backend
  const response = await fetch('https://your-app.azurewebsites.net/api/v1/mackai/process', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return NextResponse.json(data);
}
```

## Error Handling

All endpoints return errors in a consistent format:

```json
{
  "error": {
    "code": "validation_error",
    "message": "Fields 'module' and 'input' are required.",
    "status": 422
  }
}
```

**Common Error Codes**:
- `invalid_json` (400): Request body is not valid JSON
- `validation_error` (422): Invalid or missing required fields
- `method_not_allowed` (405): HTTP method not supported
- `processing_error` (500): Internal server error during AI processing

**Example Error Handling**:
```javascript
async function processWithErrorHandling(module, input) {
  try {
    const response = await fetch('/api/v1/mackai/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ module, input }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('MackAi error:', error);
    return {
      module: 'error',
      output: 'Sorry, something went wrong. Please try again.',
      confidence: 0,
      processingTime: 0,
    };
  }
}
```

## Rate Limiting

Current implementation has no rate limiting. For production deployments, consider:

1. **Azure API Management**: Add rate limiting policies
2. **Application-level**: Implement request throttling
3. **User-based**: Track requests per user/session
4. **IP-based**: Limit requests per IP address

## Security Considerations

1. **Authentication**: Currently set to `anonymous`. For production:
   - Enable Azure Functions authentication
   - Use JWT tokens or API keys
   - Implement user authorization

2. **Data Validation**: Always validate and sanitize inputs
3. **CORS**: Configure appropriate CORS policies
4. **HTTPS**: Ensure all API calls use HTTPS
5. **Secrets**: Never expose API keys or secrets in client code

## Performance Tips

1. **Caching**: Cache frequently requested responses
2. **Batch Requests**: Send multiple inputs in one request (future feature)
3. **Compression**: Enable gzip compression for responses
4. **CDN**: Use Azure CDN for static assets
5. **Connection Pooling**: Reuse HTTP connections

## Monitoring

Monitor API performance using:

1. **Application Insights**: Azure Functions built-in monitoring
2. **Custom Metrics**: Track response times, error rates
3. **User Analytics**: Track module usage patterns
4. **Feedback Analysis**: Monitor feedback ratings and comments

## Next Steps

1. **Database Integration**: Replace in-memory storage with Cosmos DB or SQL
2. **Real AI Models**: Integrate actual AI models (GPT4ALL, LLaMA, etc.)
3. **Streaming Responses**: Support server-sent events for real-time streaming
4. **Webhook Support**: Send notifications when processing completes
5. **Batch Processing**: Support multiple requests in one API call

## Support

For questions or issues:
- Documentation: `/docs/MACKAI.md`
- Email: info@sdtoolsinc.org
- Dashboard: `/portal/mackai`
