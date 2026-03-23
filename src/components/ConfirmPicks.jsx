import styles from './ConfirmPicks.module.css';

export default function ConfirmPicks({ picks, onConfirm, onEdit }) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Review Your Calls</h2>
      <p className={styles.subtitle}>Double-check before locking in</p>

      <div className={styles.picksList}>
        {picks.map((pick, index) => (
          <button
            key={pick.token.id}
            className={styles.pickRow}
            onClick={() => onEdit(index)}
          >
            <img src={pick.token.image} alt={pick.token.name} className={styles.logo} />
            <span className={styles.symbol}>{pick.token.symbol.toUpperCase()}</span>
            <span className={styles.name}>{pick.token.name}</span>
            <span className={`${styles.directionChip} ${styles[pick.direction]}`}>
              {pick.direction === 'bull' ? 'Bull' : 'Bear'}
            </span>
          </button>
        ))}
      </div>

      <button className={styles.confirmButton} onClick={onConfirm}>
        Lock in my calls
      </button>
    </div>
  );
}
