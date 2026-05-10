'use client';

interface BadgeProps {
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'default' | 'orange';
  children: React.ReactNode;
  className?: string;
}

const variantMap: Record<string, { bg: string; color: string }> = {
  success: { bg: '#D1FAE5', color: '#059669' },
  danger: { bg: '#FEE2E2', color: '#DC2626' },
  warning: { bg: '#FEF3C7', color: '#D97706' },
  info: { bg: '#DBEAFE', color: '#2563EB' },
  default: { bg: '#F3F4F6', color: '#4B5563' },
  orange: { bg: '#FFF7ED', color: '#EA580C' },
};

export default function Badge({ variant = 'default', children, className }: BadgeProps) {
  const colors = variantMap[variant];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '3px 10px',
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
        background: colors.bg,
        color: colors.color,
        lineHeight: 1.4,
        whiteSpace: 'nowrap',
      }}
      className={className}
    >
      {children}
    </span>
  );
}
