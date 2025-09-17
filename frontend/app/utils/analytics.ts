import { track } from '@vercel/analytics';

// Custom analytics events for ZetaDuel
export const analytics = {
  // Game events
  gameStarted: (mode: 'single' | 'multiplayer') => {
    track('game_started', { mode });
  },

  gameCompleted: (mode: 'single' | 'multiplayer', score: number, duration: number) => {
    track('game_completed', { 
      mode, 
      score, 
      duration,
      problems_per_minute: Math.round((score / duration) * 60)
    });
  },

  queueJoined: () => {
    track('queue_joined');
  },

  queueLeft: () => {
    track('queue_left');
  },

  // Performance events
  problemSolved: (correct: boolean, timeToSolve?: number) => {
    track('problem_solved', { 
      correct, 
      time_to_solve: timeToSolve 
    });
  },

  highScoreAchieved: (score: number, previousHighScore: number) => {
    track('high_score_achieved', { 
      new_score: score, 
      previous_high_score: previousHighScore,
      improvement: score - previousHighScore
    });
  },

  // User engagement
  playAgainClicked: (fromMode: 'single' | 'multiplayer') => {
    track('play_again_clicked', { from_mode: fromMode });
  },

  modeSwitch: (from: 'single' | 'multiplayer', to: 'single' | 'multiplayer') => {
    track('mode_switch', { from, to });
  },

  // Connection events
  socketConnected: () => {
    track('socket_connected');
  },

  socketDisconnected: () => {
    track('socket_disconnected');
  },

  connectionError: (error: string) => {
    track('connection_error', { error });
  },
};
