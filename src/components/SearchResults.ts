import { SearchResult } from "../types";
import { truncateText } from "../utils/helper";

export function createSearchResults() {
    const resultsContainer = document.createElement("div");
    resultsContainer.className = "max-w-7xl mx-auto p-4 px-6 md:px-8 lg:px-12";

    return {
        resultsContainer,
        displayResults: (results: SearchResult[], query: string, onResultClick: (pageId: number) => void) => {
            resultsContainer.innerHTML = "";

            if (results.length === 0) {
                resultsContainer.innerHTML = '<p class="text-gray-500">No results found.</p>';
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
            gridContainer.className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4";

            results.forEach((result) => {
                const resultElement = document.createElement("div");
                resultElement.className = "p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col";

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
        },
        displayError: (errorMessage: string) => {
            resultsContainer.innerHTML = `
                <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p class="text-red-600">${errorMessage}</p>
                    <p class="text-sm text-red-500 mt-2">Please try again in a few moments.</p>
                </div>
            `;
        }
    };
} 