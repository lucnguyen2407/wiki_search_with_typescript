import "./style.css";
import { searchWikipedia, getWikipediaArticle } from "./services/wikipediaApi";
import {
  initializeUI,
  getSearchInput,
  getSearchButton,
  showSuggestions,
  hideSuggestions,
  debounceSearch,
  displayResults,
  displayArticle,
  displayError,
  setSearching,
  hideError,
  validateSearchInput,
  showResults,
} from "./components/UIComponents";

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

  // Add input event listener for suggestions
  searchInput.addEventListener("input", (e) => {
    const query = (e.target as HTMLInputElement).value.trim();
    hideError(); // Hide error when user starts typing
    debouncedSearch(query);
  });

  // Add focus event listener
  searchInput.addEventListener("focus", () => {
    const query = searchInput.value.trim();
    if (query && query.length >= 3) {
      debouncedSearch(query);
    }
  });

  // Handle form submission
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
  try {
    const results = await searchWikipedia(query);
    displayResults(results, query, handleResultClick);
  } catch (error) {
    displayError(error instanceof Error ? error.message : "An error occurred");
  } finally {
    setSearching(false);
  }
}

async function handleResultClick(pageId: number) {
  if (isSearching) return;
  isSearching = true;
  setSearching(true);
  hideSuggestions();

  try {
    const article = await getWikipediaArticle(pageId);
    displayArticle(article, () => {
      showResults();
    });
  } catch (error) {
    displayError(error instanceof Error ? error.message : "An error occurred");
  } finally {
    isSearching = false;
    setSearching(false);
  }
}

// Start the application
initializeUI();
setupEventListeners();

function render(element: string, component: HTMLElement) {
  const app = document.querySelector(element);
}
