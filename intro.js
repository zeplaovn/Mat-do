/* LOADING + INTRO — độc lập với game.js; chỉ bọc nút "Bắt đầu điều tra" và nạp trước tài nguyên.
   Thứ tự nạp: game.js → horror.js → intro.js (đều defer). */
(() => {
'use strict';
const $ = id => document.getElementById(id);
const root = document.documentElement;
const R = 'assets/';
const SND = f => `${R}sound/${f}`;
const pad = n => String(n).padStart(2, '0');
const BG = n => `${R}background/${Number(n) === 1 ? 'BG01-fixed' : `BG${pad(n)}`}.webp`;
const coarse = matchMedia('(pointer: coarse)').matches;

/* ===================================================================
   1) LOADING
   =================================================================== */
const ITEMS = ['01_Bat_Lua_Chua_Bat', '02_Bat_Lua_Da_Bat', '02_Den_Pin', '03_Nen_Chua_Thap', '03_So_Tay', '04_Chia_Khoa', '04_Nen_Da_Thap', '05_Bat_Huong', '05_Nhang_Chua_Dot', '06_Nhang_Da_Dot', '07_Bat_Huong_Da_Cam_Nhang', '01_May_Quay']
  .map(n => `${R}items/${n}_128x128.webp`).concat(encodeURI(`${R}items/Antique Brass Flip-Top Lighter.webp`));
const PORTRAITS = ['01_Dong', '02_Nam', '03_Tuyet', '04_Anh', '05_Nguyet', '06_Mo', '07_Ba_Lam', '08_Ba_Man'].map(n => `${R}portraits/${n}_portrait.webp`);
const IMAGES = [`${R}logo.webp`, `${R}title_bg.webp`, BG(1), BG(2), BG(3), BG(4), BG(5), BG(7), BG(8), ...PORTRAITS, ...ITEMS];
// Âm thanh chỉ "làm nóng" bộ nhớ đệm trên máy tính (điện thoại thường không cho nạp trước khi chưa chạm).
const SOUNDS = coarse ? [] : ['community-frogs.mp3', 'tieng_on_ao_o_cho.mp3', 'knock-on-the-door.mp3', 'creaking-door.mp3', 'door-slam.mp3'].map(SND);

const TIPS = [
  'Đừng trả lời khi bóng tối gọi tên bạn.',
  'Đeo tai nghe. Có những thứ chỉ nghe được khi xung quanh im lặng.',
  'Phím F bật tắt đèn pin · J nhật ký · H gợi ý.',
  'Ghi chép mọi thứ. Có những cái tên chỉ xuất hiện một lần.'
];
const MIN_MS = 2400, MAX_MS = 15000;

const loader = $('loader');
const stick = $('incense-ash'), ember = $('ember'), pctEl = $('loader-pct'), statEl = $('loader-status-text'), tipEl = $('loader-tip'), bar = $('loader-bar');
const kept = [];                                  // giữ tham chiếu để trình duyệt không hủy tải
let total = IMAGES.length + SOUNDS.length, done = 0, target = 0, shown = 0, finished = false, loaderClosed = false;
const t0 = performance.now();

const bump = () => { done++; target = Math.min(1, done / total); };
IMAGES.forEach(src => { const i = new Image(); kept.push(i); i.onload = i.onerror = bump; i.src = src; });
SOUNDS.forEach(src => {
  const a = new Audio(); kept.push(a); a.preload = 'auto';
  let ok = false; const fin = () => { if (!ok) { ok = true; bump(); } };
  a.addEventListener('canplaythrough', fin, { once: true }); a.addEventListener('error', fin, { once: true });
  setTimeout(fin, 2500); a.src = src;
});
setTimeout(() => { if (!finished) { target=shown=1; render(1); finish(); } }, MAX_MS); // không kẹt nếu tải lỗi hoặc khung hình bị hạn chế

const phase = p => p < .35 ? 'Đang thắp nén hương…' : p < .7 ? 'Đang gọi những cái tên…' : p < 1 ? 'Đang mở cổng làng…' : 'Sẵn sàng.';
let barW = 0;
const measure = () => { barW = bar.clientWidth; };
measure(); addEventListener('resize', measure);

function render(p) {
  ember.style.transform = `translateX(${(p * barW).toFixed(1)}px)`;
  stick.style.transform = `scaleX(${p.toFixed(4)})`;
  pctEl.textContent = Math.round(p * 100) + '%';
  statEl.textContent = phase(p);
  bar.setAttribute('aria-valuenow', String(Math.round(p * 100)));
}

let tipI = Math.floor(Math.random() * TIPS.length), tipTimer = 0;
const showTip = () => { tipEl.textContent = TIPS[tipI]; tipI = (tipI + 1) % TIPS.length; };
showTip();
tipTimer = setInterval(() => { tipEl.classList.add('out'); setTimeout(() => { showTip(); tipEl.classList.remove('out'); }, 700); }, 3600);

function tick(now) {
  if (finished) return;
  const cap = Math.min(1, (now - t0) / MIN_MS);     // không chạy nhanh hơn thời gian tối thiểu → kịp "thấy" màn loading
  const goal = Math.min(target, cap);
  shown += (goal - shown) * .12; if (goal - shown < .002) shown = goal;
  render(shown);
  if (shown >= 1) return finish();
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

function finish() {
  if (finished) return;
  finished = true; clearInterval(tipTimer);
  if (musicEnabled()) loader.dataset.awaitingMusic='1';
  setTimeout(() => {
    idlePreload();
    if (!musicEnabled()) { revealTitle(); return; }
    // Nếu trình duyệt chặn tự phát, đợi một thao tác thật thay vì để nút nhạc báo bật nhưng không có tiếng.
    const waiting=setTimeout(showSoundChoice, 1500);
    musicStart().then(ok => { clearTimeout(waiting); if (ok) revealTitle(); else showSoundChoice(); });
  }, 450);
}
function revealTitle() {
  if (loaderClosed) return;
  loaderClosed = true; delete loader.dataset.awaitingMusic; loader.classList.add('done');
  root.classList.remove('is-loading', 'is-busy');
  try {
    const notice = $('notice-screen');
    (notice && !notice.hidden ? $('notice-confirm') : $('btn-new-game')).focus({ preventScroll: true });
  } catch (_) {}
  Perf.watch();
  setTimeout(() => loader.remove(), 1000);
}
function showSoundChoice() {
  if (loaderClosed) return;
  if (loader.hidden) { loaderClosed=true; return; } // bộ dự phòng đã đưa người chơi vào màn hình chính
  $('loader-tip').hidden=true;
  $('loader-sound-choice').hidden=false;
  try { $('loader-enter').focus({ preventScroll: true }); } catch (_) {}
}

/* Nạp dần các cảnh còn lại lúc rảnh để lúc chơi không bị khựng khi chuyển cảnh (từng ảnh một, không tranh băng thông). */
function idlePreload() {
  const rest = []; const limit=(coarse || (navigator.connection && navigator.connection.saveData)) ? 13 : 49; for (let n = 1; n <= limit; n++) { const s = BG(n); if (!IMAGES.includes(s)) rest.push(s); }
  const idle = window.requestIdleCallback || (fn => setTimeout(fn, 200));
  const next = () => { const s = rest.shift(); if (!s) return; const i = new Image(); kept.push(i); i.onload = i.onerror = () => idle(next); i.src = s; };
  idle(next);
}

/* ===================================================================
   1b) NHẠC NỀN: trailer.mp3 ở màn hình chính; sang đoạn intro (sau khi bấm "Bắt đầu điều tra") chuyển sang intro.mp3, tắt dần khi vào game.
   Khi trình duyệt chặn tự phát, người chơi chọn bật nhạc trước khi vào màn hình chính.
   Tệp khá to (≈ 3–6 lần các âm khác trong game) nên phát ở âm lượng thấp. =================================================================== */
const MUSIC_FILE = 'trailer.mp3', MUSIC_VOL = .26, MUSIC_DUCK = .1, MUSIC_KEY = 'lnrt-music';
const title = $('title-screen');
let music = null, musicFadeT = 0, musicWanted = false, musicBlocked = false, musicAttempt = 0, retryArmed = false;
let musicSetting = true;
const musicEnabled = () => { try { return localStorage.getItem(MUSIC_KEY) !== '0'; } catch (_) { return musicSetting; } };
function setMusicEnabled(on) { musicSetting=!!on; try { localStorage.setItem(MUSIC_KEY, on ? '1' : '0'); } catch (_) {} }
function musicEl() {
  if (!music) { music = new Audio(SND(MUSIC_FILE)); music.loop = true; music.preload = 'auto'; music.volume = 0; }
  return music;
}
function musicFade(to, ms, done) {
  clearInterval(musicFadeT);
  const a = musicEl(), from = a.volume, steps = Math.max(1, Math.round(ms / 50)); let i = 0;
  musicFadeT = setInterval(() => {
    i++; a.volume = Math.max(0, Math.min(1, from + (to - from) * i / steps));
    if (i >= steps) { clearInterval(musicFadeT); if (done) done(); }
  }, 50);
}
function musicStart() {
  musicWanted = true;
  if (!musicEnabled()) return Promise.resolve(false);
  let a; try { a=musicEl(); } catch (_) { musicBlocked=true;mbtnSync();return Promise.resolve(false); }
  const attempt=++musicAttempt;
  let p; try { p=a.play(); } catch (_) { p=Promise.reject(_); }
  return Promise.resolve(p).then(() => {
    if (attempt!==musicAttempt || !musicWanted || !musicEnabled() || title.hidden) {
      if (!musicWanted || !musicEnabled() || title.hidden) a.pause();
      return false;
    }
    musicBlocked=false; disarmMusicRetry(); mbtnSync(); musicFade(MUSIC_VOL, 1800); return true;
  }, () => {
    if (attempt===musicAttempt && musicWanted && musicEnabled()) { musicBlocked=true; mbtnSync(); armMusicRetry(); }
    return false;
  });
}
function musicStop(ms = 1400) {
  musicWanted = false; musicAttempt++; disarmMusicRetry(); clearInterval(musicFadeT);
  if (!music || music.paused) return;
  if (ms<=0) { try { music.pause(); music.currentTime=0; } catch (_) {} return; }
  musicFade(0, ms, () => { try { music.pause(); music.currentTime = 0; } catch (_) {} });
}
function retryMusic(e) {
  if (!loaderClosed || !musicWanted || !musicEnabled() || title.hidden || e.target===mbtn) return;
  disarmMusicRetry(); musicStart();
}
function armMusicRetry() {
  if (retryArmed) return; retryArmed=true;
  ['pointerdown','touchend','keydown'].forEach(type=>addEventListener(type,retryMusic,true));
}
function disarmMusicRetry() {
  if (!retryArmed) return; retryArmed=false;
  ['pointerdown','touchend','keydown'].forEach(type=>removeEventListener(type,retryMusic,true));
}
function musicDuck() { if (music && !music.paused) musicFade(MUSIC_DUCK, 900); }
/* Nhạc nền riêng cho đoạn intro (intro.mp3): nhạc màn hình chính tắt dần, intro.mp3 vào dần rồi tắt dần khi vào game. */
let bed = null, bedT = 0;
function bedFade(to, ms, done) {
  if (!bed) return; clearInterval(bedT);
  const a = bed, from = a.volume, steps = Math.max(1, Math.round(ms / 50)); let i = 0;
  bedT = setInterval(() => { i++; a.volume = Math.max(0, Math.min(1, from + (to - from) * i / steps)); if (i >= steps) { clearInterval(bedT); if (done) done(); } }, 50);
}
function bedStart() {
  if (!musicEnabled()) return;
  try { bed = new Audio(SND('intro.mp3')); bed.volume = 0; bed.play().then(() => bedFade(.34, 1500)).catch(() => {}); } catch (_) {}
}
function bedStop(ms) { const a = bed; if (!a) return; bedFade(0, ms, () => { try { a.pause(); } catch (_) {} if (bed === a) bed = null; }); }
/* Nút bật/tắt nhạc ở góc màn hình chính (nhớ lựa chọn) */
const mbtn = document.createElement('button');
mbtn.type = 'button'; mbtn.className = 'music-btn'; mbtn.textContent = '♪'; mbtn.title = 'Bật/tắt nhạc nền'; mbtn.setAttribute('aria-label', 'Bật hoặc tắt nhạc nền');
const mbtnSync = () => { const waiting=musicEnabled()&&musicBlocked;mbtn.classList.toggle('off', !musicEnabled());mbtn.classList.toggle('awaiting',waiting);mbtn.textContent=waiting?'♪ Bật nhạc':'♪';mbtn.title=waiting?'Chạm để bật nhạc nền':'Bật/tắt nhạc nền';mbtn.setAttribute('aria-label',waiting?'Bật nhạc nền':'Bật hoặc tắt nhạc nền');mbtn.setAttribute('aria-pressed', musicEnabled()&&!waiting ? 'true' : 'false'); };
mbtn.addEventListener('click', e => {
  e.stopPropagation();
  if (musicEnabled() && musicBlocked) { musicStart(); return; }
  const on = !musicEnabled(); setMusicEnabled(on);musicBlocked=false;
  mbtnSync(); if (on) musicStart(); else musicStop(500);
});
mbtnSync(); title.appendChild(mbtn);
$('loader-enter').addEventListener('click',()=>{musicStart();revealTitle()});
$('loader-silent').addEventListener('click',()=>{setMusicEnabled(false);musicBlocked=false;musicStop(0);mbtnSync();revealTitle()});
/* Vào lại màn hình chính (Menu → Về màn hình chính) thì nhạc phát lại; vào game (Tiếp tục) thì tắt dần. */
new MutationObserver(() => { if (!title.hidden) musicStart(); else if (!playing) musicStop(1200); }).observe(title, { attributes: true, attributeFilter: ['hidden'] });

/* ===================================================================
   2) INTRO
   =================================================================== */
const BEATS = [
  { bg: 0,  line: 'Năm 1988...', sub: 'Tại biệt thự Vân Hòa,sâu trong chân núi Ba Vì.', dur: 4200 },
  { bg: 8,  line: 'Một đêm bị lãng quên.', sub: 'Không ai chịu kể lại chuyện gì đã xảy ra.', dur: 4600 },
  { bg: 1,  line: '2026', sub: 'Một nhóm sinh viên tìm về thôn Đồng Chay để ghi lại một truyền thuyết.', dur: 4800 },
  { bg: 5,  line: 'Dân làng dặn nhóm bạn: đừng vào rừng khi trời về tối.', dur: 4200 },
  { bg: 7,  line: 'Nhưng ... Họ vẫn đi.', dur: 3000, flick: true },
  { bg: 0,  line: 'Nếu "ai đó" gọi tên bạn…', sub: 'Tốt nhất đừng trả lời.', dur: 5200, creak: true, slamAt: 2000, knockAt: 3900 }
];
const CARD_MS = 2300, GUARD_MS = 450;

const intro = $('intro'), textEl = $('intro-text'), lineEl = $('intro-line'), subEl = $('intro-sub'), card = $('intro-card');
const imgs = [$('intro-img-a'), $('intro-img-b')];
const sfx = [];                                    // âm thanh của intro đang phát (để dừng khi bấm Bỏ qua)
let playing = false, idx = -1, timers = [], curImg = -1, curBg = 0, beatAt = 0, onDone = null;

const later = (fn, ms) => { const t = setTimeout(fn, ms); timers.push(t); return t; };
const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };
const soundOn = () => window.HorrorFX ? HorrorFX.audioOn() : true;

function setBg(n) {
  if (n === curBg) return;
  const old = imgs[curImg];
  if (old) old.classList.remove('on');
  curBg = n;
  if (!n) { curImg = -1; return; }
  curImg = curImg === 0 ? 1 : 0;
  const el = imgs[curImg];
  el.classList.remove('on', 'zoom'); el.src = BG(n);
  const go = () => { el.classList.add('on'); void el.offsetWidth; el.classList.add('zoom'); };
  el.complete && el.naturalWidth ? go() : (el.onload = go);
}

function knock() {
  if (!soundOn()) return;
  try { const a = new Audio(SND('knock-on-the-door.mp3')); a.volume = .7; sfx.push(a); a.play().catch(() => {}); } catch (_) {}
}

function creak() {
  if (!soundOn()) return;
  try { const a = new Audio(SND('creaking-door.mp3')); a.volume = .65; sfx.push(a); a.play().catch(() => {}); } catch (_) {}
}

/* Tiếng cửa đóng sầm: phát NGAY SAU khi tiếng cửa kẽo kẹt (creaking-door) kết thúc.
   door-slam.mp3 có ~4 s dạo đầu gần như im lặng rồi mới tới cú đập (≈4,0 s), nên bắt đầu phát từ giây 3,3
   để cú đập rơi vào khoảng 0,7 s sau khi tiếng kẽo kẹt dứt. */
const SLAM_FROM = 3.3;
function slam() {
  if (!soundOn()) return;
  try {
    const a = new Audio(SND('door-slam.mp3')); a.volume = .85; sfx.push(a);
    const go = () => { try { a.currentTime = SLAM_FROM; } catch (_) {} a.play().catch(() => {}); };
    a.readyState >= 1 ? go() : a.addEventListener('loadedmetadata', go, { once: true });
  } catch (_) {}
}
function stopSfx() { sfx.forEach(a => { try { a.pause(); } catch (_) {} }); sfx.length = 0; }

function next() {
  clearTimers();
  idx++;
  if (idx >= BEATS.length) return showCard();
  const b = BEATS[idx]; beatAt = performance.now();
  textEl.classList.remove('show', 'flick');
  setBg(b.bg);
  later(() => {
    lineEl.textContent = b.line; subEl.textContent = b.sub || ''; subEl.hidden = !b.sub;
    textEl.classList.add('show');
    if (b.flick && !Perf.RM) textEl.classList.add('flick');
    if (b.creak) { creak(); musicDuck(); if (bed) bedFade(.12, 900); }
  }, idx ? 520 : 200);
  if (b.slamAt) later(slam, b.slamAt);
  if (b.knockAt) later(knock, b.knockAt);
  later(next, b.dur);
}

function showCard() {
  clearTimers();
  textEl.classList.remove('show'); setBg(0);
  later(() => { card.classList.add('show'); }, 500);
  later(finishIntro, 500 + CARD_MS);
}

function skipForward() { if (performance.now() - beatAt > GUARD_MS && idx < BEATS.length) next(); }
const onKey = e => {
  if (e.key === 'Escape') { e.preventDefault(); finishIntro(); }
  else if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') { e.preventDefault(); skipForward(); }
};

function finishIntro() {
  if (!playing) return;
  playing = false; clearTimers(); stopSfx();
  document.removeEventListener('keydown', onKey, true);
  intro.removeEventListener('click', onClick);
  root.classList.remove('is-busy');                  // hiệu ứng nền chạy lại ngay khi game hiện ra bên dưới
  if (onDone) onDone();
  musicStop(1600); bedStop(1800);
  intro.classList.add('out');
  setTimeout(() => {
    intro.hidden = true; intro.classList.remove('out'); root.classList.remove('is-intro');
    card.classList.remove('show'); textEl.classList.remove('show'); imgs.forEach(i => i.classList.remove('on', 'zoom'));
    Perf.watch();
  }, 950);
}
const onClick = e => { if (e.target.closest('#intro-skip')) return; skipForward(); };

function playIntro(startGame) {
  if (playing) return;
  playing = true; onDone = startGame; idx = -1; curImg = -1; curBg = 0;
  musicStop(900); bedStart();
  root.classList.add('is-intro', 'is-busy');
  intro.hidden = false; intro.classList.remove('out');
  document.addEventListener('keydown', onKey, true);
  intro.addEventListener('click', onClick);
  intro.focus({ preventScroll: true });
  next();
}
$('intro-skip').onclick = finishIntro;

/* Bọc nút "Bắt đầu điều tra". Các nút "Chơi lại"/"Bắt đầu lại" trong game vẫn vào thẳng game (không phải xem lại intro). */
const btn = $('btn-new-game'), startNew = btn.onclick;
if (typeof startNew === 'function') btn.onclick = () => playIntro(startNew);
})();
