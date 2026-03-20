import { useMemo, useRef, useEffect } from 'react';
import { generateLeaderboard, getUserRank } from '../lib/leaderboardSimulator.js';
import styles from './Leaderboard.module.css';

export default function Leaderboard({ stats, onClose }) {
  const leaderboard = useMemo(() => generateLeaderboard(stats), [stats]);
  const userRank = useMemo(() => getUserRank(leaderboard), [leaderboard]);
  const userRowRef = useRef(null);

  // Scroll to user's position when modal opens
  useEffect(() => {
    if (userRowRef.current) {
      userRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Leaderboard</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className={styles.userRank}>
          You're ranked <span className={styles.rankNumber}>#{userRank}</span> out of 100 players
        </div>

        <div className={styles.tableHeader}>
          <div className={styles.rankColumn}>Rank</div>
          <div className={styles.usernameColumn}>Player</div>
          <div className={styles.streakColumn}>Streak</div>
        </div>

        <div className={styles.tableBody}>
          {leaderboard.map((entry, index) => (
            <div
              key={index}
              ref={entry.isCurrentUser ? userRowRef : null}
              className={`${styles.tableRow} ${entry.isCurrentUser ? styles.currentUserRow : ''}`}
            >
              <div className={styles.rankColumn}>
                <span className={styles.rank}>#{index + 1}</span>
              </div>
              <div className={styles.usernameColumn}>
                <span className={styles.username}>
                  {entry.username}
                  {entry.isCurrentUser && <span className={styles.youBadge}> (You)</span>}
                </span>
              </div>
              <div className={styles.streakColumn}>
                <span className={styles.streak}>
                  {entry.streak > 0 && '🔥 '}
                  {entry.streak}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
