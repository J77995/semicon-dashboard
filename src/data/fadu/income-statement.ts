import { FinancialRow } from '@/types/financial';

export const INCOME_STATEMENT_QUARTERS = [
  '23Q4', '24Q1', '24Q2', '24Q3', '24Q4',
  '25Q1', '25Q2', '25Q3', '25Q4',
] as const;

export const INCOME_STATEMENT_ITEMS = [
  '매출액', '매출원가', '매출총이익', '판매관리비', '영업이익',
  '기타손익', '금융손익', '법인세차감전순이익', '법인세', '당기순이익', '지배주주순이익',
] as const;

// Raw data: [매출액, 매출원가, 매출총이익, 판매관리비, 영업이익, 기타손익, 금융손익, 법인세차감전순이익, 법인세, 당기순이익, 지배주주순이익]
const rawData: Record<string, number[]> = {
  '23Q4': [4427,  6632,  -2205,  21954, -24159,  -32,  1098, -23093,  0, -23093, -22957],
  '24Q1': [2332,  1860,    472,  16701, -16229,  -11,   791, -15448,  0, -15448, -15172],
  '24Q2': [7093,  6537,    556,  22740, -22185,   94,   643, -21448, 33, -21481, -21055],
  '24Q3': [10095, 7853,   2242,  32786, -30544,  -26,   -90, -30661,  7, -30667, -30593],
  '24Q4': [23983, 21484,  2499,  28590, -26091,  750,  1430, -23911,  1, -23912, -23744],
  '25Q1': [19219, 9063,  10156,  22142, -11986,   -7,  -113, -12105, 32, -12136, -11947],
  '25Q2': [23679, 13493, 10186,  22750, -12564,  135, -2318, -14747,  4, -14751, -14591],
  '25Q3': [25644, 13737, 11907,  23333, -11426,  169,   391, -10866, 16, -10883, -10744],
  '25Q4': [23877, 12467, 11409,  40903, -29494, 1978, -10437, -37953, 495, -38448, -38342],
};

const quarterMeta: Record<string, { year: number; quarterNum: string; periodEnd: string }> = {
  '23Q4': { year: 2023, quarterNum: 'Q4', periodEnd: '2023-12-31' },
  '24Q1': { year: 2024, quarterNum: 'Q1', periodEnd: '2024-03-31' },
  '24Q2': { year: 2024, quarterNum: 'Q2', periodEnd: '2024-06-30' },
  '24Q3': { year: 2024, quarterNum: 'Q3', periodEnd: '2024-09-30' },
  '24Q4': { year: 2024, quarterNum: 'Q4', periodEnd: '2024-12-31' },
  '25Q1': { year: 2025, quarterNum: 'Q1', periodEnd: '2025-03-31' },
  '25Q2': { year: 2025, quarterNum: 'Q2', periodEnd: '2025-06-30' },
  '25Q3': { year: 2025, quarterNum: 'Q3', periodEnd: '2025-09-30' },
  '25Q4': { year: 2025, quarterNum: 'Q4', periodEnd: '2025-12-31' },
};

export const incomeStatement: FinancialRow[] = INCOME_STATEMENT_QUARTERS.flatMap((quarter) => {
  const values = rawData[quarter];
  const { year, quarterNum, periodEnd } = quarterMeta[quarter];
  return INCOME_STATEMENT_ITEMS.map((item, idx) => ({
    quarter,
    year,
    quarterNum,
    periodEnd,
    statementType: '손익계산서',
    category: idx < 5 ? '영업손익' : idx < 8 ? '영업외손익' : '세후손익',
    item,
    valueMillion: values[idx],
    valueEokwon: Math.round(values[idx] / 100) / 10,
  }));
});
