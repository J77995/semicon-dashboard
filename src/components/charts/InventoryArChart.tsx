'use client';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { fmtQAxis } from '@/lib/formatQuarter';

interface InventoryArPoint {
  quarter: string;
  재고자산: number;
  매출채권: number;
  재고자산회전율: number;
  매출채권회전율: number;
}

export function InventoryArChart({ data }: { data: InventoryArPoint[] }) {
  const fmtLeft = (v: number) => `${(v / 100).toFixed(0)}억`;
  const fmtRight = (v: number) => `${v.toFixed(1)}회`;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 5, right: 40, bottom: 5, left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
        <XAxis dataKey="quarter" tickFormatter={fmtQAxis} tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis
          yAxisId="left"
          tickFormatter={fmtLeft}
          tick={{ fill: '#64748B', fontSize: 11 }}
          axisLine={false} tickLine={false}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tickFormatter={fmtRight}
          tick={{ fill: '#64748B', fontSize: 11 }}
          axisLine={false} tickLine={false}
          domain={[0, 'auto']}
        />
        <Tooltip
          formatter={(v, name) => {
            if (name === '재고자산' || name === '매출채권')
              return [`${((v as number) / 100).toFixed(0)}억 원`, name as string];
            return [`${(v as number).toFixed(2)}회`, name as string];
          }}
          contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '8px', color: '#111827' }}
        />
        <Legend wrapperStyle={{ color: '#64748B', fontSize: '0.72rem' }} />
        <Bar yAxisId="left" dataKey="매출채권" fill="#FCA5A5" radius={[2, 2, 0, 0]} barSize={20} />
        <Bar yAxisId="left" dataKey="재고자산" fill="#93C5FD" radius={[2, 2, 0, 0]} barSize={20} />
        <Line yAxisId="right" dataKey="매출채권회전율" type="monotone" stroke="#EF4444" strokeWidth={2} dot={{ r: 3, fill: '#EF4444' }} />
        <Line yAxisId="right" dataKey="재고자산회전율" type="monotone" stroke="#2563EB" strokeWidth={2} dot={{ r: 3, fill: '#2563EB' }} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
