const STORAGE_KEYS = {
  GAME_STATE: 'marketcall_game_state',
  STATS: 'marketcall_stats',
  PRICE_CACHE: 'marketcall_price_cache',
  TOKEN_POOL: 'marketcall_token_pool',
};

/**
 * Save game state to localStorage
 */
export function saveGameState(state) {
  try {
    localStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
}

/**
 * Load game state from localStorage
 */
export function loadGameState() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.GAME_STATE);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load game state:', error);
    return null;
  }
}

/**
 * Save stats to localStorage
 */
export function saveStats(stats) {
  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  } catch (error) {
    console.error('Failed to save stats:', error);
  }
}

/**
 * Load stats from localStorage
 */
export function loadStats() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.STATS);
    return data ? JSON.parse(data) : getDefaultStats();
  } catch (error) {
    console.error('Failed to load stats:', error);
    return getDefaultStats();
  }
}

/**
 * Default stats structure
 */
function getDefaultStats() {
  return {
    currentStreak: 0,
    longestStreak: 0,
    totalDaysPlayed: 0,
    totalCorrectPicks: 0,
    totalPicks: 0,
    perfectDays: 0,
    history: [],
  };
}

/**
 * Update stats after a game result
 */
export function updateStats(result) {
  const stats = loadStats();
  const score = result.score;
  const isPerfect = score === 5;

  stats.totalDaysPlayed += 1;
  stats.totalCorrectPicks += score;
  stats.totalPicks += 5;

  if (isPerfect) {
    stats.currentStreak += 1;
    stats.perfectDays += 1;
    if (stats.currentStreak > stats.longestStreak) {
      stats.longestStreak = stats.currentStreak;
    }
  } else {
    stats.currentStreak = 0;
  }

  // Add to history (keep last 30 days)
  stats.history.unshift({
    date: result.date,
    picks: result.picks,
    outcomes: result.outcomes,
    score: result.score,
  });

  if (stats.history.length > 30) {
    stats.history = stats.history.slice(0, 30);
  }

  saveStats(stats);
  return stats;
}

/**
 * Save price cache
 */
export function savePriceCache(cache) {
  try {
    localStorage.setItem(STORAGE_KEYS.PRICE_CACHE, JSON.stringify(cache));
  } catch (error) {
    console.error('Failed to save price cache:', error);
  }
}

/**
 * Load price cache
 */
export function loadPriceCache() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PRICE_CACHE);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Failed to load price cache:', error);
    return {};
  }
}

/**
 * Save token pool
 */
export function saveTokenPool(pool) {
  try {
    localStorage.setItem(STORAGE_KEYS.TOKEN_POOL, JSON.stringify({
      tokens: pool,
      timestamp: Date.now(),
    }));
  } catch (error) {
    console.error('Failed to save token pool:', error);
  }
}

/**
 * Load token pool
 */
export function loadTokenPool() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TOKEN_POOL);
    if (!data) return null;

    const { tokens, timestamp } = JSON.parse(data);
    const age = Date.now() - timestamp;
    const oneDay = 24 * 60 * 60 * 1000;

    // Cache token pool for 24 hours
    if (age > oneDay) return null;

    return tokens;
  } catch (error) {
    console.error('Failed to load token pool:', error);
    return null;
  }
}

/**
 * Clear all game data (for testing/reset)
 */
export function clearAllData() {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}
