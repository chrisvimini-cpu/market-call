import styles from './StatsModal.module.css';

export default function StatsModal({ stats, onClose }) {
  const accuracyPercentage = stats.totalPicks > 0
    ? ((stats.totalCorrectPicks / stats.totalPicks) * 100).toFixed(1)
    : 0;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Your Stats</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.currentStreak}</div>
            <div className={styles.statLabel}>Current Streak</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.longestStreak}</div>
            <div className={styles.statLabel}>Longest Streak</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.totalDaysPlayed}</div>
            <div className={styles.statLabel}>Days Played</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.perfectDays}</div>
            <div className={styles.statLabel}>Perfect Days</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statValue}>{accuracyPercentage}%</div>
            <div className={styles.statLabel}>Accuracy</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.totalCorrectPicks}/{stats.totalPicks}</div>
            <div className={styles.statLabel}>Total Picks</div>
          </div>
        </div>

        {stats.history.length > 0 && (
          <div className={styles.history}>
            <h3 className={styles.historyTitle}>Recent Games</h3>
            <div className={styles.historyList}>
              {stats.history.slice(0, 10).map((game, index) => (
                <div key={index} className={styles.historyRow}>
                  <span className={styles.historyDate}>{game.date}</span>
                  <span className={styles.historyScore}>{game.score}/5</span>
                  {game.score === 5 && <span className={styles.perfectBadge}>🔥</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
