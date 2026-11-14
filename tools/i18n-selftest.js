/* Kiểm tra nhanh i18n runtime bằng Node (không cần trình duyệt).
   Chạy: node tools/i18n-selftest.js */
'use strict';
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const root = path.resolve(__dirname, '..');
const code = fs.readFileSync(path.join(root, 'i18n/i18n.js'), 'utf8');

const body = { nodeType: 1, tagName: 'BODY', childNodes: [], hasAttribute: () => false, getAttribute: () => null, parentElement: null };
const documentElement = { setAttribute() {}, getAttribute: () => null };
const listeners = {};
const ctx = {
  console,
  URLSearchParams,
  window: {
    LNRT_I18N: {
      en: {
        'Người kể chuyện': 'Narrator',
        'Nhật ký': 'Journal',
        'Đã dùng hết: ': 'Used up: ',
        'Hiệu ứng hình ảnh: ': 'Visual effects: ',
        'Tự động': 'Auto',
        'Cao': 'High',
        'Thành tựu (': 'Achievements (',
        'Cảnh ': 'Scene ',
        'Cổng làng Đồng Chay': 'Đồng Chay village gate',
        'Tên đã được trả lại.': 'The name has been returned.',
        'HỒI ỨC ·': 'MEMORY ·'
      },
      zh: {
        'Người kể chuyện': '旁白',
        'Nhật ký': '日记',
        'Đã dùng hết: ': '已用完：',
        'Hiệu ứng hình ảnh: ': '画面特效：',
        'Tự động': '自动',
        'Cao': '高',
        'Thành tựu (': '成就（',
        'Cảnh ': '场景 ',
        'Cổng làng Đồng Chay': '同斋村口'
      }
    }
  },
  document: {
    readyState: 'loading',
    body,
    documentElement,
    title: '',
    addEventListener: (k, fn) => { listeners[k] = fn; },
    dispatchEvent() {},
    querySelector: () => null,
    querySelectorAll: () => []
  },
  navigator: { language: 'en-US' },
  localStorage: { getItem: () => null, setItem() {} },
  location: { search: '' },
  CustomEvent: class { constructor(t, o) { this.type = t; this.detail = o && o.detail; } },
  MutationObserver: class { observe() {} }
};
ctx.window.document = ctx.document;
ctx.window.navigator = ctx.navigator;
ctx.window.localStorage = ctx.localStorage;

vm.createContext(ctx);
vm.runInContext(code, ctx);
const I18N = ctx.window.I18N;
I18N.setLang('en', false);

function eq(actual, expected, label) {
  const ok = actual === expected;
  console.log((ok ? 'PASS ' : 'FAIL ') + label + (ok ? '' : `\n  got: ${JSON.stringify(actual)}\n  want: ${JSON.stringify(expected)}`));
  if (!ok) process.exitCode = 1;
}

eq(I18N.t('Nhật ký'), 'Journal', 'khớp chính xác');
eq(I18N.t('  Nhật ký  '), '  Journal  ', 'giữ khoảng trắng hai đầu');
eq(I18N.t('Đã dùng hết: Lược gỗ cũ'), 'Used up: Lược gỗ cũ', 'tiền tố + tên riêng');
eq(I18N.t('Hiệu ứng hình ảnh: Tự động (Cao)'), 'Visual effects: Auto (High)', 'mẫu ghép biến');
eq(I18N.t('Thành tựu (3/12)'), 'Achievements (3/12)', 'tiền tố + số');
eq(I18N.t('Cảnh BG15: Hành lang'), 'Scene BG15: Hành lang', 'mẫu Cảnh BGxx');
eq(I18N.t('Lê, cháu cụ Tám. Tên đã được trả lại.'), 'Lê, cháu cụ Tám. The name has been returned.', 'mẫu tên + vai');
eq(I18N.t('HỒI ỨC · 1988'), 'MEMORY · 1988', 'tiền tố HỒI ỨC');
eq(I18N.t('Không có trong từ điển'), 'Không có trong từ điển', 'không khớp thì giữ nguyên');

I18N.setLang('zh', false);
eq(I18N.t('Đã dùng hết: Lược gỗ cũ'), '已用完：Lược gỗ cũ', 'zh tiền tố');
eq(I18N.t('Nhật ký'), '日记', 'zh khớp chính xác');
eq(I18N.source('日记'), 'Nhật ký', 'tra ngược bản dịch');
I18N.setLang('vi', false);
eq(I18N.t('Nhật ký'), 'Nhật ký', 'vi trả nguyên bản');
