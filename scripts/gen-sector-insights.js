/**
 * 분류별 섹터 종합 인사이트 생성
 * 사용법: node scripts/gen-sector-insights.js <API_KEY> <OUT_FILE> DATE1 DATE2 ...
 * 예시:   node scripts/gen-sector-insights.js KEY scripts/out-sector-a.json 2026-03 2025-12
 */
const fs    = require('fs');
const https = require('https');

const API_KEY  = process.argv[2];
const OUT_FILE = process.argv[3];
const DATES    = process.argv.slice(4);

if (!API_KEY || !OUT_FILE || !DATES.length) {
  console.error('Usage: node gen-sector-insights.js <API_KEY> <OUT_FILE> DATE1 DATE2 ...');
  process.exit(1);
}

const MODEL   = 'gemini-2.5-flash';
const DB_PATH = 'C:/workspace/fadu_dashboard/src/data/valuechain/earnings-calls/earnings-calls-db.json';

const GROUPS = [
  { label: '클라우드 서비스', companies: [
    { name: '구글',           ticker: 'GOOGL'     },
    { name: '마이크로소프트', ticker: 'MSFT'      },
    { name: '아마존',         ticker: 'AMZN'      },
    { name: '오라클',         ticker: 'ORCL'      },
  ]},
  { label: 'AI 반도체', companies: [
    { name: '엔비디아',         ticker: 'NVDA' },
    { name: '브로드컴',         ticker: 'AVGO' },
    { name: '마벨테크놀로지스', ticker: 'MRVL' },
  ]},
  { label: '메모리 제조사', companies: [
    { name: '삼성전자',  ticker: 'SSNLF'     },
    { name: 'SK하이닉스', ticker: '000660.KS' },
    { name: '마이크론',  ticker: 'MU'        },
  ]},
  { label: '스토리지', companies: [
    { name: '샌디스크',     ticker: 'SNDK' },
    { name: '웨스턴디지털', ticker: 'WDC'  },
    { name: '시게이트',     ticker: 'STX'  },
    { name: '실리콘모션',   ticker: 'SIMO' },
  ]},
];

function buildPrompt(groupLabel, date, entries) {
  const body = entries.map(e =>
    `[${e.name} (${e.ticker}, ${e.fiscalLabel})]:\n${e.summary}`
  ).join('\n\n');

  return `아래는 ${groupLabel} 기업들의 ${date} 기준 가장 최근 어닝스콜 요약입니다.

${body}

이 기업들의 요약을 비교하여 한국어 불렛 2개만 출력하세요.
- 제목·헤더 없이 첫 줄부터 바로 불렛
- 형식: * **항목명**: 내용 (항목명만 볼드)
- 불렛 1: * **공통 테마**: 이 그룹 기업들이 공통으로 언급하는 트렌드·수치·우려
- 불렛 2: * **주목할 특이점**: 기업 간 차이점 또는 이 그룹에서 특이한 현상·이슈 (차이점과 특이점 모두 포함)
- 각 불렛 1~2문장. 기업명·수치 포함.
- 전체 200~350자 (한국어 기준)`;
}

function callGemini(prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 2048,
        thinkingConfig: { thinkingBudget: 0 },
      },
    });
    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
    };
    const req = https.request(options, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.error) { reject(new Error(json.error.message)); return; }
          const cand = json.candidates?.[0];
          if (cand?.finishReason === 'MAX_TOKENS') console.warn(' ⚠️  MAX_TOKENS');
          const text = (cand?.content?.parts?.[0]?.text ?? '').replace(/\uFFFD+/g, '').trim();
          resolve(text);
        } catch(e) { reject(new Error('JSON parse: ' + e.message)); }
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
  const patch = {};
  let done = 0, skip = 0, err = 0;

  for (const date of DATES) {
    console.log(`\n📅 ${date}`);

    for (const group of GROUPS) {
      // 각 기업의 해당 date 이하 최신 요약
      const entries = [];
      for (const { name, ticker } of group.companies) {
        const entry = db
          .filter(r => r.ticker === ticker && r.summary && r.periodEndMonth <= date)
          .sort((a, b) => b.periodEndMonth.localeCompare(a.periodEndMonth))[0];
        if (entry) entries.push({ name, ticker, fiscalLabel: entry.fiscalLabel, summary: entry.summary });
      }

      if (entries.length < 2) {
        console.log(`  [${group.label}] 스킵 — 데이터 ${entries.length}개`);
        skip++;
        continue;
      }

      const key = `${date}|${group.label}`;
      process.stdout.write(`  [${group.label}] ${entries.length}개사 생성 중...`);
      try {
        const result = await callGemini(buildPrompt(group.label, date, entries));
        patch[key] = result;
        console.log(` ✅ ${result.length}자`);
        done++;
      } catch(e) {
        console.log(` ❌ ${e.message}`);
        err++;
      }

      await sleep(2000);
    }
  }

  fs.writeFileSync(OUT_FILE, JSON.stringify(patch, null, 2), 'utf8');
  console.log(`\n💾 저장: ${OUT_FILE} — 완료 ${done} / 스킵 ${skip} / 오류 ${err}`);
}

main().catch(console.error);
