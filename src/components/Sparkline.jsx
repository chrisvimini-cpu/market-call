import { useMemo } from 'react';
import styles from './Sparkline.module.css';

export default function Sparkline({ data, width = 80, height = 30 }) {
  const path = useMemo(() => {
    if (!data || data.length === 0) return '';

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  }, [data, width, height]);

  if (!data || data.length === 0) {
    return <div className={styles.sparkline} style={{ width, height }} />;
  }

  return (
    <svg className={styles.sparkline} width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <path
        d={path}
        fill="none"
        stroke="var(--color-sparkline)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
