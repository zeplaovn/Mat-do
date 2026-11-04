/* GUARD — chặn sao chép / cắt / dán / chọn văn bản, kéo thả, chuột phải và các phím tắt "lấy nội dung" thông thường.
   LƯU Ý: game chạy hoàn toàn trên trình duyệt của người chơi, nên đây là lớp CẢN TRỞ người dùng thường,
   không thể ngăn người có kỹ năng (xem nguồn, công cụ lập trình, chụp màn hình). Nạp đồng bộ đầu <head>. */
(() => {
'use strict';
const inField = t => !!(t && t.closest && t.closest('input,textarea'));
const inBook = t => !!(t && t.closest && t.closest('.research-page-content'));
const canSelect = t => inField(t) || inBook(t);
const block = e => { e.preventDefault(); e.stopPropagation(); };

['copy', 'cut', 'paste', 'dragstart', 'drop', 'contextmenu'].forEach(n => document.addEventListener(n, e => { if (!(inField(e.target) || (n === 'copy' && inBook(e.target)))) block(e); }, true));
document.addEventListener('selectstart', e => { if (!canSelect(e.target)) block(e); }, true);
document.addEventListener('beforeinput', e => { if (!inField(e.target) && /^(insertFromPaste|insertFromDrop|insertFromYank|deleteByCut)/.test(e.inputType || '')) block(e); }, true);

document.addEventListener('keydown', e => {
  const k = String(e.key || '').toLowerCase(), mod = e.ctrlKey || e.metaKey;
  if (inField(e.target) || (inBook(e.target) && mod && ['c','a'].includes(k))) return;
  const bad =
    e.key === 'F12' ||
    (mod && !e.shiftKey && !e.altKey && ['c', 'x', 'v', 'a', 's', 'u', 'p'].includes(k)) ||   // copy, cut, paste, chọn hết, lưu, xem nguồn, in
    (mod && e.shiftKey && ['i', 'j', 'c', 'k'].includes(k)) ||                                // công cụ lập trình
    (e.metaKey && e.altKey && ['i', 'j', 'c', 'u'].includes(k)) ||                            // macOS
    (e.shiftKey && (k === 'insert' || k === 'delete')) ||                                     // dán / cắt kiểu cũ
    (mod && k === 'insert');
  if (bad) block(e);
}, true);

document.addEventListener('selectionchange', () => {
  const s = window.getSelection && window.getSelection();
  if (s && !s.isCollapsed && !inField(document.activeElement)) {
    const el = s.anchorNode && (s.anchorNode.nodeType === 1 ? s.anchorNode : s.anchorNode.parentElement);
    if (!inBook(el)) s.removeAllRanges();
  }
});
})();
