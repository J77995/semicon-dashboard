/**
 * 섹터 인사이트 패치 파일들을 sector-insights.json에 병합
 * 사용법: node scripts/merge-sector-insights.js scripts/out-sector-a.json scripts/out-sector-b.json
 */
const fs = require('fs');
const OUT_PATH = 'C:/workspace/fadu_dashboard/src/data/valuechain/sector-insights.json';

const patchFiles = process.argv.slice(2);
if (!patchFiles.length) {
  console.error('Usage: node merge-sector-insights.js patch1.json patch2.json ...');
  process.exit(1);
}

const db = fs.existsSync(OUT_PATH)
  ? JSON.parse(fs.readFileSync(OUT_PATH, 'utf8'))
  : {};

let total = 0;
for (const file of patchFiles) {
  if (!fs.existsSync(file)) { console.warn('파일 없음:', file); continue; }
  const patch = JSON.parse(fs.readFileSync(file, 'utf8'));
  for (const [key, insight] of Object.entries(patch)) {
    const sep = key.indexOf('|');
    const date  = key.slice(0, sep);
    const group = key.slice(sep + 1);
    if (!db[date]) db[date] = {};
    db[date][group] = insight;
    total++;
  }
  console.log(`✅ ${file}: ${Object.keys(patch).length}개`);
}

fs.writeFileSync(OUT_PATH, JSON.stringify(db, null, 2), 'utf8');
const dates = Object.keys(db).length;
console.log(`\n✅ sector-insights.json 저장 — ${dates}개 분기, 총 ${total}개 항목`);
