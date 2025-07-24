import { HttpException } from '@/exceptions/HttpException';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { RequestHandler } from 'express';
import { WordRequestDto } from '@/dtos/word.dto';

export const wordValidationMiddleware: RequestHandler = async (req, res, next) => {
    try {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        
        // First check if files exist
        const pronunciationPath = files?.pronunciation?.[0]?.filename;
        const examplePronunciationPath = files?.examplePronunciation?.[0]?.filename;

        if (!pronunciationPath || !examplePronunciationPath) {
            throw new HttpException(400, 'Missing required audio files');
        }

        // Add file paths to body before validation
        const dataToValidate = {
            ...req.body,
            pronounciation: pronunciationPath,
            examplePronounciation: examplePronunciationPath
        };

        const dto = plainToInstance(WordRequestDto, dataToValidate);
        const errors = await validate(dto);

        if (errors.length > 0) {
            const messages = errors
                .map(error => Object.values(error.constraints || {}))
                .flat()
                .join(', ');
            throw new HttpException(400, messages);
        }

        // Update req.body with validated data including file paths
        req.body = dataToValidate;
        next();
    } catch (error) {
        next(error);
    }
}; 