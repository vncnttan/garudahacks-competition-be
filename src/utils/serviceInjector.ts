import { IAuthService } from "@/interfaces/services/auth.service.interface";
import { ILeaderboardService } from "@/interfaces/services/leaderboard.service.interface";
import { IUserService } from "@/interfaces/services/user.service.interface";
import { AuthService } from "@/services/auth.service";
import { LeaderboardService } from "@/services/leaderboard.service";
import { UserService } from "@/services/user.service";

class ServiceInjector {

    public userService : IUserService
    public leaderboardService : ILeaderboardService
    public authService : IAuthService

    constructor(){
        this.userService = new UserService()
        this.leaderboardService = new LeaderboardService()
        this.authService = new AuthService(this.userService, this.leaderboardService)
    }

}

export const serviceInjector = new ServiceInjector()