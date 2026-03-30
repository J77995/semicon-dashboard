export type QuarterKey = '23Q3' | '23Q4' | '24Q1' | '24Q2' | '24Q3' | '24Q4'
  | '25Q1' | '25Q2' | '25Q3' | '25Q4';

export type StatementType = '손익계산서' | '재무상태표' | '현금흐름표' | '재무비율';

export interface FinancialRow {
  quarter: QuarterKey;
  year: number;
  quarterNum: string;
  periodEnd?: string;       // ISO date e.g. '2025-09-30'
  statementType: StatementType;
  category: string;
  item: string;
  valueMillion: number;
  valueEokwon: number;
}
