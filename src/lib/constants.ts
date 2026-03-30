export const CHART_COLORS = {
  red: '#DC2626',
  lightRed: '#EF4444',
  green: '#22C55E',
  orange: '#F97316',
  gray: '#9CA3AF',
  yellow: '#F59E0B',
  purple: '#8B5CF6',
  blue: '#3B82F6',
  teal: '#14B8A6',
  pink: '#EC4899',
};

export const TOOLTIP_STYLE = {
  backgroundColor: '#FFFFFF',
  border: '1px solid rgba(0,0,0,0.12)',
  borderRadius: '8px',
  color: '#111827',
};

export const GRID_STYLE = {
  strokeDasharray: '3 3',
  stroke: 'rgba(0,0,0,0.08)',
};

export const COMPANY_GROUPS = {
  CSP: ['google', 'microsoft', 'amazon', 'oracle'],
  'AI반도체': ['nvidia', 'broadcom', 'marvell'],
  '메모리': ['samsung', 'sk-hynix', 'micron', 'sandisk', 'kioxia'],
  'SSD컨트롤러': ['phison', 'silicon-motion'],
} as const;

export const COMPANY_GROUP_LABELS: Record<string, string> = {
  CSP: '☁️ 클라우드 서비스',
  'AI반도체': '🔴 AI 반도체',
  '메모리': '💾 메모리',
  'SSD컨트롤러': '⚡ SSD 컨트롤러',
};

export const NAV_ITEMS = [
  { href: '/', label: '홈', icon: 'LayoutDashboard' },
  { href: '/company', label: '재무 현황', icon: 'Building2' },
  { href: '/industry', label: '산업 동향', icon: 'TrendingUp' },
  { href: '/valuechain', label: '밸류체인 동향', icon: 'Network' },
  { href: '/news', label: '산업 뉴스', icon: 'Newspaper' },
];

export const QUARTER_ORDER = [
  '23Q3', '23Q4', '24Q1', '24Q2', '24Q3', '24Q4',
  '25Q1', '25Q2', '25Q3', '25Q4'
] as const;

export const NEWS_KEYWORDS = [
  'DRAM', 'NAND', 'HBM', 'SSD', 'GPU', 'AI',
  'NVIDIA', 'Samsung Electronics', 'SK Hynix', 'Micron', 'TSMC',
  'Datacenter', 'NVMe', 'Fadu', 'Storage',
] as const;

export const NEWS_KEYWORDS_EXTENDED = [
  'DRAM', 'NAND', 'HBM', 'SSD', 'GPU', 'AI',
  'NVIDIA', 'Samsung Electronics', 'SK Hynix', 'Micron', 'TSMC',
  'Datacenter', 'NVMe', 'Fadu', 'Storage',
  'Intel', 'AMD', 'PCIe', '반도체', 'Kioxia', 'WDC',
] as const;
