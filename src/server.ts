import App from "@/app";
import validateEnv from "@/utils/validateEnv";
import AuthRoute from "./routes/auth.route";
import { serviceInjector } from "./utils/serviceInjector";
import { LeaderboardRoute } from "./routes/leaderboard.route";
import { DictionaryRoute } from "./routes/dictionary.route";

console.log("App starting...")

validateEnv();

console.log("Environment variables validated");

try {
    const app = new App([
            new AuthRoute(serviceInjector.authService, serviceInjector.leaderboardService),
            new LeaderboardRoute(serviceInjector.leaderboardService),
            new DictionaryRoute(serviceInjector.wordService)
        ]);
    console.log("App initialized !");
    app.listen();
} catch (error) {
    console.log(`Error: ${error}`);
}