# AI Implementation Guide - T.O.O.L.S Inc

## 🎯 Overview

This guide implements **three AI enhancements** for T.O.O.L.S Inc:

1. **Enhanced ChatBot** - Replace keyword matching with real Azure OpenAI
2. **Real AI for MackAi** - Connect all modules to actual LLM APIs
3. **Open WebUI Integration** - Full-featured AI interface for power users

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    T.O.O.L.S Inc Platform                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   ChatBot UI    │  │  MackAi UI   │  │ Open WebUI   │  │
│  │  (Floating)     │  │  (Portal)    │  │  (iFrame)    │  │
│  └────────┬────────┘  └──────┬───────┘  └──────┬───────┘  │
│           │                  │                  │          │
│           └──────────┬───────┴──────────────────┘          │
│                      │                                      │
│           ┌──────────▼────────────┐                        │
│           │  Azure OpenAI Client  │                        │
│           │  (lib/ai/azure.ts)    │                        │
│           └──────────┬────────────┘                        │
│                      │                                      │
└──────────────────────┼──────────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
┌───────▼────────┐           ┌────────▼────────┐
│ Azure OpenAI   │           │  Open WebUI     │
│   Service      │           │  (Container)    │
│                │           │                 │
│ • GPT-4 Turbo  │           │ • Self-hosted   │
│ • GPT-3.5      │           │ • Multi-model   │
│ • Embeddings   │           │ • RAG support   │
└────────────────┘           └─────────────────┘
```

---

## 📦 Phase 1: Azure OpenAI Setup

### Step 1: Create Azure OpenAI Resource

```bash
# Login to Azure
az login

# Create resource group (if not exists)
az group create --name toolsinc-rg --location eastus

# Create Azure OpenAI resource
az cognitiveservices account create \
  --name toolsinc-openai \
  --resource-group toolsinc-rg \
  --kind OpenAI \
  --sku S0 \
  --location eastus
```

### Step 2: Deploy Models

```bash
# Deploy GPT-4 Turbo
az cognitiveservices account deployment create \
  --name toolsinc-openai \
  --resource-group toolsinc-rg \
  --deployment-name gpt-4-turbo \
  --model-name gpt-4 \
  --model-version turbo-2024-04-09 \
  --model-format OpenAI \
  --sku-capacity 10 \
  --sku-name Standard

# Deploy GPT-3.5 Turbo (fallback/cost-effective)
az cognitiveservices account deployment create \
  --name toolsinc-openai \
  --resource-group toolsinc-rg \
  --deployment-name gpt-35-turbo \
  --model-name gpt-35-turbo \
  --model-version 0613 \
  --model-format OpenAI \
  --sku-capacity 30 \
  --sku-name Standard
```

### Step 3: Get API Keys

```bash
# Get endpoint
az cognitiveservices account show \
  --name toolsinc-openai \
  --resource-group toolsinc-rg \
  --query properties.endpoint \
  --output tsv

# Get API key
az cognitiveservices account keys list \
  --name toolsinc-openai \
  --resource-group toolsinc-rg \
  --query key1 \
  --output tsv
```

---

## 🔧 Phase 2: Update MackAi Implementation

### Update Environment Variables

Add to `.env.local`:

```env
# Azure OpenAI
AZURE_OPENAI_API_KEY=your_api_key_here
AZURE_OPENAI_ENDPOINT=https://toolsinc-openai.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT_GPT4=gpt-4-turbo
AZURE_OPENAI_DEPLOYMENT_GPT35=gpt-35-turbo
AZURE_OPENAI_API_VERSION=2024-02-15-preview

# Feature Flags
NEXT_PUBLIC_AI_ENABLED=true
NEXT_PUBLIC_MACKAI_REAL_AI=true
```

### Files Created

1. **`lib/ai/azure.ts`** - Azure OpenAI client wrapper
2. **`lib/ai/types.ts`** - TypeScript types
3. **`lib/ai/prompts.ts`** - System prompts for each module
4. **`lib/mackai/modules/chatgpt-real.ts`** - Real ChatGPT module
5. **`lib/mackai/modules/cursor-real.ts`** - Real Cursor module
6. **`lib/mackai/modules/grok-real.ts`** - Real Grok module

---

## 🚀 Phase 3: Enhanced ChatBot

### Features Added

- ✅ **Streaming responses** - Real-time token streaming
- ✅ **Context awareness** - Maintains conversation history
- ✅ **Smart routing** - Cascade module routes to best AI
- ✅ **Fallback handling** - Graceful degradation if API fails
- ✅ **Rate limiting** - Client-side throttling
- ✅ **Cost tracking** - Token usage monitoring

### Usage

```typescript
// In components/ui/ChatBot.tsx
import { azureOpenAI } from "@/lib/ai/azure";

const response = await azureOpenAI.chat({
  messages: conversationHistory,
  stream: true,
  onToken: (token) => {
    // Updates UI in real-time
    setCurrentMessage(prev => prev + token);
  }
});
```

---

## 🌐 Phase 4: Open WebUI Integration

### Option A: Azure Container Instances (Recommended)

```bash
# Create container instance
az container create \
  --resource-group toolsinc-rg \
  --name toolsinc-openwebui \
  --image ghcr.io/open-webui/open-webui:main \
  --dns-name-label toolsinc-openwebui \
  --ports 8080 \
  --environment-variables \
    OPENAI_API_BASE=https://toolsinc-openai.openai.azure.com/ \
    OPENAI_API_KEY=$AZURE_OPENAI_API_KEY \
    OPENAI_API_TYPE=azure \
  --cpu 2 \
  --memory 4
```

**Access URL**: `http://toolsinc-openwebui.eastus.azurecontainer.io:8080`

### Option B: Azure App Service (Container)

```bash
# Create App Service plan
az appservice plan create \
  --name toolsinc-plan \
  --resource-group toolsinc-rg \
  --is-linux \
  --sku P1V2

# Create web app
az webapp create \
  --resource-group toolsinc-rg \
  --plan toolsinc-plan \
  --name toolsinc-openwebui \
  --deployment-container-image-name ghcr.io/open-webui/open-webui:main

# Configure
az webapp config appsettings set \
  --resource-group toolsinc-rg \
  --name toolsinc-openwebui \
  --settings \
    OPENAI_API_BASE=https://toolsinc-openai.openai.azure.com/ \
    OPENAI_API_KEY=$AZURE_OPENAI_API_KEY \
    OPENAI_API_TYPE=azure
```

**Access URL**: `https://toolsinc-openwebui.azurewebsites.net`

### Option C: Docker Compose (Local/Testing)

See `docker-compose.openwebui.yml` (created in next step)

---

## 🔗 Phase 5: Portal Integration

### Create Full AI Interface Page

**New Page**: `app/portal/ai-studio/page.tsx`

```typescript
export default function AIStudioPage() {
  return (
    <main className="min-h-screen bg-bg">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />
      <Navbar />

      <section className="mx-auto max-w-[1600px] px-7 pt-24 pb-16">
        <SectionHeading
          eyebrow="AI Studio"
          title="Full AI Interface"
          subtitle="Powered by Open WebUI - Advanced AI chat, RAG, and multi-model support"
        />

        <div className="mt-10">
          <GlowCard className="p-0 overflow-hidden" style={{ height: '80vh' }}>
            <iframe
              src={process.env.NEXT_PUBLIC_OPENWEBUI_URL}
              className="w-full h-full border-0"
              title="Open WebUI"
            />
          </GlowCard>
        </div>
      </section>
    </main>
  );
}
```

### Update Navigation

Add to `components/ui/Navbar.tsx`:

```typescript
{ href: "/portal/ai-studio", label: "AI Studio" }
```

---

## 💰 Cost Optimization

### Azure OpenAI Pricing (East US)

| Model | Input (per 1K tokens) | Output (per 1K tokens) | Use Case |
|-------|----------------------|------------------------|----------|
| GPT-4 Turbo | $0.01 | $0.03 | Complex reasoning, detailed responses |
| GPT-3.5 Turbo | $0.0005 | $0.0015 | Simple queries, high volume |

### Estimated Monthly Costs

**Low Usage** (1,000 chats/month, avg 500 tokens each):
- GPT-3.5: ~$1.50/month
- GPT-4: ~$30/month

**Medium Usage** (10,000 chats/month):
- GPT-3.5: ~$15/month
- GPT-4: ~$300/month

**Optimization Strategies**:
1. Use **Cascade routing** - GPT-3.5 for simple, GPT-4 for complex
2. Implement **caching** for common questions
3. Set **max token limits** per request
4. Use **streaming** to allow early termination
5. Monitor with Azure Cost Management

---

## 🔒 Security Best Practices

### API Key Management

1. **Never commit keys to git** - Use `.env.local` (in `.gitignore`)
2. **Use Azure Key Vault** for production
3. **Rotate keys** quarterly
4. **Use managed identities** when possible

### Content Filtering

Azure OpenAI includes built-in content filters:

```typescript
// In lib/ai/azure.ts
const response = await azureOpenAI.chat({
  messages,
  contentFilterLevel: 'strict', // or 'moderate', 'low'
});
```

### Rate Limiting

```typescript
// Client-side throttling
import { rateLimit } from "@/lib/ai/rateLimit";

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 100, // Max 100 users
});

await limiter.check(userId, 10); // 10 requests per minute per user
```

---

## 🧪 Testing

### Test Real AI Module

```bash
# Start dev server
npm run dev

# Navigate to
# https://sdtoolsinc.org/portal/mackai

# Test each module:
# 1. Select "ChatGPT" module
# 2. Enter: "Explain the job readiness program in detail"
# 3. Verify real AI response (not hardcoded text)

# Test streaming:
# 1. Select "Cascade" module
# 2. Enter a complex question
# 3. Watch response stream in real-time
```

### Test Open WebUI

```bash
# Local testing
docker-compose -f docker-compose.openwebui.yml up

# Navigate to
# http://localhost:8080

# Configure:
# Settings > Connections > Add Azure OpenAI
# - Base URL: https://toolsinc-openai.openai.azure.com/
# - API Key: [your key]
# - API Type: Azure
```

---

## 📊 Monitoring & Analytics

### Azure Application Insights

```bash
# Create Application Insights
az monitor app-insights component create \
  --app toolsinc-ai-insights \
  --location eastus \
  --resource-group toolsinc-rg

# Get instrumentation key
az monitor app-insights component show \
  --app toolsinc-ai-insights \
  --resource-group toolsinc-rg \
  --query instrumentationKey \
  --output tsv
```

### Track Metrics

```typescript
// lib/ai/analytics.ts
export function trackAIUsage(data: {
  module: string;
  tokensUsed: number;
  responseTime: number;
  userId?: string;
}) {
  // Send to Application Insights
  appInsights.trackEvent({
    name: "ai_request",
    properties: data,
  });
}
```

---

## 🚀 Deployment Checklist

### Pre-Deployment

- [ ] Azure OpenAI resource created
- [ ] Models deployed (GPT-4, GPT-3.5)
- [ ] API keys added to Azure Static Web Apps configuration
- [ ] Content filtering configured
- [ ] Rate limiting implemented
- [ ] Cost alerts configured

### Post-Deployment

- [ ] Test ChatBot in production
- [ ] Test MackAi dashboard
- [ ] Verify Open WebUI integration
- [ ] Monitor costs for first week
- [ ] Collect user feedback
- [ ] Adjust rate limits if needed

---

## 📚 Next Steps

### Phase 6: Advanced Features (Future)

1. **RAG (Retrieval Augmented Generation)**
   - Index T.O.O.L.S Inc documentation
   - Vector search with Azure AI Search
   - Context-aware responses

2. **Multi-Modal AI**
   - Image understanding (GPT-4 Vision)
   - Document processing
   - Voice interaction

3. **Custom Fine-Tuning**
   - Fine-tune models on T.O.O.L.S Inc data
   - Specialized responses for reentry services
   - Domain-specific knowledge

4. **AI Agents**
   - Automated referral processing
   - Smart scheduling assistant
   - Program recommendations

---

## 🆘 Troubleshooting

### "AI module not responding"

```typescript
// Check environment variables
console.log(process.env.AZURE_OPENAI_API_KEY ? "✓ Key loaded" : "✗ Key missing");

// Check deployment name
console.log(process.env.AZURE_OPENAI_DEPLOYMENT_GPT4);
```

### "Rate limit exceeded"

- Check Azure OpenAI quota in portal
- Increase TPM (tokens per minute) limit
- Implement better client-side caching

### "Streaming not working"

- Ensure `stream: true` is set
- Check browser console for EventSource errors
- Verify API version supports streaming

---

## 📖 Resources

- [Azure OpenAI Documentation](https://learn.microsoft.com/azure/ai-services/openai/)
- [Open WebUI Documentation](https://docs.openwebui.com/)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Azure AI Content Safety](https://learn.microsoft.com/azure/ai-services/content-safety/)

---

## 💬 Support

Questions? Contact:
- **Email**: info@sdtoolsinc.org
- **Technical**: dthree@sdtoolsinc.org

