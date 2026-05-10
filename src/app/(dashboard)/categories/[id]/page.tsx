'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCategory } from '@/hooks/useCategories';
import ProductCard from '@/components/products/ProductCard';
import { SkeletonCard } from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';
import { ArrowLeft, Tags } from 'lucide-react';

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: category, isLoading } = useCategory(params.id as string);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SkeletonCard />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="glass-card p-12 text-center">
        <p className="text-gray-400">Kategori tidak ditemukan</p>
        <Button variant="secondary" onClick={() => router.back()} className="mt-4">Kembali</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke Categories
      </button>

      {/* Category Header */}
      <div className="glass-card p-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center">
          <Tags className="w-7 h-7 text-orange-500" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">{category.name}</h1>
          <p className="text-sm text-gray-500">{category.products?.length || 0} produk dalam kategori ini</p>
        </div>
      </div>

      {/* Products Grid */}
      {category.products && category.products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
          {category.products.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <p className="text-gray-400 text-sm">Belum ada produk di kategori ini</p>
        </div>
      )}
    </div>
  );
}
