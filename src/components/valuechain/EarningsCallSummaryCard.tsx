'use client';

import React, { useState } from 'react';

interface CallEntry {
  ticker: string;
  company: string;
  fiscalLabel: string;
  callDate: string;
  periodEndMonth: string;
  summary?: string;
}

interface Props {
  call: CallEntry;
}

/** "**text**" → <strong>text</strong>, 나머지는 텍스트 노드 */
function parseBold(line: string): React.ReactNode[] {
  const parts = line.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith('**') && p.endsWith('**')
      ? <strong key={i}>{p.slice(2, -2)}</strong>
      : p
  );
}

/** summary 마크다운 → JSX 불렛 리스트 */
function renderSummary(text: string) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {lines.map((line, i) => {
        const content = line.replace(/^\*\s*/, '');
        return (
          <li key={i} style={{ display: 'flex', gap: '6px', fontSize: '0.8rem', color: '#374151', lineHeight: 1.6 }}>
            <span style={{ color: '#2563EB', flexShrink: 0, marginTop: '1px' }}>•</span>
            <span>{parseBold(content)}</span>
          </li>
        );
      })}
    </ul>
  );
}

export default function EarningsCallSummaryCard({ call }: Props) {
  const hasSummary = !!call.summary;
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: `1px solid ${hovered ? 'rgba(37,99,235,0.4)' : '#E5E7EB'}`,
        borderLeft: `3px solid ${hovered ? '#1D4ED8' : '#2563EB'}`,
        borderRadius: '0 6px 6px 0',
        padding: '14px 16px',
        backgroundColor: hovered ? '#EFF6FF' : '#FFFFFF',
        cursor: 'pointer',
        transition: 'background-color 0.15s, border-color 0.15s',
        boxShadow: hovered ? '0 2px 8px rgba(37,99,235,0.12)' : 'none',
      }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: hasSummary ? '10px' : '0' }}>
        <span style={{
          backgroundColor: 'rgba(37,99,235,0.12)',
          color: '#2563EB',
          fontSize: '0.85rem',
          fontWeight: 700,
          padding: '3px 10px',
          borderRadius: '4px',
        }}>
          {call.fiscalLabel}
        </span>
        <span style={{ fontSize: '0.82rem', color: '#374151', fontWeight: 500 }}>{call.callDate}</span>
        {!hasSummary && (
          <span style={{ fontSize: '0.72rem', color: '#F59E0B', marginLeft: 'auto' }}>(내용요약)</span>
        )}
      </div>

      {/* Summary */}
      {hasSummary
        ? renderSummary(call.summary!)
        : null
      }
    </div>
  );
}
