'use client';

import { useAuthStore } from '@/store/authStore';
import {
  LayoutDashboard,
  Package,
  Tags,
  ArrowLeftRight,
  AlertTriangle,
  LogOut,
  ChevronLeft,
  Menu,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/products', label: 'Products', icon: Package },
  { href: '/categories', label: 'Categories', icon: Tags },
  { href: '/inventory', label: 'Stock Movements', icon: ArrowLeftRight },
  { href: '/inventory/low-stock', label: 'Low Stock Alert', icon: AlertTriangle, badge: true },
];

interface SidebarProps {
  lowStockCount?: number;
}

export default function Sidebar({ lowStockCount = 0 }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    if (href === '/inventory/low-stock') return pathname === '/inventory/low-stock';
    if (href === '/inventory') return pathname === '/inventory';
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #FF6B00, #FF8C33)', padding: '20px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Package style={{ width: 22, height: 22, color: 'white' }} />
        </div>
        <div>
          <h1 style={{ color: 'white', fontWeight: 700, fontSize: 16, lineHeight: 1.2 }}>Smart Inventory</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>Management System</p>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto' }}>
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 14px',
                borderRadius: 12,
                fontSize: 14,
                fontWeight: active ? 600 : 500,
                color: active ? '#FF6B00' : '#4B5563',
                background: active ? '#FFF7ED' : 'transparent',
                borderLeft: active ? '3px solid #FF6B00' : '3px solid transparent',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                position: 'relative',
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'rgba(255,107,0,0.06)'; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
            >
              <Icon style={{ width: 20, height: 20, flexShrink: 0, color: active ? '#FF6B00' : '#9CA3AF' }} />
              <span>{item.label}</span>
              {item.badge && lowStockCount > 0 && (
                <span style={{
                  marginLeft: 'auto',
                  width: 22, height: 22,
                  background: '#EF4444', color: 'white',
                  fontSize: 11, fontWeight: 700,
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {lowStockCount > 9 ? '9+' : lowStockCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Card */}
      <div style={{ padding: '16px', borderTop: '1px solid #F3F4F6' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #FF6B00, #FF8C33)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#1F2937', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name || 'User'}</p>
            <span style={{
              fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
              background: user?.role === 'ADMIN' ? '#FFF7ED' : '#F3F4F6',
              color: user?.role === 'ADMIN' ? '#EA580C' : '#6B7280',
            }}>
              {user?.role || 'USER'}
            </span>
          </div>
        </div>

        <button
          onClick={logout}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            width: '100%', marginTop: 12, padding: '8px 14px',
            borderRadius: 12, fontSize: 14, color: '#6B7280',
            background: 'transparent', border: 'none', cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.color = '#EF4444'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6B7280'; }}
        >
          <LogOut style={{ width: 18, height: 18 }} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden"
        style={{
          position: 'fixed', top: 16, left: 16, zIndex: 40,
          padding: 10, background: 'white', borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: 'none', cursor: 'pointer',
        }}
        aria-label="Open menu"
      >
        <Menu style={{ width: 22, height: 22, color: '#4B5563' }} />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50 }} className="lg:hidden">
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} onClick={() => setMobileOpen(false)} />
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 260, background: 'white', boxShadow: '4px 0 20px rgba(0,0,0,0.1)' }} className="animate-slide-in-right">
            <button
              onClick={() => setMobileOpen(false)}
              style={{ position: 'absolute', top: 16, right: 16, padding: 4, background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}
              aria-label="Close menu"
            >
              <X style={{ width: 20, height: 20 }} />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex"
        style={{
          flexDirection: 'column',
          position: 'fixed', left: 0, top: 0, bottom: 0,
          width: 260, background: 'white',
          borderRight: '1px solid #F3F4F6', zIndex: 30,
        }}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
