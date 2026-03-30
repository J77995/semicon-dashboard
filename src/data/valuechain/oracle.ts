import { CompanyData } from '@/types/company';

export const oracle: CompanyData = {
  slug: 'oracle',
  nameKR: '오라클',
  nameEN: 'Oracle',
  group: 'CSP',
  currency: 'USD',
  fiscalYearEnd: '5월',
  metrics: [
    { quarter: '23Q4', revenue: 12944, revenueGrowthYoY: 18, revenueGrowthQoQ:  4, grossMargin: 71.8, operatingIncome: 4522, operatingMargin: 34.9, netIncome: 3174, netMargin: 24.5 },
    { quarter: '24Q1', revenue: 13307, revenueGrowthYoY: 16, revenueGrowthQoQ:  3, grossMargin: 72.1, operatingIncome: 4671, operatingMargin: 35.1, netIncome: 2367, netMargin: 17.8 },
    { quarter: '24Q2', revenue: 14059, revenueGrowthYoY: 17, revenueGrowthQoQ:  6, grossMargin: 72.5, operatingIncome: 4889, operatingMargin: 34.8, netIncome: 3149, netMargin: 22.4 },
    { quarter: '24Q3', revenue: 13825, revenueGrowthYoY:  9, revenueGrowthQoQ: -2, grossMargin: 71.9, operatingIncome: 4767, operatingMargin: 34.5, netIncome: 2801, netMargin: 20.3 },
    { quarter: '24Q4', revenue: 14068, revenueGrowthYoY:  9, revenueGrowthQoQ:  2, grossMargin: 72.3, operatingIncome: 5049, operatingMargin: 35.9, netIncome: 3138, netMargin: 22.3 },
    { quarter: '25Q1', revenue: 14956, revenueGrowthYoY: 12, revenueGrowthQoQ:  6, grossMargin: 72.8, operatingIncome: 5435, operatingMargin: 36.3, netIncome: 2930, netMargin: 19.6 },
    { quarter: '25Q2', revenue: 15654, revenueGrowthYoY: 11, revenueGrowthQoQ:  5, grossMargin: 73.0, operatingIncome: 5793, operatingMargin: 37.0, netIncome: 3380, netMargin: 21.6 },
    { quarter: '25Q3', revenue: 16100, revenueGrowthYoY: 16, revenueGrowthQoQ:  3, grossMargin: 73.5, operatingIncome: 6100, operatingMargin: 37.9, netIncome: 3500, netMargin: 21.7 },
  ],
  earningsCalls: [
    {
      quarter: '24Q4',
      date: '2024-12-09',
      highlights: [
        'OCI(Oracle Cloud Infrastructure) AI 클러스터 예약 수요 급증, 클라우드 백로그 160억 달러 돌파',
        '데이터베이스 클라우드 서비스 전년 동기 대비 22% 성장, Autonomous DB 채택 확대',
        'AI 학습용 GPU 클러스터 임대 사업 성장, NVIDIA H100/H200 기반 IaaS 경쟁력 강화',
        'Cerner 의료 데이터 클라우드 플랫폼 수익성 개선 진행',
      ],
      guidance: '25Q1 클라우드 매출 성장 가속, OCI AI 인프라 수요 지속 확대',
      tone: '낙관',
    },
    {
      quarter: '25Q1',
      date: '2025-03-10',
      highlights: [
        '클라우드 인프라 매출 전년 동기 대비 52% 성장, AI 워크로드 온보딩 급증',
        'OCI 데이터센터 용량 확장 투자 가속, 2025년 CapEx 사상 최대 계획',
        'Oracle Database 23ai 출시, 기업 데이터베이스 AI 네이티브 전환 가속',
        'AWS, Azure, GCP와의 멀티클라우드 파트너십 확대, 고객 유연성 제공',
      ],
      guidance: '25Q2 OCI 성장 모멘텀 지속, 연간 클라우드 매출 목표 상향 가능성',
      tone: '낙관',
    },
    {
      quarter: '25Q2',
      date: '2025-06-09',
      highlights: [
        '클라우드 서비스 분기 매출 80억 달러 돌파, AI 인프라 수요가 핵심 성장 동인',
        '데이터센터 전력 효율화 투자 확대, AI 워크로드 처리 비용 절감 노력',
        '금융·의료·정부 부문 온프레미스 DB 클라우드 전환 대형 계약 다수 체결',
        'Exadata Cloud@Customer 수요 증가, 규제 요건 강한 산업 공략 강화',
      ],
      guidance: '25Q3 클라우드 매출 성장 지속, 영업이익률 37% 이상 유지 목표',
      tone: '낙관',
    },
  ],
};
