/**
 * Leaderboard Simulator
 *
 * Generates realistic fake leaderboard data with crypto-themed usernames.
 * Inserts the actual user at the appropriate rank based on their stats.
 */

// Fixed list of 100 names in "First Last Initial." format
const FIXED_NAMES = [
  'Jeremiah Z.', 'Hunter G.', 'Lucas D.', 'Mila S.', 'Connor D.',
  'Connor W.', 'Leo L.', 'Ethan U.', 'Chloe I.', 'Isaac P.',
  'Penelope E.', 'Isabella N.', 'Willow X.', 'Stella J.', 'Wyatt E.',
  'Alexander L.', 'Lily A.', 'Dylan T.', 'Landon L.', 'Emma N.',
  'Liam I.', 'Anna I.', 'Mila U.', 'Benjamin L.', 'Robert J.',
  'Emily R.', 'Anna D.', 'Harper K.', 'Robert S.', 'Isabella C.',
  'Chloe N.', 'Naomi P.', 'Robert T.', 'Aria E.', 'Asher K.',
  'Elena B.', 'Thomas O.', 'Hazel V.', 'Claire V.', 'Camila H.',
  'Nora S.', 'Henry D.', 'Aria R.', 'Carter C.', 'Paisley H.',
  'Savannah W.', 'Aurora H.', 'Jayden F.', 'Harper C.', 'Caleb A.',
  'Naomi K.', 'Riley S.', 'Jeremiah H.', 'Violet X.', 'James A.',
  'Lucy Z.', 'Savannah F.', 'Finn Y.', 'Mia G.', 'Tyler U.',
  'Zoey E.', 'Owen J.', 'Aaliyah L.', 'Grace O.', 'Penelope U.',
  'Daniel B.', 'Aurora Y.', 'Benjamin Q.', 'Aaliyah M.', 'Charlotte G.',
  'Nathan F.', 'Charlotte X.', 'Sarah R.', 'Penelope S.', 'Jayden U.',
  'Scarlett W.', 'Sebastian G.', 'Emily M.', 'Emilia Q.', 'Landon O.',
  'Robert D.', 'Jack K.', 'Liam S.', 'Sebastian T.', 'Camila Q.',
  'Camila L.', 'Joseph G.', 'Daniel Q.', 'Mila W.', 'Paisley V.',
  'Gabriel W.', 'Mia G.', 'Jack G.', 'Elena L.', 'Lily K.',
  'Stella S.', 'Benjamin S.', 'Emma B.', 'Joseph T.', 'Emma D.'
];

/**
 * Get a name from the fixed list
 */
function getFixedName(index) {
  return FIXED_NAMES[index % FIXED_NAMES.length];
}

/**
 * Generate realistic streak value (skewed distribution)
 * Most users have low streaks, few have high streaks
 */
function generateRealisticStreak(seed) {
  // Use exponential distribution for realistic feel
  const random = (seed % 1000) / 1000;
  const streak = Math.floor(random * random * random * 20); // Most will be 0-5, rare to get 15-20
  return streak;
}

/**
 * Generate realistic perfect days count
 */
function generatePerfectDays(streak, seed) {
  // Perfect days should be at least equal to current streak
  const baseValue = streak;
  const additional = Math.floor((seed % 50) / 10); // 0-4 additional perfect days
  return baseValue + additional;
}

/**
 * Generate realistic accuracy percentage
 */
function generateAccuracy(streak, seed) {
  // Higher streak correlates with higher accuracy, but with variance
  const baseAccuracy = 50 + (streak * 2); // Base accuracy based on streak
  const variance = (seed % 20) - 10; // -10 to +10 variance
  const accuracy = Math.min(100, Math.max(40, baseAccuracy + variance));
  return Math.floor(accuracy);
}

/**
 * Find the appropriate rank position for the user
 */
function findRankPosition(leaderboard, userStats) {
  // Sort by streak (primary), then perfectDays (secondary)
  for (let i = 0; i < leaderboard.length; i++) {
    const entry = leaderboard[i];

    // User ranks higher if they have better streak
    if (userStats.currentStreak > entry.streak) {
      return i;
    }

    // If same streak, compare perfect days
    if (userStats.currentStreak === entry.streak) {
      if (userStats.perfectDays > entry.perfectDays) {
        return i;
      }
    }
  }

  // User ranks last if they have worse stats than everyone
  return leaderboard.length;
}

/**
 * Generate complete leaderboard with user inserted
 *
 * @param {Object} userStats - User's actual stats from localStorage
 * @returns {Array} - Array of leaderboard entries with user included
 */
export function generateLeaderboard(userStats) {
  const leaderboard = [];

  // Generate 100 simulated users with fixed names
  for (let i = 0; i < 100; i++) {
    const seed = i * 137; // Use prime number for better distribution
    const username = getFixedName(i);
    const streak = generateRealisticStreak(seed);
    const perfectDays = generatePerfectDays(streak, seed);
    const accuracy = generateAccuracy(streak, seed);

    leaderboard.push({
      username,
      streak,
      perfectDays,
      accuracy,
      isCurrentUser: false,
    });
  }

  // Sort by streak (primary), then perfectDays (secondary)
  leaderboard.sort((a, b) => {
    if (b.streak !== a.streak) {
      return b.streak - a.streak;
    }
    return b.perfectDays - a.perfectDays;
  });

  // Calculate user's accuracy
  const userAccuracy = userStats.totalPicks > 0
    ? Math.floor((userStats.totalCorrectPicks / userStats.totalPicks) * 100)
    : 0;

  // Create user entry
  const userEntry = {
    username: 'You',
    streak: userStats.currentStreak,
    perfectDays: userStats.perfectDays,
    accuracy: userAccuracy,
    isCurrentUser: true,
  };

  // Find appropriate position and insert user
  const insertIndex = findRankPosition(leaderboard, userStats);
  leaderboard.splice(insertIndex, 0, userEntry);

  // Return top 100 (including user)
  return leaderboard.slice(0, 100);
}

/**
 * Get user's rank from the leaderboard
 */
export function getUserRank(leaderboard) {
  const index = leaderboard.findIndex(entry => entry.isCurrentUser);
  return index + 1; // Convert from 0-indexed to 1-indexed
}
