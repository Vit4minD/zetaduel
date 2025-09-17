'use client';

import React from 'react';

interface LobbyScreenProps {
  isConnected: boolean;
  isInQueue: boolean;
  queuePosition: number | null;
  highScore: number;
  onJoinQueue: () => void;
  onLeaveQueue: () => void;
  onStartSinglePlayer: () => void;
}

export const LobbyScreen: React.FC<LobbyScreenProps> = ({
  isConnected,
  isInQueue,
  queuePosition,
  highScore,
  onJoinQueue,
  onLeaveQueue,
  onStartSinglePlayer,
}) => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center font-mono relative">
      {/* High Score Display */}
      <div className="absolute top-4 right-4 text-sm text-gray-600">
        High Score: <span className="font-bold">{highScore}</span>
      </div>

      <div className="text-center space-y-8 p-8">
        {/* Simple Title */}
        <div className="space-y-2">
          <h1 className="text-4xl font-normal text-black">
            ZetaDuel
          </h1>
          <p className="text-base text-gray-600">
            Arithmetic Game
          </p>
        </div>

        {/* Connection Status */}
        <div className="text-sm text-gray-500">
          {isConnected ? 'Connected' : 'Connecting...'}
        </div>

        {/* Main Action */}
        <div className="space-y-4">
          {!isInQueue ? (
            <div className="space-y-3">
              <button
                onClick={onJoinQueue}
                disabled={!isConnected}
                className="bg-gray-800 hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-normal py-3 px-8 text-base border-none cursor-pointer block w-full"
              >
                {isConnected ? 'Queue' : 'Connecting...'}
              </button>
              <button
                onClick={onStartSinglePlayer}
                className="bg-white border border-gray-400 text-gray-700 py-3 px-8 text-base hover:bg-gray-50 cursor-pointer block w-full"
              >
                Single Player
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-gray-600">
                Waiting for opponent...
                {queuePosition && ` (Position: ${queuePosition})`}
              </div>
              <button
                onClick={onLeaveQueue}
                className="bg-white border border-gray-400 text-gray-700 py-2 px-6 text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Simple Instructions */}
        <div className="text-sm text-gray-500 max-w-md">
          <p>Solve arithmetic problems as quickly as possible.</p>
          <p>2 minutes per game.</p>
        </div>
      </div>
    </div>
  );
};
