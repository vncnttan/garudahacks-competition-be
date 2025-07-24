import { WordRequestDto } from "@/dtos/word.dto";
import { HttpException } from "@/exceptions/HttpException";
import { ILanguageService } from "@/interfaces/services/language.service.interface";
import { IWordService } from "@/interfaces/services/word.service.interface";
import { BaseResponseBuilder } from "@/utils/ResponseBuilder";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";

export class DictionaryController {
    private _wordService: IWordService
    constructor( wordService: IWordService){
        this._wordService = wordService
    }

    public createWord = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Type assertion for files
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            const wordRequestDto = plainToInstance(WordRequestDto, req.body)
            // Get the file paths
            const pronunciationPath = files.pronunciation?.[0]?.filename;
            const examplePronunciationPath = files.examplePronunciation?.[0]?.filename;

            if (!pronunciationPath || !examplePronunciationPath) {
                throw new HttpException(400, 'Missing required audio files');
            }
            req.body.pronounciation = pronunciationPath
            req.body.examplePronounciation = examplePronunciationPath
          


            const word = await this._wordService.createWord({
                word: wordRequestDto.word,
                definition: wordRequestDto.definition,
                example: wordRequestDto.example,
                exampleTranslation: wordRequestDto.exampleTranslation,
                pronounciation:  `/public/${pronunciationPath}`,
                examplePronounciation: `/public/${examplePronunciationPath}`,
                languageCode: wordRequestDto.languageCode,
                directTranslation: wordRequestDto.directTranslation
            })
            
            res.status(201).json(
                new BaseResponseBuilder()
                    .withSuccess(true)
                    .withMessage("Word created successfully")
                    .withData(word)
                    .build()
            );
            
        } catch (error) {
            next(error);
        }
    }
}