import { PrismaClient } from "@/generated/prisma"

export class BaseService {
    public prisma : PrismaClient

    constructor(){
        this.prisma = new PrismaClient()
    }
}