import { Server, Socket } from 'socket.io';
import { Game } from './game';
import { Player } from './types';

export class GameManager {
  private io: Server;
  private waitingPlayers: Player[] = [];
  private activeGames: Map<string, Game> = new Map();
  private playerGameMap: Map<string, string> = new Map();

  constructor(io: Server) {
    this.io = io;
  }

  addPlayerToQueue(socket: Socket): void {
    // Check if player is already in queue or in a game
    if (this.isPlayerInQueue(socket.id) || this.playerGameMap.has(socket.id)) {
      socket.emit('error', { message: 'Already in queue or in game' });
      return;
    }

    const player: Player = {
      id: socket.id,
      socket: socket,
      score: 0,
      isReady: true
    };

    this.waitingPlayers.push(player);
    socket.emit('queueJoined', { position: this.waitingPlayers.length });

    console.log(`Player ${socket.id} joined queue. Queue size: ${this.waitingPlayers.length}`);

    // Try to match players
    this.tryMatchPlayers();
  }

  removePlayerFromQueue(playerId: string): void {
    const playerIndex = this.waitingPlayers.findIndex(p => p.id === playerId);
    if (playerIndex !== -1) {
      this.waitingPlayers.splice(playerIndex, 1);
      console.log(`Player ${playerId} left queue. Queue size: ${this.waitingPlayers.length}`);
    }
  }

  private isPlayerInQueue(playerId: string): boolean {
    return this.waitingPlayers.some(p => p.id === playerId);
  }

  private tryMatchPlayers(): void {
    if (this.waitingPlayers.length >= 2) {
      // Take first two players from queue
      const player1 = this.waitingPlayers.shift()!;
      const player2 = this.waitingPlayers.shift()!;

      // Create new game
      const gameId = this.generateGameId();
      const game = new Game(gameId, [player1, player2], this.io);

      // Store game references
      this.activeGames.set(gameId, game);
      this.playerGameMap.set(player1.id, gameId);
      this.playerGameMap.set(player2.id, gameId);

      // Start the game
      game.start();

      console.log(`Game ${gameId} created with players ${player1.id} and ${player2.id}`);
    }
  }

  handleAnswer(playerId: string, answer: number): void {
    const gameId = this.playerGameMap.get(playerId);
    if (!gameId) {
      console.log(`No active game found for player ${playerId}`);
      return;
    }

    const game = this.activeGames.get(gameId);
    if (!game) {
      console.log(`Game ${gameId} not found`);
      return;
    }

    game.submitAnswer(playerId, answer);
  }

  handleDisconnect(playerId: string): void {
    // Remove from queue if waiting
    this.removePlayerFromQueue(playerId);

    // Handle game disconnection
    const gameId = this.playerGameMap.get(playerId);
    if (gameId) {
      const game = this.activeGames.get(gameId);
      if (game) {
        game.handlePlayerDisconnect(playerId);
        this.cleanupGame(gameId);
      }
      this.playerGameMap.delete(playerId);
    }
  }

  onGameEnd(gameId: string): void {
    this.cleanupGame(gameId);
  }

  private cleanupGame(gameId: string): void {
    const game = this.activeGames.get(gameId);
    if (game) {
      // Remove player mappings
      game.getPlayers().forEach(player => {
        this.playerGameMap.delete(player.id);
      });
      
      // Remove game
      this.activeGames.delete(gameId);
      console.log(`Game ${gameId} cleaned up`);
    }
  }

  private generateGameId(): string {
    return `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Utility methods for monitoring
  getQueueSize(): number {
    return this.waitingPlayers.length;
  }

  getActiveGameCount(): number {
    return this.activeGames.size;
  }
}
