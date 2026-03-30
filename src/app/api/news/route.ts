import { NextResponse } from 'next/server';
import type { NewsArticle, NewsApiResponse } from '@/types/news';

export const revalidate = 1800; // 30 minutes

// ── RSS Source definitions ──────────────────────────────────────────────────

const RSS_SOURCES = [
  // ── Semiconductor / Storage / Hardware ───────────────────────────────────
  { name: 'EE Times',            url: 'https://www.eetimes.com/feed/',                                             lang: 'en' },
  { name: 'Semiconductor Eng.',  url: 'https://semiengineering.com/feed/',                                         lang: 'en' },
  { name: 'AnySilicon',          url: 'https://anysilicon.com/feed/',                                              lang: 'en' },
  { name: 'Tom\'s Hardware',     url: 'https://www.tomshardware.com/feeds.xml',                                   lang: 'en' },
  { name: 'StorageReview',       url: 'https://www.storagereview.com/feed',                                        lang: 'en' },
  { name: 'The Next Platform',   url: 'https://www.nextplatform.com/feed/',                                        lang: 'en' },
  { name: 'Wccftech',            url: 'https://wccftech.com/feed/',                                                lang: 'en' },
  { name: 'ServeTheHome',        url: 'https://www.servethehome.com/feed/',                                        lang: 'en' },
  { name: 'IEEE Spectrum',       url: 'https://spectrum.ieee.org/feeds/feed.rss',                                  lang: 'en' },
  // ── AI / Technology ──────────────────────────────────────────────────────
  { name: 'TechCrunch AI',       url: 'https://techcrunch.com/category/artificial-intelligence/feed/',            lang: 'en' },
  { name: 'Ars Technica',        url: 'https://feeds.arstechnica.com/arstechnica/technology-lab',                 lang: 'en' },
  { name: 'Wired',               url: 'https://www.wired.com/feed/rss',                                           lang: 'en' },
  { name: 'The Verge',           url: 'https://www.theverge.com/rss/index.xml',                                   lang: 'en' },
  { name: 'TechRepublic',        url: 'https://www.techrepublic.com/rssfeeds/articles/',                          lang: 'en' },
  // ── Business / Finance ───────────────────────────────────────────────────
  { name: 'CNBC Technology',     url: 'https://www.cnbc.com/id/10000664/device/rss/rss.html',                     lang: 'en' },
  { name: 'WSJ Business',        url: 'https://feeds.a.dj.com/rss/WSJcomUSBusiness.xml',                         lang: 'en' },
  { name: 'MarketWatch',         url: 'https://feeds.content.dowjones.io/public/rss/mw_topstories',              lang: 'en' },
] as const;

// ── Keyword auto-tag map ────────────────────────────────────────────────────
// Maps search patterns → canonical keyword label

const KEYWORD_PATTERNS: { pattern: RegExp; keyword: string }[] = [
  { pattern: /\bDRAM\b|D램|디램/i,                                             keyword: 'DRAM' },
  { pattern: /\bNAND\b|낸드(?:플래시)?/i,                                      keyword: 'NAND' },
  { pattern: /\bHBM\b/i,                                                       keyword: 'HBM' },
  { pattern: /\beSSD\b|enterprise\s+SSD|엔터프라이즈\s*SSD|기업용\s*SSD/i,    keyword: 'SSD' },
  { pattern: /\bGPU\b|그래픽처리장치/i,                                        keyword: 'GPU' },
  { pattern: /\bAI\b|artificial\s+intelligence|인공지능/i,                     keyword: 'AI' },
  { pattern: /\bNVIDIA\b|엔비디아/i,                                           keyword: 'NVIDIA' },
  { pattern: /\bSamsung\b|삼성전자|삼성(?=\s|$)/,                             keyword: 'Samsung Electronics' },
  { pattern: /SK\s*[Hh]ynix|SK하이닉스/,                                      keyword: 'SK Hynix' },
  { pattern: /\bMicron\b|마이크론/i,                                           keyword: 'Micron' },
  { pattern: /\bTSMC\b|파운드리/i,                                             keyword: 'TSMC' },
  { pattern: /data\s*cent(?:er|re)|데이터\s*센터|datacenter/i,                keyword: 'Datacenter' },
  { pattern: /\bNVMe\b/i,                                                      keyword: 'NVMe' },
  { pattern: /\bFADU\b|\bFadu\b/i,                                              keyword: 'Fadu' },
  { pattern: /\bIntel\b|인텔/i,                                                keyword: 'Intel' },
  { pattern: /\bAMD\b/i,                                                       keyword: 'AMD' },
  { pattern: /\bPCIe\b|Gen\s*5/i,                                              keyword: 'PCIe' },
  { pattern: /semiconductor|반도체/i,                                          keyword: '반도체' },
  { pattern: /\bKioxia\b|키옥시아/i,                                           keyword: 'Kioxia' },
  { pattern: /SanDisk|Western\s+Digital|\bWDC?\b|웨스턴디지털/i,              keyword: 'WDC' },
  { pattern: /\bDDR[3456]\b|LPDDR\d?|D램\s*\d|메모리\s*반도체/i,             keyword: 'DRAM' },
  { pattern: /machine\s+learning|머신러닝|딥러닝|deep\s+learning/i,           keyword: 'AI' },
  { pattern: /\bQLC\b|\bTLC\b|\bMLC\b|\bSLC\b/i,                             keyword: 'NAND' },
  { pattern: /\bSSD\b|solid[- ]state\s+drive/i,                               keyword: 'SSD' },
  { pattern: /\bstorage\s*(?:market|industry|solution|device|system|array|vendor|controller|segment|technology|media)|enterprise\s*storage|cloud\s*storage|object\s*storage|block\s*storage|스토리지|저장\s*장치/i, keyword: 'Storage' },
  // ── Business/Finance context patterns ─────────────────────────────────────
  { pattern: /\bchip(?:s|maker|set|let)?\b/i,                                  keyword: '반도체' },
  { pattern: /\bmemory\s*(?:chip|market|price|supplier|maker|demand|glut)\b/i, keyword: 'DRAM' },
  { pattern: /\bflash\s*(?:memory|storage|chip|market)\b/i,                    keyword: 'NAND' },
  { pattern: /hyperscal(?:er|ing)|cloud\s*capex|data\s*center\s*spend/i,       keyword: 'Datacenter' },
  { pattern: /\bfoundry\b|\bwafer\b|\bfab\b|\bfabrication\b/i,                 keyword: 'TSMC' },
  { pattern: /\bAI\s*(?:server|accelerat|chip|hardware|infrastructure)\b/i,    keyword: 'AI' },
  { pattern: /\bQualcomm\b|\bBroadcom\b|\bMarvell\b|\bArm\b/i,                keyword: '반도체' },
];

function autoTag(text: string): string[] {
  const found = new Set<string>();
  for (const { pattern, keyword } of KEYWORD_PATTERNS) {
    if (pattern.test(text)) found.add(keyword);
  }
  return [...found];
}

// ── XML Helpers ─────────────────────────────────────────────────────────────

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractTag(xml: string, tag: string): string {
  // Try CDATA first
  const cdataMatch = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, 'i'));
  if (cdataMatch) return cdataMatch[1].trim();
  // Plain tag
  const plainMatch = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  if (plainMatch) return stripHtml(plainMatch[1]).trim();
  return '';
}

function extractAttr(xml: string, tag: string, attr: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*\\s${attr}="([^"]*)"`, 'i'));
  return match ? match[1] : '';
}

interface RawItem {
  title: string;
  link: string;
  pubDate: string;
  summary: string;
  publisher?: string;
}

function parseItems(xml: string): RawItem[] {
  const items: RawItem[] = [];
  // Support both RSS <item> and Atom <entry>
  const itemBlocks = xml.match(/<item[\s\S]*?<\/item>|<entry[\s\S]*?<\/entry>/gi) ?? [];

  for (const block of itemBlocks) {
    const title   = extractTag(block, 'title');
    const summary = extractTag(block, 'description') || extractTag(block, 'summary') || extractTag(block, 'content');
    const pubDate = extractTag(block, 'pubDate') || extractTag(block, 'published') || extractTag(block, 'updated');
    const publisher = extractTag(block, 'source');

    // Link: <link href="..."> (Atom) or <link>url</link> (RSS)
    let link = extractAttr(block, 'link', 'href');
    if (!link) link = extractTag(block, 'link');
    if (!link) {
      const guidMatch = block.match(/<guid[^>]*isPermaLink="true"[^>]*>([^<]+)<\/guid>/i);
      if (guidMatch) link = guidMatch[1].trim();
    }

    if (!title || !link) continue;
    items.push({ title, link, pubDate, summary, publisher });
  }
  return items;
}

// ── Fetch one RSS feed ───────────────────────────────────────────────────────

async function fetchFeed(source: typeof RSS_SOURCES[number]): Promise<{ articles: NewsArticle[]; ok: boolean }> {
  try {
    const res = await fetch(source.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SemiValuechain/1.0)',
        'Accept': 'application/rss+xml, application/atom+xml, text/xml, */*',
      },
      signal: AbortSignal.timeout(8000),
      next: { revalidate: 1800 },
    });
    if (!res.ok) return { articles: [], ok: false };

    const xml = await res.text();
    const items = parseItems(xml);

    const articles: NewsArticle[] = items.map((item, idx) => {
      const combined = `${item.title} ${item.summary}`;
      const keywords = autoTag(combined);
      return {
        id:          `${source.name}-${idx}-${Date.now()}`,
        title:       item.title,
        summary:     item.summary ? item.summary.slice(0, 300) : '',
        source:      source.name,
        publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
        url:         item.link,
        keywords,
      };
    }).filter(a => a.keywords.length > 0);

    return { articles, ok: true };
  } catch {
    return { articles: [], ok: false };
  }
}

// ── Google News search (one query per default keyword) ────────────────────────

// Matches NEWS_KEYWORDS after label changes; kept in sync manually
const GOOGLE_SEARCH_TERMS = [
  'DRAM semiconductor', 'NAND flash', 'HBM memory', 'enterprise SSD', 'GPU semiconductor',
  'AI chip semiconductor', 'NVIDIA', 'Samsung Electronics semiconductor', 'SK Hynix',
  'Micron Technology', 'TSMC foundry', 'data center storage', 'NVMe SSD',
  'Fadu semiconductor', 'enterprise storage market',
];

async function fetchGoogleNews(): Promise<{ articles: NewsArticle[]; ok: boolean }> {
  const results = await Promise.allSettled(
    GOOGLE_SEARCH_TERMS.map(term =>
      fetch(
        `https://news.google.com/rss/search?q=${encodeURIComponent(term)}&hl=en&gl=US&ceid=US:en`,
        { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SemiValuechain/1.0)' },
          signal: AbortSignal.timeout(8000),
          next: { revalidate: 1800 } }
      ).then(r => r.ok ? r.text() : Promise.reject(new Error(`${r.status}`)))
    )
  );

  const allArticles: NewsArticle[] = [];
  let anyOk = false;

  results.forEach((result, i) => {
    if (result.status !== 'fulfilled') return;
    anyOk = true;
    const items = parseItems(result.value);
    items.forEach((item, idx) => {
      const combined = `${item.title} ${item.summary}`;
      const keywords = autoTag(combined);
      if (keywords.length === 0) return;
      allArticles.push({
        id:          `google-${i}-${idx}-${Date.now()}`,
        title:       item.title,
        summary:     '',
        source:      item.publisher || 'Google Search',
        publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
        url:         item.link,
        keywords,
      });
    });
  });

  return { articles: allArticles, ok: anyOk };
}

// ── Route Handler ─────────────────────────────────────────────────────────────

export async function GET() {
  // Run RSS feeds and Google News searches in parallel
  const [rssResults, googleResult] = await Promise.all([
    Promise.allSettled(RSS_SOURCES.map(fetchFeed)),
    fetchGoogleNews().catch(() => ({ articles: [], ok: false })),
  ]);

  const allArticles: NewsArticle[] = [];
  const sourceStatuses: { name: string; ok: boolean }[] = [];

  rssResults.forEach((result, i) => {
    const source = RSS_SOURCES[i];
    if (result.status === 'fulfilled') {
      allArticles.push(...result.value.articles);
      sourceStatuses.push({ name: source.name, ok: result.value.ok });
    } else {
      sourceStatuses.push({ name: source.name, ok: false });
    }
  });

  // Google Search as a single source entry
  allArticles.push(...googleResult.articles);
  sourceStatuses.push({ name: 'Google Search', ok: googleResult.ok });

  // Deduplicate by URL + title (Google News uses redirect URLs so title-dedup catches cross-query dupes)
  const seenUrls  = new Set<string>();
  const seenTitles = new Set<string>();
  const deduped = allArticles
    .filter(a => {
      const titleKey = a.title.toLowerCase().slice(0, 80);
      if (seenUrls.has(a.url) || seenTitles.has(titleKey)) return false;
      seenUrls.add(a.url);
      seenTitles.add(titleKey);
      return true;
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 500);

  const response: NewsApiResponse = {
    articles: deduped,
    fetchedAt: new Date().toISOString(),
    sourceStatuses,
  };

  return NextResponse.json(response);
}
