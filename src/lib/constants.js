// Game timing constants (all times in UTC)
export const GAME_CONFIG = {
  PICK_WINDOW_START: 0, // midnight UTC
  PICK_WINDOW_END: 9, // 9 AM UTC
  RESOLUTION_HOUR: 0, // midnight UTC next day
  DEMO_MODE: true, // Set to false when backend cron is ready
};

// Streak thresholds
export const STREAK_LEVELS = {
  COLD: { min: 0, max: 2, label: 'Cold', icon: '', color: '#6B7280' },
  WARMING: { min: 3, max: 5, label: 'Warming', icon: '🔥', color: '#F8BF1E' },
  HOT: { min: 6, max: 9, label: 'Hot Streak', icon: '🔥', color: '#F8BF1E' },
  ON_FIRE: { min: 10, max: 19, label: 'On Fire', icon: '🔥🔥🔥', color: '#F8BF1E' },
  LEGENDARY: { min: 20, max: Infinity, label: 'Legendary', icon: '🔥🔥🔥', color: '#F8BF1E' },
};

// Colors
export const COLORS = {
  BACKGROUND: '#FFFFFF',
  CARD_BACKGROUND: '#FFFFFF',
  COINDESK_YELLOW: '#F8BF1E',
  BULL_GREEN: '#16C784',
  BEAR_RED: '#EA3943',
  TEXT_PRIMARY: '#1A1A1A',
  TEXT_SECONDARY: '#6B7280',
  SPARKLINE: '#9CA3AF',
  BORDER: '#E8E8E8',
  CORRECT_BG: '#FEF9E7',
  WRONG_BG: '#F0F0F0',
};

// API Configuration
export const API_CONFIG = {
  COINGECKO_BASE: 'https://api.coingecko.com/api/v3',
  RATE_LIMIT_DELAY: 2000, // 2 seconds between batch requests
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes
};

// Card animation timing
export const ANIMATION_TIMING = {
  CARD_DISMISS: 350,
  CARD_ENTER: 300,
  RESULT_STAGGER: 200,
};
