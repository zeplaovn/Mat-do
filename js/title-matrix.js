/* Mưa chữ kiểu "matrix" trên màn hình chính: chữ Phạn (Devanagari) và chữ Nôm cổ, màu vàng kim.
   Chỉ chạy khi màn hình chính đang hiện; tắt khi hiệu ứng thấp hoặc tab ẩn.
   Cố ý không tắt theo prefers-reduced-motion: hiệu ứng chậm, không nhấp nháy, là nền trang trí;
   các hiệu ứng chớp/rung vẫn tôn trọng cài đặt giảm chuyển động. */
(() => {
  'use strict';
  const title = document.getElementById('title-screen');
  const bg = title && title.querySelector('.title-bg');
  if (!title || !bg) return;
  let cv, ctx;
  try { cv = document.createElement('canvas'); ctx = cv.getContext('2d'); } catch (_) { return; }
  if (!ctx) return;
  cv.className = 'title-matrix'; cv.setAttribute('aria-hidden', 'true');
  bg.after(cv);

  /* Phạn: nguyên âm, phụ âm và âm thiêng. Nôm: các chữ BMP thường gặp trong chữ Nôm / Hán-Nôm cổ. */
  const SANSKRIT = 'ॐअआइईउऊऋएऐओऔकखगघङचछजझटठडढणतथदधनपफबभमयरलवशषसह॥।ॠऌ'.match(/./gu);
  const NOM = '咹渃吶𢆥茹𠊚坦𠀧𡗶𣎏𤾓喈𡥵𠓀吏吝𠃩𢀷𢚸命魂鬼靈墓厄咒符祭神山林村家雨夜月𠄩𠀧'.match(/./gu).filter(c => c.codePointAt(0) < 0x10000);
  const GLYPHS = SANSKRIT.concat(NOM, NOM);
  const FONT = '"Noto Serif Devanagari","Noto Sans Devanagari","Nirmala UI","Mangal","Noto Serif CJK SC","Noto Sans CJK SC","SimSun","PingFang SC","Hiragino Sans GB",serif';

  let cols = [], W = 0, H = 0, size = 18, raf = 0, last = 0, on = false;
  const lowFx = () => document.documentElement.getAttribute('data-fx') === 'low';
  const allowed = () => !document.hidden && !title.hidden && !lowFx();

  const cell = () => size * 1.35;
  function resize() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    W = title.clientWidth; H = title.clientHeight;
    if (!W || !H) return;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    size = W < 600 ? 16 : 19;
    const n = Math.min(60, Math.ceil(W / (size * 1.6)));
    const rows = Math.ceil(H / cell());
    cols = Array.from({ length: n }, (_, i) => ({
      x: (i + .5) * (W / n), row: -(Math.random() * rows * 1.2 | 0), t: 0, step: 70 + Math.random() * 110
    }));
  }

  /* Mỗi cột rơi theo từng ô: một chữ mới ở đầu cột, chữ cũ mờ dần để lại vệt (như phim Matrix). */
  function frame(t) {
    raf = 0;
    if (!allowed()) { stop(); return; }
    raf = requestAnimationFrame(frame);
    const hi = document.documentElement.getAttribute('data-fx') === 'high';
    if (t - last < 1000 / (hi ? 30 : 20)) return;
    const dt = Math.min(100, t - last); last = t;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0,0,0,.07)'; ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'source-over';
    ctx.font = size + 'px ' + FONT; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const ch = cell(), rows = Math.ceil(H / ch);
    for (const c of cols) {
      c.t += dt;
      if (c.t < c.step) continue;
      c.t = 0;
      const y = c.row * ch + ch / 2;
      if (c.row >= 0 && y < H + ch) {
        /* làm dịu chữ đầu cũ thành vàng sẫm rồi vẽ chữ đầu mới sáng */
        ctx.shadowBlur = 0; ctx.fillStyle = 'rgba(0,0,0,0)';
        if (hi) { ctx.shadowColor = 'rgba(255,190,70,.9)'; ctx.shadowBlur = 9; }   /* shadowBlur rất tốn: chỉ ở mức Cao */
        ctx.fillStyle = 'rgba(255,238,175,.96)';
        ctx.fillText(GLYPHS[Math.random() * GLYPHS.length | 0], c.x, y);
        ctx.shadowBlur = 0;
        if (c.row > 0) { ctx.fillStyle = 'rgba(218,165,60,.7)'; ctx.fillText(GLYPHS[Math.random() * GLYPHS.length | 0], c.x, y - ch); }
      }
      c.row++;
      if (c.row > rows + 2) { c.row = -(Math.random() * rows * .6 | 0); c.step = 70 + Math.random() * 110; }
    }
    ctx.shadowBlur = 0;
  }
  function start() { if (!raf && allowed()) { if (!cols.length) resize(); on = true; raf = requestAnimationFrame(frame); } }
  function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; on = false; if (ctx && W) ctx.clearRect(0, 0, W, H); }
  const sync = () => { allowed() ? start() : stop(); };

  new MutationObserver(sync).observe(title, { attributes: true, attributeFilter: ['hidden', 'class', 'aria-hidden'] });
  document.addEventListener('visibilitychange', sync);
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(() => { resize(); sync(); }).observe(title);
  else addEventListener('resize', () => { resize(); sync(); }, { passive: true });
  resize(); sync();
})();
