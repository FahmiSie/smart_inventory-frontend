'use client';

import { Product } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { formatCurrency, getStockStatus, getStatusBadge } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import { Edit3, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';

interface ProductTableProps {
  products: Product[];
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '12px 20px',
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  color: '#6B7280',
};

const tdStyle: React.CSSProperties = {
  padding: '14px 20px',
  fontSize: 14,
};

export default function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';

  return (
    <div style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,107,0,0.12)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
              <th style={{ ...thStyle, width: 50 }}>No</th>
              <th style={thStyle}>Nama</th>
              <th style={thStyle}>SKU</th>
              <th style={thStyle}>Kategori</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Stok</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Min</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Harga</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Status</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, i) => {
              const status = getStockStatus(product.stock, product.minStock);
              const statusInfo = getStatusBadge(status);
              const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
              return (
                <tr
                  key={product.id}
                  style={{ borderBottom: '1px solid #FAFAFA', transition: 'background 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,107,0,0.03)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ ...tdStyle, color: '#9CA3AF' }}>{i + 1}</td>
                  <td style={tdStyle}>
                    <span style={{ fontWeight: 600, color: '#1F2937' }}>{product.name}</span>
                  </td>
                  <td style={{ ...tdStyle, fontFamily: 'monospace', color: '#6B7280' }}>{product.sku}</td>
                  <td style={tdStyle}><Badge variant="orange">{product.category?.name || '-'}</Badge></td>
                  <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 700, color: '#1F2937' }}>{product.stock}</td>
                  <td style={{ ...tdStyle, textAlign: 'right', color: '#9CA3AF' }}>{product.minStock}</td>
                  <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 600, color: '#1F2937' }}>{formatCurrency(price)}</td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <Badge variant={status === 'normal' ? 'success' : status === 'low' ? 'warning' : 'danger'}>
                      {statusInfo.text}
                    </Badge>
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                      <Link href={`/products/${product.id}`} title="Detail"
                        style={{ padding: 6, color: '#9CA3AF', borderRadius: 8, display: 'flex', textDecoration: 'none', transition: 'all 0.2s' }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#EA580C'; e.currentTarget.style.background = '#FFF7ED'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = '#9CA3AF'; e.currentTarget.style.background = 'transparent'; }}
                      >
                        <Eye style={{ width: 18, height: 18 }} />
                      </Link>
                      {isAdmin && onEdit && (
                        <button onClick={() => onEdit(product)} title="Edit"
                          style={{ padding: 6, color: '#9CA3AF', borderRadius: 8, display: 'flex', background: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = '#2563EB'; e.currentTarget.style.background = '#EFF6FF'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = '#9CA3AF'; e.currentTarget.style.background = 'transparent'; }}
                        >
                          <Edit3 style={{ width: 18, height: 18 }} />
                        </button>
                      )}
                      {isAdmin && onDelete && (
                        <button onClick={() => onDelete(product)} title="Hapus"
                          style={{ padding: 6, color: '#9CA3AF', borderRadius: 8, display: 'flex', background: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = '#DC2626'; e.currentTarget.style.background = '#FEF2F2'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = '#9CA3AF'; e.currentTarget.style.background = 'transparent'; }}
                        >
                          <Trash2 style={{ width: 18, height: 18 }} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
