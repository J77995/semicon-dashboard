import { CompanyData } from '@/types/company';

export const google: CompanyData = {
  slug: 'google',
  nameKR: '구글(알파벳)',
  nameEN: 'Google / Alphabet',
  group: 'CSP',
  currency: 'USD',
  fiscalYearEnd: '12월',
  metrics: [
    { quarter: '23Q4', revenue: 86310,  revenueGrowthYoY: 13, revenueGrowthQoQ:  9, grossMargin: 56.5, operatingIncome: 23697, operatingMargin: 27.5, netIncome: 20402, netMargin: 23.6 },
    { quarter: '24Q1', revenue: 80539,  revenueGrowthYoY: 15, revenueGrowthQoQ: -7, grossMargin: 57.4, operatingIncome: 25472, operatingMargin: 31.6, netIncome: 23662, netMargin: 29.4 },
    { quarter: '24Q2', revenue: 84742,  revenueGrowthYoY: 14, revenueGrowthQoQ:  5, grossMargin: 57.6, operatingIncome: 27425, operatingMargin: 32.4, netIncome: 23619, netMargin: 27.9 },
    { quarter: '24Q3', revenue: 88268,  revenueGrowthYoY: 15, revenueGrowthQoQ:  4, grossMargin: 57.8, operatingIncome: 28553, operatingMargin: 32.0, netIncome: 26301, netMargin: 29.8 },
    { quarter: '24Q4', revenue: 96469,  revenueGrowthYoY: 12, revenueGrowthQoQ:  9, grossMargin: 58.4, operatingIncome: 30574, operatingMargin: 31.7, netIncome: 26631, netMargin: 27.6 },
    { quarter: '25Q1', revenue: 90234,  revenueGrowthYoY: 12, revenueGrowthQoQ: -7, grossMargin: 58.6, operatingIncome: 28992, operatingMargin: 32.1, netIncome: 25367, netMargin: 28.1 },
    { quarter: '25Q2', revenue: 96400,  revenueGrowthYoY: 14, revenueGrowthQoQ:  7, grossMargin: 59.0, operatingIncome: 31450, operatingMargin: 32.6, netIncome: 27800, netMargin: 28.8 },
    { quarter: '25Q3', revenue: 98000,  revenueGrowthYoY: 11, revenueGrowthQoQ:  2, grossMargin: 59.2, operatingIncome: 32000, operatingMargin: 32.7, netIncome: 28200, netMargin: 28.8 },
  ],
  earningsCalls: [
    {
      quarter: '24Q4',
      date: '2025-02-04',
      highlights: [
        'Google Cloud 매출 전년 동기 대비 30% 성장, 분기 매출 120억 달러 돌파',
        'Gemini AI 모델 검색·광고 통합 초기 성과, AI Overviews 사용자 10억 명 돌파',
        'TPU v5p 클라우드 서비스 출시, AI 학습·추론 인프라 경쟁력 강화',
        'YouTube 광고 매출 견조, 쇼츠 광고 수익화 가속화',
      ],
      guidance: '25Q1 Google Cloud 성장 모멘텀 지속, CapEx 연간 750억 달러 계획',
      tone: '낙관',
    },
    {
      quarter: '25Q1',
      date: '2025-04-29',
      highlights: [
        'Google Cloud 매출 전년 동기 대비 28% 성장, AI 워크로드 온보딩 가속',
        'Gemini 2.0 Flash 모델 출시로 추론 비용 절감 및 성능 향상 동시 달성',
        '광고 부문 AI 기반 타겟팅 개선으로 ROI 향상, 대형 광고주 예산 확대',
        'Waymo 자율주행 서비스 확장, AI 및 로보틱스 부문 투자 심화',
      ],
      guidance: '25Q2 광고 수요 견조, Cloud AI 서비스 성장 가속 전망',
      tone: '낙관',
    },
    {
      quarter: '25Q2',
      date: '2025-07-29',
      highlights: [
        'AI 검색 전환기 속에서도 광고 매출 두 자릿수 성장 지속',
        'Google Cloud 분기 매출 140억 달러 목전, TPU 기반 AI 인프라 수요 증가',
        'Gemini Advanced 유료 구독 사용자 지속 증가, AI 수익화 모델 가시화',
        '데이터센터 스토리지 및 네트워킹 인프라 투자 확대, 파트너 에코시스템 혜택',
      ],
      guidance: '25H2 Cloud 성장 지속, 광고 환경 불확실성에 유의하며 투자 지속',
      tone: '낙관',
    },
  ],
};
