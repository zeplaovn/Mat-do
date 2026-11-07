/* STORY-FIRST TRAILER / Mai 2026
 * Asset-based cinematic sequence. Gameplay inserts are editorial recreations
 * of mechanics already in game.js, not screen-recorded footage.
 * Each beat must answer: why would the viewer want to play? */
(() => {
'use strict';
const $=id=>document.getElementById(id);
const A='assets/';
const bg=n=>A+'background/'+n+'.webp';
const prop=n=>A+'props/'+n+'.webp';
const gp=n=>A+'trailer/'+n+'.webp';
const shots=[
 {d:2.7,img:bg('BG42'),tone:'low-key',copy:'Không ai đứng bên giếng.',sfx:'water',focus:'54% 48%',zoom:1.11},
 {d:2.9,img:prop('Anh_Gieng_Hai_Bong'),tone:'photo',ui:'photo',copy:'Nhưng tấm ảnh lại có hai bóng người.',speaker:'ẢNH CHỤP CỦA CHI',sfx:'camera',cut:'hard',focus:'56% 45%',zoom:1.08},
 {d:1.8,img:prop('Anh_Gieng_Hai_Bong'),tone:'photo',copy:'Họ là ai?',cut:'hard',center:true,zoom:1.18},
 {d:2.8,img:bg('BG01'),copy:'Bà ngoại tớ từng sống ở vùng này.',speaker:'Vy',focus:'44% 58%'},
 {d:2.6,img:prop('POV_Ba_Ban_Nuoc'),copy:'Bà ơi, bà có biết bà Cúc không ạ?',speaker:'Vy',focus:'36% 48%',zoom:1.13},
 {d:2.3,img:prop('POV_Ba_Ban_Nuoc'),copy:'Lâu lắm rồi không ai gọi cái tên ấy.',speaker:'Bà bán nước',cut:'hard',focus:'41% 44%',zoom:1.19},
 {d:2.4,img:bg('BG06'),copy:'Một chuyến đi tìm lời giải.',focus:'60% 50%'},
 {d:2.5,img:bg('BG08'),copy:'Một ngôi nhà không ai muốn nhắc tới.',sfx:'door',focus:'50% 53%',zoom:1.12},
 {d:2.7,img:bg('BG09'),copy:'Có ai vừa kéo cổng không?',speaker:'Vũ',cut:'hard',focus:'53% 48%',zoom:1.1},
 {d:2.3,img:gp('gp1'),tone:'gameplay',copy:'Bạn sẽ tự bước vào.',speaker:'TRẢI NGHIỆM TRONG GAME',zoom:1.025},
 {d:2.4,img:gp('gp2'),tone:'gameplay',copy:'03:17. Vì sao đồng hồ dừng ở đó?',speaker:'QUAN SÁT',zoom:1.03,focus:'50% 46%'},
 {d:2.7,img:bg('BG16'),tone:'gameplay',ui:'explore',copy:'Tìm thứ người khác bỏ sót.',speaker:'TƯƠNG TÁC',focus:'65% 47%',zoom:1.07},
 {d:2.6,img:prop('POV_Guong_Phong_Tre'),tone:'photo',ui:'viewfinder',copy:'Một bức ảnh chưa nói được toàn bộ sự thật.',speaker:'CHI',sfx:'camera',focus:'56% 45%'},
 {d:2.8,img:bg('BG32'),tone:'gameplay',ui:'exploreBasement',copy:'Manh mối nằm trong cả bóng tối.',speaker:'DÙNG VẬT PHẨM',focus:'58% 50%'},
 {d:2.8,img:prop('Closeup02_Papers'),tone:'memory',ui:'compare',copy:'Hai bản sớ. Hai cách kể.',speaker:'ĐỐI CHIẾU',sfx:'page',focus:'50% 48%'},
 {d:2.9,img:prop('Closeup02_Papers'),tone:'memory',ui:'proof',copy:'Một nét mực khác. Vì sao?',speaker:'PHÁT HIỆN MANH MỐI',cut:'hard',focus:'48% 54%',zoom:1.15},
 {d:2.3,img:prop('Hoi_Uc_Sim_1986'),tone:'memory',copy:'Năm 1986, có người đã lên tiếng.',focus:'52% 43%',zoom:1.07},
 {d:2.4,img:bg('BG19'),tone:'low-key',copy:'Nhưng bí mật không dừng lại ở đó.',focus:'50% 56%'},
 {d:2.4,img:prop('Hoi_Uc_Can_Ham_1988'),tone:'memory',copy:'Năm 1988, tiếng kêu cứu vang lên từ hầm.',sfx:'knock',focus:'59% 46%',zoom:1.1},
 {d:2.8,img:prop('Hoi_Uc_So_Sach_1988'),tone:'memory',ui:'timeline',copy:'Ai đã biết? Ai đã im lặng?',focus:'49% 44%'},
 {d:2.8,img:prop('Hoi_Uc_Phong_Tre_1988'),tone:'memory',copy:'Có một đứa trẻ chỉ muốn giúp mọi người.',focus:'57% 43%',zoom:1.08},
 {d:2.6,img:bg('BG42'),tone:'low-key',copy:'Đêm đó, em đã không trở về.',sfx:'water',focus:'58% 48%'},
 {d:2.6,img:bg('BG29'),tone:'low-key',copy:'Những cái tên còn bị giữ lại.',focus:'50% 58%',zoom:1.06},
 {d:2.7,img:bg('BG40'),copy:'Không thể giải lời nguyền chỉ bằng tin đồn.',focus:'42% 49%'},
 {d:2.5,img:prop('Closeup03_SquareSeal'),tone:'memory',copy:'Chiếc ấn này đang giữ điều gì?',focus:'48% 48%',zoom:1.15},
 {d:3.4,img:prop('POV_Gieng_Tram'),tone:'low-key',ui:'choice',copy:'Bạn dám lựa chọn khi chưa chắc mình đúng?',speaker:'QUYẾT ĐỊNH',focus:'48% 54%',zoom:1.1},
 {d:2,img:null,tone:'black',title:'Nếu sai thì sao?',cut:'hard'},
 {d:3.0,img:bg('BG09'),tone:'wide',final:true,focus:'50% 48%',zoom:1.07}
];
const duration=shots.reduce((sum,shot)=>{shot.start=sum;return sum+shot.d},0);
const stage=$('stage'),layers=[...document.querySelectorAll('.plate')],audio=$('audio');
const start=$('start'),end=$('end'),player=$('player'),hud=$('hud'),seek=$('seek');
const narrative=$('narrative'),speaker=$('speaker'),line=$('line'),artifact=$('artifact');
const intertitle=$('intertitle'),finalTitle=$('final-title'),cutFlash=$('cut-flash'),counter=$('shot-counter');
const share=$('btn-share'),fxBtn=$('btn-fx');
let playing=false,muted=false;
let softFx=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
let position=0,shown=-1,front=0,raf=0,last=0,loadDone=0,fxCues=[];
const format=t=>String(Math.floor(t/60)).padStart(2,'0')+':'+String(Math.floor(t%60)).padStart(2,'0');
seek.max=String(duration);$('player-duration').textContent=format(duration);
[9,14,22,25].forEach(index=>{
 const m=document.createElement('i');m.className='chapter-marker';
 m.style.setProperty('--at',(100*shots[index].start/duration).toFixed(2)+'%');
 $('chapter-markers').appendChild(m)
});
function updateFX(){
 stage.classList.toggle('soft-fx',softFx);
 fxBtn.setAttribute('aria-pressed',String(softFx));
 fxBtn.textContent=softFx?'Chuyển động: Giảm':'Giảm chuyển động';
 fxBtn.setAttribute('aria-label',softFx?'Bật chuyển động':'Giảm chuyển động');
}
updateFX();
const assets=[...new Set(shots.filter(x=>x.img).map(x=>x.img)),A+'logo.webp'];
function preload(){
 const first=assets.slice(0,6);
 first.forEach(src=>{
  if(typeof Image!=='function')return;
  const img=new Image(),done=()=>{
   loadDone++;
   $('load-status').textContent=loadDone>=first.length?'Sẵn sàng phát':'Đang chuẩn bị cảnh phim '+Math.round(loadDone/first.length*100)+'%'
  };
  img.onload=img.onerror=done;img.src=src;
 });
 if(typeof Image==='function'&&typeof setTimeout==='function')setTimeout(()=>{
  assets.slice(6).forEach(src=>{const i=new Image();i.src=src});
 },300);
}
preload();
const sfxMap={camera:'Chup_anh.mp3',page:'pageturn.mp3',door:'door-slam.mp3',knock:'knock-on-the-door.mp3',water:'nuoc_chay.mp3'};
const sfxVolume={camera:.38,page:.22,door:.3,knock:.34,water:.14};
function cue(name){
 if(muted||!playing||!name||typeof Audio!=='function')return;
 const file=sfxMap[name];if(!file)return;
 try{
  const a=new Audio(A+'sound/'+file);a.volume=sfxVolume[name]||.2;
  const p=a.play();if(p&&p.catch)p.catch(()=>{});
  fxCues.push(a);
  fxCues=fxCues.filter(x=>!x.ended&&x.currentTime<5);
 }catch(_){}
}
function stopCues(){
 fxCues.forEach(a=>{try{a.pause();a.currentTime=0}catch(_){}});
 fxCues=[]
}
function artifactFor(type){
 if(!type)return '';
 const icon=(file,active)=>'<img '+(active?'class="active" ':'')+'src="'+A+'items/'+file+'" alt="">';
 switch(type){
 case 'photo':
  return '<div class="photo-stamp"><strong>CHI / ẢNH CHỤP</strong><span>THỨ MẮT THƯỜNG KHÔNG THẤY</span></div>';
 case 'viewfinder':
  return '<div class="photo-frame"></div><div class="photo-rec"><b></b> MÁY ẢNH / CHẾ ĐỘ NGẮM</div><div class="cursor-dot" style="--x:51%;--y:48%"></div>';
 case 'explore':
  return '<div class="cursor-dot" style="--x:89%;--y:35%"></div><div class="inspect-label"><span>ĐIỂM TƯƠNG TÁC</span>Gương trong phòng trẻ</div><div class="game-hud">'+icon('01_May_Quay_128x128.webp',true)+icon('02_Den_Pin_128x128.webp',false)+icon('03_So_Tay_128x128.webp',false)+'</div>';
 case 'exploreBasement':
  return '<div class="cursor-dot" style="--x:70%;--y:47%"></div><div class="inspect-label"><span>TÌM DẤU VẾT</span>Kho đồ lễ dưới hầm</div><div class="game-hud">'+icon('01_May_Quay_128x128.webp',true)+icon('02_Den_Pin_128x128.webp',false)+icon('03_So_Tay_128x128.webp',false)+'</div>';
 case 'compare':
  return '<div class="evidence-board"><small>HỒ SƠ / ĐỐI CHIẾU</small><strong>Cùng một lời khấn?</strong><p>Hai nguồn ghi chép không hoàn toàn giống nhau. Bạn sẽ tin nguồn nào?</p><span class="proof-line"><i></i>Danh hiệu trên bài vị</span><span class="proof-line"><i></i>Nét chữ và mực</span></div>';
 case 'proof':
  return '<div class="evidence-board"><small>PHÁT HIỆN / TÀI LIỆU</small><strong>Một chỗ bị sửa.</strong><p>Phải có người đã thay đổi lời khấn. Nhưng vì sao?</p><span class="proof-line marked"><i></i>Vết nối giấy khác màu</span><span class="found">✓ GHI VÀO HỒ SƠ</span></div>';
 case 'timeline':
  return '<div class="timeline-board"><div class="timeline-card"><b>1986</b><span>Một lời cảnh báo</span></div><div class="timeline-card"><b>1988</b><span>Căn hầm bị khóa</span></div><div class="timeline-card"><b>2026</b><span>Bạn đối chiếu chứng cứ</span></div></div>';
 case 'choice':
  return '<div class="choice-panel"><small>QUYẾT ĐỊNH / MIỆNG GIẾNG</small><h3>Nhổ ấn?</h3><p>Bạn vẫn chưa biết thứ gì đang bị giữ bên dưới.</p><div class="fake-choice danger">Vẫn kéo ấn ra</div><div class="fake-choice">Dừng lại và điều tra tiếp</div><div class="hover-dot"></div></div>';
 default:return '';
 }
}
function renderShot(index,elapsed,withCue=false){
 const shot=shots[index],next=1-front,inc=layers[next],out=layers[front],image=inc.firstElementChild;
 inc.className='plate '+(shot.cut==='hard'?'hard-cut':'slow-cut');
 image.style.backgroundImage=shot.img?'url("'+shot.img+'")':'none';
 image.style.setProperty('--duration',(shot.d+.6).toFixed(2)+'s');
 image.style.setProperty('--elapsed',(-elapsed).toFixed(2)+'s');
 image.style.setProperty('--focus',shot.focus||'50% 50%');
 image.style.setProperty('--to',String(shot.zoom||1.1));
 image.style.setProperty('--from',String(shot.zoom?Math.max(1.01,shot.zoom-.07):1.02));
 image.style.setProperty('--drift',index%2?'1.4%':'-1.1%');
 image.style.setProperty('--rise',index%3===0?'-.6%':'.5%');
 inc.classList.add('on');out.classList.remove('on');front=next;shown=index;
 stage.className='stage '+(playing?'is-playing ':'')+(softFx?'soft-fx ':'')+(shot.tone||'')+' '+(shot.center?'centered ':'')+(shot.title?'typewriter ':'')+(shot.ui==='choice'?'has-choice':'');
 speaker.textContent=shot.speaker||'';
 line.textContent=shot.copy||'';
 narrative.classList.toggle('visible',!!shot.copy);
 intertitle.textContent=shot.title||'';
 intertitle.classList.toggle('visible',!!shot.title);
 finalTitle.classList.toggle('visible',!!shot.final);
 artifact.innerHTML=artifactFor(shot.ui);
 counter.textContent=shot.title||shot.final?'':String(index+1).padStart(2,'0')+' / '+String(shots.length).padStart(2,'0');
 cutFlash.style.opacity='0';
 if(withCue)cue(shot.sfx);
}
function draw(force=false,withCue=false){
 seek.value=String(position);
 seek.setAttribute('aria-valuetext',format(position)+' / '+format(duration));
 $('player-time').textContent=format(position);
 let index=shots.length-1;
 for(let i=0;i<shots.length;i++)if(position<shots[i].start+shots[i].d){index=i;break}
 const shot=shots[index],elapsed=Math.max(0,position-shot.start);
 if(index!==shown||force)renderShot(index,elapsed,withCue);
 const captionOn=elapsed>=.28&&elapsed<shot.d-.38;
 narrative.classList.toggle('visible',!!shot.copy&&captionOn);
 intertitle.classList.toggle('visible',!!shot.title&&elapsed>=.2);
 finalTitle.classList.toggle('visible',!!shot.final&&elapsed>.36);
 artifact.style.opacity=elapsed>.2&&elapsed<shot.d-.28?'1':'0';
 cutFlash.style.opacity=softFx?'0':shot.sfx==='camera'&&elapsed<.09?String(.22*(1-elapsed/.09)):'0';
 const fadeIn=Math.min(1,position/2.5),fadeOut=Math.min(1,(duration-position)/3.7);
 audio.volume=Math.max(0,Math.min(.58,.58*fadeIn*fadeOut));
}
function pause(){
 if(raf)cancelAnimationFrame(raf);
 raf=0;playing=false;stage.classList.remove('is-playing');
 audio.pause();stopCues();
 $('btn-pause').textContent='▶';$('btn-pause').setAttribute('aria-label','Tiếp tục phát');
}
function finish(){
 pause();position=duration;end.hidden=false;start.hidden=true;player.hidden=true;hud.hidden=true;
 narrative.classList.remove('visible');intertitle.classList.remove('visible');artifact.replaceChildren();
 $('btn-replay').focus({preventScroll:true});
}
function tick(t){
 if(!playing)return;
 const dt=Math.min(.15,Math.max(0,(t-last)/1000));last=t;
 let next=Math.min(duration,position+dt);
 if(audio.readyState>=2&&!audio.paused&&!audio.ended&&Number.isFinite(audio.currentTime)&&Math.abs(audio.currentTime-next)<.6)
  next=Math.max(next,audio.currentTime);
 const old=shown;position=next;draw(false,false);
 if(shown!==old&&dt<.25)cue(shots[shown].sfx);
 if(position>=duration){finish();return}
 raf=requestAnimationFrame(tick);
}
function play(){
 if(playing)return;
 playing=true;stage.classList.add('is-playing');last=performance.now();
 try{audio.currentTime=position}catch(_){}
 audio.muted=muted;
 const p=audio.play();if(p&&p.catch)p.catch(()=>{});
 $('btn-pause').textContent='Ⅱ';$('btn-pause').setAttribute('aria-label','Tạm dừng');
 raf=requestAnimationFrame(tick);
}
function begin(){
 pause();start.hidden=true;end.hidden=true;hud.hidden=false;player.hidden=false;
 position=0;shown=-1;draw(true,false);play();cue(shots[0].sfx);
 $('btn-pause').focus({preventScroll:true});
}
$('btn-play').addEventListener('click',begin);
$('btn-replay').addEventListener('click',begin);
$('btn-skip').addEventListener('click',finish);
$('btn-pause').addEventListener('click',()=>playing?pause():play());
$('btn-mute').addEventListener('click',()=>{
 muted=!muted;audio.muted=muted;if(muted)stopCues();
 $('btn-mute').textContent=muted?'Âm thanh: Tắt':'Âm thanh: Bật';
 $('btn-mute').setAttribute('aria-pressed',String(muted));
 $('btn-mute').setAttribute('aria-label',muted?'Bật tiếng':'Tắt tiếng')
});
fxBtn.addEventListener('click',()=>{softFx=!softFx;updateFX();draw(true,false)});
function jump(to){
 position=Math.max(0,Math.min(duration,to));stopCues();
 try{audio.currentTime=position}catch(_){}
 draw(true,false);if(position>=duration)finish();
}
seek.addEventListener('input',()=>jump(Number(seek.value)));
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause()});
document.addEventListener('keydown',e=>{
 if(player.hidden)return;
 if(e.key==='Escape')finish();
 else if(e.key===' '||e.key==='k'||e.key==='K'){e.preventDefault&&e.preventDefault();playing?pause():play()}
 else if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault&&e.preventDefault();jump(position+(e.key==='ArrowRight'?5:-5))}
 else if(e.key==='m'||e.key==='M')$('btn-mute').click()
});
if(share&&typeof navigator!=='undefined'&&(navigator.share||navigator.clipboard)){
 share.hidden=false;share.addEventListener('click',async()=>{
  const url=location.href.split('#')[0];
  try{
   if(navigator.share)await navigator.share({title:'Lời Nguyền Rừng Thiêng',url});
   else{await navigator.clipboard.writeText(url);share.textContent='Đã chép liên kết'}
  }catch(_){}
 })
}
})();