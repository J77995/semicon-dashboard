'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { ChartContainer } from '@/components/charts/ChartContainer';
import { RevenueBarChart } from '@/components/charts/RevenueBarChart';
import { MarginAreaChart } from '@/components/charts/MarginAreaChart';
import { SgaBreakdownChart } from '@/components/charts/SgaBreakdownChart';
import { InventoryArChart } from '@/components/charts/InventoryArChart';
import { EssdVendorChart } from '@/components/charts/EssdVendorChart';
import { DramSpotChart } from '@/components/charts/DramSpotChart';
import { fmtQ, fmtQMonth } from '@/lib/formatQuarter';
import { FADU_PERIOD_END_MONTHS } from '@/data/fadu/period-end-months';
import { incomeStatement, INCOME_STATEMENT_QUARTERS } from '@/data/fadu/income-statement';
import { balanceSheet } from '@/data/fadu/balance-sheet';
import { cashFlow } from '@/data/fadu/cash-flow';
import { ratios, RATIO_QUARTERS } from '@/data/fadu/ratios';
import { sgaData } from '@/data/fadu/opex-detail';
import { dramSpotPrices } from '@/data/industry/dram-spot-prices';
import { enterpriseSsdVendors } from '@/data/industry/enterprise-ssd-vendors';
import type { SpotPricesResponse } from '@/app/api/spot-prices/route';
import type { NewsArticle } from '@/types/news';
import VCTablePreview from '@/components/valuechain/VCTablePreview';
import { newsArticles } from '@/data/news/articles';

/* ─── 색상 상수 ─────────────────────────────────────── */
const C = {
  bg:       '#F5F7FA',
  bgCard:   '#FFFFFF',
  bgSection:'#EEF2F7',
  accent:   '#DC2626',
  accentLow:'rgba(220,38,38,0.12)',
  border:   'rgba(0,0,0,0.08)',
  borderHi: 'rgba(220,38,38,0.4)',
  textHi:   '#111827',
  textMid:  '#374151',
  textLow:  '#64748B',
  textMute: '#94A3B8',
  pos:      '#22C55E',
  neg:      '#F97316',
};

/* ─── 데이터 준비 ────────────────────────────────────── */
function buildLookup(rows: { quarter: string; item: string; valueMillion: number }[]) {
  const map: Record<string, Record<string, number>> = {};
  for (const r of rows) {
    if (!map[r.quarter]) map[r.quarter] = {};
    map[r.quarter][r.item] = r.valueMillion;
  }
  return map;
}
const isLookup  = buildLookup(incomeStatement);
const bsLookup  = buildLookup(balanceSheet);
const cfLookup  = buildLookup(cashFlow);
const ratioLookup = buildLookup(ratios);

const QUARTERS = [...INCOME_STATEMENT_QUARTERS].slice(-8) as string[];
const RATIO_QS  = [...RATIO_QUARTERS].slice(-8) as string[];

const revChartData = QUARTERS.map(q => ({
  quarter: q,
  매출액: isLookup[q]?.['매출액'] ?? 0,
  매출총이익: isLookup[q]?.['매출총이익'] ?? 0,
  영업이익: isLookup[q]?.['영업이익'] ?? 0,
}));
const marginChartData = RATIO_QS.map(q => ({
  quarter: q,
  grossMargin: ratioLookup[q]?.['매출총이익률(%)'] ?? 0,
  operatingMargin: ratioLookup[q]?.['영업이익률(%)'] ?? 0,
}));
const sgaBreakdownData = QUARTERS.map(q => {
  const s = sgaData.find(r => r.quarter === q);
  if (!s) return { quarter: q, 경상연구개발비: 0, 급여: 0, 복리후생비: 0, 퇴직급여: 0, 지급수수료: 0, 감가상각비: 0, 기타: 0 };
  const named = s.급여 + s.퇴직급여 + s.복리후생비 + s.경상연구개발비 + s.감가상각비 + s.지급수수료;
  return {
    quarter: q,
    경상연구개발비: s.경상연구개발비, 급여: s.급여, 복리후생비: s.복리후생비,
    퇴직급여: s.퇴직급여, 지급수수료: s.지급수수료, 감가상각비: s.감가상각비,
    기타: s.합계 - named,
  };
});
const invArChartData = QUARTERS.map(q => ({
  quarter: q,
  매출채권: bsLookup[q]?.['매출채권'] ?? 0,
  재고자산: bsLookup[q]?.['재고자산'] ?? 0,
  매출채권회전율: ratioLookup[q]?.['매출채권회전율(회)'] ?? 0,
  재고자산회전율: ratioLookup[q]?.['재고자산회전율(회)'] ?? 0,
}));
const TABLE_ITEMS: { label: string; key: string; src: Record<string, Record<string, number>>; signed?: boolean; tab: string }[] = [
  { label: '매출액',     key: '매출액',     src: isLookup, tab: 'is' },
  { label: '매출총이익',  key: '매출총이익',  src: isLookup, tab: 'is' },
  { label: '영업이익',   key: '영업이익',   src: isLookup, signed: true, tab: 'is' },
  { label: '순이익',     key: '당기순이익',  src: isLookup, signed: true, tab: 'is' },
  { label: '자산총계',   key: '자산총계',   src: bsLookup, tab: 'bs' },
  { label: '부채총계',   key: '부채총계',   src: bsLookup, tab: 'bs' },
  { label: '자본총계',   key: '자본총계',   src: bsLookup, tab: 'bs' },
];

/* ─── 섹션 헤더 컴포넌트 (빨간 띠) ──────────────────── */
function SectionHeader({ num, title, sub, href }: { num: string; title: string; sub: string; href: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 18px', marginBottom: '20px',
        borderRadius: 0,
        backgroundColor: hovered ? '#FFFFFF' : C.accent,
        border: `2px solid ${C.accent}`,
        textDecoration: 'none',
        transition: 'background-color 0.15s',
        cursor: 'pointer',
      }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <span style={{
          fontSize: '0.85rem', fontWeight: 800,
          color: hovered ? C.accent : '#FFFFFF',
          backgroundColor: hovered ? C.accentLow : 'rgba(255,255,255,0.2)',
          border: `1px solid ${hovered ? C.borderHi : 'rgba(255,255,255,0.4)'}`,
          padding: '2px 10px', letterSpacing: '0.08em',
        }}>{num}</span>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: hovered ? C.accent : '#FFFFFF', margin: 0 }}>{title}</h2>
      </div>
      <ArrowRight size={14} style={{ color: hovered ? C.accent : '#FFFFFF', flexShrink: 0 }} />
    </Link>
  );
}

/* ─── 섹션 구분선 ────────────────────────────────────── */
function Divider() {
  return <div style={{ height: '1px', backgroundColor: C.border, margin: '40px 0' }} />;
}

/* ══════════════════════════════════════════════════════ */
export default function HomePage() {
  const router = useRouter();
  const latestQ = QUARTERS[QUARTERS.length - 1];

  /* ── 산업 동향 데이터 ── */
  const essdVQ = [...new Set(enterpriseSsdVendors.filter(r => r.company !== 'Total').map(r => r.quarter))];
  const latestEssdQ = essdVQ[essdVQ.length - 1];
  const latestEssd = enterpriseSsdVendors.find(r => r.quarter === latestEssdQ && r.company === 'Total');
  const essdVendors = ['Samsung', 'SK Group', 'Micron', 'Kioxia', 'SanDisk(WDC)'].map(v =>
    enterpriseSsdVendors.find(r => r.quarter === latestEssdQ && r.company === v)
  );

  /* ── DRAMeXchange 실시간 ── */
  const [spotData, setSpotData] = useState<SpotPricesResponse | null>(null);
  useEffect(() => {
    fetch('/api/spot-prices').then(r => r.json()).then(setSpotData).catch(() => {});
  }, []);


  /* ── 최신 뉴스 (RSS 실시간, fallback: mock) ── */
  const mockLatestNews = [...newsArticles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, 4);
  const [latestNews, setLatestNews] = useState<NewsArticle[]>(mockLatestNews);
  useEffect(() => {
    fetch('/api/news')
      .then(r => r.json())
      .then(data => { if (data.articles?.length) setLatestNews(data.articles.slice(0, 4)); })
      .catch(() => {});
  }, []);

  return (
    <div style={{ padding: '36px 40px 60px', backgroundColor: C.bg, minHeight: '100vh' }}>

      {/* ── 페이지 타이틀 ── */}
      <div style={{ marginBottom: '36px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: C.textHi, margin: 0 }}>경영관리 대시보드</h1>
          </div>
          <p style={{ color: C.textLow, fontSize: '0.8rem', margin: 0 }}>
            최근 업데이트: {fmtQ(latestQ)} ({fmtQMonth(latestQ, FADU_PERIOD_END_MONTHS)}) 기준 · {new Date().toLocaleDateString('ko-KR')}
          </p>
        </div>
      </div>

      {/* ══ SECTION 1: 재무 현황 ══════════════════════ */}
      <SectionHeader num="01" title="재무 현황" sub="분기별 재무 현황" href="/company" />

      {/* 요약 표 */}
      <div style={{ backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: '10px', overflow: 'hidden', marginBottom: '16px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#F7F8FA' }}>
              <th style={{ padding: '8px 14px', textAlign: 'left', color: C.textLow, fontWeight: 600, fontSize: '0.78rem', borderBottom: `1px solid ${C.border}`, minWidth: '90px' }}>
                항목 <span style={{ fontWeight: 400 }}>(백만원)</span>
              </th>
              {QUARTERS.map(q => (
                <th key={q} style={{ padding: '8px 10px', textAlign: 'right', color: C.textLow, fontWeight: 600, fontSize: '0.78rem', borderBottom: `1px solid ${C.border}` }}>
                  <div>{fmtQ(q)}</div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 400, color: '#94A3B8' }}>{fmtQMonth(q, FADU_PERIOD_END_MONTHS)}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TABLE_ITEMS.map(({ label, key, src, signed, tab }, idx) => (
              <tr key={label}
                onClick={() => router.push(`/company#${tab}`)}
                style={{
                  borderBottom: idx < TABLE_ITEMS.length - 1 ? `1px solid rgba(0,0,0,0.05)` : 'none',
                  borderTop: idx === 4 ? `2px solid ${C.border}` : 'none',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(37,99,235,0.04)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <td style={{ padding: '7px 14px', color: C.textMid, fontWeight: 600, fontSize: '0.82rem' }}>{label}</td>
                {QUARTERS.map(q => {
                  const v = src[q]?.[key] ?? 0;
                  const color = signed ? (v >= 0 ? C.pos : C.neg) : C.textHi;
                  return (
                    <td key={q} style={{ padding: '7px 10px', textAlign: 'right', color, fontWeight: 600, fontSize: '0.82rem', fontVariantNumeric: 'tabular-nums' }}>
                      {v.toLocaleString()}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 차트 4개 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Link href="/company#revenue-chart" style={{ textDecoration: 'none', display: 'block' }}>
          <ChartContainer title="분기별 손익" subtitle="매출액 / 매출총이익 / 영업이익" height={220} clickable>
            <RevenueBarChart data={revChartData} />
          </ChartContainer>
        </Link>
        <Link href="/company#margin-chart" style={{ textDecoration: 'none', display: 'block' }}>
          <ChartContainer title="이익률 추이" subtitle="매출총이익률 / 영업이익률 (%)" height={220} clickable>
            <MarginAreaChart data={marginChartData} />
          </ChartContainer>
        </Link>
        <Link href="/company#sga-chart" style={{ textDecoration: 'none', display: 'block' }}>
          <ChartContainer title="분기별 판관비 구성" subtitle="항목별 스택" height={220} clickable>
            <SgaBreakdownChart data={sgaBreakdownData} />
          </ChartContainer>
        </Link>
        <Link href="/company#inventory-chart" style={{ textDecoration: 'none', display: 'block' }}>
          <ChartContainer title="재고자산 및 매출채권" subtitle="좌: 금액(억 원) | 우: 회전율(회, 연환산)" height={220} clickable>
            <InventoryArChart data={invArChartData} />
          </ChartContainer>
        </Link>
      </div>

      <Divider />

      {/* ══ SECTION 2: 산업 동향 ═══════════════════════════ */}
      <SectionHeader num="02" title="메모리/스토리지 시장현황" sub="eSSD 시장규모 · 메모리 가격" href="/industry" />

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>

        {/* eSSD card — LEFT */}
        <Link href="/industry#essd" style={{ textDecoration: 'none' }}>
          <div style={{ backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '18px 20px', cursor: 'pointer', transition: 'border-color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = C.borderHi)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
          >
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '1.0rem', color: C.textHi, fontWeight: 700 }}>Enterprise SSD Top 5 매출합계</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 700, color: C.textHi }}>
                  ${latestEssd ? (latestEssd.revenueUsdM / 1000).toFixed(1) : '—'}B
                </span>
                {latestEssd?.qoqPct != null && (
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: latestEssd.qoqPct >= 0 ? C.pos : C.neg }}>
                    ({latestEssd.qoqPct >= 0 ? '+' : ''}{latestEssd.qoqPct}% QoQ)
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.62rem', color: C.textMute, marginTop: '2px' }}>{fmtQ(latestEssdQ)} 기준 · TrendForce</div>
            </div>

            {/* Vendor breakdown table */}
            <div style={{ borderTop: '1px solid rgba(0,0,0,0.07)', paddingTop: '10px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
                    <th style={{ textAlign: 'left',  padding: '3px 0',   color: C.textMute, fontWeight: 500, fontSize: '0.75rem' }}>업체</th>
                    <th style={{ textAlign: 'right', padding: '3px 8px', color: C.textMute, fontWeight: 500, fontSize: '0.75rem' }}>매출 (USD M)</th>
                    <th style={{ textAlign: 'right', padding: '3px 0 3px 8px', color: C.textMute, fontWeight: 500, fontSize: '0.75rem' }}>점유율</th>
                  </tr>
                </thead>
                <tbody>
                  {essdVendors.map((v, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                      <td style={{ padding: '5px 0', color: C.textMid, fontWeight: 500 }}>{v?.company ?? '—'}</td>
                      <td style={{ padding: '5px 8px', textAlign: 'right', color: C.textHi, fontWeight: 600 }}>
                        {v ? Math.round(v.revenueUsdM).toLocaleString() : '—'}
                      </td>
                      <td style={{ padding: '5px 0 5px 8px', textAlign: 'right', color: C.textLow }}>
                        {v ? `${v.marketSharePct}%` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Link>

        {/* Memory spot price table — RIGHT */}
        <Link href="/industry#prices" style={{ textDecoration: 'none' }}>
          <div style={{ backgroundColor: C.bgCard, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '18px 20px', cursor: 'pointer', transition: 'border-color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = C.borderHi)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
          >
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '1.0rem', color: C.textHi, fontWeight: 700 }}>메모리 스팟 가격</div>
              <div style={{ fontSize: '0.62rem', color: C.textMute, marginTop: '2px' }}>
                {spotData?.fetchedAt
                  ? `갱신: ${new Date(spotData.fetchedAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', hour12: false, month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}`
                  : 'DRAMeXchange 실시간'}
              </div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
                  <th style={{ textAlign: 'left',  padding: '4px 0',    color: C.textMute, fontWeight: 500, fontSize: '0.75rem' }}>제품</th>
                  <th style={{ textAlign: 'right', padding: '4px 8px',  color: C.textMute, fontWeight: 500, fontSize: '0.75rem' }}>Avg</th>
                  <th style={{ textAlign: 'right', padding: '4px 0 4px 8px', color: C.textMute, fontWeight: 500, fontSize: '0.75rem' }}>변동</th>
                </tr>
              </thead>
              <tbody>
                {spotData
                  ? [...spotData.dram, ...spotData.flash].map((row, i) => {
                      const dir = row.changeDir;
                      const chColor = dir === 'up' ? C.pos : dir === 'down' ? C.neg : C.textMute;
                      const label = row.item
                        .replace('DDR5 16Gb (2Gx8) 4800/5600', 'DDR5 16Gb 4800/5600')
                        .replace('DDR4 16Gb (2Gx8) 3200', 'DDR4 16Gb 3200')
                        .replace('DDR3 4Gb 512Mx8 1600/1866', 'DDR3 4Gb 1600');
                      return (
                        <tr key={i} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                          <td style={{ padding: '5px 0', color: C.textMid, whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: '140px', textOverflow: 'ellipsis' }}>
                            {label}
                          </td>
                          <td style={{ padding: '5px 8px', textAlign: 'right', color: C.textHi, fontWeight: 600 }}>
                            {row.sessionAvg !== '—' ? `$${row.sessionAvg}` : '—'}
                          </td>
                          <td style={{ padding: '5px 0 5px 8px', textAlign: 'right', color: chColor, fontWeight: 600 }}>
                            {dir === 'up' ? '▲ ' : dir === 'down' ? '▼ ' : ''}{row.change}
                          </td>
                        </tr>
                      );
                    })
                  : [1,2,3,4].map(i => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                        <td colSpan={3} style={{ padding: '5px 0', color: C.textMute, fontSize: '0.7rem' }}>
                          {i === 1 ? '불러오는 중...' : '\u00a0'}
                        </td>
                      </tr>
                    ))
                }
              </tbody>
            </table>
          </div>
        </Link>
      </div>

      {/* Preview charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Link href="/industry#essd-chart" style={{ textDecoration: 'none', display: 'block' }}>
          <ChartContainer title="eSSD 업체별 매출" subtitle="4Q24 – 3Q25 (TrendForce)" height={200} clickable>
            <EssdVendorChart />
          </ChartContainer>
        </Link>
        <Link href="/industry#dram-chart" style={{ textDecoration: 'none', display: 'block' }}>
          <ChartContainer title="DRAM 스팟 가격 추이" subtitle="DDR5 16Gb · DDR4 16Gb · DDR3 4Gb (USD/chip)" height={200} clickable>
            <DramSpotChart data={dramSpotPrices} />
          </ChartContainer>
        </Link>
      </div>

      <Divider />

      {/* ══ SECTION 3: 밸류체인 ════════════════════════════ */}
      <SectionHeader num="03" title="밸류체인 기업 동향" sub="CSP · AI반도체 · 메모리 · SSD컨트롤러" href="/valuechain" />

      <VCTablePreview />

      <Divider />

      {/* ══ SECTION 4: 산업 뉴스 ══════════════════════════ */}
      <SectionHeader num="04" title="산업 관련 뉴스" sub="30분마다 갱신 · RSS 기반" href="/news" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {latestNews.map(article => {
          const hours = Math.floor((Date.now() - new Date(article.publishedAt).getTime()) / 3600000);
          const timeAgo = hours < 1 ? '방금 전' : hours < 24 ? `${hours}시간 전` : `${Math.floor(hours/24)}일 전`;
          return (
            <a key={article.id} href={article.url !== '#' ? article.url : undefined} target="_blank" rel="noopener noreferrer"
              style={{
                backgroundColor: C.bgCard, border: `1px solid ${C.border}`,
                borderRadius: '8px', padding: '14px 18px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px',
                textDecoration: 'none', cursor: article.url !== '#' ? 'pointer' : 'default',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = C.borderHi)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: C.textHi, marginBottom: '4px',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {article.title}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.7rem', color: C.textMute }}>{article.source}</span>
                  <span style={{ fontSize: '0.7rem', color: C.textMute }}>·</span>
                  <span style={{ fontSize: '0.7rem', color: C.textMute }}>{timeAgo}</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {article.keywords.slice(0, 3).map(kw => (
                      <span key={kw} style={{
                        fontSize: '0.62rem', color: C.accent, fontWeight: 600,
                        backgroundColor: C.accentLow, padding: '1px 6px', borderRadius: '3px',
                      }}>#{kw}</span>
                    ))}
                  </div>
                </div>
              </div>
              <ArrowRight size={14} style={{ color: C.textMute, flexShrink: 0 }} />
            </a>
          );
        })}
      </div>

    </div>
  );
}
