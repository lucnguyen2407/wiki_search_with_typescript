import { SearchResult } from "../types";
import searchButtonComponent from "../components/SearchButton";
import searchInputComponent from "../components/SearchInput";
import suggestionsBoxComponent from "../components/SuggestionBox";
import errorMessageComponent from "../components/ErrorMessage";
import { truncateText } from "../utils/helper";

let searchSection: HTMLDivElement;
let resultsContainer: HTMLDivElement;
let currentSearchResults: SearchResult[] = [];
let currentQuery: string = "";
let debounceTimeout: number;

const searchInput = searchInputComponent();
const searchButton = searchButtonComponent();
const errorMessage = errorMessageComponent();
const suggestionsBox = suggestionsBoxComponent();

export function HomePage() {
    const app = document.getElementById("app")!;
    app.innerHTML = ""; // Clear the app container

    // Create search section
    searchSection = document.createElement("div");
    searchSection.className = "max-w-7xl mx-auto p-4 px-6 md:px-8 lg:px-12";

    const header = document.createElement("h1");
    header.className = "text-4xl font-bold text-center mb-8 text-gray-800";
    header.textContent = "Wikipedia Search";

    const searchContainer = document.createElement("div");
    searchContainer.className = "flex flex-col gap-2 mb-8 relative";

    // Create form wrapper
    const formWrapper = document.createElement("div");
    formWrapper.className = "flex gap-2";

    formWrapper.appendChild(searchInput);
    formWrapper.appendChild(searchButton);

    searchContainer.appendChild(formWrapper);
    searchContainer.appendChild(errorMessage);
    searchContainer.appendChild(suggestionsBox);

    searchSection.appendChild(header);
    searchSection.appendChild(searchContainer);

    // Create results container
    resultsContainer = document.createElement("div");
    resultsContainer.className = "max-w-7xl mx-auto p-4 px-6 md:px-8 lg:px-12";

    app.appendChild(searchSection);
    app.appendChild(resultsContainer);

    // Add click outside listener to close suggestions
    document.addEventListener("click", (e) => {
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

export function showSuggestions(
    suggestions: SearchResult[],
    onSuggestionClick: (pageId: number) => void
) {
    suggestionsBox.innerHTML = "";
    suggestionsBox.classList.remove("hidden");

    suggestions.forEach((suggestion) => {
        const suggestionElement = document.createElement("div");
        suggestionElement.className =
            "p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0";
        suggestionElement.innerHTML = `
            <div class="font-medium text-blue-600">${suggestion.title}</div>
            <div class="text-sm text-gray-600 line-clamp-2">${suggestion.extract}</div>
        `;

        suggestionElement.addEventListener("click", () => {
            onSuggestionClick(suggestion.pageid);
            hideSuggestions();
        });

        suggestionsBox.appendChild(suggestionElement);
    });
}

export function hideSuggestions() {
    suggestionsBox.classList.add("hidden");
}

export function debounceSearch(
    callback: (query: string) => void,
    delay: number = 500
) {
    return (query: string) => {
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }
        debounceTimeout = window.setTimeout(() => {
            callback(query);
        }, delay);
    };
}

export function displayResults(
    results: SearchResult[],
    query: string,
    onResultClick: (pageId: number) => void
) {
    currentSearchResults = results;
    currentQuery = query;

    resultsContainer.innerHTML = "";

    if (results.length === 0) {
        resultsContainer.innerHTML =
            '<p class="text-gray-500">No results found.</p>';
        return;
    }

    // Add title for search results
    const titleContainer = document.createElement("div");
    titleContainer.className = "mb-6";
    const title = document.createElement("h2");
    title.className = "text-2xl font-bold text-gray-800";
    title.textContent = `Search Results for "${query}"`;
    titleContainer.appendChild(title);
    resultsContainer.appendChild(titleContainer);

    const gridContainer = document.createElement("div");
    gridContainer.className =
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4";

    results.forEach((result) => {
        const resultElement = document.createElement("div");
        resultElement.className =
            "p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col";

        let imageHtml = "";
        if (result.thumbnail) {
            imageHtml = `
                <div class="mb-4">
                    <img src="${result.thumbnail.source}" 
                         alt="${result.title}"
                         class="rounded-lg w-full h-40 object-cover"
                         width="${result.thumbnail.width}"
                         height="${result.thumbnail.height}">
                </div>
            `;
        }

        const previewText = truncateText(result.extract || "");

        resultElement.innerHTML = `
            ${imageHtml}
            <h2 class="text-xl font-semibold text-blue-600 mb-2 line-clamp-2">${result.title}</h2>
            <p class="text-gray-600 flex-grow line-clamp-3">${previewText}</p>
            <div class="mt-4 text-sm text-blue-500 hover:text-blue-600 flex items-center">
                <span>Read full article</span>
                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
            </div>
        `;

        resultElement.addEventListener("click", () => onResultClick(result.pageid));
        gridContainer.appendChild(resultElement);
    });

    resultsContainer.appendChild(gridContainer);
}

export function getCurrentSearchResults(): SearchResult[] {
    return currentSearchResults;
}

export function getCurrentQuery(): string {
    return currentQuery;
}

export function displayError(errorMessage: string) {
    resultsContainer.innerHTML = `
        <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-red-600">${errorMessage}</p>
            <p class="text-sm text-red-500 mt-2">Please try again in a few moments.</p>
        </div>
    `;
}

export function setSearching(isSearching: boolean) {
    searchButton.disabled = isSearching;
}

export function showError(message: string) {
    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden");
    searchInput.classList.add("border-red-500");
    searchInput.classList.add("focus:ring-red-500");
    searchInput.classList.remove("focus:ring-blue-500");
}

export function hideError() {
    errorMessage.classList.add("hidden");
    searchInput.classList.remove("border-red-500");
    searchInput.classList.remove("focus:ring-red-500");
    searchInput.classList.add("focus:ring-blue-500");
}

export function validateSearchInput(): boolean {
    const query = searchInput.value.trim();

    if (!query) {
        showError("Please enter a search term");
        return false;
    }
    if (query.length < 3) {
        showError("Search term must be at least 3 characters long");
        return false;
    }
    hideError();
    return true;
} 