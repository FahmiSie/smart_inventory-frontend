'use client';

import { StockMovement } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import { ArrowUpCircle, ArrowDownCircle, Image } from 'lucide-react';

const thStyle: React.CSSProperties = {
  textAlign: 'left', padding: '12px 20px', fontSize: 12, fontWeight: 600,
  letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6B7280',
};

const tdStyle: React.CSSProperties = { padding: '14px 20px', fontSize: 14 };

interface MovementsTableProps { movements: StockMovement[]; }

export default function MovementsTable({ movements }: MovementsTableProps) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,107,0,0.12)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
              <th style={thStyle}>Tanggal</th>
              <th style={thStyle}>Produk</th>
              <th style={thStyle}>SKU</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Tipe</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Qty</th>
              <th style={thStyle}>Alasan</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Bukti</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((m) => (
              <tr key={m.id} style={{ borderBottom: '1px solid #FAFAFA', transition: 'background 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,107,0,0.03)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ ...tdStyle, color: '#6B7280' }}>{formatDate(m.createdAt)}</td>
                <td style={tdStyle}><span style={{ fontWeight: 600, color: '#1F2937' }}>{m.product?.name || '-'}</span></td>
                <td style={{ ...tdStyle, fontFamily: 'monospace', color: '#6B7280' }}>{m.product?.sku || '-'}</td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>
                  <Badge variant={m.type === 'IN' ? 'success' : 'danger'}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      {m.type === 'IN' ? <ArrowUpCircle style={{ width: 12, height: 12 }} /> : <ArrowDownCircle style={{ width: 12, height: 12 }} />}
                      {m.type}
                    </span>
                  </Badge>
                </td>
                <td style={{ ...tdStyle, textAlign: 'right' }}>
                  <span style={{ fontWeight: 700, color: m.type === 'IN' ? '#059669' : '#DC2626' }}>
                    {m.type === 'IN' ? '+' : ''}{m.quantity}
                  </span>
                </td>
                <td style={{ ...tdStyle, color: '#4B5563' }}>{m.reason}</td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>
                  {m.evidencePath ? (
                    <a href={`http://localhost:3000${m.evidencePath}`} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#FF6B00', textDecoration: 'none' }}
                    >
                      <Image style={{ width: 14, height: 14 }} /> Lihat
                    </a>
                  ) : <span style={{ fontSize: 13, color: '#9CA3AF' }}>-</span>}
                </td>
              </tr>
            ))}
            {movements.length === 0 && (
              <tr><td colSpan={7} style={{ padding: '48px 20px', textAlign: 'center', fontSize: 14, color: '#9CA3AF' }}>Belum ada riwayat mutasi stok</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
