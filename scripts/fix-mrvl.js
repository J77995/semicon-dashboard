/**
 * MRVL IS 데이터 이미지 기준으로 수정
 * 출처: Macrotrends/Wisesheets 이미지 (단위: 백만달러)
 *
 * 이미지 컬럼 순서:
 * Jan 2026(26Q4), Nov 2025(26Q3), Aug 2025(26Q2), May 2025(26Q1),
 * Feb 2025(25Q4), Nov 2024(25Q3), Aug 2024(25Q2), May 2024(25Q1),
 * Feb 2024(24Q4), Oct 2023(24Q3)
 */
const fs = require('fs');
const DB_PATH = 'C:/workspace/fadu_dashboard/src/data/financials-db.json';
const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

const round1 = v => v === null ? null : Math.round(v * 10) / 10;

// 이미지 기준 MRVL IS 데이터 (periodEndMonth → item → value)
const CORRECTIONS = {
  '2026-01': {
    '매출액':     2218.7,
    '매출원가':   1070.8,
    '매출총이익': 1147.9,
    '영업이익':    413.9,
    '순이익':      396.1,
    'R&D비용':     536.0,
    'EPS_기본':      0.47,
    'EPS_희석':      0.47,
  },
  '2025-11': {
    '매출액':     2074.5,
    '매출원가':   1004.2,
    '매출총이익': 1070.3,
    '영업이익':    367.9,
    '순이익':     1901.3,
    'R&D비용':     512.5,
    'EPS_기본':      2.22,
    'EPS_희석':      2.22,
  },
  '2025-08': {
    '매출액':     2006.1,
    '매출원가':    995.5,
    '매출총이익': 1010.6,
    '영업이익':    298.8,
    '순이익':      194.8,
    'R&D비용':     519.0,
    'EPS_기본':      0.23,
    'EPS_희석':      0.23,
  },
  '2025-05': {
    '매출액':     1895.3,
    '매출원가':    942.9,
    '매출총이익':  952.4,
    '영업이익':    258.3,
    '순이익':      177.9,
    'R&D비용':     507.7,
    'EPS_기본':      0.21,
    'EPS_희석':      0.20,
  },
  '2025-02': {
    '매출액':     1817.4,
    '매출원가':    898.9,
    '매출총이익':  918.5,
    '영업이익':    223.8,
    '순이익':      200.2,
    'R&D비용':     499.0,
    'EPS_기본':      0.23,
    'EPS_희석':      0.23,
  },
  '2024-11': {
    '매출액':     1516.1,
    '매출원가':    809.9,
    '매출총이익':  706.2,
    '영업이익':     12.3,
    '순이익':     -676.3,
    'R&D비용':     488.6,
    'EPS_기본':     -0.78,
    'EPS_희석':     -0.78,
  },
  '2024-08': {
    '매출액':     1272.9,
    '매출원가':    685.3,
    '매출총이익':  587.6,
    '영업이익':    -96.4,
    '순이익':     -193.3,
    'R&D비용':     486.7,
    'EPS_기본':     -0.22,
    'EPS_희석':     -0.22,
  },
  '2024-05': {
    '매출액':     1160.9,
    '매출원가':    633.1,
    '매출총이익':  527.8,
    '영업이익':   -148.2,
    '순이익':     -215.6,
    'R&D비용':     476.1,
    'EPS_기본':     -0.25,
    'EPS_희석':     -0.25,
  },
  '2024-02': {
    '매출액':     1426.5,
    '매출원가':    762.4,
    '매출총이익':  664.1,
    '영업이익':     -7.5,
    '순이익':     -392.7,
    'R&D비용':     459.6,
    'EPS_기본':     -0.45,
    'EPS_희석':     -0.45,
  },
  '2023-10': {
    '매출액':     1418.6,
    '매출원가':    867.4,
    '매출총이익':  551.2,
    '영업이익':   -142.9,
    '순이익':     -164.3,
    'R&D비용':     481.1,
    'EPS_기본':     -0.19,
    'EPS_희석':     -0.19,
  },
};

let updated = 0;
let notFound = [];

for (const [pm, items] of Object.entries(CORRECTIONS)) {
  for (const [item, newVal] of Object.entries(items)) {
    const idx = db.findIndex(r =>
      r.ticker === 'MRVL' &&
      r.periodEndMonth === pm &&
      r.item === item
    );
    if (idx === -1) {
      notFound.push(`${pm} ${item}`);
    } else {
      const old = db[idx].value;
      db[idx].value = round1(newVal);
      if (Math.abs((old ?? 999999) - newVal) > 0.5) {
        console.log(`  ✏️  ${pm} ${item}: ${old} → ${db[idx].value}`);
        updated++;
      }
    }
  }
}

if (notFound.length) {
  console.log('\n⚠️  NOT FOUND in DB:', notFound);
}

fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
console.log(`\n✅ MRVL IS 수정 완료: ${updated}개 항목 변경`);
