'use client';

import Link from 'next/link';
import { PageHeader } from '@/components/common/PageHeader';
import { ChartContainer } from '@/components/charts/ChartContainer';
import { RevenueBarChart } from '@/components/charts/RevenueBarChart';
import { ProfitLineChart } from '@/components/charts/ProfitLineChart';
import { MarginAreaChart } from '@/components/charts/MarginAreaChart';
import { BalanceSheetChart } from '@/components/charts/BalanceSheetChart';
import { CashFlowBarChart } from '@/components/charts/CashFlowBarChart';
import { incomeStatement, INCOME_STATEMENT_QUARTERS } from '@/data/fadu/income-statement';
import { balanceSheet, BALANCE_SHEET_QUARTERS } from '@/data/fadu/balance-sheet';
import { cashFlow, CASH_FLOW_QUARTERS } from '@/data/fadu/cash-flow';
import { ratios, RATIO_QUARTERS } from '@/data/fadu/ratios';
import { ANNUAL_REVENUE_BREAKDOWN, CUSTOMER_CONCENTRATION } from '@/data/fadu/revenue-breakdown';
import { BACKLOG_SUMMARY, ORDER_BACKLOG_2025 } from '@/data/fadu/order-backlog';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts';

// ─── Data helpers ─────────────────────────────────────────────────────────────

function buildLookup(rows: typeof incomeStatement): Record<string, Record<string, number>> {
  const map: Record<string, Record<string, number>> = {};
  for (const row of rows) {
    if (!map[row.quarter]) map[row.quarter] = {};
    map[row.quarter][row.item] = row.valueMillion;
  }
  return map;
}

const isLookup = buildLookup(incomeStatement);
const bsLookup = buildLookup(balanceSheet);
const cfLookup = buildLookup(cashFlow);
const ratioLookup = buildLookup(ratios);

const IS_QUARTERS = [...INCOME_STATEMENT_QUARTERS].slice(-8) as string[];
const BS_QUARTERS = [...BALANCE_SHEET_QUARTERS].slice(-8) as string[];
const CF_QUARTERS = [...CASH_FLOW_QUARTERS].slice(-8) as string[];
const RATIO_QS = [...RATIO_QUARTERS].slice(-8) as string[];

// ─── Chart data transforms ────────────────────────────────────────────────────

const revenueData = IS_QUARTERS.map(q => ({
  quarter: q,
  매출액: isLookup[q]?.['매출액'] ?? 0,
  매출총이익: isLookup[q]?.['매출총이익'] ?? 0,
  영업이익: isLookup[q]?.['영업이익'] ?? 0,
}));

const profitData = IS_QUARTERS.map(q => ({
  quarter: q,
  operating: isLookup[q]?.['영업이익'] ?? 0,
  net: isLookup[q]?.['당기순이익'] ?? 0,
}));

const marginData = RATIO_QS.map(q => ({
  quarter: q,
  grossMargin: ratioLookup[q]?.['매출총이익률(%)'] ?? 0,
  operatingMargin: ratioLookup[q]?.['영업이익률(%)'] ?? 0,
}));

const balanceData = BS_QUARTERS.map(q => ({
  quarter: q,
  assets: bsLookup[q]?.['자산총계'] ?? 0,
  liabilities: bsLookup[q]?.['부채총계'] ?? 0,
  equity: bsLookup[q]?.['자본총계'] ?? 0,
}));

const cfData = CF_QUARTERS.filter(q => q !== '23Q3').map(q => ({
  quarter: q,
  영업CF: cfLookup[q]?.['영업활동현금흐름'] ?? 0,
  투자CF: cfLookup[q]?.['투자활동현금흐름'] ?? 0,
  재무CF: cfLookup[q]?.['재무활동현금흐름'] ?? 0,
}));

// Revenue mix (annual, 3 years)
const revMixData = ['2023FY', '2024FY', '2025FY'].map(period => {
  const items = ANNUAL_REVENUE_BREAKDOWN.filter(r => r.period === period && r.product !== '합계');
  const obj: Record<string, number | string> = { period: period.replace('FY', '년') };
  items.forEach(i => { obj[i.product] = i.revenueMillion; });
  return obj;
});

const TOOLTIP_STYLE = {
  backgroundColor: '#FFFFFF',
  border: '1px solid rgba(0,0,0,0.12)',
  borderRadius: '8px',
  color: '#111827',
};

// ─── Page component ───────────────────────────────────────────────────────────

export default function CompanyChartsPage() {
  const backlog = BACKLOG_SUMMARY[0];
  const usdToKrw = 1440; // approximate rate

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F7FA' }}>
      <PageHeader
        title="재무 차트"
        subtitle="분기별 재무 지표 시각화 (실제 재무데이터 기반)"
      >
        <Link
          href="/company"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '8px 16px',
            backgroundColor: 'rgba(0,0,0,0.05)',
            border: '1px solid rgba(0,0,0,0.12)',
            borderRadius: '8px',
            color: '#64748B',
            fontSize: '0.825rem',
            fontWeight: 500,
            textDecoration: 'none',
          }}
        >
          ← 재무제표로 돌아가기
        </Link>
      </PageHeader>

      <div style={{ padding: '24px 32px' }}>

        {/* Row 1: Revenue + Profit */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '20px' }}>
          <ChartContainer title="매출액 추이" subtitle="분기별 매출액 (백만원)" height={280}>
            <RevenueBarChart data={revenueData} />
          </ChartContainer>
          <ChartContainer title="영업이익 & 순이익 추이" subtitle="분기별 영업이익 / 순이익 (백만원)" height={280}>
            <ProfitLineChart data={profitData} />
          </ChartContainer>
        </div>

        {/* Row 2: Margin + Cash Flow */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '20px' }}>
          <ChartContainer title="이익률 추이" subtitle="분기별 매출총이익률 / 영업이익률 (%)" height={280}>
            <MarginAreaChart data={marginData} />
          </ChartContainer>
          <ChartContainer title="현금흐름 추이" subtitle="분기별 영업/투자/재무 현금흐름 (백만원)" height={280}>
            <CashFlowBarChart data={cfData} />
          </ChartContainer>
        </div>

        {/* Row 3: Revenue Mix + Balance Sheet */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '20px' }}>
          <ChartContainer title="연간 매출구성 (제품별)" subtitle="SSD컨트롤러 vs SSD완성품 vs 기타 (백만원)" height={280}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revMixData} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
                <XAxis dataKey="period" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => `${(v/10000).toFixed(0)}억`} tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(v: unknown) => [`${((v as number)/10000).toFixed(1)}억원`]}
                  contentStyle={TOOLTIP_STYLE}
                />
                <Legend wrapperStyle={{ color: '#64748B', fontSize: '0.75rem' }} />
                <Bar dataKey="SSD컨트롤러" stackId="a" fill="#DC2626" radius={[0, 0, 0, 0]} />
                <Bar dataKey="SSD완성품" stackId="a" fill="#F97316" radius={[0, 0, 0, 0]} />
                <Bar dataKey="기타" stackId="a" fill="#6B7280" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
          <ChartContainer title="재무상태 추이" subtitle="분기별 자산 / 부채 / 자본 (백만원)" height={280}>
            <BalanceSheetChart data={balanceData} />
          </ChartContainer>
        </div>

        {/* Row 4: Order Backlog Summary */}
        {backlog && (
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: '12px',
            padding: '24px',
          }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>
                수주잔고 현황
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                기준일: {backlog.reportDate} | Enterprise SSD (AI 데이터센터향)
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {[
                { label: '총 수주잔액', usd: backlog.totalUSD, krw: backlog.totalKRW, color: '#111827' },
                { label: '이행 완료', usd: backlog.completedUSD, krw: Math.round(backlog.completedUSD * usdToKrw / 1000), color: '#22C55E' },
                { label: '미이행 잔고', usd: backlog.remainingUSD, krw: backlog.remainingKRW, color: '#DC2626' },
              ].map(({ label, usd, krw, color }) => (
                <div key={label} style={{
                  backgroundColor: '#F5F7FA',
                  border: '1px solid rgba(0,0,0,0.08)',
                  borderRadius: '8px',
                  padding: '16px',
                }}>
                  <div style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                    {label}
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color, marginBottom: '4px' }}>
                    USD {usd.toLocaleString()}천
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    ≈ {(krw / 1000).toFixed(0)}억원
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '12px', fontSize: '0.7rem', color: '#94A3B8' }}>
              * USD/KRW 1,440원 환율 적용 추정치 | 주요 납기: 2026.01~10월
            </div>

            {/* Individual contract table */}
            <div style={{ marginTop: '20px', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                <thead>
                  <tr>
                    {['제품', '계약일', '납기일', '계약금액(USD천)', '이행완료(USD천)', '잔고(USD천)', '상태'].map(h => (
                      <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: '#94A3B8', borderBottom: '1px solid rgba(0,0,0,0.07)', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ORDER_BACKLOG_2025.map((c, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                      <td style={{ padding: '8px 12px', color: '#111827' }}>{c.product}</td>
                      <td style={{ padding: '8px 12px', color: '#64748B' }}>{c.contractDate}</td>
                      <td style={{ padding: '8px 12px', color: '#64748B' }}>{c.deliveryDate}</td>
                      <td style={{ padding: '8px 12px', color: '#111827', textAlign: 'right' }}>{c.totalAmountUSD.toLocaleString()}</td>
                      <td style={{ padding: '8px 12px', color: '#22C55E', textAlign: 'right' }}>{c.completedUSD > 0 ? c.completedUSD.toLocaleString() : '-'}</td>
                      <td style={{ padding: '8px 12px', color: c.remainingUSD > 0 ? '#DC2626' : '#94A3B8', textAlign: 'right', fontWeight: c.remainingUSD > 0 ? 600 : 400 }}>
                        {c.remainingUSD > 0 ? c.remainingUSD.toLocaleString() : '-'}
                      </td>
                      <td style={{ padding: '8px 12px' }}>
                        <span style={{
                          fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px',
                          backgroundColor: c.remainingUSD === 0 ? 'rgba(34,197,94,0.1)' : 'rgba(220,38,38,0.1)',
                          color: c.remainingUSD === 0 ? '#22C55E' : '#DC2626',
                        }}>
                          {c.remainingUSD === 0 ? '이행완료' : '미이행'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Row 5: Customer Concentration */}
        <div style={{
          marginTop: '20px',
          backgroundColor: '#FFFFFF',
          border: '1px solid rgba(0,0,0,0.08)',
          borderRadius: '12px',
          padding: '24px',
        }}>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>
              주요 고객 매출 비중
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
              연간 기준 | FY2023 ~ FY2025
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {['2023FY', '2024FY', '2025FY'].map(period => {
              const rows = CUSTOMER_CONCENTRATION.filter(r => r.period === period);
              return (
                <div key={period} style={{
                  backgroundColor: '#F5F7FA',
                  border: '1px solid rgba(0,0,0,0.08)',
                  borderRadius: '8px',
                  padding: '16px',
                }}>
                  <div style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                    {period.replace('FY', '년')} (기준일: {rows[0]?.periodEnd})
                  </div>
                  {rows.map(r => (
                    <div key={r.customer} style={{ marginBottom: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{r.customer}</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#111827' }}>{r.share.toFixed(1)}%</span>
                      </div>
                      <div style={{ height: '4px', borderRadius: '2px', backgroundColor: 'rgba(0,0,0,0.07)', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', borderRadius: '2px',
                          width: `${r.share}%`,
                          backgroundColor: r.customer.includes('1') || r.customer.includes('A') ? '#DC2626' : '#6B7280',
                        }} />
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '2px' }}>
                        {(r.revenueMillion / 10000).toFixed(0)}억원
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
