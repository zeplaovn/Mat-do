/* VFX — hiệu ứng môi trường và phản hồi chạm. Không đọc/ghi trạng thái game, chỉ quan sát DOM.
   Tự tắt khi: tab ẩn, đang tải, đang ở màn hình chính, đang xem cận cảnh, giảm chuyển động, mức hiệu ứng "thấp",
   hoặc người chơi tắt "hiệu ứng ánh sáng" trong Menu. */
(() => {
'use strict';
const $ = id => document.getElementById(id);
const stage = $('scene-stage'), img = $('scene-image'), hot = $('hotspots');
if (!stage || !img || !hot) return;
const root = document.documentElement, shell = $('app-shell'), title = $('title-screen');
const RM = matchMedia('(prefers-reduced-motion: reduce)');
const level = () => root.dataset.fx || 'medium';
const mk = (tag, cls) => { const e = document.createElement(tag); e.className = 'fx ' + cls; e.setAttribute('aria-hidden', 'true'); stage.insertBefore(e, hot); return e; };
const fog = mk('div', 'vfx-fog'), glows = mk('div', 'vfx-glows'), cv = mk('canvas', 'vfx-motes'), wipe = mk('div', 'vfx-wipe');
const ctx = (() => { try { return cv.getContext('2d'); } catch (_) { return null; } })();

const live = () => !document.hidden && title && title.hidden && !root.classList.contains('is-busy')
  && !RM.matches && root.dataset.lightEffects !== 'off' && !(shell && shell.classList.contains('interaction-active'));
const rich = () => level() !== 'low';

/* ---------- 1. Phân tích ảnh nền: độ sáng chung + vị trí các nguồn sáng ấm (đèn lồng, đèn dầu) ---------- */
const cache = new Map();
function analyse(src) {
  if (cache.has(src)) return cache.get(src);
  let out = { mean: 128, lamps: [] };
  try {
    const W = 96, H = 54, c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d', { willReadFrequently: true });
    g.drawImage(img, 0, 0, W, H);
    const d = g.getImageData(0, 0, W, H).data, cells = [];
    let sum = 0;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4, r = d[i], gg = d[i + 1], b = d[i + 2], l = .299 * r + .587 * gg + .114 * b;
      sum += l;
      if (l > 165 && r > b + 35 && r >= gg * .95) cells.push([x, y, l]);
    }
    out.mean = sum / (W * H);
    cells.sort((a, b) => b[2] - a[2]);
    for (const [x, y, l] of cells) {
      if (out.lamps.length >= 6) break;
      if (out.lamps.every(p => Math.hypot(p.x * W - x, p.y * H - y) > 11)) out.lamps.push({ x: x / W, y: y / H, l });
    }
  } catch (_) { /* ảnh không đọc được điểm ảnh (ví dụ mở bằng file://): bỏ qua, không ảnh hưởng game */ }
  cache.set(src, out);
  return out;
}

let mode = 'none';   // 'night' | 'day' | 'none'
function setup() {
  glows.textContent = '';
  glows.classList.remove('on'); fog.classList.remove('on'); cv.classList.remove('on');
  if (!img.complete || !img.naturalWidth || !rich()) { mode = 'none'; return; }
  const a = analyse(img.currentSrc || img.src);
  mode = a.mean < 95 ? 'night' : 'day';
  if (mode === 'night') {
    a.lamps.forEach(p => {
      const s = document.createElement('i'), size = 7 + (p.l - 165) / 90 * 5;
      s.className = 'vfx-glow';
      s.style.cssText = `left:${p.x * 100}%;top:${p.y * 100}%;width:${size}%;aspect-ratio:1;--d:${(2.8 + Math.random() * 2.4).toFixed(2)}s;--dl:-${(Math.random() * 3).toFixed(2)}s`;
      glows.appendChild(s);
    });
    glows.classList.add('on');
  }
  fog.classList.toggle('day', mode === 'day');
  fog.classList.add('on');
  seed();
  cv.classList.add('on');
}

/* ---------- 2. Hạt: đom đóm ban đêm, bụi sáng ban ngày ---------- */
let motes = [], W = 2, H = 2, raf = 0, last = 0;
const COUNT = { low: 0, medium: 22, high: 40 }, FPS = { low: 20, medium: 30, high: 40 };
function resize() {
  const w = Math.max(2, stage.clientWidth / 2 | 0), h = Math.max(2, stage.clientHeight / 2 | 0);
  if (w !== W || h !== H) { W = cv.width = w; H = cv.height = h; }
}
function seed() {
  const n = COUNT[level()] || 0;
  motes = Array.from({ length: n }, () => ({
    x: Math.random(), y: mode === 'night' ? .3 + Math.random() * .65 : Math.random(),
    vx: (Math.random() - .5) * .006, vy: mode === 'night' ? (Math.random() - .5) * .004 : -.002 - Math.random() * .004,
    p: Math.random() * 6.28, r: 1 + Math.random() * 1.8
  }));
  schedule();
}
function frame(t) {
  raf = 0;
  if (!ctx || mode === 'none' || !live()) { if (ctx) ctx.clearRect(0, 0, W, H); return; }
  raf = requestAnimationFrame(frame);
  if (t - last < 1000 / (FPS[level()] || 30)) return;
  const dt = Math.min(80, t - last) / 16; last = t;
  ctx.clearRect(0, 0, W, H);
  const night = mode === 'night';
  for (const m of motes) {
    m.p += .03 * dt;
    m.x += (m.vx + Math.sin(m.p) * .0012) * dt; m.y += (m.vy + Math.cos(m.p * .8) * .0009) * dt;
    if (m.x < -.05) m.x = 1.05; else if (m.x > 1.05) m.x = -.05;
    if (m.y < -.05) m.y = 1.05; else if (m.y > 1.05) m.y = -.05;
    const a = night ? .25 + .75 * Math.max(0, Math.sin(m.p * 1.7)) : .22 + .12 * Math.sin(m.p);
    const x = m.x * W, y = m.y * H, r = m.r * (night ? 3.2 : 2);
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, night ? `rgba(255,232,150,${a})` : `rgba(255,248,232,${a})`);
    g.addColorStop(1, 'rgba(255,220,140,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill();
  }
}
function schedule() { if (!raf && mode !== 'none' && live()) raf = requestAnimationFrame(frame); }

/* ---------- 3. Chuyển cảnh: đổi ảnh nền thì tối nhanh rồi sáng lại ---------- */
let lastSrc = img.getAttribute('src');
new MutationObserver(() => {
  const s = img.getAttribute('src');
  if (s === lastSrc) return;
  lastSrc = s;
  glows.classList.remove('on'); fog.classList.remove('on');
  if (live()) {
    wipe.classList.remove('go'); stage.classList.remove('vfx-settle'); void wipe.offsetWidth;
    wipe.classList.add('go'); stage.classList.add('vfx-settle');
    setTimeout(() => { wipe.classList.remove('go'); stage.classList.remove('vfx-settle'); }, 720);
  }
}).observe(img, { attributes: true, attributeFilter: ['src'] });
img.addEventListener('load', () => { setup(); });
if (img.complete) setup();

/* ---------- 4. Gợn chạm trên cảnh ---------- */
stage.addEventListener('pointerdown', e => {
  if (!live() || e.button > 0) return;
  const r = stage.getBoundingClientRect(), s = document.createElement('span');
  s.className = 'vfx-tap'; s.style.left = (e.clientX - r.left) + 'px'; s.style.top = (e.clientY - r.top) + 'px';
  stage.appendChild(s); setTimeout(() => s.remove(), 700);
}, { passive: true });

/* ---------- 5. Nhặt vật phẩm: tia sáng bay vào thanh túi đồ ---------- */
const pop = $('item-pop'), dock = $('item-dock');
if (pop && dock) new MutationObserver(muts => {
  if (!live() || !muts.some(m => [...m.addedNodes].some(n => n.nodeType === 1))) return;
  const slots = dock.querySelectorAll('.dock-slot'), tgt = slots[slots.length - 1] || dock, r = tgt.getBoundingClientRect();
  if (!r.width) return;
  dock.classList.remove('vfx-dock-pulse'); void dock.offsetWidth; dock.classList.add('vfx-dock-pulse');
  setTimeout(() => dock.classList.remove('vfx-dock-pulse'), 950);
  const n = level() === 'low' ? 5 : 11;
  for (let i = 0; i < n; i++) {
    const s = document.createElement('i'), a = Math.PI * 2 * i / n + Math.random() * .5, d = 26 + Math.random() * 34;
    s.className = 'vfx-spark';
    s.style.cssText = `left:${r.left + r.width / 2}px;top:${r.top + r.height / 2}px;--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d - 10}px`;
    document.body.appendChild(s); setTimeout(() => s.remove(), 850);
  }
}).observe(pop, { childList: true });

/* ---------- 6. Theo dõi trạng thái để bật/tắt vòng lặp ---------- */
if (typeof ResizeObserver !== 'undefined') new ResizeObserver(resize).observe(stage); else addEventListener('resize', resize, { passive: true });
resize();
document.addEventListener('visibilitychange', schedule);
new MutationObserver(() => { schedule(); }).observe(root, { attributes: true, attributeFilter: ['class', 'data-fx', 'data-light-effects'] });
if (title) new MutationObserver(schedule).observe(title, { attributes: true, attributeFilter: ['hidden'] });
if (shell) new MutationObserver(schedule).observe(shell, { attributes: true, attributeFilter: ['class'] });
RM.addEventListener && RM.addEventListener('change', () => { setup(); schedule(); });
window.VFX = { get mode() { return mode; }, refresh: setup };
})();
