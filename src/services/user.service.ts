import { PrismaClient, User } from "@/generated/prisma";
import { IUserService } from "@/interfaces/services/user.service.interface";
import { BaseService } from "./base.service";
import { LevelCalculator } from "@/utils/LevelCalculator";

export class UserService extends BaseService implements IUserService {
    constructor() {
        super();
    }

    async createUser(username: string, password: string): Promise<User> {
        const createUserData = await this.prisma.user.create({
            data: {
                username,
                password,
                experience: 0
            }
        });
        return createUserData;
    }

    async findUserByUsername(username: string): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where: {
                username
            }
        });
        return user;
    }

    async findUserById(
        userId: string, 
    ): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        return user;
    }

    async gainExperience(userId: string, experienceToAdd: number): Promise<{
        user: User;
        levelInfo: {
            currentLevel: number;
            currentLevelExp: number;
            nextLevelExp: number;
            expToNextLevel: number;
            totalExpForCurrentLevel: number;
        };
        leveledUp: boolean;
    }> {
        // Start a transaction
        return await this.prisma.$transaction(async (tx) => {
            // Get current user
            const user = await tx.user.findUnique({
                where: { id: userId }
            });

            if (!user) {
                throw new Error('User not found');
            }

            // Calculate old and new level info
            const oldLevelInfo = LevelCalculator.calculateLevel(user.experience);
            const newExperience = user.experience + experienceToAdd;
            const newLevelInfo = LevelCalculator.calculateLevel(newExperience);

            // Update user
            const updatedUser = await tx.user.update({
                where: { id: userId },
                data: {
                    experience: newExperience
                }
            });

            return {
                user: updatedUser,
                levelInfo: newLevelInfo,
                leveledUp: newLevelInfo.currentLevel > oldLevelInfo.currentLevel
            };
        });
    }
}