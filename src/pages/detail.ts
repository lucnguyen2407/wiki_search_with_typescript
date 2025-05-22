import { ArticleData } from "../types";

let articleContainer: HTMLDivElement;

export function DetailPage() {
    const app = document.getElementById("app")!;
    app.innerHTML = ""; // Clear the app container


    articleContainer = document.createElement("div");
    articleContainer.className = "max-w-7xl mx-auto p-4 px-6 md:px-8 lg:px-12 mt-8 bg-white rounded-lg shadow-lg";

    app.appendChild(articleContainer);
}

export function displayArticle(article: ArticleData, onBackClick: () => void) {
    if (!articleContainer) return;

    const imageHtml = article.thumbnail ? `
        <div class="mb-6">
            <img src="${article.thumbnail.source}" 
                 alt="${article.title}"
                 class="rounded-lg w-full max-h-96 object-cover"
                 width="${article.thumbnail.width}"
                 height="${article.thumbnail.height}">
        </div>
    ` : '';

    articleContainer.innerHTML = `
        <div class="mb-6">
            <button onclick="window.backToResults()" 
                    class="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
                Back to results
            </button>
        </div>
        <h1 class="text-3xl font-bold text-gray-800 mb-4">${article.title}</h1>
        ${imageHtml}
        <div class="prose max-w-none">
            ${article.extract}
        </div>
        <div class="mt-8">
            <a href="${article.fullurl || `https://en.wikipedia.org/wiki/${encodeURIComponent(article.title)}`}" 
               target="_blank" 
               class="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                <span>Read full article on Wikipedia</span>
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
            </a>
        </div>
    `;


    (window as any).backToResults = onBackClick;
} 