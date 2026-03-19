from dataclasses import dataclass, field
from typing import List, Optional, Dict
from datetime import datetime

@dataclass
class Paper:
    paper_id: str
    title: str
    authors: List[str]
    abstract: str
    source: str
    url: str
    published_date: datetime
    updated_date: Optional[datetime] = None 
    source_id: Optional[str] = None
    pdf_url: Optional[str] = None
    venue: Optional[str] = None
    categories: List[str] = None               # Subject categories
    keywords: List[str] = None                 # Keywords
    citations: int = 0                         # Citation count
    references: Optional[List[str]] = None     # List of reference IDs/DOIs
    extra: Optional[Dict] = None    

    def __post_init__(self):
        """Post-initialization to handle default values"""
        if self.authors is None:
            self.authors = []
        if self.categories is None:
            self.categories = []
        if self.keywords is None:
            self.keywords = []
        if self.references is None:
            self.references = []
        if self.extra is None:
            self.extra = {}

    def to_dict(self) -> Dict:
        """Convert paper to dictionary format for serialization"""
        return {
            'paper_id': self.paper_id,
            'title': self.title,
            'authors': '; '.join(self.authors) if self.authors else '',
            'abstract': self.abstract,
            'source': self.source,
            'url': self.url,
            'published_date': self.published_date.isoformat() if self.published_date else '',
            'updated_date': self.updated_date.isoformat() if self.updated_date else '',
            'pdf_url': self.pdf_url,
            'categories': '; '.join(self.categories) if self.categories else '',
            'keywords': '; '.join(self.keywords) if self.keywords else '',
            'citations': self.citations,
            'references': '; '.join(self.references) if self.references else '',
            'extra': str(self.extra) if self.extra else ''
        }