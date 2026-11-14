/* Lời Nguyền Rừng Thiêng — i18n runtime.
   Ngôn ngữ gốc: vi. Bản dịch: en, zh.
   Từ điển: window.LNRT_I18N[lang][câu tiếng Việt] = bản dịch.
   Cách dịch: tại tầng hiển thị (DOM + thuộc tính), không sửa dữ liệu gốc trong game.js. */
(() => {
  'use strict';

  const LANGS = ['vi', 'en', 'zh'];
  const STORE = 'lnrt-lang';
  const DOC = {
    vi: {
      title: 'Lời Nguyền Rừng Thiêng — Bí mật biệt thự Vân Hòa',
      desc: 'Lời Nguyền Rừng Thiêng — game phiêu lưu kinh dị point-and-click trong biệt thự Vân Hòa.'
    },
    en: {
      title: 'The Curse of the Sacred Forest — Secrets of Vân Hòa Villa',
      desc: 'The Curse of the Sacred Forest — a point-and-click horror adventure set in Vân Hòa Villa.'
    },
    zh: {
      title: '圣林咒怨 — 云和别墅的秘密',
      desc: '《圣林咒怨》—— 发生在云和别墅中的点击式恐怖冒险游戏。'
    }
  };
  const HTML_LANG = { vi: 'vi', en: 'en', zh: 'zh-Hans' };
  const DOC_TRAILER = {
    vi: {
      title: 'Trailer | Lời Nguyền Rừng Thiêng',
      desc: 'Trailer Lời Nguyền Rừng Thiêng – quan sát, đối chiếu chứng cứ và tự quyết định.'
    },
    en: {
      title: 'Trailer | The Curse of the Sacred Forest',
      desc: 'Trailer for The Curse of the Sacred Forest — observe, weigh the evidence, and decide for yourself.'
    },
    zh: {
      title: '预告片 | 圣林咒怨',
      desc: '《圣林咒怨》预告片 —— 观察、比对证据，然后自己做出决定。'
    }
  };
  const ATTRS = ['title', 'aria-label', 'alt', 'placeholder', 'aria-description'];
  const SKIP_TAGS = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEXTAREA: 1, CODE: 1 };
  const VI_RE = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;
  const hasOwn = (o, k) => Object.prototype.hasOwnProperty.call(o, k);

  /* Câu có biến ở giữa: dịch phần cố định, phần biến ($1, $2…) được dịch đệ quy. */
  const PATTERNS = [
    {
      re: /^(.+?), (.+?)\. Tên đã được trả lại\.$/,
      en: '$1, $2. The name has been returned.',
      zh: '$1，$2。名字已经归还。'
    },
    {
      re: /^(.+?), (.+?)\. Tên đã được ghi vào sổ\.$/,
      en: '$1, $2. The name is now in the book.',
      zh: '$1，$2。名字已经记入册中。'
    },
    {
      re: /^(.+?), (.+?)\. Tìm thấy ở (.+?)\.$/,
      en: '$1, $2. Found at $3.',
      zh: '$1，$2。发现于$3。'
    },
    {
      re: /^Cảnh (BG\d+\w*): (.+)$/,
      en: 'Scene $1: $2',
      zh: '场景 $1：$2'
    },
    {
      re: /^Máy ảnh: (.+?) · nhấn V để đổi chế độ$/,
      en: 'Camera: $1 · press V to change mode',
      zh: '相机：$1 · 按 V 切换模式'
    },
    {
      re: /^Hiệu ứng hình ảnh: (.+?) \((.+?)\)$/,
      en: 'Visual effects: $1 ($2)',
      zh: '画面特效：$1（$2）'
    },
    {
      re: /^Chọn đúng (\d+) mục rồi kiểm tra\.$/,
      en: 'Choose exactly $1 items, then check.',
      zh: '选对 $1 项后核对。'
    },
    {
      re: /^ĐÃ LƯU (\d+) GHI CHÚ$/,
      en: '$1 NOTES SAVED',
      zh: '已保存 $1 条笔记'
    },
    {
      re: /^(\d+) \/ (\d+) mảnh đúng chỗ\.$/,
      en: '$1 / $2 pieces in place.',
      zh: '$1 / $2 块已归位。'
    },
    {
      re: /^Đã mở (\d+)\/(\d+) kết thúc\.$/,
      en: '$1/$2 endings unlocked.',
      zh: '已解锁 $1/$2 个结局。'
    },
    {
      re: /^Trang (\d+)[–-](\d+) \/ (\d+)$/,
      en: 'Pages $1–$2 / $3',
      zh: '第 $1–$2 页，共 $3 页'
    },
    {
      re: /^Trang (\d+) \/ (\d+)$/,
      en: 'Page $1 / $2',
      zh: '第 $1 页，共 $2 页'
    },
    {
      re: /^Trang (\d+)$/,
      en: 'Page $1',
      zh: '第 $1 页'
    },
    {
      re: /^Ghi chép (\d+)$/,
      en: 'Note $1',
      zh: '记录 $1'
    },
    {
      re: /^Thành tựu \((\d+)\/(\d+)\)$/,
      en: 'Achievements ($1/$2)',
      zh: '成就（$1/$2）'
    },
    {
      re: /^đã lưu \/ (\d+)$/,
      en: 'archived / $1',
      zh: '已归档 / $1'
    },
    {
      re: /^\/ (\d+) câu đố$/,
      en: '/ $1 puzzles',
      zh: '/ $1 个谜题'
    },
    {
      re: /^Ghi chú đã lưu \((\d+)\)$/,
      en: 'Saved notes ($1)',
      zh: '已存笔记（$1）'
    },
    {
      re: /^Vị trí (\d+): (.+)$/,
      en: 'Slot $1: $2',
      zh: '位置 $1：$2'
    },
    {
      re: /^Hõm (\d+): (.+)$/,
      en: 'Recess $1: $2',
      zh: '凹槽 $1：$2'
    },
    {
      re: /^Mặt sau khung ảnh viết: “(.+?)”\. Mình đã lấy mảnh giấy rồi\.$/,
      en: 'The back of the photo frame reads: “$1”. I have already taken the slip of paper.',
      zh: '相框背面写着：“$1”。纸条我已经取下了。'
    },
    {
      re: /^“(.+?)”\. Một giờ giấc\. Mười một giờ bốn mươi lăm\.$/,
      en: '“$1”. A time. Eleven forty-five.',
      zh: '“$1”。一个时刻。十一点四十五分。'
    },
    {
      re: /^Sau khung ảnh gia đình có dòng chữ mã hóa: “(.+?)”, và một mảnh giấy rách dán kín\. Hãy nhớ giờ này\.$/,
      en: 'Behind the family photograph there is a coded line: “$1”, and a torn slip pasted shut. Remember this hour.',
      zh: '全家福后面有一行密码字：“$1”，还有一张被粘死的碎纸条。记住这个时辰。'
    },
    {
      re: /^Cuối cùng cũng có một cái tên để gọi\. (.+?) Tớ sẽ đối chiếu lại, không muốn một lần nữa ghi sai người\.$/,
      en: 'At last, a name to call. $1 I will check it again — I do not want to write down the wrong person a second time.',
      zh: '终于有了一个可以称呼的名字。$1 我会再核对一遍，不想再一次写错人。'
    },
    {
      re: /^(.+?) Tớ sẽ đối chiếu lại, không muốn một lần nữa ghi sai người\.$/,
      en: '$1 I will check it again — I do not want to write down the wrong person a second time.',
      zh: '$1 我会再核对一遍，不想再一次写错人。'
    },
    {
      re: /^(.+?) Tớ sẽ giữ cẩn thận, biết đâu có ngày trả lại được cho đúng người\.$/,
      en: '$1 I will keep it safe. Perhaps one day I can return it to the right person.',
      zh: '$1 我会小心收好，也许有一天能还给它真正的主人。'
    },
    {
      re: /^(.+?) Tớ sẽ tìm vật chứng để kiểm tra điều mình vừa thấy\.$/,
      en: '$1 I will look for evidence to test what I just saw.',
      zh: '$1 我会去找物证，验证自己刚才看到的东西。'
    },
    {
      re: /^Ngăn kéo của giá sách có bốn hõm nhỏ như để đặt đồ chơi\. Mình còn thiếu (\d+) món\. Thử tìm quanh phòng học và gác nhỏ sau bếp\.$/,
      en: 'The bookcase drawer has four small recesses, as if for toys. I am still missing $1. Try looking around the schoolroom and the little attic behind the kitchen.',
      zh: '书架抽屉里有四个小凹槽，像是用来放玩具的。我还差 $1 件。去教室和厨房后面的小阁楼找找看。'
    }
  ];

  let lang = 'vi';
  let started = false;
  let index = { lang: null, dict: null, buckets: null };
  let reverse = { dict: null, map: null };

  const srcText = new WeakMap();   // text node -> câu gốc tiếng Việt
  const lastText = new WeakMap();  // text node -> giá trị vừa ghi ra
  const srcAttrs = new WeakMap();  // element -> Map(attr -> {orig, last})

  const dicts = () => (window.LNRT_I18N || {});
  const dict = () => dicts()[lang] || null;

  function buildIndex() {
    const d = dict();
    if (index.lang === lang && index.dict === d) return index;
    const buckets = new Map();
    if (d) {
      for (const k of Object.keys(d)) {
        if (k.length < 3) continue;
        // Khoá ngắn kết thúc bằng chữ chỉ dùng để khớp chính xác, tránh dịch dở câu.
        if (k.length < 8 && /[0-9A-Za-zÀ-ỹ]$/.test(k)) continue;
        const c = k.charAt(0);
        let arr = buckets.get(c);
        if (!arr) { arr = []; buckets.set(c, arr); }
        arr.push(k);
      }
      for (const arr of buckets.values()) arr.sort((a, b) => b.length - a.length);
    }
    index = { lang, dict: d, buckets };
    return index;
  }

  function buildReverse() {
    const d = dict();
    if (reverse.dict === d) return reverse;
    const map = new Map();
    if (d) for (const k of Object.keys(d)) {
      const v = d[k];
      if (typeof v === 'string' && v && !map.has(v)) map.set(v, k);
    }
    reverse = { dict: d, map };
    return reverse;
  }

  function translateCore(rawCore) {
    const core = String(rawCore || '').replace(/\s+/g, ' ').trim();
    const d = dict();
    if (!d || !core) return core;
    if (hasOwn(d, core)) return d[core];
    for (const p of PATTERNS) {
      const m = p.re.exec(core);
      if (m) {
        const tpl = p[lang];
        if (typeof tpl === 'string') {
          return tpl.replace(/\$(\d)/g, (_, i) => translateCore(m[+i] || ''));
        }
      }
    }
    if (!VI_RE.test(core)) return core;
    const ix = buildIndex();
    const arr = ix.buckets && ix.buckets.get(core.charAt(0));
    if (arr) {
      for (const k of arr) {
        if (k.length > core.length || !core.startsWith(k)) continue;
        const rest = core.slice(k.length);
        const boundary = /[^0-9A-Za-zÀ-ỹ]/.test(k.charAt(k.length - 1)) || !rest || /^[^0-9A-Za-zÀ-ỹ]/.test(rest);
        if (!boundary) continue;
        const restOut = translateCore(rest);
        const joiner = /^\s/.test(rest) && restOut && !/\s$/.test(d[k]) && !/^\s/.test(restOut) && !/[：，。！？；、]$/.test(d[k]) ? ' ' : '';
        return d[k] + joiner + restOut;
      }
    }
    return core;
  }

  function lookup(s) {
    if (typeof s !== 'string' || !s || lang === 'vi') return s;
    const d = dict();
    if (!d) return s;
    const m = /^(\s*)([\s\S]*?)(\s*)$/.exec(s);
    if (!m) return s;
    const rawCore = m[2];
    if (hasOwn(d, rawCore)) return m[1] + d[rawCore] + m[3];
    const core = rawCore.replace(/\s+/g, ' ').trim();
    if (!core) return s;
    const out = translateCore(core);
    if (out === core) return s;
    return m[1] + out + m[3];
  }

  function source(s) {
    if (typeof s !== 'string' || lang === 'vi') return s;
    const r = buildReverse();
    return r.map.get(s.replace(/\s+/g, ' ').trim()) || s;
  }

  function translateTextNode(node) {
    const cur = node.data;
    if (cur == null) return;
    let orig;
    if (lastText.has(node) && lastText.get(node) === cur) orig = srcText.get(node);
    else { orig = cur; srcText.set(node, cur); }
    if (orig == null) return;
    const out = lookup(orig);
    if (out === cur) { lastText.set(node, cur); return; }
    node.data = out;
    lastText.set(node, out);
  }

  function translateAttr(el, name) {
    if (!el.getAttribute) return;
    const cur = el.getAttribute(name);
    if (cur == null) return;
    let rec = srcAttrs.get(el);
    if (!rec) { rec = new Map(); srcAttrs.set(el, rec); }
    let a = rec.get(name);
    if (!a || a.last !== cur) { a = { orig: cur, last: cur }; rec.set(name, a); }
    const out = lookup(a.orig);
    a.last = out;
    if (out !== cur) el.setAttribute(name, out);
  }

  function translateAttrs(el) {
    for (const name of ATTRS) if (el.hasAttribute && el.hasAttribute(name)) translateAttr(el, name);
  }

  function isSkipped(node) {
    let el = node.nodeType === 1 ? node : node.parentElement;
    while (el) {
      if (el.id === 'dialogue-text' || el.hasAttribute('data-i18n-skip')) return true;
      el = el.parentElement;
    }
    return false;
  }

  function walk(root) {
    if (!root) return;
    if (root.nodeType === 3) { if (!isSkipped(root)) translateTextNode(root); return; }
    if (root.nodeType !== 1) return;
    if (SKIP_TAGS[root.tagName] || isSkipped(root)) return;
    translateAttrs(root);
    for (const child of root.childNodes) walk(child);
  }

  function applyDoc() {
    const isTrailer = document.body && document.body.getAttribute('data-doc') === 'trailer';
    const t = (isTrailer ? DOC_TRAILER : DOC)[lang] || DOC.vi;
    try { document.title = t.title; } catch (_) {}
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', t.desc);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', t.title);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', t.desc);
  }

  function syncSwitches() {
    const label = lookup('Ngôn ngữ');
    for (const g of document.querySelectorAll('.lang-switch')) g.setAttribute('aria-label', label);
    const buttons = document.querySelectorAll('[data-lang-set]');
    for (const b of buttons) {
      b.setAttribute('aria-pressed', b.getAttribute('data-lang-set') === lang ? 'true' : 'false');
    }
  }

  function setLang(next, save = true) {
    lang = LANGS.indexOf(next) >= 0 ? next : 'vi';
    if (save) { try { localStorage.setItem(STORE, lang); } catch (_) {} }
    document.documentElement.lang = HTML_LANG[lang] || lang;
    document.documentElement.setAttribute('data-lang', lang);
    applyDoc();
    walk(document.body);
    syncSwitches();
    try { document.dispatchEvent(new CustomEvent('lnrt:lang', { detail: { lang } })); } catch (_) {}
  }

  function cycle() {
    setLang(LANGS[(LANGS.indexOf(lang) + 1) % LANGS.length]);
  }

  function detect() {
    try {
      const q = new URLSearchParams(location.search).get('lang');
      if (q && LANGS.indexOf(q) >= 0) return q;
    } catch (_) {}
    try {
      const saved = localStorage.getItem(STORE);
      if (saved && LANGS.indexOf(saved) >= 0) return saved;
    } catch (_) {}
    const nav = String(navigator.language || 'vi').toLowerCase();
    if (nav.indexOf('zh') === 0) return 'zh';
    if (nav.indexOf('en') === 0) return 'en';
    return 'vi';
  }

  function start() {
    if (started) return;
    started = true;
    document.addEventListener('click', e => {
      const b = e.target && e.target.closest && e.target.closest('[data-lang-set]');
      if (b) setLang(b.getAttribute('data-lang-set'));
    });
    new MutationObserver(records => {
      for (const r of records) {
        if (r.type === 'characterData') {
          if (!isSkipped(r.target)) translateTextNode(r.target);
        } else if (r.type === 'attributes') {
          if (r.target.nodeType === 1 && !isSkipped(r.target)) translateAttr(r.target, r.attributeName);
        } else {
          for (const n of r.addedNodes) { if (n.parentNode && !isSkipped(n)) walk(n); }
        }
      }
    }).observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ATTRS
    });
    setLang(detect(), false);
  }

  window.I18N = {
    get lang() { return lang; },
    get langs() { return LANGS.slice(); },
    t: lookup,
    page: s => (lang === 'vi' || typeof s !== 'string') ? s : String(s).split('\n').map(line => lookup(line)).join('\n'),
    source,
    setLang,
    cycle,
    start,
    refresh: () => walk(document.body)
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
