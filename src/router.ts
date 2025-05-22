import Navigo from "navigo";
import { HomePage } from "./pages/home";
import { DetailPage, displayArticle } from "./pages/detail";
import { getWikipediaArticle } from "./services/wikipediaApi";
import { setupEventListeners } from "./utils/event";

const router = new Navigo("/");

export function setupRouter() {
    // Home route
    router.on("/", () => {
        HomePage();
        setupEventListeners();
    });

    // Article detail route
    router.on("/article/:id", async (match) => {
        if (!match?.data?.id) {
            router.navigate("/");
            return;
        }
        try {
            DetailPage();
            const article = await getWikipediaArticle(parseInt(match.data.id, 10));
            displayArticle(article, () => {
                router.navigate("/");
            });
        } catch (error) {
            router.navigate("/");
        }
    });

    // Handle not found
    router.notFound(() => {
        router.navigate("/");
    });

    // Start the router
    router.resolve();
}

export { router }; 