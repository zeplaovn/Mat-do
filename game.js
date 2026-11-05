/* LỜI NGUYỀN RỪNG THIÊNG — playable point-and-click web adventure.
   Local assets supplied by the game owner. No external frameworks or network requests. */
(() => {
'use strict';
const ROOT = 'assets/';
const BG = id => `${ROOT}background/${id === 'BG01' ? 'BG01-fixed' : id}.webp`;
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
  'Mơ':'06_Mo_portrait.webp','Ông Bá Lâm':'07_Ba_Lam_portrait.webp','Bà Mận':'08_Ba_Man_portrait.webp',
  'Ông Hựu':'09_Ong_Huu_portrait.webp','Ông Đạt':'10_Ong_Dat_portrait.webp','Sim':'11_Sim_15_portrait.webp','Thầy Tịnh':'12_Thay_Tinh_portrait.webp'
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
  seal:{name:'Ấn đồng',image:'17_An_Dong_128x128.webp',description:'Chiếc ấn đồng tròn, tay cầm ngắn, đáy khắc một dấu lạ. Rỉ xanh phủ kín.',emoji:'🟤'},
  map88:{name:'Bản đồ Đồng Chay 1988',image:'18_Ban_Do_1988_128x128.webp',description:'Bản đồ vẽ tay: biệt thự nằm ở cuối đường làng, sát rìa vùng đồi.',emoji:'🗺️'},
  simScarf:{name:'Khăn chàm và túi lá thuốc',image:'19_Khan_Cham_128x128.webp',description:'Khăn chàm cũ và túi vải đựng lá thuốc, đồ đi rừng của Sim.',emoji:'🧣'},
  scrollFake:{name:'Bản sớ giả',image:'20_So_Gia_128x128.webp',description:'Giấy mới chắp vào giấy cũ, mực đậm hơn, một dòng viết lệch.',emoji:'📜'},
  scrollOrig:{name:'Bản sớ tạ rừng nguyên bản',image:'21_So_Goc_128x128.webp',description:'Bản lễ tạ rừng cũ của bà ngoại Sim, nét chữ đều, triện đỏ đã phai.',emoji:'📜'},
  simLetter:{name:'Thư Sim gửi Đạt',image:'22_Thu_Sim_128x128.webp',description:'Thư gấp tư, buộc bằng một dải vải chàm.',emoji:'✉️'},
  musicbox:{name:'Hộp nhạc gãy',image:'13_Hop_Nhac_128x128.webp',description:'Hộp nhạc cũ của một bé gái. Giai điệu vẫn còn ngân.',emoji:'🎵'},
  storekey:{name:'Chìa khóa kho vật tư',image:'14_Chia_Kho_128x128.webp',description:'Chiếc chìa đồng nhỏ giấu dưới đệm ghế bập bênh ở ban công phòng ông Bá Lâm.',emoji:'🗝'},
  incense5:{name:'Năm nén nhang mới',image:'15_Nam_Nen_Nhang_128x128.webp',description:'Năm nén nhang lấy từ bàn đá trong miếu cây đa. Bà Mận để dành cho năm người chưa có tên.',emoji:'🕯'},
  toyDoll:{name:'Búp bê vải của Mơ',image:'23_Bup_Be_Vai_128x128.webp',description:'Con búp bê khâu tay, mắt thêu chỉ đen, nhặt ở gác nhỏ của cô Lụa.',emoji:'🪆'},
  toyCart:{name:'Xe gỗ đồ chơi',image:'24_Xe_Go_128x128.webp',description:'Chiếc xe gỗ bánh nhỏ xíu của Mơ.',emoji:'🛒'},
  paperCrane:{name:'Hạc giấy',image:'25_Hac_Giay_128x128.webp',description:'Con hạc gấp từ trang sách cũ, lấy từ sợi chỉ treo ở phòng học.',emoji:'🕊'},
  chalkStub:{name:'Viên phấn trắng',image:'26_Phan_Trang_128x128.webp',description:'Mẩu phấn còn lại trên bảng đen của phòng học.',emoji:'✏'},
  legendDoc:{name:'Bảng ký hiệu của năm người',image:'27_Bang_Ky_Hieu_128x128.webp',description:'Tài liệu. Chạm để đọc. Mỗi người có một ký hiệu riêng.',emoji:'📋'},
  backDoc:{name:'Mặt sau tấm ảnh',image:'28_Mat_Sau_Anh_128x128.webp',description:'Tài liệu. Chạm để đọc. Dòng chữ viết tay ở mặt sau.',emoji:'📋'},
  folkPrint:{name:'Mảnh giấy dó dập dấu',image:'29_Manh_Don_Rach_128x128.webp',description:'Mảnh giấy dập bốn hình ở miếu. Chạm để xem hoặc cầm đối chiếu.',emoji:'📜'},
  fragA:{name:'Mảnh đơn 1/3',image:'29_Manh_Don_Rach_128x128.webp',description:'Mảnh giấy rách giấu trong ngăn kín dưới đồng hồ quả lắc. Một đoạn chữ viết tay vội vã.',emoji:'📜'},
  fragB:{name:'Mảnh đơn 2/3',image:'29_Manh_Don_Rach_128x128.webp',description:'Mảnh giấy rách dán sau khung ảnh gia đình, được giấu bằng mật mã chữ cái.',emoji:'📜'},
  fragC:{name:'Mảnh đơn 3/3',image:'29_Manh_Don_Rach_128x128.webp',description:'Mảnh giấy rách kẹp trong sổ vật tư trên bàn ông Bá Lâm.',emoji:'📜'},
  testimony:{name:'Lời khai của bà Mận',image:'16_Loi_Khai_128x128.webp',description:'Tờ giấy bà Mận viết trước khi mất, giấu trong hòm tre trên gác mái.',emoji:'📝'}
};
/* Dữ liệu sách hư cấu, tải bằng script defer trước game.js */
const DIALOGUE=window.LNRT_DIALOGUE||{};
const reviewed=id=>(DIALOGUE[id]||[]).map(([who,line])=>[who==='Thầy Hựu'?'Ông Hựu':who==='Bá Lâm'?'Ông Bá Lâm':who,line]);
const RESEARCH=window.LNRT_RESEARCH||{books:{},puzzles:{}};
const BOOKS=RESEARCH.books||{};
const RESEARCH_PUZZLES=RESEARCH.puzzles||{};
for(const [id,b] of Object.entries(BOOKS)){
 if(!ITEMS[id])ITEMS[id]={name:b.title,image:'30_So_Tu_Lieu_128x128.webp',description:b.summary,emoji:'📖'};
}

const USE_ON={camera:['mirror'],bell:['cradle'],musicbox:['shirt'],crowbar:['sealedWall'],key:['gate'],storekey:['storeDoor'],incense5:['graves'],folkPrint:['marker']};
const RELIC_ORDER = ['scarf','spoon','comb','petition','sandals'];
const RITUAL_SHOW = ['petition','scarf','sandals','spoon','comb']; /* thứ tự hiển thị khác thứ tự đúng, để câu đố không lộ đáp án */
const SCENES = {
 BG01:{name:'Cổng làng Đồng Chay',time:'07:30',chapter:'CHƯƠNG 1 · ĐỒNG CHAY',mood:'BUỔI SÁNG · ĐỒNG CHAY',caption:'Khởi đầu của một chuyến đi tưởng như bình thường.',intro:['Người kể chuyện','Thôn Đồng Chay, vùng chân núi Ba Vì. Năm sinh viên tới đây để ghi lại những truyền thuyết dân gian.'],look:'Những vết rêu bám trên cổng làng. Không có gì báo trước màn đêm sắp tới.',spots:[H('warning','Bà bán nước',4,53,16,25),H('travel:BG02','Đi vào ngõ làng',42,34,16,28),H('inspect:village','Nhìn cổng làng',28,10,26,20),H('travel:BG45','Đường sang chùa làng',62,70,22,28)]},
 BG02:{name:'Ngõ làng',time:'08:00',chapter:'CHƯƠNG 1 · ĐỒNG CHAY',mood:'BUỔI SÁNG · NGÕ LÀNG',caption:'Lối đi vẫn còn dấu bánh xe và hơi ẩm từ đêm trước.',intro:['Đông','Chúng ta đi qua ruộng, rồi tìm cây đa cạnh miếu. Người làng bảo con đường ấy dẫn tới rừng.'],look:'Những ngôi nhà mái ngói cũ nằm im sau hàng rào tre.',spots:[H('inspect:jar','Chum nước ven đường',90,48,9,21),H('travel:BG03','Ra phía cánh đồng',47,29,17,38),H('travel:BG01','Trở về cổng làng',6,76,22,20)]},
 BG03:{name:'Con đường giữa cánh đồng',time:'09:00',chapter:'CHƯƠNG 1 · ĐỒNG CHAY',mood:'BAN NGÀY · CÁNH ĐỒNG',caption:'Con đường đất đỏ kéo dài về phía cây cầu gỗ.',intro:['Tuyết','Đường này ít người đi. Bà tớ từng kể rằng qua cây cầu kia là lối vào rừng thiêng.'],look:'Lúa và cỏ ướt rì rào. Một con mương nhỏ chạy song song với đường.',spots:[H('travel:BG04','Bước đến cầu gỗ',45,34,20,30),H('inspect:canal','Quan sát mương',67,65,18,18),H('travel:BG02','Quay lại ngõ làng',7,80,25,17)]},
 BG04:{name:'Cầu gỗ qua mương',time:'17:30',chapter:'CHƯƠNG 1 · ĐỒNG CHAY',mood:'CHIỀU MUỘN · BỜ MƯƠNG',caption:'Cầu ọp ẹp trong gió. Trời sẫm dần khi cả nhóm quay lại.',intro:['Nam','Trời tối nhanh quá. Nếu quyết vào rừng thì giờ là lúc phải đi thôi.'],look:'Một tấm ván cầu lệch khỏi hàng, lộ mặt nước tối bên dưới.',spots:[H('inspect:bridge','Ván cầu mục',22,46,28,20),H('travel:BG05','Đi đến cây đa và miếu',67,30,19,33),H('travel:BG03','Quay lại đường ruộng',6,77,23,19)]},
 BG05:{name:'Cây đa và miếu cổ',time:'20:40',chapter:'CHƯƠNG 1 · LỐI VÀO RỪNG',mood:'ĐÊM · VEN RỪNG',caption:'Hương tàn đã lạnh. Đêm phủ xuống những rễ cây đa.',intro:['Nguyệt','Miếu này không có người trông coi... Có thứ gì đó đã bị bỏ quên ở đây.'],look:'Không thấy ánh sáng nào phía rừng. Hương cũ và gió luồn qua rễ đa.',spots:[H('shrine','Bát hương trong miếu',38,33,17,26),H('travel:BG06','Bước vào rừng tre',60,38,24,38),H('travel:BG46','Bàn lễ trước miếu',47,76,20,18),H('travel:BG04','Quay về cầu',4,79,28,19)]},
 BG06:{name:'Lối mòn xuyên rừng tre',time:'20:50',chapter:'CHƯƠNG 2 · RỪNG THIÊNG',mood:'RỪNG TRE · 20:50',caption:'Tiếng lá tre va nhau. Con đường đất uốn như một vệt tối.',intro:['Ánh','Tớ vừa nghe thấy ai gọi tên Nam. Nhưng từ nãy giờ chẳng có ai phía sau.'],look:'Bóng tre đổ dày đặc. Chỉ có bùn ướt bắt ánh trăng yếu.',spots:[H('inspect:cloth','Dải vải đỏ buộc trên tre',88,38,9,20),H('travel:BG07','Đi sâu vào rừng',44,32,19,35),H('travel:BG05','Trở lại miếu',6,78,30,20)]},
 BG07:{name:'Rừng sâu',time:'21:05',chapter:'CHƯƠNG 2 · RỪNG THIÊNG',mood:'RỪNG SÂU · 21:05',caption:'Qua kẽ lá, một mảnh mái ngói cũ thoáng hiện.',intro:['Đông','Có nhà thật. Nhưng cổng ở đâu? Mình chưa thấy lối nào dẫn tới đó.'],look:'Giữa những tán cây chỉ có một mảng mái ngói tối, không hề thấy đèn.',spots:[H('marker','Cột mốc đá cũ',88,40,10,30),H('travel:BG08','Đi về phía mái biệt thự',56,45,20,34),H('travel:BG06','Quay về rừng tre',7,79,24,20)]},
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
 BG25:{name:"Sân sau và kho vật tư",time:"04:20",chapter:'CHƯƠNG 10 · NĂM CÁI TÊN',mood:"SÂN SAU · 04:20",caption:"Mưa đọng trong những kẽ gạch. Cánh cửa kho đóng im lìm dưới ánh trăng.",look:"Sân sau tối và ẩm. Một chiếc xe cút kít gỉ nằm cạnh cửa kho, mái hiên che những bao tải rỗng.",spots:[H("storeDoor","Cửa kho vật tư có ổ khóa",36,28,14,36),H("inspect:cart","Chiếc xe cút kít gỉ",51,50,22,18),H("inspect:sacks2","Bao tải rỗng dưới mái hiên",76,48,15,24),H("inspect:pot","Chum vỡ ven tường",4,56,9,16),H("travel:BG29","Cổng vườn sau",90,38,10,32),H("travel:BG13","Quay vào gian bếp",8,14,18,46)]},
 BG26:{name:"Kho vật tư",time:"04:35",chapter:'CHƯƠNG 10 · NĂM CÁI TÊN',mood:"KHO VẬT TƯ · 04:35",caption:"Thùng gỗ và bao tải đóng dấu đỏ chất tới mái. Nến, giấy sớ, vải đỏ, nhiều hơn một đêm cúng cần.",look:"Mùi giấy ẩm và dầu đèn. Bụi lơ lửng trong vệt trăng lọt qua ô cửa có song sắt.",spots:[H("storeBook","Cuốn sổ mở trên bàn",6,65,26,15),H("inspect:scale","Chiếc cân treo",30,6,28,36),H("inspect:sacks3","Đống thùng đồ lễ đóng dấu đỏ",66,28,34,40),H("inspect:window2","Ô cửa sổ có song sắt",80,5,17,22),HR("hatchSeen","hatchLock","Nắp hầm có khóa ký hiệu",42,72,22,16),H("travel:BG25","Ra sân sau",2,78,24,20)]},
 BG27:{name:"Phòng ngủ ông Bá Lâm",time:"04:25",chapter:'CHƯƠNG 10 · NĂM CÁI TÊN',mood:"PHÒNG NGỦ · 04:25",caption:"Ngọn đèn dầu trên bàn thờ nhỏ vẫn cháy dù chủ nhân đã đi.",look:"Giường cột chạm với màn rách, bức ảnh gia đình trên tường, và một ngọn đèn dầu không ai thắp.",spots:[H("lamSafe","Két sắt sau bức ảnh",54,38,11,20),H("inspect:lamPortrait","Ảnh gia đình ông Bá Lâm",53,10,13,27),H("inspect:typewriter","Máy đánh chữ trên bàn",67,46,15,18),H("inspect:altar2","Bàn thờ nhỏ có đèn dầu",68,14,22,20),H("inspect:wardrobe2","Tủ gương",33,16,18,55),H("travel:BG30","Cửa ra ban công",91,4,9,72),H("travel:BG15","Trở ra hành lang",40,84,22,14)]},
 BG28:{name:"Phòng học của bé Mơ",time:"04:30",chapter:'CHƯƠNG 10 · NĂM CÁI TÊN',mood:"PHÒNG HỌC · 04:30",caption:"Bảng đen còn nguyên chữ cái. Hạc giấy treo kín, quay chậm dù không có gió.",look:"Một chiếc bàn học nhỏ, bảng đen, giá sách và những con hạc giấy treo trên sợi chỉ.",spots:[H("kidDrawing","Bức tranh vẽ gia đình",53,19,15,21),H("chalkBoard","Bảng đen viết chữ phấn",69,8,30,40),H("takeCrane","Những con hạc giấy",50,0,16,9),H("toyShelf","Giá sách nhỏ có ngăn kéo",29,8,20,45),H("takeCart","Chiếc xe đồ chơi",71,73,15,15),H("travel:BG16","Qua cánh cửa nhỏ về phòng trẻ",1,68,16,28)]},
 BG29:{name:"Vườn sau và năm nấm mộ",time:"04:55",chapter:'CHƯƠNG 10 · NĂM CÁI TÊN',mood:"VƯỜN SAU · 04:55",caption:"Năm nấm mộ không bia, năm cọc tre, năm bát nhang đã nguội từ lâu.",look:"Mây lướt qua ánh trăng. Hoa nhài dại mọc kín chân tường, che những nấm đất thấp.",spots:[H("graves","Năm nấm mộ không bia",23,52,70,24),H("inspect:papaya","Cây đu đủ già",62,2,16,40),H("inspect:redcloth","Dải vải đỏ trên cọc tre",69,43,6,13),H("inspect:jasmine","Hoa nhài dại",0,56,14,30),H("travel:BG25","Cổng vườn sau",10,26,10,36)]},
 BG30:{name:"Ban công tầng hai",time:"04:30",chapter:'CHƯƠNG 10 · NĂM CÁI TÊN',mood:"BAN CÔNG · 04:30",caption:"Từ đây nhìn xuống cả khu rừng, và xa xa là vài đốm đèn của thôn Đồng Chay.",look:"Gió thổi qua lan can mục. Chiếc ghế bập bênh vẫn khẽ đung đưa.",spots:[H("chair","Ghế bập bênh",56,38,22,46),H("inspect:tea2","Bộ ấm trà nguội trên bàn tròn",41,52,15,32),H("inspect:herbs","Bó thuốc nam treo",55,12,12,22),H("inspect:lights","Ánh đèn thôn xa xa",59,26,12,10),H("travel:BG27","Cửa vào phòng ngủ",82,14,18,66)]},
 BG31:{name:"Bên trong miếu cây đa",time:"04:50",chapter:'CHƯƠNG 10 · NĂM CÁI TÊN',mood:"TRONG MIẾU · 04:50",caption:"Rễ đa quấn kín tường. Năm bát hương xếp hàng, một ngọn nến vẫn cháy.",look:"Dải vải đỏ buộc trên những chiếc rễ, mỗi năm một dải. Nến chảy xuống mặt bàn đá.",spots:[H("incenseFive","Năm bát hương trên bàn đá",40,52,32,12),H("inspect:statues","Những pho tượng gỗ nhỏ",51,33,19,18),H("inspect:jar2","Chiếc chum lớn",91,77,9,16),H("travel:BG05","Ra khỏi miếu",6,22,15,48)]},
 BG32:{name:"Kho đồ lễ dưới hầm",time:"04:45",chapter:'CHƯƠNG 10 · NĂM CÁI TÊN',mood:"KHO ĐỒ LỄ · 04:45",caption:"Năm vị trí vẽ phấn, năm bát lễ. Cánh cửa gỗ hắt ra một vệt sáng đỏ.",look:"Nước nhỏ giọt từ trần. Trên tường là những vạch phấn trắng, xếp nhóm năm một.",spots:[H("cellMarks","Những vạch phấn trên tường",3,12,14,20),H("inspect:ring","Vòng sắt buộc dây đỏ",18,17,6,20),H("anchorRitual","Năm vị trí vẽ phấn và năm bát lễ",34,66,62,17),H("inspect:jar3","Chiếc vò nước nứt",53,38,8,17),H("travel:BG26","Cánh cửa lên kho vật tư",85,6,15,55),H("fakeFind","Xấp giấy lễ trên bàn",13,59,11,9)]},
 BG34:{name:"Bếp biệt thự, năm 1988",time:"02:50",chapter:"ĐÊM 17/3/1988 · BÉ MƠ",mood:"BẾP · 1988",caption:"Than hồng còn đỏ. Một chiếc bát nhỏ nằm riêng trên mâm tre.",look:"Bếp nhà ông Bá Lâm còn nguyên vẹn, ấm mùi khói rạ.",spots:[H("fbBowl","Chiếc bát nhỏ để riêng",55,78,9,10),H("fbMan","Bà Mận ngủ gật bên bếp",19,35,17,40),H("inspect:fbBasket","Rổ tre đựng gạo",88,57,12,32),H("inspect:fbLamp3","Ngọn đèn dầu trên bàn bếp",56,35,5,11),HR("fbBowl","travel:BG35","Cánh cửa sang hành lang",79,11,15,53)]},
 BG35:{name:"Hành lang tầng hai, năm 1988",time:"02:58",chapter:"ĐÊM 17/3/1988 · BÉ MƠ",mood:"HÀNH LANG · 1988",caption:"Dưới khe cửa phòng cha có một vệt đèn dầu và tiếng hai người đàn ông nói chuyện.",look:"Sàn gỗ bóng, bình hoa mới cắm, đèn dầu chưa tắt.",spots:[H("fbKeys","Chỗ nghe lén cạnh cánh cửa",86,6,9,32),H("fbCha","Cánh cửa phòng cha",63,0,18,78),H("inspect:fbLamp","Ngọn đèn dầu",49,40,6,14),H("travel:BG34","Xuống bếp",0,40,10,50),HR("fbKeys","travel:BG37","Xuống cầu thang bếp",12,28,16,45)]},
 BG37:{name:"Cửa hầm sau bếp, năm 1988",time:"03:05",chapter:"ĐÊM 17/3/1988 · BÉ MƠ",mood:"CỬA HẦM · 1988",caption:"Tiếng đập cửa và tiếng người gọi vọng lên từ bên dưới. Then gỗ cài từ phía ngoài.",look:"Hơi nóng và mùi khói đồ lễ lọt qua khe cửa.",spots:[H("fbLua","Tiếng gọi sau cánh cửa",50,50,28,36),H("fbBowls","Then cửa gỗ",42,28,38,16),H("inspect:fbLamp2","Ngọn đèn bão",31,12,6,18),HR("fbFed","fbLock","Cha kéo Mơ ra ngoài",4,35,18,40)]},
 BG36:{name:"Hành lang bếp, cửa hầm vẫn đóng",time:"03:12",chapter:"ĐÊM 17/3/1988 · BÉ MƠ",mood:"HÀNH LANG BẾP · 1988",caption:"Tiếng đập cửa nhỏ dần phía sau. Ngoài sân có ánh đèn của bàn tế.",look:"Mơ ngồi bệt xuống sàn nơi cha vừa gạt em ra.",spots:[H("inspect:fbSilent","Tiếng gõ cửa yếu dần",30,28,13,18),H("travel:BG38","Chạy ra sân giếng",80,17,17,60)]},
 BG38:{name:"Sân giếng, đêm mưa năm 1988",time:"03:17",chapter:"ĐÊM 17/3/1988 · BÉ MƠ",mood:"SÂN GIẾNG · 03:17",caption:"Mưa xối xuống sân. Chiếc đèn bão nằm nghiêng bên miệng giếng.",look:"Mưa tạt rát mặt. Trên miệng giếng, nắp gỗ đã xô lệch.",spots:[H("fbSeal","Thứ gì đó đặt trên thành giếng",58,47,22,9),HR("fbSeal","fbLeft","Bám tường chạy vòng bên trái",0,12,30,70),HR("fbSeal","fbWell","Chạy thẳng ngang miệng giếng",42,56,45,30),H("inspect:fbShoe","Chiếc giày vải nhỏ",55,83,8,7)]},
 BG39:{name:"Đường làng trong mưa",time:"03:20",chapter:"ĐÊM 17/3/1988 · BÉ MƠ",mood:"ĐƯỜNG LÀNG · 1988",caption:"Một đốm sáng rất xa. Em chưa bao giờ tới được.",look:"Con đường bùn kéo dài giữa hai rặng tre.",spots:[H("fbLight","Đốm sáng xa xa",80,38,12,16),H("inspect:fbGate","Cổng biệt thự phía sau",2,5,23,70)]},
 BG40:{name:"Rừng thiêng buổi sớm",time:"05:40",chapter:"CHƯƠNG 11 · RỪNG THIÊNG",mood:"RỪNG THIÊNG · 05:40",caption:"Sương loãng dần. Những dải vải đỏ khẽ lay trên cành.",look:"Cây đa, cây gạo và một bàn thờ đá phủ rêu.",spots:[H("forestAltar","Bàn thờ đá trong rừng",28,62,26,22),H("redCloth","Dải vải đỏ có thêu chữ",44,10,6,30),H("inspect:bloom","Hoa gạo đỏ trên cành",66,5,22,18),H("travel:BG41","Lối về nhà bà ngoại Nguyệt",86,60,14,38),H("travel:BG08","Quay về cổng biệt thự",0,78,18,20),HR("simLead","travel:BG48","Đường mòn sang nhà ông Đạt",56,82,26,16)]},
 BG48:{name:"Nhà ông Đạt, xóm Đông",time:"07:10",chapter:"CHƯƠNG 12 · NGƯỜI EM TRAI",mood:"XÓM ĐÔNG · 07:10",caption:"Mái ngói rêu, giàn phơi lá thuốc và chiếc xe đạp cũ dựa tường.",look:"Căn nhà cuối xóm, cửa mở hé. Có mùi lá thuốc phơi nắng.",spots:[H("datDoor","Cánh cửa nhà ông Đạt",54,22,20,48),H("inspect:datTea","Bàn trà ngoài hiên",30,57,15,12),H("inspect:datHerb","Giàn phơi lá thuốc",2,68,26,26),H("inspect:datBike","Chiếc xe đạp cũ",80,48,20,24),H("travel:BG40","Đường mòn về rừng thiêng",62,84,22,13)]},
 BG49:{name:"Trong nhà ông Đạt",time:"07:30",chapter:"CHƯƠNG 12 · NGƯỜI EM TRAI",mood:"NHÀ ÔNG ĐẠT · 07:30",caption:"Bàn thờ nhỏ có ảnh một cô gái đội khăn, cạnh khăn chàm và túi lá thuốc.",look:"Căn nhà gọn gàng, sạch sẽ, thơm mùi nhang và lá thuốc.",spots:[H("simPhoto","Ảnh thờ trên tủ",63,10,17,35),H("simScarf","Khăn chàm và túi lá thuốc",68,44,23,11),H("datBox","Ngăn tủ thờ",45,67,38,28),H("compareScrolls","Bàn trà, chỗ trải giấy ra xem",0,84,46,16),H("travel:BG48","Ra hiên",0,48,7,30)]},
 BG41:{name:"Nhà bà ngoại Nguyệt",time:"06:30",chapter:"CHƯƠNG 11 · RỪNG THIÊNG",mood:"ĐỒNG CHAY · 06:30",caption:"Nắng sớm lên mái ngói. Trên bàn thờ nhỏ có một bức ảnh thờ.",look:"Ngôi nhà nhỏ nơi bà ngoại Nguyệt từng sống.",spots:[H("grandPhoto","Ảnh thờ trên bàn thờ",11,15,9,22),H("inspect:grandChair","Chiếc ghế mây",38,49,23,40),H("inspect:grandTea","Ấm trà trên bàn",25,64,12,12),H("inspect:grandBasket","Chiếc nong treo tường",58,28,8,17),H("grandBox","Ngăn kéo tủ thờ",13,46,18,10),H("travel:BG40","Cửa ra rừng thiêng",70,14,26,58)]},
 BG42:{name:"Miệng giếng bị trám kín",time:"04:10",chapter:"CHƯƠNG 9 · BÁT CƠM NÓNG",mood:"SÂN GIẾNG · 04:10",caption:"Vòng hoa nhài khô nằm trên nắp xi măng nứt.",look:"Ai đó đã xây bịt miệng giếng gần bốn mươi năm trước, và vẫn có người đặt hoa.",spots:[H("wellSealed","Vòng hoa nhài trên nắp giếng",52,41,30,14),H("inspect:jasmine2","Hoa nhài dại",8,5,8,10),H("travel:BG09","Quay ra sân",0,62,24,34)]},
 BG43:{name:"Gác nhỏ của cô Lụa",time:"04:00",chapter:"CHƯƠNG 9 · BÁT CƠM NÓNG",mood:"GÁC NHỎ · 04:00",caption:"Hạc giấy khẽ xoay trên xà. Trên bàn, một cuốn sổ nằm mở.",look:"Căn gác sau bếp, nơi cô Lụa ngủ mỗi đêm trước khi bị nhốt.",spots:[H("luaDiary","Cuốn nhật ký trên bàn",47,42,20,16),H("takeDoll","Con búp bê vải",75,50,12,16),H("tornPhoto","Mảnh ảnh giấu dưới gối",6,48,25,16),H("inspect:comb2","Chiếc lược gỗ",73,66,11,16),H("inspect:cranes2","Hạc giấy treo trên xà",45,10,22,18),H("inspect:window3","Cửa sổ nhìn xuống sân",84,18,15,28),H("travel:BG13","Xuống bếp",0,4,9,28)]},
 BG44:{name:"Chỗ cắm trại trên hiên",time:"03:45",chapter:"ĐÊM TRẠI",mood:"HIÊN NHÀ · 03:45",caption:"Ngọn lửa nhỏ đủ sưởi ấm năm người, và đủ để họ nói chuyện.",look:"Năm túi ngủ quanh đống lửa trước hiên biệt thự.",spots:[H("campfire","Đống lửa trại",49,56,13,23),H("inspect:kettle","Ấm nước đun trên lửa",42,62,6,8),H("inspect:bags","Túi ngủ của cả nhóm",16,70,26,22),H("inspect:flash2","Đèn pin để dưới đất",56,80,6,4),H("travel:BG10","Xuống bậc hiên",88,8,12,60)]},
 BG45:{name:"Sân ngoài chùa làng",time:"08:30",chapter:'CHƯƠNG 1 · ĐỒNG CHAY',mood:"SÂN CHÙA · 08:30",caption:"Sân gạch dưới tán cây đại. Một bàn gỗ nhỏ, ba đồng xu trên đĩa sứ.",intro:["Ánh","Sân chùa yên quá. Ông cụ ngồi bên bàn xem quẻ kia có vẻ biết trước bọn mình sẽ đến."],look:"Hoa đại rụng trắng trên gạch. Ở sâu trong chùa có hai ngọn đèn lồng sáng giữa ban ngày.",spots:[H("huu","Ông Hựu và bàn xem quẻ",61,63,28,34),H("inspect:pagoda","Chùa làng",33,10,30,35),H("inspect:daitree","Cây đại nở hoa",72,0,28,40),H("travel:BG01","Về cổng làng",0,60,24,38)]},
 BG46:{name:"Bàn lễ trước miếu cây đa",time:"20:30",chapter:'CHƯƠNG 1 · LỐI VÀO RỪNG',mood:"BÀN LỄ · 20:30",caption:"Sáu chỗ bày lễ trên mặt bàn gỗ mục. Hai ngọn đèn đang cháy.",intro:["Nguyệt","Mâm lễ bày trước miếu. Đếm thử xem: sáu chỗ."],look:"Cơm, nước, hoa cúc trắng. Một chỗ đèn chưa thắp. Rễ đa ôm kín bức tường miếu.",spots:[H("lampSix","Ngọn đèn chưa thắp",62,67,17,15),H("inspect:lamps2","Hai ngọn đèn đang cháy",24,66,34,17),H("folkOffering","Mâm lễ có bốn hõm gỗ",26,50,52,14),H("inspect:petition2","Cuộn giấy và tấm vải đỏ",3,58,17,22),H("inspect:idol","Bài vị trong khám đá",40,14,20,28),H("travel:BG05","Lùi lại",34,91,32,9)]},
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
/* Những nhịp vào cảnh dùng bản thoại mới; lời sau khi chạm vật chứng vẫn chờ đúng tương tác. */
const REVIEWED_INTROS={
 BG01:['S01',0,7],BG02:['S03',0,8],BG03:['S06',0,5],BG04:['S07',0,6],
 BG05:['S08',0,3],BG06:['S10',0,3],BG07:['S11',0,1],BG08:['S12',0,4],BG09:['S14',1,3],BG10:['S15',0,3],
 BG12:['S17',0,2],BG13:['S18',0,2],BG14:['S19',0,4],BG18:['S23',0,2],BG23:['S28',0,2],
 BG27:['S32',0,2],BG28:['S33',0,5],BG29:['S34',0,4],BG30:['S35',0,1],BG43:['S39',0,2]
};
function introOf(id){const spec=REVIEWED_INTROS[id],lines=spec&&reviewed(spec[0]).slice(spec[1],spec[2]);return lines&&lines.length?lines:(CONVO[id]||(SCENES[id].intro?[SCENES[id].intro]:[]))}
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
 kidDrawing:{id:"lua",name:"Phạm Thị Lụa",role:"vú nuôi, cô giáo đầu tiên của bé Mơ",relicName:"bức tranh bé Mơ vẽ",own:true,set:null,lines:[["Ánh","Bức tranh bé Mơ vẽ: một ngôi nhà, một bé gái nhỏ xíu và một người phụ nữ cao lớn nắm tay em. Dưới chân người ấy có dòng chữ nguệch ngoạc: “cô Lụa”."],["Nguyệt","Trên bảng đen còn dòng: “Phạm Thị Lụa dạy Mơ chữ.” Cô là người nuôi em từ khi em còn bé xíu."],["Tuyết","Nét phấn nào cũng nắn nót cho trẻ con học. Cô dạy em từng nét một."],["Ánh","Tớ nhớ hộp nhạc rồi. Cô ấy hát ru, cô ấy cũng dạy chữ. Cô ấy thương em như một người mẹ."],["Nguyệt","Phạm Thị Lụa. Cảm ơn cô đã không bỏ em."]]},
 storeBook:{id:"tam",name:"Nguyễn Văn Tâm",role:"thủ kho giữ sổ vật tư",relicName:"cuốn sổ kho vật tư",own:true,set:"hatchSeen",lines:[["Nguyệt","Cuốn sổ mở sẵn, trang cuối viết dở: “Cấp cho thầy Tịnh: nến, giấy sớ, vải đỏ và tấm vải che ô thông gió gian hầm. Người nhận ký: T. Ký duyệt: Bá Lâm.” Ghi lại: Nguyễn Văn Tâm, thủ kho."],["Đông","Chữ ký của bác Tâm. Bác ghi hết, từng món một. Bác biết mình đang giữ bằng chứng chống lại ông chủ."],["Nam","Lề trang có thêm dòng nhỏ: “Nếu tôi không ra khỏi hầm, hãy tìm dưới đống đồ lễ.” Dưới đống đồ lễ?"],["Tuyết","Cậu thấy không, chỗ đồ lễ đổ trên sàn có vết kéo lê. Dưới đó có nắp gỗ!"],["Nguyệt","Nguyễn Văn Tâm. Bác đã dũng cảm hơn tất cả chúng cháu."]]},
 cellMarks:{id:"khoa",name:"Đỗ Văn Khoa",role:"người dạy chữ cho Mơ",relicName:"những vạch phấn trên tường",own:true,set:null,lines:[["Tuyết","Những vạch phấn trên tường, nhóm năm một. Bên dưới có dòng chữ nắn nót: “Đỗ Văn Khoa, dạy học. Lời khấn bị sửa. Cửa khóa từ ngoài. Chúng tôi sẽ ra cùng nhau.”"],["Nguyệt","Người dạy chữ cho Mơ. Thầy ghi tên từng người ngay trên tường, nhưng bốn cái tên kia đã mờ gần hết. Chỉ còn tên thầy rõ nhất."],["Đông","Họ ghi lại để không ai quên mình đã ở đây. Cả đời thầy dạy người ta biết đọc, và chữ cuối cùng thầy viết lại là để cầu cứu."],["Tuyết","Dưới cùng còn một câu: “Nếu ai đọc được, xin nhắn về làng: cửa hầm bị khóa từ bên ngoài, đừng tin bản sớ.” Tớ khóc mất."],["Nguyệt","Đỗ Văn Khoa. Thầy ơi, lời nhắn của thầy đã tới nơi rồi."]]}
};
const arcOn=()=>!!(state.flags.lamDone&&!state.flags.flashDone);
const questOn=()=>!!(state.flags.lamDone&&state.flags.flashDone&&!state.flags.namesDone);
const namesFound=()=>Array.isArray(state.flags.names)?state.flags.names:[];
/* Trả true nếu hành động này là một manh mối tên (đã xử lý xong, không cần chạy tiếp) */
function nameClueAt(action){const c=QNAMES[action];if(!c)return false;
 if(!questOn()){
  if(!c.own)return false;
  if(state.flags.namesDone)say('Nguyệt',c.name+', '+c.role+'. Tên đã được trả lại.');
  else{const early={kidDrawing:['Ánh','Bức tranh có hai người nắm tay nhau. Nét bút trẻ con đã nhòe, nhưng có vẻ người phụ nữ rất quan trọng với em.'],storeBook:['Nguyệt','Sổ ghi vật tư đưa xuống hầm. Có những dòng đã bị sửa; mình cần đọc kỹ hơn khi biết chuyện gì xảy ra.'],cellMarks:['Tuyết','Các vạch phấn được xếp thành nhóm. Dưới đó còn vài nét chữ đã mờ.']};say(...early[action])}
  return true;
 }
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
 if(f.length<5){showModal(`<h2>Năm nấm mộ không bia</h2><p>Mỗi nấm mộ đang chờ một cái tên. Bạn đã biết <strong>${f.length}/5</strong> cái tên.</p><p class="modal-note">Các vật chứng và trang sổ đã tìm được có thể giúp gọi lại những cái tên.</p><div id="names-actions" class="modal-buttons"></div>`,'VƯỜN SAU','names');$('names-actions').appendChild(modalButton('Đã hiểu',hideModal));return}
 if(!has('incense5')){say('Nguyệt','Có đủ tên rồi, nhưng chưa có nhang. Bà Mận để dành nhang trong miếu cây đa, chỗ bát hương ven rừng.');return}
 if(state.selectedItem!=='incense5'){say('Nguyệt','Mình chọn năm nén nhang trong túi đồ, rồi chạm vào các nấm mộ.');return}
 graveOrder=['tam','hai','khoa','sen','lua'];graveSlot=0;graveTaken=[];renderNames()}
function renderNames(){const cur=NAME_LIST.find(c=>c.id===graveOrder[graveSlot]);
 showModal(`${puzzleContextArt(BG('BG29'),'Vườn mộ sau biệt thự')}<h2>Khấn tên người đã khuất</h2><p><strong>Nấm mộ ${graveSlot+1} / 5</strong></p><p>Nấm mộ này là của <strong>${escapeHTML(cur.role)}</strong>. Hãy đọc đúng tên người ấy.</p><div id="name-options" class="ritual-list"></div><p class="modal-note">Hãy đọc lại nhật ký nếu chưa nhớ.</p>`,'CÂU ĐỐ · NĂM CÁI TÊN','names');
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
 BG29:[["Tuyết","Vườn sau... năm nấm mộ, không bia. Chỉ có cọc tre và mấy bát nhang nguội."],["Nguyệt","Ai đó đã dựng năm mộ gió ở đây và trồng hoa nhài để tưởng nhớ họ."],["Mơ","Bà Mận thắp nhang cho họ mỗi đêm, lén thôi, để cha không biết. Bà không biết tên họ, nên chỉ cắm nhang chứ không khấn."],["Đông","Vậy hôm nay mình sẽ khấn, bằng đúng tên. Phải tìm đủ tên trước đã."]],
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
 wardrobe2:["Ánh","Tủ gương mờ, trong có áo dài của bà Hạnh và một chiếc váy trẻ con may dở. Mảnh giấy kẹp trong áo nhắc bà rời nhà trước đêm lễ, sau cuộc cãi vã với ông Lâm."],
 chalk:["Nguyệt","Bảng viết đầy chữ cái, nét phấn nắn nót. Góc dưới có dòng viết vội: “Mơ giỏi lắm.”"],
 cranes:["Ánh","Hạc giấy mỗi con một màu, gấp từ trang sách cũ. Đếm được đúng một trăm con. Em gấp để cầu điều ước nào vậy?"],
 shelf2:["Tuyết","Giá sách toàn truyện cổ tích và vài cuốn sách học vần. Cuốn nào cũng cũ mòn gáy vì được giở đi giở lại."],
 toycart:["Nam","Chiếc xe gỗ đồ chơi, bánh nhỏ xíu. Em từng kéo nó khắp phòng. ...Tớ không nên nhìn lâu."],
 papaya:["Nam","Cây đu đủ trĩu quả, rễ lan tới những nấm mộ gió. Hoa nhài được ai đó chăm sóc quanh đây."],
 redcloth:["Tuyết","Dải vải đỏ mới buộc, chưa bạc màu. Người thân của họ chưa quên, hoặc có người vẫn thay vải mỗi năm."],
 jasmine:["Ánh","Hoa nhài trắng muốt giữa đất ẩm. Mùi thơm dịu, buồn buồn. Có ai chăm chúng, không thể tự mọc đẹp thế này."],
 tea2:["Tuyết","Bộ ấm trà nguội trên bàn tròn, một chén đã cạn. Người ngồi đây uống đến giọt cuối rồi mới đứng dậy."],
 herbs:["Nguyệt","Bó thuốc nam treo khô: ngải cứu, lá lốt. Của bà Mận, tớ chắc vậy. Bà từng chữa bệnh cho cả nhà."],
 lights:["Ánh","Những đốm đèn xa kia là Đồng Chay. Gần như vậy mà tiếng kêu cứu trong đêm ấy vẫn không đưa được ai tới mở cửa."],
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
 BG34:[["Mơ","Bếp vẫn còn than hồng. Bà Mận ngủ gật bên bếp rồi."],["Mơ","Trên mâm có mấy cái bát úp nắp, và một cái bé xíu không có nắp, vừa tay con. Bát bé ấy để riêng, không ai nói là của ai."]],
 BG35:[["Mơ","Cha còn thức. Đèn dầu vẫn sáng dưới khe cửa."],["Mơ","Cha đang nói chuyện với một người lạ. Con phải thật nhẹ, nhẹ như con mèo."]],
 BG37:[["Mơ","Cánh cửa dưới bếp... Sao có tiếng người ở bên dưới?"]],
 BG36:[["Mơ","Cha đẩy con ra rồi. Dưới kia vẫn còn tiếng gõ. Mà ngoài sân có ánh đèn..."]],
 BG38:[["Mơ","Mưa to quá. Thầy Tịnh vừa đặt gì đó lên thành giếng rồi vào nhà. Giếng ở ngay giữa sân."]],
 BG39:[["Người kể chuyện","Con đường dẫn ra làng chỉ có một ánh đèn nhỏ ở rất xa."]],
 BG40:[["Nguyệt","Rừng thiêng. Sương loãng dần. Những dải vải đỏ này có ai buộc từng năm một."],["Đông","Chúng ta đã ra được khỏi biệt thự. Nhưng cảm giác như còn một việc chưa xong."]],
 BG41:[["Nguyệt","Nhà bà ngoại tớ. Tớ chưa bao giờ vào đây từ ngày bà mất."]],
 BG48:[["Nguyệt","Nhà cuối xóm Đông, đúng như bà tả. Cửa mở hé kìa."],["Tuyết","Gõ cửa thôi. Nhớ nói nhỏ nhẹ."]],
 BG49:[["Ông Đạt","Ngồi đi, ngồi đi. Nhà chật, các cháu cứ tự nhiên."]],
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
 fbLamp3:["Mơ","Đèn dầu trên bàn bếp. Bà Mận luôn để sáng đến tận khi cả nhà ngủ."],
 fbLamp:["Mơ","Đèn dầu của cha. Cha thức khuya hơn cả con gà trống."],
 fbLamp2:["Mơ","Đèn dầu leo lét. Hơi nóng và mùi khói lễ lọt qua khe cửa, nồng đến cay mắt."],
 fbSilent:["Mơ","Tiếng gõ yếu dần. Có ai đó ho, rồi im. Con không dám nghe tiếp."],
 fbShoe:["Mơ","Giày của con. Con làm rơi mất một chiếc rồi. Mẹ... à, cô Lụa sẽ mắng cho xem."],
 fbGate:["Người kể chuyện","Cánh cổng sắt phía sau đang khép dần. Ánh đèn phòng cha vẫn sáng."],
 bloom:["Nguyệt","Hoa gạo đỏ rực giữa rừng. Người làng nói nó nở để tiễn người đi xa."],
 grandChair:["Nguyệt","Chiếc ghế mây của bà. Bà ngồi đây mỗi chiều, nhìn về phía rừng, và không bao giờ kể tớ nghe vì sao."],
 grandTea:["Nguyệt","Ấm trà vẫn còn một chén úp. Chén của bà."],
 grandBasket:["Nguyệt","Cái nong bà phơi đậu. Bà thương cả những hạt đậu rơi."],
 datTea:["Đông","Ấm trà còn ấm. Ông ấy mới pha xong, chắc là có người nhìn thấy mình từ xa."],
 datHerb:["Ánh","Lá ngải, lá mơ, lá gì tớ không biết tên. Phơi gọn ghẽ lắm, người làm cẩn thận."],
 datBike:["Nam","Xe đạp cũ rích mà xích còn tra dầu. Chắc ông ấy đi đâu cũng bằng cái này."],
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
  flags:{gateOpened:false,frontOpened:false,wallOpened:false,clockSeen:false,safeOpened:false,ritualDone:false,mirrorPhoto:false,forgedRiteRejected:false,forgedRiteAccepted:false,sealRecovered:false,ending:null},
  ritualProgress:[],used:[],camMode:'night',selectedItem:null,sound:true,flashlight:false,endingsSeen:[]
});
let state=initialState();
let dialogueOpen=false;let modalType=null;let modalReturnFocus=null;let toastTimer=null;
/* Ảnh góc nhìn riêng cho những cuộc gặp và vật chứng quan trọng. */
const DAT_ROOM_VIEW={scene:'BG49',file:'POV_Ong_Dat_Trong_Nha.webp',subject:'Ông Đạt',alt:'Ông Đạt ngồi đối diện trong căn nhà bên bàn thờ chị Sim'};
const INTERACTION_VIEWS={
 warning:{scene:'BG01',file:'POV_Ba_Ban_Nuoc.webp',subject:'Bà bán nước',alt:'Bà bán nước ngồi đối diện bên bàn trà'},
 huu:{scene:'BG45',file:'POV_Ong_Huu.webp',subject:'Ông Hựu',alt:'Ông Hựu ngồi đối diện bên bàn xem quẻ và ba đồng xu'},
 shrine:{scene:'BG05',file:'POV_Bat_Huong.webp',alt:'Bát hương trước miếu cây đa'},
 marker:{scene:'BG07',file:'POV_Cot_Moc.webp',alt:'Cột mốc đá có bốn vòng khắc'},
 well:{scene:'BG09',file:'POV_Gieng_Da.webp',alt:'Nhìn gần miệng giếng đá trong sân'},
 datDoor:{scene:'BG48',file:'POV_Ong_Dat_Cua_Nha.webp',subject:'Ông Đạt',alt:'Ông Đạt đứng ở cánh cửa hé mở'},
 simPhoto:DAT_ROOM_VIEW,simScarf:DAT_ROOM_VIEW,datBox:DAT_ROOM_VIEW,compareScrolls:DAT_ROOM_VIEW,
 fbMan:{scene:'BG34',file:'POV_Ba_Man_Ben_Bep.webp',subject:'Bà Mận',alt:'Bà Mận ngồi bên bếp than trong đêm năm 1988'},
 fbManWake:{scene:'BG34',file:'POV_Ba_Man_Thuc.webp',subject:'Bà Mận',alt:'Bà Mận đã tỉnh và nhìn về phía Mơ'},
 spoon:{scene:'BG13',file:'POV_Muoi_Com.webp',alt:'Chiếc muôi cơm gãy nằm trong tro bếp'},
 mirror:{scene:'BG16',file:'POV_Guong_Phong_Tre.webp',alt:'Chiếc gương cũ phản chiếu căn phòng trẻ trống'},
 musicbox:{scene:'BG21',file:'POV_Hop_Nhac.webp',alt:'Hộp nhạc cũ trên nền phòng trẻ'},
 folkOffering:{scene:'BG46',file:'POV_Mam_Le.webp',alt:'Mâm gỗ trước miếu cây đa'},
 sealedWall:{scene:'BG19',file:'POV_Tuong_Chan.webp',alt:'Những dấu tay trên bức tường bị bịt'},
 wellSealed:{scene:'BG42',file:'POV_Gieng_Tram.webp',alt:'Vòng hoa nhài trên nắp giếng bị trám'}
};
let activeInteractionView=null,interactionViewToken=0,interactionPan=null;
function interactionViewFor(action){return INTERACTION_VIEWS[action==='fbMan'&&state.flags.fbMan==='wake'?'fbManWake':action]}
/* Thành tựu tồn tại qua nhiều lần chơi, riêng với bản lưu của từng cuộc điều tra. */
const ACHIEVEMENT_KEY='loi-nguyen-rung-thieng-achievements-v1';
const ACHIEVEMENTS=[
 {id:'shrine',title:'Qua gốc đa',detail:'Tìm đến miếu ven rừng.',earned:s=>s.visited.includes('BG05')},
 {id:'folk',title:'Dấu miếu',detail:'Mở cơ cấu ở cột mốc bằng manh mối từ miếu.',earned:s=>!!s.flags.folkMarkerDone},
 {id:'gate',title:'Cánh cổng Vân Hòa',detail:'Mở cổng biệt thự.',earned:s=>!!s.flags.gateOpened},
 {id:'relic',title:'Dấu vết còn lại',detail:'Tìm được một di vật.',earned:s=>s.relics.length>0},
 {id:'all_relics',title:'Năm dấu vết',detail:'Tìm đủ năm di vật.',earned:s=>s.relics.length>=5},
 {id:'memory',title:'Lắng nghe ký ức',detail:'Chứng kiến một ký ức của di vật.',earned:s=>Array.isArray(s.flags.memoriesSeen)&&s.flags.memoriesSeen.length>0},
 {id:'books',title:'Người đọc dấu xưa',detail:'Giải năm câu đố từ tư liệu.',earned:s=>Array.isArray(s.flags.researchSolved)&&s.flags.researchSolved.length>=5},
 {id:'sixth',title:'Một cái tên được gọi',detail:'Tìm lại tên của em bé.',earned:s=>!!s.flags.sixthDone},
 {id:'past',title:'Đêm không bị quên',detail:'Đi qua ký ức năm 1988.',earned:s=>!!s.flags.flashDone},
 {id:'names',title:'Gọi đủ năm tên',detail:'Trả lại tên cho năm người.',earned:s=>!!s.flags.namesDone},
 {id:'ending',title:'Một con đường trở về',detail:'Hoàn thành một kết thúc.',earned:(s,p)=>p.endings.length>0},
 {id:'endings',title:'Bốn ngả đường',detail:'Khám phá đủ bốn kết thúc.',earned:(s,p)=>p.endings.length>=4}
];
function readAchievements(){
 try{const p=JSON.parse(localStorage.getItem(ACHIEVEMENT_KEY)||'{}'),ids=new Set(ACHIEVEMENTS.map(a=>a.id));return {unlocked:Array.isArray(p.unlocked)?[...new Set(p.unlocked.filter(x=>ids.has(x)))]:[],endings:Array.isArray(p.endings)?[...new Set(p.endings.filter(x=>['bad','normal','good','true'].includes(x)))]:[]}}catch(_){return {unlocked:[],endings:[]}}
}
let achievementProfile=readAchievements(),achievementTimer=0;
function syncAchievements(announce=true,progress=state){
 const before=achievementProfile.endings.length;
 achievementProfile.endings=[...new Set([...achievementProfile.endings,...progress.endingsSeen.filter(x=>['bad','normal','good','true'].includes(x))])];
 const added=[];for(const a of ACHIEVEMENTS)if(!achievementProfile.unlocked.includes(a.id)&&a.earned(progress,achievementProfile)){achievementProfile.unlocked.push(a.id);added.push(a)}
 if(added.length||before!==achievementProfile.endings.length){try{localStorage.setItem(ACHIEVEMENT_KEY,JSON.stringify(achievementProfile))}catch(_){}}
 const pop=$('achievement-pop');if(announce&&added.length&&pop){pop.textContent='Thành tựu: '+added[0].title+(added.length>1?' · +'+(added.length-1):'');pop.classList.add('visible');clearTimeout(achievementTimer);achievementTimer=setTimeout(()=>pop.classList.remove('visible'),4000)}
 return added;
}
/* ================= ÂM THANH =================
   Quy tắc: mỗi âm thanh chỉ phát ở nơi nó thật sự có thể vang lên trong cảnh đó. */
const SOUND={door:'creaking-door.mp3',slam:'door-slam.mp3',knock:'knock-on-the-door.mp3',steps:'tieng_buoc_chan.mp3',page:'pageturn.mp3',camera:'Chup_anh.mp3',lighter:'lighter.mp3',switch:'light-switch.mp3',
 market:'tieng_on_ao_o_cho.mp3',water:'nuoc_chay.mp3',frogs:'community-frogs.mp3',frogsNight:'frogs-croaking-at-night.mp3',gecko:'than_lan_keu_3s.mp3',crickets:'tieng_de_keu.mp3',musicbox:'music_box.mp3',rain:'rain.mp3',forest:'nature_forest.mp3',house:'ambient_house.mp3',crow:'crow.mp3',pick:'pick.mp3'};
const SLAM_LEAD=3.3;                         /* door-slam.mp3: cú đập nằm ở ~4,0 s; bắt đầu phát từ 3,3 s để nó vang ngay sau tiếng kẽo kẹt */
/* Tương tác = nhân vật bước tới chỗ đó: dùng tieng_buoc_chan.mp3 (3 bước khi đi sang cảnh khác, 2 bước khi xem/nhặt đồ). */
const PAPER_ITEMS=['scrollFake','scrollOrig','simLetter','map88','petition','testimony','fragA','fragB','fragC','legendDoc','backDoc','folkPrint'];  /* chỉ vật bằng giấy mới có tiếng lật giấy khi nhặt */
const VILLA_ROOMS=['BG43','BG11','BG12','BG13','BG14','BG15','BG16','BG17','BG23','BG24','BG27','BG28']; /* tiếng thằn lằn chỉ có ở trong nhà biệt thự */
const AMBIENCE={
 BG01:{market:.22},                        /* cổng làng, đông người */
 BG02:{market:.12},                        /* ngõ làng, tiếng ồn xa dần */
 BG03:{water:.5,frogs:.35},                /* ruộng có mương: nước chảy + ếch */
 BG04:{water:.6,frogsNight:.9,crickets:.5},  /* cầu gỗ lúc chiều muộn: ếch + dế */
 BG05:{frogsNight:.6,crickets:.55,forest:.2},         /* ven rừng ban đêm */
 BG06:{crickets:.4,forest:.3},                        /* rừng tre: dế thưa dần; sang BG07 tắt hẳn (Nam: dế im phăng phắc) */
 BG08:{rain:.08},BG09:{rain:.12},BG10:{rain:.08},
 BG25:{rain:.1,crickets:.2},BG29:{forest:.3,crickets:.2},BG38:{rain:.26},BG39:{rain:.24},BG40:{forest:.65,crickets:.1},BG41:{forest:.25},BG48:{forest:.3,crickets:.1},BG49:{forest:.12},BG42:{crickets:.35,forest:.15},BG44:{crickets:.55,frogsNight:.3,forest:.2},
 BG11:{house:.4},BG12:{house:.4},BG13:{house:.4},BG14:{house:.4},BG15:{house:.4},BG16:{house:.4},BG17:{house:.4},BG23:{house:.4},BG24:{house:.4},BG27:{house:.4},BG28:{house:.4},BG43:{house:.35},BG34:{house:.25},BG35:{house:.25},
 BG21:{musicbox:.5},                        /* bên kia gương: hộp nhạc đang phát sáng, giai điệu ru (Für Elise) */
 BG22:{musicbox:.32}                        /* đáy giếng: nhạc vọng xuống nhỏ hơn; tắt sau khi gọi tên Mơ */
};
function playSound(name,volume=.25,from=0,dur=0){if(!state.sound)return;const file=SOUND[name];if(!file)return;try{const a=new Audio(ROOT+'sound/'+file);a.volume=Math.min(1,volume*2.2);const start=()=>{try{if(from)a.currentTime=from}catch(_){}a.play().catch(()=>{});if(dur)setTimeout(()=>{const v=a.volume,t=setInterval(()=>{a.volume=Math.max(0,a.volume-v/6);if(a.volume<=.001){clearInterval(t);a.pause()}},40)},dur*1000)};(from&&a.readyState<1)?a.addEventListener('loadedmetadata',start,{once:true}):start()}catch(_){}}
/* Âm thanh nền theo cảnh: nhiều lớp phát cùng lúc, lớp nào không còn thuộc cảnh mới thì tắt dần */
const AMB_GAIN=.9; /* hệ số âm nền chung: .9 = giảm 10% so với bảng AMBIENCE */
const ambient={};
function fadeTo(e,to,ms,done){clearInterval(e.fade);const a=e.a,from=a.volume,steps=Math.max(1,Math.round(ms/50));let i=0;e.fade=setInterval(()=>{i++;a.volume=Math.max(0,Math.min(1,from+(to-from)*i/steps));if(i>=steps){clearInterval(e.fade);if(done)done()}},50)}
function sceneAmbience(){
 let want=(state.sound&&$('title-screen').hidden)?(AMBIENCE[state.scene]||{}):{};
 if(state.sound&&$('title-screen').hidden&&quietVillageAtNight())want=state.scene==='BG03'?{water:.5,frogsNight:.35,crickets:.2}:{crickets:.25,frogsNight:.15};
 if(state.flags.sixthDone&&want.musicbox){want={...want};delete want.musicbox}
 return want;
}
function setAmbience(){
 const want=sceneAmbience();
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
function save(){try{const d=JSON.stringify(state);localStorage.setItem(SAVE_KEY,JSON.stringify({d,h:sig(d)}))}catch(_){}syncAchievements()}
function load(){try{const raw=localStorage.getItem(SAVE_KEY);if(!raw)return null;const o=JSON.parse(raw);if(!o||typeof o.d!=='string'||o.h!==sig(o.d))return null;
 const s=JSON.parse(o.d);if(!s||typeof s!=='object'||!SCENES[s.scene]||!Array.isArray(s.items)||!Array.isArray(s.relics))return null;
 const base=initialState(),list=(v,ok)=>Array.isArray(v)?v.filter(ok):[],item=x=>typeof x==='string'&&!!ITEMS[x],str=x=>typeof x==='string';
 return {...base,...s,
  items:list(s.items,item),relics:list(s.relics,item),used:list(s.used,item),ritualProgress:list(s.ritualProgress,item),
  evidence:list(s.evidence,str),endingsSeen:list(s.endingsSeen,x=>['bad','normal','good','true'].includes(x)),visited:list(s.visited,x=>!!SCENES[x]),
  notes:list(s.notes,n=>n&&str(n.id)&&str(n.title)&&str(n.body)).map(n=>n.id==='simStory'?{...n,body:n.body.replace('sinh năm 1962','sinh năm 1971')}:n.id==='birth'?{...n,body:n.body.replace('con gái út ông Bá Lâm','được ghi là con của vợ chồng Bá Lâm')}:n.id==='testimony'&&n.body.includes('bế cháu Mơ về phía giếng')?{...n,body:'Bà Mận viết: đêm 17/3/1988 bà nghe tiếng cầu cứu từ hầm nhưng sợ hãi, không dám lên tiếng. Bà giữ lại lời khai để sự thật không bị chôn vùi.'}:n),
  flags:{...base.flags,...(s.flags&&typeof s.flags==='object'&&!Array.isArray(s.flags)?s.flags:{}),legacyEndingsSeen:[...new Set([...list(s.flags&&s.flags.legacyEndingsSeen,str),...list(s.endingsSeen,x=>x==='forgive')])]},
  selectedItem:item(s.selectedItem)?s.selectedItem:null,camMode:CAM_MODES[s.camMode]?s.camMode:'night',sound:s.sound!==false,flashlight:!!s.flashlight};
 }catch(_){return null}}
function has(id){return state.items.includes(id)}
function clue(id){if(!Array.isArray(state.flags.clues))state.flags.clues=[];if(!state.flags.clues.includes(id)){state.flags.clues.push(id);save();return true}return false}
function note(id,title,body){if(!state.notes.some(n=>n.id===id)){state.notes.push({id,title,body});const b=$('btn-journal');if(b)b.classList.add('has-new')}save()}
function gain(id){if(!ITEMS[id]||has(id)||state.used.includes(id))return false;state.items.push(id);if(ITEMS[id].relic&&!state.relics.includes(id))state.relics.push(id);if(PAPER_ITEMS.includes(id))playSound('page',.22);else playSound('pick',.5);itemPop(id);queueMemory(id);save();renderSidebar();return true}
/* Vật phẩm dùng xong thì bị xóa khỏi túi đồ và không nhặt lại được (state.used). quiet=true: không hiện thông báo. */
function consume(id,quiet){if(!state.used.includes(id))state.used.push(id);const had=has(id);state.items=state.items.filter(x=>x!==id);if(state.selectedItem===id)state.selectedItem=null;if(had&&!quiet&&ITEMS[id])toast('Đã dùng hết: '+ITEMS[id].name);renderSidebar();save()}
function evidence(id){if(!state.evidence.includes(id))state.evidence.push(id);save();}
function toast(msg){const el=$('toast');el.textContent=msg;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),2700)}
function itemArt(id,cls){const info=ITEMS[id],box=document.createElement('span');box.className=cls;if(info.image){const img=document.createElement('img');img.src=IMG(info.image);img.alt='';img.draggable=false;box.appendChild(img)}else{box.classList.add('is-emoji');box.textContent=info.emoji||'◆'}return box}
function setDialogueMode(on){$('app-shell').classList.toggle('in-dialogue',on)}
let dlgQueue=[],dlgCb=null;
const MEMORY_ITEMS={scarf:'F01',spoon:'F02',comb:'F03',petition:'F04',sandals:'F05'};
const MEMORY_VIEWS={
 scarf:{file:'Hoi_Uc_Gieng_1988.webp',title:'Chiếc khăn bên giếng',alt:'Ký ức năm 1988 bên miệng giếng'},
 spoon:{file:'Hoi_Uc_Bep_1988.webp',title:'Chiếc muôi trong bếp',alt:'Ký ức năm 1988 trong gian bếp'},
 comb:{file:'Hoi_Uc_Phong_Tre_1988.webp',title:'Chiếc trâm và căn phòng trẻ',alt:'Ký ức năm 1988 trong căn phòng trẻ'},
 petition:{file:'Hoi_Uc_So_Sach_1988.webp',title:'Những trang sổ bị sửa',alt:'Ký ức năm 1988 ở bàn sổ sách'},
 sandals:{file:'Hoi_Uc_Can_Ham_1988.webp',title:'Năm người trong hầm',alt:'Ký ức năm 1988 trong gian hầm'},
 sim:{file:'Hoi_Uc_Sim_1986.webp',title:'Sim và Đạt',alt:'Ký ức năm 1986 của hai chị em',year:'1986'}
};
let pendingMemories=[],activeMemory=null;
function memorySeen(id){return Array.isArray(state.flags.memoriesSeen)&&state.flags.memoriesSeen.includes(id)}
function memoryReady(id){return state.relics.includes(id)&&(id!=='comb'||state.flags.mirrorPhoto)}
function queueMemory(id){if(!MEMORY_ITEMS[id]||memorySeen(id)||!memoryReady(id)||pendingMemories.includes(id))return;pendingMemories.push(id)}
function memoryLines(id){const lines=reviewed(MEMORY_ITEMS[id]);if(state.flags.sixthDone)return lines;
 return lines.map(([who,text])=>[who==='Mơ'?'Bé gái':who==='Ông Bá Lâm'&&id==='scarf'?'Ông chủ':who,
  text.replace(/Mơ, có chuyện/g,'Con à, có chuyện').replace(/Khoan, Mơ đâu rồi\?/g,'Khoan, con bé đâu rồi?').replace(/Mơ còn ở ngoài đó/g,'Con bé còn ở ngoài đó').replace(/Mơ/g,'cô bé')]);}
function refreshMemoryUI(){const banner=$('memory-banner'),shell=$('app-shell');if(!banner||!shell)return;
 const shot=activeMemory&&MEMORY_VIEWS[activeMemory],flash=!!state.flags.mo;
 banner.hidden=!shot&&!flash;shell.classList.toggle('memory-active',!!shot);shell.classList.toggle('flashback-active',flash);
 if(!banner.hidden){$('memory-banner-time').textContent='HỒI ỨC · '+(shot?.year||'1988');$('memory-banner-title').textContent=shot?shot.title:'Đêm 17 tháng 3 · Theo góc nhìn của Mơ'}
}
function markMemorySeen(id){if(!Array.isArray(state.flags.memoriesSeen))state.flags.memoriesSeen=[];if(!memorySeen(id))state.flags.memoriesSeen.push(id);note('memory_'+id,'Ký ức · '+ITEMS[id].name,'Một ký ức gắn với di vật đã hiện ra. Điều đã thấy cần được đối chiếu với vật chứng.');save()}
function playMemory(id){
 const lines=memoryLines(id),shot=MEMORY_VIEWS[id];if(!lines.length||!shot||!memoryReady(id))return;
 pendingMemories=pendingMemories.filter(x=>x!==id);
 const endings={scarf:'Ánh sáng trong sân tắt phụt',spoon:'Tiếng bếp tắt đi',comb:'Ký ức tan dần',petition:'Nguyệt trở lại phòng làm việc'};
 const cut=endings[id]?lines.findIndex(([,text])=>text.startsWith(endings[id])):-1;
 const past=cut<0?lines:lines.slice(0,cut),present=cut<0?[]:lines.slice(cut);
 const done=()=>markMemorySeen(id);talk(past,()=>present.length?talk(present,done):done());
 activeMemory=id;refreshMemoryUI();showSceneView({...shot,scene:state.scene},state.scene);
}
function drainMemories(){if(dialogueOpen||modalType||!$('title-screen').hidden||!pendingMemories.length)return;const id=pendingMemories.shift();if(id&&!memorySeen(id))playMemory(id)}
function showMemories(){
 const ids=Object.keys(MEMORY_ITEMS).filter(memoryReady);
 showModal('<h2>Ký ức qua di vật</h2><p>Chạm vào một di vật để xem lại ký ức gắn với nó.</p><div id="memory-actions" class="modal-buttons"></div>','KÝ ỨC','memories');
 const box=$('memory-actions');for(const id of ids)box.appendChild(modalButton((memorySeen(id)?'✓ ':'◇ ')+ITEMS[id].name,()=>{hideModal();playMemory(id)}));
 if(state.flags.simHeard)box.appendChild(modalButton((state.flags.simMemorySeen?'✓ ':'◇ ')+'Sim và Đạt · năm 1986',()=>{hideModal();playSimMemory()}));
 if(!ids.length&&!state.flags.simHeard)box.appendChild(document.createTextNode('Chưa có ký ức nào để xem.'));
 box.appendChild(modalButton('Đóng',hideModal));
}
function say(who,text){dlgQueue=[];showLine(who,text);setNextLabel()}
function talk(lines,cb){const l=(lines||[]).filter(Boolean);if(!l.length)return;say(l[0][0],l[0][1]);dlgQueue=l.slice(1);dlgCb=cb||null;setNextLabel()}
function setNextLabel(){const b=$('dialogue-next');if(b)b.innerHTML=dlgQueue.length?'TIẾP <span>›</span>':'ĐÓNG <span>✕</span>'}
function nextLine(){if(window.finishTyping&&window.finishTyping())return;if(dlgQueue.length){const [w,t]=dlgQueue.shift();showLine(w,t);setNextLabel()}else{const cb=dlgCb;clearDialogue();if(cb)cb();setTimeout(drainMemories,0)}}
function setDialoguePortrait(who){const pf=PORTRAITS[who],isPerson=!!pf&&(!activeInteractionView||activeInteractionView.subject!==who);
 $('dialogue-portrait-wrap').hidden=!isPerson;$('dialogue').classList.toggle('has-portrait',isPerson);$('dialogue-symbol').hidden=isPerson;
 if(isPerson){$('dialogue-portrait').src=PORTRAIT(pf);$('dialogue-portrait').alt='Chân dung '+who}}
function showLine(who,text){setDialoguePortrait(who);
$('dialogue-speaker').textContent=who;$('dialogue-text').textContent=text;
 $('chatter').classList.remove('on');
 $('dialogue').hidden=false;dialogueOpen=true;setDialogueMode(true)}
function resetSceneScroll(){for(const id of ['app-shell','scene-stage']){const el=$(id);if(el){el.scrollTop=0;el.scrollLeft=0}}}
function clearInteractionView(){interactionViewToken++;const prior=activeInteractionView,pan=interactionPan;activeInteractionView=null;interactionPan=null;const view=$('interaction-view'),shell=$('app-shell'),backdrop=$('scene-backdrop'),column=document.querySelector&&document.querySelector('.game-column');if(view){view.hidden=true;view.onload=null;view.onerror=null}if(shell)shell.classList.remove('interaction-active');if(backdrop&&SCENES[state.scene])backdrop.style.backgroundImage=`url("${sceneBackground(state.scene)}")`;resetSceneScroll();if(column&&prior&&prior.scene===state.scene&&Number.isFinite(pan))column.scrollLeft=pan}
function showSceneView(shot,scene){
 const view=$('interaction-view'),shell=$('app-shell');
 if(!shot||!view||!shell||!dialogueOpen||modalType||shot.scene!==scene||state.scene!==scene)return;
 const token=++interactionViewToken;
 const reveal=()=>{if(token!==interactionViewToken||!dialogueOpen||state.scene!==scene)return;if(!activeInteractionView){const column=document.querySelector&&document.querySelector('.game-column');interactionPan=column?column.scrollLeft:null}activeInteractionView=shot;view.hidden=false;shell.classList.add('interaction-active');const backdrop=$('scene-backdrop');if(backdrop)backdrop.style.backgroundImage=`url("${ROOT}props/${shot.file}")`;resetSceneScroll();setDialoguePortrait($('dialogue-speaker').textContent)};
 view.onload=reveal;view.onerror=()=>{if(token===interactionViewToken)clearInteractionView()};view.alt=shot.alt;view.src=ROOT+'props/'+shot.file;
 if(view.complete&&view.naturalWidth)reveal();
}
function showInteractionView(action,scene){showSceneView(interactionViewFor(action),scene)}
function clearDialogue(){clearInteractionView();activeMemory=null;refreshMemoryUI();dlgQueue=[];dlgCb=null;$('dialogue').hidden=true;dialogueOpen=false;setDialogueMode(false)}
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
const chatBusy=()=>!$('title-screen').hidden||dialogueOpen||!!modalType||document.hidden||document.documentElement.classList.contains('is-busy')||quietVillageAtNight();
function chatClear(){clearTimeout(chatTimer);clearTimeout(chatHide);const c=$('chatter');c.classList.remove('on')}
function chatSchedule(ms){clearTimeout(chatTimer);chatTimer=setTimeout(chatRun,ms)}
function chatRun(){const sid=state.scene,list=OVERHEARD[sid];if(!list)return;if(chatBusy()){chatSchedule(3000);return}
 let pool=list.map((_,i)=>i).filter(i=>!chatSeen.has(sid+i));if(!pool.length){list.forEach((_,i)=>chatSeen.delete(sid+i));pool=list.map((_,i)=>i)}
 const i=pool[Math.floor(Math.random()*pool.length)];chatSeen.add(sid+i);chatPlay(list[i],0,sid)}
function chatPlay(ex,k,sid){if(state.scene!==sid)return;if(chatBusy()){chatSchedule(k?9000:3000);return}
 const c=$('chatter'),[who,text]=ex[k],w=document.createElement('b'),t=document.createElement('span');w.textContent=who;t.textContent=text;c.replaceChildren(w,t);void c.offsetWidth;c.classList.add('on');
 chatHide=setTimeout(()=>{c.classList.remove('on');if(k+1<ex.length)chatTimer=setTimeout(()=>chatPlay(ex,k+1,sid),800);else chatSchedule(20000+Math.random()*16000)},2800+text.length*60)}
function chatEnter(){chatClear();if(OVERHEARD[state.scene]&&!quietVillageAtNight())chatSchedule(3500)}

/* ---- Thông báo nhận vật phẩm ---- */
let popQueue=[],popBusy=false;
function itemPop(id){popQueue.push(id);if(!popBusy)nextPop()}
function nextPop(){const id=popQueue.shift();if(!id){popBusy=false;return}popBusy=true;const info=ITEMS[id],card=document.createElement('div');card.className='pop-card';
 card.appendChild(itemArt(id,'pop-art'));const t=document.createElement('div');t.className='pop-text';
 const k=document.createElement('small');k.textContent=info.relic?`ĐÃ NHẬN DI VẬT · ${state.relics.length}/5`:'ĐÃ NHẬN ĐƯỢC VẬT PHẨM';
 const n=document.createElement('strong');n.textContent=info.name;const d=document.createElement('span');d.textContent=info.description;t.append(k,n,d);card.appendChild(t);
 $('item-pop').appendChild(card);requestAnimationFrame(()=>card.classList.add('in'));
 setTimeout(()=>{card.classList.remove('in');card.classList.add('out');setTimeout(()=>{card.remove();nextPop()},420)},3300)}
function go(target){pendingMemories=[];if(target==='BG11'&&state.flags.lamAwake&&!state.flags.lamDone)target='BG23';if(!SCENES[target])return;const from=state.scene,first=!state.visited.includes(target);state.scene=target;if(first)state.visited.push(target);clearDialogue();hideModal();render();if(first&&(SCENES[target].intro||REVIEWED_INTROS[target]))talk(introOf(target));if(first&&(target==='BG18'||target==='BG19'))setTimeout(()=>playSound('knock',.13),2600);else if((from==='BG11'||from==='BG23')&&target==='BG10')playSound('door',.22);if(target==='BG44')setTimeout(()=>{if(state.scene==='BG44'&&!dialogueOpen&&!modalType)campTalk()},600);save();}
function isTarget(h){const sel=state.selectedItem;return !!(sel&&USE_ON[sel]&&USE_ON[sel].includes(h.action))}
function makeHotspot(h){const b=document.createElement('button');b.type='button';b.className='hotspot'+(isTarget(h)?' is-target':'');b.setAttribute('aria-label',h.label);b.title=h.label;b.style.left=h.x+'%';b.style.top=h.y+'%';b.style.width=h.w+'%';b.style.height=h.h+'%';const span=document.createElement('span');span.className='hotspot-label';span.textContent=h.label;b.appendChild(span);b.addEventListener('click',event=>{event.stopPropagation();act(h.action);});return b}
/* ================= MÁY ẢNH / MÁY QUAY: bộ lọc nhìn đêm (camera.css) ================= */
const CAM_MODES={night:{label:'NIGHT VISION',sub:'NV · IR ILLUMINATOR ON'},ir:{label:'INFRARED',sub:'IR 850 nm · MONO'},thermal:{label:'THERMAL',sub:'HEAT MAP · AUTO GAIN'},vhs:{label:'CAMCORDER',sub:'VHS · LP · TRACKING'}};
const CAM_ORDER=['night','ir','thermal','vhs'];
let camHud=null,camTimer=0,camSecs=0;
function buildCamHud(){
 if(camHud)return;
 const st=$('scene-stage'),grain=st.querySelector('.fx-grain'),h=document.createElement('div');h.className='cam-hud';
 const g=grain&&grain.style.getPropertyValue('--grain');if(g)h.style.setProperty('--cam-noise',g);
 h.innerHTML='<div class="cam-tint"></div><div class="cam-noise"></div><div class="cam-scan"></div><div class="cam-band"></div><div class="cam-vig"></div>'
  +'<i class="cam-c tl"></i><i class="cam-c tr"></i><i class="cam-c bl"></i><i class="cam-c br"></i><div class="cam-cross"></div>'
  +'<div class="cam-tl-info"><span class="cam-rec">● REC</span><span id="cam-tc">00:00:00</span></div>'
  +'<div class="cam-tr-info"><span id="cam-name"></span><span class="cam-batt"><i></i><i></i><i></i></span></div>'
  +'<div class="cam-bl-info"><span id="cam-sub"></span><span class="cam-temp" id="cam-temp"></span></div>'
  +'<div class="cam-br-info"><span id="cam-time"></span></div>'
  +'<button class="cam-mode-btn" id="cam-mode" type="button">⟳ ĐỔI CHẾ ĐỘ [V]</button><div class="cam-flash" id="cam-flash"></div>';
 for(const part of h.children)if(part.id!=='cam-mode')part.setAttribute('aria-hidden','true');
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
 $('cam-name').textContent=m.label;$('cam-sub').textContent=m.sub;$('cam-time').textContent=$('clock-label').textContent+'  ·  '+state.scene;
 if(!camTimer){camSecs=0;camTick();camTimer=setInterval(camTick,1000)}}
function cycleCam(){if(state.selectedItem!=='camera')return;state.camMode=CAM_ORDER[(CAM_ORDER.indexOf(state.camMode)+1)%CAM_ORDER.length];save();updateCam();toast('Máy ảnh: '+CAM_MODES[state.camMode].label)}
function camFlash(){buildCamHud();const f=$('cam-flash');if(!f)return;f.classList.remove('on');void f.offsetWidth;f.classList.add('on')}
function centerScene(){
 const g=document.querySelector&&document.querySelector('.game-column');if(!g||!(g.scrollWidth>g.clientWidth+4))return;
 g.scrollLeft=(g.scrollWidth-g.clientWidth)/2;
 if(!state.flags.panHint&&state.visited&&state.visited.length>1){state.flags.panHint=true;save();toast('Vuốt ngang để nhìn quanh cảnh.')}
}
if(typeof window.addEventListener==='function')window.addEventListener('resize',()=>{if($('title-screen').hidden)centerScene()});
const FLASHBACK_SCENES=new Set(['BG34','BG35','BG36','BG37','BG38','BG39']);
function storyMinute(id){const s=SCENES[id],m=s&&/^(\d{2}):(\d{2})$/.exec(s.time);if(!m||FLASHBACK_SCENES.has(id))return null;const h=Number(m[1]);return h*60+Number(m[2])+((h<7||id==='BG48'||id==='BG49')?1440:0)}
function presentStoryMinute(){const values=[storyMinute(state.scene),...(state.visited||[]).map(storyMinute),Number(state.flags.storyMinute)].filter(v=>Number.isFinite(v)&&v>0);return Math.max(0,...values)}
function storyPeriod(minutes){if(!Number.isFinite(minutes)||minutes<=0)return 'day';const m=minutes%1440;if(m<300||m>=1140)return 'night';if(m<390)return 'dawn';if(m<990)return 'day';return 'dusk'}
/* Ảnh làng, ruộng, cầu và chùa có phiên bản đêm; đường về từ biệt thự có ảnh buổi sớm. */
const NIGHT_SCENE_FILES={BG01:'BG01-night.webp',BG02:'BG02-night.webp',BG03:'BG03-night.webp',BG04:'BG04-night.webp',BG45:'BG45-night.webp'};
const MORNING_SCENE_FILES={BG05:'BG05-morning.webp',BG06:'BG06-morning.webp',BG07:'BG07-morning.webp',BG08:'BG08-morning.webp',BG09:'BG09-morning.webp',BG10:'BG10-morning.webp'};
const NIGHT_OUTDOORS=new Set(['BG05','BG06','BG07','BG08','BG09','BG10','BG25','BG29','BG31','BG42','BG44','BG46']);
const QUIET_VILLAGE=new Set(['BG01','BG02','BG03']);
function quietVillageAtNight(){return !state.flags.mo&&QUIET_VILLAGE.has(state.scene)&&['night','dawn'].includes(storyPeriod(presentStoryMinute()))}
function sceneBackground(id){const s=SCENES[id];if(!s)return BG(id);const minutes=presentStoryMinute(),phase=state.flags.mo?'memory':storyPeriod(minutes);if(NIGHT_SCENE_FILES[id]&&(phase==='night'||phase==='dawn'))return `${ROOT}background/variants/${NIGHT_SCENE_FILES[id]}`;if(MORNING_SCENE_FILES[id]&&minutes>=1440&&(phase==='dawn'||phase==='day'))return `${ROOT}background/variants/${MORNING_SCENE_FILES[id]}`;return BG(s.bg||id)}
function sceneTimeGrade(id){
 if(state.flags.mo||FLASHBACK_SCENES.has(id))return '';
 const minutes=presentStoryMinute(),phase=storyPeriod(minutes);
 if(NIGHT_SCENE_FILES[id]){
  if(phase==='night')return 'night-art';
  if(phase==='dawn')return 'dawn-art';
  if(phase==='dusk'&&id!=='BG04')return 'dusk';
  if(phase==='day'&&id==='BG04'&&minutes>=1440)return 'morning-bridge';
 }
 if(MORNING_SCENE_FILES[id]&&minutes>=1440){if(phase==='dawn')return 'dawn-morning-art';if(phase==='day')return 'morning-art'}
 if(NIGHT_OUTDOORS.has(id)&&minutes>=1440){if(phase==='dawn')return 'dawn-night';if(phase==='day')return 'day-night'}
 return '';
}
function displayStoryTime(){if(state.flags.mo)return SCENES[state.scene].time;
 const minutes=presentStoryMinute();state.flags.storyMinute=minutes;const dayMinute=minutes%1440;return String(Math.floor(dayMinute/60)).padStart(2,'0')+':'+String(dayMinute%60).padStart(2,'0')}
function render(){centerScene();const s=SCENES[state.scene],clock=displayStoryTime(),bg=sceneBackground(state.scene),grade=sceneTimeGrade(state.scene),image=$('scene-image');if(image.getAttribute('src')!==bg)image.src=bg;image.alt='Cảnh '+state.scene+': '+s.name;$('scene-backdrop').style.backgroundImage=`url("${activeInteractionView?ROOT+'props/'+activeInteractionView.file:bg}")`;
 $('scene-title').textContent=s.name;$('scene-stage').dataset.tint=s.tint||'';$('scene-stage').dataset.timeGrade=grade;$('app-shell').dataset.timeGrade=grade;$('clock-label').textContent=clock;$('chapter-label').textContent=state.flags.mo?'CHƯƠNG 9 · ĐÊM 17/3/1988':(s.chapter==='CHƯƠNG 10 · NĂM CÁI TÊN'&&arcOn())?'CHƯƠNG 9 · BÁT CƠM NÓNG':(questOn()&&/^CHƯƠNG 10/.test(s.chapter)?'CHƯƠNG 10 · NĂM CÁI TÊN':s.chapter);$('scene-index').textContent=`${state.scene} / ${Object.keys(SCENES).length}`;refreshMemoryUI();
 $('hotspots').replaceChildren(...[...s.spots.filter(h=>!h.req||state.flags[h.req]),...researchActiveSpots()].map(makeHotspot));
 $('scene-stage').classList.toggle('torch-on',state.flashlight&&parseInt(state.scene.slice(2))>=18);$('scene-stage').classList.toggle('has-selection',!!state.selectedItem);
 $('btn-audio').textContent=state.sound?'♪':'♪̸';$('btn-audio').setAttribute('aria-pressed',state.sound?'true':'false');
 renderSidebar();updateCam();setAmbience();if(chatScene!==state.scene){chatScene=state.scene;chatEnter()}}
/* Thanh vật phẩm ở đáy màn hình */
function renderSidebar(){$('inventory-grid').replaceChildren(...state.items.map(id=>{
 const info=ITEMS[id],b=document.createElement('button');b.className='dock-slot'+(state.selectedItem===id?' selected':'')+(id==='flashlight'&&state.flashlight?' is-on':'');b.type='button';b.setAttribute('aria-label',info.name);b.setAttribute('aria-pressed',state.selectedItem===id?'true':'false');
 b.appendChild(itemArt(id,'dock-art'));if(info.relic){const dot=document.createElement('span');dot.className='dock-dot';b.appendChild(dot)}
 const fragment={fragA:'1',fragB:'2',fragC:'3'}[id];if(fragment){const badge=document.createElement('span');badge.className='dock-fragment';badge.textContent=fragment;badge.setAttribute('aria-hidden','true');b.appendChild(badge)}
 b.title=info.name;
 b.addEventListener('click',()=>selectItem(id));return b}),...Array.from({length:Math.max(0,5-state.items.length)},()=>{const e=document.createElement('span');e.className='dock-empty';e.setAttribute('aria-hidden','true');return e}));
 const sel=state.selectedItem&&ITEMS[state.selectedItem],box=$('selected-item');box.hidden=!sel;box.classList.toggle('has-target',false);
 if(!sel){box.textContent='';return}
 const targets=USE_ON[state.selectedItem],here=targets&&SCENES[state.scene].spots.some(h=>targets.includes(h.action)&&(!h.req||state.flags[h.req]));
 box.textContent='';const n=document.createElement('strong');n.textContent=sel.name;box.append(n,' — '+sel.description);
 const closeAction={toyDoll:'takeDoll',comb:'comb'}[state.selectedItem];if(closeAction){const near=document.createElement('button');near.type='button';near.className='dock-closeup';near.textContent='Xem gần';near.setAttribute('aria-label','Xem gần: '+sel.name);near.addEventListener('click',()=>showSpotCloseup(closeAction,{action:closeAction,label:sel.name}));box.appendChild(near)}
 if(targets){const hint=document.createElement('em');hint.className='dock-hint';hint.textContent=here?'◆ Chạm vào điểm sáng vàng trong cảnh để dùng.':'◇ Chưa có chỗ dùng ở cảnh này.';box.appendChild(hint);box.classList.toggle('has-target',here)}}
function getObjective(){
 const f=state.flags;
 if(f.mo)return ['Ký ức năm 1988','Quan sát những gì Mơ nhìn thấy và đi theo diễn biến của đêm ấy.'];
 if(f.namesDone&&!f.forestDone)return ['Lần theo câu chuyện trong rừng','Đối chiếu lời kể với những tài liệu đã tìm được.'];
 if(questOn())return ['Những người bị lãng quên',`Đã tìm được ${namesFound().length}/5 cái tên. Hãy xem lại các dấu vết và ghi chép.`];
 if(arcOn())return ['Ký ức còn dang dở','Đi theo những dấu vết mới trong biệt thự.'];
 if(f.sixthDone&&!f.lamDone)return ['Bóng trong đại sảnh','Tìm bằng chứng trước khi đối mặt.'];
 if(f.awakened&&!f.sixthDone)return ['Tiếng gọi trong nhà','Có một câu chuyện khác chưa được kể.'];
 if(f.ritualDone)return ['Tiếp tục điều tra','Những dấu vết trong nhà có thể chưa nói hết sự thật.'];
 if(!f.gateOpened)return ['Đường đến Vân Hòa','Khám phá Đồng Chay và con đường cũ qua rừng.'];
 return ['Điều tra biệt thự',`Đã tìm thấy ${state.relics.length}/5 di vật. Quan sát, ghi chép và đối chiếu manh mối.`];
}

function selectItem(id){if(BOOKS[id]){openResearchBook(id);return}if(id==='flashlight'){state.flashlight=!state.flashlight;toast(state.flashlight?'Đèn pin: BẬT':'Đèn pin: TẮT');playSound('switch',.19);render();save();return}else if(id==='notebook'){showJournal();return}else if(READ_ITEMS[id]){showDoc(READ_ITEMS[id]);return}else if(id==='camera'){}else if(id==='lighter'){toast('Chiếc bật lửa cũ vẫn còn gas.')}state.selectedItem=state.selectedItem===id?null:id;render();save();if(id==='camera'&&state.selectedItem==='camera')toast('Máy ảnh: '+CAM_MODES[state.camMode].label+' · nhấn V để đổi chế độ')}
function act(action){if(modalType)return;clearDialogue();const origin=state.scene;playSound('steps',.5,0,action.startsWith('travel:')?2.4:1.6);if(nameClueAt(action)){renderSidebar();if(action==='kidDrawing')showSpotCloseup(action);else showInteractionView(action,origin);return}if(action.startsWith('travel:')){const to=action.slice(7);if(to==='BG06'&&!has('incense')&&!state.used.includes('incense')){say('Tuyết','Khoan đã... tớ thấy bất an lắm. Mình xem kỹ chỗ này trước khi vào rừng đã.');return}go(to);return}
 if(action.startsWith('inspect:')){inspect(action.slice(8));if(!modalType)showSpotCloseup(action);return}
 if(action.startsWith('researchBook:')){collectResearchBook(action.slice(13));return}
 if(action.startsWith('researchPuzzle:')){openResearchPuzzle(action.slice(15));return}
 switch(action){
  case 'huu':huuTalk();break;
  case 'lampSix':lampSix();break;
  case 'warning':
   if(state.flags.oldwomanTalked){say('Bà bán nước','Các cháu cứ ghé nếu cần hỏi thêm.');break}
   state.flags.oldwomanTalked=true;note('oldwoman','Quán nước đầu làng','Bà bán nước kể về đường cũ, ngôi miếu và căn nhà trên đồi.');
   talk(reviewed('S02'));save();break;
  case 'shrine':if(state.flags.lamDone){go('BG31');break}if(!gain('incense')){say('Nguyệt','Bát hương chỉ còn lớp tàn lạnh.');break}note('shrine','Bát hương ven rừng','Nhang cũ chưa đốt. Trên mảnh giấy mờ chỉ đọc được: “Năm hồn giữ cửa, một bóng giữ nhà.”');talk([["Nguyệt","Nhang này còn dùng được, tớ giữ lại. ...Dưới chân bát hương có một mảnh giấy nhàu, chữ nhòe gần hết."],["Tuyết","“Năm hồn giữ cửa, một bóng giữ nhà.” ...Một bóng là ai nhỉ? Đọc xong tự nhiên tớ lạnh hết cả gáy."],["Đông","Chưa biết. Cứ giữ lại, biết đâu cần. Đừng nghĩ nhiều quá, Tuyết."]]);break;
  case 'marker':
   if(state.selectedItem==='folkPrint'&&has('folkPrint')&&!state.flags.folkMarkerDone){folkStonePuzzle();break}
   if(state.flags.folkMarkerDone||has('key')||state.used.includes('key')||state.flags.gateOpened){say('Nam','Khe đá giờ trống rỗng.');break}
   say('Nam','Cột đá có bốn vòng khắc và một khe hẹp. Những nét này giống vết trên mâm gỗ ở miếu.');break;
  case 'folkOffering':folkOfferingPuzzle();break;
  case 'gate':if(!state.flags.gateOpened){if(!has('key')){say('Đông','Cổng bị xích, ổ khóa còn nguyên. Chắc phải có chìa ở đâu đó.');break}state.flags.gateOpened=true;consume('key');note('gate','Cổng sắt mở khóa','Chiếc chìa rỉ vừa khít với ổ khóa cổng. Cánh cổng khép lại rất mạnh sau khi cả nhóm đi qua.');playSound('door',.2);setTimeout(()=>playSound('slam',.32,SLAM_LEAD),1400);talk([["Nam","Được rồi... khóa bật ra rồi. Nhưng sao cánh cổng tự khép mạnh thế? Mới nãy tớ còn đứng ngay đó!"],["Đông","Gió thôi. Vào đi, nhớ đừng tách nhau."],["Tuyết","Bà bán nước không nói dối. Nhưng tớ vẫn muốn biết sự thật. Tớ không thể đứng nhìn rồi bỏ đi."]]);renderSidebar();save()}else go('BG09');break;
case 'exitForest':if(!state.visited.includes('BG11')){say('Đông','Mới tới cổng mà. Mình ít nhất cũng nên xem qua căn nhà rồi tính chuyện quay về.');break}showEscapeChoice();break;
  case 'well':if(state.flags.awakened&&!has('bell')&&!state.used.includes('bell')){clue('well');gain('bell');note('bell','Chuông đồng dưới đáy xô','Chiếc xô giếng vừa kéo lên có một chuông đồng nhỏ buộc dây đỏ, loại chuông người ta buộc cho trẻ con khỏi lạc.');say('Tuyết','Chuông trẻ con ở dưới giếng... Ai đã thả nó xuống?');break}if(gain('scarf')){note('scarf','Di vật 1 — giếng đá','Một chiếc khăn vải cũ mắc dưới nắp gỗ bên giếng. Đây có thể là di vật của người mất tích.');talk([["Tuyết","Khăn này không giống đồ gia chủ. Có lẽ của một người làm công. Chạm vào mà tay tớ cứ lạnh dần."],["Nguyệt","Tớ nghĩ nó thuộc về một trong năm người. Mình sẽ giữ gìn cẩn thận. Họ xứng đáng được mang về."],["Nam","Dưới giếng có tiếng nước chảy nhè nhẹ. ...Dù giếng này khô cạn từ lâu rồi. Nghe thật mà."]])}else say('Nam','Dưới giếng tối om. Chúng ta đã lấy chiếc khăn mắc ở nắp gỗ rồi.');break;
  case 'frontDoor':if(!state.flags.frontOpened){state.flags.frontOpened=true;note('front','Cửa vào biệt thự','Cánh cửa gỗ không khóa, nhưng kêu kéo dài như tiếng thở.');save()}playSound('door',.22);go('BG11');break;
  case 'clock':state.flags.clockSeen=true;note('clock','Đồng hồ dừng ở 03:17','Chiếc đồng hồ quả lắc ở đại sảnh đã dừng hẳn, kim chỉ đúng 03 giờ 17 phút.');save();showPicture('prop_clocks.webp','Đồng hồ quả lắc','Hai kim dừng cứng ở 03 giờ 17 phút. Con lắc đồng nằm im.','QUAN SÁT',()=>talk([["Nguyệt","Kim đồng hồ chết cứng từ lâu. Tớ chép giờ vào sổ ngay."],["Tuyết","Không có một tiếng tích tắc nào. Cả ngôi nhà như đang nín thở. Tớ cũng nín thở theo."],["Đông","Ghi lại hết đi. Chi tiết nào cũng có thể quan trọng, kể cả cái nhỏ nhất."]]),['Mở ngăn dưới đồng hồ',showClockPuzzle]);break;
  case 'photo':note('photo','Bức ảnh gia đình','Trong ảnh gia đình ông Bá Lâm, vài khuôn mặt bị cào xước. Sự kiện 1988 có thể đã bị che giấu.');showPicture('prop_family_picture.webp','Ảnh gia đình ông Bá Lâm','Năm khuôn mặt đều bị cào xước đến không còn nhận ra.','QUAN SÁT',()=>talk([["Ánh","Có những khuôn mặt bị cào đi. Như thể ai đó muốn xóa tên họ khỏi ký ức. Tớ thấy... đau."],["Nguyệt","Xóa tên khỏi ảnh, khỏi sổ sách, khỏi lời kể của cả làng... Ai làm thế được chứ?"],["Nam","Một người rất sợ họ được nhớ tới. Sợ đến mức làm mọi cách để họ biến mất."]]),['Lật mặt sau khung ảnh',showCipher]);break;
  case 'altar':showAltar();break;
  case 'spoon':if(gain('spoon')){note('spoon','Di vật 2 — gian bếp','Chiếc muôi cơm rỉ nằm trong tro bếp nguội, dấu tích của một người đã từng làm việc ở đây.');talk([["Tuyết","Một chiếc muôi đã mất cán. Thứ tưởng nhỏ nhặt thế này mà lại giữ lại cả một đời người."],["Nguyệt","Một người nấu cơm cho cả đại gia đình, rồi bị quên. Tớ sẽ ghi vào sổ. Tên bác ấy, tớ sẽ tìm cho ra."]])}else toast('Đã thu thập chiếc muôi cơm.');break;
  case 'crowbar':if(gain('crowbar')){note('crowbar','Thanh sắt trong bếp','Một thanh sắt cong, còn khá chắc, nhặt dưới gầm bếp củi.');talk([["Nam","Thanh sắt này còn chắc. Mang theo cũng không thừa. ...Cứ có thứ gì đó trong tay là tớ thấy đỡ run hơn."],["Đông","Chỉ dùng khi thật cần. Mình không phá nhà người ta bừa bãi."],["Nam","Yên tâm. Tớ chỉ muốn có thứ gì đó trong tay thôi."]])}else toast(state.used.includes('crowbar')?'Dưới gầm bếp chẳng còn gì.':'Thanh sắt đã nằm trong túi đồ.');break;
  case 'comb':if(gain('comb')){note('comb','Di vật 3 — phòng trẻ','Một chiếc trâm gỗ bị gãy nằm trong nôi cũ, bên cạnh con búp bê vải.');talk([["Ánh","Trong nôi có một chiếc trâm gỗ gãy... Tớ nhớ đã nhìn thấy nó trong ảnh cũ. Ai đã cầm nó?"],["Tuyết","Chiếc trâm của người lớn mà nằm trong nôi trẻ con. Có người từng ru em bé ở đây, ru rất lâu."],["Ánh","Nghe tiếng hát khẽ không? ...Chắc là tớ nghe nhầm. Mà tớ cũng không muốn nghe nhầm nữa."]])}else toast('Đã thu thập chiếc trâm gỗ.');break;
  case 'mirror':if(state.selectedItem==='camera'){camFlash();state.flags.mirrorPhoto=true;queueMemory('comb');note('mirror','Bóng người trong ảnh','Máy ảnh của Ánh ghi lại một bóng trắng gần giường, dù căn phòng và gương hoàn toàn trống.');playSound('camera',.33);talk([["Ánh","Tớ vừa chụp... Có ai đó trong ảnh! Nhưng khi quay lại, không còn gì cả!"],["Nam","Cho tớ xem. ...Bóng trắng ngay cạnh giường. Cao chỉ tới ngang hông tớ. Trời ơi."],["Tuyết","Một đứa trẻ. Chắc chắn là một đứa trẻ. Em đang nhìn tụi mình."],["Nguyệt","Tớ ghi lại. Mình sẽ tìm cho ra em là ai. Em đừng sợ."]]);save()}else say('Ánh','Gương chỉ phản chiếu căn phòng trống. Nhưng tớ cứ thấy nó đang nhìn mình.');break;
  case 'ledger':if(state.relics.includes('petition')){say('Nguyệt','Trang sổ đã được chụp lại. Mảnh đơn đã ghép xong, cần tìm thêm tài liệu gốc để đối chiếu.');break}
   if(!state.evidence.includes('ledger')){evidence('ledger');note('ledger','Sổ vật tư năm 1988','Sổ cấp phát cho thấy nến, giấy sớ và vải che ô gió được cấp cho thầy Tịnh theo chữ ký ông Bá Lâm. Một mảnh đơn tố cáo bị xé làm ba, mảnh thứ ba kẹp giữa các trang.');playSound('page');gain('fragC');talk([["Nguyệt","Đúng rồi. Phiếu cấp đồ lễ, có cả vải che ô thông gió. Bằng chứng đầu tiên nằm ngay đây... Tay tớ run quá."],["Đông","Cấp vải che ô thông gió cho một căn hầm có người. Tớ không tin nổi."],["Nguyệt","Còn mảnh giấy kẹp trong sổ... bị xé rách làm ba. Hai mảnh kia chắc còn ở đâu đó trong nhà."],["Tuyết","Nếu họ là năm người ở dưới hầm... thì mọi chuyện đã rõ một nửa. Thương họ quá."]],checkAssemble)}else checkAssemble(true);break;

  case 'safe':showSafe();break;
  case 'sealedWall':if(state.flags.wallOpened){go('BG20');break}if(!has('crowbar')){say('Nam','Lớp vữa đã mục, nhưng tay không thì không thể phá được.');break}showWall();break;
  case 'sandals':if(gain('sandals')){note('sandals','Di vật 5 — căn phòng kín','Đôi dép vải cũ nằm cạnh đồ dùng của năm người mất tích năm 1988.');talk([["Nguyệt","Năm người đã nằm lại đây, bị khóa phía sau bức tường... Tớ sẽ không để họ bị lãng quên. Không bao giờ."],["Đông",state.relics.length===RELIC_ORDER.length?"Có đủ năm di vật rồi. Mình quay về phòng thờ thôi.":"Mình còn phải tìm những di vật khác trước khi quay về phòng thờ."],["Tuyết","Mình hãy xem lại những gì đã ghi trước khi quyết định tiếp."]])}else toast('Đã thu thập đôi dép vải.');break;
  case 'archive':if(!state.evidence.includes('archive')){evidence('archive');note('archive','Hộp chứng cứ dưới hầm','Trong hộp sắt có sổ cấp đồ lễ và giấy tờ chứng minh ông Bá Lâm ký cấp vật tư cho buổi lễ.');playSound('page');talk([["Đông","Chúng ta có hồ sơ gốc rồi! Nếu còn bản thú tội trong phòng làm việc thì sự thật có thể được chứng minh."],["Nguyệt","Sổ cấp đồ lễ, giấy xác nhận... Tất cả đều có chữ ký ông Bá Lâm. Nhìn chữ ký này, tớ ghét nó."],["Nam","Giờ mình chỉ cần mang chúng ra khỏi đây an toàn. Phải sống sót để đem sự thật ra ánh sáng."]])}else say('Nguyệt','Tài liệu trong hộp đã được lưu lại. Hãy mang bằng chứng ra ngoài.');break;
  case 'cradle':{const c=state.flags.clues||[];if(!c.includes('cradle')){clue('cradle');note('cradle','Mảnh vải thêu trong nôi','Mảnh vải thêu dở trong nôi: “Thị M…”. Chiếc nôi tự đung đưa dù không có gió.');talk([["Ánh","Nôi đang rung... có chữ thêu dở: “Thị M”. Tớ nghe tiếng khóc ngay cạnh tai!"],["Tuyết","Tớ cũng nghe. Là tiếng một đứa trẻ khóc... khóc rất khẽ. Trời ơi."],["Nguyệt","“Thị M...” Tên một cô bé. Mình phải tìm đủ manh mối để biết em là ai. Em ơi, đợi chị."]])}else if(state.used.includes('bell')){if(state.flags.sixthDone)say('Ánh','Nôi đã lặng. Em không còn khóc nữa.');else go('BG21')}else if(!has('bell'))say('Ánh','Chiếc nôi vẫn khẽ đung đưa, như đang chờ một điều gì đó.');else if(state.selectedItem!=='bell')say('Nguyệt','Chiếc nôi lại rung khi tớ đứng gần. Trong túi mình có thứ gì khiến nó phản ứng không?');else if(c.length<3)say('Nguyệt','Chuông chỉ rung yếu ớt rồi lặng đi.');else{consume('bell');go('BG21')}break}
  case 'birth':if(clue('birth')){note('birth','Giấy khai sinh bị xé','Lâm Thị Mơ, sinh 1981, được ghi là con của vợ chồng Bá Lâm. Dòng cuối: “mất tích đêm 17/3/1988”, bị gạch khỏi sổ hộ khẩu.');talk([["Nguyệt","Mơ... mới bảy tuổi. Mất tích ngày 17 tháng 3. Những con số ấy cũng giống giờ trên đồng hồ: 03:17."],["Đông","Trên giấy, em là con của vợ chồng ông Bá Lâm. Vậy mà tờ khai sinh lại bị xé bỏ."],["Nguyệt","Ông ta đã xóa chính con mình khỏi sổ hộ khẩu. Chuyện này không chỉ là giấu một cái tên. Mình phải tìm hiểu rõ."]])}else say('Nguyệt','Tờ khai sinh đã được ghi vào nhật ký.');break;
  case 'girl':state.flags.girlHeard=true;save();say(state.flags.sixthDone?'Mơ':'Giọng trẻ con','Chị ơi... đừng gọi em bằng tên của cha. Em ngủ ở dưới kia, một mình, cùng giai điệu ấy.');break;
  case 'musicbox':if(gain('musicbox'))talk([["Ánh","Hộp nhạc vẫn chạy được. Tớ đã nghe giai điệu này trong giấc mơ... Nó làm tớ muốn khóc."],["Nguyệt","Giai điệu ấy như một bài ru. Có ai từng hát nó bên chiếc nôi này, hát cho em nghe."]]);else toast(state.used.includes('musicbox')?'Hộp nhạc đã lặng im.':'Hộp nhạc đã nằm trong túi đồ.');break;
  case 'smalldoor':if(state.flags.sixthDone)say('Nguyệt','Cánh cửa nhỏ đã lặng im. Dưới đó không còn ai khóc nữa.');else if(!state.flags.girlHeard)say('Nguyệt','Cánh cửa nhỏ không nhúc nhích, như có ai giữ nó từ phía bên kia.');else if(!has('musicbox'))say('Nguyệt','Cánh cửa vẫn không nhúc nhích. Có lẽ còn thiếu một thứ.');else{playSound('door',.25);go('BG22')}break;
  case 'shirt':if(state.flags.sixthDone)say('Mơ','Em nhớ tên mình rồi.');else if(state.selectedItem==='musicbox')showSixth();else say('Nguyệt','Chiếc áo lạnh buốt. Nó nằm im, không đáp lại.');break;
  case 'lamdoor':showLam();break;
  case 'testimony':if(gain('testimony')){evidence('testimony');note('testimony','Lời khai của bà Mận','Bà Mận viết: đêm 17/3/1988 bà nghe tiếng cầu cứu từ hầm nhưng sợ hãi, không dám lên tiếng. Bà giữ lại lời khai để sự thật không bị chôn vùi.');say('Bà Mận','Đêm ấy tôi nghe tiếng đập cửa dưới hầm. Tôi sợ quá, không dám lên tiếng. Xin hãy thay tôi nói điều đó.')}else say('Nguyệt',state.used.includes('testimony')?'Chiếc hòm giờ trống. Lời khai đã được đọc lên.':'Lời khai đã nằm trong túi.');break;
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
  case 'grandBox':grandBox();break;
  case 'datDoor':datDoor();break;
  case 'simPhoto':simPhoto();break;
  case 'simScarf':simScarf();break;
  case 'datBox':datBox();break;
  case 'compareScrolls':compareScrolls();break;
  case 'fakeFind':fakeFind();break;
  case 'anchorRitual':showAnchorRitual();break;
  case 'forestAltar':forestAltar();break;
  default:toast('Chưa có tương tác ở vị trí này.');
 }
 renderSidebar();save();if((action==='takeDoll'||action==='comb')&&!modalType)showSpotCloseup(action);else showInteractionView(action,origin);}
const SPECIAL_CLOSEUPS={
 kidDrawing:{file:'Mo_Tranh_Sap.webp',caption:'Dưới chân người phụ nữ có dòng chữ trẻ con: “cô Lụa”.',drawing:true},
 takeDoll:{file:'Mo_Bup_Be.webp',caption:'Búp bê vải được khâu và vá bằng tay.'},
 comb:{file:'Mo_Tram_Go.webp',caption:'Chiếc trâm gỗ gãy nằm trong chiếc nôi cũ.'}
};
function closeupInfo(h){
 const special=SPECIAL_CLOSEUPS[h.action]||interactionViewFor(h.action);if(special)return {special};
 /* Phóng từ nền cảnh, giữ tâm vùng tương tác trong khung và không vượt mép ảnh. */
 const zoom=Math.max(1.35,Math.min(3,70/Math.max(h.w,h.h))),position=(center)=>Math.max(0,Math.min(100,(center*zoom-.5)/(zoom-1)*100));
 return {zoom,x:position((h.x+h.w/2)/100),y:position((h.y+h.h/2)/100)};
}
function showSpotCloseup(action,spot){
 const scene=SCENES[state.scene],h=spot||scene.spots.find(x=>x.action===action);if(!h)return;
 const info=closeupInfo(h),label=escapeHTML(h.label);let art,caption;
 if(info.special){const s=info.special;art=`<div class="prop-view"><div class="detail-art"><img src="${ROOT}props/${s.file}" alt="${label}" draggable="false">${s.drawing?'<span class="drawing-label" aria-hidden="true">cô Lụa</span>':''}</div></div>`;caption=s.caption||''}
 else{const bg=sceneBackground(state.scene);art=`<div class="scene-closeup" role="img" aria-label="${label}" style="background-image:url('${bg}');background-size:${info.zoom*100}% auto;background-position:${info.x}% ${info.y}%"></div>`;caption=''}
 showModal(`<h2>${label}</h2>${art}${caption?`<p class="modal-note">${escapeHTML(caption)}</p>`:''}<div id="closeup-actions" class="modal-buttons"></div>`,'QUAN SÁT GẦN','closeup');
 $('closeup-actions').appendChild(modalButton('Đóng',hideModal));
}
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
};Object.assign(texts,INSPECT2);if(k==='pagoda'&&['night','dawn'].includes(storyPeriod(presentStoryMinute())))texts.pagoda=['Ánh','Chùa làng nhỏ, mái ngói phủ rêu. Hai ngọn đèn lồng soi nhẹ khoảng sân vắng.'];const [who,text]=texts[k]||['Người kể chuyện',SCENES[state.scene].look];talk([[who,text],...(MORE[k]||[])])}
function showModal(html,kicker='HỒ SƠ ĐIỀU TRA',type='generic'){
 const opening=$('modal-backdrop').hidden;if(opening)modalReturnFocus=document.activeElement;
 $('chatter').classList.remove('on');
 const win=$('modal-body').closest('.modal-window');
 win.classList.toggle('is-book',type==='journal');
 win.classList.toggle('is-research-book',type==='research-book');
 win.classList.toggle('is-research-archive',type==='research-archive');
 if(type!=='research-book'&&type!=='research-clips'&&researchReaderActions){researchReaderActions.cancel();researchReaderActions=null;}
 $('modal-body').innerHTML=html;$('modal-kicker').textContent=kicker;$('modal-backdrop').hidden=false;modalType=type;
 if(['menu','points','closeup','achievements'].includes(type)){win.scrollTop=0;if(!opening)requestAnimationFrame(()=>{if(modalType===type)$('modal-close').focus({preventScroll:true})})}
 if(opening)requestAnimationFrame(()=>{if(!$('modal-backdrop').hidden&&!win.contains(document.activeElement)){const target=[...win.querySelectorAll('button,input,[href]')].find(el=>!el.disabled&&el.getClientRects().length);if(target)target.focus({preventScroll:true})}});
}
function hideModal(){
 const wasOpen=!$('modal-backdrop').hidden;
 if(researchReaderActions){researchReaderActions.cancel();researchReaderActions=null;}
 bookCleanup();$('modal-backdrop').hidden=true;$('modal-body').replaceChildren();
 $('modal-body').closest('.modal-window').classList.remove('is-research-book','is-research-archive');
 modalType=null;if(wasOpen&&modalReturnFocus&&modalReturnFocus.isConnected){modalReturnFocus.focus({preventScroll:true});modalReturnFocus=null}
}
function modalButton(text,fn){const b=document.createElement('button');b.type='button';b.className='modal-option';b.textContent=text;b.addEventListener('click',fn);return b}
function showGuide(){showModal(`<h2>Cách chơi</h2><p>Chạm hoặc nhấp các dấu trên cảnh để quan sát, trò chuyện và di chuyển. Chọn vật phẩm trong thanh bên dưới rồi chạm nơi muốn sử dụng.</p><p>Nhật ký giữ lại những gì đã tìm thấy. Hãy đọc và đối chiếu tài liệu; một số chi tiết có thể không đáng tin.</p><p><strong>Phím tắt:</strong> J mở nhật ký · H xem gợi ý nhẹ · F bật đèn pin · V đổi chế độ máy ảnh · Esc đóng bảng · Enter hoặc Space tiếp lời thoại.</p><div class="modal-buttons" id="guide-actions"></div>`,'HƯỚNG DẪN','guide');$('guide-actions').appendChild(modalButton('Tiếp tục',hideModal))}

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
function showHint(){
 const ob=getObjective();
 showModal(`<h2>Gợi ý</h2><p>${escapeHTML(ob[1])}</p><p class="modal-note">Hãy đọc lại nhật ký và các tư liệu đã thu thập.</p><div id="hint-actions" class="modal-buttons"></div>`,'GỢI Ý','hint');
 $('hint-actions').appendChild(modalButton('Đóng',hideModal));
}
function showAchievements(){
 syncAchievements(false);const count=achievementProfile.unlocked.length;
 const cards=ACHIEVEMENTS.map(a=>{const unlocked=achievementProfile.unlocked.includes(a.id);return `<article class="achievement-card${unlocked?'':' is-locked'}"><strong><span class="achievement-mark" aria-hidden="true">${unlocked?'✦':'◇'}</span>${unlocked?escapeHTML(a.title):'Thành tựu bí ẩn'}</strong><p>${unlocked?escapeHTML(a.detail):'Tiếp tục hành trình để khám phá.'}</p></article>`}).join('');
 showModal(`<h2>Thành tựu</h2><p>Đã mở <strong>${count} / ${ACHIEVEMENTS.length}</strong> thành tựu.</p><p class="modal-note">Thành tựu được lưu trên thiết bị này và giữ lại khi bắt đầu lượt chơi mới.</p><div class="achievement-list">${cards}</div><div id="achievement-actions" class="modal-buttons"></div>`,'HÀNH TRÌNH ĐỒNG CHAY','achievements');
 $('achievement-actions').appendChild(modalButton('Quay lại menu',showMenu));
}

function showMenu(){const ob=getObjective(),rc=state.relics.length;
 showModal(`<h2>Tạm dừng</h2>
 <div class="menu-status"><div class="menu-kick">NHIỆM VỤ HIỆN TẠI</div><div class="menu-ob-title">${escapeHTML(ob[0])}</div><div class="menu-ob-text">${escapeHTML(ob[1])}</div><div class="menu-relics"><span>DI VẬT</span><div class="menu-track"><i style="width:${rc/5*100}%"></i></div><b>${rc} / 5</b></div></div>
 <div class="menu-grid" id="menu-actions"></div>
 <p class="modal-note">Tiến trình được tự động lưu. Đặt lại sẽ xóa tiến trình hiện tại. Nếu máy giật, hãy hạ Hiệu ứng hình ảnh xuống Vừa hoặc Thấp.</p>`,'MENU','menu');
 const w=$('menu-actions'),add=(label,fn,opt={})=>{const b=modalButton(label,fn);if(opt.cls)b.classList.add(opt.cls);if(opt.disabled)b.disabled=true;w.appendChild(b)};
 add('Cách chơi',showGuide);add('Gợi ý',showHint);add('Sách và câu đố',showResearchArchive);add('Tư liệu quanh đây',showNearbyResearch);add('Ký ức di vật',showMemories);add('Thành tựu ('+achievementProfile.unlocked.length+'/'+ACHIEVEMENTS.length+')',showAchievements);
 add(state.sound?'Âm thanh: BẬT':'Âm thanh: TẮT',()=>{toggleSound();showMenu()});
 if(window.WeatherFX)add(WeatherFX.enabled?'Đèn và chớp: BẬT':'Đèn và chớp: TẮT',()=>{WeatherFX.setEnabled(!WeatherFX.enabled);showMenu()});
 if(window.Perf){const N={auto:'Tự động',high:'Cao',medium:'Vừa',low:'Thấp'};add('Hiệu ứng hình ảnh: '+N[Perf.pref]+(Perf.pref==='auto'?' ('+N[Perf.level]+')':''),()=>{Perf.cycle();showMenu()})}
 add('Bắt đầu lại từ đầu',()=>{hideModal();if(confirm('Bạn có chắc muốn bắt đầu một lần điều tra mới?'))newGame()},{cls:'is-danger'});
 add('Về màn hình chính',()=>{hideModal();stopAmbience();clearDialogue();$('title-screen').hidden=false;updateContinue()})}

/* ================================================================
 * THƯ VIỆN ĐỒNG CHAY - tích hợp bên trong IIFE của game.js.
 * Mã sách và câu đố đọc từ assets/research/books-data.js (cục bộ).
 * ================================================================ */
function researchSolved(id){return (state.flags.researchSolved||[]).includes(id)}
function researchPagesRead(id){
 const views=state.flags.researchPageViews||{};
 return Array.isArray(views[id])?views[id]:[];
}
function researchBookAvailable(b){
 return b&&(!b.requiresFlag||!!state.flags[b.requiresFlag]);
}
function researchCandidates(){
 const result=[];
 for(const b of Object.values(BOOKS))if(b.scene===state.scene&&researchBookAvailable(b)&&!has(b.id))result.push({id:b.id,title:b.title,kind:'book',spot:b.spot});
 for(const p of Object.values(RESEARCH_PUZZLES))if(p.scene===state.scene&&(!p.requiresFlag||state.flags[p.requiresFlag])&&!researchSolved(p.id))result.push({id:p.id,title:p.title,kind:'puzzle',spot:p.spot});
 return result;
}
function researchActiveSpots(){
 const used=SCENES[state.scene].spots.filter(h=>!h.req||state.flags[h.req]).map(({x,y,w,h})=>({x,y,w,h}));
 const overlaps=(a,b)=>a.x<b.x+b.w+1&&a.x+a.w+1>b.x&&a.y<b.y+b.h+1&&a.y+a.h+1>b.y;
 const result=[];
 for(const item of researchCandidates()){
  const [x,y,w,h]=item.spot,cx=x+w/2,cy=y+h/2;let best=null,dist=Infinity;
  // A small marker, placed as near its associated object as the existing targets allow.
  for(let top=2;top<=86;top+=4)for(let left=2;left<=90;left+=4){
   const spot={x:left,y:top,w:8,h:12};if(used.some(other=>overlaps(spot,other)))continue;
   const d=(left+4-cx)**2+(top+6-cy)**2;if(d<dist){best=spot;dist=d}
  }
  if(!best)continue;used.push(best);
  result.push(H((item.kind==='book'?'researchBook:':'researchPuzzle:')+item.id,(item.kind==='book'?'Đọc: ':'Xem: ')+item.title,best.x,best.y,best.w,best.h));
 }
 return result;
}
function showScenePoints(){
 const points=SCENES[state.scene].spots.filter(h=>!h.req||state.flags[h.req]);
 const positions=researchActiveSpots();
 const extra=researchCandidates().map(item=>{const action=(item.kind==='book'?'researchBook:':'researchPuzzle:')+item.id;return {...positions.find(h=>h.action===action),label:(item.kind==='book'?'Đọc: ':'Xem: ')+item.title,action}});
 showModal('<h2>Điểm tương tác</h2><p>Chọn nơi bạn muốn xem trong cảnh hiện tại.</p><div id="point-actions" class="modal-buttons point-actions"></div>','KHÁM PHÁ','points');
 const box=$('point-actions');for(const h of [...points,...extra]){const row=document.createElement('div');row.className='point-row';row.appendChild(modalButton(h.label,()=>{hideModal();act(h.action)}));if(Number.isFinite(h.x)&&Number.isFinite(h.y)&&Number.isFinite(h.w)&&Number.isFinite(h.h)){const near=modalButton('Xem gần',()=>showSpotCloseup(h.action,h));near.classList.add('point-near');near.setAttribute('aria-label','Xem gần: '+h.label);row.appendChild(near)}box.appendChild(row)}
 box.appendChild(modalButton('Đóng',hideModal));
}
function showNearbyResearch(){
 const items=researchCandidates();
 showModal('<h2>Tư liệu quanh đây</h2><p>Chọn một dấu vết để quan sát.</p><div id="nearby-research" class="modal-buttons"></div>','KHÁM PHÁ','nearby');
 const box=$('nearby-research');for(const item of items)box.appendChild(modalButton(item.title,()=>{hideModal();if(item.kind==='book')collectResearchBook(item.id);else openResearchPuzzle(item.id)}));
 if(!items.length)box.appendChild(document.createTextNode('Không còn tư liệu mới trong cảnh này.'));
 box.appendChild(modalButton('Đóng',hideModal));
}

function collectResearchBook(id){
 const b=BOOKS[id];if(!b||!researchBookAvailable(b))return;
 if(!has(id)){
  gain(id);
  note('research_'+id,b.title,b.summary+' Mở cuốn sách trong túi đồ để xem từng trang.');
  save();renderSidebar();render();
 }
 openResearchBook(id);
}
/* ======= THƯ VIỆN: BẢN THẢO CŨ / ĐÁNH DẤU MANH MỐI ======= */
let researchReaderActions=null;
function researchBookTheme(b){
 if(['book_ngutran'].includes(b.id))return 'forged';
 if(['book_sim','book_sogoc'].includes(b.id))return 'indigo';
 if(['book_lua','book_mant','book_mogio','book_balam'].includes(b.id))return 'memory';
 if(['book_duong','book_bia_cau','book_gieng','book_cua'].includes(b.id))return 'field';
 return 'temple';
}
function researchBookType(b){
 if(b.id==='book_ngutran')return 'BẢN CHÉP NGHI LỄ';
 if(b.id==='book_sogoc')return 'BẢN LỄ TẠ RỪNG';
 if(b.id==='book_sim')return 'THƯ TAY';
 if(b.id==='book_lua'||b.id==='book_mant')return 'NHẬT KÝ RIÊNG';
 if(b.id==='book_duong'||b.id==='book_bia_cau')return 'TƯ LIỆU ĐỊA PHƯƠNG';
 return 'TƯ LIỆU ĐỒNG CHAY';
}
function researchClippedHTML(text,quotes,page){
 let result=escapeHTML(text);
 for(const q of quotes){
  if(q.page!==page||!q.text)continue;
  const key=escapeHTML(q.text);
  if(key.length>5){
   const quoteParts=key.trim().split(/\s+/).map(part=>[...part].map(char=>('\\.^$*+?()[]{}|'.includes(char)?'\\'+char:char)).join(''));
   try{result=result.replace(new RegExp(quoteParts.join('\\s+')),v=>'<mark class="research-ink-mark">'+v+'</mark>')}catch(_){}
  }
 }
 return result.replace(/\n/g,'<br>');
}
function openResearchBook(id){
 const b=BOOKS[id];if(!b||!has(id))return;
 if(researchReaderActions){researchReaderActions.cancel();researchReaderActions=null;}
 const flags=state.flags;
 flags.researchPageViews=flags.researchPageViews||{};
 flags.researchRead=flags.researchRead||[];
 flags.researchBookmarks=flags.researchBookmarks||{};
 flags.researchQuotes=flags.researchQuotes||{};
 flags.researchLastPage=flags.researchLastPage||{};
 const pageCount=b.pages.length;
 const layoutQuery=window.matchMedia('(max-width:700px)');
 let mobile=layoutQuery.matches,step=mobile?1:2;
 const reduced=window.matchMedia('(prefers-reduced-motion:reduce)').matches||!!(window.Perf&&Perf.RM);
 let current=Math.max(0,Math.min(pageCount-1,Number(flags.researchLastPage[id]||0)));
 if(!mobile)current=Math.floor(current/2)*2;
 let active=current,busy=false,flipTimer=null,firstDraw=true,openTimers=[];
 const bookmarks=()=>flags.researchBookmarks[id]||[];
 const quotes=()=>flags.researchQuotes[id]||[];
 const visible=()=>mobile?[current]:[current,current+1].filter(i=>i<pageCount);
 const sealed=i=>!!(b.protectedFinalFlag&&i===pageCount-1&&!flags[b.protectedFinalFlag]);
 function stamp(){
  const got=new Set(researchPagesRead(id));
  if(b.protectedFinalFlag&&!flags[b.protectedFinalFlag])got.delete(pageCount-1);
  for(const i of visible())if(!sealed(i))got.add(i);
  flags.researchPageViews[id]=[...got].sort((a,c)=>a-c);
  if(b.pages.every((_,i)=>got.has(i))&&!flags.researchRead.includes(id)){
   flags.researchRead.push(id);toast('Đã đọc hết: '+b.title);
  }
  flags.researchLastPage[id]=current;save();
 }
 function leaf(i){
  if(i>=pageCount)return '<div class="bk-blank" aria-hidden="true"><span class="bk-fleuron">◈</span></div>';
  const page=b.pages[i],locked=sealed(i),heading=locked?'Trang giấy bị dính chặt':page[0];
  const content=locked?b.protectedFinalText:page[1],marked=bookmarks().includes(i);
  return `<section class="research-paper${locked?' research-paper-locked':''}" data-page="${i}" aria-label="Trang ${i+1}: ${escapeHTML(heading)}">
   <div class="bk-no">${escapeHTML(researchBookType(b))}${marked?' · ĐÃ ĐÁNH DẤU':''}</div>
   <div class="bk-title">${escapeHTML(i===0?b.title:heading)}</div>
   <div class="bk-body research-page-content" data-page-text="${i}">${researchClippedHTML(content,quotes(),i)}</div>
   <div class="bk-folio">${i+1}</div>
  </section>`;
 }
 function updateActive(i){
  if(!visible().includes(i))return;active=i;
  const btn=$('research-add-bookmark');if(!btn)return;
  btn.textContent=bookmarks().includes(active)?'◆ Bỏ dấu trang':'◇ Đánh dấu trang';
  btn.setAttribute('aria-label',(bookmarks().includes(active)?'Bỏ dấu trang ':'Đánh dấu trang ')+(active+1));
 }
 function draw(){
  stamp();
  const remembered=bookmarks().length+quotes().length;
  const coverClass=firstDraw&&!reduced?'closed':'opened';
  const html=`<div class="bk-scene research-journal">
   <button class="bk-close" id="research-reader-close" type="button" aria-label="Đóng sách">×</button>
   <div class="bk ${mobile?'single ':''}${coverClass}" id="research-book" aria-label="${escapeHTML(b.title)}">
    <div class="bk-base"></div>
    <div class="bk-pages">
     <div class="bk-page left" id="research-left">${mobile?'':leaf(current)}</div>
     <div class="bk-page right" id="research-right">${leaf(mobile?current:current+1)}</div>
    </div>
    <div class="bk-ribbon" aria-hidden="true"></div>
    <div class="bk-cover" aria-hidden="true"><div class="bk-cover-frame"><span class="bk-cover-sigil">◈</span><div class="bk-cover-title">${escapeHTML(b.title)}</div><div class="bk-cover-sub">Tư liệu · Đồng Chay</div></div></div>
   </div>
   <div class="bk-nav research-journal-nav">
    <button class="bk-btn" id="research-prev" type="button" ${current<=0?'disabled':''} aria-label="Trang trước">‹ Trang trước</button>
    <span class="bk-count">${mobile?'Trang '+(current+1):'Trang '+(current+1)+(current+1<pageCount?'–'+(current+2):'')} / ${pageCount}</span>
    <button class="bk-btn" id="research-next" type="button" ${current+step>=pageCount?'disabled':''} aria-label="Trang sau">Trang sau ›</button>
   </div>
   <div class="bk-nav research-journal-tools">
    <button class="bk-btn" id="research-add-bookmark" type="button"></button>
    <button class="bk-btn" id="research-add-quote" type="button">✎ Lưu đoạn đang chọn</button>
    <button class="bk-btn" id="research-view-clips" type="button">Ghi chú đã lưu (${remembered})</button>
    <button class="bk-btn" id="research-to-archive" type="button">Thư viện tư liệu</button>
   </div>
  </div>`;
  showModal(html,'SÁCH · TÀI LIỆU','research-book');
  $('research-reader-close').onclick=hideModal;
  $('research-prev').onclick=()=>turn(-1);
  $('research-next').onclick=()=>turn(1);
  $('research-to-archive').onclick=showResearchArchive;
  const left=$('research-left'),right=$('research-right');
  const bindPage=(el,i,dir)=>{
   el.addEventListener('pointerdown',()=>updateActive(i));
   el.addEventListener('click',e=>{
    const selection=window.getSelection&&window.getSelection();
    if(e.target.closest('.research-page-content')||(selection&&!selection.isCollapsed))return;
    turn(dir);
   });
  };
  if(!mobile)bindPage(left,current,-1);
  if(mobile||current+1<pageCount)bindPage(right,mobile?current:current+1,1);
  updateActive(active);
  $('research-add-bookmark').onclick=()=>{
   if(sealed(active)){toast('Trang này chưa thể đánh dấu.');return;}
   const set=new Set(bookmarks());
   if(set.has(active)){set.delete(active);toast('Đã bỏ dấu trang.');}else{set.add(active);toast('Đã đánh dấu trang '+(active+1)+'.');playSound('page',.12)}
   flags.researchBookmarks[id]=[...set].sort((a,c)=>a-c);save();draw();$('research-add-bookmark').focus({preventScroll:true});
  };
  const quotebtn=$('research-add-quote');let lastSelection='';
  quotebtn.addEventListener('pointerdown',()=>{lastSelection=String(window.getSelection?window.getSelection():'')});
  quotebtn.addEventListener('mousedown',e=>e.preventDefault());
  quotebtn.onclick=()=>{
   const selection=String(lastSelection||(window.getSelection?window.getSelection():'')).trim().replace(/\s+/g,' ').slice(0,210);
   const found=visible().find(i=>!sealed(i)&&b.pages[i][1].replace(/\s+/g,' ').includes(selection));
   if(selection.length<7||found===undefined){toast('Bôi đen một đoạn trong trang sách rồi nhấn lưu.');return;}
   const records=quotes();
   if(!records.some(q=>q.page===found&&q.text===selection)){
    records.push({page:found,text:selection});flags.researchQuotes[id]=records.slice(-24);save();playSound('page',.12);
   }
   if(window.getSelection)window.getSelection().removeAllRanges();
   active=found;toast('Đã lưu đoạn văn vào ghi chú.');draw();$('research-add-quote').focus({preventScroll:true});
  };
  $('research-view-clips').onclick=showClips;
  if(firstDraw&&!reduced){
   const bk=$('research-book');
   openTimers.push(setTimeout(()=>{if(bk.isConnected)bk.classList.remove('closed')},380));
   openTimers.push(setTimeout(()=>{if(bk.isConnected)bk.classList.add('opened')},1700));
  }
  firstDraw=false;
 }
 function turn(dir){
  if(busy)return;
  const to=current+dir*step;
  if(to<0||to>=pageCount)return;
  busy=true;playSound('page',.25);
  const bk=$('research-book'),left=$('research-left'),right=$('research-right');
  if(bk&&!mobile&&!reduced){
   const page=document.createElement('div');page.className='bk-leaf '+(dir>0?'next':'prev');
   const front=dir>0?leaf(current+1):leaf(current),back=dir>0?leaf(to):leaf(to+1);
   page.innerHTML=`<div class="bk-face front ${dir>0?'right':'left'}">${front}</div><div class="bk-face back ${dir>0?'left':'right'}">${back}</div>`;
   page.setAttribute('aria-hidden','true');bk.appendChild(page);
   if(dir>0)right.innerHTML=leaf(to+1);else left.innerHTML=leaf(to);
   page.getBoundingClientRect();requestAnimationFrame(()=>page.classList.add('go'));
  }else if(mobile&&!reduced){right.classList.add('swap')}
  flipTimer=setTimeout(()=>{
   flipTimer=null;current=to;active=current;busy=false;
   if(modalType==='research-book'){
    draw();const target=$(dir>0?'research-next':'research-prev'),fallback=$(dir>0?'research-prev':'research-next');
    (target.disabled?fallback:target).focus({preventScroll:true});
   }
  },reduced?0:mobile?170:800);
 }
 function showClips(){
  const all=[...bookmarks().map(i=>({page:i,text:'Đã đánh dấu trang'})),...quotes()];
  if(!all.length){toast('Bạn chưa đánh dấu trang hoặc lưu đoạn nào.');return;}
  const list=all.sort((a,c)=>a.page-c.page).map(o=>'<button type="button" class="research-clip" data-clip-page="'+o.page+'"><small>TRANG '+(o.page+1)+'</small><span>'+escapeHTML(o.text)+'</span></button>').join('');
  showModal('<div class="research-clip-list"><span class="research-section-label">GHI CHÚ / '+escapeHTML(b.title)+'</span><h2>Những trang đã đánh dấu</h2><div>'+list+'</div><button class="modal-option" id="research-clip-close" type="button">Trở lại sách</button></div>','GHI CHÚ TƯ LIỆU','research-clips');
  $('research-clip-close').onclick=()=>draw();
  document.querySelectorAll('[data-clip-page]').forEach(el=>el.onclick=()=>{
   const page=Number(el.dataset.clipPage);current=mobile?page:Math.floor(page/2)*2;active=page;draw();
  });
 }
 function onLayoutChange(event){
  if(mobile===event.matches)return;
  if(flipTimer){clearTimeout(flipTimer);flipTimer=null}busy=false;
  mobile=event.matches;step=mobile?1:2;
  current=mobile?active:Math.floor(active/2)*2;
  if(modalType==='research-book')draw();
 }
 if(layoutQuery.addEventListener)layoutQuery.addEventListener('change',onLayoutChange);
 else if(layoutQuery.addListener)layoutQuery.addListener(onLayoutChange);
 researchReaderActions={next:()=>turn(1),prev:()=>turn(-1),cancel:()=>{
  if(flipTimer){clearTimeout(flipTimer);flipTimer=null}openTimers.forEach(clearTimeout);openTimers=[];busy=false;
  if(layoutQuery.removeEventListener)layoutQuery.removeEventListener('change',onLayoutChange);
  else if(layoutQuery.removeListener)layoutQuery.removeListener(onLayoutChange);
 }};
 draw();playSound('page',.17);
}
function showResearchArchive(){
 const found=Object.values(BOOKS).filter(b=>has(b.id));
 const solved=Object.values(RESEARCH_PUZZLES).filter(p=>researchSolved(p.id));
 const all=Object.keys(BOOKS).length;
 const cards=found.map(b=>{
  const seen=researchPagesRead(b.id).length;
  const complete=(state.flags.researchRead||[]).includes(b.id);
  const marks=((state.flags.researchBookmarks||{})[b.id]||[]).length+((state.flags.researchQuotes||{})[b.id]||[]).length;
  return `<button type="button" class="research-archive-card theme-${researchBookTheme(b)}" data-book="${escapeHTML(b.id)}">
    <span class="research-archive-cover" aria-hidden="true"></span><span class="research-archive-detail"><small>${escapeHTML(researchBookType(b))} · ${seen}/${b.pages.length} TRANG</small><strong>${escapeHTML(b.title)}</strong><em>${complete?'ĐÃ ĐỌC HẾT':marks?'ĐÃ LƯU '+marks+' GHI CHÚ':'CHƯA ĐỌC HẾT'}</em></span><span class="research-archive-arrow">›</span></button>`;
 }).join('');
 const panel=`<div class="research-archive-ui"><div class="research-archive-heading"><span class="research-section-label">TỦ SÁCH ĐỒNG CHAY · SƯU TẦM</span><h2>Hồ sơ đang được mở</h2><p>Không phải tài liệu nào cũng đáng tin. Hãy so các ghi chép ở làng với giấy tờ tìm thấy trong biệt thự.</p><div class="research-archive-stats"><span><strong>${found.length}</strong> / ${all} tài liệu</span><span><strong>${solved.length}</strong> / ${Object.keys(RESEARCH_PUZZLES).length} câu đố</span></div></div><div class="research-archive-grid">${cards||'<p class="research-archive-empty">Bạn chưa nhặt được cuốn sách nào. Hãy tìm tại miếu và các căn phòng.</p>'}</div><div class="research-archive-bottom"><span>Chọn bìa sách để đọc hoặc mở lại.</span><button id="research-archive-close" class="modal-option">Đóng thư viện</button></div></div>`;
 showModal(panel,'THƯ VIỆN · ĐỒNG CHAY','research-archive');
 $('research-archive-close').onclick=hideModal;
 document.querySelectorAll('[data-book]').forEach(el=>el.onclick=()=>openResearchBook(el.dataset.book));
}

/* Ảnh bối cảnh cho các câu đố tài liệu. Những câu còn lại dùng chính cảnh nơi tìm thấy câu đố. */
const RESEARCH_PUZZLE_ART={
 pz_danh_xung:'props/POV_Bat_Huong.webp',
 pz_ba_dong_xu:'props/Closeup01_Coins.webp',
 pz_mam_le:'props/POV_Mam_Le.webp',
 pz_nap_gieng:'props/POV_Gieng_Da.webp',
 pz_soi_anh:'items/prop_family_picture.webp',
 pz_then_cua:'props/Hoi_Uc_Can_Ham_1988.webp',
 pz_tam_but:'props/Hoi_Uc_So_Sach_1988.webp',
 pz_loi_mant:'props/POV_Ba_Man_Thuc.webp',
 pz_balam:'props/Hoi_Uc_So_Sach_1988.webp',
 pz_chu_lua:'props/Hoi_Uc_Phong_Tre_1988.webp',
 pz_ta_so:'props/Closeup02_Papers.webp',
 pz_thu_sim:'props/Hoi_Uc_Sim_1986.webp',
 pz_dau_an:'props/Closeup03_SquareSeal.webp',
 pz_ho_so_dem_le:'props/Hoi_Uc_Can_Ham_1988.webp',
 pz_so_sanh_nguon:'props/Closeup02_Papers.webp'
};
function researchPuzzleArt(p){
 const src=RESEARCH_PUZZLE_ART[p.id]?ROOT+RESEARCH_PUZZLE_ART[p.id]:(p.scene===state.scene?sceneBackground(p.scene):BG(p.scene));
 return `<img class="research-puzzle-art" src="${escapeHTML(src)}" alt="" loading="lazy" draggable="false">`;
}
function puzzleContextArt(src,alt){return `<img class="puzzle-context-art" src="${escapeHTML(src)}" alt="${escapeHTML(alt)}" loading="lazy" draggable="false">`}

function openResearchPuzzle(id){
 const p=RESEARCH_PUZZLES[id];if(!p)return;
 if(p.requiresFlag&&!state.flags[p.requiresFlag]){
  say('Nguyệt','Mình cần tìm hiểu thêm chuyện đêm ấy rồi mới xem được chi tiết này.');return;
 }
 if(researchSolved(id)){
  const n=state.notes.find(x=>x.id==='researchSolved_'+id);
  if(n)showModal('<h2>'+escapeHTML(n.title)+'</h2><p>'+escapeHTML(n.body)+'</p>','MANH MỐI ĐÃ GIẢI','research-result');
  return;
 }
 if(id==='pz_chu_lua'&&has('book_lua')&&!researchPagesRead('book_lua').includes(BOOKS.book_lua.pages.length-1)){showModal('<h2>Trang cuối nhật ký</h2><p>Hãy mở lại trang cuối của nhật ký sau khi trở về từ ký ức.</p>','TƯ LIỆU','research-need');return}
 const missing=p.requires.filter(x=>!has(x));
 if(missing.length){
  showModal(researchPuzzleArt(p)+'<h2>'+escapeHTML(p.title)+'</h2><p>'+escapeHTML(p.prompt)+'</p><p class="modal-note">Các ký hiệu ở đây chưa đủ rõ để kết luận. Có thể có sách hoặc ghi chép trong những phòng khác giúp đối chiếu.</p>','CÂU ĐỐ · CHƯA ĐỦ DỮ KIỆN','research-need');
  return;
 }
 let selected=[],hints=0,errors=0;
 const isRight=()=>{
  if(p.kind==='choice')return selected.length===1&&selected[0]===p.answer;
  if(p.kind==='code')return selected.length===1&&selected[0]===p.answer;
  if(p.kind==='sequence')return selected.join('|')===p.answer;
  if(p.kind==='multi')return selected.length===p.answer.length&&p.answer.every(a=>selected.includes(a));
  return false;
 };
 const finish=()=>{
  if(!isRight()){
   errors++;selected=[];renderPuzzle();playSound('switch',.12);
   const panel=$('research-puzzle-status');if(panel)panel.textContent='Chưa khớp với các tài liệu. Thử xem lại từng chi tiết.';
   const root=document.querySelector('.research-puzzle-ui');if(root){root.classList.remove('research-error');void root.offsetWidth;root.classList.add('research-error')}
   return;
  }
  state.flags.researchSolved=state.flags.researchSolved||[];
  if(!state.flags.researchSolved.includes(id))state.flags.researchSolved.push(id);
  if(p.rewardEvidence)evidence(p.rewardEvidence);
  note('researchSolved_'+id,p.title,p.clue);
  save();playSound('page',.3);hideModal();render();
  toast('ĐÃ GIẢI · '+p.title);
  talk([['Đông','Khoan, chỗ này khớp rồi.'],['Nguyệt',p.clue]]);
 };
 const renderPuzzle=()=>{
  const hadFocus=!!(document.activeElement&&document.activeElement.closest('.research-puzzle-ui'));
  const options=p.options||[];
  const task='<div class="research-puzzle-ui"><div class="research-puzzle-top"><span>HỒ SƠ / ĐỐI CHIẾU</span><span>✥</span></div>'+researchPuzzleArt(p)+'<h2>'+escapeHTML(p.title)+'</h2><div class="research-puzzle-prompt"><p>'+escapeHTML(p.prompt)+'</p></div><div id="research-puzzle-options" class="research-choice-list"></div><p id="research-puzzle-status" class="modal-note">'+(p.kind==='sequence'?'Chọn từng mục theo thứ tự đúng.':p.kind==='multi'?'Chọn đúng '+p.answer.length+' mục rồi kiểm tra.':'Hãy đọc các trang đã tìm được trước khi chọn.')+'</p><div id="research-puzzle-actions" class="research-controls"></div><div id="research-puzzle-hint" class="research-hints"></div></div>';
  showModal(task,'CÂU ĐỐ · TÀI LIỆU','research-puzzle');
  const opt=$('research-puzzle-options'),acts=$('research-puzzle-actions');
  if(p.kind==='code'){
   const input=document.createElement('input');input.type='text';input.inputMode='numeric';input.maxLength=4;input.autocomplete='off';input.className='research-code';input.setAttribute('aria-label','Mã bốn chữ số');input.value=selected[0]||'';
   input.addEventListener('input',()=>{input.value=input.value.replace(/\D/g,'').slice(0,4);selected=[input.value]});input.addEventListener('keydown',e=>{if(e.key==='Enter'){selected=[input.value];finish()}});opt.appendChild(input);
  }else for(const answer of options){
   const b=modalButton((selected.includes(answer)?'✓ ':'')+answer,()=>{
    if(p.kind==='choice'){selected=[answer];finish();return}
    if(p.kind==='sequence'){
     if(!selected.includes(answer))selected.push(answer);
     if(selected.length===p.options.length)finish();else renderPuzzle();return;
    }
    selected=selected.includes(answer)?selected.filter(x=>x!==answer):[...selected,answer];renderPuzzle();
   });
   if(selected.includes(answer))b.classList.add('research-selected');
   if(p.kind==='sequence'&&selected.includes(answer))b.disabled=true;
   opt.appendChild(b);
  }
  if(p.kind==='sequence'){
   const seq=document.createElement('p');seq.className='research-picked';seq.textContent='Đã chọn: '+(selected.join(' → ')||'chưa có');opt.appendChild(seq);
  }
  if(p.kind==='multi'||p.kind==='code')acts.appendChild(modalButton('Kiểm tra đáp án',finish));
  if(p.kind==='sequence')acts.appendChild(modalButton('Chọn lại',()=>{selected=[];renderPuzzle()}));
  acts.appendChild(modalButton('Gợi ý nhẹ',()=>{hints=1;const x=$('research-puzzle-hint');x.textContent=p.hints[0]||'Đối chiếu các tài liệu liên quan.'}));
  acts.appendChild(modalButton('Đóng',hideModal));
  if(hints){$('research-puzzle-hint').textContent=p.hints[0]||'Đối chiếu các tài liệu liên quan.'}
  if(hadFocus){const next=opt.querySelector('button:not(:disabled),input');if(next)next.focus({preventScroll:true})}
 };
 renderPuzzle();
}

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
function hintBlock(hints){const wrap=document.createElement('div');wrap.className='hint-block';const p=document.createElement('p');p.className='modal-note hint-text';p.hidden=true;const b=modalButton('Gợi ý nhẹ',()=>{p.textContent=hints[0]||'Hãy xem lại những gì đã quan sát.';p.hidden=false;b.disabled=true});b.classList.add('hint-btn');wrap.append(b,p);return wrap}
const CIPHER_PLAIN='DONG HO DUNG LUC 11 GIO 45',CIPHER_SHIFT=7;
function caesar(s,k){return s.replace(/[A-Z]/g,c=>String.fromCharCode((c.charCodeAt(0)-65+k+26*4)%26+65))}
function checkAssemble(manual){if(!['fragA','fragB','fragC'].every(has)||state.relics.includes('petition'))return;if(manual===true)showAssemble();else toast('Đã đủ ba mảnh đơn. Ghép chúng trên bàn ông Lâm ở BG17.')}
function showCipher(){
 if(state.flags.cipherDone){say('Nguyệt','Mặt sau khung ảnh viết: “'+CIPHER_PLAIN+'”. Mình đã lấy mảnh giấy rồi.');return}
 const enc=caesar(CIPHER_PLAIN,CIPHER_SHIFT);let shift=0;
 showModal(`<h2>Mặt sau khung ảnh</h2><p>Có dòng chữ viết bằng mực phai, mỗi chữ cái bị dịch đi một số bước trong bảng chữ cái. Hãy xoay bánh giải mã cho tới khi đọc được.</p><div class="puzzle-cipher-art" role="group" aria-label="Mặt sau khung ảnh và bánh giải mã"><div class="cipher-line" id="cipher-line" aria-live="polite"></div></div><div class="cipher-ctl"><button type="button" class="modal-option" id="cp-prev" aria-label="Xoay bánh giải mã sang trái">◀</button><span id="cp-shift">Dịch: 0</span><button type="button" class="modal-option" id="cp-next" aria-label="Xoay bánh giải mã sang phải">▶</button></div><p class="modal-note" id="cp-msg">Đọc ra một câu có nghĩa, rồi bấm “XÁC NHẬN”.</p><div id="cp-actions" class="modal-buttons"></div>`,'CÂU ĐỐ · MẬT MÃ','cipher');
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
 const svg=()=>{const ha=((h%12)+m/60)*30,ma=m*6;return `<svg viewBox="0 0 120 120" class="mini-clock" aria-hidden="true"><circle cx="60" cy="60" r="54" fill="none" stroke="#5a3a22" stroke-width="2"/>${[...Array(12)].map((_,i)=>`<line x1="60" y1="${i%3?10:8}" x2="60" y2="${i%3?14:18}" stroke="#2a1d12" stroke-width="${i%3?1.5:3}" transform="rotate(${i*30} 60 60)"/>`).join('')}<line x1="60" y1="60" x2="60" y2="30" stroke="#1a120a" stroke-width="5" stroke-linecap="round" transform="rotate(${ha} 60 60)"/><line x1="60" y1="60" x2="60" y2="16" stroke="#1a120a" stroke-width="3" stroke-linecap="round" transform="rotate(${ma} 60 60)"/><circle cx="60" cy="60" r="4" fill="#5a3a22"/></svg>`};
 showModal(`<h2>Ngăn kín dưới đồng hồ</h2><p>Mặt sau đồng hồ có một cơ cấu khóa: ngăn dưới chỉ bật ra khi kim chỉ đúng giờ. Chỉnh kim giờ và kim phút.</p><div class="puzzle-clock-art" role="img" aria-label="Bộ máy đồng hồ cũ với mặt đồng hồ điều chỉnh được"><div class="clock-wrap" id="clk"></div></div><div class="cipher-ctl"><span>Giờ</span><button type="button" class="modal-option" id="h-" aria-label="Giảm giờ"> − </button><b id="hv"></b><button type="button" class="modal-option" id="h+" aria-label="Tăng giờ"> + </button><span>Phút</span><button type="button" class="modal-option" id="m-" aria-label="Giảm phút"> − </button><b id="mv"></b><button type="button" class="modal-option" id="m+" aria-label="Tăng phút"> + </button></div><p class="modal-note" id="ck-msg">Chỉnh kim rồi bấm “XÁC NHẬN”.</p><div id="ck-actions" class="modal-buttons"></div>`,'CÂU ĐỐ · ĐỒNG HỒ','clockpuz');
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
 showModal(`<h2>Ghép lá đơn tố cáo</h2><p>Ba mảnh giấy rách đã đủ. Bấm hai mảnh để đổi chỗ, sắp lại cho đoạn văn xuôi chữ.</p><div class="puzzle-paper-art"><div id="asm-strips" class="asm-strips"></div></div><p class="modal-note">Đọc từ trên xuống dưới: lời mở đầu, nội dung, lời nhắn cuối.</p><div id="asm-actions" class="modal-buttons"></div>`,'CÂU ĐỐ · GHÉP GIẤY','assemble');
 draw();$('asm-actions').append(modalButton('Đóng',hideModal))}

/* ============ CHƯƠNG 9 · BÁT CƠM NÓNG · ĐÊM 17/3 · RỪNG THIÊNG ============ */
function chooseModal(title,text,opts,kicker,type){showModal(`<h2>${title}</h2><p>${text}</p><div id="choose-box" class="modal-buttons"></div>`,kicker||'LỰA CHỌN',type||'choice');const box=$('choose-box');opts.forEach(o=>box.appendChild(modalButton(o[0],()=>{hideModal();o[1]()})))}
/* Sắp thứ tự: bấm hai mục để đổi chỗ. items = thứ tự đúng. */
function showOrder(o){const n=o.items.length;let ord=o.start.slice(),sel=null,fin=false;
 showModal(`<h2>${o.title}</h2><p>${o.intro}</p><div class="puzzle-paper-art"><div id="ord-box" class="asm-strips"></div></div><p class="modal-note">${o.note||''}</p><div id="ord-actions" class="modal-buttons"></div>`,o.kicker,'order');
 const draw=()=>{const box=$('ord-box');box.textContent='';ord.forEach((v,i)=>{const b=document.createElement('button');b.type='button';b.className='asm-strip'+(sel===i?' sel':'');b.textContent=o.items[v];b.onclick=()=>{if(fin)return;if(sel===null){sel=i}else{[ord[sel],ord[i]]=[ord[i],ord[sel]];sel=null;playSound('page',.15)}draw();if(ord.every((x,k)=>x===k)){fin=true;setTimeout(()=>{hideModal();o.onDone()},450)}};box.appendChild(b)})};
 draw();$('ord-actions').appendChild(modalButton('Đóng',hideModal));if(o.hints)$('modal-body').appendChild(hintBlock(o.hints))}
/* Giữ hơi thở: bấm THỞ khi kim đang nằm trong vùng sáng. Sai nhiều lần thì vùng sáng rộng ra. */
function showBreath(onDone){let ok=0,miss=0,pos=0,dir=1,alive=true,lock=0,lastFrame=null;
 showModal(`${puzzleContextArt(BG(state.scene),'Khung cảnh trong ký ức')}<h2>Giữ nhịp thở</h2><p>Cha và một người lạ đang ở ngay sau cánh cửa. Hãy bấm <strong>THỞ</strong> khi kim đi vào vùng sáng, ba lần liền.</p><div class="breath-bar" id="br-bar"><div class="breath-zone" id="br-zone"></div><div class="breath-needle" id="br-needle"></div></div><p class="modal-note" id="br-msg">0 / 3</p><div id="br-actions" class="modal-buttons"></div>`,'CÂU ĐỐ · NHỊP THỞ','breath');
 const zone=$('br-zone'),needle=$('br-needle'),msg=$('br-msg');
 const width=()=>Math.min(48,20+miss*7),left=()=>50-width()/2;
 const setZone=()=>{zone.style.left=left()+'%';zone.style.width=width()+'%'};setZone();
 // Tốc độ theo thời gian, không phụ thuộc màn hình 60 Hz hay 120 Hz.
 const loop=t=>{if(!alive||!$('br-bar')){alive=false;return}const dt=lastFrame===null?0:Math.max(0,Math.min(50,t-lastFrame));lastFrame=t;if(lock>0)lock=Math.max(0,lock-dt);else{pos+=dir*dt*.081;if(pos>=100){pos=100;dir=-1}if(pos<=0){pos=0;dir=1}}needle.style.left=pos+'%';requestAnimationFrame(loop)};requestAnimationFrame(loop);
 $('br-actions').appendChild(modalButton('THỞ',()=>{if(lock>0)return;if(pos>=left()&&pos<=left()+width()){ok++;playSound('switch',.06);msg.textContent=ok+' / 3';if(ok>=3){alive=false;hideModal();onDone();return}}else{miss++;ok=0;lock=667;playSound('switch',.14);msg.textContent='Cha ho khẽ. Đứng yên... rồi thở lại. 0 / 3';setZone()}}));
 if(matchMedia('(prefers-reduced-motion: reduce)').matches)$('br-actions').appendChild(modalButton('Tiếp tục theo nhịp chậm',()=>{alive=false;hideModal();onDone()}));
 $('br-actions').appendChild(modalButton('Đóng',()=>{alive=false;hideModal()}))}

function riceBowl(){
 if(state.flags.riceSeen){say('Nguyệt','Bát cơm vẫn nóng. Dấu chân nhỏ dẫn xuống bếp, ra phía sau.');return}
 state.flags.riceSeen=true;note('rice','Bát cơm còn nóng','Trên bàn thờ có một bát cơm đầy, hơi nóng còn bốc lên dù không ai thắp lửa. Có dấu chân rất nhỏ in trên sàn, dẫn xuống bếp.');save();
 talk([['Nguyệt','Bát cơm đầy, còn nóng. Hơi bốc lên như vừa mới múc ra.'],['Ánh','Cơm nóng thật. Có ai đó đã đặt nó ở đây chưa đầy một giờ trước.'],['Tuyết','Bà Mận mất rồi. Mơ thì không ăn được. Vậy ai nấu?'],['Mơ','Em đặt nó đấy. Mỗi đêm. Em chỉ không nhớ... em đặt cho ai.'],['Nguyệt','Nhìn kìa, trên sàn có dấu chân. Nhỏ lắm. Nhỏ như chân một đứa trẻ bảy tuổi.'],['Đông','Dấu chân dẫn xuống bếp. Mình bật đèn pin lên soi.']],()=>{if(!state.flags.camp0)campTalk()});renderSidebar()}
function footTrail(){
 if(state.flags.footTrail){go('BG43');return}
 if(!state.flashlight){say('Nguyệt','Sàn bếp tối quá. Mình bật đèn pin lên xem thử.');return}
 state.flags.footTrail=true;save();
 talk([['Nam','Có rồi. Dấu chân bé tí, in bằng tro bếp. Chúng đi vòng qua bếp rồi dừng lại ở cánh cửa nhỏ sau tủ.'],['Tuyết','Cửa gác. Cửa nhỏ như vậy, người lớn phải cúi mới qua được.'],['Nguyệt','Mơ đã đi lối này mỗi đêm. Mình đi theo em.']],()=>go('BG43'))}
function luaDiary(){
 if(state.flags.flashDone){say('Nguyệt','Ba trang nhật ký của cô Lụa đã được sắp lại. Mình sẽ giữ nó cẩn thận.');return}
 if(state.flags.diaryDone){startFlashbackPrompt();return}
 showOrder({title:'Ba trang nhật ký của cô Lụa',kicker:'CÂU ĐỐ · NHẬT KÝ',intro:'Ba trang rời, nét chữ ngày một run hơn. Bấm hai trang để đổi chỗ, sắp theo thứ tự thời gian.',note:'Mỗi trang có một dòng ngày tháng ở đầu.',
  items:['MÙA XUÂN 1984. Hôm nay cô chủ nhỏ tập viết tên mình. Em cười khi tôi đọc sai một chữ, rồi bắt tôi chép lại.','MÙA ĐÔNG 1987. Em ho suốt đêm. Tôi ngồi bên giường, đợi đến sáng mới dám đi xuống bếp.','ĐÊM 16/3/1988. Ông Lâm bảo tôi ở lại giúp một đêm lễ. Nếu có chuyện gì, mong em đừng ra sân giếng một mình.'],
  start:[2,0,1],hints:['Mỗi trang có một mốc thời gian ở dòng đầu.','Trang viết từ lúc còn vui đứng trước, trang viết đêm trước buổi lễ đứng sau cùng.','Thứ tự đúng: Mùa xuân 1984, Mùa đông 1987, Đêm 16/3/1988.'],
  onDone:()=>{state.flags.diaryDone=true;note('lua','Nhật ký cô Lụa','Những trang còn lại ghi việc chăm sóc Mơ và đêm lễ. Những trang cuối đã bị xé.');save();
   talk([['Tuyết','Cô Lụa chăm em rất lâu. Nhưng những trang cuối đã biến mất.'],['Mơ','Cô vẫn hay ngồi bên giường em. Em muốn cho các chị xem một chuyện.']],startFlashbackPrompt)}})}
function startFlashbackPrompt(){
 if(!state.flags.camp0){campTalk();return}
 const missing=Object.keys(MEMORY_ITEMS).filter(id=>!memorySeen(id));
 if(missing.length){chooseModal('Những mảnh ký ức','Mơ nắm tay Nguyệt. Những ký ức gắn với năm di vật vẫn chưa được nhìn lại đầy đủ.',[['Xem ký ức di vật',showMemories],['Để sau',hideModal]],'KÝ ỨC');return}
 chooseModal('Đêm 17/3/1988','Mơ nắm lấy tay Nguyệt. Cả căn gác tối dần, và tiếng hộp nhạc vang lên rất nhỏ.',[['Theo Mơ về đêm ấy',startFlashback],['Chưa sẵn sàng',hideModal]],'KÝ ỨC');
}

function startFlashback(){state.flags.mo=true;state.flags.fbBowl=false;state.flags.fbMan=null;state.flags.fbKeys=false;state.flags.fbSeal=false;state.flags.fbFed=false;state.flags.fbCha=false;save();go('BG34')}
function fbMan(){
 if(state.flags.fbMan){say('Mơ',state.flags.fbMan==='wake'?'Bà Mận lặng im bên bếp.':'Bà Mận vẫn ngủ gật bên bếp.');return}
 chooseModal('Bà Mận ngủ gật bên bếp','Bà ngồi bên bếp than, đầu gục xuống, hai tay còn nắm chiếc muôi. Mơ định bước qua thật khẽ.',[['Đánh thức bà',()=>{state.flags.fbMan='wake';save();talk([['Mơ','Bà ơi, ai đang làm gì ngoài sân vậy?'],['Bà Mận','...Con. Mơ, không được ra sân. Cha con dặn rồi.'],['Bà Mận','Bà không giúp được con đâu. Bà sợ... Thôi, con về buồng đi, đừng nghe gì cả.'],['Mơ','Con thấy bà khóc. Bà ơi, con chỉ đi xem một chút thôi.']]);showInteractionView('fbManWake','BG34')}],['Để bà ngủ',()=>{state.flags.fbMan='quiet';save();talk([['Mơ','Con đi nhẹ lắm đấy, bà Mận ơi.'],['Mơ','Mỗi đêm bà đều giả vờ ngủ. Con biết bà biết hết. Bà vẫn để cho con đi.']]);showInteractionView('fbMan','BG34')}]],'LỰA CHỌN')}
function fbBowl(){if(state.flags.fbBowl){say('Mơ','Chiếc bát bé xíu vẫn nằm đó, trống không.');return}state.flags.fbBowl=true;save();render();talk([['Mơ','Bát này nhỏ xíu, vừa tay con. Sao lại để riêng, không ai ăn?'],['Mơ','Con nghe tiếng người lớn nói chuyện trên gác. Con lên xem.']]);renderSidebar()}
function fbKeys(){
 if(state.flags.fbKeys){say('Mơ','Con nhớ mãi: “Nó sẽ đứng dậy.” Con không hiểu thầy ấy nói về ai.');return}
 say('Mơ','Cha đang nói chuyện với một người lạ. Phải thật nhẹ.');
 showBreath(()=>{chooseModal('Sau cánh cửa phòng cha','Giọng cha: “Làm xong, con bé sẽ khỏi?” Một giọng khác, lạnh và đều: “Nó sẽ đứng dậy.” Rồi tiếng ghế kêu, bước chân tới gần cánh cửa. Mơ siết chặt vạt áo.',[['“Con nghe tiếng mưa, cha ạ.”',()=>fbKeysDone('rain')],['Nín thở, đứng yên',()=>fbKeysDone('silent')]],'LỰA CHỌN')})}
function fbKeysDone(c){state.flags.fbKeys=true;save();render();
 talk(reviewed('M88B'));renderSidebar()}

function fbLua(){
 if(state.flags.fbFed){say('Mơ','Con vẫn nghe tiếng cô Lụa gọi, mơ hồ, như qua nước.');return}
 state.flags.fbFed=true;save();render();talk(reviewed('M88C'));renderSidebar()}

function fbLock(){
 go('BG36');
 talk([['Người kể chuyện','Cha chạm vào then cửa, rồi buông tay xuống. Ông kéo Mơ ra khỏi bếp.'],['Mơ','Cha! Cha ơi!'],['Ông Bá Lâm','Ngoài sân có thầy lo rồi. Con ở yên đó.'],['Người kể chuyện','Không ai mở cánh cửa ấy. Mơ ngồi bệt trên sàn, nghe tiếng gõ nhỏ dần.']])}
function huuTalk(){
 if(state.flags.huuDone){say('Ông Hựu','Nếu các cháu vẫn muốn lên Vân Hòa thì qua cầu gỗ, theo lối xe cũ.');return}
 state.flags.huuDone=true;save();talk(reviewed('S04'),()=>{note('huu','Lời ông Hựu ở chùa làng','Ông Hựu chỉ lối xe cũ và nhắc cả nhóm hỏi thêm những người còn nhớ.');renderSidebar()});
}

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
 talk(reviewed('M88E'),()=>{playSound('slam',.35,3.7);go('BG39')})}

function fbLight(){
 talk([['Người kể chuyện','Sáng hôm sau, ông Bá Lâm đứng bên miệng giếng rất lâu. Ông tìm con cả đêm.'],['Người kể chuyện','Ông ra lệnh xây bịt miệng giếng, và không bao giờ nhắc tới.'],['Người kể chuyện','Dưới hầm, không còn ai gõ cửa nữa.'],['Mơ','Em chạy về phía ánh đèn đó trong mơ mỗi đêm. Em chưa bao giờ tới.']],
  ()=>showOrder({title:'Những gì Mơ đã làm đêm ấy',kicker:'CÂU ĐỐ · KÝ ỨC',intro:'Hãy sắp lại đúng thứ tự những việc em đã làm đêm 17/3.',note:'Bấm hai mục để đổi chỗ.',items:['Em nghe tiếng kêu cứu sau cánh cửa hầm.','Em giật chiếc ấn đồng khỏi thành giếng.','Em chạy ngang miệng giếng, nơi nắp đã xô lệch.'],start:[2,0,1],hints:['Việc đầu tiên diễn ra ở cửa hầm sau bếp.','Em phải cầm được ấn rồi mới chạy.','Thứ tự: nghe tiếng kêu, giật ấn, chạy qua giếng.'],onDone:endFlashback}))}
function endFlashback(){
 state.flags.mo=false;state.flags.flashDone=true;state.flags.riceOn=false;
 note('flash','Đêm 17/3/1988','Mơ nghe tiếng kêu cứu từ hầm và cố tìm người giúp. Em cầm ấn chạy trong mưa rồi rơi xuống giếng. Có một lời cô Lụa gọi theo cần được đối chiếu với giấy tờ.');save();go('BG42');
 const lines=reviewed('M88F').slice(0,6);lines.push(['Nguyệt','Mình cần đối chiếu lời cô Lụa với giấy tờ còn lại. Em không phải tự đoán một mình.']);talk(lines,showWellPhoto)
}

function showWellPhoto(){
 if(state.scene!=='BG42'||state.flags.wellPhotoSeen)return;
 const lines=[['Người kể chuyện','Ánh xem lại tấm ảnh vừa chụp ở giếng. Trên mặt ảnh hiện ra hai dáng người đứng cạnh nhau.'],...reviewed('S44')];
 talk(lines,()=>{state.flags.wellPhotoSeen=true;note('wellPhoto','Hai bóng bên giếng','Trong ảnh của Ánh có hai dáng người, một cao và một nhỏ. Chưa rõ người còn lại là ai; cần đối chiếu thêm.');save()});
 showSceneView({scene:'BG42',file:'Anh_Gieng_Hai_Bong.webp',alt:'Ảnh chiếc giếng với hai bóng người'},'BG42');
}
function wellSealed(){
 const f=state.flags;
 if(f.flashDone&&!f.wellPhotoSeen){showWellPhoto();return}

 if(!f.wellFlowers){
  f.wellFlowers=true;save();
  talk([['Mơ','Hoa nhài này không phải của bà Mận đâu.'],['Ánh','Vậy ai đặt ở đây?'],['Mơ','Cha em. Sáng nào ông cũng mang hoa ra giếng. Em không biết ông có nhớ em không.'],['Nam','Mặt xi măng nứt rồi. Chắc có người từng cạy lên.']]);return;
 }
 if(f.sealRecovered){say('Nguyệt','Ấn đồng mình đã kéo lên rồi. Chỉ nhìn mặt đáy của nó cũng đủ thấy rùng mình.');return}
 if(!f.flashDone){say('Đông','Chưa biết thứ gì nằm dưới nắp giếng. Mình đừng phá bừa.');return}
 talk([['Ánh','Có một móc sắt cũ cạnh gầu. Dưới khe nứt hình như có thứ gì phản sáng.'],['Nguyệt','Mơ đã nhớ chiếc ấn rơi xuống đây. Nếu nó vẫn ở dưới, mình cần lấy lên để đối chiếu.']],
 ()=>chooseModal('Ấn đồng dưới giếng','Nắp giếng đã nứt; có thể luồn móc gầu qua khe để kéo vật kim loại dưới đáy lên. Không ai phải trèo xuống giếng.',[
  ['Dùng móc gầu kéo vật kim loại lên',()=>{
   f.sealRecovered=true;gain('seal');evidence('bronzeSeal');
   note('bronzeSeal','Ấn đồng tìm thấy ở giếng','Ấn đồng từng dùng trong đêm 1988 được kéo lên bằng móc gầu. Nó là vật chứng của tà lễ, không phải đồ thờ Huyền Lâm Thánh Quân.');save();
   talk([['Nam','Ra rồi. Nhìn nhỏ thế mà nặng thật.'],['Ánh','Đáy ấn có cùng nét khắc với dấu trên tờ giấy của thầy Tịnh.'],['Đông','Giữ cẩn thận. Đừng để nó lại trong nhà này.']]);showInteractionView('wellSealed','BG42');
  }],['Đậy nắp lại, chưa động vào',hideModal]
 ],'ĐIỀU TRA · MIỆNG GIẾNG','choice'));
}
function campTalk(){
 const f=state.flags;
 if(f.mo)return;
 if(!f.camp0){talk(reviewed('F06'),()=>{f.camp0=true;f.nguyetTruth=true;save()});return}
 if(!f.camp1&&!f.riceSeen){f.camp1=true;save();talk([['Tuyết','Sáu cái bát lễ, mà chỉ có năm người bị gọi xuống hầm... mình cứ nghĩ mãi. Mẹ tớ mất vì không có thuốc, trong khi thuốc thì có, chỉ không ai chịu bán chịu.'],['Tuyết','Mọi thứ đều được chuẩn bị sẵn, kể cả cánh cửa. Cậu thấy không, Đông? Có những nơi cái chết không đến từ thiên tai.'],['Nam','...'],['Nam','Này, uống đi. Trà nóng.'],['Tuyết','Cảm ơn Nam. Cậu pha tệ lắm, nhưng nóng.']]);return}
 if(!f.camp2&&f.riceSeen){f.camp2=true;save();talk([['Nam','Tớ không chịu nổi. Một người cha nghe cả tiếng kêu cứu mà vẫn buông tay khỏi then cửa. Ông ta nghĩ cái quái gì vậy?'],['Đông','Có thể ông ấy cũng sợ, Nam. Tớ biết cảm giác đó.'],['Nam','Cậu biết cái gì chứ?'],['Đông','Tớ từng quay lưng với một người cần mình, chỉ vì sợ rắc rối. Tớ hiểu cái cảm giác ngồi ở ban công nhìn xuống mà không làm gì.'],['Nam','...Cậu nói thế làm tớ không giận ông ấy được nữa. Tớ ghét điều đó.'],['Ánh','Có những lúc không giận được ai cũng đau như thế.']]);return}
 if(!f.camp3&&f.namesDone){f.camp3=true;save();talk([['Người kể chuyện','Nhang trong vườn sau đã tàn. Nguyệt mở cuốn sổ ra, lật tới trang cuối, rồi đọc thật chậm.'],['Nguyệt','Giờ có đủ tên rồi, tớ mới dám đối chiếu. Lê Văn Hải, bên nhà Nam. Trần Thị Sen, nhà Tuyết. Phạm Thị Lụa, nhà Ánh. Đỗ Văn Khoa, nhà Đông. Còn bác Nguyễn Văn Tâm là bên nhà tớ.'],['Nam','Hồi bé tớ nghe mẹ kể có ông bác đi làm công xa rồi biệt tích luôn. Hóa ra là ở đây.'],['Tuyết','Bà tớ cũng hay nói, nhà mình có người đi nấu bếp cho nhà giàu rồi không về. Tớ cứ tưởng bà kể cho vui.'],['Ánh','Cô Lụa còn có con nữa. Tớ có biết gì đâu.'],['Đông','Lạ thật. Biết bác ấy là ai rồi, mà tớ thấy nhẹ đi một chút. Không còn là cái tên lạ trong sổ nữa.'],['Nguyệt','Những lá thư bà để lại giờ đã có chứng cứ để đối chiếu. Bà ngoại tớ cũng biết chuyện đêm ấy, mà im lặng cả đời vì sợ. Tớ muốn tìm sự thật, để không ai còn phải giấu những cái tên này nữa.'],['Tuyết','Cậu đâu cần bù thay ai. Cậu đứng ở đây là đủ rồi.'],['Ánh','Vậy tối nay ngủ gần nhau nhé. Tớ không muốn nằm một mình đâu.']]);return}
 say('Nguyệt','Đống lửa vẫn cháy nhỏ. Cả nhóm ngồi quanh, im lặng và gần nhau.')}
function redCloth(){
 if(state.flags.redSeen){say('Nguyệt','Dải vải đỏ có thêu tên bà ngoại tớ. Bà đã buộc nó nhiều năm trước.');return}
 state.flags.redSeen=true;note('red','Dải vải đỏ của bà ngoại','Trên cành cổ thụ có một dải vải đỏ thêu tên bà ngoại Nguyệt. Bà đã buộc nó như một lời xin lỗi lặng lẽ.');save();
 talk([['Nguyệt','Tên bà tớ. Thêu bằng chỉ trắng, nét đã sờn.'],['Nguyệt','Bà buộc nó ở đây, nhiều năm trước. Chắc bà đã quay lại rừng này nhiều lần, một mình.'],['Tuyết','Mỗi năm một dải. Họ không nói ra, mà vẫn xin lỗi.']])}
function grandPhoto(){
 state.flags.grandSeen=true;save();
 talk([['Nguyệt','Bà ơi. Cháu đã tìm ra rồi. Cháu đã gọi tên họ.'],['Nguyệt','Cháu không giận bà. Bà chỉ là một người sợ. Ai cũng có lúc sợ.'],['Ánh','Bà sẽ nghe thấy cậu.'],['Nguyệt','Tớ chỉ muốn bà biết cháu vẫn thương bà.']])}
/* ============ ÔNG ĐẠT · SIM · BẢN SỚ ============ */
function grandBox(){
 const f=state.flags;
 if(f.simLead){say('Nguyệt','Tờ bản đồ với mảnh giấy của bà. Mình cứ theo đó mà đi.');return}
 f.simLead=true;gain('map88');
 note('simLead','Mảnh giấy trong tủ thờ','Bà ngoại Nguyệt dặn: lễ năm 1986 là có thật. Cô Sim, con gái nhà họ Lê, bị người ta vu oan. Muốn biết thì tìm ông Đạt, em trai cô, ở nhà cuối xóm Đông. Từ rừng thiêng rẽ theo đường mòn bên phải.');
 save();render();
 talk([['Nguyệt','Ngăn kéo này tớ chưa bao giờ dám mở. Ơ, có tờ bản đồ vẽ tay với một mảnh giấy gấp.'],['Đông','Đọc đi.'],['Nguyệt','“Cháu Nguyệt. Nếu cháu mở ngăn này thì bà đã đi rồi. Bà không dám kể, nhưng cái lễ năm 1986 là có thật. Cô Sim, con gái nhà họ Lê, bị người ta vu oan. Muốn biết thì tìm thằng Đạt, em cô ấy, nhà cuối xóm Đông. Nó dám nói. Bà thì không.”'],['Tuyết','Vậy là còn một người biết chuyện thật, và còn sống.'],['Ánh','Mà Sim là ai vậy? Nãy giờ tụi mình chỉ nghe tiếng khóc dưới giếng thôi.'],['Nam','Thì đi hỏi chứ còn gì. Trên bản đồ có chấm đỏ ở đường mòn bên rừng.'],['Nguyệt','Ra rừng thiêng, rẽ bên phải là tới.']])}
function datDoor(){
 const f=state.flags;
 if(f.datTrust){go('BG49');return}
 const ask=()=>chooseModal('Trả lời ông Đạt thế nào?','Ông đứng chắn nửa cửa, tay vẫn nắm chốt.',[
  ['“Cháu là cháu ngoại bà Sáu. Bà dặn cháu tới tìm bác.”',datTrustYes],
  ['“Dạ, bọn cháu làm bài về truyền thuyết rừng thiêng, bác kể giúp cho tí ạ.”',()=>datTrustNo(1)],
  ['“Bọn cháu biết hết rồi, bác cứ nói đại ra đi.”',()=>datTrustNo(2)]],'ÔNG ĐẠT','choice');
 if(!f.datKnock){f.datKnock=true;save();talk([['Người kể chuyện','Nguyệt gõ cửa ba tiếng. Một lúc sau có tiếng dép lê, cánh cửa mở hé. Một ông cụ tóc bạc nhìn cả nhóm từ đầu đến chân.'],['Ông Đạt','Ai đấy? Không phải người làng này. Lại đi làm báo, làm phim đấy à? Tôi nói trước, tôi không kể chuyện cho người ta đăng lên mạng đâu.']],ask)}
 else talk([['Ông Đạt','Lại mấy đứa đấy à. Lần này định nói gì?']],ask)}
function datTrustNo(k){
 talk([['Ông Đạt',k===1?'Truyền thuyết hả? Người ta chết thật chứ có phải truyền thuyết đâu. Về đi các cháu.':'Biết hết rồi mà còn hỏi tôi? Hồi đó cũng có người nói thế, rồi viết ra toàn chuyện bịa. Tôi mệt rồi.'],['Người kể chuyện','Cánh cửa khép lại. Nhưng ông không cài then.']]);showInteractionView('datDoor','BG48')}
function datTrustYes(){
 state.flags.datTrust=true;save();render();
 talk([['Ông Đạt','Bà Sáu... Bà ấy còn nhớ tôi cơ à. Vào đi, vào đi, đừng đứng ngoài sương.'],['Nguyệt','Bà cháu mất rồi bác ạ.'],['Ông Đạt','Ừ, tôi biết. Mấy năm trước tôi có ra thắp cho bà nén nhang. Người giữ chuyện cũ, đi trước hết cả.'],['Ông Đạt','Chị Sim nhà tôi ấy mà, hồi đó cả làng chia làm hai phe. Bên bảo chị phá lễ nên rừng nổi giận, bên bảo chị là người cứu cả xóm. Tôi chỉ biết chị tôi không làm gì có lỗi với ai.'],['Tuyết','Bác kể tụi cháu nghe được không ạ?'],['Ông Đạt','Từ từ, vào nhà đã. Ấm nước tôi vừa đun xong.']],()=>go('BG49'));showInteractionView('datDoor','BG48')}
function simPhoto(){
 const f=state.flags;
 if(f.simHeard){say('Ông Đạt','Chị tôi đó. Ảnh chụp hồi chị còn nhỏ, cái khăn ấy chị tự nhuộm.');return}
 f.simHeard=true;
 note('simStory','Chị Sim, theo lời ông Đạt','Lê Thị Sim sinh năm 1971, hái thuốc, sửa đường mòn, dẫn trẻ lạc về làng. Bà ngoại cô trông miếu cây đa, dạy rằng: người vào rừng phải biết sợ rừng, nhưng không được lấy mạng người để xin rừng thương. Năm 1986 cô phát hiện bản sớ thầy Tịnh đang dùng đã bị sửa.');save();
 talk([['Ông Đạt','Chị tôi tên Lê Thị Sim, sinh năm bảy mốt. Hồi nhỏ chị theo bà ngoại trông cái miếu cây đa. Bà dạy một câu, chị thuộc như thuộc cháo: người vào rừng phải biết sợ rừng, nhưng không được lấy mạng người để xin rừng thương.'],['Ánh','Nghe như một người tốt thật sự ấy ạ.'],['Ông Đạt','Tốt thì tốt, mà cứng đầu. Năm tám sáu thầy Tịnh bảo làng mất mùa là do thần rừng chưa hài lòng, đòi lễ vật sống. Chị đem tờ sớ của ông ấy ra so với tờ của bà ngoại, thấy khác. Chị nói thẳng, thế là họa.'],['Đông','Rồi sao nữa ạ?'],['Ông Đạt','Họ vu cho chị làm ô uế đàn tế, rồi giữ chị lại. Hồi ấy tôi mới mười hai tuổi. Chị kịp nhét cho tôi một bản chép với mẩu khăn, bảo chạy lên xã gọi người lớn. Tôi chạy. Người ta đến thật, nhưng chị tôi bị thương nặng quá, không qua khỏi.'],['Ông Đạt','Tôi mang chuyện đó bốn mươi năm. Nghe người ta đồn chị tôi thế này thế nọ mà không dám cãi.']],offerSimMemory)}
function offerSimMemory(){
 if(state.flags.simMemorySeen)return;
 chooseModal('Ký ức năm 1986','Ông Đạt nhớ lại lúc chị Sim giao cho mình mảnh giấy trước khi cậu chạy đi gọi người lớn.',[
  ['Xem ký ức',playSimMemory],['Để xem sau',hideModal]
 ],'HỒI ỨC','choice');
}
function playSimMemory(){
 hideModal();
 const lines=[['Người kể chuyện','Năm 1986. Bên con đường rừng, Sim đặt mảnh giấy đã gấp vào tay em trai.'],['Sim','Đạt, em cầm lấy. Chạy lên xã, nhờ người lớn tới nền tế.'],['Đạt','Còn chị thì sao?'],['Sim','Chị sẽ tìm cách giữ họ lại. Đi đi, đừng quay lại một mình.'],['Người kể chuyện','Đạt ôm mảnh giấy, chạy qua con đường đất. Tiếng gọi của chị vẫn ở lại phía sau.']];
 talk(lines,()=>{state.flags.simMemorySeen=true;note('memory_sim','Ký ức · Sim và Đạt','Ông Đạt nhớ lại lần chị Sim giao giấy tờ cho mình và nhờ đi gọi người lớn năm 1986.');save()});
 activeMemory='sim';refreshMemoryUI();showSceneView({...MEMORY_VIEWS.sim,scene:state.scene},state.scene);
}
function simScarf(){
 if(has('simScarf')){say('Ông Đạt','Cháu giữ lấy. Chị tôi mà biết có người cầm khăn đi tìm sự thật, chị mừng.');return}
 gain('simScarf');save();
 talk([['Ông Đạt','Khăn chàm với túi lá thuốc là đồ đi rừng của chị. Cháu cầm theo đi, biết đâu có lúc cần.'],['Nguyệt','Cháu xin giữ cẩn thận ạ.']])}
function datBox(){
 const f=state.flags;
 if(f.datBoxDone){say('Ông Đạt','Hết rồi, tôi đưa cháu hết rồi. Giờ cháu cứ lo cho xong chuyện.');return}
 if(!f.simHeard){say('Ông Đạt','Ngồi uống ngụm nước đã, rồi tôi kể. Cái ngăn đó để lát.');return}
 f.datBoxDone=true;gain('scrollOrig');gain('simLetter');
 note('simLetter','Thư Sim gửi Đạt','“Đạt à. Chị đối chiếu rồi, tờ thầy Tịnh đang đọc không phải tờ bà để lại. Giấy mới dán vào giấy cũ, mực khác, cái câu “nhận máu người” là họ thêm vào. Chị không sợ, chỉ sợ họ chặn em. Em cầm cái này chạy lên xã, bảo người ta ra nền tế ngay. Đừng quay lại tìm chị. Chị Sim.”');
 note('scrollOrig','Bản sớ tạ rừng nguyên bản','Danh hiệu ở dòng đầu: Huyền Lâm Thánh Quân. Lời tạ: “Rừng nuôi người sống, người giữ rừng xanh.” Nét chữ đều, triện đỏ đã phai.');save();
 talk([['Ông Đạt','Hai thứ này chị đưa tôi đêm ấy. Tôi giữ bốn mươi năm, chưa dám đưa ai.'],['Ông Đạt','Một là bản chép lễ tạ rừng của bà ngoại chị. Một là lá thư chị viết vội, buộc bằng dải khăn chàm.'],['Nguyệt','Cháu đọc thử được không bác?'],['Ông Đạt','Đọc đi. Chữ chị tôi, tôi nhìn là nhận ra.']],()=>chooseModal('Thư Sim gửi Đạt','“Đạt à. Chị đối chiếu rồi, tờ thầy Tịnh đang đọc không phải tờ bà để lại. Giấy mới dán vào giấy cũ, mực khác, cái câu “nhận máu người” là họ thêm vào. Chị không sợ, chỉ sợ họ chặn em. Em cầm cái này chạy lên xã, bảo người ta ra nền tế ngay. Đừng quay lại tìm chị. Chị Sim.”',[['Gấp thư lại',()=>{talk([['Ông Đạt','Tờ của Tịnh chắc còn nằm đâu đó dưới hầm, chỗ họ làm lễ. Tìm được thì đem lại đây, mình trải ra so với tờ của bà ngoại chị.']]);showInteractionView('datBox','BG49')}]],'THƯ CŨ','choice'))}
function fakeFind(){
 const f=state.flags;
 if(f.fakeGot){say('Nguyệt','Tờ sớ giả mình đã lấy rồi.');return}
 f.fakeGot=true;gain('scrollFake');
 note('scrollFake','Bản sớ giả','Giấy mới chắp vào giấy cũ, mực đậm hơn, một dòng viết lệch. Danh hiệu ở dòng đầu ghi “Huyền Lâm Tôn Thần”, không giống bài vị ở miếu.');save();
 talk([['Nguyệt','Trong xấp giấy lễ có một tờ sớ kẹp lẫn vào. Giấy mới chắp vào giấy cũ, mực đậm hơn hẳn.'],['Ánh','Dòng đầu ghi “Huyền Lâm Tôn Thần”. Khoan, tớ nhớ bài vị ở miếu không có chữ “Tôn”.'],['Đông','Cứ giữ lại. Chắc sẽ cần.']])}
function compareScrolls(){
 const f=state.flags;
 if(f.scrollCompared){say('Ông Đạt','Hai tờ giấy đã nói hết rồi. Chị tôi không nói dối.');return}
 if(!f.datBoxDone){say('Ông Đạt','Cháu cứ nghe tôi kể đã. Tôi có thứ muốn đưa cháu.');return}
 if(!has('scrollFake')){say('Ông Đạt','Tờ của bà ngoại chị tôi có đây rồi. Muốn so thì phải có tờ của Tịnh, chắc nó nằm dưới hầm, chỗ làm lễ.');return}
 chooseModal('Đối chiếu hai bản sớ','Bản gốc ghi “Huyền Lâm Thánh Quân”. Bản của Tịnh ghi “Huyền Lâm Tôn Thần”. Bài vị ở miếu cây đa đề tên nào?',[
  ['Huyền Lâm Thánh Quân',()=>chooseModal('Đối chiếu hai bản sớ','Bản của Tịnh có một đoạn giấy mới chắp vào, mực đậm hơn. Đoạn đó viết gì?',[
    ['“Rừng nuôi người sống, người giữ rừng xanh.”',()=>{say('Ông Đạt','Câu đó có trong cả hai bản, nét chữ cũng đều. Nhìn lại chỗ giấy chắp xem.');showInteractionView('compareScrolls','BG49')}],
    ['“Rừng nhận máu người, người nhận phúc rừng.”',scrollsMatch]],'SO CHỮ','choice')],
  ['Huyền Lâm Tôn Thần',()=>{say('Ông Đạt','Nhớ lại đi. Tôi với chị hay quét miếu, bài vị không có chữ “Tôn”.');showInteractionView('compareScrolls','BG49')}]],'SO CHỮ','choice')}
function scrollsMatch(){
 state.flags.scrollCompared=true;evidence('scrollProof');
 note('scrollProof','Sớ giả và sớ gốc','Danh hiệu bị đổi từ Thánh Quân thành Tôn Thần, giấy mới chắp vào giấy cũ, mực và nét chữ khác, câu “Rừng nhận máu người” là bị thêm vào. Đây là bằng chứng Tịnh cố ý sửa sớ.');save();render();
 talk([['Ông Đạt','Đó. Chữ lệch, mực khác, tên thần cũng bị đổi. Tịnh không hiểu sai đâu, ông ta cố ý sửa.'],['Nam','Vậy là Đức Ngài không đòi máu ai hết.'],['Nguyệt','Giờ mình có thứ để nói với cả làng rồi.'],['Ông Đạt','Còn cái ấn thì tôi không có. Nghe nói nó rơi xuống giếng nhà họ Lâm từ năm tám tám. Việc đó tôi chịu, các cháu lo nhé.'],['Tuyết','Dạ. Tụi cháu sẽ làm cho trọn.']]);showInteractionView('compareScrolls','BG49')}
function endingEligibility(){
 const f=state.flags;
 const base=!!(f.ritualDone&&f.sixthDone&&f.flashDone&&f.lamDone&&f.namesDone);
 const documents=['ledger','confession','archive'].every(id=>state.evidence.includes(id));
 const canGood=base&&documents&&researchSolved('pz_chu_lua')&&researchSolved('pz_thong_gio')&&researchSolved('pz_ta_so')&&!!(f.forgedRiteRejected||f.scrollCompared);
 const canTrue=canGood&&researchSolved('pz_loi_khan')&&researchSolved('pz_thu_sim')&&researchSolved('pz_dau_an')&&!!(f.scrollCompared&&f.sealRecovered&&f.datTrust&&state.evidence.includes('scrollProof')&&has('simLetter'));
 return {canGood,canTrue};
}

function forestAltar(){
 const f=state.flags;
 if(f.forestDone){say('Nguyệt','Mình đã đưa ra quyết định ở đây rồi.');return}
 if(!f.redSeen||!f.grandSeen){say('Nguyệt','Tớ muốn đọc dải vải đỏ, rồi ghé nhà bà ngoại trước. Có chuyện bà để lại mà tớ chưa hiểu hết.');return}
 const result=endingEligibility();
 const options=[
  ['Dừng lại, cả nhóm cùng trở về làng',()=>showEnding('normal')],
  ['Quay lại hầm để xem năm vòng phấn và bản sớ',()=>{hideModal();go('BG32')}]
 ];
 if(result.canGood&&!result.canTrue)options.push(['Gỡ những dấu trấn giả, đưa Mơ và năm người ra khỏi biệt thự',()=>{f.forestDone=true;save();showEnding('good')}]);
 if(result.canTrue)options.push(['Dùng ấn đồng và hai bản sớ làm rõ tội ác đối với Sim',()=>{f.forestDone=true;save();showEnding('true')}]);
 talk([['Nguyệt','Tới đây rồi mà tớ vẫn chưa biết nên nói gì trước.'],['Đông',result.canTrue?'Mình đã tìm được những chứng cứ cần đối chiếu. Cùng quyết định nhé.':'Hồ sơ vẫn còn những chỗ chưa rõ. Mình có thể tiếp tục đối chiếu trước khi quyết định.'],['Tuyết','Tớ chỉ không muốn chuyện năm ấy lặp lại với bất cứ ai nữa.']],
 ()=>chooseModal('Bàn thờ đá giữa rừng','Ở đây từng có một lễ tạ rừng bình yên. Về sau, có người đã sửa lời khấn và biến nó thành một lời đe dọa. Những gì cả nhóm làm tiếp phải dựa vào chứng cứ, không dựa vào bản sớ chưa rõ nguồn gốc.',options,'LỰA CHỌN CUỐI','escape'));
}
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
/* Tài liệu cầm theo người, chạm vào ô đồ để đọc */
const READ_ITEMS={petition:'petition',fragA:'fragA',fragB:'fragB',fragC:'ledger',testimony:'testimony',legendDoc:'legend',backDoc:'photoBack',folkPrint:'folkPrint'};
function showDoc(noteId){
 const n=state.notes.find(x=>x.id===noteId);if(!n){toast('Chưa có gì để đọc.');return}
 const chart=noteId==='legend'?'<div class="glyph-chart">'+GLYPH_OF.map(r=>`<div class="glyph-row">${glyph(r[3],34)}<span>${r[1]}<small>${r[2]}</small></span></div>`).join('')+'</div>':noteId==='folkPrint'?folkPrintChart():'';
 showModal(`<h2>${escapeHTML(n.title)}</h2><div class="doc-paper">${escapeHTML(n.body).replace(/\n/g,'<br>')}</div>${chart}<div id="doc-actions" class="modal-buttons"></div><p class="modal-note" id="doc-hint" hidden></p>`,'TÀI LIỆU','doc');
 if(noteId==='folkPrint')$('doc-actions').appendChild(modalButton(state.selectedItem==='folkPrint'?'Cất tờ giấy':'Cầm giấy để đối chiếu',()=>{state.selectedItem=state.selectedItem==='folkPrint'?null:'folkPrint';hideModal();render();save()}));
 $('doc-actions').appendChild(modalButton('Đóng',hideModal));playSound('page',.18)}

/* Chuỗi manh mối của miếu: quy ước riêng trong câu chuyện Đồng Chay. */
const FOLK_MARKS={
 rice:{label:'Bát cơm',path:'M4 17h24a12 12 0 0 1-24 0ZM9 14q2-4 5-1 2-5 5 0 3-3 5 1'},
 water:{label:'Dòng nước',path:'M3 11q4-4 8 0t8 0t8 0M3 18q4-4 8 0t8 0t8 0M3 25q4-4 8 0t8 0t8 0'},
 flower:{label:'Cành hoa',path:'M16 15v13M16 22q-6-6-10-3 4 5 10 4M16 15c-7-1-8-7-4-8 1-5 7-5 8 0 5 1 4 7-4 8ZM16 10h.01'},
 lamp:{label:'Đèn dầu',path:'M7 24h18M9 21h14l-2-5H11ZM16 14c-5-4 0-7 0-11 3 4 6 7 0 11Z'},
 leaf:{label:'Lá cây',path:'M5 27C5 13 11 5 27 4c0 15-7 23-22 23ZM7 25 23 8M13 19l-1-6M18 14l5 1'},
 grain:{label:'Bông lúa',path:'M10 28 23 4M19 10q-7-1-7-5 5-1 7 5ZM16 16q-7-1-7-5 5-1 7 5ZM13 22q-7-1-7-5 5-1 7 5ZM19 12q6 0 7-4-5-2-7 4ZM16 18q6 0 7-4-5-2-7 4Z'},
 flame:{label:'Ngọn lửa',path:'M16 3c2 6 9 9 9 16a9 9 0 0 1-18 0c0-4 3-7 5-10 1 3 3 4 4-6Z'}
};
const folkGlyph=id=>`<svg viewBox="0 0 32 32" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${FOLK_MARKS[id].path}"/></svg>`;
function folkPrintChart(){
 return '<div class="folk-print" aria-label="Các dấu trên giấy, từ trái sang phải">'+['leaf','water','grain','flame'].map(id=>`<span>${folkGlyph(id)}<small>${FOLK_MARKS[id].label}</small></span>`).join('')+'</div>';
}
function folkDials({title,intro,inscription,choices,solution,hint,onDone,reference=false,art=null}){
 let values=[null,null,null,null],done=false;
 const paper=reference&&state.notes.find(n=>n.id==='folkPrint');
 const referenceHTML=paper?`<details class="folk-reference"><summary>Xem mảnh giấy dó</summary><div class="doc-paper">${escapeHTML(paper.body).replace(/\n/g,'<br>')}</div>${folkPrintChart()}</details>`:'';
 const image=reference?INTERACTION_VIEWS.marker:art;
 showModal(`<div class="folk-puzzle${reference?' is-stone':''}"><h2>${title}</h2>${image?`<img class="folk-location-art" src="${ROOT}props/${image.file}" alt="${escapeHTML(image.alt)}" draggable="false">`:''}<p>${intro}</p><p class="folk-inscription">${inscription}</p><div class="folk-slots" id="folk-slots"></div><p class="modal-note" id="folk-status" aria-live="polite">Chạm từng ô để đổi hình, rồi kiểm tra.</p>${referenceHTML}<div class="modal-buttons" id="folk-actions"></div></div>`,'CÂU ĐỐ · DẤU MIẾU','folk');
 const draw=()=>{const box=$('folk-slots');box.replaceChildren();values.forEach((id,i)=>{
  const b=document.createElement('button');b.type='button';b.className='folk-slot';b.setAttribute('aria-label','Vị trí '+(i+1)+': '+(id?FOLK_MARKS[id].label:'chưa chọn'));
  b.innerHTML=`<span class="folk-number">${i+1}</span>${id?folkGlyph(id):'<span class="folk-empty">?</span>'}<small>${id?FOLK_MARKS[id].label:'Chọn hình'}</small>`;
  b.onclick=()=>{if(done)return;const next=(choices.indexOf(values[i])+1)%(choices.length+1);values[i]=next===choices.length?null:choices[next];draw();const current=$('folk-slots').children[i];if(current)current.focus({preventScroll:true})};box.appendChild(b)
 })};
 draw();const actions=$('folk-actions');
 actions.appendChild(modalButton('Kiểm tra',()=>{if(done)return;if(values.some(v=>v===null)){$('folk-status').textContent='Hãy chọn hình cho cả bốn vị trí.';return}
  if(!solution.every((id,i)=>values[i]===id)){$('folk-status').textContent='Cơ cấu vẫn im. Hãy đối chiếu lại các dấu.';playSound('switch',.1);return}
  done=true;hideModal();playSound('switch',.22);onDone()}));
 actions.appendChild(modalButton('Đặt lại',()=>{values=[null,null,null,null];draw();$('folk-status').textContent='Đã xóa các hình vừa chọn.'}));
 actions.appendChild(modalButton('Đóng',hideModal));$('modal-body').appendChild(hintBlock([hint]));
}
function folkOfferingPuzzle(){
 if(state.flags.folkOfferingDone){if(has('folkPrint'))showDoc('folkPrint');else say('Nguyệt','Mâm gỗ đã mở. Dấu in còn được ghi trong nhật ký.');return}
 folkDials({title:'Mâm gỗ ở miếu',art:INTERACTION_VIEWS.folkOffering,intro:'Bốn hõm trên mâm có thể xoay hình. Những món lễ đã được bày lệch khỏi vị trí cũ.',
  inscription:'Nhìn từ lối vào: mép trái khắc bông lúa, mép phải ám đen như từng đặt đèn.',choices:['rice','water','flower','lamp'],solution:['rice','water','flower','lamp'],
  hint:'Sổ miếu ghi vị trí của nước so với cơm và hoa.',onDone:()=>{
   gain('folkPrint');note('folkPrint','Mảnh giấy dó dập dấu','Một hàng dấu được in trên giấy dó. Góc giấy có hình cột mốc giữa rừng.\nDòng chữ nhỏ: “Tìm đường về từ hơi ấm đến bóng cây.”');
   state.flags.folkOfferingDone=true;save();render();const dock=$('inventory-grid');if(dock)dock.scrollLeft=dock.scrollWidth;
   talk([['Nguyệt','Mâm khẽ bật lên. Có một mảnh giấy dó nằm dưới đáy.'],['Ánh','Bốn hình này giống nét khắc trên cột đá trong rừng. Giữ lại, biết đâu còn dùng được.']]);showInteractionView('folkOffering','BG46')
  }});
}
function folkStonePuzzle(){
 if(state.flags.folkMarkerDone){say('Nam','Những vòng đá đã dừng. Khe cất chìa giờ trống rồi.');return}
 folkDials({title:'Bốn vòng trên cột đá',intro:'Mảnh giấy dó vừa khít khe đá. Bốn vòng khắc có thể xoay độc lập.',
  inscription:'Một đường rãnh chạy từ vòng thứ nhất đến vòng thứ tư.',choices:['leaf','water','grain','flame'],solution:['flame','grain','water','leaf'],
  hint:'Xem hàng dấu và dòng chữ trên mảnh giấy dó.',reference:true,onDone:()=>{
   const got=!state.flags.gateOpened&&gain('key');state.flags.folkMarkerDone=true;state.selectedItem=null;
   note('folkStone','Những dấu trên cột đá','Bốn dấu ở cột mốc khớp với mảnh giấy dập dưới mâm gỗ của miếu. Một khe bí mật mở ra.');
   if(got)note('marker','Chìa ở cột mốc đá','Một chìa khóa sắt rỉ được giấu trong khe đá, hướng về cổng biệt thự.');
   save();render();const dock=$('inventory-grid');if(got&&dock)dock.scrollLeft=dock.scrollWidth;talk(got?[["Nam","Cạch... Trong khe có một chiếc chìa sắt. Có lẽ vừa ổ khóa ở cổng."],["Ánh","Có người giấu nó kỹ thật. Mảnh giấy ở miếu đã dẫn chúng ta tới đây."]]:[["Nguyệt","Khe đá đã mở. Mảnh giấy ở miếu và cột mốc quả thật liên quan tới nhau."]])
  }});
}
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
 showModal(`<h2>Ngăn kéo bốn hõm</h2><p>Trên nắp có bốn hõm xếp thành hàng ngang. Hãy đặt bốn món đồ chơi vào đúng thứ tự, từ trái sang phải.</p><div class="puzzle-drawer-art"><div class="slot-row" id="sl-row"></div></div><div class="toy-tray" id="sl-tray"></div><p class="modal-note" id="sl-msg">Bấm một món rồi bấm hõm muốn đặt vào. Bấm món đã đặt để lấy ra.</p><div id="sl-actions" class="modal-buttons"></div>`,'CÂU ĐỐ · SẮP ĐỒ','shelf');
 const putItem=(b,id)=>{b.appendChild(itemArt(id,'toy-ico'));const label=document.createElement('small');label.textContent=ITEMS[id].name;b.appendChild(label)};
 const draw=()=>{const row=$('sl-row'),tray=$('sl-tray');row.textContent='';tray.textContent='';
  slots.forEach((id,i)=>{const b=document.createElement('button');b.type='button';b.className='slot'+(id?' full':'');b.setAttribute('aria-label','Hõm '+(i+1)+(id?': '+ITEMS[id].name:': trống'));if(id)putItem(b,id);else{const n=document.createElement('small');n.textContent=String(i+1);b.appendChild(n)}
   b.onclick=()=>{if(id){slots[i]=null;playSound('switch',.06)}else if(pick){slots[i]=pick;pick=null;playSound('switch',.1)}draw();check()};row.appendChild(b)});
  need.filter(id=>!slots.includes(id)).forEach(id=>{const b=document.createElement('button');b.type='button';b.className='toy'+(pick===id?' sel':'');b.setAttribute('aria-pressed',String(pick===id));putItem(b,id);b.onclick=()=>{pick=pick===id?null:id;draw()};tray.appendChild(b)})};
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
 showModal(`<h2>Nắp hầm khóa bằng ký hiệu</h2><p>Năm vòng khắc năm ký hiệu lạ. Bấm từng vòng để đổi ký hiệu. Nắp chỉ bật ra khi năm ký hiệu đúng thứ tự.</p><div class="glyph-lock puzzle-hatch-art" id="gl"></div><p class="modal-note" id="gl-msg">${has('legendDoc')?'Bảng ký hiệu trong túi đồ giúp bạn nhận ra ký hiệu của từng người.':'Chưa biết ký hiệu nào của ai. Có lẽ ở đâu đó trong nhà có một bảng chỉ dẫn.'}</p><div id="gl-actions" class="modal-buttons"></div>`,'CÂU ĐỐ · KÝ HIỆU','glyphs');
 const draw=()=>{const box=$('gl');box.textContent='';d.forEach((k,i)=>{const b=document.createElement('button');b.type='button';b.className='gl-dial';b.setAttribute('aria-label','Vòng ký hiệu '+(i+1));b.innerHTML=glyph(GLYPH_ORDER[k],46);
  b.onclick=()=>{if(done)return;d[i]=(d[i]+1)%GLYPH_ORDER.length;playSound('switch',.09);draw();chk()};box.appendChild(b)})};
 const chk=()=>{if(done||!SOL.every((id,i)=>GLYPH_ORDER[d[i]]===id))return;done=true;state.flags.cellOpen=true;save();$('gl').classList.add('is-open');playSound('door',.2);setTimeout(()=>{hideModal();render();talk([['Nam','Cạch. Cả nắp hầm bật lên, hơi lạnh phả ra.'],['Tuyết','Đúng thứ tự họ đã đứng ký. Họ chưa bao giờ rời nhau.'],['Đông','Xuống thôi. Cẩn thận.']],()=>go('BG32'))},600)};
 draw();$('gl-actions').appendChild(modalButton('Đóng',hideModal));
 $('modal-body').appendChild(hintBlock(['Cần hai thứ: bảng ký hiệu và thứ tự đứng ký đơn. Bảng ký hiệu nằm trong ngăn kéo giá sách phòng học của Mơ, thứ tự ghi ở mặt sau một tấm ảnh dưới gối ở gác nhỏ.','Thứ tự đứng ký: thầy Khoa, bác Tâm, cô Lụa, chị Sen, bác Hải.','Từ trái sang phải: cây bút, cái cân, nốt nhạc, ngọn lửa, con sóng.']))}
function showSafe(){if(state.flags.safeOpened){say('Nguyệt','Trong hộp đã tìm được bản thú tội của người tham gia nghi lễ.');return}
 showLock({title:'Hộp tài liệu của ông Bá Lâm',kicker:'CÂU ĐỐ · HỘP SẮT',type:'safe',code:'0317',plate:'KIM ĐỒNG HỒ KHÔNG BAO GIỜ ĐI TIẾP',hint:'Bấm vào từng ô số để đổi chữ số. Khóa đã rỉ sét.',onOpen:()=>{state.flags.safeOpened=true;evidence('confession');note('confession','Bản thú tội trong hộp sắt','Tài liệu ghi lại cách ông Bá Lâm che giấu việc giam năm người tố cáo trong tầng hầm và một nghi thức trấn yểm thất bại.');save();say('Nguyệt','Bản thú tội... Chúng ta đã có thêm chứng cứ về vụ án năm 1988.');renderSidebar()}})}
function showWall(){const count=state.flags.wallImpressions||[];showModal(`<h2>Năm dấu tay trong vữa</h2><img class="folk-location-art" src="${ROOT}props/${INTERACTION_VIEWS.sealedWall.file}" alt="Năm dấu tay trên bức tường bị bịt" draggable="false"><p>Lớp gạch mới bịt kín lối đi. Năm dấu tay mờ cho thấy từng có người đập vào đây từ phía bên kia.</p><p>Hãy chạm vào <strong>năm dấu tay</strong> để kiểm tra từng dấu, sau đó dùng thanh sắt cạy tường.</p><div class="modal-buttons" id="handprints"></div><p class="modal-note" id="hands-status">Đã kiểm tra ${count.length}/5 dấu tay.</p><div class="modal-buttons"><button class="modal-option" id="break-wall" type="button" ${count.length===5?'':'disabled'}>DÙNG THANH SẮT PHÁ TƯỜNG →</button></div>`,'CÂU ĐỐ · BỨC TƯỜNG','wall');renderHands()}
function renderHands(){const done=state.flags.wallImpressions||[];const box=$('handprints');box.replaceChildren();for(let i=1;i<=5;i++){const b=modalButton(done.includes(i)?`✓ Dấu tay ${i}`:`✋ Dấu tay ${i}`,()=>{if(!state.flags.wallImpressions)state.flags.wallImpressions=[];if(!state.flags.wallImpressions.includes(i))state.flags.wallImpressions.push(i);save();renderHands()});if(done.includes(i))b.disabled=true;box.appendChild(b)}$('hands-status').textContent=`Đã kiểm tra ${done.length}/5 dấu tay.`;$('break-wall').disabled=done.length<5;$('break-wall').onclick=()=>{state.flags.wallOpened=true;note('wall','Bức tường bị bịt năm 1988','Lớp gạch vừa bị nạy ra, lộ một phòng kín chứa dấu vết của năm nạn nhân.');consume('crowbar');save();hideModal();playSound('slam',.3,3.9);go('BG20')}}
function showAltar(){if(questOn()){say('Mơ','Ngoài vườn có những nấm mộ gió để nhớ các bác. Chị giúp em tìm tên từng người nhé.');return}if(state.flags.ritualDone){say('Tuyết','Năm di vật đã đặt đủ. Tiếng gõ đã lặng, nhưng tớ không chắc mọi chuyện đã xong.');return}if(!has('incense')){say('Tuyết','Không thể làm nghi thức khi thiếu nhang. Hãy quay về miếu ở BG05.');return}const notFound=RELIC_ORDER.filter(x=>!state.relics.includes(x));if(notFound.length){showModal(`<h2>Năm bát hương lạnh</h2><p>Mỗi bát hương tượng trưng cho một người bị quên tên. Bạn cần tìm đủ <strong>năm di vật</strong> rồi mới tiến hành nghi lễ.</p><p>Đã tìm được: <strong>${state.relics.length}/5</strong>.</p><p class="modal-note">Năm bát hương đang chờ. Hãy tìm kỹ trong căn nhà này.</p>`,'BÀN THỜ GIA TIÊN','altar');return}renderRitual()}
function renderRitual(){const progress=state.ritualProgress.length;showModal(`${puzzleContextArt(ROOT+'props/POV_Bat_Huong.webp','Bàn thờ và bát hương')}<h2>Trả lại tên cho người đã khuất</h2><p>Đặt năm di vật lên bát hương <strong>theo đúng thứ tự mà nhật ký đã ghi lại</strong>.</p><p><strong>Bát hương ${Math.min(progress+1,5)} / 5</strong></p><div id="ritual-options" class="ritual-list"></div><p class="ritual-history" id="ritual-progress">${progress?`Đã đặt ${progress} di vật.`:'Chưa đặt di vật nào.'}</p><p class="modal-note">Chọn sai thứ tự sẽ phải bắt đầu lại.</p>`,'CÂU ĐỐ · NGHI LỄ','ritual');const choices=$('ritual-options');RITUAL_SHOW.forEach((id,i)=>{const b=document.createElement('button');b.type='button';b.className='ritual-option ritual-art-option';b.disabled=state.ritualProgress.includes(id);b.appendChild(itemArt(id,'ritual-art-icon'));const label=document.createElement('span');label.textContent=ITEMS[id].name;b.appendChild(label);b.addEventListener('click',()=>placeRelic(id));choices.appendChild(b)})}
function placeRelic(id){const next=RELIC_ORDER[state.ritualProgress.length];if(id!==next){state.ritualProgress.forEach(r=>{state.used=state.used.filter(x=>x!==r);if(!has(r))state.items.push(r)});state.ritualProgress=[];save();toast('Sai thứ tự. Hãy đọc lại nhật ký.');renderSidebar();renderRitual();return}state.ritualProgress.push(id);consume(id,true);save();playSound('lighter',.16);if(state.ritualProgress.length<5){renderRitual();return}consume('incense',true);consume('lighter',true);toast('Nhang đã cháy hết, bật lửa cạn gas.');state.flags.ritualDone=true;state.flags.awakened=true;note('ritual','Năm di vật khơi ký ức','Năm di vật được đặt đúng chỗ. Tiếng gõ dưới hầm tạm lặng, nhưng chưa có bằng chứng rằng người chết đã được giải thoát.');save();hideModal();note('awake','Tiếng khóc thứ sáu','Nghi lễ xong, năm tiếng gõ đã lặng. Nhưng một tiếng khóc trẻ con vọng xuống từ phòng trẻ. Còn một cái tên chưa được trả lại.');talk([["Nguyệt","Tiếng gõ đã lặng... Nhưng ai đang khóc trên tầng hai? Là một đứa trẻ."],["Tuyết","Tiếng gõ đã lặng. Nhưng còn một người nữa chưa ai gọi tên. Tớ nghe rõ lắm."],["Đông","Phòng trẻ. Mình lên đó, nhưng đi cùng nhau. Không ai ở lại một mình."]]);renderSidebar();}
function showSixth(){showModal(`${puzzleContextArt(ROOT+'props/POV_Hop_Nhac.webp','Hộp nhạc cũ')}<h2>Gọi tên em</h2><p>Hộp nhạc ngân lên. Từ chiếc áo trắng nhỏ vang tiếng thì thầm: <strong>“Chị ơi, em tên là gì?”</strong></p><label class="label-caps" for="six-input">HỌ VÀ TÊN ĐẦY ĐỦ CỦA BÉ GÁI</label><div class="input-row"><input id="six-input" class="code-input" type="text" maxlength="30" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Họ và tên" style="font-size:17px;letter-spacing:.04em;width:240px;max-width:60%"><button class="modal-option" id="six-submit" type="button">GỌI TÊN →</button></div><p id="six-error" class="modal-note">Gợi ý: hãy đọc lại những gì đã ghi trong nhật ký.</p>`,'CÂU ĐỐ · CÁI TÊN THỨ SÁU','six');const input=$('six-input');const solve=()=>{const v=input.value.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d');if(/^(lam thi )?mo$/.test(v)){state.flags.sixthDone=true;state.flags.lamAwake=true;note('sixth','Cái tên thứ sáu','Lâm Thị Mơ, bảy tuổi, con gái út ông Bá Lâm. Em từng sống ở biệt thự và biến mất trong đêm năm 1988. Tên em cuối cùng đã được gọi.');consume('musicbox');save();hideModal();go('BG12');talk([["Mơ","Cảm ơn chị đã gọi tên em... Nhưng cha em đang đợi ở đại sảnh. Ông ấy không để ai mang sự thật ra khỏi nhà."],["Mơ","Chị đừng sợ. Bà vẫn luôn ở trong ngôi nhà này, chưa bao giờ rời đi."],["Nguyệt","Chị hứa. Em cứ yên tâm. Lần này sẽ có người nhớ em."]]);renderSidebar()}else{$('six-error').textContent='Giọng thì thầm lặng đi. Đó chưa phải tên em.';input.select()}};$('six-submit').addEventListener('click',solve);input.addEventListener('keydown',e=>{if(e.key==='Enter')solve()});input.focus()}
function showLam(){if(state.flags.lamDone){go('BG10');return}
 const R=[['“Sổ sách chẳng nói lên điều gì. Đồ lễ vốn là của nhà này, tôi cấp thì sao?”',['ledger','archive']],['“Năm đứa tố cáo ấy tự biến mất. Ai bắt tôi chịu tội?”',['confession']],['“Không ai trong nhà nghe tiếng người kêu cứu dưới hầm.”',['testimony']]];
 const NAMES={ledger:'Sổ vật tư năm 1988',archive:'Hộp hồ sơ dưới hầm',confession:'Bản thú tội trong hộp sắt',testimony:'Lời khai của bà Mận'};
 let r=state.flags.lamRound||0;
 showModal(`${puzzleContextArt(ROOT+'props/Hoi_Uc_So_Sach_1988.webp','Ông Bá Lâm bên sổ sách')}<h2>Ông Bá Lâm</h2><p><strong>Vòng ${r+1} / 3</strong></p><p class="ending-text">${escapeHTML(R[r][0])}</p><p class="modal-note">Chọn chứng cứ để đáp lại.</p><div id="lam-options" class="ritual-list"></div>`,'ĐỐI CHẤT · BÓNG ÔNG LÂM','lam');
 for(const id of Object.keys(NAMES)){const own=state.evidence.includes(id),b=document.createElement('button');b.type='button';b.className='ritual-option';b.disabled=!own;b.textContent=NAMES[id]+(own?'':'  — chưa có');b.addEventListener('click',()=>{if(R[r][1].includes(id)){r++;state.flags.lamRound=r;save();if(r>=3){state.flags.lamDone=true;state.flags.riceOn=true;state.flags.lamRound=0;note('lam','Bóng ông Bá Lâm tan biến','Ba lời chối của ông Lâm đều bị chứng cứ bẻ gãy. Ánh đỏ dưới cánh cửa lịm tắt, tiếng giày nặng nề trong đại sảnh lùi xa dần.');save();hideModal();consume('testimony');talk([["Ông Bá Lâm","Tôi chỉ muốn giữ lấy cái nhà này... Giữ lấy cái tên của tôi..."],["Nguyệt","Tên của ông đã bị chính ông làm bẩn. Còn những người bị xóa mới cần được nhớ."],["Đông","Ánh đỏ tắt rồi. Cửa chính mở được. ...Cảm ơn mọi người, đã không bỏ nhau."],["Mơ","Cha em đi rồi. Em cũng thấy nhẹ lắm. Nhưng chị đừng vội ra, cổng sắt vẫn khóa."],["Mơ","Chị nhìn giúp em bát cơm trên bàn thờ nhé. Em để nó ở đó mỗi đêm, mà bây giờ em không còn nhớ vì sao."],["Nguyệt","Bát cơm trên bàn thờ... Mình sẽ xem."],["Nam","Lại một vòng nữa. ...Thôi, lần này chạy bằng đôi chân của mình, không phải chạy trốn."]]);renderSidebar()}else{showLam()}}else{state.flags.lamRound=0;save();hideModal();playSound('slam',.5,3.7);if(window.HorrorFX)window.HorrorFX.scare(true);say('Ông Bá Lâm','Vô ích. Các người chẳng có gì cả. Làm lại từ đầu đi.')}});$('lam-options').appendChild(b)}}
function showAnchorRitual(){
 const f=state.flags;
 if(!f.fakeGot){
  talk([['Ánh','Năm vòng phấn trên nền vẫn còn rõ. Bên cạnh là xấp giấy lễ.'],['Nguyệt','Để tớ xem xấp giấy ấy trước đã. Có khi nó ghi thứ tự các vị trí.']]);return;
 }
 if(!f.ritualDone){say('Đông','Mấy dấu này giống năm chỗ đứng. Nhưng chưa có đủ manh mối, đừng ai bước vào vội.');return}
 talk([
  ['Nam','Trên giấy viết là phải có đủ năm người. Đúng số bọn mình luôn.'],
  ['Nguyệt','Ừ, nhưng tớ không chắc đây là bản người ta dùng trước kia. Có chỗ mực đậm hơn.'],
  ['Mơ','Hồi đó năm bác cũng đứng ở đây. Rồi cửa hầm đóng lại.'],
  ['Đông','Nếu làm theo tờ giấy này thì phải tự đứng vào vòng. Các cậu nghĩ sao?']
 ],()=>chooseModal('Năm vị trí ngũ trấn',
  'Năm di vật đã khơi lại ký ức, nhưng những vòng phấn dưới hầm vẫn còn nguyên. Bản sớ trong kho bảo rằng cần năm người sống đứng vào đó để kết thúc mọi chuyện.',[
   ['Cả năm đứng vào vòng, làm theo bản sớ',()=>{
    f.forgedRiteAccepted=true;f.forgedRiteRejected=false;
    note('fiveAnchors','Năm chỗ đứng','Cả nhóm đã lựa chọn tin vào hướng dẫn trong bản sớ tìm ở kho đồ lễ.');save();
    talk([['Người kể chuyện','Năm người bước vào năm vòng phấn. Tiếng gõ ngừng hẳn. Không khí dưới hầm nhẹ đi một thoáng.'],['Mơ','Anh Đông... Sao bóng của mọi người không đi theo nữa?'],['Đông','Nam? Cậu thử bước ra xem... Nam?']],()=>showEnding('bad'));
   }],
   ['Không bước vào. Giữ tờ sớ để kiểm tra thêm',()=>{
    f.forgedRiteRejected=true;
    note('forgedRefused','Vòng phấn dưới hầm','Năm người sống được yêu cầu đứng thay năm nạn nhân. Cả nhóm quyết định không làm theo khi chưa kiểm tra được nguồn gốc bản sớ.');save();
    talk([['Tuyết','Tớ không muốn ai đứng vào đúng chỗ những người kia từng bị nhốt.'],['Đông','Ừ. Có lẽ mình đang bỏ sót điều gì đó trong tờ sớ. Mang nó đi đối chiếu đã.']]);
   }],
   ['Để đó, quay lại sau',hideModal]
  ],'LỰA CHỌN · NĂM VÒNG PHẤN','choice'));
}

function showEscapeChoice(){
 const f=state.flags;
 showModal('<h2>Trước cánh cổng sắt</h2><p>Qua rừng là đường về làng. Cả nhóm vẫn có thể rời khỏi đây, nhưng những chuyện trong biệt thự chưa được giải thích hết.</p><div id="escape-options" class="modal-buttons"></div>','LỰA CHỌN · RỜI BIỆT THỰ','escape');
 const box=$('escape-options');
 box.appendChild(modalButton('Rời khỏi rừng cùng mọi người',()=>showEnding('normal')));
 if(f.namesDone)box.appendChild(modalButton('Đi theo lối mòn tới bàn thờ đá trong rừng',()=>{hideModal();go('BG40')}));
 box.appendChild(modalButton('Quay lại biệt thự để điều tra tiếp',hideModal));
}
const ENDINGS={
  "bad": {
    "title": "Năm Người Ở Lại",
    "label": "KẾT THÚC · BAD",
    "text": "Năm vòng phấn sáng lên. Cánh cửa hầm bật mở. Trong một khoảnh khắc, cả nhóm tưởng mình đã làm đúng.\n\nNam muốn bước ra trước, nhưng chân cậu không nhúc nhích. Bóng của năm sinh viên đứng yên trong vòng, dù người đã cố lùi lại. Năm linh hồn bị giữ từ năm 1988 mờ dần, còn những vòng trấn mới khép chặt quanh người sống.\n\nMơ gọi các anh chị nhưng không ai đáp. Từ giếng cổ vọng lên tiếng cười hòa với tiếng khóc của Sim. Ấn đồng lại có năm vật trấn mới, và lời nguyền càng nặng thêm.\n\nTrên bản sớ, hàng chữ mực đậm hiện rõ: “Rừng nhận máu người, người nhận phúc rừng.”"
  },
  "normal": {
    "title": "Ra Khỏi Rừng",
    "label": "KẾT THÚC · NORMAL",
    "text": "Cả năm người ra khỏi con đường rừng và trở về làng. Không ai trong nhóm phải ở lại biệt thự.\n\nNhững điều cả nhóm đã thấy vẫn còn nhiều chỗ chưa được giải thích. Nguyệt giữ lại các ghi chép, hy vọng một ngày có thể tìm hiểu tiếp.\n\nỞ phía sau, khu rừng vẫn im lặng. Những câu hỏi về căn biệt thự chưa có lời đáp."
  },
  "good": {
    "title": "Đưa Em Về",
    "label": "KẾT THÚC · GOOD",
    "text": "Cả nhóm không bước vào năm vòng phấn. Họ đem bằng chứng về năm người chết trong hầm ra ánh sáng, gọi đúng từng cái tên và xóa bỏ những dấu trấn giả.\n\nMơ được rời khỏi sân giếng. Hải, Sen, Lụa, Tâm và Khoa không còn bị giữ lại trong đêm 17/3/1988. Mơ nắm tay cô Lụa, lần đầu được ở bên mẹ mà không phải giấu giếm.\n\nSự oán giận của Sim vẫn chưa được giải quyết tận gốc. Cái giếng được phong tỏa tạm thời, người làng tránh xa dấu ấn nguy hiểm, và cả nhóm hiểu rằng sự bình yên này chưa phải lời giải cuối cùng."
  },
  "true": {
    "title": "Khép Lại Đêm Ấy",
    "label": "KẾT THÚC · TRUE",
    "text": "Lời khai của ông Đạt, thư Sim gửi em trai, bản sớ tạ rừng nguyên gốc và bản sớ đã bị thầy Tịnh sửa được đặt cạnh ấn đồng lấy từ giếng. Dấu ấn và hai nét mực phơi bày sự thật: Huyền Lâm Thánh Quân chưa từng đòi máu người.\n\nNăm người chết năm 1988 và bé Mơ được trả lại tên, được rời khỏi những nơi giam giữ họ. Sim nhìn thấy lời mình đã cố giữ từ năm 1986. Thay vì ép cô tha thứ, cả nhóm trả lại chứng cứ cho gia đình và đưa sự việc ra ánh sáng.\n\nSự ràng buộc của ấn đồng chấm dứt. Không còn vòng trấn mới; chu kỳ mười ba năm không thể tiếp diễn vào 2027. Trời sáng trên con đường cũ dẫn về Đồng Chay."
  }
};
function showEnding(which){
 const e=ENDINGS[which];if(!e)return;
 const checkpoint=JSON.parse(JSON.stringify(state));
 if(which==='good'||which==='true'){
  const u=BG('BG33');$('scene-image').src=u;$('scene-backdrop').style.backgroundImage='url("'+u+'")';
 }
 state.flags.ending=which;
 if(!state.endingsSeen.includes(which))state.endingsSeen.push(which);
 save();stopAmbience();
 showModal('<div class="ending-number">'+e.label+'</div><h2>'+e.title+'</h2><p class="ending-text">'+e.text.split('\n\n').map(escapeHTML).join('<br><br>')+'</p><p class="modal-note">Đã mở '+state.endingsSeen.length+'/4 kết thúc.</p>'+(state.flags.legacyEndingsSeen&&state.flags.legacyEndingsSeen.includes('forgive')?'<p class="modal-note">Bạn đã từng mở kết thúc Tha thứ trong phiên bản trước.</p>':'')+'<div id="ending-actions" class="modal-buttons"></div>','HỒI KẾT','ending');
 const box=$('ending-actions');
 box.appendChild(modalButton('Quay lại trước quyết định cuối',()=>{
  state=checkpoint;
  state.flags.ending=null;state.flags.forestDone=false;state.flags.forgedRiteAccepted=false;
  state.endingsSeen=[...new Set([...state.endingsSeen,which])];
  hideModal();render();save();
 }));
 box.appendChild(modalButton('Chơi lại từ đầu',()=>newGame()));
 box.appendChild(modalButton('Về màn hình chính',()=>{hideModal();render();$('title-screen').hidden=false;updateContinue()}));
}
function escapeHTML(t){return String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function toggleSound(){state.sound=!state.sound;if(!state.sound)stopAmbience();else setAmbience();$('btn-audio').textContent=state.sound?'♪':'♪̸';$('btn-audio').setAttribute('aria-pressed',state.sound?'true':'false');save()}
function updateContinue(){const existing=load();if(existing)syncAchievements(false,existing);$('btn-continue').hidden=!existing;}
function newGame(){pendingMemories=[];state=initialState();geckoClock=GECKO_FIRST;chatScene=null;stopAmbience();hideModal();clearDialogue();$('title-screen').hidden=true;render();talk(introOf('BG01'));save()}
function continueGame(){pendingMemories=[];state=load()||initialState();syncAchievements(false);geckoClock=GECKO_FIRST;chatScene=null;$('title-screen').hidden=true;hideModal();clearDialogue();render();if(state.flags.ending){state.flags.ending=null;save()}talk(state.flags.mo?[["Người kể chuyện","Ký ức năm 1988 tiếp tục. Mơ vẫn ở trong đêm hôm ấy."],["Mơ","Con nhớ rồi... mình đang tìm cách giúp mọi người."]]:[["Người kể chuyện","Hành trình tiếp tục. Những trang nhật ký vẫn còn lưu các manh mối bạn đã tìm thấy."],["Nguyệt","Tớ đã ghi lại hết rồi. Mình đi tiếp thôi, nhưng đừng ai tách nhóm."]]);}
function mount(){$('btn-new-game').onclick=newGame;$('btn-continue').onclick=continueGame;$('btn-points').onclick=showScenePoints;$('btn-audio').onclick=toggleSound;$('btn-menu').onclick=showMenu;$('btn-journal').onclick=showJournal;$('modal-close').onclick=hideModal;$('dialogue-next').onclick=nextLine;
 $('modal-backdrop').addEventListener('click',e=>{if(e.target===$('modal-backdrop')&&modalType!=='ending')hideModal()});
 let torchRaf=0,torchEv=null;$('scene-stage').addEventListener('pointermove',e=>{torchEv=e;if(torchRaf)return;torchRaf=requestAnimationFrame(()=>{torchRaf=0;if(!$('scene-stage').classList.contains('torch-on'))return;const box=$('scene-stage').getBoundingClientRect();const x=Math.max(0,Math.min(100,(torchEv.clientX-box.left)/box.width*100));const y=Math.max(0,Math.min(100,(torchEv.clientY-box.top)/box.height*100));$('scene-stage').style.setProperty('--torch-x',x.toFixed(1)+'%');$('scene-stage').style.setProperty('--torch-y',y.toFixed(1)+'%')})});
 $('scene-stage').addEventListener('click',e=>{if(e.target===$('scene-stage')||e.target===$('hotspots')){if(!dialogueOpen)toast(SCENES[state.scene].look)}});
 document.addEventListener('keydown',e=>{if($('title-screen').hidden===false)return;if(e.key==='Tab'&&modalType){const win=$('modal-body').closest('.modal-window'),focusable=[...win.querySelectorAll('button:not(:disabled),input:not(:disabled),[href],[tabindex="0"]')].filter(el=>el.getClientRects().length);if(focusable.length){const i=focusable.indexOf(document.activeElement);if(e.shiftKey&&i<=0){e.preventDefault();focusable[focusable.length-1].focus()}else if(!e.shiftKey&&(i<0||i===focusable.length-1)){e.preventDefault();focusable[0].focus()}}}if(e.key==='Escape'){if(modalType&&modalType!=='ending')hideModal();else{clearDialogue();setTimeout(drainMemories,0)}return}if(modalType==='journal'){if(e.key==='ArrowRight')bookTurn(1);else if(e.key==='ArrowLeft')bookTurn(-1);return}if(modalType==='research-book'){if(e.key==='ArrowRight'){e.preventDefault();researchReaderActions?.next()}else if(e.key==='ArrowLeft'){e.preventDefault();researchReaderActions?.prev()}return}if(modalType||['INPUT','TEXTAREA'].includes(document.activeElement.tagName))return;if(dialogueOpen&&(e.key==='Enter'||e.key===' ')){e.preventDefault();nextLine();return}const k=e.key.toLowerCase();if(k==='h')showHint();if(k==='f'&&has('flashlight'))selectItem('flashlight');if(k==='v')cycleCam();if(k==='j')showJournal()});
 updateContinue();render();setInterval(()=>{geckoTick();crowTick()},1000);}
mount();
})();
