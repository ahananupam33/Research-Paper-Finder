# Research Paper Finder - Architecture Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Component Details](#component-details)
4. [Data Flow](#data-flow)
5. [API Communication](#api-communication)
6. [Technology Stack](#technology-stack)
7. [Design Patterns](#design-patterns)
8. [Scalability Considerations](#scalability-considerations)

---

## System Overview

Research Paper Finder follows a **three-tier architecture** pattern:
- **Presentation Layer**: Next.js frontend with React components
- **Application Layer**: FastAPI backend with business logic
- **External Data Layer**: arXiv API for paper data

---

## Architecture Diagram

### 1. High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          USER INTERFACE                              │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                    Web Browser (Client)                         │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │ │
│  │  │ Search Form  │  │  Paper Cards │  │  Pagination Controls │ │ │
│  │  └──────────────┘  └──────────────┘  └──────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────────┘ │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                │ HTTPS/HTTP Requests
                                │
┌───────────────────────────────▼─────────────────────────────────────┐
│                    PRESENTATION LAYER                                │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │            Next.js 16.1.6 Application (React 19)                │ │
│  │                                                                  │ │
│  │  ┌─────────────────────────────────────────────────────────┐   │ │
│  │  │  Pages (App Router)                                      │   │ │
│  │  │  • app/page.tsx         → Main search interface          │   │ │
│  │  │  • app/layout.tsx       → Root layout wrapper            │   │ │
│  │  │  • app/loading.tsx      → Loading states                 │   │ │
│  │  └─────────────────────────────────────────────────────────┘   │ │
│  │                                                                  │ │
│  │  ┌─────────────────────────────────────────────────────────┐   │ │
│  │  │  Server Actions                                          │   │ │
│  │  │  • app/action.tsx       → API communication layer        │   │ │
│  │  │    - fetchPapers()      → Async data fetching            │   │ │
│  │  └─────────────────────────────────────────────────────────┘   │ │
│  │                                                                  │ │
│  │  ┌─────────────────────────────────────────────────────────┐   │ │
│  │  │  Components                                              │   │ │
│  │  │  • PaperCard.tsx        → Paper display component        │   │ │
│  │  └─────────────────────────────────────────────────────────┘   │ │
│  │                                                                  │ │
│  │  ┌─────────────────────────────────────────────────────────┐   │ │
│  │  │  Type Definitions                                        │   │ │
│  │  │  • types.ts             → TypeScript interfaces          │   │ │
│  │  └─────────────────────────────────────────────────────────┘   │ │
│  │                                                                  │ │
│  │  ┌─────────────────────────────────────────────────────────┐   │ │
│  │  │  Styling                                                 │   │ │
│  │  │  • Tailwind CSS 4.x     → Utility-first styling          │   │ │
│  │  │  • globals.css          → Global styles                  │   │ │
│  │  └─────────────────────────────────────────────────────────┘   │ │
│  └────────────────────────────────────────────────────────────────┘ │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                │ REST API Calls
                                │ GET /api/search
                                │
┌───────────────────────────────▼─────────────────────────────────────┐
│                     APPLICATION LAYER                                │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │         FastAPI 0.135.1 Backend Application                    │ │
│  │                                                                  │ │
│  │  ┌─────────────────────────────────────────────────────────┐   │ │
│  │  │  API Endpoints (paper-search-backend.py)                 │   │ │
│  │  │                                                           │   │ │
│  │  │  GET /                                                    │   │ │
│  │  │  └─> Health check endpoint                               │   │ │
│  │  │                                                           │   │ │
│  │  │  GET /api/search                                          │   │ │
│  │  │  └─> Search papers endpoint                              │   │ │
│  │  │      Parameters:                                          │   │ │
│  │  │      • query: str          (Search keywords)             │   │ │
│  │  │      • sort: str           (Sort order)                  │   │ │
│  │  │      • start: int          (Pagination offset)           │   │ │
│  │  │      • total_results: int  (Results per page)            │   │ │
│  │  └─────────────────────────────────────────────────────────┘   │ │
│  │                                                                  │ │
│  │  ┌─────────────────────────────────────────────────────────┐   │ │
│  │  │  Business Logic                                          │   │ │
│  │  │  • Query construction                                    │   │ │
│  │  │  • Response parsing (feedparser)                         │   │ │
│  │  │  • Data transformation                                   │   │ │
│  │  │  • Sorting algorithms                                    │   │ │
│  │  │  • Error handling                                        │   │ │
│  │  └─────────────────────────────────────────────────────────┘   │ │
│  │                                                                  │ │
│  │  ┌─────────────────────────────────────────────────────────┐   │ │
│  │  │  Data Models (paper.py)                                  │   │ │
│  │  │                                                           │   │ │
│  │  │  @dataclass Paper:                                       │   │ │
│  │  │    • paper_id: str                                       │   │ │
│  │  │    • title: str                                          │   │ │
│  │  │    • authors: List[str]                                  │   │ │
│  │  │    • abstract: str                                       │   │ │
│  │  │    • source: str                                         │   │ │
│  │  │    • url: str                                            │   │ │
│  │  │    • published_date: date                                │   │ │
│  │  │    • updated_date: Optional[date]                        │   │ │
│  │  │    • pdf_url: Optional[str]                              │   │ │
│  │  │    • categories: List[str]                               │   │ │
│  │  │    • keywords: List[str]                                 │   │ │
│  │  │    • citations: int                                      │   │ │
│  │  │    • references: Optional[List[str]]                     │   │ │
│  │  │                                                           │   │ │
│  │  │  Methods:                                                 │   │ │
│  │  │    • to_dict() → Serialization                           │   │ │
│  │  └─────────────────────────────────────────────────────────┘   │ │
│  │                                                                  │ │
│  │  ┌─────────────────────────────────────────────────────────┐   │ │
│  │  │  HTTP Client (requests library)                          │   │ │
│  │  │  • External API communication                            │   │ │
│  │  │  • Request/Response handling                             │   │ │
│  │  └─────────────────────────────────────────────────────────┘   │ │
│  │                                                                  │ │
│  │  ┌─────────────────────────────────────────────────────────┐   │ │
│  │  │  Server (Uvicorn ASGI)                                   │   │ │
│  │  │  • Async request handling                                │   │ │
│  │  │  • Hot reload in development                             │   │ │
│  │  │  • Port: 8000                                            │   │ │
│  │  └─────────────────────────────────────────────────────────┘   │ │
│  └────────────────────────────────────────────────────────────────┘ │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                │ HTTP GET Requests
                                │ (with rate limiting)
                                │
┌───────────────────────────────▼─────────────────────────────────────┐
│                      EXTERNAL DATA LAYER                             │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │              arXiv API (export.arxiv.org)                       │ │
│  │                                                                  │ │
│  │  Endpoint: /api/query                                           │ │
│  │                                                                  │ │
│  │  Query Parameters:                                              │ │
│  │  • search_query: str    → Search expression                     │ │
│  │  • start: int           → Result offset                         │ │
│  │  • max_results: int     → Results limit                         │ │
│  │  • sortBy: str          → Sort field                            │ │
│  │  • sortOrder: str       → Sort direction                        │ │
│  │                                                                  │ │
│  │  Response Format: RSS/Atom XML Feed                             │ │
│  │  • Paper metadata                                               │ │
│  │  • Author information                                           │ │
│  │  • Categories/tags                                              │ │
│  │  • Links to PDF and abstract                                    │ │
│  │                                                                  │ │
│  │  Rate Limits:                                                   │ │
│  │  • 3 seconds between requests (recommended)                     │ │
│  │  • No authentication required                                   │ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

### 2. Component Interaction Diagram

```
┌────────────────────────────────────────────────────────────────────┐
│                    REQUEST/RESPONSE FLOW                            │
└────────────────────────────────────────────────────────────────────┘

     User                Next.js              FastAPI            arXiv API
      │                  Frontend             Backend
      │                     │                    │                   │
      │   1. Enter Query    │                    │                   │
      │ ───────────────────>│                    │                   │
      │                     │                    │                   │
      │   2. Form Submit    │                    │                   │
      │ ───────────────────>│                    │                   │
      │                     │                    │                   │
      │                     │ 3. fetchPapers()   │                   │
      │                     │ ──────────────────>│                   │
      │                     │                    │                   │
      │                     │                    │ 4. GET /api/query │
      │                     │                    │ ─────────────────>│
      │                     │                    │                   │
      │                     │                    │ 5. XML Feed       │
      │                     │                    │<─ ─ ─ ─ ─ ─ ─ ─ ─│
      │                     │                    │                   │
      │                     │                    │ 6. Parse Feed     │
      │                     │                    │ ──┐               │
      │                     │                    │   │               │
      │                     │                    │<──┘               │
      │                     │                    │                   │
      │                     │                    │ 7. Create Papers  │
      │                     │                    │ ──┐               │
      │                     │                    │   │               │
      │                     │                    │<──┘               │
      │                     │                    │                   │
      │                     │                    │ 8. Sort Papers    │
      │                     │                    │ ──┐               │
      │                     │                    │   │               │
      │                     │                    │<──┘               │
      │                     │                    │                   │
      │                     │ 9. JSON Response   │                   │
      │                     │<─ ─ ─ ─ ─ ─ ─ ─ ─ │                   │
      │                     │                    │                   │
      │                     │ 10. Render Cards   │                   │
      │                     │ ──┐                │                   │
      │                     │   │                │                   │
      │                     │<──┘                │                   │
      │                     │                    │                   │
      │ 11. Display Results │                    │                   │
      │<─ ─ ─ ─ ─ ─ ─ ─ ─ ─│                    │                   │
      │                     │                    │                   │
```

---

### 3. Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         DATA TRANSFORMATION                      │
└─────────────────────────────────────────────────────────────────┘

1. User Input (Frontend)
   ↓
   query: "machine learning"
   sort: "newest"
   page: 1
   limit: 10

2. HTTP Request (Next.js → FastAPI)
   ↓
   GET /api/search?query=machine+learning&sort=newest&start=1&total_results=10

3. arXiv Query Construction (FastAPI)
   ↓
   {
     search_query: "machine learning",
     start: 1,
     max_results: 10,
     sortBy: "submittedDate",
     sortOrder: "descending"
   }

4. arXiv API Response (XML Feed)
   ↓
   <?xml version="1.0" encoding="UTF-8"?>
   <feed xmlns="http://www.w3.org/2005/Atom">
     <entry>
       <id>http://arxiv.org/abs/2103.12345v1</id>
       <title>Deep Learning Survey</title>
       <author><name>John Doe</name></author>
       <summary>This paper presents...</summary>
       ...
     </entry>
   </feed>

5. Parse with feedparser (FastAPI)
   ↓
   feed.entries = [
     {
       id: "http://arxiv.org/abs/2103.12345v1",
       title: "Deep Learning Survey",
       authors: [{name: "John Doe"}],
       summary: "This paper presents...",
       published: "2021-03-23T10:00:00Z",
       ...
     }
   ]

6. Create Paper Objects (FastAPI)
   ↓
   papers = [
     Paper(
       paper_id="2103.12345v1",
       title="Deep Learning Survey",
       authors=["John Doe"],
       abstract="This paper presents...",
       published_date=date(2021, 3, 23),
       ...
     )
   ]

7. Sort & Filter (FastAPI)
   ↓
   papers.sort(key=lambda x: x.published_date, reverse=True)

8. Serialize to JSON (FastAPI)
   ↓
   [
     {
       "paper_id": "2103.12345v1",
       "title": "Deep Learning Survey",
       "authors": ["John Doe"],
       ...
     }
   ]

9. HTTP Response (FastAPI → Next.js)
   ↓
   200 OK
   Content-Type: application/json
   Body: [...]

10. Render UI (Next.js)
    ↓
    <PaperCard> components with paper data
```

---

## Component Details

### Frontend Components

#### 1. HomePage (`app/page.tsx`)
**Purpose**: Main search interface and results display

**Responsibilities**:
- Render search form
- Handle URL search parameters
- Fetch paper data via server actions
- Render paper cards
- Manage pagination controls

**Props**:
```typescript
interface SearchProps {
  searchParams: Promise<{
    query?: string;
    sort?: string;
    page?: string;
    limit?: string;
  }>
}
```

**State Management**:
- Uses URL search params for state
- Server-side rendering for initial load
- Client-side navigation for pagination

#### 2. PaperCard Component (`components/PaperCard.tsx`)
**Purpose**: Display individual paper information

**Props**:
```typescript
interface PaperCardProps {
  paper: Paper;
}

interface Paper {
  title: string;
  authors: string[];
  publishDate: string;
  citationCount: number;
  url: string;
  abstract: string;
}
```

**Features**:
- Clickable title linking to arXiv
- Author list
- Publication date badge
- Citation count badge
- Truncated abstract (3 lines)

#### 3. Server Actions (`app/action.tsx`)
**Purpose**: Server-side API communication

**Function**: `fetchPapers()`
```typescript
async function fetchPapers(
  query: string,
  sort: string,
  currentPage: number,
  limit: number
): Promise<Paper[]>
```

**Features**:
- Server-side execution
- No-cache policy for fresh data
- Error handling
- Type-safe responses

### Backend Components

#### 1. FastAPI Application (`paper-search-backend.py`)
**Purpose**: HTTP server and API endpoints

**Endpoints**:
```python
@app.get("/")
def home() -> dict

@app.get("/api/search")
def search(
  query: str,
  sort: str,
  start: int,
  total_results: int = 10
) -> List[Paper]
```

**Dependencies**:
- `requests`: HTTP client for arXiv
- `feedparser`: RSS/Atom feed parsing
- `uvicorn`: ASGI server

#### 2. Paper Model (`paper.py`)
**Purpose**: Data structure and validation

**Class Definition**:
```python
@dataclass
class Paper:
    paper_id: str
    title: str
    authors: List[str]
    abstract: str
    source: str
    url: str
    published_date: date
    # ... optional fields

    def to_dict(self) -> Dict
```

**Methods**:
- `__post_init__()`: Initialize default values
- `to_dict()`: Serialize to dictionary

---

## API Communication

### Request Flow

1. **Frontend Initiates Request**
   ```typescript
   const response = await fetch(
     `${API_URL}/api/search?query=${query}&sort=${sort}...`,
     { cache: 'no-store' }
   );
   ```

2. **Backend Receives Request**
   ```python
   @app.get("/api/search")
   def search(query: str, sort: str, start: int, total_results: int = 10):
   ```

3. **Backend Queries arXiv**
   ```python
   params = {
       'search_query': query,
       'start': start,
       'max_results': results_per_itr,
       'sortBy': 'submittedDate',
       'sortOrder': 'descending'
   }
   response = requests.get(BASE_URL, params=params)
   ```

4. **Parse and Transform**
   ```python
   feed = feedparser.parse(response.content)
   papers = [Paper(...) for entry in feed.entries]
   ```

5. **Return JSON Response**
   ```python
   return papers  # FastAPI auto-serializes
   ```

### Error Handling

**Frontend**:
```typescript
if (!response.ok)
  throw new Error("Failed to fetch any research papers.");
```

**Backend**:
```python
try:
    papers.append(Paper(...))
except Exception as e:
    print(f"Error parsing arXiv entry: {e}")
```

---

## Technology Stack

### Frontend Stack

```
┌─────────────────────────────────┐
│     Next.js 16.1.6              │
│     (React 19.2.3)              │
├─────────────────────────────────┤
│  • Server Components            │
│  • Server Actions               │
│  • App Router                   │
│  • TypeScript 5.x               │
│  • Tailwind CSS 4.x             │
└─────────────────────────────────┘
```

**Benefits**:
- Server-side rendering for SEO
- Type safety with TypeScript
- Fast builds and hot reload
- Built-in API routes
- Excellent developer experience

### Backend Stack

```
┌─────────────────────────────────┐
│     FastAPI 0.135.1             │
│     (Python 3.9+)               │
├─────────────────────────────────┤
│  • Async/Await support          │
│  • Automatic OpenAPI docs       │
│  • Pydantic validation          │
│  • Uvicorn ASGI server          │
│  • Type hints                   │
└─────────────────────────────────┘
```

**Benefits**:
- High performance (async)
- Auto-generated documentation
- Easy to test and maintain
- Great for RESTful APIs
- Modern Python features

---

## Design Patterns

### 1. Repository Pattern
**Location**: `paper.py`

The Paper dataclass acts as a data transfer object (DTO) that encapsulates paper information.

### 2. Service Layer Pattern
**Location**: `paper-search-backend.py`

The search function acts as a service layer that:
- Handles external API communication
- Transforms data
- Applies business logic (sorting)

### 3. Server Actions Pattern
**Location**: `app/action.tsx`

Next.js server actions provide a clean API layer that:
- Executes on the server
- Maintains type safety
- Simplifies data fetching

### 4. Component-Based Architecture
**Location**: `components/`

React components are modular and reusable:
- Single responsibility
- Props-based configuration
- Stateless where possible

---

## Scalability Considerations

### Current Limitations

1. **No Caching**: Every search hits arXiv API
2. **Single Source**: Only arXiv is supported
3. **No Authentication**: All users share rate limits
4. **Synchronous Processing**: Sequential request handling

### Scaling Strategies

#### Short-term (< 1000 users/day)

1. **Add Redis Caching**
   ```python
   @cache(expire=3600)
   def search(query: str, ...):
       # Cache results for 1 hour
   ```

2. **Implement Rate Limiting**
   ```python
   from slowapi import Limiter
   limiter = Limiter(key_func=get_remote_address)

   @app.get("/api/search")
   @limiter.limit("10/minute")
   def search(...):
   ```

#### Medium-term (< 10,000 users/day)

1. **Add Database Layer**
   - Store popular papers
   - Cache search results
   - Enable offline queries

2. **Implement CDN**
   - Cache static assets
   - Reduce frontend load time

3. **Add Load Balancer**
   - Multiple backend instances
   - Health checks
   - Failover support

#### Long-term (> 10,000 users/day)

1. **Microservices Architecture**
   ```
   ┌─────────────┐
   │   Gateway   │
   └──────┬──────┘
          │
   ┌──────┴──────┬──────────────┬─────────────┐
   │             │              │             │
   │  Search     │   User       │  Analytics  │
   │  Service    │   Service    │  Service    │
   │             │              │             │
   └─────────────┴──────────────┴─────────────┘
   ```

2. **Message Queue**
   - Async paper processing
   - Background tasks
   - Event-driven updates

3. **Elasticsearch**
   - Full-text search
   - Faceted search
   - Better performance

---

## Security Architecture

### Current Security Measures

1. **CORS Configuration**: Controlled cross-origin access
2. **Input Validation**: FastAPI automatic validation
3. **HTTPS**: Encrypted communication (production)
4. **No Credentials**: No sensitive data stored

### Future Security Enhancements

1. **API Authentication**
   - JWT tokens
   - API keys
   - OAuth 2.0

2. **Rate Limiting**
   - Per-user limits
   - IP-based throttling

3. **Input Sanitization**
   - SQL injection prevention
   - XSS protection

4. **Security Headers**
   - CSP (Content Security Policy)
   - HSTS
   - X-Frame-Options

---

## Monitoring & Observability

### Recommended Tools

1. **Logging**
   ```python
   import logging
   logger = logging.getLogger(__name__)
   logger.info(f"Search query: {query}")
   ```

2. **Metrics**
   - Request count
   - Response time
   - Error rate
   - Cache hit ratio

3. **Tracing**
   - Request flow tracking
   - Performance bottlenecks
   - External API latency

### Monitoring Stack

```
┌──────────────┐
│  Prometheus  │ ← Metrics collection
└──────┬───────┘
       │
┌──────▼───────┐
│   Grafana    │ ← Visualization
└──────────────┘

┌──────────────┐
│   ELK Stack  │ ← Log aggregation
└──────────────┘
```

---

## Deployment Architecture

### Current Deployment

```
Frontend (Vercel/Local)
        ↓
Backend (Render/Local)
        ↓
arXiv API (External)
```

### Recommended Production Setup

```
┌─────────────┐
│     CDN     │
│  (CloudFlare)│
└──────┬──────┘
       │
┌──────▼──────────┐
│  Load Balancer  │
└──────┬──────────┘
       │
  ┌────┴────┐
  │         │
┌─▼──┐   ┌─▼──┐
│App1│   │App2│  Backend instances
└─┬──┘   └─┬──┘
  │        │
  └────┬───┘
       │
┌──────▼──────┐
│   Redis     │  Cache layer
└──────┬──────┘
       │
┌──────▼──────┐
│  Database   │  PostgreSQL
└─────────────┘
```

---

## Conclusion

This architecture provides:
- **Separation of Concerns**: Clear layer boundaries
- **Scalability**: Easy to scale horizontally
- **Maintainability**: Modular and testable
- **Performance**: Async operations and caching ready
- **Security**: Built-in validation and error handling

The architecture is designed to grow with the application, from a simple MVP to an enterprise-scale research platform.

---

**Last Updated**: March 2026
**Version**: 1.0.0