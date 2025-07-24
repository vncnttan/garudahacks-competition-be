import App from "@/app";
import validateEnv from "@/utils/validateEnv";
import AuthRoute from "./routes/auth.route";
import { serviceInjector } from "./utils/serviceInjector";
import { LeaderboardRoute } from "./routes/leaderboard.route";

console.log("App starting...")

validateEnv();

console.log("Environment variables validated");

try {
    const app = new App([
            new AuthRoute(serviceInjector.authService, serviceInjector.leaderboardService),
            new LeaderboardRoute(serviceInjector.leaderboardService)]
        );
    console.log("App initialized !");
    app.listen();
} catch (error) {
    console.log(`Error: ${error}`);
}