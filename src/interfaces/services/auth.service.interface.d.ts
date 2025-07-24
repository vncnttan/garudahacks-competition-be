import { CreateUserRequestDto, LoginUserDto, LoginUserResponseDto } from "@/dtos/users.dto";
import { User } from "@/generated/prisma";

export interface IAuthService {
    signup(userData: CreateUserRequestDto): Promise<User>;
    login(userData: LoginUserDto): Promise<LoginUserResponseDto>;
    // logout(userData: User): Promise<User>;
    // createToken(user: User): TokenData;
  }