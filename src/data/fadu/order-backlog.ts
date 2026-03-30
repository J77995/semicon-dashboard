// 파두 수주잔고 (Order Backlog) 데이터
// Source: DART 사업보고서 (2026.03.18), 2025.12.31 기준
// Unit: USD 천달러 (USD thousands)
//
// 수주잔고: 계약 체결 후 아직 이행되지 않은 주문 잔액
// 파두는 주로 AI 데이터센터향 엔터프라이즈 SSD 공급계약을 수주

export interface OrderBacklogEntry {
  reportDate: string;       // 기준일 (ISO date)
  product: string;
  contractDate: string;     // 계약일
  deliveryDate: string;     // 납기일
  totalAmountUSD: number;   // 총 계약금액 (USD 천)
  completedUSD: number;     // 이행 완료금액 (USD 천)
  remainingUSD: number;     // 수주잔고 (미이행, USD 천)
  note?: string;
}

// 2025.12.31 기준 수주현황 (총 USD 88,054천 = 약 1,280억원)
export const ORDER_BACKLOG_2025: OrderBacklogEntry[] = [
  {
    reportDate: '2025-12-31',
    product: 'Enterprise SSD (AI DC용)',
    contractDate: '2025-08-18',
    deliveryDate: '2025-12-25',
    totalAmountUSD: 3420,
    completedUSD: 3420,
    remainingUSD: 0,
  },
  {
    reportDate: '2025-12-31',
    product: 'Enterprise SSD',
    contractDate: '2025-08-18',
    deliveryDate: '2026-01-02',
    totalAmountUSD: 7128,
    completedUSD: 7128,
    remainingUSD: 0,
  },
  {
    reportDate: '2025-12-31',
    product: 'Enterprise SSD (1)',
    contractDate: '2025-09-18',
    deliveryDate: '2026-01-19',
    totalAmountUSD: 7600,
    completedUSD: 7600,
    remainingUSD: 0,
    note: '2025.11.05 계약 → 2026.01.22 납품 완료',
  },
  {
    reportDate: '2025-12-31',
    product: 'Enterprise SSD',
    contractDate: '2025-10-16',
    deliveryDate: '2026-05-15',
    totalAmountUSD: 4825,
    completedUSD: 0,
    remainingUSD: 4825,
  },
  {
    reportDate: '2025-12-31',
    product: 'Enterprise SSD',
    contractDate: '2025-10-24',
    deliveryDate: '2026-03-01',
    totalAmountUSD: 9253,
    completedUSD: 0,
    remainingUSD: 9253,
  },
  {
    reportDate: '2025-12-31',
    product: 'Enterprise SSD',
    contractDate: '2025-11-04',
    deliveryDate: '2026-10-02',
    totalAmountUSD: 32952,
    completedUSD: 0,
    remainingUSD: 32952,
  },
  {
    reportDate: '2025-12-31',
    product: 'Enterprise SSD',
    contractDate: '2025-11-10',
    deliveryDate: '2026-04-01',
    totalAmountUSD: 9956,
    completedUSD: 0,
    remainingUSD: 9956,
  },
  {
    reportDate: '2025-12-31',
    product: 'Enterprise SSD',
    contractDate: '2025-12-01',
    deliveryDate: '2026-04-01',
    totalAmountUSD: 8360,
    completedUSD: 0,
    remainingUSD: 8360,
  },
  {
    reportDate: '2025-12-31',
    product: 'Enterprise SSD',
    contractDate: '2025-12-19',
    deliveryDate: '2026-05-01',
    totalAmountUSD: 4560,
    completedUSD: 0,
    remainingUSD: 4560,
  },
];

// 수주잔고 요약 (연도별)
export interface BacklogSummary {
  reportDate: string;
  totalUSD: number;        // 총 수주잔액 (USD 천)
  completedUSD: number;    // 이행 완료 (USD 천)
  remainingUSD: number;    // 미이행 잔고 (USD 천)
  totalKRW: number;        // 총 수주잔액 추정 (백만원, USD×1,440원 환율 기준)
  remainingKRW: number;    // 미이행 잔고 추정 (백만원)
}

export const BACKLOG_SUMMARY: BacklogSummary[] = [
  {
    reportDate: '2025-12-31',
    totalUSD: 88054,
    completedUSD: 18148,
    remainingUSD: 69906,
    totalKRW: Math.round(88054 * 1440 / 1000),     // ≈ 126,798 백만원
    remainingKRW: Math.round(69906 * 1440 / 1000), // ≈ 100,664 백만원
  },
];
