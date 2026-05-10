'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCategories } from '@/hooks/useCategories';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Product } from '@/lib/api';
import { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';

const productSchema = z.object({
  name: z.string().min(1, 'Nama produk wajib diisi'),
  sku: z.string().min(1, 'SKU wajib diisi'),
  description: z.string().optional(),
  stock: z.coerce.number().min(0, 'Stok minimal 0').optional(),
  minStock: z.coerce.number().min(0, 'Min stok minimal 0').optional(),
  price: z.coerce.number().min(0, 'Harga minimal 0'),
  categoryId: z.string().min(1, 'Kategori wajib dipilih'),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
  onSubmit: (formData: FormData) => void;
  isLoading?: boolean;
  onCancel: () => void;
}

const labelStyle: React.CSSProperties = {
  display: 'block', marginBottom: 6, fontSize: 12, fontWeight: 600,
  letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6B7280'
};

const inputBaseStyle: React.CSSProperties = {
  width: '100%', borderRadius: 12, border: '1px solid #E5E7EB', background: 'white',
  padding: '12px 16px', fontSize: 14, color: '#1F2937', outline: 'none',
  transition: 'all 0.2s ease', boxSizing: 'border-box'
};

export default function ProductForm({ product, onSubmit, isLoading, onCancel }: ProductFormProps) {
  const { data: categories } = useCategories();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      sku: product?.sku || '',
      description: product?.description || '',
      stock: product?.stock || 0,
      minStock: product?.minStock || 0,
      price: product ? (typeof product.price === 'string' ? parseFloat(product.price) : product.price) : 0,
      categoryId: product?.categoryId || '',
    },
  });

  const handleFormSubmit = (data: ProductFormData) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('sku', data.sku.toUpperCase());
    if (data.description) formData.append('description', data.description);
    if (data.stock !== undefined) formData.append('stock', String(data.stock));
    if (data.minStock !== undefined) formData.append('minStock', String(data.minStock));
    formData.append('price', String(data.price));
    formData.append('categoryId', data.categoryId);
    if (selectedFile) formData.append('image', selectedFile);
    onSubmit(formData);
  };

  const handleSkuChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('sku', e.target.value.toUpperCase());
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Input
        label="NAMA PRODUK"
        placeholder="Masukkan nama produk"
        error={errors.name?.message}
        {...register('name')}
      />

      <Input
        label="SKU"
        placeholder="Contoh: PRD-001"
        error={errors.sku?.message}
        {...register('sku', { onChange: handleSkuChange })}
      />

      <div>
        <label style={labelStyle}>DESKRIPSI</label>
        <textarea
          style={{ ...inputBaseStyle, minHeight: 80, resize: 'none' }}
          placeholder="Deskripsi produk (opsional)"
          onFocus={(e) => { e.currentTarget.style.borderColor = '#FB923C'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255,107,0,0.1)'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.boxShadow = 'none'; }}
          {...register('description')}
        />
      </div>

      <div>
        <label style={labelStyle}>KATEGORI</label>
        <select
          style={{ ...inputBaseStyle, border: errors.categoryId ? '1px solid #F87171' : '1px solid #E5E7EB' }}
          onFocus={(e) => { e.currentTarget.style.borderColor = errors.categoryId ? '#EF4444' : '#FB923C'; e.currentTarget.style.boxShadow = errors.categoryId ? '0 0 0 3px rgba(239,68,68,0.1)' : '0 0 0 3px rgba(255,107,0,0.1)'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = errors.categoryId ? '#F87171' : '#E5E7EB'; e.currentTarget.style.boxShadow = 'none'; }}
          {...register('categoryId')}
        >
          <option value="">Pilih kategori...</option>
          {categories?.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        {errors.categoryId && (
          <p style={{ marginTop: 4, fontSize: 12, color: '#EF4444' }}>{errors.categoryId.message}</p>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Input
          label="STOK AWAL"
          type="number"
          placeholder="0"
          error={errors.stock?.message}
          {...register('stock')}
        />
        <Input
          label="MINIMUM STOK"
          type="number"
          placeholder="0"
          error={errors.minStock?.message}
          {...register('minStock')}
        />
      </div>

      <Input
        label="HARGA (Rp)"
        type="number"
        placeholder="0"
        error={errors.price?.message}
        {...register('price')}
      />

      {/* Image Upload */}
      <div>
        <label style={labelStyle}>GAMBAR PRODUK</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          style={{ display: 'none' }}
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
        />
        <div
          onClick={() => fileInputRef.current?.click()}
          style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: 16,
            border: '2px dashed #E5E7EB', borderRadius: 12, cursor: 'pointer',
            transition: 'all 0.2s', background: 'white'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#FB923C'; e.currentTarget.style.background = 'rgba(255,107,0,0.03)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.background = 'white'; }}
        >
          <Upload style={{ width: 20, height: 20, color: '#9CA3AF' }} />
          <span style={{ fontSize: 14, color: '#6B7280' }}>
            {selectedFile ? selectedFile.name : 'Klik untuk upload gambar (PNG/JPG, max 2MB)'}
          </span>
          {selectedFile && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
              style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: 4 }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#EF4444'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#9CA3AF'}
            >
              <X style={{ width: 16, height: 16 }} />
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, paddingTop: 8 }}>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {product ? 'Simpan Perubahan' : 'Tambah Produk'}
        </Button>
      </div>
    </form>
  );
}
