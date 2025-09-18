'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Player } from '@/app/hooks/useGame';

interface GameScreenProps {
  players: Player[];
  currentPlayerId: string | null;
  currentProblem: string | null;
  timeRemaining: number;
  onSubmitAnswer: (answer: number) => void;
  answerFeedback: { correct: boolean } | null;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  players,
  currentPlayerId,
  currentProblem,
  timeRemaining,
  onSubmitAnswer,
  answerFeedback,
}) => {
  const [answer, setAnswer] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when component mounts or new problem appears
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentProblem]);

  // Clear answer input when feedback is received
  useEffect(() => {
    if (answerFeedback?.correct) {
      setAnswer('');
    }
  }, [answerFeedback]);

  // Auto-check answer when it looks complete (no need to press Enter)
  useEffect(() => {
    if (answer && answer.length > 0 && /^\d+$/.test(answer)) {
      const numericAnswer = parseInt(answer, 10);
      if (!isNaN(numericAnswer) && numericAnswer > 0) {
        // Very short delay to allow for multi-digit numbers
        const timeoutId = setTimeout(() => {
          if (answer === numericAnswer.toString()) { // Make sure answer hasn't changed
            onSubmitAnswer(numericAnswer);
          }
        }, 100);
        
        return () => clearTimeout(timeoutId);
      }
    }
  }, [answer, onSubmitAnswer]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow positive integers
    if (value === '' || /^\d+$/.test(value)) {
      setAnswer(value);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Properly identify current player and opponent
  const currentPlayer = players.find(p => p.id === currentPlayerId);
  const opponent = players.find(p => p.id !== currentPlayerId);

  return (
    <div className="min-h-screen bg-white font-mono p-8">
      {/* Simple Header */}
      <div className="text-center mb-12">
        <div className="text-2xl font-normal text-black mb-2">
          Time: {formatTime(timeRemaining)}
        </div>
        <div className="flex justify-center space-x-12 text-lg">
          <div>You: <span className="font-bold">{currentPlayer?.score || 0}</span></div>
          <div>Opponent: <span className="font-bold">{opponent?.score || 0}</span></div>
        </div>
      </div>

      {/* Problem Display - Very Simple */}
      <div className="text-center">
        <div className="mb-8">
          {/* Horizontal equation layout */}
          <div className="flex items-center justify-center space-x-4 text-6xl font-normal text-black mb-8">
            <span>{currentProblem || 'Loading...'}</span>
            <span>=</span>
            <input
              ref={inputRef}
              type="text"
              value={answer}
              onChange={handleInputChange}
              className="text-6xl font-normal text-center py-2 px-4 border-2 bg-white text-black w-32 border-gray-300 focus:outline-none focus:border-blue-500"
              autoComplete="off"
              autoFocus
              placeholder=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};
