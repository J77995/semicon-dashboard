import { CompanyData } from '@/types/company';

export const micron: CompanyData = {
  slug: 'micron',
  nameKR: '마이크론',
  nameEN: 'Micron Technology',
  group: '메모리',
  currency: 'USD',
  fiscalYearEnd: '8월',
  metrics: [
    { quarter: '23Q4', revenue:  4013, revenueGrowthYoY: -40, revenueGrowthQoQ:  0, grossMargin:  -9.1, operatingIncome: -1473, operatingMargin: -36.7, netIncome: -1434, netMargin: -35.7 },
    { quarter: '24Q1', revenue:  5822, revenueGrowthYoY:  58, revenueGrowthQoQ: 45, grossMargin:  22.6, operatingIncome:   793, operatingMargin:  13.6, netIncome:   793, netMargin:  13.6 },
    { quarter: '24Q2', revenue:  6811, revenueGrowthYoY:  82, revenueGrowthQoQ: 17, grossMargin:  34.0, operatingIncome:  1687, operatingMargin:  24.8, netIncome:  1743, netMargin:  25.6 },
    { quarter: '24Q3', revenue:  7750, revenueGrowthYoY:  93, revenueGrowthQoQ: 14, grossMargin:  36.5, operatingIncome:  2026, operatingMargin:  26.1, netIncome:  1731, netMargin:  22.3 },
    { quarter: '24Q4', revenue:  8709, revenueGrowthYoY: 117, revenueGrowthQoQ: 12, grossMargin:  39.5, operatingIncome:  2598, operatingMargin:  29.8, netIncome:  2025, netMargin:  23.3 },
    { quarter: '25Q1', revenue:  8441, revenueGrowthYoY:  45, revenueGrowthQoQ: -3, grossMargin:  37.9, operatingIncome:  2390, operatingMargin:  28.3, netIncome:  1907, netMargin:  22.6 },
    { quarter: '25Q2', revenue:  8050, revenueGrowthYoY:  18, revenueGrowthQoQ: -5, grossMargin:  35.5, operatingIncome:  2010, operatingMargin:  25.0, netIncome:  1800, netMargin:  22.4 },
    { quarter: '25Q3', revenue:  8900, revenueGrowthYoY:  15, revenueGrowthQoQ: 11, grossMargin:  37.0, operatingIncome:  2300, operatingMargin:  25.8, netIncome:  2100, netMargin:  23.6 },
  ],
  earningsCalls: [
    {
      quarter: '24Q4',
      date: '2024-09-25',
      highlights: [
        'HBM3E 매출 급성장, 분기 AI 메모리 매출 사상 최고치 경신',
        'DRAM 가격 상승 사이클 진입, 데이터센터 및 PC 수요 동반 회복',
        'NAND 엔터프라이즈 SSD 매출 전분기 대비 큰 폭 성장, 고수익 제품 비중 확대',
        'EUV 기반 1β(베타) DRAM 양산 확대, 생산성 및 비용 경쟁력 강화',
      ],
      guidance: '25Q1 매출 87억 달러 ±2억 달러, HBM 수요 지속 확대 전망',
      tone: '낙관',
    },
    {
      quarter: '25Q1',
      date: '2024-12-18',
      highlights: [
        'HBM3E 12단 양산 진행 중, 주요 AI 가속기 고객사 공급 계획 확정',
        '데이터센터 SSD 매출 분기 20억 달러 돌파, eSSD 시장 점유율 확대',
        'PC DRAM 계절적 조정 불구 AI PC 수요가 하방을 지지',
        '1γ(감마) DRAM 개발 진행, 차세대 HBM4 설계 병행 추진',
      ],
      guidance: '25Q2 매출 79~83억 달러, NAND 가격 단기 조정 가능성 언급',
      tone: '중립',
    },
    {
      quarter: '25Q2',
      date: '2025-03-19',
      highlights: [
        'NAND 재고 조정 영향으로 분기 매출 소폭 하락, 하반기 회복 기대',
        'HBM 수요는 지속 강세, Micron HBM 연간 수요 완판 확인',
        '데이터센터 eSSD 60TB 이상 고용량 제품 수요 급증',
        '아이다호·허쉬·히로시마 팹 확장 투자 지속, 생산능력 증설 계획 유지',
      ],
      guidance: '25Q3 HBM 공급 증가로 실적 회복 전망, 연간 가이던스 유지',
      tone: '중립',
    },
  ],
};
