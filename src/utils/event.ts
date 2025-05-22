import {
    debounceSearch,
    displayError,
    displayResults,
    getSearchButton,
    getSearchInput,
    hideError,
    hideSuggestions,
    setSearching,
    showSuggestions,
    validateSearchInput
} from "../pages/home";
import { router } from "../router";
import { searchWikipedia } from "../services/wikipediaApi";

let isSearching = false;

export function setupEventListeners() {
    const searchInput = getSearchInput();
    const searchButton = getSearchButton();

    const debouncedSearch = debounceSearch(async (query: string) => {
        const trimmedQuery = query.trim();
        if (!trimmedQuery || trimmedQuery.length < 3) {
            hideSuggestions();
            return;
        }

        try {
            const results = await searchWikipedia(trimmedQuery);
            if (results.length > 0) {
                showSuggestions(results.slice(0, 3), handleResultClick);
            } else {
                hideSuggestions();
            }
        } catch (error) {
            hideSuggestions();
        }
    });

    searchInput.addEventListener("input", (e) => {
        const query = (e.target as HTMLInputElement).value.trim();
        hideError();
        debouncedSearch(query);
    });

    searchInput.addEventListener("focus", () => {
        const query = searchInput.value.trim();
        if (query && query.length >= 3) {
            debouncedSearch(query);
        }
    });

    searchButton.addEventListener("click", () => {
        const query = searchInput.value.trim();
        handleSearch(query);
    });

    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const query = searchInput.value.trim();
            handleSearch(query);
        }
    });
}

async function handleSearch(query: string) {
    if (!validateSearchInput()) return;

    setSearching(true);
    hideSuggestions();
    try {
        const results = await searchWikipedia(query);
        displayResults(results, query, handleResultClick);
    } catch (error) {
        displayError(error instanceof Error ? error.message : "An error occurred");
    } finally {
        setSearching(false);
    }
}

export async function handleResultClick(pageId: number) {
    if (isSearching) return;
    isSearching = true;
    setSearching(true);
    hideSuggestions();

    try {
        router.navigate(`/article/${pageId}`);
    } catch (error) {
        displayError(error instanceof Error ? error.message : "An error occurred");
    } finally {
        isSearching = false;
        setSearching(false);
    }
} 