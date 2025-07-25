import { Word } from "@/generated/prisma";
import axios from "axios"
import { IWordService } from "@/interfaces/services/word.service.interface";
import { BaseService } from "./base.service";
import { CreateWordRequestDto } from "@/dtos/word.dto";
import { ILanguageService } from "@/interfaces/services/language.service.interface";
import { HttpException } from "@/exceptions/HttpException";

export class WordService extends BaseService implements IWordService{

    private _languageService: ILanguageService
    

    constructor(languageService: ILanguageService ){
        super()
        this._languageService = languageService
    }
    async toogleLike(wordId: string, userId: string): Promise<Word> {
        return await this.prisma.$transaction(async (tx) => {
            const targetWord = await tx.word.findUnique({
                where: { id: wordId },
                include: {
                    likedBy: true,
                }
            });

            if (!targetWord) {
                throw new HttpException(404, 'Word not found');
            }

            // Initialize arrays if they don't exist
            const likedByIds = targetWord.likedByIds || [];

            const isLiked = likedByIds.includes(userId);

            let updatedLikedByIds = [...likedByIds];

            if (isLiked) {
                updatedLikedByIds = updatedLikedByIds.filter(id => id !== userId);
            } else {
                updatedLikedByIds.push(userId);
            }

            // Update the word with new arrays
            const updatedWord = await tx.word.update({
                where: { id: wordId },
                data: {
                    likedByIds: updatedLikedByIds,
                    likedBy: {
                        connect: isLiked ? undefined : { id: userId },
                        disconnect: isLiked ? { id: userId } : undefined
                    },
                    
                },
                include: {
                    likedBy: {
                        select: {
                            id: true,
                            username: true
                        }
                    },
                    
                }
            });

            return updatedWord;
        });
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