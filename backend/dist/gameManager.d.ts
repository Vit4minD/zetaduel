import { Server, Socket } from 'socket.io';
export declare class GameManager {
    private io;
    private waitingPlayers;
    private activeGames;
    private playerGameMap;
    constructor(io: Server);
    addPlayerToQueue(socket: Socket): void;
    removePlayerFromQueue(playerId: string): void;
    private isPlayerInQueue;
    private tryMatchPlayers;
    handleAnswer(playerId: string, answer: number): void;
    handleDisconnect(playerId: string): void;
    onGameEnd(gameId: string): void;
    private cleanupGame;
    private generateGameId;
    getQueueSize(): number;
    getActiveGameCount(): number;
}
//# sourceMappingURL=gameManager.d.ts.map