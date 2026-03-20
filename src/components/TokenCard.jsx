import Sparkline from './Sparkline.jsx';
import PredictionBar from './PredictionBar.jsx';
import { formatPrice, formatPercentage } from '../lib/api.js';
import { generatePredictionPercentages, getTodayDateString } from '../lib/predictionSimulator.js';
import styles from './TokenCard.module.css';

export default function TokenCard({ token, sparklineData, isDismissing }) {

  const priceChangeColor = token.price_change_percentage_24h >= 0
    ? 'var(--color-bull-green)'
    : 'var(--color-bear-red)';

  // Generate prediction percentages based on token symbol + today's date
  const predictionData = generatePredictionPercentages(token.symbol, getTodayDateString());

  return (
    <div className={`${styles.card} ${isDismissing ? styles.dismissing : ''}`}>
      {/* Token Icon + Name */}
      <div className={styles.header}>
        <img src={token.image} alt={token.name} className={styles.icon} />
        <div className={styles.info}>
          <h3 className={styles.symbol}>{token.symbol.toUpperCase()}</h3>
          <p className={styles.name}>{token.name}</p>
        </div>
      </div>

      {/* Price + 24h Change */}
      <div className={styles.priceSection}>
        <div className={styles.price}>
          ${formatPrice(token.current_price)}
        </div>
        <div className={styles.change} style={{ color: priceChangeColor }}>
          {formatPercentage(token.price_change_percentage_24h)}
        </div>
      </div>

      {/* Sparkline Chart */}
      {sparklineData && sparklineData.length > 0 && (
        <div className={styles.sparklineContainer}>
          <Sparkline data={sparklineData} width={80} height={46} />
        </div>
      )}

      {/* Prediction Percentages */}
      <PredictionBar bearPercent={predictionData.bear} bullPercent={predictionData.bull} />
    </div>
  );
}
