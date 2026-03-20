import { STREAK_LEVELS } from './constants.js';
import { selectDailyTokens, getTodayDateSeed } from './tokens.js';

/**
 * Calculate if a pick was correct
 */
export function isPickCorrect(pick, snapshotPrice, currentPrice) {
  const change = currentPrice - snapshotPrice;

  if (pick === 'bull') {
    return change > 0;
  } else if (pick === 'bear') {
    return change < 0;
  }

  return false;
}

/**
 * Calculate score from picks and outcomes
 */
export function calculateScore(picks, outcomes) {
  let correct = 0;

  picks.forEach((pick, index) => {
    if (outcomes[index]) {
      correct++;
    }
  });

  return correct;
}

/**
 * Determine streak level based on current streak count
 */
export function getStreakLevel(streakCount) {
  if (streakCount >= STREAK_LEVELS.LEGENDARY.min) {
    return STREAK_LEVELS.LEGENDARY;
  } else if (streakCount >= STREAK_LEVELS.ON_FIRE.min) {
    return STREAK_LEVELS.ON_FIRE;
  } else if (streakCount >= STREAK_LEVELS.HOT.min) {
    return STREAK_LEVELS.HOT;
  } else if (streakCount >= STREAK_LEVELS.WARMING.min) {
    return STREAK_LEVELS.WARMING;
  } else {
    return STREAK_LEVELS.COLD;
  }
}

/**
 * Generate today's game tokens
 */
export function generateDailyGame(tokenPool) {
  const seed = getTodayDateSeed();
  const selectedTokens = selectDailyTokens(tokenPool, seed);

  return {
    date: new Date().toISOString().split('T')[0],
    tokens: selectedTokens,
    seed,
  };
}

/**
 * Get game number (days since launch)
 * Using Jan 1, 2024 as arbitrary start date
 */
export function getGameNumber() {
  const launchDate = new Date('2024-01-01');
  const today = new Date();
  const diffTime = Math.abs(today - launchDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Generate share text
 */
export function generateShareText(picks, outcomes, score, streakCount) {
  const gameNumber = getGameNumber();
  const streakEmoji = streakCount >= 3 ? '🔥' : '📊';

  let text = `${streakEmoji} Market Call #${gameNumber} — ${score}/5\n`;

  if (streakCount > 0) {
    text += `🔥 Streak: ${streakCount}\n`;
  }

  text += '\n';

  picks.forEach((pick, index) => {
    const token = pick.token;
    const direction = pick.direction === 'bull' ? '🟢' : '🔴';
    const result = outcomes[index] ? '✓' : '✗';
    text += `${token.symbol.toUpperCase()} ${direction} ${result}\n`;
  });

  text += '\ncoindesk.com/games/marketcall';

  return text;
}

/**
 * Check if user can play today (within pick window)
 */
export function canPlayToday(gameState) {
  if (!gameState) return true;

  const today = new Date().toISOString().split('T')[0];
  return gameState.date !== today;
}

/**
 * Check if results are ready
 */
export function areResultsReady(gameState) {
  if (!gameState || !gameState.submitted) return false;

  const now = new Date();
  const submittedDate = new Date(gameState.submittedAt);

  // In demo mode, results are immediate
  // In production, check if 24 hours have passed
  const hoursSinceSubmission = (now - submittedDate) / (1000 * 60 * 60);

  return hoursSinceSubmission >= 24;
}

/**
 * Calculate time until next game
 */
export function getTimeUntilNextGame() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setUTCHours(24, 0, 0, 0);

  const diff = tomorrow - now;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { hours, minutes, seconds, total: diff };
}

/**
 * Validate picks before submission
 */
export function validatePicks(picks) {
  if (!picks || picks.length !== 5) {
    return { valid: false, error: 'You must make 5 picks' };
  }

  const allValid = picks.every(pick => {
    return pick.token && (pick.direction === 'bull' || pick.direction === 'bear');
  });

  if (!allValid) {
    return { valid: false, error: 'All picks must be either Bull or Bear' };
  }

  return { valid: true };
}
