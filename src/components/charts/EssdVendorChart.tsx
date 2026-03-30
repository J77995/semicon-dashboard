'use client';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { fmtQAxis } from '@/lib/formatQuarter';
import { enterpriseSsdVendors } from '@/data/industry/enterprise-ssd-vendors';

const VENDOR_COLORS: Record<string, string> = {
  Samsung:      '#2563EB',
  'SK Group':   '#DC2626',
  Micron:       '#10B981',
  Kioxia:       '#F59E0B',
  'SanDisk(WDC)': '#6B7280',
};

const VENDORS = ['Samsung', 'SK Group', 'Micron', 'Kioxia', 'SanDisk(WDC)'];

// Build one row per quarter: { quarter, Samsung: X, Samsung_share: Y, ... }
function buildChartData() {
  const quarters = [...new Set(
    enterpriseSsdVendors.filter(r => r.company !== 'Total').map(r => r.quarter)
  )];
  return quarters.map(q => {
    const row: Record<string, string | number> = { quarter: q };
    for (const v of VENDORS) {
      const entry = enterpriseSsdVendors.find(r => r.quarter === q && r.company === v);
      row[v] = entry?.revenueUsdM ?? 0;
      row[`${v}_share`] = entry?.marketSharePct ?? 0;
    }
    return row;
  });
}

const chartData = buildChartData();

export function EssdVendorChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
        <XAxis
          dataKey="quarter"
          tickFormatter={fmtQAxis}
          tick={{ fill: '#64748B', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={v => `$${(v / 1000).toFixed(1)}B`}
          tick={{ fill: '#64748B', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter={(v: any, name: any, props: any) => {
            const nameStr = String(name ?? '');
            const share = props?.payload?.[`${nameStr}_share`];
            const amt = Math.round(Number(v));
            const revenue = `$${amt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}M`;
            const shareTxt = share != null ? ` (${Number(share).toFixed(1)}%)` : '';
            return [`${revenue}${shareTxt}`, nameStr];
          }}
          contentStyle={{
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(0,0,0,0.12)',
            borderRadius: '8px',
            color: '#111827',
          }}
        />
        <Legend wrapperStyle={{ color: '#64748B', fontSize: '0.75rem' }} />
        {VENDORS.map((vendor, i) => (
          <Bar
            key={vendor}
            dataKey={vendor}
            stackId="a"
            fill={VENDOR_COLORS[vendor]}
            radius={i === VENDORS.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
