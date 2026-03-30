'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { fmtQAxis } from '@/lib/formatQuarter';

interface DataPoint { quarter: string; operating: number; net: number; }

export function ProfitLineChart({ data }: { data: DataPoint[] }) {
  const fmt = (v: number) => `${(v / 100).toFixed(0)}억 원`;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
        <XAxis dataKey="quarter" tickFormatter={fmtQAxis} tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={fmt} tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip
          formatter={(v, name) => [`${((v as number)/100).toFixed(0)}억 원`, name === 'operating' ? '영업이익' : '순이익']}
          contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '8px', color: '#111827' }}
        />
        <Legend formatter={(v) => v === 'operating' ? '영업이익' : '순이익'} wrapperStyle={{ color: '#64748B', fontSize: '0.75rem' }} />
        <ReferenceLine y={0} stroke="rgba(0,0,0,0.15)" strokeDasharray="4 2" />
        <Line type="monotone" dataKey="operating" stroke="#DC2626" strokeWidth={2} dot={{ fill: '#DC2626', r: 3 }} />
        <Line type="monotone" dataKey="net" stroke="#22C55E" strokeWidth={2} dot={{ fill: '#22C55E', r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
