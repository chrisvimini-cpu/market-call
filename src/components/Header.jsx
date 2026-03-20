import StreakCounter from './StreakCounter.jsx';
import styles from './Header.module.css';

export default function Header({ streak, onInfoClick, onStatsClick }) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <h1 className={styles.title}>MARKET CALL</h1>
        <span className={styles.subtitle}>by CoinDesk</span>
      </div>

      <div className={styles.right}>
        <StreakCounter streak={streak} />
        <button className={styles.iconButton} onClick={onStatsClick} aria-label="View stats">
          📊
        </button>
        <button className={styles.iconButton} onClick={onInfoClick} aria-label="About">
          ℹ️
        </button>
      </div>
    </header>
  );
}
