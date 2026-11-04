/* Mưa, ánh đèn và chớp xa theo cảnh; không ảnh hưởng đến tiến trình chơi. */
(() => {
'use strict';
const $ = id => document.getElementById(id);
const stage = $('scene-stage'), hot = $('hotspots'), idx = $('scene-index');
if (!stage || !hot || !idx) return;
const root = document.documentElement;
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const smallScreen = matchMedia('(pointer: coarse), (max-width: 700px)');
const RM = () => motion.matches;
const FX_KEY='lnrt-light-effects';
let lightEnabled=true;try{lightEnabled=localStorage.getItem(FX_KEY)!=='0'}catch(_){}
const active=()=>!document.hidden&&$('title-screen').hidden&&!root.classList.contains('is-busy');
root.dataset.lightEffects=lightEnabled?'on':'off';
window.WeatherFX={get enabled(){return lightEnabled},setEnabled(value){
  lightEnabled=!!value;root.dataset.lightEffects=lightEnabled?'on':'off';
  try{localStorage.setItem(FX_KEY,lightEnabled?'1':'0')}catch(_){}
  if(!lightEnabled){bolt.classList.remove('on');lamp.classList.remove('on')}
  else if(rain)nextBolt=Math.max(performance.now()+4500,lastBolt+14000);
  scheduleFlicker();
}};
const lvl = () => (window.Perf ? Perf.level : 'medium');
/* mức độ 0..1 theo số cảnh BG */
const RAIN = {8:.35,9:.48,10:.3,25:.3,38:1,39:.9};
const mk = (tag, cls) => { const e = document.createElement(tag); e.className = 'fx ' + cls; e.setAttribute('aria-hidden', 'true'); stage.insertBefore(e, hot); return e; };
const rainCv = mk('canvas', 'wx-rain'), rainCSS = mk('div', 'wx-rain-css'), bolt = mk('div', 'wx-bolt'), lamp = mk('div', 'wx-lamp');

let rctx=null;try{rctx=rainCv.getContext('2d')}catch(_){}
const cssRain = () => smallScreen.matches || !rctx;
let RW = 2, RH = 2, rain = 0, raf = 0, last = 0, nextBolt = 0, lastBolt = -Infinity, flickerTimer = 0;
const LIT_ROOMS=new Set([11,12,13,14,15,16,17,23,24,27,28,34,35,36,37,43]);
let scene=0;
const drops = Array.from({ length: 160 }, () => ({ x: Math.random(), y: Math.random(), l: .03 + Math.random() * .05, v: .9 + Math.random() * .8 }));
const resize = () => {
  const w=Math.max(2, stage.clientWidth / 2 | 0),h=Math.max(2, stage.clientHeight / 2 | 0);
  if(w!==RW||h!==RH){RW=rainCv.width=w;RH=rainCv.height=h;}
};
if(typeof ResizeObserver!=='undefined')new ResizeObserver(resize).observe(stage);
else window.addEventListener('resize',resize,{passive:true});
window.addEventListener('orientationchange',resize,{passive:true});resize();
const COUNT = { low: 50, medium: 90, high: 160 }, FPS = { low: 20, medium: 30, high: 45 };
const nextFrame=()=>cssRain()?setTimeout(()=>frame(performance.now()),150):requestAnimationFrame(frame);
function frame(t) {
  raf = 0;
  if (!rain || !active() || RM()) { if(rctx)rctx.clearRect(0, 0, RW, RH); return; }
  raf = nextFrame();
  if (t - last < 1000 / FPS[lvl()]) return;
  const dt = Math.min(60, t - last) / 16; last = t;
  if(rctx&&!cssRain()){
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
  }
  if (lightEnabled && t >= nextBolt) {
    if (strike()) nextBolt = t + 18000 + Math.random() * 12000;
    else nextBolt = Math.max(t + 1000, lastBolt + 14000);
  }
}
function strike() {
  if (!active() || !lightEnabled || RM() || t0() - lastBolt < 14000) return false;
  lastBolt=t0();bolt.classList.remove('on');void bolt.offsetWidth;bolt.classList.add('on');
  setTimeout(()=>bolt.classList.remove('on'),1200);
  return true;
}
function scheduleFlicker(){
  if (!active() || !lightEnabled || RM() || !LIT_ROOMS.has(scene)) {clearTimeout(flickerTimer);flickerTimer=0;return;}
  // Các lần render lại cùng cảnh không được đặt lại thời gian chờ.
  if(flickerTimer)return;
  flickerTimer=setTimeout(()=>{
    flickerTimer=0;
    if(active()&&lightEnabled&&!RM()&&LIT_ROOMS.has(scene)){lamp.classList.remove('on');void lamp.offsetWidth;lamp.classList.add('on');setTimeout(()=>lamp.classList.remove('on'),2300)}
    if(active()&&lightEnabled&&!RM()&&LIT_ROOMS.has(scene))flickerTimer=setTimeout(()=>{flickerTimer=0;scheduleFlicker()},14000+Math.random()*10000);
  },4500+Math.random()*3500);
}
const t0 = () => performance.now();

function apply() {
  const n = parseInt((idx.textContent.match(/BG(\d+)/) || [0, 0])[1], 10);
  const changed=n!==scene;scene=n;rain = RAIN[n] || 0;
  if(changed){lamp.classList.remove('on');if(!rain)bolt.classList.remove('on')}
  const showRain=rain>0&&!RM()&&active();
  rainCv.classList.toggle('on', showRain&&!cssRain());
  rainCSS.classList.toggle('on', showRain&&cssRain());
  rainCSS.style.setProperty('--wx-rain-opacity',String(Math.min(.9,.35+rain*.55)));
  root.dataset.rain = rain > 0 ? '1' : '0';
  if(changed&&rain)nextBolt=Math.max(performance.now()+4500+Math.random()*2500,lastBolt+14000);
  if (rain && !raf && !RM() && active()) {if(!nextBolt)nextBolt=Math.max(performance.now()+4500,lastBolt+14000);last=0;raf = nextFrame();}
  scheduleFlicker();
}
new MutationObserver(apply).observe(idx, { childList: true, characterData: true, subtree: true });
document.addEventListener('visibilitychange',apply);
window.addEventListener('pageshow',()=>{resize();apply()});
new MutationObserver(apply).observe($('title-screen'),{attributes:true,attributeFilter:['hidden']});
new MutationObserver(apply).observe(root,{attributes:true,attributeFilter:['class']});
if(motion.addEventListener)motion.addEventListener('change',apply);
else if(motion.addListener)motion.addListener(apply);
if(smallScreen.addEventListener)smallScreen.addEventListener('change',apply);
else if(smallScreen.addListener)smallScreen.addListener(apply);
apply();
})();
