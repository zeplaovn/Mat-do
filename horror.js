/* HORROR — lớp VFX kinh dị (không còn âm thanh sinh bằng code), độc lập với game.js (chỉ quan sát DOM).
   Bản gộp: giữ đầy đủ hiệu ứng gốc của "Mắt đỏ" (vignette bám con trỏ, scanline,
   grain blend, nhịp máu, chớp đèn, logo rè SVG) + hệ thống 3 mức của bản origin.
   Phần lớn hiệu ứng chạy bằng CSS (transform/opacity); canvas chỉ còn lớp bụi nhỏ;
   nhiễu hạt sinh một lần thành ảnh 64px rồi dịch chuyển bằng CSS. */
(() => {
'use strict';
const $ = id => document.getElementById(id);
const root = document.documentElement;
const stage = $('scene-stage'), img = $('scene-image'), hot = $('hotspots'), title = $('title-screen');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const RM = () => motion.matches;
const lighting = () => {
  if(window.WeatherFX)return WeatherFX.enabled;
  try{return localStorage.getItem('lnrt-light-effects')!=='0'}catch(_){return true}
};
const lvl = () => Perf.level;
const busy = () => root.classList.contains('is-busy');            // đang loading / intro
const running = () => title.hidden && !busy();                   // đang chơi thật
const audioOn = () => $('btn-audio').getAttribute('aria-pressed') !== 'false';
let dread = .15, lastScare = 0, bt = 0;
const sceneNo = () => parseInt(($('scene-index').textContent.match(/BG(\d+)/) || [0, 1])[1], 10);

/* ---------- Lớp hiệu ứng (thứ tự = thứ tự chồng) ---------- */
const mk = (tag, cls) => { const e = document.createElement(tag); e.className = 'fx ' + cls; e.setAttribute('aria-hidden', 'true'); stage.insertBefore(e, hot); return e; };
mk('div', 'fx-fog');
const dust = mk('canvas', 'fx-dust');
const grain = mk('div', 'fx-grain');
mk('div', 'fx-blood');
mk('div', 'fx-vignette');
mk('div', 'fx-scan');
const shadow = mk('div', 'fx-shadow'), glitchL = mk('div', 'fx-glitch'), flash = mk('div', 'fx-flash');

/* Hạt nhiễu: sinh MỘT lần thành ảnh nhỏ, sau đó chỉ dịch chuyển bằng CSS (không vẽ lại mỗi khung). */
try {
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const x = c.getContext('2d');if(!x)throw new Error('Canvas unavailable');
  const d = x.createImageData(64, 64), p = new Uint32Array(d.data.buffer);
  for (let i = 0; i < p.length; i++) { const v = Math.random() * 255 | 0, a = (Math.random() * 38) | 0; p[i] = (a << 24) | (v << 16) | (v << 8) | v; }
  x.putImageData(d, 0, 0);
  grain.style.setProperty('--grain', `url(${c.toDataURL()})`);
} catch (_) { /* Các hiệu ứng khác vẫn hoạt động khi không có canvas. */ }

/* ---------- Bụi lơ lửng, giảm số hạt và khung hình trên máy yếu ---------- */
let dctx=null;try{dctx=dust.getContext('2d')}catch(_){}
const COUNT = { low: 14, medium: 22, high: 46 }, FPS = { low: 12, medium: 15, high: 30 };
let DW = 2, DH = 2, raf = 0, last = 0;
const motes = Array.from({ length: 46 }, () => ({ x: Math.random(), y: Math.random(), r: .5 + Math.random() * .9, vx: (Math.random() - .5) * .00012, vy: -.00004 - Math.random() * .0001, a: .15 + Math.random() * .5, p: Math.random() * 6 }));
const resize = () => { DW = dust.width = Math.max(2, stage.clientWidth / 3 | 0); DH = dust.height = Math.max(2, stage.clientHeight / 3 | 0); };
if(typeof ResizeObserver!=='undefined')new ResizeObserver(resize).observe(stage);
else window.addEventListener('resize',resize,{passive:true});
window.addEventListener('orientationchange',resize,{passive:true});resize();
const wantDust = () => !!dctx && !RM() && !document.hidden && running();
function frame(t) {
  raf = 0;
  if (!wantDust()) return;
  raf = requestAnimationFrame(frame);
  if (t - last < 1000 / FPS[lvl()]) return;
  const dt = Math.min(100, t - last); last = t;
  dctx.clearRect(0, 0, DW, DH);
  const n = COUNT[lvl()], red = dread > .7;
  dctx.fillStyle = red ? 'rgb(200,50,40)' : 'rgb(210,200,185)';
  for (let i = 0; i < n; i++) {
    const m = motes[i];
    m.x += m.vx * dt + Math.sin(t / 1800 + m.p) * .0002; m.y += m.vy * dt;
    if (m.y < -.02) { m.y = 1.02; m.x = Math.random(); }
    dctx.globalAlpha = m.a * (red ? .8 : .6);
    dctx.fillRect(m.x * DW - m.r, m.y * DH - m.r, m.r * 2, m.r * 2);
  }
}
const kick = () => { if (!raf && wantDust()) raf = requestAnimationFrame(frame); else if (dctx&&!wantDust()) dctx.clearRect(0, 0, DW, DH); };
document.addEventListener('visibilitychange', kick);
window.addEventListener('pageshow',()=>{resize();kick()});
if(motion.addEventListener)motion.addEventListener('change',kick);else if(motion.addListener)motion.addListener(kick);
new MutationObserver(kick).observe(title, { attributes: true, attributeFilter: ['hidden'] });
new MutationObserver(kick).observe(root, { attributes: true, attributeFilter: ['class'] });

/* ---------- Âm thanh: CHỈ dùng tệp trong assets/sound (không còn âm thanh tạo bằng code/WebAudio) ---------- */
function playAsset(file, vol, from) {
  if (!audioOn()) return;
  try {
    const a = new Audio('assets/sound/' + file); a.volume = Math.min(1, vol);
    const go = () => { try { if (from) a.currentTime = from; } catch (_) {} a.play().catch(() => {}); };
    a.readyState >= 1 ? go() : a.addEventListener('loadedmetadata', go, { once: true });
  } catch (_) {}
}

/* ---------- Nhịp tim: máu ở rìa đập theo nhịp (lớp .beat như bản Mắt đỏ) + tiếng thình thịch ---------- */
function beatLoop() {
  clearTimeout(bt);
  if (running() && !document.hidden) {
    if (!RM()) { stage.classList.remove('beat'); void stage.offsetWidth; stage.classList.add('beat'); }
  }
  bt = setTimeout(beatLoop, 1600 - dread * 950);
}
beatLoop();

/* ---------- Jump scare / glitch / chớp đèn ---------- */
const pulse = (el, cls, ms) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); setTimeout(() => el.classList.remove(cls), ms); };
function scare(big) {
  if (RM()) return;
  if (!big && Date.now() - lastScare < 9000) return;
  lastScare = Date.now();
  shadow.style.left = Math.random() < .5 ? '5%' : '72%';
  pulse(shadow, 'show', 750); if(lighting())pulse(flash, 'on', 560); pulse(stage, 'shake', 520);
  playAsset('door-slam.mp3', .8, 3.7);   // cú đập cửa thay cho tiếng "sting" tạo bằng code
}
function onScene() {
  const n = sceneNo(); dread = Math.min(1, .1 + (n - 1) * .0475);
  stage.style.setProperty('--dread', dread.toFixed(2));
  stage.classList.toggle('dread-high', dread > .8);
  if (!RM()) { pulse(stage, 'fadein', 1100); pulse(stage, 'glitching', 450); }
}
new MutationObserver(onScene).observe($('scene-index'), { childList: true, characterData: true, subtree: true });
onScene();
setInterval(() => {
  if (!running() || document.hidden || !$('modal-backdrop').hidden) return;
  const n = sceneNo();
  if (n >= 6 && !RM() && lighting() && Math.random() < .2 + dread * .25) pulse(stage, 'flick', 460);   // chớp đèn
  if (n >= 9 && Math.random() < dread * .07) scare(false);
}, 4000);

/* ---------- Đèn pin mềm bám con trỏ + parallax nhẹ (gộp theo khung hình) ---------- */
let pend = 0, px = 0, py = 0;
stage.addEventListener('pointermove', e => {
  if (RM()) return;
  px = e.clientX; py = e.clientY;
  if (!pend) pend = requestAnimationFrame(() => {
    pend = 0;
    const b = stage.getBoundingClientRect();
    const mx = (px - b.left) / b.width, my = (py - b.top) / b.height;
    stage.style.setProperty('--fx-x', (mx * 100).toFixed(1) + '%');
    stage.style.setProperty('--fx-y', (my * 100).toFixed(1) + '%');
    if (lvl() === 'high') img.style.transform = `scale(1.05) translate(${((mx - .5) * -10).toFixed(1)}px,${((my - .5) * -6).toFixed(1)}px)`;
  });
});
Perf.onChange(l => { if (l !== 'high') img.style.transform = ''; kick(); });

/* ---------- Hội thoại gõ từng chữ ---------- */
const dt = $('dialogue-text'); let lastSet = '', ti = 0;
const setT = t => { lastSet = t; dt.textContent = t; };
let typing = false, curFull = '';
const finishNow = () => { if (!typing) return false; clearInterval(ti); typing = false; setT(curFull); return true; };
window.finishTyping = finishNow;
new MutationObserver(() => {
  const full = dt.textContent; if (!full || full === lastSet) return;
  clearInterval(ti); let i = 0; setT(''); typing = true; curFull = full;
  ti = setInterval(() => { i += 1; setT(full.slice(0, i)); if (i >= full.length) { clearInterval(ti); typing = false; } }, 24);
  dt.onclick = () => { finishNow(); };
}).observe(dt, { childList: true, characterData: true, subtree: true });

/* ---------- Kết thúc xấu = scare lớn ---------- */
new MutationObserver(() => { const e = document.querySelector('#modal-body .ending-number'); if (e && /BAD/.test(e.textContent)) scare(true); })
  .observe($('modal-body'), { childList: true });

/* ---------- Màn hình tiêu đề: sương, máu nhỏ giọt, cảnh báo ---------- */
const tf = document.createElement('div'); tf.className = 'title-fog'; tf.setAttribute('aria-hidden', 'true'); title.insertBefore(tf, title.querySelector('.title-content'));
for (let i = 0; i < 10; i++) { const d = document.createElement('i'); d.className = 'drip'; d.setAttribute('aria-hidden', 'true');
  d.style.left = (4 + Math.random() * 92) + '%'; d.style.setProperty('--len', (70 + Math.random() * 190) + 'px'); d.style.animationDelay = (-Math.random() * 9) + 's'; d.style.animationDuration = (7 + Math.random() * 6) + 's'; title.appendChild(d); }
const warn = document.createElement('div'); warn.className = 'title-warn'; warn.setAttribute('role', 'note');
const wi = document.createElement('span'); wi.className = 'warn-ico'; wi.setAttribute('aria-hidden', 'true'); wi.textContent = '⚠';
const wt = document.createElement('span'); wt.className = 'warn-text';
const wb = document.createElement('b'); wb.textContent = 'CẢNH BÁO';
wt.append(wb, ' Có yếu tố kinh dị, hiệu ứng chớp sáng và âm thanh lớn. Nên đeo tai nghe, chơi trong phòng tối.');
warn.append(wi, wt);
const flare = document.createElement('div'); flare.className = 'title-flare'; flare.setAttribute('aria-hidden', 'true');
title.insertBefore(flare, title.querySelector('.title-content'));
$('btn-new-game').parentElement.before(warn);
/* Ánh sáng nhấp nháy quanh cảnh báo: loạt chớp ngắn, ngẫu nhiên, cách nhau vài giây (không quá 3 lần chớp mỗi giây). */
let wt2 = 0;
function warnFlicker() {
  clearTimeout(wt2);
  if (RM() || !lighting() || title.hidden || busy() || document.hidden) { wt2 = setTimeout(warnFlicker, 900); return; }
  const n = 1 + (Math.random() < .45 ? 1 : 0) + (Math.random() < .15 ? 1 : 0);
  let i = 0;
  const step = () => {
    warn.classList.add('burst'); flare.classList.add('on');
    setTimeout(() => { warn.classList.remove('burst'); flare.classList.remove('on'); if (++i < n) setTimeout(step, 230); }, 110);
  };
  step();
  wt2 = setTimeout(warnFlicker, 2200 + Math.random() * 3800 + n * 400);
}
warnFlicker();

/* Chớp sét trên màn hình chính: 1-2 nhát ngắn, cách nhau 5-12 giây, độ sáng vừa phải (an toàn hơn cho người nhạy sáng). */
const bolt = document.createElement('div'); bolt.className = 'title-bolt'; bolt.setAttribute('aria-hidden', 'true');
title.insertBefore(bolt, title.querySelector('.title-content'));
let boltT = 0;
function boltStrike() {
  clearTimeout(boltT);
  if (RM() || !lighting() || title.hidden || busy() || document.hidden) { boltT = setTimeout(boltStrike, 1200); return; }
  bolt.style.setProperty('--bx', (15 + Math.random() * 70).toFixed(0) + '%');
  const double = Math.random() < .6;
  const hit = (peak, dur, next) => {
    bolt.style.setProperty('--peak', peak);
    bolt.classList.add('on'); title.classList.add('lit');
    setTimeout(() => { bolt.classList.remove('on'); title.classList.remove('lit'); if (next) setTimeout(next, 260); }, dur);
  };
  hit(double ? .22 : .32, 90, double ? () => hit(.38, 140) : null);
  boltT = setTimeout(boltStrike, 5500 + Math.random() * 6500);
}
boltT = setTimeout(boltStrike, 2500);

/* ---------- Logo rè rè: méo sóng SVG (chỉ mức cao) + tiếng nhiễu điện (mọi mức) ---------- */
document.body.insertAdjacentHTML('beforeend', '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><filter id="fx-rer" x="-5%" y="-15%" width="110%" height="130%"><feTurbulence id="fx-turb" type="fractalNoise" baseFrequency="0.002 0.3" numOctaves="1" seed="1"/><feDisplacementMap id="fx-disp" in="SourceGraphic" scale="0"/></filter></svg>');
const turb = $('fx-turb'), disp = $('fx-disp');
let rt = 0;
function rerLoop() {
  clearTimeout(rt);
  // Chỉ chạy khi màn hình tiêu đề đang hiện rõ — trong lúc chơi/loading/intro thì ngủ.
  if (RM() || title.hidden || busy() || document.hidden) { rt = setTimeout(rerLoop, 700); return; }
  const burst = Math.random() < .25;
  if (lvl() === 'high') {
    disp.setAttribute('scale', burst ? String(8 + Math.random() * 20 | 0) : (Math.random() < .5 ? '2' : '0'));
    turb.setAttribute('baseFrequency', '0.00' + (1 + Math.random() * 4 | 0) + ' ' + (.2 + Math.random() * .7).toFixed(2));
    turb.setAttribute('seed', String(Math.random() * 99 | 0));
  }
  rt = setTimeout(rerLoop, burst ? 70 + Math.random() * 110 : 130 + Math.random() * 220);
}
rerLoop();

window.HorrorFX = { scare, audioOn };
})();
