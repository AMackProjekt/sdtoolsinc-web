# Migration Guide: Upgrading ChatBot and MackAi to Real AI

This guide helps you migrate from the hardcoded AI responses to real Azure OpenAI integration.

---

## Option 1: Keep Current Implementation (Recommended)

The **easiest approach** is to keep using the existing `ChatBot.tsx` and MackAi modules **as-is**. They already work with the new AI system through feature flags:

### How It Works:

1. **With AI Configured** (`.env.local` has Azure OpenAI credentials):
   - `NEXT_PUBLIC_AI_ENABLED=true`
   - `NEXT_PUBLIC_MACKAI_REAL_AI=true`
   - ✅ ChatBot and MackAi automatically use real AI

2. **Without AI Configured** (no credentials):
   - Feature flags `false` or missing
   - ✅ ChatBot and MackAi automatically use fallback (hardcoded responses)

### Steps:

```bash
# 1. Configure environment
cp .env.example .env.local
# Edit .env.local with your Azure OpenAI credentials

# 2. That's it! No code changes needed.
```

The existing code already has fallback logic:
```typescript
// In lib/mackai/modules/chatgpt.ts
async generateDetailedResponse(input: string) {
  // Hardcoded responses as fallback
  // Automatically used when AI not configured
}
```

---

## Option 2: Explicitly Use Real AI Modules

If you want to **explicitly** use the new real AI modules, you can update the MackAi service:

### Step 1: Update MackAi Service

**File**: `lib/mackai/service.ts`

**Option A: Conditional Import** (Use real AI when available)
```typescript
import { ChatGPTModule } from './modules/chatgpt'; // Fallback
import { ChatGPTModuleReal } from './modules/chatgpt-real'; // Real AI

export class MackAiService {
  private chatgptModule: ChatGPTModule | ChatGPTModuleReal;

  constructor(config?: Partial<MackAiConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };

    // Use real AI module if configured
    const useRealAI = 
      process.env.NEXT_PUBLIC_MACKAI_REAL_AI === 'true' &&
      process.env.AZURE_OPENAI_API_KEY;

    if (useRealAI) {
      this.chatgptModule = new ChatGPTModuleReal(
        this.config.modules.chatgpt.enabled,
        this.config.modules.chatgpt.model
      );
    } else {
      this.chatgptModule = new ChatGPTModule(
        this.config.modules.chatgpt.enabled,
        this.config.modules.chatgpt.model
      );
    }

    // ... rest of initialization
  }
}
```

**Option B: Always Use Real AI** (with built-in fallback)
```typescript
import { ChatGPTModuleReal as ChatGPTModule } from './modules/chatgpt-real';
// The real module already has fallback logic built-in
```

### Step 2: Update Index Export

**File**: `lib/mackai/index.ts`

```typescript
export { ChatGPTModuleReal as ChatGPTModule } from './modules/chatgpt-real';
// Or keep both exports for flexibility
export { ChatGPTModule } from './modules/chatgpt';
export { ChatGPTModuleReal } from './modules/chatgpt-real';
```

---

## Option 3: Hybrid Approach (Best of Both Worlds)

Use real AI for some modules, keep fallback for others:

```typescript
import { ChatGPTModuleReal } from './modules/chatgpt-real';
import { GrokModule } from './modules/grok'; // Keep hardcoded for quick responses

export class MackAiService {
  private chatgptModule: ChatGPTModuleReal;
  private grokModule: GrokModule;

  constructor(config?: Partial<MackAiConfig>) {
    // Real AI for detailed responses
    this.chatgptModule = new ChatGPTModuleReal(
      this.config.modules.chatgpt.enabled,
      'gpt-4-turbo'
    );

    // Hardcoded for instant responses
    this.grokModule = new GrokModule(
      this.config.modules.grok.enabled,
      this.config.modules.grok.model
    );
  }
}
```

---

## ChatBot Component Migration

The **existing ChatBot** (`components/ui/ChatBot.tsx`) already uses MackAi, so:

### Current Flow:
```
ChatBot.tsx 
  → getMackAiInstance()
    → Cascade module
      → Routes to best module (ChatGPT, Grok, etc.)
        → Uses real AI if configured
        → Falls back to hardcoded if not
```

### No changes needed! But if you want direct AI access:

```typescript
// In components/ui/ChatBot.tsx
import { azureOpenAI } from '@/lib/ai';
import { CHATGPT_SYSTEM_PROMPT } from '@/lib/ai/prompts';

const handleSend = async () => {
  // ... existing code

  // Direct AI call (bypassing MackAi)
  try {
    const response = await azureOpenAI.chat({
      messages: [
        CHATGPT_SYSTEM_PROMPT,
        ...conversationHistory,
        { role: 'user', content: userInput }
      ],
      stream: true,
      onToken: (token) => {
        // Update UI with each token
        setCurrentMessage(prev => prev + token);
      },
      onComplete: (fullResponse) => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: fullResponse,
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      },
    });
  } catch (error) {
    // Fallback to MackAi
    const response = await getBotResponse(userInput);
    // ... existing fallback code
  }
};
```

---

## Testing Your Migration

### Test 1: Verify Fallback Works
```bash
# Don't configure Azure OpenAI (no .env.local)
npm run dev

# Test ChatBot - should work with hardcoded responses
# Open any page → Click ChatBot → Ask question
# ✅ Should get hardcoded response
```

### Test 2: Verify Real AI Works
```bash
# Configure Azure OpenAI (create .env.local)
AZURE_OPENAI_API_KEY=your_key
NEXT_PUBLIC_AI_ENABLED=true
NEXT_PUBLIC_MACKAI_REAL_AI=true

npm run dev

# Test ChatBot - should use real AI
# Open any page → Click ChatBot → Ask question
# ✅ Should get Azure OpenAI response
```

### Test 3: Verify Streaming
```bash
# With real AI configured
npm run dev

# Test streaming response
# Navigate to /portal/mackai
# Select ChatGPT module
# Enter a complex question
# ✅ Should see response stream token by token
```

---

## Rollback Plan

If you need to rollback to hardcoded responses:

### Method 1: Feature Flags
```env
# In .env.local
NEXT_PUBLIC_AI_ENABLED=false
NEXT_PUBLIC_MACKAI_REAL_AI=false
```

### Method 2: Remove Credentials
```bash
# Delete or rename .env.local
mv .env.local .env.local.backup
```

### Method 3: Git Revert
```bash
# If you made code changes
git diff lib/mackai/service.ts
git checkout lib/mackai/service.ts
```

---

## Performance Comparison

| Aspect | Hardcoded | Real AI (GPT-3.5) | Real AI (GPT-4) |
|--------|-----------|-------------------|-----------------|
| Response Time | 50-100ms | 1-2s | 2-5s |
| Quality | Good for common questions | Excellent | Outstanding |
| Flexibility | Limited to pre-written | Very high | Very high |
| Cost | Free | ~$0.001/request | ~$0.03/request |
| Offline | ✅ Works | ❌ Needs connection | ❌ Needs connection |

---

## Recommended Migration Path

**Week 1: Development Environment**
- ✅ Set up Azure OpenAI
- ✅ Configure `.env.local`
- ✅ Test with ChatBot and MackAi
- ✅ Monitor costs and performance

**Week 2: Staging/Testing**
- ✅ Deploy to staging environment
- ✅ Run integration tests
- ✅ Load testing
- ✅ User acceptance testing

**Week 3: Gradual Production Rollout**
- ✅ Enable for specific user group (beta testers)
- ✅ Monitor feedback and performance
- ✅ Adjust token limits and rate limiting

**Week 4: Full Production**
- ✅ Enable for all users
- ✅ Set up monitoring and alerts
- ✅ Document usage patterns

---

## Common Issues & Solutions

### Issue: "Module not found: @/lib/ai"
**Solution**: TypeScript path mapping already configured in `tsconfig.json`. Restart TS server.

### Issue: "Real AI not responding"
**Solution**: 
1. Check `process.env.NEXT_PUBLIC_AI_ENABLED` === 'true'
2. Verify Azure OpenAI credentials in `.env.local`
3. Check browser console for errors

### Issue: "Fallback always used"
**Solution**:
```typescript
// Add debug logging
console.log('AI Configured:', azureOpenAI.isConfigured());
console.log('AI Enabled:', process.env.NEXT_PUBLIC_AI_ENABLED);
console.log('Real AI:', process.env.NEXT_PUBLIC_MACKAI_REAL_AI);
```

### Issue: "Streaming slow or choppy"
**Solution**:
- Check network connection
- Try GPT-3.5 instead of GPT-4
- Reduce `AI_MAX_TOKENS` in `.env.local`

---

## Summary

**Easiest Migration** ✅
- Do nothing! Feature flags handle everything automatically
- Just configure `.env.local` when ready

**Advanced Migration** 🔧
- Explicitly use `ChatGPTModuleReal` if you need more control
- Customize prompts in `lib/ai/prompts.ts`
- Add custom modules following the same pattern

**Rollback** 🔄
- Set feature flags to `false`
- Or simply remove `.env.local`
- Zero code changes needed

---

Need help? Check `AI_IMPLEMENTATION_README.md` or `AI_IMPLEMENTATION_GUIDE.md`!
