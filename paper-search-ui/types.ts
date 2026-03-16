export interface Paper {
    title: string;
    authors: string[];
    publishDate: string;
    citationCount: number;
    url: string;
    abstract: string;
}

export interface SearchProps {
    searchParams: Promise<{
        query?: string;
        sort?: string;
        page?: string;
        limit?: string;
    }>
}