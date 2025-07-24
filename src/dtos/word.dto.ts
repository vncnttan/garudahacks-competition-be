import { IsArray, IsString } from "class-validator";

export class WordRequestDto {
    @IsString()
    word: string;
    @IsString()
    definition: string;
    @IsString()
    example: string;
    @IsString()
    exampleTranslation: string;
    @IsArray()
    @IsString({ each: true })
    directTranslation: string[]
    @IsString()
    languageCode: string;
}

export class CreateWordRequestDto extends WordRequestDto {
    examplePronounciation: string;
    pronounciation: string;
    createdById: string;
}