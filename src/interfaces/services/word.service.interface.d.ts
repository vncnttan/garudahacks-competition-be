import { Word } from "@/generated/prisma";

export interface IWordService {
    createWord(word : Word) : Promise<Word>
    getWordById(id: string) : Promise<Word>
}

