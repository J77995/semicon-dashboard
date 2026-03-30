'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { getLatestRatioAtOrBefore } from '@/lib/financials-lookup';

// ── Korean name → ticker ──────────────────────────────────────────────────────
const TICKER: Record<string, string> = {
  '구글':             'GOOGL',
  '마이크로소프트':   'MSFT',
  '아마존':           'AMZN',
  '오라클':           'ORCL',
  '엔비디아':         'NVDA',
  '브로드컴':         'AVGO',
  '마벨테크놀로지스': 'MRVL',
  '삼성전자':         'SSNLF',
  'SK하이닉스':       '000660.KS',
  '마이크론':         'MU',
  '샌디스크':         'SNDK',
  '웨스턴디지털':     'WDC',
  '시게이트':         'STX',
  '실리콘모션':       'SIMO',
};

const GROUPS = [
  { label: '클라우드 서비스', companies: ['구글', '마이크로소프트', '아마존', '오라클'] },
  { label: 'AI 반도체',      companies: ['엔비디아', '브로드컴', '마벨테크놀로지스'] },
  { label: '메모리 제조사',  companies: ['삼성전자', 'SK하이닉스', '마이크론'] },
  { label: '스토리지',       companies: ['샌디스크', '웨스턴디지털', '시게이트', '실리콘모션'] },
];
const ALL_COMPANIES = GROUPS.flatMap(g => g.companies);

// ── 11-level heatmap ──────────────────────────────────────────────────────────
const HEAT = [
  { bg: '#991B1B', color: '#FFFFFF' },
  { bg: '#EF4444', color: '#FFFFFF' },
  { bg: '#FCA5A5', color: '#7F1D1D' },
  { bg: '#FECACA', color: '#7F1D1D' },
  { bg: '#FEE2E2', color: '#7F1D1D' },
  { bg: '#F3F4F6', color: '#374151' },
  { bg: '#DCFCE7', color: '#14532D' },
  { bg: '#86EFAC', color: '#14532D' },
  { bg: '#4ADE80', color: '#14532D' },
  { bg: '#16A34A', color: '#FFFFFF' },
  { bg: '#166534', color: '#FFFFFF' },
];

function heatLevel(v: number, step: number): number {
  if (v <= -step * 4) return 1;
  if (v <= -step * 3) return 2;
  if (v <= -step * 2) return 3;
  if (v <= -step * 1) return 4;
  if (v <          0) return 5;
  if (v ===        0) return 6;
  if (v <=  step * 1) return 7;
  if (v <=  step * 2) return 8;
  if (v <=  step * 3) return 9;
  if (v <=  step * 4) return 10;
  return 11;
}

function heatStyle(v: number | null | undefined, step: number): React.CSSProperties {
  if (v == null) return {};
  const h = HEAT[heatLevel(v, step) - 1];
  return { backgroundColor: h.bg, color: h.color, fontWeight: 600 };
}

function fmtPct(v: number | null | undefined, suffix = '%'): string {
  if (v == null) return '—';
  return (v >= 0 ? '+' : '') + v.toFixed(1) + suffix;
}
function fmtMargin(v: number | null | undefined): string {
  if (v == null) return '—';
  return v.toFixed(1) + '%';
}

// ── Styles ────────────────────────────────────────────────────────────────────
const thTop: React.CSSProperties = {
  padding: '8px 12px',
  fontSize: '0.78rem',
  fontWeight: 700,
  color: '#FFFFFF',
  backgroundColor: '#1E3A5F',
  border: '1px solid #1a3354',
  textAlign: 'center',
  whiteSpace: 'nowrap',
};
const thSub: React.CSSProperties = {
  padding: '5px 8px',
  fontSize: '0.72rem',
  fontWeight: 500,
  color: '#CBD5E1',
  backgroundColor: '#2C4A6E',
  border: '1px solid #1E3A5F',
  textAlign: 'center',
  whiteSpace: 'nowrap',
  width: '72px',
};
const td: React.CSSProperties = {
  padding: '7px 12px',
  fontSize: '0.82rem',
  color: '#111827',
  border: '1px solid #E5E7EB',
  textAlign: 'center',
  whiteSpace: 'nowrap',
};
const tdGroup: React.CSSProperties = {
  ...td,
  fontWeight: 600,
  fontSize: '0.8rem',
  backgroundColor: '#F9FAFB',
  verticalAlign: 'middle',
  color: '#374151',
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function VCTablePreview() {
  // 항상 현재 달 기준 최신 데이터 사용
  const latestMonth = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }, []);

  const ratios = useMemo(() =>
    ALL_COMPANIES.map(company => {
      const ticker = TICKER[company];
      return ticker ? getLatestRatioAtOrBefore(ticker, latestMonth) : null;
    }),
  [latestMonth]);

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      border: '1px solid rgba(0,0,0,0.08)',
      borderRadius: '10px',
      overflow: 'hidden',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th rowSpan={2} style={{ ...thTop, verticalAlign: 'middle', minWidth: '100px' }}>분류</th>
              <th rowSpan={2} style={{ ...thTop, verticalAlign: 'middle', minWidth: '130px' }}>기업</th>
              <th rowSpan={2} style={{ ...thTop, verticalAlign: 'middle', minWidth: '100px' }}>
                결산시점
                <div style={{ fontWeight: 400, color: '#93C5FD', fontSize: '0.68rem', marginTop: '2px' }}>(YYYY-MM)</div>
              </th>
              <th colSpan={2} style={{ ...thTop }}>매출성장률</th>
              <th colSpan={2} style={{ ...thTop }}>매출총이익률</th>
              <th colSpan={2} style={{ ...thTop }}>영업이익률</th>
              <th rowSpan={2} style={{ ...thTop, verticalAlign: 'middle', minWidth: '90px' }}>컨퍼런스콜</th>
            </tr>
            <tr>
              <th style={thSub}>YoY</th>
              <th style={thSub}>QoQ</th>
              <th style={thSub}>%</th>
              <th style={thSub}>QoQ</th>
              <th style={thSub}>%</th>
              <th style={thSub}>QoQ</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              const rows: React.ReactNode[] = [];
              let gi = 0;
              GROUPS.forEach(group => {
                group.companies.forEach((company, idx) => {
                  const ratio = ratios[gi++];
                  rows.push(
                    <tr key={`${group.label}-${company}`}>
                      {idx === 0 && (
                        <td rowSpan={group.companies.length} style={tdGroup}>{group.label}</td>
                      )}
                      <td style={td}>
                        <Link href={`/valuechain/${TICKER[company]}`}
                          style={{ color: '#1D4ED8', textDecoration: 'none', fontWeight: 500 }}>
                          {company}
                        </Link>
                      </td>
                      <td style={{ ...td, color: '#6B7280', fontSize: '0.78rem' }}>
                        {ratio?.periodEndMonth ?? '—'}
                      </td>
                      <td style={{ ...td, ...heatStyle(ratio?.매출액_YoY, 15) }}>
                        {fmtPct(ratio?.매출액_YoY)}
                      </td>
                      <td style={{ ...td, ...heatStyle(ratio?.매출액_QoQ, 15) }}>
                        {fmtPct(ratio?.매출액_QoQ)}
                      </td>
                      <td style={td}>{fmtMargin(ratio?.매출총이익률)}</td>
                      <td style={{ ...td, ...heatStyle(ratio?.매출총이익률_QoQ, 3) }}>
                        {fmtPct(ratio?.매출총이익률_QoQ, '%p')}
                      </td>
                      <td style={td}>{fmtMargin(ratio?.영업이익률)}</td>
                      <td style={{ ...td, ...heatStyle(ratio?.영업이익률_QoQ, 3) }}>
                        {fmtPct(ratio?.영업이익률_QoQ, '%p')}
                      </td>
                      <td style={td}>
                        <Link href={`/valuechain/${TICKER[company]}#earnings-call`}
                          style={{ color: '#1D4ED8', fontWeight: 500, fontSize: '0.82rem', textDecoration: 'none' }}>
                          Summary
                        </Link>
                      </td>
                    </tr>
                  );
                });
              });
              return rows;
            })()}
          </tbody>
        </table>
      </div>
      <div style={{
        padding: '8px 16px',
        borderTop: '1px solid #E5E7EB',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.68rem',
        color: '#94A3B8',
      }}>
<Link href="/valuechain" style={{ color: '#1D4ED8', textDecoration: 'none', fontWeight: 600 }}>
          &gt;&gt; 상세 보기
        </Link>
      </div>
    </div>
  );
}
