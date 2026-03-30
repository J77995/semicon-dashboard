'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fmtQAxis } from '@/lib/formatQuarter';

interface DataPoint { quarter: string; 매출액: number; 매출총이익: number; 영업이익: number; }

const LABELS: Record<string, string> = { 매출액: '매출액', 매출총이익: '매출총이익', 영업이익: '영업이익' };

export function RevenueBarChart({ data }: { data: DataPoint[] }) {
  const fmt = (v: number) => `${(v / 100).toFixed(0)}억 원`;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
        <XAxis dataKey="quarter" tickFormatter={fmtQAxis} tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={fmt} tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip
          formatter={(v, name) => [fmt(v as number), LABELS[name as string] ?? name]}
          contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '8px', color: '#111827' }}
        />
        <Legend formatter={(v) => LABELS[v] ?? v} wrapperStyle={{ color: '#64748B', fontSize: '0.75rem' }} />
        <Bar dataKey="매출액" fill="#DC2626" radius={[2, 2, 0, 0]} />
        <Bar dataKey="매출총이익" fill="#F97316" radius={[2, 2, 0, 0]} />
        <Bar dataKey="영업이익" fill="#6B7280" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
