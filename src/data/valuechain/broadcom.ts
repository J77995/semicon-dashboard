import { CompanyData } from '@/types/company';

export const broadcom: CompanyData = {
  slug: 'broadcom',
  nameKR: '브로드컴',
  nameEN: 'Broadcom',
  group: 'AI반도체',
  currency: 'USD',
  fiscalYearEnd: '10월',
  metrics: [
    { quarter: '23Q4', revenue:  9295, revenueGrowthYoY: 12, revenueGrowthQoQ:  5, grossMargin: 74.5, operatingIncome: 4218, operatingMargin: 45.4, netIncome:  3514, netMargin: 37.8 },
    { quarter: '24Q1', revenue: 11961, revenueGrowthYoY: 43, revenueGrowthQoQ: 29, grossMargin: 77.1, operatingIncome: 5124, operatingMargin: 42.8, netIncome:  4291, netMargin: 35.9 },
    { quarter: '24Q2', revenue: 13072, revenueGrowthYoY: 43, revenueGrowthQoQ:  9, grossMargin: 78.6, operatingIncome: 5847, operatingMargin: 44.7, netIncome:  6124, netMargin: 46.8 },
    { quarter: '24Q3', revenue: 13072, revenueGrowthYoY: 47, revenueGrowthQoQ:  0, grossMargin: 78.9, operatingIncome: 6065, operatingMargin: 46.4, netIncome:  4794, netMargin: 36.7 },
    { quarter: '24Q4', revenue: 14054, revenueGrowthYoY: 51, revenueGrowthQoQ:  7, grossMargin: 79.1, operatingIncome: 6683, operatingMargin: 47.5, netIncome:  4324, netMargin: 30.8 },
    { quarter: '25Q1', revenue: 14916, revenueGrowthYoY: 25, revenueGrowthQoQ:  6, grossMargin: 79.4, operatingIncome: 7180, operatingMargin: 48.1, netIncome:  5504, netMargin: 36.9 },
    { quarter: '25Q2', revenue: 15825, revenueGrowthYoY: 21, revenueGrowthQoQ:  6, grossMargin: 79.8, operatingIncome: 7720, operatingMargin: 48.8, netIncome:  6100, netMargin: 38.5 },
    { quarter: '25Q3', revenue: 16300, revenueGrowthYoY: 20, revenueGrowthQoQ:  3, grossMargin: 80.1, operatingIncome: 8000, operatingMargin: 49.1, netIncome:  6400, netMargin: 39.3 },
  ],
  earningsCalls: [
    {
      quarter: '24Q4',
      date: '2024-12-12',
      highlights: [
        'AI 반도체 매출 분기 42억 달러 달성, 커스텀 AI ASIC 수요 급증',
        'VMware 인수 완전 통합 완료, 소프트웨어 구독 매출 본격 성장',
        'Google TPU, Meta MTIA 등 하이퍼스케일러 커스텀 칩 수주 확대',
        'AI 네트워킹 이더넷 스위치 매출 대폭 성장, Tomahawk5/Jericho3 수요 강세',
      ],
      guidance: '25Q1 AI 반도체 TAM 600~900억 달러 전망, 자사 점유율 확대 목표',
      tone: '낙관',
    },
    {
      quarter: '25Q1',
      date: '2025-03-06',
      highlights: [
        'AI 관련 매출 49억 달러로 전분기 대비 17% 증가, 연간 400억 달러 달성 목표 확인',
        'VMware Cloud Foundation 기업 고객 전환 순조, 라이선스 기반 → 구독 전환 완료',
        '이더넷 AI 패브릭 스위치 Tomahawk6 개발 착수, 차세대 AI 클러스터 대응',
        '2nm 공정 커스텀 AI ASIC 다음 세대 설계 진행, TSMC와의 파트너십 심화',
      ],
      guidance: '25Q2 AI 매출 성장 지속, VMware 통합 시너지 수익 가시화',
      tone: '낙관',
    },
    {
      quarter: '25Q2',
      date: '2025-06-05',
      highlights: [
        'AI 반도체 및 네트워킹 합산 매출 전년 동기 대비 80% 이상 성장',
        '하이퍼스케일러 3사 이상과 차세대 커스텀 AI 가속기 공동 개발 진행 중',
        'VMware 사업부 영업이익률 대폭 개선, 구독 전환 효과 극대화',
        'Wi-Fi 7 및 5G 모뎀 반도체 모바일 고객 출하 증가',
      ],
      guidance: '25Q3 AI 매출 60억 달러 돌파 목표, 전사 마진 개선 기조 지속',
      tone: '낙관',
    },
  ],
};
