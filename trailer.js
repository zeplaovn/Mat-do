(() => {
'use strict';
const $ = id => document.getElementById(id);
// Independent timeline: it has no dependency on, or write access to, the game save.
const shots = [
  {at:0, bg:'01', kicker:'ĐỒNG CHAY · 2026', title:'Năm người bạn.<br>Một chuyến đi.', copy:'Họ đến để ghi lại một truyền thuyết.'},
  {at:7, bg:'03', kicker:'CON ĐƯỜNG CŨ', title:'Có những lối về<br>đã bị lãng quên.', copy:'Qua cánh đồng, cây cầu gỗ và miếu ven rừng.'},
  {at:14, bg:'05', kicker:'TRƯỚC KHI TRỜI TỐI', title:'Khu rừng vẫn còn nhớ.', copy:'Những lời kể trong làng không hoàn toàn giống nhau.'},
  {at:21, bg:'08', kicker:'BIỆT THỰ VÂN HÒA', title:'Một cánh cổng.<br><em>Một đêm không lối ra.</em>', copy:'Bên trong, thời gian như dừng lại.'},
  {at:28, bg:'11', kicker:'KHÁM PHÁ', title:'Mỗi căn phòng<br>giữ một dấu vết.', copy:'Hãy quan sát thật kỹ những điều tưởng như bình thường.'},
  {at:35, bg:'16', kicker:'LẮNG NGHE', title:'Có người vẫn đang chờ.', copy:'Một chiếc trâm cũ. Một bài hát ru. Một cái tên chưa được gọi.'},
  {at:42, bg:'19', kicker:'GIẢI MÃ', title:'Sự thật không nằm<br>trong một lời kể.', copy:'Đọc, so sánh và tự tìm câu trả lời.'},
  {at:49, bg:'23', kicker:'ĐỐI MẶT', title:'Những điều bị giấu đi<br><em>đang trở lại.</em>', copy:'Không phải thứ gì bạn nhìn thấy cũng đáng tin.'},
  {at:56, bg:'29', kicker:'NĂM CÁI TÊN', title:'Ai đã ở lại nơi này?', copy:'Những người bị lãng quên vẫn có câu chuyện của riêng họ.'},
  {at:63, bg:'40', kicker:'LỜI NGUYỀN RỪNG THIÊNG', title:'Bạn sẽ tìm đến<br>sự thật nào?', copy:'Một hành trình. Nhiều lựa chọn. Bốn kết thúc.'}
];
const sharedBackgrounds=new Set(['01','03','05','08','09']);
const shotImage=id=>`assets/${sharedBackgrounds.has(id)?'background':'trailer'}/BG${id}.webp`;
const duration=70,film=$('film'),art=$('film-art'),poster=$('poster'),screen=$('screen'),end=$('end-card'),player=$('player'),audio=$('film-audio'),seek=$('seek');
let playing=false, position=0, last=0, frame=0, shown=-1, muted=false;
const time=s=>`${String(Math.floor(s/60)).padStart(2,'0')}:${String(Math.floor(s%60)).padStart(2,'0')}`;
function setShot(index){
 if(index===shown)return;shown=index;const shot=shots[index];art.classList.add('changing');
 const img=new Image();img.src=shotImage(shot.bg);
 const update=()=>{if(shown!==index)return;art.style.backgroundImage=`url("${img.src}")`;art.classList.remove('changing')};
 img.complete?update():img.addEventListener('load',update,{once:true});img.addEventListener('error',()=>art.classList.remove('changing'),{once:true});
 $('shot-kicker').textContent=shot.kicker;$('shot-title').innerHTML=shot.title;$('shot-copy').textContent=shot.copy;
 const content=$('screen-content');content.classList.remove('screen-content');void content.offsetWidth;content.classList.add('screen-content');
}
function draw(){seek.value=position;$('player-time').textContent=time(position);let index=0;for(let i=1;i<shots.length;i++)if(position>=shots[i].at)index=i;setShot(index)}
function pause(){if(!playing)return;playing=false;cancelAnimationFrame(frame);audio.pause();$('toggle-play').textContent='▶';$('toggle-play').setAttribute('aria-label','Tiếp tục phát');film.classList.remove('is-playing')}
function tick(now){if(!playing)return;position=Math.min(duration,position+(now-last)/1000);last=now;draw();if(position>=duration){finish();return}frame=requestAnimationFrame(tick)}
function resume(){if(playing)return;if(position>=duration)position=0;playing=true;last=performance.now();$('toggle-play').textContent='Ⅱ';$('toggle-play').setAttribute('aria-label','Tạm dừng');film.classList.add('is-playing');try{audio.currentTime=position}catch(_){}audio.muted=muted;audio.play().catch(()=>{});frame=requestAnimationFrame(tick)}
function start(){poster.hidden=true;end.hidden=true;screen.hidden=false;player.hidden=false;position=0;shown=-1;draw();resume();$('toggle-play').focus({preventScroll:true})}
function finish(){pause();position=duration;screen.hidden=true;player.hidden=true;end.hidden=false;art.style.backgroundImage='url("assets/trailer/BG40.webp")';$('replay-film').focus({preventScroll:true})}
$('start-film').addEventListener('click',start);$('replay-film').addEventListener('click',start);$('skip-film').addEventListener('click',finish);
$('toggle-play').addEventListener('click',()=>playing?pause():resume());
$('toggle-mute').addEventListener('click',()=>{muted=!muted;audio.muted=muted;$('toggle-mute').textContent=muted?'ĐÃ TẮT TIẾNG':'ÂM THANH';$('toggle-mute').setAttribute('aria-label',muted?'Bật tiếng':'Tắt tiếng');$('toggle-mute').setAttribute('aria-pressed',String(muted))});
seek.addEventListener('input',()=>{position=Number(seek.value);try{audio.currentTime=position}catch(_){}draw();if(position>=duration)finish()});
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!screen.hidden)finish()});
})();
