'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DramSpotPoint } from '@/data/industry/dram-spot-prices';

export function DramSpotChart({ data }: { data: DramSpotPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
        <XAxis
          dataKey="yearMonth"
          tick={{ fill: '#64748B', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          interval={1}
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
        <Line type="monotone" dataKey="ddr5_16Gb" name="DDR5 16Gb (2Gx8) 4800/5600" stroke="#DC2626" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="ddr4_16Gb" name="DDR4 16Gb (2Gx8) 3200" stroke="#2563EB" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="ddr3_4Gb"  name="DDR3 4Gb 512Mx8 1600/1866" stroke="#6B7280" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
