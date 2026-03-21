# Research Paper Finder - Visual Diagrams

This document contains Mermaid diagrams that can be rendered in GitHub, VS Code, and other Mermaid-compatible viewers.

## System Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        A[Web Browser] --> B[Search Form]
        A --> C[Paper Results Display]
        A --> D[Pagination Controls]
    end

    subgraph "Presentation Layer - Next.js 16.1.6"
        E[app/page.tsx<br/>Main Page] --> F[components/PaperCard.tsx<br/>Paper Display]
        E --> G[app/action.tsx<br/>Server Actions]
        G --> H[fetchPapers Function]
        I[types.ts<br/>TypeScript Interfaces]
        J[Tailwind CSS<br/>Styling]
    end

    subgraph "Application Layer - FastAPI 0.135.1"
        K[paper-search-backend.py<br/>API Server] --> L[GET /api/search]
        K --> M[GET / Health Check]
        N[paper.py<br/>Data Model] --> O[Paper Dataclass]
        P[Uvicorn Server<br/>Port 8000]
    end

    subgraph "External Services"
        Q[arXiv API<br/>export.arxiv.org] --> R[XML Feed Response]
    end

    A -->|HTTP Requests| E
    H -->|REST API Call| L
    L -->|HTTP GET| Q
    Q -->|XML Feed| L
    L -->|Parse & Transform| N
    N -->|JSON Response| H
    H -->|Server Action| E
    E -->|Render| C

    style A fill:#e1f5ff
    style E fill:#fff4e1
    style K fill:#e8f5e9
    style Q fill:#fce4ec
```

## Data Flow Diagram

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant NextJS as Next.js Frontend
    participant FastAPI as FastAPI Backend
    participant arXiv as arXiv API

    User->>Browser: Enter search query
    Browser->>NextJS: Submit form (GET /?query=...)
    NextJS->>NextJS: Extract search params
    NextJS->>FastAPI: fetchPapers(query, sort, page, limit)

    FastAPI->>FastAPI: Construct query params
    FastAPI->>arXiv: GET /api/query?search_query=...

    arXiv-->>FastAPI: Return XML feed
    FastAPI->>FastAPI: Parse feed with feedparser
    FastAPI->>FastAPI: Create Paper objects
    FastAPI->>FastAPI: Sort papers by criteria

    FastAPI-->>NextJS: Return JSON array of papers
    NextJS->>NextJS: Render PaperCard components
    NextJS-->>Browser: Display search results
    Browser-->>User: Show papers with pagination
```

## Component Architecture

```mermaid
graph LR
    subgraph "Frontend Components"
        A[HomePage] --> B[Search Form]
        A --> C[Results Container]
        C --> D[PaperCard 1]
        C --> E[PaperCard 2]
        C --> F[PaperCard n]
        A --> G[Pagination Controls]
    end

    subgraph "Server Actions"
        H[fetchPapers]
    end

    subgraph "Type Definitions"
        I[Paper Interface]
        J[SearchProps Interface]
    end

    A --> H
    D --> I
    E --> I
    F --> I
    A --> J

    style A fill:#4fc3f7
    style D fill:#81c784
    style E fill:#81c784
    style F fill:#81c784
    style H fill:#ffb74d
```

## Backend Architecture

```mermaid
graph TB
    subgraph "FastAPI Application"
        A[Uvicorn Server] --> B[FastAPI App]
        B --> C[/ Endpoint<br/>Health Check]
        B --> D[/api/search Endpoint<br/>Search Papers]

        D --> E[Validate Query Params]
        E --> F[Construct arXiv Query]
        F --> G[HTTP Request Module]

        G --> H[Feedparser Module]
        H --> I[Parse XML Feed]
        I --> J[Extract Paper Data]

        J --> K[Paper Dataclass]
        K --> L[Create Paper Objects]
        L --> M[Sort Algorithm]
        M --> N[Return JSON Response]
    end

    subgraph "External Dependencies"
        O[requests Library]
        P[feedparser Library]
        Q[pydantic]
    end

    G --> O
    H --> P
    K --> Q

    style B fill:#66bb6a
    style D fill:#42a5f5
    style K fill:#ffa726
    style O fill:#ec407a
    style P fill:#ec407a
    style Q fill:#ec407a
```

## Request Flow Diagram

```mermaid
flowchart TD
    Start([User Enters Query]) --> A{Query Valid?}
    A -->|No| B[Show Error]
    A -->|Yes| C[Send GET Request]

    C --> D[Next.js fetchPapers]
    D --> E[HTTP GET to Backend]
    E --> F{Backend Reachable?}

    F -->|No| G[Network Error]
    F -->|Yes| H[FastAPI Receives Request]

    H --> I[Validate Parameters]
    I --> J{Parameters Valid?}
    J -->|No| K[400 Bad Request]
    J -->|Yes| L[Query arXiv API]

    L --> M{arXiv Responds?}
    M -->|No| N[503 Service Unavailable]
    M -->|Yes| O[Parse XML Feed]

    O --> P[Create Paper Objects]
    P --> Q{Papers Found?}
    Q -->|No| R[Return Empty Array]
    Q -->|Yes| S[Sort Papers]

    S --> T[Serialize to JSON]
    T --> U[Return 200 OK]

    U --> V[Next.js Receives Data]
    V --> W[Render PaperCards]
    W --> End([Display Results])

    B --> End
    G --> End
    K --> End
    N --> End
    R --> V

    style Start fill:#4caf50
    style End fill:#4caf50
    style G fill:#f44336
    style K fill:#f44336
    style N fill:#f44336
    style W fill:#2196f3
```

## Data Model Structure

```mermaid
classDiagram
    class Paper {
        +str paper_id
        +str title
        +List~str~ authors
        +str abstract
        +str source
        +str url
        +date published_date
        +Optional~date~ updated_date
        +Optional~str~ pdf_url
        +Optional~str~ venue
        +List~str~ categories
        +List~str~ keywords
        +int citations
        +Optional~List~str~~ references
        +Optional~Dict~ extra
        +__post_init__()
        +to_dict() Dict
    }

    class FrontendPaper {
        +string title
        +string[] authors
        +string publishDate
        +number citationCount
        +string url
        +string abstract
    }

    class SearchProps {
        +Promise~QueryParams~ searchParams
    }

    class QueryParams {
        +string? query
        +string? sort
        +string? page
        +string? limit
    }

    SearchProps --> QueryParams
    Paper --> FrontendPaper : transforms to
```

## Technology Stack Layers

```mermaid
graph TB
    subgraph "Frontend Stack"
        A1[React 19.2.3]
        A2[Next.js 16.1.6]
        A3[TypeScript 5.x]
        A4[Tailwind CSS 4.x]

        A2 --> A1
        A3 --> A2
        A4 --> A2
    end

    subgraph "Backend Stack"
        B1[Python 3.9+]
        B2[FastAPI 0.135.1]
        B3[Uvicorn 0.42.0]
        B4[Pydantic 2.12.5]
        B5[Requests 2.32.5]
        B6[Feedparser 6.0.12]

        B2 --> B1
        B3 --> B2
        B4 --> B2
        B5 --> B2
        B6 --> B2
    end

    subgraph "External Services"
        C1[arXiv API]
        C2[RSS/Atom Feed]

        C2 --> C1
    end

    A2 -->|HTTP/REST| B2
    B2 -->|HTTP GET| C1

    style A2 fill:#000000,color:#ffffff
    style B2 fill:#009688
    style C1 fill:#ff5722
```

## Deployment Architecture

```mermaid
graph TB
    subgraph "Development Environment"
        D1[Local Machine] --> D2[Next.js Dev Server<br/>Port 3000]
        D1 --> D3[FastAPI Dev Server<br/>Port 8000]
    end

    subgraph "Production Environment"
        P1[Vercel/Netlify<br/>Frontend Hosting]
        P2[Render<br/>Backend Hosting]
        P3[CloudFlare CDN<br/>Optional]
    end

    subgraph "External Services"
        E1[arXiv API<br/>export.arxiv.org]
    end

    D2 -->|API Calls| D3
    D3 -->|HTTP GET| E1

    P1 -->|API Calls| P2
    P2 -->|HTTP GET| E1
    P3 -->|Cache Static Assets| P1

    style P1 fill:#00bcd4
    style P2 fill:#8bc34a
    style E1 fill:#ff9800
```

## Error Handling Flow

```mermaid
flowchart TD
    A[API Request] --> B{Network Available?}
    B -->|No| C[Network Error<br/>Display: Connection Failed]
    B -->|Yes| D[Send Request]

    D --> E{Backend Responds?}
    E -->|No| F[Timeout Error<br/>Display: Server Timeout]
    E -->|Yes| G{Status Code?}

    G -->|200| H[Success<br/>Parse Response]
    G -->|400| I[Bad Request<br/>Display: Invalid Query]
    G -->|404| J[Not Found<br/>Display: Endpoint Not Found]
    G -->|500| K[Server Error<br/>Display: Server Error]

    H --> L{Valid JSON?}
    L -->|No| M[Parse Error<br/>Display: Invalid Response]
    L -->|Yes| N{Papers Found?}

    N -->|No| O[Empty Results<br/>Display: No Papers Found]
    N -->|Yes| P[Success<br/>Display Results]

    C --> Q[Error Handler]
    F --> Q
    I --> Q
    J --> Q
    K --> Q
    M --> Q
    O --> R[Empty State UI]
    P --> S[Results UI]
    Q --> T[Error UI]

    style P fill:#4caf50
    style C fill:#f44336
    style F fill:#f44336
    style I fill:#ff9800
    style J fill:#ff9800
    style K fill:#f44336
    style M fill:#f44336
```

## Future Architecture Vision

```mermaid
graph TB
    subgraph "Current v1.0"
        C1[Next.js Frontend]
        C2[FastAPI Backend]
        C3[arXiv API Only]
    end

    subgraph "Future v2.0"
        F1[Next.js Frontend]
        F2[API Gateway]
        F3[Search Service]
        F4[User Service]
        F5[Analytics Service]
        F6[Cache Layer Redis]
        F7[Database PostgreSQL]
        F8[Multiple Paper Sources]
        F9[arXiv]
        F10[PubMed]
        F11[IEEE]
        F12[Google Scholar]
    end

    C1 --> C2
    C2 --> C3

    F1 --> F2
    F2 --> F3
    F2 --> F4
    F2 --> F5
    F3 --> F6
    F3 --> F7
    F3 --> F8
    F8 --> F9
    F8 --> F10
    F8 --> F11
    F8 --> F12

    style C1 fill:#bbdefb
    style C2 fill:#c8e6c9
    style C3 fill:#ffccbc
    style F2 fill:#ff9800
    style F6 fill:#e91e63
    style F7 fill:#9c27b0
```

## Performance Metrics

```mermaid
graph LR
    A[User Request] -->|< 100ms| B[Next.js SSR]
    B -->|< 500ms| C[API Gateway]
    C -->|< 1000ms| D[FastAPI Backend]
    D -->|< 2000ms| E[arXiv API]
    E -->|< 2000ms| D
    D -->|< 500ms| C
    C -->|< 500ms| B
    B -->|< 100ms| F[User Response]

    G[Total Time] -->|< 3 seconds| H[Target Performance]

    style A fill:#4caf50
    style F fill:#4caf50
    style H fill:#2196f3
```

---

## How to View These Diagrams

### GitHub
These diagrams will render automatically when viewing this file on GitHub.

### VS Code
Install the "Markdown Preview Mermaid Support" extension:
```bash
code --install-extension bierner.markdown-mermaid
```

### Online Viewers
- [Mermaid Live Editor](https://mermaid.live)
- Copy and paste any diagram code block

### Export as Images
Use the Mermaid CLI:
```bash
npm install -g @mermaid-js/mermaid-cli
mmdc -i DIAGRAMS.md -o diagram.png
```

---

**Last Updated**: March 2026
**Diagram Version**: 1.0.0
