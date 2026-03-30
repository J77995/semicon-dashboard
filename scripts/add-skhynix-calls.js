/**
 * SK하이닉스 컨퍼런스콜 텍스트 → earnings-calls DB 추가
 * 파일: SK하이닉스 컨퍼런스콜.txt
 * 분기: 2024Q3 ~ 2025Q4 (6개)
 */
const fs = require('fs');
const path = require('path');

const TXT_PATH  = 'C:/workspace/fadu_dashboard/SK하이닉스 컨퍼런스콜.txt';
const DB_PATH   = 'C:/workspace/fadu_dashboard/src/data/valuechain/earnings-calls/earnings-calls-db.json';
const IDX_PATH  = 'C:/workspace/fadu_dashboard/src/data/valuechain/earnings-calls/earnings-calls-index.json';

const raw = fs.readFileSync(TXT_PATH, 'utf8');
const db  = JSON.parse(fs.readFileSync(DB_PATH,  'utf8'));
const idx = JSON.parse(fs.readFileSync(IDX_PATH, 'utf8'));

// ── 분기별 메타 ──────────────────────────────────────────────────────────────
// periodEndMonth: 해당 분기 마지막 달 (YYYY-MM)
// fiscalLabel:    "24Q3" 형식
// callDate:       실적발표 날짜
const QUARTERS = [
  { header: '## 2025년 4분기 컨퍼런스콜', periodEndMonth: '2025-12', fiscalLabel: '25Q4', callDate: '2026-01-29' },
  { header: '## 2025년 3분기 컨퍼런스콜', periodEndMonth: '2025-09', fiscalLabel: '25Q3', callDate: '2025-10-30' },
  { header: '## 2025년 2분기 컨퍼런스콜', periodEndMonth: '2025-06', fiscalLabel: '25Q2', callDate: '2025-07-31' },
  { header: '## 2025년 1분기 컨퍼런스콜', periodEndMonth: '2025-03', fiscalLabel: '25Q1', callDate: '2025-04-30' },
  { header: '## 2024년 4분기 컨퍼런스콜', periodEndMonth: '2024-12', fiscalLabel: '24Q4', callDate: '2025-01-31' },
  { header: '## 2024년 3분기 컨퍼런스콜', periodEndMonth: '2024-09', fiscalLabel: '24Q3', callDate: '2024-10-31' },
];

// ── 섹션 추출 ────────────────────────────────────────────────────────────────
const lines = raw.split('\n');
const headerLines = QUARTERS.map(q => {
  const idx = lines.findIndex(l => l.trim() === q.header);
  return { ...q, lineIdx: idx };
}).filter(q => q.lineIdx >= 0).sort((a, b) => a.lineIdx - b.lineIdx);

// 각 헤더부터 다음 헤더(또는 파일 끝)까지 추출
const sections = headerLines.map((q, i) => {
  const start = q.lineIdx;
  const end   = i + 1 < headerLines.length ? headerLines[i + 1].lineIdx : lines.length;
  const text  = lines.slice(start, end).join('\n').trim();
  return { ...q, transcript: text };
});

console.log('추출된 섹션:');
sections.forEach(s => {
  console.log(`  ${s.periodEndMonth} (${s.fiscalLabel}) | callDate: ${s.callDate} | len: ${s.transcript.length}`);
});

// ── 기존 SK하이닉스 항목 제거 ─────────────────────────────────────────────
const filtered_db  = db.filter(r => r.ticker !== '000660.KS');
const filtered_idx = idx.filter(r => r.ticker !== '000660.KS');
console.log(`\n기존 000660.KS 항목: db=${db.length - filtered_db.length}개, idx=${idx.length - filtered_idx.length}개 제거`);

// ── 새 항목 생성 ──────────────────────────────────────────────────────────
const newDbRows  = [];
const newIdxRows = [];

for (const s of sections) {
  const base = {
    ticker:         '000660.KS',
    company:        'SK하이닉스',
    fiscalLabel:    s.fiscalLabel,
    callDate:       s.callDate,
    periodEndMonth: s.periodEndMonth,
  };
  newDbRows.push({ ...base, transcript: s.transcript });
  newIdxRows.push({ ...base, transcriptLen: s.transcript.length });
}

// ── 병합 & 저장 ───────────────────────────────────────────────────────────
const mergedDb  = [...filtered_db,  ...newDbRows].sort((a, b) => {
  if (a.ticker !== b.ticker) return a.ticker.localeCompare(b.ticker);
  return a.periodEndMonth.localeCompare(b.periodEndMonth);
});
const mergedIdx = [...filtered_idx, ...newIdxRows].sort((a, b) => {
  if (a.ticker !== b.ticker) return a.ticker.localeCompare(b.ticker);
  return a.periodEndMonth.localeCompare(b.periodEndMonth);
});

fs.writeFileSync(DB_PATH,  JSON.stringify(mergedDb,  null, 2), 'utf8');
fs.writeFileSync(IDX_PATH, JSON.stringify(mergedIdx, null, 2), 'utf8');

console.log(`\n✅ 완료`);
console.log(`  earnings-calls-db.json : ${mergedDb.length}개 (추가 ${newDbRows.length}개)`);
console.log(`  earnings-calls-index.json: ${mergedIdx.length}개 (추가 ${newIdxRows.length}개)`);

// ── 검증 출력 ────────────────────────────────────────────────────────────
console.log('\n=== SK하이닉스 (000660.KS) 등록 현황 ===');
mergedIdx.filter(r => r.ticker === '000660.KS').forEach(r => {
  console.log(`  ${r.periodEndMonth} (${r.fiscalLabel}) | callDate: ${r.callDate} | len: ${r.transcriptLen}`);
});
