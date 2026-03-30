import { CompanyData } from '@/types/company';

export const marvell: CompanyData = {
  slug: 'marvell',
  nameKR: '마벨테크놀로지',
  nameEN: 'Marvell Technology',
  group: 'AI반도체',
  currency: 'USD',
  fiscalYearEnd: '1월',
  metrics: [
    { quarter: '23Q4', revenue: 1427, revenueGrowthYoY: -12, revenueGrowthQoQ:  -7, grossMargin: 47.2, operatingIncome:  118, operatingMargin:  8.3, netIncome:  -145, netMargin: -10.2 },
    { quarter: '24Q1', revenue: 1160, revenueGrowthYoY: -19, revenueGrowthQoQ: -19, grossMargin: 46.8, operatingIncome:   42, operatingMargin:  3.6, netIncome:  -174, netMargin: -15.0 },
    { quarter: '24Q2', revenue: 1274, revenueGrowthYoY:  -5, revenueGrowthQoQ:  10, grossMargin: 48.1, operatingIncome:  116, operatingMargin:  9.1, netIncome:    90, netMargin:  7.1 },
    { quarter: '24Q3', revenue: 1516, revenueGrowthYoY:   7, revenueGrowthQoQ:  19, grossMargin: 52.3, operatingIncome:  266, operatingMargin: 17.5, netIncome:   207, netMargin: 13.7 },
    { quarter: '24Q4', revenue: 1817, revenueGrowthYoY:  27, revenueGrowthQoQ:  20, grossMargin: 58.1, operatingIncome:  417, operatingMargin: 22.9, netIncome:   370, netMargin: 20.4 },
    { quarter: '25Q1', revenue: 1875, revenueGrowthYoY:  61, revenueGrowthQoQ:   3, grossMargin: 59.8, operatingIncome:  454, operatingMargin: 24.2, netIncome:   394, netMargin: 21.0 },
    { quarter: '25Q2', revenue: 2011, revenueGrowthYoY:  58, revenueGrowthQoQ:   7, grossMargin: 60.5, operatingIncome:  509, operatingMargin: 25.3, netIncome:   440, netMargin: 21.9 },
    { quarter: '25Q3', revenue: 2150, revenueGrowthYoY:  42, revenueGrowthQoQ:   7, grossMargin: 61.2, operatingIncome:  560, operatingMargin: 26.0, netIncome:   490, netMargin: 22.8 },
  ],
  earningsCalls: [
    {
      quarter: '24Q4',
      date: '2025-03-05',
      highlights: [
        'AI 데이터센터 매출 분기 11억 달러 달성, 전년 동기 대비 3배 이상 성장',
        '커스텀 AI ASIC(XPU) 양산 출하 개시, 클라우드 하이퍼스케일러 고객 공급 가속',
        '광트랜시버·PAM4 DSP 등 광통신 반도체 AI 클러스터 수요 급증',
        'HDD 및 스토리지 컨트롤러 업황 회복 조짐, 클라우드 저장소 수요 증가',
      ],
      guidance: '25Q1 데이터센터 매출 지속 성장, AI XPU 출하량 확대 전망',
      tone: '낙관',
    },
    {
      quarter: '25Q1',
      date: '2025-06-03',
      highlights: [
        'AI 매출 사상 최고치 경신, 커스텀 AI ASIC 및 네트워킹 DSP 수요 견인',
        '5G DPU 및 클라우드 네이티브 인프라 반도체 전략적 포트폴리오 확대',
        '2nm 공정 전환 차세대 AI 가속기 설계 진행, TSMC와 공동 개발 심화',
        'Inphi 인수 시너지 극대화, 400G/800G 광통신 반도체 시장 지배력 강화',
      ],
      guidance: '25Q2 AI 데이터센터 매출 20억 달러 목표, 전사 마진 개선 기조',
      tone: '낙관',
    },
    {
      quarter: '25Q2',
      date: '2025-09-03',
      highlights: [
        'AI 데이터센터 분기 매출 13억 달러 돌파, 커스텀 ASIC 출하 안정화',
        '광통신 반도체 1.6T 트랜시버 DSP 신제품 고객 샘플 공급 시작',
        '클라우드·5G·자동차 다각화 포트폴리오로 경기 사이클 리스크 분산',
        'CTO 데이 개최, 2nm 기반 차세대 AI ASIC 로드맵 공개 예정',
      ],
      guidance: '25Q3 매출 21억 달러 수준 전망, AI 성장 모멘텀 지속 확인',
      tone: '낙관',
    },
  ],
};
