'use client';
import { useState } from 'react';

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  height?: number;
  children: React.ReactNode;
  clickable?: boolean;
}

export function ChartContainer({ title, subtitle, height = 320, children, clickable }: ChartContainerProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={clickable ? () => setHovered(true) : undefined}
      onMouseLeave={clickable ? () => setHovered(false) : undefined}
      style={{
        backgroundColor: '#FFFFFF',
        border: `1px solid ${hovered ? 'rgba(220,38,38,0.4)' : 'rgba(0,0,0,0.09)'}`,
        borderRadius: '12px',
        padding: '20px',
        transition: 'border-color 0.15s',
      }}>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', margin: 0 }}>{title}</h3>
        {subtitle && <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '3px 0 0' }}>{subtitle}</p>}
      </div>
      <div style={{ height }}>
        {children}
      </div>
    </div>
  );
}
