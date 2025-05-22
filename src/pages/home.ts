import { SearchResult } from "../types";
import { createSearchHeader } from "../components/SearchHeader";
import { createSearchResults } from "../components/SearchResults";

let debounceTimeout: number;

const { searchSection, searchInput, searchButton, errorMessage, suggestionsBox, searchContainer } = createSearchHeader();
const { resultsContainer, displayResults, displayError } = createSearchResults();

export function HomePage() {
    const app = document.getElementById("app")!;
    app.innerHTML = "";

    app.appendChild(searchSection);
    app.appendChild(resultsContainer);

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

export { displayResults, displayError };

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