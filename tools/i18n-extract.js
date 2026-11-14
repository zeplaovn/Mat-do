#!/usr/bin/env node
/* Trích xuất mọi câu tiếng Việt cần dịch từ mã nguồn, chia thành từng lô nhỏ.
   Chạy: node tools/i18n-extract.js
   Kết quả: i18n/parts/source/strings.json, batch-XXX.json, templates.json */
'use strict';
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'i18n', 'parts', 'source');
const VI = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;
const BATCH_SIZE = 80;

const FILES = [
  'index.html',
  'trailer.html',
  'game.js',
  'intro.js',
  'guide.js',
  'notice.js',
  'horror.js',
  'trailer.js',
  'ending-cinematic.js',
  'ending-credits.js',
  'ui-v3.js',
  'title-matrix.js',
  'vfx.js',
  'assets/dialogue/reviewed.js',
  'assets/research/books-data.js'
];

const found = new Map();      // key -> {k, files:Set, ctx}
const templates = [];         // chuỗi có ${...} nhưng không có HTML
const stats = Object.create(null);

function decodeEntities(s) {
  return s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0*39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));
}

function unescapeJs(s) {
  return s.replace(/\\(u\{[0-9a-fA-F]+\}|u[0-9a-fA-F]{4}|x[0-9a-fA-F]{2}|n|r|t|b|f|v|0|['"`\\\/])/g, (m, p) => {
    if (p[0] === 'u') {
      const hex = p[1] === '{' ? p.slice(2, -1) : p.slice(1);
      try { return String.fromCodePoint(parseInt(hex, 16)); } catch (_) { return m; }
    }
    if (p[0] === 'x') return String.fromCharCode(parseInt(p.slice(1), 16));
    switch (p) {
      case 'n': return '\n';
      case 'r': return '\r';
      case 't': return '\t';
      case 'b': return '\b';
      case 'f': return '\f';
      case 'v': return '\v';
      case '0': return '\0';
      default: return p;
    }
  });
}

function add(raw, file, ctx) {
  if (!raw) return;
  let s = String(raw).replace(/\u00a0/g, ' ').replace(/[ \t]+/g, ' ').trim();
  if (!s || s.length < 2) return;
  if (!VI.test(s)) return;
  if (/^[\d\s.,:;·–—-]+$/.test(s)) return;
  if (!found.has(s)) found.set(s, { k: s, files: new Set(), ctx: ctx || '' });
  const rec = found.get(s);
  rec.files.add(file);
  if (ctx && !rec.ctx) rec.ctx = ctx.replace(/\s+/g, ' ').slice(0, 240);
}

function addHtml(raw, file, ctx) {
  // Tách thuộc tính hiển thị trước khi bỏ thẻ.
  const attrRe = /\b(title|aria-label|alt|placeholder)\s*=\s*"([^"]*)"/gi;
  let m;
  while ((m = attrRe.exec(raw))) add(decodeEntities(m[2]), file, raw);
  const withoutScript = raw.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ');
  const text = withoutScript.replace(/<br\s*\/?>/gi, '\n').replace(/<\/(p|div|h\d|li|section|article|button|a|span|strong|em|small)>/gi, '\n');
  for (const part of text.split(/<[^>]*>/)) {
    for (const line of part.split('\n')) add(decodeEntities(line), file, ctx);
  }
}

function scanJs(file, src) {
  // Bỏ comment đứng riêng một dòng để khỏi dịch ghi chú lập trình.
  src = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^[ \t]*\/\/[^\n]*$/gm, '');
  const patterns = [
    /'(?:\\.|[^'\\\n])*'/g,
    /"(?:\\.|[^"\\\n])*"/g,
    /`(?:\\.|[^`\\])*`/g
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(src))) {
      const raw = unescapeJs(m[0].slice(1, -1));
      if (!VI.test(raw)) continue;
      if (raw.includes('<') && /<[a-z!/][\s\S]*>/i.test(raw)) { addHtml(raw, file, raw); continue; }
      if (raw.includes('${')) { templates.push({ file, raw: raw.replace(/\s+/g, ' ').trim(), ctx: m[0].replace(/\s+/g, ' ').slice(0, 240) }); continue; }
      for (const line of raw.split('\n')) add(line, file, raw);
    }
  }
}

function scanHtml(file, src) {
  const cleaned = src
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ');
  const title = /<title>([\s\S]*?)<\/title>/i.exec(cleaned);
  if (title) add(decodeEntities(title[1]), file, 'title');
  const meta = /<meta\s+name="description"\s+content="([^"]*)"/i.exec(cleaned);
  if (meta) add(decodeEntities(meta[1]), file, 'meta description');
  addHtml(cleaned, file, '');
}

for (const file of FILES) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) continue;
  const src = fs.readFileSync(full, 'utf8');
  const before = found.size;
  if (/\.html?$/i.test(file)) scanHtml(file, src);
  else scanJs(file, src);
  stats[file] = found.size - before;
}

const list = [...found.values()].map(r => ({ k: r.k, files: [...r.files], ctx: r.ctx }));
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'strings.json'), JSON.stringify(list, null, 1));
fs.writeFileSync(path.join(outDir, 'templates.json'), JSON.stringify(templates, null, 1));

const total = Math.ceil(list.length / BATCH_SIZE);
for (let i = 0; i < total; i++) {
  const batch = list.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE);
  fs.writeFileSync(
    path.join(outDir, `batch-${String(i + 1).padStart(3, '0')}.json`),
    JSON.stringify({ batch: i + 1, count: batch.length, strings: batch }, null, 1)
  );
}

console.log(`Đã trích ${list.length} câu duy nhất → ${total} lô.`);
console.log(`Chuỗi có nội suy cần xử lý riêng: ${templates.length}`);
for (const [f, n] of Object.entries(stats)) console.log(`  ${f.padEnd(34)} ${String(n).padStart(5)}`);
