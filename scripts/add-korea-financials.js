/**
 * valuechain financials korea.xlsx → financials-db.json 추가
 * 삼성전자(SSNLF), SK하이닉스(000660.KS)
 * - 단위: KRW 원화 원본 → ÷1,000,000,000 → 십억원(B)
 * - EPS 항목(기본/희석 주당이익)은 ÷하지 않고 원화 그대로
 * - ninjaField: null (Excel 출처)
 */
const XLSX = require('C:/workspace/fadu_dashboard/node_modules/xlsx');
const fs   = require('fs');

const DB_PATH  = 'C:/workspace/fadu_dashboard/src/data/financials-db.json';
const XL_PATH  = 'C:/workspace/fadu_dashboard/valuechain financials korea.xlsx';

// EPS 항목 (단위 변환 없이 raw KRW/주)
const EPS_ITEMS = new Set(['기본 주당이익', '희석 주당이익']);

// 항목명 정규화
function cleanItem(raw) {
  return raw
    .replace(/^\(\-\)\s*/, '')   // (-) 제거
    .replace(/^\(\+\)\s*/, '')   // (+) 제거
    .replace(/^\s+/, '')          // 앞 공백 제거
    .trim();
}

// 컬럼 헤더 "2016.03 16Q1 연결" → { periodEndMonth, fiscalLabel }
function parseHeader(h) {
  const m = String(h).match(/(\d{4})\.(\d{2})\s+(\d{2}Q\d)/);
  if (!m) return null;
  return { periodEndMonth: `${m[1]}-${m[2]}`, fiscalLabel: m[3] };
}

function parseSheet(wb, sheetName, ticker, company, statementType) {
  const data = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { header: 1, defval: null });
  const headerRow = data[0];
  const rows = [];

  // 컬럼 매핑: 인덱스 → { periodEndMonth, fiscalLabel }
  const cols = [];
  for (let c = 1; c < headerRow.length; c++) {
    if (!headerRow[c]) continue;
    const parsed = parseHeader(headerRow[c]);
    if (parsed) cols.push({ c, ...parsed });
  }

  // 데이터 행 처리 (row 1부터)
  for (let r = 1; r < data.length; r++) {
    const rawLabel = data[r][0];
    if (!rawLabel) continue;
    const item = cleanItem(rawLabel);

    for (const { c, periodEndMonth, fiscalLabel } of cols) {
      const raw = data[r][c];
      if (raw === null || raw === undefined) {
        // null인 경우 미래 분기일 수 있으므로 skip
        continue;
      }

      let value;
      if (EPS_ITEMS.has(item)) {
        value = raw; // KRW/주 그대로
      } else {
        value = Math.round(raw / 1_000_000_000); // 십억원(B)
      }

      rows.push({
        ticker,
        company,
        periodEndMonth,
        fiscalLabel,
        currency: 'KRW',
        unit: 'B',
        statementType,
        item,
        value,
        ninjaField: null,
      });
    }
  }
  return rows;
}

const wb = XLSX.readFile(XL_PATH);

const allNewRows = [
  ...parseSheet(wb, '삼성전자 IS', 'SSNLF',    '삼성전자', 'IS'),
  ...parseSheet(wb, '삼성전자 BS', 'SSNLF',    '삼성전자', 'BS'),
  ...parseSheet(wb, 'SK하이닉스 IS', '000660.KS', 'SK하이닉스', 'IS'),
  ...parseSheet(wb, 'SK하이닉스 BS', '000660.KS', 'SK하이닉스', 'BS'),
];

// 기존 DB에서 SSNLF, 000660.KS 제거 후 새 데이터 병합
const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
const filtered = db.filter(r => r.ticker !== 'SSNLF' && r.ticker !== '000660.KS');

const merged = [...filtered, ...allNewRows];

merged.sort((a, b) => {
  if (a.ticker !== b.ticker) return a.ticker.localeCompare(b.ticker);
  if (a.periodEndMonth !== b.periodEndMonth) return a.periodEndMonth.localeCompare(b.periodEndMonth);
  if (a.statementType !== b.statementType) return a.statementType.localeCompare(b.statementType);
  return a.item.localeCompare(b.item);
});

fs.writeFileSync(DB_PATH, JSON.stringify(merged, null, 2), 'utf8');

// 결과 요약
['SSNLF', '000660.KS'].forEach(t => {
  const rows = merged.filter(r => r.ticker === t);
  const periods = [...new Set(rows.map(r => r.periodEndMonth))].sort();
  const items   = [...new Set(rows.map(r => r.statementType + '|' + r.item))].sort();
  console.log(`\n${t} (${rows[0]?.company})`);
  console.log(`  분기: ${periods.length}개  ${periods[0]} ~ ${periods[periods.length - 1]}`);
  console.log(`  항목: ${items.length}개`);
  items.forEach(i => console.log(`    ${i}`));
});

console.log(`\n✅ 총 DB: ${merged.length}행 | tickers: ${[...new Set(merged.map(r=>r.ticker))].sort().join(', ')}`);
