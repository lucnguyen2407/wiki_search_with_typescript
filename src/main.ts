import './style.css';
import { searchWikipedia, getWikipediaArticle } from './services/wikipediaApi';
import { 
    initializeUI, 
    getSearchInput, 
    getSearchButton, 
    displayResults, 
    displayArticle, 
    displayError, 
    setSearching 
} from './components/UIComponents';

// State management
let isSearching = false;

// Setup event listeners
function setupEventListeners() {
    const searchInput = getSearchInput();
    const searchButton = getSearchButton();

    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
}

async function handleSearch() {
    const query = getSearchInput().value.trim();
    if (!query || isSearching) return;

    isSearching = true;
    setSearching(true);

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

    try {
        const article = await getWikipediaArticle(pageId);
        displayArticle(article.title, article.extract);
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