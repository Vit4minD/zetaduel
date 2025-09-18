'use client';

import React, { useState } from 'react';
import { useGame } from '@/app/hooks/useGame';
import { useSinglePlayerGame } from '@/app/hooks/useSinglePlayerGame';
import { LobbyScreen } from '@/app/components/LobbyScreen';
import { GameScreen } from '@/app/components/GameScreen';
import { ResultsScreen } from '@/app/components/ResultsScreen';
import { SinglePlayerGameScreen } from '@/app/components/SinglePlayerGameScreen';
import { SinglePlayerResultsScreen } from '@/app/components/SinglePlayerResultsScreen';

type GameMode = 'lobby' | 'multiplayer' | 'singleplayer';

export default function Home() {
  const [gameMode, setGameMode] = useState<GameMode>('lobby');
  
  // Multiplayer game hook
  const {
    gameState: multiplayerGameState,
    queuePosition,
    answerFeedback: multiplayerAnswerFeedback,
    joinQueue,
    leaveQueue,
    submitAnswer: submitMultiplayerAnswer,
    isConnected,
  } = useGame();

  // Single player game hook
  const {
    gameState: singlePlayerGameState,
    highScore,
    startGame: startSinglePlayerGame,
    submitAnswer: submitSinglePlayerAnswer,
    resetGame: resetSinglePlayerGame,
  } = useSinglePlayerGame();

  // Handle starting single player
  const handleStartSinglePlayer = () => {
    setGameMode('singleplayer');
    startSinglePlayerGame();
  };

  // Handle going back to lobby
  const handleBackToLobby = () => {
    setGameMode('lobby');
    resetSinglePlayerGame();
  };

  // Handle starting multiplayer
  const handleJoinQueue = () => {
    setGameMode('multiplayer');
    joinQueue();
  };

  // Handle leaving multiplayer queue
  const handleLeaveQueue = () => {
    setGameMode('lobby');
    leaveQueue();
  };

  // Single player results
  if (gameMode === 'singleplayer' && singlePlayerGameState.gameResult) {
  return (
      <SinglePlayerResultsScreen
        score={singlePlayerGameState.gameResult.score}
        duration={singlePlayerGameState.gameResult.duration}
        highScore={highScore}
        isNewHighScore={singlePlayerGameState.gameResult.score === highScore}
        onPlayAgain={startSinglePlayerGame}
        onBackToMenu={handleBackToLobby}
      />
    );
  }

  // Single player game
  if (gameMode === 'singleplayer' && singlePlayerGameState.isPlaying) {
    return (
      <SinglePlayerGameScreen
        gameState={singlePlayerGameState}
        onSubmitAnswer={submitSinglePlayerAnswer}
      />
    );
  }

  // Multiplayer results
  if (gameMode === 'multiplayer' && multiplayerGameState.gameResult) {
    return (
      <ResultsScreen
        gameResult={multiplayerGameState.gameResult}
        currentPlayerId={multiplayerGameState.currentPlayerId}
        onPlayAgain={handleJoinQueue}
      />
    );
  }

  // Multiplayer game
  if (gameMode === 'multiplayer' && multiplayerGameState.isPlaying && multiplayerGameState.currentProblem) {
    return (
      <GameScreen
        players={multiplayerGameState.players}
        currentPlayerId={multiplayerGameState.currentPlayerId}
        currentProblem={multiplayerGameState.currentProblem}
        timeRemaining={multiplayerGameState.timeRemaining}
        onSubmitAnswer={submitMultiplayerAnswer}
        answerFeedback={multiplayerAnswerFeedback}
      />
    );
  }

  // Show lobby screen by default
  return (
    <LobbyScreen
      isConnected={isConnected}
      isInQueue={multiplayerGameState.isInQueue}
      queuePosition={queuePosition}
      highScore={highScore}
      onJoinQueue={handleJoinQueue}
      onLeaveQueue={handleLeaveQueue}
      onStartSinglePlayer={handleStartSinglePlayer}
    />
  );
}