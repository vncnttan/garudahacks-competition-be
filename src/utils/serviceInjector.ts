import { IAuthService } from "@/interfaces/services/auth.service.interface";
import { ILanguageService } from "@/interfaces/services/language.service.interface";
import { ILeaderboardService } from "@/interfaces/services/leaderboard.service.interface";
import { IUserService } from "@/interfaces/services/user.service.interface";
import { IWordService } from "@/interfaces/services/word.service.interface";
import { AuthService } from "@/services/auth.service";
import { LanguageService } from "@/services/language.service";
import { LeaderboardService } from "@/services/leaderboard.service";
import { UserService } from "@/services/user.service";
import { WordService } from "@/services/word.service";

class ServiceInjector {

    public userService : IUserService
    public leaderboardService : ILeaderboardService
    public wordService : IWordService
    public languageService : ILanguageService
    public authService : IAuthService

    constructor(){
        this.userService = new UserService()
        this.leaderboardService = new LeaderboardService()
        this.languageService = new LanguageService()
        this.wordService = new WordService(this.languageService)
        this.authService = new AuthService(this.userService, this.leaderboardService)
    }

}

export const serviceInjector = new ServiceInjector()