import axios from 'axios';
import { Article, SearchResponse, SearchFilters } from '../types';

const api = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const searchArticles = async (query: string, filters: SearchFilters): Promise<SearchResponse> => {
    try {
        const response = await api.post('/search', {
            query,
            sources: filters.sources,
            maxResults: filters.maxResults,
            startYear: filters.startYear,
            endYear: filters.endYear,
            sortBy: filters.sortBy,
            sortOrder: filters.sortOrder,
        });
        return response.data;
    } catch (error: any) {
        console.error('Search error:', error);
        throw error;
    }
};
