'use client';

import { useEffect, useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  subtitle?: string;
  highlight?: boolean;
  format?: 'number' | 'currency';
  delay?: number;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  subtitle,
  highlight = false,
  format = 'number',
  delay = 0,
}: StatsCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = typeof value === 'number' ? value : parseFloat(String(value)) || 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 1000;
      const steps = 30;
      const stepValue = numericValue / steps;
      let current = 0;
      const interval = setInterval(() => {
        current += stepValue;
        if (current >= numericValue) {
          setDisplayValue(numericValue);
          clearInterval(interval);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [numericValue, delay]);

  const formattedValue =
    format === 'currency'
      ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(displayValue)
      : displayValue.toLocaleString('id-ID');

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(10px)',
        border: highlight ? '1px solid rgba(255,107,0,0.25)' : '1px solid rgba(255,107,0,0.12)',
        borderRadius: 16,
        padding: 24,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        cursor: 'default',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(255,107,0,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)';
      }}
    >
      {highlight && (
        <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, background: 'linear-gradient(135deg, #FF6B00, #FF8C33)', opacity: 0.06, borderRadius: '50%' }} />
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative' }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6B7280', marginBottom: 8 }}>
            {title}
          </p>
          <p style={{ fontSize: 28, fontWeight: 800, color: highlight ? '#EA580C' : '#1F2937', lineHeight: 1.2 }}>
            {formattedValue}
          </p>
          {subtitle && (
            <p style={{ fontSize: 13, color: '#9CA3AF', marginTop: 6 }}>{subtitle}</p>
          )}
        </div>
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          background: highlight ? 'linear-gradient(135deg, #FF6B00, #FF8C33)' : '#FFF7ED',
        }}>
          <Icon style={{ width: 24, height: 24, color: highlight ? 'white' : '#FF6B00' }} />
        </div>
      </div>
    </div>
  );
}
