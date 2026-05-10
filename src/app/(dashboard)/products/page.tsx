'use client';

import { useState, useMemo } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useToast } from '@/app/providers';
import { Product } from '@/lib/api';
import ProductCard from '@/components/products/ProductCard';
import ProductTable from '@/components/products/ProductTable';
import ProductForm from '@/components/products/ProductForm';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { SkeletonCard, SkeletonTable } from '@/components/ui/Skeleton';
import { Plus, Search, LayoutGrid, List } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

const selectStyle: React.CSSProperties = {
  padding: '10px 16px', fontSize: 14, background: 'white', border: '1px solid #E5E7EB',
  borderRadius: 12, outline: 'none', color: '#374151',
};

export default function ProductsPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';
  const searchParams = useSearchParams();

  const { data: products, isLoading } = useProducts();
  const { data: categories } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const { addToast } = useToast();

  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const [showAddModal, setShowAddModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState('');

  const filteredProducts = useMemo(() => {
    let result = products || [];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    }
    if (categoryFilter) {
      result = result.filter((p) => p.categoryId === categoryFilter);
    }
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'stock': return a.stock - b.stock;
        case 'price': {
          const pa = typeof a.price === 'string' ? parseFloat(a.price) : a.price;
          const pb = typeof b.price === 'string' ? parseFloat(b.price) : b.price;
          return pa - pb;
        }
        default: return 0;
      }
    });
    return result;
  }, [products, search, categoryFilter, sortBy]);

  const handleCreate = async (formData: FormData) => {
    try {
      await createProduct.mutateAsync(formData);
      setShowAddModal(false);
      addToast('success', 'Produk berhasil ditambahkan!');
    } catch { addToast('error', 'Gagal menambahkan produk.'); }
  };

  const handleUpdate = async (formData: FormData) => {
    if (!editProduct) return;
    try {
      await updateProduct.mutateAsync({ id: editProduct.id, formData });
      setEditProduct(null);
      addToast('success', 'Produk berhasil diperbarui!');
    } catch { addToast('error', 'Gagal memperbarui produk.'); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProduct.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
      setDeleteConfirmName('');
      addToast('success', 'Produk berhasil dihapus!');
    } catch { addToast('error', 'Gagal menghapus produk.'); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1F2937' }}>Products</h1>
          <p style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>{filteredProducts.length} produk ditemukan</p>
        </div>
        {isAdmin && (
          <Button onClick={() => setShowAddModal(true)} icon={<Plus style={{ width: 18, height: 18 }} />}>
            Tambah Produk
          </Button>
        )}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#9CA3AF' }} />
          <input
            type="text"
            placeholder="Cari nama atau SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', paddingLeft: 38, paddingRight: 16, padding: '10px 16px 10px 38px', fontSize: 14, background: 'white', border: '1px solid #E5E7EB', borderRadius: 12, outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={selectStyle}>
          <option value="">Semua Kategori</option>
          {categories?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={selectStyle}>
          <option value="name">Nama A-Z</option>
          <option value="stock">Stok Terendah</option>
          <option value="price">Harga Terendah</option>
        </select>
        <div style={{ display: 'flex', background: 'white', border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden' }}>
          <button
            onClick={() => setView('grid')}
            style={{ padding: 10, background: view === 'grid' ? '#FFF7ED' : 'transparent', color: view === 'grid' ? '#EA580C' : '#9CA3AF', border: 'none', cursor: 'pointer', display: 'flex' }}
          >
            <LayoutGrid style={{ width: 18, height: 18 }} />
          </button>
          <button
            onClick={() => setView('table')}
            style={{ padding: 10, background: view === 'table' ? '#FFF7ED' : 'transparent', color: view === 'table' ? '#EA580C' : '#9CA3AF', border: 'none', cursor: 'pointer', display: 'flex' }}
          >
            <List style={{ width: 18, height: 18 }} />
          </button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        view === 'grid' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <SkeletonTable rows={6} />
        )
      ) : filteredProducts.length === 0 ? (
        <div style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,107,0,0.12)', borderRadius: 16, padding: 48, textAlign: 'center' }}>
          <p style={{ color: '#9CA3AF', fontSize: 14 }}>Tidak ada produk ditemukan</p>
        </div>
      ) : view === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onEdit={setEditProduct} onDelete={setDeleteTarget} />
          ))}
        </div>
      ) : (
        <ProductTable products={filteredProducts} onEdit={setEditProduct} onDelete={setDeleteTarget} />
      )}

      {/* Add Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Tambah Produk" size="lg">
        <ProductForm onSubmit={handleCreate} isLoading={createProduct.isPending} onCancel={() => setShowAddModal(false)} />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editProduct} onClose={() => setEditProduct(null)} title="Edit Produk" size="lg">
        {editProduct && <ProductForm product={editProduct} onSubmit={handleUpdate} isLoading={updateProduct.isPending} onCancel={() => setEditProduct(null)} />}
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={!!deleteTarget} onClose={() => { setDeleteTarget(null); setDeleteConfirmName(''); }} title="Konfirmasi Hapus" size="sm">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ fontSize: 14, color: '#4B5563' }}>
            Apakah Anda yakin ingin menghapus produk <strong style={{ color: '#1F2937' }}>{deleteTarget?.name}</strong>?
          </p>
          <Input
            label="KETIK NAMA PRODUK UNTUK KONFIRMASI"
            placeholder={deleteTarget?.name}
            value={deleteConfirmName}
            onChange={(e) => setDeleteConfirmName(e.target.value)}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <Button variant="secondary" onClick={() => { setDeleteTarget(null); setDeleteConfirmName(''); }}>Batal</Button>
            <Button variant="danger" onClick={handleDelete} isLoading={deleteProduct.isPending} disabled={deleteConfirmName !== deleteTarget?.name}>Hapus Produk</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
