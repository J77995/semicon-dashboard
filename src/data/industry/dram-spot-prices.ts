// DRAM 현물가 (USD/chip) — 도표 25 이미지에서 대략 추출
// 자료: DRAMeXchange, 교보증권 리서치센터
// 기간: 2025-01 ~ 2026-03

export interface DramSpotPoint {
  yearMonth: string;
  ddr5_16Gb: number;   // DDR5 16Gb (2G×8) 4800/5600
  ddr4_16Gb: number;   // DDR4 16Gb (2G×8) 3200
  ddr3_4Gb: number;    // DDR3  4Gb (512M×8) 1600/1866
}

export const dramSpotPrices: DramSpotPoint[] = [
  { yearMonth: '2025-01', ddr5_16Gb:  4.50, ddr4_16Gb:  3.00, ddr3_4Gb:  3.00 },
  { yearMonth: '2025-02', ddr5_16Gb:  4.50, ddr4_16Gb:  3.00, ddr3_4Gb:  3.00 },
  { yearMonth: '2025-03', ddr5_16Gb:  5.00, ddr4_16Gb:  3.00, ddr3_4Gb:  3.00 },
  { yearMonth: '2025-04', ddr5_16Gb:  5.00, ddr4_16Gb:  3.50, ddr3_4Gb:  3.00 },
  { yearMonth: '2025-05', ddr5_16Gb:  5.00, ddr4_16Gb:  4.00, ddr3_4Gb:  3.20 },
  { yearMonth: '2025-06', ddr5_16Gb:  5.50, ddr4_16Gb:  4.50, ddr3_4Gb:  3.50 },
  { yearMonth: '2025-07', ddr5_16Gb:  6.00, ddr4_16Gb:  5.50, ddr3_4Gb:  3.80 },
  { yearMonth: '2025-08', ddr5_16Gb:  7.00, ddr4_16Gb:  6.00, ddr3_4Gb:  4.00 },
  { yearMonth: '2025-09', ddr5_16Gb:  8.00, ddr4_16Gb:  9.00, ddr3_4Gb:  4.50 },
  { yearMonth: '2025-10', ddr5_16Gb: 10.00, ddr4_16Gb: 27.00, ddr3_4Gb:  5.00 },
  { yearMonth: '2025-11', ddr5_16Gb: 14.00, ddr4_16Gb: 56.00, ddr3_4Gb:  6.00 },
  { yearMonth: '2025-12', ddr5_16Gb: 22.00, ddr4_16Gb: 72.00, ddr3_4Gb:  7.00 },
  { yearMonth: '2026-01', ddr5_16Gb: 30.00, ddr4_16Gb: 78.00, ddr3_4Gb:  7.50 },
  { yearMonth: '2026-02', ddr5_16Gb: 36.00, ddr4_16Gb: 79.00, ddr3_4Gb:  7.80 },
  { yearMonth: '2026-03', ddr5_16Gb: 40.00, ddr4_16Gb: 77.00, ddr3_4Gb:  7.50 },
];
