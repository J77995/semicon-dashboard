import { NewsArticle } from '@/types/news';

export const newsArticles: NewsArticle[] = [
  {
    id: 'news-001',
    title: 'NVIDIA Blackwell GPU 공급 확대로 데이터센터 eSSD 수요 급증',
    summary:
      'NVIDIA의 차세대 Blackwell GPU 출하 확대로 AI 데이터센터의 고성능 엔터프라이즈 SSD 수요가 전분기 대비 35% 급증했다. 특히 PCIe Gen5 NVMe eSSD에 대한 하이퍼스케일러의 장기 구매 계약이 잇따르며, SSD 컨트롤러 업체들의 수혜가 예상된다.',
    source: '전자신문',
    publishedAt: '2026-03-24T09:30:00+09:00',
    url: '#',
    keywords: ['NVIDIA', 'AI', 'eSSD', '데이터센터'],
  },
  {
    id: 'news-002',
    title: 'SK하이닉스 HBM4 양산 본격화…NVIDIA GB300 탑재 확정',
    summary:
      'SK하이닉스가 4세대 고대역폭메모리(HBM4) 12단 적층 제품의 양산을 본격 개시하고 NVIDIA의 차세대 GB300 GPU에 탑재가 확정됐다. 회사 측은 2026년 HBM4 매출 비중이 전체 DRAM 매출의 40%를 초과할 것으로 전망했다.',
    source: '한국경제',
    publishedAt: '2026-03-23T10:15:00+09:00',
    url: '#',
    keywords: ['SK Hynix', 'HBM', 'NVIDIA', 'DRAM'],
  },
  {
    id: 'news-003',
    title: '삼성전자, 3나노 GAA 수율 개선…파운드리 반등 기대감',
    summary:
      '삼성전자가 3나노 게이트올어라운드(GAA) 공정의 수율을 60% 이상으로 끌어올리며 파운드리 사업 반등의 기반을 마련했다. 주요 팹리스 고객사의 설계 수주가 재개되면서 시스템반도체 부문 실적 회복이 기대된다.',
    source: '조선비즈',
    publishedAt: '2026-03-22T08:45:00+09:00',
    url: '#',
    keywords: ['Samsung', 'AI', '데이터센터'],
  },
  {
    id: 'news-004',
    title: '마이크론, 1γ DRAM 양산 개시…메모리 기술 격차 축소 나서',
    summary:
      '마이크론이 업계 최소 선폭의 1감마(γ) DRAM을 양산하기 시작했다. EUV 노광 공정을 적극 적용해 셀 면적을 15% 줄이고 전력효율을 20% 개선했다. 이를 통해 삼성·SK하이닉스와의 기술 격차를 빠르게 좁힐 것으로 예상된다.',
    source: '디지털타임스',
    publishedAt: '2026-03-22T14:20:00+09:00',
    url: '#',
    keywords: ['Micron', 'DRAM', 'AI'],
  },
  {
    id: 'news-005',
    title: 'NAND 플래시 가격, AI 수요에 힘입어 2분기 연속 상승',
    summary:
      '글로벌 NAND 플래시 가격이 AI 서버용 고용량 eSSD 수요 확대에 힘입어 2분기 연속 상승세를 나타냈다. TrendForce에 따르면 3월 TLC 128Gb 가격은 전월 대비 2.5% 상승해 $0.042/Gb를 기록했다.',
    source: '반도체산업신문',
    publishedAt: '2026-03-21T11:00:00+09:00',
    url: '#',
    keywords: ['NAND', 'eSSD', 'AI', '데이터센터'],
  },
  {
    id: 'news-006',
    title: '국내 eSSD 컨트롤러 업체, 25Q4 실적 발표…엔터프라이즈 매출 성장',
    summary:
      '국내 eSSD 컨트롤러 업체들이 2025년 4분기 실적을 발표했다. 엔터프라이즈 SSD 컨트롤러 신제품 출시 비용 증가로 수익성 압박이 있었으나, 2026년 신규 고객사 수주와 함께 연간 흑자 전환 가능성에 시장의 관심이 쏠리고 있다.',
    source: '전자신문',
    publishedAt: '2026-03-20T09:00:00+09:00',
    url: '#',
    keywords: ['eSSD', 'NVMe', '컨트롤러'],
  },
  {
    id: 'news-007',
    title: 'AI 데이터센터 스토리지 용량, 2026년 50EB 돌파 전망',
    summary:
      '시장조사기관 IDC는 2026년 글로벌 AI 데이터센터에 설치된 총 스토리지 용량이 50엑사바이트(EB)를 돌파할 것으로 전망했다. AI 학습 및 추론 워크로드의 급증이 주요 동인이며, NVMe eSSD가 전체 신규 설치의 70% 이상을 차지할 것으로 예측됐다.',
    source: '디지털데일리',
    publishedAt: '2026-03-20T13:30:00+09:00',
    url: '#',
    keywords: ['AI', '데이터센터', 'eSSD', 'NVMe'],
  },
  {
    id: 'news-008',
    title: '브로드컴, 커스텀 AI ASIC 연간 매출 400억 달러 목표 재확인',
    summary:
      '브로드컴이 하이퍼스케일러 향 커스텀 AI 가속기(XPU) 연간 매출 목표 400억 달러를 재확인했다. 구글 TPU v6, 메타 MTIA 2세대를 포함한 3개 이상의 고객사 XPU를 동시 개발 중이며, 2nm 공정 전환도 순조롭게 진행 중이다.',
    source: '매일경제',
    publishedAt: '2026-03-19T09:45:00+09:00',
    url: '#',
    keywords: ['NVIDIA', 'AI', '데이터센터', 'GPU'],
  },
  {
    id: 'news-009',
    title: 'DRAM DDR5 전환 가속화…서버·PC 모두 50% 넘어서',
    summary:
      '글로벌 서버 DRAM 시장에서 DDR5 비중이 처음으로 50%를 초과했다. PC DRAM도 DDR5 전환이 빠르게 진행되면서 DDR4 수요는 구형 레거시 시스템에 한정되는 추세다. DDR5 공급 비중 확대로 메모리 제조사의 ASP도 상승 압력을 받고 있다.',
    source: '아이뉴스24',
    publishedAt: '2026-03-19T16:00:00+09:00',
    url: '#',
    keywords: ['DRAM', 'Samsung', 'SK Hynix', 'Micron'],
  },
  {
    id: 'news-010',
    title: '마벨, PCIe Gen6 광통신 DSP 신제품 공개…AI 클러스터 대역폭 혁신',
    summary:
      '마벨 테크놀로지가 PCIe Gen6 및 800G 광통신 PAM4 DSP 신제품 라인업을 공개했다. AI 클러스터 내 GPU-스토리지 간 데이터 전송 대역폭을 기존 대비 2배 이상 확대해 AI 학습 속도를 크게 개선할 수 있을 것으로 기대된다.',
    source: '전자신문',
    publishedAt: '2026-03-18T10:30:00+09:00',
    url: '#',
    keywords: ['AI', '데이터센터', 'NVMe', 'eSSD'],
  },
  {
    id: 'news-011',
    title: '엔터프라이즈 SSD 시장, 25Q4 분기 110억 달러 돌파…전년비 29% 성장',
    summary:
      '2025년 4분기 글로벌 엔터프라이즈 SSD 시장 규모가 110억 달러를 돌파하며 전년 동기 대비 29% 성장했다. AI 데이터센터 건설 붐이 핵심 성장 동인으로 작용했으며, EDSFF 폼팩터(E1.S/E3.S) 제품의 비중이 처음으로 M.2를 추월했다.',
    source: '반도체산업신문',
    publishedAt: '2026-03-18T14:00:00+09:00',
    url: '#',
    keywords: ['eSSD', 'AI', '데이터센터', 'NVMe'],
  },
  {
    id: 'news-012',
    title: '키옥시아, BiCS9 NAND 양산 일정 확정…321단 이상 고적층 경쟁 심화',
    summary:
      '키옥시아가 EUV 공정을 적용한 BiCS9(321단 이상) 3D NAND의 2026년 하반기 양산 일정을 공식 확정했다. 이로써 삼성·SK하이닉스·마이크론에 이어 업계 전반의 고적층 NAND 경쟁이 더욱 치열해질 전망이다.',
    source: '아시아경제',
    publishedAt: '2026-03-17T09:00:00+09:00',
    url: '#',
    keywords: ['NAND', 'eSSD'],
  },
  {
    id: 'news-013',
    title: "AWS, AI 워크로드 전용 스토리지 인스턴스 'I8g' 출시",
    summary:
      '아마존웹서비스(AWS)가 AI 추론 및 데이터 분석 전용 로컬 NVMe 스토리지 인스턴스 I8g를 출시했다. 3세대 AMD EPYC CPU와 PCIe Gen5 NVMe SSD를 결합해 기존 I4i 대비 스토리지 대역폭을 3배 향상시켰다.',
    source: '클라우드타임스',
    publishedAt: '2026-03-17T11:30:00+09:00',
    url: '#',
    keywords: ['AI', '데이터센터', 'eSSD', 'NVMe'],
  },
  {
    id: 'news-014',
    title: 'TSMC 2nm CoWoS 패키징 증산…HBM·AI 칩 공급 병목 해소 기대',
    summary:
      'TSMC가 2nm 공정 및 CoWoS 고급 패키징 생산능력을 연말까지 2배로 확대하겠다고 발표했다. 이는 HBM과 GPU를 함께 탑재하는 AI 칩 패키징 병목 현상을 해소하기 위한 조치로, NVIDIA·AMD·브로드컴 등 주요 고객사의 수요에 대응하기 위한 것이다.',
    source: '연합인포맥스',
    publishedAt: '2026-03-16T08:00:00+09:00',
    url: '#',
    keywords: ['NVIDIA', 'AI', 'HBM', '데이터센터'],
  },
  {
    id: 'news-015',
    title: '파이슨 E26 컨트롤러, PCIe Gen5 시장 점유율 55% 돌파',
    summary:
      '파이슨 일렉트로닉스의 PCIe Gen5 eSSD 컨트롤러 E26가 글로벌 시장 점유율 55%를 돌파했다. 삼성·SK하이닉스·마이크론 NAND를 모두 지원하는 설계 유연성과 선행 출시 효과가 점유율 확대의 핵심 요인으로 분석된다.',
    source: '디지털타임스',
    publishedAt: '2026-03-15T10:00:00+09:00',
    url: '#',
    keywords: ['eSSD', 'NVMe', 'NAND'],
  },
  {
    id: 'news-016',
    title: '마이크로소프트, 데이터센터 투자 800억 달러 돌파…AI 스토리지 수요 견인',
    summary:
      '마이크로소프트가 2025 회계연도 데이터센터 자본지출(CapEx) 총액이 800억 달러를 초과했다고 공개했다. Azure AI 서비스 확대와 OpenAI 협력 심화에 따른 스토리지 및 컴퓨팅 인프라 수요 급증이 배경이다.',
    source: '매일경제',
    publishedAt: '2026-03-14T09:00:00+09:00',
    url: '#',
    keywords: ['AI', '데이터센터', 'eSSD'],
  },
  {
    id: 'news-017',
    title: 'CXL 메모리 모듈 상용화 가속…삼성·SK하이닉스·마이크론 출하 경쟁',
    summary:
      'CXL(Compute Express Link) 기반 메모리 확장 모듈의 상용화가 빠르게 진행되고 있다. 삼성전자, SK하이닉스, 마이크론이 각각 CXL 2.0 메모리 모듈 양산 출하를 시작하며 서버 메모리 아키텍처의 패러다임 변화가 본격화되고 있다.',
    source: '전자신문',
    publishedAt: '2026-03-13T11:00:00+09:00',
    url: '#',
    keywords: ['DRAM', 'Samsung', 'SK Hynix', 'Micron', 'AI'],
  },
  {
    id: 'news-018',
    title: '구글, TPU v6 기반 AI 클러스터 확장…eSSD 파트너십 강화',
    summary:
      '구글이 자체 개발 TPU v6 AI 가속기를 탑재한 대규모 AI 클러스터를 글로벌 데이터센터에 확장 배치하고 있다. 이에 따라 고성능 NVMe eSSD 파트너십도 강화되고 있으며, 국내 SSD 컨트롤러 업체들에 대한 기회도 주목받고 있다.',
    source: '디지털데일리',
    publishedAt: '2026-03-12T14:00:00+09:00',
    url: '#',
    keywords: ['AI', '데이터센터', 'eSSD'],
  },
  {
    id: 'news-019',
    title: 'NAND 공급 과잉 우려 재부상…하반기 가격 조정 가능성',
    summary:
      '일부 시장 분석가들이 2026년 하반기 NAND 공급 과잉 재현 가능성을 경고하고 나섰다. 주요 NAND 제조사들의 설비투자 재개와 218단·321단 고적층 전환에 따른 생산성 향상이 공급 증가를 야기할 수 있다는 분석이다.',
    source: '한국경제',
    publishedAt: '2026-03-11T10:30:00+09:00',
    url: '#',
    keywords: ['NAND', 'eSSD', 'Samsung', 'SK Hynix', 'Micron'],
  },
  {
    id: 'news-020',
    title: '오라클, OCI AI 인프라 수주 잔고 200억 달러 돌파',
    summary:
      '오라클이 OCI(Oracle Cloud Infrastructure) AI 관련 수주 잔고(백로그)가 200억 달러를 돌파했다고 밝혔다. AI 스타트업과 기업 고객들이 NVIDIA GPU 클러스터 대여 수요를 확대하면서 OCI 데이터센터 스토리지 수요도 동반 증가하고 있다.',
    source: '클라우드타임스',
    publishedAt: '2026-03-10T09:00:00+09:00',
    url: '#',
    keywords: ['AI', '데이터센터', 'NVIDIA', 'eSSD'],
  },
  {
    id: 'news-021',
    title: '실리콘모션, eSSD 컨트롤러 SM2508 글로벌 OEM 채택 확대',
    summary:
      '실리콘모션의 PCIe Gen5 eSSD 컨트롤러 SM2508이 주요 글로벌 SSD OEM 3곳에 공식 채택되며 엔터프라이즈 SSD 컨트롤러 시장 점유율 확대에 나서고 있다. 파이슨 등 경쟁사와의 기술 차별화 전략이 주목된다.',
    source: '반도체산업신문',
    publishedAt: '2026-03-09T11:00:00+09:00',
    url: '#',
    keywords: ['eSSD', 'NVMe', 'NAND'],
  },
  {
    id: 'news-022',
    title: 'AI PC 보급 확산으로 LPDDR5X·UFS 4.0 모바일 메모리 수요 급증',
    summary:
      'AI PC 보급 확산에 힘입어 LPDDR5X 모바일 DRAM과 UFS 4.0 스토리지 수요가 급증하고 있다. 온디바이스 AI 모델 로딩 및 처리 속도 향상을 위한 고성능 모바일 메모리의 탑재 비중이 플래그십뿐 아니라 중급 제품으로까지 확산되는 추세다.',
    source: '아이뉴스24',
    publishedAt: '2026-03-08T10:00:00+09:00',
    url: '#',
    keywords: ['DRAM', 'NAND', 'AI', 'Samsung', 'SK Hynix'],
  },
  {
    id: 'news-023',
    title: '샌디스크, WD 분사 후 첫 독립 IR 개최…eSSD 전략 집중 선언',
    summary:
      '샌디스크가 웨스턴디지털에서 분사 이후 첫 독립 기업 IR 행사를 개최하고 엔터프라이즈 SSD 중심 성장 전략을 발표했다. CEO는 데이터센터용 QLC NAND 기반 고용량 eSSD 시장을 핵심 성장 동력으로 제시하며 2026년 시장 점유율 25% 목표를 밝혔다.',
    source: '조선비즈',
    publishedAt: '2026-03-07T14:30:00+09:00',
    url: '#',
    keywords: ['NAND', 'eSSD', 'NVMe', '데이터센터'],
  },
  {
    id: 'news-024',
    title: 'HBM3E 12단 공급 경쟁 가열…삼성 vs SK하이닉스 점유율 각축',
    summary:
      'HBM3E 12단 제품의 NVIDIA 공급망 내 삼성전자와 SK하이닉스 간 점유율 경쟁이 치열해지고 있다. SK하이닉스가 기존 공급 우위를 유지하고 있는 가운데, 삼성전자도 수율 개선을 통해 추격을 가속하며 HBM4 시대를 앞두고 경쟁이 더욱 심화될 전망이다.',
    source: '한국경제',
    publishedAt: '2026-03-06T09:00:00+09:00',
    url: '#',
    keywords: ['HBM', 'Samsung', 'SK Hynix', 'NVIDIA', 'DRAM'],
  },
  {
    id: 'news-025',
    title: '국내 SSD 컨트롤러 업체, PCIe Gen6 개발 착수…차세대 AI 스토리지 선점 목표',
    summary:
      '국내 eSSD 컨트롤러 업체들이 차세대 PCIe Gen6 기반 엔터프라이즈 SSD 컨트롤러 개발에 착수했다. 현재 Gen5 컨트롤러 양산 성과를 기반으로 2027년 Gen6 제품 출시를 목표로 하고 있으며, 주요 하이퍼스케일러 고객사와의 기술 협력도 병행 추진 중이다.',
    source: '전자신문',
    publishedAt: '2026-03-05T11:00:00+09:00',
    url: '#',
    keywords: ['eSSD', 'NVMe', 'AI', '데이터센터'],
  },
];
