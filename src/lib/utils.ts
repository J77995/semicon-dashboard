import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatKRW(value: number, unit: '백만원' | '억원' = '억원'): string {
  if (unit === '억원') {
    const eok = value / 100;
    if (Math.abs(eok) >= 1000) {
      return `${(eok / 1000).toFixed(1)}조`;
    }
    return `${eok.toFixed(0)}억`;
  }
  return `${value.toLocaleString('ko-KR')}백만`;
}

export function formatPct(value: number, decimals: number = 1): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
}

export function calcGrowthRate(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / Math.abs(previous)) * 100;
}

export function formatValue(value: number): string {
  if (value === 0) return '-';
  const abs = Math.abs(value);
  if (abs >= 100000) return `${(value / 100000).toFixed(1)}조`;
  if (abs >= 10000) return `${(value / 10000).toFixed(1)}억`;
  return `${value.toLocaleString('ko-KR')}백만`;
}
