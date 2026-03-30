import { QuarterKey } from '@/types/financial';
import { QUARTER_ORDER } from './constants';

export function calcGrowthYoY(
  data: Array<{ quarter: string; value: number }>,
  quarter: string
): number | null {
  const currentIdx = QUARTER_ORDER.indexOf(quarter as QuarterKey);
  if (currentIdx < 4) return null; // need 4 quarters back
  const prevYearQuarter = QUARTER_ORDER[currentIdx - 4];
  const current = data.find(d => d.quarter === quarter)?.value;
  const prev = data.find(d => d.quarter === prevYearQuarter)?.value;
  if (current === undefined || prev === undefined || prev === 0) return null;
  return ((current - prev) / Math.abs(prev)) * 100;
}

export function calcGrowthQoQ(
  data: Array<{ quarter: string; value: number }>,
  quarter: string
): number | null {
  const currentIdx = QUARTER_ORDER.indexOf(quarter as QuarterKey);
  if (currentIdx < 1) return null;
  const prevQuarter = QUARTER_ORDER[currentIdx - 1];
  const current = data.find(d => d.quarter === quarter)?.value;
  const prev = data.find(d => d.quarter === prevQuarter)?.value;
  if (current === undefined || prev === undefined || prev === 0) return null;
  return ((current - prev) / Math.abs(prev)) * 100;
}

export function getLatestQuarter(quarters: string[]): string {
  return QUARTER_ORDER.filter(q => quarters.includes(q)).slice(-1)[0] || quarters[quarters.length - 1];
}

export function pivotByItem(
  rows: Array<{ quarter: string; item: string; valueMillion: number }>,
  quarters: readonly string[]
): Array<{ item: string; values: Record<string, number> }> {
  const items = [...new Set(rows.map(r => r.item))];
  return items.map(item => ({
    item,
    values: Object.fromEntries(
      quarters.map(q => [q, rows.find(r => r.item === item && r.quarter === q)?.valueMillion ?? 0])
    ),
  }));
}
