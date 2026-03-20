import { useState, useEffect } from 'react';
import Header from './Header.jsx';
import CardStack from './CardStack.jsx';
import ConfirmPicks from './ConfirmPicks.jsx';
import ResultsScreen from './ResultsScreen.jsx';
import WaitingScreen from './WaitingScreen.jsx';
import Leaderboard from './Leaderboard.jsx';
import AboutModal from './AboutModal.jsx';
import Toast from './Toast.jsx';
import HamburgerMenu from './HamburgerMenu.jsx';
import { copyShareText } from './ShareCard.jsx';
import {
  fetchTokenPool,
  fetchTokenPrices,
  fetchMultipleSparklines,
  fetchMultipleHistoricalPrices,
} from '../lib/api.js';
import { generateDailyGame, isPickCorrect, calculateScore, validatePicks } from '../lib/gameLogic.js';
import { loadGameState, saveGameState, loadStats, updateStats, clearAllData } from '../lib/storage.js';
import styles from './App.module.css';

export default function App() {
  // Game state
  const [gameState, setGameState] = useState(null);
  const [dailyTokens, setDailyTokens] = useState([]);
  const [sparklines, setSparklines] = useState({});
  const [picks, setPicks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI state
  const [currentScreen, setCurrentScreen] = useState('loading'); // loading, playing, confirm, waiting, results
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [toast, setToast] = useState(null);
  const [hasCompletedPicks, setHasCompletedPicks] = useState(false);

  // Stats
  const [stats, setStats] = useState(loadStats());

  // Initialize game on mount
  useEffect(() => {
    initializeGame();
  }, []);

  async function initializeGame() {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch token pool
      const tokenPool = await fetchTokenPool();

      // Generate today's game
      const dailyGame = generateDailyGame(tokenPool);
      const tokenIds = dailyGame.tokens.map(t => t.id);

      // Fetch current prices
      const pricesData = await fetchTokenPrices(tokenIds);

      // Merge price data with token data
      const tokensWithPrices = dailyGame.tokens.map(token => ({
        ...token,
        ...pricesData[token.id],
      }));

      setDailyTokens(tokensWithPrices);

      // Fetch sparklines in background
      fetchMultipleSparklines(tokenIds).then(setSparklines);

      // Check if user already played today
      const savedState = loadGameState();
      if (savedState && savedState.date === dailyGame.date) {
        // User already played today
        if (savedState.submitted) {
          // Check if in demo mode - if so, show results immediately
          // In production, check if 24 hours passed
          await showResults(savedState);
        } else {
          // User started but didn't finish
          setGameState(savedState);
          setCurrentScreen('playing');
        }
      } else {
        // New game for today
        const newState = {
          date: dailyGame.date,
          tokens: tokensWithPrices,
          submitted: false,
        };
        setGameState(newState);
        saveGameState(newState);
        setCurrentScreen('playing');
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Failed to initialize game:', err);
      setError(err.message);
      setIsLoading(false);
    }
  }

  async function showResults(savedState) {
    try {
      // Fetch historical prices (24h ago) and current prices
      const tokenIds = savedState.picks.map(p => p.token.id);
      const [historicalPrices, currentPricesData] = await Promise.all([
        fetchMultipleHistoricalPrices(tokenIds),
        fetchTokenPrices(tokenIds),
      ]);

      // Calculate outcomes
      const picksWithPrices = savedState.picks.map((pick, index) => {
        const snapshotPrice = historicalPrices[pick.token.id] || pick.token.current_price;
        const currentPrice = currentPricesData[pick.token.id]?.current_price || pick.token.current_price;

        return {
          ...pick,
          snapshotPrice,
          currentPrice,
        };
      });

      const outcomes = picksWithPrices.map(pick =>
        isPickCorrect(pick.direction, pick.snapshotPrice, pick.currentPrice)
      );

      const score = calculateScore(savedState.picks, outcomes);

      // Update stats
      const newStats = updateStats({
        date: savedState.date,
        picks: savedState.picks,
        outcomes,
        score,
      });

      setStats(newStats);
      setPicks(picksWithPrices);
      setGameState({ ...savedState, outcomes, score });
      setCurrentScreen('results');
    } catch (err) {
      console.error('Failed to show results:', err);
      showToast('Failed to load results', 'error');
    }
  }

  function handlePicksComplete(newPicks) {
    setPicks(newPicks);
    setHasCompletedPicks(true);
    setCurrentScreen('confirm');
  }

  function handleReviewPicks() {
    setCurrentScreen('confirm');
  }

  function handleEditPick(index) {
    // Keep existing picks and just go back to playing screen
    // User can re-swipe and use "Review your calls" link to jump back
    setCurrentScreen('playing');
  }

  async function handleConfirmPicks() {
    const validation = validatePicks(picks);
    if (!validation.valid) {
      showToast(validation.error, 'error');
      return;
    }

    const updatedState = {
      ...gameState,
      picks: picks.map(pick => ({
        token: pick.token,
        direction: pick.direction,
      })),
      submitted: true,
      submittedAt: new Date().toISOString(),
    };

    setGameState(updatedState);
    saveGameState(updatedState);

    // In demo mode, show results immediately
    // In production, show waiting screen
    const isDemoMode = true; // GAME_CONFIG.DEMO_MODE

    if (isDemoMode) {
      await showResults(updatedState);
    } else {
      setCurrentScreen('waiting');
    }
  }

  function handleShare() {
    if (gameState && gameState.outcomes) {
      copyShareText(picks, gameState.outcomes, gameState.score, stats.currentStreak)
        .then(result => {
          showToast(result.message, result.success ? 'success' : 'error');
        });
    } else {
      // Share picks before results
      const shareText = `I just made my Market Call picks! Can you beat my streak?\n\ncoindesk.com/games/marketcall`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText)
          .then(() => showToast('Copied to clipboard!', 'success'))
          .catch(() => showToast('Failed to copy', 'error'));
      }
    }
  }

  function handlePlayAgain() {
    window.location.reload();
  }

  function handleRestart() {
    if (window.confirm('This will reset all your game data and statistics. Are you sure?')) {
      clearAllData();
      window.location.reload();
    }
  }

  function showToast(message, type = 'info') {
    setToast({ message, type });
  }

  function closeToast() {
    setToast(null);
  }

  if (isLoading) {
    return (
      <div className={styles.app}>
        <Header streak={stats.currentStreak} onInfoClick={() => {}} onStatsClick={() => {}} onMenuClick={() => setShowMenu(true)} />
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Loading today's tokens...</p>
        </div>
        <HamburgerMenu isOpen={showMenu} onClose={() => setShowMenu(false)} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.app}>
        <Header streak={stats.currentStreak} onInfoClick={() => {}} onStatsClick={() => {}} onMenuClick={() => setShowMenu(true)} />
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={initializeGame}>Try Again</button>
        </div>
        <HamburgerMenu isOpen={showMenu} onClose={() => setShowMenu(false)} />
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <Header
        streak={stats.currentStreak}
        onInfoClick={() => setShowAboutModal(true)}
        onStatsClick={() => setShowLeaderboard(true)}
        onMenuClick={() => setShowMenu(true)}
      />

      <main className={styles.main}>
        {currentScreen === 'playing' && dailyTokens.length > 0 && (
          <CardStack
            tokens={dailyTokens}
            sparklines={sparklines}
            onComplete={handlePicksComplete}
            onReview={handleReviewPicks}
            showReviewLink={hasCompletedPicks && picks.length === 5}
          />
        )}

        {currentScreen === 'confirm' && (
          <ConfirmPicks
            picks={picks}
            onConfirm={handleConfirmPicks}
            onEdit={handleEditPick}
          />
        )}

        {currentScreen === 'waiting' && (
          <WaitingScreen onShare={handleShare} />
        )}

        {currentScreen === 'results' && gameState?.outcomes && (
          <ResultsScreen
            picks={picks}
            outcomes={gameState.outcomes}
            score={gameState.score}
            streak={stats.currentStreak}
            onShare={handleShare}
            onPlayAgain={handlePlayAgain}
          />
        )}
      </main>

      {showLeaderboard && <Leaderboard stats={stats} onClose={() => setShowLeaderboard(false)} />}
      {showAboutModal && <AboutModal onClose={() => setShowAboutModal(false)} onRestart={handleRestart} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
      <HamburgerMenu isOpen={showMenu} onClose={() => setShowMenu(false)} />
    </div>
  );
}
