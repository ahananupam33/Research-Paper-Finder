export interface Paper {
    paper_id?: string;
    title: string;
    authors: string[];
    published_date: string;
    citationCount: number;
    url: string;
    abstract: string;
    categories?: string[];
}

export interface SearchProps {
    searchParams: Promise<{
        query?: string;
        sort?: string;
        page?: string;
        limit?: string;
    }>
}

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export interface ChatbotSidebarProps {
    selectedPaper: Paper | null;
    selectedPaperIndex: number | null;
    isOpen: boolean;
    onClose: () => void;
}