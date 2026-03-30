'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { FinancialTable } from '@/components/company/FinancialTable';
import { ChartContainer } from '@/components/charts/ChartContainer';
import { RevenueBarChart } from '@/components/charts/RevenueBarChart';
import { ProfitLineChart } from '@/components/charts/ProfitLineChart';
import { MarginAreaChart } from '@/components/charts/MarginAreaChart';
import { BalanceSheetChart } from '@/components/charts/BalanceSheetChart';
import { CashFlowBarChart } from '@/components/charts/CashFlowBarChart';
import { SgaBreakdownChart } from '@/components/charts/SgaBreakdownChart';
import { InventoryArChart } from '@/components/charts/InventoryArChart';
import { incomeStatement, INCOME_STATEMENT_QUARTERS, INCOME_STATEMENT_ITEMS } from '@/data/fadu/income-statement';
import { balanceSheet, BALANCE_SHEET_QUARTERS, BALANCE_SHEET_ITEMS } from '@/data/fadu/balance-sheet';
import { cashFlow, CASH_FLOW_QUARTERS, CASH_FLOW_ITEMS } from '@/data/fadu/cash-flow';
import { ratios, RATIO_QUARTERS, RATIO_ITEMS } from '@/data/fadu/ratios';
import { ANNUAL_REVENUE_BREAKDOWN, CUSTOMER_CONCENTRATION } from '@/data/fadu/revenue-breakdown';
import { fmtQ, fmtQMonth } from '@/lib/formatQuarter';
import { FADU_PERIOD_END_MONTHS } from '@/data/fadu/period-end-months';
import { BACKLOG_SUMMARY, ORDER_BACKLOG_2025 } from '@/data/fadu/order-backlog';
import { sgaData } from '@/data/fadu/opex-detail';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts';

// ─── Data helpers ────────────────────────────────────────────────────────────

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

const latestIS = IS_QUARTERS[IS_QUARTERS.length - 1];

// ─── Table row builders ───────────────────────────────────────────────────────

const BOLD_IS_ITEMS = new Set(['매출액', '매출총이익', '영업이익', '당기순이익']);
const SUB_IS_ITEMS = new Set(['매출원가', '판매관리비', '기타손익', '금융손익', '법인세차감전순이익', '법인세', '지배주주순이익']);

function buildISRows() {
  return INCOME_STATEMENT_ITEMS.map(item => ({
    item,
    isBold: BOLD_IS_ITEMS.has(item),
    isSubItem: SUB_IS_ITEMS.has(item),
    values: Object.fromEntries(IS_QUARTERS.map(q => [q, isLookup[q]?.[item] ?? 0])),
  }));
}

const BOLD_BS_ITEMS = new Set(['자산총계', '부채총계', '자본총계', '유동자산', '비유동자산', '유동부채', '비유동부채']);
const SUB_BS_ITEMS = new Set(['매출채권', '재고자산', '유형자산', '무형자산', '매입채무및계약부채', '지배주주지분', '비지배주주지분']);

function buildBSRows() {
  return BALANCE_SHEET_ITEMS.map(item => ({
    item,
    isBold: BOLD_BS_ITEMS.has(item),
    isSubItem: SUB_BS_ITEMS.has(item),
    values: Object.fromEntries(BS_QUARTERS.map(q => [q, bsLookup[q]?.[item] ?? 0])),
  }));
}

const BOLD_CF_ITEMS = new Set(['기초현금', '기말현금']);
const SUB_CF_ITEMS = new Set<string>();

function buildCFRows() {
  return CASH_FLOW_ITEMS.map(item => ({
    item,
    isBold: BOLD_CF_ITEMS.has(item),
    isSubItem: SUB_CF_ITEMS.has(item),
    values: Object.fromEntries(CF_QUARTERS.map(q => [q, cfLookup[q]?.[item] ?? 0])),
  }));
}

function buildRatioRows() {
  return RATIO_ITEMS.filter(item => item !== '자산총계').map(item => ({
    item,
    isBold: false,
    isSubItem: false,
    values: Object.fromEntries(RATIO_QS.map(q => [q, ratioLookup[q]?.[item] ?? 0])),
  }));
}

// ─── Chart data ───────────────────────────────────────────────────────────────

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

const sgaBreakdownData = IS_QUARTERS.map(q => {
  const s = sgaData.find(r => r.quarter === q);
  if (!s) return { quarter: q, 경상연구개발비: 0, 급여: 0, 복리후생비: 0, 퇴직급여: 0, 지급수수료: 0, 감가상각비: 0, 기타: 0 };
  // 기타 = 합계 - 6개 항목 (주식보상비용 포함 나머지 전부 기타로)
  const named = s.급여 + s.퇴직급여 + s.복리후생비 + s.경상연구개발비 + s.감가상각비 + s.지급수수료;
  return {
    quarter: q,
    경상연구개발비: s.경상연구개발비, 급여: s.급여, 복리후생비: s.복리후생비,
    퇴직급여: s.퇴직급여, 지급수수료: s.지급수수료, 감가상각비: s.감가상각비,
    기타: s.합계 - named,
  };
});

const inventoryArData = IS_QUARTERS.map(q => ({
  quarter: q,
  매출채권: bsLookup[q]?.['매출채권'] ?? 0,
  재고자산: bsLookup[q]?.['재고자산'] ?? 0,
  매출채권회전율: ratioLookup[q]?.['매출채권회전율(회)'] ?? 0,
  재고자산회전율: ratioLookup[q]?.['재고자산회전율(회)'] ?? 0,
}));

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

// ─── Tab config ───────────────────────────────────────────────────────────────

type TabId = 'is' | 'bs' | 'cf' | 'ratio';

const TABS: { id: TabId; label: string }[] = [
  { id: 'is', label: '손익계산서' },
  { id: 'bs', label: '재무상태표' },
  { id: 'cf', label: '현금흐름표' },
  { id: 'ratio', label: '재무비율' },
];

const fmtRatio = (v: number) => {
  if (v === 0) return '-';
  return `${v.toFixed(1)}`;
};

// ─── Component ────────────────────────────────────────────────────────────────

const SGA_LABEL_KEYS: Array<[keyof Omit<typeof sgaData[0], 'quarter'>, string]> = [
  ['급여', '급여'], ['퇴직급여', '퇴직급여'], ['복리후생비', '복리후생비'],
  ['여비교통비', '여비교통비'], ['접대비', '접대비'], ['전력비', '전력비'],
  ['세금과공과금', '세금과공과금'], ['감가상각비', '감가상각비'],
  ['경상연구개발비', '경상연구개발비'], ['도서인쇄비', '도서인쇄비'],
  ['소모품비', '소모품비'], ['지급수수료', '지급수수료'],
  ['무형자산상각비', '무형자산상각비'], ['주식보상비용', '주식보상비용'],
  ['대손상각비환입', '대손상각비(환입)'], ['선급금손상차손환입', '선급금손상차손(환입)'],
  ['기타', '기타'], ['합계', '합 계'],
];

const HASH_TAB_MAP: Record<string, TabId> = {
  is: 'is', bs: 'bs', cf: 'cf', ratio: 'ratio',
  'revenue-chart': 'is', 'profit-chart': 'is',
  'margin-chart': 'ratio', 'cashflow-chart': 'cf',
  'sga-chart': 'is', 'inventory-chart': 'bs',
  'balance-chart': 'bs', 'revmix-chart': 'is',
};

export default function CompanyPage() {
  const [activeTab, setActiveTab] = useState<TabId>('is');

  // hash 기반 탭 전환 + 스크롤
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const tab = HASH_TAB_MAP[hash];
    if (tab) {
      setActiveTab(tab);
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    }
  }, []);

  type TableRowLoose = { item: string; isBold: boolean; isSubItem: boolean; values: Record<string, number> };
  const tableConfig: Record<TabId, { rows: TableRowLoose[]; quarters: string[]; formatFn?: (v: number) => string }> = {
    is: { rows: buildISRows(), quarters: IS_QUARTERS },
    bs: { rows: buildBSRows(), quarters: BS_QUARTERS },
    cf: { rows: buildCFRows(), quarters: CF_QUARTERS },
    ratio: { rows: buildRatioRows(), quarters: RATIO_QS, formatFn: fmtRatio },
  };

  const { rows, quarters, formatFn } = tableConfig[activeTab];

  const sgaMap = Object.fromEntries(sgaData.map(r => [r.quarter, r]));
  const sgaSubRows = SGA_LABEL_KEYS.map(([key, label]) => ({
    item: label,
    isBold: key === '합계',
    values: Object.fromEntries(IS_QUARTERS.map(q => [q, sgaMap[q]?.[key] ?? 0])),
  }));
  const sgaExpandableRows = { '판매관리비': sgaSubRows };

  const backlog = BACKLOG_SUMMARY[0];
  const usdToKrw = 1440;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F7FA' }}>
      <PageHeader
        title="재무 현황"
        subtitle={`분기별 재무제표 (단위: 백만원) — 최신분기: ${fmtQ(latestIS)} (${fmtQMonth(latestIS, FADU_PERIOD_END_MONTHS)})`}
        backHref="/"
      />

      {/* Tabs + Table */}
      <div id="table-section" style={{ padding: '24px 32px' }}>
        {/* Tab bar */}
        <div style={{
          display: 'flex', gap: '4px', marginBottom: '0',
          borderBottom: '1px solid rgba(0,0,0,0.09)',
        }}>
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '10px 20px',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#111827' : '#94A3B8',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: isActive ? '2px solid #2563EB' : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'color 0.15s, border-color 0.15s',
                  marginBottom: '-1px',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Units note */}
        <div style={{ padding: '12px 4px', fontSize: '0.7rem', color: '#94A3B8' }}>
          {activeTab === 'ratio' ? '(단위: %, 자산총계는 백만원)' : '(단위: 백만원)'}
        </div>

        {/* Table panel */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid rgba(0,0,0,0.09)',
          borderRadius: '12px',
          overflow: 'hidden',
        }}>
          <FinancialTable
            rows={rows}
            quarters={quarters}
            formatFn={formatFn}
            expandableRows={activeTab === 'is' ? sgaExpandableRows : undefined}
          />
        </div>


      </div>

      {/* ── Charts Section ─────────────────────────────────────────────────── */}
      <div style={{ padding: '0 32px 32px' }}>

        {/* Row 1: Revenue + Profit */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '20px' }}>
          <div id="revenue-chart"><ChartContainer title="분기별 손익" subtitle="매출액 / 매출총이익 / 영업이익" height={280}>
            <RevenueBarChart data={revenueData} />
          </ChartContainer></div>
          <div id="profit-chart"><ChartContainer title="영업이익 & 순이익 추이" subtitle="분기별 영업이익 / 순이익" height={280}>
            <ProfitLineChart data={profitData} />
          </ChartContainer></div>
        </div>

        {/* Row 2: Margin + Cash Flow */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '20px' }}>
          <div id="margin-chart"><ChartContainer title="이익률 추이" subtitle="분기별 매출총이익률 / 영업이익률 (%)" height={280}>
            <MarginAreaChart data={marginData} />
          </ChartContainer></div>
          <div id="cashflow-chart"><ChartContainer title="현금흐름 추이" subtitle="분기별 영업/투자/재무 현금흐름" height={280}>
            <CashFlowBarChart data={cfData} />
          </ChartContainer></div>
        </div>

        {/* Row 3: SGA Breakdown + Inventory/AR */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '20px' }}>
          <div id="sga-chart"><ChartContainer title="분기별 판관비 구성" subtitle="항목별 스택" height={280}>
            <SgaBreakdownChart data={sgaBreakdownData} />
          </ChartContainer></div>
          <div id="inventory-chart"><ChartContainer title="재고자산 및 매출채권" subtitle="좌: 금액(억 원) | 우: 회전율(회, 연환산)" height={280}>
            <InventoryArChart data={inventoryArData} />
          </ChartContainer></div>
        </div>

        {/* Row 4: Revenue Mix + Balance Sheet */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '20px' }}>
          <div id="revmix-chart"><ChartContainer title="연간 매출구성 (제품별)" subtitle="SSD컨트롤러 vs SSD완성품 vs 기타" height={280}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revMixData} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
                <XAxis dataKey="period" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => `${(v/100).toFixed(0)}억 원`} tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(v: unknown) => [`${((v as number)/100).toFixed(0)}억 원`]}
                  contentStyle={TOOLTIP_STYLE}
                />
                <Legend wrapperStyle={{ color: '#64748B', fontSize: '0.75rem' }} />
                <Bar dataKey="SSD컨트롤러" stackId="a" fill="#DC2626" radius={[0, 0, 0, 0]} />
                <Bar dataKey="SSD완성품" stackId="a" fill="#F97316" radius={[0, 0, 0, 0]} />
                <Bar dataKey="기타" stackId="a" fill="#6B7280" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer></div>
          <div id="balance-chart"><ChartContainer title="재무상태 추이" subtitle="분기별 자산 / 부채 / 자본" height={280}>
            <BalanceSheetChart data={balanceData} />
          </ChartContainer></div>
        </div>

        {/* Row 4: Order Backlog Summary */}
        {backlog && (
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '20px',
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
                        {(r.revenueMillion / 100).toFixed(0)}억원
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
