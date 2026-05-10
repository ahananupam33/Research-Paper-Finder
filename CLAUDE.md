# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Research Paper Finder is a full-stack academic paper search application that queries the arXiv API. It consists of:
- **Backend**: FastAPI (Python 3.9+) server that interfaces with arXiv API
- **Frontend**: Next.js 16 with React 19 and TypeScript, using server components and server actions
- **Data Source**: arXiv API (export.arxiv.org/api/query) - RSS/Atom feed format

## Development Commands

### Backend (from `backend/` directory)

```bash
# Activate virtual environment (required before any python commands)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run development server (with hot reload)
python paper-search-backend.py

# Run production server
uvicorn paper-search-backend:app --host 0.0.0.0 --port 8000

# Kill process on port 8000 if needed
lsof -ti:8000 | xargs kill -9
```

### Frontend (from `paper-search-ui/` directory)

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Lint code
npm run lint
```

### Both Services

For development, run both services simultaneously in separate terminals:
1. Terminal 1: Backend on http://localhost:8000
2. Terminal 2: Frontend on http://localhost:3000

## Architecture Overview

### Three-Tier Architecture
```
Next.js Frontend (Port 3000)
    ↓ HTTP REST API
FastAPI Backend (Port 8000)
    ↓ HTTP Requests
arXiv API (External)
```

### Key Data Flow

1. User searches → Next.js server action (`app/action.tsx:fetchPapers()`)
2. Server action → FastAPI endpoint (`GET /api/search`)
3. FastAPI → arXiv API with query parameters
4. arXiv returns RSS/Atom XML feed
5. Backend parses with `feedparser` → creates `Paper` objects
6. Backend sorts/filters → returns JSON array
7. Frontend renders `PaperCard` components

### Backend Components

- **`paper-search-backend.py`**: Main FastAPI app with three endpoints:
  - `GET /`: Health check
  - `GET /api/search`: Search papers with params: query, sort, start, total_results
  - `POST /api/chat`: AI chatbot endpoint for paper discussions
- **`paper.py`**: `Paper` dataclass with `to_dict()` serialization method
- **`ollama_client.py`**: Ollama integration for local LLM responses
- Uses `feedparser` to parse arXiv's RSS/Atom feed
- Supports sorting by: relevance (default), newest, oldest, citations

### Frontend Components

- **`app/page.tsx`**: Main search page (server component), handles URL search params for state
- **`app/action.tsx`**: Server action `fetchPapers()` - the API communication layer for search
- **`app/actions/chatAction.tsx`**: Server action for AI chatbot API calls
- **`components/PaperCard.tsx`**: Displays individual paper with title, authors, date, abstract, and "Ask AI" button
- **`components/ChatbotSidebar.tsx`**: AI chatbot sidebar interface
- **`components/SearchResults.tsx`**: Client component managing search results and chatbot state
- **`types.ts`**: TypeScript interfaces for Paper, Message, and ChatbotSidebarProps types
- Uses Next.js App Router with server-side rendering

## AI Chatbot Feature

### Setup Requirements
1. Install Ollama: `curl https://ollama.ai/install.sh | sh`
2. Pull a model: `ollama pull llama2`
3. Start Ollama: `ollama serve` (runs on port 11434)

### Usage
- Click "Ask AI 🤖" button on any paper card
- Selected paper highlights with blue border and light background
- Chatbot sidebar slides in from right showing paper context
- Use quick actions (Explain, Key Points, Related Topics) or type custom questions
- Switch papers by clicking "Ask AI" on a different card (conversation resets)
- Floating chat button (💬) in top-right when paper is selected

### Paper Selection System
- Only one paper can be selected at a time
- Selected paper shows "Paper X of 10" in sidebar header
- Button text changes from "Ask AI" to "Continue Chat" for selected paper
- Selection persists when closing sidebar
- New search clears selection

### Backend Integration
- `/api/chat` endpoint handles AI conversations
- `ollama_client.py` manages Ollama communication
- Context-aware prompts include paper metadata (title, abstract, authors, categories)
- Conversation history maintained within session
- Error handling for Ollama unavailability

## API Configuration

The frontend API URL is hardcoded in `app/action.tsx`:
- **Production (default)**: `https://research-paper-finder-lxa9.onrender.com`
- **Local development**: Comment out production URL and uncomment localhost URL

To switch to local backend, edit `app/action.tsx`:
```typescript
// Change from:
`https://research-paper-finder-lxa9.onrender.com/api/search?...`
// To:
`http://localhost:8000/api/search?...`
```

## Important Constraints

### arXiv API Search Behavior
- **Default sort**: Results are sorted by **relevance** (most relevant papers first)
- **Multi-word queries**: Queries are formatted as `all:"query"` to search the phrase across all fields
- **Search fields**: Searches across title, abstract, authors, comments, and categories
- **Sort options**: 
  - `relevance` (default): arXiv's relevance ranking based on query match
  - `newest`: Sort by submission date (newest first)
  - `oldest`: Sort by submission date (oldest first)
  - `citations`: Client-side sort by citation count
- **Query format**: Backend automatically formats queries as `all:"user query"` for phrase search
- **3 seconds between requests recommended** (not currently enforced in code)
- **No authentication required**
- API returns RSS/Atom XML (not JSON)
- Default max_results: 10 papers per request

### Date Handling
- Backend converts arXiv dates from `%Y-%m-%dT%H:%M:%SZ` to `%Y-%m-%d` format
- Published and updated dates are separate fields
- Date sorting handled by arXiv API when sort='newest' or sort='oldest'

## Common Development Tasks

### Search Query Improvements (Recently Fixed)
- **Relevance sorting**: Changed default from 'newest' to 'relevance' for better search results
- **Multi-word phrases**: Queries formatted as `all:"query"` ensure phrase search across all fields
- **How it works**: 
  - Backend formats query: `all:"machine learning"` instead of just `machine learning`
  - When sort='relevance', no sortBy parameter sent to arXiv → arXiv uses default relevance ranking
  - When sort='newest' or 'oldest', explicit sortBy='submittedDate' sent to arXiv

### Adding a New Sort Option
1. Backend: Modify `paper-search-backend.py` search function
2. Add new condition in params building logic (around line 38-47)
3. Frontend: Update default sort in `page.tsx` if needed (line 9)

### Changing Results Per Page
- Modify `total_results` parameter in API call
- Default is 10 (controlled by `limit` variable in frontend)

### Testing Search Functionality
1. Test multi-word: Search "quantum computing" - should return papers about quantum computing (not quantum OR computing)
2. Test relevance: Search "transformer" with sort=relevance - most relevant papers appear first
3. Test date sort: Search "GPT" with sort=newest - most recent papers appear first

### Testing Locally
1. Start backend first (it must be running on port 8000)
2. Update frontend `action.tsx` to use localhost URL
3. Start frontend
4. Test search at http://localhost:3000

## Error Handling

### Backend
- Wraps arXiv entry parsing in try/catch
- Prints errors to console but continues processing other entries
- Returns empty array if no valid papers parsed

### Frontend
- Throws error if fetch fails (`!response.ok`)
- No catch/retry logic - errors propagate to UI

## Type Definitions

The `Paper` type must match between:
- Backend: `paper.py` dataclass
- Frontend: `types.ts` interface

Key fields: paper_id, title, authors[], abstract, url, pdf_url, published_date, updated_date, categories[], citations

## Documentation Files

- **README.md**: User-facing documentation, installation, usage
- **ARCHITECTURE.md**: Detailed architecture diagrams and design patterns
- **DIAGRAMS.md**: Visual architecture diagrams
- **QUICKSTART.md**: Quick setup guide
- **AI_CHATBOT_SETUP.md**: Complete guide for setting up and using the AI chatbot feature
- **CLAUDE.md**: This file - development guidance for Claude Code
