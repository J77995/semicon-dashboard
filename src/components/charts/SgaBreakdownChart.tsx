'use client';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { fmtQAxis } from '@/lib/formatQuarter';

interface SgaBreakdownPoint {
  quarter: string;
  급여: number;
  퇴직급여: number;
  복리후생비: number;
  경상연구개발비: number;
  감가상각비: number;
  지급수수료: number;
  기타: number;
}

const COLORS: Record<string, string> = {
  경상연구개발비: '#2563EB',
  급여:          '#EF4444',
  복리후생비:    '#10B981',
  퇴직급여:      '#FCA5A5',
  지급수수료:    '#93C5FD',
  감가상각비:    '#6EE7B7',
  기타:          '#CBD5E1',
};

const ORDER = ['경상연구개발비', '급여', '복리후생비', '퇴직급여', '지급수수료', '감가상각비', '기타'] as const;

export function SgaBreakdownChart({ data }: { data: SgaBreakdownPoint[] }) {
  const fmt = (v: number) => `${(v / 100).toFixed(0)}억 원`;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }} barCategoryGap="25%">
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
        <XAxis dataKey="quarter" tickFormatter={fmtQAxis} tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={fmt} tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip
          formatter={(v, name) => [fmt(v as number), name as string]}
          contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '8px', color: '#111827' }}
        />
        <Legend wrapperStyle={{ color: '#64748B', fontSize: '0.72rem' }} />
        {ORDER.map(key => (
          <Bar key={key} dataKey={key} stackId="sga" fill={COLORS[key]} radius={key === '기타' ? [3, 3, 0, 0] : [0, 0, 0, 0]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
