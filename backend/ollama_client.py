import requests
import json
from typing import Dict, List, Optional

OLLAMA_BASE_URL = "http://localhost:11434"
DEFAULT_MODEL = "llama2"

def check_ollama_available() -> bool:
    """Check if Ollama is running locally"""
    try:
        response = requests.get(f"{OLLAMA_BASE_URL}/api/tags", timeout=2)
        return response.status_code == 200
    except requests.exceptions.RequestException:
        return False

def generate_response(prompt: str, model: str = DEFAULT_MODEL) -> str:
    """Send prompt to Ollama and get response"""
    try:
        response = requests.post(
            f"{OLLAMA_BASE_URL}/api/generate",
            json={
                "model": model,
                "prompt": prompt,
                "stream": False
            },
            timeout=60
        )

        if response.status_code == 200:
            result = response.json()
            return result.get("response", "I'm sorry, I couldn't generate a response.")
        else:
            return f"Error: Ollama returned status code {response.status_code}"

    except requests.exceptions.Timeout:
        return "Error: Request timed out. The model might be processing a complex query."
    except requests.exceptions.RequestException as e:
        return f"Error: Could not connect to Ollama. Make sure it's running with 'ollama serve'. Details: {str(e)}"

def create_paper_context_prompt(
    paper: Dict,
    user_message: str,
    action: str,
    conversation_history: Optional[List[Dict]] = None
) -> str:
    """Build prompt with paper context and user question"""

    # Build conversation history if available
    history_text = ""
    if conversation_history:
        for msg in conversation_history[-4:]:  # Only include last 4 messages to keep context manageable
            role = "User" if msg.get("role") == "user" else "Assistant"
            history_text += f"{role}: {msg.get('content', '')}\n"

    # Create action-specific instructions
    action_instructions = {
        "explain": "Explain this research paper in simple, accessible language. Focus on the main ideas, methodology, and significance. Avoid jargon where possible.",
        "compare": "Analyze the key contributions and findings of this paper. What makes it significant? What are its main strengths?",
        "suggest_related": "Based on this paper's topics and categories, suggest related research areas or questions that would be interesting to explore.",
        "answer": "Answer the user's question about this research paper based on the information provided."
    }

    instruction = action_instructions.get(action, action_instructions["answer"])

    # Build the complete prompt
    prompt = f"""You are an AI assistant helping researchers understand academic papers.

Current Paper:
Title: {paper.get('title', 'Unknown')}
Authors: {', '.join(paper.get('authors', []))}
Published: {paper.get('published_date', 'Unknown')}
Categories: {', '.join(paper.get('categories', []))}

Abstract:
{paper.get('abstract', 'No abstract available')}

{f"Previous Conversation:\n{history_text}" if history_text else ""}

Task: {instruction}

User's Question: {user_message}

Please provide a clear, helpful response. Keep it concise (2-3 paragraphs) and focused on what the user needs to know."""

    return prompt

def get_available_models() -> List[str]:
    """Get list of available Ollama models"""
    try:
        response = requests.get(f"{OLLAMA_BASE_URL}/api/tags", timeout=5)
        if response.status_code == 200:
            data = response.json()
            return [model.get("name", "") for model in data.get("models", [])]
        return []
    except requests.exceptions.RequestException:
        return []
