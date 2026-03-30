'use client';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { fmtQAxis } from '@/lib/formatQuarter';

interface DataPoint {
  quarter: string;
  영업CF: number;
  투자CF: number;
  재무CF: number;
}

export function CashFlowBarChart({ data }: { data: DataPoint[] }) {
  const fmt = (v: number) => `${(v / 100).toFixed(0)}억 원`;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
        <XAxis dataKey="quarter" tickFormatter={fmtQAxis} tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={fmt} tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip
          formatter={(v, name) => [`${((v as number)/100).toFixed(0)}억 원`, name]}
          contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '8px', color: '#111827' }}
        />
        <Legend wrapperStyle={{ color: '#64748B', fontSize: '0.75rem' }} />
        <ReferenceLine y={0} stroke="rgba(0,0,0,0.15)" strokeDasharray="4 2" />
        <Bar dataKey="영업CF" fill="#DC2626" radius={[2, 2, 0, 0]} />
        <Bar dataKey="투자CF" fill="#F97316" radius={[2, 2, 0, 0]} />
        <Bar dataKey="재무CF" fill="#6B7280" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
