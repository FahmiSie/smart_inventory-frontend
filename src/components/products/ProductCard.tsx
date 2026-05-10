'use client';

import { Product } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { formatCurrency, getStockStatus, getStatusBadge } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import { Edit3, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

export default function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';
  const status = getStockStatus(product.stock, product.minStock);
  const statusBadge = getStatusBadge(status);
  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.9)',
        border: status === 'out' ? '1px solid #FECACA' : status === 'low' ? '1px solid #FDE68A' : '1px solid rgba(255,107,0,0.12)',
        borderRadius: 16,
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(255,107,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)';
      }}
    >
      {/* Top badges */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Badge variant="orange">{product.category?.name || 'Uncategorized'}</Badge>
        {status !== 'normal' && (
          <Badge variant={status === 'low' ? 'warning' : 'danger'}>
            ⚠️ {statusBadge.text}
          </Badge>
        )}
      </div>

      {/* Product info */}
      <div>
        <h3 style={{ fontWeight: 700, fontSize: 16, color: '#1F2937' }}>{product.name}</h3>
        <p style={{ fontSize: 13, color: '#9CA3AF', marginTop: 2 }}>SKU: {product.sku}</p>
      </div>

      {/* Stock bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#6B7280', marginBottom: 6 }}>
          <span>Stock: {product.stock}</span>
          <span>Min: {product.minStock}</span>
        </div>
        <ProgressBar value={product.stock} max={product.minStock * 3} />
      </div>

      {/* Price */}
      <p style={{ fontSize: 20, fontWeight: 800, color: '#1F2937' }}>{formatCurrency(price)}</p>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 12, borderTop: '1px solid #F3F4F6' }}>
        <Link
          href={`/products/${product.id}`}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', fontSize: 13, fontWeight: 500, color: '#6B7280', borderRadius: 8, textDecoration: 'none', transition: 'all 0.2s' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#FFF7ED'; e.currentTarget.style.color = '#EA580C'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6B7280'; }}
        >
          <Eye style={{ width: 15, height: 15 }} /> Detail
        </Link>
        {isAdmin && onEdit && (
          <button
            onClick={() => onEdit(product)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', fontSize: 13, fontWeight: 500, color: '#6B7280', borderRadius: 8, background: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#EFF6FF'; e.currentTarget.style.color = '#2563EB'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6B7280'; }}
          >
            <Edit3 style={{ width: 15, height: 15 }} /> Edit
          </button>
        )}
        {isAdmin && onDelete && (
          <button
            onClick={() => onDelete(product)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', fontSize: 13, fontWeight: 500, color: '#6B7280', borderRadius: 8, background: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.2s', marginLeft: 'auto' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.color = '#DC2626'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6B7280'; }}
          >
            <Trash2 style={{ width: 15, height: 15 }} /> Hapus
          </button>
        )}
      </div>
    </div>
  );
}
