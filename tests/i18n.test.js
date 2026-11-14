/* Kiểm tra bản dịch: đủ khoá, không rỗng, không lẫn HTML, ba ngôn ngữ chuyển được.
   Chạy: node tests/i18n.test.js */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');

const source = JSON.parse(read('i18n/parts/source/strings.json'));
const LANGS = ['en', 'zh'];

function loadDict(lang) {
  const ctx = { window: {} };
  ctx.window.window = ctx.window;
  vm.createContext(ctx);
  vm.runInContext(read(`i18n/${lang}.js`), ctx, { filename: `${lang}.js` });
  const dict = ctx.window.LNRT_I18N && ctx.window.LNRT_I18N[lang];
  assert.ok(dict && typeof dict === 'object', `${lang}.js phải tạo window.LNRT_I18N.${lang}`);
  return dict;
}

const dicts = Object.fromEntries(LANGS.map(l => [l, loadDict(l)]));

// 1. Mọi câu trích từ mã nguồn đều phải có bản dịch.
const missing = [];
for (const lang of LANGS) {
  for (const { k } of source) {
    const v = dicts[lang][k];
    if (typeof v !== 'string' || !v.trim()) missing.push(`${lang}: ${k.slice(0, 90)}`);
  }
}
assert.equal(missing.length, 0, `Thiếu ${missing.length} bản dịch:\n${missing.slice(0, 25).join('\n')}`);

// 2. Không giá trị rỗng, không lẫn thẻ HTML, không bỏ nguyên câu dài.
const VI = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;
for (const lang of LANGS) {
  for (const [k, v] of Object.entries(dicts[lang])) {
    assert.ok(v.trim(), `${lang}: bản dịch rỗng cho "${k.slice(0, 60)}"`);
    assert.ok(!/<\/?[a-z][^>]*>/i.test(v), `${lang}: bản dịch chứa HTML cho "${k.slice(0, 60)}"`);
    if (k.length >= 25 && v === k && VI.test(k)) {
      assert.fail(`${lang}: câu dài chưa dịch — "${k.slice(0, 80)}"`);
    }
  }
}

// 3. Từ điển có ít nhất số khoá bằng danh sách nguồn.
for (const lang of LANGS) {
  assert.ok(Object.keys(dicts[lang]).length >= source.length, `${lang}.js thiếu khoá so với danh sách nguồn`);
}

// 4. i18n runtime phải tải được và dịch đúng vài câu then chốt.
const body = { nodeType: 1, tagName: 'BODY', childNodes: [], hasAttribute: () => false, getAttribute: () => null, parentElement: null };
const ctx = {
  console,
  URLSearchParams,
  window: { LNRT_I18N: dicts },
  document: {
    readyState: 'loading', body,
    documentElement: { setAttribute() {}, getAttribute: () => null },
    title: '', addEventListener() {}, dispatchEvent() {}, querySelector: () => null, querySelectorAll: () => []
  },
  navigator: { language: 'vi' },
  localStorage: { getItem: () => null, setItem() {} },
  location: { search: '' },
  CustomEvent: class {},
  MutationObserver: class { observe() {} }
};
ctx.window.document = ctx.document;
vm.createContext(ctx);
vm.runInContext(read('i18n/i18n.js'), ctx, { filename: 'i18n.js' });
const I18N = ctx.window.I18N;
assert.ok(I18N, 'i18n.js phải tạo window.I18N');

I18N.setLang('en', false);
assert.equal(I18N.t('Người kể chuyện'), dicts.en['Người kể chuyện']);
assert.ok(I18N.t('Đã dùng hết: Lược gỗ cũ').startsWith(dicts.en['Đã dùng hết:']), 'dịch được câu ghép tiền tố');
I18N.setLang('zh', false);
assert.equal(I18N.t('Người kể chuyện'), dicts.zh['Người kể chuyện']);
I18N.setLang('vi', false);
assert.equal(I18N.t('Người kể chuyện'), 'Người kể chuyện');

console.log(`i18n OK — ${source.length} câu × ${LANGS.length} ngôn ngữ.`);
