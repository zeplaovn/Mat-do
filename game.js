/* LỜI NGUYỀN RỪNG THIÊNG — playable point-and-click web adventure.
   Local assets supplied by the game owner. No external frameworks or network requests. */
(() => {
'use strict';
const ROOT = 'assets/';
const BG = id => `${ROOT}background/${id}.webp`;
const IMG = file => `${ROOT}items/${file}`;
const PORTRAIT = file => `${ROOT}portraits/${file}`;
const SAVE_KEY = 'loi-nguyen-rung-thieng-v1';
const SAVE_SALT = 'lnrt·vân-hòa·2026';
const $ = id => document.getElementById(id);
const H = (action,label,x,y,w=12,h=15) => ({action,label,x,y,w,h});
const HA = (...a) => ({...H(...a),req:'awakened'});
const HL = (...a) => ({...H(...a),req:'lamAwake'});

const PORTRAITS = {
  'Đông':'01_Dong_portrait.webp','Nam':'02_Nam_portrait.webp','Tuyết':'03_Tuyet_portrait.webp',
  'Ánh':'04_Anh_portrait.webp','Nguyệt':'05_Nguyet_portrait.webp',
  'Mơ':'06_Mo_portrait.webp','Ông Bá Lâm':'07_Ba_Lam_portrait.webp','Bà Mận':'08_Ba_Man_portrait.webp'
};
const ITEMS = {
  camera:{name:'Máy ảnh của Ánh',description:'Chiếc máy ảnh cũ của Ánh. Nó hay chụp được những thứ mắt thường không thấy.',image:'01_May_Quay_128x128.webp'},
  flashlight:{name:'Đèn pin của Nam',description:'Đèn pin của Nam. Chạm vào để bật/tắt, hoặc nhấn phím F.',image:'02_Den_Pin_128x128.webp'},
  notebook:{name:'Sổ tay của Nguyệt',description:'Ghi lại bí mật của biệt thự. Nhấp “Nhật ký” để đọc những gì đã biết.',image:'03_So_Tay_128x128.webp'},
  lighter:{name:'Bật lửa cũ',description:'Chiếc bật lửa mạ đồng, còn gas.',image:'01_Bat_Lua_Chua_Bat_128x128.webp'},
  incense:{name:'Nhang chưa đốt',description:'Nhang nhặt ở miếu cây đa, chưa đốt.',image:'05_Nhang_Chua_Dot_128x128.webp'},
  key:{name:'Chìa khóa sắt rỉ',description:'Chìa khóa sắt rỉ tìm thấy ở cột mốc đá.',image:'04_Chia_Khoa_128x128.webp'},
  crowbar:{name:'Thanh sắt cạy gạch',description:'Thanh sắt cong nhặt trong gian bếp.',emoji:'🛠'},
  scarf:{name:'Khăn vải cũ',description:'Di vật 1/5. Nhặt được ở chiếc giếng trong sân.',emoji:'🧣',relic:true},
  spoon:{name:'Muôi cơm rỉ',description:'Di vật 2/5. Dấu vết một người làm công trong gian bếp.',emoji:'🥄',relic:true},
  comb:{name:'Trâm gỗ gãy',description:'Di vật 3/5. Tìm thấy gần chiếc nôi trẻ.',emoji:'🪮',relic:true},
  petition:{name:'Mảnh đơn tố cáo',description:'Di vật 4/5. Mảnh giấy giấu trong sổ của ông Bá Lâm.',emoji:'📜',relic:true},
  sandals:{name:'Đôi dép vải cũ',description:'Di vật 5/5. Vật dụng bị bỏ lại trong căn hầm kín.',emoji:'🩴',relic:true},
  bell:{name:'Chuông đồng nhỏ',description:'Chuông đồng nhỏ buộc dây đỏ, vớt từ xô giếng.',emoji:'🔔'},
  musicbox:{name:'Hộp nhạc gãy',description:'Hộp nhạc cũ của một bé gái. Giai điệu vẫn còn ngân.',emoji:'🎵'},
  testimony:{name:'Lời khai của bà Mận',description:'Tờ giấy bà Mận viết trước khi mất, giấu trong hòm gạo trên gác mái.',emoji:'📝'}
};
const USE_ON={camera:['mirror'],bell:['cradle'],musicbox:['shirt'],crowbar:['sealedWall'],key:['gate']};
const RELIC_ORDER = ['scarf','spoon','comb','petition','sandals'];
const RITUAL_SHOW = ['petition','scarf','sandals','spoon','comb']; /* thứ tự hiển thị khác thứ tự đúng, để câu đố không lộ đáp án */
const SCENES = {
 BG01:{name:'Cổng làng Đồng Chay',time:'07:30',chapter:'CHƯƠNG 1 · ĐỒNG CHAY',mood:'BUỔI SÁNG · ĐỒNG CHAY',caption:'Khởi đầu của một chuyến đi tưởng như bình thường.',intro:['Người kể chuyện','Thôn Đồng Chay, vùng chân núi Ba Vì. Năm sinh viên tới đây để ghi lại những truyền thuyết dân gian.'],look:'Những vết rêu bám trên cổng làng. Không có gì báo trước màn đêm sắp tới.',spots:[H('warning','Bà bán nước',15,53,14,22),H('travel:BG02','Đi vào ngõ làng',33,34,15,28),H('inspect:village','Nhìn cổng làng',28,10,26,20)]},
 BG02:{name:'Ngõ làng',time:'08:00',chapter:'CHƯƠNG 1 · ĐỒNG CHAY',mood:'BUỔI SÁNG · NGÕ LÀNG',caption:'Lối đi vẫn còn dấu bánh xe và hơi ẩm từ đêm trước.',intro:['Đông','Chúng ta đi qua ruộng, rồi tìm cây đa cạnh miếu. Người làng bảo con đường ấy dẫn tới rừng.'],look:'Những ngôi nhà mái ngói cũ nằm im sau hàng rào tre.',spots:[H('inspect:jar','Chum nước ven đường',77,50,9,12),H('travel:BG03','Ra phía cánh đồng',47,29,17,38),H('travel:BG01','Trở về cổng làng',6,76,22,20)]},
 BG03:{name:'Con đường giữa cánh đồng',time:'09:00',chapter:'CHƯƠNG 1 · ĐỒNG CHAY',mood:'BAN NGÀY · CÁNH ĐỒNG',caption:'Con đường đất đỏ kéo dài về phía cây cầu gỗ.',intro:['Tuyết','Đường này ít người đi. Bà tớ từng kể rằng qua cây cầu kia là lối vào rừng thiêng.'],look:'Lúa và cỏ ướt rì rào. Một con mương nhỏ chạy song song với đường.',spots:[H('travel:BG04','Bước đến cầu gỗ',45,34,20,30),H('inspect:canal','Quan sát mương',67,65,18,18),H('travel:BG02','Quay lại ngõ làng',7,80,25,17)]},
 BG04:{name:'Cầu gỗ qua mương',time:'17:30',chapter:'CHƯƠNG 1 · ĐỒNG CHAY',mood:'CHIỀU MUỘN · BỜ MƯƠNG',caption:'Cầu ọp ẹp trong gió. Trời sẫm dần khi cả nhóm quay lại.',intro:['Nam','Trời tối nhanh quá. Nếu quyết vào rừng thì giờ là lúc phải đi thôi.'],look:'Một tấm ván cầu lệch khỏi hàng, lộ mặt nước tối bên dưới.',spots:[H('inspect:bridge','Ván cầu mục',22,46,28,20),H('travel:BG05','Đi đến cây đa và miếu',67,30,19,33),H('travel:BG03','Quay lại đường ruộng',6,77,23,19)]},
 BG05:{name:'Cây đa và miếu cổ',time:'20:40',chapter:'CHƯƠNG 1 · LỐI VÀO RỪNG',mood:'ĐÊM · VEN RỪNG',caption:'Hương tàn đã lạnh. Đêm phủ xuống những rễ cây đa.',intro:['Nguyệt','Miếu này không có người trông coi... Có thứ gì đó đã bị bỏ quên ở đây.'],look:'Không thấy ánh sáng nào phía rừng. Hương cũ và gió luồn qua rễ đa.',spots:[H('shrine','Bát hương trong miếu',21,47,20,28),H('travel:BG06','Bước vào rừng tre',60,38,24,38),H('travel:BG04','Quay về cầu',4,79,28,19)]},
 BG06:{name:'Lối mòn xuyên rừng tre',time:'20:50',chapter:'CHƯƠNG 2 · RỪNG THIÊNG',mood:'RỪNG TRE · 20:50',caption:'Tiếng lá tre va nhau. Con đường đất uốn như một vệt tối.',intro:['Ánh','Tớ vừa nghe thấy ai gọi tên Nam. Nhưng từ nãy giờ chẳng có ai phía sau.'],look:'Bóng tre đổ dày đặc. Chỉ có bùn ướt bắt ánh trăng yếu.',spots:[H('inspect:cloth','Dải vải đỏ buộc trên tre',78.5,43,8,15),H('travel:BG07','Đi sâu vào rừng',44,32,19,35),H('travel:BG05','Trở lại miếu',6,78,30,20)]},
 BG07:{name:'Rừng sâu',time:'21:05',chapter:'CHƯƠNG 2 · RỪNG THIÊNG',mood:'RỪNG SÂU · 21:05',caption:'Qua kẽ lá, một mảnh mái ngói cũ thoáng hiện.',intro:['Đông','Có nhà thật. Nhưng cổng ở đâu? Mình chưa thấy lối nào dẫn tới đó.'],look:'Giữa những tán cây chỉ có một mảng mái ngói tối, không hề thấy đèn.',spots:[H('marker','Cột mốc đá cũ',77,43,10,26),H('travel:BG08','Đi về phía mái biệt thự',56,45,20,34),H('travel:BG06','Quay về rừng tre',7,79,24,20)]},
 BG08:{name:'Cổng biệt thự Vân Hòa',time:'21:20',chapter:'CHƯƠNG 2 · BIỆT THỰ',mood:'BIỆT THỰ · 21:20',caption:'Cổng sắt buộc xích. Sau song sắt là ngôi nhà bỏ hoang.',intro:['Nguyệt','Biệt thự Vân Hòa... Bà ngoại tớ chưa bao giờ muốn nhắc tới nơi này.'],look:'Ổ khóa rỉ sét còn nguyên. Mọi ô cửa tối đen như những hốc mắt.',spots:[H('gate','Xích và khóa cổng',43,53,15,28),H('exitForest','Rời khu rừng',5,76,26,22),H('travel:BG07','Quay về lối rừng',81,78,17,19)]},
 BG09:{name:'Sân biệt thự Vân Hòa',time:'21:30',chapter:'CHƯƠNG 2 · BIỆT THỰ',mood:'SÂN NHÀ · 21:30',caption:'Cây gạo ở bên trái. Chiếc giếng đá nằm trong bóng tối bên phải.',intro:['Nam','Cổng vừa khép sau lưng. Tớ không thích cái tiếng khóa sắt đó chút nào.'],look:'Nước mưa đọng trong kẽ gạch. Cây gạo già ngả bóng lên tường vữa.',spots:[H('well','Chiếc giếng đá',77,53,20,30),H('travel:BG10','Bước lên hiên nhà',42,34,19,33),H('travel:BG08','Trở lại cổng',2,80,23,17),H('inspect:tree','Gốc cây gạo',5,36,22,33)]},
 BG10:{name:'Hiên nhà và cửa chính',time:'21:40',chapter:'CHƯƠNG 2 · BIỆT THỰ',mood:'HIÊN NHÀ · 21:40',caption:'Cửa đôi bằng gỗ cũ. Không có ánh sáng từ phía sau.',intro:['Đông','Cánh cửa này chưa khóa hẳn. Đi cùng nhau, đừng ai tự tách nhóm.'],look:'Ổ khóa đồng mờ xỉn, vữa vàng rơi từng mảng khỏi chân cột.',spots:[H('frontDoor','Cửa gỗ chính',39,17,23,50),H('inspect:doorlock','Ổ khóa đồng',52,47,10,15),H('travel:BG09','Lùi ra sân',35,81,29,17)]},
 BG11:{name:'Đại sảnh tầng một',time:'22:00',chapter:'CHƯƠNG 3 · CĂN NHÀ IM LẶNG',mood:'ĐẠI SẢNH · 22:00',caption:'Bàn trà phủ bụi. Đồng hồ quả lắc đứng im trên tường.',intro:['Nguyệt','Đồng hồ dừng ở một giờ rất lạ. Tớ sẽ ghi vào sổ.'],look:'Bụi phủ kín lớp gạch bông. Những khuôn mặt trong ảnh gia đình đã bạc màu.',spots:[H('clock','Đồng hồ quả lắc',46,22,13,27),H('photo','Ảnh gia đình',60,28,14,20),H('inspect:tea','Bàn trà cũ',36,56,28,25),H('travel:BG12','Lối vào phòng thờ',14,30,22,32),H('travel:BG14','Cầu thang gỗ',75,24,21,47),H('travel:BG10','Trở ra hiên',4,80,24,18)]},
 BG12:{name:'Phòng thờ gia tiên',time:'22:20',chapter:'CHƯƠNG 3 · CĂN NHÀ IM LẶNG',mood:'PHÒNG THỜ · 22:20',caption:'Năm bát hương lạnh trên bàn thờ. Có lối thông qua bếp.',intro:['Tuyết','Năm bát hương... Không nên chạm vào trước khi biết chúng tượng trưng cho ai.'],look:'Không có khói nhang. Năm bát xếp thành một hàng kỳ lạ.',spots:[H('altar','Năm bát hương',34,34,35,27),H('travel:BG13','Lối sang bếp',78,33,18,34),H('travel:BG11','Quay lại đại sảnh',3,81,26,16)]},
 BG13:{name:'Gian bếp cũ',time:'22:35',chapter:'CHƯƠNG 3 · CĂN NHÀ IM LẶNG',mood:'GIAN BẾP · 22:35',caption:'Tro lạnh trong bếp. Mùi ẩm mốc bám ở những chiếc chum cũ.',intro:['Nam','Phía sau bên phải có một cánh cửa dẫn xuống hầm. Bếp này bị bỏ lại giữa chừng.'],look:'Bếp củi đã tắt từ lâu. Mọi vật dụng vẫn như bị bỏ lại giữa chừng.',spots:[H('spoon','Muôi cơm cũ',40,50,14,20),H('crowbar','Thanh sắt dưới bếp',15,62,20,20),H('inspect:hearth','Bếp củi nguội',17,39,25,21),H('travel:BG18','Cửa xuống tầng hầm',76,28,18,42),H('travel:BG12','Trở về phòng thờ',2,69,11,30)]},
 BG14:{name:'Cầu thang gỗ lên tầng hai',time:'22:45',chapter:'CHƯƠNG 3 · CĂN NHÀ IM LẶNG',mood:'CẦU THANG · 22:45',caption:'Ván gỗ rạn nứt. Cửa chớp cao tít ở chiếu nghỉ.',intro:['Ánh','Tớ sẽ chụp vài tấm trước khi lên. Đừng đứng quá xa nhau.'],look:'Bóng tay vịn đổ xiên lên ảnh chân dung cũ treo dọc tường.',spots:[H('travel:BG15','Đi lên tầng hai',44,18,22,38),H('inspect:family','Ảnh gia đình trên tường',67,21,15,28),H('travel:BG11','Trở về đại sảnh',3,81,23,17)]},
 BG15:{name:'Hành lang tầng hai',time:'23:00',chapter:'CHƯƠNG 3 · CĂN NHÀ IM LẶNG',mood:'HÀNH LANG · 23:00',caption:'Một cửa sáng màu bên trái, cửa gỗ sẫm bên phải.',intro:['Ánh','Phòng trẻ bên trái, phòng làm việc bên phải... Tớ thấy chiếc gương ở cuối lối đi này rất kỳ lạ.'],look:'Ánh trăng lạnh vạch một đường ngang sàn. Bóng cây lọt qua cửa chớp cuối hành lang.',spots:[H('travel:BG16','Phòng ngủ trẻ em',8,22,26,54),H('travel:BG17','Phòng làm việc',71,20,26,58),H('inspect:window','Cửa sổ cuối hành lang',43,21,15,37),HL('travel:BG24','Nắp gác mái trên trần',60,3,16,16),H('travel:BG14','Trở lại cầu thang',38,78,23,20)]},
 BG16:{name:'Phòng ngủ trẻ em',time:'23:15',chapter:'CHƯƠNG 4 · DI VẬT',mood:'PHÒNG TRẺ · 23:15',caption:'Một con búp bê vải nằm bên gối, chiếc nôi trống giữa phòng.',intro:['Ánh','Tớ thấy một bé gái trong ảnh chụp... Nhưng trong phòng chẳng có ai cả.'],look:'Muỗi mùng rách thành từng dải. Chiếc gương vẫn phản chiếu căn phòng trống.',spots:[H('comb','Chiếc trâm trong nôi',41,67,18,16),H('mirror','Gương mờ cũ',83,15,15,42),H('inspect:doll','Búp bê trên gối',14,44,22,20),HA('cradle','Mảnh vải trong nôi',40,55,20,12),H('travel:BG15','Trở về hành lang',1,73,14,25)]},
 BG17:{name:'Phòng làm việc ông Bá Lâm',time:'23:30',chapter:'CHƯƠNG 4 · DI VẬT',mood:'PHÒNG LÀM VIỆC · 23:30',caption:'Cuốn sổ thu chi và chiếc hộp sắt bị bỏ lại trên bàn.',intro:['Nguyệt','Phòng làm việc của ông Bá Lâm. Mọi thứ vẫn nằm đúng chỗ ông ấy để lại.'],look:'Trên mặt bàn có những vệt nước khô. Ngăn kéo và tủ kính chưa ai chạm tới.',spots:[H('ledger','Sổ sách trên bàn',34,43,24,19),H('safe','Hộp sắt góc phải',77,69,21,22),H('inspect:lamp','Đèn bàn đã tắt',58,33,17,20),HA('birth','Ngăn kéo khóa trái',52,62,18,16),H('travel:BG15','Trở về hành lang',2,78,18,21)]},
 BG18:{name:'Cầu thang đá xuống tầng hầm',time:'00:15',chapter:'CHƯƠNG 5 · BỨC TƯỜNG',mood:'TẦNG HẦM · 00:15',caption:'Bậc đá trơn tuột xuống sâu. Dưới đó không có lấy một ô cửa sổ.',intro:['Nam','Xuống đây nhớ dùng đèn pin. Tớ nghe như có người gõ từ cuối hành lang.'],look:'Hơi ẩm bốc lên dọc những viên gạch mục. Bóng tối đặc quánh ở cuối cầu thang.',spots:[H('travel:BG19','Xuống hành lang tầng hầm',48,45,40,46),H('travel:BG13','Quay lên gian bếp',2,8,26,30)]},
 BG19:{name:'Hành lang tầng hầm',time:'02:00',chapter:'CHƯƠNG 5 · BỨC TƯỜNG',mood:'TẦNG HẦM · 02:00',caption:'Năm dấu tay chìm trong vữa của bức tường bị xây bịt.',intro:['Tuyết','Nhìn kìa... Năm dấu tay trên vữa. Có người đã bị nhốt phía sau bức tường.'],look:'Nước chảy sát mép những bao thóc mục. Vữa mới hơn hẳn dãy gạch bên cạnh.',spots:[H('sealedWall','Bức tường với năm dấu tay',39,29,26,31),H('inspect:sacks','Bao thóc mục',2,33,26,49),H('travel:BG18','Quay về cầu thang đá',1,82,28,17)]},
 BG20:{name:'Căn phòng bị bịt kín',time:'03:17',chapter:'CHƯƠNG 6 · TRẢ LẠI TÊN',mood:'CĂN PHÒNG KÍN · 03:17',caption:'Sau bức tường: những món đồ vô chủ và lời thú tội bị chôn vùi.',intro:['Nguyệt','Bà Mận... Con sẽ mang tên của mọi người ra khỏi nơi này.'],look:'Nước đọng giữa lớp bùn gạch. Không có thứ gì chuyển động, chỉ có dấu vết của một bi kịch.',spots:[H('sandals','Đôi dép bỏ lại',48.5,45,12,11),H('archive','Hộp sắt chôn dưới gạch',73,67,24,25),H('inspect:belongings','Đồ dùng của năm người',31,36,17,17),H('travel:BG19','Quay ra lỗ tường vỡ',0,35,13,47)]},
 BG21:{name:'Phòng trẻ bên kia gương',time:'03:17',chapter:'CHƯƠNG 7 · CÁI TÊN THỨ SÁU',mood:'BÊN KIA GƯƠNG · 03:17',caption:'Mọi thứ bị lật ngược. Một giai điệu ru vọng từ đâu đó.',intro:['Ánh','Phòng này giống hệt, nhưng mọi thứ bị lật ngược. Tớ nghe tiếng ai đang hát khe khẽ.'],look:'Chữ trên tường viết ngược. Bóng của cả nhóm không đi theo ánh đèn.',spots:[H('musicbox','Hộp nhạc đang phát sáng',46,67,12,16),H('girl','Dòng chữ phấn trên tường',20,27,14,26),H('smalldoor','Cánh cửa nhỏ sau tấm mùng',58,20,13,42),H('travel:BG16','Trở về qua tấm gương',3,3,17,62)]},
 BG22:{name:'Đáy giếng cạn',time:'03:17',chapter:'CHƯƠNG 7 · CÁI TÊN THỨ SÁU',mood:'ĐÁY GIẾNG · 03:17',caption:'Nước đã cạn. Chỉ còn bùn lạnh và một chiếc áo trắng nhỏ.',intro:['Nguyệt','Đây là nơi người ta giấu em. Không phải mất tích. Em bị xóa đi.'],look:'Thành giếng đầy vết cào bé xíu, chạy dài từ đáy lên tới miệng giếng.',spots:[H('shirt','Chiếc áo trắng nhỏ',43,75,15,14),H('inspect:wellwall','Vết cào trên thành giếng',68,14,15,58),H('travel:BG21','Leo sợi dây lên',12,3,16,70)]},
 BG23:{name:'Đại sảnh dưới ánh đỏ',time:'03:17',chapter:'CHƯƠNG 8 · BÓNG ÔNG LÂM',mood:'ĐẠI SẢNH · ÁNH ĐỎ',caption:'Cánh cửa chính rực đỏ. Một cái bóng cao dài trải trên nền gạch, nhưng không có ai đứng đó.',intro:['Đông','Không có ai đứng đó, nhưng cái bóng cứ dài ra mãi. Ánh đỏ lọt qua khe cửa chính. Ông ấy đang chờ chúng ta.'],look:'Đồng hồ quả lắc quay ngược. Mọi bức ảnh gia đình đều bị úp mặt xuống.',spots:[H('lamdoor','Cánh cửa chính rực đỏ',60,20,13,42),H('inspect:clock2','Đồng hồ chạy ngược',45,16,8,34),H('inspect:teaset','Bộ ấm trà vỡ',29,70,10,10),H('travel:BG14','Cầu thang gỗ',20,24,14,38),H('travel:BG12','Lối sang phòng thờ',0,8,10,40)]},
 BG24:{name:'Gác mái dưới mái ngói',time:'03:40',chapter:'CHƯƠNG 8 · BÓNG ÔNG LÂM',mood:'GÁC MÁI · 03:40',caption:'Ánh trăng xuyên qua kẽ ngói như những mũi kim xanh. Dải vải đỏ buộc kín các xà nhà.',intro:['Nguyệt','Có người từng sống ở đây suốt nhiều năm, giấu mình khỏi cả ngôi nhà. Những dải vải đỏ này... là lời cầu nguyện.'],look:'Bụi lơ lửng trong những vệt sáng. Mọi thứ ở đây đều được giữ gìn cẩn thận, như chờ ai đó quay lại.',spots:[H('testimony','Hòm gỗ khắc bông lúa',84,62,14,32),H('inspect:atticbed','Chiếc giường sắt cũ',60,52,22,18),H('inspect:lantern','Đèn bão còn le lói',16,45,7,14),H('travel:BG15','Xuống tầng hai',30,84,30,14)]}
};

/* ================= HỘI THOẠI THEO TỪNG CẢNH =================
   Mỗi cảnh: danh sách [người nói, lời thoại], phát lần đầu vào cảnh.
   Nhóm bạn xưng "tớ – cậu". Mỗi người một giọng: Đông điềm tĩnh, Nam tếu táo che sợ, Tuyết dịu dàng, Ánh hăng hái, Nguyệt trầm lặng. */
const CONVO={
 BG01:[
  ["Người kể chuyện","Đồng Chay, chân núi Ba Vì. Sương sớm còn vương trên mái ngói. Năm sinh viên dừng chân trước cổng làng, ba lô nặng trĩu và đầu óc đầy những truyền thuyết cũ."],
  ["Đông","Đủ cả rồi chứ? Tớ đếm lại nhé... một, hai, ba, bốn, năm. Tốt. Hôm nay đi khảo sát, tối về nhà trọ. Đứa nào thấy mệt thì nói sớm, đừng cố."],
  ["Nam","Mệt gì mà mệt, mới tám giờ sáng! Tớ mang cả đèn pin lẫn pin dự phòng đây này. Cứ để tớ đi đầu."],
  ["Ánh","Đi đầu cái gì, hôm qua cậu còn sợ con chó nhà trọ cơ mà! ...Mà cái cổng làng này đẹp thật đấy. Đứng yên, để tớ chụp tấm này đã!"],
  ["Tuyết","Hai người đừng đùa nữa... Bà tớ quê ở vùng này. Bà dặn kỹ lắm: vào rừng thì đừng trả lời nếu có ai gọi tên mình. Tớ nói thật đấy."],
  ["Nguyệt","Tớ ghi lại hết. ...Nhưng cái tên “biệt thự Vân Hòa” nghe quen kinh khủng. Hôm qua tớ hỏi bà ngoại, bà chỉ lặng im rồi quay đi."],
  ["Đông","Thế thì càng phải tìm hiểu cho ra nhẽ. Nhưng đi từng bước một. Trước tiên, mình hỏi người làng đã."]],
 BG02:[
  ["Đông","Theo bản đồ thì đi qua ruộng, tới cây đa cạnh miếu là lối vào rừng. Nhưng mình nên hỏi lại cho chắc."],
  ["Nam","Làng yên ắng ghê. Mà nhìn kìa, bọn trẻ chạy tung tăng, bà gánh rau cười tươi thế. Nhìn bình thường mà nhỉ?"],
  ["Tuyết","Ừ... Nhưng cậu để ý không? Hễ mình nhắc tới khu rừng là ai cũng lảng đi. Cứ như sợ nhắc tên thôi là nó nghe thấy."],
  ["Ánh","Ông cụ ngồi ở hiên nhà kia nhìn bọn mình chằm chằm nãy giờ. Tớ vẫy tay mà ông không chào lại. Hơi rợn."],
  ["Đông","Người già hay đề phòng người lạ thôi. Đi tiếp nào, trời còn sáng, mình còn nhiều việc."]],
 BG03:[
  ["Tuyết","Qua cây cầu gỗ kia là tới lối vào rừng thiêng rồi. Hồi nhỏ bà tớ cấm tiệt, không cho tớ ra tới đó."],
  ["Nguyệt","Cấm vì lý do gì thế? Cậu chưa kể bao giờ."],
  ["Tuyết","Ngày xưa làng mang lễ vào rừng cầu mưa. Sau một năm đói kém, họ thôi không vào nữa. Bà chỉ nói đúng một câu: “Rừng nhớ những gì người ta muốn quên.”"],
  ["Nam","Trời... nghe lạnh sống lưng. Cậu sờ thử đi, tớ nổi hết da gà rồi này."],
  ["Ánh","Thôi nào, nhìn cánh đồng đẹp thế này cơ mà. Nắng, lúa, cả con trâu kia nữa. Tớ chụp mãi cũng không chán."],
  ["Đông","Cứ chụp, nhưng đi nhanh chân lên. Còn phải kịp tới miếu trước khi trời tối."]],
 BG04:[
  ["Người kể chuyện","Mải đi, mải chụp, mải hỏi han... Lúc ngoảnh lại thì nắng đã ngả, mặt mương đỏ như pha máu."],
  ["Nam","Chết thật, chiều rồi à? Tớ tưởng mới trưa thôi. Cứ như có ai rút mất mấy tiếng của mình vậy."],
  ["Đông","Tớ hỏi lần cuối, và tớ hỏi nghiêm túc. Ai muốn quay về nhà trọ thì cứ nói. Không ai bị ép, không ai bị cười."],
  ["Ánh","Đi nửa đường rồi bỏ thì tiếc lắm. Với lại có tận năm đứa cơ mà, sợ gì!"],
  ["Tuyết","Ừ... nhưng đi sát nhau nhé. Tớ không thích cái cầu này. Nhìn nó mỏng manh như sắp gãy."],
  ["Nguyệt","Ếch dưới mương đột nhiên kêu rộ lên... Nghe cứ như chúng đang báo tin cho cả khu rừng biết mình tới."]],
 BG05:[
  ["Nguyệt","Cây đa này to quá... Rễ nó như một bàn tay khổng lồ bấu xuống đất. Còn cái miếu kia, không có ai trông coi sao?"],
  ["Tuyết","Bát hương đầy tàn mà không còn chân hương nào. Như có người thắp xong rồi vội vàng nhổ đi, sợ để lại dấu vết."],
  ["Nam","Tớ không thích chỗ này tí nào. Từ nãy tới giờ tớ cứ có cảm giác cây đa đang nghiêng xuống nhìn mình."],
  ["Ánh","Này... đừng dọa nhau nữa mà. Tớ còn phải đi tiếp đấy."],
  ["Đông","Miếu thế này đáng lẽ phải có người hương khói mỗi ngày. Vậy mà trống không. ...Mình xem kỹ xung quanh rồi hẵng quyết định có vào rừng không."]],
 BG06:[
  ["Ánh","Khoan... Mọi người có nghe không? Vừa có ai gọi tên Nam. Tớ nghe rõ lắm."],
  ["Nam","Hả? Tớ có nghe gì đâu. Cậu... cậu chắc chứ? Đừng đùa kiểu đó, không vui đâu."],
  ["Tuyết","Đừng quay lại. Cũng đừng trả lời. Bà tớ dặn thế... Tớ xin cậu đấy, Nam."],
  ["Đông","Cứ đi tiếp, đi gần đủ để nắm được tay nhau. Có chuyện gì thì nói ngay, đừng giấu."],
  ["Nguyệt","Những dải vải đỏ buộc dọc lối đi... Không biết người ta đánh dấu để khỏi lạc, hay để ngăn người khác bước tiếp."]],
 BG07:[
  ["Đông","Kia... là mái nhà. Có nhà thật! Nhưng cổng ở đâu? Mình chưa thấy lối nào dẫn tới đó."],
  ["Nguyệt","Mái ngói kia đúng là biệt thự Vân Hòa. Hồi nhỏ tớ chỉ thấy nó trong một tấm ảnh cũ của bà ngoại. Không ngờ... nó có thật."],
  ["Nam","Khoan đã. Mọi người có thấy lạ không? Mới nãy dế còn kêu rộ lên, giờ im phăng phắc. Một tiếng côn trùng cũng không."],
  ["Ánh","Đừng nói thế... Tớ nổi hết da gà rồi. Đi chậm thôi, tớ không thích bước vào chỗ mình không nhìn rõ."]],
 BG08:[
  ["Nguyệt","Biệt thự Vân Hòa... Đứng trước cổng rồi mà tớ vẫn không tin nổi. Bà ngoại chưa bao giờ muốn nhắc tới nơi này."],
  ["Đông","Nguyệt, cậu ổn chứ? Nếu cậu không muốn vào thì mình quay lại ngay. Tớ không đùa đâu."],
  ["Nguyệt","Tớ ổn... Chính vì bà không chịu nói, nên tớ mới phải biết."],
  ["Nam","Cổng buộc xích, khóa to bằng nắm tay. Không có chìa thì đến ma cũng chẳng vào nổi."],
  ["Tuyết","Nam! ...Thôi. Nguyệt, mình sẽ vào cùng cậu. Đừng tự gánh một mình."]],
 BG09:[
  ["Nam","Cổng vừa khép lại sau lưng. Tớ không thích cái tiếng khóa sắt đó... chút nào."],
  ["Đông","Đừng hoảng. Cổng cũ nặng nên tự khép thôi."],
  ["Nam","Nhưng nó khép đúng lúc mình bước qua, Đông ạ. Như có ai vừa đẩy nhẹ."],
  ["Ánh","Sân rộng thế mà không một dấu chân nào ngoài của bọn mình. Cây gạo kia to thật... to đến mức rờn rợn."],
  ["Tuyết","Cái giếng bên phải có nắp gỗ. Ở quê bà tớ cũng đậy nắp giếng như thế, để “người dưới” khỏi lên."],
  ["Đông","Thôi! Đừng đoán mò nữa. Xem nhà trước đã."]],
 BG10:[
  ["Đông","Cánh cửa này chưa khóa hẳn. Đi cùng nhau, đừng ai tự tách nhóm. Nhắc lại lần nữa cho chắc: đừng ai tự tách nhóm."],
  ["Nguyệt","Bên trong tối đen... Cũng không nghe tiếng gì. Im đến mức nghe được cả tim mình."],
  ["Nam","Đèn pin sẵn sàng. Có chuyện gì cứ hét lên, tớ chạy tới liền. ...Hoặc tớ hét, mấy cậu chạy tới cũng được."],
  ["Ánh","Để tớ chụp vài tấm trước. Mai còn đem đối chiếu với ảnh cũ của bà Nguyệt."]],
 BG11:[
  ["Nguyệt","Đồng hồ dừng ở một giờ rất lạ... Tớ ghi vào sổ ngay. Có gì đó không ổn."],
  ["Đông","Bụi dày thế này mà mặt kính các khung ảnh lại sạch bong. Hình như có ai thường xuyên tới lau chúng."],
  ["Ánh","Vài khuôn mặt trong ảnh bị cào xước tới tận lớp giấy... Cả nhà này nhìn nghiêm khắc quá. Tớ không thích bị họ nhìn."],
  ["Tuyết","Có mùi nhang cũ. Phòng thờ chắc ở phía bên trái. ...Tớ thấy chân mình cứ muốn quay ra cửa."],
  ["Đông","Mình chia nhau xem phòng thờ, bếp rồi lên tầng hai. Nhưng nhớ: đừng ai đi một mình."]],
 BG12:[
  ["Tuyết","Năm bát hương... Đừng chạm vào vội. Mỗi bát là một người, tớ có cảm giác thế."],
  ["Nguyệt","Năm bát. Đúng bằng số người mất tích mà bà bán nước nhắc. Chuyện này không thể là tình cờ được."],
  ["Nam","Ý cậu là họ từng bị giữ lại ở đây? Ngay trong căn nhà này?"],
  ["Tuyết","Tớ thấy như vừa có ai thắp rồi tắt đi. Cứ như họ đang chờ... chờ ai đó gọi tên mình."],
  ["Đông","Mỗi bát hương là một người. Muốn biết họ là ai thì phải lần theo dấu vết trong nhà. Mình sẽ làm cho đến nơi đến chốn."]],
 BG13:[
  ["Nam","Gian bếp... Bỏ lại giữa chừng, như thể mọi người vừa chạy khỏi đây. Phía sau bên phải còn có cánh cửa dẫn xuống hầm nữa."],
  ["Tuyết","Bếp này nấu cho rất đông người. Chum, nồi, bát đũa... nhiều hơn một gia đình. Ai ăn hết ngần ấy nhỉ?"],
  ["Nguyệt","Hay đúng hơn là... nhà này từng giữ rất nhiều gạo, trong khi cả vùng đang đói."],
  ["Nam","Cửa hầm có xích nhưng mục cả rồi. Dưới đó tối đen. Tớ không muốn xuống đâu, thật lòng đấy."],
  ["Đông","Tớ vừa nghe dưới đó như có tiếng gõ. ...Hoặc chỉ là ống nước. Chắc là ống nước."]],
 BG14:[
  ["Ánh","Tớ chụp vài tấm trước khi lên nhé. Đừng đứng xa nhau quá."],
  ["Đông","Ván cầu thang kêu to quá. Bước sát tường đi, đừng dồn hết sức vào giữa."],
  ["Ánh","Khoan đã! Trong bức ảnh gia đình này có một bé gái đứng ở hàng sau cùng, mờ hẳn đi. Ở những tấm khác thì không có em."],
  ["Nguyệt","Tớ ghi lại. Thêm một người không có trong lời kể của dân làng... Tại sao họ lại giấu em?"]],
 BG15:[
  ["Ánh","Phòng trẻ bên trái, phòng làm việc bên phải... Mà cái gương ở cuối lối đi kia nhìn lạ quá."],
  ["Nam","Gương nào? Cuối hành lang chỉ có cửa sổ thôi mà."],
  ["Ánh","...Chắc tớ nhầm với cái gương trong phòng trẻ. Nhưng tớ có cảm giác nó cứ nhìn theo mình."],
  ["Nguyệt","Phòng làm việc bên phải là của ông Bá Lâm, chủ cũ của ngôi nhà này."],
  ["Tuyết","Mọi người nghe không? Có tiếng ai đi lại ngay trên trần nhà. ...Chuột thôi nhỉ? Nói là chuột đi."]],
 BG16:[
  ["Ánh","Lúc nãy tớ thấy một bé gái trong ảnh chụp... Nhưng trong phòng chẳng có ai cả. Tớ không hoa mắt, đúng không?"],
  ["Tuyết","Đồ cũ lắm rồi, nhưng nệm giường vẫn còn nếp gấp, như vừa có người nằm. Tớ thấy thương em quá."],
  ["Nam","Cái gương kia nhìn mình chằm chằm. Tớ không thích nó. Ai che nó lại giúp tớ với."],
  ["Ánh","Ừ... Cậu đứng gần tớ nhé. Gần hơn nữa. Tớ sợ."]],
 BG17:[
  ["Nguyệt","Phòng làm việc của ông Bá Lâm. Mọi thứ vẫn nằm đúng chỗ ông ấy bỏ lại, như thể ông chỉ vừa bước ra ngoài."],
  ["Đông","Hộp sắt góc phải có khóa số. Chắc cần mật mã."],
  ["Nguyệt","Khóa bốn chữ số. Ông ấy giấu gì trong đó mà phải cẩn thận đến thế?"],
  ["Nam","Người giữ sổ sách mà giấu kỹ thế này thì chắc chắn có điều muốn che đậy. Tớ ghét kiểu người này."]],
 BG18:[
  ["Nam","Xuống đây nhớ dùng đèn pin nhé. ...Khoan. Tớ nghe như có người gõ ở cuối hành lang."],
  ["Tuyết","Tớ cũng nghe. Ba tiếng, rồi hai tiếng. Rồi im bặt. Giống như... người ta đang gõ để cầu cứu."],
  ["Nam","Muốn bật đèn pin thì chạm vào nó trong túi đồ, hoặc nhấn phím F. Tớ nói thế thôi, không phải vì tớ sợ đâu nhé."],
  ["Đông","Đi chậm thôi. Nếu ai thấy không ổn thì nói, mình quay lên ngay. Tớ không ép ai."]],
 BG19:[
  ["Tuyết","Nhìn kìa... Năm dấu tay trên vữa. Có người đã bị nhốt phía sau bức tường này. Họ đã đập, đập mãi..."],
  ["Nguyệt","Năm người... đúng bằng số người mất tích đêm mười bảy tháng Ba. Họ nằm ngay dưới chân mình suốt bao năm nay."],
  ["Nam","Lớp vữa mới hơn hẳn gạch bên cạnh. Người ta xây bịt sau, và xây rất vội. Tởm thật."],
  ["Ánh","Tớ không dám nhìn dấu tay lâu. Cứ có cảm giác nhìn thêm một chút thôi là chúng sẽ chạm lại vào mình."],
  ["Đông","Phải có cách nào đó để mở bức tường này ra. Họ đã chờ quá lâu rồi."]],
 BG20:[
  ["Đông","Trời ơi... Đồ đạc vẫn còn nguyên. Họ bị bỏ lại ở đây thật sao? Suốt từng ấy năm?"],
  ["Tuyết","Dép, bát, một cuốn sổ nhỏ... Mỗi người để lại một thứ. Tớ không chịu nổi nữa. Tớ muốn khóc."],
  ["Nguyệt","Bà Mận... Con sẽ mang tên của mọi người ra khỏi nơi này. Con hứa."],
  ["Đông","Mình sẽ mang hết ra ngoài. Cả đồ đạc lẫn sự thật. Không ai bị quên thêm lần nào nữa."]],
 BG21:[
  ["Ánh","Phòng này giống hệt phòng trẻ, nhưng mọi thứ bị lật ngược. Tớ nghe tiếng ai đang hát khe khẽ... Mọi người có nghe không?"],
  ["Nguyệt","Chữ trên tường viết ngược, bằng phấn. Nét chữ như của một đứa trẻ. Chắc em đã viết khi chẳng còn ai bên cạnh."],
  ["Tuyết","Bóng của chúng ta không đi theo ánh đèn. Đừng nhìn xuống đất. Xin các cậu đừng nhìn xuống đất."],
  ["Nam","Giữa sàn có thứ gì đang phát sáng kìa. Nhìn như... một ngọn nến nhỏ."],
  ["Ánh","Giai điệu này... Tớ đã nghe trong giấc mơ từ lúc bước vào biệt thự. Sao tớ lại thuộc nó?"]],
 BG22:[
  ["Nguyệt","Đây là nơi người ta giấu em. Không phải mất tích. Em bị xóa đi... như chưa từng tồn tại."],
  ["Ánh","Những vết cào bé xíu... Là mười ngón tay nhỏ đã cố trèo lên. Mỗi vết là một lần em cố sống."],
  ["Tuyết","Tay tớ run quá. Nếu đêm ấy có ai nghe thấy thì em đã không..."],
  ["Nguyệt","Em đã kêu rất lâu. Rất lâu... mà không ai tới. Không ai."],
  ["Nguyệt","Em ơi, chị ở đây rồi. Chị sẽ gọi tên em. Chị hứa."]],
 BG23:[
  ["Đông","Không có ai đứng đó, nhưng cái bóng cứ dài ra mãi. Ánh đỏ lọt qua khe cửa chính. ...Ông ấy đang chờ chúng ta."],
  ["Nguyệt","Đồng hồ chạy ngược. Ông ấy muốn kéo chúng ta về lại đêm đó."],
  ["Nam","Cửa chính không nhúc nhích dù tớ đẩy bằng cả người. Ông ấy không cho ai ra khỏi đây. Hết đường chạy rồi."],
  ["Tuyết","Vậy mình không chạy. Mình sẽ nói lại tất cả cho ông ấy nghe, bằng chứng cứ. Tớ không sợ ông ta nữa."],
  ["Đông","Muốn đối mặt với ông ấy thì mình phải có đủ bằng chứng trong tay. Cùng nhau. Như đã hứa."]],
 BG24:[
  ["Nguyệt","Có người từng sống ở đây suốt nhiều năm, giấu mình khỏi cả ngôi nhà. Những dải vải đỏ này... là lời cầu nguyện, đúng không?"],
  ["Ánh","Đèn bão còn cháy, chăn gấp vuông vức. Người này đã sống ở đây thật. Không phải ma, là một con người."],
  ["Tuyết","Mọi thứ ngăn nắp quá... Tớ không dám chạm vào. Như thể bước vào phòng riêng của ai đó vậy."],
  ["Nguyệt","Người ở đây đủ lâu để giữ lại một điều gì đó. Mình xem kỹ từng góc nhé. Nhẹ tay thôi."]]
};
function introOf(id){return CONVO[id]||(SCENES[id].intro?[SCENES[id].intro]:[])}
/* Câu thoại phụ khi quan sát một vật (nối sau câu chính) */
const MORE={
 village:[["Nguyệt","Tớ chụp thêm một tấm cổng làng nữa. Lỡ sau này không còn như bây giờ thì sao."]],
 jar:[["Tuyết","Lá rụng đầy mặt nước, mà nước thì lạnh buốt. Như có ai vừa khuấy."]],
 canal:[["Đông","Hướng Tây là hướng ra rừng. Mình đi đúng đường rồi. ...Hy vọng thế."]],
 bridge:[["Đông","Bước thật chậm. Nam, đừng nhảy chân sáo nữa."],["Nam","Tớ có nhảy đâu! ...Tại cầu rung thôi."]],
 cloth:[["Tuyết","Bà tớ bảo vải đỏ là để gọi hồn về, hoặc để chặn hồn lại. Tớ chẳng biết cái này thuộc loại nào. Tớ sợ cả hai."]],
 tree:[["Nam","Mấy vết khắc này là chữ à? Tớ đọc không ra. Hay là... tên người?"]],
 doorlock:[["Nam","Khóa hỏng từ bên trong, như thể ai đó từng phá nó để chạy ra. Không biết họ chạy thoát chưa."]],
 tea:[["Nguyệt","Bát nước còn gợn nhẹ. Nhưng nhà thì bỏ hoang hơn ba mươi năm rồi. Đừng nhìn nữa."]],
 hearth:[["Tuyết","Tro bếp nguội mà vẫn có mùi cơm cháy. Tớ thấy... đói, và thấy buồn."]],
 family:[["Nguyệt","Tớ đếm được sáu người trong ảnh, nhưng người thứ sáu bị cào đến mất mặt. Ai ghét người ấy đến vậy?"]],
 window:[["Nam","Cây gạo dưới sân kia đang lay, trong khi cửa kính đứng yên. Gió ở đâu ra? Tớ hỏi thật đấy."]],
 doll:[["Tuyết","Búp bê tự nhiên quay mặt về phía gương. Tớ vừa nhìn mà, nó đâu như thế. ...Phải không?"]],
 lamp:[["Đông","Đèn tắt từ lâu nhưng bóng đèn còn ấm. Tớ không muốn nghĩ nhiều."]],
 sacks:[["Nguyệt","Dấu niêm phong ghi năm 1988. Gạo cứu trợ của cả vùng đã nằm ở đây, mục dần trong lúc người ta chết đói."]],
 belongings:[["Đông","Mình sẽ mang từng món về cho gia đình họ, nếu còn ai chờ. Tớ hứa."]],
 clock2:[["Nam","Cậu cũng thấy tim mình đập ngược theo kim đồng hồ chứ? Tớ thấy khó thở quá."]],
 atticbed:[["Ánh","Dưới gối còn một cuốn sổ nhỏ, chữ viết ngay ngắn như người ấy ghi từng ngày. Một người cô đơn, nhưng không buông xuôi."]],
 lantern:[["Tuyết","Có người vẫn thắp đèn mỗi đêm chờ ai đó về. Chờ suốt bấy nhiêu năm... tớ nghẹn quá."]]
};

/* ================= CHƯƠNG 9 · NĂM CÁI TÊN =================
   Sau khi bóng ông Bá Lâm tan, cổng sắt vẫn khóa: năm người bị nhốt chưa có tên. Mơ chỉ người chơi quay lại năm nơi từng có di vật;
   mỗi nơi lộ ra một cái tên + câu chuyện. Đủ năm tên thì về bàn thờ (BG12) ghép tên với di vật. Dùng lại các điểm tương tác sẵn có. */
const QNAMES={
 well:{id:"hai",name:"Lê Văn Hải",role:"người làm công trông giếng",relic:"scarf",relicName:"Khăn vải cũ",lines:[["Nguyệt","Trên thành giếng có chữ khắc bằng mũi dao, mới nhìn tưởng vết rêu. ...“Hải”. Rồi thêm: “Lê Văn Hải, làm công, trông giếng”."],["Tuyết","Bác ấy tự khắc tên mình vào đá. Như sợ có ngày chẳng còn ai nhớ."],["Nam","Dưới còn một dòng nhỏ hơn: “Tôi chỉ ký vào đơn xin gạo cho con tôi.” Chỉ vì vậy thôi sao..."],["Nguyệt","Lê Văn Hải. Tớ ghi vào sổ. Bác Hải, chúng cháu nhớ bác."]]},
 spoon:{id:"sen",name:"Trần Thị Sen",role:"người nấu bếp",relic:"spoon",relicName:"Muôi cơm rỉ",lines:[["Tuyết","Trên xà bếp có những vạch than, đếm từng ngày. Vạch cuối là hai chữ: “Sen nấu”."],["Nguyệt","“Trần Thị Sen, nấu bếp.” Chị ấy đếm bốn mươi mốt vạch. Rồi hết."],["Ánh","Chiếc muôi mất cán lúc nãy... Chị nấu cho cả nhà, rồi vẫn nấu phần cơm cho những người bị nhốt dưới hầm, đúng không?"],["Tuyết","Chắc vậy. Chính mình còn đói mà vẫn chia cơm cho người khác. Tớ thương chị ấy quá."],["Nguyệt","Trần Thị Sen. Tên chị đã được ghi lại."]]},
 comb:{id:"lua",name:"Phạm Thị Lụa",role:"vú nuôi của bé Mơ",relic:"comb",relicName:"Trâm gỗ gãy",lines:[["Ánh","Dưới đáy nôi có dòng chữ khâu bằng chỉ đỏ, rất nhỏ: “Lụa ru em”."],["Nguyệt","Phạm Thị Lụa, vú nuôi của bé Mơ. Chị ấy ở lại vì không nỡ bỏ đứa trẻ."],["Tuyết","Bài ru trong hộp nhạc... có lẽ chị Lụa đã hát cho em nghe suốt những năm đó."],["Ánh","Tớ nghe lại tiếng hát khẽ rồi. Lần này tớ không sợ nữa."],["Nguyệt","Phạm Thị Lụa. Cảm ơn chị đã ru em."]]},
 ledger:{id:"tam",name:"Nguyễn Văn Tâm",role:"thủ kho, người viết đơn tố cáo",relic:"petition",relicName:"Mảnh đơn tố cáo",lines:[["Nguyệt","Giữa các trang sổ có một tờ nhỏ mà lần trước mình bỏ sót, ký tên: “Nguyễn Văn Tâm, thủ kho”."],["Đông","Thủ kho. Người biết rõ nhất gạo đi đâu, và dám nói ra. Người viết đơn tố cáo chính là bác ấy."],["Nam","Ông Lâm trả công bác ấy bằng cái hầm tối. Tớ muốn đập cái bàn này quá."],["Đông","Bình tĩnh, Nam. Điều bác ấy cần là tên được đọc lên, không phải cơn giận của mình."],["Nguyệt","Nguyễn Văn Tâm. Bác đã dũng cảm hơn tất cả chúng cháu."]]},
 sandals:{id:"khoa",name:"Đỗ Văn Khoa",role:"thầy giáo làng, người dẫn đầu",relic:"sandals",relicName:"Đôi dép vải cũ",lines:[["Tuyết","Dưới đáy cuốn sổ nhỏ trong đống đồ có chữ nắn nót: “Đỗ Văn Khoa, dạy học”."],["Nguyệt","Thầy giáo làng. Thầy dẫn bốn người đến đòi gạo cho học trò đói. Và thầy là người cuối cùng ngừng gõ."],["Đông","Dưới đôi dép còn một dòng: “Nếu ai đọc được, xin nhắn về làng: gạo ở trong kho nhà ông Lâm.”"],["Tuyết","Tớ khóc mất. Cả đời thầy dạy người ta biết đọc, mà chữ cuối cùng thầy viết lại là để cầu cứu."],["Nguyệt","Đỗ Văn Khoa. Thầy ơi, lời nhắn của thầy đã tới nơi rồi."]]}
};
const questOn=()=>!!(state.flags.lamDone&&!state.flags.namesDone);
const namesFound=()=>Array.isArray(state.flags.names)?state.flags.names:[];
/* Trả true nếu hành động này là một manh mối tên (đã xử lý xong, không cần chạy tiếp) */
function nameClueAt(action){const c=QNAMES[action];if(!c||!questOn())return false;
 const f=namesFound();
 if(f.includes(c.id)){say('Nguyệt',c.name+', '+c.role+'. Tên bác đã được ghi vào sổ ('+f.length+'/5).');return true}
 state.flags.names=[...f,c.id];
 note('name_'+c.id,'Cái tên: '+c.name,c.name+', '+c.role+'. Chủ nhân của '+c.relicName.toLowerCase()+'.');
 const left=5-state.flags.names.length;
 talk(left?[...c.lines,['Mơ','Còn '+left+' cái tên nữa, chị ạ.']]:[...c.lines,['Mơ','Đủ năm tên rồi. Chị về bàn thờ đi, họ đang đợi chị gọi.']]);
 save();return true}
const NAME_LIST=Object.values(QNAMES);
function showNames(){const f=namesFound();
 if(f.length<5){showModal(`<h2>Năm bát hương đã nguội</h2><p>Mỗi bát hương đang chờ một cái tên. Bạn đã biết <strong>${f.length}/5</strong> cái tên.</p><p class="modal-note">Mơ nói họ vẫn nằm ở những nơi từng sống: giếng, bếp, phòng bé, bàn của ông Lâm và căn hầm.</p><div id="names-actions" class="modal-buttons"></div>`,'BÀN THỜ GIA TIÊN','altar');$('names-actions').appendChild(modalButton('Đã hiểu',hideModal));return}
 renderNames()}
let nameSlot=0,nameTaken=[];
function renderNames(){const order=RITUAL_SHOW.map(r=>NAME_LIST.find(c=>c.relic===r));const cur=order[nameSlot];
 showModal(`<h2>Gọi tên người đã khuất</h2><p><strong>Bát hương ${nameSlot+1} / 5</strong></p><p>Đặt <strong>${escapeHTML(cur.relicName)}</strong> trước bát hương và đọc tên người đã dùng nó.</p><div id="name-options" class="ritual-list"></div><p class="modal-note">Hãy đọc lại nhật ký nếu chưa nhớ.</p>`,'CÂU ĐỐ · NĂM CÁI TÊN','names');
 NAME_LIST.forEach(c=>{const b=document.createElement('button');b.type='button';b.className='ritual-option';b.disabled=nameTaken.includes(c.id);b.textContent=c.name;
  b.addEventListener('click',()=>{if(c.id!==cur.id){toast('Bát hương không bắt lửa. Chưa đúng người.');playSound('switch',.12);return}
   nameTaken.push(c.id);nameSlot++;playSound('lighter',.16);if(nameSlot<5){renderNames();return}finishNames()});$('name-options').appendChild(b)})}
function finishNames(){nameSlot=0;nameTaken=[];state.flags.namesDone=true;
 note('namesDone','Năm cái tên','Lê Văn Hải, Trần Thị Sen, Phạm Thị Lụa, Nguyễn Văn Tâm, Đỗ Văn Khoa. Năm bát hương cháy trở lại khi tên của từng người được đọc lên. Cổng sắt đã mở.');
 save();hideModal();renderSidebar();
 talk([['Nguyệt','Lê Văn Hải. Trần Thị Sen. Phạm Thị Lụa. Nguyễn Văn Tâm. Đỗ Văn Khoa. Tên các bác, cháu đã gọi đủ.'],
  ['Mơ','Họ đang cười kìa chị. Em chưa thấy bác Hải cười bao giờ.'],
  ['Tuyết','Khói nhang bay lên rồi. Thơm quá. Hình như cả căn nhà nhẹ đi nhiều lắm.'],
  ['Mơ','Cổng mở rồi. Chị mang các bác ra ngoài nhé. Và mang cả em, bằng cái tên của em.'],
  ['Đông','Mình hứa. Đi thôi. Lần này đi hết con đường, không bỏ ai lại.']])}

const initialState = () => ({
  scene:'BG01',items:['camera','flashlight','notebook','lighter'],relics:[],evidence:[],
  visited:['BG01'],notes:[{id:'start',title:'Chuyến đi năm 2026',body:'Đông, Nam, Tuyết, Ánh và Nguyệt đến Đồng Chay để ghi lại truyền thuyết về biệt thự Vân Hòa.'}],
  flags:{gateOpened:false,frontOpened:false,wallOpened:false,clockSeen:false,safeOpened:false,ritualDone:false,mirrorPhoto:false,ending:null},
  ritualProgress:[],used:[],camMode:'night',selectedItem:null,sound:true,flashlight:false,endingsSeen:[]
});
let state=initialState();
let dialogueOpen=false;let modalType=null;let toastTimer=null;
/* ================= ÂM THANH =================
   Quy tắc: mỗi âm thanh chỉ phát ở nơi nó thật sự có thể vang lên trong cảnh đó. */
const SOUND={door:'creaking-door.mp3',slam:'door-slam.mp3',knock:'knock-on-the-door.mp3',steps:'tieng_buoc_chan.mp3',page:'pageturn.mp3',camera:'Chup_anh.mp3',lighter:'lighter.mp3',switch:'light-switch.mp3',
 market:'tieng_on_ao_o_cho.mp3',water:'nuoc_chay.mp3',frogs:'community-frogs.mp3',frogsNight:'frogs-croaking-at-night.mp3',gecko:'than_lan_keu_3s.mp3',crickets:'tieng_de_keu.mp3',musicbox:'music_box.mp3'};
const SLAM_LEAD=3.3;                         /* door-slam.mp3: cú đập nằm ở ~4,0 s; bắt đầu phát từ 3,3 s để nó vang ngay sau tiếng kẽo kẹt */
/* Tương tác = nhân vật bước tới chỗ đó: dùng tieng_buoc_chan.mp3 (3 bước khi đi sang cảnh khác, 2 bước khi xem/nhặt đồ). */
const PAPER_ITEMS=['petition','testimony'];  /* chỉ vật bằng giấy mới có tiếng lật giấy khi nhặt */
const VILLA_ROOMS=['BG11','BG12','BG13','BG14','BG15','BG16','BG17','BG23','BG24']; /* tiếng thằn lằn chỉ có ở trong nhà biệt thự */
const AMBIENCE={
 BG01:{market:.22},                        /* cổng làng, đông người */
 BG02:{market:.12},                        /* ngõ làng, tiếng ồn xa dần */
 BG03:{water:.5,frogs:.35},                /* ruộng có mương: nước chảy + ếch */
 BG04:{water:.6,frogsNight:.9,crickets:.5},  /* cầu gỗ lúc chiều muộn: ếch + dế */
 BG05:{frogsNight:.6,crickets:.55},         /* ven rừng ban đêm */
 BG06:{crickets:.4},                        /* rừng tre: dế thưa dần; sang BG07 tắt hẳn (Nam: dế im phăng phắc) */
 BG21:{musicbox:.5},                        /* bên kia gương: hộp nhạc đang phát sáng, giai điệu ru (Für Elise) */
 BG22:{musicbox:.32}                        /* đáy giếng: nhạc vọng xuống nhỏ hơn; tắt sau khi gọi tên Mơ */
};
function playSound(name,volume=.25,from=0,dur=0){if(!state.sound)return;const file=SOUND[name];if(!file)return;try{const a=new Audio(ROOT+'sound/'+file);a.volume=Math.min(1,volume*2.2);const start=()=>{try{if(from)a.currentTime=from}catch(_){}a.play().catch(()=>{});if(dur)setTimeout(()=>{const v=a.volume,t=setInterval(()=>{a.volume=Math.max(0,a.volume-v/6);if(a.volume<=.001){clearInterval(t);a.pause()}},40)},dur*1000)};(from&&a.readyState<1)?a.addEventListener('loadedmetadata',start,{once:true}):start()}catch(_){}}
/* Âm thanh nền theo cảnh: nhiều lớp phát cùng lúc, lớp nào không còn thuộc cảnh mới thì tắt dần */
const ambient={};
function fadeTo(e,to,ms,done){clearInterval(e.fade);const a=e.a,from=a.volume,steps=Math.max(1,Math.round(ms/50));let i=0;e.fade=setInterval(()=>{i++;a.volume=Math.max(0,Math.min(1,from+(to-from)*i/steps));if(i>=steps){clearInterval(e.fade);if(done)done()}},50)}
function setAmbience(){
 let want=(state.sound&&$('title-screen').hidden)?(AMBIENCE[state.scene]||{}):{};
 if(state.flags.sixthDone&&want.musicbox){want={...want};delete want.musicbox}
 for(const name of Object.keys(ambient)){if(!(name in want)){const e=ambient[name];delete ambient[name];fadeTo(e,0,900,()=>e.a.pause())}}
 for(const [name,vol] of Object.entries(want)){
  const e=ambient[name];
  if(e){if(e.a.paused)e.a.play().catch(()=>{});fadeTo(e,vol,900);continue}
  try{const a=new Audio(ROOT+'sound/'+SOUND[name]);a.loop=true;a.volume=0;const entry={a};ambient[name]=entry;a.play().catch(()=>{});fadeTo(entry,vol,1400)}catch(_){}
 }}
function stopAmbience(){stopGecko();for(const name of Object.keys(ambient)){const e=ambient[name];delete ambient[name];clearInterval(e.fade);e.a.pause()}}
/* Thạch sùng: không còn kêu liên tục. Cứ 2 phút (tính thời gian ở trong nhà biệt thự) phát đúng 3 giây rồi tắt.
   than_lan_keu_3s.mp3 là đoạn 3,0 s cắt từ tệp gốc, tắt dần ở 0,25 s cuối; timer chỉ là chốt an toàn. Lần đầu vào nhà kêu sau ~20 s. */
const GECKO_EVERY=120,GECKO_FIRST=100,GECKO_MS=3000,GECKO_VOL=.3;
let geckoClock=GECKO_FIRST,geckoA=null,geckoStopT=0;
function stopGecko(){clearTimeout(geckoStopT);if(geckoA){try{geckoA.pause()}catch(_){}geckoA=null}}
function geckoBurst(){stopGecko();try{const a=new Audio(ROOT+'sound/'+SOUND.gecko);a.volume=GECKO_VOL;geckoA=a;a.play().catch(()=>{if(geckoA===a)geckoA=null});geckoStopT=setTimeout(()=>{if(geckoA===a){a.pause();geckoA=null}},GECKO_MS)}catch(_){}}
function geckoTick(){if(document.hidden||!state.sound||!$('title-screen').hidden||!VILLA_ROOMS.includes(state.scene))return;if(++geckoClock>=GECKO_EVERY){geckoClock=0;geckoBurst()}}
/* Lưu tiến trình có chữ ký: sửa tay localStorage (đổi cảnh, thêm vật phẩm, nhảy qua câu đố) sẽ bị phát hiện và bản lưu bị bỏ qua.
   Đây là lớp chặn sửa đơn giản, không phải mã hóa: game chạy hoàn toàn trên máy người chơi. */
function sig(str){const s=SAVE_SALT+str;let h1=0xdeadbeef,h2=0x41c6ce57;for(let i=0;i<s.length;i++){const c=s.charCodeAt(i);h1=Math.imul(h1^c,2654435761);h2=Math.imul(h2^c,1597334677)}h1=Math.imul(h1^(h1>>>16),2246822507)^Math.imul(h2^(h2>>>13),3266489909);h2=Math.imul(h2^(h2>>>16),2246822507)^Math.imul(h1^(h1>>>13),3266489909);return (4294967296*(2097151&h2)+(h1>>>0)).toString(36)}
function save(){try{const d=JSON.stringify(state);localStorage.setItem(SAVE_KEY,JSON.stringify({d,h:sig(d)}))}catch(_){}}
function load(){try{const raw=localStorage.getItem(SAVE_KEY);if(!raw)return null;const o=JSON.parse(raw);if(!o||typeof o.d!=='string'||o.h!==sig(o.d))return null;
 const s=JSON.parse(o.d);if(!s||typeof s!=='object'||!SCENES[s.scene]||!Array.isArray(s.items)||!Array.isArray(s.relics))return null;
 const base=initialState(),list=(v,ok)=>Array.isArray(v)?v.filter(ok):[],item=x=>typeof x==='string'&&!!ITEMS[x],str=x=>typeof x==='string';
 return {...base,...s,
  items:list(s.items,item),relics:list(s.relics,item),used:list(s.used,item),ritualProgress:list(s.ritualProgress,item),
  evidence:list(s.evidence,str),endingsSeen:list(s.endingsSeen,str),visited:list(s.visited,x=>!!SCENES[x]),
  notes:list(s.notes,n=>n&&str(n.id)&&str(n.title)&&str(n.body)),
  flags:{...base.flags,...(s.flags&&typeof s.flags==='object'&&!Array.isArray(s.flags)?s.flags:{})},
  selectedItem:item(s.selectedItem)?s.selectedItem:null,camMode:CAM_MODES[s.camMode]?s.camMode:'night',sound:s.sound!==false,flashlight:!!s.flashlight};
 }catch(_){return null}}
function has(id){return state.items.includes(id)}
function clue(id){if(!Array.isArray(state.flags.clues))state.flags.clues=[];if(!state.flags.clues.includes(id)){state.flags.clues.push(id);save();return true}return false}
function note(id,title,body){if(!state.notes.some(n=>n.id===id)){state.notes.push({id,title,body});const b=$('btn-journal');if(b)b.classList.add('has-new')}save()}
function gain(id){if(!ITEMS[id]||has(id)||state.used.includes(id))return false;state.items.push(id);if(ITEMS[id].relic&&!state.relics.includes(id))state.relics.push(id);if(PAPER_ITEMS.includes(id))playSound('page',.22);itemPop(id);save();renderSidebar();return true}
/* Vật phẩm dùng xong thì bị xóa khỏi túi đồ và không nhặt lại được (state.used). quiet=true: không hiện thông báo. */
function consume(id,quiet){if(!state.used.includes(id))state.used.push(id);const had=has(id);state.items=state.items.filter(x=>x!==id);if(state.selectedItem===id)state.selectedItem=null;if(had&&!quiet&&ITEMS[id])toast('Đã dùng hết: '+ITEMS[id].name);renderSidebar();save()}
function evidence(id){if(!state.evidence.includes(id))state.evidence.push(id);save();}
function toast(msg){const el=$('toast');el.textContent=msg;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),2700)}
function itemArt(id,cls){const info=ITEMS[id],box=document.createElement('span');box.className=cls;if(info.image){const img=document.createElement('img');img.src=IMG(info.image);img.alt='';img.draggable=false;box.appendChild(img)}else{box.classList.add('is-emoji');box.textContent=info.emoji||'◆'}return box}
function setDialogueMode(on){$('app-shell').classList.toggle('in-dialogue',on)}
let dlgQueue=[];
function say(who,text){dlgQueue=[];showLine(who,text);setNextLabel()}
function talk(lines){const l=(lines||[]).filter(Boolean);if(!l.length)return;say(l[0][0],l[0][1]);dlgQueue=l.slice(1);setNextLabel()}
function setNextLabel(){const b=$('dialogue-next');if(b)b.innerHTML=dlgQueue.length?'TIẾP <span>›</span>':'ĐÓNG <span>✕</span>'}
function nextLine(){if(window.finishTyping&&window.finishTyping())return;if(dlgQueue.length){const [w,t]=dlgQueue.shift();showLine(w,t);setNextLabel()}else clearDialogue()}
function showLine(who,text){const pf=PORTRAITS[who],isPerson=!!pf;
 $('dialogue-portrait-wrap').hidden=!isPerson;$('dialogue').classList.toggle('has-portrait',isPerson);$('dialogue-symbol').hidden=isPerson;
 if(isPerson){$('dialogue-portrait').src=PORTRAIT(pf);$('dialogue-portrait').alt='Chân dung '+who}
$('dialogue-speaker').textContent=who;$('dialogue-text').textContent=text;
 $('chatter').classList.remove('on');
 $('dialogue').hidden=false;dialogueOpen=true;setDialogueMode(true)}
function clearDialogue(){dlgQueue=[];$('dialogue').hidden=true;dialogueOpen=false;setDialogueMode(false)}
/* ================= LỜI NGƯỜI XUNG QUANH (nghe lỏm) =================
   Người trong cảnh nói chuyện với nhau. Chưa có tệp thoại nên hiện chữ nhỏ ở góc màn hình, không chặn thao tác,
   tự ẩn khi có hội thoại/bảng mở. Mỗi đoạn chỉ lặp lại sau khi đã nghe hết các đoạn khác của cảnh đó. */
const OVERHEARD={
 BG01:[
  [["Người bán hàng","Gạo năm nay lên giá rồi bà ơi, bán chẳng được mấy bao."],["Bà bán nước","Thì cũng ráng. Mưa thuận gió hòa là phúc lắm rồi."]],
  [["Người đi đường","Ơ, mấy đứa kia người thành phố hả? Lạ mặt quá nhỉ."],["Người làng","Chắc sinh viên về tìm hiểu gì đó. Năm ngoái cũng có đoàn lên, xong vào rừng rồi... thôi, đừng nói."]],
  [["Cậu bé","Mẹ ơi, bác kia đạp xe chở cả buồng chuối kìa!"],["Người mẹ","Nói khẽ thôi con, người ta nghe thấy."]],
  [["Bà bán nước","Chè xanh nóng đây, uống cho ấm bụng rồi hẵng đi."],["Người làng","Bà cứ bán, mà chiều tối nhớ dọn hàng sớm nhé."]]
 ],
 BG02:[
  [["Trẻ con","Chạy nhanh lên! Gà nó chạy kìa, đuổi mau!"],["Trẻ con","Ái! Đừng có kéo áo tớ!"]],
  [["Bà gánh rau","Rau muống mới hái sáng nay đây! Ai mua rau không?"],["Người làng","Cho tôi hai mớ. À mà bà thấy mấy đứa sinh viên kia chưa? Tụi nó hỏi đường vào rừng đấy."]],
  [["Ông cụ","Hừ... Lại đi tìm cái nhà ma ấy. Tuổi trẻ bây giờ chẳng sợ gì."],["Bà gánh rau","Ông đừng nói nữa, kẻo tụi nó nghe."]]
 ],
 BG03:[
  [["Người cấy lúa","Hôm nay xong thửa này thì về sớm nhé."],["Người cấy lúa","Ừ, về sớm. Trời tối ai dám ra đồng đâu."]],
  [["Bác nông dân","Này, trâu! Đi cho đàng hoàng coi!"],["Người làng","Con trâu hôm nay hơi lạ, cứ nhìn về phía rừng hoài."]],
  [["Người làng","Mấy cô cậu kia ơi, đi ngả cầu gỗ thì nhớ về trước tối nhé!"]]
 ],
 BG04:[
  [["Người gánh hàng","Nhanh chân lên bà ơi, sắp tối rồi."],["Bà cụ","Ừ, qua cầu này là tôi về luôn, không đi xa hơn đâu."]],
  [["Bà cụ","Cái cầu này, đêm nghe nó kẽo kẹt như có người bước..."],["Người gánh hàng","Bà đừng nói chuyện đó lúc này."]]
 ],
 BG05:[
  [["Tiếng vọng từ làng","...đừng quay đầu lại... qua khỏi cây đa là thôi..."]],
  [["Tiếng vọng từ làng","Có ai ở trong rừng không... Có ai vừa gọi tôi không..."]]
 ]
};
let chatTimer=0,chatHide=0,chatScene=null;const chatSeen=new Set();
const chatBusy=()=>!$('title-screen').hidden||dialogueOpen||!!modalType||document.hidden||document.documentElement.classList.contains('is-busy');
function chatClear(){clearTimeout(chatTimer);clearTimeout(chatHide);const c=$('chatter');c.classList.remove('on')}
function chatSchedule(ms){clearTimeout(chatTimer);chatTimer=setTimeout(chatRun,ms)}
function chatRun(){const sid=state.scene,list=OVERHEARD[sid];if(!list)return;if(chatBusy()){chatSchedule(3000);return}
 let pool=list.map((_,i)=>i).filter(i=>!chatSeen.has(sid+i));if(!pool.length){list.forEach((_,i)=>chatSeen.delete(sid+i));pool=list.map((_,i)=>i)}
 const i=pool[Math.floor(Math.random()*pool.length)];chatSeen.add(sid+i);chatPlay(list[i],0,sid)}
function chatPlay(ex,k,sid){if(state.scene!==sid)return;if(chatBusy()){chatSchedule(k?9000:3000);return}
 const c=$('chatter'),[who,text]=ex[k],w=document.createElement('b'),t=document.createElement('span');w.textContent=who;t.textContent=text;c.replaceChildren(w,t);void c.offsetWidth;c.classList.add('on');
 chatHide=setTimeout(()=>{c.classList.remove('on');if(k+1<ex.length)chatTimer=setTimeout(()=>chatPlay(ex,k+1,sid),800);else chatSchedule(20000+Math.random()*16000)},2800+text.length*60)}
function chatEnter(){chatClear();if(OVERHEARD[state.scene])chatSchedule(3500)}

/* ---- Thông báo nhận vật phẩm ---- */
let popQueue=[],popBusy=false;
function itemPop(id){popQueue.push(id);if(!popBusy)nextPop()}
function nextPop(){const id=popQueue.shift();if(!id){popBusy=false;return}popBusy=true;const info=ITEMS[id],card=document.createElement('div');card.className='pop-card';
 card.appendChild(itemArt(id,'pop-art'));const t=document.createElement('div');t.className='pop-text';
 const k=document.createElement('small');k.textContent=info.relic?`ĐÃ NHẬN DI VẬT · ${state.relics.length}/5`:'ĐÃ NHẬN ĐƯỢC VẬT PHẨM';
 const n=document.createElement('strong');n.textContent=info.name;const d=document.createElement('span');d.textContent=info.description;t.append(k,n,d);card.appendChild(t);
 $('item-pop').appendChild(card);requestAnimationFrame(()=>card.classList.add('in'));
 setTimeout(()=>{card.classList.remove('in');card.classList.add('out');setTimeout(()=>{card.remove();nextPop()},420)},3300)}
function go(target){if(target==='BG11'&&state.flags.lamAwake&&!state.flags.lamDone)target='BG23';if(!SCENES[target])return;const from=state.scene,first=!state.visited.includes(target);state.scene=target;if(first)state.visited.push(target);clearDialogue();hideModal();render();if(first&&SCENES[target].intro)talk(introOf(target));if(first&&(target==='BG18'||target==='BG19'))setTimeout(()=>playSound('knock',.13),2600);else if((from==='BG11'||from==='BG23')&&target==='BG10')playSound('door',.22);save();}
function isTarget(h){const sel=state.selectedItem;return !!(sel&&USE_ON[sel]&&USE_ON[sel].includes(h.action))}
function makeHotspot(h){const b=document.createElement('button');b.type='button';b.className='hotspot'+(isTarget(h)?' is-target':'');b.setAttribute('aria-label',h.label);b.title=h.label;b.style.left=h.x+'%';b.style.top=h.y+'%';b.style.width=h.w+'%';b.style.height=h.h+'%';const span=document.createElement('span');span.className='hotspot-label';span.textContent=h.label;b.appendChild(span);b.addEventListener('click',event=>{event.stopPropagation();act(h.action);});return b}
/* ================= MÁY ẢNH / MÁY QUAY: bộ lọc nhìn đêm (camera.css) ================= */
const CAM_MODES={night:{label:'NIGHT VISION',sub:'NV · IR ILLUMINATOR ON'},ir:{label:'INFRARED',sub:'IR 850 nm · MONO'},thermal:{label:'THERMAL',sub:'HEAT MAP · AUTO GAIN'},vhs:{label:'CAMCORDER',sub:'VHS · LP · TRACKING'}};
const CAM_ORDER=['night','ir','thermal','vhs'];
let camHud=null,camTimer=0,camSecs=0;
function buildCamHud(){
 if(camHud)return;
 const st=$('scene-stage'),grain=st.querySelector('.fx-grain'),h=document.createElement('div');h.className='cam-hud';h.setAttribute('aria-hidden','true');
 const g=grain&&grain.style.getPropertyValue('--grain');if(g)h.style.setProperty('--cam-noise',g);
 h.innerHTML='<div class="cam-tint"></div><div class="cam-noise"></div><div class="cam-scan"></div><div class="cam-band"></div><div class="cam-vig"></div>'
  +'<i class="cam-c tl"></i><i class="cam-c tr"></i><i class="cam-c bl"></i><i class="cam-c br"></i><div class="cam-cross"></div>'
  +'<div class="cam-tl-info"><span class="cam-rec">● REC</span><span id="cam-tc">00:00:00</span></div>'
  +'<div class="cam-tr-info"><span id="cam-name"></span><span class="cam-batt"><i></i><i></i><i></i></span></div>'
  +'<div class="cam-bl-info"><span id="cam-sub"></span><span class="cam-temp" id="cam-temp"></span></div>'
  +'<div class="cam-br-info"><span id="cam-time"></span></div>'
  +'<button class="cam-mode-btn" id="cam-mode" type="button">⟳ ĐỔI CHẾ ĐỘ [V]</button><div class="cam-flash" id="cam-flash"></div>';
 st.appendChild(h);camHud=h;
 $('cam-mode').addEventListener('click',e=>{e.stopPropagation();cycleCam()});
 if(!document.getElementById('cam-thermal'))document.body.insertAdjacentHTML('beforeend','<svg width="0" height="0" style="position:absolute" aria-hidden="true"><filter id="cam-thermal" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values=".33 .33 .33 0 0  .33 .33 .33 0 0  .33 .33 .33 0 0  0 0 0 1 0"/><feComponentTransfer><feFuncR type="table" tableValues="0 .1 .45 .85 1 1"/><feFuncG type="table" tableValues="0 0 .05 .3 .75 1"/><feFuncB type="table" tableValues=".15 .45 .55 .25 0 .6"/></feComponentTransfer></filter></svg>');
}
function camTick(){
 camSecs++;const p=n=>String(n).padStart(2,'0');
 const tc=$('cam-tc');if(tc)tc.textContent=p(Math.floor(camSecs/3600))+':'+p(Math.floor(camSecs/60)%60)+':'+p(camSecs%60);
 const t=$('cam-temp');if(t)t.textContent=' · '+(30+Math.random()*7.5).toFixed(1)+'°C'}
function updateCam(){
 const on=state.selectedItem==='camera',st=$('scene-stage'),root=document.documentElement;
 if(!CAM_MODES[state.camMode])state.camMode='night';
 st.classList.toggle('cam-on',on);st.dataset.cam=state.camMode;root.classList.toggle('cam-on',on);root.dataset.cam=state.camMode;
 if(!on){clearInterval(camTimer);camTimer=0;return}
 buildCamHud();const m=CAM_MODES[state.camMode];
 $('cam-name').textContent=m.label;$('cam-sub').textContent=m.sub;$('cam-time').textContent=SCENES[state.scene].time+'  ·  '+state.scene;
 if(!camTimer){camSecs=0;camTick();camTimer=setInterval(camTick,1000)}}
function cycleCam(){if(state.selectedItem!=='camera')return;state.camMode=CAM_ORDER[(CAM_ORDER.indexOf(state.camMode)+1)%CAM_ORDER.length];save();updateCam();toast('Máy ảnh: '+CAM_MODES[state.camMode].label)}
function camFlash(){buildCamHud();const f=$('cam-flash');if(!f)return;f.classList.remove('on');void f.offsetWidth;f.classList.add('on')}
function render(){const s=SCENES[state.scene],bg=BG(s.bg||state.scene);$('scene-image').src=bg;$('scene-image').alt='Cảnh '+state.scene+': '+s.name;$('scene-backdrop').style.backgroundImage=`url("${bg}")`;
 $('scene-title').textContent=s.name;$('scene-stage').dataset.tint=s.tint||'';$('clock-label').textContent=s.time;$('chapter-label').textContent=questOn()?'CHƯƠNG 9 · NĂM CÁI TÊN':s.chapter;$('scene-index').textContent=`${state.scene} / ${Object.keys(SCENES).length}`;
 $('hotspots').replaceChildren(...s.spots.filter(h=>!h.req||state.flags[h.req]).map(makeHotspot));
 $('scene-stage').classList.toggle('torch-on',state.flashlight&&parseInt(state.scene.slice(2))>=18);$('scene-stage').classList.toggle('has-selection',!!state.selectedItem);
 $('btn-audio').textContent=state.sound?'♪':'♪̸';$('btn-audio').setAttribute('aria-pressed',state.sound?'true':'false');
 renderSidebar();updateCam();setAmbience();if(chatScene!==state.scene){chatScene=state.scene;chatEnter()}}
/* Thanh vật phẩm ở đáy màn hình */
function renderSidebar(){$('inventory-grid').replaceChildren(...state.items.map(id=>{
 const info=ITEMS[id],b=document.createElement('button');b.className='dock-slot'+(state.selectedItem===id?' selected':'')+(id==='flashlight'&&state.flashlight?' is-on':'');b.type='button';b.setAttribute('aria-label',info.name);b.setAttribute('aria-pressed',state.selectedItem===id?'true':'false');
 b.appendChild(itemArt(id,'dock-art'));if(info.relic){const dot=document.createElement('span');dot.className='dock-dot';b.appendChild(dot)}
 b.title=info.name;
 b.addEventListener('click',()=>selectItem(id));return b}));
 const sel=state.selectedItem&&ITEMS[state.selectedItem],box=$('selected-item');box.hidden=!sel;box.classList.toggle('has-target',false);
 if(!sel){box.textContent='';return}
 const targets=USE_ON[state.selectedItem],here=targets&&SCENES[state.scene].spots.some(h=>targets.includes(h.action)&&(!h.req||state.flags[h.req]));
 box.textContent='';const n=document.createElement('strong');n.textContent=sel.name;box.append(n,' — '+sel.description);
 if(targets){const hint=document.createElement('em');hint.className='dock-hint';hint.textContent=here?'◆ Chạm vào điểm sáng vàng trong cảnh để dùng.':'◇ Chưa có chỗ dùng ở cảnh này.';box.appendChild(hint);box.classList.toggle('has-target',here)}}
function getObjective(){if(questOn()){const n=namesFound().length;return ['Năm cái tên','Cổng sắt vẫn khóa. Mơ bảo năm người bị nhốt còn nằm lại nơi họ từng sống. Quay lại giếng sân (BG09), bếp (BG13), phòng trẻ (BG16), bàn ông Lâm (BG17) và hầm kín (BG20) để tìm tên họ ('+n+'/5). Đủ tên thì về bàn thờ BG12.']}if(state.flags.sixthDone&&!state.flags.lamDone)return ['Bóng ông Bá Lâm','Ánh đỏ ở đại sảnh BG11. Tìm lời khai bà Mận ở gác mái (nắp trần hành lang BG15) rồi đối chất bằng đủ chứng cứ.'];if(state.flags.awakened&&!state.flags.sixthDone)return ['Cái tên thứ sáu','Tiếng khóc vọng từ phòng trẻ (BG16). Manh mối: '+(state.flags.clues||[]).length+'/3. Tìm chuông đồng ở giếng sân, giấy tờ ở phòng làm việc, rồi nôi trẻ.'];if(state.flags.ritualDone)return ['Rời khỏi biệt thự','Trở ra cổng sắt ở BG08. Quyết định đem chứng cứ đi hay bỏ lại.'];const n=parseInt(state.scene.slice(2));if(n<=4)return ['Tìm ngôi miếu ven rừng','Đi từ cổng làng, qua ngõ và cánh đồng tới cây đa.'];if(n<=7)return ['Tìm lối đến biệt thự','Qua rừng tre và kiểm tra cột mốc đá để tìm chìa khóa.'];if(n===8&&!state.flags.gateOpened)return ['Mở khóa cổng sắt','Chìa khóa nằm gần cột mốc cũ ở rừng sâu (BG07).'];if(!state.flags.wallOpened&&n>=18)return ['Mở bức tường tầng hầm','Hãy dùng thanh sắt trong bếp (BG13) phá lớp vữa che lấp năm dấu tay.'];if(state.relics.length===5)return ['Trả lại năm di vật','Quay về bàn thờ gia tiên BG12, đặt các di vật theo thứ tự khám phá.'];if(state.flags.wallOpened)return ['Thu thập bằng chứng cuối cùng','Hãy tìm di vật và hộp tài liệu trong căn phòng kín BG20.'];return ['Điều tra biệt thự Vân Hòa',`Đã tìm thấy ${state.relics.length}/5 di vật. Khám phá sân, gian bếp, phòng trẻ, phòng làm việc và hầm kín.`]}
function selectItem(id){if(id==='flashlight'){state.flashlight=!state.flashlight;toast(state.flashlight?'Đèn pin: BẬT':'Đèn pin: TẮT');playSound('switch',.19);render();save();return}else if(id==='notebook'){showJournal();return}else if(id==='camera'){}else if(id==='lighter'){toast('Chiếc bật lửa cũ vẫn còn gas.')}state.selectedItem=state.selectedItem===id?null:id;render();save();if(id==='camera'&&state.selectedItem==='camera')toast('Máy ảnh: '+CAM_MODES[state.camMode].label+' · nhấn V để đổi chế độ')}
function act(action){if(modalType)return;clearDialogue();playSound('steps',.5,0,action.startsWith('travel:')?2.4:1.6);if(nameClueAt(action)){renderSidebar();return}if(action.startsWith('travel:')){const to=action.slice(7);if(to==='BG06'&&!has('incense')&&!state.used.includes('incense')){say('Tuyết','Khoan đã... tớ thấy bất an lắm. Mình xem kỹ chỗ này trước khi vào rừng đã.');return}go(to);return}
 if(action.startsWith('inspect:')){inspect(action.slice(8));return}
 switch(action){
  case 'warning':note('oldwoman','Lời bà bán nước','Người làng cảnh báo: không vào rừng sau khi trời tối, không trả lời tiếng gọi tên mình.');talk([["Bà bán nước","Năm đứa thật à? Sáng nay tao vừa thấy sáu cái bóng... mà thôi, tao già rồi, nhìn nhầm."],["Đông","Dạ, bọn cháu chỉ đi khảo sát truyền thuyết thôi ạ. Bà có biết ngôi biệt thự trong rừng không?"],["Bà bán nước","Đừng nhắc! ...Hồi tám mấy, làng mất mấy người trong cùng một đêm. Từ đó ai đi qua cây đa cũng không dám ngoái lại. Khổ lắm con ạ."],["Tuyết","Bà cháu kể đêm ấy là đêm mười bảy tháng Ba. Có đúng không ạ?"],["Bà bán nước","Biết rồi thì tránh đi con. Trời tối đừng vào rừng, nghe ai gọi tên mình cũng đừng trả lời. Bà xin mấy đứa."],["Nguyệt","Cháu ghi lại rồi ạ. Cảm ơn bà... Bà cũng giữ sức khỏe nhé."]]);break;
  case 'shrine':if(!gain('incense')){say('Nguyệt','Bát hương chỉ còn lớp tàn lạnh.');break}note('shrine','Bát hương ven rừng','Nhang cũ chưa đốt. Trên mảnh giấy mờ chỉ đọc được: “Năm hồn giữ cửa, một bóng giữ nhà.”');talk([["Nguyệt","Nhang này còn dùng được, tớ giữ lại. ...Dưới chân bát hương có một mảnh giấy nhàu, chữ nhòe gần hết."],["Tuyết","“Năm hồn giữ cửa, một bóng giữ nhà.” ...Một bóng là ai nhỉ? Đọc xong tự nhiên tớ lạnh hết cả gáy."],["Đông","Chưa biết. Cứ giữ lại, biết đâu cần. Đừng nghĩ nhiều quá, Tuyết."]]);break;
  case 'marker':if(!gain('key')){say('Nam','Khe đá giờ trống rỗng.');break}note('marker','Chìa ở cột mốc đá','Một chìa khóa sắt rỉ nằm trong khe đá, hướng về cổng biệt thự.');talk([["Nam","Đây rồi! Chìa khóa cổng, nằm trong khe đá. Sao lại có người giấu nó ở chỗ này nhỉ?"],["Ánh","Chìa còn mới hơn khóa cổng nhiều. Chắc có người thường xuyên ra vào, hoặc thường xuyên đặt nó ở đây... Nghĩ thế càng sợ."],["Đông","Thôi, đi nào. Nhưng đừng ai quên đường về."]]);break;
  case 'gate':if(!state.flags.gateOpened){if(!has('key')){say('Đông','Cổng bị xích, ổ khóa còn nguyên. Chắc phải có chìa ở đâu đó.');break}state.flags.gateOpened=true;consume('key');note('gate','Cổng sắt mở khóa','Chiếc chìa rỉ vừa khít với ổ khóa cổng. Cánh cổng khép lại rất mạnh sau khi cả nhóm đi qua.');playSound('door',.2);setTimeout(()=>playSound('slam',.32,SLAM_LEAD),1400);talk([["Nam","Được rồi... khóa bật ra rồi. Nhưng sao cánh cổng tự khép mạnh thế? Mới nãy tớ còn đứng ngay đó!"],["Đông","Gió thôi. Vào đi, nhớ đừng tách nhau."],["Tuyết","Bà bán nước không nói dối. Nhưng tớ vẫn muốn biết sự thật. Tớ không thể đứng nhìn rồi bỏ đi."]]);renderSidebar();save()}else go('BG09');break;
  case 'exitForest':if(questOn()){say('Mơ','Cổng vẫn khóa, chị ạ. Năm người dưới hầm chưa có tên. Chị ra giếng, vào bếp, lên phòng em, rồi xuống tận hầm, họ sẽ nói cho chị biết.');break}if(state.flags.sixthDone&&!state.flags.lamDone){say('Đông','Có thứ gì đó vẫn chặn cửa chính ở đại sảnh. Phải giải quyết nó trước khi rời đi.');break}if(state.flags.awakened&&!state.flags.sixthDone){say('Nam','Cổng nặng như đá, và tiếng khóc phía sau cứ kéo mình lại. Còn một người nữa chưa được gọi tên.');break}if(!state.visited.includes('BG11')){say('Đông','Chúng ta đã đến được biệt thự. Ít nhất phải tìm hiểu chuyện gì xảy ra bên trong trước khi quay về.');break}showEscapeChoice();break;
  case 'well':if(state.flags.awakened&&!has('bell')&&!state.used.includes('bell')){clue('well');gain('bell');note('bell','Chuông đồng dưới đáy xô','Chiếc xô giếng vừa kéo lên có một chuông đồng nhỏ buộc dây đỏ, loại chuông người ta buộc cho trẻ con khỏi lạc.');say('Tuyết','Chuông trẻ con ở dưới giếng... Ai đã thả nó xuống?');break}if(gain('scarf')){note('scarf','Di vật 1 — giếng đá','Một chiếc khăn vải cũ mắc dưới nắp gỗ bên giếng. Đây có thể là di vật của người mất tích.');talk([["Tuyết","Khăn này không giống đồ gia chủ. Có lẽ của một người làm công. Chạm vào mà tay tớ cứ lạnh dần."],["Nguyệt","Tớ nghĩ nó thuộc về một trong năm người. Mình sẽ giữ gìn cẩn thận. Họ xứng đáng được mang về."],["Nam","Dưới giếng có tiếng nước chảy nhè nhẹ. ...Dù giếng này khô cạn từ lâu rồi. Nghe thật mà."]])}else say('Nam','Dưới giếng tối om. Chúng ta đã lấy chiếc khăn mắc ở nắp gỗ rồi.');break;
  case 'frontDoor':if(!state.flags.frontOpened){state.flags.frontOpened=true;note('front','Cửa vào biệt thự','Cánh cửa gỗ không khóa, nhưng kêu kéo dài như tiếng thở.');save()}playSound('door',.22);go('BG11');break;
  case 'clock':state.flags.clockSeen=true;note('clock','Đồng hồ dừng ở 03:17','Chiếc đồng hồ quả lắc ở đại sảnh đã dừng hẳn, kim chỉ đúng 03 giờ 17 phút.');talk([["Nguyệt","Kim đồng hồ chết cứng từ lâu. Tớ chép giờ vào sổ ngay."],["Tuyết","Không có một tiếng tích tắc nào. Cả ngôi nhà như đang nín thở. Tớ cũng nín thở theo."],["Đông","Ghi lại hết đi. Chi tiết nào cũng có thể quan trọng, kể cả cái nhỏ nhất."]]);save();break;
  case 'photo':note('photo','Bức ảnh gia đình','Trong ảnh gia đình ông Bá Lâm, vài khuôn mặt bị cào xước. Sự kiện 1988 có thể đã bị che giấu.');talk([["Ánh","Có những khuôn mặt bị cào đi. Như thể ai đó muốn xóa tên họ khỏi ký ức. Tớ thấy... đau."],["Nguyệt","Xóa tên khỏi ảnh, khỏi sổ sách, khỏi lời kể của cả làng... Ai làm thế được chứ?"],["Nam","Một người rất sợ họ được nhớ tới. Sợ đến mức làm mọi cách để họ biến mất."]]);break;
  case 'altar':showAltar();break;
  case 'spoon':if(gain('spoon')){note('spoon','Di vật 2 — gian bếp','Chiếc muôi cơm rỉ nằm trong tro bếp nguội, dấu tích của một người đã từng làm việc ở đây.');talk([["Tuyết","Một chiếc muôi đã mất cán. Thứ tưởng nhỏ nhặt thế này mà lại giữ lại cả một đời người."],["Nguyệt","Một người nấu cơm cho cả đại gia đình, rồi bị quên. Tớ sẽ ghi vào sổ. Tên bác ấy, tớ sẽ tìm cho ra."]])}else toast('Đã thu thập chiếc muôi cơm.');break;
  case 'crowbar':if(gain('crowbar')){note('crowbar','Thanh sắt trong bếp','Một thanh sắt cong, còn khá chắc, nhặt dưới gầm bếp củi.');talk([["Nam","Thanh sắt này còn chắc. Mang theo cũng không thừa. ...Cứ có thứ gì đó trong tay là tớ thấy đỡ run hơn."],["Đông","Chỉ dùng khi thật cần. Mình không phá nhà người ta bừa bãi."],["Nam","Yên tâm. Tớ chỉ muốn có thứ gì đó trong tay thôi."]])}else toast(state.used.includes('crowbar')?'Dưới gầm bếp chẳng còn gì.':'Thanh sắt đã nằm trong túi đồ.');break;
  case 'comb':if(gain('comb')){note('comb','Di vật 3 — phòng trẻ','Một chiếc trâm gỗ bị gãy nằm trong nôi cũ, bên cạnh con búp bê vải.');talk([["Ánh","Trong nôi có một chiếc trâm gỗ gãy... Tớ nhớ đã nhìn thấy nó trong ảnh cũ. Ai đã cầm nó?"],["Tuyết","Chiếc trâm của người lớn mà nằm trong nôi trẻ con. Có người từng ru em bé ở đây, ru rất lâu."],["Ánh","Nghe tiếng hát khẽ không? ...Chắc là tớ nghe nhầm. Mà tớ cũng không muốn nghe nhầm nữa."]])}else toast('Đã thu thập chiếc trâm gỗ.');break;
  case 'mirror':if(state.selectedItem==='camera'){camFlash();state.flags.mirrorPhoto=true;note('mirror','Bóng người trong ảnh','Máy ảnh của Ánh ghi lại một bóng trắng gần giường, dù căn phòng và gương hoàn toàn trống.');playSound('camera',.33);talk([["Ánh","Tớ vừa chụp... Có ai đó trong ảnh! Nhưng khi quay lại, không còn gì cả!"],["Nam","Cho tớ xem. ...Bóng trắng ngay cạnh giường. Cao chỉ tới ngang hông tớ. Trời ơi."],["Tuyết","Một đứa trẻ. Chắc chắn là một đứa trẻ. Em đang nhìn tụi mình."],["Nguyệt","Tớ ghi lại. Mình sẽ tìm cho ra em là ai. Em đừng sợ."]]);save()}else say('Ánh','Gương chỉ phản chiếu căn phòng trống. Nhưng tớ cứ thấy nó đang nhìn mình.');break;
  case 'ledger':if(gain('petition')){evidence('ledger');note('ledger','Sổ cứu trợ năm 1988','Sổ thu chi cho thấy lương thực cứu trợ đã bị chuyển về kho biệt thự. Một mảnh đơn tố cáo được giấu giữa các trang.');playSound('page');talk([["Nguyệt","Đúng rồi. Gạo cứu trợ bị chuyển vào kho riêng. Bằng chứng đầu tiên nằm ngay đây... Tay tớ run quá."],["Đông","Cả vùng đói, mà gạo lại nằm trong kho nhà ông ta. Tớ không tin nổi."],["Nguyệt","Và có người đã dám tố cáo. Mảnh đơn kẹp trong sổ chính là lời của họ."],["Tuyết","Nếu họ là năm người ở dưới hầm... thì mọi chuyện đã rõ một nửa. Thương họ quá."]])}else say('Nguyệt','Trang sổ đã được chụp lại. Cần tìm thêm tài liệu gốc để đối chiếu.');break;
  case 'safe':showSafe();break;
  case 'sealedWall':if(state.flags.wallOpened){go('BG20');break}if(!has('crowbar')){say('Nam','Lớp vữa đã mục, nhưng tay không thì không thể phá được.');break}showWall();break;
  case 'sandals':if(gain('sandals')){note('sandals','Di vật 5 — căn phòng kín','Đôi dép vải cũ nằm cạnh đồ dùng của năm người mất tích năm 1988.');talk([["Nguyệt","Năm người đã nằm lại đây, bị khóa phía sau bức tường... Tớ sẽ không để họ bị lãng quên. Không bao giờ."],["Đông","Có đủ năm di vật rồi. Mình quay về phòng thờ thôi."],["Tuyết","Đi theo đúng hành trình mình đã tìm ra: sân, bếp, phòng trẻ, phòng làm việc, hầm kín."]])}else toast('Đã thu thập đôi dép vải.');break;
  case 'archive':if(!state.evidence.includes('archive')){evidence('archive');note('archive','Hộp chứng cứ dưới hầm','Trong hộp sắt có sổ phát gạo và giấy tờ chứng minh việc chiếm đoạt lương thực cứu trợ.');playSound('page');talk([["Đông","Chúng ta có hồ sơ gốc rồi! Nếu còn bản thú tội trong phòng làm việc thì sự thật có thể được chứng minh."],["Nguyệt","Sổ phát gạo, giấy xác nhận... Tất cả đều có chữ ký ông Bá Lâm. Nhìn chữ ký này, tớ ghét nó."],["Nam","Giờ mình chỉ cần mang chúng ra khỏi đây an toàn. Phải sống sót để đem sự thật ra ánh sáng."]])}else say('Nguyệt','Tài liệu trong hộp đã được lưu lại. Hãy mang bằng chứng ra ngoài.');break;
  case 'cradle':{const c=state.flags.clues||[];if(!c.includes('cradle')){clue('cradle');note('cradle','Mảnh vải thêu trong nôi','Mảnh vải thêu dở trong nôi: “Thị M…”. Chiếc nôi tự đung đưa dù không có gió.');talk([["Ánh","Nôi đang rung... có chữ thêu dở: “Thị M”. Tớ nghe tiếng khóc ngay cạnh tai!"],["Tuyết","Tớ cũng nghe. Là tiếng một đứa trẻ khóc... khóc rất khẽ. Trời ơi."],["Nguyệt","“Thị M...” Tên một cô bé. Mình phải tìm đủ manh mối để biết em là ai. Em ơi, đợi chị."]])}else if(state.used.includes('bell')){if(state.flags.sixthDone)say('Ánh','Nôi đã lặng. Em không còn khóc nữa.');else go('BG21')}else if(!has('bell'))say('Ánh','Chiếc nôi vẫn khẽ đung đưa, như đang chờ một điều gì đó.');else if(state.selectedItem!=='bell')say('Nguyệt','Chiếc nôi lại rung khi tớ đứng gần. Trong túi mình có thứ gì khiến nó phản ứng không?');else if(c.length<3)say('Nguyệt','Chuông chỉ rung yếu ớt rồi lặng đi.');else{consume('bell');go('BG21')}break}
  case 'birth':if(clue('birth')){note('birth','Giấy khai sinh bị xé','Lâm Thị Mơ, sinh 1981, con gái út ông Bá Lâm. Dòng cuối: “mất tích đêm 17/3/1988”, bị gạch khỏi sổ hộ khẩu.');talk([["Nguyệt","Mơ... mới mười tuổi. Mất tích đúng ngày 17 tháng 3. Là 03:17."],["Đông","Con gái út của ông Bá Lâm. Vậy mà tờ khai sinh lại bị xé bỏ."],["Nguyệt","Ông ta đã xóa chính con mình khỏi sổ hộ khẩu. Chuyện này không còn là tham ô nữa. Đây là tội ác."]])}else say('Nguyệt','Tờ khai sinh đã được ghi vào nhật ký.');break;
  case 'girl':state.flags.girlHeard=true;save();say('Mơ','Chị ơi... đừng gọi em bằng tên của cha. Em ngủ ở dưới kia, một mình, cùng giai điệu ấy.');break;
  case 'musicbox':if(gain('musicbox'))talk([["Ánh","Hộp nhạc vẫn chạy được. Tớ đã nghe giai điệu này trong giấc mơ... Nó làm tớ muốn khóc."],["Nguyệt","Giai điệu ấy như một bài ru. Có ai từng hát nó bên chiếc nôi này, hát cho em nghe."]]);else toast(state.used.includes('musicbox')?'Hộp nhạc đã lặng im.':'Hộp nhạc đã nằm trong túi đồ.');break;
  case 'smalldoor':if(state.flags.sixthDone)say('Nguyệt','Cánh cửa nhỏ đã lặng im. Dưới đó không còn ai khóc nữa.');else if(!state.flags.girlHeard)say('Nguyệt','Cánh cửa nhỏ không nhúc nhích, như có ai giữ nó từ phía bên kia.');else if(!has('musicbox'))say('Nguyệt','Cánh cửa vẫn không nhúc nhích. Có lẽ còn thiếu một thứ.');else{playSound('door',.25);go('BG22')}break;
  case 'shirt':if(state.flags.sixthDone)say('Mơ','Em nhớ tên mình rồi.');else if(state.selectedItem==='musicbox')showSixth();else say('Nguyệt','Chiếc áo lạnh buốt. Nó nằm im, không đáp lại.');break;
  case 'lamdoor':showLam();break;
  case 'testimony':if(gain('testimony')){evidence('testimony');note('testimony','Lời khai của bà Mận','Bà Mận viết: đêm 17/3/1988 bà thấy ông Lâm bế cháu Mơ về phía giếng, từ đó không còn nghe tiếng cháu. Bà ở lại gác mái đến hết đời để giữ bằng chứng.');say('Bà Mận','Đêm ấy tôi thấy ông Lâm bế cháu Mơ ra giếng. Tôi không dám lên tiếng. Xin hãy thay tôi nói điều đó.')}else say('Nguyệt',state.used.includes('testimony')?'Chiếc hòm giờ trống. Lời khai đã được đọc lên.':'Lời khai đã nằm trong túi.');break;
  default:toast('Chưa có tương tác ở vị trí này.');
 }
 renderSidebar();save();}
function inspect(k){const texts={
 teaset:["Tuyết","Bộ ấm chén vỡ vụn... mà nước trà vẫn còn ấm. Như thể ai đó vừa ngồi uống rồi bỏ đi giữa chừng. Tớ nổi hết da gà."],
 clock2:["Nguyệt","Kim đồng hồ quay ngược, tới 03:17 thì khựng lại, rồi lại quay. Nó đang đếm lùi về đêm đó..."],
 atticbed:["Nguyệt","Chiếc giường gọn gàng, chăn gấp vuông vắn. Người ở đây đã giữ ngăn nắp đến tận cuối đời."],
 lantern:["Ánh","Đèn bão còn dầu và vẫn cháy. Ai vừa thắp nó... hay nó chưa từng tắt?"],
 village:["Đông","Cổng làng rêu phủ, gạch sờn từng viên. Không biết bao người đã đi qua đây, mang theo bao điều không nói ra."],
 jar:["Nam","Chum nước chỉ có lá rụng và mấy gợn nước nhỏ. ...Nhưng sao mặt nước cứ lăn tăn nhỉ?"],
 canal:["Tuyết","Mương chảy về hướng Tây, đúng phía người làng bảo không nên tới sau lúc trời tối."],
 bridge:["Nam","Ván cầu mục rồi! Bước chậm thôi, từng người một. Ai rơi xuống đừng trách tớ không cảnh báo."],
 cloth:["Nguyệt","Một dải vải đỏ bạc màu buộc vào thân tre. Nhìn giống lời cảnh báo hơn là dấu chỉ đường."],
 tree:["Ánh","Cây gạo già có những vết khắc mờ trên thân... như chữ, như tên người. Rễ nổi lên làm bật cả gạch sân."],
 doorlock:["Đông","Ổ khóa cửa chính hỏng rồi. Cánh cửa gỗ đẩy vào được, nhưng tớ không muốn đẩy."],
 tea:["Tuyết","Bát nước lạnh trên bộ trường kỷ gỗ. Không ai động vào đã lâu... hay có ai đó vừa rời đi?"],
 hearth:["Nam","Bếp củi tắt từ hàng chục năm rồi. Tro nguội, không còn hơi ấm. ...Nhưng tớ vừa ngửi thấy mùi gì đó."],
 family:["Ánh","Những người trong ảnh nghiêm nghị quá, và vài gương mặt bị cào mất. Tớ không muốn nhìn thêm."],
 window:["Tuyết","Qua cửa chớp là cây gạo trong sân. Không thấy nguồn sáng nào bên ngoài. Tối đến mức làm người ta thấy cô đơn."],
 doll:["Ánh","Con búp bê vải nằm bên gối, váy hoa đã mục. Từng có một cô bé ôm nó mỗi đêm, tớ chắc thế."],
 lamp:["Nguyệt","Đèn bàn bằng đồng không còn hoạt động, bóng đèn nứt từ lâu."],
 sacks:["Nam","Bao thóc mục nát, nhưng dấu niêm phong của kho lương thực vẫn còn. Giữ lương thực cứu trợ ở đây... tớ tức quá."],
 belongings:["Nguyệt","Năm cụm đồ nằm sát tường. Không phải vật quý giá, nhưng là dấu vết của những con người thật. Từng người một."]
};const [who,text]=texts[k]||['Người kể chuyện',SCENES[state.scene].look];talk([[who,text],...(MORE[k]||[])])}
function showModal(html,kicker='HỒ SƠ ĐIỀU TRA',type='generic'){$('chatter').classList.remove('on');$('modal-body').closest('.modal-window').classList.toggle('is-book',type==='journal');$('modal-body').innerHTML=html;$('modal-kicker').textContent=kicker;$('modal-backdrop').hidden=false;modalType=type;}
function hideModal(){bookCleanup();$('modal-backdrop').hidden=true;$('modal-body').replaceChildren();modalType=null}
function modalButton(text,fn){const b=document.createElement('button');b.type='button';b.className='modal-option';b.textContent=text;b.addEventListener('click',fn);return b}
function showGuide(){showModal(`<h2>Cách chơi</h2><p>Đây là game khám phá <strong>point-and-click</strong>. Nhấp vào những dấu hình thoi trên ảnh để quan sát, thu thập đồ vật hoặc sang cảnh khác. Di chuột hoặc chạm vào điểm tương tác để xem tên.</p><p><strong>Vật phẩm:</strong> thanh vật phẩm nằm ở đáy màn hình và tự ẩn khi có hội thoại. Nhấp vào một vật phẩm để chọn. Dùng máy ảnh trên gương phòng trẻ, bật đèn pin để soi tầng hầm.</p><p><strong>Nhật ký &amp; Menu:</strong> hai biểu tượng ở góc trên phải. Nhật ký là một cuốn sổ thật: nhấp mép trang hoặc dùng phím mũi tên để lật.</p><p><strong>Mục tiêu:</strong> tìm năm di vật ở sân, bếp, phòng trẻ, phòng làm việc và căn hầm; thu thập sổ sách, trả lại di vật ở phòng thờ rồi tìm đường ra khỏi rừng.</p><p>Phím tắt: <strong>Esc</strong> đóng bảng; <strong>Enter/Space</strong> tiếp lời thoại; <strong>J</strong> nhật ký; <strong>H</strong> gợi ý; <strong>F</strong> đèn pin; <strong>V</strong> đổi chế độ máy ảnh. Tiến trình được lưu tự động khi trình duyệt cho phép.</p><div class="modal-buttons" id="guide-actions"></div>`,'HƯỚNG DẪN','guide');$('guide-actions').appendChild(modalButton('Bắt đầu khám phá',hideModal))}
/* ================= NHẬT KÝ: cuốn sổ có bìa, lật trang ================= */
let book=null;
const BOOK_BUDGET=340,BOOK_MAX_ENTRIES=2;
function bookCleanup(){book=null}
function bookPaginate(notes,per){
 const pages=[];let cur=[],sum=0;
 for(const n of notes){const w=n.title.length+n.body.length+45;if(cur.length&&(sum+w>BOOK_BUDGET||cur.length>=BOOK_MAX_ENTRIES)){pages.push(cur);cur=[];sum=0}cur.push(n);sum+=w}
 if(cur.length)pages.push(cur);
 if(!pages.length)pages.push([]);
 while(per===2&&pages.length%2)pages.push(null);
 return pages}
function bookPageHTML(i){
 if(!book||i<0||i>=book.pages.length)return '<div class="bk-blank"></div>';
 const p=book.pages[i];
 if(p===null)return `<div class="bk-blank"><span class="bk-fleuron">◈</span></div><div class="bk-folio">${i+1}</div>`;
 if(!p.length)return `<div class="bk-empty"><div class="bk-title">Chưa có ghi chép</div><div class="bk-body">Trang giấy vẫn còn trắng. Khi tìm thấy manh mối, Nguyệt sẽ ghi lại ở đây…</div></div><div class="bk-folio">${i+1}</div>`;
 return p.map(e=>`<div class="bk-entry"><div class="bk-no">Mục ${String(e.no).padStart(2,'0')}</div><div class="bk-title">${escapeHTML(e.title)}</div><div class="bk-body">${escapeHTML(e.body)}</div></div>`).join('')+`<div class="bk-folio">${i+1}</div>`}
function bookCount(){
 if(!book)return;const n=book.pages.length,c=book.cur,per=book.per;
 $('bk-count').textContent=per===2?`Trang ${c+1}–${c+2} / ${n}`:`Trang ${c+1} / ${n}`;
 $('bk-prev').disabled=c<=0;$('bk-next').disabled=c+per>=n}
function bookTurn(dir){
 if(!book||book.busy||!$('bk'))return;
 const per=book.per,n=book.pages.length,target=book.cur+dir*per;
 if(target<0||target>=n)return;
 const L=$('bk-left'),R=$('bk-right'),bk=$('bk');
 playSound('page',.3);
 if(per===1){book.cur=target;R.classList.add('swap');setTimeout(()=>{if(!book)return;R.innerHTML=bookPageHTML(target);R.classList.remove('swap');bookCount()},170);return}
 const rm=window.Perf&&Perf.RM;
 if(rm){book.cur=target;L.innerHTML=bookPageHTML(target);R.innerHTML=bookPageHTML(target+1);bookCount();return}
 book.busy=true;
 const leaf=document.createElement('div');leaf.className='bk-leaf '+(dir>0?'next':'prev');
 const front=dir>0?bookPageHTML(book.cur+1):bookPageHTML(book.cur),back=dir>0?bookPageHTML(target):bookPageHTML(target+1);
 leaf.innerHTML=`<div class="bk-face front ${dir>0?'right':'left'}">${front}</div><div class="bk-face back ${dir>0?'left':'right'}">${back}</div>`;
 bk.appendChild(leaf);
 if(dir>0)R.innerHTML=bookPageHTML(target+1);else L.innerHTML=bookPageHTML(target);
 leaf.getBoundingClientRect();requestAnimationFrame(()=>leaf.classList.add('go'));
 setTimeout(()=>{if(!book){leaf.remove();return}
  if(dir>0)L.innerHTML=bookPageHTML(target);else R.innerHTML=bookPageHTML(target+1);
  book.cur=target;leaf.remove();book.busy=false;bookCount()},800)}
function showJournal(){
 const jb=$('btn-journal');if(jb)jb.classList.remove('has-new');
 const per=window.matchMedia('(max-width:700px)').matches?1:2;
 const notes=state.notes.map((n,i)=>({...n,no:i+1}));
 book={per,pages:null,cur:0,busy:false};
 book.pages=bookPaginate(notes,per);
 const n=book.pages.length;
 book.cur=per===2?Math.floor((n-1)/2)*2:n-1;
 showModal(`<div class="bk-scene">
  <button class="bk-close" id="bk-close" type="button" aria-label="Đóng nhật ký">×</button>
  <div class="bk ${per===1?'single':''} closed" id="bk">
   <div class="bk-base"></div>
   <div class="bk-pages"><div class="bk-page left" id="bk-left"></div><div class="bk-page right" id="bk-right"></div></div>
   <div class="bk-ribbon" aria-hidden="true"></div>
   <div class="bk-cover" id="bk-cover" aria-hidden="true"><div class="bk-cover-frame"><span class="bk-cover-sigil">◈</span><div class="bk-cover-title">NHẬT KÝ</div><div class="bk-cover-sub">Nguyệt · Đồng Chay 2026</div></div></div>
  </div>
  <div class="bk-nav"><button class="bk-btn" id="bk-prev" type="button">‹ Trang trước</button><span class="bk-count" id="bk-count"></span><button class="bk-btn" id="bk-next" type="button">Trang sau ›</button></div>
 </div>`,'NHẬT KÝ ĐIỀU TRA','journal');
 $('bk-left').innerHTML=bookPageHTML(book.cur);$('bk-right').innerHTML=bookPageHTML(per===2?book.cur+1:book.cur);
 bookCount();
 $('bk-close').onclick=hideModal;$('bk-prev').onclick=()=>bookTurn(-1);$('bk-next').onclick=()=>bookTurn(1);
 $('bk-left').onclick=()=>bookTurn(-1);$('bk-right').onclick=()=>bookTurn(1);
 playSound('page',.28);
 const bk=$('bk'),rm=window.Perf&&Perf.RM;
 setTimeout(()=>{if(!book)return;bk.classList.remove('closed')},rm?0:380);
 setTimeout(()=>{if(!book)return;bk.classList.add('opened')},rm?0:1700);
 $('bk-next').focus({preventScroll:true})}
function showHint(){let hint='Quan sát các hình thoi màu nhạt. Mỗi cảnh đều có lối đi và đồ vật tương tác.';const n=Number(state.scene.slice(2));if(n<=5)hint='Hãy tới miếu BG05, chạm vào bát hương để lấy nhang trước khi vào rừng.';else if(n<=7&&!has('key')&&!state.flags.gateOpened)hint='Cột mốc đá ở BG07 giấu chìa khóa cổng.';else if(n<=10&&!state.flags.gateOpened)hint='Tìm chìa ở cột mốc BG07, sau đó quay về BG08 nhấp vào xích cổng.';else if(n>=11&&!state.relics.includes('spoon'))hint='Gian bếp BG13 có muôi cơm cũ và thanh sắt dưới bếp.';if(n===11&&!state.flags.clockSeen)hint='Nhấp vào đồng hồ quả lắc ở tường sau. Ghi nhớ thời điểm dừng.';if(n===16&&!state.relics.includes('comb'))hint='Ở BG16 hãy kiểm tra chiếc nôi giữa phòng. Chọn máy ảnh để chụp chiếc gương.';if(n===17&&!state.flags.safeOpened)hint='Hộp sắt có khóa số bốn chữ số. Hãy nhớ lại thời điểm chiếc đồng hồ ở đại sảnh dừng lại.';if(n===19&&!state.flags.wallOpened)hint='Bức tường năm dấu tay không thể phá bằng tay không.';if(n===20)hint='Thu thập đôi dép cũ và mở hộp tài liệu góc phải trong BG20.';if(state.relics.length===5&&!state.flags.ritualDone)hint='Đã đủ năm di vật. Quay về phòng thờ BG12 và đọc lại nhật ký để đặt chúng theo đúng thứ tự.';if(state.flags.ritualDone)hint='Trở ra cổng sắt BG08. Nếu muốn kết thúc tốt nhất, cần đủ tài liệu: sổ bàn làm việc, hộp sắt mật mã và hộp tài liệu dưới hầm.';if(state.flags.sixthDone&&!state.flags.lamDone)hint='Ánh đỏ ở đại sảnh BG11. Lên hành lang tầng hai BG15, chạm nắp gác mái trên trần để lấy lời khai bà Mận. Rồi chạm cánh cửa đỏ và đáp từng lời ông Lâm bằng đúng chứng cứ: sổ cứu trợ, bản thú tội, lời khai.';if(state.flags.awakened&&!state.flags.sixthDone)hint='Tiếng khóc ở phòng trẻ BG16. Kéo xô giếng ở BG09 để lấy chuông, xem ngăn kéo ở BG17 và mảnh vải trong nôi BG16. Đủ 3 manh mối thì chọn chuông rồi chạm nôi. Bên kia gương: lấy hộp nhạc, nói chuyện với bóng bé gái, rồi vào cánh cửa nhỏ.';if(questOn())hint='Cổng sắt vẫn khóa cho tới khi gọi đủ năm cái tên. Quay lại chạm vào giếng đá (BG09), muôi cơm ở bếp (BG13), chiếc nôi (BG16), sổ sách trên bàn (BG17) và đôi dép trong hầm kín (BG20). Đủ năm tên thì chạm bàn thờ ở BG12.';
 showModal(`<h2>Gợi ý hiện tại</h2><p>${escapeHTML(hint)}</p><p class="modal-note">Gợi ý không thay đổi tiến trình hoặc tự giải câu đố.</p><div id="hint-actions" class="modal-buttons"></div>`,'GỢI Ý','hint');$('hint-actions').appendChild(modalButton('Đã hiểu',hideModal))}
function showMenu(){const ob=getObjective(),rc=state.relics.length;
 showModal(`<h2>Tạm dừng</h2>
 <div class="menu-status"><div class="menu-kick">NHIỆM VỤ HIỆN TẠI</div><div class="menu-ob-title">${escapeHTML(ob[0])}</div><div class="menu-ob-text">${escapeHTML(ob[1])}</div><div class="menu-relics"><span>DI VẬT</span><div class="menu-track"><i style="width:${rc/5*100}%"></i></div><b>${rc} / 5</b></div></div>
 <div class="menu-grid" id="menu-actions"></div>
 <p class="modal-note">Tiến trình được tự động lưu. Đặt lại sẽ xóa tiến trình hiện tại.</p>`,'MENU','menu');
 const w=$('menu-actions'),add=(label,fn,opt={})=>{const b=modalButton(label,fn);if(opt.cls)b.classList.add(opt.cls);if(opt.disabled)b.disabled=true;w.appendChild(b)};
 add('Cách chơi',showGuide);add('Gợi ý',showHint);
 add(state.sound?'Âm thanh: BẬT':'Âm thanh: TẮT',()=>{toggleSound();showMenu()});
 add('Bắt đầu lại từ đầu',()=>{hideModal();if(confirm('Bạn có chắc muốn bắt đầu một lần điều tra mới?'))newGame()},{cls:'is-danger'});
 add('Về màn hình chính',()=>{hideModal();stopAmbience();clearDialogue();$('title-screen').hidden=false;updateContinue()})}
function showSafe(){if(state.flags.safeOpened){say('Nguyệt','Trong hộp đã tìm được bản thú tội của người tham gia nghi lễ.');return}showModal(`<h2>Hộp tài liệu của ông Bá Lâm</h2><p>Một khóa số có bốn ô. Dưới đáy hộp khắc mờ: <strong>“Kim đồng hồ không bao giờ đi tiếp.”</strong></p><label class="label-caps" for="safe-input">MẬT MÃ 4 CHỮ SỐ</label><div class="input-row"><input id="safe-input" class="code-input" type="text" maxlength="5" inputmode="numeric" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="0000" aria-label="Nhập mã bốn chữ số"><button class="modal-option" id="safe-submit" type="button">MỞ KHÓA →</button></div><p id="safe-error" class="modal-note">Khóa số bốn ô, đã rỉ sét.</p>`,'CÂU ĐỐ · HỘP SẮT','safe');const input=$('safe-input');const solve=()=>{const value=input.value.replace(/[^0-9]/g,'');if(value==='0317'){state.flags.safeOpened=true;evidence('confession');note('confession','Bản thú tội trong hộp sắt','Tài liệu ghi lại cách ông Bá Lâm che giấu việc giam năm người tố cáo trong tầng hầm và một nghi thức trấn yểm thất bại.');save();hideModal();playSound('switch',.3);say('Nguyệt','Bản thú tội... Chúng ta đã có thêm chứng cứ về vụ án năm 1988.');renderSidebar()}else{$('safe-error').textContent='Mật mã không đúng.';input.select();playSound('switch',.12)}};$('safe-submit').addEventListener('click',solve);input.addEventListener('keydown',e=>{if(e.key==='Enter')solve()});input.focus()}
function showWall(){const count=state.flags.wallImpressions||[];showModal(`<h2>Năm dấu tay trong vữa</h2><p>Lớp gạch mới bịt kín lối đi. Năm dấu tay mờ cho thấy từng có người đập vào đây từ phía bên kia.</p><p>Hãy chạm vào <strong>năm dấu tay</strong> để kiểm tra từng dấu, sau đó dùng thanh sắt cạy tường.</p><div class="modal-buttons" id="handprints"></div><p class="modal-note" id="hands-status">Đã kiểm tra ${count.length}/5 dấu tay.</p><div class="modal-buttons"><button class="modal-option" id="break-wall" type="button" ${count.length===5?'':'disabled'}>DÙNG THANH SẮT PHÁ TƯỜNG →</button></div>`,'CÂU ĐỐ · BỨC TƯỜNG','wall');renderHands()}
function renderHands(){const done=state.flags.wallImpressions||[];const box=$('handprints');box.replaceChildren();for(let i=1;i<=5;i++){const b=modalButton(done.includes(i)?`✓ Dấu tay ${i}`:`✋ Dấu tay ${i}`,()=>{if(!state.flags.wallImpressions)state.flags.wallImpressions=[];if(!state.flags.wallImpressions.includes(i))state.flags.wallImpressions.push(i);save();renderHands()});if(done.includes(i))b.disabled=true;box.appendChild(b)}$('hands-status').textContent=`Đã kiểm tra ${done.length}/5 dấu tay.`;$('break-wall').disabled=done.length<5;$('break-wall').onclick=()=>{state.flags.wallOpened=true;note('wall','Bức tường bị bịt năm 1988','Lớp gạch vừa bị nạy ra, lộ một phòng kín chứa dấu vết của năm nạn nhân.');consume('crowbar');save();hideModal();playSound('slam',.3,3.9);go('BG20')}}
function showAltar(){if(questOn()){showNames();return}if(state.flags.ritualDone){say('Tuyết','Năm bát hương đã được hoàn tất nghi thức tưởng niệm. Lời nguyền đã yếu đi; chúng ta phải đem sự thật ra ngoài.');return}if(!has('incense')){say('Tuyết','Không thể làm nghi thức khi thiếu nhang. Hãy quay về miếu ở BG05.');return}const notFound=RELIC_ORDER.filter(x=>!state.relics.includes(x));if(notFound.length){showModal(`<h2>Năm bát hương lạnh</h2><p>Mỗi bát hương tượng trưng cho một người bị quên tên. Bạn cần tìm đủ <strong>năm di vật</strong> rồi mới tiến hành nghi lễ.</p><p>Đã tìm được: <strong>${state.relics.length}/5</strong>.</p><p class="modal-note">Năm bát hương đang chờ. Hãy tìm kỹ trong căn nhà này.</p>`,'BÀN THỜ GIA TIÊN','altar');return}renderRitual()}
function renderRitual(){const progress=state.ritualProgress.length;showModal(`<h2>Trả lại tên cho người đã khuất</h2><p>Đặt năm di vật lên bát hương <strong>theo đúng thứ tự mà nhật ký đã ghi lại</strong>.</p><p><strong>Bát hương ${Math.min(progress+1,5)} / 5</strong></p><div id="ritual-options" class="ritual-list"></div><p class="ritual-history" id="ritual-progress">${progress?`Đã đặt ${progress} di vật.`:'Chưa đặt di vật nào.'}</p><p class="modal-note">Chọn sai thứ tự sẽ phải bắt đầu lại.</p>`,'CÂU ĐỐ · NGHI LỄ','ritual');const choices=$('ritual-options');RITUAL_SHOW.forEach((id,i)=>{const b=document.createElement('button');b.type='button';b.className='ritual-option';b.disabled=state.ritualProgress.includes(id);b.textContent=(ITEMS[id].emoji||'◆')+'  '+ITEMS[id].name;b.addEventListener('click',()=>placeRelic(id));choices.appendChild(b)})}
function placeRelic(id){const next=RELIC_ORDER[state.ritualProgress.length];if(id!==next){state.ritualProgress.forEach(r=>{state.used=state.used.filter(x=>x!==r);if(!has(r))state.items.push(r)});state.ritualProgress=[];save();toast('Sai thứ tự. Hãy đọc lại nhật ký.');renderSidebar();renderRitual();return}state.ritualProgress.push(id);consume(id,true);save();playSound('lighter',.16);if(state.ritualProgress.length<5){renderRitual();return}consume('incense',true);consume('lighter',true);toast('Nhang đã cháy hết, bật lửa cạn gas.');state.flags.ritualDone=true;state.flags.awakened=true;note('ritual','Trả lại năm di vật','Năm di vật được đặt đúng chỗ. Tuyết đọc lời tưởng niệm, Nguyệt gọi tên bà Mận và bốn người còn lại. Tiếng gõ dưới hầm lặng đi.');save();hideModal();note('awake','Tiếng khóc thứ sáu','Nghi lễ xong, năm tiếng gõ đã lặng. Nhưng một tiếng khóc trẻ con vọng xuống từ phòng trẻ. Còn một cái tên chưa được trả lại.');talk([["Nguyệt","Tiếng gõ đã lặng... Nhưng ai đang khóc trên tầng hai? Là một đứa trẻ."],["Tuyết","Năm hồn đã được trả tên. Còn một người nữa chưa ai gọi tên. Tớ nghe rõ lắm."],["Đông","Phòng trẻ. Mình lên đó, nhưng đi cùng nhau. Không ai ở lại một mình."]]);renderSidebar();}
function showSixth(){showModal(`<h2>Gọi tên em</h2><p>Hộp nhạc ngân lên. Từ chiếc áo trắng nhỏ vang tiếng thì thầm: <strong>“Chị ơi, em tên là gì?”</strong></p><label class="label-caps" for="six-input">HỌ VÀ TÊN ĐẦY ĐỦ CỦA BÉ GÁI</label><div class="input-row"><input id="six-input" class="code-input" type="text" maxlength="30" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Họ và tên" style="font-size:17px;letter-spacing:.04em;width:240px;max-width:60%"><button class="modal-option" id="six-submit" type="button">GỌI TÊN →</button></div><p id="six-error" class="modal-note">Gợi ý: hãy đọc lại những gì đã ghi trong nhật ký.</p>`,'CÂU ĐỐ · CÁI TÊN THỨ SÁU','six');const input=$('six-input');const solve=()=>{const v=input.value.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d');if(/^(lam thi )?mo$/.test(v)){state.flags.sixthDone=true;state.flags.lamAwake=true;note('sixth','Cái tên thứ sáu','Lâm Thị Mơ, mười tuổi, con gái út ông Bá Lâm. Em lén mang cơm cho năm người bị nhốt rồi bị giấu đi và xóa khỏi sổ. Tên em cuối cùng đã được gọi.');consume('musicbox');save();hideModal();go('BG12');talk([["Mơ","Cảm ơn chị đã gọi tên em... Nhưng cha em đang đợi ở đại sảnh. Ông ấy không để ai mang sự thật ra khỏi nhà."],["Mơ","Chị đừng sợ. Bà vẫn luôn ở trong ngôi nhà này, chưa bao giờ rời đi."],["Nguyệt","Chị hứa. Em cứ yên tâm. Lần này sẽ có người nhớ em."]]);renderSidebar()}else{$('six-error').textContent='Giọng thì thầm lặng đi. Đó chưa phải tên em.';input.select()}};$('six-submit').addEventListener('click',solve);input.addEventListener('keydown',e=>{if(e.key==='Enter')solve()});input.focus()}
function showLam(){if(state.flags.lamDone){go('BG10');return}
 const R=[['“Sổ sách chẳng nói lên điều gì. Gạo cứu trợ vốn là của nhà này.”',['ledger','archive']],['“Năm đứa tố cáo ấy tự biến mất. Ai bắt tôi chịu tội?”',['confession']],['“Con bé Mơ tự trèo xuống giếng. Ai thấy tận mắt?”',['testimony']]];
 const NAMES={ledger:'Sổ cứu trợ năm 1988',archive:'Hộp hồ sơ dưới hầm',confession:'Bản thú tội trong hộp sắt',testimony:'Lời khai của bà Mận'};
 let r=state.flags.lamRound||0;
 showModal(`<h2>Ông Bá Lâm</h2><p><strong>Vòng ${r+1} / 3</strong></p><p class="ending-text">${escapeHTML(R[r][0])}</p><p class="modal-note">Chọn chứng cứ để đáp lại.</p><div id="lam-options" class="ritual-list"></div>`,'ĐỐI CHẤT · BÓNG ÔNG LÂM','lam');
 for(const id of Object.keys(NAMES)){const own=state.evidence.includes(id),b=document.createElement('button');b.type='button';b.className='ritual-option';b.disabled=!own;b.textContent=NAMES[id]+(own?'':'  — chưa có');b.addEventListener('click',()=>{if(R[r][1].includes(id)){r++;state.flags.lamRound=r;save();if(r>=3){state.flags.lamDone=true;state.flags.lamRound=0;note('lam','Bóng ông Bá Lâm tan biến','Ba lời chối của ông Lâm đều bị chứng cứ bẻ gãy. Ánh đỏ dưới cánh cửa lịm tắt, tiếng giày nặng nề trong đại sảnh lùi xa dần.');save();hideModal();consume('testimony');talk([["Ông Bá Lâm","Tôi chỉ muốn giữ lấy cái nhà này... Giữ lấy cái tên của tôi..."],["Nguyệt","Tên của ông đã bị chính ông làm bẩn. Còn những người bị xóa mới cần được nhớ."],["Đông","Ánh đỏ tắt rồi. Cửa chính mở được. ...Cảm ơn mọi người, đã không bỏ nhau."],["Mơ","Cha em đi rồi. Em cũng thấy nhẹ lắm. Nhưng chị đừng vội ra, cổng sắt vẫn khóa."],["Mơ","Năm người dưới hầm đã được trả di vật, mà chưa ai gọi tên họ thành lời. Chưa có tên, họ chưa đi được."],["Nguyệt","Tên của họ... mình chưa hề biết. Làm sao tìm được?"],["Mơ","Họ vẫn nằm ở những nơi từng sống: giếng, bếp, phòng em, bàn của cha, và dưới hầm. Chị cứ tới đó, họ sẽ nói."],["Nam","Lại một vòng nữa. ...Thôi, lần này chạy bằng đôi chân của mình, không phải chạy trốn."]]);renderSidebar()}else{showLam()}}else{state.flags.lamRound=0;save();hideModal();playSound('slam',.5,3.7);if(window.HorrorFX)window.HorrorFX.scare(true);say('Ông Bá Lâm','Vô ích. Các người chẳng có gì cả. Làm lại từ đầu đi.')}});$('lam-options').appendChild(b)}}
function showEscapeChoice(){const hasProof=['ledger','confession','archive'].every(id=>state.evidence.includes(id));const ritual=state.flags.ritualDone;showModal(`<h2>Trước cánh cổng sắt</h2><p>${ritual?'Cổng đã mở và tiếng gọi trong nhà đang yếu dần. Bóng tối vẫn chờ phía sau.':'Cổng dẫn về rừng, nhưng năm giọng nói vẫn vang vọng trong biệt thự. Chưa có gì được hóa giải.'}</p><p>${hasProof?'<strong>Đã thu thập đủ hồ sơ, bản thú tội và hộp chứng cứ.</strong>':'Chưa đủ chứng cứ để làm sáng tỏ hoàn toàn vụ án năm 1988.'}</p><div id="escape-options" class="modal-buttons"></div>`,'LỰA CHỌN CUỐI','escape');const box=$('escape-options');if(!ritual){box.appendChild(modalButton('Bỏ lại tất cả và tháo chạy',()=>showEnding('bad')));box.appendChild(modalButton('Tiếp tục điều tra',hideModal));}else{box.appendChild(modalButton('Đưa tất cả chứng cứ ra ngoài',()=>showEnding(hasProof&&state.flags.sixthDone&&state.flags.namesDone?'true':'normal')));box.appendChild(modalButton('Rời đi, để lại chứng cứ',()=>showEnding('normal')));box.appendChild(modalButton('Quay lại biệt thự',hideModal));}}
const ENDINGS={
 bad:{title:'Oán hồn chưa tan',label:'KẾT THÚC 1 · BAD ENDING',text:'Năm sinh viên bỏ chạy khỏi biệt thự trước khi tìm đủ di vật và giải lời nguyền.\n\nĐường rừng tối bỗng kéo dài vô tận. Tiếng của những người thân quen lần lượt gọi tên họ.\n\nSáng hôm sau, người làng chỉ tìm thấy dấu chân dừng trước cánh cổng sắt. Trong đại sảnh xuất hiện thêm một bức ảnh mới: năm sinh viên đang nhìn thẳng vào ống kính.'},
 normal:{title:'Sự thật bị chôn vùi',label:'KẾT THÚC 2 · NORMAL ENDING',text:'Nhóm sinh viên thoát khỏi căn biệt thự trước lúc trời sáng. Năm di vật đã về đúng chỗ; tiếng gọi yếu dần.\n\nNhưng chứng cứ vụ án không đầy đủ, và bí mật của ông Bá Lâm một lần nữa chìm vào im lặng.\n\nMột tuần sau, khi xem lại đoạn phim cũ, Đông thấy phía sau năm người có một bóng đen đang mỉm cười.'},
 true:{title:'Trả lại tên người chết',label:'KẾT THÚC 3 · TRUE ENDING',text:'Bóng ông Bá Lâm tan đi khi lời khai của bà Mận được đọc lên. Năm di vật được trả về. Nhật ký, bản thú tội và những tài liệu cứu trợ được mang ra khỏi hầm. Nguyệt đọc to năm cái tên đã được trả lại: Lê Văn Hải, Trần Thị Sen, Phạm Thị Lụa, Nguyễn Văn Tâm, Đỗ Văn Khoa.\n\nCả nhóm ra khỏi khu rừng lúc trời vừa sáng, mang bằng chứng giao cho cơ quan chức năng. Vụ mất tích năm 1988 được mở lại trong thế giới câu chuyện.\n\nBiệt thự Vân Hòa cuối cùng không còn là nơi giam giữ những lời kêu cứu. Nguyệt thêm vào danh sách một cái tên thứ sáu: Lâm Thị Mơ. Trong bản ghi âm lúc 03:17, giờ chỉ còn tiếng một đứa trẻ hát ru, rồi lặng đi.' }
};
function showEnding(which){const e=ENDINGS[which];state.flags.ending=which;if(!state.endingsSeen.includes(which))state.endingsSeen.push(which);save();stopAmbience();showModal(`<div class="ending-number">${e.label}</div><h2>${e.title}</h2><p class="ending-text">${e.text.split('\n\n').map(escapeHTML).join('<br><br>')}</p><p class="modal-note">Đã mở ${state.endingsSeen.length}/3 kết thúc trong lần chơi này.</p><div id="ending-actions" class="modal-buttons"></div>`,'HỒI KẾT','ending');const box=$('ending-actions');box.appendChild(modalButton('Quay lại cổng để thử kết thúc khác',()=>{state.flags.ending=null;hideModal();render();save()}));box.appendChild(modalButton('Chơi lại từ đầu',()=>newGame()));box.appendChild(modalButton('Về màn hình chính',()=>{hideModal();$('title-screen').hidden=false;updateContinue()}))}
function escapeHTML(t){return String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function toggleSound(){state.sound=!state.sound;if(!state.sound)stopAmbience();else setAmbience();$('btn-audio').textContent=state.sound?'♪':'♪̸';$('btn-audio').setAttribute('aria-pressed',state.sound?'true':'false');save()}
function updateContinue(){const existing=load();$('btn-continue').hidden=!existing;}
function newGame(){state=initialState();geckoClock=GECKO_FIRST;chatScene=null;stopAmbience();hideModal();clearDialogue();$('title-screen').hidden=true;render();talk(introOf('BG01'));save()}
function continueGame(){state=load()||initialState();geckoClock=GECKO_FIRST;chatScene=null;$('title-screen').hidden=true;hideModal();clearDialogue();render();if(state.flags.ending){state.flags.ending=null;save()}talk([["Người kể chuyện","Hành trình tiếp tục. Những trang nhật ký vẫn còn lưu các manh mối bạn đã tìm thấy."],["Nguyệt","Tớ đã ghi lại hết rồi. Mình đi tiếp thôi, nhưng đừng ai tách nhóm."]]);}
function mount(){$('btn-new-game').onclick=newGame;$('btn-continue').onclick=continueGame;$('btn-audio').onclick=toggleSound;$('btn-menu').onclick=showMenu;$('btn-journal').onclick=showJournal;$('modal-close').onclick=hideModal;$('dialogue-next').onclick=nextLine;
 $('modal-backdrop').addEventListener('click',e=>{if(e.target===$('modal-backdrop')&&modalType!=='ending')hideModal()});
 let torchRaf=0,torchEv=null;$('scene-stage').addEventListener('pointermove',e=>{torchEv=e;if(torchRaf)return;torchRaf=requestAnimationFrame(()=>{torchRaf=0;if(!$('scene-stage').classList.contains('torch-on'))return;const box=$('scene-stage').getBoundingClientRect();const x=Math.max(0,Math.min(100,(torchEv.clientX-box.left)/box.width*100));const y=Math.max(0,Math.min(100,(torchEv.clientY-box.top)/box.height*100));$('scene-stage').style.setProperty('--torch-x',x.toFixed(1)+'%');$('scene-stage').style.setProperty('--torch-y',y.toFixed(1)+'%')})});
 $('scene-stage').addEventListener('click',e=>{if(e.target===$('scene-stage')||e.target===$('hotspots')){if(!dialogueOpen)toast(SCENES[state.scene].look)}});
 document.addEventListener('keydown',e=>{if($('title-screen').hidden===false)return;if(e.key==='Escape'){if(modalType&&modalType!=='ending')hideModal();else clearDialogue();return}if(modalType==='journal'){if(e.key==='ArrowRight')bookTurn(1);else if(e.key==='ArrowLeft')bookTurn(-1);return}if(modalType||['INPUT','TEXTAREA'].includes(document.activeElement.tagName))return;if(dialogueOpen&&(e.key==='Enter'||e.key===' ')){e.preventDefault();nextLine();return}const k=e.key.toLowerCase();if(k==='h')showHint();if(k==='f'&&has('flashlight'))selectItem('flashlight');if(k==='v')cycleCam();if(k==='j')showJournal()});
 updateContinue();render();setInterval(geckoTick,1000);}
mount();
})();
