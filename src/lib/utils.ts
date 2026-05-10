import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date));
}

export function formatDateShort(date: string | Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(date));
}

export type StockStatus = 'normal' | 'low' | 'out';

export function getStockStatus(stock: number, minStock: number): StockStatus {
  if (stock <= 0) return 'out';
  if (stock <= minStock) return 'low';
  return 'normal';
}

export function getStockPercentage(stock: number, minStock: number): number {
  if (minStock <= 0) return stock > 0 ? 100 : 0;
  const maxDisplay = minStock * 3;
  return Math.min(100, Math.round((stock / maxDisplay) * 100));
}

export function getStatusColor(status: StockStatus): string {
  switch (status) {
    case 'normal': return 'bg-emerald-500';
    case 'low': return 'bg-amber-500';
    case 'out': return 'bg-red-500';
  }
}

export function getStatusBadge(status: StockStatus) {
  switch (status) {
    case 'normal': return { text: 'Normal', className: 'bg-emerald-100 text-emerald-700' };
    case 'low': return { text: 'Low Stock', className: 'bg-amber-100 text-amber-700' };
    case 'out': return { text: 'Out of Stock', className: 'bg-red-100 text-red-700' };
  }
}

export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
