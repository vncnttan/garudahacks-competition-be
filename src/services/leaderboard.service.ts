import { ILeaderboardService } from "@/interfaces/services/leaderboard.service.interface";
import { BaseService } from "./base.service";
import { Leaderboard, User } from "@/generated/prisma";

export class LeaderboardService extends BaseService implements ILeaderboardService{
    constructor(){
        super()
    }
    async getLeaderboardByUserId(userId: string): Promise<Leaderboard> {
        const leaderboard = await this.prisma.leaderboard.findUnique({
            where : {
                userId : userId
            }
        })
        return leaderboard
    }
    async getLeaderboard(): Promise<(Leaderboard & { user: Pick<User, 'id' | 'username'> })[]> {
        const leaderboard = await this.prisma.leaderboard.findMany({
            orderBy: {
                points: "desc"
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true
                    }
                }
            }
        });
        return leaderboard;
    }
    createPointLeaderboard(userId: string): Promise<Leaderboard> {
        return this.prisma.leaderboard.create({
            data : {
                userId : userId,
                points : 0
            }
        })
    }

    
    async updatePointLeaderboard(userId: string, points: number): Promise<Leaderboard> {
        const leaderboard = await this.prisma.leaderboard.findUnique({
            where : {
                userId : userId
            }
        })
        if(!leaderboard){
            throw new Error("User not found in the leaderboard")
        }
        return this.prisma.leaderboard.update({
            where : {
                id : leaderboard.id
            },
            data : {
                points : leaderboard.points + points
            }
        })
    }
}   