import { Router } from "express";
import { Routes } from "@/interfaces/routes.interface";
import { LeaderboardController } from "../controllers/leaderboard.controller";
import { ILeaderboardService } from "@/interfaces/services/leaderboard.service.interface";
import authMiddleware from "@/middlewares/auth.middleware";

/**
 * @swagger
 * components:
 *   schemas:
 *     LeaderboardUser:
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
 * 
 *     LeaderboardEntry:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Leaderboard entry unique identifier
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         points:
 *           type: number
 *           description: User's points in the leaderboard
 *           example: 1000
 *         userId:
 *           type: string
 *           description: ID of the user this entry belongs to
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         user:
 *           $ref: '#/components/schemas/LeaderboardUser'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the entry was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the entry was last updated
 */

/**
 * @swagger
 * tags:
 *   name: Leaderboard
 *   description: Leaderboard management endpoints
 */

/**
 * @swagger
 * /api/v1/leaderboard:
 *   get:
 *     summary: Get global leaderboard
 *     description: Retrieves the leaderboard sorted by points in descending order
 *     tags: [Leaderboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Leaderboard retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/BaseResponseSuccess'
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Leaderboard fetched successfully"
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/LeaderboardEntry'
 *                       example:
 *                         - id: "123e4567-e89b-12d3-a456-426614174000"
 *                           points: 1000
 *                           userId: "123e4567-e89b-12d3-a456-426614174000"
 *                           user:
 *                             id: "123e4567-e89b-12d3-a456-426614174000"
 *                             username: "john_doe"
 *                           createdAt: "2024-03-19T12:00:00Z"
 *                           updatedAt: "2024-03-19T12:00:00Z"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseResponseError'
 */

export class LeaderboardRoute implements Routes {
    public path = "/leaderboard";
    public router = Router();
    public leaderboardController: LeaderboardController;

    constructor(leaderboardService: ILeaderboardService) {
        this.leaderboardController = new LeaderboardController(leaderboardService);
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(
            `${this.path}`,
            authMiddleware,
            this.leaderboardController.getLeaderboard
        );
    }
}