import { formatPrice, formatPercentage } from '../lib/api.js';
import styles from './ResultsScreen.module.css';

export default function ResultsScreen({ picks, outcomes, score, streak, onShare, onPlayAgain }) {
  return (
    <div className={styles.container}>
      <div className={styles.scoreSection}>
        <h2 className={styles.title}>Your Results</h2>
        <div className={styles.score}>{score}/5</div>
        <p className={styles.scoreText}>
          {score === 5 ? 'Perfect! 🔥' : score >= 3 ? 'Nice work!' : 'Better luck tomorrow!'}
        </p>

        {streak > 0 && (
          <div className={styles.streakInfo}>
            <span className={styles.streakLabel}>Current Streak</span>
            <span className={styles.streakNumber}>🔥 {streak}</span>
          </div>
        )}
      </div>

      <div className={styles.resultsList}>
        {picks.map((pick, index) => {
          const isCorrect = outcomes[index];
          const priceChange = pick.currentPrice - pick.snapshotPrice;
          const percentChange = (priceChange / pick.snapshotPrice) * 100;

          return (
            <div
              key={pick.token.id}
              className={`${styles.resultRow} ${isCorrect ? styles.correct : styles.wrong}`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <img src={pick.token.image} alt={pick.token.name} className={styles.logo} />
              <div className={styles.info}>
                <span className={styles.symbol}>{pick.token.symbol.toUpperCase()}</span>
                <span className={styles.prices}>
                  ${formatPrice(pick.snapshotPrice)} → ${formatPrice(pick.currentPrice)}
                </span>
                <span
                  className={styles.change}
                  style={{
                    color: priceChange >= 0 ? 'var(--color-bull-green)' : 'var(--color-bear-red)',
                  }}
                >
                  {formatPercentage(percentChange)}
                </span>
              </div>
              <div className={styles.pickDirection}>
                {pick.direction === 'bull' ? '🟢' : '🔴'}
              </div>
              <div className={`${styles.resultMark} ${isCorrect ? styles.check : styles.x}`}>
                {isCorrect ? '✓' : '✗'}
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.actions}>
        <button className={styles.shareButton} onClick={onShare}>
          Share Results
        </button>
        <button className={styles.playButton} onClick={onPlayAgain}>
          Play Today's Game
        </button>
      </div>
    </div>
  );
}
