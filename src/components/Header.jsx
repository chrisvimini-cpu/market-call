import styles from './Header.module.css';

export default function Header({ streak, onInfoClick, onStatsClick }) {
  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <button
          className={styles.menuButton}
          aria-label="Menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M2.5 5H17.5M2.5 10H17.5M2.5 15H17.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
      <div className={styles.headerCenter}>
        <h1 className={styles.title}>Market Call</h1>
        <span className={styles.byLine}>by</span>
        <img
          src="/coindesk-logo.svg"
          alt="CoinDesk"
          className={styles.logo}
        />
      </div>
      <div className={styles.headerRight}>
        <button
          className={styles.iconButton}
          onClick={onStatsClick}
          aria-label="Statistics"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M16 11V3H8V9H2V21H22V11H16ZM10 5H14V19H10V5ZM4 11H8V19H4V11ZM20 19H16V13H20V19Z"
              fill="currentColor"
            />
          </svg>
        </button>
        <button
          className={styles.iconButton}
          onClick={onInfoClick}
          aria-label="Help"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M11 18H13V16H11V18ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12 6C9.79 6 8 7.79 8 10H10C10 8.9 10.9 8 12 8C13.1 8 14 8.9 14 10C14 12 11 11.75 11 15H13C13 12.75 16 12.5 16 10C16 7.79 14.21 6 12 6Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
