// 파두 매출 구성 데이터 (제품별 매출비중)
// Source: DART 사업보고서 (연간), 2026.03.18 기준
// Unit: 백만원 (KRW millions)
//
// 제품 분류:
//   SSD컨트롤러 IC: 자체 설계 Fabless SSD 컨트롤러 (PCIe Gen4/5 NVMe)
//   SSD완성품: 컨트롤러 탑재 완성형 SSD 모듈 (E1.S, U.2, M.2 등)
//   기타: 라이선스, 개발서비스 등

export interface RevenueBreakdownItem {
  period: string;         // e.g. '2025FY'
  periodEnd: string;      // ISO date of period end
  year: number;
  product: string;
  revenueMillion: number;
  share: number;          // percentage 0-100
}

export const ANNUAL_REVENUE_BREAKDOWN: RevenueBreakdownItem[] = [
  // FY2023 (2023.01.01~12.31) — from DART 사업보고서 (2024.03.20)
  { period: '2023FY', periodEnd: '2023-12-31', year: 2023, product: 'SSD컨트롤러', revenueMillion: 15474, share: 68.9 },
  { period: '2023FY', periodEnd: '2023-12-31', year: 2023, product: 'SSD완성품',   revenueMillion:  6994, share: 31.1 },
  { period: '2023FY', periodEnd: '2023-12-31', year: 2023, product: '기타',         revenueMillion:     3, share:  0.0 },
  { period: '2023FY', periodEnd: '2023-12-31', year: 2023, product: '합계',         revenueMillion: 22471, share: 100.0 },

  // FY2024 (2024.01.01~12.31) — from DART 사업보고서 (2025.08.14 정정)
  { period: '2024FY', periodEnd: '2024-12-31', year: 2024, product: 'SSD컨트롤러', revenueMillion: 23906, share: 55.0 },
  { period: '2024FY', periodEnd: '2024-12-31', year: 2024, product: 'SSD완성품',   revenueMillion: 18230, share: 41.9 },
  { period: '2024FY', periodEnd: '2024-12-31', year: 2024, product: '기타',         revenueMillion:  1367, share:  3.1 },
  { period: '2024FY', periodEnd: '2024-12-31', year: 2024, product: '합계',         revenueMillion: 43503, share: 100.0 },

  // FY2025 (2025.01.01~12.31) — from DART 사업보고서 (2026.03.18)
  { period: '2025FY', periodEnd: '2025-12-31', year: 2025, product: 'SSD컨트롤러', revenueMillion: 64153, share: 69.4 },
  { period: '2025FY', periodEnd: '2025-12-31', year: 2025, product: 'SSD완성품',   revenueMillion: 18542, share: 20.1 },
  { period: '2025FY', periodEnd: '2025-12-31', year: 2025, product: '기타',         revenueMillion:  9724, share: 10.5 },
  { period: '2025FY', periodEnd: '2025-12-31', year: 2025, product: '합계',         revenueMillion: 92419, share: 100.0 },
];

// 주요 고객 매출 비중 (연간)
export interface CustomerConcentration {
  period: string;
  periodEnd: string;
  year: number;
  customer: string;
  revenueMillion: number;
  share: number;
}

export const CUSTOMER_CONCENTRATION: CustomerConcentration[] = [
  // FY2023
  { period: '2023FY', periodEnd: '2023-12-31', year: 2023, customer: '상위고객',   revenueMillion:   198, share:  0.88 },
  { period: '2023FY', periodEnd: '2023-12-31', year: 2023, customer: '기타고객',   revenueMillion: 22273, share: 99.12 },

  // FY2024
  { period: '2024FY', periodEnd: '2024-12-31', year: 2024, customer: 'Customer A', revenueMillion: 14335, share: 32.95 },
  { period: '2024FY', periodEnd: '2024-12-31', year: 2024, customer: '기타고객',   revenueMillion: 29168, share: 67.05 },

  // FY2025 — Customer1(AI hyperscaler) dominates
  { period: '2025FY', periodEnd: '2025-12-31', year: 2025, customer: 'Customer1',  revenueMillion: 54437, share: 58.90 },
  { period: '2025FY', periodEnd: '2025-12-31', year: 2025, customer: '기타고객',   revenueMillion: 37982, share: 41.10 },
];
