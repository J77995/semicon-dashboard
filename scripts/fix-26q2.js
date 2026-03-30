/**
 * Excel 파일에서 MSFT 26Q2, MU 26Q1/26Q2 값 읽어서 financials-db.json 수정
 * - MSFT 26Q2: IS 항목 교정 (API가 누적값 반환), CF 항목 null 처리
 * - MU 26Q1/26Q2: DB에 없으므로 Excel 값으로 추가
 */

const XLSX = require('C:/workspace/fadu_dashboard/node_modules/xlsx');
const fs = require('fs');

const DB_PATH = 'C:/workspace/fadu_dashboard/src/data/financials-db.json';

// ─── 1. Excel 파일 읽기 ─────────────────────────────────────────────────────

function readSheet(wb, sheetName) {
  const ws = wb.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });
}

/**
 * 컬럼 헤더에서 fiscalLabel(예: "26Q2") 찾아 컬럼 인덱스 반환
 * 헤더 형식: "2025.12 26Q2 연결" 또는 "2025.12 26Q2"
 */
function findColByLabel(headerRow, label) {
  for (let i = 0; i < headerRow.length; i++) {
    const cell = String(headerRow[i] || '');
    if (cell.includes(label)) return i;
  }
  return -1;
}

/** 행 라벨(첫 번째 컬럼)에서 키워드를 포함하는 행의 인덱스 반환 */
function findRowByLabel(data, keyword) {
  for (let i = 0; i < data.length; i++) {
    const label = String(data[i][0] || '');
    if (label.includes(keyword)) return i;
  }
  return -1;
}

// ─── valuechain financials.xlsx → MSFT ─────────────────────────────────────

const wbMain = XLSX.readFile('C:/workspace/fadu_dashboard/valuechain financials.xlsx');
const msftIS = readSheet(wbMain, 'MSFT IS');
const msftBS = readSheet(wbMain, 'MSFT BS');

function extractMsft26Q2() {
  const headerIS = msftIS[0];
  const headerBS = msftBS[0];

  const col26q2IS = findColByLabel(headerIS, '26Q2');
  const col26q2BS = findColByLabel(headerBS, '26Q2');

  console.log('MSFT IS 26Q2 col:', col26q2IS, '→', headerIS[col26q2IS]);
  console.log('MSFT BS 26Q2 col:', col26q2BS, '→', headerBS[col26q2BS]);

  // periodEndMonth: 헤더에서 "2025.12" → "2025-12"
  const rawPeriod = String(headerIS[col26q2IS] || '').match(/(\d{4})\.(\d{2})/);
  const periodEndMonth = rawPeriod ? `${rawPeriod[1]}-${rawPeriod[2]}` : '2025-12';

  function getIS(keyword) {
    const row = findRowByLabel(msftIS, keyword);
    if (row === -1) return null;
    const v = msftIS[row][col26q2IS];
    return v != null ? Math.round(v / 1_000_000) : null;
  }
  function getBS(keyword) {
    const row = findRowByLabel(msftBS, keyword);
    if (row === -1) return null;
    const v = msftBS[row][col26q2BS];
    return v != null ? Math.round(v / 1_000_000) : null;
  }
  function getISRaw(keyword) {
    const row = findRowByLabel(msftIS, keyword);
    if (row === -1) return null;
    return msftIS[row][col26q2IS]; // EPS용 raw
  }

  return {
    periodEndMonth,
    IS: {
      '매출액':    getIS('매출액'),
      '매출원가':  getIS('매출원가'),
      '매출총이익': getIS('매출총이익'),
      '영업이익':  getIS('영업이익'),
      '순이익':    getIS('당기순이익'),
      'EPS_기본':  getISRaw('기본 주당이익'),
      'EPS_희석':  getISRaw('희석 주당이익'),
    },
  };
}

// ─── valuechain financials MU.xlsx → MU ────────────────────────────────────

const wbMU = XLSX.readFile('C:/workspace/fadu_dashboard/valuechain financials MU.xlsx');
const muIS = readSheet(wbMU, 'MU IS');
const muBS = readSheet(wbMU, 'MU BS');

function extractMuQuarter(label) {
  const headerIS = muIS[0];
  const headerBS = muBS[0];
  const colIS = findColByLabel(headerIS, label);
  const colBS = findColByLabel(headerBS, label);
  console.log(`MU IS ${label} col:`, colIS, '→', headerIS[colIS]);

  if (colIS === -1) return null;

  const rawPeriod = String(headerIS[colIS] || '').match(/(\d{4})\.(\d{2})/);
  const periodEndMonth = rawPeriod ? `${rawPeriod[1]}-${rawPeriod[2]}` : null;
  if (!periodEndMonth) return null;

  function getIS(keyword) {
    const row = findRowByLabel(muIS, keyword);
    if (row === -1) return null;
    const v = muIS[row][colIS];
    return v != null ? Math.round(v / 1_000_000) : null;
  }
  function getBS(keyword) {
    if (colBS === -1) return null;
    const row = findRowByLabel(muBS, keyword);
    if (row === -1) return null;
    const v = muBS[row][colBS];
    return v != null ? Math.round(v / 1_000_000) : null;
  }
  function getISRaw(keyword) {
    const row = findRowByLabel(muIS, keyword);
    if (row === -1) return null;
    return muIS[row][colIS];
  }

  return {
    periodEndMonth,
    fiscalLabel: label,
    IS: {
      '매출액':    getIS('매출액'),
      '매출원가':  getIS('매출원가'),
      '매출총이익': getIS('매출총이익'),
      '영업이익':  getIS('영업이익'),
      '순이익':    getIS('당기순이익'),
      'EPS_기본':  getISRaw('기본 주당이익'),
      'EPS_희석':  getISRaw('희석 주당이익'),
    },
    BS: {
      '유동자산':    getBS('유동자산'),
      '매출채권':    getBS('매출채권'),
      '재고자산':    getBS('재고자산'),
      '유형자산':    getBS('유형자산'),
      '무형자산':    getBS('무형자산'),
      '총자산':      getBS('자산 총계'),
      '유동부채':    getBS('유동부채'),
      '총부채':      getBS('부채총계'),
      '자기자본':    getBS('자본 총계'),
    },
  };
}

// ─── 2. DB 수정 ─────────────────────────────────────────────────────────────

const msftData  = extractMsft26Q2();
const muQ1Data  = extractMuQuarter('26Q1');
const muQ2Data  = extractMuQuarter('26Q2');

console.log('\nMSFT 26Q2 추출:', JSON.stringify(msftData, null, 2));
console.log('\nMU 26Q1 추출:', JSON.stringify(muQ1Data?.IS, null, 2));
console.log('\nMU 26Q2 추출:', JSON.stringify(muQ2Data?.IS, null, 2));

const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

// CF 항목 (누적값이라 신뢰 불가 → null)
const CF_ITEMS = ['영업현금흐름','투자현금흐름','재무현금흐름','FCF','CAPEX','자사주매입','배당금지급'];
// IS 항목 중 Excel에 없는 것 → null
const IS_NULL_ITEMS = ['법인세비용','주식보상비용','R&D비용','D&A',
  'sales_and_marketing','general_and_administrative','shares_basic','shares_diluted','이자비용'];

let changed = 0;

for (const row of db) {
  // ── MSFT 26Q2 IS 교정 ──────────────────────────────────────────────────
  if (row.ticker === 'MSFT' && row.fiscalLabel === '26Q2') {
    if (row.statementType === 'IS') {
      if (msftData.IS[row.item] !== undefined) {
        row.value = msftData.IS[row.item];
        changed++;
      } else if (IS_NULL_ITEMS.includes(row.item)) {
        row.value = null;
        changed++;
      }
    }
    if (row.statementType === 'CF' && CF_ITEMS.includes(row.item)) {
      row.value = null;
      changed++;
    }
  }
}

// ── MU 26Q1/26Q2 추가 (DB에 없는 분기) ────────────────────────────────────
const FIELD_META = {
  // IS
  '매출액':    { ninjaField: 'total_revenue',           type: 'IS' },
  '매출원가':  { ninjaField: 'cost_of_revenue',         type: 'IS' },
  '매출총이익':{ ninjaField: 'gross_profit',            type: 'IS' },
  '영업이익':  { ninjaField: 'operating_income',        type: 'IS' },
  '순이익':    { ninjaField: 'net_income',               type: 'IS' },
  'EPS_기본':  { ninjaField: 'earnings_per_share_basic', type: 'IS' },
  'EPS_희석':  { ninjaField: 'earnings_per_share_diluted', type: 'IS' },
  // BS
  '유동자산':  { ninjaField: 'current_assets',          type: 'BS' },
  '매출채권':  { ninjaField: 'accounts_receivable',     type: 'BS' },
  '재고자산':  { ninjaField: 'inventory',               type: 'BS' },
  '유형자산':  { ninjaField: 'property_plant_equipment',type: 'BS' },
  '무형자산':  { ninjaField: 'intangible_assets',       type: 'BS' },
  '총자산':    { ninjaField: 'total_assets',            type: 'BS' },
  '유동부채':  { ninjaField: 'current_liabilities',     type: 'BS' },
  '총부채':    { ninjaField: 'total_liabilities',       type: 'BS' },
  '자기자본':  { ninjaField: 'stockholders_equity',     type: 'BS' },
};

function buildMuRows(quarterData) {
  if (!quarterData) return [];
  const rows = [];
  const all = { ...quarterData.IS, ...quarterData.BS };
  for (const [item, value] of Object.entries(all)) {
    const meta = FIELD_META[item];
    if (!meta) continue;
    rows.push({
      ticker: 'MU',
      company: 'Micron Technology',
      periodEndMonth: quarterData.periodEndMonth,
      fiscalLabel: quarterData.fiscalLabel,
      currency: 'USD',
      unit: 'M',
      statementType: meta.type,
      item,
      value: value ?? null,
      ninjaField: meta.ninjaField,
    });
  }
  return rows;
}

const muNewRows = [...buildMuRows(muQ1Data), ...buildMuRows(muQ2Data)];

// 중복 방지: 이미 있으면 skip
const existingKeys = new Set(db.map(r => `${r.ticker}|${r.periodEndMonth}|${r.item}`));
const muToAdd = muNewRows.filter(r => !existingKeys.has(`${r.ticker}|${r.periodEndMonth}|${r.item}`));
console.log(`\nMU 신규 추가 행: ${muToAdd.length}`);

db.push(...muToAdd);

// 정렬
db.sort((a, b) => {
  if (a.ticker !== b.ticker) return a.ticker.localeCompare(b.ticker);
  if (a.periodEndMonth !== b.periodEndMonth) return a.periodEndMonth.localeCompare(b.periodEndMonth);
  if (a.statementType !== b.statementType) return a.statementType.localeCompare(b.statementType);
  return a.item.localeCompare(b.item);
});

fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
console.log(`\n✅ 완료: MSFT 26Q2 ${changed}개 항목 교정, MU ${muToAdd.length}행 추가`);
console.log('Total rows:', db.length);

// ─── 검증 ────────────────────────────────────────────────────────────────────
const msft26q2IS = db.filter(r => r.ticker==='MSFT' && r.fiscalLabel==='26Q2' && r.statementType==='IS');
console.log('\nMSFT 26Q2 IS 검증:');
msft26q2IS.forEach(r => console.log(' ', r.item, r.value));

const muLatest = db.filter(r => r.ticker==='MU' && (r.fiscalLabel==='26Q1' || r.fiscalLabel==='26Q2') && r.statementType==='IS');
console.log('\nMU 26Q1/26Q2 IS 검증:');
muLatest.forEach(r => console.log(' ', r.fiscalLabel, r.item, r.value));
