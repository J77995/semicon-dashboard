/**
 * 어닝스콜 일괄 요약 — 3개 기업씩 배치 처리
 * 사용법: node scripts/batch-summarize.js AMZN AVGO GOOGL
 * - 이미 summary 있는 항목은 스킵
 * - API 호출 간 2초 딜레이
 */
const fs    = require('fs');
const https = require('https');

// 사용법: node batch-summarize.js <API_KEY> <OUT_FILE> TICKER1 TICKER2 ...
const API_KEY = process.argv[2];
const OUT_FILE = process.argv[3]; // 결과 저장 파일 (DB와 별도)
const MODEL   = 'gemini-2.5-flash';
const DB_PATH = 'C:/workspace/fadu_dashboard/src/data/valuechain/earnings-calls/earnings-calls-db.json';

const COMPANY_NAMES = {
  'AMZN': 'Amazon', 'AVGO': 'Broadcom', 'GOOGL': 'Alphabet (Google)',
  'MRVL': 'Marvell Technology', 'MSFT': 'Microsoft', 'MU': 'Micron Technology',
  'NVDA': 'NVIDIA', 'ORCL': 'Oracle', 'SIMO': 'Silicon Motion',
  'SNDK': 'SanDisk', 'SSNLF': 'Samsung Electronics', 'STX': 'Seagate Technology',
  'WDC': 'Western Digital', '000660.KS': 'SK하이닉스',
};

// ── 프롬프트 ──────────────────────────────────────────────────────────────────
function buildPrompt(company, ticker, periodEndMonth, fiscalLabel, callDate, transcript) {
  return `당신은 기업 IR 분석 전문가입니다. 아래 어닝스콜 전문을 읽고 한국어로 요약하세요.

## 입력 정보
- 기업: ${company} (${ticker})
- 결산기간: ${periodEndMonth} (${fiscalLabel})
- 콜 날짜: ${callDate}

## 출력 형식 (반드시 준수)
- 제목·헤더 없이 불렛 포인트로만 구성. 첫 줄부터 바로 불렛 시작.
- 각 불렛은 "* **항목명**: 내용" 형식. 항목명만 볼드, 나머지는 일반 텍스트.
- 불렛 5개 고정 (실적 요약 / 사업부문별 하이라이트 / 가이던스 / 전략 및 시장 전망 / 리스크 및 주목 발언)
- 각 불렛은 1~3문장 이내. 핵심 수치 위주로 압축.

예시 형식:
* **실적 요약**: 유기적 총 매출과 비GAAP EPS 모두 YoY 20%+ 성장 — 15년 만에 처음. 경영진 "엄청난 분기"로 평가.
* **사업부문별 하이라이트**: 클라우드 앱 매출 YoY +11% (연간 $16.1B). 멀티클라우드 DB YoY +531%, AI 인프라 YoY +243% 폭증. RPO $553B.
* **가이던스**: (수치 명시)
* **전략 및 시장 전망**: (핵심 전략·CAPEX 등)
* **리스크 및 주목 발언**: (공급망·경쟁·거시경제 등)

## 숫자 표기 규칙
- 달러: $XXB / $XXXM. 원화: X조XXXX억원.
- 성장률: YoY/QoQ 명시. 수치는 볼드 처리 없이 그대로 표기.

## 어조
- 간결하고 객관적인 IR 리포트 문체, 팩트 중심.
- 전문 용어 영문 약어 허용 (HBM, RPO, ARR, CAPEX 등).
- 전체 500~700자 (한국어 기준).

---
[어닝스콜 전문]
${transcript}`;
}

// ── Gemini 호출 ───────────────────────────────────────────────────────────────
function callGemini(prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 8192 }
    });
    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    };
    const req = https.request(options, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.error) { reject(new Error(json.error.message)); return; }
          const cand = json.candidates?.[0];
          if (cand?.finishReason === 'MAX_TOKENS') console.warn('    ⚠️  MAX_TOKENS');
          const text = (cand?.content?.parts?.[0]?.text ?? '').replace(/\uFFFD+/g, '');
          resolve(text);
        } catch(e) { reject(new Error('JSON parse error: ' + e.message)); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

// ── 메인 ─────────────────────────────────────────────────────────────────────
async function main() {
  if (!API_KEY || !OUT_FILE) {
    console.error('Usage: node batch-summarize.js <API_KEY> <OUT_FILE> TICKER1 TICKER2 ...');
    process.exit(1);
  }
  const tickers = process.argv.slice(4);
  if (!tickers.length) { console.error('No tickers specified.'); process.exit(1); }

  const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

  let totalDone = 0, totalSkip = 0, totalErr = 0;
  const results = []; // { ticker, periodEndMonth, fiscalLabel, ok, len }

  for (const ticker of tickers) {
    const company = COMPANY_NAMES[ticker] ?? ticker;
    const entries = db
      .filter(r => r.ticker === ticker)
      .sort((a, b) => b.periodEndMonth.localeCompare(a.periodEndMonth));

    console.log(`\n▶ ${company} (${ticker}) — ${entries.length}개 분기`);

    for (const entry of entries) {
      const tag = `  ${entry.periodEndMonth} (${entry.fiscalLabel})`;

      if (entry.summary) {
        console.log(tag, '— 스킵 (이미 존재)');
        totalSkip++;
        results.push({ ticker, periodEndMonth: entry.periodEndMonth, fiscalLabel: entry.fiscalLabel, ok: 'skip', len: entry.summary.length });
        continue;
      }

      process.stdout.write(tag + ' — 요약 중...');
      try {
        const prompt = buildPrompt(company, ticker, entry.periodEndMonth, entry.fiscalLabel, entry.callDate, entry.transcript);
        const summary = await callGemini(prompt);

        // DB에 직접 업데이트
        const idx = db.findIndex(r => r.ticker === ticker && r.periodEndMonth === entry.periodEndMonth);
        db[idx].summary = summary;

        console.log(` ✅ ${summary.length}자`);
        totalDone++;
        results.push({ ticker, periodEndMonth: entry.periodEndMonth, fiscalLabel: entry.fiscalLabel, ok: true, len: summary.length });
      } catch(e) {
        console.log(` ❌ ${e.message}`);
        totalErr++;
        results.push({ ticker, periodEndMonth: entry.periodEndMonth, fiscalLabel: entry.fiscalLabel, ok: false, len: 0 });
      }

      await sleep(2000);
    }
  }

  // 결과를 별도 파일에 저장 (ticker+periodEndMonth → summary 맵)
  const patch = {};
  db.forEach(r => { if (r.summary) { patch[r.ticker + '|' + r.periodEndMonth] = r.summary; } });
  fs.writeFileSync(OUT_FILE, JSON.stringify(patch, null, 2), 'utf8');
  console.log(`\n💾 결과 저장: ${OUT_FILE} (${Object.keys(patch).length}개 항목)`)

  console.log('\n' + '='.repeat(60));
  console.log(`완료: ${totalDone}개 | 스킵: ${totalSkip}개 | 오류: ${totalErr}개`);
  console.log('='.repeat(60));
  console.log('\n결과 상세:');
  results.forEach(r => {
    const status = r.ok === 'skip' ? '⏭️ ' : r.ok ? '✅' : '❌';
    console.log(`  ${status} ${r.ticker} ${r.periodEndMonth} (${r.fiscalLabel}) ${r.ok === true ? r.len + '자' : r.ok === 'skip' ? '기존' : 'FAIL'}`);
  });
}

main().catch(console.error);
