// @ts-nocheck
import financialsDb from '@/data/financials-db.json';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type QuarterRow = {
  periodEndMonth: string; // e.g. '2025-12'
  fiscalLabel: string;    // e.g. '26Q2'
  displayLabel: string;   // e.g. '2026 2Q'
  items: Record<string, number | null>;
};

export type CompanyMeta = {
  ticker: string;
  nameKR: string;
  nameEN: string;
  currency: 'USD' | 'KRW';
  unit: 'M' | 'B';
};

export type CompanyFinancialData = {
  meta: CompanyMeta;
  quarters: QuarterRow[]; // last 8 quarters, oldest → newest
};

// ---------------------------------------------------------------------------
// Company metadata
// ---------------------------------------------------------------------------

export const COMPANY_META: Record<string, CompanyMeta> = {
  GOOGL: { ticker: 'GOOGL', nameKR: '구글',            nameEN: 'Google',              currency: 'USD', unit: 'M' },
  MSFT:  { ticker: 'MSFT',  nameKR: '마이크로소프트',  nameEN: 'Microsoft',           currency: 'USD', unit: 'M' },
  AMZN:  { ticker: 'AMZN',  nameKR: '아마존',          nameEN: 'Amazon',              currency: 'USD', unit: 'M' },
  ORCL:  { ticker: 'ORCL',  nameKR: '오라클',          nameEN: 'Oracle',              currency: 'USD', unit: 'M' },
  NVDA:  { ticker: 'NVDA',  nameKR: '엔비디아',        nameEN: 'NVIDIA',              currency: 'USD', unit: 'M' },
  AVGO:  { ticker: 'AVGO',  nameKR: '브로드컴',        nameEN: 'Broadcom',            currency: 'USD', unit: 'M' },
  MRVL:  { ticker: 'MRVL',  nameKR: '마벨테크놀로지스',nameEN: 'Marvell',            currency: 'USD', unit: 'M' },
  SSNLF: { ticker: 'SSNLF', nameKR: '삼성전자',        nameEN: 'Samsung Electronics', currency: 'KRW', unit: 'B' },
  '000660.KS': { ticker: '000660.KS', nameKR: 'SK하이닉스', nameEN: 'SK Hynix',       currency: 'KRW', unit: 'B' },
  MU:    { ticker: 'MU',    nameKR: '마이크론',        nameEN: 'Micron',              currency: 'USD', unit: 'M' },
  SNDK:  { ticker: 'SNDK',  nameKR: '샌디스크',        nameEN: 'SanDisk',             currency: 'USD', unit: 'M' },
  WDC:   { ticker: 'WDC',   nameKR: '웨스턴디지털',    nameEN: 'Western Digital',     currency: 'USD', unit: 'M' },
  STX:   { ticker: 'STX',   nameKR: '시게이트',        nameEN: 'Seagate',             currency: 'USD', unit: 'M' },
  SIMO:  { ticker: 'SIMO',  nameKR: '실리콘모션',      nameEN: 'Silicon Motion',      currency: 'USD', unit: 'M' },
};

// ---------------------------------------------------------------------------
// Korean name → ticker (for use in the main page)
// ---------------------------------------------------------------------------

export const KOREAN_TO_TICKER: Record<string, string> = Object.fromEntries(
  Object.values(COMPANY_META).map((m) => [m.nameKR, m.ticker])
);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Converts a fiscalLabel like '24Q3' into a display label like '2024 3Q'.
 * Pattern: first two digits are the 2-digit year, rest is 'Q<n>'.
 */
function fiscalLabelToDisplay(fiscalLabel: string): string {
  // '24Q3' → year = '2024', quarter = '3'
  const match = fiscalLabel.match(/^(\d{2})Q(\d)$/);
  if (!match) return fiscalLabel;
  const [, yr, q] = match;
  return `20${yr} ${q}Q`;
}

/**
 * Tries multiple item key aliases in order and returns the first non-null value found.
 */
export function getItemValue(
  items: Record<string, number | null>,
  ...keys: string[]
): number | null {
  for (const key of keys) {
    if (key in items && items[key] !== null && items[key] !== undefined) {
      return items[key];
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Main function
// ---------------------------------------------------------------------------

type DbRow = {
  ticker: string;
  company: string;
  periodEndMonth: string;
  fiscalLabel: string;
  currency: string;
  unit: string;
  statementType: string;
  item: string;
  value: number | null;
};

export function getCompanyFinancials(ticker: string): CompanyFinancialData | null {
  const meta = COMPANY_META[ticker];
  if (!meta) return null;

  const rows = (financialsDb as DbRow[]).filter((r) => r.ticker === ticker);
  if (rows.length === 0) return null;

  // Collect all unique periodEndMonths, sorted ascending, take last 8
  const allPeriods = Array.from(new Set(rows.map((r) => r.periodEndMonth))).sort();
  const periods = allPeriods.slice(-8);

  // Build QuarterRow for each period
  const quarters: QuarterRow[] = periods.map((period) => {
    const periodRows = rows.filter((r) => r.periodEndMonth === period);

    // Determine fiscalLabel (same for all rows in a period)
    const fiscalLabel = periodRows[0]?.fiscalLabel ?? '';

    // Flatten IS + BS + RATIO items into a single Record
    const items: Record<string, number | null> = {};
    for (const row of periodRows) {
      // Only include IS, BS, RATIO (skip CF etc.)
      if (row.statementType === 'IS' || row.statementType === 'BS' || row.statementType === 'RATIO') {
        items[row.item] = row.value ?? null;
      }
    }

    return {
      periodEndMonth: period,
      fiscalLabel,
      displayLabel: fiscalLabelToDisplay(fiscalLabel),
      items,
    };
  });

  return { meta, quarters };
}
