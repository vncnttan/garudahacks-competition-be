import { WordController } from "@/controllers/word.controller";
import { Routes } from "@/interfaces/routes.interface";
import { IWordService } from "@/interfaces/services/word.service.interface";
import { Router } from "express";



export class WordRoute implements Routes {
    public path = '/words';
    public router = Router();
    public wordController: WordController;

    constructor(wordService: IWordService) {
        this.wordController = new WordController(wordService);
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(
            `${this.path}/translation`,
            this.wordController.getTranslationList
        )
    }
}
