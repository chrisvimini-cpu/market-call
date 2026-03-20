import styles from './AboutModal.module.css';

export default function AboutModal({ onClose, onRestart }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>How to Play</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.content}>
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>The Game</h3>
            <p className={styles.text}>
              Every day at midnight UTC, we select 5 crypto tokens. You predict whether each
              will go UP (Bull) or DOWN (Bear) over the next 24 hours. Make your calls before
              9 AM UTC.
            </p>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>The Streak</h3>
            <p className={styles.text}>
              Get all 5 picks correct to extend your streak. Even 4/5 breaks it. A 10-day
              streak means 50 consecutive correct calls. Keep it alive by playing every day.
            </p>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Scoring</h3>
            <ul className={styles.list}>
              <li>5/5 correct = Perfect day, streak continues 🔥</li>
              <li>4/5 or less = Streak resets to 0</li>
              <li>Miss a day = Streak broken</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Legal Disclaimer</h3>
            <p className={styles.disclaimer}>
              Market Call is a free prediction game for entertainment purposes only. It does
              not constitute investment advice. No real money or assets are at risk. Past
              price performance does not indicate future results.
            </p>
          </section>
        </div>

        {onRestart && (
          <button className={styles.restartButton} onClick={onRestart}>
            Restart Game
          </button>
        )}
      </div>
    </div>
  );
}
