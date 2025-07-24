import { ILeaderboardService } from "@/interfaces/services/leaderboard.service.interface";
import { BaseResponseBuilder } from "@/utils/ResponseBuilder";
import { NextFunction, Request, Response } from "express";

export class LeaderboardController{
    private _leaderboardService : ILeaderboardService
    constructor(leaderboardService : ILeaderboardService){
        this._leaderboardService = leaderboardService
    }

    public getLeaderboard = async (req : Request, res : Response, next : NextFunction) => {
        try {
            const leaderboard = await this._leaderboardService.getLeaderboard()
            res.status(200).json(
                new BaseResponseBuilder()
                    .withSuccess(true)
                    .withMessage("Leaderboard fetched successfully")
                    .withData(leaderboard)
                    .build()
            )
        } catch (error) {
            next(error)
        }
    }
}