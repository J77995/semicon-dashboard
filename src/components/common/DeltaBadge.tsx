interface DeltaBadgeProps {
  value: number;
  suffix?: string;
  size?: 'sm' | 'md';
}

export function DeltaBadge({ value, suffix = '%', size = 'sm' }: DeltaBadgeProps) {
  if (value === null || value === undefined || isNaN(value)) {
    return <span style={{ color: '#94A3B8', fontSize: size === 'sm' ? '0.75rem' : '0.875rem' }}>-</span>;
  }
  const isPositive = value >= 0;
  const color = isPositive ? '#22C55E' : '#F97316';
  const fontSize = size === 'sm' ? '0.75rem' : '0.875rem';
  return (
    <span style={{
      color,
      fontSize,
      fontWeight: 600,
      backgroundColor: isPositive ? 'rgba(34,197,94,0.1)' : 'rgba(249,115,22,0.1)',
      padding: '2px 6px',
      borderRadius: '4px',
      whiteSpace: 'nowrap',
    }}>
      {isPositive ? '▲' : '▼'} {Math.abs(value).toFixed(1)}{suffix}
    </span>
  );
}
