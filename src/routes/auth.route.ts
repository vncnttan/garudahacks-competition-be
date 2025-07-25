import { Router } from "express";
import { Routes } from "../interfaces/routes.interface";
import { AuthController } from "../controllers/auth.controller";
import { IAuthService } from "@/interfaces/services/auth.service.interface";
import validationMiddleware from "@/middlewares/validation.middleware";
import { CreateUserRequestDto, LoginUserDto } from "../dtos/users.dto";
import authMiddleware from "@/middlewares/auth.middleware";
import { ILeaderboardService } from "@/interfaces/services/leaderboard.service.interface";

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication endpoints
 */

/**
 * @swagger
 * /api/v1/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequestDto'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/BaseResponseSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/CreateUserResponseDto'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseResponseError'
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUserDto'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/BaseResponseSuccess'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/LoginUserResponseDto'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseResponseError'
 */

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     summary: Get current user profile
 *     description: Returns the authenticated user's profile including level information
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/BaseResponseSuccess'
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "User info fetched successfully"
 *                     data:
 *                       $ref: '#/components/schemas/CreateUserResponseDto'
 *                       example:
 *                         id: "123e4567-e89b-12d3-a456-426614174000"
 *                         username: "john_doe"
 *                         points: 100
 *                         experience: 750
 *                         level:
 *                           currentLevel: 2
 *                           currentLevelExp: 250
 *                           nextLevelExp: 1000
 *                           expToNextLevel: 250
 *                           totalExpForCurrentLevel: 750
 *                         createdAt: "2024-03-19T12:00:00Z"
 *                         updatedAt: "2024-03-19T12:00:00Z"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseResponseError'
 */

class AuthRoute implements Routes{
    public path = "/auth";
    public router = Router();
    public authController : AuthController

    constructor(authService : IAuthService, leaderboardService : ILeaderboardService){
        this.authController = new AuthController(authService, leaderboardService)
        this.initializeRoutes();
    }

    private initializeRoutes(){
        this.router.post(`${this.path}/signup`, validationMiddleware(CreateUserRequestDto, "body"), this.authController.signup);
        this.router.post(`${this.path}/login`, validationMiddleware(LoginUserDto, "body"), this.authController.login);
        this.router.get(`${this.path}/me`, authMiddleware, this.authController.me);
    }
}

export default AuthRoute;