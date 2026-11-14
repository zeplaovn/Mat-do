# Checklist đăng itch.io

## Trước khi đăng

- [ ] Chạy `for f in tests/*.test.js; do node "$f"; done` — tất cả pass.
- [ ] Mở `index.html` bằng `file://` và bằng `python -m http.server` để kiểm tra cả hai đường.
- [ ] Kiểm tra ba ngôn ngữ: `?lang=vi`, `?lang=en`, `?lang=zh`; đổi ngôn ngữ trong Menu khi đang chơi.
- [ ] Chơi thử một lượt tới ít nhất một kết thúc, xác nhận lưu/khôi phục và nút Tiếp tục hiện đúng chương.
- [ ] Đóng gói ZIP mới theo `itch/README.md`; mở thử gói đã giải nén ở một thư mục khác.

## Tài nguyên trang

- [ ] Ảnh bìa 630×500 (`cover/cover-630x500.png` hiện là bản tạm cắt từ `assets/title_bg.webp`).
- [ ] 4–6 ảnh chụp 1440×900: màn hình chính, làng Đồng Chay, miếu, cổng biệt thự, phòng thờ, hành lang.
- [ ] Một GIF 3–5 giây cảnh chuyển cảnh hoặc hiệu ứng sương.
- [ ] Kiểm tra ảnh chụp không lộ thanh debug, hộp thoại tiếng Việt lỗi font hoặc màn hình loading dở dang.

## Form

- [ ] Title và short description theo `page/metadata.txt`.
- [ ] Dán `page/description-vi.txt`; thêm bản tiếng Anh ở phần mô tả hoặc dùng nút ngôn ngữ của itch.
- [ ] Chọn tags, platforms (HTML5 + Windows/Mac/Linux nếu phát hành ZIP).
- [ ] Điền content warnings và bật “Mature content” nếu cần.
- [ ] Chọn giá: miễn phí, pay-what-you-want, hoặc bán kèm demo.

## Sau khi đăng

- [ ] Mở trang ở chế độ ẩn danh, kiểm tra tải xuống và nút chơi trên trình duyệt.
- [ ] Đăng devlog phát hành (mẫu trong `docs/ITCHIO.md`).
- [ ] Lưu bản ZIP và ảnh bìa vào nơi lưu trữ lâu dài; không phụ thuộc duy nhất vào itch.io.
