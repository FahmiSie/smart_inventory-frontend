'use client';

import { getStockStatus } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  showLabel?: boolean;
}

export default function ProgressBar({ value, max, className, showLabel = false }: ProgressBarProps) {
  const percentage = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  const status = getStockStatus(value, max);

  const barColor = { normal: '#10B981', low: '#F59E0B', out: '#EF4444' }[status];
  const trackColor = { normal: '#D1FAE5', low: '#FEF3C7', out: '#FEE2E2' }[status];

  return (
    <div style={{ width: '100%' }} className={className}>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6B7280', marginBottom: 4 }}>
          <span>{value} / {max}</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div style={{ height: 8, borderRadius: 4, overflow: 'hidden', background: trackColor }}>
        <div
          style={{
            height: '100%',
            borderRadius: 4,
            background: barColor,
            width: `${percentage}%`,
            transition: 'width 0.8s ease-out',
          }}
        />
      </div>
    </div>
  );
}
