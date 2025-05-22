import searchButtonComponent from "./SearchButton";
import searchInputComponent from "./SearchInput";
import suggestionsBoxComponent from "./SuggestionBox";
import errorMessageComponent from "./ErrorMessage";

export function createSearchHeader() {
    const searchSection = document.createElement("div");
    searchSection.className = "max-w-7xl mx-auto p-4 px-6 md:px-8 lg:px-12";

    const header = document.createElement("h1");
    header.className = "text-4xl font-bold text-center mb-8 text-gray-800";
    header.textContent = "Wikipedia Search";

    const searchContainer = document.createElement("div");
    searchContainer.className = "flex flex-col gap-2 mb-8 relative";

    // Create form wrapper
    const formWrapper = document.createElement("div");
    formWrapper.className = "flex gap-2";

    const searchInput = searchInputComponent();
    const searchButton = searchButtonComponent();
    const errorMessage = errorMessageComponent();
    const suggestionsBox = suggestionsBoxComponent();

    formWrapper.appendChild(searchInput);
    formWrapper.appendChild(searchButton);

    searchContainer.appendChild(formWrapper);
    searchContainer.appendChild(errorMessage);
    searchContainer.appendChild(suggestionsBox);

    searchSection.appendChild(header);
    searchSection.appendChild(searchContainer);

    return {
        searchSection,
        searchInput,
        searchButton,
        errorMessage,
        suggestionsBox,
        searchContainer
    };
} 