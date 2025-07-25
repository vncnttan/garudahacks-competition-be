import { Language } from "@/generated/prisma";
import { ILanguageService } from "@/interfaces/services/language.service.interface";
import { BaseService } from "./base.service";

export class LanguageService extends BaseService implements ILanguageService{
    async getLanguageByLangCode(langCode: string): Promise<Language> {
        const language = await this.prisma.language.findFirst({
            where: {
                languageCode: langCode
            }
        })
        return language
    }
    async getLanguageById(id: string): Promise<Language> {
        const language = await this.prisma.language.findFirst({
            where: {
                id: id
            }
        })
        return language
    }
    async getAllLanguages(): Promise<Language[]> {
        const languages = await this.prisma.language.findMany({
            orderBy: {
                languageCode: "asc"
            }
        })
        return languages
    }
    createLanguage(language: Language): Promise<Language> {
        throw new Error("Method not implemented.");
    }
}