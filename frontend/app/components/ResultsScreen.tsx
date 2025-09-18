'use client';

import React from 'react';
import { GameResult } from '@/app/hooks/useGame';

interface ResultsScreenProps {
  gameResult: GameResult;
  currentPlayerId?: string | null;
  onPlayAgain: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  gameResult,
  currentPlayerId,
  onPlayAgain,
}) => {
  // Properly identify current player and opponent
  const currentPlayer = gameResult.players.find(p => p.id === currentPlayerId) || gameResult.players[0];
  const opponent = gameResult.players.find(p => p.id !== currentPlayerId) || gameResult.players[1];
  const isWinner = gameResult.winner === currentPlayer?.id;
  const isDraw = gameResult.winner === null;

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center font-mono">
      <div className="text-center space-y-8 p-8">
        {/* Simple Result */}
        <div className="space-y-4">
          <h1 className="text-4xl font-normal text-black">
            {isDraw ? "Draw" : isWinner ? 'You Win' : 'You Lose'}
          </h1>
        </div>

        {/* Simple Score Display */}
        <div className="space-y-4">
          <div className="text-xl text-gray-700">
            Final Score
          </div>
          
          <div className="space-y-2 text-lg">
            <div>You: <span className="font-bold">{currentPlayer?.score || 0}</span></div>
            <div>Opponent: <span className="font-bold">{opponent?.score || 0}</span></div>
          </div>

          <div className="text-sm text-gray-500 mt-4">
            Game Duration: {formatDuration(gameResult.duration)}
          </div>
        </div>

        {/* Simple Action */}
        <div className="space-y-4">
          <button
            onClick={onPlayAgain}
            className="bg-gray-800 hover:bg-gray-700 text-white font-normal py-3 px-8 text-base border-none cursor-pointer"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};
