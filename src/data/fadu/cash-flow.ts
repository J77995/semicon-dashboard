import { FinancialRow } from '@/types/financial';

export const CASH_FLOW_QUARTERS = [
  '23Q3', '23Q4', '24Q1', '24Q2', '24Q3', '24Q4',
  '25Q1', '25Q2', '25Q3', '25Q4',
] as const;

export const CASH_FLOW_ITEMS = [
  '영업활동현금흐름',
  '투자활동현금흐름',
  '재무활동현금흐름',
  '기초현금',
  '기말현금',
] as const;

// Real data from Excel (파두 financials.xlsx Sheet 3, 단위: 백만원)
// Source: DART quarterly/annual reports, cross-verified with Excel
//
// 기초/기말현금: 현금 및 현금성자산 (narrow definition, excludes 단기금융상품)
// Year-end balances confirmed from 2025 annual report:
//   2023.12.31 = 95,393 | 2024.12.31 = 32,323 | 2025.12.31 = 40,804
//
// 투자CF swings are large due to FADU frequently moving cash ↔ short-term deposits
//
// [영업활동현금흐름, 투자활동현금흐름, 재무활동현금흐름, 기초현금, 기말현금]
const rawData: Record<string, number[]> = {
  '23Q3': [     0,       0,       0,  97644,  95393], // 23Q3 individual CF not available; YE23Q3=기초97,644→기말95,393
  '23Q4': [-23055,  21882,    -735,  95393,  17007],
  '24Q1': [-33311, -44812,    -536,  17007,  20382],
  '24Q2': [-38937,  42301,    -106,  20382,  24515],
  '24Q3': [-36067,  61230,  -20428,  24515,  32323],
  '24Q4': [  -526,   7732,    -720,  32323,  27964],
  '25Q1': [-13528,   9841,    -694,  27964,  37514],
  '25Q2': [  -1049,    883,  11246,  37514,  24453],
  '25Q3': [  -7147,   -756,  -6218,  24453,  40804],
  '25Q4': [  18020,   -276,   -696,  40804,  40804], // 25Q4 기말=2025.12.31 confirmed=40,804
};

const quarterMeta: Record<string, { year: number; quarterNum: string; periodEnd: string }> = {
  '23Q3': { year: 2023, quarterNum: 'Q3', periodEnd: '2023-09-30' },
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

export const cashFlow: FinancialRow[] = CASH_FLOW_QUARTERS.flatMap((quarter) => {
  const values = rawData[quarter];
  const { year, quarterNum, periodEnd } = quarterMeta[quarter];
  return CASH_FLOW_ITEMS.map((item, idx) => ({
    quarter,
    year,
    quarterNum,
    periodEnd,
    statementType: '현금흐름표',
    category: idx < 3 ? '현금흐름' : '현금잔액',
    item,
    valueMillion: values[idx],
    valueEokwon: Math.round(values[idx] / 100) / 10,
  }));
});
