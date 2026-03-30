// Valuechain 기업 재무 DB 타입 정의
// Flat-format: 항목(item)별 1행 → 기업/분기/항목 추가가 row append만으로 가능
// 공통 identity key: ticker + periodEndMonth → VCFinancialRow ↔ VCTranscriptRow 조인 가능

export type VCStatementType = 'IS' | 'BS' | 'CF' | 'RATIO';

export interface VCFinancialRow {
  ticker: string;           // 'NVDA', 'MU', '005930.KS', '181820.KQ'
  company: string;          // 'NVIDIA', 'Micron', '삼성전자'
  periodEndMonth: string;   // 'YYYY-MM' — join key (결산월 기준)
  fiscalLabel: string;      // '17Q1', '26Q4' 등 회사 자체 재무라벨
  currency: 'USD' | 'KRW';
  unit: 'M' | 'B';         // Million / Billion (EPS는 그대로 소수점 값)
  statementType: VCStatementType;
  item: string;             // '매출액', '영업이익', '유동자산' 등
  value: number | null;     // null = 미공개 / 해당없음 / 미래 미입력
  ninjaField?: string;      // API-Ninjas 원본 필드명 (출처 추적용, 없으면 생략)
}

// 어닝스콜 트랜스크립트 DB 타입
// identity 필드(ticker, company, periodEndMonth, fiscalLabel)는 VCFinancialRow와 동일 포맷
// JOIN: transcript.ticker + transcript.periodEndMonth = financial.ticker + financial.periodEndMonth
export interface VCTranscriptRow {
  ticker: string;           // VCFinancialRow와 동일
  company: string;          // VCFinancialRow와 동일
  periodEndMonth: string;   // 'YYYY-MM' — join key
  fiscalLabel: string;      // '24Q2' — VCFinancialRow와 동일 포맷
  callDate: string;         // 'YYYY-MM-DD' 어닝스콜 실제 개최일
  transcript: string;       // 전문 텍스트
}
