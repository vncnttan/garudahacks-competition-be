import { ILanguageService } from "@/interfaces/services/language.service.interface";
import { NextFunction, Request, Response } from "express";
import { BaseResponseBuilder } from "@/utils/ResponseBuilder";


export class LanguageController {
    private _languageService: ILanguageService;
    constructor(languageService: ILanguageService) {
        this._languageService = languageService;
    }

    public getAllLanguages = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const languages = await this._languageService.getAllLanguages();
            res.status(200).json(
                new BaseResponseBuilder()
                    .withSuccess(true)
                    .withMessage("Languages fetched successfully")
                    .withData(languages)
                    .build()
            );
        } catch (error) {
            next(error);
        }
    }
}