import { CompanyData } from '@/types/company';

export const microsoft: CompanyData = {
  slug: 'microsoft',
  nameKR: '마이크로소프트',
  nameEN: 'Microsoft',
  group: 'CSP',
  currency: 'USD',
  fiscalYearEnd: '6월',
  metrics: [
    // Microsoft FY ends June; quarters labeled by calendar period
    { quarter: '23Q4', revenue: 56189, revenueGrowthYoY: 8,  revenueGrowthQoQ:  3, grossMargin: 70.1, operatingIncome: 24254, operatingMargin: 43.2, netIncome: 20082, netMargin: 35.7 },
    { quarter: '24Q1', revenue: 56517, revenueGrowthYoY: 13, revenueGrowthQoQ:  1, grossMargin: 70.1, operatingIncome: 26895, operatingMargin: 47.6, netIncome: 22291, netMargin: 39.4 },
    { quarter: '24Q2', revenue: 62019, revenueGrowthYoY: 18, revenueGrowthQoQ: 10, grossMargin: 69.6, operatingIncome: 27529, operatingMargin: 44.4, netIncome: 21939, netMargin: 35.4 },
    { quarter: '24Q3', revenue: 64727, revenueGrowthYoY: 16, revenueGrowthQoQ:  4, grossMargin: 69.6, operatingIncome: 27924, operatingMargin: 43.1, netIncome: 21939, netMargin: 33.9 },
    { quarter: '24Q4', revenue: 65585, revenueGrowthYoY: 16, revenueGrowthQoQ:  1, grossMargin: 69.4, operatingIncome: 31207, operatingMargin: 47.6, netIncome: 23688, netMargin: 36.1 },
    { quarter: '25Q1', revenue: 69632, revenueGrowthYoY: 12, revenueGrowthQoQ:  6, grossMargin: 69.0, operatingIncome: 32993, operatingMargin: 47.4, netIncome: 24709, netMargin: 35.5 },
    { quarter: '25Q2', revenue: 70066, revenueGrowthYoY: 13, revenueGrowthQoQ:  1, grossMargin: 68.8, operatingIncome: 32007, operatingMargin: 45.7, netIncome: 25817, netMargin: 36.8 },
    { quarter: '25Q3', revenue: 72000, revenueGrowthYoY: 11, revenueGrowthQoQ:  3, grossMargin: 68.5, operatingIncome: 32500, operatingMargin: 45.1, netIncome: 26000, netMargin: 36.1 },
  ],
  earningsCalls: [
    {
      quarter: '24Q4',
      date: '2024-10-30',
      highlights: [
        'Azure 클라우드 매출 전년 동기 대비 33% 성장, AI 서비스 기여도 지속 확대',
        'Copilot AI 어시스턴트 기업 고객 도입 가속, Office 365 ARPU 상승',
        '데이터센터 설비투자 대규모 확대, 글로벌 AI 인프라 구축 본격화',
        'LinkedIn 및 검색 부문 AI 기반 수익화 초기 성과 확인',
      ],
      guidance: '25Q1 매출 695~705억 달러 전망, Azure 성장률 가속 기대',
      tone: '낙관',
    },
    {
      quarter: '25Q1',
      date: '2025-01-29',
      highlights: [
        'Azure 매출 전년 동기 대비 31% 성장, AI 워크로드 증가가 주요 성장 동인',
        'Copilot 365 유료 구독자 급증, 기업용 AI 생산성 도구 시장 리더십 강화',
        '데이터센터 CapEx 800억 달러 수준으로 확대 계획, 에너지 효율 개선 포함',
        'OpenAI 협력 심화, Azure OpenAI 서비스 기업 고객 확장 지속',
      ],
      guidance: '25Q2 매출 700~710억 달러, Azure 성장률 34~35% 전망',
      tone: '낙관',
    },
    {
      quarter: '25Q2',
      date: '2025-04-30',
      highlights: [
        '전 사업 부문 안정적 성장, 클라우드 부문 매출 비중 60% 초과 달성',
        'AI 코파일럿 에이전트 엔터프라이즈 활성 사용자 수 분기 내 2배 성장',
        'GitHub Copilot 개발자 생산성 플랫폼 구독자 400만 돌파',
        '데이터센터 AI 워크로드용 스토리지 수요 증가로 스토리지 파트너사 기회 확대',
      ],
      guidance: '25Q3 Azure 성장률 유지, AI 기반 수익화 가속 기대',
      tone: '낙관',
    },
  ],
};
