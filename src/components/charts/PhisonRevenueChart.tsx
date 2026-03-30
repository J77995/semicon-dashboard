'use client';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import phisonData from '@/data/industry/phison-monthly.json';

// 단위: 千元(TWD) → 億元(TWD) = ÷100,000
const fmt = (v: number) => `${(v / 100000).toFixed(0)}億`;

// YoY 계산: 12개월 전 대비
const dataWithYoY = phisonData.map((d, i) => {
  const prev = phisonData[i - 12];
  const yoy = prev ? ((d.revenue - prev.revenue) / prev.revenue) * 100 : null;
  return { ...d, yoy };
});

// 커스텀 X축 tick: 매년 1월만 연도 표시
function CustomTick({ x, y, payload }: { x?: number; y?: number; payload?: { value: string } }) {
  const month = payload?.value ?? '';
  if (!month.endsWith('-01')) return null;
  return (
    <text x={x} y={(y ?? 0) + 12} textAnchor="middle" fill="#64748B" fontSize={10}>
      {month.slice(0, 4)}
    </text>
  );
}

const displayData = dataWithYoY;

export function PhisonRevenueChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={displayData} margin={{ top: 5, right: 50, bottom: 5, left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
        <XAxis
          dataKey="month"
          tick={<CustomTick />}
          axisLine={false} tickLine={false}
          interval={0}
        />
        <YAxis
          yAxisId="left"
          tickFormatter={fmt}
          tick={{ fill: '#64748B', fontSize: 11 }}
          axisLine={false} tickLine={false}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tickFormatter={v => `${v.toFixed(0)}%`}
          tick={{ fill: '#64748B', fontSize: 11 }}
          axisLine={false} tickLine={false}
          domain={[-80, 100]}
        />
        <Tooltip
          formatter={(v, name) => {
            if (name === '월매출') return [`${fmt(v as number)}元`, name];
            if (v === null) return ['—', name];
            return [`${(v as number).toFixed(1)}%`, name];
          }}
          labelFormatter={(label) => label}
          contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '8px', color: '#111827', fontSize: '0.78rem' }}
        />
        <ReferenceLine yAxisId="right" y={0} stroke="rgba(0,0,0,0.15)" strokeDasharray="4 2" />
        <Bar yAxisId="left" dataKey="revenue" name="월매출" fill="#2563EB" fillOpacity={0.75} radius={[2, 2, 0, 0]} maxBarSize={18} />
        <Line yAxisId="right" dataKey="yoy" name="YoY %" type="monotone" stroke="#EF4444" strokeWidth={2} dot={false} connectNulls />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
