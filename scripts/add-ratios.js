/**
 * 재무 DB에 RATIO 항목 추가
 * - 매출액_YoY (%), 매출액_QoQ (%)
 * - 매출총이익률 (%), 매출총이익률_YoY (%p), 매출총이익률_QoQ (%p)
 * - 영업이익률 (%), 영업이익률_YoY (%p), 영업이익률_QoQ (%p)
 */
const fs = require('fs');
const DB_PATH = 'C:/workspace/fadu_dashboard/src/data/financials-db.json';
const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

const round1 = v => v === null ? null : Math.round(v * 10) / 10;

// ticker별로 그룹화
const tickers = [...new Set(db.map(r => r.ticker))];
const newRows = [];

for (const ticker of tickers) {
  const rows = db.filter(r => r.ticker === ticker);

  // 기간 목록 (정렬)
  const periods = [...new Set(rows.map(r => r.periodEndMonth))].sort();

  // 기간별 필요 값 추출
  const data = {}; // periodEndMonth → { 매출액, 매출총이익, 영업이익, fiscalLabel, currency, unit, company }
  for (const pm of periods) {
    const pmRows = rows.filter(r => r.periodEndMonth === pm);
    const get = item => pmRows.find(r => r.item === item)?.value ?? null;
    data[pm] = {
      매출액:    get('매출액'),
      매출총이익: get('매출총이익'),
      영업이익:  get('영업이익'),
      fiscalLabel: pmRows[0]?.fiscalLabel,
      currency:    pmRows[0]?.currency,
      unit:        pmRows[0]?.unit,
      company:     pmRows[0]?.company,
    };
  }

  // YoY 대응 기간: periodEndMonth에서 12개월 전
  function getPrevYear(pm) {
    const [y, m] = pm.split('-').map(Number);
    const prevY = y - 1;
    const target = `${prevY}-${String(m).padStart(2, '0')}`;
    // 정확히 12개월 전이 있으면 사용, 없으면 ±1개월 허용
    if (data[target]) return target;
    for (const delta of [1, -1, 2, -2]) {
      const mm = m + delta;
      const yy = mm <= 0 ? prevY - 1 : (mm > 12 ? prevY + 1 : prevY);
      const mmAdj = ((mm - 1 + 12) % 12) + 1;
      const candidate = `${yy}-${String(mmAdj).padStart(2, '0')}`;
      if (data[candidate]) return candidate;
    }
    return null;
  }

  // QoQ: 바로 직전 기간
  function getPrevQ(pm) {
    const idx = periods.indexOf(pm);
    return idx > 0 ? periods[idx - 1] : null;
  }

  for (const pm of periods) {
    const cur  = data[pm];
    if (!cur.fiscalLabel) continue;

    const prevQPm = getPrevQ(pm);
    const prevYPm = getPrevYear(pm);
    const prevQ = prevQPm ? data[prevQPm] : null;
    const prevY = prevYPm ? data[prevYPm] : null;

    const base = {
      ticker, company: cur.company,
      periodEndMonth: pm, fiscalLabel: cur.fiscalLabel,
      currency: cur.currency, unit: cur.unit,
      statementType: 'RATIO',
      ninjaField: null,
    };

    // ── 매출액 YoY / QoQ ─────────────────────────────────────────
    const revYoY = (cur.매출액 != null && prevY?.매출액)
      ? round1((cur.매출액 - prevY.매출액) / Math.abs(prevY.매출액) * 100) : null;
    const revQoQ = (cur.매출액 != null && prevQ?.매출액)
      ? round1((cur.매출액 - prevQ.매출액) / Math.abs(prevQ.매출액) * 100) : null;

    // ── 매출총이익률 ──────────────────────────────────────────────
    const gm     = (cur.매출액 && cur.매출총이익 != null)
      ? round1(cur.매출총이익 / cur.매출액 * 100) : null;
    const gmPrev = prevQ && prevQ.매출액 && prevQ.매출총이익 != null
      ? prevQ.매출총이익 / prevQ.매출액 * 100 : null;
    const gmPrevY = prevY && prevY.매출액 && prevY.매출총이익 != null
      ? prevY.매출총이익 / prevY.매출액 * 100 : null;
    const gmQoQ  = (gm != null && gmPrev  != null) ? round1(gm - gmPrev)  : null;
    const gmYoY  = (gm != null && gmPrevY != null) ? round1(gm - gmPrevY) : null;

    // ── 영업이익률 ────────────────────────────────────────────────
    const om     = (cur.매출액 && cur.영업이익 != null)
      ? round1(cur.영업이익 / cur.매출액 * 100) : null;
    const omPrev = prevQ && prevQ.매출액 && prevQ.영업이익 != null
      ? prevQ.영업이익 / prevQ.매출액 * 100 : null;
    const omPrevY = prevY && prevY.매출액 && prevY.영업이익 != null
      ? prevY.영업이익 / prevY.매출액 * 100 : null;
    const omQoQ  = (om != null && omPrev  != null) ? round1(om - omPrev)  : null;
    const omYoY  = (om != null && omPrevY != null) ? round1(om - omPrevY) : null;

    const items = [
      { item: '매출액_YoY',       value: revYoY },
      { item: '매출액_QoQ',       value: revQoQ },
      { item: '매출총이익률',      value: gm     },
      { item: '매출총이익률_YoY',  value: gmYoY  },
      { item: '매출총이익률_QoQ',  value: gmQoQ  },
      { item: '영업이익률',        value: om     },
      { item: '영업이익률_YoY',    value: omYoY  },
      { item: '영업이익률_QoQ',    value: omQoQ  },
    ];

    for (const { item, value } of items) {
      newRows.push({ ...base, item, value });
    }
  }
}

// 기존 RATIO 행 제거 후 새 값으로 교체
const nonRatio = db.filter(r => r.statementType !== 'RATIO');
const merged = [...nonRatio, ...newRows];

merged.sort((a, b) => {
  if (a.ticker !== b.ticker) return a.ticker.localeCompare(b.ticker);
  if (a.periodEndMonth !== b.periodEndMonth) return a.periodEndMonth.localeCompare(b.periodEndMonth);
  if (a.statementType !== b.statementType) return a.statementType.localeCompare(b.statementType);
  return a.item.localeCompare(b.item);
});

fs.writeFileSync(DB_PATH, JSON.stringify(merged, null, 2), 'utf8');

// 검증 출력
console.log(`✅ RATIO 항목 추가: ${newRows.length}행`);
console.log(`전체 DB: ${merged.length}행\n`);

// 샘플: NVDA 최근 4분기
console.log('=== NVDA RATIO 샘플 (최근 4분기) ===');
const nvdaRatio = merged.filter(r => r.ticker === 'NVDA' && r.statementType === 'RATIO');
const nvdaPeriods = [...new Set(nvdaRatio.map(r => r.periodEndMonth))].sort().slice(-4);
nvdaPeriods.forEach(pm => {
  const r = nvdaRatio.filter(r => r.periodEndMonth === pm);
  const fl = r[0]?.fiscalLabel;
  const get = item => r.find(x => x.item === item)?.value;
  console.log(`${pm}(${fl}) | 매출YoY:${get('매출액_YoY')}% QoQ:${get('매출액_QoQ')}% | GPM:${get('매출총이익률')}% YoY:${get('매출총이익률_YoY')}%p | OPM:${get('영업이익률')}% YoY:${get('영업이익률_YoY')}%p`);
});

// 삼성전자 샘플
console.log('\n=== 삼성전자 RATIO 샘플 (최근 4분기) ===');
const samRatio = merged.filter(r => r.ticker === 'SSNLF' && r.statementType === 'RATIO');
const samPeriods = [...new Set(samRatio.map(r => r.periodEndMonth))].sort().slice(-4);
samPeriods.forEach(pm => {
  const r = samRatio.filter(r => r.periodEndMonth === pm);
  const fl = r[0]?.fiscalLabel;
  const get = item => r.find(x => x.item === item)?.value;
  console.log(`${pm}(${fl}) | 매출YoY:${get('매출액_YoY')}% QoQ:${get('매출액_QoQ')}% | GPM:${get('매출총이익률')}% YoY:${get('매출총이익률_YoY')}%p | OPM:${get('영업이익률')}% YoY:${get('영업이익률_YoY')}%p`);
});
