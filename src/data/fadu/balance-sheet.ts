import { FinancialRow } from '@/types/financial';

export const BALANCE_SHEET_QUARTERS = [
  '23Q3', '23Q4', '24Q1', '24Q2', '24Q3', '24Q4',
  '25Q1', '25Q2', '25Q3', '25Q4',
] as const;

export const BALANCE_SHEET_ITEMS = [
  '유동자산', '매출채권', '재고자산',
  '비유동자산', '유형자산', '무형자산',
  '자산총계',
  '유동부채', '매입채무및계약부채',
  '비유동부채',
  '부채총계',
  '지배주주지분', '비지배주주지분', '자본총계',
] as const;

// Raw data order matches BALANCE_SHEET_ITEMS
// [유동자산, 매출채권, 재고자산, 비유동자산, 유형자산, 무형자산, 자산총계,
//  유동부채, 매입채무및계약부채, 비유동부채, 부채총계,
//  지배주주지분, 비지배주주지분, 자본총계]
const rawData: Record<string, number[]> = {
  '23Q3': [227088,  2898, 13805, 41084, 30317,  748, 268171, 42806,  5209, 13433,  56239, 211932,    0, 211932],
  '23Q4': [203276,  1616, 17439, 40386, 32476,  738, 243662, 50212,  3518,  7101,  57314, 184879, 1469, 186348],
  '24Q1': [183394,   929, 32248, 39716, 31506,  684, 223110, 44555,  2891,  6510,  51065, 170791, 1255, 172046],
  '24Q2': [163977,  5998, 47043, 38639, 29319, 1703, 202616, 45029,   431,  5913,  50942, 149675, 1999, 151674],
  '24Q3': [113978,  8802, 47260, 35902, 27337, 1622, 149880, 23620,  2269,  5099,  28719, 119342, 1818, 121161],
  '24Q4': [ 98648, 13892, 31367, 35780, 28209, 1539, 134427, 31263,  1755,  5217,  36480,  96076, 1871,  97947],
  '25Q1': [ 84410, 11859, 33023, 33574, 25759, 1453, 117984, 27106,  2685,  4402,  31508,  84801, 1675,  86476],
  '25Q2': [ 83770,  8862, 29798, 31802, 24280, 1359, 115571, 40210,  2130,  3795,  44005,  70185, 1381,  71566],
  '25Q3': [ 76612, 14075, 31893, 29659, 22197, 1324, 106272, 44665,  8859,  2881,  47546,  58179,  547,  58725],
  '25Q4': [ 96118,  5735, 41169, 26310, 18751, 1241, 122427, 90068, 11432, 12565, 102633,  19307,  487,  19794],
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

const getCategoryForItem = (item: string): string => {
  if (['유동자산', '매출채권', '재고자산'].includes(item)) return '자산';
  if (['비유동자산', '유형자산', '무형자산'].includes(item)) return '자산';
  if (item === '자산총계') return '자산';
  if (['유동부채', '매입채무및계약부채', '비유동부채', '부채총계'].includes(item)) return '부채';
  return '자본';
};

export const balanceSheet: FinancialRow[] = BALANCE_SHEET_QUARTERS.flatMap((quarter) => {
  const values = rawData[quarter];
  const { year, quarterNum, periodEnd } = quarterMeta[quarter];
  return BALANCE_SHEET_ITEMS.map((item, idx) => ({
    quarter,
    year,
    quarterNum,
    periodEnd,
    statementType: '재무상태표',
    category: getCategoryForItem(item),
    item,
    valueMillion: values[idx],
    valueEokwon: Math.round(values[idx] / 100) / 10,
  }));
});
