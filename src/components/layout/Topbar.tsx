'use client';

import { useAuthStore } from '@/store/authStore';
import { Search, Bell, ChevronRight } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';

interface TopbarProps {
  lowStockCount?: number;
}

const breadcrumbMap: Record<string, string> = {
  dashboard: 'Dashboard',
  products: 'Products',
  categories: 'Categories',
  inventory: 'Inventory',
  'low-stock': 'Low Stock Alert',
};

export default function Topbar({ lowStockCount = 0 }: TopbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');

  const breadcrumbs = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    return segments.map((seg, i) => ({
      label: breadcrumbMap[seg] || seg,
      href: '/' + segments.slice(0, i + 1).join('/'),
      isLast: i === segments.length - 1,
    }));
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 20,
      background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #F3F4F6',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: 64 }}>
        {/* Left: Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.href} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {i > 0 && <ChevronRight style={{ width: 14, height: 14, color: '#D1D5DB' }} />}
              <span
                style={{
                  fontWeight: crumb.isLast ? 600 : 400,
                  color: crumb.isLast ? '#1F2937' : '#9CA3AF',
                  cursor: crumb.isLast ? 'default' : 'pointer',
                }}
                onClick={() => !crumb.isLast && router.push(crumb.href)}
              >
                {crumb.label}
              </span>
            </span>
          ))}
        </div>

        {/* Right: Search + Notifications + User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:block">
            <div style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#9CA3AF' }} />
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: 220, paddingLeft: 38, paddingRight: 16, paddingTop: 9, paddingBottom: 9,
                  fontSize: 14, background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 12,
                  outline: 'none',
                }}
              />
            </div>
          </form>

          {/* Notification Bell */}
          <button
            onClick={() => router.push('/inventory/low-stock')}
            style={{
              position: 'relative', padding: 10, color: '#9CA3AF',
              background: 'none', border: 'none', borderRadius: 12, cursor: 'pointer',
            }}
            aria-label="Low stock alerts"
          >
            <Bell style={{ width: 22, height: 22 }} />
            {lowStockCount > 0 && (
              <span style={{
                position: 'absolute', top: 4, right: 4,
                width: 18, height: 18, background: '#EF4444', color: 'white',
                fontSize: 10, fontWeight: 700, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {lowStockCount > 9 ? '9+' : lowStockCount}
              </span>
            )}
          </button>

          {/* User */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, #FF6B00, #FF8C33)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="hidden sm:block">
              <p style={{ fontSize: 14, fontWeight: 600, color: '#1F2937', lineHeight: 1.2 }}>{user?.name}</p>
              <p style={{ fontSize: 12, color: '#9CA3AF' }}>{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
