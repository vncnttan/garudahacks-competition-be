import { Word } from "@/generated/prisma";
import { IWordService } from "@/interfaces/services/word.service.interface";
import { ISocket } from "@/interfaces/sockets.interface";
import { Server, Socket } from "socket.io";

export class WordleSocketManager implements ISocket{
    public io: Server;
    private roomWord: Map<string, Word> = new Map(); // Store the word for each room
    private _wordService: IWordService;
    
    constructor(wordService: IWordService){
        this._wordService = wordService;
    }

    public runIoServer(io: Server){
        this.io = io;
        this.initialize();
        return this;
    }

    private getRoomId(userId1: string, userId2: string){
        const sortedIds = [userId1, userId2].sort();
        return `${sortedIds[0]}-${sortedIds[1]}`;
    }

    private initialize(){
        this.io.on("connection", (socket: Socket) => {
            socket.on("wordle/join", async (userId1: string, userId2: string, culturalId : string) => {
                const roomId = this.getRoomId(userId1, userId2);
                socket.join(roomId);


                if(this.roomWord.has(roomId)){
                    this.io.to(roomId).emit("wordle/word", { roomId, wordLength : this.roomWord.get(roomId)?.word.length });
                    return;
                }

                try {
                    const word = await this._wordService.getRandomWord(culturalId);
                    this.roomWord.set(roomId, word); // Save the full Word object in memory
                    console.log(word);
                    this.io.to(roomId).emit("wordle/word", { roomId,  wordLength : word.word.length });
                } catch (error) {
                    socket.emit("wordle/error", { message: error.message || "Failed to fetch word" });
                }
            });

            

            socket.on("wordle/leave", (roomId: string) => {
                
                socket.leave(roomId);
                socket.to(roomId).emit("wordle/leave", { roomId });
            });

            socket.on("wordle/guess", (userId1: string, userId2: string, guess: string) => {
                const roomId = this.getRoomId(userId1, userId2);
                const correctWord = this.roomWord.get(roomId);
                if (!correctWord) {
                    socket.emit("wordle/error", { message: "No word found for this room." });
                    return;
                }
                const answer = correctWord.word.trim().toLowerCase();
                const guessWord = guess.trim().toLowerCase();
                const result = [];
                const answerArr = answer.split("");
                const guessArr = guessWord.split("");
                const used = Array(answerArr.length).fill(false);

                // First pass: correct position
                for (let i = 0; i < guessArr.length; i++) {
                    if (guessArr[i] === answerArr[i]) {
                        result.push({ letter: guessArr[i], status: "correct" });
                        used[i] = true;
                    } else {
                        result.push(null); // placeholder
                    }
                }
                // Second pass: present but wrong position
                for (let i = 0; i < guessArr.length; i++) {
                    if (result[i]) continue; // already marked correct
                    const idx = answerArr.findIndex((ch, j) => ch === guessArr[i] && !used[j]);
                    if (idx !== -1) {
                        result[i] = { letter: guessArr[i], status: "present" };
                        used[idx] = true;
                    } else {
                        result[i] = { letter: guessArr[i], status: "absent" };
                    }
                }
                this.io.to(roomId).emit("wordle/guess/result", { roomId, guess, result });

                // If all letters are correct, broadcast win
                if (result.every(r => r && r.status === "correct")) {
                    this.io.to(roomId).emit("wordle/win", { roomId, winner: userId1, word: this.roomWord.get(roomId)?.word });
                }
            });

        });
    }
}