LỜI NGUYỀN RỪNG THIÊNG — BÍ MẬT BIỆT THỰ VÂN HÒA
BẢN GAME WEB POINT-AND-CLICK CÓ THỂ CHƠI (2026)
====================================================

CẬP NHẬT TRẢI NGHIỆM 04/11/2026
--------------------------------
- Trailer ở trailer.html khôi phục chuỗi cảnh, lời dẫn và chân dung của bản gốc;
  vẫn là trang độc lập với phát/tạm dừng, tua, tắt tiếng, bỏ qua và xem lại.
- Tích hợp 18 tài liệu và 25 câu đố, trong đó có ba hồ sơ đối chiếu mới; đọc sách,
  đánh dấu và lưu đoạn văn. Mở Menu > Sách và câu đố để xem tư liệu đã tìm.
- Năm di vật có các hồi tưởng mới. Thư viện lời thoại đã rà soát được lưu theo mã cảnh;
  các cảnh và tương tác phù hợp đã được nối, những cảnh chưa có màn chơi vẫn là tư liệu.
- Cảnh BG01–BG09 dùng ảnh nền mới; có danh sách điểm tương tác cho màn hình cảm ứng.
- Mưa, sương, sấm chớp ở các cảnh phù hợp và ánh đèn chập chờn trong nhà;
  có thể tắt ánh chớp tại Menu > Đèn và chớp.
- Điện thoại dùng lớp mưa nhẹ không phụ thuộc canvas; bụi và sương vẫn hiển thị
  khi mức hiệu năng tự động chuyển xuống thấp.
  Hiệu ứng chuyển động cũng tuân theo cài đặt giảm chuyển động của thiết bị.
- Gợi ý giờ ngắn và theo yêu cầu; không đưa sẵn lời giải trong nhật ký.
- Bản lưu cũ được giữ; kết thúc Tha thứ của bản trước được ghi nhận riêng với bốn
  kết thúc của bản hiện tại.
- Các mục cập nhật cũ bên dưới được giữ làm lịch sử; có thể mô tả tính năng
  hoặc cốt truyện đã thay đổi trong các bản sau.
- Kiểm tra dữ liệu sách, câu đố, tiến trình và tương thích bản lưu: node tests/integration.test.js.
- Kiểm tra thời điểm hiệu ứng và tùy chọn ánh sáng: node tests/weather.test.js.
- Kiểm tra tương thích khi thiếu canvas/ResizeObserver:
  node tests/weather.test.js --no-canvas --no-resize-observer.
- Kiểm tra lớp kinh dị và bụi ở mức thấp: node tests/horror.test.js
  (thêm --no-canvas để kiểm tra trường hợp canvas không khả dụng).
- Kiểm tra chuỗi cảnh gốc và điều khiển trailer: node tests/trailer.test.js.

1. CÁCH CHƠI NGAY
----------------
- Giải nén toàn bộ tệp ZIP.
- Mở thư mục Loi_Nguyen_Rung_Thieng_Web_Game.
- Nhấp đúp index.html để chơi bằng Chrome, Edge hoặc Firefox.
- Giữ nguyên cấu trúc thư mục assets/ bên cạnh index.html.
- Không cần cài Node.js hay tải thêm thư viện từ Internet.

Nếu trình duyệt hạn chế phát âm thanh hoặc lưu tiến trình khi mở
bằng đường dẫn file://, hãy chạy máy chủ web nội bộ:
  + Mở Terminal/Command Prompt trong thư mục trò chơi.
  + Chạy: python -m http.server 8000
  + Truy cập: http://localhost:8000

Game cũng có thể được đưa lên một dịch vụ host website tĩnh như
GitHub Pages hoặc Netlify, chỉ cần giữ nguyên các tệp/thư mục.

2. CÁCH ĐIỀU KHIỂN
------------------
- Click/chạm hình thoi mờ trong cảnh để quan sát, lấy đồ, đi tiếp.
- Click/chạm vào đồ trong túi để chọn hoặc sử dụng.
- Nhật ký ghi lại manh mối.
- Phím H: gợi ý; F: bật/tắt đèn pin; J: nhật ký; V: đổi chế độ máy ảnh.
- Phím Esc: đóng cửa sổ hoặc hội thoại.
- Góc trên phải: biểu tượng cuốn sổ = Nhật ký, biểu tượng 3 gạch = Menu.
- Menu: nhiệm vụ hiện tại, cách chơi, gợi ý, bật/tắt âm thanh, bắt đầu lại, về màn hình chính.
- Enter/Space: tiếp lời thoại. Nhật ký: mũi tên trái/phải hoặc nhấp mép trang để lật.
- Intro: Space/chạm = chuyển câu nhanh; Esc hoặc nút "Bỏ qua" = vào game ngay.
- Tiến trình được lưu trong localStorage của trình duyệt khi được phép.

3. NỘI DUNG ĐÃ CÓ
-----------------
- 47 cảnh được khai báo và nhiều ảnh nền WebP 1280 x 720 px.
- Đường đi từ làng Đồng Chay, rừng tre, biệt thự Vân Hòa
  tới tầng hầm và căn phòng kín.
- Chân dung năm sinh viên Đông, Nam, Tuyết, Ánh, Nguyệt.
- Điểm click, các cuộc hội thoại, âm thanh bối cảnh/SFX.
- Túi đồ, nhật ký, tự động lưu và gợi ý nhẹ khi người chơi yêu cầu.
- 5 di vật cần tìm ở BG09, BG13, BG16, BG17 và BG20.
- Câu đố chìa khóa cổng, mật mã 4 số, bức tường năm dấu tay,
  nghi lễ năm bát hương.
- 4 kết thúc BAD / NORMAL / GOOD / TRUE tùy chứng cứ và lựa chọn.
- Giao diện tương thích chuột, bàn phím và màn hình cảm ứng.

4. GỢI Ý NGẮN (CÓ THỂ CHỨA SPOILER)
----------------------------------
- Kiểm tra bát hương ở miếu BG05 trước khi vào rừng.
- Chìa khóa cổng ở cột mốc rừng sâu BG07.
- Mã hộp sắt là thời điểm đồng hồ đứng im trong BG11.
- Thanh sắt phá tường lấy ở gian bếp BG13.
- Dùng máy ảnh lên gương phòng trẻ BG16.
- Tìm 5 di vật, sau đó trở về phòng thờ BG12.
- Để mở kết thúc tốt nhất, lưu đủ 3 nhóm chứng cứ:
  sổ cứu trợ, bản thú tội và hộp tài liệu dưới hầm.

4b. MÀN LOADING, INTRO VÀ HIỆU NĂNG (BẢN NÂNG CẤP)
---------------------------------------------------
- Loading: nén hương cháy dần theo tiến độ nạp ảnh/âm thanh thật. Tối thiểu ~2,4 giây,
  tối đa 15 giây (tệp lỗi không làm treo game). Sau khi vào game, các cảnh còn lại
  được nạp ngầm từng ảnh một để chuyển cảnh không bị khựng.
- Intro: ~25 giây, 6 câu + tiêu đề, có tiếng cửa kẽo kẹt, tiếng gõ cửa, giật hình.
  Chỉ phát khi bấm "BẮT ĐẦU ĐIỀU TRA"; "TIẾP TỤC" và "Chơi lại" trong game bỏ qua intro.
- Hiệu ứng có 3 mức, tự chọn theo số nhân CPU, RAM, màn hình cảm ứng; nếu vào game
  mà FPS thấp thì tự hạ một bậc (chỉ khi để Tự động):
    Cao  : sương 2 lớp, bụi 46 hạt, nhiễu hạt blend, vạch quét, vignette bám con trỏ,
           parallax, méo sóng SVG ở logo.
    Vừa  : sương 1 lớp, bụi 22 hạt (15 FPS), nhiễu chậm, vignette bám con trỏ, vạch quét,
           logo rè CSS + bộ lọc SVG tĩnh.
    Thấp : không canvas, sương tĩnh trôi chậm, nhiễu rất chậm, vignette tĩnh,
           không parallax, logo không lọc SVG.
  Ở mọi mức vẫn giữ: tối rìa tăng theo mức sợ hãi, nhịp tim, chớp tắt đèn,
  bóng đen mắt đỏ, thì thầm, drone âm thanh, đèn pin và các cú giật mình.
- Đã gộp đầy đủ lớp VFX của bản "Mắt đỏ": đèn pin/vignette bám con trỏ, vạch quét,
  nhiễu hạt blend overlay, mạch máu đập theo nhịp, chớp đèn, logo rè SVG + tia sáng.
- Cần chỉnh thủ công: mở perf.js (hàm guess) để đổi ngưỡng nhận máy yếu.

5. CẤU TRÚC THƯ MỤC
------------------
index.html                 — trang game, khởi chạy ở đây
style.css                  — giao diện responsive
horror.css / horror.js     — hiệu ứng kinh dị (đã tối ưu theo 3 mức)
perf.js                    — chọn mức hiệu ứng, tự hạ mức khi giật
intro.css / intro.js       — màn loading và intro
ui.css                     — nút bo tròn, thẻ kính, cửa sổ, màn hình tiêu đề
layout.css                 — BỐ CỤC MỚI: màn chơi fullscreen, HUD, hội thoại, thanh vật phẩm, nhật ký
assets/title_bg.webp       — nền màn hình tiêu đề (đã khử màu sẵn để bỏ filter lúc chạy)
 game.js                   — toàn bộ logic điều khiển/gameplay
assets/background/         — BG01.webp đến BG20.webp
assets/portraits/          — chân dung 5 nhân vật
assets/items/              — hình vật phẩm và đạo cụ
assets/sound/              — hiệu ứng âm thanh do người dùng cung cấp
README.txt                 — hướng dẫn này
THONG_TIN_TAI_NGUYEN.txt   — lưu ý về tư liệu và quyền sử dụng

6. LƯU Ý
---------
Đây là bản game web đơn người chơi có nội dung trọn tuyến và có thể
chơi thử từ đầu tới kết thúc. Chưa có hệ thống backend, tài khoản,
phân cảnh nhân vật hoạt hình, thu âm thoại nhân vật hay cơ chế chiến đấu.
Tọa độ điểm click có thể tiếp tục tinh chỉnh dựa trên thiết kế gameplay.

Truyện, biệt thự và sự kiện năm 1988 hoàn toàn hư cấu. Tài nguyên
hình ảnh, chân dung, đạo cụ và âm thanh được lấy từ gói tư liệu người
dùng cung cấp trong cuộc trò chuyện.

KIỂM TRA CHẤT LƯỢNG
------------------
Đã xác nhận đủ 20 ảnh BG 1280×720, 13 ảnh vật phẩm, 5 chân dung.
Đã thử hành trình chính, giải mật mã 0317, bức tường năm dấu tay,
nghi lễ năm di vật, và kết thúc "Trả lại tên người chết".

7. NÂNG CẤP KINH DỊ (horror.css + horror.js)
--------------------------------------------
- Nhiễu hạt phim, sương, bụi/đom đóm đỏ, vignette bám theo con trỏ, mạch máu viền màn hình.
- Độ sợ (dread) tăng dần theo cảnh: ảnh nền ngả xám, tối dần, nhịp tim nhanh dần.
- Glitch khi chuyển cảnh, chớp đèn, bóng ma mắt đỏ xuất hiện ngẫu nhiên từ BG09 trở đi.
- Âm thanh tạo bằng WebAudio: drone, nhịp tim, thì thầm, tiếng sting (tắt cùng nút ♪).
- Hội thoại gõ từng chữ (nhấp vào chữ để hiện ngay). Tôn trọng chế độ giảm chuyển động của hệ điều hành.

8. CHƯƠNG 7 · CÁI TÊN THỨ SÁU (MỚI)
-----------------------------------
- Sau nghi lễ năm di vật, tiếng khóc trẻ con vọng từ phòng trẻ; cổng biệt thự không cho rời đi.
- Thu 3 manh mối: chuông đồng (giếng BG09), giấy khai sinh (ngăn kéo BG17), mảnh vải thêu (nôi BG16).
- Chọn chuông, lắc bên nôi để sang BG21 (bên kia gương) rồi BG22 (đáy giếng cạn): 3 cảnh mới, 2 vật phẩm mới.
- Câu đố gọi tên bé gái. Kết thúc thật cần cả chứng cứ lẫn việc trả lại cái tên thứ sáu.

9. CHƯƠNG 8 · BÓNG ÔNG LÂM (MỚI)
--------------------------------
- Sau khi gọi tên Mơ, ánh đỏ chặn cửa chính ở đại sảnh (BG23, thay BG11 cho tới khi xong).
- Lên gác mái BG24 qua nắp trần hành lang BG15, lấy lời khai bà Mận.
- Đối chất 3 vòng với bóng ông Bá Lâm bằng đúng chứng cứ; trả lời sai thì phải làm lại.
- Có chân dung cho Mơ, ông Bá Lâm, bà Mận. Logo rè rè (SVG méo sóng + nhiễu tĩnh + tiếng điện). Chữ giao diện được phóng to.

10. GIAO DIỆN MỚI · NÚT BO TRÒN (ui.css + ui.js)
-----------------------------------------------
- Toàn bộ nút đã bo tròn: nút biểu tượng thành hình tròn, nút hành động/hộp thoại
  thành viên thuốc, nút chọn trong cửa sổ bo góc mềm; ô vật phẩm và chân dung cũng bo góc.
- Thanh trên là capsule kính; màn chơi dùng khung cảnh bo tròn, nhãn/chú thích dạng chip,
  hộp thoại kính có viền đỏ, thanh hành động dạng dock và bảng bên chia thành các thẻ.
- Màn nhỏ: tiêu đề thương hiệu xuống hai dòng, hộp thoại nằm dưới khung ảnh và tự canh
  khoảng cách theo độ dài lời thoại (ui.js) để không đè lên thanh hành động.
- ui.css nạp sau intro.css nên không sửa style.css gốc; hiệu ứng hình ảnh và 3 mức
  hiệu năng vẫn hoạt động như cũ. Mức Thấp tự tắt backdrop-filter để nhẹ máy.

11. BỐ CỤC MỚI · MÀN CHƠI FULLSCREEN (layout.css + index.html + game.js)
-----------------------------------------------------------------------
- Màn chơi chiếm toàn bộ cửa sổ. Khung cảnh luôn là khung 16:9 lớn nhất vừa màn hình (để điểm
  click khớp ảnh); phần viền thừa được lấp bằng chính ảnh cảnh đã làm mờ. Đã bỏ thanh trên, thanh
  tên cảnh, thanh hành động, bảng nhiệm vụ, bảng nhóm, ô nhật ký và ghi chú chân trang.
- Góc trên trái: chip nhỏ (chương · giờ · tên địa điểm). Góc trên phải: Nhật ký + Menu.
- Thanh vật phẩm nằm ở đáy màn hình. Khi có dẫn truyện/hội thoại thanh này tự ẩn, hết thoại hiện lại.
- Hội thoại: khung chat ở đáy, chân dung nhân vật nằm TRÊN khung chat, phía trái.
- Vật phẩm được nhắc trong lời thoại (máy ảnh, đèn pin, nhang, chìa khóa, chuông...) tự hiện
  thành thẻ ở phía phải, trên khung chat. Danh sách từ khóa: ITEM_WORDS trong game.js.
- Nhặt được vật phẩm/di vật: thẻ thông báo "ĐÃ NHẬN ĐƯỢC" nổi ở giữa phía trên màn hình.
- Nhật ký là một cuốn sổ: bìa da tự mở, ghi chép theo thứ tự thời gian, lật trang có hiệu ứng,
  ruy băng đánh dấu, mở sẵn ở trang mới nhất. Điện thoại dọc hiển thị 1 trang. Chấm đỏ trên biểu tượng
  nhật ký báo có ghi chép mới.
- ui.js đã bỏ (chỉ phục vụ bố cục cũ). style.css/ui.css/horror.css giữ nguyên; layout.css nạp cuối
  nên ghi đè. Một số luật CSS cũ (.topbar, .sidebar, .action-strip...) không còn được dùng.

12. CẬP NHẬT ÂM THANH · VẬT PHẨM · HỘI THOẠI
---------------------------------------------
Âm thanh (game.js: SOUND, AMBIENCE, WOOD_FLOOR, VILLA_ROOMS · intro.js: slam):
- Intro, cảnh cuối: creaking-door → (≈1,5 s sau) door-slam → knock-on-the-door. door-slam.mp3 có ~4 s dạo đầu im lặng
  nên được phát từ giây 3,3 (hằng SLAM_FROM / SLAM_LEAD) để cú đập rơi ngay sau tiếng kẽo kẹt. Bấm "Bỏ qua" sẽ dừng các tiếng này.
- Âm thanh nền theo từng cảnh (nhiều lớp, tắt/bật dần khi đổi cảnh; bảng AMBIENCE trong game.js):
    BG01 cổng làng      tieng_on_ao_o_cho (đông người)
    BG02 ngõ làng       tieng_on_ao_o_cho (nhỏ, xa dần)
    BG03 ruộng, mương   nuoc_chay + community-frogs
    BG04 cầu gỗ         nuoc_chay + frogs-croaking-at-night
    BG05 ven rừng       frogs-croaking-at-night (nhỏ)
    BG06–BG10 rừng/sân/hiên   không có tệp nền (chỉ drone WebAudio của horror.js)
    BG11–BG17, BG23, BG24     than_lan_keu (thằn lằn, CHỈ ở trong nhà biệt thự)
    BG18–BG22 hầm/giếng/bên kia gương   im lặng
- Tiếng bước chân trên gỗ chỉ phát ở BG14, BG15, BG24 (các phòng còn lại lát gạch/đá nên không phát).
- Tiếng cửa kẽo kẹt chỉ phát khi đi qua cửa chính (BG10 ↔ BG11) và mở cổng; cổng sầm lại bằng door-slam.
- Tiếng lật giấy chỉ khi nhặt đồ bằng giấy; hộp sắt mở = tiếng "tách"; ảnh gia đình không còn tiếng màn trập.
Vật phẩm dùng xong thì bị xóa (state.used, hàm consume() trong game.js):
- Chìa khóa (mở cổng), thanh sắt (phá tường), chuông đồng (lắc nôi), hộp nhạc (gọi tên Mơ), lời khai bà Mận (đối chất xong),
  nhang + bật lửa + năm di vật (nghi lễ; đặt sai thứ tự thì di vật quay lại túi). Đã dùng thì không nhặt lại được.
- Máy ảnh, đèn pin, sổ tay là dụng cụ dùng nhiều lần nên giữ lại.
Hội thoại và văn bản giao diện không còn nói thẳng lời giải: vị trí đồ vật, mật mã 0317, thứ tự nghi lễ, cách dùng vật phẩm.
Nút Gợi ý (H) vẫn có nhưng chỉ nhắc hướng đi, không đọc đáp án. Thứ tự các nút trong câu đố nghi lễ cũng đã xáo trộn.

13. ÂM THANH CHỈ TỪ ASSET · BƯỚC CHÂN · BỘ LỌC MÁY ẢNH
------------------------------------------------------
- Đã gỡ toàn bộ âm thanh sinh bằng code (WebAudio: drone, nhịp tim, thì thầm, sting, tiếng điện ở logo). Mọi âm thanh đều là tệp trong assets/sound.
  Cú giật mình (scare) dùng cú đập của door-slam.mp3. Nhịp tim chỉ còn hiệu ứng hình (viền máu đập).
- Tương tác = bước chân (tieng_buoc_chan.mp3): bấm điểm đi sang cảnh khác -> 3 bước; bấm xem/nhặt đồ -> 2 bước.
  Đã bỏ tiếng gõ cửa dùng làm phản hồi câu đố (dấu tay, sai mã, sai thứ tự). Tiếng gõ chỉ còn là sự kiện truyện ở BG18/BG19.
- Máy ảnh: chọn "Máy ảnh" trong túi đồ để bật khung ngắm. Phím V (hoặc nút "Đổi chế độ") chuyển 4 chế độ:
  NIGHT VISION (xanh lá) · INFRARED (đen trắng) · THERMAL (bản đồ nhiệt) · CAMCORDER (băng VHS).
  Khung ngắm có REC, đồng hồ chạy, pin, giờ trong game, nhiễu hạt, vạch quét và dải nhiễu. Chụp gương phòng trẻ có chớp sáng.
  Mã: camera.css + khối "MÁY ẢNH" trong game.js. Mức hiệu ứng Thấp tự tắt hoạt ảnh của khung ngắm.

14. CẬP NHẬT THÁNG 11/2026: DỌN TÍNH NĂNG · BẢO MẬT · HỘI THOẠI · ÂM THANH
---------------------------------------------------------------------------
Đã bỏ (không cần thiết): sơ đồ hành trình (phím M), nút "Quay lại cảnh trước", nút ẩn/hiện dấu tương tác,
  nút đổi mức hiệu ứng và nút toàn màn hình trong Menu (mức hiệu ứng vẫn tự chọn theo máy, perf.js),
  khung chân dung nhân vật và thẻ vật phẩm hiện bên khung chat (assets/portraits không còn được nạp; có thể xóa thư mục).
Điểm tương tác: căn lại 20 điểm cho khớp vật thể trong ảnh (bà bán nước, cổng làng, ván cầu, bát hương, dải vải đỏ,
  cột mốc đá, nôi, trâm, sổ sách, dép, đồ dùng năm người... xem mảng HOT trong lịch sử commit).
Hội thoại: viết lại toàn bộ 24 cảnh và các câu khi tương tác; mỗi người một giọng (Đông điềm tĩnh, Nam tếu táo che sợ,
  Tuyết dịu dàng, Ánh hăng hái, Nguyệt trầm lặng), có ngập ngừng, sợ hãi, an ủi nhau. Không lộ đáp án câu đố.
Hội thoại nền: người trong làng nói chuyện với nhau ở BG01–BG05 (bảng OVERHEARD trong game.js), hiện chữ nhỏ ở góc trái,
  mỗi 20–36 giây một đoạn, không chặn thao tác, tự ẩn khi có hội thoại/bảng mở.
Bảo mật (guard.js, guard.css, Content-Security-Policy trong index.html):
  chặn chọn chữ, copy, cắt, dán (kể cả vào ô nhập mã), kéo thả, chuột phải, Ctrl+C/X/V/A/S/U/P, F12, Ctrl+Shift+I/J/C.
  Bản lưu có chữ ký: sửa tay localStorage sẽ làm bản lưu bị bỏ qua. Dữ liệu đọc lên được kiểm tra kiểu và danh sách hợp lệ.
  LƯU Ý: game chạy hoàn toàn trên máy người chơi nên đây chỉ là lớp cản trở người dùng thông thường; không thể ngăn
  người có kỹ năng (xem nguồn, công cụ lập trình, chụp màn hình). Bản lưu cũ (trước bản cập nhật) sẽ không đọc được, nút
  "Tiếp tục" chỉ hiện khi có bản lưu mới. Muốn bảo vệ thật sự cần máy chủ.
Âm thanh: tiếng thạch sùng (than_lan_keu_3s.mp3, cắt 3,0 s từ tệp gốc) chỉ phát 1 lần mỗi 2 phút trong nhà biệt thự,
  đúng 3 giây rồi tắt (lần đầu sau ~20 s). Thêm tiếng dế (tieng_de_keu.mp3, 61 s lặp) ở BG04, BG05, BG06; BG07 trở đi
  im lặng như lời thoại của Nam. Tệp than_lan_keu.mp3 gốc đã được xóa khỏi assets (vẫn lấy lại được từ lịch sử git).

15. CHƯƠNG 9 · NĂM CÁI TÊN (MỚI)
--------------------------------
- Sau khi bóng ông Bá Lâm tan, cổng sắt vẫn khóa: Mơ nói năm người bị nhốt chưa có tên (game.js: QNAMES, questOn, nameClueAt, showNames).
- Quay lại năm nơi từng có di vật, chạm đúng điểm cũ để đọc tên và câu chuyện của từng người:
    giếng đá BG09 (Lê Văn Hải) · muôi cơm BG13 (Trần Thị Sen) · chiếc nôi BG16 (Phạm Thị Lụa)
    sổ sách BG17 (Nguyễn Văn Tâm) · đôi dép trong hầm BG20 (Đỗ Văn Khoa). Mỗi tên được ghi vào nhật ký.
- Đủ năm tên: chạm bàn thờ BG12, ghép từng di vật với đúng người (sai thì bát hương không bắt lửa, không mất gì).
- Xong thì cổng mở. Kết thúc thật nay cần cả năm cái tên; nhãn chương, nhiệm vụ và gợi ý tự đổi trong lúc làm chương này.
- Chương này dùng lại ảnh nền và điểm tương tác sẵn có (chưa có ảnh nền mới). Muốn thêm cảnh mới: thêm ảnh BG25.webp... vào assets/background
  rồi khai báo trong SCENES.

16. CHƯƠNG 9 MỞ RỘNG (Nov 2026)
- Cảnh mới BG25–BG32: sân sau, kho lương, phòng ngủ ông Bá Lâm, phòng học của Mơ, vườn mộ, ban công, trong miếu, gian giam. BG33 = nền kết thúc thật.
- Lối vào: BG13 cửa sau → BG25; BG15 → BG27; BG16 (sau tủ) → BG28; BG05 miếu → BG31 (sau khi ông Lâm tan).
- Chuỗi: két sắt BG27 (mã 1981) → chìa kho ở ghế bập bênh BG30 → mở kho BG25 → sổ BG26 → hầm BG32;
  5 tên: giếng BG09, bếp BG13, tranh BG28, sổ BG26, vạch phấn BG32 → lấy nhang BG31 → khấn tên ở BG29 → cổng mở.
- Logo thay tiêu đề + loading (assets/logo.webp, brand.css); trailer.mp3 là nhạc nền màn hình chính và đoạn mở đầu "Bắt đầu điều tra".

17. TRAILER WEB
- Mở trailer.html (cùng thư mục, dùng chung assets) để xem trailer giới thiệu ~65 giây: cảnh nền, chân dung, chữ chạy, nhạc trailer.mp3. Có nút tắt tiếng, bỏ qua, xem lại và nút CHƠI NGAY. Màn hình chính của game có nút "XEM TRAILER".

18. CHUỖI CÂU ĐỐ MẢNH ĐƠN (MỚI)
- Lá đơn tố cáo bị xé làm ba. Mảnh 2: giải mã dòng chữ sau khung ảnh (BG11, mật mã Caesar dịch 7). Dòng chữ chỉ giờ 11:45.
  Mảnh 1: chỉnh kim đồng hồ quả lắc (BG11) về 11:45 để mở ngăn kín. Mảnh 3: sổ cứu trợ trên bàn ông Lâm (BG17).
  Đủ ba mảnh thì bấm vào sổ ở BG17 để ghép (sắp ba mảnh đúng thứ tự) → nhận di vật "Mảnh đơn tố cáo".
- Mỗi câu đố có nút GỢI Ý 3 bậc (hintBlock). Hộp sắt BG17 vẫn dùng mã 0317, két phòng ngủ mã 1988.

19. CHƯƠNG MỚI: BÁT CƠM NÓNG · ĐÊM 17/3 · RỪNG THIÊNG (BG34–BG44)
- Sau khi bóng ông Lâm tan (lamDone): bát cơm nóng ở phòng thờ BG12 → soi dấu chân bằng đèn pin ở bếp BG13 → gác nhỏ cô Lụa BG43
  (sắp ba trang nhật ký theo thứ tự thời gian) → "Đêm 17/3/1988" chơi vai bé Mơ 7 tuổi (BG34→35→37→36→38→39):
  chọn có đánh thức bà Mận hay không, giữ nhịp thở lấy chìa của cha, mở gian giam, ngã xuống giếng, sắp lại ba việc em đã làm.
- Xong thì về giếng bị bịt BG42, rồi mới tới Chương 9 (năm cái tên). Đêm trại BG44 (hiên BG10) có ba đoạn hội thoại: Tuyết, Nam với Đông, Nguyệt.
- Sau khi gọi đủ năm tên: ra cổng sẽ vào rừng thiêng BG40 → dải vải đỏ → nhà bà ngoại BG41 → bàn thờ đá để chọn "Công khai" hoặc "Tha thứ" (kết thúc 4).
- Kịch bản gốc: KICH_BAN_CHUONG_MOI.md.

20. CÂU ĐỐ MỚI: GHÉP HÌNH · KÝ HIỆU RIÊNG · SẮP ĐỒ · TÀI LIỆU · MƯA VÀ SƯƠNG
- Ghép hình (BG43): mảnh ảnh giấu dưới gối, 12 mảnh, bấm hai mảnh để đổi chỗ, giữ nút "Xem ảnh mẫu" để so. Ghép xong có "Mặt sau tấm ảnh": thứ tự đứng ký đơn.
- Sắp đồ (BG28): ngăn kéo giá sách có bốn hõm. Nhặt búp bê (BG43), hạc giấy, xe gỗ, viên phấn (BG28), đọc bài đồng dao trên bảng đen,
  đặt đúng thứ tự → nhận "Bảng ký hiệu của năm người".
- Ký hiệu riêng (BG26): nắp hầm có năm vòng ký hiệu (cây bút, cái cân, nốt nhạc, ngọn lửa, con sóng). Nhập đúng thứ tự đứng ký đơn.
- Tài liệu: chạm vào giấy tờ trong túi đồ để đọc toàn văn, có nút "Gợi ý cách mở". Nhật ký cũng có gợi ý cho từng ghi chép.
- Mưa và sương mù (weather.js, weather.css): cường độ theo từng cảnh; số hạt mưa và số lớp sương giảm theo mức hiệu năng; tắt khi bật giảm chuyển động.

21. ÂM THANH MỚI (rain, nature_forest, ambient_house, crow, pick, intro)
- rain.mp3: cảnh mưa BG38, BG39 (nhẹ ở BG25). nature_forest.mp3: ven rừng BG05–06, rừng thiêng BG40, vườn mộ BG29, nhà bà ngoại BG41 (BG07 vẫn im phăng phắc).
- ambient_house.mp3: nền chung trong biệt thự (BG11–17, BG23–24, BG27–28, BG43 và ký ức BG34–35).
- crow.mp3: quạ kêu thưa (45–100 giây một tiếng) ở các cảnh ngoài trời. pick.mp3: tiếng nhặt đồ (giấy tờ vẫn dùng tiếng lật giấy).
- intro.mp3: nhạc nền đoạn intro; trailer.mp3 chỉ còn ở màn hình chính. Các tệp dài đã nén mono 80 kbps (tổng thêm ~9 MB).

22. DỌN TUYẾN CŨ THEO KỊCH BẢN CHÍNH THỨC (docs/KICH_BAN_CHINH_THUC.md là bản chuẩn)
- Đã bỏ: gạo cứu trợ, 312 bao gạo, 41 ngày giam, Mơ mang cơm và dùng chìa mở ngục.
- BG26 = kho vật tư (thùng đồ lễ đóng dấu đỏ); BG32 = kho đồ lễ dưới hầm (năm vị trí vẽ phấn, năm bát lễ). Cơ chế câu đố, cờ và đường đi giữ nguyên.
- Sổ Tâm ghi phiếu cấp đồ lễ và tấm vải che ô thông gió; đơn tố cáo nói về lễ lừa, cửa hầm khóa ngoài, ô gió bị che.
- Hồi tưởng Mơ (BG34–39) viết lại: bát nhỏ để riêng (bát thứ sáu) → nghe lén ông Lâm và thầy Tịnh → tiếng kêu cứu sau cửa hầm, cha buông tay khỏi then cửa → chọn đúng ấn đồng trên thành giếng (cờ fbSeal) → trượt ngã 03:17 (chỉ có âm thanh).
- Còn lại theo kịch bản mới (chưa làm): Sim, thầy Tịnh, ông Hựu, ông Đạt, Huyền Lâm Thánh Quân, BG45–47, năm hồi tưởng sinh viên, bốn kết thúc BAD/NORMAL/GOOD/TRUE (hiện vẫn là true/normal/forgive).
- Âm nền ambient giảm 10% bằng hệ số AMB_GAIN trong game.js.

23. CHƯƠNG MỞ ĐẦU ĐỒNG CHAY (ảnh mới BG45–47)
- BG45 sân chùa làng: vào từ cổng làng BG01 (lối bên phải). Ông Hựu xem quẻ ("Năm người. Năm nhà.", "Đừng đáp tiếng gọi từ giếng"), cờ huuDone, ghi vào nhật ký.
- BG46 bàn lễ trước miếu: vào từ BG05. Sáu chỗ bày lễ, ngọn đèn thứ ba tự cháy (cờ lamp6); bài vị đọc được "Huyền Lâm Thánh Quân" để đối chiếu về sau.
- BG47 (nền tế rừng cũ 2026) và BG47b (bản 1986, cùng góc máy): đã có ảnh và được nạp sẵn, chưa nối vào cốt truyện vì chưa có tuyến Sim/Đạt.
- assets/props: Closeup01_Coins, Closeup02_Papers (hai bản sớ), Closeup03_SquareSeal (ấn đồng) chờ gắn vào câu đố sớ giả/sớ thật.

24. ẢNH MỚI (bộ dong_chay_assets)
- Thay nền: BG26 kho vật tư, BG32 kho đồ lễ (năm vòng phấn), BG34 bếp 1988 (sáu bát), BG36 hành lang bếp, BG37 cửa hầm có then cài ngoài. Vùng bấm đã chỉnh lại cho khớp bố cục.
- Đã nạp sẵn: BG48 và BG49 (nhà và phòng khách có ảnh Sim, file gốc đặt tên "ong_huu" nhưng dùng làm nhà ông Đạt), BG50 (sân trước biệt thự dưới mưa, chưa dùng).
- Chân dung vào khung thoại: Ông Hựu, Ông Đạt, Sim, Thầy Tịnh. Icon: ấn đồng, bản đồ 1988, khăn chàm, sớ giả, sớ gốc, thư Sim (đã khai báo trong ITEMS, chưa có chỗ nhặt).

25. Thay ảnh nền từ bộ background mới
- BG34 (bếp), BG41 (nhà bà ngoại Nguyệt), BG43 (gác Lụa): thay ảnh mới, căn lại hotspot.
- BG51.webp = BG05 bản lễ (chưa dùng). Các cặp khác giữ ảnh cũ vì ảnh mới mâu thuẫn kịch bản (BG32/36/37 có người bị giam) hoặc kém hơn.

26. Arc ông Đạt và Sim
- BG41: ngăn kéo tủ thờ cho bản đồ 1988 và mảnh giấy của bà ngoại (giới thiệu Sim, chỉ đường tới ông Đạt).
- BG40 -> BG48 (nhà ông Đạt) -> BG49 (trong nhà). Gõ cửa phải trả lời thật lòng mới được vào.
- BG49: ảnh Sim (lời kể hai chiều), khăn chàm, ngăn tủ (thư Sim + sớ gốc), bàn trà (đối chiếu sớ).
- BG32: nhặt bản sớ giả ở xấp giấy lễ. Đối chiếu đúng thì có chứng cứ scrollProof.
- Kết thúc TRUE giờ cần thêm scrollProof. Mục tiêu (objective) ở BG40/41/48/49 dẫn từng bước.

27. Sổ nhật ký dùng asset mới (assets/book/)
- Đang dùng: cover_front (bìa), paper (giấy), ribbon (ruy băng đánh dấu). CSS ở cuối layout.css.
- Lưu sẵn chưa dùng: cover_back, open_book, torn_page, photo_frame, stains, tabs.
