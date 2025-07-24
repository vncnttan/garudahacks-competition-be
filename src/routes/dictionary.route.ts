import { audioFields, upload } from "@/config/multer";
import { DictionaryController } from "@/controllers/dictionary.controller";
import { Routes } from "@/interfaces/routes.interface";
import { IWordService } from "@/interfaces/services/word.service.interface";
import authMiddleware from "@/middlewares/auth.middleware";
import { wordValidationMiddleware } from "@/middlewares/wordValidation.middleware";
import { Router } from "express";

export class DictionaryRoute implements Routes {
    public path = "/dictionary";
    public router = Router();
    private dictionaryController: DictionaryController;

    constructor(wordService: IWordService) {
        this.dictionaryController = new DictionaryController(wordService);
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(
            `${this.path}/word`,
            authMiddleware,
            upload.fields(audioFields),  // 1. Handle file uploads first
            wordValidationMiddleware,    // 2. Then validate everything including files
            this.dictionaryController.createWord
        );
    }
}