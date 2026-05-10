'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/hooks/useCategories';
import { useToast } from '@/app/providers';
import { Category } from '@/lib/api';
import CategoryCard from '@/components/categories/CategoryCard';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { Plus } from 'lucide-react';

export default function CategoriesPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';
  const { data: categories, isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const { addToast } = useToast();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [nameError, setNameError] = useState('');

  const handleCreate = async () => {
    if (!categoryName.trim()) { setNameError('Nama kategori wajib diisi'); return; }
    try {
      await createCategory.mutateAsync({ name: categoryName.trim() });
      setShowAddModal(false); setCategoryName(''); setNameError('');
      addToast('success', 'Kategori berhasil ditambahkan!');
    } catch { addToast('error', 'Gagal menambahkan kategori.'); }
  };

  const handleUpdate = async () => {
    if (!editCategory || !categoryName.trim()) { setNameError('Nama kategori wajib diisi'); return; }
    try {
      await updateCategory.mutateAsync({ id: editCategory.id, data: { name: categoryName.trim() } });
      setEditCategory(null); setCategoryName(''); setNameError('');
      addToast('success', 'Kategori berhasil diperbarui!');
    } catch { addToast('error', 'Gagal memperbarui kategori.'); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCategory.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
      addToast('success', 'Kategori berhasil dihapus!');
    } catch { addToast('error', 'Gagal menghapus kategori.'); }
  };

  const openEdit = (category: Category) => {
    setCategoryName(category.name); setEditCategory(category); setNameError('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1F2937' }}>Categories</h1>
          <p style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>{categories?.length || 0} kategori</p>
        </div>
        {isAdmin && (
          <Button onClick={() => { setShowAddModal(true); setCategoryName(''); setNameError(''); }} icon={<Plus style={{ width: 18, height: 18 }} />}>
            Tambah Kategori
          </Button>
        )}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : !categories || categories.length === 0 ? (
        <div style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,107,0,0.12)', borderRadius: 16, padding: 48, textAlign: 'center' }}>
          <p style={{ color: '#9CA3AF', fontSize: 14 }}>Belum ada kategori</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} onEdit={openEdit} onDelete={setDeleteTarget} />
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Tambah Kategori" size="sm"
        footer={<><Button variant="secondary" onClick={() => setShowAddModal(false)}>Batal</Button><Button onClick={handleCreate} isLoading={createCategory.isPending}>Tambah</Button></>}
      >
        <Input label="NAMA KATEGORI" placeholder="Masukkan nama kategori" value={categoryName} onChange={(e) => { setCategoryName(e.target.value); setNameError(''); }} error={nameError} autoFocus />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editCategory} onClose={() => setEditCategory(null)} title="Edit Kategori" size="sm"
        footer={<><Button variant="secondary" onClick={() => setEditCategory(null)}>Batal</Button><Button onClick={handleUpdate} isLoading={updateCategory.isPending}>Simpan</Button></>}
      >
        <Input label="NAMA KATEGORI" placeholder="Masukkan nama kategori" value={categoryName} onChange={(e) => { setCategoryName(e.target.value); setNameError(''); }} error={nameError} autoFocus />
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Hapus Kategori" size="sm"
        footer={<><Button variant="secondary" onClick={() => setDeleteTarget(null)}>Batal</Button><Button variant="danger" onClick={handleDelete} isLoading={deleteCategory.isPending}>Hapus</Button></>}
      >
        <p style={{ fontSize: 14, color: '#4B5563' }}>
          Yakin ingin menghapus kategori <strong>{deleteTarget?.name}</strong>? Kategori hanya bisa dihapus jika tidak memiliki produk.
        </p>
      </Modal>
    </div>
  );
}
