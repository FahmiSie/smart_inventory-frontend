'use client';

import { useParams, useRouter } from 'next/navigation';
import { useProduct } from '@/hooks/useProducts';
import { useAuthStore } from '@/store/authStore';
import { formatCurrency, formatDate, getStockStatus, getStatusBadge } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import ProgressBar from '@/components/ui/ProgressBar';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { ArrowLeft, Edit3, Package, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';
  const { data: product, isLoading } = useProduct(params.id as string);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ background: 'white', borderRadius: 24, padding: 48, textAlign: 'center', border: '1px solid #F3F4F6' }}>
        <p style={{ color: '#9CA3AF', fontSize: 16 }}>Produk tidak ditemukan</p>
        <div style={{ marginTop: 16 }}>
          <Button variant="secondary" onClick={() => router.back()}>
            Kembali
          </Button>
        </div>
      </div>
    );
  }

  const status = getStockStatus(product.stock, product.minStock);
  const statusInfo = getStatusBadge(status);
  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Back button */}
      <button
        onClick={() => router.back()}
        style={{
          display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 500,
          color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer', padding: 0
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#FB923C'}
        onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}
      >
        <ArrowLeft style={{ width: 16, height: 16 }} /> Kembali ke Products
      </button>

      {/* Product Info */}
      <div style={{ background: 'white', borderRadius: 24, padding: 32, border: '1px solid #F3F4F6', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
          {/* Image */}
          <div style={{
            width: 200, height: 200, background: '#F9FAFB', borderRadius: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden', border: '1px solid #E5E7EB'
          }}>
            {product.imageUrl ? (
              <img
                src={`http://localhost:3000${product.imageUrl}`}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <Package style={{ width: 48, height: 48, color: '#D1D5DB' }} />
            )}
          </div>

          {/* Details */}
          <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <Badge variant="orange">{product.category?.name}</Badge>
                  <Badge variant={status === 'normal' ? 'success' : status === 'low' ? 'warning' : 'danger'}>
                    {statusInfo.text}
                  </Badge>
                </div>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111827', margin: 0 }}>{product.name}</h1>
                <p style={{ fontSize: 14, color: '#9CA3AF', fontFamily: 'monospace', marginTop: 4, margin: 0 }}>SKU: {product.sku}</p>
              </div>
              {isAdmin && (
                <Link href={`/products`} style={{ textDecoration: 'none' }}>
                  <Button variant="secondary" size="sm" icon={<Edit3 style={{ width: 14, height: 14 }} />}>
                    Edit
                  </Button>
                </Link>
              )}
            </div>

            {product.description && (
              <p style={{ fontSize: 14, color: '#4B5563', lineHeight: 1.6, margin: 0 }}>{product.description}</p>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 20, background: '#F9FAFB', padding: 20, borderRadius: 16 }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px 0' }}>Harga</p>
                <p style={{ fontSize: 20, fontWeight: 800, color: '#111827', margin: 0 }}>{formatCurrency(price)}</p>
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px 0' }}>Stok</p>
                <p style={{ fontSize: 20, fontWeight: 800, color: '#111827', margin: 0 }}>{product.stock}</p>
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px 0' }}>Min Stok</p>
                <p style={{ fontSize: 18, fontWeight: 700, color: '#6B7280', margin: 0 }}>{product.minStock}</p>
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px 0' }}>Supplier</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#374151', margin: 0 }}>{product.supplier?.name || '-'}</p>
              </div>
            </div>

            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 8, margin: '0 0 8px 0' }}>Level Stok</p>
              <ProgressBar value={product.stock} max={product.minStock * 3} showLabel />
            </div>

            <div style={{ display: 'flex', gap: 24, fontSize: 12, color: '#9CA3AF', marginTop: 8 }}>
              <span>Dibuat: {formatDate(product.createdAt)}</span>
              <span>Diperbarui: {formatDate(product.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Movement History */}
      <div style={{ background: 'white', borderRadius: 24, padding: 32, border: '1px solid #F3F4F6', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#111827', margin: '0 0 20px 0' }}>Riwayat Mutasi Stok</h2>
        {product.movements && product.movements.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {product.movements.map((m) => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, background: '#F9FAFB', borderRadius: 16 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: m.type === 'IN' ? '#D1FAE5' : '#FEE2E2'
                }}>
                  {m.type === 'IN' ? (
                    <ArrowUpCircle style={{ width: 20, height: 20, color: '#059669' }} />
                  ) : (
                    <ArrowDownCircle style={{ width: 20, height: 20, color: '#DC2626' }} />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', margin: '0 0 4px 0' }}>{m.reason}</p>
                  <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>{formatDate(m.createdAt)}</p>
                </div>
                <Badge variant={m.type === 'IN' ? 'success' : 'danger'}>
                  <span style={{ fontSize: 14, padding: '2px 6px' }}>{m.type === 'IN' ? '+' : ''}{m.quantity}</span>
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: 14, color: '#9CA3AF', textAlign: 'center', padding: '32px 0', margin: 0 }}>Belum ada riwayat mutasi untuk produk ini.</p>
        )}
      </div>
    </div>
  );
}
