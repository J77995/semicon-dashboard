import { CompanyData } from '@/types/company';

// Phison Electronics - Taiwan NAND flash controller IC company (TWD billions → USD millions, ~32 TWD/USD)
export const phison: CompanyData = {
  slug: 'phison',
  nameKR: '파이슨',
  nameEN: 'Phison Electronics',
  group: 'SSD컨트롤러',
  currency: 'USD',
  fiscalYearEnd: '12월',
  metrics: [
    { quarter: '23Q4', revenue:  345, revenueGrowthYoY:  -8, revenueGrowthQoQ:   5, grossMargin: 31.2, operatingIncome:  65, operatingMargin: 18.8, netIncome:  71, netMargin: 20.6 },
    { quarter: '24Q1', revenue:  318, revenueGrowthYoY:  -8, revenueGrowthQoQ:  -8, grossMargin: 30.5, operatingIncome:  56, operatingMargin: 17.6, netIncome:  62, netMargin: 19.5 },
    { quarter: '24Q2', revenue:  380, revenueGrowthYoY:  10, revenueGrowthQoQ:  20, grossMargin: 32.8, operatingIncome:  75, operatingMargin: 19.7, netIncome:  82, netMargin: 21.6 },
    { quarter: '24Q3', revenue:  425, revenueGrowthYoY:  23, revenueGrowthQoQ:  12, grossMargin: 33.5, operatingIncome:  86, operatingMargin: 20.2, netIncome:  93, netMargin: 21.9 },
    { quarter: '24Q4', revenue:  462, revenueGrowthYoY:  34, revenueGrowthQoQ:   9, grossMargin: 34.1, operatingIncome:  98, operatingMargin: 21.2, netIncome: 106, netMargin: 22.9 },
    { quarter: '25Q1', revenue:  438, revenueGrowthYoY:  38, revenueGrowthQoQ:  -5, grossMargin: 33.8, operatingIncome:  91, operatingMargin: 20.8, netIncome:  99, netMargin: 22.6 },
    { quarter: '25Q2', revenue:  490, revenueGrowthYoY:  29, revenueGrowthQoQ:  12, grossMargin: 34.5, operatingIncome: 105, operatingMargin: 21.4, netIncome: 113, netMargin: 23.1 },
    { quarter: '25Q3', revenue:  520, revenueGrowthYoY:  22, revenueGrowthQoQ:   6, grossMargin: 35.0, operatingIncome: 114, operatingMargin: 21.9, netIncome: 122, netMargin: 23.5 },
  ],
  earningsCalls: [
    {
      quarter: '24Q4',
      date: '2025-03-14',
      highlights: [
        'PCIe Gen5 NVMe 컨트롤러 E26 기업 고객 채택 확대로 eSSD 매출 성장 견인',
        '데이터센터 AI 스토리지 수요 증가로 엔터프라이즈 SSD 컨트롤러 ASP 상승',
        'NAND 파트너사 삼성·마이크론 제품 지원 확대, 설계 유연성 강화',
        'AI eSSD(EDSFF E1.S/E3.S) 폼팩터 컨트롤러 신제품 출시 준비 완료',
      ],
      guidance: '25Q1 계절 조정 예상, 하반기 PCIe Gen5 출하 가속 전망',
      tone: '중립',
    },
    {
      quarter: '25Q1',
      date: '2025-05-16',
      highlights: [
        'PS5026 차세대 Gen5 컨트롤러 NAND 파트너 인증 완료, 양산 임박',
        '데이터센터 AI 서버 스토리지 솔루션 수요 증가로 컨트롤러 장기 수주 확보',
        'CXL 메모리 확장 컨트롤러 연구개발 진행, 차세대 메모리 인터페이스 선점 목표',
        '소비자 SSD 수요 회복, PC 교체 사이클 수혜 기대',
      ],
      guidance: '25Q2 매출 성장 재개, eSSD 컨트롤러 비중 확대 지속',
      tone: '낙관',
    },
    {
      quarter: '25Q2',
      date: '2025-08-15',
      highlights: [
        '엔터프라이즈 SSD 컨트롤러 분기 매출 사상 최고치, AI 데이터센터 수요 수혜',
        'PCIe Gen5 E26 시장 점유율 50% 상회, 경쟁사 대비 출시 선행 효과',
        '국내외 eSSD 컨트롤러 경쟁사 대비 고성능·고용량 제품군 차별화 전략 유지',
        '2026년 PCIe Gen6 컨트롤러 개발 계획 공개, 기술 로드맵 선제 제시',
      ],
      guidance: '25Q3 데이터센터 수요 견조, 연간 매출 사상 최고치 달성 목표',
      tone: '낙관',
    },
  ],
};
