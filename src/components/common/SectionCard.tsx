'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface SectionCardProps {
  href: string;
  title: string;
  subtitle: string;
  icon: string;
  metrics: Array<{ label: string; value: string; delta?: number }>;
  accentColor?: string;
}

export function SectionCard({ href, title, subtitle, icon, metrics, accentColor = '#2563EB' }: SectionCardProps) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid rgba(0,0,0,0.09)',
        borderRadius: '16px',
        padding: '24px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        height: '100%',
        borderTop: `3px solid ${accentColor}`,
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = accentColor)}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.09)')}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '1.25rem', marginBottom: '4px' }}>{icon}</div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: 0 }}>{title}</h3>
            <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '2px 0 0' }}>{subtitle}</p>
          </div>
          <ArrowRight size={16} style={{ color: '#64748B', marginTop: '4px' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {metrics.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{m.label}</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>{m.value}</span>
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}
