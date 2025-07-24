import { JWT_SECRET } from "@/config";
import { CreateUserRequestDto, LoginUserDto, LoginUserResponseDto } from "@/dtos/users.dto";
import { HttpException } from "@/exceptions/HttpException";
import { PrismaClient, User } from "@/generated/prisma";
import { IAuthService } from "@/interfaces/services/auth.service.interface";
import { compare, hash } from "bcrypt";
import { isEmpty } from "class-validator";
import { sign } from "jsonwebtoken";
import { BaseService } from "./base.service";
import { UserService } from "./user.service";
import { IUserService } from "@/interfaces/services/user.service.interface";
import { ILeaderboardService } from "@/interfaces/services/leaderboard.service.interface";

export class AuthService extends BaseService implements IAuthService{
    private _userService : IUserService
    private _leaderboardService : ILeaderboardService
    constructor(userService : IUserService, leaderboardService : ILeaderboardService){
        super()
        this._userService = userService
        this._leaderboardService = leaderboardService
    }

    async login(req: LoginUserDto): Promise<LoginUserResponseDto> {
        const { username, password } = req

        const user = await this._userService.findUserByUsername(username)

        if(!user) throw new HttpException(404, "Invalid username or password")

        const isPasswordValid = await compare(password, user.password)
        if(!isPasswordValid) throw new HttpException(404, "Invalid username or password")

        const token = sign({ id: user.id }, JWT_SECRET as string, { expiresIn: '12h' })

        return { accessToken: token }
    }


    async signup(userData: CreateUserRequestDto): Promise<User> {
        if(isEmpty(userData)) throw new HttpException(400, "Invalid request body")
            

        const user = await this._userService.findUserByUsername(userData.username)

        if(user) throw new HttpException(409, `This username ${userData.username} already exists`)

        const hashedPassword = await hash(userData.password, 10)

        const createUserData : User = await this._userService.createUser(userData.username, hashedPassword)

        await this._leaderboardService.createPointLeaderboard(createUserData.id)        

        return createUserData
    }
}