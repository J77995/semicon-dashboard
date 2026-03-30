'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

type QuarterRow = {
  periodEndMonth: string;
  fiscalLabel: string;
  displayLabel: string;
  items: Record<string, number | null>;
};

type Props = {
  quarters: QuarterRow[];
  currency: string;
  unit: string;
};

function formatValue(value: number | null | undefined): string {
  if (value == null) return 'N/A';
  return value.toLocaleString();
}

export default function CompanyPnLChart({ quarters, currency, unit }: Props) {
  const data = quarters.map((q) => ({
    period: q.periodEndMonth,
    매출액: q.items['매출액'] ?? null,
    매출총이익: q.items['매출총이익'] ?? null,
    영업이익: q.items['영업이익'] ?? null,
  }));

  const yAxisLabel = unit ? `(${unit})` : '';

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #E5E7EB',
        borderRadius: 8,
        padding: 16,
      }}
    >
      <div
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: '#111827',
          marginBottom: 12,
        }}
      >
        분기별 손익
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 4, right: 16, left: 16, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
          <XAxis
            dataKey="period"
            tick={{ fontSize: 11, fill: '#6B7280' }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#6B7280' }}
            label={{
              value: yAxisLabel,
              angle: -90,
              position: 'insideLeft',
              offset: -4,
              style: { fontSize: 11, fill: '#6B7280' },
            }}
            tickFormatter={(v) => v.toLocaleString()}
          />
          <Tooltip
            formatter={(value: unknown, name: unknown) => [
              formatValue(value as number | null),
              String(name ?? ''),
            ]}
            contentStyle={{
              fontSize: 12,
              border: '1px solid #E5E7EB',
              borderRadius: 6,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
          <Bar dataKey="매출액" fill="#3B82F6" radius={[2, 2, 0, 0]} />
          <Bar dataKey="매출총이익" fill="#10B981" radius={[2, 2, 0, 0]} />
          <Bar dataKey="영업이익" fill="#F59E0B" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
