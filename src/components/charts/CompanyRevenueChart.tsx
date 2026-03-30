'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { fmtQAxis } from '@/lib/formatQuarter';

interface DataPoint { quarter: string; revenue: number; }

export function CompanyRevenueChart({ data, currency = 'USD' }: { data: DataPoint[]; currency?: 'USD' | 'KRW' }) {
  const fmt = (v: number) => currency === 'USD' ? `$${(v/1000).toFixed(0)}B` : `${(v/100000).toFixed(1)}조`;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
        <XAxis dataKey="quarter" tickFormatter={fmtQAxis} tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={fmt} tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip
          formatter={(v) => [currency === 'USD' ? `$${((v as number)/1000).toFixed(1)}B` : `${((v as number)/10000).toFixed(0)}억원`, '매출']}
          contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '8px', color: '#111827' }}
        />
        <Bar dataKey="revenue" radius={[4, 4, 0, 0]} fill="#2563EB">
          {data.map((_, i) => <Cell key={i} fill={i === data.length - 1 ? '#3B82F6' : '#1E3A5F'} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
