import { FinancialRow } from '@/types/financial';

export const RATIO_QUARTERS = [
  '23Q3', '23Q4', '24Q1', '24Q2', '24Q3', '24Q4',
  '25Q1', '25Q2', '25Q3', '25Q4',
] as const;

export const RATIO_ITEMS = [
  '매출총이익률(%)',
  '영업이익률(%)',
  '순이익률(%)',
  '부채비율(%)',
  '유동비율(%)',
  '자산총계',
  '매출채권회전율(회)',
  '재고자산회전율(회)',
] as const;

// Computed from real income statement and balance sheet data.
// Formula:
//   매출총이익률 = 매출총이익 / 매출액 * 100  (N/A when 매출액=0)
//   영업이익률   = 영업이익   / 매출액 * 100
//   순이익률     = 당기순이익 / 매출액 * 100
//   부채비율     = 부채총계  / 자본총계 * 100
//   유동비율     = 유동자산  / 유동부채 * 100
//   자산총계     = direct from balance sheet (백만원)
//
// Balance sheet quarters include 23Q3; income statement starts at 23Q4.
// For 23Q3, income-based ratios use trailing values (approximated as 0 / N/A marker).
//
// 매출채권회전율 = 분기매출액×4 / 평균매출채권 (annualized)
// 재고자산회전율 = 분기매출원가×4 / 평균재고자산 (annualized)
// 평균 = (당기말 + 전기말) / 2
// AR:  23Q3=2898, 23Q4=1616, 24Q1=929,  24Q2=5998, 24Q3=8802,  24Q4=13892,
//      25Q1=11859, 25Q2=8862, 25Q3=14075, 25Q4=5735
// Inv: 23Q3=13805,23Q4=17439,24Q1=32248,24Q2=47043,24Q3=47260, 24Q4=31367,
//      25Q1=33023, 25Q2=29798,25Q3=31893, 25Q4=41169
// [매출총이익률, 영업이익률, 순이익률, 부채비율, 유동비율, 자산총계, AR회전율, Inv회전율]
const rawRatios: Record<string, number[]> = {
  // 23Q3: no quarterly P&L available; profit/turnover ratios set to 0 as placeholder
  '23Q3': [0,     0,      0,      26.54, 530.3, 268171,  0,    0   ],
  // AR turnover: 4427×4/((1616+2898)/2)=7.85 | Inv: 6632×4/((17439+13805)/2)=1.70
  '23Q4': [-49.8, -545.7, -521.7, 30.76, 404.8, 243662,  7.85, 1.70],
  // AR: 2332×4/((929+1616)/2)=7.33 | Inv: 1860×4/((32248+17439)/2)=0.30
  '24Q1': [ 20.2, -695.9, -662.3, 29.68, 411.6, 223110,  7.33, 0.30],
  // AR: 7093×4/((5998+929)/2)=8.19 | Inv: 6537×4/((47043+32248)/2)=0.66
  '24Q2': [  7.8, -312.8, -302.9, 33.59, 364.2, 202616,  8.19, 0.66],
  // AR: 10095×4/((8802+5998)/2)=5.46 | Inv: 7853×4/((47260+47043)/2)=0.67
  '24Q3': [ 22.2, -302.6, -303.8, 23.70, 482.5, 149880,  5.46, 0.67],
  // AR: 23983×4/((13892+8802)/2)=8.45 | Inv: 21484×4/((31367+47260)/2)=2.19
  '24Q4': [ 10.4, -108.8,  -99.7, 37.24, 315.5, 134427,  8.45, 2.19],
  // AR: 19219×4/((11859+13892)/2)=5.97 | Inv: 9063×4/((33023+31367)/2)=1.13
  '25Q1': [ 52.8,  -62.4,  -63.1, 36.43, 311.4, 117984,  5.97, 1.13],
  // AR: 23679×4/((8862+11859)/2)=9.14 | Inv: 13493×4/((29798+33023)/2)=1.72
  '25Q2': [ 43.0,  -53.1,  -62.3, 61.49, 208.3, 115571,  9.14, 1.72],
  // AR: 25644×4/((14075+8862)/2)=8.94 | Inv: 13737×4/((31893+29798)/2)=1.78
  '25Q3': [ 46.4,  -44.6,  -42.4, 80.97, 171.5, 106272,  8.94, 1.78],
  // AR: 23877×4/((5735+14075)/2)=9.64 | Inv: 12467×4/((41169+31893)/2)=1.37
  '25Q4': [ 47.8, -123.5, -161.1, 518.5, 106.7, 122427,  9.64, 1.37],
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

export const ratios: FinancialRow[] = RATIO_QUARTERS.flatMap((quarter) => {
  const values = rawRatios[quarter];
  const { year, quarterNum, periodEnd } = quarterMeta[quarter];
  return RATIO_ITEMS.map((item, idx) => {
    const valueMillion = Math.round(values[idx] * 100) / 100;
    return {
      quarter,
      year,
      quarterNum,
      periodEnd,
      statementType: '재무비율',
      category: idx < 3 ? '수익성' : idx < 5 ? '안정성' : idx === 5 ? '규모' : '활동성',
      item,
      // For ratio items (%), valueMillion stores the ratio value (not actual millions)
      valueMillion,
      valueEokwon: item === '자산총계'
        ? Math.round(values[idx] / 100) / 10
        : valueMillion,
    };
  });
});
