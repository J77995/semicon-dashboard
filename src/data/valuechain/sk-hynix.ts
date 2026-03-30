import { CompanyData } from '@/types/company';

export const skHynix: CompanyData = {
  slug: 'sk-hynix',
  nameKR: 'SK하이닉스',
  nameEN: 'SK Hynix',
  group: '메모리',
  currency: 'KRW',
  fiscalYearEnd: '12월',
  metrics: [
    { quarter: '23Q3', revenue:  9066, revenueGrowthYoY: -17, revenueGrowthQoQ:  16, grossMargin: 11.8, operatingIncome:  -178,  operatingMargin: -2.0, netIncome:  -527, netMargin: -5.8 },
    { quarter: '23Q4', revenue: 11307, revenueGrowthYoY:  27, revenueGrowthQoQ:  25, grossMargin: 29.7, operatingIncome:  3460,  operatingMargin: 30.6, netIncome:  3528, netMargin: 31.2 },
    { quarter: '24Q1', revenue: 12431, revenueGrowthYoY:  42, revenueGrowthQoQ:  10, grossMargin: 40.3, operatingIncome:  2876,  operatingMargin: 23.1, netIncome:  2373, netMargin: 19.1 },
    { quarter: '24Q2', revenue: 16323, revenueGrowthYoY:  124,revenueGrowthQoQ:  31, grossMargin: 53.9, operatingIncome:  5469,  operatingMargin: 33.5, netIncome:  4345, netMargin: 26.6 },
    { quarter: '24Q3', revenue: 17573, revenueGrowthYoY:  94, revenueGrowthQoQ:   8, grossMargin: 57.4, operatingIncome:  7028,  operatingMargin: 40.0, netIncome:  5753, netMargin: 32.7 },
    { quarter: '24Q4', revenue: 19768, revenueGrowthYoY:  75, revenueGrowthQoQ:  12, grossMargin: 56.8, operatingIncome:  9334,  operatingMargin: 47.2, netIncome:  7871, netMargin: 39.8 },
    { quarter: '25Q1', revenue: 17639, revenueGrowthYoY:  42, revenueGrowthQoQ: -11, grossMargin: 50.2, operatingIncome:  7079,  operatingMargin: 40.1, netIncome:  5839, netMargin: 33.1 },
    { quarter: '25Q2', revenue: 19100, revenueGrowthYoY:  17, revenueGrowthQoQ:   8, grossMargin: 53.8, operatingIncome:  8020,  operatingMargin: 42.0, netIncome:  6500, netMargin: 34.0 },
  ],
  earningsCalls: [
    {
      quarter: '24Q4',
      date: '2025-01-23',
      highlights: [
        'HBM3E 독점 공급 지위 유지, NVIDIA GB200 주요 HBM 공급사로 확고한 위상',
        '분기 영업이익 9.3조 원 달성, HBM 고마진 효과로 사상 최대 분기 실적',
        'eSSD 데이터센터 솔루션 매출 성장, 엔터프라이즈 SSD 수요 강세',
        '1c나노 DRAM 및 321단 NAND 양산 진행, 기술 리더십 확대',
      ],
      guidance: '25Q1 HBM 수요 모멘텀 지속, 범용 메모리 가격 조정 가능성 상존',
      tone: '낙관',
    },
    {
      quarter: '25Q1',
      date: '2025-04-24',
      highlights: [
        'HBM4 개발 완료 및 고객사 샘플 공급 시작, 차세대 AI 메모리 시장 선점',
        '범용 DRAM 가격 하락으로 영업이익 전분기 대비 감소했으나 여전히 견조',
        'eSSD 엔터프라이즈 제품 라인업 확장, 데이터센터 고객사 포트폴리오 다변화',
        '청주 M15X 팹 증설 계획 확인, AI 메모리 생산능력 확대 투자 지속',
      ],
      guidance: '25Q2 HBM4 양산 시작 예상, 전체 HBM 비트 출하량 전분기 대비 증가',
      tone: '낙관',
    },
    {
      quarter: '25Q2',
      date: '2025-07-24',
      highlights: [
        'HBM4 12단 양산 개시, 주요 AI 가속기 고객사 공급 확대 진행',
        'NAND 엔터프라이즈 SSD 321단 적용 제품 매출 비중 확대',
        'AI PC용 LPDDR5T 온디바이스 AI 메모리 수요 증가 추세 확인',
        'CXL 메모리 모듈 양산 준비 완료, 클라우드 고객사 기술 검증 단계',
      ],
      guidance: '25H2 HBM 공급 확대 및 고객 다변화로 실적 개선 전망',
      tone: '낙관',
    },
  ],
};
