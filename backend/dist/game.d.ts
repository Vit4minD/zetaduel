import { Server } from 'socket.io';
import { Player } from './types';
export declare class Game {
    private id;
    private players;
    private io;
    private currentProblem;
    private timeRemaining;
    private isActive;
    private timer;
    private problemGenerator;
    private startTime;
    private problemSequence;
    private playerProblemIndex;
    constructor(id: string, players: Player[], io: Server);
    private generateProblemSequence;
    start(): void;
    private startTimer;
    private generateNewProblem;
    submitAnswer(playerId: string, answer: number): void;
    private endGame;
    handlePlayerDisconnect(playerId: string): void;
    getPlayers(): Player[];
    getId(): string;
}
//# sourceMappingURL=game.d.ts.map