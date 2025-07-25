import { RequestWithUser } from "@/interfaces/auth.interface";
import { IWordService } from "@/interfaces/services/word.service.interface";
import { BaseResponseBuilder } from "@/utils/ResponseBuilder";


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

    public getMoreWords = async (req, res) => {
        try {
            const { word } = req.params;
            const words = await this._wordService.getMoreWords(word);
            return res.status(200).json(new BaseResponseBuilder().withSuccess(true).withMessage(`Words fetched successfully`).withData(words));
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    public toogleLike = async (req: RequestWithUser, res) => {
        try {
            const { wordId} = req.body;

            const word = await this._wordService.toogleLike(wordId, req.user.id);
            return res.status(200).json(new BaseResponseBuilder().withSuccess(true).withMessage(`Word ${word.likedByIds.find((id) => id === req.user.id) ? 'liked' : 'unliked'} successfully`).withData(word));
            
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}