

# Enable Devus AI with Real Chat Capability

## Problem
The AIAssistantWidget is a static shell — quick action buttons fire `onAction` which isn't even wired up, and the text input has no submit handler. Nothing happens when users interact with it.

## Solution
Create a streaming AI chat experience powered by Lovable AI (via the gateway). Users can chat freely or tap quick actions to send pre-built prompts. Responses stream token-by-token with markdown rendering.

## Architecture

```text
User → AIAssistantWidget → fetch(devus-chat edge fn) → Lovable AI Gateway
                ↑                                              ↓
         streaming tokens ←──── SSE response ←────────── AI model
```

## Changes

### 1. New Edge Function: `supabase/functions/devus-chat/index.ts`
- Accepts `{ messages: [{role, content}] }` from the client
- Prepends a system prompt: "You are Devus, a developer tools expert. Help developers discover, compare, and evaluate developer tools. Be concise and practical."
- Calls Lovable AI Gateway (`https://ai.gateway.lovable.dev/v1/chat/completions`) with `stream: true` using `google/gemini-3-flash-preview`
- Returns the SSE stream directly to the client
- Handles 429/402 errors with user-friendly messages
- JWT auth via Supabase claims (same pattern as existing edge functions)

### 2. Rewrite: `src/components/dashboard/AIAssistantWidget.tsx`
- Add state: `messages[]`, `isLoading`, `isStreaming`
- **Chat area**: scrollable message list between header and input, rendering assistant messages with `react-markdown`
- **Quick actions**: shown only when no messages yet (initial state). Clicking one sends a pre-built prompt:
  - "Compare Tools" → "Help me compare two developer tools. What tools would you like to compare?"
  - "Find Alternatives" → "I'm looking for alternatives to a tool. Which tool do you want alternatives for?"
  - "Check Compatibility" → "I want to check if tools in my stack are compatible. What's your current stack?"
  - "Learning Resources" → "I'm looking for learning resources for a developer tool. Which tool or technology?"
- **Streaming**: parse SSE line-by-line, update assistant message content token-by-token
- **Input**: Enter key and send button both trigger message send; disabled while streaming
- **Auto-scroll**: chat area scrolls to bottom on new tokens
- Widget panel height increased to `max-h-[70vh]` for readable conversation

### 3. Minor: `src/pages/Dashboard.tsx`
- No changes needed — the widget is self-contained with its own AI hook

## Files

| File | Action |
|------|--------|
| `supabase/functions/devus-chat/index.ts` | Create — streaming chat edge function |
| `src/components/dashboard/AIAssistantWidget.tsx` | Rewrite — full chat UI with streaming |

## Technical Notes
- `LOVABLE_API_KEY` is already available as a secret — no setup needed
- Uses `react-markdown` (already in dependencies via other components) for rendering responses
- Conversation history sent with each request for context continuity
- Quick actions disappear after first message, replaced by the chat thread
- Mobile: widget already uses `w-[calc(100vw-2rem)]` — chat area will use `max-h-[50vh]` on mobile

