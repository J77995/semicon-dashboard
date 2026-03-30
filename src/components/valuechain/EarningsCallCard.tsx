import { EarningsCall } from '@/types/company';
import { fmtQ } from '@/lib/formatQuarter';

interface EarningsCallCardProps {
  call: EarningsCall;
}

const TONE_STYLES: Record<EarningsCall['tone'], { color: string; bg: string; label: string }> = {
  낙관: { color: '#10B981', bg: 'rgba(16,185,129,0.12)', label: '낙관적' },
  중립: { color: '#64748B', bg: 'rgba(100,116,139,0.12)', label: '중립적' },
  신중: { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', label: '신중' },
};

export function EarningsCallCard({ call }: EarningsCallCardProps) {
  const tone = TONE_STYLES[call.tone];

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      border: '1px solid rgba(0,0,0,0.09)',
      borderLeft: '3px solid #2563EB',
      borderRadius: '0 8px 8px 0',
      padding: '16px 20px',
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
        <span style={{
          backgroundColor: 'rgba(37,99,235,0.15)',
          color: '#2563EB',
          fontSize: '0.75rem',
          fontWeight: 700,
          padding: '3px 10px',
          borderRadius: '4px',
          letterSpacing: '0.03em',
        }}>
          {fmtQ(call.quarter)}
        </span>
        <span style={{ fontSize: '0.8rem', color: '#64748B' }}>{call.date}</span>
        <span style={{
          backgroundColor: tone.bg,
          color: tone.color,
          fontSize: '0.72rem',
          fontWeight: 600,
          padding: '2px 8px',
          borderRadius: '4px',
          marginLeft: 'auto',
        }}>
          {call.tone} ({tone.label})
        </span>
      </div>

      {/* Highlights */}
      <ul style={{ margin: 0, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {call.highlights.map((highlight, i) => (
          <li key={i} style={{ fontSize: '0.85rem', color: '#374151', lineHeight: 1.6 }}>
            {highlight}
          </li>
        ))}
      </ul>

      {/* Guidance */}
      {call.guidance && (
        <div style={{
          marginTop: '12px',
          padding: '10px 14px',
          backgroundColor: 'rgba(37,99,235,0.08)',
          borderRadius: '6px',
          border: '1px solid rgba(37,99,235,0.2)',
        }}>
          <span style={{ fontSize: '0.72rem', color: '#2563EB', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: '6px' }}>
            가이던스
          </span>
          <span style={{ fontSize: '0.83rem', color: '#1D4ED8' }}>{call.guidance}</span>
        </div>
      )}
    </div>
  );
}
