'use client';

import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, rightIcon, style, ...props }, ref) => {
    return (
      <div style={{ width: '100%' }}>
        {label && (
          <label style={{ display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' as const, color: '#6B7280' }}>
            {label}
          </label>
        )}
        <div style={{ position: 'relative' }}>
          {icon && (
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none', display: 'flex' }}>
              {icon}
            </span>
          )}
          <input
            ref={ref}
            style={{
              width: '100%',
              borderRadius: 12,
              border: error ? '1px solid #F87171' : '1px solid #E5E7EB',
              background: 'white',
              padding: '12px 16px',
              paddingLeft: icon ? 40 : 16,
              paddingRight: rightIcon ? 40 : 16,
              fontSize: 14,
              color: '#1F2937',
              outline: 'none',
              transition: 'all 0.2s ease',
              boxSizing: 'border-box' as const,
              ...style,
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = error ? '#EF4444' : '#FB923C';
              e.currentTarget.style.boxShadow = error ? '0 0 0 3px rgba(239,68,68,0.1)' : '0 0 0 3px rgba(255,107,0,0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = error ? '#F87171' : '#E5E7EB';
              e.currentTarget.style.boxShadow = 'none';
            }}
            className={cn(className)}
            {...props}
          />
          {rightIcon && (
            <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', display: 'flex' }}>
              {rightIcon}
            </span>
          )}
        </div>
        {error && (
          <p style={{ marginTop: 4, fontSize: 12, color: '#EF4444' }}>{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
