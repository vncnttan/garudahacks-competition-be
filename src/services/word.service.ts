import { Word } from "@/generated/prisma";
import { IWordService } from "@/interfaces/services/word.service.interface";
import { BaseService } from "./base.service";
import { CreateWordRequestDto, WordRequestDto } from "@/dtos/word.dto";
import { ILanguageService } from "@/interfaces/services/language.service.interface";
import { HttpException } from "@/exceptions/HttpException";

export class WordService extends BaseService implements IWordService{

    private _languageService: ILanguageService

    constructor(languageService: ILanguageService){
        super()
        this._languageService = languageService
    }

    async createWord(wordRequestDto: CreateWordRequestDto): Promise<Word> {

        const language = await this._languageService.getLanguageByLangCode(wordRequestDto.languageCode)

        if(!language){
            throw new HttpException(404, 'Language not found')
        }

        // const wordUnique = await this.prisma.word.findFirst({
        //     where: {
        //         word: {
        //             equals: wordRequestDto.word,
        //             mode: 'insensitive'
        //         },
        //         languageId: language.id
        //     }
        // });

        const word = await this.prisma.word.create({
            data: {
                word: wordRequestDto.word,
                definition: wordRequestDto.definition,
                example: wordRequestDto.example,
                exampleTranslation: wordRequestDto.exampleTranslation,
                pronounciation: wordRequestDto.pronounciation,
                examplePronounciation: wordRequestDto.examplePronounciation,
                languageId: language.id,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        })
        return word
    }
    async getWordById(id: string): Promise<Word> {
        throw new Error("Method not implemented.");
    }
}