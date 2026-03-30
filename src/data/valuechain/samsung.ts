import { CompanyData } from '@/types/company';

export const samsung: CompanyData = {
  slug: 'samsung',
  nameKR: '삼성전자',
  nameEN: 'Samsung Electronics',
  group: '메모리',
  currency: 'KRW',
  fiscalYearEnd: '12월',
  metrics: [
    { quarter: '23Q3', revenue: 67400, revenueGrowthYoY: -13, revenueGrowthQoQ:   2, grossMargin: 24.8, operatingIncome: 2430,  operatingMargin:  3.6, netIncome: 2167,  netMargin:  3.2 },
    { quarter: '23Q4', revenue: 67783, revenueGrowthYoY:  -4, revenueGrowthQoQ:   1, grossMargin: 28.3, operatingIncome: 2826,  operatingMargin:  4.2, netIncome: 6334,  netMargin:  9.3 },
    { quarter: '24Q1', revenue: 71916, revenueGrowthYoY:  13, revenueGrowthQoQ:   6, grossMargin: 34.1, operatingIncome: 6609,  operatingMargin:  9.2, netIncome: 6707,  netMargin:  9.3 },
    { quarter: '24Q2', revenue: 74069, revenueGrowthYoY:  23, revenueGrowthQoQ:   3, grossMargin: 38.2, operatingIncome: 10440, operatingMargin: 14.1, netIncome: 9832,  netMargin: 13.3 },
    { quarter: '24Q3', revenue: 79099, revenueGrowthYoY:  17, revenueGrowthQoQ:   7, grossMargin: 38.9, operatingIncome: 9177,  operatingMargin: 11.6, netIncome: 7316,  netMargin:  9.2 },
    { quarter: '24Q4', revenue: 76000, revenueGrowthYoY: -10, revenueGrowthQoQ:  -4, grossMargin: 36.0, operatingIncome: 6400,  operatingMargin:  8.4, netIncome: 5200,  netMargin:  6.8 },
    { quarter: '25Q1', revenue: 79000, revenueGrowthYoY:   5, revenueGrowthQoQ:   4, grossMargin: 38.0, operatingIncome: 8900,  operatingMargin: 11.3, netIncome: 7300,  netMargin:  9.2 },
    { quarter: '25Q2', revenue: 81500, revenueGrowthYoY:  10, revenueGrowthQoQ:   3, grossMargin: 39.5, operatingIncome: 9800,  operatingMargin: 12.0, netIncome: 7900,  netMargin:  9.7 },
  ],
  earningsCalls: [
    {
      quarter: '24Q4',
      date: '2025-01-31',
      highlights: [
        'HBM3E 8단/12단 엔비디아 인증 지연으로 HBM 매출 기대치 하회',
        'DRAM 범용 제품 가격 하락 지속으로 메모리 부문 수익성 압박',
        'GAA 기술 기반 3나노 파운드리 고객사 확보 노력 진행 중',
        '반도체 부문 적자 지속, 4분기 그룹 전체 영업이익 전분기 대비 감소',
      ],
      guidance: '25Q1 HBM 공급 확대 기대, 그러나 가격 환경 불확실성 지속',
      tone: '신중',
    },
    {
      quarter: '25Q1',
      date: '2025-04-30',
      highlights: [
        'HBM3E 12단 엔비디아 공급망 합류로 AI 메모리 매출 회복세 전환',
        'LPDDR5X 및 UFS 4.0 모바일 메모리 고사양화로 ASP 상승 효과',
        '시스템반도체 부문 엑시노스 AP 및 이미지센서 출하량 증가',
        '파운드리 부문 2나노 공정 고객사 확보 가속화 추진',
      ],
      guidance: '25Q2 HBM 비중 확대 지속, 범용 DRAM/NAND 가격 안정화 전망',
      tone: '중립',
    },
    {
      quarter: '25Q2',
      date: '2025-07-31',
      highlights: [
        'HBM3E 공급 본격화로 AI 서버 메모리 매출 전분기 대비 큰 폭 증가',
        'NAND 엔터프라이즈 SSD 수요 회복, 데이터센터 고용량 SSD ASP 개선',
        'GAA 3나노 수율 안정화 진행, 2나노 공정 테이프아웃 고객사 증가',
        '스마트폰 세트 판매 부진 속 프리미엄 제품 비중 확대 전략 유지',
      ],
      guidance: '25H2 AI 메모리 수요 강세 지속 전망, HBM 매출 비중 확대 목표',
      tone: '중립',
    },
  ],
};
