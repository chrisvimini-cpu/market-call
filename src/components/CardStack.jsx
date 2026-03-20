import { useState, useEffect } from 'react';
import TokenCard from './TokenCard.jsx';
import styles from './CardStack.module.css';

export default function CardStack({ tokens, sparklines, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [picks, setPicks] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const handlePick = (direction) => {
    if (isAnimating) return;

    setIsAnimating(true);
    const currentToken = tokens[currentIndex];

    const newPicks = [...picks, { token: currentToken, direction }];
    setPicks(newPicks);

    setTimeout(() => {
      if (currentIndex < tokens.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setIsAnimating(false);
      } else {
        onComplete(newPicks);
      }
    }, 400);
  };

  const progress = currentIndex + 1;
  const total = tokens.length;

  return (
    <div className={styles.container}>
      <div className={styles.progress}>
        <div className={styles.progressText}>
          {progress} of {total}
        </div>
        <div className={styles.progressBar}>
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={`${styles.progressDot} ${i < progress ? styles.active : ''}`}
            />
          ))}
        </div>
      </div>

      <div className={styles.stack}>
        {tokens.map((token, index) => {
          if (index < currentIndex) return null;

          const isVisible = index === currentIndex;
          const isNext = index === currentIndex + 1;
          const isFuture = index > currentIndex + 1;

          return (
            <div
              key={token.id}
              className={styles.cardWrapper}
              style={{
                zIndex: tokens.length - index,
                opacity: isVisible ? 1 : isNext ? 0.5 : 0,
                transform: isVisible
                  ? 'translateY(0) scale(1)'
                  : isNext
                  ? 'translateY(10px) scale(0.98)'
                  : 'translateY(20px) scale(0.96)',
                pointerEvents: isVisible ? 'auto' : 'none',
              }}
            >
              <TokenCard
                token={token}
                sparklineData={sparklines[token.id]}
                onPick={handlePick}
                isAnimating={isAnimating}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
