'use client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { fmtQAxis } from '@/lib/formatQuarter';

interface DataPoint { quarter: string; grossMargin: number; operatingMargin: number; }

export function MarginAreaChart({ data }: { data: DataPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
        <XAxis dataKey="quarter" tickFormatter={fmtQAxis} tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={v => `${v.toFixed(0)}%`} tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip
          formatter={(v, name) => [`${(v as number).toFixed(1)}%`, name === 'grossMargin' ? '매출총이익률' : '영업이익률']}
          contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '8px', color: '#111827' }}
        />
        <Legend formatter={(v) => v === 'grossMargin' ? '매출총이익률' : '영업이익률'} wrapperStyle={{ color: '#64748B', fontSize: '0.75rem' }} />
        <ReferenceLine y={0} stroke="rgba(0,0,0,0.15)" strokeDasharray="4 2" />
        <Area type="monotone" dataKey="grossMargin" stroke="#3B82F6" fill="rgba(59,130,246,0.15)" strokeWidth={2} />
        <Area type="monotone" dataKey="operatingMargin" stroke="#10B981" fill="rgba(16,185,129,0.1)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
