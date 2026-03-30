import { EnterpriseSsdVendorQuarter } from '@/types/industry';

// Enterprise SSD Vendor Revenue Rankings (Unit: Million USD)
// 자료: TrendForce (March 2025, June 2025, Sept. 2025, Dec. 2025)
// 4개 분기 테이블을 하나로 통합. 동일 분기에 여러 출처가 있을 경우 최신 발행 기준.
//
// Notes:
// - WDC completed NAND Flash spin-off in Oct 2024 → consolidated under SanDisk(WDC) starting 1Q25.
// - SK Group = SK hynix + Solidigm
// - Market share(%) for each quarter is based on "Total of Top 5" or "Total" as reported.

export const enterpriseSsdVendors: EnterpriseSsdVendorQuarter[] = [
  // ────────────────────────────────────────────────
  // 4Q24  — 1Q25 QoQ 기반 역산 (Revenue = 1Q25 Revenue ÷ (1 + QoQ%))
  //         SanDisk(WDC)는 1Q25 QoQ 미제공으로 원본 테이블 값 사용
  //         Market share: 1Q25 테이블 "4Q24" 열 기준
  // ────────────────────────────────────────────────
  { quarter: '4Q24', company: 'Samsung',      revenueUsdM: 2902.5, qoqPct: null, marketSharePct: 39.5 },
  { quarter: '4Q24', company: 'SK Group',     revenueUsdM: 2300.2, qoqPct: null, marketSharePct: 31.3 },
  { quarter: '4Q24', company: 'Micron',       revenueUsdM: 1171.9, qoqPct: null, marketSharePct: 16.0 },
  { quarter: '4Q24', company: 'Kioxia',       revenueUsdM:  724.3, qoqPct: null, marketSharePct:  9.9 },
  { quarter: '4Q24', company: 'SanDisk(WDC)', revenueUsdM:  245.0, qoqPct: null, marketSharePct:  3.3 },
  { quarter: '4Q24', company: 'Total',        revenueUsdM: 7343.9, qoqPct: null, marketSharePct: 100.0 },

  // ────────────────────────────────────────────────
  // 1Q25  — Source: TrendForce, June 2025
  // ────────────────────────────────────────────────
  { quarter: '1Q25', company: 'Samsung',      revenueUsdM: 1889.0, qoqPct: -34.9, marketSharePct: 39.6 },
  { quarter: '1Q25', company: 'SK Group',     revenueUsdM:  993.7, qoqPct: -56.8, marketSharePct: 20.8 },
  { quarter: '1Q25', company: 'Micron',       revenueUsdM:  852.0, qoqPct: -27.3, marketSharePct: 17.9 },
  { quarter: '1Q25', company: 'Kioxia',       revenueUsdM:  566.4, qoqPct: -21.8, marketSharePct: 11.9 },
  { quarter: '1Q25', company: 'SanDisk(WDC)', revenueUsdM:  232.0, qoqPct:  null, marketSharePct:  4.9 },
  { quarter: '1Q25', company: 'Total',        revenueUsdM: 4533.1, qoqPct:  null, marketSharePct: 95.1 },

  // ────────────────────────────────────────────────
  // 2Q25  — Source: TrendForce, Sept. 2025
  // ────────────────────────────────────────────────
  { quarter: '2Q25', company: 'Samsung',      revenueUsdM: 1899.0, qoqPct:   0.5, marketSharePct: 34.6 },
  { quarter: '2Q25', company: 'SK Group',     revenueUsdM: 1461.7, qoqPct:  47.1, marketSharePct: 26.7 },
  { quarter: '2Q25', company: 'Micron',       revenueUsdM:  784.6, qoqPct:  -7.9, marketSharePct: 14.3 },
  { quarter: '2Q25', company: 'Kioxia',       revenueUsdM:  750.3, qoqPct:  32.5, marketSharePct: 13.7 },
  { quarter: '2Q25', company: 'SanDisk(WDC)', revenueUsdM:  213.0, qoqPct:  -8.2, marketSharePct:  3.9 },
  { quarter: '2Q25', company: 'Total',        revenueUsdM: 5108.6, qoqPct:  12.7, marketSharePct: 93.2 },

  // ────────────────────────────────────────────────
  // 3Q25  — Source: TrendForce, Dec. 2025
  // ────────────────────────────────────────────────
  { quarter: '3Q25', company: 'Samsung',      revenueUsdM: 2441.9, qoqPct:  28.6, marketSharePct: 35.1 },
  { quarter: '3Q25', company: 'SK Group',     revenueUsdM: 1861.0, qoqPct:  27.3, marketSharePct: 26.8 },
  { quarter: '3Q25', company: 'Micron',       revenueUsdM:  991.0, qoqPct:  26.3, marketSharePct: 14.3 },
  { quarter: '3Q25', company: 'Kioxia',       revenueUsdM:  978.4, qoqPct:  30.4, marketSharePct: 14.1 },
  { quarter: '3Q25', company: 'SanDisk(WDC)', revenueUsdM:  269.0, qoqPct:  26.3, marketSharePct:  3.9 },
  { quarter: '3Q25', company: 'Total',        revenueUsdM: 6541.3, qoqPct:  28.0, marketSharePct: 94.2 },
];
