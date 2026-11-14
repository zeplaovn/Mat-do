#!/usr/bin/env node
// Ghép docs/itch-description.html + docs/itch-theme.css thành một trang xem trước
// mô phỏng khung trang game của itch.io. Chỉ để xem tại máy; không upload.
//
//   node tools/build-itch-page.js
//
// Kết quả: docs/itch-preview.html (mở bằng trình duyệt).

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const description = fs.readFileSync(path.join(root, 'docs/itch-description.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'docs/itch-theme.css'), 'utf8');

const page = `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Xem trước trang itch.io — Lời Nguyền Rừng Thiêng</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 40px 20px 80px;
    background: #141414;
    font: 16px/1.6 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    color: #ddd;
  }
  .mock-bar { max-width: 760px; margin: 0 auto 16px; font-size: 12px; letter-spacing: .18em; text-transform: uppercase; color: #666; }
  .mock { max-width: 760px; margin: 0 auto; background: #1d1d1d; border: 1px solid #2a2a2a; }
  .mock-cover { height: 220px; background: #101010 url("../assets/title_bg.webp") center/cover; filter: saturate(.9) brightness(.55); }
  .mock-head { padding: 22px 32px 0; }
  .mock-head h1 { margin: 0; font-size: 30px; letter-spacing: .01em; }
  .mock-head p { margin: 4px 0 0; color: #9a9a9a; font-size: 14px; }
  .mock-body { padding: 8px 32px 40px; }
  .mock-buy { display: flex; gap: 10px; align-items: center; margin: 18px 0 22px; padding: 14px 0; border-top: 1px solid #2a2a2a; border-bottom: 1px solid #2a2a2a; }
  .mock-buy span { font-size: 13px; color: #8a8a8a; }
  .mock-buy b { display: inline-block; padding: 8px 18px; background: #fa5c5c; color: #201313; border-radius: 3px; font-size: 14px; }
${css.replace(/^/gm, '  ')}
</style>
</head>
<body>

<div class="mock-bar">Xem trước · mô phỏng khung trang itch.io</div>

<div class="mock">
  <div class="mock-cover"></div>
  <div class="mock-head">
    <h1>Lời Nguyền Rừng Thiêng</h1>
    <p>Bí mật Biệt thự Vân Hòa · Mắt Đỏ Studio</p>
  </div>
  <div class="mock-body">
    <div class="mock-buy"><b>Chơi ngay</b><span>HTML5 · chạy trong trình duyệt</span></div>
    <div class="formatted_description user_formatted">
${description}
    </div>
  </div>
</div>

</body>
</html>
`;

fs.writeFileSync(path.join(root, 'docs/itch-preview.html'), page);
console.log('docs/itch-preview.html');
