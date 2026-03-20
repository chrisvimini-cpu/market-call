import { useState, useRef, useEffect } from 'react';
import Sparkline from './Sparkline.jsx';
import { formatPrice, formatPercentage } from '../lib/api.js';
import styles from './TokenCard.module.css';

export default function TokenCard({ token, sparklineData, onPick, isAnimating }) {
  const [isDismissing, setIsDismissing] = useState(false);
  const [swipeY, setSwipeY] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const startY = useRef(0);
  const cardRef = useRef(null);

  const SWIPE_THRESHOLD = 80;

  const handleTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
    setIsSwiping(true);
  };

  const handleTouchMove = (e) => {
    if (!isSwiping) return;
    const currentY = e.touches[0].clientY;
    const diff = startY.current - currentY;
    setSwipeY(diff);
  };

  const handleTouchEnd = () => {
    if (Math.abs(swipeY) > SWIPE_THRESHOLD) {
      const direction = swipeY > 0 ? 'bull' : 'bear';
      handlePick(direction);
    } else {
      setSwipeY(0);
    }
    setIsSwiping(false);
  };

  const handlePick = (direction) => {
    setIsDismissing(true);
    setTimeout(() => {
      onPick(direction);
    }, 350);
  };

  const priceChangeColor = token.price_change_percentage_24h >= 0
    ? 'var(--color-bull-green)'
    : 'var(--color-bear-red)';

  return (
    <div
      ref={cardRef}
      className={`${styles.card} ${isDismissing ? styles.dismissing : ''} ${isSwiping ? styles.swiping : ''}`}
      style={{
        transform: isSwiping ? `translateY(${-swipeY}px)` : undefined,
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className={styles.header}>
        <img src={token.image} alt={token.name} className={styles.logo} />
        <div className={styles.info}>
          <h2 className={styles.name}>{token.name}</h2>
          <span className={styles.symbol}>{token.symbol.toUpperCase()}</span>
        </div>
      </div>

      <div className={styles.priceSection}>
        <div className={styles.price}>${formatPrice(token.current_price)}</div>
        <div className={styles.change} style={{ color: priceChangeColor }}>
          {formatPercentage(token.price_change_percentage_24h)}
        </div>
      </div>

      {sparklineData && sparklineData.length > 0 && (
        <div className={styles.sparklineContainer}>
          <Sparkline data={sparklineData} width={120} height={40} />
        </div>
      )}

      <div className={styles.actions}>
        <button
          className={`${styles.button} ${styles.bullButton}`}
          onClick={() => handlePick('bull')}
          disabled={isAnimating}
        >
          <span className={styles.arrow}>↑</span>
          <span className={styles.label}>BULL</span>
        </button>
        <button
          className={`${styles.button} ${styles.bearButton}`}
          onClick={() => handlePick('bear')}
          disabled={isAnimating}
        >
          <span className={styles.arrow}>↓</span>
          <span className={styles.label}>BEAR</span>
        </button>
      </div>
    </div>
  );
}
