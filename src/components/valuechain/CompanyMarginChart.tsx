'use client';

import {
  LineChart,
  Line,
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
};

export default function CompanyMarginChart({ quarters }: Props) {
  const data = quarters.map((q) => ({
    period: q.periodEndMonth,
    매출총이익률: q.items['매출총이익률'] ?? null,
    영업이익률: q.items['영업이익률'] ?? null,
  }));

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
        이익률 추이
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 4, right: 16, left: 16, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
          <XAxis
            dataKey="period"
            tick={{ fontSize: 11, fill: '#6B7280' }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#6B7280' }}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            formatter={(value: unknown, name: unknown) => [
              value != null ? `${(value as number).toFixed(1)}%` : 'N/A',
              String(name ?? ''),
            ]}
            contentStyle={{
              fontSize: 12,
              border: '1px solid #E5E7EB',
              borderRadius: 6,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
          <Line
            type="monotone"
            dataKey="매출총이익률"
            stroke="#10B981"
            strokeWidth={2}
            dot={{ r: 3, fill: '#10B981' }}
            activeDot={{ r: 5 }}
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="영업이익률"
            stroke="#F59E0B"
            strokeWidth={2}
            dot={{ r: 3, fill: '#F59E0B' }}
            activeDot={{ r: 5 }}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
