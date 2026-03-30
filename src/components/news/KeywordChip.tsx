'use client';

import { useState } from 'react';

interface KeywordChipProps {
  keyword: string;
  active: boolean;
  onClick: (keyword: string) => void;
}

export function KeywordChip({ keyword, active, onClick }: KeywordChipProps) {
  const [hovered, setHovered] = useState(false);

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    paddingLeft: '10px',
    paddingRight: '10px',
    paddingTop: '5px',
    paddingBottom: '5px',
    borderRadius: '9999px',
    fontSize: '0.8rem',
    fontWeight: 500,
    cursor: 'pointer',
    border: '1px solid',
    transition: 'background-color 0.15s, border-color 0.15s, color 0.15s',
    userSelect: 'none',
    whiteSpace: 'nowrap',
  };

  const activeStyle: React.CSSProperties = {
    ...baseStyle,
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
    color: '#FFFFFF',
  };

  const inactiveStyle: React.CSSProperties = {
    ...baseStyle,
    backgroundColor: hovered ? 'rgba(37,99,235,0.12)' : '#EEF2F7',
    borderColor: hovered ? 'rgba(37,99,235,0.5)' : 'rgba(0,0,0,0.12)',
    color: hovered ? '#2563EB' : '#64748B',
  };

  return (
    <button
      onClick={() => onClick(keyword)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={active ? activeStyle : inactiveStyle}
    >
      #{keyword}
    </button>
  );
}
