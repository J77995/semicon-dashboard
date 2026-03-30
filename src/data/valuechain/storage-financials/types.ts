// Storage company financial DB type
// VCFinancialRow 구조와 동일 + ninjaField 추가
// 나중에 allVCFinancials에 spread로 합칠 수 있도록 호환 설계

import type { VCStatementType } from '@/types/vcFinancials';

export interface StorageFinancialRow {
  ticker: string;           // 'WDC', 'STX', 'SNDK', 'SIMO'
  company: string;          // 'Western Digital', 'Seagate', 'SanDisk', 'Silicon Motion'
  periodEndMonth: string;   // 'YYYY-MM' — 결산월 (VCFinancialRow.periodEndMonth과 동일 형식)
  fiscalLabel: string;      // '22Q1', '25Q4' 등 회계연도 라벨
  currency: 'USD' | 'KRW';
  unit: 'M' | 'B';
  statementType: VCStatementType;
  item: string;             // 매핑된 항목명 (한글) 또는 ninjaField 원본명 (매핑 없는 경우)
  ninjaField: string;       // API-Ninjas 원본 필드명 — VCFinancialRow 합칠 때 추적용
  value: number | null;
}

// ninjaField → item 매핑 현황
// ✅ 매핑됨 (item = 한글명): 매출액, 매출원가, 매출총이익, 영업이익, 순이익,
//    R&D비용, 이자비용, 법인세비용, 주식보상비용, D&A, EPS_기본, EPS_희석,
//    총자산, 총부채, 자기자본, 현금및현금성자산, 매출채권, 재고자산,
//    유동자산, 유동부채, 총차입금, 장기차입금, 유형자산, 무형자산,
//    영업권, 이익잉여금, 매입채무, 운전자본,
//    영업현금흐름, 투자현금흐름, 재무현금흐름, FCF, CAPEX, 자사주매입, 배당금지급
//
// ⚠️  매핑 없음 (item = ninjaField 그대로): sales_and_marketing,
//    general_and_administrative, shares_basic, shares_diluted
