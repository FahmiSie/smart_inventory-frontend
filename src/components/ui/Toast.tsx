'use client';

import { useToast } from '@/app/providers';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const icons = {
  success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
  error: <XCircle className="w-5 h-5 text-red-500" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
};

const bgColors = {
  success: 'border-l-emerald-500',
  error: 'border-l-red-500',
  warning: 'border-l-amber-500',
  info: 'border-l-blue-500',
};

const progressColors = {
  success: 'bg-emerald-500',
  error: 'bg-red-500',
  warning: 'bg-amber-500',
  info: 'bg-blue-500',
};

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'pointer-events-auto w-80 bg-white rounded-xl shadow-lg border-l-4 overflow-hidden animate-toast-in',
            bgColors[toast.type]
          )}
          role="alert"
        >
          <div className="flex items-start gap-3 p-4">
            <span className="flex-shrink-0 mt-0.5">{icons[toast.type]}</span>
            <p className="text-sm text-gray-700 flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {/* Progress bar */}
          <div className="h-1 bg-gray-100">
            <div
              className={cn('h-full', progressColors[toast.type])}
              style={{
                animation: `progressShrink ${toast.duration || 3000}ms linear forwards`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
