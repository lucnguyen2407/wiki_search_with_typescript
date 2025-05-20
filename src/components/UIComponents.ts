import { SearchResult } from '../types';

// UI Elements
let searchInput: HTMLInputElement;
let searchButton: HTMLButtonElement;
let resultsContainer: HTMLDivElement;
let articleContainer: HTMLDivElement;
let suggestionsBox: HTMLDivElement;
let debounceTimeout: number;
let errorMessage: HTMLDivElement;

export function initializeUI() {
    const app = document.getElementById('app')!;

    // Create search section
    const searchSection = document.createElement('div');
    searchSection.className = 'max-w-7xl mx-auto p-4 px-6 md:px-8 lg:px-12';

    const header = document.createElement('h1');
    header.className = 'text-4xl font-bold text-center mb-8 text-gray-800';
    header.textContent = 'Wikipedia Search';

    const searchContainer = document.createElement('div');
    searchContainer.className = 'flex flex-col gap-2 mb-8 relative';

    // Create form wrapper
    const formWrapper = document.createElement('div');
    formWrapper.className = 'flex gap-2';

    searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search Wikipedia...';
    searchInput.className = 'flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500';
    searchInput.setAttribute('aria-label', 'Search Wikipedia');
    searchInput.setAttribute('required', 'true');

    searchButton = document.createElement('button');
    searchButton.textContent = 'Search';
    searchButton.className = 'px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors';
    searchButton.setAttribute('type', 'submit');

    formWrapper.appendChild(searchInput);
    formWrapper.appendChild(searchButton);

    // Create error message element
    errorMessage = document.createElement('div');
    errorMessage.className = 'text-red-500 text-sm mt-1 hidden';
    errorMessage.setAttribute('role', 'alert');

    // Create suggestions box
    suggestionsBox = document.createElement('div');
    suggestionsBox.className = 'absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg hidden z-10';
    suggestionsBox.style.maxHeight = '300px';
    suggestionsBox.style.overflowY = 'auto';

    searchContainer.appendChild(formWrapper);
    searchContainer.appendChild(errorMessage);
    searchContainer.appendChild(suggestionsBox);

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

    // Add click outside listener to close suggestions
    document.addEventListener('click', (e) => {
        if (!searchContainer.contains(e.target as Node)) {
            hideSuggestions();
        }
    });
}

export function getSearchInput(): HTMLInputElement {
    return searchInput;
}

export function getSearchButton(): HTMLButtonElement {
    return searchButton;
}

export function getSuggestionsBox(): HTMLDivElement {
    return suggestionsBox;
}

export function showSuggestions(suggestions: SearchResult[], onSuggestionClick: (pageId: number) => void) {
    suggestionsBox.innerHTML = '';
    suggestionsBox.classList.remove('hidden');

    suggestions.forEach(suggestion => {
        const suggestionElement = document.createElement('div');
        suggestionElement.className = 'p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0';
        suggestionElement.innerHTML = `
            <div class="font-medium text-blue-600">${suggestion.title}</div>
            <div class="text-sm text-gray-600 line-clamp-2">${suggestion.snippet}</div>
        `;

        suggestionElement.addEventListener('click', () => {
            onSuggestionClick(suggestion.pageid);
            hideSuggestions();
        });

        suggestionsBox.appendChild(suggestionElement);
    });
}

export function hideSuggestions() {
    suggestionsBox.classList.add('hidden');
}

export function debounceSearch(callback: (query: string) => void, delay: number = 500) {
    return (query: string) => {
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }
        debounceTimeout = window.setTimeout(() => {
            callback(query);
        }, delay);
    };
}

export function displayResults(results: SearchResult[], onResultClick: (pageId: number) => void) {
    resultsContainer.innerHTML = '';
    articleContainer.classList.add('hidden');

    if (results.length === 0) {
        resultsContainer.innerHTML = '<p class="text-gray-500">No results found.</p>';
        return;
    }

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

        resultElement.addEventListener('click', () => onResultClick(result.pageid));
        gridContainer.appendChild(resultElement);
    });

    resultsContainer.appendChild(gridContainer);
}

export function displayArticle(title: string, content: string) {
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

export function displayError(errorMessage: string) {
    resultsContainer.innerHTML = `
        <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-red-600">${errorMessage}</p>
            <p class="text-sm text-red-500 mt-2">Please try again in a few moments.</p>
        </div>
    `;
    articleContainer.classList.add('hidden');
}

export function setSearching(isSearching: boolean) {
    searchButton.disabled = isSearching;
}

export function showError(message: string) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    searchInput.classList.add('border-red-500');
    searchInput.classList.add('focus:ring-red-500');
    searchInput.classList.remove('focus:ring-blue-500');
}

export function hideError() {
    errorMessage.classList.add('hidden');
    searchInput.classList.remove('border-red-500');
    searchInput.classList.remove('focus:ring-red-500');
    searchInput.classList.add('focus:ring-blue-500');
}

export function validateSearchInput(): boolean {
    const query = searchInput.value.trim();
    if (!query) {
        showError('Please enter a search term');
        return false;
    }
    if (query.length < 3) {
        showError('Search term must be at least 3 characters long');
        return false;
    }
    hideError();
    return true;
} 