'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/common/PageHeader';
import { getLatestRatioAtOrBefore, RatioData } from '@/lib/financials-lookup';
import SectorInsightPanel from '@/components/valuechain/SectorInsightPanel';
import sectorInsightsData from '@/data/valuechain/sector-insights.json';

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

// ── Month list ────────────────────────────────────────────────────────────────
function generateMonths(): string[] {
  const months: string[] = [];
  const start = new Date(2024, 0);
  const end   = new Date(2026, 2);
  for (let d = new Date(end); d >= start; d.setMonth(d.getMonth() - 1)) {
    const m = d.getMonth() + 1; // 1-based
    if (m === 3 || m === 6 || m === 9 || m === 12)
      months.push(`${d.getFullYear()}-${String(m).padStart(2, '0')}`);
  }
  return months;
}
const MONTHS = generateMonths();

// ── Company groups ────────────────────────────────────────────────────────────
const GROUPS = [
  { label: '클라우드 서비스', companies: ['구글', '마이크로소프트', '아마존', '오라클'] },
  { label: 'AI 반도체',      companies: ['엔비디아', '브로드컴', '마벨테크놀로지스'] },
  { label: '메모리 제조사',  companies: ['삼성전자', 'SK하이닉스', '마이크론'] },
  { label: '스토리지',       companies: ['샌디스크', '웨스턴디지털', '시게이트', '실리콘모션'] },
];
const ALL_COMPANIES = GROUPS.flatMap(g => g.companies);

// ── Heatmap ───────────────────────────────────────────────────────────────────
// 11-level palette: 적색 5단계 → 중립 1단계 → 녹색 5단계
// 임계값: 15 단위, 절대값 기준 (같은 수치 = 같은 색)
const HEAT = [
  { bg: '#991B1B', color: '#FFFFFF' }, // 1  v ≤ -60
  { bg: '#EF4444', color: '#FFFFFF' }, // 2  -60 < v ≤ -45
  { bg: '#FCA5A5', color: '#7F1D1D' }, // 3  -45 < v ≤ -30
  { bg: '#FECACA', color: '#7F1D1D' }, // 4  -30 < v ≤ -15
  { bg: '#FEE2E2', color: '#7F1D1D' }, // 5  -15 < v <  0
  { bg: '#F3F4F6', color: '#374151' }, // 6   v = 0  (중립)
  { bg: '#DCFCE7', color: '#14532D' }, // 7   0  < v ≤  15
  { bg: '#86EFAC', color: '#14532D' }, // 8   15 < v ≤  30
  { bg: '#4ADE80', color: '#14532D' }, // 9   30 < v ≤  45
  { bg: '#16A34A', color: '#FFFFFF' }, // 10  45 < v ≤  60
  { bg: '#166534', color: '#FFFFFF' }, // 11  v >  60
];

// step: 매출성장률=15, 이익률QoQ=3
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

// ── Formatters ────────────────────────────────────────────────────────────────
function fmtPct(v: number | null | undefined, suffix = '%'): string {
  if (v == null) return '—';
  return (v >= 0 ? '+' : '') + v.toFixed(1) + suffix;
}
function fmtMargin(v: number | null | undefined): string {
  if (v == null) return '—';
  return v.toFixed(1) + '%';
}

// ── Header styles ─────────────────────────────────────────────────────────────
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

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ValuechainPage() {
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[0]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // ── Fetch ratios for current month ────────────────────────────────────────
  const ratios = useMemo(() =>
    ALL_COMPANIES.map(company => {
      const ticker = TICKER[company];
      return ticker ? getLatestRatioAtOrBefore(ticker, selectedMonth) : null;
    }),
  [selectedMonth]);

  return (
    <div style={{ backgroundColor: '#F5F7FA', minHeight: '100vh', color: '#111827' }}>
      <PageHeader title="밸류체인 기업 동향" subtitle="주요 밸류체인 기업 실적 현황" backHref="/" />

      <div style={{ padding: '24px 32px' }}>
        {/* Date selector */}
        <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>Date</label>
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setOpen(v => !v)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                border: '1px solid #D1D5DB', borderRadius: '6px',
                padding: '5px 12px', fontSize: '0.84rem', fontWeight: 600,
                color: '#111827', backgroundColor: '#FFFFFF', cursor: 'pointer',
                minWidth: '120px', justifyContent: 'space-between',
                boxShadow: open ? '0 0 0 2px #3B82F640' : 'none',
              }}
            >
              {selectedMonth}
              <span style={{ fontSize: '0.65rem', color: '#6B7280' }}>▼</span>
            </button>
            {open && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 100,
                backgroundColor: '#FFFFFF', border: '1px solid #D1D5DB',
                borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                maxHeight: '260px', overflowY: 'auto', minWidth: '130px',
              }}>
                {MONTHS.map(m => (
                  <button key={m} onClick={() => { setSelectedMonth(m); setOpen(false); }}
                    style={{
                      display: 'block', width: '100%', padding: '7px 16px',
                      textAlign: 'left', fontSize: '0.82rem',
                      fontWeight: m === selectedMonth ? 600 : 400,
                      color: m === selectedMonth ? '#2563EB' : '#111827',
                      backgroundColor: m === selectedMonth ? '#EFF6FF' : 'transparent',
                      border: 'none', cursor: 'pointer', borderBottom: '1px solid #F3F4F6',
                    }}>{m}</button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div style={{
          backgroundColor: '#FFFFFF', border: '1px solid #D1D5DB',
          borderRadius: '8px', overflow: 'hidden',
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
                          {/* 매출성장률 YoY  step=15 */}
                          <td style={{ ...td, ...heatStyle(ratio?.매출액_YoY, 15) }}>
                            {fmtPct(ratio?.매출액_YoY)}
                          </td>
                          {/* 매출성장률 QoQ  step=15 */}
                          <td style={{ ...td, ...heatStyle(ratio?.매출액_QoQ, 15) }}>
                            {fmtPct(ratio?.매출액_QoQ)}
                          </td>
                          {/* 매출총이익률 % — 히트맵 없음 */}
                          <td style={td}>{fmtMargin(ratio?.매출총이익률)}</td>
                          {/* 매출총이익률 QoQ  step=3 */}
                          <td style={{ ...td, ...heatStyle(ratio?.매출총이익률_QoQ, 3) }}>
                            {fmtPct(ratio?.매출총이익률_QoQ, '%p')}
                          </td>
                          {/* 영업이익률 % — 히트맵 없음 */}
                          <td style={td}>{fmtMargin(ratio?.영업이익률)}</td>
                          {/* 영업이익률 QoQ  step=3 */}
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
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '10px' }}>
          <span style={{ fontSize: '0.7rem', color: '#9CA3AF', marginRight: '6px' }}>히트맵:</span>
          {HEAT.map((h, i) => (
            <div key={i} style={{
              width: '20px', height: '14px',
              backgroundColor: h.bg,
              border: '1px solid #E5E7EB',
              borderRadius: '2px',
            }} />
          ))}
          <span style={{ fontSize: '0.68rem', color: '#9CA3AF', marginLeft: '4px' }}>낮음 → 높음</span>
        </div>

        {/* Sector Insights */}
        <div style={{ marginTop: '48px' }}>
          <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <h2 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#111827' }}>
              AI 요약 섹터 인사이트
            </h2>
            <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>
              {selectedMonth} 기준 최신 컨퍼런스콜 종합
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {GROUPS.map(group => {
              const monthData = (sectorInsightsData as Record<string, Record<string, string>>)[selectedMonth];
              return (
                <SectorInsightPanel
                  key={group.label}
                  group={group.label}
                  insight={monthData?.[group.label]}
                />
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
