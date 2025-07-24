import { UserLevel } from "@/dtos/users.dto";

export class LevelCalculator {
    private static BASE_EXP = 500; // Base experience needed for level 2
    private static MULTIPLIER = 2;  // Experience multiplier for each level

    /**
     * Calculate current level based on total experience
     * Using geometric progression formula: a(r^(n-1))
     * Where:
     * a = BASE_EXP (500)
     * r = MULTIPLIER (2)
     * n = level number
     */
    static calculateLevel(experience: number): UserLevel {
        if (experience < this.BASE_EXP) {
            return {
                currentLevel: 1,
                currentLevelExp: experience,
                nextLevelExp: this.BASE_EXP,
                expToNextLevel: this.BASE_EXP - experience,
                totalExpForCurrentLevel: experience
            };
        }

        // Calculate level using logarithm
        // If exp = BASE_EXP * MULTIPLIER^(n-1)
        // Then n = log(exp/BASE_EXP)/log(MULTIPLIER) + 1
        const level = Math.floor(Math.log(experience / this.BASE_EXP) / Math.log(this.MULTIPLIER) + 2);
        
        // Calculate experience required for current level
        const totalExpForCurrentLevel = this.BASE_EXP * Math.pow(this.MULTIPLIER, level - 2);
        
        // Calculate experience required for next level
        const nextLevelExp = this.BASE_EXP * Math.pow(this.MULTIPLIER, level - 1);

        return {
            currentLevel: level,
            currentLevelExp: experience - totalExpForCurrentLevel,
            nextLevelExp: nextLevelExp,
            expToNextLevel: nextLevelExp - experience,
            totalExpForCurrentLevel: experience
        };
    }

    /**
     * Get experience required for a specific level
     */
    static getRequiredExperience(level: number): number {
        if (level <= 1) return 0;
        return this.BASE_EXP * Math.pow(this.MULTIPLIER, level - 2);
    }

    /**
     * Get a preview of level thresholds
     */
    static getLevelThresholds(maxLevel: number = 10): Array<{ level: number; requiredExp: number }> {
        return Array.from({ length: maxLevel }, (_, i) => ({
            level: i + 1,
            requiredExp: this.getRequiredExperience(i + 1)
        }));
    }
} 