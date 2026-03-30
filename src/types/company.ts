import { QuarterKey } from './financial';

export type CompanyGroup = 'CSP' | 'AI반도체' | '메모리' | 'SSD컨트롤러';
export type CompanySlug =
  | 'google' | 'microsoft' | 'amazon' | 'oracle'
  | 'nvidia' | 'broadcom' | 'marvell'
  | 'samsung' | 'sk-hynix' | 'micron' | 'sandisk' | 'kioxia'
  | 'phison' | 'silicon-motion';

export interface QuarterlyMetrics {
  quarter: QuarterKey;
  revenue: number;
  revenueGrowthYoY: number;
  revenueGrowthQoQ: number;
  grossMargin: number;
  operatingIncome: number;
  operatingMargin: number;
  netIncome: number;
  netMargin: number;
}

export interface EarningsCall {
  quarter: QuarterKey;
  date: string;
  highlights: string[];
  guidance?: string;
  tone: '낙관' | '중립' | '신중';
}

export interface CompanyData {
  slug: CompanySlug;
  nameKR: string;
  nameEN: string;
  group: CompanyGroup;
  currency: 'USD' | 'KRW';
  fiscalYearEnd: string;
  metrics: QuarterlyMetrics[];
  earningsCalls: EarningsCall[];
}
