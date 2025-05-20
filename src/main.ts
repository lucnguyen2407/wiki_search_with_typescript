import './style.css';
import { searchWikipedia, getWikipediaArticle, getSearchSuggestions } from './services/wikipediaApi';
import { 
    initializeUI, 
    getSearchInput, 
    getSearchButton, 
    displayResults, 
    displayArticle, 
    displayError, 
    setSearching,
    showSuggestions,
    hideSuggestions,
    debounceSearch,
    validateSearchInput,
    hideError
} from './components/UIComponents';

// State management
let isSearching = false;

// Setup event listeners
function setupEventListeners() {
    const searchInput = getSearchInput();
    const searchButton = getSearchButton();

    // Debounced search suggestions
    const debouncedSearch = debounceSearch(async (query: string) => {
        const trimmedQuery = query.trim();
        if (!trimmedQuery || trimmedQuery.length < 3) {
            hideSuggestions();
            return;
        }

        try {
            const suggestions = await getSearchSuggestions(trimmedQuery);
            showSuggestions(suggestions, fetchArticle);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            hideSuggestions();
        }
    });

    // Add input event listener for suggestions
    searchInput.addEventListener('input', (e) => {
        const query = (e.target as HTMLInputElement).value;
        hideError(); // Hide error when user starts typing
        debouncedSearch(query);
    });

    // Add focus event listener
    searchInput.addEventListener('focus', () => {
        const query = searchInput.value.trim();
        if (query && query.length >= 3) {
            debouncedSearch(query);
        }
    });

    // Handle form submission
    searchButton.addEventListener('click', (e) => {
        e.preventDefault();
        handleSearch();
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    });
}

async function handleSearch() {
    if (!validateSearchInput() || isSearching) return;

    const query = getSearchInput().value.trim();
    isSearching = true;
    setSearching(true);
    hideSuggestions();

    try {
        const results = await searchWikipedia(query);
        displayResults(results, fetchArticle);
    } catch (error) {
        handleApiError(error);
    } finally {
        isSearching = false;
        setSearching(false);
    }
}

async function fetchArticle(pageId: number) {
    if (isSearching) return;
    isSearching = true;
    setSearching(true);
    hideSuggestions();

    try {
        const article = await getWikipediaArticle(pageId);
        displayArticle(article);
    } catch (error) {
        handleApiError(error);
    } finally {
        isSearching = false;
        setSearching(false);
    }
}

function handleApiError(error: unknown) {
    console.error('API Error:', error);
    let errorMessage = 'An error occurred while fetching data.';

    if (error instanceof Error) {
        errorMessage = error.message;
    }

    displayError(errorMessage);
}

// Start the application
initializeUI();
setupEventListeners(); 