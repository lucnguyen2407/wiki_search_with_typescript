import './style.css';
import axios, { AxiosError } from 'axios';
import { SearchResult, WikipediaError, WikipediaResponse } from './types';

// State management
let isSearching = false;
let searchTimeout: number = 0;
const RATE_LIMIT_DELAY = 1000; // 1 second delay between requests

// DOM Elements
let searchInput: HTMLInputElement;
let searchButton: HTMLButtonElement;
let resultsContainer: HTMLDivElement;
let articleContainer: HTMLDivElement;

// Initialize the application
function initializeApp() {
    const app = document.getElementById('app')!;

    // Create search section
    const searchSection = document.createElement('div');
    searchSection.className = 'max-w-7xl mx-auto p-4 px-6 md:px-8 lg:px-12';

    const header = document.createElement('h1');
    header.className = 'text-4xl font-bold text-center mb-8 text-gray-800';
    header.textContent = 'Wikipedia Search';

    const searchContainer = document.createElement('div');
    searchContainer.className = 'flex gap-2 mb-8';

    searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search Wikipedia...';
    searchInput.className = 'flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500';

    searchButton = document.createElement('button');
    searchButton.textContent = 'Search';
    searchButton.className = 'px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors';

    searchContainer.appendChild(searchInput);
    searchContainer.appendChild(searchButton);

    searchSection.appendChild(header);
    searchSection.appendChild(searchContainer);

    // Create results container
    resultsContainer = document.createElement('div');
    resultsContainer.className = 'max-w-7xl mx-auto p-4 px-6 md:px-8 lg:px-12';

    // Create article container
    articleContainer = document.createElement('div');
    articleContainer.className = 'max-w-7xl mx-auto p-4 px-6 md:px-8 lg:px-12 mt-8 bg-white rounded-lg shadow-lg hidden';

    app.appendChild(searchSection);
    app.appendChild(resultsContainer);
    app.appendChild(articleContainer);

    // Setup event listeners
    setupEventListeners();
}

function setupEventListeners() {
    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
}

async function handleSearch() {
    const query = searchInput.value.trim();
    if (!query || isSearching) return;

    isSearching = true;
    searchButton.disabled = true;

    try {
        // Clear previous timeout
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        // Add delay to prevent rate limiting
        await new Promise(resolve => {
            searchTimeout = window.setTimeout(resolve, RATE_LIMIT_DELAY);
        });

        const response = await makeWikipediaRequest('search', {
            list: 'search',
            srsearch: query,
            srlimit: 10,
            srprop: 'snippet|title|pageid'
        });

        displayResults(response.query.search);
    } catch (error) {
        handleApiError(error);
    } finally {
        isSearching = false;
        searchButton.disabled = false;
    }
}

async function fetchArticle(pageId: number) {
    if (isSearching) return;
    isSearching = true;

    try {
        const response = await makeWikipediaRequest('article', {
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
        displayArticle(page.title, page.extract);
    } catch (error) {
        handleApiError(error);
    } finally {
        isSearching = false;
    }
}

async function makeWikipediaRequest(
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

function displayResults(results: SearchResult[]) {
    resultsContainer.innerHTML = '';
    articleContainer.classList.add('hidden');

    if (results.length === 0) {
        resultsContainer.innerHTML = '<p class="text-gray-500">No results found.</p>';
        return;
    }

    // Create a grid container
    const gridContainer = document.createElement('div');
    gridContainer.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';

    results.forEach(result => {
        const resultElement = document.createElement('div');
        resultElement.className = 'p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col';
        resultElement.innerHTML = `
            <h2 class="text-xl font-semibold text-blue-600 mb-2">${result.title}</h2>
            <p class="text-gray-600 flex-grow">${result.snippet}</p>
            <div class="mt-4 text-sm text-blue-500 hover:text-blue-600">
                Click to read more →
            </div>
        `;

        resultElement.addEventListener('click', () => fetchArticle(result.pageid));
        gridContainer.appendChild(resultElement);
    });

    resultsContainer.appendChild(gridContainer);
}

function displayArticle(title: string, content: string) {
    articleContainer.classList.remove('hidden');
    articleContainer.innerHTML = `
        <h2 class="text-2xl font-bold text-gray-800 mb-4">${title}</h2>
        <div class="prose max-w-none">
            <p class="text-gray-600">${content}</p>
        </div>
        <a href="https://en.wikipedia.org/?curid=${title}" 
           target="_blank" 
           class="inline-block mt-4 text-blue-500 hover:text-blue-600">
            Read full article on Wikipedia
        </a>
    `;
}

function handleApiError(error: unknown) {
    console.error('API Error:', error);
    let errorMessage = 'An error occurred while fetching data.';

    if (error instanceof Error) {
        errorMessage = error.message;
    }

    if (resultsContainer) {
        resultsContainer.innerHTML = `
            <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p class="text-red-600">${errorMessage}</p>
                <p class="text-sm text-red-500 mt-2">Please try again in a few moments.</p>
            </div>
        `;
    }

    if (articleContainer) {
        articleContainer.classList.add('hidden');
    }
}

// Start the application
initializeApp(); 