import { CompanyData } from '@/types/company';

// SanDisk (formerly WD Flash / Western Digital NAND division)
// Listed as standalone entity after WD spin-off completed 2024
export const sandisk: CompanyData = {
  slug: 'sandisk',
  nameKR: '샌디스크',
  nameEN: 'SanDisk (WD Flash)',
  group: '메모리',
  currency: 'USD',
  fiscalYearEnd: '6월',
  metrics: [
    { quarter: '23Q4', revenue: 1519, revenueGrowthYoY: -25, revenueGrowthQoQ:  4, grossMargin: -12.3, operatingIncome: -423, operatingMargin: -27.8, netIncome: -501, netMargin: -33.0 },
    { quarter: '24Q1', revenue: 1562, revenueGrowthYoY:   3, revenueGrowthQoQ:  3, grossMargin:   5.2, operatingIncome:  -87, operatingMargin:  -5.6, netIncome: -154, netMargin:  -9.9 },
    { quarter: '24Q2', revenue: 1693, revenueGrowthYoY:  11, revenueGrowthQoQ:  8, grossMargin:  14.8, operatingIncome:  118, operatingMargin:   7.0, netIncome:   45, netMargin:   2.7 },
    { quarter: '24Q3', revenue: 1878, revenueGrowthYoY:  24, revenueGrowthQoQ: 11, grossMargin:  24.6, operatingIncome:  302, operatingMargin:  16.1, netIncome:  220, netMargin:  11.7 },
    { quarter: '24Q4', revenue: 2100, revenueGrowthYoY:  38, revenueGrowthQoQ: 12, grossMargin:  31.4, operatingIncome:  486, operatingMargin:  23.1, netIncome:  374, netMargin:  17.8 },
    { quarter: '25Q1', revenue: 1985, revenueGrowthYoY:  27, revenueGrowthQoQ: -5, grossMargin:  28.7, operatingIncome:  410, operatingMargin:  20.7, netIncome:  320, netMargin:  16.1 },
    { quarter: '25Q2', revenue: 2050, revenueGrowthYoY:  21, revenueGrowthQoQ:  3, grossMargin:  30.2, operatingIncome:  445, operatingMargin:  21.7, netIncome:  355, netMargin:  17.3 },
    { quarter: '25Q3', revenue: 2180, revenueGrowthYoY:  16, revenueGrowthQoQ:  6, grossMargin:  32.0, operatingIncome:  495, operatingMargin:  22.7, netIncome:  400, netMargin:  18.3 },
  ],
  earningsCalls: [
    {
      quarter: '24Q4',
      date: '2025-02-05',
      highlights: [
        'NAND 업황 회복에 따른 가격 상승으로 분기 흑자 전환 및 마진 크게 개선',
        '엔터프라이즈 SSD 및 플래시 스토리지 솔루션 수요 AI 데이터센터 중심 강세',
        'BiCS8(218단) NAND 양산 확대, 비용 경쟁력 강화 및 고용량 SSD 수율 개선',
        'WD 분사 후 독립 법인으로서 NAND 전문 기업 포지셔닝 강화',
      ],
      guidance: '25Q1 NAND 수요 견조하나 계절적 조정 반영, 마진 안정화 지속',
      tone: '중립',
    },
    {
      quarter: '25Q1',
      date: '2025-05-07',
      highlights: [
        '데이터센터 고용량 eSSD 수요 지속, 클라우드 고객 장기 공급 계약 확대',
        'UFS 4.0 모바일 스토리지 출하 증가, 스마트폰 플래그십 탑재 비중 상승',
        'BiCS9(나노 EUV 적용) 차세대 NAND 개발 일정 확인, 2026년 양산 목표',
        '재고 수준 정상화 완료, 공급 타이트 환경에서 ASP 협상력 개선',
      ],
      guidance: '25Q2 매출 소폭 성장, 엔터프라이즈 SSD 마진 개선 지속 예상',
      tone: '중립',
    },
    {
      quarter: '25Q2',
      date: '2025-08-06',
      highlights: [
        'AI 데이터센터 고용량 eSSD 수요 견인으로 분기 매출 성장세 유지',
        '소비자용 SSD·플래시 제품 수요 계절적 상승, ASP 안정적 유지',
        '메모리 카드·USB 등 소매 제품 수익성 개선, 고부가 브랜드 포트폴리오 집중',
        '글로벌 NAND 공급사 설비투자 자제 기조로 수급 균형 유지 전망',
      ],
      guidance: '25Q3 수요 견조 전망, 데이터센터 SSD 고마진 비중 확대 목표',
      tone: '낙관',
    },
  ],
};
