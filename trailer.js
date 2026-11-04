(() => {
'use strict';
const $ = id => document.getElementById(id);
// Trình phát độc lập: không đọc hoặc ghi bản lưu của trò chơi.
const shots = [
  {d:7, bg:'01', motion:'in', caps:[[.3,'Tháng Ba, năm 2026.','small'],[2.4,'Năm người bạn lên Đồng Chay để ghi lại một truyền thuyết.','']]},
  {d:6, bg:'09', motion:'pan', caps:[[.3,'BIỆT THỰ VÂN HÒA','big'],[2.4,'Bị bỏ hoang từ năm 1988.','small']]},
  {d:5, bg:'11', motion:'in', caps:[[.5,'Không ai trong làng dám nhắc tên nó.','']]},
  {d:5, bg:'12', motion:'out', tone:'red', flash:true, caps:[[.4,'Và cánh cổng vừa khép lại sau lưng họ.','red']]},
  {d:7, bg:'11', motion:'pan', faces:true, caps:[[.3,'Năm người. Một đêm. Một bí mật.','small']]},
  {d:6, bg:'16', motion:'in', tone:'red', caps:[[.5,'Trong bóng tối, có một đứa trẻ vẫn đang chờ.','red']]},
  {d:2.2, bg:'13', motion:'in', caps:[[.1,'KHÁM PHÁ','big']]},
  {d:2.2, bg:'19', motion:'pan', caps:[[.1,'GIẢI MÃ','big']]},
  {d:2.2, bg:'23', motion:'in', caps:[[.1,'TÌM SỰ THẬT','big']]},
  {d:2.4, bg:'21', motion:'out', tone:'red', flash:true, caps:[[.1,'SỐNG SÓT','big red']]},
  {d:6, bg:'29', motion:'pan', caps:[[.4,'Năm nấm mộ. Năm cái tên bị xóa.','']]},
  {d:5.5, bg:'32', motion:'in', tone:'red', flash:true, caps:[[.4,'Sự thật nằm dưới lòng đất.','red']]},
  {d:6, bg:'33', motion:'out', caps:[[.6,'Họ không muốn bị lãng quên.','']]},
  {d:7.5, bg:'40', motion:'pan', caps:[[.4,'MỘT HÀNH TRÌNH · NHIỀU LỰA CHỌN','small'],[2.4,'Bạn sẽ tìm đến sự thật nào?','']]}
];
const faces = [['01_Dong','ĐÔNG'],['02_Nam','NAM'],['03_Tuyet','TUYẾT'],['04_Anh','ÁNH'],['05_Nguyet','NGUYỆT']];
const trailerArt=new Set(['11','16','19','23','29','40']);
const imageFor=id=>`assets/${trailerArt.has(id)?'trailer':'background'}/BG${id}.webp`;
let duration=0;shots.forEach(shot=>{shot.start=duration;duration+=shot.d});
const film=$('film'),poster=$('poster'),screen=$('screen'),end=$('end-card'),player=$('player'),audio=$('film-audio'),seek=$('seek');
const layers=[...document.querySelectorAll('.shot-layer')],captionBox=$('captions');
let playing=false,position=0,last=0,frame=0,shown=-1,front=0,muted=false,capNodes=[],faceNodes=[],transition=0;
const time=s=>`${String(Math.floor(s/60)).padStart(2,'0')}:${String(Math.floor(s%60)).padStart(2,'0')}`;
seek.max=String(duration);$('player-duration').textContent=time(duration);$('poster-duration').textContent=time(duration);
function setShot(index, elapsed){
  shown=index;const shot=shots[index],next=1-front,layer=layers[next],image=layer.firstElementChild;
  layer.classList.remove('is-visible');layer.classList.toggle('red',shot.tone==='red');
  image.style.backgroundImage=`url("${imageFor(shot.bg)}")`;
  image.dataset.motion=shot.motion;image.style.setProperty('--shot-duration',shot.d+'s');image.style.setProperty('--elapsed',-Math.max(0,elapsed)+'s');
  image.style.animation='none';void image.offsetWidth;image.style.animation='';
  const prior=front;front=next;const ticket=++transition;
  requestAnimationFrame(()=>{if(ticket!==transition)return;layers[prior].classList.remove('is-visible');layer.classList.add('is-visible')});
  captionBox.replaceChildren();capNodes=[];faceNodes=[];
  for(const [at,text,cls] of shot.caps){const el=document.createElement('p');el.className='caption '+cls;el.textContent=text;el.setAttribute('aria-hidden','true');captionBox.appendChild(el);capNodes.push({el,at,visible:false})}
  if(shot.faces){
    const row=document.createElement('div');row.className='faces';captionBox.appendChild(row);
    faces.forEach(([file,name],i)=>{const person=document.createElement('div');person.className='face';person.setAttribute('aria-hidden','true');const img=document.createElement('img');img.src=`assets/portraits/${file}_portrait.webp`;img.alt='';const label=document.createElement('span');label.textContent=name;person.append(img,label);row.appendChild(person);faceNodes.push({el:person,at:.7+i*.5,visible:false})});
  }
}
function draw(force=false){
  seek.value=String(position);seek.setAttribute('aria-valuetext',`${time(position)} trên ${time(duration)}`);$('player-time').textContent=time(position);
  audio.volume=Math.max(0,Math.min(.65,position/2*.65,(duration-position)/3*.65));
  let index=shots.length-1;for(let i=0;i<shots.length;i++){if(position<shots[i].start+shots[i].d){index=i;break}}
  const local=Math.max(0,position-shots[index].start);
  $('film-flash').style.opacity=shots[index].flash&&local<.9?String(Math.sin(Math.PI*local/.9)*.28):'0';
  if(index!==shown||force)setShot(index,local);
  const leaving=local>shots[index].d-.55;
  for(const node of [...capNodes,...faceNodes]){const visible=local>=node.at&&!leaving;if(visible===node.visible)continue;node.visible=visible;node.el.classList.toggle('show',visible);node.el.setAttribute('aria-hidden',String(!visible))}
}
function pause(){if(!playing)return;playing=false;cancelAnimationFrame(frame);audio.pause();$('toggle-play').textContent='▶';$('toggle-play').setAttribute('aria-label','Tiếp tục phát');film.classList.remove('is-playing')}
function tick(now){if(!playing)return;position=Math.min(duration,position+(now-last)/1000);last=now;draw();if(position>=duration){finish();return}frame=requestAnimationFrame(tick)}
function syncAudio(){try{audio.currentTime=position}catch(_){}audio.muted=muted}
function resume(){if(playing)return;if(position>=duration)position=0;playing=true;last=performance.now();$('toggle-play').textContent='Ⅱ';$('toggle-play').setAttribute('aria-label','Tạm dừng');film.classList.add('is-playing');syncAudio();audio.play().catch(()=>{});frame=requestAnimationFrame(tick)}
function start(){poster.hidden=true;end.hidden=true;screen.hidden=false;player.hidden=false;position=0;shown=-1;draw();resume();$('toggle-play').focus({preventScroll:true})}
function finish(){pause();position=duration;screen.hidden=true;player.hidden=true;end.hidden=false;film.classList.add('is-ended');$('replay-film').focus({preventScroll:true})}
$('start-film').addEventListener('click',()=>{film.classList.remove('is-ended');start()});
$('replay-film').addEventListener('click',()=>{film.classList.remove('is-ended');start()});
$('skip-film').addEventListener('click',finish);
$('toggle-play').addEventListener('click',()=>playing?pause():resume());
$('toggle-mute').addEventListener('click',()=>{muted=!muted;audio.muted=muted;$('toggle-mute').textContent=muted?'ĐÃ TẮT TIẾNG':'ÂM THANH';$('toggle-mute').setAttribute('aria-label',muted?'Bật tiếng':'Tắt tiếng');$('toggle-mute').setAttribute('aria-pressed',String(muted))});
seek.addEventListener('input',()=>{position=Math.max(0,Math.min(duration,Number(seek.value)));syncAudio();draw(true);if(position>=duration)finish()});
audio.addEventListener('loadedmetadata',()=>{if(!screen.hidden)syncAudio()});
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!screen.hidden)finish()});
// Chuẩn bị ảnh trước để chuyển cảnh không chớp trắng khi mạng chậm.
[...new Set(shots.map(s=>imageFor(s.bg)))].forEach(src=>{const img=new Image();img.src=src});
})();
