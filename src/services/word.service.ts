import { Word } from "@/generated/prisma";
import { IWordService } from "@/interfaces/services/word.service.interface";
import { BaseService } from "./base.service";

export class WordService extends BaseService implements IWordService{

    constructor(){
        super()
    }

    async createWord(word: Word): Promise<Word> {
        throw new Error("Method not implemented.");
    }
    async getWordById(id: string): Promise<Word> {
        throw new Error("Method not implemented.");
    }
}