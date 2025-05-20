export interface SearchResult {
    pageid: number;
    title: string;
    snippet: string;
}

export interface WikipediaError {
    error: {
        code: string;
        info: string;
    };
}

export interface WikipediaResponse {
    query: {
        search?: SearchResult[];
        pages?: {
            [key: string]: {
                pageid: number;
                title: string;
                extract?: string;
                thumbnail?: {
                    source: string;
                    width: number;
                    height: number;
                };
                pageimage?: string;
                fullurl?: string;
                missing?: boolean;
            };
        };
    };
    error?: {
        code: string;
        info: string;
    };
}

export interface ArticleData {
    title: string;
    extract: string;
    thumbnail?: {
        source: string;
        width: number;
        height: number;
    };
    pageimage?: string;
    fullurl?: string;
} 