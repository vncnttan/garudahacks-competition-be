import { User } from "@/generated/prisma";

export type UserWithoutPassword = Omit<User, 'password'>;

export interface IUserService {
    findUserById(userId: string): Promise<User>;
    findUserByUsername(username: string): Promise<User>;
    createUser(username: string, password: string): Promise<User>;
}