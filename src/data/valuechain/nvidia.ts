import { CompanyData } from '@/types/company';

export const nvidia: CompanyData = {
  slug: 'nvidia',
  nameKR: '엔비디아',
  nameEN: 'NVIDIA',
  group: 'AI반도체',
  currency: 'USD',
  fiscalYearEnd: '1월',
  metrics: [
    // FY25 quarters (NVIDIA fiscal year ends Jan)
    { quarter: '23Q4', revenue: 22103, revenueGrowthYoY:  265, revenueGrowthQoQ:  34, grossMargin: 74.0, operatingIncome: 13656, operatingMargin: 61.8, netIncome: 12285, netMargin: 55.6 },
    { quarter: '24Q1', revenue: 26044, revenueGrowthYoY:  262, revenueGrowthQoQ:  18, grossMargin: 78.4, operatingIncome: 16909, operatingMargin: 64.9, netIncome: 14881, netMargin: 57.1 },
    { quarter: '24Q2', revenue: 30040, revenueGrowthYoY:  122, revenueGrowthQoQ:  15, grossMargin: 75.1, operatingIncome: 18642, operatingMargin: 62.1, netIncome: 16599, netMargin: 55.3 },
    { quarter: '24Q3', revenue: 35082, revenueGrowthYoY:   94, revenueGrowthQoQ:  17, grossMargin: 74.6, operatingIncome: 21869, operatingMargin: 62.3, netIncome: 19309, netMargin: 55.0 },
    // FY26 Q1-Q4 (calendar year ~2025)
    { quarter: '24Q4', revenue: 39331, revenueGrowthYoY:   78, revenueGrowthQoQ:  12, grossMargin: 73.5, operatingIncome: 24084, operatingMargin: 61.2, netIncome: 21908, netMargin: 55.7 },
    { quarter: '25Q1', revenue: 44062, revenueGrowthYoY:   69, revenueGrowthQoQ:  12, grossMargin: 61.0, operatingIncome: 22244, operatingMargin: 50.5, netIncome: 24425, netMargin: 55.4 },
    { quarter: '25Q2', revenue: 44902, revenueGrowthYoY:  122, revenueGrowthQoQ:   2, grossMargin: 75.1, operatingIncome: 27979, operatingMargin: 62.3, netIncome: 23844, netMargin: 53.1 },
    { quarter: '25Q3', revenue: 35081, revenueGrowthYoY:   17, revenueGrowthQoQ: -22, grossMargin: 74.0, operatingIncome: 21634, operatingMargin: 61.7, netIncome: 19436, netMargin: 55.4 },
  ],
  earningsCalls: [
    {
      quarter: '24Q4',
      date: '2025-02-26',
      highlights: [
        'Blackwell GPU 아키텍처 양산 본격화, 데이터센터 매출 전분기 대비 18% 성장',
        'AI 추론 및 학습 수요 지속 확대, 클라우드 CSP 고객사 설비투자 증가 기조 유지',
        'H200 및 GB200 NVL72 랙 시스템 출하 가속, 분기 매출 역대 최고치 경신',
        'NAND/DRAM 고대역폭 메모리 수요 증가로 메모리 파트너사와 협력 강화',
      ],
      guidance: '26Q1 매출 약 43억 달러 ±2% 전망, 데이터센터 수요 모멘텀 지속',
      tone: '낙관',
    },
    {
      quarter: '25Q1',
      date: '2025-05-28',
      highlights: [
        'Blackwell 플랫폼 수요가 공급을 초과, 전분기 대비 매출 12% 성장',
        '클라우드 대형 고객사의 AI 인프라 투자 확대로 데이터센터 부문 매출 성장 지속',
        '자동차 부문 DRIVE 플랫폼 설계 수주 증가, 미래 성장 동력 확보',
        '미국 수출 규제 우려에도 불구 비중국 시장 수요 견조 유지',
      ],
      guidance: '25Q2 매출 약 450억 달러 ±2% 전망, 그로스마진 하락 일시적',
      tone: '낙관',
    },
    {
      quarter: '25Q2',
      date: '2025-08-27',
      highlights: [
        'GB200 NVL72 랙 솔루션 본격 출하로 분기 매출 449억 달러 달성',
        'AI 소버린 인프라 수요 글로벌 확산, 신흥국 정부 및 기업 고객 비중 상승',
        'Spectrum-X 이더넷 네트워킹 솔루션 매출 급성장, 멀티-레이어 AI 인프라 제공',
        'Rubin 차세대 GPU 아키텍처 개발 순항, 연간 제품 주기 전략 확인',
      ],
      guidance: '25Q3 매출 약 350억 달러 수준 전망, 블랙웰 울트라 출시 일정 준수',
      tone: '낙관',
    },
  ],
};
