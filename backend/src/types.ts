import { Socket } from 'socket.io';

export interface Player {
  id: string;
  socket: Socket;
  score: number;
  isReady: boolean;
  currentProblem?: Problem;
}

export interface Problem {
  question: string;
  answer: number;
  operator: '+' | '-' | '*' | '/';
  operand1: number;
  operand2: number;
}

export interface GameState {
  id: string;
  players: Player[];
  currentProblem: Problem | null;
  timeRemaining: number;
  isActive: boolean;
  winner: Player | null;
}

export interface GameResult {
  gameId: string;
  players: {
    id: string;
    score: number;
  }[];
  winner: string | null;
  duration: number;
}
