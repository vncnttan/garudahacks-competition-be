import { LeaderboardWithUser } from "@/dtos/leaderboards.dto";
import { Leaderboard, User } from "@/generated/prisma";



export interface ILeaderboardService{
    getLeaderboard() : Promise<(LeaderboardWithUser)[]>
    getLeaderboardByUserId(userId : string) : Promise<Leaderboard>
    createPointLeaderboard(userId : string) : Promise<Leaderboard>
    updatePointLeaderboard(userId : string, points : number) : Promise<Leaderboard>
}