import { Word } from "@/generated/prisma";
import axios from "axios"
import { IWordService } from "@/interfaces/services/word.service.interface";
import { BaseService } from "./base.service";
import { CreateWordRequestDto, WordRequestDto } from "@/dtos/word.dto";
import { ILanguageService } from "@/interfaces/services/language.service.interface";
import { HttpException } from "@/exceptions/HttpException";
import { log } from "console";

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
    async getTranslationList(languageSrc: string, languageDst: string, prompt: string): Promise<Word[]> {

        console.log("Fetching translation list with params:", { languageSrc, languageDst, prompt });
        const response = await axios.get("https://makna.ai.vncnttan.my.id/ai-search", {
            params: {
                lang_src: languageSrc,
                lang_dst: languageDst,
                query: prompt
            }
        })


        const rawResults = response?.data?.results as Array<{ id: string; score: number; content: string }>;

        if (!Array.isArray(rawResults)) {
            throw new HttpException(502, "Invalid response from AI service.");
        }
        
        const filteredResults = rawResults.filter((item) => item.score > 0.1);

        const orderedIds = filteredResults.map((item) => item.id);

        if (orderedIds.length === 0) {
            return [];
        }

        const words = await this.prisma.word.findMany({
            where: { id: { in: orderedIds } },
        });

        const wordMap = new Map(words.map((word) => [word.id, word]));

        return orderedIds
            .map((id) => wordMap.get(id))
            .filter((word): word is Word => word !== undefined);
    } 
}