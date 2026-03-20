import { useState, useEffect } from 'react';
import { getTimeUntilNextGame } from '../lib/gameLogic.js';
import styles from './WaitingScreen.module.css';

export default function WaitingScreen({ onShare }) {
  const [timeLeft, setTimeLeft] = useState(getTimeUntilNextGame());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeUntilNextGame());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Come Back Tomorrow</h2>
      <p className={styles.subtitle}>Your picks are locked in!</p>

      <div className={styles.countdown}>
        <div className={styles.timeBlock}>
          <span className={styles.timeValue}>{String(timeLeft.hours).padStart(2, '0')}</span>
          <span className={styles.timeLabel}>hours</span>
        </div>
        <span className={styles.separator}>:</span>
        <div className={styles.timeBlock}>
          <span className={styles.timeValue}>{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span className={styles.timeLabel}>minutes</span>
        </div>
        <span className={styles.separator}>:</span>
        <div className={styles.timeBlock}>
          <span className={styles.timeValue}>{String(timeLeft.seconds).padStart(2, '0')}</span>
          <span className={styles.timeLabel}>seconds</span>
        </div>
      </div>

      <p className={styles.resultsText}>Results will be revealed at midnight UTC</p>

      {onShare && (
        <button className={styles.shareButton} onClick={onShare}>
          Share Your Picks
        </button>
      )}
    </div>
  );
}
