'use client';

import { Loader2 } from 'lucide-react';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const variantStyles: Record<string, React.CSSProperties> = {
  primary: { background: 'linear-gradient(135deg, #FF6B00, #FF8C33)', color: 'white', border: 'none' },
  secondary: { background: 'white', color: '#374151', border: '1px solid #E5E7EB' },
  danger: { background: '#EF4444', color: 'white', border: 'none' },
  ghost: { background: 'transparent', color: '#6B7280', border: 'none' },
};

const sizeStyles: Record<string, React.CSSProperties> = {
  sm: { padding: '6px 14px', fontSize: 12 },
  md: { padding: '10px 20px', fontSize: 14 },
  lg: { padding: '14px 28px', fontSize: 15 },
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, icon, children, disabled, style, ...props }, ref) => {
    return (
      <button
        ref={ref}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          fontWeight: 600,
          borderRadius: 12,
          cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
          opacity: disabled || isLoading ? 0.5 : 1,
          transition: 'all 0.2s ease',
          outline: 'none',
          lineHeight: 1.4,
          ...variantStyles[variant],
          ...sizeStyles[size],
          ...style,
        }}
        disabled={disabled || isLoading}
        className={className}
        onMouseEnter={(e) => {
          if (!disabled && !isLoading) {
            e.currentTarget.style.transform = 'scale(1.02)';
            if (variant === 'primary') e.currentTarget.style.boxShadow = '0 4px 16px rgba(255,107,0,0.3)';
            if (variant === 'secondary') { e.currentTarget.style.borderColor = '#FB923C'; e.currentTarget.style.background = '#FFFBF5'; }
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = 'none';
          if (variant === 'secondary') { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.background = 'white'; }
        }}
        onMouseDown={(e) => { if (!disabled && !isLoading) e.currentTarget.style.transform = 'scale(0.98)'; }}
        onMouseUp={(e) => { if (!disabled && !isLoading) e.currentTarget.style.transform = 'scale(1.02)'; }}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 style={{ width: 18, height: 18 }} className="animate-spin" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
            {children}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
