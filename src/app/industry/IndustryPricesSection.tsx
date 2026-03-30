'use client';

import { useState } from 'react';
import { ChartContainer } from '@/components/charts/ChartContainer';
import { DramSpotChart } from '@/components/charts/DramSpotChart';
import { NandSpotChart } from '@/components/charts/NandSpotChart';
import { dramSpotPrices } from '@/data/industry/dram-spot-prices';
import { nandSpotPrices } from '@/data/industry/nand-spot-prices';
import type { SpotPricesResponse, SpotRow, SsdRow } from '@/app/api/spot-prices/route';

type TabType = 'dram' | 'nand';

const CHANGE_COLOR: Record<SpotRow['changeDir'], string> = {
  up:     '#10B981',
  down:   '#EF4444',
  stable: '#64748B',
};

const tableCardStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  border: '1px solid rgba(0,0,0,0.09)',
  borderRadius: '12px',
  overflow: 'hidden',
};

function SpotTable({ title, rows, fetchedAt }: { title: string; rows: SpotRow[]; fetchedAt: string | null }) {
  const formattedAt = fetchedAt
    ? new Date(fetchedAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', hour12: false })
    : null;
  return (
    <div style={tableCardStyle}>
      <div style={{ padding: '20px 24px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: 0 }}>{title}</h3>
        <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
          {formattedAt ? `갱신: ${formattedAt}` : '데이터 없음 (fallback)'}
        </span>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
          <thead>
            <tr style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}>
              {['제품', 'Daily High', 'Daily Low', 'Session Avg', '변동'].map(h => (
                <th key={h} style={{ padding: '9px 16px', textAlign: h === '제품' ? 'left' : 'right', color: '#64748B', fontWeight: 500, whiteSpace: 'nowrap', ...(h === '제품' ? { paddingLeft: '24px' } : {}) }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.item} style={{ borderTop: '1px solid rgba(0,0,0,0.07)', backgroundColor: i % 2 === 1 ? 'rgba(0,0,0,0.015)' : 'transparent' }}>
                <td style={{ padding: '11px 16px 11px 24px', color: '#111827', fontWeight: 500 }}>{row.item}</td>
                <td style={{ padding: '11px 16px', textAlign: 'right', color: '#64748B' }}>{row.dailyHigh !== '—' ? `$${row.dailyHigh}` : '—'}</td>
                <td style={{ padding: '11px 16px', textAlign: 'right', color: '#64748B' }}>{row.dailyLow !== '—' ? `$${row.dailyLow}` : '—'}</td>
                <td style={{ padding: '11px 16px', textAlign: 'right', color: '#111827', fontWeight: 600 }}>{row.sessionAvg !== '—' ? `$${row.sessionAvg}` : '—'}</td>
                <td style={{ padding: '11px 24px 11px 16px', textAlign: 'right', color: CHANGE_COLOR[row.changeDir], fontWeight: 600 }}>
                  {row.changeDir === 'up' ? '▲ ' : row.changeDir === 'down' ? '▼ ' : ''}{row.change}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <SourceFooter />
    </div>
  );
}

function SsdTable({ rows, fetchedAt }: { rows: SsdRow[]; fetchedAt: string | null }) {
  const formattedAt = fetchedAt
    ? new Date(fetchedAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', hour12: false })
    : null;
  return (
    <div style={tableCardStyle}>
      <div style={{ padding: '20px 24px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', margin: 0 }}>SSD Street Price (PC Client OEM)</h3>
        <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
          {formattedAt ? `갱신: ${formattedAt}` : '데이터 없음 (fallback)'}
        </span>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
          <thead>
            <tr style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }}>
              {['브랜드', '시리즈', '용량', 'High', 'Low', 'Avg', '변동'].map(h => (
                <th key={h} style={{ padding: '9px 16px', textAlign: h === '브랜드' ? 'left' : 'right', color: '#64748B', fontWeight: 500, whiteSpace: 'nowrap', ...(h === '브랜드' ? { paddingLeft: '24px' } : {}) }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={`${row.brand}-${row.series}-${row.capacity}-${i}`} style={{ borderTop: '1px solid rgba(0,0,0,0.07)', backgroundColor: i % 2 === 1 ? 'rgba(0,0,0,0.015)' : 'transparent' }}>
                <td style={{ padding: '11px 16px 11px 24px', color: '#111827', fontWeight: 500 }}>{row.brand}</td>
                <td style={{ padding: '11px 16px', textAlign: 'right', color: '#64748B' }}>{row.series}</td>
                <td style={{ padding: '11px 16px', textAlign: 'right', color: '#64748B' }}>{row.capacity}</td>
                <td style={{ padding: '11px 16px', textAlign: 'right', color: '#64748B' }}>{row.high !== '—' ? `$${row.high}` : '—'}</td>
                <td style={{ padding: '11px 16px', textAlign: 'right', color: '#64748B' }}>{row.low !== '—' ? `$${row.low}` : '—'}</td>
                <td style={{ padding: '11px 16px', textAlign: 'right', color: '#111827', fontWeight: 600 }}>{row.avg !== '—' ? `$${row.avg}` : '—'}</td>
                <td style={{ padding: '11px 24px 11px 16px', textAlign: 'right', color: CHANGE_COLOR[row.changeDir], fontWeight: 600 }}>
                  {row.changeDir === 'up' ? '▲ ' : row.changeDir === 'down' ? '▼ ' : ''}{row.change}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <SourceFooter />
    </div>
  );
}

function SourceFooter() {
  return (
    <div style={{ padding: '10px 24px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
      <a href="https://www.dramexchange.com/" target="_blank" rel="noopener noreferrer"
        style={{ fontSize: '0.7rem', color: '#2563EB', textDecoration: 'none' }}>
        출처: DRAMeXchange ↗
      </a>
    </div>
  );
}

export function IndustryPricesSection({ spotData }: { spotData: SpotPricesResponse }) {
  const [tab, setTab] = useState<TabType>('dram');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* 섹션 제목 */}
      <div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#111827', margin: 0 }}>메모리 스팟 가격</h2>
        <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '4px 0 0' }}>DRAM · NAND 월별 가격 추이 (자료: DRAMeXchange)</p>
      </div>

      {/* Tab selector */}
      <div style={{ display: 'inline-flex', gap: '4px', backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.09)', borderRadius: '10px', padding: '4px', alignSelf: 'flex-start' }}>
        {(['dram', 'nand'] as TabType[]).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '7px 24px', borderRadius: '7px', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: tab === t ? 600 : 400, backgroundColor: tab === t ? '#2563EB' : 'transparent', color: tab === t ? '#FFFFFF' : '#64748B', transition: 'all 0.15s' }}>
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Chart */}
      {tab === 'dram' ? (
        <div id="dram-chart">
        <ChartContainer title="DRAM 스팟 가격 추이" subtitle="DDR5 16Gb · DDR4 16Gb · DDR3 4Gb 월별 현물가 (USD/chip)" height={400}>
          <DramSpotChart data={dramSpotPrices} />
        </ChartContainer>
        </div>
      ) : (
        <ChartContainer title="NAND 스팟 가격 추이" subtitle="1Tb QLC Spot · Contract 월별 현물가 (USD) — TrendForce/DRAMeXchange" height={400}>
          <NandSpotChart data={nandSpotPrices} />
        </ChartContainer>
      )}

      {/* Live tables */}
      {tab === 'dram' ? (
        <SpotTable title="DRAMeXchange 현물가 (실시간)" rows={spotData.dram} fetchedAt={spotData.fetchedAt} />
      ) : (
        <>
          <SpotTable title="NAND Flash Spot Price (DRAMeXchange)" rows={spotData.flash} fetchedAt={spotData.fetchedAt} />
          <SsdTable rows={spotData.ssd} fetchedAt={spotData.fetchedAt} />
        </>
      )}
    </div>
  );
}
