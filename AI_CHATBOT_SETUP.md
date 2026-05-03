# AI Chatbot Feature - Setup Guide

## Overview
The AI chatbot feature allows users to interact with research papers using a local LLM (Ollama). Users can select any paper from the search results and ask questions about it.

## Prerequisites

### 1. Install Ollama
```bash
# macOS/Linux
curl https://ollama.ai/install.sh | sh

# Or download from https://ollama.ai/download
```

### 2. Pull a Model
```bash
# Pull the default model (llama2)
ollama pull llama2

# Or try a different model (optional)
ollama pull mistral
ollama pull llama3
```

### 3. Start Ollama Server
```bash
ollama serve
# Runs on http://localhost:11434
# Keep this terminal open while using the chatbot
```

## Running the Application

### Terminal 1: Backend
```bash
cd backend
source venv/bin/activate  # Activate virtual environment
python paper-search-backend.py
# Should show: "✓ Ollama is running and available"
```

### Terminal 2: Frontend
```bash
cd paper-search-ui
npm run dev
# Opens at http://localhost:3000
```

### Terminal 3: Ollama (if not already running)
```bash
ollama serve
```

## Using the Chatbot

1. **Search for Papers**: Enter a search term (e.g., "machine learning")
2. **Select a Paper**: Click the "Ask AI 🤖" button on any paper card
   - The paper will be highlighted with a blue border
   - The chatbot sidebar will slide in from the right
3. **Chat with AI**: 
   - Use quick action buttons for common questions
   - Or type your own questions in the input box
4. **Switch Papers**: Click "Ask AI" on a different paper to switch context
5. **Floating Button**: A chat icon (💬) appears in the top-right when a paper is selected

## Features

### Quick Actions
- **📝 Explain**: Get a simplified explanation of the paper
- **⚖️ Key Points**: Learn about the paper's main contributions
- **🔍 Related Topics**: Discover related research areas

### Visual Indicators
- **Selected Paper**: Blue border + light blue background
- **Button Text**: Changes from "Ask AI" to "Continue Chat" for selected paper
- **Paper Counter**: Shows "Paper X of 10" in sidebar header

### Conversation
- Messages are stored during the session
- Switching papers clears the conversation
- Closing the sidebar keeps the selection

## Troubleshooting

### "Ollama is not running" Error
**Problem**: Backend shows warning or API returns 503 error

**Solution**:
```bash
# Start Ollama in a separate terminal
ollama serve

# Verify it's running
curl http://localhost:11434/api/tags
```

### Slow Responses
**Problem**: AI takes a long time to respond

**Solutions**:
- Use a smaller model: `ollama pull llama2` (fastest)
- Check CPU usage - Ollama is CPU-intensive
- Try a different model: `ollama pull mistral`

### "Model not found" Error
**Problem**: Ollama can't find the model

**Solution**:
```bash
# List installed models
ollama list

# If llama2 is not listed, pull it
ollama pull llama2
```

### Port Conflicts
**Problem**: Backend won't start (port 8000 busy)

**Solution**:
```bash
# Find and kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Or change the port in paper-search-backend.py
uvicorn.run("paper-search-backend:app", host="0.0.0.0", port=8001, reload=True)
```

### API Connection Error
**Problem**: Frontend can't reach backend

**Solution**:
1. Check backend is running on port 8000
2. Verify `app/actions/chatAction.tsx` has correct URL:
   ```typescript
   const response = await fetch('http://localhost:8000/api/chat', ...)
   ```

## Testing the Integration

### Test Ollama Directly
```bash
curl http://localhost:11434/api/generate -d '{
  "model": "llama2",
  "prompt": "Hello, how are you?",
  "stream": false
}'
```

### Test Chat Endpoint
```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Explain this paper",
    "paper": {
      "title": "Test Paper",
      "authors": ["Author One"],
      "abstract": "This is a test abstract",
      "published_date": "2024-01-01",
      "categories": ["cs.AI"]
    },
    "conversation_history": [],
    "action": "explain"
  }'
```

## Customization

### Change the AI Model
Edit `backend/ollama_client.py`:
```python
DEFAULT_MODEL = "mistral"  # Instead of "llama2"
```

### Adjust Response Length
Edit `backend/ollama_client.py` in `create_paper_context_prompt()`:
```python
# Change "Keep it concise (2-3 paragraphs)" to your preference
```

### Add More Quick Actions
Edit `paper-search-ui/components/ChatbotSidebar.tsx`:
```typescript
<button onClick={() => handleQuickAction('custom')}>
  🎯 Custom Action
</button>
```

And update `handleQuickAction` to handle the new action.

## Architecture

```
User clicks "Ask AI" on Paper #3
    ↓
Frontend: SearchResults.tsx (manages selection state)
    ↓
Frontend: ChatbotSidebar.tsx (UI component)
    ↓
Frontend: chatAction.tsx (server action)
    ↓
Backend: /api/chat endpoint (FastAPI)
    ↓
Backend: ollama_client.py (Ollama integration)
    ↓
Ollama: Local LLM generates response
    ↓
Response flows back through the stack to UI
```

## Files Modified/Created

### Frontend (5 files created, 2 modified)
- ✅ `components/ChatbotSidebar.tsx` (created)
- ✅ `components/SearchResults.tsx` (created)
- ✅ `app/actions/chatAction.tsx` (created)
- ✅ `components/PaperCard.tsx` (modified - added Ask AI button)
- ✅ `app/page.tsx` (modified - integrated SearchResults)
- ✅ `types.ts` (modified - added Message, ChatbotSidebarProps)

### Backend (2 files created, 1 modified)
- ✅ `backend/ollama_client.py` (created)
- ✅ `backend/paper-search-backend.py` (modified - added chat endpoint)

## Next Steps

After basic setup works, you can:
1. Add conversation export/download feature
2. Implement streaming responses for real-time chat
3. Add support for multiple paper comparison
4. Store conversation history in localStorage
5. Add model selection dropdown in UI
6. Integrate semantic search for paper suggestions

## Support

For issues:
1. Check that Ollama is running: `ollama serve`
2. Check backend logs in terminal
3. Check browser console for frontend errors
4. Verify all three services are running (Ollama, backend, frontend)
