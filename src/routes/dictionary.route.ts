import { audioFields, upload } from "@/config/multer";
import { DictionaryController } from "../controllers/dictionary.controller";
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
        /**
         * @swagger
         * /dictionary/word:
         *   post:
         *     summary: Create a new dictionary word
         *     tags:
         *       - Dictionary
         *     security:
         *       - bearerAuth: []
         *     requestBody:
         *       required: true
         *       content:
         *         multipart/form-data:
         *           schema:
         *             type: object
         *             required:
         *               - word
         *               - definition
         *               - example
         *               - exampleTranslation
         *               - directTranslation
         *               - languageCode
         *               - pronunciation
         *               - examplePronunciation
         *             properties:
         *               word:
         *                 type: string
         *                 example: "hello"
         *               definition:
         *                 type: string
         *                 example: "A greeting"
         *               example:
         *                 type: string
         *                 example: "Hello, how are you?"
         *               exampleTranslation:
         *                 type: string
         *                 example: "Halo, apa kabar?"
         *               directTranslation:
         *                 type: array
         *                 items:
         *                   type: string
         *                 example: ["halo"]
         *               languageCode:
         *                 type: string
         *                 example: "en"
         *               pronunciation:
         *                 type: string
         *                 format: binary
         *                 description: MP3 file
         *               examplePronunciation:
         *                 type: string
         *                 format: binary
         *                 description: MP3 file
         *     responses:
         *       201:
         *         description: Word created successfully
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/BaseResponseSuccess'
         *             example:
         *               success: true
         *               message: "Word created successfully"
         *               data:
         *                 id: "24b9fec5-43f2-4f2f-9501-3c4f1b57a13d"
         *                 languageId: "5d69eb77-2462-4a19-b36c-4666c49220a7"
         *                 word: "opo"
         *                 pronounciation: "/public/pronunciation-1753383366675-468184423.mp3"
         *                 definition: "ketika ingin bertanya seperti apa"
         *                 example: "Opo koe ?"
         *                 exampleTranslation: "Apa kamu ?"
         *                 examplePronounciation: "/public/examplePronunciation-1753383366676-71376861.mp3"
         *                 createdAt: "2025-07-24T18:56:06.702Z"
         *                 updatedAt: "2025-07-24T18:56:06.702Z"
         *                 createdById: "bf7ed8b0-118e-45e1-a6e2-f159d895e777"
         *                 directTranslation:
         *                   - "Apa"
         *       400:
         *         description: Bad request (missing fields or files)
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/BaseResponseError'
         *       401:
         *         description: Unauthorized
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/BaseResponseError'
         */
        this.router.post(
            `${this.path}/word`,
            authMiddleware,
            upload.fields(audioFields),  // 1. Handle file uploads first
            wordValidationMiddleware,    // 2. Then validate everything including files
            this.dictionaryController.createWord
        );
    }
}