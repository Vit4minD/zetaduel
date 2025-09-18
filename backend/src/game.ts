import { Server } from 'socket.io';
import { Player, Problem, GameState, GameResult } from './types';
import { ProblemGenerator } from './problemGenerator';

export class Game {
  private id: string;
  private players: Player[];
  private io: Server;
  private currentProblem: Problem | null = null;
  private timeRemaining: number = 120; // 2 minutes in seconds
  private isActive: boolean = false;
  private timer: NodeJS.Timeout | null = null;
  private problemGenerator: ProblemGenerator;
  private startTime: number = 0;
  private problemSequence: Problem[] = [];
  private playerProblemIndex: Map<string, number> = new Map();

  constructor(id: string, players: Player[], io: Server) {
    this.id = id;
    this.players = players;
    this.io = io;
    this.problemGenerator = new ProblemGenerator();

    // Reset player scores and initialize problem indices
    this.players.forEach(player => {
      player.score = 0;
      this.playerProblemIndex.set(player.id, 0);
    });

    // Generate a shared sequence of up to 120 problems for the entire game
    this.generateProblemSequence();
  }

  private generateProblemSequence(): void {
    this.problemSequence = [];
    for (let i = 0; i < 120; i++) {
      const problem = this.problemGenerator.generate();
      // Ensure answer is an integer for fastest comparison
      if (!Number.isInteger(problem.answer)) {
        console.warn(`Generated non-integer answer: ${problem.question} = ${problem.answer}`);
      }
      this.problemSequence.push(problem);
    }
    console.log(`Generated ${this.problemSequence.length} problems with pre-calculated answers`);
  }

  start(): void {
    this.isActive = true;
    this.startTime = Date.now();

    // Create room for this game
    this.players.forEach(player => {
      player.socket.join(this.id);
    });

    // Send game start event
    this.io.to(this.id).emit('gameStart', {
      gameId: this.id,
      players: this.players.map(p => ({ id: p.id, score: p.score })),
      timeRemaining: this.timeRemaining
    });

    // Generate first problem for each player
    this.players.forEach(player => {
      this.generateNewProblem(player);
    });

    console.log(`Game ${this.id}: Generated ${this.problemSequence.length} shared problems`);

    // Start game timer
    this.startTimer();

    console.log(`Game ${this.id} started with ${this.players.length} players`);
  }

  private startTimer(): void {
    this.timer = setInterval(() => {
      this.timeRemaining--;

      // Broadcast time update every second
      this.io.to(this.id).emit('timeUpdate', { timeRemaining: this.timeRemaining });

      // End game when time runs out
      if (this.timeRemaining <= 0) {
        this.endGame();
      }
    }, 1000);
  }

  private generateNewProblem(player: Player): void {
    const currentIndex = this.playerProblemIndex.get(player.id) || 0;
    
    // Check if we have more problems in the sequence
    if (currentIndex >= this.problemSequence.length) {
      // If we've exhausted the sequence, player has solved all problems
      console.log(`Player ${player.id} has completed all ${this.problemSequence.length} problems!`);
      return;
    }

    const problem = this.problemSequence[currentIndex];
    
    // Send the problem to this specific player
    player.socket.emit('newProblem', {
      question: problem.question,
      // Don't send the answer to the client!
    });

    // Store the problem temporarily to check answers
    player.currentProblem = problem;
    
    // Increment the problem index for this player
    this.playerProblemIndex.set(player.id, currentIndex + 1);

    // Removed logging during gameplay for maximum performance
  }

  submitAnswer(playerId: string, answer: number): void {
    if (!this.isActive) {
      return;
    }

    const player = this.players.find(p => p.id === playerId);
    if (!player) {
      return;
    }

    const currentProblem = player.currentProblem;
    if (!currentProblem) {
      return;
    }

    // Check if answer is correct (pre-calculated answer, so direct comparison)
    if (answer === currentProblem.answer) {
      // Correct answer
      player.score++;
      
      // Broadcast score update to all players in the game
      this.io.to(this.id).emit('scoreUpdate', {
        scores: this.players.map(p => ({ id: p.id, score: p.score }))
      });

      // Generate new problem for this player
      this.generateNewProblem(player);

      // Send feedback to the player
      player.socket.emit('answerResult', { correct: true });
    } else {
      // Incorrect answer
      player.socket.emit('answerResult', { correct: false });
    }
  }

  private endGame(): void {
    if (!this.isActive) {
      return;
    }

    this.isActive = false;
    
    // Clear timer
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    // Determine winner
    const maxScore = Math.max(...this.players.map(p => p.score));
    const winners = this.players.filter(p => p.score === maxScore);
    const winner = winners.length === 1 ? winners[0] : null;

    // Create game result
    const result: GameResult = {
      gameId: this.id,
      players: this.players.map(p => ({ id: p.id, score: p.score })),
      winner: winner?.id || null,
      duration: Math.floor((Date.now() - this.startTime) / 1000)
    };

    // Log final statistics
    console.log(`Game ${this.id} final stats:`);
    this.players.forEach(player => {
      const problemsSolved = this.playerProblemIndex.get(player.id) || 0;
      console.log(`  Player ${player.id}: ${player.score} correct, reached problem ${problemsSolved}`);
    });

    // Send game end event
    this.io.to(this.id).emit('gameEnd', result);

    // Remove players from room
    this.players.forEach(player => {
      player.socket.leave(this.id);
    });

    // Clear player problem indices
    this.playerProblemIndex.clear();

    console.log(`Game ${this.id} ended. Winner: ${winner?.id || 'Draw'}`);
  }

  handlePlayerDisconnect(playerId: string): void {
    if (!this.isActive) {
      return;
    }

    console.log(`Player ${playerId} disconnected from game ${this.id}`);
    
    // End the game immediately if a player disconnects
    // The remaining player wins by default
    const remainingPlayer = this.players.find(p => p.id !== playerId);
    if (remainingPlayer) {
      remainingPlayer.socket.emit('opponentDisconnected');
    }
    
    this.endGame();
  }

  getPlayers(): Player[] {
    return this.players;
  }

  getId(): string {
    return this.id;
  }
}
