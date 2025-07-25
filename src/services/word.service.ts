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
        const language = await this._languageService.getLanguageByLangCode(wordRequestDto.languageCode);

        if (!language) {
            throw new HttpException(404, 'Language not found');
        }

        const word = await this.prisma.word.create({
            data: {
                word: wordRequestDto.word,
                definition: wordRequestDto.definition,
                example: wordRequestDto.example,
                directTranslation: wordRequestDto.directTranslation,
                exampleTranslation: wordRequestDto.exampleTranslation,
                pronounciation: wordRequestDto.pronounciation,
                examplePronounciation: wordRequestDto.examplePronounciation,
                languageId: language.id,
                createdById: wordRequestDto.createdById,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });

        return word;
    }
    async getWordById(id: string): Promise<Word> {
        throw new Error("Method not implemented.");
    }

    async getRandomWord(langCode: string): Promise<Word> {
        const words = await this.prisma.word.findMany({
            where: {
                language: {
                    languageCode: langCode
                },
                
            }
        });
        // Filter by length in JS since Prisma does not support string length filter directly
        const filteredWords = words.filter(w => w.word.length >= 2 && w.word.length <= 6);
        if (filteredWords.length === 0) {
            throw new HttpException(404, 'No words found');
        }
        const randomIndex = Math.floor(Math.random() * filteredWords.length);
        return filteredWords[randomIndex];
    }
}