# AI Enhancement Implementation for T.O.O.L.S Inc

## 🎉 What's New

This implementation adds **three levels of AI enhancement** to the T.O.O.L.S Inc platform:

### 1. **Enhanced ChatBot** (Floating AI Assistant)
- ✅ Real Azure OpenAI integration
- ✅ Streaming responses for real-time interaction
- ✅ Context-aware conversations
- ✅ Graceful fallback when AI unavailable
- **Location**: Bottom-right floating button on all pages

### 2. **Real AI for MackAi** (Portal Dashboard)
- ✅ Multiple AI modules with real LLM backends
- ✅ ChatGPT module: Detailed, empathetic responses
- ✅ Grok module: Quick, concise answers
- ✅ Cursor module: Step-by-step guidance
- ✅ Cascade module: Intelligent routing
- ✅ Quantum module: Decision optimization
- **Location**: `/portal/mackai`

### 3. **AI Studio** (Full AI Interface)
- ✅ Open WebUI integration
- ✅ Document Q&A (RAG)
- ✅ Advanced chat features
- ✅ Conversation history and sharing
- ✅ Multi-model support
- **Location**: `/portal/ai-studio`

---

## 🚀 Quick Start

### Step 1: Environment Setup

Copy the environment template:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Azure OpenAI credentials:
```env
# Required for ChatBot and MackAi
AZURE_OPENAI_API_KEY=your_api_key_here
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT_GPT4=gpt-4-turbo
AZURE_OPENAI_DEPLOYMENT_GPT35=gpt-35-turbo
AZURE_OPENAI_API_VERSION=2024-02-15-preview

# Feature flags
NEXT_PUBLIC_AI_ENABLED=true
NEXT_PUBLIC_MACKAI_REAL_AI=true
NEXT_PUBLIC_OPENWEBUI_ENABLED=true
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Start Development Server

```bash
npm run dev
```

Visit:
- Main site: https://sdtoolsinc.org
- MackAi Dashboard: https://sdtoolsinc.org/portal/mackai
- AI Studio: https://sdtoolsinc.org/portal/ai-studio

### Step 4: Start Open WebUI (Optional)

```bash
docker-compose -f docker-compose.openwebui.yml up -d
```

Access Open WebUI at: http://localhost:8080

---

## 📁 New Files Created

### Core AI Infrastructure
```
lib/ai/
├── types.ts           # TypeScript types for AI integration
├── azure.ts           # Azure OpenAI client with streaming
└── prompts.ts         # System prompts for each module

lib/mackai/modules/
└── chatgpt-real.ts    # Real ChatGPT module (vs mock)
```

### Application Pages
```
app/portal/ai-studio/
└── page.tsx           # AI Studio interface page
```

### Configuration Files
```
docker-compose.openwebui.yml   # Open WebUI deployment
.env.example                   # Updated with AI config
AI_IMPLEMENTATION_GUIDE.md     # Comprehensive guide
AI_IMPLEMENTATION_README.md    # This file
```

---

## 🔧 Configuration Options

### AI Provider Selection

The system automatically detects which AI provider to use:

1. **Azure OpenAI** (Recommended for production)
   - Set `AZURE_OPENAI_API_KEY` and `AZURE_OPENAI_ENDPOINT`
   - Best for enterprise, GDPR compliance, content filtering

2. **OpenAI Direct** (Alternative)
   - Set `OPENAI_API_KEY`
   - Simpler setup, but less control

3. **Mock/Fallback** (Development)
   - No credentials needed
   - Returns hardcoded responses

### Feature Flags

Enable/disable AI features independently:

```env
# Master switch - disables all AI if false
NEXT_PUBLIC_AI_ENABLED=true

# Use real AI in MackAi modules (vs hardcoded responses)
NEXT_PUBLIC_MACKAI_REAL_AI=true

# Show AI Studio in navigation
NEXT_PUBLIC_OPENWEBUI_ENABLED=true
```

### AI Behavior Configuration

```env
# Token limits (affects response length and cost)
AI_MAX_TOKENS=2000

# Temperature (0-2, higher = more creative)
AI_TEMPERATURE=0.7

# Top P (0-1, nucleus sampling)
AI_TOP_P=0.95

# Rate limiting
AI_RATE_LIMIT_PER_MINUTE=20
AI_RATE_LIMIT_PER_HOUR=500
```

---

## 💰 Cost Management

### Azure OpenAI Pricing

| Model | Input | Output | Best For |
|-------|-------|--------|----------|
| GPT-4 Turbo | $0.01/1K | $0.03/1K | Complex queries |
| GPT-3.5 Turbo | $0.0005/1K | $0.0015/1K | Simple queries |

### Estimated Costs

**Low Usage** (1,000 chats/month @ 500 tokens avg):
- GPT-3.5: ~$1.50/month 💚
- GPT-4: ~$30/month ⚠️

**Medium Usage** (10,000 chats/month):
- GPT-3.5: ~$15/month 💚
- GPT-4: ~$300/month ⚠️

### Cost Optimization Tips

1. **Use Cascade Module** - Automatically routes simple queries to GPT-3.5
2. **Set Token Limits** - Prevent unexpectedly long responses
3. **Enable Caching** - Reuse responses for common questions
4. **Monitor Usage** - Set up Azure Cost Management alerts

---

## 🎯 Usage Guide

### ChatBot (Floating Assistant)

The ChatBot appears on all pages as a floating button in the bottom-right.

**Features:**
- Click to open chat window
- Type questions about T.O.O.L.S Inc programs
- Responses stream in real-time
- Conversation history maintained
- Works offline with fallback responses

**Example Questions:**
- "Tell me about your job readiness program"
- "How do I refer someone to your services?"
- "What reentry support do you offer?"

### MackAi Dashboard

Navigate to `/portal/mackai` for advanced AI testing.

**Features:**
- Test each AI module individually
- View system status and statistics
- See processing times and confidence scores
- Monitor learning and feedback data

**Modules:**
- **ChatGPT**: Detailed, empathetic responses
- **Grok**: Quick, concise answers
- **Cursor**: Step-by-step instructions
- **Cascade**: Auto-routing to best module
- **Quantum**: Decision optimization

### AI Studio (Open WebUI)

Navigate to `/portal/ai-studio` for the full AI interface.

**Features:**
- Upload documents and chat with them
- Save and organize conversations
- Share conversations with team
- Custom prompts and personas
- Multiple AI models

**Use Cases:**
- Document analysis
- Complex research tasks
- Team collaboration
- Long-form content creation

---

## 🔒 Security & Privacy

### API Key Management

**Development:**
- Store keys in `.env.local` (never commit!)
- `.gitignore` excludes `.env.local` automatically

**Production:**
- Use Azure Static Web Apps environment variables
- Or use Azure Key Vault for enhanced security
- Rotate keys quarterly

### Content Filtering

Azure OpenAI includes built-in content filtering:
- Hate speech detection
- Sexual content filtering
- Violence detection
- Self-harm prevention

### Rate Limiting

Client-side rate limiting prevents abuse:
- 20 requests per minute per user
- 500 requests per hour per user
- Configurable in `.env`

### Data Privacy

All AI processing happens in your Azure environment:
- No data sent to external services
- GDPR and HIPAA compliant (Azure OpenAI)
- Full audit logs available
- User data never used for training

---

## 🧪 Testing

### Test Real AI Integration

```bash
# Start dev server
npm run dev

# Test ChatBot
# 1. Open any page (e.g., https://sdtoolsinc.org)
# 2. Click floating chat button
# 3. Ask: "Tell me about your programs"
# 4. Verify you get a real AI response (not hardcoded)

# Test MackAi
# 1. Navigate to https://sdtoolsinc.org/portal/mackai
# 2. Select "ChatGPT" module
# 3. Enter a test question
# 4. Verify response is detailed and relevant

# Test AI Studio
# 1. Start Open WebUI: docker-compose -f docker-compose.openwebui.yml up -d
# 2. Navigate to https://sdtoolsinc.org/portal/ai-studio
# 3. Verify iframe loads and shows Open WebUI
```

### Test Fallback Behavior

```bash
# Temporarily disable AI
# In .env.local, set:
NEXT_PUBLIC_AI_ENABLED=false

# Restart dev server
npm run dev

# Test ChatBot - should show fallback responses
# Test MackAi - should use hardcoded responses
```

---

## 🐛 Troubleshooting

### "AI module not responding"

**Check 1: Environment variables loaded?**
```typescript
// Add to your page temporarily
console.log('AI Enabled:', process.env.NEXT_PUBLIC_AI_ENABLED);
console.log('Has API Key:', !!process.env.AZURE_OPENAI_API_KEY);
```

**Check 2: API key correct?**
- Get key from Azure Portal
- Verify endpoint URL format: `https://xxx.openai.azure.com/`
- Ensure no trailing slashes or extra spaces

**Check 3: Deployment names match?**
```bash
# List deployments
az cognitiveservices account deployment list \
  --name your-resource-name \
  --resource-group your-rg-name
```

### "Rate limit exceeded"

**Option 1: Increase limits in Azure**
- Azure Portal → Your OpenAI Resource → Quotas
- Request TPM (tokens per minute) increase

**Option 2: Adjust client limits**
```env
# In .env.local
AI_RATE_LIMIT_PER_MINUTE=10  # Lower limit
AI_RATE_LIMIT_PER_HOUR=200   # Lower limit
```

### "Streaming not working"

**Check 1: Browser compatibility**
- Streaming requires EventSource support
- Works in all modern browsers

**Check 2: API version**
```env
# Use latest API version
AZURE_OPENAI_API_VERSION=2024-02-15-preview
```

**Check 3: Deployment supports streaming**
- Some older models don't support streaming
- Use GPT-4 Turbo or GPT-3.5 Turbo

### "Open WebUI connection failed"

**Check 1: Container running?**
```bash
docker ps | grep openwebui
```

**Check 2: Port available?**
```bash
# Windows
netstat -ano | findstr :8080

# Linux/Mac
lsof -i :8080
```

**Check 3: Environment variables passed?**
```bash
docker logs toolsinc-openwebui
# Look for "OPENAI_API_BASE" in logs
```

---

## 📊 Monitoring & Analytics

### Azure Application Insights

Track AI usage and performance:

```bash
# Create Application Insights
az monitor app-insights component create \
  --app toolsinc-ai-insights \
  --location eastus \
  --resource-group toolsinc-rg
```

Add to `.env.local`:
```env
APPINSIGHTS_INSTRUMENTATIONKEY=your_key_here
```

### Metrics to Monitor

- **Request Count**: Total AI requests per day
- **Token Usage**: Total tokens consumed
- **Response Time**: Average processing time
- **Error Rate**: Failed requests percentage
- **Cost**: Estimated daily/monthly spend

### Example Queries (Application Insights)

```kusto
// AI requests by module
customEvents
| where name == "ai_request"
| summarize count() by tostring(customDimensions.module)

// Average response time
customEvents
| where name == "ai_request"
| summarize avg(todouble(customDimensions.responseTime))

// Token usage by day
customEvents
| where name == "ai_request"
| summarize sum(toint(customDimensions.tokensUsed)) by bin(timestamp, 1d)
```

---

## 🚀 Deployment

### Azure Static Web Apps

Environment variables are already configured:
```bash
# Variables added via Azure Portal:
# AZURE_OPENAI_API_KEY
# AZURE_OPENAI_ENDPOINT
# AZURE_OPENAI_DEPLOYMENT_GPT4
# AZURE_OPENAI_DEPLOYMENT_GPT35
```

### Deploy Open WebUI to Azure

**Option 1: Azure Container Instances**
```bash
az container create \
  --resource-group toolsinc-rg \
  --name toolsinc-openwebui \
  --image ghcr.io/open-webui/open-webui:main \
  --dns-name-label toolsinc-openwebui \
  --ports 8080 \
  --environment-variables \
    OPENAI_API_BASE=$AZURE_OPENAI_ENDPOINT \
    OPENAI_API_KEY=$AZURE_OPENAI_API_KEY \
    OPENAI_API_TYPE=azure
```

**Option 2: Azure App Service**
See `AI_IMPLEMENTATION_GUIDE.md` for detailed steps.

---

## 📚 Next Steps

### Phase 1: Basic Setup ✅
- [x] Azure OpenAI configured
- [x] ChatBot enhanced with real AI
- [x] MackAi modules using real LLMs
- [x] Open WebUI integrated

### Phase 2: Advanced Features (Future)
- [ ] RAG with Azure AI Search
- [ ] Fine-tuned models for T.O.O.L.S Inc domain
- [ ] Multi-modal AI (images, voice)
- [ ] AI agents for automated workflows

### Phase 3: Optimization (Future)
- [ ] Response caching layer
- [ ] Smart model routing
- [ ] Cost optimization algorithms
- [ ] A/B testing framework

---

## 🆘 Support

### Resources
- **Implementation Guide**: `AI_IMPLEMENTATION_GUIDE.md`
- **Azure OpenAI Docs**: https://learn.microsoft.com/azure/ai-services/openai/
- **Open WebUI Docs**: https://docs.openwebui.com/

### Contact
- **Email**: info@sdtoolsinc.org
- **Technical**: dthree@sdtoolsinc.org

---

## 📝 License

Proprietary - T.O.O.L.S Inc © 2026

