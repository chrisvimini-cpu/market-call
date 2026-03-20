// Stablecoins and non-volatile tokens to exclude from the game (no point predicting these)
export const STABLECOINS = [
  'usdt',
  'usdc',
  'dai',
  'busd',
  'tusd',
  'fdusd',
  'usdd',
  'usdp',
  'gusd',
  'pyusd',
  'buidl', // BlackRock tokenized money market fund
];

// Token pool configuration
export const TOKEN_POOL_CONFIG = {
  TOTAL_TOKENS: 50,
  DAILY_SELECTION_COUNT: 5,
  TIER_1_COUNT: 2, // Top 10 by market cap
  TIER_2_COUNT: 2, // Ranks 11-30
  TIER_3_COUNT: 1, // Ranks 31-50
  TIER_1_RANGE: [0, 9],
  TIER_2_RANGE: [10, 29],
  TIER_3_RANGE: [30, 49],
};

/**
 * Select 5 tokens from the pool using the tiered algorithm
 * 2 from top 10, 2 from 11-30, 1 from 31-50
 */
export function selectDailyTokens(tokenPool, seed = Date.now()) {
  // Use seed for deterministic selection (same day = same tokens)
  const random = seededRandom(seed);

  const tier1 = tokenPool.slice(
    TOKEN_POOL_CONFIG.TIER_1_RANGE[0],
    TOKEN_POOL_CONFIG.TIER_1_RANGE[1] + 1
  );
  const tier2 = tokenPool.slice(
    TOKEN_POOL_CONFIG.TIER_2_RANGE[0],
    TOKEN_POOL_CONFIG.TIER_2_RANGE[1] + 1
  );
  const tier3 = tokenPool.slice(
    TOKEN_POOL_CONFIG.TIER_3_RANGE[0],
    TOKEN_POOL_CONFIG.TIER_3_RANGE[1] + 1
  );

  const selected = [
    ...shuffleArray(tier1, random).slice(0, TOKEN_POOL_CONFIG.TIER_1_COUNT),
    ...shuffleArray(tier2, random).slice(0, TOKEN_POOL_CONFIG.TIER_2_COUNT),
    ...shuffleArray(tier3, random).slice(0, TOKEN_POOL_CONFIG.TIER_3_COUNT),
  ];

  return selected;
}

/**
 * Seeded random number generator for deterministic selection
 */
function seededRandom(seed) {
  let value = seed;
  return function() {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

/**
 * Fisher-Yates shuffle with seeded random
 */
function shuffleArray(array, random) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get today's date seed for deterministic token selection
 */
export function getTodayDateSeed() {
  const now = new Date();
  const utcDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  return utcDate.getTime();
}
