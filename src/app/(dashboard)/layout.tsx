'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import { useLowStock } from '@/hooks/useInventory';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { data: lowStockProducts } = useLowStock();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoggedIn) {
      router.replace('/login');
    }
  }, [mounted, isLoggedIn, router]);

  if (!mounted || !isLoggedIn) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFF8F3' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #FFD4B3', borderTopColor: '#FF6B00', borderRadius: '50%' }} className="animate-spin" />
      </div>
    );
  }

  const lowStockCount = lowStockProducts?.length || 0;

  return (
    <div style={{ minHeight: '100vh', background: '#FFF8F3' }} className="bg-grid-pattern">
      <Sidebar lowStockCount={lowStockCount} />
      <div style={{ marginLeft: 260, minHeight: '100vh', transition: 'margin-left 0.3s ease' }} className="max-lg:!ml-0">
        <Topbar lowStockCount={lowStockCount} />
        <main style={{ padding: 28 }} className="animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
