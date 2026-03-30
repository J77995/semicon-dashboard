/**
 * API Ninjas에서 미국 8개 기업 분기 재무정보 다운로드 후
 * src/data/financials-db.json에 병합
 *
 * 대상: NVDA, MU, AMZN, AVGO, GOOGL, MRVL, MSFT, ORCL
 * 범위: FY2020Q1 ~ FY2026Q4
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const API_KEY = 'kqGxa7DqlBKJFYXAVvBwY36eqjV71FUqhSz3i7vU';
const DB_PATH = path.join(__dirname, '../src/data/financials-db.json');

const COMPANIES = {
  NVDA: 'NVIDIA',
  MU: 'Micron Technology',
  AMZN: 'Amazon',
  AVGO: 'Broadcom',
  GOOGL: 'Alphabet',
  MRVL: 'Marvell Technology',
  MSFT: 'Microsoft',
  ORCL: 'Oracle',
};

// ninjaField → { item(한글명), statementType, noDiv(÷1M 안함) }
const FIELD_MAP = {
  // Income Statement
  total_revenue:                   { item: '매출액',            type: 'IS' },
  cost_of_revenue:                 { item: '매출원가',           type: 'IS' },
  gross_profit:                    { item: '매출총이익',          type: 'IS' },
  operating_income:                { item: '영업이익',           type: 'IS' },
  net_income:                      { item: '순이익',             type: 'IS' },
  research_and_development:        { item: 'R&D비용',            type: 'IS' },
  interest_expense:                { item: '이자비용',           type: 'IS' },
  tax_provision:                   { item: '법인세비용',          type: 'IS' },
  stock_based_compensation:        { item: '주식보상비용',        type: 'IS' },
  depreciation_and_amortization:   { item: 'D&A',               type: 'IS' },
  earnings_per_share_basic:        { item: 'EPS_기본',           type: 'IS', noDiv: true },
  earnings_per_share_diluted:      { item: 'EPS_희석',           type: 'IS', noDiv: true },
  sales_and_marketing:             { item: 'sales_and_marketing',type: 'IS' },
  general_and_administrative:      { item: 'general_and_administrative', type: 'IS' },
  weighted_average_shares_basic:   { item: 'shares_basic',       type: 'IS' },
  weighted_average_shares_diluted: { item: 'shares_diluted',     type: 'IS' },
  // Balance Sheet
  total_assets:           { item: '총자산',          type: 'BS' },
  total_liabilities:      { item: '총부채',          type: 'BS' },
  stockholders_equity:    { item: '자기자본',         type: 'BS' },
  cash_and_equivalents:   { item: '현금및현금성자산', type: 'BS' },
  accounts_receivable:    { item: '매출채권',         type: 'BS' },
  inventory:              { item: '재고자산',         type: 'BS' },
  current_assets:         { item: '유동자산',         type: 'BS' },
  current_liabilities:    { item: '유동부채',         type: 'BS' },
  total_debt:             { item: '총차입금',         type: 'BS' },
  long_term_debt:         { item: '장기차입금',       type: 'BS' },
  property_plant_equipment: { item: '유형자산',       type: 'BS' },
  intangible_assets:      { item: '무형자산',         type: 'BS' },
  goodwill:               { item: '영업권',           type: 'BS' },
  retained_earnings:      { item: '이익잉여금',       type: 'BS' },
  accounts_payable:       { item: '매입채무',         type: 'BS' },
  working_capital:        { item: '운전자본',         type: 'BS' },
  // Cash Flow
  operating_cash_flow:    { item: '영업현금흐름',     type: 'CF' },
  net_cash_investing:     { item: '투자현금흐름',     type: 'CF' },
  net_cash_financing:     { item: '재무현금흐름',     type: 'CF' },
  free_cash_flow:         { item: 'FCF',              type: 'CF' },
  capital_expenditures:   { item: 'CAPEX',            type: 'CF' },
  share_repurchases:      { item: '자사주매입',        type: 'CF' },
  dividends_paid:         { item: '배당금지급',        type: 'CF' },
};

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function fetchQuarter(ticker, year, quarter) {
  return new Promise((resolve, reject) => {
    const qs = `ticker=${ticker}&type=quarterly&year=${year}&quarter=${quarter}`;
    const options = {
      hostname: 'api.api-ninjas.com',
      path: `/v1/earnings?${qs}`,
      headers: { 'X-Api-Key': API_KEY },
    };
    https.get(options, res => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          resolve(null);
          return;
        }
        try {
          const obj = JSON.parse(data);
          // 빈 응답 또는 에러 응답 처리
          if (!obj || !obj.company_info || !obj.filing_info) {
            resolve(null);
            return;
          }
          resolve(obj);
        } catch {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

function transformToRows(ticker, obj) {
  const { company_info, income_statement, balance_sheet, cash_flow, filing_info } = obj;
  const company = COMPANIES[ticker];
  const periodEndMonth = filing_info.period_end_date.slice(0, 7); // 'YYYY-MM'
  const fy = String(Math.round(company_info.fiscal_year)).slice(-2);
  const fq = Math.round(company_info.fiscal_quarter);
  const fiscalLabel = `${fy}Q${fq}`;

  const rows = [];
  const sections = {
    IS: income_statement || {},
    BS: balance_sheet || {},
    CF: cash_flow || {},
  };

  for (const [ninjaField, meta] of Object.entries(FIELD_MAP)) {
    const sectionData = sections[meta.type];
    let raw = sectionData[ninjaField];

    // undefined → null
    if (raw === undefined) raw = null;

    let value = null;
    if (raw !== null) {
      if (meta.noDiv) {
        // EPS: 그대로
        value = raw;
      } else {
        // 금액: raw dollars → millions (÷1,000,000)
        value = Math.round(raw / 1_000_000);
      }
    }

    rows.push({
      ticker,
      company,
      periodEndMonth,
      fiscalLabel,
      currency: 'USD',
      unit: 'M',
      statementType: meta.type,
      item: meta.item,
      value,
      ninjaField,
    });
  }

  return rows;
}

async function main() {
  // 기존 DB 로드
  const existing = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  const existingTickers = [...new Set(existing.map(r => r.ticker))];
  console.log(`기존 DB: ${existing.length}행, tickers: ${existingTickers.join(', ')}`);

  const newRows = [];
  const tickers = Object.keys(COMPANIES);
  const years = [2020, 2021, 2022, 2023, 2024, 2025, 2026];
  const quarters = [1, 2, 3, 4];

  for (const ticker of tickers) {
    console.log(`\n▶ ${ticker} (${COMPANIES[ticker]}) 다운로드 중...`);
    let count = 0;
    for (const year of years) {
      for (const quarter of quarters) {
        await sleep(120); // rate limit 방지
        const obj = await fetchQuarter(ticker, year, quarter);
        if (!obj) {
          process.stdout.write('.');
          continue;
        }
        const rows = transformToRows(ticker, obj);
        newRows.push(...rows);
        count++;
        process.stdout.write(`[${obj.company_info.fiscal_year}Q${obj.company_info.fiscal_quarter}→${obj.filing_info.period_end_date.slice(0,7)}]`);
      }
    }
    console.log(`\n  → ${count}개 분기, ${count * Object.keys(FIELD_MAP).length}행`);
  }

  // 중복 제거: ticker + periodEndMonth + item 기준 (새 데이터 우선)
  const newKeys = new Set(newRows.map(r => `${r.ticker}|${r.periodEndMonth}|${r.item}`));
  const filteredExisting = existing.filter(r => {
    // 새로 받은 ticker의 기존 데이터는 대체 (existing storage companies는 유지)
    if (COMPANIES[r.ticker]) return false; // 새로 받은 ticker면 기존 제거
    return true;
  });

  const merged = [...filteredExisting, ...newRows];

  // 정렬: ticker → periodEndMonth → statementType → item
  merged.sort((a, b) => {
    if (a.ticker !== b.ticker) return a.ticker.localeCompare(b.ticker);
    if (a.periodEndMonth !== b.periodEndMonth) return a.periodEndMonth.localeCompare(b.periodEndMonth);
    if (a.statementType !== b.statementType) return a.statementType.localeCompare(b.statementType);
    return a.item.localeCompare(b.item);
  });

  fs.writeFileSync(DB_PATH, JSON.stringify(merged, null, 2), 'utf8');

  const finalTickers = [...new Set(merged.map(r => r.ticker))];
  console.log(`\n✅ 완료: ${merged.length}행 저장`);
  console.log(`Tickers: ${finalTickers.join(', ')}`);
  finalTickers.forEach(t => {
    const cnt = merged.filter(r => r.ticker === t).length;
    const periods = [...new Set(merged.filter(r => r.ticker === t).map(r => r.periodEndMonth))].length;
    console.log(`  ${t}: ${periods}분기, ${cnt}행`);
  });
}

main().catch(console.error);
