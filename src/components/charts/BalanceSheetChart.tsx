'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fmtQAxis } from '@/lib/formatQuarter';

interface DataPoint { quarter: string; assets: number; liabilities: number; equity: number; }

export function BalanceSheetChart({ data }: { data: DataPoint[] }) {
  const fmt = (v: number) => `${(v / 100).toFixed(0)}억 원`;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
        <XAxis dataKey="quarter" tickFormatter={fmtQAxis} tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={fmt} tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip
          formatter={(v, name) => {
            const labels: Record<string, string> = { assets: '자산총계', liabilities: '부채총계', equity: '자본총계' };
            const nameStr = String(name);
            return [`${((v as number)/100).toFixed(0)}억 원`, labels[nameStr] || nameStr];
          }}
          contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '8px', color: '#111827' }}
        />
        <Legend formatter={(v) => ({ assets: '자산총계', liabilities: '부채총계', equity: '자본총계' } as Record<string, string>)[v] || v} wrapperStyle={{ color: '#64748B', fontSize: '0.75rem' }} />
        <Bar dataKey="assets" fill="#2563EB" radius={[3, 3, 0, 0]} opacity={0.8} />
        <Bar dataKey="liabilities" fill="#10B981" radius={[3, 3, 0, 0]} opacity={0.8} />
        <Bar dataKey="equity" fill="#F59E0B" radius={[3, 3, 0, 0]} opacity={0.8} />
      </BarChart>
    </ResponsiveContainer>
  );
}
