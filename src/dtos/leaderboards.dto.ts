import { Leaderboard, User } from "@/generated/prisma";


export interface LeaderboardWithUser extends Leaderboard {
    user : LeaderboardUser
}

export type LeaderboardUser = Pick<User, 'id' | 'username'>;
