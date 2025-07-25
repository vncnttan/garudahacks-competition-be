import { Server } from "socket.io";

export interface ISocket {
    io : Server
    runIoServer(io: Server): void
}