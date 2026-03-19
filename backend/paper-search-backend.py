import requests
import time
import feedparser
from typing import List
from datetime import datetime
from paper import Paper
from fastapi import FastAPI
import uvicorn

app = FastAPI()
BASE_URL = "http://export.arxiv.org/api/query"

@app.get("/api/search")
def search(query: str, sort: str, start: int, total_results: int = 10):
    results_per_itr = 10

    params = {
        'search_query': query,
        'start': start,
        'max_results': results_per_itr,
        'sortBy': 'submittedDate',
        'sortOrder': 'descending'
    }

    response = requests.get(BASE_URL, params=params)
    feed = feedparser.parse(response.content)
    papers = []
    for entry in feed.entries:
        try:
            authors = [author.name for author in entry.authors]
            published = datetime.strptime(entry.published, '%Y-%m-%dT%H:%M:%SZ')
            updated = datetime.strptime(entry.updated, '%Y-%m-%dT%H:%M:%SZ')
            pdf_url = next((link.href for link in entry.links if link.type == 'application/pdf'), '')
            papers.append(Paper(
                    paper_id=entry.id.split('/')[-1],
                    title=entry.title,
                    authors=authors,
                    abstract=entry.summary,
                    source='arxiv',
                    url=entry.id,
                    pdf_url=pdf_url,
                    published_date=published,
                    updated_date=updated,
                    categories=[tag.term for tag in entry.tags],
                    keywords=[]
                ))
        except Exception as e:
            print(f"Error parsing arXiv entry: {e}")

    if sort == "newest":
        papers.sort(key=lambda x : x.published_date, reverse=True)
    elif sort == "oldest":
        papers.sort(key=lambda x : x.published_date)
    elif sort == "citations":
        papers.sort(key=lambda x : x.citation_count, reverse=True)
    
    return papers

if __name__ == "__main__":
    # uvicorn.run("paper-search-test:app", host="127.0.0.1", port=8000, reload=True)

    print("Testing Arxiv Searcher...")
    papers = search(
        query="MCP",
        sort="newest",
        start=0
    )
    print("Papers retrieved: ", papers)
    print("End of Arxiv Searcher test!")