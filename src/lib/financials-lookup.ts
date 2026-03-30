import ratioLookup from "@/data/financials-ratio-lookup.json";

export type RatioData = {
  periodEndMonth: string;
  매출액_YoY: number | null;
  매출액_QoQ: number | null;
  매출총이익률: number | null;
  매출총이익률_QoQ: number | null;
  영업이익률: number | null;
  영업이익률_QoQ: number | null;
};

export function getLatestRatioAtOrBefore(
  ticker: string,
  upToMonth: string
): RatioData | null {
  const tickerData = (ratioLookup as any)[ticker];
  if (!tickerData) return null;

  const eligibleMonths = Object.keys(tickerData).filter(
    (month) => month <= upToMonth
  );

  if (eligibleMonths.length === 0) return null;

  const latestMonth = eligibleMonths.sort().at(-1) as string;
  const items = tickerData[latestMonth] ?? {};

  return {
    periodEndMonth: latestMonth,
    매출액_YoY: items["매출액_YoY"] ?? null,
    매출액_QoQ: items["매출액_QoQ"] ?? null,
    매출총이익률: items["매출총이익률"] ?? null,
    매출총이익률_QoQ: items["매출총이익률_QoQ"] ?? null,
    영업이익률: items["영업이익률"] ?? null,
    영업이익률_QoQ: items["영업이익률_QoQ"] ?? null,
  };
}
