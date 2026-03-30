// NAND 1Tb QLC 가격 (USD) — 도표 26 이미지에서 대략 추출
// 자료: TrendForce, 교보증권 리서치센터
// 기간: 2023-01 ~ 2026-03

export interface NandSpotPoint {
  yearMonth: string;
  spot: number;        // Spot 가격 (USD)
  contract: number;    // Contract 가격 (USD)
}

export const nandSpotPrices: NandSpotPoint[] = [
  // 2023
  { yearMonth: '2023-01', spot:  3.50, contract: 20.00 },
  { yearMonth: '2023-02', spot:  3.30, contract: 19.50 },
  { yearMonth: '2023-03', spot:  3.20, contract: 19.00 },
  { yearMonth: '2023-04', spot:  3.00, contract: 18.50 },
  { yearMonth: '2023-05', spot:  3.00, contract: 18.00 },
  { yearMonth: '2023-06', spot:  3.20, contract: 17.50 },
  { yearMonth: '2023-07', spot:  3.50, contract: 17.50 },
  { yearMonth: '2023-08', spot:  3.80, contract: 18.00 },
  { yearMonth: '2023-09', spot:  4.00, contract: 18.50 },
  { yearMonth: '2023-10', spot:  4.20, contract: 19.00 },
  { yearMonth: '2023-11', spot:  4.50, contract: 19.50 },
  { yearMonth: '2023-12', spot:  4.80, contract: 20.00 },
  // 2024
  { yearMonth: '2024-01', spot:  5.00, contract: 20.00 },
  { yearMonth: '2024-02', spot:  5.20, contract: 20.00 },
  { yearMonth: '2024-03', spot:  5.50, contract: 20.00 },
  { yearMonth: '2024-04', spot:  5.80, contract: 20.00 },
  { yearMonth: '2024-05', spot:  6.00, contract: 20.00 },
  { yearMonth: '2024-06', spot:  6.50, contract: 20.50 },
  { yearMonth: '2024-07', spot:  7.00, contract: 21.00 },
  { yearMonth: '2024-08', spot:  6.50, contract: 20.50 },
  { yearMonth: '2024-09', spot:  6.00, contract: 20.00 },
  { yearMonth: '2024-10', spot:  5.50, contract: 19.50 },
  { yearMonth: '2024-11', spot:  5.20, contract: 19.50 },
  { yearMonth: '2024-12', spot:  5.00, contract: 19.50 },
  // 2025
  { yearMonth: '2025-01', spot:  5.00, contract: 19.50 },
  { yearMonth: '2025-02', spot:  4.80, contract: 19.50 },
  { yearMonth: '2025-03', spot:  4.80, contract: 20.00 },
  { yearMonth: '2025-04', spot:  4.80, contract: 20.00 },
  { yearMonth: '2025-05', spot:  4.80, contract: 20.00 },
  { yearMonth: '2025-06', spot:  5.00, contract: 20.00 },
  { yearMonth: '2025-07', spot:  5.00, contract: 20.00 },
  { yearMonth: '2025-08', spot:  5.20, contract: 20.50 },
  { yearMonth: '2025-09', spot:  5.50, contract: 21.00 },
  { yearMonth: '2025-10', spot:  7.00, contract: 22.00 },
  { yearMonth: '2025-11', spot: 10.00, contract: 25.00 },
  { yearMonth: '2025-12', spot: 18.00, contract: 30.00 },
  // 2026
  { yearMonth: '2026-01', spot: 30.00, contract: 35.00 },
  { yearMonth: '2026-02', spot: 38.00, contract: 40.00 },
  { yearMonth: '2026-03', spot: 47.00, contract: 45.00 },
];
