import { CompanyData } from '@/types/company';

export const amazon: CompanyData = {
  slug: 'amazon',
  nameKR: '아마존',
  nameEN: 'Amazon',
  group: 'CSP',
  currency: 'USD',
  fiscalYearEnd: '12월',
  metrics: [
    { quarter: '23Q4', revenue: 169961, revenueGrowthYoY: 14, revenueGrowthQoQ: 13, grossMargin: 46.9, operatingIncome: 13209, operatingMargin:  7.8, netIncome: 10624, netMargin:  6.3 },
    { quarter: '24Q1', revenue: 143313, revenueGrowthYoY: 13, revenueGrowthQoQ:-16, grossMargin: 48.0, operatingIncome: 15307, operatingMargin: 10.7, netIncome: 10431, netMargin:  7.3 },
    { quarter: '24Q2', revenue: 148022, revenueGrowthYoY: 10, revenueGrowthQoQ:  3, grossMargin: 49.0, operatingIncome: 14670, operatingMargin:  9.9, netIncome: 13485, netMargin:  9.1 },
    { quarter: '24Q3', revenue: 158877, revenueGrowthYoY: 11, revenueGrowthQoQ:  7, grossMargin: 49.2, operatingIncome: 17411, operatingMargin: 11.0, netIncome: 15328, netMargin:  9.6 },
    { quarter: '24Q4', revenue: 187791, revenueGrowthYoY: 10, revenueGrowthQoQ: 18, grossMargin: 49.4, operatingIncome: 21215, operatingMargin: 11.3, netIncome: 18248, netMargin:  9.7 },
    { quarter: '25Q1', revenue: 155667, revenueGrowthYoY:  9, revenueGrowthQoQ:-17, grossMargin: 50.1, operatingIncome: 18368, operatingMargin: 11.8, netIncome: 15874, netMargin: 10.2 },
    { quarter: '25Q2', revenue: 160000, revenueGrowthYoY:  8, revenueGrowthQoQ:  3, grossMargin: 50.5, operatingIncome: 19200, operatingMargin: 12.0, netIncome: 16200, netMargin: 10.1 },
    { quarter: '25Q3', revenue: 172000, revenueGrowthYoY:  8, revenueGrowthQoQ:  8, grossMargin: 51.0, operatingIncome: 21300, operatingMargin: 12.4, netIncome: 17800, netMargin: 10.3 },
  ],
  earningsCalls: [
    {
      quarter: '24Q4',
      date: '2025-02-06',
      highlights: [
        'AWS 매출 전년 동기 대비 19% 성장, 분기 매출 285억 달러로 사상 최고치',
        'AI 서비스 수요 급증으로 AWS 백로그 지속 확대, 데이터센터 공급 부족 현상',
        '광고 부문 매출 전년 동기 대비 18% 성장, 프라임 비디오 광고 기여 본격화',
        'Trainium2 AI 가속기 출시로 자체 AI 칩 생태계 확장',
      ],
      guidance: '25Q1 매출 1,510~1,550억 달러, AWS 성장률 가속 기대',
      tone: '낙관',
    },
    {
      quarter: '25Q1',
      date: '2025-05-01',
      highlights: [
        'AWS 매출 291억 달러, 전년 동기 대비 17% 성장, 생성형 AI 기여 가시화',
        'Amazon Bedrock AI 플랫폼 기업 고객 급증, 멀티모달 AI 서비스 확대',
        '물류 네트워크 효율화로 북미 리테일 마진 개선 지속',
        'Kuiper 위성 인터넷 서비스 시험 발사 성공, 차세대 통신 인프라 투자 진행',
      ],
      guidance: '25Q2 AWS 성장 모멘텀 유지, 마진 개선 기조 지속',
      tone: '낙관',
    },
    {
      quarter: '25Q2',
      date: '2025-08-07',
      highlights: [
        'AWS 연간 매출 런레이트 1,200억 달러 돌파, AI 워크로드 채택 가속화',
        '엔터프라이즈 스토리지 수요 증가로 AWS S3·EBS 스토리지 매출 견조 성장',
        'Prime Day 2025 역대 최대 매출 기록, 구독 및 광고 크로스셀 효과 극대화',
        '로봇·자동화 물류센터 확장으로 운영 효율성 개선, 단위 비용 절감',
      ],
      guidance: '25Q3 AWS 성장 지속, 전사 영업이익률 12% 이상 유지 목표',
      tone: '낙관',
    },
  ],
};
