'use client';

import { useState, useMemo } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useMovements } from '@/hooks/useInventory';
import { useProducts } from '@/hooks/useProducts';
import MovementsTable from '@/components/inventory/MovementsTable';
import AdjustStockModal from '@/components/inventory/AdjustStockModal';
import Button from '@/components/ui/Button';
import { SkeletonTable } from '@/components/ui/Skeleton';
import { Plus, Download } from 'lucide-react';

const selectStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 200,
  padding: '10px 16px',
  fontSize: 14,
  background: 'white',
  border: '1px solid #E5E7EB',
  borderRadius: 12,
  outline: 'none',
  color: '#374151',
};

export default function InventoryPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';
  const { data: movements, isLoading } = useMovements();
  const { data: products } = useProducts();

  const [showAdjust, setShowAdjust] = useState(false);
  const [filterProduct, setFilterProduct] = useState('');
  const [filterType, setFilterType] = useState<'' | 'IN' | 'OUT'>('');

  const filteredMovements = useMemo(() => {
    let result = movements || [];
    if (filterProduct) {
      result = result.filter((m) => m.productId === filterProduct);
    }
    if (filterType) {
      result = result.filter((m) => m.type === filterType);
    }
    return result;
  }, [movements, filterProduct, filterType]);

  const handleExportCSV = () => {
    const headers = 'Tanggal,Produk,SKU,Tipe,Qty,Alasan\n';
    const rows = filteredMovements.map((m) =>
      `${new Date(m.createdAt).toLocaleDateString('id-ID')},${m.product?.name || '-'},${m.product?.sku || '-'},${m.type},${m.quantity},${m.reason}`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stock-movements-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1F2937' }}>Stock Movements</h1>
          <p style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>{filteredMovements.length} mutasi tercatat</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {isAdmin && (
            <>
              <Button variant="secondary" onClick={handleExportCSV} icon={<Download style={{ width: 18, height: 18 }} />}>
                Export CSV
              </Button>
              <Button onClick={() => setShowAdjust(true)} icon={<Plus style={{ width: 18, height: 18 }} />}>
                Adjust Stock
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
        <select
          value={filterProduct}
          onChange={(e) => setFilterProduct(e.target.value)}
          style={selectStyle}
        >
          <option value="">Semua Produk</option>
          {products?.map((p) => (
            <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
          ))}
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as '' | 'IN' | 'OUT')}
          style={selectStyle}
        >
          <option value="">Semua Tipe</option>
          <option value="IN">Stock IN</option>
          <option value="OUT">Stock OUT</option>
        </select>
      </div>

      {/* Table */}
      {isLoading ? (
        <SkeletonTable rows={8} />
      ) : (
        <MovementsTable movements={filteredMovements} />
      )}

      {/* Adjust Stock Modal */}
      <AdjustStockModal isOpen={showAdjust} onClose={() => setShowAdjust(false)} />
    </div>
  );
}
