export interface SearchResult {
    title: string;
    snippet: string;
    pageid: number;
}

export interface WikipediaError {
    code: string;
    info: string;
    error?: {
        code: string;
        info: string;
    };
}

export interface WikipediaResponse {
    query: {
        search: SearchResult[];
        pages: {
            [key: number]: {
                title: string;
                extract: string;
                missing?: boolean;
            };
        };
    };
    error?: {
        code: string;
        info: string;
    };
} 