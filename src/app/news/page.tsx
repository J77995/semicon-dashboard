import { NewsPageClient } from './NewsPageClient';
import { GET } from '@/app/api/news/route';
import type { NewsApiResponse } from '@/types/news';

export const revalidate = 1800;

export default async function NewsPage() {
  let data: NewsApiResponse;
  try {
    const res = await GET();
    data = await res.json();
  } catch {
    data = { articles: [], fetchedAt: null, sourceStatuses: [] };
  }
  return <NewsPageClient initialData={data} />;
}
