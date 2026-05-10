import requests
import time
import feedparser
from typing import List, Dict, Optional
from datetime import datetime
from paper import Paper
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
from ollama_client import check_ollama_available, generate_response, create_paper_context_prompt

app = FastAPI()
BASE_URL = "http://export.arxiv.org/api/query"

# Pydantic models for chat API
class ChatRequest(BaseModel):
    message: str
    paper: Dict
    conversation_history: List[Dict]
    action: str = "answer"

class ChatResponse(BaseModel):
    response: str
    suggested_actions: Optional[List[str]] = None

@app.get("/")
def home():
    return {"message": "Paper Search Backend is Live!!"}

@app.get("/api/search")
def search(query: str, sort: str, start: int, total_results: int = 10):
    """
    Search arXiv for papers matching the query.

    The query is formatted to search in title, abstract, and keywords for better relevance.
    By default (when sort='relevance'), arXiv returns results sorted by relevance.
    """

    # Format the query for better multi-word search
    # Search in title, abstract, and all fields for comprehensive results
    formatted_query = f'all:"{query}"'

    # Build parameters based on sort preference
    params = {
        'search_query': formatted_query,
        'start': start,
        'max_results': total_results,
    }

    # Only add sortBy/sortOrder if user explicitly wants date sorting
    # By default (no sortBy), arXiv returns results by relevance
    if sort == "newest":
        params['sortBy'] = 'submittedDate'
        params['sortOrder'] = 'descending'
    elif sort == "oldest":
        params['sortBy'] = 'submittedDate'
        params['sortOrder'] = 'ascending'
    # For 'relevance' or any other value, don't add sortBy - let arXiv use default relevance ranking

    response = requests.get(BASE_URL, params=params)
    feed = feedparser.parse(response.content)
    papers = []

    for entry in feed.entries:
        try:
            authors = [author.name for author in entry.authors]
            published = datetime.strptime(entry.published, '%Y-%m-%dT%H:%M:%SZ')
            updated = datetime.strptime(entry.updated, '%Y-%m-%dT%H:%M:%SZ')
            publishedDate = published.strftime('%Y-%m-%d')
            updatedDate = updated.strftime('%Y-%m-%d')
            pdf_url = next((link.href for link in entry.links if link.type == 'application/pdf'), '')
            papers.append(Paper(
                    paper_id=entry.id.split('/')[-1],
                    title=entry.title,
                    authors=authors,
                    abstract=entry.summary,
                    source='arxiv',
                    url=entry.id,
                    pdf_url=pdf_url,
                    published_date=publishedDate,
                    updated_date=updatedDate,
                    categories=[tag.term for tag in entry.tags],
                    keywords=[]
                ))
        except Exception as e:
            print(f"Error parsing arXiv entry: {e}")

    # Note: We don't need to re-sort for "newest" or "oldest" since arXiv already sorted
    # Only sort client-side for features not supported by arXiv API (like citations)
    if sort == "citations":
        papers.sort(key=lambda x : x.citation_count, reverse=True)

    return papers

@app.post("/api/chat")
def chat(request: ChatRequest) -> ChatResponse:
    """
    Chat endpoint that uses Ollama to answer questions about research papers
    """
    # Check if Ollama is available
    if not check_ollama_available():
        raise HTTPException(
            status_code=503,
            detail="Ollama is not running. Please start it with 'ollama serve' and ensure you have a model installed (e.g., 'ollama pull llama2')."
        )

    try:
        # Create the prompt with paper context
        prompt = create_paper_context_prompt(
            paper=request.paper,
            user_message=request.message,
            action=request.action,
            conversation_history=request.conversation_history
        )

        # Generate response from Ollama
        ai_response = generate_response(prompt)

        # Suggest quick actions based on conversation
        suggested_actions = []
        if request.action == "explain":
            suggested_actions = ["Ask a specific question", "Find related topics"]
        elif request.action == "suggest_related":
            suggested_actions = ["Explain the paper", "Compare approaches"]

        return ChatResponse(
            response=ai_response,
            suggested_actions=suggested_actions
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating response: {str(e)}"
        )

if __name__ == "__main__":
    # Check Ollama on startup
    if check_ollama_available():
        print("✓ Ollama is running and available")
    else:
        print("⚠ Warning: Ollama is not running. Start it with 'ollama serve'")

    uvicorn.run("paper-search-backend:app", host="0.0.0.0", port=8000, reload=True)