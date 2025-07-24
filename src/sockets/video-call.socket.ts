import { ISocket } from "@/interfaces/sockets.interface";
import { Server, Socket } from "socket.io";

interface RoomQueue {
  roomId: string;
  peerIds: string[];
}

export class VideoCallQueueManager implements ISocket {
  public io: Server;
  private roomQueues: Map<string, string[]> = new Map(); // roomId -> peerIds
  private peerIdToSocketId: Map<string, string> = new Map(); // peerId -> socketId

  constructor() {
    
  }

  public runIoServer(io: Server){
    this.io = io;
    this.initialize();
  }

  private initialize() {
    this.io.on("connection", (socket: Socket) => {
      socket.on("video-call/queue/join", (roomId: string, peerId: string) => {
        const queue = this.roomQueues.get(roomId) || [];
        queue.push(peerId);
        this.roomQueues.set(roomId, queue);
        this.peerIdToSocketId.set(peerId, socket.id);
        socket.join(roomId);
        

        // Only match if there are at least two users
        if (queue.length >= 2) {
          const firstPeerId = queue.shift()!;
          const secondPeerId = queue.shift()!;
          const firstSocketId = this.peerIdToSocketId.get(firstPeerId);
          const secondSocketId = this.peerIdToSocketId.get(secondPeerId);
          if (firstSocketId && secondSocketId) {
            // emit personally to both socket connection
            this.io.to(firstSocketId).emit("match-found", { peerId: secondPeerId });
            this.io.to(secondSocketId).emit("match-found", { peerId: firstPeerId });

            // remove from peerIdToSocketId
            this.peerIdToSocketId.delete(firstPeerId);
            this.peerIdToSocketId.delete(secondPeerId);
            // update the queue
            this.roomQueues.set(roomId, queue);
          }
        }
      });

      socket.on("video-call/queue/leave", (roomId: string, peerId: string) => {
        const queue = this.roomQueues.get(roomId) || [];
        const newQueue = queue.filter(id => id !== peerId);
        if (newQueue.length === 0) {
          this.roomQueues.delete(roomId);
        } else {
          this.roomQueues.set(roomId, newQueue);
        }
        this.peerIdToSocketId.delete(peerId);
        socket.leave(roomId);
        this.io.to(roomId).emit("user-disconnected", peerId);
      });
    });
  }
}