/* PERF — chọn mức hiệu ứng (low / medium / high) theo cấu hình máy, tự hạ mức nếu bị giật.
   Nạp đồng bộ trong <head> để html[data-fx] có giá trị trước khi trình duyệt vẽ khung đầu tiên. */
(() => {
'use strict';
const KEY = 'lnrt-fx-pref';
const ORDER = ['low', 'medium', 'high'];
const PREFS = ['auto', 'high', 'medium', 'low'];
const root = document.documentElement;
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const read = () => { try { return localStorage.getItem(KEY); } catch (_) { return null; } };
const write = v => { try { localStorage.setItem(KEY, v); } catch (_) {} };

function guess() {
  if (RM) return 'low';
  const coarse = matchMedia('(pointer: coarse)').matches;
  const cores = navigator.hardwareConcurrency || 4;
  const mem = navigator.deviceMemory || (coarse ? 4 : 8);   // Safari/Firefox không báo RAM
  const px = screen.width * screen.height * Math.pow(window.devicePixelRatio || 1, 2);
  let weak = 0;
  if (cores <= 2) weak += 2; else if (cores <= 4) weak += 1;
  if (mem <= 2) weak += 2; else if (mem <= 4) weak += 1;
  if (coarse) weak += 1;
  if (px > 8e6) weak += 1;                                  // màn hình ~4K: nhiều điểm ảnh phải vẽ
  return weak >= 3 ? 'low' : weak >= 1 ? 'medium' : 'high';
}

let pref = PREFS.includes(read()) ? read() : 'auto';
let level = pref === 'auto' ? guess() : pref;
const listeners = [];
const apply = () => {
  root.dataset.fx = level;
  root.dataset.fxPref = pref;
  listeners.forEach(fn => { try { fn(level, pref); } catch (_) {} });
};
apply();

/* Theo dõi FPS một lúc sau khi vào game; nếu giật thì hạ một bậc (chỉ khi để chế độ Tự động). */
let watching = false;
function watch(ms = 20000) {
  if (pref !== 'auto' || watching || level === 'low') return;
  watching = true;
  let end = performance.now() + ms, prev = 0;
  const buf = [];
  const tick = t => {
    if (!watching) return;
    if (pref !== 'auto' || level === 'low') { watching = false; return; }
    if (document.hidden) { prev = 0; buf.length = 0; }
    else {
      if (prev && t - prev < 250) buf.push(t - prev);
      prev = t;
      if (buf.length >= 90) {
        buf.sort((a, b) => a - b);
        const med = buf[buf.length >> 1], p90 = buf[Math.floor(buf.length * .9)];
        buf.length = 0;
        if (med > 24 || p90 > 42) { level = ORDER[ORDER.indexOf(level) - 1]; apply(); end = t + 8000; }
      }
    }
    if (t < end) requestAnimationFrame(tick); else watching = false;
  };
  requestAnimationFrame(tick);
}

window.Perf = {
  RM,
  get level() { return level; },
  get pref() { return pref; },
  set(p) {
    if (!PREFS.includes(p)) return;
    pref = p; write(p);
    level = p === 'auto' ? guess() : p;
    apply();
    if (p === 'auto') watch();
  },
  cycle() { this.set(PREFS[(PREFS.indexOf(pref) + 1) % PREFS.length]); },
  onChange(fn) { listeners.push(fn); },
  watch
};
})();
