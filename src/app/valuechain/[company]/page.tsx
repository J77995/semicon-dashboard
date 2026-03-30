import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCompanyFinancials, COMPANY_META } from '@/lib/company-financials';
import { CompanyFinancialTable } from '@/components/valuechain/CompanyFinancialTable';
import CompanyPnLChart from '@/components/valuechain/CompanyPnLChart';
import CompanyMarginChart from '@/components/valuechain/CompanyMarginChart';
import EarningsCallSummaryCard from '@/components/valuechain/EarningsCallSummaryCard';
import earningsCallsDb from '@/data/valuechain/earnings-calls/earnings-calls-db.json';

// Pre-render all 14 company ticker pages at build time
export function generateStaticParams() {
  return Object.keys(COMPANY_META).map((ticker) => ({ company: ticker }));
}

interface PageProps {
  params: Promise<{ company: string }>;
}

export default async function CompanyDetailPage({ params }: PageProps) {
  const { company: ticker } = await params;

  const meta = COMPANY_META[ticker];
  if (!meta) notFound();

  const data = getCompanyFinancials(ticker);
  if (!data) notFound();

  const { quarters } = data;

  // 최근 8분기 컨퍼런스콜 — DB에서 ticker로 필터, periodEndMonth 내림차순
  const allCalls = (earningsCallsDb as {
    ticker: string; company: string; fiscalLabel: string;
    callDate: string; periodEndMonth: string; summary?: string;
  }[]);
  const callSlots = allCalls
    .filter(c => c.ticker === ticker)
    .sort((a, b) => b.periodEndMonth.localeCompare(a.periodEndMonth))
    .slice(0, 8);

  return (
    <div style={{ backgroundColor: '#F5F7FA', minHeight: '100vh', color: '#111827' }}>

      {/* ── Page Header ── */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E5E7EB',
        padding: '18px 32px 20px',
      }}>
        <Link
          href="/valuechain"
          style={{
            fontSize: '0.78rem',
            color: '#6B7280',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            marginBottom: '10px',
          }}
        >
          ← 밸류체인 기업 동향
        </Link>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
          <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#111827' }}>
            {meta.nameKR}
          </h1>
          <span style={{ fontSize: '1rem', color: '#6B7280', fontWeight: 400 }}>
            {meta.nameEN}
          </span>
          <span style={{
            fontSize: '0.72rem',
            color: '#9CA3AF',
            backgroundColor: '#F3F4F6',
            padding: '2px 8px',
            borderRadius: '4px',
            fontFamily: 'monospace',
          }}>
            {ticker}
          </span>
        </div>
      </div>

      <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* ── Financial Table ── */}
        <CompanyFinancialTable
          quarters={quarters}
          currency={meta.currency}
          unit={meta.unit}
        />

        {/* ── Charts (side by side) ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <CompanyPnLChart
            quarters={quarters}
            currency={meta.currency}
            unit={meta.unit}
          />
          <CompanyMarginChart quarters={quarters} />
        </div>

        {/* ── Conference Call Section ── */}
        <div id="earnings-call" style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: '8px',
          padding: '20px 24px',
        }}>
          <h2 style={{ margin: '0 0 16px 0', fontSize: '1rem', fontWeight: 700, color: '#111827' }}>
            컨퍼런스콜 주요내용
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
          }}>
            {callSlots.map((call, i) => (
              <EarningsCallSummaryCard key={i} call={call} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
