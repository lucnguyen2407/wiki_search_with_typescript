import Navigo from "navigo";
import { HomePage } from "./pages/home";
import { DetailPage, displayArticle } from "./pages/detail";
import { getWikipediaArticle } from "./services/wikipediaApi";
import { setupEventListeners } from "./utils/event";

const router = new Navigo("/");

export function setupRouter() {
    router.on("/", () => {
        HomePage();
        setupEventListeners();
    });

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

    router.notFound(() => {
        router.navigate("/");
    });

    router.resolve();
}

export { router }; 