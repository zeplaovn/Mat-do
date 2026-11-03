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
const HR = (req,...a) => ({...H(...a),req});

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
  crowbar:{name:'Thanh sắt cạy gạch',image:'06_Thanh_Sat_128x128.webp',description:'Thanh sắt cong nhặt trong gian bếp.',emoji:'🛠'},
  scarf:{name:'Khăn vải cũ',image:'07_Khan_Vai_128x128.webp',description:'Di vật 1/5. Nhặt được ở chiếc giếng trong sân.',emoji:'🧣',relic:true},
  spoon:{name:'Muôi cơm rỉ',image:'08_Muoi_Com_128x128.webp',description:'Di vật 2/5. Dấu vết một người làm công trong gian bếp.',emoji:'🥄',relic:true},
  comb:{name:'Trâm gỗ gãy',image:'09_Tram_Go_128x128.webp',description:'Di vật 3/5. Tìm thấy gần chiếc nôi trẻ.',emoji:'🪮',relic:true},
  petition:{name:'Mảnh đơn tố cáo',image:'10_Manh_Don_128x128.webp',description:'Di vật 4/5. Mảnh giấy giấu trong sổ của ông Bá Lâm.',emoji:'📜',relic:true},
  sandals:{name:'Đôi dép vải cũ',image:'11_Dep_Vai_128x128.webp',description:'Di vật 5/5. Vật dụng bị bỏ lại trong căn hầm kín.',emoji:'🩴',relic:true},
  bell:{name:'Chuông đồng nhỏ',image:'12_Chuong_Dong_128x128.webp',description:'Chuông đồng nhỏ buộc dây đỏ, vớt từ xô giếng.',emoji:'🔔'},
  musicbox:{name:'Hộp nhạc gãy',image:'13_Hop_Nhac_128x128.webp',description:'Hộp nhạc cũ của một bé gái. Giai điệu vẫn còn ngân.',emoji:'🎵'},
  storekey:{name:'Chìa khóa kho vật tư',image:'14_Chia_Kho_128x128.webp',description:'Chiếc chìa đồng nhỏ giấu dưới đệm ghế bập bênh ở ban công phòng ông Bá Lâm.',emoji:'🗝'},
  incense5:{name:'Năm nén nhang mới',image:'15_Nam_Nen_Nhang_128x128.webp',description:'Năm nén nhang lấy từ bàn đá trong miếu cây đa. Bà Mận để dành cho năm người chưa có tên.',emoji:'🕯'},
  toyDoll:{name:'Búp bê vải của Mơ',description:'Con búp bê khâu tay, mắt thêu chỉ đen, nhặt ở gác nhỏ của cô Lụa.',emoji:'🪆'},
  toyCart:{name:'Xe gỗ đồ chơi',description:'Chiếc xe gỗ bánh nhỏ xíu của Mơ.',emoji:'🛒'},
  paperCrane:{name:'Hạc giấy',description:'Con hạc gấp từ trang sách cũ, lấy từ sợi chỉ treo ở phòng học.',emoji:'🕊'},
  chalkStub:{name:'Viên phấn trắng',description:'Mẩu phấn còn lại trên bảng đen của phòng học.',emoji:'✏'},
  legendDoc:{name:'Bảng ký hiệu của năm người',description:'Tài liệu. Chạm để đọc. Mỗi người có một ký hiệu riêng.',emoji:'📋'},
  backDoc:{name:'Mặt sau tấm ảnh',description:'Tài liệu. Chạm để đọc. Dòng chữ viết tay ở mặt sau.',emoji:'📋'},
  fragA:{name:'Mảnh đơn 1/3',description:'Mảnh giấy rách giấu trong ngăn kín dưới đồng hồ quả lắc. Một đoạn chữ viết tay vội vã.',emoji:'📜'},
  fragB:{name:'Mảnh đơn 2/3',description:'Mảnh giấy rách dán sau khung ảnh gia đình, được giấu bằng mật mã chữ cái.',emoji:'📜'},
  fragC:{name:'Mảnh đơn 3/3',description:'Mảnh giấy rách kẹp trong sổ vật tư trên bàn ông Bá Lâm.',emoji:'📜'},
  testimony:{name:'Lời khai của bà Mận',image:'16_Loi_Khai_128x128.webp',description:'Tờ giấy bà Mận viết trước khi mất, giấu trong hòm tre trên gác mái.',emoji:'📝'}
};
const USE_ON={camera:['mirror'],bell:['cradle'],musicbox:['shirt'],crowbar:['sealedWall'],key:['gate'],storekey:['storeDoor'],incense5:['graves']};
const RELIC_ORDER = ['scarf','spoon','comb','petition','sandals'];
const RITUAL_SHOW = ['petition','scarf','sandals','spoon','comb']; /* thứ tự hiển thị khác thứ tự đúng, để câu đố không lộ đáp án */
const SCENES = {
 BG01:{name:'Cổng làng Đồng Chay',time:'07:30',chapter:'CHƯƠNG 1 · ĐỒNG CHAY',mood:'BUỔI SÁNG · ĐỒNG CHAY',caption:'Khởi đầu của một chuyến đi tưởng như bình thường.',intro:['Người kể chuyện','Thôn Đồng Chay, vùng chân núi Ba Vì. Năm sinh viên tới đây để ghi lại những truyền thuyết dân gian.'],look:'Những vết rêu bám trên cổng làng. Không có gì báo trước màn đêm sắp tới.',spots:[H('warning','Bà bán nước',15,53,14,22),H('travel:BG02','Đi vào ngõ làng',33,34,15,28),H('inspect:village','Nhìn cổng làng',28,10,26,20),H('travel:BG45','Đường sang chùa làng',62,70,22,28)]},
 BG02:{name:'Ngõ làng',time:'08:00',chapter:'CHƯƠNG 1 · ĐỒNG CHAY',mood:'BUỔI SÁNG · NGÕ LÀNG',caption:'Lối đi vẫn còn dấu bánh xe và hơi ẩm từ đêm trước.',intro:['Đông','Chúng ta đi qua ruộng, rồi tìm cây đa cạnh miếu. Người làng bảo con đường ấy dẫn tới rừng.'],look:'Những ngôi nhà mái ngói cũ nằm im sau hàng rào tre.',spots:[H('inspect:jar','Chum nước ven đường',77,50,9,12),H('travel:BG03','Ra phía cánh đồng',47,29,17,38),H('travel:BG01','Trở về cổng làng',6,76,22,20)]},
 BG03:{name:'Con đường giữa cánh đồng',time:'09:00',chapter:'CHƯƠNG 1 · ĐỒNG CHAY',mood:'BAN NGÀY · CÁNH ĐỒNG',caption:'Con đường đất đỏ kéo dài về phía cây cầu gỗ.',intro:['Tuyết','Đường này ít người đi. Bà tớ từng kể rằng qua cây cầu kia là lối vào rừng thiêng.'],look:'Lúa và cỏ ướt rì rào. Một con mương nhỏ chạy song song với đường.',spots:[H('travel:BG04','Bước đến cầu gỗ',45,34,20,30),H('inspect:canal','Quan sát mương',67,65,18,18),H('travel:BG02','Quay lại ngõ làng',7,80,25,17)]},
 BG04:{name:'Cầu gỗ qua mương',time:'17:30',chapter:'CHƯƠNG 1 · ĐỒNG CHAY',mood:'CHIỀU MUỘN · BỜ MƯƠNG',caption:'Cầu ọp ẹp trong gió. Trời sẫm dần khi cả nhóm quay lại.',intro:['Nam','Trời tối nhanh quá. Nếu quyết vào rừng thì giờ là lúc phải đi thôi.'],look:'Một tấm ván cầu lệch khỏi hàng, lộ mặt nước tối bên dưới.',spots:[H('inspect:bridge','Ván cầu mục',22,46,28,20),H('travel:BG05','Đi đến cây đa và miếu',67,30,19,33),H('travel:BG03','Quay lại đường ruộng',6,77,23,19)]},
 BG05:{name:'Cây đa và miếu cổ',time:'20:40',chapter:'CHƯƠNG 1 · LỐI VÀO RỪNG',mood:'ĐÊM · VEN RỪNG',caption:'Hương tàn đã lạnh. Đêm phủ xuống những rễ cây đa.',intro:['Nguyệt','Miếu này không có người trông coi... Có thứ gì đó đã bị bỏ quên ở đây.'],look:'Không thấy ánh sáng nào phía rừng. Hương cũ và gió luồn qua rễ đa.',spots:[H('shrine','Bát hương trong miếu',31,33,14,26),H('travel:BG06','Bước vào rừng tre',60,38,24,38),H('travel:BG46','Bàn lễ trước miếu',47,76,20,18),H('travel:BG04','Quay về cầu',4,79,28,19)]},
 BG06:{name:'Lối mòn xuyên rừng tre',time:'20:50',chapter:'CHƯƠNG 2 · RỪNG THIÊNG',mood:'RỪNG TRE · 20:50',caption:'Tiếng lá tre va nhau. Con đường đất uốn như một vệt tối.',intro:['Ánh','Tớ vừa nghe thấy ai gọi tên Nam. Nhưng từ nãy giờ chẳng có ai phía sau.'],look:'Bóng tre đổ dày đặc. Chỉ có bùn ướt bắt ánh trăng yếu.',spots:[H('inspect:cloth','Dải vải đỏ buộc trên tre',78.5,43,8,15),H('travel:BG07','Đi sâu vào rừng',44,32,19,35),H('travel:BG05','Trở lại miếu',6,78,30,20)]},
 BG07:{name:'Rừng sâu',time:'21:05',chapter:'CHƯƠNG 2 · RỪNG THIÊNG',mood:'RỪNG SÂU · 21:05',caption:'Qua kẽ lá, một mảnh mái ngói cũ thoáng hiện.',intro:['Đông','Có nhà thật. Nhưng cổng ở đâu? Mình chưa thấy lối nào dẫn tới đó.'],look:'Giữa những tán cây chỉ có một mảng mái ngói tối, không hề thấy đèn.',spots:[H('marker','Cột mốc đá cũ',77,43,10,26),H('travel:BG08','Đi về phía mái biệt thự',56,45,20,34),H('travel:BG06','Quay về rừng tre',7,79,24,20)]},
 BG08:{name:'Cổng biệt thự Vân Hòa',time:'21:20',chapter:'CHƯƠNG 2 · BIỆT THỰ',mood:'BIỆT THỰ · 21:20',caption:'Cổng sắt buộc xích. Sau song sắt là ngôi nhà bỏ hoang.',intro:['Nguyệt','Biệt thự Vân Hòa... Bà ngoại tớ chưa bao giờ muốn nhắc tới nơi này.'],look:'Ổ khóa rỉ sét còn nguyên. Mọi ô cửa tối đen như những hốc mắt.',spots:[H('gate','Xích và khóa cổng',43,53,15,28),H('exitForest','Rời khu rừng',5,76,26,22),H('travel:BG07','Quay về lối rừng',81,78,17,19)]},
 BG09:{name:'Sân biệt thự Vân Hòa',time:'21:30',chapter:'CHƯƠNG 2 · BIỆT THỰ',mood:'SÂN NHÀ · 21:30',caption:'Cây gạo ở bên trái. Chiếc giếng đá nằm trong bóng tối bên phải.',intro:['Nam','Cổng vừa khép sau lưng. Tớ không thích cái tiếng khóa sắt đó chút nào.'],look:'Nước mưa đọng trong kẽ gạch. Cây gạo già ngả bóng lên tường vữa.',spots:[H('well','Chiếc giếng đá',77,53,20,30),H('travel:BG10','Bước lên hiên nhà',42,34,19,33),H('travel:BG08','Trở lại cổng',2,80,23,17),H('inspect:tree','Gốc cây gạo',5,36,22,33),HR('flashDone','travel:BG42','Phía sau miệng giếng',58,60,17,20)]},
 BG10:{name:'Hiên nhà và cửa chính',time:'21:40',chapter:'CHƯƠNG 2 · BIỆT THỰ',mood:'HIÊN NHÀ · 21:40',caption:'Cửa đôi bằng gỗ cũ. Không có ánh sáng từ phía sau.',intro:['Đông','Cánh cửa này chưa khóa hẳn. Đi cùng nhau, đừng ai tự tách nhóm.'],look:'Ổ khóa đồng mờ xỉn, vữa vàng rơi từng mảng khỏi chân cột.',spots:[H('frontDoor','Cửa gỗ chính',39,17,23,50),H('inspect:doorlock','Ổ khóa đồng',52,47,10,15),H('travel:BG09','Lùi ra sân',35,81,29,17),HR('lamDone','travel:BG44','Chỗ cắm trại trên hiên',74,58,22,26)]},
 BG11:{name:'Đại sảnh tầng một',time:'22:00',chapter:'CHƯƠNG 3 · CĂN NHÀ IM LẶNG',mood:'ĐẠI SẢNH · 22:00',caption:'Bàn trà phủ bụi. Đồng hồ quả lắc đứng im trên tường.',intro:['Nguyệt','Đồng hồ dừng ở một giờ rất lạ. Tớ sẽ ghi vào sổ.'],look:'Bụi phủ kín lớp gạch bông. Những khuôn mặt trong ảnh gia đình đã bạc màu.',spots:[H('clock','Đồng hồ quả lắc',46,22,13,27),H('photo','Ảnh gia đình',60,28,14,20),H('inspect:tea','Bàn trà cũ',36,56,28,25),H('travel:BG12','Lối vào phòng thờ',14,30,22,32),H('travel:BG14','Cầu thang gỗ',75,24,21,47),H('travel:BG10','Trở ra hiên',4,80,24,18)]},
 BG12:{name:'Phòng thờ gia tiên',time:'22:20',chapter:'CHƯƠNG 3 · CĂN NHÀ IM LẶNG',mood:'PHÒNG THỜ · 22:20',caption:'Năm bát hương lạnh trên bàn thờ. Có lối thông qua bếp.',intro:['Tuyết','Năm bát hương... Không nên chạm vào trước khi biết chúng tượng trưng cho ai.'],look:'Không có khói nhang. Năm bát xếp thành một hàng kỳ lạ.',spots:[H('altar','Năm bát hương',34,34,35,27),H('travel:BG13','Lối sang bếp',78,33,18,34),H('travel:BG11','Quay lại đại sảnh',3,81,26,16),HR('riceOn','riceBowl','Bát cơm còn nóng',42,57,13,9)]},
 BG13:{name:'Gian bếp cũ',time:'22:35',chapter:'CHƯƠNG 3 · CĂN NHÀ IM LẶNG',mood:'GIAN BẾP · 22:35',caption:'Tro lạnh trong bếp. Mùi ẩm mốc bám ở những chiếc chum cũ.',intro:['Nam','Phía sau bên phải có một cánh cửa dẫn xuống hầm. Bếp này bị bỏ lại giữa chừng.'],look:'Bếp củi đã tắt từ lâu. Mọi vật dụng vẫn như bị bỏ lại giữa chừng.',spots:[H('spoon','Muôi cơm cũ',40,50,14,20),H('crowbar','Thanh sắt dưới bếp',15,62,20,20),H('inspect:hearth','Bếp củi nguội',17,39,25,21),H('travel:BG18','Cửa xuống tầng hầm',76,28,18,42),H('travel:BG12','Trở về phòng thờ',2,69,11,30),HR('lamDone','travel:BG25','Cửa sau ra sân sau',0,10,9,52),HR('riceSeen','footTrail','Dấu chân nhỏ trên sàn',42,72,26,16)]},
 BG14:{name:'Cầu thang gỗ lên tầng hai',time:'22:45',chapter:'CHƯƠNG 3 · CĂN NHÀ IM LẶNG',mood:'CẦU THANG · 22:45',caption:'Ván gỗ rạn nứt. Cửa chớp cao tít ở chiếu nghỉ.',intro:['Ánh','Tớ sẽ chụp vài tấm trước khi lên. Đừng đứng quá xa nhau.'],look:'Bóng tay vịn đổ xiên lên ảnh chân dung cũ treo dọc tường.',spots:[H('travel:BG15','Đi lên tầng hai',44,18,22,38),H('inspect:family','Ảnh gia đình trên tường',67,21,15,28),H('travel:BG11','Trở về đại sảnh',3,81,23,17)]},
 BG15:{name:'Hành lang tầng hai',time:'23:00',chapter:'CHƯƠNG 3 · CĂN NHÀ IM LẶNG',mood:'HÀNH LANG · 23:00',caption:'Một cửa sáng màu bên trái, cửa gỗ sẫm bên phải.',intro:['Ánh','Phòng trẻ bên trái, phòng làm việc bên phải... Tớ thấy chiếc gương ở cuối lối đi này rất kỳ lạ.'],look:'Ánh trăng lạnh vạch một đường ngang sàn. Bóng cây lọt qua cửa chớp cuối hành lang.',spots:[H('travel:BG16','Phòng ngủ trẻ em',8,22,26,54),H('travel:BG17','Phòng làm việc',71,20,26,58),H('inspect:window','Cửa sổ cuối hành lang',43,21,15,37),HL('travel:BG24','Nắp gác mái trên trần',60,3,16,16),H('travel:BG14','Trở lại cầu thang',38,78,23,20),HR('lamDone','travel:BG27','Cửa phòng ngủ ông Bá Lâm',30,22,9,45)]},
 BG16:{name:'Phòng ngủ trẻ em',time:'23:15',chapter:'CHƯƠNG 4 · DI VẬT',mood:'PHÒNG TRẺ · 23:15',caption:'Một con búp bê vải nằm bên gối, chiếc nôi trống giữa phòng.',intro:['Ánh','Tớ thấy một bé gái trong ảnh chụp... Nhưng trong phòng chẳng có ai cả.'],look:'Muỗi mùng rách thành từng dải. Chiếc gương vẫn phản chiếu căn phòng trống.',spots:[H('comb','Chiếc trâm trong nôi',41,67,18,16),H('mirror','Gương mờ cũ',83,15,15,42),H('inspect:doll','Búp bê trên gối',14,44,22,20),HA('cradle','Mảnh vải trong nôi',40,55,20,12),H('travel:BG15','Trở về hành lang',1,73,14,25),HR('lamDone','travel:BG28','Cánh cửa nhỏ sau tủ quần áo',68,8,14,58)]},
 BG17:{name:'Phòng làm việc ông Bá Lâm',time:'23:30',chapter:'CHƯƠNG 4 · DI VẬT',mood:'PHÒNG LÀM VIỆC · 23:30',caption:'Cuốn sổ thu chi và chiếc hộp sắt bị bỏ lại trên bàn.',intro:['Nguyệt','Phòng làm việc của ông Bá Lâm. Mọi thứ vẫn nằm đúng chỗ ông ấy để lại.'],look:'Trên mặt bàn có những vệt nước khô. Ngăn kéo và tủ kính chưa ai chạm tới.',spots:[H('ledger','Sổ sách trên bàn',34,43,24,19),H('safe','Hộp sắt góc phải',77,69,21,22),H('inspect:lamp','Đèn bàn đã tắt',58,33,17,20),HA('birth','Ngăn kéo khóa trái',52,62,18,16),H('travel:BG15','Trở về hành lang',2,78,18,21)]},
 BG18:{name:'Cầu thang đá xuống tầng hầm',time:'00:15',chapter:'CHƯƠNG 5 · BỨC TƯỜNG',mood:'TẦNG HẦM · 00:15',caption:'Bậc đá trơn tuột xuống sâu. Dưới đó không có lấy một ô cửa sổ.',intro:['Nam','Xuống đây nhớ dùng đèn pin. Tớ nghe như có người gõ từ cuối hành lang.'],look:'Hơi ẩm bốc lên dọc những viên gạch mục. Bóng tối đặc quánh ở cuối cầu thang.',spots:[H('travel:BG19','Xuống hành lang tầng hầm',48,45,40,46),H('travel:BG13','Quay lên gian bếp',2,8,26,30)]},
 BG19:{name:'Hành lang tầng hầm',time:'02:00',chapter:'CHƯƠNG 5 · BỨC TƯỜNG',mood:'TẦNG HẦM · 02:00',caption:'Năm dấu tay chìm trong vữa của bức tường bị xây bịt.',intro:['Tuyết','Nhìn kìa... Năm dấu tay trên vữa. Có người đã bị nhốt phía sau bức tường.'],look:'Nước chảy sát mép những bao vữa khô cứng. Vữa mới hơn hẳn dãy gạch bên cạnh.',spots:[H('sealedWall','Bức tường với năm dấu tay',39,29,26,31),H('inspect:sacks','Bao vữa khô cứng',2,33,26,49),H('travel:BG18','Quay về cầu thang đá',1,82,28,17)]},
 BG20:{name:'Căn phòng bị bịt kín',time:'03:17',chapter:'CHƯƠNG 6 · TRẢ LẠI TÊN',mood:'CĂN PHÒNG KÍN · 03:17',caption:'Sau bức tường: những món đồ vô chủ và lời thú tội bị chôn vùi.',intro:['Nguyệt','Bà Mận... Con sẽ mang tên của mọi người ra khỏi nơi này.'],look:'Nước đọng giữa lớp bùn gạch. Không có thứ gì chuyển động, chỉ có dấu vết của một bi kịch.',spots:[H('sandals','Đôi dép bỏ lại',48.5,45,12,11),H('archive','Hộp sắt chôn dưới gạch',73,67,24,25),H('inspect:belongings','Đồ dùng của năm người',31,36,17,17),H('travel:BG19','Quay ra lỗ tường vỡ',0,35,13,47)]},
 BG21:{name:'Phòng trẻ bên kia gương',time:'03:17',chapter:'CHƯƠNG 7 · CÁI TÊN THỨ SÁU',mood:'BÊN KIA GƯƠNG · 03:17',caption:'Mọi thứ bị lật ngược. Một giai điệu ru vọng từ đâu đó.',intro:['Ánh','Phòng này giống hệt, nhưng mọi thứ bị lật ngược. Tớ nghe tiếng ai đang hát khe khẽ.'],look:'Chữ trên tường viết ngược. Bóng của cả nhóm không đi theo ánh đèn.',spots:[H('musicbox','Hộp nhạc đang phát sáng',46,67,12,16),H('girl','Dòng chữ phấn trên tường',20,27,14,26),H('smalldoor','Cánh cửa nhỏ sau tấm mùng',58,20,13,42),H('travel:BG16','Trở về qua tấm gương',3,3,17,62)]},
 BG22:{name:'Đáy giếng cạn',time:'03:17',chapter:'CHƯƠNG 7 · CÁI TÊN THỨ SÁU',mood:'ĐÁY GIẾNG · 03:17',caption:'Nước đã cạn. Chỉ còn bùn lạnh và một chiếc áo trắng nhỏ.',intro:['Nguyệt','Đây là nơi người ta giấu em. Không phải mất tích. Em bị xóa đi.'],look:'Thành giếng đầy vết cào bé xíu, chạy dài từ đáy lên tới miệng giếng.',spots:[H('shirt','Chiếc áo trắng nhỏ',43,75,15,14),H('inspect:wellwall','Vết cào trên thành giếng',68,14,15,58),H('travel:BG21','Leo sợi dây lên',12,3,16,70)]},
 BG23:{name:'Đại sảnh dưới ánh đỏ',time:'03:17',chapter:'CHƯƠNG 8 · BÓNG ÔNG LÂM',mood:'ĐẠI SẢNH · ÁNH ĐỎ',caption:'Cánh cửa chính rực đỏ. Một cái bóng cao dài trải trên nền gạch, nhưng không có ai đứng đó.',intro:['Đông','Không có ai đứng đó, nhưng cái bóng cứ dài ra mãi. Ánh đỏ lọt qua khe cửa chính. Ông ấy đang chờ chúng ta.'],look:'Đồng hồ quả lắc quay ngược. Mọi bức ảnh gia đình đều bị úp mặt xuống.',spots:[H('lamdoor','Cánh cửa chính rực đỏ',60,20,13,42),H('inspect:clock2','Đồng hồ chạy ngược',45,16,8,34),H('inspect:teaset','Bộ ấm trà vỡ',29,70,10,10),H('travel:BG14','Cầu thang gỗ',20,24,14,38),H('travel:BG12','Lối sang phòng thờ',0,8,10,40)]},
 BG24:{name:'Gác mái dưới mái ngói',time:'03:40',chapter:'CHƯƠNG 8 · BÓNG ÔNG LÂM',mood:'GÁC MÁI · 03:40',caption:'Ánh trăng xuyên qua kẽ ngói như những mũi kim xanh. Dải vải đỏ buộc kín các xà nhà.',intro:['Nguyệt','Có người từng sống ở đây suốt nhiều năm, giấu mình khỏi cả ngôi nhà. Những dải vải đỏ này... là lời cầu nguyện.'],look:'Bụi lơ lửng trong những vệt sáng. Mọi thứ ở đây đều được giữ gìn cẩn thận, như chờ ai đó quay lại.',spots:[H('testimony','Hòm gỗ khắc bông lúa',84,62,14,32),H('inspect:atticbed','Chiếc giường sắt cũ',60,52,22,18),H('inspect:lantern','Đèn bão còn le lói',16,45,7,14),H('travel:BG15','Xuống tầng hai',30,84,30,14)]},
 BG25:{name:"Sân sau và kho vật tư",time:"03:25",chapter:'CHƯƠNG 10 · NĂM CÁI TÊN',mood:"SÂN SAU · 03:25",caption:"Mưa đọng trong những kẽ gạch. Cánh cửa kho đóng im lìm dưới ánh trăng.",look:"Sân sau tối và ẩm. Một chiếc xe cút kít gỉ nằm cạnh cửa kho, mái hiên che những bao tải rỗng.",spots:[H("storeDoor","Cửa kho vật tư có ổ khóa",36,28,14,36),H("inspect:cart","Chiếc xe cút kít gỉ",51,50,22,18),H("inspect:sacks2","Bao tải rỗng dưới mái hiên",76,48,15,24),H("inspect:pot","Chum vỡ ven tường",4,56,9,16),H("travel:BG29","Cổng vườn sau",90,38,10,32),H("travel:BG13","Quay vào gian bếp",8,14,18,46)]},
 BG26:{name:"Kho vật tư",time:"03:32",chapter:'CHƯƠNG 10 · NĂM CÁI TÊN',mood:"KHO VẬT TƯ · 03:32",caption:"Thùng gỗ và bao tải đóng dấu đỏ chất tới mái. Nến, giấy sớ, vải đỏ, nhiều hơn một đêm cúng cần.",look:"Mùi giấy ẩm và dầu đèn. Bụi lơ lửng trong vệt trăng lọt qua ô cửa có song sắt.",spots:[H("storeBook","Cuốn sổ mở trên bàn",14,66,20,14),H("inspect:scale","Chiếc cân treo",30,8,22,42),H("inspect:sacks3","Đống thùng đồ lễ đóng dấu đỏ",66,28,34,40),H("inspect:window2","Ô cửa sổ có song sắt",76,8,20,22),HR("hatchSeen","hatchLock","Nắp hầm có khóa ký hiệu",62,74,22,16),H("travel:BG25","Ra sân sau",2,78,24,20)]},
 BG27:{name:"Phòng ngủ ông Bá Lâm",time:"03:20",chapter:'CHƯƠNG 10 · NĂM CÁI TÊN',mood:"PHÒNG NGỦ · 03:20",caption:"Ngọn đèn dầu trên bàn thờ nhỏ vẫn cháy dù chủ nhân đã đi.",look:"Giường cột chạm với màn rách, bức ảnh gia đình trên tường, và một ngọn đèn dầu không ai thắp.",spots:[H("lamSafe","Két sắt sau bức ảnh",54,38,11,20),H("inspect:lamPortrait","Ảnh gia đình ông Bá Lâm",53,10,13,27),H("inspect:typewriter","Máy đánh chữ trên bàn",67,46,15,18),H("inspect:altar2","Bàn thờ nhỏ có đèn dầu",68,14,22,20),H("inspect:wardrobe2","Tủ gương",33,16,18,55),H("travel:BG30","Cửa ra ban công",91,4,9,72),H("travel:BG15","Trở ra hành lang",40,84,22,14)]},
 BG28:{name:"Phòng học của bé Mơ",time:"03:28",chapter:'CHƯƠNG 10 · NĂM CÁI TÊN',mood:"PHÒNG HỌC · 03:28",caption:"Bảng đen còn nguyên chữ cái. Hạc giấy treo kín, quay chậm dù không có gió.",look:"Một chiếc bàn học nhỏ, bảng đen, giá sách và những con hạc giấy treo trên sợi chỉ.",spots:[H("kidDrawing","Bức tranh vẽ gia đình",53,19,15,21),H("chalkBoard","Bảng đen viết chữ phấn",69,8,30,40),H("takeCrane","Những con hạc giấy",50,0,16,9),H("toyShelf","Giá sách nhỏ có ngăn kéo",29,8,20,45),H("takeCart","Chiếc xe đồ chơi",71,73,15,15),H("travel:BG16","Qua cánh cửa nhỏ về phòng trẻ",1,68,16,28)]},
 BG29:{name:"Vườn sau và năm nấm mộ",time:"03:45",chapter:'CHƯƠNG 10 · NĂM CÁI TÊN',mood:"VƯỜN SAU · 03:45",caption:"Năm nấm mộ không bia, năm cọc tre, năm bát nhang đã nguội từ lâu.",look:"Mây lướt qua ánh trăng. Hoa nhài dại mọc kín chân tường, che những nấm đất thấp.",spots:[H("graves","Năm nấm mộ không bia",23,52,70,24),H("inspect:papaya","Cây đu đủ già",62,2,16,40),H("inspect:redcloth","Dải vải đỏ trên cọc tre",69,43,6,13),H("inspect:jasmine","Hoa nhài dại",0,56,14,30),H("travel:BG25","Cổng vườn sau",10,26,10,36)]},
 BG30:{name:"Ban công tầng hai",time:"03:30",chapter:'CHƯƠNG 10 · NĂM CÁI TÊN',mood:"BAN CÔNG · 03:30",caption:"Từ đây nhìn xuống cả khu rừng, và xa xa là vài đốm đèn của thôn Đồng Chay.",look:"Gió thổi qua lan can mục. Chiếc ghế bập bênh vẫn khẽ đung đưa.",spots:[H("chair","Ghế bập bênh",56,38,22,46),H("inspect:tea2","Bộ ấm trà nguội trên bàn tròn",41,52,15,32),H("inspect:herbs","Bó thuốc nam treo",55,12,12,22),H("inspect:lights","Ánh đèn thôn xa xa",59,26,12,10),H("travel:BG27","Cửa vào phòng ngủ",82,14,18,66)]},
 BG31:{name:"Bên trong miếu cây đa",time:"03:50",chapter:'CHƯƠNG 10 · NĂM CÁI TÊN',mood:"TRONG MIẾU · 03:50",caption:"Rễ đa quấn kín tường. Năm bát hương xếp hàng, một ngọn nến vẫn cháy.",look:"Dải vải đỏ buộc trên những chiếc rễ, mỗi năm một dải. Nến chảy xuống mặt bàn đá.",spots:[H("incenseFive","Năm bát hương trên bàn đá",40,52,32,12),H("inspect:statues","Những pho tượng gỗ nhỏ",51,33,19,18),H("inspect:jar2","Chiếc chum lớn",91,77,9,16),H("travel:BG05","Ra khỏi miếu",6,22,15,48)]},
 BG32:{name:"Kho đồ lễ dưới hầm",time:"03:40",chapter:'CHƯƠNG 10 · NĂM CÁI TÊN',mood:"KHO ĐỒ LỄ · 03:40",caption:"Năm vị trí vẽ phấn, năm bát lễ. Cánh cửa gỗ hắt ra một vệt sáng đỏ.",look:"Nước nhỏ giọt từ trần. Trên tường là những vạch phấn trắng, xếp nhóm năm một.",spots:[H("cellMarks","Những vạch phấn trên tường",10,32,10,18),H("inspect:ring","Vòng sắt buộc dây đỏ",28,26,6,14),H("inspect:mats","Năm vị trí vẽ phấn và năm bát lễ",4,55,66,37),H("inspect:jar3","Chiếc vò nước nứt",59,44,7,10),H("travel:BG26","Cánh cửa lên kho vật tư",81,5,19,57)]},
 BG34:{name:"Bếp biệt thự, năm 1988",time:"02:50",chapter:"ĐÊM 17/3/1988 · BÉ MƠ",mood:"BẾP · 1988",caption:"Than hồng còn đỏ. Một chiếc bát nhỏ nằm riêng trên mâm tre.",look:"Bếp nhà ông Bá Lâm còn nguyên vẹn, ấm mùi khói rạ.",spots:[H("fbBowl","Chiếc bát nhỏ để riêng",61,62,17,19),H("fbMan","Bà Mận ngủ gật bên bếp",46,44,18,26),H("inspect:fbBasket","Rổ tre đựng gạo",80,44,20,28),H("inspect:fbHat","Chiếc nón của bà Mận",82,3,12,25),HR("fbBowl","travel:BG35","Lên hành lang",0,8,9,60)]},
 BG35:{name:"Hành lang tầng hai, năm 1988",time:"02:58",chapter:"ĐÊM 17/3/1988 · BÉ MƠ",mood:"HÀNH LANG · 1988",caption:"Dưới khe cửa phòng cha có một vệt đèn dầu và tiếng hai người đàn ông nói chuyện.",look:"Sàn gỗ bóng, bình hoa mới cắm, đèn dầu chưa tắt.",spots:[H("fbKeys","Chỗ nghe lén cạnh cánh cửa",86,6,9,32),H("fbCha","Cánh cửa phòng cha",63,0,18,78),H("inspect:fbLamp","Ngọn đèn dầu",49,40,6,14),H("travel:BG34","Xuống bếp",0,40,10,50),HR("fbKeys","travel:BG37","Xuống cầu thang bếp",12,28,16,45)]},
 BG37:{name:"Cửa hầm sau bếp, năm 1988",time:"03:05",chapter:"ĐÊM 17/3/1988 · BÉ MƠ",mood:"CỬA HẦM · 1988",caption:"Tiếng đập cửa và tiếng người gọi vọng lên từ bên dưới. Then gỗ cài từ phía ngoài.",look:"Hơi nóng và mùi khói đồ lễ lọt qua khe cửa.",spots:[H("fbLua","Tiếng gọi sau cánh cửa",20,39,57,19),H("fbBowls","Then cửa gỗ",20,64,57,8),H("inspect:fbLamp2","Ngọn đèn dầu",60,20,7,13),HR("fbFed","fbLock","Cha kéo Mơ ra ngoài",74,22,8,20)]},
 BG36:{name:"Hành lang bếp, cửa hầm vẫn đóng",time:"03:12",chapter:"ĐÊM 17/3/1988 · BÉ MƠ",mood:"HÀNH LANG BẾP · 1988",caption:"Tiếng đập cửa nhỏ dần phía sau. Ngoài sân có ánh đèn của bàn tế.",look:"Mơ ngồi bệt xuống sàn nơi cha vừa gạt em ra.",spots:[H("inspect:fbSilent","Tiếng gõ cửa yếu dần",16,39,54,19),H("travel:BG38","Chạy ra sân giếng",0,10,12,80)]},
 BG38:{name:"Sân giếng, đêm mưa năm 1988",time:"03:17",chapter:"ĐÊM 17/3/1988 · BÉ MƠ",mood:"SÂN GIẾNG · 03:17",caption:"Mưa xối xuống sân. Chiếc đèn bão nằm nghiêng bên miệng giếng.",look:"Mưa tạt rát mặt. Trên miệng giếng, nắp gỗ đã xô lệch.",spots:[H("fbSeal","Thứ gì đó đặt trên thành giếng",58,47,22,9),HR("fbSeal","fbLeft","Bám tường chạy vòng bên trái",0,12,30,70),HR("fbSeal","fbWell","Chạy thẳng ngang miệng giếng",42,56,45,30),H("inspect:fbShoe","Chiếc giày vải nhỏ",55,83,8,7)]},
 BG39:{name:"Đường làng trong mưa",time:"03:20",chapter:"ĐÊM 17/3/1988 · BÉ MƠ",mood:"ĐƯỜNG LÀNG · 1988",caption:"Một đốm sáng rất xa. Em chưa bao giờ tới được.",look:"Con đường bùn kéo dài giữa hai rặng tre.",spots:[H("fbLight","Đốm sáng xa xa",80,38,12,16),H("inspect:fbGate","Cổng biệt thự phía sau",2,5,23,70)]},
 BG40:{name:"Rừng thiêng buổi sớm",time:"05:40",chapter:"CHƯƠNG 11 · RỪNG THIÊNG",mood:"RỪNG THIÊNG · 05:40",caption:"Sương loãng dần. Những dải vải đỏ khẽ lay trên cành.",look:"Cây đa, cây gạo và một bàn thờ đá phủ rêu.",spots:[H("forestAltar","Bàn thờ đá trong rừng",28,62,26,22),H("redCloth","Dải vải đỏ có thêu chữ",44,10,6,30),H("inspect:bloom","Hoa gạo đỏ trên cành",66,5,22,18),H("travel:BG41","Lối về nhà bà ngoại Nguyệt",86,60,14,38),H("travel:BG08","Quay về cổng biệt thự",0,78,18,20)]},
 BG41:{name:"Nhà bà ngoại Nguyệt",time:"06:30",chapter:"CHƯƠNG 11 · RỪNG THIÊNG",mood:"ĐỒNG CHAY · 06:30",caption:"Nắng sớm lên mái ngói. Trên bàn thờ nhỏ có một bức ảnh thờ.",look:"Ngôi nhà nhỏ nơi bà ngoại Nguyệt từng sống.",spots:[H("grandPhoto","Ảnh thờ trên bàn thờ",22,34,6,10),H("inspect:grandChair","Chiếc ghế mây trước hiên",54,53,14,25),H("inspect:grandTea","Ấm trà trên bàn",64,60,13,14),H("inspect:grandBasket","Chiếc nong treo tường",4,24,10,20),H("travel:BG40","Quay lại rừng thiêng",88,60,12,35)]},
 BG42:{name:"Miệng giếng bị trám kín",time:"04:10",chapter:"CHƯƠNG 9B · BÁT CƠM NÓNG",mood:"SÂN GIẾNG · 04:10",caption:"Vòng hoa nhài khô nằm trên nắp xi măng nứt.",look:"Ai đó đã xây bịt miệng giếng ba mươi năm trước, và vẫn có người đặt hoa.",spots:[H("wellSealed","Vòng hoa nhài trên nắp giếng",52,41,30,14),H("inspect:jasmine2","Hoa nhài dại",8,5,8,10),H("travel:BG09","Quay ra sân",0,62,24,34)]},
 BG43:{name:"Gác nhỏ của cô Lụa",time:"04:00",chapter:"CHƯƠNG 9B · BÁT CƠM NÓNG",mood:"GÁC NHỎ · 04:00",caption:"Hạc giấy khẽ xoay trên xà. Trên bàn, một cuốn sổ nằm mở.",look:"Căn gác sau bếp, nơi cô Lụa ngủ mỗi đêm trước khi bị nhốt.",spots:[H("luaDiary","Cuốn nhật ký trên bàn",47,70,23,19),H("takeDoll","Con búp bê vải",78,50,14,29),H("tornPhoto","Mảnh ảnh giấu dưới gối",34,50,17,13),H("inspect:comb2","Chiếc lược gỗ",84,79,11,10),H("inspect:cranes2","Hạc giấy treo trên xà",41,0,24,36),H("inspect:window3","Cửa sổ nhìn xuống sân",70,3,21,44),H("travel:BG13","Xuống bếp",0,40,10,30)]},
 BG44:{name:"Chỗ cắm trại trên hiên",time:"01:30",chapter:"ĐÊM TRẠI",mood:"HIÊN NHÀ · 01:30",caption:"Ngọn lửa nhỏ đủ sưởi ấm năm người, và đủ để họ nói chuyện.",look:"Năm túi ngủ quanh đống lửa trước hiên biệt thự.",spots:[H("campfire","Đống lửa trại",49,56,13,23),H("inspect:kettle","Ấm nước đun trên lửa",42,62,6,8),H("inspect:bags","Túi ngủ của cả nhóm",16,70,26,22),H("inspect:flash2","Đèn pin để dưới đất",56,80,6,4),H("travel:BG10","Xuống bậc hiên",88,8,12,60)]},
 BG45:{name:"Sân ngoài chùa làng",time:"08:30",chapter:'CHƯƠNG 1 · ĐỒNG CHAY',mood:"SÂN CHÙA · 08:30",caption:"Sân gạch dưới tán cây đại. Một bàn gỗ nhỏ, ba đồng xu trên đĩa sứ.",intro:["Ánh","Sân chùa yên quá. Ông cụ ngồi bên bàn xem quẻ kia có vẻ biết trước bọn mình sẽ đến."],look:"Hoa đại rụng trắng trên gạch. Ở sâu trong chùa có hai ngọn đèn lồng sáng giữa ban ngày.",spots:[H("huu","Ông Hựu và bàn xem quẻ",61,63,28,34),H("inspect:pagoda","Chùa làng",33,10,30,35),H("inspect:daitree","Cây đại nở hoa",72,0,28,40),H("travel:BG01","Về cổng làng",0,60,24,38)]},
 BG46:{name:"Bàn lễ trước miếu cây đa",time:"20:30",chapter:'CHƯƠNG 1 · LỐI VÀO RỪNG',mood:"BÀN LỄ · 20:30",caption:"Sáu chỗ bày lễ trên mặt bàn gỗ mục. Hai ngọn đèn đang cháy.",intro:["Nguyệt","Mâm lễ bày trước miếu. Đếm thử xem: sáu chỗ."],look:"Cơm, nước, hoa cúc trắng. Một chỗ đèn chưa thắp. Rễ đa ôm kín bức tường miếu.",spots:[H("lampSix","Ngọn đèn chưa thắp",62,67,17,15),H("inspect:lamps2","Hai ngọn đèn đang cháy",24,66,34,17),H("inspect:bowls3","Cơm, nước, hoa",26,50,52,14),H("inspect:petition2","Cuộn giấy và tấm vải đỏ",3,58,17,22),H("inspect:idol","Bài vị trong khám đá",40,14,20,28),H("travel:BG05","Lùi lại",34,91,32,9)]},
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
  ["Nguyệt","Hay đúng hơn là... nhà này từng tổ chức một buổi lễ mà cả làng không dám nhắc tới."],
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
 sacks:[["Nguyệt","Dấu niêm phong ghi năm 1988. Số vật liệu bịt tường này lấy từ kho nhà ông Lâm, không phải của ai khác."]],
 belongings:[["Đông","Mình sẽ mang từng món về cho gia đình họ, nếu còn ai chờ. Tớ hứa."]],
 clock2:[["Nam","Cậu cũng thấy tim mình đập ngược theo kim đồng hồ chứ? Tớ thấy khó thở quá."]],
 atticbed:[["Ánh","Dưới gối còn một cuốn sổ nhỏ, chữ viết ngay ngắn như người ấy ghi từng ngày. Một người cô đơn, nhưng không buông xuôi."]],
 lantern:[["Tuyết","Có người vẫn thắp đèn mỗi đêm chờ ai đó về. Chờ suốt bấy nhiêu năm... tớ nghẹn quá."]]
};

/* ================= CHƯƠNG 9 · NĂM CÁI TÊN =================
   Sau khi bóng ông Bá Lâm tan, cổng sắt vẫn khóa: năm người bị nhốt chưa có tên. Mơ chỉ người chơi đi tìm.
   Mở két sắt phòng ngủ ông Lâm (mật mã là năm khắc trên khóa: 1988) → lấy chìa kho vật tư ở ban công → vào kho đọc sổ → xuống kho đồ lễ;
   tên của năm người nằm ở: giếng BG09, bếp BG13, phòng học BG28, kho vật tư BG26, kho đồ lễ BG32. Lấy nhang ở miếu BG31,
   rồi khấn tên ở vườn mộ BG29. Xong thì cổng mở; kết thúc thật dùng ảnh bình minh BG33. */
const QNAMES={
 well:{id:"hai",name:"Lê Văn Hải",role:"người làm công trông giếng",relicName:"khăn vải cũ",own:false,set:null,lines:[["Nguyệt","Trên thành giếng có chữ khắc bằng mũi dao, mới nhìn tưởng vết rêu. ...“Hải”. Rồi thêm: “Lê Văn Hải, làm công, trông giếng”."],["Tuyết","Bác ấy tự khắc tên mình vào đá. Như sợ có ngày chẳng còn ai nhớ."],["Nam","Dưới còn một dòng nhỏ hơn: “Tôi nhận việc này vì tiền chữa chân. Nếu biết trước, tôi đã không ký.” Chỉ vì vậy thôi sao..."],["Nguyệt","Lê Văn Hải. Tớ ghi vào sổ. Bác Hải, chúng cháu nhớ bác."]]},
 spoon:{id:"sen",name:"Trần Thị Sen",role:"người nấu bếp",relicName:"muôi cơm rỉ",own:false,set:null,lines:[["Tuyết","Trên xà bếp có những vạch than đếm số bát lễ. Vạch cuối là hai chữ: “Sen nấu”."],["Nguyệt","“Trần Thị Sen, nấu bếp.” Bên cạnh là một vạch than nữa: “Bát thứ sáu — không ai ăn.” Rồi hết."],["Ánh","Chiếc muôi mất cán lúc nãy... Chị nấu cho cả nhà, và chị là người đầu tiên đếm ra chiếc bát thừa, đúng không?"],["Tuyết","Chắc vậy. Chị ấy nhận ra có điều sai khi chưa ai dám nói. Tớ thương chị ấy quá."],["Nguyệt","Trần Thị Sen. Tên chị đã được ghi lại."]]},
 kidDrawing:{id:"lua",name:"Phạm Thị Lụa",role:"vú nuôi, cô giáo đầu tiên của bé Mơ",relicName:"bức tranh bé Mơ vẽ",own:true,set:null,lines:[["Ánh","Bức tranh bé Mơ vẽ: một ngôi nhà, một bé gái nhỏ xíu và một người phụ nữ cao lớn nắm tay em. Dưới chân người ấy có dòng chữ nguệch ngoạc: “cô Lụa”."],["Nguyệt","Trên bảng đen còn dòng: “Phạm Thị Lụa dạy Mơ chữ.” Cô là người nuôi em từ khi em còn bé xíu."],["Tuyết","Nét phấn nào cũng nắn nót cho trẻ con học. Cô dạy em từng nét một."],["Ánh","Tớ nhớ hộp nhạc rồi. Cô ấy hát ru, cô ấy cũng dạy chữ. Có lẽ cô là mẹ của em theo nghĩa thật."],["Nguyệt","Phạm Thị Lụa. Cảm ơn cô đã không bỏ em."]]},
 storeBook:{id:"tam",name:"Nguyễn Văn Tâm",role:"thủ kho giữ sổ vật tư",relicName:"cuốn sổ kho vật tư",own:true,set:"hatchSeen",lines:[["Nguyệt","Cuốn sổ mở sẵn, trang cuối viết dở: “Cấp cho thầy Tịnh: nến, giấy sớ, vải đỏ và tấm vải che ô thông gió gian hầm. Người nhận ký: T. Ký duyệt: Bá Lâm.” Ghi lại: Nguyễn Văn Tâm, thủ kho."],["Đông","Chữ ký của bác Tâm. Bác ghi hết, từng món một. Bác biết mình đang giữ bằng chứng chống lại ông chủ."],["Nam","Lề trang có thêm dòng nhỏ: “Nếu tôi không ra khỏi hầm, hãy tìm dưới đống đồ lễ.” Dưới đống đồ lễ?"],["Tuyết","Cậu thấy không, chỗ đồ lễ đổ trên sàn có vết kéo lê. Dưới đó có nắp gỗ!"],["Nguyệt","Nguyễn Văn Tâm. Bác đã dũng cảm hơn tất cả chúng cháu."]]},
 cellMarks:{id:"khoa",name:"Đỗ Văn Khoa",role:"người dạy chữ cho Mơ",relicName:"những vạch phấn trên tường",own:true,set:null,lines:[["Tuyết","Những vạch phấn trên tường, nhóm năm một. Bên dưới có dòng chữ nắn nót: “Đỗ Văn Khoa, dạy học. Lời khấn bị sửa. Cửa khóa từ ngoài. Chúng tôi sẽ ra cùng nhau.”"],["Nguyệt","Người dạy chữ cho Mơ. Thầy ghi tên từng người ngay trên tường, nhưng bốn cái tên kia đã mờ gần hết. Chỉ còn tên thầy rõ nhất."],["Đông","Họ ghi lại để không ai quên mình đã ở đây. Cả đời thầy dạy người ta biết đọc, và chữ cuối cùng thầy viết lại là để cầu cứu."],["Tuyết","Dưới cùng còn một câu: “Nếu ai đọc được, xin nhắn về làng: cửa hầm bị khóa từ bên ngoài, đừng tin bản sớ.” Tớ khóc mất."],["Nguyệt","Đỗ Văn Khoa. Thầy ơi, lời nhắn của thầy đã tới nơi rồi."]]}
};
const arcOn=()=>!!(state.flags.lamDone&&!state.flags.flashDone);
const questOn=()=>!!(state.flags.lamDone&&state.flags.flashDone&&!state.flags.namesDone);
const namesFound=()=>Array.isArray(state.flags.names)?state.flags.names:[];
/* Trả true nếu hành động này là một manh mối tên (đã xử lý xong, không cần chạy tiếp) */
function nameClueAt(action){const c=QNAMES[action];if(!c)return false;
 if(!questOn()){if(!c.own)return false;say('Nguyệt',c.name+', '+c.role+'. Tên '+(c.id==='tam'?'bác':'người')+' đã được trả lại.');return true}
 const f=namesFound();
 if(f.includes(c.id)){say('Nguyệt',c.name+', '+c.role+'. Tên đã được ghi vào sổ ('+f.length+'/5).');return true}
 state.flags.names=[...f,c.id];if(c.set){state.flags[c.set]=true;render()}
 note('name_'+c.id,'Cái tên: '+c.name,c.name+', '+c.role+'. Tìm thấy ở '+c.relicName+'.');
 const left=5-state.flags.names.length;
 talk(left?[...c.lines,['Mơ','Còn '+left+' cái tên nữa, chị ạ.']]:[...c.lines,['Mơ','Đủ năm tên rồi. Chị lấy nhang ở miếu cây đa, rồi ra vườn sau, họ đang đợi chị khấn.']]);
 save();return true}
const NAME_LIST=Object.values(QNAMES);
let graveOrder=null,graveSlot=0,graveTaken=[];
function showGraves(){const f=namesFound();
 if(state.flags.namesDone){say('Nguyệt','Năm nén nhang đã cháy hết. Năm cái tên đã được trả lại.');return}
 if(!questOn()){say('Tuyết','Năm nấm mộ không bia. Có lẽ ai đó vẫn đến thắp nhang.');return}
 if(f.length<5){showModal(`<h2>Năm nấm mộ không bia</h2><p>Mỗi nấm mộ đang chờ một cái tên. Bạn đã biết <strong>${f.length}/5</strong> cái tên.</p><p class="modal-note">Mơ nói họ nằm lại ở những nơi từng sống: giếng, bếp, phòng học của em, kho vật tư và kho đồ lễ bên dưới.</p><div id="names-actions" class="modal-buttons"></div>`,'VƯỜN SAU','names');$('names-actions').appendChild(modalButton('Đã hiểu',hideModal));return}
 if(!has('incense5')){say('Nguyệt','Có đủ tên rồi, nhưng chưa có nhang. Bà Mận để dành nhang trong miếu cây đa, chỗ bát hương ven rừng.');return}
 if(state.selectedItem!=='incense5'){say('Nguyệt','Mình chọn năm nén nhang trong túi đồ, rồi chạm vào các nấm mộ.');return}
 graveOrder=['tam','hai','khoa','sen','lua'];graveSlot=0;graveTaken=[];renderNames()}
function renderNames(){const cur=NAME_LIST.find(c=>c.id===graveOrder[graveSlot]);
 showModal(`<h2>Khấn tên người đã khuất</h2><p><strong>Nấm mộ ${graveSlot+1} / 5</strong></p><p>Nấm mộ này là của <strong>${escapeHTML(cur.role)}</strong>. Hãy đọc đúng tên người ấy.</p><div id="name-options" class="ritual-list"></div><p class="modal-note">Hãy đọc lại nhật ký nếu chưa nhớ.</p>`,'CÂU ĐỐ · NĂM CÁI TÊN','names');
 NAME_LIST.forEach(c=>{const b=document.createElement('button');b.type='button';b.className='ritual-option';b.disabled=graveTaken.includes(c.id);b.textContent=c.name;
  b.addEventListener('click',()=>{if(c.id!==cur.id){toast('Nén nhang không bén lửa. Chưa đúng người.');playSound('switch',.12);return}
   graveTaken.push(c.id);graveSlot++;playSound('lighter',.16);if(graveSlot<5){renderNames();return}finishNames()});$('name-options').appendChild(b)})}
function finishNames(){graveSlot=0;graveTaken=[];graveOrder=null;state.flags.namesDone=true;consume('incense5',true);
 note('namesDone','Năm cái tên','Lê Văn Hải, Trần Thị Sen, Phạm Thị Lụa, Nguyễn Văn Tâm, Đỗ Văn Khoa. Năm nén nhang bén lửa khi tên của từng người được đọc lên. Cổng sắt đã mở.');
 save();hideModal();render();
 talk([['Nguyệt','Lê Văn Hải. Trần Thị Sen. Phạm Thị Lụa. Nguyễn Văn Tâm. Đỗ Văn Khoa. Tên các bác, cháu đã gọi đủ.'],
  ['Mơ','Họ đang cười kìa chị. Em chưa thấy bác Hải cười bao giờ.'],
  ['Tuyết','Khói nhang bay lên rồi. Thơm quá. Hình như cả căn nhà nhẹ đi nhiều lắm.'],
  ['Mơ','Cổng mở rồi. Chị mang các bác ra ngoài nhé. Và mang cả em, bằng cái tên của em.'],
  ['Đông','Mình hứa. Đi thôi. Lần này đi hết con đường, không bỏ ai lại.']])}
function showLamSafe(){if(state.flags.lamSafeOpen){say('Nguyệt','Két đã mở. Nhật ký của ông Bá Lâm đã được ghi lại.');return}
 showLock({title:'Két sắt sau bức ảnh',kicker:'CÂU ĐỐ · KÉT SẮT',type:'safe',code:'1988',plate:'',hint:'Bấm vào từng ô số. Dưới các ô có khắc một năm, năm mà ông Lâm không bao giờ quên.',onOpen:()=>{state.flags.lamSafeOpen=true;note('lamdiary','Nhật ký ông Bá Lâm','Trang cuối ông viết: “Ta giấu chìa kho ở chỗ ta hay ngồi hóng gió, nơi nhìn xuống cả làng. Ta biết ta sẽ không bao giờ dám mở nó.”');save();
   talk([['Nguyệt','Trong két chỉ có một cuốn nhật ký mỏng. Trang cuối...'],['Đông','“Ta giấu chìa kho ở chỗ ta hay ngồi hóng gió, nơi nhìn xuống cả làng.” Ông ấy biết mình sai, mà vẫn không dám mở.'],['Mơ','Cha em ngồi ở ban công mỗi tối. Chiếc ghế bập bênh, chị nhớ nhé.'],['Nam','Nghe cả tiếng gọi mà vẫn không mở cửa. Tớ chẳng thấy thương ông ta chút nào.']]);renderSidebar()}})}

Object.assign(CONVO,{
 BG25:[["Nam","Sân sau... Tớ chưa thấy cái sân nào im lặng như thế này. Kho kia kìa, khóa to thật."],["Mơ","Đây là kho vật tư của cha em. Hồi nhỏ em hay chui qua khe hàng rào vào chơi. Trong đó thùng nào cũng đóng dấu đỏ."],["Nguyệt","Dấu đỏ... là dấu cấp phát đồ lễ. Vậy là sổ sách vẫn nằm ở đây, suốt từng ấy năm."],["Đông","Ổ khóa còn nguyên. Mình cần tìm chìa trước. Người cẩn thận như ông Lâm sẽ không để chìa ở xa đâu."]],
 BG26:[["Tuyết","Mùi giấy ẩm... Thùng nào cũng đóng dấu đỏ. Nến, giấy sớ, vải đỏ, nhiều hơn một đêm cúng cần."],["Nam","Chuẩn bị cả kho đồ cho một buổi lễ mà cả làng không hề hay biết. Tớ thấy máu dồn lên mặt."],["Đông","Bình tĩnh, Nam. Mình tới đây để tìm tên họ, không phải để giận. Cuốn sổ trên bàn kia, xem thử đi."]],
 BG27:[["Ánh","Phòng ngủ của ông Bá Lâm. Giường cột chạm, màn rách, bàn thờ nhỏ với cái đèn dầu... Đèn dầu vẫn cháy, các cậu thấy không?"],["Tuyết","Ai thắp vậy? Ông ấy đi rồi mà. ...Tớ không muốn biết đâu."],["Mơ","Cha em ngồi đây mỗi đêm, nhìn ảnh gia đình mà không nói gì. Em từng đứng ngoài cửa nghe cha thở dài."],["Nguyệt","Một người thở dài mỗi đêm mà vẫn không chịu mở cửa hầm ra. Tớ không hiểu nổi ông ta."]],
 BG28:[["Ánh","Căn phòng nhỏ này... bảng đen, bàn học, hạc giấy treo đầy. Tớ nghe như đâu đó có tiếng bút chì viết trên giấy."],["Mơ","Đây là phòng học của em. Cô Lụa dạy em ở đây. Cha bảo con gái không cần đi học, nhưng cô vẫn lén dạy."],["Tuyết","Cô Lụa... Em nhắc đến cô như người thân ruột thịt vậy."],["Mơ","Cô là người duy nhất ôm em mỗi đêm. Chị tìm tên cô giúp em nhé, em sợ mọi người quên mất."]],
 BG29:[["Tuyết","Vườn sau... năm nấm mộ, không bia. Chỉ có cọc tre và mấy bát nhang nguội."],["Nguyệt","Ai đó chôn họ ở đây, rồi để hoa nhài mọc kín cho khuất mắt."],["Mơ","Bà Mận thắp nhang cho họ mỗi đêm, lén thôi, để cha không biết. Bà không biết tên họ, nên chỉ cắm nhang chứ không khấn."],["Đông","Vậy hôm nay mình sẽ khấn, bằng đúng tên. Phải tìm đủ tên trước đã."]],
 BG30:[["Nam","Ban công... Trời ơi, nhìn xuống kia. Ánh đèn làng Đồng Chay le lói. Từ đây thấy cả nhà trọ của mình."],["Ánh","Chiếc ghế bập bênh vẫn đung đưa. Dù không có gió."],["Nguyệt","Ông ấy ngồi đây mỗi tối. Chắc cũng từng nhìn xuống sân giếng, nơi mọi chuyện đã xảy ra."]],
 BG31:[["Tuyết","Bên trong miếu... Năm bát hương xếp ngay ngắn, nến vẫn cháy. Có người vừa thắp."],["Nguyệt","Rễ đa quấn khắp tường, như đang giữ cái miếu khỏi sụp. Còn những dải vải đỏ này..."],["Mơ","Bà Mận buộc đấy, mỗi năm một dải, mỗi người một dải. Chị lấy nhang ở đây nhé. Nhang này bà để dành cho họ."]],
 BG32:[["Đông","Dưới này... năm vị trí vẽ phấn, năm bát lễ. Cánh cửa kia hắt ra ánh đỏ."],["Tuyết","Họ bị đưa xuống đây trước nửa đêm. Rồi cửa đóng lại phía sau. Trời ơi."],["Nam","Tớ không chịu nổi. Không cửa sổ, nước nhỏ giọt, và cái vòng sắt buộc dây đỏ trên tường... Cái này không phải để cứu ai."],["Nguyệt","Mình ở lại một chút nhé. Họ đã ở một mình quá lâu rồi."]]
});
const INSPECT2={
 cart:["Nam","Chiếc xe cút kít rỉ sét, bánh còn dính vôi trắng. Có người đã chở vật liệu ra khỏi kho vào ban đêm, để bịt hầm."],
 sacks2:["Tuyết","Bao tải rỗng gấp vuông vắn dưới mái hiên. Nhìn gọn gàng quá, như người ta đang chờ chất đồ lễ vào."],
 pot:["Ánh","Chiếc chum vỡ một nửa, bên trong đầy nước mưa. Mặt nước phản chiếu trăng... và một cái bóng không phải của tớ."],
 scale:["Đông","Chiếc cân đòn treo trên xà. Hai đĩa lệch hẳn một bên, như phiếu cấp đồ ghi một đằng mà cân ra một nẻo."],
 sacks3:["Nam","Nến, giấy sớ, vải đỏ, thùng nào cũng đóng dấu đỏ. Nhiều hơn một nhà cần cho một đêm cúng. Họ đã chuẩn bị rất kỹ."],
 window2:["Tuyết","Qua song sắt chỉ thấy bóng tre. Từ trong kho này, người ta nghe được tiếng của làng nhưng không thể ra."],
 lamPortrait:["Nguyệt","Ảnh gia đình ông Bá Lâm: năm người, cả năm khuôn mặt đều bị cào đến không nhận ra. Mơ cũng bị xóa khỏi ảnh."],
 typewriter:["Ánh","Máy đánh chữ còn kẹp một tờ giấy: “Báo cáo: lễ cầu an đã làm đúng nghi thức, không ai bị hại.” Đánh máy ngay ngắn, mà không một chữ nào là thật."],
 altar2:["Tuyết","Bàn thờ nhỏ thờ ai thì không đề. Chỉ có đèn dầu và một chiếc bát cơm đầy, còn nóng."],
 wardrobe2:["Ánh","Tủ gương mờ, trong có áo dài cũ của bà chủ và một chiếc váy trẻ con may dở. Váy nhỏ xíu, may bằng vải hoa."],
 chalk:["Nguyệt","Bảng viết đầy chữ cái, nét phấn nắn nót. Góc dưới có dòng viết vội: “Mơ giỏi lắm.”"],
 cranes:["Ánh","Hạc giấy mỗi con một màu, gấp từ trang sách cũ. Đếm được đúng một trăm con. Em gấp để cầu điều ước nào vậy?"],
 shelf2:["Tuyết","Giá sách toàn truyện cổ tích và vài cuốn sách học vần. Cuốn nào cũng cũ mòn gáy vì được giở đi giở lại."],
 toycart:["Nam","Chiếc xe gỗ đồ chơi, bánh nhỏ xíu. Em từng kéo nó khắp phòng. ...Tớ không nên nhìn lâu."],
 papaya:["Nam","Cây đu đủ trĩu quả, nhưng ai ở đây dám hái? Gốc nó mọc ngay trên chỗ chôn người."],
 redcloth:["Tuyết","Dải vải đỏ mới buộc, chưa bạc màu. Người thân của họ chưa quên, hoặc có người vẫn thay vải mỗi năm."],
 jasmine:["Ánh","Hoa nhài trắng muốt giữa đất ẩm. Mùi thơm dịu, buồn buồn. Có ai chăm chúng, không thể tự mọc đẹp thế này."],
 tea2:["Tuyết","Bộ ấm trà nguội trên bàn tròn, một chén đã cạn. Người ngồi đây uống đến giọt cuối rồi mới đứng dậy."],
 herbs:["Nguyệt","Bó thuốc nam treo khô: ngải cứu, lá lốt. Của bà Mận, tớ chắc vậy. Bà từng chữa bệnh cho cả nhà."],
 lights:["Ánh","Những đốm đèn xa kia là Đồng Chay. Gần như vậy mà người trong hầm gào cả tháng không ai nghe."],
 statues:["Nguyệt","Mấy pho tượng gỗ nhỏ sứt mẻ, mặt mờ đi vì khói hương. Người ta cầu nguyện lâu đến mức tượng cũng nhòe cả mặt."],
 jar2:["Nam","Chiếc chum đựng gạo thờ, gần như trống. Chỉ còn mấy hạt lép dưới đáy."],
 ring:["Nam","Vòng sắt bắt chặt vào tường, xích còn mẩu ngắn. Vết mòn trên vòng... Tớ thấy ghê tay."],
 mats:["Tuyết","Năm vị trí vẽ phấn, năm bát lễ xếp đủ. Họ đã đứng đúng chỗ được chỉ định, cho đến khi cánh cửa đóng lại."],
 jar3:["Ánh","Chiếc vò nứt, đáy còn chút nước đục. Năm người, một vò nước, và một cánh cửa khóa từ bên ngoài."]
};
Object.assign(MORE,{
 cart:[["Đông","Mình ghi lại. Đây là chứng cứ cho thấy vật liệu bịt hầm được chở từ kho này ra."]],
 scale:[["Nguyệt","Ông ta gian ngay từ lúc cân. Tớ ghét cái chiếc cân này."]],
 lamPortrait:[["Mơ","Ảnh chụp lúc em mới sinh. Cha bảo chờ em lớn rồi chụp lại. Nhưng em không có lần sau."]],
 chalk:[["Mơ","Cô Lụa viết đấy. Cô hay khen em như vậy."]],
 cranes:[["Mơ","Em ước cha mở cửa kho cho dân. Em chưa kể với ai."]],
 lights:[["Nguyệt","Mình sẽ cho họ nghe thấy lần này."]]
});
Object.assign(CONVO,{
 BG34:[["Mơ","Bếp vẫn còn than hồng. Bà Mận ngủ gật bên bếp rồi."],["Mơ","Trên mâm có sáu cái bát. Năm bát to, một bát bé xíu vừa tay con. Bát bé ấy để riêng, không ai nói là của ai."]],
 BG35:[["Mơ","Cha còn thức. Đèn dầu vẫn sáng dưới khe cửa."],["Mơ","Cha đang nói chuyện với một người lạ. Con phải thật nhẹ, nhẹ như con mèo."]],
 BG37:[["Mơ","Cánh cửa dưới bếp... Sao có tiếng người ở bên dưới?"]],
 BG36:[["Mơ","Cha đẩy con ra rồi. Dưới kia vẫn còn tiếng gõ. Mà ngoài sân có ánh đèn..."]],
 BG38:[["Mơ","Mưa to quá. Thầy Tịnh vừa đặt gì đó lên thành giếng rồi vào nhà. Giếng ở ngay giữa sân."]],
 BG39:[["Người kể chuyện","Con đường dẫn ra làng chỉ có một ánh đèn nhỏ ở rất xa."]],
 BG40:[["Nguyệt","Rừng thiêng. Sương loãng dần. Những dải vải đỏ này có ai buộc từng năm một."],["Đông","Chúng ta đã ra được khỏi biệt thự. Nhưng cảm giác như còn một việc chưa xong."]],
 BG41:[["Nguyệt","Nhà bà ngoại tớ. Tớ chưa bao giờ vào đây từ ngày bà mất."]],
 BG42:[["Mơ","Cha em xây bịt giếng ngay sáng hôm sau. Chị thấy không, nắp xi măng nứt rồi mà vẫn có người đặt hoa."],["Ánh","Hoa nhài còn tươi. Có người thật sự đến đây mỗi ngày."]],
 BG43:[["Nguyệt","Một gác nhỏ sau bếp. Có hạc giấy, một con búp bê, và một cuốn sổ."],["Tuyết","Tớ có cảm giác ai đó vừa rời khỏi giường này. Chăn còn hơi ấm."]]
});
Object.assign(INSPECT2,{
 pagoda:["Ánh","Chùa làng nhỏ, mái ngói phủ rêu. Hai ngọn đèn lồng vẫn sáng giữa ban ngày. Tớ chụp một tấm."],
 daitree:["Tuyết","Cây đại nở hoa trắng, rụng đầy sân. Hương dịu lắm, mà tớ vẫn thấy lạnh gáy."],
 lamps2:["Đông","Hai ngọn đèn dầu cháy đều. Chẳng ai trông miếu mà dầu vẫn đầy."],
 bowls3:["Tuyết","Cơm trắng, nước trong, hoa cúc trắng. Đồ lễ còn rất mới, mà đường tới đây không có dấu chân nào."],
 petition2:["Nam","Một cuộn giấy buộc dây và tấm vải đỏ gấp gọn. Tớ có cảm giác đừng nên chạm vào."],
 idol:["Nguyệt","Bài vị trong khám đá mờ gần hết. Chỉ đọc được mấy chữ đầu: “Huyền Lâm Thánh Quân”. Tớ ghi lại, có thể phải đối chiếu về sau."],
 fbBasket:["Mơ","Rổ đựng gạo của bà Mận. Gạo thì còn ít, mà bà vẫn bớt phần mình cho con."],
 fbHat:["Mơ","Nón của bà Mận. Bà đội nón cả những lúc ngủ, để che nước mắt."],
 fbLamp:["Mơ","Đèn dầu của cha. Cha thức khuya hơn cả con gà trống."],
 fbLamp2:["Mơ","Đèn dầu leo lét. Hơi nóng và mùi khói lễ lọt qua khe cửa, nồng đến cay mắt."],
 fbSilent:["Mơ","Tiếng gõ yếu dần. Có ai đó ho, rồi im. Con không dám nghe tiếp."],
 fbShoe:["Mơ","Giày của con. Con làm rơi mất một chiếc rồi. Mẹ... à, cô Lụa sẽ mắng cho xem."],
 fbGate:["Người kể chuyện","Cánh cổng sắt phía sau đang khép dần. Ánh đèn phòng cha vẫn sáng."],
 bloom:["Nguyệt","Hoa gạo đỏ rực giữa rừng. Người làng nói nó nở để tiễn người đi xa."],
 grandChair:["Nguyệt","Chiếc ghế mây của bà. Bà ngồi đây mỗi chiều, nhìn về phía rừng, và không bao giờ kể tớ nghe vì sao."],
 grandTea:["Nguyệt","Ấm trà vẫn còn một chén úp. Chén của bà."],
 grandBasket:["Nguyệt","Cái nong bà phơi đậu. Bà thương cả những hạt đậu rơi."],
 jasmine2:["Ánh","Những bông nhài trắng mọc quanh tường giếng. Mơ thích hoa nhài sao?"],
 doll:["Ánh","Con búp bê vải khâu bằng tay, mắt thêu bằng chỉ đen. Người khâu nó chắc đã ngồi cả đêm."],
 comb2:["Tuyết","Chiếc lược gỗ mất nhiều răng. Trên cán có khắc chữ L."],
 cranes2:["Ánh","Hạc giấy gấp từ giấy học trò. Mỗi con có một chữ cái nhỏ viết bằng bút chì."],
 window3:["Nguyệt","Từ cửa sổ nhìn xuống thấy cả sân giếng. Cô Lụa có thể nhìn thấy Mơ chơi ngoài sân mỗi ngày."],
 kettle:["Nam","Ấm nước đun lên trên lửa. Tớ đang pha trà cho cả nhóm, đừng ai khen nhé."],
 bags:["Tuyết","Năm túi ngủ xếp thành vòng tròn quanh lửa. Chẳng ai muốn ngủ ở xa người khác."],
 flash2:["Nam","Đèn pin của tớ. Pin còn đủ cho cả đêm. Tớ sẽ không để ai ở lại trong bóng tối nữa."]
});
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
 market:'tieng_on_ao_o_cho.mp3',water:'nuoc_chay.mp3',frogs:'community-frogs.mp3',frogsNight:'frogs-croaking-at-night.mp3',gecko:'than_lan_keu_3s.mp3',crickets:'tieng_de_keu.mp3',musicbox:'music_box.mp3',rain:'rain.mp3',forest:'nature_forest.mp3',house:'ambient_house.mp3',crow:'crow.mp3',pick:'pick.mp3'};
const SLAM_LEAD=3.3;                         /* door-slam.mp3: cú đập nằm ở ~4,0 s; bắt đầu phát từ 3,3 s để nó vang ngay sau tiếng kẽo kẹt */
/* Tương tác = nhân vật bước tới chỗ đó: dùng tieng_buoc_chan.mp3 (3 bước khi đi sang cảnh khác, 2 bước khi xem/nhặt đồ). */
const PAPER_ITEMS=['petition','testimony','fragA','fragB','fragC','legendDoc','backDoc'];  /* chỉ vật bằng giấy mới có tiếng lật giấy khi nhặt */
const VILLA_ROOMS=['BG43','BG11','BG12','BG13','BG14','BG15','BG16','BG17','BG23','BG24','BG27','BG28']; /* tiếng thằn lằn chỉ có ở trong nhà biệt thự */
const AMBIENCE={
 BG01:{market:.22},                        /* cổng làng, đông người */
 BG02:{market:.12},                        /* ngõ làng, tiếng ồn xa dần */
 BG03:{water:.5,frogs:.35},                /* ruộng có mương: nước chảy + ếch */
 BG04:{water:.6,frogsNight:.9,crickets:.5},  /* cầu gỗ lúc chiều muộn: ếch + dế */
 BG05:{frogsNight:.6,crickets:.55,forest:.2},         /* ven rừng ban đêm */
 BG06:{crickets:.4,forest:.3},                        /* rừng tre: dế thưa dần; sang BG07 tắt hẳn (Nam: dế im phăng phắc) */
 BG25:{rain:.1,crickets:.2},BG29:{forest:.3,crickets:.2},BG38:{rain:.26},BG39:{rain:.24},BG40:{forest:.65,crickets:.1},BG41:{forest:.25},BG42:{crickets:.35,forest:.15},BG44:{crickets:.55,frogsNight:.3,forest:.2},
 BG11:{house:.4},BG12:{house:.4},BG13:{house:.4},BG14:{house:.4},BG15:{house:.4},BG16:{house:.4},BG17:{house:.4},BG23:{house:.4},BG24:{house:.4},BG27:{house:.4},BG28:{house:.4},BG43:{house:.35},BG34:{house:.25},BG35:{house:.25},
 BG21:{musicbox:.5},                        /* bên kia gương: hộp nhạc đang phát sáng, giai điệu ru (Für Elise) */
 BG22:{musicbox:.32}                        /* đáy giếng: nhạc vọng xuống nhỏ hơn; tắt sau khi gọi tên Mơ */
};
function playSound(name,volume=.25,from=0,dur=0){if(!state.sound)return;const file=SOUND[name];if(!file)return;try{const a=new Audio(ROOT+'sound/'+file);a.volume=Math.min(1,volume*2.2);const start=()=>{try{if(from)a.currentTime=from}catch(_){}a.play().catch(()=>{});if(dur)setTimeout(()=>{const v=a.volume,t=setInterval(()=>{a.volume=Math.max(0,a.volume-v/6);if(a.volume<=.001){clearInterval(t);a.pause()}},40)},dur*1000)};(from&&a.readyState<1)?a.addEventListener('loadedmetadata',start,{once:true}):start()}catch(_){}}
/* Âm thanh nền theo cảnh: nhiều lớp phát cùng lúc, lớp nào không còn thuộc cảnh mới thì tắt dần */
const AMB_GAIN=.9; /* hệ số âm nền chung: .9 = giảm 10% so với bảng AMBIENCE */
const ambient={};
function fadeTo(e,to,ms,done){clearInterval(e.fade);const a=e.a,from=a.volume,steps=Math.max(1,Math.round(ms/50));let i=0;e.fade=setInterval(()=>{i++;a.volume=Math.max(0,Math.min(1,from+(to-from)*i/steps));if(i>=steps){clearInterval(e.fade);if(done)done()}},50)}
function setAmbience(){
 let want=(state.sound&&$('title-screen').hidden)?(AMBIENCE[state.scene]||{}):{};
 if(state.flags.sixthDone&&want.musicbox){want={...want};delete want.musicbox}
 for(const name of Object.keys(ambient)){if(!(name in want)){const e=ambient[name];delete ambient[name];fadeTo(e,0,900,()=>e.a.pause())}}
 for(const [name,vol] of Object.entries(want)){
  const e=ambient[name];
  if(e){if(e.a.paused)e.a.play().catch(()=>{});fadeTo(e,vol*AMB_GAIN,900);continue}
  try{const a=new Audio(ROOT+'sound/'+SOUND[name]);a.loop=true;a.volume=0;const entry={a};ambient[name]=entry;a.play().catch(()=>{});fadeTo(entry,vol*AMB_GAIN,1400)}catch(_){}
 }}
function stopAmbience(){stopGecko();for(const name of Object.keys(ambient)){const e=ambient[name];delete ambient[name];clearInterval(e.fade);e.a.pause()}}
/* Thạch sùng: không còn kêu liên tục. Cứ 2 phút (tính thời gian ở trong nhà biệt thự) phát đúng 3 giây rồi tắt.
   than_lan_keu_3s.mp3 là đoạn 3,0 s cắt từ tệp gốc, tắt dần ở 0,25 s cuối; timer chỉ là chốt an toàn. Lần đầu vào nhà kêu sau ~20 s. */
const GECKO_EVERY=120,GECKO_FIRST=100,GECKO_MS=3000,GECKO_VOL=.3;
let geckoClock=GECKO_FIRST,geckoA=null,geckoStopT=0;
function stopGecko(){clearTimeout(geckoStopT);if(geckoA){try{geckoA.pause()}catch(_){}geckoA=null}}
function geckoBurst(){stopGecko();try{const a=new Audio(ROOT+'sound/'+SOUND.gecko);a.volume=GECKO_VOL;geckoA=a;a.play().catch(()=>{if(geckoA===a)geckoA=null});geckoStopT=setTimeout(()=>{if(geckoA===a){a.pause();geckoA=null}},GECKO_MS)}catch(_){}}
/* Tiếng quạ: chỉ ở ngoài trời/rừng, thưa thớt (45–100 giây một tiếng), không có trong nhà hay ký ức 1988 */
const CROW_SCENES=['BG01','BG02','BG05','BG06','BG08','BG09','BG10','BG25','BG29','BG40','BG41'];
let crowClock=40+Math.random()*30;
function crowTick(){if(document.hidden||!state.sound||!$('title-screen').hidden||!CROW_SCENES.includes(state.scene)||modalType)return;if(--crowClock<=0){crowClock=45+Math.random()*55;playSound('crow',.18)}}
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
function gain(id){if(!ITEMS[id]||has(id)||state.used.includes(id))return false;state.items.push(id);if(ITEMS[id].relic&&!state.relics.includes(id))state.relics.push(id);if(PAPER_ITEMS.includes(id))playSound('page',.22);else playSound('pick',.5);itemPop(id);save();renderSidebar();return true}
/* Vật phẩm dùng xong thì bị xóa khỏi túi đồ và không nhặt lại được (state.used). quiet=true: không hiện thông báo. */
function consume(id,quiet){if(!state.used.includes(id))state.used.push(id);const had=has(id);state.items=state.items.filter(x=>x!==id);if(state.selectedItem===id)state.selectedItem=null;if(had&&!quiet&&ITEMS[id])toast('Đã dùng hết: '+ITEMS[id].name);renderSidebar();save()}
function evidence(id){if(!state.evidence.includes(id))state.evidence.push(id);save();}
function toast(msg){const el=$('toast');el.textContent=msg;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),2700)}
function itemArt(id,cls){const info=ITEMS[id],box=document.createElement('span');box.className=cls;if(info.image){const img=document.createElement('img');img.src=IMG(info.image);img.alt='';img.draggable=false;box.appendChild(img)}else{box.classList.add('is-emoji');box.textContent=info.emoji||'◆'}return box}
function setDialogueMode(on){$('app-shell').classList.toggle('in-dialogue',on)}
let dlgQueue=[],dlgCb=null;
function say(who,text){dlgQueue=[];showLine(who,text);setNextLabel()}
function talk(lines,cb){const l=(lines||[]).filter(Boolean);if(!l.length)return;say(l[0][0],l[0][1]);dlgQueue=l.slice(1);dlgCb=cb||null;setNextLabel()}
function setNextLabel(){const b=$('dialogue-next');if(b)b.innerHTML=dlgQueue.length?'TIẾP <span>›</span>':'ĐÓNG <span>✕</span>'}
function nextLine(){if(window.finishTyping&&window.finishTyping())return;if(dlgQueue.length){const [w,t]=dlgQueue.shift();showLine(w,t);setNextLabel()}else{const cb=dlgCb;clearDialogue();if(cb)cb()}}
function showLine(who,text){const pf=PORTRAITS[who],isPerson=!!pf;
 $('dialogue-portrait-wrap').hidden=!isPerson;$('dialogue').classList.toggle('has-portrait',isPerson);$('dialogue-symbol').hidden=isPerson;
 if(isPerson){$('dialogue-portrait').src=PORTRAIT(pf);$('dialogue-portrait').alt='Chân dung '+who}
$('dialogue-speaker').textContent=who;$('dialogue-text').textContent=text;
 $('chatter').classList.remove('on');
 $('dialogue').hidden=false;dialogueOpen=true;setDialogueMode(true)}
function clearDialogue(){dlgQueue=[];dlgCb=null;$('dialogue').hidden=true;dialogueOpen=false;setDialogueMode(false)}
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
function go(target){if(target==='BG11'&&state.flags.lamAwake&&!state.flags.lamDone)target='BG23';if(!SCENES[target])return;const from=state.scene,first=!state.visited.includes(target);state.scene=target;if(first)state.visited.push(target);clearDialogue();hideModal();render();if(first&&SCENES[target].intro)talk(introOf(target));if(first&&(target==='BG18'||target==='BG19'))setTimeout(()=>playSound('knock',.13),2600);else if((from==='BG11'||from==='BG23')&&target==='BG10')playSound('door',.22);if(target==='BG44')setTimeout(campTalk,600);save();}
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
 $('scene-title').textContent=s.name;$('scene-stage').dataset.tint=s.tint||'';$('clock-label').textContent=s.time;$('chapter-label').textContent=state.flags.mo?'CHƯƠNG 9B · ĐÊM 17/3/1988':(s.chapter==='CHƯƠNG 10 · NĂM CÁI TÊN'&&arcOn())?'CHƯƠNG 9B · BÁT CƠM NÓNG':(questOn()&&/^CHƯƠNG 10/.test(s.chapter)?'CHƯƠNG 10 · NĂM CÁI TÊN':s.chapter);$('scene-index').textContent=`${state.scene} / ${Object.keys(SCENES).length}`;
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
function getObjective(){if(arcOn()&&state.flags.lamDone){if(!state.flags.riceSeen)return ['Bát cơm nóng','Trên bàn thờ phòng thờ (BG12) có một bát cơm còn nóng. Hãy xem ai đã đặt nó ở đó.'];if(!state.flags.footTrail)return ['Dấu chân nhỏ','Bật đèn pin rồi soi sàn gian bếp (BG13) để lần theo dấu chân nhỏ.'];if(!state.flags.diaryDone)return ['Nhật ký cô Lụa','Cuốn nhật ký trên bàn ở gác nhỏ (BG43) có ba trang rời. Sắp chúng theo thứ tự thời gian.'];return ['Đêm 17/3','Mơ muốn cho bạn thấy đêm ấy. Hãy đi theo em.']}if(questOn()){const n=namesFound().length;if(n>=5)return ['Khấn tên năm người','Đủ năm tên rồi. Lấy năm nén nhang trong miếu cây đa (BG05, chạm vào miếu), rồi ra vườn sau khấn từng cái tên trước năm nấm mộ.'];return ['Năm cái tên','Cổng sắt vẫn khóa. Tìm tên năm người ở lại đêm ấy ('+n+'/5): giếng sân (BG09), bếp (BG13), phòng học của Mơ sau tủ quần áo ở phòng trẻ, kho vật tư ở sân sau và kho đồ lễ bên dưới. Két sắt phòng ngủ ông Lâm mở bằng năm khắc trên khóa.']}if(state.flags.sixthDone&&!state.flags.lamDone)return ['Bóng ông Bá Lâm','Ánh đỏ ở đại sảnh BG11. Tìm lời khai bà Mận ở gác mái (nắp trần hành lang BG15) rồi đối chất bằng đủ chứng cứ.'];if(state.flags.awakened&&!state.flags.sixthDone)return ['Cái tên thứ sáu','Tiếng khóc vọng từ phòng trẻ (BG16). Manh mối: '+(state.flags.clues||[]).length+'/3. Tìm chuông đồng ở giếng sân, giấy tờ ở phòng làm việc, rồi nôi trẻ.'];if(state.flags.ritualDone)return ['Rời khỏi biệt thự','Trở ra cổng sắt ở BG08. Quyết định đem chứng cứ đi hay bỏ lại.'];const n=parseInt(state.scene.slice(2));if(n<=4)return ['Tìm ngôi miếu ven rừng','Đi từ cổng làng, qua ngõ và cánh đồng tới cây đa.'];if(n<=7)return ['Tìm lối đến biệt thự','Qua rừng tre và kiểm tra cột mốc đá để tìm chìa khóa.'];if(n===8&&!state.flags.gateOpened)return ['Mở khóa cổng sắt','Chìa khóa nằm gần cột mốc cũ ở rừng sâu (BG07).'];if(!state.flags.wallOpened&&n>=18)return ['Mở bức tường tầng hầm','Hãy dùng thanh sắt trong bếp (BG13) phá lớp vữa che lấp năm dấu tay.'];if(state.relics.length===5)return ['Trả lại năm di vật','Quay về bàn thờ gia tiên BG12, đặt các di vật theo thứ tự khám phá.'];if(state.flags.wallOpened)return ['Thu thập bằng chứng cuối cùng','Hãy tìm di vật và hộp tài liệu trong căn phòng kín BG20.'];return ['Điều tra biệt thự Vân Hòa',`Đã tìm thấy ${state.relics.length}/5 di vật. Khám phá sân, gian bếp, phòng trẻ, phòng làm việc và hầm kín.`]}
function selectItem(id){if(id==='flashlight'){state.flashlight=!state.flashlight;toast(state.flashlight?'Đèn pin: BẬT':'Đèn pin: TẮT');playSound('switch',.19);render();save();return}else if(id==='notebook'){showJournal();return}else if(READ_ITEMS[id]){showDoc(READ_ITEMS[id]);return}else if(id==='camera'){}else if(id==='lighter'){toast('Chiếc bật lửa cũ vẫn còn gas.')}state.selectedItem=state.selectedItem===id?null:id;render();save();if(id==='camera'&&state.selectedItem==='camera')toast('Máy ảnh: '+CAM_MODES[state.camMode].label+' · nhấn V để đổi chế độ')}
function act(action){if(modalType)return;clearDialogue();playSound('steps',.5,0,action.startsWith('travel:')?2.4:1.6);if(nameClueAt(action)){renderSidebar();return}if(action.startsWith('travel:')){const to=action.slice(7);if(to==='BG06'&&!has('incense')&&!state.used.includes('incense')){say('Tuyết','Khoan đã... tớ thấy bất an lắm. Mình xem kỹ chỗ này trước khi vào rừng đã.');return}go(to);return}
 if(action.startsWith('inspect:')){inspect(action.slice(8));return}
 switch(action){
  case 'huu':huuTalk();break;
  case 'lampSix':lampSix();break;
  case 'warning':note('oldwoman','Lời bà bán nước','Người làng cảnh báo: không vào rừng sau khi trời tối, không trả lời tiếng gọi tên mình.');talk([["Bà bán nước","Năm đứa thật à? Sáng nay tao vừa thấy sáu cái bóng... mà thôi, tao già rồi, nhìn nhầm."],["Đông","Dạ, bọn cháu chỉ đi khảo sát truyền thuyết thôi ạ. Bà có biết ngôi biệt thự trong rừng không?"],["Bà bán nước","Đừng nhắc! ...Hồi tám mấy, làng mất mấy người trong cùng một đêm. Từ đó ai đi qua cây đa cũng không dám ngoái lại. Khổ lắm con ạ."],["Tuyết","Bà cháu kể đêm ấy là đêm mười bảy tháng Ba. Có đúng không ạ?"],["Bà bán nước","Biết rồi thì tránh đi con. Trời tối đừng vào rừng, nghe ai gọi tên mình cũng đừng trả lời. Bà xin mấy đứa."],["Nguyệt","Cháu ghi lại rồi ạ. Cảm ơn bà... Bà cũng giữ sức khỏe nhé."]]);break;
  case 'shrine':if(state.flags.lamDone){go('BG31');break}if(!gain('incense')){say('Nguyệt','Bát hương chỉ còn lớp tàn lạnh.');break}note('shrine','Bát hương ven rừng','Nhang cũ chưa đốt. Trên mảnh giấy mờ chỉ đọc được: “Năm hồn giữ cửa, một bóng giữ nhà.”');talk([["Nguyệt","Nhang này còn dùng được, tớ giữ lại. ...Dưới chân bát hương có một mảnh giấy nhàu, chữ nhòe gần hết."],["Tuyết","“Năm hồn giữ cửa, một bóng giữ nhà.” ...Một bóng là ai nhỉ? Đọc xong tự nhiên tớ lạnh hết cả gáy."],["Đông","Chưa biết. Cứ giữ lại, biết đâu cần. Đừng nghĩ nhiều quá, Tuyết."]]);break;
  case 'marker':if(!gain('key')){say('Nam','Khe đá giờ trống rỗng.');break}note('marker','Chìa ở cột mốc đá','Một chìa khóa sắt rỉ nằm trong khe đá, hướng về cổng biệt thự.');talk([["Nam","Đây rồi! Chìa khóa cổng, nằm trong khe đá. Sao lại có người giấu nó ở chỗ này nhỉ?"],["Ánh","Chìa còn mới hơn khóa cổng nhiều. Chắc có người thường xuyên ra vào, hoặc thường xuyên đặt nó ở đây... Nghĩ thế càng sợ."],["Đông","Thôi, đi nào. Nhưng đừng ai quên đường về."]]);break;
  case 'gate':if(!state.flags.gateOpened){if(!has('key')){say('Đông','Cổng bị xích, ổ khóa còn nguyên. Chắc phải có chìa ở đâu đó.');break}state.flags.gateOpened=true;consume('key');note('gate','Cổng sắt mở khóa','Chiếc chìa rỉ vừa khít với ổ khóa cổng. Cánh cổng khép lại rất mạnh sau khi cả nhóm đi qua.');playSound('door',.2);setTimeout(()=>playSound('slam',.32,SLAM_LEAD),1400);talk([["Nam","Được rồi... khóa bật ra rồi. Nhưng sao cánh cổng tự khép mạnh thế? Mới nãy tớ còn đứng ngay đó!"],["Đông","Gió thôi. Vào đi, nhớ đừng tách nhau."],["Tuyết","Bà bán nước không nói dối. Nhưng tớ vẫn muốn biết sự thật. Tớ không thể đứng nhìn rồi bỏ đi."]]);renderSidebar();save()}else go('BG09');break;
  case 'exitForest':if(arcOn()&&state.flags.lamDone){say('Mơ','Cổng vẫn khóa, chị ạ. Chị nhìn bát cơm trên bàn thờ giúp em trước đã.');break}if(state.flags.namesDone&&!state.flags.forestDone){go('BG40');break}if(questOn()){say('Mơ','Cổng vẫn khóa, chị ạ. Năm người dưới hầm chưa có tên. Chị đi tìm: giếng, bếp, phòng học của em, kho vật tư, rồi cả kho đồ lễ bên dưới. Họ sẽ nói cho chị biết.');break}if(state.flags.sixthDone&&!state.flags.lamDone){say('Đông','Có thứ gì đó vẫn chặn cửa chính ở đại sảnh. Phải giải quyết nó trước khi rời đi.');break}if(state.flags.awakened&&!state.flags.sixthDone){say('Nam','Cổng nặng như đá, và tiếng khóc phía sau cứ kéo mình lại. Còn một người nữa chưa được gọi tên.');break}if(!state.visited.includes('BG11')){say('Đông','Chúng ta đã đến được biệt thự. Ít nhất phải tìm hiểu chuyện gì xảy ra bên trong trước khi quay về.');break}showEscapeChoice();break;
  case 'well':if(state.flags.awakened&&!has('bell')&&!state.used.includes('bell')){clue('well');gain('bell');note('bell','Chuông đồng dưới đáy xô','Chiếc xô giếng vừa kéo lên có một chuông đồng nhỏ buộc dây đỏ, loại chuông người ta buộc cho trẻ con khỏi lạc.');say('Tuyết','Chuông trẻ con ở dưới giếng... Ai đã thả nó xuống?');break}if(gain('scarf')){note('scarf','Di vật 1 — giếng đá','Một chiếc khăn vải cũ mắc dưới nắp gỗ bên giếng. Đây có thể là di vật của người mất tích.');talk([["Tuyết","Khăn này không giống đồ gia chủ. Có lẽ của một người làm công. Chạm vào mà tay tớ cứ lạnh dần."],["Nguyệt","Tớ nghĩ nó thuộc về một trong năm người. Mình sẽ giữ gìn cẩn thận. Họ xứng đáng được mang về."],["Nam","Dưới giếng có tiếng nước chảy nhè nhẹ. ...Dù giếng này khô cạn từ lâu rồi. Nghe thật mà."]])}else say('Nam','Dưới giếng tối om. Chúng ta đã lấy chiếc khăn mắc ở nắp gỗ rồi.');break;
  case 'frontDoor':if(!state.flags.frontOpened){state.flags.frontOpened=true;note('front','Cửa vào biệt thự','Cánh cửa gỗ không khóa, nhưng kêu kéo dài như tiếng thở.');save()}playSound('door',.22);go('BG11');break;
  case 'clock':state.flags.clockSeen=true;note('clock','Đồng hồ dừng ở 03:17','Chiếc đồng hồ quả lắc ở đại sảnh đã dừng hẳn, kim chỉ đúng 03 giờ 17 phút.');save();showPicture('prop_clocks.webp','Đồng hồ quả lắc','Hai kim dừng cứng ở 03 giờ 17 phút. Con lắc đồng nằm im.','QUAN SÁT',()=>talk([["Nguyệt","Kim đồng hồ chết cứng từ lâu. Tớ chép giờ vào sổ ngay."],["Tuyết","Không có một tiếng tích tắc nào. Cả ngôi nhà như đang nín thở. Tớ cũng nín thở theo."],["Đông","Ghi lại hết đi. Chi tiết nào cũng có thể quan trọng, kể cả cái nhỏ nhất."]]),['Mở ngăn dưới đồng hồ',showClockPuzzle]);break;
  case 'photo':note('photo','Bức ảnh gia đình','Trong ảnh gia đình ông Bá Lâm, vài khuôn mặt bị cào xước. Sự kiện 1988 có thể đã bị che giấu.');showPicture('prop_family_picture.webp','Ảnh gia đình ông Bá Lâm','Năm khuôn mặt đều bị cào xước đến không còn nhận ra.','QUAN SÁT',()=>talk([["Ánh","Có những khuôn mặt bị cào đi. Như thể ai đó muốn xóa tên họ khỏi ký ức. Tớ thấy... đau."],["Nguyệt","Xóa tên khỏi ảnh, khỏi sổ sách, khỏi lời kể của cả làng... Ai làm thế được chứ?"],["Nam","Một người rất sợ họ được nhớ tới. Sợ đến mức làm mọi cách để họ biến mất."]]),['Lật mặt sau khung ảnh',showCipher]);break;
  case 'altar':showAltar();break;
  case 'spoon':if(gain('spoon')){note('spoon','Di vật 2 — gian bếp','Chiếc muôi cơm rỉ nằm trong tro bếp nguội, dấu tích của một người đã từng làm việc ở đây.');talk([["Tuyết","Một chiếc muôi đã mất cán. Thứ tưởng nhỏ nhặt thế này mà lại giữ lại cả một đời người."],["Nguyệt","Một người nấu cơm cho cả đại gia đình, rồi bị quên. Tớ sẽ ghi vào sổ. Tên bác ấy, tớ sẽ tìm cho ra."]])}else toast('Đã thu thập chiếc muôi cơm.');break;
  case 'crowbar':if(gain('crowbar')){note('crowbar','Thanh sắt trong bếp','Một thanh sắt cong, còn khá chắc, nhặt dưới gầm bếp củi.');talk([["Nam","Thanh sắt này còn chắc. Mang theo cũng không thừa. ...Cứ có thứ gì đó trong tay là tớ thấy đỡ run hơn."],["Đông","Chỉ dùng khi thật cần. Mình không phá nhà người ta bừa bãi."],["Nam","Yên tâm. Tớ chỉ muốn có thứ gì đó trong tay thôi."]])}else toast(state.used.includes('crowbar')?'Dưới gầm bếp chẳng còn gì.':'Thanh sắt đã nằm trong túi đồ.');break;
  case 'comb':if(gain('comb')){note('comb','Di vật 3 — phòng trẻ','Một chiếc trâm gỗ bị gãy nằm trong nôi cũ, bên cạnh con búp bê vải.');talk([["Ánh","Trong nôi có một chiếc trâm gỗ gãy... Tớ nhớ đã nhìn thấy nó trong ảnh cũ. Ai đã cầm nó?"],["Tuyết","Chiếc trâm của người lớn mà nằm trong nôi trẻ con. Có người từng ru em bé ở đây, ru rất lâu."],["Ánh","Nghe tiếng hát khẽ không? ...Chắc là tớ nghe nhầm. Mà tớ cũng không muốn nghe nhầm nữa."]])}else toast('Đã thu thập chiếc trâm gỗ.');break;
  case 'mirror':if(state.selectedItem==='camera'){camFlash();state.flags.mirrorPhoto=true;note('mirror','Bóng người trong ảnh','Máy ảnh của Ánh ghi lại một bóng trắng gần giường, dù căn phòng và gương hoàn toàn trống.');playSound('camera',.33);talk([["Ánh","Tớ vừa chụp... Có ai đó trong ảnh! Nhưng khi quay lại, không còn gì cả!"],["Nam","Cho tớ xem. ...Bóng trắng ngay cạnh giường. Cao chỉ tới ngang hông tớ. Trời ơi."],["Tuyết","Một đứa trẻ. Chắc chắn là một đứa trẻ. Em đang nhìn tụi mình."],["Nguyệt","Tớ ghi lại. Mình sẽ tìm cho ra em là ai. Em đừng sợ."]]);save()}else say('Ánh','Gương chỉ phản chiếu căn phòng trống. Nhưng tớ cứ thấy nó đang nhìn mình.');break;
  case 'ledger':if(state.relics.includes('petition')){say('Nguyệt','Trang sổ đã được chụp lại. Mảnh đơn đã ghép xong, cần tìm thêm tài liệu gốc để đối chiếu.');break}
   if(!state.evidence.includes('ledger')){evidence('ledger');note('ledger','Sổ vật tư năm 1988','Sổ cấp phát cho thấy nến, giấy sớ và vải che ô gió được cấp cho thầy Tịnh theo chữ ký ông Bá Lâm. Một mảnh đơn tố cáo bị xé làm ba, mảnh thứ ba kẹp giữa các trang.');playSound('page');gain('fragC');talk([["Nguyệt","Đúng rồi. Phiếu cấp đồ lễ, có cả vải che ô thông gió. Bằng chứng đầu tiên nằm ngay đây... Tay tớ run quá."],["Đông","Cấp vải che ô thông gió cho một căn hầm có người. Tớ không tin nổi."],["Nguyệt","Còn mảnh giấy kẹp trong sổ... bị xé rách làm ba. Hai mảnh kia chắc còn ở đâu đó trong nhà."],["Tuyết","Nếu họ là năm người ở dưới hầm... thì mọi chuyện đã rõ một nửa. Thương họ quá."]],checkAssemble)}else checkAssemble(true);break;

  case 'safe':showSafe();break;
  case 'sealedWall':if(state.flags.wallOpened){go('BG20');break}if(!has('crowbar')){say('Nam','Lớp vữa đã mục, nhưng tay không thì không thể phá được.');break}showWall();break;
  case 'sandals':if(gain('sandals')){note('sandals','Di vật 5 — căn phòng kín','Đôi dép vải cũ nằm cạnh đồ dùng của năm người mất tích năm 1988.');talk([["Nguyệt","Năm người đã nằm lại đây, bị khóa phía sau bức tường... Tớ sẽ không để họ bị lãng quên. Không bao giờ."],["Đông","Có đủ năm di vật rồi. Mình quay về phòng thờ thôi."],["Tuyết","Đi theo đúng hành trình mình đã tìm ra: sân, bếp, phòng trẻ, phòng làm việc, hầm kín."]])}else toast('Đã thu thập đôi dép vải.');break;
  case 'archive':if(!state.evidence.includes('archive')){evidence('archive');note('archive','Hộp chứng cứ dưới hầm','Trong hộp sắt có sổ cấp đồ lễ và giấy tờ chứng minh ông Bá Lâm ký cấp vật tư cho buổi lễ.');playSound('page');talk([["Đông","Chúng ta có hồ sơ gốc rồi! Nếu còn bản thú tội trong phòng làm việc thì sự thật có thể được chứng minh."],["Nguyệt","Sổ cấp đồ lễ, giấy xác nhận... Tất cả đều có chữ ký ông Bá Lâm. Nhìn chữ ký này, tớ ghét nó."],["Nam","Giờ mình chỉ cần mang chúng ra khỏi đây an toàn. Phải sống sót để đem sự thật ra ánh sáng."]])}else say('Nguyệt','Tài liệu trong hộp đã được lưu lại. Hãy mang bằng chứng ra ngoài.');break;
  case 'cradle':{const c=state.flags.clues||[];if(!c.includes('cradle')){clue('cradle');note('cradle','Mảnh vải thêu trong nôi','Mảnh vải thêu dở trong nôi: “Thị M…”. Chiếc nôi tự đung đưa dù không có gió.');talk([["Ánh","Nôi đang rung... có chữ thêu dở: “Thị M”. Tớ nghe tiếng khóc ngay cạnh tai!"],["Tuyết","Tớ cũng nghe. Là tiếng một đứa trẻ khóc... khóc rất khẽ. Trời ơi."],["Nguyệt","“Thị M...” Tên một cô bé. Mình phải tìm đủ manh mối để biết em là ai. Em ơi, đợi chị."]])}else if(state.used.includes('bell')){if(state.flags.sixthDone)say('Ánh','Nôi đã lặng. Em không còn khóc nữa.');else go('BG21')}else if(!has('bell'))say('Ánh','Chiếc nôi vẫn khẽ đung đưa, như đang chờ một điều gì đó.');else if(state.selectedItem!=='bell')say('Nguyệt','Chiếc nôi lại rung khi tớ đứng gần. Trong túi mình có thứ gì khiến nó phản ứng không?');else if(c.length<3)say('Nguyệt','Chuông chỉ rung yếu ớt rồi lặng đi.');else{consume('bell');go('BG21')}break}
  case 'birth':if(clue('birth')){note('birth','Giấy khai sinh bị xé','Lâm Thị Mơ, sinh 1981, con gái út ông Bá Lâm. Dòng cuối: “mất tích đêm 17/3/1988”, bị gạch khỏi sổ hộ khẩu.');talk([["Nguyệt","Mơ... mới bảy tuổi. Mất tích đúng ngày 17 tháng 3. Là 03:17."],["Đông","Con gái út của ông Bá Lâm. Vậy mà tờ khai sinh lại bị xé bỏ."],["Nguyệt","Ông ta đã xóa chính con mình khỏi sổ hộ khẩu. Chuyện này không còn là tham ô nữa. Đây là tội ác."]])}else say('Nguyệt','Tờ khai sinh đã được ghi vào nhật ký.');break;
  case 'girl':state.flags.girlHeard=true;save();say('Mơ','Chị ơi... đừng gọi em bằng tên của cha. Em ngủ ở dưới kia, một mình, cùng giai điệu ấy.');break;
  case 'musicbox':if(gain('musicbox'))talk([["Ánh","Hộp nhạc vẫn chạy được. Tớ đã nghe giai điệu này trong giấc mơ... Nó làm tớ muốn khóc."],["Nguyệt","Giai điệu ấy như một bài ru. Có ai từng hát nó bên chiếc nôi này, hát cho em nghe."]]);else toast(state.used.includes('musicbox')?'Hộp nhạc đã lặng im.':'Hộp nhạc đã nằm trong túi đồ.');break;
  case 'smalldoor':if(state.flags.sixthDone)say('Nguyệt','Cánh cửa nhỏ đã lặng im. Dưới đó không còn ai khóc nữa.');else if(!state.flags.girlHeard)say('Nguyệt','Cánh cửa nhỏ không nhúc nhích, như có ai giữ nó từ phía bên kia.');else if(!has('musicbox'))say('Nguyệt','Cánh cửa vẫn không nhúc nhích. Có lẽ còn thiếu một thứ.');else{playSound('door',.25);go('BG22')}break;
  case 'shirt':if(state.flags.sixthDone)say('Mơ','Em nhớ tên mình rồi.');else if(state.selectedItem==='musicbox')showSixth();else say('Nguyệt','Chiếc áo lạnh buốt. Nó nằm im, không đáp lại.');break;
  case 'lamdoor':showLam();break;
  case 'testimony':if(gain('testimony')){evidence('testimony');note('testimony','Lời khai của bà Mận','Bà Mận viết: đêm 17/3/1988 bà thấy ông Lâm bế cháu Mơ về phía giếng, từ đó không còn nghe tiếng cháu. Bà ở lại gác mái đến hết đời để giữ bằng chứng.');say('Bà Mận','Đêm ấy tôi thấy ông Lâm bế cháu Mơ ra giếng. Tôi không dám lên tiếng. Xin hãy thay tôi nói điều đó.')}else say('Nguyệt',state.used.includes('testimony')?'Chiếc hòm giờ trống. Lời khai đã được đọc lên.':'Lời khai đã nằm trong túi.');break;
  case 'takeDoll':takeToy('toyDoll',[['Ánh','Con búp bê vải nằm bên gối, váy hoa đã mục. Tớ mang nó theo, em sẽ muốn có nó.'],['Mơ','Đó là búp bê của em. Cô Lụa khâu nó cho em.']],'Mình đã lấy con búp bê rồi.');break;
  case 'takeCrane':takeToy('paperCrane',[['Ánh','Một con hạc giấy trên sợi chỉ. Mình lấy một con thôi, để lại phần còn lại cho em.']],'Đã lấy một con hạc giấy rồi, mình để lại phần còn lại cho em.');break;
  case 'takeCart':takeToy('toyCart',[['Nam','Chiếc xe gỗ bánh nhỏ xíu. Em từng kéo nó khắp phòng. Tớ giữ nó cẩn thận.']],'Mình đã lấy chiếc xe gỗ rồi.');break;
  case 'chalkBoard':chalkBoard();break;
  case 'toyShelf':toyShelf();break;
  case 'tornPhoto':tornPhoto();break;
  case 'hatchLock':hatchLock();break;
  case 'storeDoor':if(state.flags.storeOpen){go('BG26');break}if(has('storekey')&&state.selectedItem==='storekey'){state.flags.storeOpen=true;consume('storekey');note('store','Kho vật tư mở khóa','Chiếc chìa đồng giấu dưới đệm ghế bập bênh vừa khít ổ khóa. Cánh cửa kho kêu lên một tiếng dài.');playSound('door',.24);go('BG26')}else if(has('storekey'))say('Nguyệt','Chìa đã trong túi. Chọn nó rồi chạm vào ổ khóa.');else say('Nam','Khóa đồng to bằng nắm tay, kiểu khóa kho vật tư. Chìa chắc nằm đâu đó trong nhà này.');break;
  case 'lamSafe':showLamSafe();break;
  case 'chair':if(!state.flags.lamSafeOpen)say('Nguyệt','Chiếc ghế vẫn còn ấm như có người vừa đứng dậy. Mình chưa có lý do để lục nó.');else if(gain('storekey')){note('storekey','Chìa kho dưới đệm ghế','Dưới tấm đệm của chiếc ghế bập bênh trên ban công có một chiếc chìa đồng nhỏ, đúng chỗ ông Lâm viết trong nhật ký.');talk([['Ánh','Dưới đệm có thứ gì lạnh... Một chiếc chìa đồng!'],['Nguyệt','Đúng chỗ ông ấy viết. Nhìn xuống làng, nơi ông ngồi mỗi tối.'],['Đông','Chìa kho vật tư. Mình xuống sân sau thôi.']])}else say('Nguyệt',state.used.includes('storekey')?'Ghế bập bênh đã im.':'Chìa đã nằm trong túi đồ.');break;
  case 'incenseFive':if(!questOn()){say('Tuyết','Năm bát hương trống. Nhang đã được lấy đi.');break}if(gain('incense5')){note('incense5','Nhang bà Mận để dành','Năm nén nhang mới nằm ngay ngắn trong năm bát hương trên bàn đá trong miếu. Bà Mận để dành cho những người chưa có tên.');talk([['Tuyết','Năm nén nhang, mỗi bát một nén, chưa ai đốt.'],['Mơ','Của bà Mận đấy. Bà nói: “Có ngày người ta sẽ gọi đúng tên họ.”'],['Nguyệt','Chúng ta mang ra vườn sau. Mình sẽ không để bà chờ vô ích.']])}else say('Nguyệt','Nhang đã nằm trong túi. Mình ra vườn sau thôi.');break;
  case 'graves':showGraves();break;
  case 'riceBowl':riceBowl();break;
  case 'footTrail':footTrail();break;
  case 'luaDiary':luaDiary();break;
  case 'fbBowl':fbBowl();break;
  case 'fbMan':fbMan();break;
  case 'fbKeys':fbKeys();break;
  case 'fbCha':say('Mơ','Qua khe cửa, con thấy lưng cha. Cha ngồi rất lâu, không động đậy, tay cầm một tấm ảnh cũ.');break;
  case 'fbLua':fbLua();break;
  case 'fbBowls':say('Mơ','Then cửa bằng gỗ, cài từ bên ngoài. Con thử nhấc thì nó nặng quá, nhấc không nổi.');break;
  case 'fbSeal':fbSealPick();break;
  case 'fbLock':fbLock();break;
  case 'fbLeft':fbFall('left');break;
  case 'fbWell':fbFall('well');break;
  case 'fbLight':fbLight();break;
  case 'wellSealed':wellSealed();break;
  case 'campfire':campTalk();break;
  case 'redCloth':redCloth();break;
  case 'grandPhoto':grandPhoto();break;
  case 'forestAltar':forestAltar();break;
  default:toast('Chưa có tương tác ở vị trí này.');
 }
 renderSidebar();save();}
function inspect(k){if(k==='lamPortrait'&&!modalType){showPicture('prop_family_picture.webp','Ảnh gia đình ông Bá Lâm','Năm khuôn mặt đều bị cào xước đến không còn nhận ra.','QUAN SÁT',()=>inspect2('lamPortrait'));return}return inspect2(k)}
function inspect2(k){const texts={
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
 sacks:["Nam","Bao vữa khô cứng, vẫn còn dấu niêm phong của kho vật tư. Có người đã bịt hầm bằng chính số vật liệu này... tớ rùng mình."],
 belongings:["Nguyệt","Năm cụm đồ nằm sát tường. Không phải vật quý giá, nhưng là dấu vết của những con người thật. Từng người một."]
};Object.assign(texts,INSPECT2);const [who,text]=texts[k]||['Người kể chuyện',SCENES[state.scene].look];talk([[who,text],...(MORE[k]||[])])}
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
 return p.map(e=>`<div class="bk-entry"><div class="bk-no">Mục ${String(e.no).padStart(2,'0')}</div><div class="bk-title">${escapeHTML(e.title)}</div><div class="bk-body">${escapeHTML(e.body)}</div>${NOTE_HINT[e.id]?`<button type="button" class="bk-hint">Gợi ý cách mở</button><div class="bk-hinttext" hidden>${escapeHTML(NOTE_HINT[e.id])}</div>`:''}</div>`).join('')+`<div class="bk-folio">${i+1}</div>`}
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
 const bkClick=d=>e=>{const h=e.target.closest&&e.target.closest('.bk-hint');if(h){const t=h.nextElementSibling;if(t)t.hidden=!t.hidden;return}bookTurn(d)};$('bk-left').onclick=bkClick(-1);$('bk-right').onclick=bkClick(1);
 playSound('page',.28);
 const bk=$('bk'),rm=window.Perf&&Perf.RM;
 setTimeout(()=>{if(!book)return;bk.classList.remove('closed')},rm?0:380);
 setTimeout(()=>{if(!book)return;bk.classList.add('opened')},rm?0:1700);
 $('bk-next').focus({preventScroll:true})}
function showHint(){let hint='Quan sát các hình thoi màu nhạt. Mỗi cảnh đều có lối đi và đồ vật tương tác.';const n=Number(state.scene.slice(2));if(n<=5)hint='Hãy tới miếu BG05, chạm vào bát hương để lấy nhang trước khi vào rừng.';else if(n<=7&&!has('key')&&!state.flags.gateOpened)hint='Cột mốc đá ở BG07 giấu chìa khóa cổng.';else if(n<=10&&!state.flags.gateOpened)hint='Tìm chìa ở cột mốc BG07, sau đó quay về BG08 nhấp vào xích cổng.';else if(n>=11&&!state.relics.includes('spoon'))hint='Gian bếp BG13 có muôi cơm cũ và thanh sắt dưới bếp.';if(n===11&&!state.flags.clockSeen)hint='Nhấp vào đồng hồ quả lắc ở tường sau. Ghi nhớ thời điểm dừng.';if((n===11||n===17)&&state.flags.clockSeen&&!state.relics.includes('petition'))hint='Lá đơn tố cáo bị xé làm ba mảnh: một mảnh sau khung ảnh (cần giải mã), một mảnh trong ngăn kín dưới đồng hồ (cần chỉnh kim), một mảnh trong sổ vật tư ở BG17. Có đủ ba thì ghép trên bàn ông Lâm.';if(n===16&&!state.relics.includes('comb'))hint='Ở BG16 hãy kiểm tra chiếc nôi giữa phòng. Chọn máy ảnh để chụp chiếc gương.';if(n===17&&!state.flags.safeOpened)hint='Hộp sắt có khóa số bốn chữ số. Hãy nhớ lại thời điểm chiếc đồng hồ ở đại sảnh dừng lại.';if(n===19&&!state.flags.wallOpened)hint='Bức tường năm dấu tay không thể phá bằng tay không.';if(n===20)hint='Thu thập đôi dép cũ và mở hộp tài liệu góc phải trong BG20.';if(state.relics.length===5&&!state.flags.ritualDone)hint='Đã đủ năm di vật. Quay về phòng thờ BG12 và đọc lại nhật ký để đặt chúng theo đúng thứ tự.';if(state.flags.ritualDone)hint='Trở ra cổng sắt BG08. Nếu muốn kết thúc tốt nhất, cần đủ tài liệu: sổ bàn làm việc, hộp sắt mật mã và hộp tài liệu dưới hầm.';if(state.flags.sixthDone&&!state.flags.lamDone)hint='Ánh đỏ ở đại sảnh BG11. Lên hành lang tầng hai BG15, chạm nắp gác mái trên trần để lấy lời khai bà Mận. Rồi chạm cánh cửa đỏ và đáp từng lời ông Lâm bằng đúng chứng cứ: sổ vật tư, bản thú tội, lời khai.';if(state.flags.awakened&&!state.flags.sixthDone)hint='Tiếng khóc ở phòng trẻ BG16. Kéo xô giếng ở BG09 để lấy chuông, xem ngăn kéo ở BG17 và mảnh vải trong nôi BG16. Đủ 3 manh mối thì chọn chuông rồi chạm nôi. Bên kia gương: lấy hộp nhạc, nói chuyện với bóng bé gái, rồi vào cánh cửa nhỏ.';if(questOn())hint='Cổng sắt vẫn khóa cho tới khi gọi đủ năm cái tên. Tên nằm ở: giếng đá BG09, muôi cơm ở bếp BG13, bức tranh trong phòng học sau tủ quần áo phòng trẻ, cuốn sổ trong kho vật tư và vạch phấn trong kho đồ lễ. Chìa kho giấu ở nơi ông Lâm hay ngồi hóng gió; mở két sắt phòng ngủ ông bằng năm khắc trên khóa. Đủ tên thì lấy nhang ở miếu cây đa và khấn ở vườn sau.';if(arcOn()&&state.flags.lamDone)hint='Chị hãy xem bát cơm trên bàn thờ (BG12), bật đèn pin soi dấu chân trong bếp (BG13), lên gác nhỏ sau bếp đọc nhật ký cô Lụa, rồi theo Mơ về đêm 17/3/1988.';if(state.flags.mo)hint='Bạn đang là bé Mơ. Mỗi cảnh chỉ có vài điểm sáng, hãy làm theo thứ tự của đêm ấy: bếp, hành lang, cửa hầm sau bếp, rồi sân giếng.';
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

function showPicture(file,title,caption,kicker,after,extra){showModal(`<h2>${title}</h2><div class="prop-view"><img src="${IMG(file)}" alt="" draggable="false"></div><p class="modal-note">${caption}</p><div id="pic-actions" class="modal-buttons"></div>`,kicker||'QUAN SÁT','picture');if(extra)$('pic-actions').appendChild(modalButton(extra[0],()=>{hideModal();extra[1]()}));$('pic-actions').appendChild(modalButton('Đóng',()=>{hideModal();if(after)after()}));playSound('switch',.1)}
/* Khóa số bấm để nhảy số: bấm vào từng ô (hoặc cuộn chuột / phím ↑↓) để đổi chữ số */
function showLock({title,kicker,type,code,plate,hint,onOpen}){
 showModal(`<h2>${title}</h2><div class="lock-wrap"><img src="${IMG('prop_locker.webp')}" alt="" draggable="false">${plate?`<span class="lock-plate">${plate}</span>`:''}<div class="lock-wheels"></div></div><p class="modal-note" id="lock-msg">${hint}</p>`,kicker,type);
 const digits=[0,0,0,0],wrap=document.querySelector('.lock-wheels'),msg=$('lock-msg');let done=false;
 const check=()=>{if(done||digits.join('')!==code)return;done=true;wrap.classList.add('is-open');playSound('switch',.3);setTimeout(()=>{hideModal();onOpen()},650)};
 const bump=(i,d)=>{if(done)return;digits[i]=(digits[i]+d+10)%10;b[i].textContent=digits[i];b[i].classList.remove('tick');void b[i].offsetWidth;b[i].classList.add('tick');playSound('switch',.08);msg.textContent=hint;check()};
 const b=digits.map((_,i)=>{const e=document.createElement('button');e.type='button';e.className='lock-wheel';e.textContent='0';e.setAttribute('aria-label','Ô số '+(i+1));
  e.addEventListener('click',()=>bump(i,1));
  e.addEventListener('wheel',ev=>{ev.preventDefault();bump(i,ev.deltaY<0?1:-1)},{passive:false});
  e.addEventListener('keydown',ev=>{if(ev.key==='ArrowUp'){ev.preventDefault();bump(i,1)}else if(ev.key==='ArrowDown'){ev.preventDefault();bump(i,-1)}else if(ev.key==='ArrowLeft'&&b[i-1])b[i-1].focus();else if(ev.key==='ArrowRight'&&b[i+1])b[i+1].focus();else if(/^[0-9]$/.test(ev.key)){digits[i]=+ev.key;e.textContent=ev.key;check();if(b[i+1])b[i+1].focus()}});
  wrap.appendChild(e);return e});
 b[0].focus()}

/* ============ CHUỖI MẢNH ĐƠN: giải mã chữ cái → chỉnh kim đồng hồ → ghép ba mảnh ============ */
function hintBlock(hints){let lv=0;const wrap=document.createElement('div');wrap.className='hint-block';const p=document.createElement('p');p.className='modal-note hint-text';p.textContent='Cần giúp? Mỗi lần bấm cho một gợi ý rõ hơn.';
 const b=modalButton('GỢI Ý',()=>{if(lv<hints.length){p.textContent='Gợi ý '+(lv+1)+'/'+hints.length+': '+hints[lv];lv++;if(lv>=hints.length)b.disabled=true}});b.classList.add('hint-btn');wrap.append(b,p);return wrap}
const CIPHER_PLAIN='DONG HO DUNG LUC 11 GIO 45',CIPHER_SHIFT=7;
function caesar(s,k){return s.replace(/[A-Z]/g,c=>String.fromCharCode((c.charCodeAt(0)-65+k+26*4)%26+65))}
function checkAssemble(manual){if(!['fragA','fragB','fragC'].every(has)||state.relics.includes('petition'))return;if(manual===true)showAssemble();else toast('Đã đủ ba mảnh đơn. Ghép chúng trên bàn ông Lâm ở BG17.')}
function showCipher(){
 if(state.flags.cipherDone){say('Nguyệt','Mặt sau khung ảnh viết: “'+CIPHER_PLAIN+'”. Mình đã lấy mảnh giấy rồi.');return}
 const enc=caesar(CIPHER_PLAIN,CIPHER_SHIFT);let shift=0;
 showModal(`<h2>Mặt sau khung ảnh</h2><p>Có dòng chữ viết bằng mực phai, mỗi chữ cái bị dịch đi một số bước trong bảng chữ cái. Hãy xoay bánh giải mã cho tới khi đọc được.</p><div class="cipher-line" id="cipher-line"></div><div class="cipher-ctl"><button type="button" class="modal-option" id="cp-prev">◀</button><span id="cp-shift">Dịch: 0</span><button type="button" class="modal-option" id="cp-next">▶</button></div><p class="modal-note" id="cp-msg">Đọc ra một câu có nghĩa, rồi bấm “XÁC NHẬN”.</p><div id="cp-actions" class="modal-buttons"></div>`,'CÂU ĐỐ · MẬT MÃ','cipher');
 const line=$('cipher-line'),lab=$('cp-shift'),draw=()=>{line.textContent=caesar(enc,-shift);lab.textContent='Dịch: '+shift};draw();
 $('cp-prev').onclick=()=>{shift=(shift+25)%26;draw();playSound('switch',.08)};$('cp-next').onclick=()=>{shift=(shift+1)%26;draw();playSound('switch',.08)};
 $('cp-actions').append(modalButton('XÁC NHẬN',()=>{if(caesar(enc,-shift)!==CIPHER_PLAIN){$('cp-msg').textContent='Chữ vẫn chưa thành câu có nghĩa. Thử tiếp.';playSound('switch',.12);return}
   state.flags.cipherDone=true;hideModal();playSound('page',.25);if(gain('fragB'))note('fragB','Mảnh đơn thứ hai','Sau khung ảnh gia đình có dòng chữ mã hóa: “'+CIPHER_PLAIN+'”, và một mảnh giấy rách dán kín. Hãy nhớ giờ này.');
   talk([['Nguyệt','“'+CIPHER_PLAIN+'”. Một giờ giấc. Mười một giờ bốn mươi lăm.'],['Đông','Dòng chữ nhắc tới đồng hồ. Chiếc đồng hồ quả lắc ngay đại sảnh này?'],['Ánh','Còn mảnh giấy rách dán sau khung. Cũng như tờ đơn bị xé, tớ có cảm giác còn hai mảnh nữa.']]);save();checkAssemble()}));
 $('cp-actions').append(modalButton('Đóng',hideModal));
 $('modal-body').appendChild(hintBlock(['Mỗi chữ cái bị đẩy lùi cùng một số bước.','Thử dịch vài bước, nhìn xem chữ đầu tiên có thành chữ quen thuộc không.','Chữ đầu tiên của câu là chữ D. Thử dịch tới khi đọc được “DONG HO”.']))}
function showClockPuzzle(){
 if(state.flags.clockDrawer){say('Nguyệt','Ngăn dưới đồng hồ đã mở, mảnh giấy đã lấy ra rồi.');return}
 let h=12,m=0;
 const svg=()=>{const ha=((h%12)+m/60)*30,ma=m*6;return `<svg viewBox="0 0 120 120" class="mini-clock" aria-hidden="true"><circle cx="60" cy="60" r="54" fill="#d8ccae" stroke="#5a3a22" stroke-width="5"/>${[...Array(12)].map((_,i)=>`<line x1="60" y1="${i%3?10:8}" x2="60" y2="${i%3?14:18}" stroke="#2a1d12" stroke-width="${i%3?1.5:3}" transform="rotate(${i*30} 60 60)"/>`).join('')}<line x1="60" y1="60" x2="60" y2="30" stroke="#1a120a" stroke-width="5" stroke-linecap="round" transform="rotate(${ha} 60 60)"/><line x1="60" y1="60" x2="60" y2="16" stroke="#1a120a" stroke-width="3" stroke-linecap="round" transform="rotate(${ma} 60 60)"/><circle cx="60" cy="60" r="4" fill="#5a3a22"/></svg>`};
 showModal(`<h2>Ngăn kín dưới đồng hồ</h2><p>Mặt sau đồng hồ có một cơ cấu khóa: ngăn dưới chỉ bật ra khi kim chỉ đúng giờ. Chỉnh kim giờ và kim phút.</p><div class="clock-wrap" id="clk"></div><div class="cipher-ctl"><span>Giờ</span><button type="button" class="modal-option" id="h-"> − </button><b id="hv"></b><button type="button" class="modal-option" id="h+"> + </button><span>Phút</span><button type="button" class="modal-option" id="m-"> − </button><b id="mv"></b><button type="button" class="modal-option" id="m+"> + </button></div><p class="modal-note" id="ck-msg">Chỉnh kim rồi bấm “XÁC NHẬN”.</p><div id="ck-actions" class="modal-buttons"></div>`,'CÂU ĐỐ · ĐỒNG HỒ','clockpuz');
 const draw=()=>{$('clk').innerHTML=svg();$('hv').textContent=String(h).padStart(2,'0');$('mv').textContent=String(m).padStart(2,'0')};draw();
 const bind=(id,fn)=>{$(id).onclick=()=>{fn();draw();playSound('switch',.08)}};
 bind('h-',()=>{h=h===1?12:h-1});bind('h+',()=>{h=h===12?1:h+1});bind('m-',()=>{m=(m+55)%60});bind('m+',()=>{m=(m+5)%60});
 $('ck-actions').append(modalButton('XÁC NHẬN',()=>{if(h===11&&m===45){state.flags.clockDrawer=true;hideModal();playSound('switch',.3);if(gain('fragA'))note('fragA','Mảnh đơn thứ nhất','Trong ngăn kín dưới đồng hồ có một mảnh giấy rách, nét chữ vội vã của người viết đơn.');
   talk([['Tuyết','Cạch. Ngăn nhỏ bật ra. Bên trong chỉ có một mảnh giấy rách.'],['Nguyệt','Chữ viết tay, mực đen. Có vẻ là một phần của lá đơn. Đây là mảnh đầu tiên.'],['Nam','Nghĩa là có ít nhất hai mảnh nữa. Cứ gom lại.']]);save();checkAssemble()}
   else{$('ck-msg').textContent='Kim đồng hồ chưa khớp. Ngăn vẫn khóa chặt.';playSound('switch',.12)}}));
 $('ck-actions').append(modalButton('Đóng',hideModal));
 $('modal-body').appendChild(hintBlock(['Có một dòng chữ viết sau khung ảnh gia đình trong đại sảnh này.','Hãy lật mặt sau khung ảnh và giải mã dòng chữ ấy.','Giờ cần chỉnh là 11 giờ 45 phút.']))}
let asmOrder=null;
const PETITION=['Chúng tôi, năm người làm công nhà ông Bá Lâm, xin tố cáo:','đêm lễ 17/3 là lễ lừa: cửa hầm bị khóa từ ngoài, ô thông gió bị che,','để mặc chúng tôi dưới đó. Nếu chúng tôi không về, xin hãy nhớ tên chúng tôi.'];
function showAssemble(){
 if(!asmOrder){asmOrder=[2,0,1]}
 const draw=()=>{const box=$('asm-strips');box.textContent='';asmOrder.forEach((v,i)=>{const b=document.createElement('button');b.type='button';b.className='asm-strip'+(sel===i?' sel':'');b.textContent=PETITION[v];b.onclick=()=>{if(sel===null){sel=i}else{[asmOrder[sel],asmOrder[i]]=[asmOrder[i],asmOrder[sel]];sel=null;playSound('page',.15)}draw();if(asmOrder.join()==='0,1,2')done()};box.appendChild(b)})};
 let sel=null,fin=false;
 const done=()=>{if(fin)return;fin=true;['fragA','fragB','fragC'].forEach(id=>consume(id,true));if(gain('petition'))note('petition','Mảnh đơn tố cáo','Ba mảnh giấy khớp với nhau thành lời tố cáo của năm người làm công: đêm lễ 17/3/1988 là lễ lừa, cửa hầm bị khóa từ ngoài, ô thông gió bị che.');asmOrder=null;save();setTimeout(()=>{hideModal();render();talk([['Nguyệt','Khớp rồi. Cả lá đơn: “đêm lễ 17/3 là lễ lừa: cửa hầm bị khóa từ ngoài...”.'],['Đông','Và dòng cuối: “Nếu chúng tôi không về, xin hãy nhớ tên chúng tôi.” Tớ nghẹn.'],['Ánh','Họ biết trước mình sẽ không về. Vậy mà vẫn ký tên.']])},500)};
 showModal(`<h2>Ghép lá đơn tố cáo</h2><p>Ba mảnh giấy rách đã đủ. Bấm hai mảnh để đổi chỗ, sắp lại cho đoạn văn xuôi chữ.</p><div id="asm-strips" class="asm-strips"></div><p class="modal-note">Đọc từ trên xuống dưới: lời mở đầu, nội dung, lời nhắn cuối.</p><div id="asm-actions" class="modal-buttons"></div>`,'CÂU ĐỐ · GHÉP GIẤY','assemble');
 draw();$('asm-actions').append(modalButton('Đóng',hideModal))}

/* ============ CHƯƠNG 9B · BÁT CƠM NÓNG · ĐÊM 17/3 · RỪNG THIÊNG ============ */
function chooseModal(title,text,opts,kicker,type){showModal(`<h2>${title}</h2><p>${text}</p><div id="choose-box" class="modal-buttons"></div>`,kicker||'LỰA CHỌN',type||'choice');const box=$('choose-box');opts.forEach(o=>box.appendChild(modalButton(o[0],()=>{hideModal();o[1]()})))}
/* Sắp thứ tự: bấm hai mục để đổi chỗ. items = thứ tự đúng. */
function showOrder(o){const n=o.items.length;let ord=o.start.slice(),sel=null,fin=false;
 showModal(`<h2>${o.title}</h2><p>${o.intro}</p><div id="ord-box" class="asm-strips"></div><p class="modal-note">${o.note||''}</p><div id="ord-actions" class="modal-buttons"></div>`,o.kicker,'order');
 const draw=()=>{const box=$('ord-box');box.textContent='';ord.forEach((v,i)=>{const b=document.createElement('button');b.type='button';b.className='asm-strip'+(sel===i?' sel':'');b.textContent=o.items[v];b.onclick=()=>{if(fin)return;if(sel===null){sel=i}else{[ord[sel],ord[i]]=[ord[i],ord[sel]];sel=null;playSound('page',.15)}draw();if(ord.every((x,k)=>x===k)){fin=true;setTimeout(()=>{hideModal();o.onDone()},450)}};box.appendChild(b)})};
 draw();$('ord-actions').appendChild(modalButton('Đóng',hideModal));if(o.hints)$('modal-body').appendChild(hintBlock(o.hints))}
/* Giữ hơi thở: bấm THỞ khi kim đang nằm trong vùng sáng. Sai nhiều lần thì vùng sáng rộng ra. */
function showBreath(onDone){let ok=0,miss=0,pos=0,dir=1,alive=true,lock=0;
 showModal(`<h2>Giữ nhịp thở</h2><p>Cha và một người lạ đang ở ngay sau cánh cửa. Hãy bấm <strong>THỞ</strong> khi kim đi vào vùng sáng, ba lần liền.</p><div class="breath-bar" id="br-bar"><div class="breath-zone" id="br-zone"></div><div class="breath-needle" id="br-needle"></div></div><p class="modal-note" id="br-msg">0 / 3</p><div id="br-actions" class="modal-buttons"></div>`,'CÂU ĐỐ · NHỊP THỞ','breath');
 const zone=$('br-zone'),needle=$('br-needle'),msg=$('br-msg');
 const width=()=>Math.min(48,20+miss*7),left=()=>50-width()/2;
 const setZone=()=>{zone.style.left=left()+'%';zone.style.width=width()+'%'};setZone();
 const loop=()=>{if(!alive||!$('br-bar')){alive=false;return}pos+=dir*(lock>0?.0:1.35);if(pos>=100){pos=100;dir=-1}if(pos<=0){pos=0;dir=1}if(lock>0)lock--;needle.style.left=pos+'%';requestAnimationFrame(loop)};requestAnimationFrame(loop);
 $('br-actions').appendChild(modalButton('THỞ',()=>{if(lock>0)return;if(pos>=left()&&pos<=left()+width()){ok++;playSound('switch',.06);msg.textContent=ok+' / 3';if(ok>=3){alive=false;hideModal();onDone();return}}else{miss++;ok=0;lock=40;playSound('switch',.14);msg.textContent='Cha ho khẽ. Đứng yên... rồi thở lại. 0 / 3';setZone()}}));
 $('br-actions').appendChild(modalButton('Đóng',()=>{alive=false;hideModal()}))}

function riceBowl(){
 if(state.flags.riceSeen){say('Nguyệt','Bát cơm vẫn nóng. Dấu chân nhỏ dẫn xuống bếp, ra phía sau.');return}
 state.flags.riceSeen=true;note('rice','Bát cơm còn nóng','Trên bàn thờ có một bát cơm đầy, hơi nóng còn bốc lên dù không ai thắp lửa. Có dấu chân rất nhỏ in trên sàn, dẫn xuống bếp.');save();
 talk([['Nguyệt','Bát cơm đầy, còn nóng. Hơi bốc lên như vừa mới múc ra.'],['Ánh','Cơm nóng thật. Có ai đó đã đặt nó ở đây chưa đầy một giờ trước.'],['Tuyết','Bà Mận mất rồi. Mơ thì không ăn được. Vậy ai nấu?'],['Mơ','Em đặt nó đấy. Mỗi đêm. Em chỉ không nhớ... em đặt cho ai.'],['Nguyệt','Nhìn kìa, trên sàn có dấu chân. Nhỏ lắm. Nhỏ như chân một đứa trẻ bảy tuổi.'],['Đông','Dấu chân dẫn xuống bếp. Mình bật đèn pin lên soi.']]);renderSidebar()}
function footTrail(){
 if(state.flags.footTrail){go('BG43');return}
 if(!state.flashlight){say('Nguyệt','Sàn bếp tối quá. Mình bật đèn pin lên xem thử.');return}
 state.flags.footTrail=true;save();
 talk([['Nam','Có rồi. Dấu chân bé tí, in bằng tro bếp. Chúng đi vòng qua bếp rồi dừng lại ở cánh cửa nhỏ sau tủ.'],['Tuyết','Cửa gác. Cửa nhỏ như vậy, người lớn phải cúi mới qua được.'],['Nguyệt','Mơ đã đi lối này mỗi đêm. Mình đi theo em.']],()=>go('BG43'))}
function luaDiary(){
 if(state.flags.flashDone){say('Nguyệt','Ba trang nhật ký của cô Lụa đã được sắp lại. Mình sẽ giữ nó cẩn thận.');return}
 if(state.flags.diaryDone){startFlashbackPrompt();return}
 showOrder({title:'Ba trang nhật ký của cô Lụa',kicker:'CÂU ĐỐ · NHẬT KÝ',intro:'Ba trang rời, nét chữ ngày một run hơn. Bấm hai trang để đổi chỗ, sắp theo thứ tự thời gian.',note:'Mỗi trang có một dòng ngày tháng ở đầu.',
  items:['MÙA XUÂN 1984. Hôm nay cô chủ nhỏ gọi tôi là cô Lụa. Tôi nghe mà tim đau như bị bóp. Con ơi, mẹ đây.','MÙA ĐÔNG 1987. Tôi ghét ông ta. Tôi ghét cả ngôi nhà này. Có những đêm tôi ước mình chưa từng sinh con ở đây. Rồi tôi thấy mặt con, và tôi hết ước.','ĐÊM 16/3/1988. Ông Lâm bảo ở lại giúp một đêm lễ cho con khỏi bệnh. Mẹ đi, vì đó là lễ cho con. Nếu có chuyện gì, con đừng ra sân giếng một mình.'],
  start:[2,0,1],hints:['Mỗi trang có một mốc thời gian ở dòng đầu.','Trang viết từ lúc còn vui đứng trước, trang viết đêm trước buổi lễ đứng sau cùng.','Thứ tự đúng: Mùa xuân 1984, Mùa đông 1987, Đêm 16/3/1988.'],
  onDone:()=>{state.flags.diaryDone=true;note('lua','Nhật ký cô Lụa','Cô Lụa là mẹ ruột của Mơ. Cô phải gọi con mình là “cô chủ nhỏ”. Trang cuối cô viết đêm trước buổi lễ: “Nếu có chuyện gì, con đừng ra sân giếng một mình.”');save();
   talk([['Tuyết','“Mẹ đây.” Trời ơi... Cô Lụa là mẹ ruột của Mơ.'],['Ánh','Cô phải gọi con gái mình là cô chủ nhỏ. Cả đời không được ôm con bằng cái tên mẹ.'],['Nam','Rồi ông Lâm gọi chính mẹ ruột của con mình xuống hầm trong đêm lễ ấy. Tớ không biết nên giận hay nên nghẹn nữa.'],['Mơ','Em không biết... Em chỉ biết cô Lụa luôn ôm em vào đêm. Em cứ tưởng cô thương em như thương một đứa trẻ khác.'],['Mơ','Chị muốn thấy đêm ấy không? Em muốn kể, nhưng em không biết nói thế nào. Em chỉ biết cho chị xem.']],startFlashbackPrompt)}})}
function startFlashbackPrompt(){chooseModal('Đêm 17/3/1988','Mơ nắm lấy tay Nguyệt. Cả căn gác tối dần, và tiếng hộp nhạc vang lên rất nhỏ. Bạn sẽ đi theo em.',[['Theo Mơ về đêm ấy',startFlashback],['Chưa sẵn sàng',()=>{}]],'KÝ ỨC')}
function startFlashback(){state.flags.mo=true;state.flags.fbBowl=false;state.flags.fbMan=null;state.flags.fbKeys=false;state.flags.fbSeal=false;state.flags.fbFed=false;state.flags.fbCha=false;save();go('BG34')}
function fbMan(){
 if(state.flags.fbMan){say('Mơ','Bà Mận vẫn ngủ gật bên bếp.');return}
 chooseModal('Bà Mận ngủ gật bên bếp','Bà ngồi dựa vào cột, hai tay còn nắm chiếc muôi. Mơ định bước qua thật khẽ.',[['Đánh thức bà',()=>{state.flags.fbMan='wake';save();talk([['Mơ','Bà ơi, ai đang làm gì ngoài sân vậy?'],['Bà Mận','...Con. Mơ, không được ra sân. Cha con dặn rồi.'],['Bà Mận','Bà không giúp được con đâu. Bà sợ... Thôi, con về buồng đi, đừng nghe gì cả.'],['Mơ','Con thấy bà khóc. Bà ơi, con chỉ đi xem một chút thôi.']])}],['Để bà ngủ',()=>{state.flags.fbMan='quiet';save();talk([['Mơ','Con đi nhẹ lắm đấy, bà Mận ơi.'],['Mơ','Mỗi đêm bà đều giả vờ ngủ. Con biết bà biết hết. Bà vẫn để cho con đi.']])}]],'LỰA CHỌN')}
function fbBowl(){if(state.flags.fbBowl){say('Mơ','Chiếc bát bé xíu vẫn nằm đó, trống không.');return}state.flags.fbBowl=true;save();render();talk([['Mơ','Bát này nhỏ xíu, vừa tay con. Sao lại để riêng, không ai ăn?'],['Mơ','Con nghe tiếng người lớn nói chuyện trên gác. Con lên xem.']]);renderSidebar()}
function fbKeys(){
 if(state.flags.fbKeys){say('Mơ','Con nhớ mãi: “Nó sẽ đứng dậy.” Con không hiểu thầy ấy nói về ai.');return}
 say('Mơ','Cha đang nói chuyện với một người lạ. Phải thật nhẹ.');
 showBreath(()=>{chooseModal('Sau cánh cửa phòng cha','Giọng cha: “Làm xong, con bé sẽ khỏi?” Một giọng khác, lạnh và đều: “Nó sẽ đứng dậy.” Rồi tiếng ghế kêu, bước chân tới gần cánh cửa. Mơ siết chặt vạt áo.',[['“Con nghe tiếng mưa, cha ạ.”',()=>fbKeysDone('rain')],['Nín thở, đứng yên',()=>fbKeysDone('silent')]],'LỰA CHỌN')})}
function fbKeysDone(c){state.flags.fbKeys=true;save();render();
 talk([c==='rain'?['Mơ','Con nghe tiếng mưa, cha ạ.']:['Mơ','...'],['Ông Bá Lâm','Ngủ đi con. Cha xin lỗi.'],['Mơ','Cha cứ xin lỗi con mỗi đêm, mà không bao giờ nói là vì chuyện gì. Cha ơi, cha xin lỗi ai vậy?'],['Người kể chuyện','Từ phía bếp vọng lên tiếng đập cửa rất nhỏ. Mơ chạy xuống.']]);renderSidebar()}
function fbLua(){
 if(state.flags.fbFed){say('Mơ','Con vẫn nghe tiếng cô Lụa gọi, mơ hồ, như qua nước.');return}
 state.flags.fbFed=true;save();render();
 talk([['Người kể chuyện','Sau cánh cửa gỗ là tiếng đập và tiếng người.'],['Thầy Khoa','Ông Lâm! Có người ngất rồi. Mở cửa ra!'],['Mơ','Cô Lụa? Chú Hải? Cha ơi, họ đang gọi cha!'],['Ông Bá Lâm','Mơ! Ra chỗ khác. Ra ngay!'],['Mơ','Cha ơi, mở cửa đi cha! Họ đang kêu!'],['Ông Bá Lâm','Con không hiểu đâu. Mở ra thì... Ra chỗ khác!'],['Cô Lụa','Mơ ơi... con gái của mẹ... chạy đi, chạy ra xa chỗ thầy ấy...'],['Người kể chuyện','Mơ nghe không trọn câu. Em chỉ biết đó là giọng cô Lụa, và cha em đang đặt tay lên then cửa.']]);renderSidebar()}
function fbLock(){
 go('BG36');
 talk([['Người kể chuyện','Cha chạm vào then cửa, rồi buông tay xuống. Ông kéo Mơ ra khỏi bếp.'],['Mơ','Cha! Cha ơi!'],['Ông Bá Lâm','Ngoài sân có thầy lo rồi. Con ở yên đó.'],['Người kể chuyện','Không ai mở cánh cửa ấy. Mơ ngồi bệt trên sàn, nghe tiếng gõ nhỏ dần.']])}
function huuTalk(){
 if(state.flags.huuDone){say('Ông Hựu','Đừng đáp tiếng gọi từ giếng.');return}
 state.flags.huuDone=true;save();
 talk([['Người kể chuyện','Ông Hựu ngồi sau bàn gỗ, xếp ba đồng xu trên đĩa sứ. Mặt ông không đổi.'],['Ông Hựu','Năm người.'],['Đông','Dạ.'],['Ông Hựu','Năm nhà.'],['Nam','Ông nói gì ạ?'],['Ông Hựu','Chuyện cũ chưa xong.'],['Nguyệt','Chuyện nào?'],['Ông Hựu','Đi rồi sẽ biết.'],['Đông','Có nên đi không?'],['Ông Hựu','Không.'],['Ánh','Nếu bọn cháu vẫn đi?'],['Ông Hựu','Đừng đáp tiếng gọi từ giếng.'],['Người kể chuyện','Ông thu ba đồng xu, không giải thích thêm.']],()=>{note('huu','Lời phán của ông Hựu','“Năm người. Năm nhà.” “Chuyện cũ chưa xong.” “Đừng đáp tiếng gọi từ giếng.” Ông không giải thích câu nào.');renderSidebar()})}
function lampSix(){
 if(state.flags.lamp6){say('Nguyệt','Ngọn đèn thứ ba vẫn cháy, dù không ai thắp. Sáu chỗ bày lễ, mà chúng ta chỉ có năm người.');return}
 state.flags.lamp6=true;save();
 talk([['Nguyệt','Sáu chỗ: cơm, nước, hoa, và ba chỗ để đèn. Hai ngọn đang cháy, một ngọn còn tắt.'],['Tuyết','Miếu không ai trông, vậy ai thắp hai ngọn kia?'],['Người kể chuyện','Ngọn đèn thứ ba bật cháy, không ai chạm vào. Không có gió. Tiếng côn trùng im bặt một nhịp.'],['Nam','...Tớ không thích chuyện này chút nào.'],['Đông','Sáu chỗ. Mà bọn mình chỉ có năm người.']],()=>{note('lamp6','Ngọn đèn thứ sáu','Trên bàn lễ trước miếu có sáu chỗ bày lễ. Chỗ đèn cuối cùng tự cháy khi cả nhóm đứng trước bàn. Nhóm chỉ có năm người.');renderSidebar()})}
function fbSealPick(){
 if(state.flags.fbSeal){say('Mơ','Chiếc ấn nằm chặt trong tay con, lạnh và nặng.');return}
 const wrong=m=>talk([['Mơ',m]],fbSealPick);
 chooseModal('Ba thứ trên thành giếng','Thầy Tịnh vừa đặt ba thứ trên thành giếng rồi vào nhà: tròn, bằng đồng, cỡ bàn tay trẻ con. Cô Lụa dặn đồ trên bàn tế không được chạm nếu chưa hiểu. Nhưng dưới kia có người đang kêu cứu. Chiếc nào là thứ thầy ấy đang cần?',[
  ['Chiếc chuông đồng nhỏ',()=>wrong('Con lắc nhẹ, nó kêu leng keng. Thầy Tịnh quay lại nhìn, con vội đặt xuống. Thầy ấy chẳng hề giật mình vì nó.')],
  ['Vật đồng có dấu khắc dưới đáy, thầy Tịnh vừa đặt tay lên và dặn không ai được chạm',()=>{state.flags.fbSeal=true;save();render();talk([['Mơ','Đây rồi. Nặng hơn hai cái kia, dưới đáy khắc một dấu lạ. Thầy Tịnh vừa nắm lấy nó rất chặt.'],['Mơ','Con phải mang nó đi trước khi thầy ấy quay lại, rồi tìm người lớn chịu mở cửa.']]);renderSidebar()}],
  ['Hòn chặn giấy bằng đồng',()=>wrong('Nhẹ hều. Lúc nãy thầy Tịnh còn chẳng thèm nhìn nó.')]],'NHẬN RA ẤN')}
function fbFall(dir){
 talk([['Mơ',dir==='left'?'Con bám sát tường mà chạy, tay ôm chặt chiếc ấn.':'Con vòng qua cây gạo mà chạy, tay ôm chặt chiếc ấn.'],['Người kể chuyện','Mưa làm sân trơn. Nắp giếng đã xô lệch từ lúc nào không ai nhớ.'],['Người kể chuyện','Một tiếng đèn bão đổ. Một tiếng kim loại va vào đá. Rồi tối.']],()=>{playSound('slam',.35,3.7);go('BG39')})}
function fbLight(){
 talk([['Người kể chuyện','Sáng hôm sau, ông Bá Lâm đứng bên miệng giếng rất lâu. Ông tìm con cả đêm.'],['Người kể chuyện','Ông ra lệnh xây bịt miệng giếng, và không bao giờ nhắc tới.'],['Người kể chuyện','Dưới hầm, không còn ai gõ cửa nữa.'],['Mơ','Em chạy về phía ánh đèn đó trong mơ mỗi đêm. Em chưa bao giờ tới.']],
  ()=>showOrder({title:'Những gì Mơ đã làm đêm ấy',kicker:'CÂU ĐỐ · KÝ ỨC',intro:'Hãy sắp lại đúng thứ tự những việc em đã làm đêm 17/3.',note:'Bấm hai mục để đổi chỗ.',items:['Em nghe tiếng kêu cứu sau cánh cửa hầm.','Em giật chiếc ấn đồng khỏi thành giếng.','Em chạy ngang miệng giếng, nơi nắp đã xô lệch.'],start:[2,0,1],hints:['Việc đầu tiên diễn ra ở cửa hầm sau bếp.','Em phải cầm được ấn rồi mới chạy.','Thứ tự: nghe tiếng kêu, giật ấn, chạy qua giếng.'],onDone:endFlashback}))}
function endFlashback(){state.flags.mo=false;state.flags.flashDone=true;state.flags.riceOn=false;state.items=state.items.filter(x=>x);note('flash','Đêm 17/3/1988','Mơ nghe tiếng kêu cứu từ hầm nhưng cha em không mở cửa. Em giật chiếc ấn đồng của thầy Tịnh khỏi thành giếng, chạy trong mưa và trượt chân rơi xuống giếng lúc 03:17. Chiếc ấn rơi theo em. Ông Lâm tìm con cả đêm rồi ra lệnh xây bịt miệng giếng. Cô Lụa, mẹ ruột của em, gọi theo lần cuối.');save();go('BG42');
 talk([['Mơ','Em nghe người ta gọi. Em tưởng có ai cứu được các bác.'],['Nguyệt','Em đã làm hết sức rồi, Mơ. Không ai trách em.'],['Mơ','Cha em xây bịt giếng ngay sáng hôm sau. Em ở dưới đó, và em nghe cha khóc.'],['Mơ','Chị ơi, cổng sắt vẫn khóa. Năm người dưới hầm cần có tên. Họ ở những nơi từng sống: giếng, bếp, phòng học của em, kho vật tư của cha, và kho đồ lễ bên dưới.'],['Đông','Mình đi tìm họ. Lần này, mình không bỏ ai lại.']])}
function wellSealed(){
 if(!state.flags.wellFlowers){state.flags.wellFlowers=true;save();talk([['Mơ','Hoa nhài này không phải của bà Mận. Bà dị ứng phấn hoa.'],['Ánh','Vậy ai đặt?'],['Mơ','Cha em. Ông ra đây vào mỗi sáng sớm, đặt một vòng hoa rồi đi, không nói với ai. Ông làm vậy tới tận ngày ông chết.'],['Nam','Tớ không biết nên ghét ông ấy hay không nữa.']]);return}
 say('Nguyệt','Vòng hoa nhài trên nắp giếng. Cha em đã đặt nó mỗi sáng, ba mươi năm.')}
function campTalk(){
 const f=state.flags;
 if(f.mo)return;
 if(!f.camp1&&!f.riceSeen){f.camp1=true;save();talk([['Tuyết','Sáu cái bát lễ, mà chỉ có năm người bị gọi xuống hầm... mình cứ nghĩ mãi. Mẹ tớ mất vì không có thuốc, trong khi thuốc thì có, chỉ không ai chịu bán chịu.'],['Tuyết','Mọi thứ đều được chuẩn bị sẵn, kể cả cánh cửa. Cậu thấy không, Đông? Có những nơi cái chết không đến từ thiên tai.'],['Nam','...'],['Nam','Này, uống đi. Trà nóng.'],['Tuyết','Cảm ơn Nam. Cậu pha tệ lắm, nhưng nóng.']]);return}
 if(!f.camp2&&f.riceSeen){f.camp2=true;save();talk([['Nam','Tớ không chịu nổi. Một người cha nghe cả tiếng kêu cứu mà vẫn buông tay khỏi then cửa. Ông ta nghĩ cái quái gì vậy?'],['Đông','Có thể ông ấy cũng sợ, Nam. Tớ biết cảm giác đó.'],['Nam','Cậu biết cái gì chứ?'],['Đông','Tớ từng quay lưng với một người cần mình, chỉ vì sợ rắc rối. Tớ hiểu cái cảm giác ngồi ở ban công nhìn xuống mà không làm gì.'],['Nam','...Cậu nói thế làm tớ không giận ông ấy được nữa. Tớ ghét điều đó.'],['Ánh','Có những lúc không giận được ai cũng đau như thế.']]);return}
 if(!f.camp3&&f.namesDone){f.camp3=true;save();talk([['Nguyệt','Tớ có chuyện phải nói. Tớ chọn Đồng Chay vì bà ngoại tớ ở đó.'],['Đông','Bà ngoại cậu?'],['Nguyệt','Bà ở trong đám đông hôm ấy. Bà thấy họ bị dẫn đi, và bà im lặng. Cả đời bà không nói với ai.'],['Nguyệt','Tớ đi tìm sự thật vì tớ muốn chuộc lỗi thay bà.'],['Tuyết','Cậu không cần chuộc lỗi thay ai cả. Cậu đã đứng ở đây rồi.'],['Ánh','Vậy tối nay mình ngủ gần nhau nhé.']]);return}
 say('Nguyệt','Đống lửa vẫn cháy nhỏ. Cả nhóm ngồi quanh, im lặng và gần nhau.')}
function redCloth(){
 if(state.flags.redSeen){say('Nguyệt','Dải vải đỏ có thêu tên bà ngoại tớ. Bà đã buộc nó nhiều năm trước.');return}
 state.flags.redSeen=true;note('red','Dải vải đỏ của bà ngoại','Trên cành cổ thụ có một dải vải đỏ thêu tên bà ngoại Nguyệt. Bà đã buộc nó như một lời xin lỗi lặng lẽ.');save();
 talk([['Nguyệt','Tên bà tớ. Thêu bằng chỉ trắng, nét đã sờn.'],['Nguyệt','Bà buộc nó ở đây, nhiều năm trước. Chắc bà đã quay lại rừng này nhiều lần, một mình.'],['Tuyết','Mỗi năm một dải. Họ không nói ra, mà vẫn xin lỗi.']])}
function grandPhoto(){
 state.flags.grandSeen=true;save();
 talk([['Nguyệt','Bà ơi. Cháu đã tìm ra rồi. Cháu đã gọi tên họ.'],['Nguyệt','Cháu không giận bà. Bà chỉ là một người sợ. Ai cũng có lúc sợ.'],['Ánh','Bà sẽ nghe thấy cậu.'],['Nguyệt','Tớ chỉ muốn bà biết cháu vẫn thương bà.']])}
function forestAltar(){
 if(state.flags.forestDone){say('Nguyệt','Bàn thờ đá đã có nhang. Mình đã chọn xong.');return}
 if(!state.flags.redSeen||!state.flags.grandSeen){say('Nguyệt','Mình chưa muốn quyết định vội. Tớ muốn xem dải vải đỏ và ghé nhà bà ngoại trước.');return}
 talk([['Bà Mận','Cháu của bà Sáu. Cả làng này đều im lặng. Cháu đừng im lặng như bọn bà.'],['Nguyệt','Bà Mận... Bà đã thắp nhang cho họ suốt ba mươi năm.'],['Bà Mận','Bà khóa cánh cửa ấy. Bà không có tư cách xin tha thứ. Chỉ xin các cháu chọn điều đúng.']],()=>{
  const hasProof=['ledger','confession','archive'].every(id=>state.evidence.includes(id));
  chooseModal('Điều cuối cùng','Cả nhóm đứng trước bàn thờ đá. Còn một lựa chọn, và nó sẽ là của riêng bạn.',[
   ['Công khai tất cả. Đưa lá đơn, nhật ký và sổ vật tư cho chính quyền',()=>{state.flags.forestDone=true;showEnding(hasProof&&state.flags.sixthDone&&state.flags.namesDone?'true':'normal')}],
   ['Tha thứ. Dựng một bàn thờ chung cho cả sáu người, và cho cả ông Lâm',()=>{state.flags.forestDone=true;showEnding('forgive')}]],'LỰA CHỌN CUỐI','escape')})}

/* ============ KÝ HIỆU RIÊNG · TÀI LIỆU ĐỌC ĐƯỢC · GHÉP HÌNH · SẮP VẬT PHẨM ============ */
const GLYPH_PATH={
 wave:'M3 12q3.5-5 7 0t7 0t7 0M3 20q3.5-5 7 0t7 0t7 0',
 flame:'M16 3C19 9 25 12 25 20A9 9 0 0 1 7 20C7 15 11 13 12 8C14 10 15 11 16 3Z',
 note:'M12 25V7L24 4V22M12 25a3.5 3 0 1 1-7 0a3.5 3 0 0 1 7 0M24 22a3.5 3 0 1 1-7 0a3.5 3 0 0 1 7 0',
 scale:'M16 5V26M7 26H25M6 9H26M6 9L2 18H10ZM26 9L22 18H30Z',
 pen:'M6 26L8 19L21 6a2.5 2.5 0 0 1 3.5 0l1.5 1.5a2.5 2.5 0 0 1 0 3.5L13 24ZM19 8L24 13'};
const glyph=(id,s=44)=>`<svg class="glyph" viewBox="0 0 32 32" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${GLYPH_PATH[id]}"/></svg>`;
const GLYPH_OF=[['khoa','Đỗ Văn Khoa','thầy giáo','pen'],['tam','Nguyễn Văn Tâm','thủ kho','scale'],['lua','Phạm Thị Lụa','vú nuôi','note'],['sen','Trần Thị Sen','nấu bếp','flame'],['hai','Lê Văn Hải','trông giếng','wave']];
const GLYPH_ORDER=['wave','flame','note','scale','pen'];
/* Gợi ý cách mở gắn với từng ghi chép trong nhật ký */
const NOTE_HINT={
 clock:'Giờ đứng của chiếc đồng hồ chỉ là mã hộp sắt. Ngăn bí mật dưới đồng hồ cần một giờ khác, ghi sau khung ảnh gia đình.',
 photo:'Lật mặt sau khung ảnh trong đại sảnh. Dòng chữ ở đó bị dịch chữ cái.',
 fragA:'Đủ ba mảnh đơn thì mang tới bàn ông Lâm ở BG17 để ghép.',fragB:'Giờ ghi ở đây dùng để chỉnh kim đồng hồ quả lắc.',ledger:'Hai mảnh đơn còn lại nằm sau khung ảnh và trong ngăn dưới đồng hồ ở đại sảnh.',
 petition:'Lá đơn nhắc tới kho vật tư riêng của nhà ông Lâm. Nhật ký trong két ông Lâm nói chỗ để chìa.',
 lamdiary:'Chìa kho giấu dưới đệm chiếc ghế mà ông Lâm hay ngồi hóng gió, ở ban công tầng hai.',
 storekey:'Chọn chìa trong túi đồ rồi chạm vào ổ khóa cửa kho ở sân sau.',store:'Cuốn sổ trên bàn trong kho ghi cách xuống hầm.',
 name_tam:'Dưới đống đồ lễ đổ có nắp hầm khóa bằng năm ký hiệu. Cần bảng ký hiệu và thứ tự đứng ký đơn.',
 rhyme:'Bốn câu đồng dao nói thứ tự bốn món đồ chơi. Xếp chúng lên giá sách trong phòng học của Mơ.',
 legend:'Mỗi ký hiệu thuộc về một người. Ghép với thứ tự đứng ký ở mặt sau tấm ảnh.',
 photoBack:'Nhập năm ký hiệu theo đúng thứ tự trên khóa nắp hầm ở kho vật tư, dưới đống đồ lễ đổ.'};
/* Tài liệu cầm theo người, chạm vào ô đồ để đọc */
const READ_ITEMS={petition:'petition',fragA:'fragA',fragB:'fragB',fragC:'ledger',testimony:'testimony',legendDoc:'legend',backDoc:'photoBack'};
function showDoc(noteId){
 const n=state.notes.find(x=>x.id===noteId);if(!n){toast('Chưa có gì để đọc.');return}
 const chart=noteId==='legend'?'<div class="glyph-chart">'+GLYPH_OF.map(r=>`<div class="glyph-row">${glyph(r[3],34)}<span>${r[1]}<small>${r[2]}</small></span></div>`).join('')+'</div>':'';
 showModal(`<h2>${escapeHTML(n.title)}</h2><div class="doc-paper">${escapeHTML(n.body).replace(/\n/g,'<br>')}</div>${chart}<div id="doc-actions" class="modal-buttons"></div><p class="modal-note" id="doc-hint" hidden></p>`,'TÀI LIỆU','doc');
 const h=NOTE_HINT[noteId];if(h)$('doc-actions').appendChild(modalButton('Gợi ý cách mở',()=>{const e=$('doc-hint');e.textContent=h;e.hidden=false}));
 $('doc-actions').appendChild(modalButton('Đóng',hideModal));playSound('page',.18)}
function takeToy(id,okLines,againText){
 if(has(id)||state.used.includes(id)){say('Nguyệt',againText);return}
 if(gain(id)){note('toy_'+id,ITEMS[id].name,ITEMS[id].description);talk(okLines)}}
function chalkBoard(){
 if(!state.notes.some(n=>n.id==='rhyme')){note('rhyme','Bài đồng dao cô Lụa dạy','Búp bê ngồi dậy trước tiên.\nHạc giấy bay lên giữa trời.\nXe gỗ lăn qua cửa nhỏ.\nPhấn trắng viết tên sau cùng.');}
 const first=gain('chalkStub');
 talk([['Nguyệt','Bảng đen còn nguyên nét phấn. Góc dưới có dòng viết vội: “Mơ giỏi lắm.”'],['Nguyệt','Phía trên là bốn câu đồng dao, như bài tập đọc: “Búp bê ngồi dậy trước tiên. Hạc giấy bay lên giữa trời. Xe gỗ lăn qua cửa nhỏ. Phấn trắng viết tên sau cùng.”'],first?['Nguyệt','Còn một mẩu phấn trên gờ bảng. Tớ giữ lại.']:null,['Mơ','Cô Lụa dạy em đọc bài này mỗi sáng. Em thuộc lòng rồi.']])}
function toyShelf(){
 if(state.flags.shelfOpen){say('Nguyệt','Ngăn kéo đã mở. Bảng ký hiệu đã nằm trong sổ.');return}
 const need=['toyDoll','paperCrane','toyCart','chalkStub'];
 if(!need.every(has)){say('Nguyệt','Ngăn kéo của giá sách có bốn hõm nhỏ như để đặt đồ chơi. Mình còn thiếu '+(need.filter(x=>!has(x)).length)+' món. Thử tìm quanh phòng học và gác nhỏ sau bếp.');return}
 const SOL=['toyDoll','paperCrane','toyCart','chalkStub'];let slots=[null,null,null,null],pick=null;
 showModal(`<h2>Ngăn kéo bốn hõm</h2><p>Trên nắp có bốn hõm xếp thành hàng ngang. Hãy đặt bốn món đồ chơi vào đúng thứ tự, từ trái sang phải.</p><div class="slot-row" id="sl-row"></div><div class="toy-tray" id="sl-tray"></div><p class="modal-note" id="sl-msg">Bấm một món rồi bấm hõm muốn đặt vào. Bấm món đã đặt để lấy ra.</p><div id="sl-actions" class="modal-buttons"></div>`,'CÂU ĐỐ · SẮP ĐỒ','shelf');
 const draw=()=>{const row=$('sl-row'),tray=$('sl-tray');row.textContent='';tray.textContent='';
  slots.forEach((id,i)=>{const b=document.createElement('button');b.type='button';b.className='slot'+(id?' full':'');b.setAttribute('aria-label','Hõm '+(i+1));b.innerHTML=id?`<span class="toy-ico">${ITEMS[id].emoji}</span><small>${ITEMS[id].name}</small>`:`<small>${i+1}</small>`;
   b.onclick=()=>{if(id){slots[i]=null;playSound('switch',.06)}else if(pick){slots[i]=pick;pick=null;playSound('switch',.1)}draw();check()};row.appendChild(b)});
  need.filter(id=>!slots.includes(id)).forEach(id=>{const b=document.createElement('button');b.type='button';b.className='toy'+(pick===id?' sel':'');b.innerHTML=`<span class="toy-ico">${ITEMS[id].emoji}</span><small>${ITEMS[id].name}</small>`;b.onclick=()=>{pick=pick===id?null:id;draw()};tray.appendChild(b)})};
 let done=false;
 const check=()=>{if(done||slots.some(x=>!x))return;if(SOL.every((id,i)=>slots[i]===id)){done=true;need.forEach(id=>consume(id,true));state.flags.shelfOpen=true;
   if(gain('legendDoc'))note('legend','Bảng ký hiệu của năm người','Trong ngăn kéo có một tờ giấy vẽ năm ký hiệu nhỏ, mỗi ký hiệu kèm một cái tên và nghề: Khoa (cây bút), Tâm (cái cân), Lụa (nốt nhạc), Sen (ngọn lửa), Hải (con sóng). Cô Lụa vẽ để dạy Mơ nhận mặt chữ.');
   save();setTimeout(()=>{hideModal();render();talk([['Nguyệt','Cạch. Ngăn kéo bật ra. Bên trong là một tờ giấy vẽ năm hình nhỏ.'],['Ánh','Một cây bút, cái cân, nốt nhạc, ngọn lửa, con sóng. Ký hiệu của từng người?'],['Mơ','Cô Lụa vẽ để dạy em. Mỗi người trong nhà có một hình. Em nhớ hình nào của ai.'],['Nguyệt','Chạm vào tờ giấy trong túi đồ để đọc lại bất cứ lúc nào.']])},500)}
  else{$('sl-msg').textContent='Ngăn kéo không nhúc nhích. Có lẽ thứ tự chưa đúng.';playSound('switch',.14)}};
 draw();$('sl-actions').appendChild(modalButton('Đóng',hideModal));
 $('modal-body').appendChild(hintBlock(['Bảng đen trong phòng này có một bài đồng dao.','Đọc từng câu đồng dao: mỗi câu nhắc tới một món đồ.','Thứ tự: búp bê, hạc giấy, xe gỗ, viên phấn.']))}
function tornPhoto(){
 if(state.flags.photoBack){say('Nguyệt','Mảnh ảnh đã ghép xong. Mặt sau ghi thứ tự đứng ký đơn.');return}
 const COLS=4,ROWS=3,N=COLS*ROWS;let ord=[...Array(N).keys()];
 for(let k=0;k<60;k++){const a=Math.random()*N|0,b=Math.random()*N|0;[ord[a],ord[b]]=[ord[b],ord[a]]}
 if(ord.every((v,i)=>v===i))[ord[0],ord[1]]=[ord[1],ord[0]];
 let sel=null,fin=false,peek=false;const src=IMG('prop_family_picture.webp');
 showModal(`<h2>Tấm ảnh bị xé nhỏ</h2><p>Dưới gối có mười hai mảnh ảnh cũ. Bấm hai mảnh để đổi chỗ, ghép lại thành bức ảnh hoàn chỉnh.</p><div class="jig" id="jig"></div><p class="modal-note" id="jg-msg">0 / ${N} mảnh đúng chỗ.</p><div id="jg-actions" class="modal-buttons"></div>`,'CÂU ĐỐ · GHÉP HÌNH','jigsaw');
 const draw=()=>{const box=$('jig');box.textContent='';
  ord.forEach((v,i)=>{const b=document.createElement('button');b.type='button';b.className='jp'+(sel===i?' sel':'')+(v===i?' ok':'');
   b.style.backgroundImage=peek?'none':`url("${src}")`;b.style.backgroundSize=`${COLS*100}% ${ROWS*100}%`;b.style.backgroundPosition=`${(v%COLS)/(COLS-1)*100}% ${(Math.floor(v/COLS))/(ROWS-1)*100}%`;
   b.setAttribute('aria-label','Mảnh '+(i+1));
   b.onclick=()=>{if(fin)return;if(sel===null)sel=i;else{[ord[sel],ord[i]]=[ord[i],ord[sel]];sel=null;playSound('page',.12)}draw();upd()};box.appendChild(b)});
  box.classList.toggle('peek',peek);if(peek)box.style.backgroundImage=`url("${src}")`;else box.style.backgroundImage='none'};
 const upd=()=>{const ok=ord.filter((v,i)=>v===i).length;$('jg-msg').textContent=ok+' / '+N+' mảnh đúng chỗ.';
  if(ok===N&&!fin){fin=true;state.flags.photoBack=true;if(gain('backDoc'))note('photoBack','Mặt sau tấm ảnh','Mặt sau tấm ảnh có dòng chữ viết tay của cô Lụa: “Thứ tự chúng tôi đứng ký đơn: thầy Khoa, bác Tâm, tôi, chị Sen, bác Hải. Năm người như năm ngón tay.”');save();
   setTimeout(()=>{hideModal();render();talk([['Tuyết','Ghép xong. Một tấm ảnh cũ nhăn nhúm, mặt người bị cào xước.'],['Ánh','Lật mặt sau đi. Có chữ.'],['Nguyệt','“Thứ tự chúng tôi đứng ký đơn: thầy Khoa, bác Tâm, tôi, chị Sen, bác Hải. Năm người như năm ngón tay.”'],['Nam','Thứ tự này chắc sẽ dùng được ở đâu đó. Mình ghi nhớ.']])},600)}};
 draw();$('jg-actions').appendChild(modalButton('Xem ảnh mẫu (giữ)',()=>{}));
 const pv=$('jg-actions').firstChild;pv.onmousedown=pv.ontouchstart=()=>{peek=true;draw()};pv.onmouseup=pv.onmouseleave=pv.ontouchend=()=>{peek=false;draw()};
 $('jg-actions').appendChild(modalButton('Đóng',hideModal));
 $('modal-body').appendChild(hintBlock(['Tìm các mảnh có góc ảnh trước. Giữ nút “Xem ảnh mẫu” để nhìn bức ảnh hoàn chỉnh.','Các mảnh mặt người nằm ở giữa, cạnh trên là tường và cây.','Mảnh sáng viền xanh đã đúng chỗ, đừng đổi nữa.']))}
function hatchLock(){
 if(state.flags.cellOpen){go('BG32');return}
 const SOL=['pen','scale','note','flame','wave'];let d=[0,0,0,0,0],done=false;
 showModal(`<h2>Nắp hầm khóa bằng ký hiệu</h2><p>Năm vòng khắc năm ký hiệu lạ. Bấm từng vòng để đổi ký hiệu. Nắp chỉ bật ra khi năm ký hiệu đúng thứ tự.</p><div class="glyph-lock" id="gl"></div><p class="modal-note" id="gl-msg">${has('legendDoc')?'Bảng ký hiệu trong túi đồ giúp bạn nhận ra ký hiệu của từng người.':'Chưa biết ký hiệu nào của ai. Có lẽ ở đâu đó trong nhà có một bảng chỉ dẫn.'}</p><div id="gl-actions" class="modal-buttons"></div>`,'CÂU ĐỐ · KÝ HIỆU','glyphs');
 const draw=()=>{const box=$('gl');box.textContent='';d.forEach((k,i)=>{const b=document.createElement('button');b.type='button';b.className='gl-dial';b.setAttribute('aria-label','Vòng ký hiệu '+(i+1));b.innerHTML=glyph(GLYPH_ORDER[k],46);
  b.onclick=()=>{if(done)return;d[i]=(d[i]+1)%GLYPH_ORDER.length;playSound('switch',.09);draw();chk()};box.appendChild(b)})};
 const chk=()=>{if(done||!SOL.every((id,i)=>GLYPH_ORDER[d[i]]===id))return;done=true;state.flags.cellOpen=true;save();$('gl').classList.add('is-open');playSound('door',.2);setTimeout(()=>{hideModal();render();talk([['Nam','Cạch. Cả nắp hầm bật lên, hơi lạnh phả ra.'],['Tuyết','Đúng thứ tự họ đã đứng ký. Họ chưa bao giờ rời nhau.'],['Đông','Xuống thôi. Cẩn thận.']],()=>go('BG32'))},600)};
 draw();$('gl-actions').appendChild(modalButton('Đóng',hideModal));
 $('modal-body').appendChild(hintBlock(['Cần hai thứ: bảng ký hiệu và thứ tự đứng ký đơn. Bảng ký hiệu nằm trong ngăn kéo giá sách phòng học của Mơ, thứ tự ghi ở mặt sau một tấm ảnh dưới gối ở gác nhỏ.','Thứ tự đứng ký: thầy Khoa, bác Tâm, cô Lụa, chị Sen, bác Hải.','Từ trái sang phải: cây bút, cái cân, nốt nhạc, ngọn lửa, con sóng.']))}
function showSafe(){if(state.flags.safeOpened){say('Nguyệt','Trong hộp đã tìm được bản thú tội của người tham gia nghi lễ.');return}
 showLock({title:'Hộp tài liệu của ông Bá Lâm',kicker:'CÂU ĐỐ · HỘP SẮT',type:'safe',code:'0317',plate:'KIM ĐỒNG HỒ KHÔNG BAO GIỜ ĐI TIẾP',hint:'Bấm vào từng ô số để đổi chữ số. Khóa đã rỉ sét.',onOpen:()=>{state.flags.safeOpened=true;evidence('confession');note('confession','Bản thú tội trong hộp sắt','Tài liệu ghi lại cách ông Bá Lâm che giấu việc giam năm người tố cáo trong tầng hầm và một nghi thức trấn yểm thất bại.');save();say('Nguyệt','Bản thú tội... Chúng ta đã có thêm chứng cứ về vụ án năm 1988.');renderSidebar()}})}
function showWall(){const count=state.flags.wallImpressions||[];showModal(`<h2>Năm dấu tay trong vữa</h2><p>Lớp gạch mới bịt kín lối đi. Năm dấu tay mờ cho thấy từng có người đập vào đây từ phía bên kia.</p><p>Hãy chạm vào <strong>năm dấu tay</strong> để kiểm tra từng dấu, sau đó dùng thanh sắt cạy tường.</p><div class="modal-buttons" id="handprints"></div><p class="modal-note" id="hands-status">Đã kiểm tra ${count.length}/5 dấu tay.</p><div class="modal-buttons"><button class="modal-option" id="break-wall" type="button" ${count.length===5?'':'disabled'}>DÙNG THANH SẮT PHÁ TƯỜNG →</button></div>`,'CÂU ĐỐ · BỨC TƯỜNG','wall');renderHands()}
function renderHands(){const done=state.flags.wallImpressions||[];const box=$('handprints');box.replaceChildren();for(let i=1;i<=5;i++){const b=modalButton(done.includes(i)?`✓ Dấu tay ${i}`:`✋ Dấu tay ${i}`,()=>{if(!state.flags.wallImpressions)state.flags.wallImpressions=[];if(!state.flags.wallImpressions.includes(i))state.flags.wallImpressions.push(i);save();renderHands()});if(done.includes(i))b.disabled=true;box.appendChild(b)}$('hands-status').textContent=`Đã kiểm tra ${done.length}/5 dấu tay.`;$('break-wall').disabled=done.length<5;$('break-wall').onclick=()=>{state.flags.wallOpened=true;note('wall','Bức tường bị bịt năm 1988','Lớp gạch vừa bị nạy ra, lộ một phòng kín chứa dấu vết của năm nạn nhân.');consume('crowbar');save();hideModal();playSound('slam',.3,3.9);go('BG20')}}
function showAltar(){if(questOn()){say('Mơ','Họ không nằm ở đây, chị ạ. Họ nằm ở vườn sau, dưới những cây nhài. Tên của họ thì chị phải đi tìm.');return}if(state.flags.ritualDone){say('Tuyết','Năm bát hương đã được hoàn tất nghi thức tưởng niệm. Lời nguyền đã yếu đi; chúng ta phải đem sự thật ra ngoài.');return}if(!has('incense')){say('Tuyết','Không thể làm nghi thức khi thiếu nhang. Hãy quay về miếu ở BG05.');return}const notFound=RELIC_ORDER.filter(x=>!state.relics.includes(x));if(notFound.length){showModal(`<h2>Năm bát hương lạnh</h2><p>Mỗi bát hương tượng trưng cho một người bị quên tên. Bạn cần tìm đủ <strong>năm di vật</strong> rồi mới tiến hành nghi lễ.</p><p>Đã tìm được: <strong>${state.relics.length}/5</strong>.</p><p class="modal-note">Năm bát hương đang chờ. Hãy tìm kỹ trong căn nhà này.</p>`,'BÀN THỜ GIA TIÊN','altar');return}renderRitual()}
function renderRitual(){const progress=state.ritualProgress.length;showModal(`<h2>Trả lại tên cho người đã khuất</h2><p>Đặt năm di vật lên bát hương <strong>theo đúng thứ tự mà nhật ký đã ghi lại</strong>.</p><p><strong>Bát hương ${Math.min(progress+1,5)} / 5</strong></p><div id="ritual-options" class="ritual-list"></div><p class="ritual-history" id="ritual-progress">${progress?`Đã đặt ${progress} di vật.`:'Chưa đặt di vật nào.'}</p><p class="modal-note">Chọn sai thứ tự sẽ phải bắt đầu lại.</p>`,'CÂU ĐỐ · NGHI LỄ','ritual');const choices=$('ritual-options');RITUAL_SHOW.forEach((id,i)=>{const b=document.createElement('button');b.type='button';b.className='ritual-option';b.disabled=state.ritualProgress.includes(id);b.textContent=(ITEMS[id].emoji||'◆')+'  '+ITEMS[id].name;b.addEventListener('click',()=>placeRelic(id));choices.appendChild(b)})}
function placeRelic(id){const next=RELIC_ORDER[state.ritualProgress.length];if(id!==next){state.ritualProgress.forEach(r=>{state.used=state.used.filter(x=>x!==r);if(!has(r))state.items.push(r)});state.ritualProgress=[];save();toast('Sai thứ tự. Hãy đọc lại nhật ký.');renderSidebar();renderRitual();return}state.ritualProgress.push(id);consume(id,true);save();playSound('lighter',.16);if(state.ritualProgress.length<5){renderRitual();return}consume('incense',true);consume('lighter',true);toast('Nhang đã cháy hết, bật lửa cạn gas.');state.flags.ritualDone=true;state.flags.awakened=true;note('ritual','Trả lại năm di vật','Năm di vật được đặt đúng chỗ. Tuyết đọc lời tưởng niệm, Nguyệt gọi tên bà Mận và bốn người còn lại. Tiếng gõ dưới hầm lặng đi.');save();hideModal();note('awake','Tiếng khóc thứ sáu','Nghi lễ xong, năm tiếng gõ đã lặng. Nhưng một tiếng khóc trẻ con vọng xuống từ phòng trẻ. Còn một cái tên chưa được trả lại.');talk([["Nguyệt","Tiếng gõ đã lặng... Nhưng ai đang khóc trên tầng hai? Là một đứa trẻ."],["Tuyết","Năm hồn đã được trả tên. Còn một người nữa chưa ai gọi tên. Tớ nghe rõ lắm."],["Đông","Phòng trẻ. Mình lên đó, nhưng đi cùng nhau. Không ai ở lại một mình."]]);renderSidebar();}
function showSixth(){showModal(`<h2>Gọi tên em</h2><p>Hộp nhạc ngân lên. Từ chiếc áo trắng nhỏ vang tiếng thì thầm: <strong>“Chị ơi, em tên là gì?”</strong></p><label class="label-caps" for="six-input">HỌ VÀ TÊN ĐẦY ĐỦ CỦA BÉ GÁI</label><div class="input-row"><input id="six-input" class="code-input" type="text" maxlength="30" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Họ và tên" style="font-size:17px;letter-spacing:.04em;width:240px;max-width:60%"><button class="modal-option" id="six-submit" type="button">GỌI TÊN →</button></div><p id="six-error" class="modal-note">Gợi ý: hãy đọc lại những gì đã ghi trong nhật ký.</p>`,'CÂU ĐỐ · CÁI TÊN THỨ SÁU','six');const input=$('six-input');const solve=()=>{const v=input.value.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d');if(/^(lam thi )?mo$/.test(v)){state.flags.sixthDone=true;state.flags.lamAwake=true;note('sixth','Cái tên thứ sáu','Lâm Thị Mơ, bảy tuổi, con gái út ông Bá Lâm. Em lén mang cơm cho năm người bị nhốt rồi bị giấu đi và xóa khỏi sổ. Tên em cuối cùng đã được gọi.');consume('musicbox');save();hideModal();go('BG12');talk([["Mơ","Cảm ơn chị đã gọi tên em... Nhưng cha em đang đợi ở đại sảnh. Ông ấy không để ai mang sự thật ra khỏi nhà."],["Mơ","Chị đừng sợ. Bà vẫn luôn ở trong ngôi nhà này, chưa bao giờ rời đi."],["Nguyệt","Chị hứa. Em cứ yên tâm. Lần này sẽ có người nhớ em."]]);renderSidebar()}else{$('six-error').textContent='Giọng thì thầm lặng đi. Đó chưa phải tên em.';input.select()}};$('six-submit').addEventListener('click',solve);input.addEventListener('keydown',e=>{if(e.key==='Enter')solve()});input.focus()}
function showLam(){if(state.flags.lamDone){go('BG10');return}
 const R=[['“Sổ sách chẳng nói lên điều gì. Đồ lễ vốn là của nhà này, tôi cấp thì sao?”',['ledger','archive']],['“Năm đứa tố cáo ấy tự biến mất. Ai bắt tôi chịu tội?”',['confession']],['“Con bé Mơ tự trèo xuống giếng. Ai thấy tận mắt?”',['testimony']]];
 const NAMES={ledger:'Sổ vật tư năm 1988',archive:'Hộp hồ sơ dưới hầm',confession:'Bản thú tội trong hộp sắt',testimony:'Lời khai của bà Mận'};
 let r=state.flags.lamRound||0;
 showModal(`<h2>Ông Bá Lâm</h2><p><strong>Vòng ${r+1} / 3</strong></p><p class="ending-text">${escapeHTML(R[r][0])}</p><p class="modal-note">Chọn chứng cứ để đáp lại.</p><div id="lam-options" class="ritual-list"></div>`,'ĐỐI CHẤT · BÓNG ÔNG LÂM','lam');
 for(const id of Object.keys(NAMES)){const own=state.evidence.includes(id),b=document.createElement('button');b.type='button';b.className='ritual-option';b.disabled=!own;b.textContent=NAMES[id]+(own?'':'  — chưa có');b.addEventListener('click',()=>{if(R[r][1].includes(id)){r++;state.flags.lamRound=r;save();if(r>=3){state.flags.lamDone=true;state.flags.riceOn=true;state.flags.lamRound=0;note('lam','Bóng ông Bá Lâm tan biến','Ba lời chối của ông Lâm đều bị chứng cứ bẻ gãy. Ánh đỏ dưới cánh cửa lịm tắt, tiếng giày nặng nề trong đại sảnh lùi xa dần.');save();hideModal();consume('testimony');talk([["Ông Bá Lâm","Tôi chỉ muốn giữ lấy cái nhà này... Giữ lấy cái tên của tôi..."],["Nguyệt","Tên của ông đã bị chính ông làm bẩn. Còn những người bị xóa mới cần được nhớ."],["Đông","Ánh đỏ tắt rồi. Cửa chính mở được. ...Cảm ơn mọi người, đã không bỏ nhau."],["Mơ","Cha em đi rồi. Em cũng thấy nhẹ lắm. Nhưng chị đừng vội ra, cổng sắt vẫn khóa."],["Mơ","Chị nhìn giúp em bát cơm trên bàn thờ nhé. Em để nó ở đó mỗi đêm, mà bây giờ em không còn nhớ vì sao."],["Nguyệt","Bát cơm trên bàn thờ... Mình sẽ xem."],["Nam","Lại một vòng nữa. ...Thôi, lần này chạy bằng đôi chân của mình, không phải chạy trốn."]]);renderSidebar()}else{showLam()}}else{state.flags.lamRound=0;save();hideModal();playSound('slam',.5,3.7);if(window.HorrorFX)window.HorrorFX.scare(true);say('Ông Bá Lâm','Vô ích. Các người chẳng có gì cả. Làm lại từ đầu đi.')}});$('lam-options').appendChild(b)}}
function showEscapeChoice(){const hasProof=['ledger','confession','archive'].every(id=>state.evidence.includes(id));const ritual=state.flags.ritualDone;showModal(`<h2>Trước cánh cổng sắt</h2><p>${ritual?'Cổng đã mở và tiếng gọi trong nhà đang yếu dần. Bóng tối vẫn chờ phía sau.':'Cổng dẫn về rừng, nhưng năm giọng nói vẫn vang vọng trong biệt thự. Chưa có gì được hóa giải.'}</p><p>${hasProof?'<strong>Đã thu thập đủ hồ sơ, bản thú tội và hộp chứng cứ.</strong>':'Chưa đủ chứng cứ để làm sáng tỏ hoàn toàn vụ án năm 1988.'}</p><div id="escape-options" class="modal-buttons"></div>`,'LỰA CHỌN CUỐI','escape');const box=$('escape-options');if(!ritual){box.appendChild(modalButton('Bỏ lại tất cả và tháo chạy',()=>showEnding('bad')));box.appendChild(modalButton('Tiếp tục điều tra',hideModal));}else{box.appendChild(modalButton('Đưa tất cả chứng cứ ra ngoài',()=>showEnding(hasProof&&state.flags.sixthDone&&state.flags.namesDone?'true':'normal')));box.appendChild(modalButton('Rời đi, để lại chứng cứ',()=>showEnding('normal')));box.appendChild(modalButton('Quay lại biệt thự',hideModal));}}
const ENDINGS={
 bad:{title:'Oán hồn chưa tan',label:'KẾT THÚC 1 · BAD ENDING',text:'Năm sinh viên bỏ chạy khỏi biệt thự trước khi tìm đủ di vật và giải lời nguyền.\n\nĐường rừng tối bỗng kéo dài vô tận. Tiếng của những người thân quen lần lượt gọi tên họ.\n\nSáng hôm sau, người làng chỉ tìm thấy dấu chân dừng trước cánh cổng sắt. Trong đại sảnh xuất hiện thêm một bức ảnh mới: năm sinh viên đang nhìn thẳng vào ống kính.'},
 normal:{title:'Sự thật bị chôn vùi',label:'KẾT THÚC 2 · NORMAL ENDING',text:'Nhóm sinh viên thoát khỏi căn biệt thự trước lúc trời sáng. Năm di vật đã về đúng chỗ; tiếng gọi yếu dần.\n\nNhưng chứng cứ vụ án không đầy đủ, và bí mật của ông Bá Lâm một lần nữa chìm vào im lặng.\n\nMột tuần sau, khi xem lại đoạn phim cũ, Đông thấy phía sau năm người có một bóng đen đang mỉm cười.'},
 forgive:{title:'Tha thứ',label:'KẾT THÚC 4 · FORGIVENESS',text:'Cả nhóm không đưa ai ra trước ánh sáng để bị phán xét. Họ dựng một bàn thờ chung trong rừng thiêng, cho năm người đã ở lại dưới hầm, cho Mơ, và cả cho ông Bá Lâm, người đã chịu một bản án trong im lặng suốt ba mươi năm.\n\nBà Mận thắp nén nhang cuối cùng, rồi tan vào sương. Hộp nhạc ngừng. Cô Lụa nắm tay Mơ, lần đầu gọi em bằng đúng tên: con gái của mẹ.\n\nÔng Bá Lâm hiện ra lần cuối, không nói gì. Ông đặt thanh then cài cửa hầm xuống đất, bên cạnh vòng hoa nhài. Mơ nhìn cha rất lâu, rồi khẽ nói: Cha, con không giận cha đâu.\n\nTrời sáng. Năm sinh viên rời Đồng Chay, mang theo năm cái tên và một cái tên thứ sáu. Nguyệt thắp thêm một nén nhang cho bà ngoại, và lần đầu tiên, cô ngủ không mộng mị.'},
 true:{title:'Trả lại tên người chết',label:'KẾT THÚC 3 · TRUE ENDING',text:'Bóng ông Bá Lâm tan đi khi lời khai của bà Mận được đọc lên. Năm di vật được trả về. Nhật ký, bản thú tội và những sổ cấp đồ lễ được mang ra khỏi hầm. Nguyệt đọc to năm cái tên đã được trả lại: Lê Văn Hải, Trần Thị Sen, Phạm Thị Lụa, Nguyễn Văn Tâm, Đỗ Văn Khoa.\n\nCả nhóm ra khỏi khu rừng lúc trời vừa sáng, mang bằng chứng giao cho cơ quan chức năng. Vụ mất tích năm 1988 được mở lại trong thế giới câu chuyện.\n\nBiệt thự Vân Hòa cuối cùng không còn là nơi giam giữ những lời kêu cứu. Nguyệt thêm vào danh sách một cái tên thứ sáu: Lâm Thị Mơ. Trong bản ghi âm lúc 03:17, giờ chỉ còn tiếng một đứa trẻ hát ru, rồi lặng đi.' }
};
function showEnding(which){const e=ENDINGS[which];if(which==='true'||which==='forgive'){const u=BG('BG33');$('scene-image').src=u;$('scene-backdrop').style.backgroundImage=`url("${u}")`}state.flags.ending=which;if(!state.endingsSeen.includes(which))state.endingsSeen.push(which);save();stopAmbience();showModal(`<div class="ending-number">${e.label}</div><h2>${e.title}</h2><p class="ending-text">${e.text.split('\n\n').map(escapeHTML).join('<br><br>')}</p><p class="modal-note">Đã mở ${state.endingsSeen.length}/4 kết thúc trong lần chơi này.</p><div id="ending-actions" class="modal-buttons"></div>`,'HỒI KẾT','ending');const box=$('ending-actions');box.appendChild(modalButton('Quay lại cổng để thử kết thúc khác',()=>{state.flags.ending=null;hideModal();render();save()}));box.appendChild(modalButton('Chơi lại từ đầu',()=>newGame()));box.appendChild(modalButton('Về màn hình chính',()=>{hideModal();render();$('title-screen').hidden=false;updateContinue()}))}
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
 updateContinue();render();setInterval(()=>{geckoTick();crowTick()},1000);}
mount();
})();
