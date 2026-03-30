import { PageHeader } from '@/components/common/PageHeader';
import { ChartContainer } from '@/components/charts/ChartContainer';
import { EssdVendorChart } from '@/components/charts/EssdVendorChart';
import { enterpriseSsdVendors } from '@/data/industry/enterprise-ssd-vendors';
import { fmtQ } from '@/lib/formatQuarter';
import { IndustryPricesSection } from './IndustryPricesSection';
import { PhisonRevenueChart } from '@/components/charts/PhisonRevenueChart';
import type { SpotPricesResponse } from '@/app/api/spot-prices/route';

export const revalidate = 86400;

// ── eSSD 데이터 ────────────────────────────────────────────────────────────────

const VENDORS = ['Samsung', 'SK Group', 'Micron', 'Kioxia', 'SanDisk(WDC)'] as const;
type Vendor = typeof VENDORS[number];

const VENDOR_COLORS: Record<Vendor, string> = {
  Samsung:        '#2563EB',
  'SK Group':     '#DC2626',
  Micron:         '#10B981',
  Kioxia:         '#F59E0B',
  'SanDisk(WDC)': '#6B7280',
};

const vendorQuarters = [...new Set(
  enterpriseSsdVendors.filter(r => r.company !== 'Total').map(r => r.quarter)
)];

function vendorRow(quarter: string, company: string) {
  return enterpriseSsdVendors.find(r => r.quarter === quarter && r.company === company);
}
function totalRow(quarter: string) {
  return enterpriseSsdVendors.find(r => r.quarter === quarter && r.company === 'Total');
}

const latestTotal = totalRow(vendorQuarters[vendorQuarters.length - 1]);
const latestQ = vendorQuarters[vendorQuarters.length - 1];

function QoQBadge({ value }: { value: number | null }) {
  if (value === null) return <span style={{ color: '#94A3B8' }}>—</span>;
  const color = value >= 0 ? '#10B981' : '#EF4444';
  return <span style={{ color, fontWeight: 600, fontSize: '0.75rem' }}>{value >= 0 ? '+' : ''}{value}%</span>;
}

// ── DRAMeXchange 파서 ──────────────────────────────────────────────────────────

const FALLBACK: SpotPricesResponse = {
  dram: [
    { item: 'DDR5 16Gb (2Gx8) 4800/5600', dailyHigh: '—', dailyLow: '—', sessionAvg: '—', change: '—', changeDir: 'stable' },
    { item: 'DDR4 16Gb (2Gx8) 3200',       dailyHigh: '—', dailyLow: '—', sessionAvg: '—', change: '—', changeDir: 'stable' },
    { item: 'DDR3 4Gb 512Mx8 1600/1866',   dailyHigh: '—', dailyLow: '—', sessionAvg: '—', change: '—', changeDir: 'stable' },
  ],
  flash: [
    { item: '128Gb TLC', dailyHigh: '—', dailyLow: '—', sessionAvg: '—', change: '—', changeDir: 'stable' },
    { item: '256Gb TLC', dailyHigh: '—', dailyLow: '—', sessionAvg: '—', change: '—', changeDir: 'stable' },
  ],
  ssd: [
    { brand: 'Samsung', series: '990 Pro', capacity: '1TB', high: '—', low: '—', avg: '—', change: '—', changeDir: 'stable' },
  ],
  fetchedAt: null,
};

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function parseSpotRows(tbodyHtml: string, filters: string[] = []): SpotPricesResponse['dram'] {
  const rows: SpotPricesResponse['dram'] = [];
  const trBlocks = tbodyHtml.match(/<tr[\s\S]*?<\/tr>/gi) ?? [];
  for (const tr of trBlocks) {
    const tds = tr.match(/<td[^>]*>([\s\S]*?)<\/td>/gi) ?? [];
    if (tds.length < 7) continue;
    const itemText = stripTags(tds[0]!);
    if (!itemText) continue;
    if (/^(item|product|description)$/i.test(itemText)) continue;
    if (filters.length > 0 && !filters.some(f => itemText.includes(f))) continue;
    const dailyHigh  = stripTags(tds[1]!);
    const dailyLow   = stripTags(tds[2]!);
    const sessionAvg = stripTags(tds[5]!);
    const changeCell = tds[6]!;
    const changeDir = changeCell.includes('up.gif')   ? 'up' as const
                    : changeCell.includes('down.gif') ? 'down' as const
                    : 'stable' as const;
    const pctMatch = stripTags(changeCell).match(/[-\d.]+\s*%/);
    const change = pctMatch ? pctMatch[0].replace(/\s+/, '') : '—';
    rows.push({ item: itemText, dailyHigh, dailyLow, sessionAvg, change, changeDir });
  }
  return rows;
}

function parseSsdRows(tbodyHtml: string): SpotPricesResponse['ssd'] {
  const rows: SpotPricesResponse['ssd'] = [];
  const trBlocks = tbodyHtml.match(/<tr[\s\S]*?<\/tr>/gi) ?? [];
  for (const tr of trBlocks) {
    const tds = tr.match(/<td[^>]*>([\s\S]*?)<\/td>/gi) ?? [];
    if (tds.length < 7) continue;
    const brand    = stripTags(tds[0]!);
    const series   = stripTags(tds[2]!);
    const capacity = stripTags(tds[3]!);
    const high     = stripTags(tds[4]!);
    const low      = stripTags(tds[5]!);
    const avg      = stripTags(tds[6]!);
    if (!brand) continue;
    const changeCell = tds[7] ?? '';
    const changeDir = changeCell.includes('up.gif')   ? 'up' as const
                    : changeCell.includes('down.gif') ? 'down' as const
                    : 'stable' as const;
    const pctMatch = stripTags(changeCell).match(/[-\d.]+\s*%/);
    const change = pctMatch ? pctMatch[0].replace(/\s+/, '') : '—';
    rows.push({ brand, series, capacity, high, low, avg, change, changeDir });
  }
  return rows;
}

async function fetchSpotData(): Promise<SpotPricesResponse> {
  try {
    const res = await fetch('https://www.dramexchange.com/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
      },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return FALLBACK;
    const html = await res.text();

    const dramMatch  = html.match(/id="tb_NationalDramSpotPrice">([\s\S]*?)<\/tbody>/i);
    const flashMatch = html.match(/id="tb_NationalFlashSpotPrice">([\s\S]*?)<\/tbody>/i);
    const ssdMatch   = html.match(/id="tb_PCC_Price">([\s\S]*?)<\/tbody>/i);

    const dram  = dramMatch  ? parseSpotRows(dramMatch[1],  ['DDR5 16Gb (2Gx8) 4800/5600', 'DDR4 16Gb (2Gx8) 3200', 'DDR3']) : [];
    const flash = flashMatch ? parseSpotRows(flashMatch[1]) : [];
    const ssd   = ssdMatch   ? parseSsdRows(ssdMatch[1])    : [];

    return {
      dram:      dram.length  ? dram  : FALLBACK.dram,
      flash:     flash.length ? flash : FALLBACK.flash,
      ssd:       ssd.length   ? ssd   : FALLBACK.ssd,
      fetchedAt: new Date().toISOString(),
    };
  } catch {
    return FALLBACK;
  }
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function IndustryPage() {
  const spotData = await fetchSpotData();

  return (
    <div style={{ backgroundColor: '#F5F7FA', minHeight: '100vh', color: '#111827' }}>
      <PageHeader
        title="메모리/스토리지 시장현황"
        subtitle="eSSD 시장 현황 · 메모리 스팟 가격"
        backHref="/"
      />

      <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>

        {/* ══ eSSD 시장 규모 ══════════════════════════════════════════════════════ */}
        <section id="essd">
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#111827', margin: 0 }}>eSSD 시장 규모</h2>
            <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '4px 0 0' }}>분기별 엔터프라이즈 SSD 업체별 매출 현황 (자료: TrendForce)</p>
          </div>

          {/* KPI cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.09)', borderRadius: '12px', padding: '20px 24px' }}>
              <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                최신 분기 ({fmtQ(latestQ)}) Top5 합계
              </p>
              <p style={{ fontSize: '2rem', fontWeight: 700, color: '#111827', margin: '6px 0 0' }}>
                ${latestTotal ? (latestTotal.revenueUsdM / 1000).toFixed(1) : '—'}
                <span style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: 400 }}>B</span>
              </p>
              <p style={{ fontSize: '0.7rem', color: '#94A3B8', margin: '4px 0 0' }}>
                USD {latestTotal?.revenueUsdM.toLocaleString()}M
              </p>
            </div>
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.09)', borderRadius: '12px', padding: '20px 24px' }}>
              <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>QoQ 성장 ({fmtQ(latestQ)})</p>
              <p style={{ fontSize: '2rem', fontWeight: 700, color: (latestTotal?.qoqPct ?? 0) >= 0 ? '#10B981' : '#EF4444', margin: '6px 0 0' }}>
                {latestTotal?.qoqPct !== null && latestTotal?.qoqPct !== undefined
                  ? `${latestTotal.qoqPct >= 0 ? '+' : ''}${latestTotal.qoqPct}%`
                  : '—'}
              </p>
              <p style={{ fontSize: '0.7rem', color: '#94A3B8', margin: '4px 0 0' }}>전분기 대비 Top5 합계</p>
            </div>
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.09)', borderRadius: '12px', padding: '20px 24px' }}>
              <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>1위 업체 ({fmtQ(latestQ)})</p>
              <p style={{ fontSize: '2rem', fontWeight: 700, color: VENDOR_COLORS['Samsung'], margin: '6px 0 0' }}>Samsung</p>
              <p style={{ fontSize: '0.7rem', color: '#94A3B8', margin: '4px 0 0' }}>
                {vendorRow(latestQ, 'Samsung')?.marketSharePct}% 점유율 &nbsp;·&nbsp;
                ${((vendorRow(latestQ, 'Samsung')?.revenueUsdM ?? 0) / 1000).toFixed(1)}B
              </p>
            </div>
          </div>

          {/* Stacked bar chart */}
          <div id="essd-chart">
          <ChartContainer
            title="업체별 eSSD 매출 (분기별 스택)"
            subtitle="Samsung · SK Group · Micron · Kioxia · SanDisk(WDC)  — 단위: USD M  (자료: TrendForce)"
            height={400}
          >
            <EssdVendorChart />
          </ChartContainer>
          </div>

          {/* Vendor table */}
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.09)', borderRadius: '12px', overflow: 'hidden', marginTop: '24px' }}>
            <div style={{ padding: '20px 24px 14px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: 0 }}>업체별 매출 및 시장점유율</h3>
              <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '3px 0 0' }}>
                {fmtQ(vendorQuarters[0])} ~ {fmtQ(vendorQuarters[vendorQuarters.length - 1])} · 단위: USD M · 괄호 = 시장점유율 (%) · 자료: TrendForce
              </p>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                <thead>
                  <tr style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}>
                    <th style={{ padding: '9px 24px', textAlign: 'left', color: '#64748B', fontWeight: 500, whiteSpace: 'nowrap' }}>분기</th>
                    {VENDORS.map(v => (
                      <th key={v} style={{ padding: '9px 14px', textAlign: 'right', color: VENDOR_COLORS[v], fontWeight: 600, whiteSpace: 'nowrap' }}>{v}</th>
                    ))}
                    <th style={{ padding: '9px 14px', textAlign: 'right', color: '#64748B', fontWeight: 500, whiteSpace: 'nowrap' }}>Top5 합계</th>
                    <th style={{ padding: '9px 24px 9px 14px', textAlign: 'right', color: '#64748B', fontWeight: 500, whiteSpace: 'nowrap' }}>QoQ</th>
                  </tr>
                </thead>
                <tbody>
                  {vendorQuarters.map((q, i) => {
                    const total = totalRow(q);
                    return (
                      <tr key={q} style={{ borderTop: '1px solid rgba(0,0,0,0.07)', backgroundColor: i % 2 === 1 ? 'rgba(0,0,0,0.015)' : 'transparent' }}>
                        <td style={{ padding: '10px 24px', color: '#111827', fontWeight: 600 }}>{fmtQ(q)}</td>
                        {VENDORS.map(v => {
                          const row = vendorRow(q, v);
                          return (
                            <td key={v} style={{ padding: '10px 14px', textAlign: 'right', color: '#111827' }}>
                              {row ? (
                                <>
                                  <span style={{ fontWeight: 600 }}>{row.revenueUsdM.toLocaleString()}</span>
                                  <span style={{ color: '#94A3B8', fontSize: '0.7rem', marginLeft: '4px' }}>({row.marketSharePct}%)</span>
                                </>
                              ) : '—'}
                            </td>
                          );
                        })}
                        <td style={{ padding: '10px 14px', textAlign: 'right', color: '#111827', fontWeight: 700 }}>
                          {total ? total.revenueUsdM.toLocaleString() : '—'}
                        </td>
                        <td style={{ padding: '10px 24px 10px 14px', textAlign: 'right' }}>
                          <QoQBadge value={total?.qoqPct ?? null} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── 구분선 ───────────────────────────────────────────────────────────── */}
        <div style={{ height: '1px', backgroundColor: 'rgba(0,0,0,0.08)' }} />

        {/* ══ 메모리 스팟 가격 ════════════════════════════════════════════════════ */}
        <section id="prices">
          <IndustryPricesSection spotData={spotData} />
        </section>

        {/* ── 구분선 ───────────────────────────────────────────────────────────── */}
        <div style={{ height: '1px', backgroundColor: 'rgba(0,0,0,0.08)' }} />

        {/* ══ Phison 월간 매출 ═══════════════════════════════════════════════════ */}
        <section id="phison">
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#111827', margin: 0 }}>SSD 컨트롤러 월간 매출액 (Phison)</h2>
            <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '4px 0 0' }}>월별 순매출 및 YoY 성장률 · 단위: 億元(TWD) · 자료: Phison 공시</p>
          </div>
          <ChartContainer title="Phison 월간 매출 추이" subtitle="좌: 월매출(億TWD) | 우: YoY(%)" height={320}>
            <PhisonRevenueChart />
          </ChartContainer>
        </section>

      </div>
    </div>
  );
}
