import axios, { AxiosError } from 'axios';
import { SearchResult, WikipediaError, WikipediaResponse } from '../types';

const RATE_LIMIT_DELAY = 1000; // 1 second delay between requests
let searchTimeout: number = 0;

async function makeRequest(
    type: 'search' | 'article',
    params: Record<string, string | number | boolean>
): Promise<WikipediaResponse> {
    try {
        const response = await axios.get<WikipediaResponse>('https://en.wikipedia.org/w/api.php', {
            params: {
                action: 'query',
                format: 'json',
                origin: '*',
                ...params
            },
            timeout: 10000,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (response.data.error) {
            throw new Error(response.data.error.info);
        }

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<WikipediaError>;
            if (axiosError.response?.status === 429) {
                throw new Error('Rate limit exceeded. Please wait a moment before trying again.');
            }
            if (axiosError.code === 'ECONNABORTED') {
                throw new Error('Request timed out. Please check your internet connection.');
            }
            if (axiosError.response?.data?.error) {
                throw new Error(axiosError.response.data.error.info);
            }
        }
        throw error;
    }
}

export async function searchWikipedia(query: string): Promise<SearchResult[]> {
    // Add delay to prevent rate limiting
    await new Promise(resolve => {
        searchTimeout = window.setTimeout(resolve, RATE_LIMIT_DELAY);
    });

    const response = await makeRequest('search', {
        list: 'search',
        srsearch: query,
        srlimit: 10,
        srprop: 'snippet|title|pageid'
    });

    return response.query.search;
}

export async function getWikipediaArticle(pageId: number): Promise<{ title: string; extract: string }> {
    const response = await makeRequest('article', {
        prop: 'extracts',
        pageids: pageId,
        exintro: true,
        explaintext: true,
        exsentences: 3
    });

    const page = response.query.pages[pageId];
    if (page.missing) {
        throw new Error('Article not found');
    }

    return {
        title: page.title,
        extract: page.extract
    };
} 