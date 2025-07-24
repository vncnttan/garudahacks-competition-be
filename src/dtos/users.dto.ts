import {  IsString, MinLength} from "class-validator";
import {  Leaderboard, User } from "@/generated/prisma";
import { LevelCalculator } from "@/utils/LevelCalculator";

/**
 * @swagger
 * components:
 *   schemas:
 *     UserLevel:
 *       type: object
 *       properties:
 *         currentLevel:
 *           type: number
 *           description: Current level of the user
 *           example: 2
 *         currentLevelExp:
 *           type: number
 *           description: Experience points in current level
 *           example: 250
 *         nextLevelExp:
 *           type: number
 *           description: Experience required for next level
 *           example: 1000
 *         expToNextLevel:
 *           type: number
 *           description: Experience points needed to reach next level
 *           example: 750
 *         totalExpForCurrentLevel:
 *           type: number
 *           description: Total experience accumulated
 *           example: 750
 */
export class UserLevel {
    currentLevel: number;
    currentLevelExp: number;
    nextLevelExp: number;
    expToNextLevel: number;
    totalExpForCurrentLevel: number;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateUserRequestDto:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - confirmPassword
 *       properties:
 *         username:
 *           type: string
 *           description: User's username
 *         password:
 *           type: string
 *           description: User's password (min 8 characters)
 *           minLength: 8
 *         confirmPassword:
 *           type: string
 *           description: Password confirmation
 */
export class CreateUserRequestDto {
    @IsString()
    public username: string;

    @IsString()
    @MinLength(8)
    public password: string;

    @IsString()
    public confirmPassword: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateUserResponseDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: User's unique identifier
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         username:
 *           type: string
 *           description: User's username
 *           example: "john_doe"
 *         points:
 *           type: number
 *           description: User's points
 *           example: 0
 *         experience:
 *           type: number
 *           description: User's total experience points
 *           example: 750
 *         level:
 *           $ref: '#/components/schemas/UserLevel'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Account creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Account last update timestamp
 */
export class CreateUserResponseDto {
  id: string;
  username: string;
  points: number;
  experience: number;
  level: UserLevel;
  createdAt: Date;
  updatedAt: Date;

  constructor(user: User, leaderboard: Leaderboard) {
    this.id = user.id;
    this.username = user.username;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.points = leaderboard.points;
    this.experience = user.experience;
    this.level = LevelCalculator.calculateLevel(user.experience);
  }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginUserDto:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: User's username
 *         password:
 *           type: string
 *           description: User's password (min 8 characters)
 *           minLength: 8
 */
export class LoginUserDto {
    @IsString()
    username: string;

    @IsString()
    @MinLength(8)
    password: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginUserResponseDto:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           description: JWT access token
 */
export class LoginUserResponseDto {
    accessToken: string;
}

