'use client';

import { useAuthStore } from '@/store/authStore';
import { useProducts, useLowStockProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useMovements } from '@/hooks/useInventory';
import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '@/lib/api';
import StatsCard from '@/components/dashboard/StatsCard';
import { MovementsBarChart, CategoryDonutChart } from '@/components/dashboard/Charts';
import { SkeletonStat } from '@/components/ui/Skeleton';
import ProgressBar from '@/components/ui/ProgressBar';
import Badge from '@/components/ui/Badge';
import { Package, Tags, AlertTriangle, DollarSign, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';

  const { data: products, isLoading: loadingProducts } = useProducts();
  const { data: categories, isLoading: loadingCategories } = useCategories();
  const { data: lowStock, isLoading: loadingLowStock } = useLowStockProducts();
  const { data: movements, isLoading: loadingMovements } = useMovements();
  const { data: assetValue } = useQuery({
    queryKey: ['reports', 'asset-value'],
    queryFn: async () => {
      const res = await reportsApi.getAssetValue();
      return res.data;
    },
    enabled: isAdmin,
  });

  const isLoading = loadingProducts || loadingCategories || loadingLowStock;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Welcome */}
      <div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1F2937' }}>Dashboard 👋</h1>
        <p style={{ color: '#6B7280', fontSize: 15, marginTop: 4 }}>
          Selamat datang kembali, <span style={{ fontWeight: 600, color: '#374151' }}>{user?.name}</span>
        </p>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
        {isLoading ? (
          <>
            <SkeletonStat />
            <SkeletonStat />
            <SkeletonStat />
            <SkeletonStat />
          </>
        ) : (
          <>
            <StatsCard title="Total Produk" value={products?.length || 0} icon={Package} highlight delay={0} />
            <StatsCard title="Total Kategori" value={categories?.length || 0} icon={Tags} delay={100} />
            <StatsCard title="Low Stock" value={lowStock?.length || 0} icon={AlertTriangle} subtitle="Perlu restock" delay={200} />
            {isAdmin && (
              <StatsCard title="Total Nilai Inventori" value={assetValue?.totalAssetValue || 0} icon={DollarSign} format="currency" delay={300} />
            )}
          </>
        )}
      </div>

      {/* Charts Row */}
      {!loadingMovements && !loadingCategories && (
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 24 }}>
          <MovementsBarChart movements={movements || []} />
          <CategoryDonutChart categories={categories || []} />
        </div>
      )}

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Low Stock Table */}
        <div style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,107,0,0.12)', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h3 style={{ fontWeight: 700, fontSize: 16, color: '#1F2937' }}>Produk Low Stock</h3>
            <Link href="/inventory/low-stock" style={{ fontSize: 13, color: '#FF6B00', fontWeight: 600, textDecoration: 'none' }}>
              Lihat Semua →
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {(lowStock || []).slice(0, 5).map((product) => (
              <div key={product.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 12, transition: 'background 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#F9FAFB'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#1F2937', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</p>
                  <p style={{ fontSize: 12, color: '#9CA3AF' }}>{product.sku}</p>
                </div>
                <div style={{ width: 100 }}>
                  <ProgressBar value={product.stock} max={product.minStock * 3} />
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#1F2937' }}>{product.stock}</p>
                  <p style={{ fontSize: 11, color: '#9CA3AF' }}>min: {product.minStock}</p>
                </div>
              </div>
            ))}
            {(!lowStock || lowStock.length === 0) && (
              <p style={{ fontSize: 14, color: '#9CA3AF', textAlign: 'center', padding: '20px 0' }}>Semua stok aman 🎉</p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,107,0,0.12)', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontWeight: 700, fontSize: 16, color: '#1F2937', marginBottom: 20 }}>Aktivitas Terbaru</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {(movements || []).slice(0, 5).map((movement) => (
              <div key={movement.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 12, borderRadius: 12, transition: 'background 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#F9FAFB'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  background: movement.type === 'IN' ? '#D1FAE5' : '#FEE2E2',
                }}>
                  {movement.type === 'IN' ? (
                    <ArrowUpCircle style={{ width: 18, height: 18, color: '#059669' }} />
                  ) : (
                    <ArrowDownCircle style={{ width: 18, height: 18, color: '#DC2626' }} />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#1F2937', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {movement.product?.name || 'Unknown Product'}
                  </p>
                  <p style={{ fontSize: 12, color: '#9CA3AF' }}>{movement.reason}</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <Badge variant={movement.type === 'IN' ? 'success' : 'danger'}>
                    {movement.type === 'IN' ? '▲' : '▼'} {Math.abs(movement.quantity)}
                  </Badge>
                  <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>{formatDate(movement.createdAt)}</p>
                </div>
              </div>
            ))}
            {(!movements || movements.length === 0) && (
              <p style={{ fontSize: 14, color: '#9CA3AF', textAlign: 'center', padding: '20px 0' }}>Belum ada aktivitas</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
