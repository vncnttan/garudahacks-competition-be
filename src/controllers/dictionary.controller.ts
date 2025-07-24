import { IWordService } from "@/interfaces/services/word.service.interface";
import { BaseResponseBuilder } from "@/utils/ResponseBuilder";
import { NextFunction, Request, Response } from "express";

export class DictionaryController {
    private _wordService: IWordService
    constructor( wordService: IWordService){
        this._wordService = wordService
    }

    async createWord(req: Request, res: Response, next: NextFunction){
        try {
            res.status(201).json(new BaseResponseBuilder().withSuccess(true).withMessage("Word created successfully").build())
            
        } catch (error) {
            next(error)
        }
    }
}