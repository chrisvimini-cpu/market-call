import styles from './PredictionBar.module.css';

export default function PredictionBar({ bearPercent, bullPercent }) {
  return (
    <div className={styles.container}>
      <div className={styles.box + ' ' + styles.bearBox}>
        <div className={styles.percent}>{bearPercent}%</div>
        <div className={styles.label}>Bear</div>
      </div>

      <div className={styles.box + ' ' + styles.bullBox}>
        <div className={styles.percent}>{bullPercent}%</div>
        <div className={styles.label}>Bull</div>
      </div>
    </div>
  );
}
