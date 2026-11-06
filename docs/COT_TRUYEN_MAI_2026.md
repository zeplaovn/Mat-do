# Cốt truyện Mai — định hướng hiện hành

Tài liệu này thay thế các bản kịch bản cũ về Sim/Mơ. Bối cảnh Đồng Chay, các vị thần, nghi lễ và biến cố đều là hư cấu. Các ý tưởng còn trong tài liệu cũ chỉ có giá trị lịch sử, không phải căn cứ cho nội dung mới.

## Nhân vật và sự kiện

- Trong quá khứ chưa xác định năm, Mai sống với mẹ là bà Lành và em trai Phúc. Địa chủ Bách chặn nước; thầy Cao mượn danh thần rừng dựng chuyện gánh hạn. Gia đình Mai bị sát hại, Mai chết trong hốc đá ở nền tế. Về sau Huyền Tĩnh nhận tiền, dùng ấn cổ giam Mai dưới giếng; ký ức cô vỡ vụn. Chưa kết luận số phận của Cao.
- Năm 1986, Quế phát hiện bản sớ thầy Chân đã sửa. Hưng báo Chân, Quế bị giữ; Tùng gọi người đến nhưng chị không qua khỏi. Quế là nạn nhân của sự việc này, không phải linh hồn bị giam dưới giếng.
- Trước đêm 17/3/1988, những người làm công Bình, Nụ, Quyên, Thành và Giáp chia bức thư nêu nghi ngờ thành ba mảnh. Chân cài then, còn Hưng đồng ý giữ họ trong hầm và không mở khi nghe tiếng kêu. Nhài, con ruột Quyên và con nuôi vợ chồng Hưng, rơi xuống giếng đang mở khi cố tìm cách cứu mọi người. Hưng mở cửa hầm quá muộn và che giấu cái chết.
- Năm 2026, Khôi, Vũ, Hà, Chi và Vy điều tra những gì xảy ra. Vy là cháu bà Cúc và ban đầu giấu mục đích chuyến đi. Thầy Nguyên giữ cuốn sách cũ; quan hệ của ông với Huyền Tĩnh và bút danh Lục Táng chỉ được làm rõ về sau.

## Quy tắc kể chuyện và gameplay

- Không nhân vật hay lời dẫn công khai số người làm công để gợi nghi ngờ. Chi tiết ấy có thể xuất hiện trong tài liệu của chính nạn nhân hoặc ký ức của họ.
- Thư của người làm công được viết trước khi bị giam; nội dung chỉ nêu những điều họ biết hoặc nghi ngờ khi ấy. Ghi chép, dấu vết và lời khai về vụ giam là những nguồn riêng.
- Căn hầm bị xây bịt và kho đồ lễ là hai vị trí khác nhau. Miếng đồng Nhài cầm không phải ấn chủ; xem dấu qua mặt nước không đồng nghĩa nhổ ấn.
- Có thể từ chối sách rồi quay lại nhận; lựa chọn sai khi đối chiếu có thể thử lại. Những dấu vết ẩn dùng ánh sáng nhỏ, không hiện dấu chấm than hay danh sách điều kiện kết thúc.
- Bóng ảnh là manh mối, không tự chứng minh danh tính hay nơi an táng. Cần đối chiếu gia phả, vật chứng, ghi chép và lời nhân chứng. Lễ trả danh diễn ra trước khi tháo ấn; bát cơm tưởng nhớ là tùy chọn.
- BAD xảy ra khi người chơi cố ý kéo ấn quá sớm sau cảnh báo. NORMAL là quyết định rời đi; GOOD đưa chứng cứ về các nạn nhân năm 1988 cho gia đình nhưng ấn vẫn còn; TRUE cần điều tra Mai, Quế và vụ hầm, đối chiếu trách nhiệm và để Nguyên nói rõ việc che giấu trước khi tháo ấn.

## Lưu trò chơi và kiểm tra

Bản truyện mới dùng khóa lưu riêng. Bản lưu cũ được giữ lại trên thiết bị nhưng không tự chuyển tiến trình sang bản truyện mới. Chạy các kiểm tra bằng `for f in tests/*.test.js; do node "$f"; done`; `tests/new-story-paths.test.js` kiểm tra các nhánh lựa chọn và điều kiện kết thúc mới.
