#!/usr/bin/env node
/* Gộp + nén CSS của game thành game.min.css (một request thay vì 23).
   Chạy: npm run build:css   (cần: npm install). Sửa CSS nguồn rồi chạy lại; index.html tự cập nhật ?v=hash.
   Thứ tự dưới đây CHÍNH LÀ thứ tự cascade — giữ nguyên khi thêm file mới (đặt cuối nếu muốn ghi đè). */
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const root = path.join(__dirname, '..');
const FILES = [
  'style.css', 'horror.css', 'intro.css', 'ui.css', 'layout.css', 'camera.css', 'guard.css', 'brand.css', 'weather.css',
  'assets/research/research.css', 'skin.css', 'title-screen.css', 'puzzle-art.css', 'time-lighting.css', 'vfx.css',
  'ui-plus.css', 'hotspots.css', 'ending-cinematic.css', 'ending-credits.css', 'ui-v3.css',
  'assets/fonts/fonts.css', 'books-type.css', 'gloom.css'
];
const OUT = 'game.min.css';
/* url() tương đối theo file gốc -> tương đối theo thư mục gốc của game */
function fixUrls(css, file) {
  const dir = path.posix.dirname(file);
  if (dir === '.') return css;
  return css.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g, (m, q, u) => {
    if (/^(data:|https?:|\/|#)/.test(u)) return m;
    return `url(${q}${path.posix.normalize(path.posix.join(dir, u))}${q})`;
  });
}
(async () => {
  const esbuild = require('esbuild');
  const src = FILES.map(f => `/* ${f} */\n` + fixUrls(fs.readFileSync(path.join(root, f), 'utf8'), f)).join('\n');
  const { code } = await esbuild.transform(src, { loader: 'css', minify: true });
  fs.writeFileSync(path.join(root, OUT), code);
  const hash = crypto.createHash('sha1').update(code).digest('hex').slice(0, 8);
  const htmlPath = path.join(root, 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf8').replace(/href="game\.min\.css(\?v=[^"]*)?"/, `href="game.min.css?v=${hash}"`);
  fs.writeFileSync(htmlPath, html);
  console.log(`${OUT}: ${(src.length / 1024).toFixed(0)} KB -> ${(code.length / 1024).toFixed(0)} KB (v=${hash})`);
})();
