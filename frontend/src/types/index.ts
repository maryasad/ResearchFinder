export interface Article {
    id: string;
    title: string;
    authors: string[];
    abstract?: string;
    url: string;
    source: string;
    publishedDate?: string;
    citations?: number;
    ranking?: number;
}

export interface ArticleDetails extends Article {
    citedBy?: Article[];
    relatedArticles?: Article[];
    metrics?: {
        citationCount: number;
        downloadCount?: number;
        viewCount?: number;
    };
    citations_per_year?: Record<string, number>;
}

export interface SearchFilters {
    sources: string[];
    startYear?: string;
    endYear?: string;
    sortBy: 'relevance' | 'citations' | 'date';
    sortOrder: 'asc' | 'desc';
    maxResults: number;
}

export interface SearchRequest {
    query: string;
    filters: SearchFilters;
}

export interface SearchResponse {
    articles: Article[];
    total: number;
}

export type Source = 'PubMed' | 'arXiv' | 'All';
