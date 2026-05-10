'use client';

import { Category } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Tags, Edit3, Trash2, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface CategoryCardProps {
  category: Category;
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
}

export default function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';
  const productCount = category._count?.products ?? category.products?.length ?? 0;

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.9)',
        border: '1px solid rgba(255,107,0,0.12)',
        borderRadius: 16,
        padding: 24,
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
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Tags style={{ width: 24, height: 24, color: '#FF6B00' }} />
        </div>
        {isAdmin && (
          <div style={{ display: 'flex', gap: 4 }}>
            {onEdit && (
              <button
                onClick={() => onEdit(category)}
                style={{ padding: 6, color: '#9CA3AF', borderRadius: 8, background: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.2s', display: 'flex' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#2563EB'; e.currentTarget.style.background = '#EFF6FF'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#9CA3AF'; e.currentTarget.style.background = 'transparent'; }}
                title="Edit"
              >
                <Edit3 style={{ width: 16, height: 16 }} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(category)}
                style={{ padding: 6, color: '#9CA3AF', borderRadius: 8, background: 'none', border: 'none', cursor: 'pointer', transition: 'all 0.2s', display: 'flex' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#DC2626'; e.currentTarget.style.background = '#FEF2F2'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#9CA3AF'; e.currentTarget.style.background = 'transparent'; }}
                title="Hapus"
              >
                <Trash2 style={{ width: 16, height: 16 }} />
              </button>
            )}
          </div>
        )}
      </div>

      <h3 style={{ fontWeight: 700, fontSize: 18, color: '#1F2937', marginBottom: 4 }}>{category.name}</h3>
      <p style={{ fontSize: 14, color: '#9CA3AF', marginBottom: 16 }}>{productCount} Produk</p>

      <Link
        href={`/categories/${category.id}`}
        style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600, color: '#FF6B00', textDecoration: 'none', transition: 'color 0.2s' }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#EA580C'}
        onMouseLeave={(e) => e.currentTarget.style.color = '#FF6B00'}
      >
        Lihat Produk <ChevronRight style={{ width: 14, height: 14 }} />
      </Link>
    </div>
  );
}
