import { WordController } from "@/controllers/word.controller";
import { WordLikeRequestDto } from "@/dtos/word.dto";
import { Routes } from "@/interfaces/routes.interface";
import { IWordService } from "@/interfaces/services/word.service.interface";
import authMiddleware from "@/middlewares/auth.middleware";
import validationMiddleware from "@/middlewares/validation.middleware";
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

        this.router.post(
            `${this.path}/like`,
            authMiddleware,
            validationMiddleware(WordLikeRequestDto, "body"),
            this.wordController.toogleLike
        )

        this.router.get(`${this.path}/:word`, this.wordController.getMoreWords)
    }
}
