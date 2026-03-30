import { CompanyData } from '@/types/company';

// Kioxia - Listed on Tokyo Stock Exchange Oct 2024. Revenue in USD millions (converted from JPY ~150/USD).
export const kioxia: CompanyData = {
  slug: 'kioxia',
  nameKR: '키옥시아',
  nameEN: 'Kioxia',
  group: '메모리',
  currency: 'USD',
  fiscalYearEnd: '3월',
  metrics: [
    { quarter: '23Q4', revenue: 2340, revenueGrowthYoY: -22, revenueGrowthQoQ:  3, grossMargin:  -8.5, operatingIncome: -362, operatingMargin: -15.5, netIncome: -418, netMargin: -17.9 },
    { quarter: '24Q1', revenue: 2510, revenueGrowthYoY:   7, revenueGrowthQoQ:  7, grossMargin:   5.1, operatingIncome: -110, operatingMargin:  -4.4, netIncome: -180, netMargin:  -7.2 },
    { quarter: '24Q2', revenue: 2780, revenueGrowthYoY:  18, revenueGrowthQoQ: 11, grossMargin:  16.9, operatingIncome:  198, operatingMargin:   7.1, netIncome:  130, netMargin:   4.7 },
    { quarter: '24Q3', revenue: 3050, revenueGrowthYoY:  30, revenueGrowthQoQ: 10, grossMargin:  25.4, operatingIncome:  422, operatingMargin:  13.8, netIncome:  310, netMargin:  10.2 },
    { quarter: '24Q4', revenue: 3380, revenueGrowthYoY:  44, revenueGrowthQoQ: 11, grossMargin:  31.8, operatingIncome:  641, operatingMargin:  19.0, netIncome:  490, netMargin:  14.5 },
    { quarter: '25Q1', revenue: 3150, revenueGrowthYoY:  25, revenueGrowthQoQ: -7, grossMargin:  28.6, operatingIncome:  535, operatingMargin:  17.0, netIncome:  410, netMargin:  13.0 },
    { quarter: '25Q2', revenue: 3280, revenueGrowthYoY:  18, revenueGrowthQoQ:  4, grossMargin:  30.2, operatingIncome:  585, operatingMargin:  17.8, netIncome:  450, netMargin:  13.7 },
    { quarter: '25Q3', revenue: 3450, revenueGrowthYoY:  13, revenueGrowthQoQ:  5, grossMargin:  31.5, operatingIncome:  630, operatingMargin:  18.3, netIncome:  490, netMargin:  14.2 },
  ],
  earningsCalls: [
    {
      quarter: '24Q4',
      date: '2025-02-12',
      highlights: [
        'NAND 업황 회복으로 분기 영업이익 사상 최고치 경신, 가격 상승 사이클 본격 진입',
        '엔터프라이즈 SSD 및 데이터센터 솔루션 매출 급성장, AI 수요 직접 수혜',
        'BiCS8(218단) 3D NAND 양산 비중 확대, 원가 경쟁력 개선 가속화',
        '도쿄 증시 상장 후 첫 실적 발표, 투자자 신뢰 확보 및 재무 투명성 강화',
      ],
      guidance: '25Q1 계절 조정 불구 데이터센터 수요 견조, 마진 방어 가능',
      tone: '낙관',
    },
    {
      quarter: '25Q1',
      date: '2025-05-14',
      highlights: [
        '데이터센터 고용량 SSD 수요 AI 열기에 힘입어 지속 강세',
        'QLC NAND 기반 고용량 eSSD 신제품 출시, 데이터센터 TCO 개선 기여',
        'WD(SanDisk) 분사 이후 생산 협력 체계 재편, 요카이치 팹 가동률 최적화',
        'PC·모바일 NAND 수요 완만한 회복세, 소비자 시장 재고 정상화 진행 중',
      ],
      guidance: '25Q2 수요 점진적 회복 전망, 연간 실적 가이던스 유지',
      tone: '중립',
    },
    {
      quarter: '25Q2',
      date: '2025-08-13',
      highlights: [
        '엔터프라이즈 SSD 출하량 전분기 대비 15% 증가, 매출 성장 견인',
        'TLC/QLC 혼합 포트폴리오 전략으로 고마진 제품 비중 확대',
        '차세대 BiCS9 NAND 개발 순항, 고적층 기술 리더십 유지 목표',
        '에너지 절감형 NAND 솔루션 수요 증가, 친환경 데이터센터 트렌드 수혜',
      ],
      guidance: '25Q3 수요 안정적, 연간 영업이익 흑자 기조 확고',
      tone: '낙관',
    },
  ],
};
