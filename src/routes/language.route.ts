import { LanguageController } from "@/controllers/language.controller";
import { Routes } from "@/interfaces/routes.interface";
import { ILanguageService } from "@/interfaces/services/language.service.interface";
import authMiddleware from "@/middlewares/auth.middleware";
import { Router } from "express";



export class LanguageRoute implements Routes {
    public path = '/languages'
    public router = Router();
    public languageController: LanguageController;

    constructor(languageService: ILanguageService) {
        this.languageController = new LanguageController(languageService);
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(
            `${this.path}`,
            authMiddleware,
            this.languageController.getAllLanguages
        );
    }
}