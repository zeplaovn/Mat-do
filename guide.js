/* Màn Lưu ý, tiêu đề chương và hướng dẫn chạm (chữ + bàn tay chỉ). Chỉ dùng DOM nên không đụng vào trạng thái game. */
(() => {
'use strict';
const $ = id => document.getElementById(id);
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (_) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (_) {} }
};
const RM = () => !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

/* ---------- 2. Tiêu đề chương ---------- */
const chapterEl = $('chapter-label'), card = $('chapter-card');
let lastChapter = null, cardTimer = 0;
function chapterParts(txt) {
  const m = /^(CHƯƠNG\s*\d+)\s*·\s*(.+)$/i.exec((txt || '').trim());
  return m ? { no: m[1].toUpperCase(), name: m[2] } : null;
}
function showChapter(p) {
  if (!card) return;
  $('chapter-card-no').textContent = p.no;
  $('chapter-card-name').textContent = p.name.toLowerCase().replace(/(^|\s)\S/g, c => c.toUpperCase());
  card.classList.remove('on'); void card.offsetWidth; card.classList.add('on');
  clearTimeout(cardTimer); cardTimer = setTimeout(() => card.classList.remove('on'), RM() ? 2600 : 3600);
}
if (chapterEl && card && typeof MutationObserver === 'function') {
  new MutationObserver(() => {
    const t = chapterEl.textContent;
    if (t === lastChapter) return;
    const first = lastChapter === null; lastChapter = t;
    const title = $('title-screen');
    if (first || (title && !title.hidden)) return;
    const p = chapterParts(t);
    if (p) showChapter(p);
  }).observe(chapterEl, { childList: true, characterData: true, subtree: true });
  lastChapter = chapterEl.textContent;
}

/* ---------- 3. Chữ gợi ý + bàn tay chỉ ---------- */
const TAP_KEY = 'lnrt-tut-tap-v1', ITEM_KEY = 'lnrt-tut-item-v1';
const text = $('tut-text'), hand = $('tut-hand');
let shown = null;
function hide() { if (text) text.hidden = true; if (hand) hand.hidden = true; shown = null; }
function place(el, msg) {
  const r = el.getBoundingClientRect();
  if (r.width < 4 || r.right < 8 || r.left > innerWidth - 8 || r.top < 40 || r.bottom > innerHeight) return false;
  text.textContent = msg; text.hidden = false;
  const cx = r.left + r.width / 2, cy = r.top + r.height * (el.classList && el.classList.contains('hotspot--travel') ? .84 : .5);
  hand.style.left = Math.round(Math.min(innerWidth - 50, cx - 4)) + 'px'; hand.style.top = Math.round(Math.min(innerHeight - 58, cy + 26)) + 'px'; hand.hidden = false;
  text.style.left = '50%'; const above = cy > innerHeight * 0.45, half = (text.offsetWidth || 200) / 2;
  text.style.left = Math.max(12 + half, Math.min(innerWidth - 12 - half, cx)) + 'px';
  text.style.top = above ? Math.max(60, cy - 112) + 'px' : Math.min(innerHeight - 90, cy + 84) + 'px';
  return true;
}
function busy() {
  const t = $('title-screen'), d = $('dialogue'), m = $('modal-backdrop'), i = $('intro');
  return document.hidden || document.documentElement.classList.contains('is-loading') || (($('notice-screen')||{}).hidden===false) ||
    (t && !t.hidden) || (d && !d.hidden) || (m && !m.hidden) || (i && !i.hidden) || !!document.querySelector('.scene-stage.cam-on');
}
function tick() {
  if (!text || !hand) return;
  if (busy()) { if (shown) hide(); return; }
  if (!store.get(TAP_KEY)) {
    const h = [...document.querySelectorAll('#hotspots .hotspot')].find(b => { const r = b.getBoundingClientRect(); return r.width > 2 && r.left > 8 && r.right < innerWidth - 8 && r.top > 60 && r.bottom < innerHeight - 90; });
    if (h && place(h, 'Chạm vào biểu tượng sáng để xem gần')) { shown = 'tap'; return; }
  } else if (!store.get(ITEM_KEY)) {
    const s = document.querySelector('#inventory-grid .dock-slot');
    if (s && place(s, 'Chạm vào vật phẩm để chọn, rồi chạm vào cảnh để dùng')) { shown = 'item'; return; }
  }
  if (shown) hide();
}
document.addEventListener('click', e => {
  const t = e.target && e.target.closest ? e.target : null; if (!t) return;
  if (t.closest('.hotspot') && !store.get(TAP_KEY)) { store.set(TAP_KEY, '1'); hide(); }
  else if (t.closest('.dock-slot') && store.get(TAP_KEY) && !store.get(ITEM_KEY)) { store.set(ITEM_KEY, '1'); hide(); }
}, true);
setInterval(tick, 700);
})();
