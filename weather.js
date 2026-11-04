/* WEATHER — sương mù và mưa theo từng cảnh. Chỉ quan sát DOM (số BG ở #scene-index), không đụng game.js.
   Sương: 3 lớp mây nhiễu sinh một lần, trôi bằng CSS. Mưa: canvas nhỏ, số hạt theo mức hiệu năng.
   Cảnh mưa lớn thỉnh thoảng có chớp xa (độ sáng thấp, tối đa 1 lần / 9 giây). */
(() => {
'use strict';
const $ = id => document.getElementById(id);
const stage = $('scene-stage'), hot = $('hotspots'), idx = $('scene-index');
if (!stage || !hot || !idx) return;
const root = document.documentElement;
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const RM = () => motion.matches;
const FX_KEY='lnrt-light-effects';
let lightEnabled=true;try{lightEnabled=localStorage.getItem(FX_KEY)!=='0'}catch(_){}
const active=()=>!document.hidden&&$('title-screen').hidden&&!root.classList.contains('is-busy');
window.WeatherFX={get enabled(){return lightEnabled},setEnabled(value){lightEnabled=!!value;try{localStorage.setItem(FX_KEY,lightEnabled?'1':'0')}catch(_){}if(!lightEnabled){bolt.classList.remove('on');lamp.classList.remove('on')}scheduleFlicker()}};
const lvl = () => (window.Perf ? Perf.level : 'medium');
/* mức độ 0..1 theo số cảnh BG */
const FOG = {1:.35,2:.4,3:.4,4:.5,5:.5,6:.5,7:.6,8:.5,9:.5,25:.35,29:.6,30:.45,38:.4,39:.5,40:.75,42:.5,44:.3};
const RAIN = {25:.3,38:1,39:.9};
const mk = (tag, cls) => { const e = document.createElement(tag); e.className = 'fx ' + cls; e.setAttribute('aria-hidden', 'true'); stage.insertBefore(e, hot); return e; };
const fog = mk('div', 'wx-fog');
['a', 'b', 'c'].forEach(k => { const l = document.createElement('div'); l.className = 'wx-layer wx-' + k; fog.appendChild(l); });
const rainCv = mk('canvas', 'wx-rain'), bolt = mk('div', 'wx-bolt'), lamp = mk('div', 'wx-lamp');

/* Mây nhiễu: cộng nhiều đốm tròn mờ vào canvas 256px, dùng làm ảnh lặp. */
(() => {
  const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d');
  for (let i = 0; i < 70; i++) {
    const px = Math.random() * 256, py = Math.random() * 256, r = 28 + Math.random() * 50, a = .05 + Math.random() * .09;
    for (const dx of [-256, 0, 256]) for (const dy of [-256, 0, 256]) {
      const g = x.createRadialGradient(px + dx, py + dy, 0, px + dx, py + dy, r);
      g.addColorStop(0, `rgba(205,215,222,${a})`); g.addColorStop(1, 'rgba(205,215,222,0)');
      x.fillStyle = g; x.fillRect(px + dx - r, py + dy - r, r * 2, r * 2);
    }
  }
  fog.style.setProperty('--wx-tile', `url(${c.toDataURL()})`);
})();

const rctx = rainCv.getContext('2d');
let RW = 2, RH = 2, rain = 0, raf = 0, last = 0, nextBolt = 0, lastBolt = 0, flickerTimer = 0;
const LIT_ROOMS=new Set([11,12,13,14,15,16,17,23,24,27,28,34,35,36,37,43]);
let scene=0;
const drops = Array.from({ length: 160 }, () => ({ x: Math.random(), y: Math.random(), l: .03 + Math.random() * .05, v: .9 + Math.random() * .8 }));
const resize = () => { RW = rainCv.width = Math.max(2, stage.clientWidth / 2 | 0); RH = rainCv.height = Math.max(2, stage.clientHeight / 2 | 0); };
new ResizeObserver(resize).observe(stage); resize();
const COUNT = { low: 50, medium: 90, high: 160 }, FPS = { low: 20, medium: 30, high: 45 };
function frame(t) {
  raf = 0;
  if (!rain || !active() || RM()) { rctx.clearRect(0, 0, RW, RH); return; }
  raf = requestAnimationFrame(frame);
  if (t - last < 1000 / FPS[lvl()]) return;
  const dt = Math.min(60, t - last) / 16; last = t;
  rctx.clearRect(0, 0, RW, RH);
  rctx.strokeStyle = `rgba(190,205,225,${.22 + rain * .22})`; rctx.lineWidth = 1; rctx.beginPath();
  const n = Math.round(COUNT[lvl()] * (.4 + .6 * rain));
  for (let i = 0; i < n; i++) {
    const d = drops[i]; d.y += d.v * .022 * dt; d.x -= d.v * .004 * dt;
    if (d.y > 1.05) { d.y = -.1; d.x = Math.random() * 1.15; } if (d.x < -.1) d.x = 1.05;
    const px = d.x * RW, py = d.y * RH;
    rctx.moveTo(px, py); rctx.lineTo(px - d.l * RW * .22, py + d.l * RH);
  }
  rctx.stroke();
  if (lightEnabled && rain > .8 && t > nextBolt) { nextBolt = t + 18000 + Math.random() * 16000; strike(); }
}
function strike() {
  if (!active() || !lightEnabled || RM() || t0() - lastBolt < 18000) return;
  lastBolt=t0();bolt.classList.remove('on');void bolt.offsetWidth;bolt.classList.add('on');
  setTimeout(()=>bolt.classList.remove('on'),1200);
}
function scheduleFlicker(){
  clearTimeout(flickerTimer);
  if (!active() || !lightEnabled || RM() || !LIT_ROOMS.has(scene)) return;
  flickerTimer=setTimeout(()=>{
    if(active()&&lightEnabled&&!RM()){lamp.classList.remove('on');void lamp.offsetWidth;lamp.classList.add('on');setTimeout(()=>lamp.classList.remove('on'),2400)}
    scheduleFlicker();
  },22000+Math.random()*22000);
}
const t0 = () => performance.now();

function apply() {
  const n = parseInt((idx.textContent.match(/BG(\d+)/) || [0, 0])[1], 10);
  scene=n;const f = FOG[n] || 0; rain = RAIN[n] || 0;
  fog.style.setProperty('--wx', RM() ? f * .6 : f);
  fog.classList.toggle('on', f > 0);
  rainCv.classList.toggle('on', rain > 0 && !RM());
  root.dataset.rain = rain > 0 ? '1' : '0';
  if (rain && !raf && !RM() && active()) { nextBolt = performance.now() + 14000; raf = requestAnimationFrame(frame); }
  scheduleFlicker();
}
new MutationObserver(apply).observe(idx, { childList: true, characterData: true, subtree: true });
document.addEventListener('visibilitychange',apply);
new MutationObserver(apply).observe($('title-screen'),{attributes:true,attributeFilter:['hidden']});
new MutationObserver(apply).observe(root,{attributes:true,attributeFilter:['class']});
if(motion.addEventListener)motion.addEventListener('change',apply);
apply();
})();
