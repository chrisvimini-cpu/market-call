import { getStreakLevel } from '../lib/gameLogic.js';
import styles from './StreakCounter.module.css';

export default function StreakCounter({ streak, showAnimation = false }) {
  const level = getStreakLevel(streak);

  return (
    <div
      className={`${styles.streakCounter} ${level.label !== 'Cold' ? styles.active : ''} ${
        showAnimation ? styles.animate : ''
      }`}
      style={{ color: level.color }}
    >
      {level.icon && <span className={styles.icon}>{level.icon}</span>}
      <span className={styles.number}>{streak}</span>
    </div>
  );
}
