import express from "express";
import { Routes } from "@/interfaces/routes.interface";
import { FRONTEND_URL, NODE_ENV, PORT } from "@/config";
import cors from "cors"
import { errorMiddleware } from "./middlewares/error.middleware";
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import serveStatic from "serve-static";
import path from "path";

class App{

    private app: express.Application;
    private env: string;
    private port: string | number;

    constructor(routes: Routes[]){
        this.app = express();

        this.env = NODE_ENV || "development";
        this.port = PORT || 3000;

        console.log("Initializing middlewares...");
        this.initializeMiddlewares();
        console.log("Initializing routes...");
        this.initializeRoutes(routes);
        this.initializeSwagger();
        this.initializeErrorHandling();
    }

    private initializeSwagger() {
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }

    private initializeMiddlewares(){
        this.app.use("/public",serveStatic(path.join(__dirname, '..', 'public')));
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cors({
            origin: FRONTEND_URL,
        }));
        this.app.use(express.json());
    }

    private initializeRoutes(routes: Routes[]){
        routes.forEach((route) => {
            this.app.use("/api/v1", route.router);
        });
    }

    public listen(){
        this.app.listen(PORT, () => {
            console.log(`=================================`);
            console.log(`======= ENV: ${this.env} =======`);
            console.log(`🚀 App listening on the port ${this.port}`);
            console.log(`=================================`);
        });
    }
}

export default App;