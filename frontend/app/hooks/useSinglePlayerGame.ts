'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { analytics } from '@/app/utils/analytics';

interface Problem {
  question: string;
  answer: number;
}

export interface SinglePlayerGameState {
  isPlaying: boolean;
  currentProblem: Problem | null;
  score: number;
  timeRemaining: number;
  gameResult: { score: number; duration: number } | null;
  problemIndex: number;
}

export const useSinglePlayerGame = () => {
  const [highScore, setHighScore] = useLocalStorage<number>('zetaduel-highscore', 0);
  const [gameState, setGameState] = useState<SinglePlayerGameState>({
    isPlaying: false,
    currentProblem: null,
    score: 0,
    timeRemaining: 120,
    gameResult: null,
    problemIndex: 0,
  });

  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [problemSequence, setProblemSequence] = useState<Problem[]>([]);

  // Generate a single random problem
  const generateSingleProblem = useCallback((): Problem => {
    const operators = ['+', '-', '*', '/'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    
    let operand1: number, operand2: number, answer: number;

    switch (operator) {
      case '+':
        // Addition: (2 to 100) + (2 to 100)
        operand1 = Math.floor(Math.random() * 99) + 2;
        operand2 = Math.floor(Math.random() * 99) + 2;
        answer = operand1 + operand2;
        break;

      case '-':
        // Subtraction: Addition problems in reverse
        operand1 = Math.floor(Math.random() * 99) + 2;
        operand2 = Math.floor(Math.random() * 99) + 2;
        answer = operand1;
        operand1 = operand1 + operand2; // Make sure result is positive
        break;

      case '*':
        // Multiplication: (2 to 12) × (2 to 100)
        operand1 = Math.floor(Math.random() * 11) + 2;
        operand2 = Math.floor(Math.random() * 99) + 2;
        answer = operand1 * operand2;
        break;

      case '/':
        // Division: Multiplication problems in reverse
        operand1 = Math.floor(Math.random() * 11) + 2;
        operand2 = Math.floor(Math.random() * 99) + 2;
        answer = operand1;
        operand1 = operand1 * operand2; // dividend = quotient * divisor
        break;

      default:
        operand1 = 2;
        operand2 = 2;
        answer = 4;
    }

    // Use proper mathematical symbols
    let displayOperator = operator;
    if (operator === '*') {
      displayOperator = '×';
    } else if (operator === '/') {
      displayOperator = '÷';
    }

    const question = `${operand1} ${displayOperator} ${operand2}`;
    return { question, answer };
  }, []);

  // Generate a sequence of 120 problems with pre-calculated answers
  const generateProblemSequence = useCallback((): Problem[] => {
    const sequence: Problem[] = [];
    for (let i = 0; i < 120; i++) {
      sequence.push(generateSingleProblem());
    }
    console.log(`Generated ${sequence.length} problems with pre-calculated answers for single player`);
    return sequence;
  }, [generateSingleProblem]);

  const startGame = useCallback(() => {
    // Generate the complete problem sequence at game start
    const sequence = generateProblemSequence();
    setProblemSequence(sequence);
    
    const firstProblem = sequence[0];
    setGameState({
      isPlaying: true,
      currentProblem: firstProblem,
      score: 0,
      timeRemaining: 120,
      gameResult: null,
      problemIndex: 0,
    });

    // Track game start
    analytics.gameStarted('single');

    // Start timer
    const newTimer = setInterval(() => {
      setGameState(prev => {
        const newTime = prev.timeRemaining - 1;
        if (newTime <= 0) {
          // End game
          const duration = 120 - newTime;
          const result = { score: prev.score, duration };
          
          // Update high score if needed
          const isNewHighScore = prev.score > highScore;
          if (isNewHighScore) {
            setHighScore(prev.score);
            analytics.highScoreAchieved(prev.score, highScore);
          }

          // Track game completion
          analytics.gameCompleted('single', prev.score, duration);

          return {
            ...prev,
            timeRemaining: 0,
            isPlaying: false,
            gameResult: result,
          };
        }
        return { ...prev, timeRemaining: newTime };
      });
    }, 1000);

    setTimer(newTimer);
  }, [generateProblemSequence, highScore, setHighScore]);

  const submitAnswer = useCallback((answer: number) => {
    if (!gameState.isPlaying || !gameState.currentProblem) return { correct: false };

    // Direct comparison for pre-calculated integer answers (much faster)
    const isCorrect = answer === gameState.currentProblem.answer;
    
    // Track problem solving
    analytics.problemSolved(isCorrect);
    
    if (isCorrect) {
      // Get next problem from pre-generated sequence
      const nextIndex = gameState.problemIndex + 1;
      const nextProblem = nextIndex < problemSequence.length ? problemSequence[nextIndex] : null;
      
      setGameState(prev => ({
        ...prev,
        currentProblem: nextProblem,
        score: prev.score + 1,
        problemIndex: nextIndex,
      }));
    }

    return { correct: isCorrect };
  }, [gameState.isPlaying, gameState.currentProblem, gameState.problemIndex, problemSequence]);

  const resetGame = useCallback(() => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
    setGameState({
      isPlaying: false,
      currentProblem: null,
      score: 0,
      timeRemaining: 120,
      gameResult: null,
      problemIndex: 0,
    });
    setProblemSequence([]);
  }, [timer]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [timer]);

  return {
    gameState,
    highScore,
    startGame,
    submitAnswer,
    resetGame,
  };
};
