'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import type { StockMovement, Category } from '@/lib/api';
import { formatDateShort } from '@/lib/utils';

// ===== MOVEMENTS BAR CHART =====
interface MovementsChartProps {
  movements: StockMovement[];
}

const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.9)',
  border: '1px solid rgba(255,107,0,0.12)',
  borderRadius: 16,
  padding: 24,
  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
};

export function MovementsBarChart({ movements }: MovementsChartProps) {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    date.setHours(0, 0, 0, 0);
    return date;
  });

  const chartData = last7Days.map((date) => {
    const dayMovements = movements.filter((m) => {
      const mDate = new Date(m.createdAt);
      return (
        mDate.getDate() === date.getDate() &&
        mDate.getMonth() === date.getMonth() &&
        mDate.getFullYear() === date.getFullYear()
      );
    });

    const inQty = dayMovements.filter((m) => m.type === 'IN').reduce((sum, m) => sum + Math.abs(m.quantity), 0);
    const outQty = dayMovements.filter((m) => m.type === 'OUT').reduce((sum, m) => sum + Math.abs(m.quantity), 0);

    return { date: formatDateShort(date), IN: inQty, OUT: outQty };
  });

  return (
    <div style={cardStyle}>
      <h3 style={{ fontWeight: 700, fontSize: 16, color: '#1F2937', marginBottom: 20 }}>Stock Movements — 7 Hari Terakhir</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 13, fill: '#6B7280' }} />
          <YAxis tick={{ fontSize: 13, fill: '#6B7280' }} />
          <Tooltip
            contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontSize: 13 }}
          />
          <Legend wrapperStyle={{ fontSize: 13 }} />
          <Bar dataKey="IN" fill="#10B981" radius={[4, 4, 0, 0]} name="Stock In" />
          <Bar dataKey="OUT" fill="#EF4444" radius={[4, 4, 0, 0]} name="Stock Out" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ===== CATEGORY DONUT CHART =====
const COLORS = ['#FF6B00', '#FF8C33', '#FFB366', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B'];

interface CategoryChartProps {
  categories: Category[];
}

export function CategoryDonutChart({ categories }: CategoryChartProps) {
  const chartData = categories
    .filter((c) => (c._count?.products || 0) > 0)
    .map((c) => ({ name: c.name, value: c._count?.products || 0 }));

  if (chartData.length === 0) {
    return (
      <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 340 }}>
        <p style={{ color: '#9CA3AF', fontSize: 14 }}>Belum ada data kategori</p>
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      <h3 style={{ fontWeight: 700, fontSize: 16, color: '#1F2937', marginBottom: 20 }}>Distribusi Produk per Kategori</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: 12, fontSize: 13 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
