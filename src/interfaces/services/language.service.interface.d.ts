import { Language } from "@/generated/prisma";

export interface ILanguageService {
    getLanguageByLangCode(langCode: string): Promise<Language>
    getLanguageById(id: string): Promise<Language>
    getAllLanguages(): Promise<Language[]>
    createLanguage(language: Language): Promise<Language>
}