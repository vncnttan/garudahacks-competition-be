import { IWordService } from "@/interfaces/services/word.service.interface";


export class WordController {
    private _wordService: IWordService;
    constructor(wordService: IWordService) {
        this._wordService = wordService;
    }

    public getTranslationList = async (req, res) => {
        try {
            const { languageSrc, languageDst, prompt } = req.query;

            if (!languageDst || !prompt) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required fields: languageSrc, languageDst, or prompt"
                });
            }

            const translations = await this._wordService.getTranslationList(languageSrc, languageDst, prompt);
            return res.status(200).json({
                success: true,
                data: translations
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}