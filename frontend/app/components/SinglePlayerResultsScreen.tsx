'use client';

import React from 'react';

interface SinglePlayerResultsScreenProps {
  score: number;
  duration: number;
  highScore: number;
  isNewHighScore: boolean;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
}

export const SinglePlayerResultsScreen: React.FC<SinglePlayerResultsScreenProps> = ({
  score,
  duration,
  highScore,
  isNewHighScore,
  onPlayAgain,
  onBackToMenu,
}) => {
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center font-mono">
      <div className="text-center space-y-8 p-8">
        {/* Result Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-normal text-black">
            Game Over
          </h1>
          {isNewHighScore && (
            <div className="text-xl text-green-600 font-bold">
              New High Score!
            </div>
          )}
        </div>

        {/* Score Display */}
        <div className="space-y-4">
          <div className="text-xl text-gray-700">
            Your Score
          </div>
          
          <div className="text-3xl font-bold text-black">
            {score}
          </div>

          <div className="text-sm text-gray-500 space-y-1">
            <div>Duration: {formatDuration(duration)}</div>
            <div>High Score: {highScore}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={onPlayAgain}
            className="bg-gray-800 hover:bg-gray-700 text-white font-normal py-3 px-8 text-base border-none cursor-pointer block w-full"
          >
            Play Again
          </button>
          <button
            onClick={onBackToMenu}
            className="bg-white border border-gray-400 text-gray-700 py-3 px-8 text-base hover:bg-gray-50 cursor-pointer block w-full"
          >
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
};
