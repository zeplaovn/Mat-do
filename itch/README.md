# itch.io — bộ hồ sơ phát hành

Thư mục này chứa mọi thứ dùng để đăng game lên itch.io. Không phải một phần của bản chạy game.

```
itch/
├── build/                              # bản copy runtime để đóng gói (tự sinh, không commit)
├── cover/cover-630x500.png             # ảnh bìa tạm từ title_bg
├── screenshots/                        # ảnh chụp màn hình (chụp lại trước khi đăng)
├── page/
│   ├── metadata.txt                    # title, tagline, tag, giá, cảnh báo
│   ├── description-vi.txt              # mô tả dài tiếng Việt
│   ├── description-en.txt              # mô tả dài tiếng Anh
│   └── checklist.md                    # các bước đăng
└── README.md                           # tệp này
```

## Đóng gói lại bản chạy

```bash
cd /home/daivan/Downloads/loinguyenrungthieng
rm -rf itch/build
mkdir -p itch/build/Loi_Nguyen_Rung_Thieng_Web_Game
cd itch/build/Loi_Nguyen_Rung_Thieng_Web_Game
cp ../../../index.html ../../../trailer.html .
cp ../../../*.css ../../../*.js .
cp -r ../../../assets ../../../i18n .
cp ../../../README.txt ../../../THONG_TIN_TAI_NGUYEN.txt .
cd ..
zip -qr ../loi-nguyen-rung-thieng-web.zip Loi_Nguyen_Rung_Thieng_Web_Game
```

Gói ZIP phải có `Loi_Nguyen_Rung_Thieng_Web_Game/index.html` ở cấp đầu. Với lựa chọn HTML5 của itch.io, trỏ thư mục gốc tới `index.html` bên trong gói.

## Quy ước

- `build/` và `*.zip` là sản phẩm sinh ra, đã nằm trong `.gitignore`.
- Ảnh bìa và ảnh chụp là tài nguyên phát hành; chỉ commit khi đã chọn bản cuối.
- Mọi thay đổi nội dung trang nên sửa trong `docs/ITCHIO.md` trước, rồi chép sang `page/`.
