'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { NandSpotPoint } from '@/data/industry/nand-spot-prices';

export function NandSpotChart({ data }: { data: NandSpotPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
        <XAxis
          dataKey="yearMonth"
          tick={{ fill: '#64748B', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          interval={3}
        />
        <YAxis
          tickFormatter={v => `$${v}`}
          tick={{ fill: '#64748B', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          formatter={(v: unknown, name) => [`$${(v as number).toFixed(2)}`, name ?? '']}
          contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '8px', color: '#111827' }}
        />
        <Legend wrapperStyle={{ color: '#64748B', fontSize: '0.75rem' }} />
        <Line type="monotone" dataKey="spot"     name="NAND 1Tb QLC Spot"     stroke="#F97316" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="contract" name="NAND 1Tb QLC Contract" stroke="#2563EB" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
