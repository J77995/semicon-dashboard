import { CompanyData } from '@/types/company';

// Silicon Motion Technology - NAND flash controller IC company (NASDAQ listed, USD millions)
export const siliconMotion: CompanyData = {
  slug: 'silicon-motion',
  nameKR: '실리콘모션',
  nameEN: 'Silicon Motion Technology',
  group: 'SSD컨트롤러',
  currency: 'USD',
  fiscalYearEnd: '12월',
  metrics: [
    { quarter: '23Q4', revenue: 178, revenueGrowthYoY:  14, revenueGrowthQoQ:  18, grossMargin: 47.2, operatingIncome: 30, operatingMargin: 16.9, netIncome: 28, netMargin: 15.7 },
    { quarter: '24Q1', revenue: 157, revenueGrowthYoY:  11, revenueGrowthQoQ: -12, grossMargin: 46.5, operatingIncome: 23, operatingMargin: 14.6, netIncome: 22, netMargin: 14.0 },
    { quarter: '24Q2', revenue: 185, revenueGrowthYoY:  16, revenueGrowthQoQ:  18, grossMargin: 47.8, operatingIncome: 32, operatingMargin: 17.3, netIncome: 30, netMargin: 16.2 },
    { quarter: '24Q3', revenue: 201, revenueGrowthYoY:  24, revenueGrowthQoQ:   9, grossMargin: 48.5, operatingIncome: 37, operatingMargin: 18.4, netIncome: 36, netMargin: 17.9 },
    { quarter: '24Q4', revenue: 219, revenueGrowthYoY:  23, revenueGrowthQoQ:   9, grossMargin: 49.1, operatingIncome: 43, operatingMargin: 19.6, netIncome: 41, netMargin: 18.7 },
    { quarter: '25Q1', revenue: 202, revenueGrowthYoY:  29, revenueGrowthQoQ:  -8, grossMargin: 48.2, operatingIncome: 38, operatingMargin: 18.8, netIncome: 37, netMargin: 18.3 },
    { quarter: '25Q2', revenue: 226, revenueGrowthYoY:  22, revenueGrowthQoQ:  12, grossMargin: 49.5, operatingIncome: 45, operatingMargin: 19.9, netIncome: 44, netMargin: 19.5 },
    { quarter: '25Q3', revenue: 240, revenueGrowthYoY:  19, revenueGrowthQoQ:   6, grossMargin: 50.0, operatingIncome: 49, operatingMargin: 20.4, netIncome: 47, netMargin: 19.6 },
  ],
  earningsCalls: [
    {
      quarter: '24Q4',
      date: '2025-02-20',
      highlights: [
        'NAND 파트너사 수요 회복에 따른 컨트롤러 출하 증가로 분기 매출 사상 최고치',
        'eMMC 및 UFS 임베디드 스토리지 컨트롤러 IoT·자동차 시장 채택 확대',
        'SMI SM2508 eSSD 컨트롤러 데이터센터 고객 인증 획득, 양산 준비 완료',
        'MaxioBee M.2 SSD 레퍼런스 디자인 OEM 채택 증가, 소비자 SSD 생태계 강화',
      ],
      guidance: '25Q1 계절 조정 예상, 하반기 eSSD 컨트롤러 성장 본격화',
      tone: '중립',
    },
    {
      quarter: '25Q1',
      date: '2025-05-21',
      highlights: [
        '데이터센터 eSSD 컨트롤러 SM2508 출하 개시, 초기 고객 반응 긍정적',
        'PCIe Gen5 기술 검증 완료, 주요 NAND 제조사 파트너 라인업 확보',
        'UFS 4.0 모바일 스토리지 컨트롤러 신흥국 스마트폰 고객 확대',
        'AI 엣지 디바이스용 경량 NVMe 컨트롤러 신제품 개발 로드맵 공개',
      ],
      guidance: '25Q2 eSSD 컨트롤러 성장 가속, 연간 이익률 개선 기대',
      tone: '낙관',
    },
    {
      quarter: '25Q2',
      date: '2025-08-21',
      highlights: [
        'eSSD 컨트롤러 분기 매출 비중 30% 돌파, 고부가 제품 믹스 개선',
        'NAND 신규 고객사 온보딩 완료, 삼성·SK하이닉스·마이크론 모두 지원',
        '자동차 스토리지 컨트롤러 티어1 고객 설계 수주, 미래 성장 기반 마련',
        'eSSD 컨트롤러 시장 경쟁 심화 속 기술 차별화 전략 유지',
      ],
      guidance: '25Q3 매출 성장 지속, 영업이익률 20% 이상 유지 목표',
      tone: '낙관',
    },
  ],
};
