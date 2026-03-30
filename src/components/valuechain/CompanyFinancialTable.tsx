'use client';

// ── Types ─────────────────────────────────────────────────────────────────────
export type QuarterRow = {
  periodEndMonth: string;
  fiscalLabel: string;
  displayLabel: string;
  items: Record<string, number | null>;
};

type Props = {
  quarters: QuarterRow[]; // last 8, oldest → newest
  currency: string;
  unit: string;
};

// ── Row definitions ───────────────────────────────────────────────────────────
type RowDef = {
  label: string;
  keys: string[];
  isMargin?: boolean;
  section?: 'IS' | 'BS';
};

const ROW_DEFS: RowDef[] = [
  // IS section
  { label: '매출액',       keys: ['매출액'],                                         section: 'IS' },
  { label: '매출총이익',   keys: ['매출총이익'],                                      section: 'IS' },
  { label: '매출총이익률', keys: ['매출총이익률'],                    isMargin: true,  section: 'IS' },
  { label: '영업이익',     keys: ['영업이익'],                                        section: 'IS' },
  { label: '영업이익률',   keys: ['영업이익률'],                      isMargin: true,  section: 'IS' },
  { label: '당기순이익',   keys: ['순이익', '당기순이익', '지배주주순이익'],          section: 'IS' },
  // BS section
  { label: '유동자산',     keys: ['유동자산'],                                        section: 'BS' },
  { label: '비유동자산',   keys: ['비유동자산'],                                      section: 'BS' },
  { label: '자산총계',     keys: ['총자산', '자산 총계'],                             section: 'BS' },
  { label: '유동부채',     keys: ['유동부채'],                                        section: 'BS' },
  { label: '비유동부채',   keys: ['비유동부채'],                                      section: 'BS' },
  { label: '부채총계',     keys: ['총부채', '부채총계'],                              section: 'BS' },
  { label: '자본총계',     keys: ['자기자본', '자본 총계'],                           section: 'BS' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function lookupValue(items: Record<string, number | null>, keys: string[]): number | null {
  for (const key of keys) {
    if (key in items && items[key] !== null) {
      return items[key];
    }
  }
  return null;
}

function formatNumber(v: number | null): string {
  if (v === null) return '—';
  return v.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

function formatMargin(v: number | null): string {
  if (v === null) return '—';
  return v.toFixed(1) + '%';
}

// ── Special-row highlight set ─────────────────────────────────────────────────
const HIGHLIGHT_ROWS = new Set(['매출총이익률', '영업이익률', '자산총계', '부채총계', '자본총계']);
const HIGHLIGHT_BG   = '#EFF6FF'; // indigo-50
const HIGHLIGHT_LABEL_BG = '#DBEAFE'; // indigo-100

// ── Styles ────────────────────────────────────────────────────────────────────
const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  border: '1px solid #D1D5DB',
};

// Header row 1 — quarter label (dark navy)
const thBase: React.CSSProperties = {
  backgroundColor: '#1E3A5F',
  border: '1px solid #1a3354',
  padding: '7px 12px',
  fontSize: '0.78rem',
  fontWeight: 600,
  color: '#FFFFFF',
  whiteSpace: 'nowrap',
};

const thLabel: React.CSSProperties = {
  ...thBase,
  textAlign: 'left',
  minWidth: '120px',
};

const thData: React.CSSProperties = {
  ...thBase,
  textAlign: 'right',
};

const thDataLast: React.CSSProperties = {
  ...thData,
};

// Header row 2 — period date (navy sub)
const thPeriod: React.CSSProperties = {
  backgroundColor: '#2C4A6E',
  border: '1px solid #1E3A5F',
  padding: '4px 12px',
  fontSize: '0.71rem',
  fontWeight: 400,
  color: '#CBD5E1',
  textAlign: 'right',
  whiteSpace: 'nowrap',
};

const tdLabelBase: React.CSSProperties = {
  border: '1px solid #E5E7EB',
  padding: '6px 12px',
  fontSize: '0.8rem',
  fontWeight: 500,
  textAlign: 'left',
  whiteSpace: 'nowrap',
  minWidth: '120px',
};

const tdDataBase: React.CSSProperties = {
  border: '1px solid #E5E7EB',
  padding: '6px 12px',
  fontSize: '0.8rem',
  textAlign: 'right',
  whiteSpace: 'nowrap',
};

// ── Section separator row ─────────────────────────────────────────────────────
function SectionHeaderRow({ label, colSpan }: { label: string; colSpan: number }) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        style={{
          border: '1px solid #E5E7EB',
          padding: '5px 12px',
          fontSize: '0.72rem',
          fontWeight: 700,
          color: '#6B7280',
          backgroundColor: '#F3F4F6',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {label}
      </td>
    </tr>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
export function CompanyFinancialTable({ quarters, currency, unit }: Props) {
  const unitLabel = unit === 'M' ? '백만 달러' : '십억 원';
  const colSpan = 1 + quarters.length; // 항목 col + data cols

  return (
    <div>
      {/* Title */}
      <div style={{ marginBottom: '8px', fontSize: '1rem', color: '#111827', fontWeight: 700 }}>
        재무현황{' '}
        <span style={{ fontWeight: 400, color: '#6B7280', fontSize: '0.82rem' }}>
          (단위: {unitLabel})
        </span>
      </div>

      {/* Table wrapper */}
      <div style={{ overflowX: 'auto' }}>
        <table style={tableStyle}>
          <thead>
            {/* Header row 1: 항목 | displayLabel (equal-width columns) */}
            <tr>
              <th style={{ ...thLabel, verticalAlign: 'middle', width: '120px' }} rowSpan={2}>항목</th>
              {quarters.map((q) => (
                <th key={q.periodEndMonth} style={{ ...thDataLast, width: `${Math.floor(80 / quarters.length)}%` }}>
                  {q.displayLabel}
                </th>
              ))}
            </tr>
            {/* Header row 2: empty | periodEndMonth … */}
            <tr>
              {quarters.map((q) => (
                <th key={q.periodEndMonth} style={thPeriod}>
                  {q.periodEndMonth}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* Render rows with section separators */}
            {(() => {
              const rows: React.ReactNode[] = [];
              let lastSection: string | undefined;

              ROW_DEFS.forEach((rowDef, rowIdx) => {
                // Insert section header when section changes
                if (rowDef.section && rowDef.section !== lastSection) {
                  const sectionLabel = rowDef.section === 'IS' ? '손익계산서 (IS)' : '재무상태표 (BS)';
                  rows.push(
                    <SectionHeaderRow key={`section-${rowDef.section}`} label={sectionLabel} colSpan={colSpan} />
                  );
                  lastSection = rowDef.section;
                }

                const isHighlight = HIGHLIGHT_ROWS.has(rowDef.label);
                const isEven = rowIdx % 2 === 0;
                const rowBg = isHighlight ? HIGHLIGHT_BG : (isEven ? '#FFFFFF' : '#FAFAFA');
                const labelBg = isHighlight ? HIGHLIGHT_LABEL_BG : rowBg;

                rows.push(
                  <tr key={rowDef.label}>
                    {/* 항목 label */}
                    <td style={{
                      ...tdLabelBase,
                      backgroundColor: labelBg,
                      fontWeight: isHighlight ? 600 : 500,
                      color: isHighlight ? '#1E40AF' : '#374151',
                    }}>
                      {rowDef.label}
                    </td>

                    {/* Data cells */}
                    {quarters.map((q) => {
                      const raw = lookupValue(q.items, rowDef.keys);

                      let display: string;
                      let cellColor: string | undefined;

                      if (rowDef.isMargin) {
                        display = formatMargin(raw);
                        cellColor = raw === null ? '#9CA3AF' : '#1D4ED8';
                      } else {
                        display = formatNumber(raw);
                        cellColor = raw === null ? '#9CA3AF' : (isHighlight ? '#1E40AF' : undefined);
                      }

                      return (
                        <td
                          key={q.periodEndMonth}
                          style={{
                            ...tdDataBase,
                            backgroundColor: rowBg,
                            color: cellColor,
                            fontWeight: isHighlight ? 600 : 400,
                          }}
                        >
                          {display}
                        </td>
                      );
                    })}
                  </tr>
                );
              });

              return rows;
            })()}
          </tbody>
        </table>
      </div>
    </div>
  );
}
