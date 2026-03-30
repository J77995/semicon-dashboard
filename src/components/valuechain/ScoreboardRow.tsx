import Link from 'next/link';
import { DeltaBadge } from '@/components/common/DeltaBadge';
import { QuarterlyMetrics } from '@/types/company';

interface ScoreboardRowProps {
  slug: string;
  nameKR: string;
  nameEN: string;
  metrics: QuarterlyMetrics | undefined;
  growthMode: 'YoY' | 'QoQ';
}

function MarginCell({ value }: { value: number | undefined }) {
  if (value === undefined || value === null) {
    return <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>-</span>;
  }
  const color = value >= 20 ? '#10B981' : value >= 0 ? '#374151' : '#EF4444';
  return (
    <span style={{ color, fontSize: '0.8rem', fontWeight: 600 }}>
      {value.toFixed(1)}%
    </span>
  );
}

export function ScoreboardRow({ slug, nameKR, nameEN, metrics, growthMode }: ScoreboardRowProps) {
  const growthValue = metrics
    ? (growthMode === 'YoY' ? metrics.revenueGrowthYoY : metrics.revenueGrowthQoQ)
    : undefined;

  return (
    <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
      {/* Company name */}
      <td style={{ padding: '10px 16px', minWidth: '140px' }}>
        <Link href={`/valuechain/${slug}`} style={{ textDecoration: 'none' }}>
          <span style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>
            {nameKR}
          </span>
          <span style={{ display: 'block', fontSize: '0.72rem', color: '#94A3B8', marginTop: '1px' }}>
            {nameEN}
          </span>
        </Link>
      </td>

      {/* Revenue Growth */}
      <td style={{ padding: '10px 16px', textAlign: 'center' }}>
        {growthValue !== undefined ? (
          <DeltaBadge value={growthValue} size="sm" />
        ) : (
          <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>-</span>
        )}
      </td>

      {/* Gross Margin */}
      <td style={{ padding: '10px 16px', textAlign: 'center' }}>
        <MarginCell value={metrics?.grossMargin} />
      </td>

      {/* Operating Margin */}
      <td style={{ padding: '10px 16px', textAlign: 'center' }}>
        <MarginCell value={metrics?.operatingMargin} />
      </td>

      {/* Net Margin */}
      <td style={{ padding: '10px 16px', textAlign: 'center' }}>
        <MarginCell value={metrics?.netMargin} />
      </td>
    </tr>
  );
}
