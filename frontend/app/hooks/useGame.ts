'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSocket } from '@/app/contexts/SocketContext';

export interface Player {
  id: string;
  score: number;
}

export interface GameState {
  gameId: string | null;
  players: Player[];
  currentProblem: string | null;
  timeRemaining: number;
  isInQueue: boolean;
  isPlaying: boolean;
  gameResult: GameResult | null;
}

export interface GameResult {
  gameId: string;
  players: Player[];
  winner: string | null;
  duration: number;
}

export const useGame = () => {
  const { socket, isConnected } = useSocket();
  const [gameState, setGameState] = useState<GameState>({
    gameId: null,
    players: [],
    currentProblem: null,
    timeRemaining: 120,
    isInQueue: false,
    isPlaying: false,
    gameResult: null,
  });
  
  const [queuePosition, setQueuePosition] = useState<number | null>(null);
  const [answerFeedback, setAnswerFeedback] = useState<{ correct: boolean } | null>(null);

  // Join the matchmaking queue
  const joinQueue = useCallback(() => {
    if (socket && isConnected && !gameState.isInQueue && !gameState.isPlaying) {
      socket.emit('joinQueue');
      setGameState(prev => ({ ...prev, isInQueue: true, gameResult: null }));
    }
  }, [socket, isConnected, gameState.isInQueue, gameState.isPlaying]);

  // Leave the queue
  const leaveQueue = useCallback(() => {
    if (socket && gameState.isInQueue) {
      socket.emit('leaveQueue');
      setGameState(prev => ({ ...prev, isInQueue: false }));
      setQueuePosition(null);
    }
  }, [socket, gameState.isInQueue]);

  // Submit an answer
  const submitAnswer = useCallback((answer: number) => {
    if (socket && gameState.isPlaying) {
      socket.emit('submitAnswer', { answer });
    }
  }, [socket, gameState.isPlaying]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    // Queue events
    socket.on('queueJoined', (data) => {
      setQueuePosition(data.position);
    });

    // Game events
    socket.on('gameStart', (data) => {
      setGameState(prev => ({
        ...prev,
        gameId: data.gameId,
        players: data.players,
        timeRemaining: data.timeRemaining,
        isInQueue: false,
        isPlaying: true,
        gameResult: null,
      }));
      setQueuePosition(null);
    });

    socket.on('newProblem', (data) => {
      setGameState(prev => ({
        ...prev,
        currentProblem: data.question,
      }));
    });

    socket.on('scoreUpdate', (data) => {
      setGameState(prev => ({
        ...prev,
        players: data.scores,
      }));
    });

    socket.on('timeUpdate', (data) => {
      setGameState(prev => ({
        ...prev,
        timeRemaining: data.timeRemaining,
      }));
    });

    socket.on('answerResult', (data) => {
      setAnswerFeedback(data);
      // Clear feedback after 1 second
      setTimeout(() => setAnswerFeedback(null), 1000);
    });

    socket.on('gameEnd', (data) => {
      setGameState(prev => ({
        ...prev,
        isPlaying: false,
        gameResult: data,
      }));
    });

    socket.on('opponentDisconnected', () => {
      // Handle opponent disconnection
      setGameState(prev => ({
        ...prev,
        isPlaying: false,
      }));
    });

    socket.on('error', (data) => {
      console.error('Game error:', data.message);
    });

    // Cleanup listeners
    return () => {
      socket.off('queueJoined');
      socket.off('gameStart');
      socket.off('newProblem');
      socket.off('scoreUpdate');
      socket.off('timeUpdate');
      socket.off('answerResult');
      socket.off('gameEnd');
      socket.off('opponentDisconnected');
      socket.off('error');
    };
  }, [socket]);

  return {
    gameState,
    queuePosition,
    answerFeedback,
    joinQueue,
    leaveQueue,
    submitAnswer,
    isConnected,
  };
};
