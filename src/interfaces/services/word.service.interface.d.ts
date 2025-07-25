import { CreateWordRequestDto} from "@/dtos/word.dto";
import { Word } from "@/generated/prisma";

export interface IWordService {
    createWord(wordRequestDto: CreateWordRequestDto) : Promise<Word>
    getWordById(id: string) : Promise<Word>
    getTranslationList(languageSrc: string, languageDst: string, prompt: string): Promise<Word[]>;
    getRandomWord(langCode : string): Promise<Word>;
    toogleLike(wordId: string, userId: string
    ): Promise<Word>;
    getMoreWords(word: string): Promise<Word[]>;
}

