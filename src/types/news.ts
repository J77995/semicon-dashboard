export type NewsKeyword =
  | 'DRAM' | 'NAND' | 'HBM' | 'SSD' | 'GPU' | 'AI'
  | 'NVIDIA' | 'Samsung Electronics' | 'SK Hynix' | 'Micron' | 'TSMC'
  | 'Datacenter' | 'NVMe' | 'Fadu' | 'Storage';

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  url: string;
  keywords: string[];   // string[] (not NewsKeyword[]) to support auto-tagged + custom keywords
}

export interface NewsApiResponse {
  articles: NewsArticle[];
  fetchedAt: string | null;
  sourceStatuses: { name: string; ok: boolean }[];
}
