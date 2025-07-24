import { User } from "@/generated/prisma";
import { Request } from "express";

export interface RequestWithUser extends Request {
    user: User;
}