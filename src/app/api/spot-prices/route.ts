import { NextResponse } from 'next/server';

export const revalidate = 86400; // 24시간 캐시

export interface SpotRow {
  item: string;
  dailyHigh: string;
  dailyLow: string;
  sessionAvg: string;
  change: string;
  changeDir: 'up' | 'down' | 'stable';
}

export interface SsdRow {
  brand: string;
  series: string;
  capacity: string;
  high: string;
  low: string;
  avg: string;
  change: string;
  changeDir: 'up' | 'down' | 'stable';
}

export interface SpotPricesResponse {
  dram: SpotRow[];
  flash: SpotRow[];
  ssd: SsdRow[];
  fetchedAt: string | null;
}

// ── Fallback (fetch 실패 시) ─────────────────────────────────────────────────

const FALLBACK_DRAM: SpotRow[] = [
  { item: 'DDR5 16Gb (2Gx8) 4800/5600',  dailyHigh: '—', dailyLow: '—', sessionAvg: '—', change: '—', changeDir: 'stable' },
  { item: 'DDR4 16Gb (2Gx8) 3200',        dailyHigh: '—', dailyLow: '—', sessionAvg: '—', change: '—', changeDir: 'stable' },
  { item: 'DDR3 4Gb 512Mx8 1600/1866',    dailyHigh: '—', dailyLow: '—', sessionAvg: '—', change: '—', changeDir: 'stable' },
];

const FALLBACK_FLASH: SpotRow[] = [
  { item: '128Gb TLC',  dailyHigh: '—', dailyLow: '—', sessionAvg: '—', change: '—', changeDir: 'stable' },
  { item: '256Gb TLC',  dailyHigh: '—', dailyLow: '—', sessionAvg: '—', change: '—', changeDir: 'stable' },
  { item: '512Gb TLC',  dailyHigh: '—', dailyLow: '—', sessionAvg: '—', change: '—', changeDir: 'stable' },
];

const FALLBACK_SSD: SsdRow[] = [
  { brand: 'Samsung', series: '990 Pro',    capacity: '1TB', high: '—', low: '—', avg: '—', change: '—', changeDir: 'stable' },
  { brand: 'Micron',  series: 'Crucial P3', capacity: '1TB', high: '—', low: '—', avg: '—', change: '—', changeDir: 'stable' },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Parse <tr> rows from a tbody HTML fragment into SpotRow[].
 * Columns: Item(0) | Daily High(1) | Daily Low(2) | ... | Session Avg(5) | Change(6) | ...
 * Pass filters=[] to include all rows.
 */
function parseSpotRows(tbodyHtml: string, filters: string[] = []): SpotRow[] {
  const rows: SpotRow[] = [];
  const trBlocks = tbodyHtml.match(/<tr[\s\S]*?<\/tr>/gi) ?? [];

  for (const tr of trBlocks) {
    const tds = tr.match(/<td[^>]*>([\s\S]*?)<\/td>/gi) ?? [];
    if (tds.length < 7) continue;

    const itemText = stripTags(tds[0]!);
    if (!itemText) continue;
    if (/^(item|product|description)$/i.test(itemText)) continue;
    if (filters.length > 0 && !filters.some(f => itemText.includes(f))) continue;

    const dailyHigh  = stripTags(tds[1]!);
    const dailyLow   = stripTags(tds[2]!);
    const sessionAvg = stripTags(tds[5]!);

    const changeCell = tds[6]!;
    const changeDir: SpotRow['changeDir'] = changeCell.includes('up.gif')   ? 'up'
                                          : changeCell.includes('down.gif') ? 'down'
                                          : 'stable';
    const pctMatch = stripTags(changeCell).match(/[-\d.]+\s*%/);
    const change = pctMatch ? pctMatch[0].replace(/\s+/, '') : '—';

    rows.push({ item: itemText, dailyHigh, dailyLow, sessionAvg, change, changeDir });
  }
  return rows;
}

/**
 * Parse SSD Street Price rows.
 * Columns: Brand(0) | Interface(1) | Series(2) | Capacity(3) | High(4) | Low(5) | Avg(6) | Change(7)
 */
function parseSsdRows(tbodyHtml: string): SsdRow[] {
  const rows: SsdRow[] = [];
  const trBlocks = tbodyHtml.match(/<tr[\s\S]*?<\/tr>/gi) ?? [];

  for (const tr of trBlocks) {
    const tds = tr.match(/<td[^>]*>([\s\S]*?)<\/td>/gi) ?? [];
    if (tds.length < 7) continue;

    const brand    = stripTags(tds[0]!);
    const series   = stripTags(tds[2]!);
    const capacity = stripTags(tds[3]!);
    const high     = stripTags(tds[4]!);
    const low      = stripTags(tds[5]!);
    const avg      = stripTags(tds[6]!);

    if (!brand) continue;

    const changeCell = tds[7] ?? '';
    const changeDir: SsdRow['changeDir'] = changeCell.includes('up.gif')   ? 'up'
                                         : changeCell.includes('down.gif') ? 'down'
                                         : 'stable';
    const pctMatch = stripTags(changeCell).match(/[-\d.]+\s*%/);
    const change = pctMatch ? pctMatch[0].replace(/\s+/, '') : '—';

    rows.push({ brand, series, capacity, high, low, avg, change, changeDir });
  }
  return rows;
}

// ── Route Handler ─────────────────────────────────────────────────────────────

export async function GET() {
  try {
    const res = await fetch('https://www.dramexchange.com/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      next: { revalidate: 86400 },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();

    // ── DRAM: tb_NationalDramSpotPrice ───────────────────────────────────────
    const dramMatch = html.match(/id="tb_NationalDramSpotPrice">([\s\S]*?)<\/tbody>/i);
    const dramRows = dramMatch
      ? parseSpotRows(dramMatch[1], ['DDR5 16Gb (2Gx8) 4800/5600', 'DDR4 16Gb (2Gx8) 3200', 'DDR3'])
      : [];

    // ── NAND Flash Spot: tb_NationalFlashSpotPrice ───────────────────────────
    const flashMatch = html.match(/id="tb_NationalFlashSpotPrice">([\s\S]*?)<\/tbody>/i);
    const flashRows = flashMatch ? parseSpotRows(flashMatch[1]) : [];

    // ── SSD Street Price: tb_PCC_Price ───────────────────────────────────────
    const ssdMatch = html.match(/id="tb_PCC_Price">([\s\S]*?)<\/tbody>/i);
    const ssdRows = ssdMatch ? parseSsdRows(ssdMatch[1]) : [];

    return NextResponse.json({
      dram:      dramRows.length  ? dramRows  : FALLBACK_DRAM,
      flash:     flashRows.length ? flashRows : FALLBACK_FLASH,
      ssd:       ssdRows.length   ? ssdRows   : FALLBACK_SSD,
      fetchedAt: new Date().toISOString(),
    } satisfies SpotPricesResponse);

  } catch {
    return NextResponse.json({
      dram:      FALLBACK_DRAM,
      flash:     FALLBACK_FLASH,
      ssd:       FALLBACK_SSD,
      fetchedAt: null,
    } satisfies SpotPricesResponse);
  }
}
