import { DeltaBadge } from './DeltaBadge';

interface MetricCardProps {
  label: string;
  value: string;
  delta?: number;
  deltaLabel?: string;
  highlight?: boolean;
}

export function MetricCard({ label, value, delta, deltaLabel, highlight }: MetricCardProps) {
  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      border: `1px solid ${highlight ? 'rgba(220,38,38,0.4)' : 'rgba(0,0,0,0.08)'}`,
      borderRadius: '12px',
      padding: '16px 20px',
    }}>
      <div style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </div>
      <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#111827', marginBottom: '6px' }}>
        {value}
      </div>
      {delta !== undefined && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <DeltaBadge value={delta} />
          {deltaLabel && <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{deltaLabel}</span>}
        </div>
      )}
    </div>
  );
}
