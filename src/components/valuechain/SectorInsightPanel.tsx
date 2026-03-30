'use client';

import React, { useState } from 'react';

function parseBold(line: string): React.ReactNode[] {
  const parts = line.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith('**') && p.endsWith('**')
      ? <strong key={i}>{p.slice(2, -2)}</strong>
      : p
  );
}

function renderInsight(text: string) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {lines.map((line, i) => {
        const content = line.replace(/^\*\s*/, '');
        return (
          <li key={i} style={{ display: 'flex', gap: '8px', fontSize: '0.82rem', color: '#374151', lineHeight: 1.65 }}>
            <span style={{ color: '#2563EB', flexShrink: 0, marginTop: '2px' }}>•</span>
            <span>{parseBold(content)}</span>
          </li>
        );
      })}
    </ul>
  );
}

interface Props {
  group: string;
  insight: string | undefined;
  defaultOpen?: boolean;
}

export default function SectorInsightPanel({ group, insight, defaultOpen = true }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={{
      border: '1px solid #E5E7EB',
      borderRadius: '6px',
      overflow: 'hidden',
      backgroundColor: '#FFFFFF',
    }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          backgroundColor: open ? '#EFF6FF' : '#F8FAFC',
          border: 'none',
          borderBottom: open ? '1px solid #DBEAFE' : 'none',
          cursor: 'pointer',
          transition: 'background-color 0.15s',
        }}
      >
        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1E3A5F' }}>{group}</span>
        <span style={{ fontSize: '0.62rem', color: '#6B7280' }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div style={{ padding: '12px 16px' }}>
          {insight
            ? renderInsight(insight)
            : (
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#9CA3AF', fontStyle: 'italic' }}>
                해당 분기 데이터 없음
              </p>
            )
          }
        </div>
      )}
    </div>
  );
}
