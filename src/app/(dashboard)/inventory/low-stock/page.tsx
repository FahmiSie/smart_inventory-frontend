'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useLowStock } from '@/hooks/useInventory';
import { formatCurrency, getStockStatus } from '@/lib/utils';
import ProgressBar from '@/components/ui/ProgressBar';
import Badge from '@/components/ui/Badge';
import AdjustStockModal from '@/components/inventory/AdjustStockModal';
import { SkeletonTable } from '@/components/ui/Skeleton';
import { AlertTriangle, ArrowUpCircle } from 'lucide-react';
import Link from 'next/link';

const thStyle: React.CSSProperties = {
  textAlign: 'left', padding: '12px 20px', fontSize: 12, fontWeight: 600,
  letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6B7280',
};

const tdStyle: React.CSSProperties = { padding: '14px 20px', fontSize: 14 };

export default function LowStockPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';
  const { data: lowStockProducts, isLoading } = useLowStock();

  const [showAdjust, setShowAdjust] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  // Sort by criticality (stock/minStock ratio)
  const sortedProducts = [...(lowStockProducts || [])].sort((a, b) => {
    const ratioA = a.minStock > 0 ? a.stock / a.minStock : 0;
    const ratioB = b.minStock > 0 ? b.stock / b.minStock : 0;
    return ratioA - ratioB;
  });

  const handleQuickAdjust = (productId: string) => {
    setSelectedProductId(productId);
    setShowAdjust(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Alert Banner */}
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 16, background: 'linear-gradient(135deg, #FF6B00, #FF8C33)', padding: 24, color: 'white', boxShadow: '0 4px 20px rgba(255,107,0,0.15)' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: 160, height: 160, background: 'rgba(255,255,255,0.05)', borderRadius: '50%', transform: 'translate(48px, -48px)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: 96, height: 96, background: 'rgba(255,255,255,0.05)', borderRadius: '50%', transform: 'translate(-32px, 32px)' }} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 56, height: 56, background: 'rgba(255,255,255,0.15)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, backdropFilter: 'blur(4px)' }}>
            <AlertTriangle style={{ width: 28, height: 28, color: 'white' }} />
          </div>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>Low Stock Alert</h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 4 }}>
              {sortedProducts.length} produk membutuhkan restock segera
            </p>
          </div>
        </div>
      </div>

      {/* Products List */}
      {isLoading ? (
        <SkeletonTable rows={6} />
      ) : sortedProducts.length === 0 ? (
        <div style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,107,0,0.12)', borderRadius: 16, padding: 48, textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, background: '#D1FAE5', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <span style={{ fontSize: 32 }}>🎉</span>
          </div>
          <h3 style={{ fontWeight: 700, fontSize: 18, color: '#1F2937', marginBottom: 4 }}>Semua Stok Aman!</h3>
          <p style={{ color: '#9CA3AF', fontSize: 14 }}>Tidak ada produk dengan stok di bawah minimum.</p>
        </div>
      ) : (
        <div style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,107,0,0.12)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <th style={thStyle}>Produk</th>
                  <th style={thStyle}>SKU</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Stok</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Min Stok</th>
                  <th style={{ ...thStyle, width: 160 }}>Level</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>Status</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Harga</th>
                  {isAdmin && <th style={{ ...thStyle, textAlign: 'center' }}>Aksi</th>}
                </tr>
              </thead>
              <tbody>
                {sortedProducts.map((product) => {
                  const status = getStockStatus(product.stock, product.minStock);
                  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
                  return (
                    <tr key={product.id} style={{ borderBottom: '1px solid #FAFAFA', transition: 'background 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#FEF2F2'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={tdStyle}>
                        <Link href={`/products/${product.id}`} style={{ fontSize: 14, fontWeight: 600, color: '#1F2937', textDecoration: 'none', transition: 'color 0.2s' }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#EA580C'}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#1F2937'}
                        >
                          {product.name}
                        </Link>
                      </td>
                      <td style={{ ...tdStyle, fontFamily: 'monospace', color: '#6B7280' }}>{product.sku}</td>
                      <td style={{ ...tdStyle, textAlign: 'right' }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#DC2626' }}>{product.stock}</span>
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'right', color: '#9CA3AF' }}>{product.minStock}</td>
                      <td style={tdStyle}>
                        <ProgressBar value={product.stock} max={product.minStock * 3} />
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>
                        <Badge variant={status === 'out' ? 'danger' : 'warning'}>
                          {status === 'out' ? '🔴 Habis' : '⚠️ Low'}
                        </Badge>
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 600, color: '#1F2937' }}>
                        {formatCurrency(price)}
                      </td>
                      {isAdmin && (
                        <td style={{ ...tdStyle, textAlign: 'center' }}>
                          <button
                            onClick={() => handleQuickAdjust(product.id)}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '6px 12px', fontSize: 12, fontWeight: 600, color: '#059669', background: '#D1FAE5', border: 'none', borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s' }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = '#A7F3D0'; e.currentTarget.style.transform = 'scale(1.05)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = '#D1FAE5'; e.currentTarget.style.transform = 'scale(1)'; }}
                            title="Restock"
                          >
                            <ArrowUpCircle style={{ width: 14, height: 14 }} /> Restock
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Adjust Stock Modal */}
      <AdjustStockModal
        isOpen={showAdjust}
        onClose={() => { setShowAdjust(false); setSelectedProductId(''); }}
        preselectedProductId={selectedProductId}
      />
    </div>
  );
}
