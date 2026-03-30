/**
 * 두 배치 결과 파일을 DB에 병합
 * 사용법: node scripts/merge-summaries.js scripts/out-a.json scripts/out-b.json
 */
const fs = require('fs');
const DB_PATH = 'C:/workspace/fadu_dashboard/src/data/valuechain/earnings-calls/earnings-calls-db.json';

const patchFiles = process.argv.slice(2);
if (!patchFiles.length) { console.error('No patch files given'); process.exit(1); }

const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

let applied = 0;
for (const file of patchFiles) {
  if (!fs.existsSync(file)) { console.warn('파일 없음:', file); continue; }
  const patch = JSON.parse(fs.readFileSync(file, 'utf8'));
  for (const [key, summary] of Object.entries(patch)) {
    const [ticker, periodEndMonth] = key.split('|');
    const idx = db.findIndex(r => r.ticker === ticker && r.periodEndMonth === periodEndMonth);
    if (idx >= 0) { db[idx].summary = summary; applied++; }
  }
  console.log(`✅ ${file}: ${Object.keys(patch).length}개 패치 적용`);
}

fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
const total = db.filter(r => r.summary).length;
console.log(`\n✅ DB 병합 완료 — 총 summary 보유: ${total}/${db.length}`);
