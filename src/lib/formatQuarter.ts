/**
 * Quarter string formatters.
 * Internal keys: "24Q1" style (YYQn)
 * Display: "1Q 2024" style with optional end-month line
 *
 * Parts (combinable):
 *   fmtQYear("24Q1") → "2024"
 *   fmtQNum("24Q1")  → "1Q"
 *   fmtQ("24Q1")     → "1Q 2024"  (= fmtQNum + " " + fmtQYear)
 */

// "24Q1" → "2024"
export function fmtQYear(q: string): string {
  const m = q.match(/^(\d{2})Q\d$/);
  if (!m) return q;
  return `20${m[1]}`;
}

// "24Q1" → "1Q"
export function fmtQNum(q: string): string {
  const m = q.match(/^(\d{2})Q(\d)$/);
  if (!m) return q;
  return `${m[2]}Q`;
}

// "24Q1" → "1Q 2024"
export function fmtQ(q: string): string {
  const year = fmtQYear(q);
  const num  = fmtQNum(q);
  return year === q ? q : `${num} ${year}`;
}

// "24Q1" → "2024-03"  (quarter end month)
// lookup: FADU_PERIOD_END_MONTHS 등 회사별 맵을 넘기면 그걸 사용;
// 없으면 12월 결산 기준으로 계산 (fallback)
export function fmtQMonth(q: string, lookup?: Record<string, string>): string {
  if (lookup) return lookup[q] ?? '';
  const m = q.match(/^(\d{2})Q(\d)$/);
  if (!m) return '';
  const mm = (['', '03', '06', '09', '12'] as const)[+m[2]] ?? '';
  return mm ? `20${m[1]}-${mm}` : '';
}

// Chart X-axis short form: "24Q1" → "1Q 2024"
export const fmtQAxis = fmtQ;
