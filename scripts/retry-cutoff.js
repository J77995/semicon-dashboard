/**
 * MAX_TOKENS로 잘린 요약 재생성 — gemini-2.0-flash (thinking 없음)
 * 사용법: node scripts/retry-cutoff.js <API_KEY>
 */
const fs    = require('fs');
const https = require('https');

const API_KEY = process.argv[2];
if (!API_KEY) { console.error('Usage: node retry-cutoff.js <API_KEY>'); process.exit(1); }

const MODEL   = 'gemini-2.5-flash';
const DB_PATH = 'C:/workspace/fadu_dashboard/src/data/valuechain/earnings-calls/earnings-calls-db.json';

// 재시도 대상
const TARGETS = [
  { ticker: 'GOOGL', periodEndMonth: '2024-12' },
  { ticker: 'MSFT',  periodEndMonth: '2025-06' },
  { ticker: 'MU',    periodEndMonth: '2025-02' },
];

const COMPANY_NAMES = {
  'GOOGL': 'Alphabet (Google)',
  'MSFT':  'Microsoft',
  'MU':    'Micron Technology',
};

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

function callGemini(prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 8192, thinkingConfig: { thinkingBudget: 0 } }
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
          if (cand?.finishReason === 'MAX_TOKENS') console.warn('    ⚠️  MAX_TOKENS again!');
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

async function main() {
  const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

  for (const { ticker, periodEndMonth } of TARGETS) {
    const idx = db.findIndex(r => r.ticker === ticker && r.periodEndMonth === periodEndMonth);
    if (idx < 0) { console.warn(`Not found: ${ticker} ${periodEndMonth}`); continue; }

    const entry = db[idx];
    const company = COMPANY_NAMES[ticker] ?? ticker;
    console.log(`\n▶ ${company} (${ticker}) ${periodEndMonth} (${entry.fiscalLabel}) — 재생성 중...`);

    try {
      const prompt = buildPrompt(company, ticker, periodEndMonth, entry.fiscalLabel, entry.callDate, entry.transcript);
      const summary = await callGemini(prompt);
      db[idx].summary = summary;

      const bullets = summary.split('\n').filter(l => l.trim().startsWith('*')).length;
      console.log(`  ✅ ${summary.length}자, ${bullets}개 불렛`);
      console.log('  마지막 줄:', summary.trim().split('\n').pop());
    } catch(e) {
      console.log(`  ❌ ${e.message}`);
    }

    await sleep(2000);
  }

  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
  console.log('\n✅ DB 저장 완료');
}

main().catch(console.error);
