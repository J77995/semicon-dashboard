'use client';

import { useState } from 'react';
import { fmtQ, fmtQMonth } from '@/lib/formatQuarter';
import { FADU_PERIOD_END_MONTHS } from '@/data/fadu/period-end-months';

interface TableRow {
  item: string;
  values: Record<string, number>;
  isBold?: boolean;
  isSubItem?: boolean;
}

interface FinancialTableProps {
  rows: TableRow[];
  quarters: string[];
  formatFn?: (v: number) => string;
  expandableRows?: Record<string, TableRow[]>;
}

export function FinancialTable({ rows, quarters, formatFn, expandableRows }: FinancialTableProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const defaultFormat = (v: number) => {
    if (v === 0) return '-';
    return v.toLocaleString('ko-KR');
  };
  const fmt = formatFn || defaultFormat;

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
        <thead>
          <tr style={{ backgroundColor: '#F7F8FA' }}>
            <th style={{
              position: 'sticky', left: 0, zIndex: 1,
              backgroundColor: '#F7F8FA', textAlign: 'left',
              padding: '10px 16px', color: '#64748B',
              fontSize: '0.82rem', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.05em',
              borderBottom: '1px solid rgba(0,0,0,0.09)',
              minWidth: '160px',
            }}>항목</th>
            {quarters.map(q => (
              <th key={q} style={{
                padding: '10px 12px', textAlign: 'right',
                color: '#64748B', fontSize: '0.82rem', fontWeight: 600,
                borderBottom: '1px solid rgba(0,0,0,0.09)',
                minWidth: '90px',
              }}>
                <div>{fmtQ(q)}</div>
                <div style={{ fontSize: '0.7rem', fontWeight: 400, color: '#94A3B8' }}>{fmtQMonth(q, FADU_PERIOD_END_MONTHS)}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => {
            const hasExpand = !!expandableRows?.[row.item];
            const isExpanded = expanded[row.item] ?? false;
            const subRows = expandableRows?.[row.item] ?? [];

            return (
              <>
                <tr
                  key={idx}
                  style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', cursor: hasExpand ? 'pointer' : undefined }}
                  onClick={hasExpand ? () => setExpanded(s => ({ ...s, [row.item]: !s[row.item] })) : undefined}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = hasExpand ? 'rgba(37,99,235,0.07)' : 'rgba(37,99,235,0.05)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{
                    position: 'sticky', left: 0, zIndex: 1,
                    backgroundColor: '#FFFFFF',
                    padding: '8px 16px',
                    color: row.isBold ? '#111827' : '#374151',
                    fontWeight: row.isBold ? 700 : 400,
                    fontSize: row.isSubItem ? '0.75rem' : '0.8rem',
                    paddingLeft: row.isSubItem ? '28px' : '16px',
                  }}>
                    {hasExpand && (
                      <span style={{
                        display: 'inline-block',
                        fontSize: '0.55rem',
                        marginRight: '5px',
                        color: '#94A3B8',
                        transition: 'transform 0.15s',
                        transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                        verticalAlign: 'middle',
                      }}>▶</span>
                    )}
                    {row.item}
                  </td>
                  {quarters.map(q => {
                    const val = row.values[q] ?? 0;
                    const isNeg = val < 0;
                    return (
                      <td key={q} style={{
                        padding: '8px 12px', textAlign: 'right',
                        color: isNeg ? '#EF4444' : val === 0 ? '#94A3B8' : '#111827',
                        fontWeight: row.isBold ? 600 : 400,
                        fontVariantNumeric: 'tabular-nums',
                      }}>{fmt(val)}</td>
                    );
                  })}
                </tr>

                {isExpanded && subRows.map((sub, si) => {
                  const isBoldSub = sub.isBold ?? false;
                  return (
                    <tr key={`${idx}-sub-${si}`} style={{
                      borderBottom: '1px solid rgba(0,0,0,0.04)',
                      backgroundColor: isBoldSub ? 'rgba(37,99,235,0.04)' : 'rgba(0,0,0,0.015)',
                    }}>
                      <td style={{
                        position: 'sticky', left: 0, zIndex: 1,
                        backgroundColor: isBoldSub ? 'rgba(37,99,235,0.04)' : 'rgba(248,249,251,0.98)',
                        padding: '5px 16px 5px 36px',
                        color: isBoldSub ? '#111827' : '#64748B',
                        fontWeight: isBoldSub ? 600 : 400,
                        fontSize: '0.72rem',
                        whiteSpace: 'nowrap',
                      }}>
                        {sub.item}
                      </td>
                      {quarters.map(q => {
                        const val = sub.values[q] ?? 0;
                        return (
                          <td key={q} style={{
                            padding: '5px 12px', textAlign: 'right',
                            color: val < 0 ? '#EF4444' : val === 0 ? '#D1D5DB' : isBoldSub ? '#111827' : '#64748B',
                            fontWeight: isBoldSub ? 600 : 400,
                            fontSize: '0.72rem',
                            fontVariantNumeric: 'tabular-nums',
                          }}>{val === 0 ? '-' : val.toLocaleString('ko-KR')}</td>
                        );
                      })}
                    </tr>
                  );
                })}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
