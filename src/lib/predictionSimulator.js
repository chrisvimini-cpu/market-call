/**
 * Prediction Percentage Simulator
 *
 * Generates consistent Bear/Bull prediction percentages for each token + date combination.
 * Uses seeded random number generation to ensure all users see the same percentages each day.
 */

/**
 * Simple hash function to create a seed from string
 */
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Seeded random number generator
 * Returns a function that generates consistent random numbers based on the seed
 */
function seededRandom(seed) {
  let value = seed;
  return function() {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

/**
 * Generate prediction percentages for a token on a specific date
 *
 * @param {string} tokenSymbol - Token symbol (e.g., "ETH", "BTC")
 * @param {string} dateString - ISO date string (e.g., "2026-03-20")
 * @returns {{ bear: number, bull: number }} - Percentages that sum to 100
 */
export function generatePredictionPercentages(tokenSymbol, dateString) {
  // Create consistent seed from token symbol + date
  const seedString = tokenSymbol.toUpperCase() + dateString;
  const seed = hashCode(seedString);
  const rng = seededRandom(seed);

  // Generate realistic split (skewed toward 35-65 range for realism)
  // This avoids extreme splits like 95/5 or 10/90 which feel unrealistic
  const bullPercent = Math.floor(35 + rng() * 30); // 35-65%
  const bearPercent = 100 - bullPercent;

  return { bear: bearPercent, bull: bullPercent };
}

/**
 * Get today's date in ISO format (YYYY-MM-DD)
 */
export function getTodayDateString() {
  return new Date().toISOString().split('T')[0];
}
