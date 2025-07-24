import { CreateUserRequestDto, CreateUserResponseDto, LoginUserDto, LoginUserResponseDto } from "@/dtos/users.dto"
import { HttpException } from "@/exceptions/HttpException"
import { PrismaClient, User } from "@/generated/prisma"
import { RequestWithUser } from "@/interfaces/auth.interface"
import { IAuthService } from "@/interfaces/services/auth.service.interface"
import { ILeaderboardService } from "@/interfaces/services/leaderboard.service.interface"
import { BaseResponseBuilder } from "@/utils/ResponseBuilder"
import { NextFunction, Request, Response } from "express"


export class AuthController{
    public authService : IAuthService
    public leaderboardService : ILeaderboardService
    constructor(authService : IAuthService, leaderboardService : ILeaderboardService){
        this.authService = authService
        this.leaderboardService = leaderboardService
    }


    public me = async (req : RequestWithUser, res : Response, next : NextFunction) => {
        try {
            const user = req.user
            const pointUser = await this.leaderboardService.getLeaderboardByUserId(user.id)
            res.status(200).json(new BaseResponseBuilder()
                .withSuccess(true)
                .withMessage("User info fetched successfully")
                .withData(new CreateUserResponseDto(user, pointUser)).build()
            )
        } catch (error) {
            next(error)
        }
    }
    

    public login = async (req : Request, res : Response, next : NextFunction) => {
        try {
            const userData : LoginUserDto = req.body
            const loginUserData : LoginUserResponseDto = await this.authService.login(userData)
            res.status(200).json(new BaseResponseBuilder()
            .withSuccess(true)
            .withMessage("Login successful")
            .withData(
                loginUserData
            )
            .build())
        } catch (error) {
            next(error)
        }
    }

    public signup = async (req : Request, res : Response, next : NextFunction) => {
        try {
            const userData : CreateUserRequestDto = req.body

            if(userData.password !== userData.confirmPassword){
                next(new HttpException(400, "Password and confirm password do not match"))
                return
            }

            const signUpUserData : User = await this.authService.signup(userData)

            const pointUser = await this.leaderboardService.getLeaderboardByUserId(signUpUserData.id)

            res.status(201).json(new BaseResponseBuilder()
            .withSuccess(true)
            .withMessage("User created successfully")
            .withData(
                new CreateUserResponseDto(signUpUserData, pointUser)
            )
            .build())
        } catch (error) {
            next(error)
        }
    }

}