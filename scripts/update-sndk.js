/**
 * SNDK 재무 데이터를 이미지 기반으로 전면 교체
 * IS/BS: 이미지 값으로 덮어씀 (10분기: 2023-09 ~ 2026-01)
 * CF: 기존 API 값 유지
 */
const fs = require('fs');
const DB_PATH = 'C:/workspace/fadu_dashboard/src/data/financials-db.json';

// 컬럼 순서: 최신→과거 (이미지 Left→Right)
const PERIODS = [
  { periodEndMonth: '2026-01', fiscalLabel: '26Q2' },
  { periodEndMonth: '2025-10', fiscalLabel: '26Q1' },
  { periodEndMonth: '2025-06', fiscalLabel: '25Q4' },
  { periodEndMonth: '2025-03', fiscalLabel: '25Q3' },
  { periodEndMonth: '2024-12', fiscalLabel: '25Q2' },
  { periodEndMonth: '2024-09', fiscalLabel: '25Q1' },
  { periodEndMonth: '2024-06', fiscalLabel: '24Q4' },
  { periodEndMonth: '2024-03', fiscalLabel: '24Q3' },
  { periodEndMonth: '2023-12', fiscalLabel: '24Q2' },
  { periodEndMonth: '2023-09', fiscalLabel: '24Q1' },
];

// 이미지에서 읽은 값 (null = 이미지에서 '-' 또는 미표시)
const DATA = {
  IS: {
    '매출액':      [3025,  2308,  1901,  1695,  1876,  1883,  1760,  1705,  1665,  1533],
    '매출원가':    [1484,  1621,  1403,  1313,  1270,  1157,  1160,  1242,  1504,  1721],
    '매출총이익':  [1541,   687,   498,   382,   606,   726,   600,   463,   161,  -188],
    '영업이익':    [1074,   192,    51,   -42,   185,   313,   185,    79,  -198,  -546],
    '순이익':      [ 803,   112,   -23, -1933,   104,   211,   120,    27,  -301,  -518],
    'R&D비용':     [ 327,   316,   285,   285,   279,   283,   298,   277,   246,   240],
    'selling_general_administrative': [139, 179, 162, 139, 142, 130, 117, 107, 113, 118],
    'EPS_기본':    [5.46,  0.77, -0.16,-13.33,  0.72,  1.46,  0.83,  0.19,  null,  null],
    'EPS_희석':    [5.15,  0.75, -0.16,-13.33,  0.72,  1.46,  0.83,  0.19,  null,  null],
    'shares_basic':  [147,  146,  145,  145,  145,  145,  145,  145,  null,  null],
    'shares_diluted':[156,  149,  145,  145,  145,  145,  145,  145,  null,  null],
  },
  BS: {
    '현금및현금성자산': [1539, 1442, 1481, 1507,  804,  322,  328, null, null, null],
    '매출채권':         [1239, 1193, 1068,  979,  904, 1037,  935, null, null, null],
    '재고자산':         [1970, 1907, 2079, 2160, 2172, 2069, 1955, null, null, null],
    '유동자산':         [5150, 4984, 5086, 5090, 4456, 4388, 3548, null, null, null],
    '유형자산':         [ 834,  837,  833,  819,  770,  728,  970, null, null, null],
    '영업권':           [4995, 4998, 4999, 4997, 6825, 6932, 7207, null, null, null],
    '총자산':           [12998,12749,12985,12960,14234,13890,13506,null, null, null],
    '매입채무':         [ 869,  884,  766,  758,  689,  649,  670, null, null, null],
    '유동부채':         [1654, 1516, 1427, 1375, 1873, 1472, 2123, null, null, null],
    '장기차입금':       [ 583, 1331, 1829, 1927, null, null, null, null, null, null],
    '총부채':           [2785, 3368, 3769, 3799, 2233, 1764, 2424, null, null, null],
  },
};

// ninjaField 매핑 (이미지 출처 항목은 null)
const NINJA = {
  '매출액': 'total_revenue',
  '매출원가': 'cost_of_revenue',
  '매출총이익': 'gross_profit',
  '영업이익': 'operating_income',
  '순이익': 'net_income',
  'R&D비용': 'research_and_development',
  'selling_general_administrative': null,
  'EPS_기본': 'earnings_per_share_basic',
  'EPS_희석': 'earnings_per_share_diluted',
  'shares_basic': 'weighted_average_shares_basic',
  'shares_diluted': 'weighted_average_shares_diluted',
  '현금및현금성자산': 'cash_and_equivalents',
  '매출채권': 'accounts_receivable',
  '재고자산': 'inventory',
  '유동자산': 'current_assets',
  '유형자산': 'property_plant_equipment',
  '영업권': 'goodwill',
  '총자산': 'total_assets',
  '매입채무': 'accounts_payable',
  '유동부채': 'current_liabilities',
  '장기차입금': 'long_term_debt',
  '총부채': 'total_liabilities',
};

const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

// 기존 SNDK IS/BS 제거 (CF는 유지)
const filtered = db.filter(r => !(r.ticker === 'SNDK' && (r.statementType === 'IS' || r.statementType === 'BS')));

// 새 행 생성
const newRows = [];
for (const [stType, items] of Object.entries(DATA)) {
  for (const [item, values] of Object.entries(items)) {
    for (let i = 0; i < PERIODS.length; i++) {
      const { periodEndMonth, fiscalLabel } = PERIODS[i];
      newRows.push({
        ticker: 'SNDK',
        company: 'SanDisk',
        periodEndMonth,
        fiscalLabel,
        currency: 'USD',
        unit: 'M',
        statementType: stType,
        item,
        value: values[i] ?? null,
        ninjaField: NINJA[item] ?? null,
      });
    }
  }
}

const merged = [...filtered, ...newRows];

merged.sort((a, b) => {
  if (a.ticker !== b.ticker) return a.ticker.localeCompare(b.ticker);
  if (a.periodEndMonth !== b.periodEndMonth) return a.periodEndMonth.localeCompare(b.periodEndMonth);
  if (a.statementType !== b.statementType) return a.statementType.localeCompare(b.statementType);
  return a.item.localeCompare(b.item);
});

fs.writeFileSync(DB_PATH, JSON.stringify(merged, null, 2), 'utf8');

const sndk = merged.filter(r => r.ticker === 'SNDK');
const periods = [...new Set(sndk.map(r => r.periodEndMonth + '(' + r.fiscalLabel + ')'))].sort();
console.log('✅ SNDK 업데이트 완료');
console.log('분기:', periods.join(', '));
console.log('총 행수:', sndk.length, '(IS+BS+CF)');
console.log('전체 DB:', merged.length, '행');
