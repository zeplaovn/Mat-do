#!/usr/bin/env node
/* Gộp các lô bản dịch thành i18n/en.js và i18n/zh.js, đồng thời báo thiếu.
   Chạy: node tools/i18n-build.js */
'use strict';
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const srcDir = path.join(root, 'i18n', 'parts', 'source');
const source = JSON.parse(fs.readFileSync(path.join(srcDir, 'strings.json'), 'utf8'));
const LANGS = ['en', 'zh'];

function readParts(lang) {
  const dir = path.join(root, 'i18n', 'parts', lang);
  const map = new Map();
  if (!fs.existsSync(dir)) return map;
  for (const name of fs.readdirSync(dir).sort()) {
    if (!name.endsWith('.json')) continue;
    let data;
    try { data = JSON.parse(fs.readFileSync(path.join(dir, name), 'utf8')); }
    catch (e) { console.error(`  ! ${lang}/${name}: JSON lỗi — ${e.message}`); continue; }
    if (Array.isArray(data)) data = Object.fromEntries(data.map(x => [x.k, x.v]));
    for (const [k, v] of Object.entries(data)) {
      if (typeof v !== 'string') { console.error(`  ! ${lang}/${name}: giá trị không phải chuỗi cho "${k}"`); continue; }
      if (map.has(k) && map.get(k) !== v) console.error(`  ! ${lang}: trùng khoá khác bản dịch — "${k}"`);
      map.set(k, v);
    }
  }
  return map;
}

function escapeForScript(text) {
  return text.replace(/<\/script/gi, '<\\/script').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
}

const sourceKeys = source.map(x => x.k);
const coverage = { total: source.length, en: 0, zh: 0, missing: {} };

for (const lang of LANGS) {
  const parts = readParts(lang);
  const out = {};
  let missing = 0;
  const missingByFile = {};
  for (const rec of source) {
    const v = parts.get(rec.k);
    if (typeof v === 'string' && v.trim()) out[rec.k] = v;
    else {
      missing++;
      const f = rec.files[0] || '?';
      missingByFile[f] = (missingByFile[f] || 0) + 1;
    }
  }
  // Khoá bổ sung thủ công (mảnh câu do mã ghép, không nằm trong danh sách trích).
  for (const k of [...parts.keys()].sort()) if (!(k in out) && parts.get(k).trim()) out[k] = parts.get(k);
  coverage[lang] = source.length - missing;
  coverage.missing[lang] = missingByFile;

  const body = JSON.stringify(out, null, 1);
  const header = `/* Bản dịch ${lang === 'en' ? 'tiếng Anh' : 'tiếng Trung (giản thể)'} — ` +
    `sinh bởi tools/i18n-build.js từ i18n/parts/${lang}/*.json. Đừng sửa tay. */\n` +
    `window.LNRT_I18N = window.LNRT_I18N || {};\n` +
    `window.LNRT_I18N.${lang} = `;
  fs.writeFileSync(path.join(root, 'i18n', `${lang}.js`), escapeForScript(header + body + ';\n'));
  const extra = [...parts.keys()].filter(k => !sourceKeys.includes(k));
  console.log(`${lang}: ${source.length - missing}/${source.length} câu` + (extra.length ? ` · ${extra.length} khoá bổ sung` : ''));
  if (missing) {
    for (const [f, n] of Object.entries(missingByFile).sort((a, b) => b[1] - a[1])) console.log(`   thiếu ${String(n).padStart(4)}  ${f}`);
  }
}

fs.writeFileSync(path.join(srcDir, 'coverage.json'), JSON.stringify(coverage, null, 1));
