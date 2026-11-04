(() => {
'use strict';
const $=id=>document.getElementById(id);
// Thứ tự cảnh, lời dẫn và ảnh của trailer gốc trên GitHub.
const shots=[
 {d:1.6,bg:'01',motion:'out',caps:[]},
 {d:6.5,bg:'01',motion:'in',caps:[[.6,'Tháng Ba, năm 2026.','small'],[2.6,'Năm người bạn lên Đồng Chay để ghi lại một truyền thuyết.','']]},
 {d:6.5,bg:'09',motion:'pan',caps:[[.4,'Biệt thự Vân Hòa.','big'],[2.8,'Bị bỏ hoang từ năm 1988.','small']]},
 {d:5.5,bg:'11',motion:'in',caps:[[.6,'Không ai trong làng dám nhắc tên nó.','']]},
 {d:5,bg:'12',motion:'in',flash:true,caps:[[.5,'Và cánh cổng vừa khép lại sau lưng họ.','red']]},
 {d:6,faces:true,bg:'11',motion:'out',caps:[[.5,'Năm người. Một đêm. Một bí mật.','small']]},
 {d:5.5,bg:'16',motion:'in',tone:'red',caps:[[.5,'Trong bóng tối, có một đứa trẻ vẫn đang chờ.','red']]},
 {d:2.2,bg:'13',motion:'in',caps:[[.2,'KHÁM PHÁ','big']]},
 {d:2.2,bg:'20',motion:'in',caps:[[.2,'GIẢI MÃ','big']]},
 {d:2.2,bg:'27',motion:'in',caps:[[.2,'TÌM SỰ THẬT','big']]},
 {d:2.4,bg:'21',motion:'in',tone:'red shake',flash:true,caps:[[.2,'SỐNG SÓT','big red glitch']]},
 {d:6,bg:'29',motion:'pan',caps:[[.5,'Năm nấm mộ. Năm cái tên bị xóa.','']]},
 {d:5.5,bg:'32',motion:'in',tone:'red',caps:[[.5,'Sự thật nằm dưới lòng đất.','red']]},
 {d:1.2,bg:'32',motion:'in',tone:'red shake',flash:true,caps:[]},
 {d:5.5,bg:'33',motion:'out',caps:[[.8,'Họ không muốn bị lãng quên.','']]}
];
const faces=[['01_Dong','ĐÔNG'],['02_Nam','NAM'],['03_Tuyet','TUYẾT'],['04_Anh','ÁNH'],['05_Nguyet','NGUYỆT']];
const bg=id=>`assets/background/BG${id}.webp`;
let duration=0;shots.forEach(shot=>{shot.start=duration;duration+=shot.d});
const stage=$('stage'),startCard=$('start'),endCard=$('end'),player=$('player'),hud=$('hud'),audio=$('audio'),seek=$('seek'),caps=$('caps'),layers=[...document.querySelectorAll('.shot')];
let playing=false,position=0,last=0,frame=0,shown=-1,front=0,muted=false,capNodes=[],faceNodes=[],transition=0;
const time=s=>`${String(Math.floor(s/60)).padStart(2,'0')}:${String(Math.floor(s%60)).padStart(2,'0')}`;
seek.max=String(duration);$('player-duration').textContent=time(duration);
function setShot(index,elapsed){
 shown=index;const shot=shots[index],next=1-front,layer=layers[next],image=layer.firstElementChild;
 layer.className='shot '+(shot.tone||'');image.className='bg '+shot.motion;
 image.style.backgroundImage=`url("${bg(shot.bg)}")`;image.style.setProperty('--d',(shot.d+1.2)+'s');image.style.setProperty('--elapsed',-Math.max(0,elapsed)+'s');
 const prior=front;front=next;const ticket=++transition;
 requestAnimationFrame(()=>{if(ticket!==transition)return;layers[prior].classList.remove('on');layer.classList.add('on')});
 caps.replaceChildren();capNodes=[];faceNodes=[];
 for(const [at,text,cls] of shot.caps){const el=document.createElement('div');el.className='cap '+cls;el.textContent=text;el.setAttribute('aria-hidden','true');caps.appendChild(el);capNodes.push({el,at,visible:false})}
 if(shot.faces){
  const row=document.createElement('div');row.className='faces';caps.appendChild(row);
  faces.forEach(([file,name],i)=>{const person=document.createElement('div');person.className='face';person.setAttribute('aria-hidden','true');const img=document.createElement('img');img.src=`assets/portraits/${file}_portrait.webp`;img.alt='';const label=document.createElement('span');label.textContent=name;person.append(img,label);row.appendChild(person);faceNodes.push({el:person,at:.5+i*.65,visible:false})});
 }
}
function draw(force=false){
 seek.value=String(position);seek.setAttribute('aria-valuetext',`${time(position)} trên ${time(duration)}`);$('player-time').textContent=time(position);
 audio.volume=Math.max(0,Math.min(.6,position/2.5*.6,(duration-position)/4*.6));
 let index=shots.length-1;for(let i=0;i<shots.length;i++){if(position<shots[i].start+shots[i].d){index=i;break}}
 const local=Math.max(0,position-shots[index].start);
 if(index!==shown||force)setShot(index,local);
 $('flash').style.opacity=shots[index].flash&&local<.5?String((1-local/.5)*.6):'0';
 const leaving=local>shots[index].d-.7;
 for(const node of [...capNodes,...faceNodes]){const visible=local>=node.at&&!leaving;if(visible===node.visible)continue;node.visible=visible;node.el.classList.toggle('show',visible);node.el.setAttribute('aria-hidden',String(!visible))}
}
function pause(){if(!playing)return;playing=false;cancelAnimationFrame(frame);audio.pause();$('btn-pause').textContent='▶';$('btn-pause').setAttribute('aria-label','Tiếp tục phát');stage.classList.remove('playing')}
function tick(now){if(!playing)return;position=Math.min(duration,position+(now-last)/1000);last=now;draw();if(position>=duration){finish();return}frame=requestAnimationFrame(tick)}
function syncAudio(){try{audio.currentTime=position}catch(_){}audio.muted=muted}
function resume(){if(playing)return;playing=true;last=performance.now();$('btn-pause').textContent='Ⅱ';$('btn-pause').setAttribute('aria-label','Tạm dừng');stage.classList.add('playing');syncAudio();const p=audio.play();if(p&&p.catch)p.catch(()=>{});frame=requestAnimationFrame(tick)}
function start(){startCard.hidden=true;endCard.hidden=true;player.hidden=false;hud.hidden=false;position=0;shown=-1;draw();resume();$('btn-pause').focus({preventScroll:true})}
function finish(){pause();position=duration;player.hidden=true;hud.hidden=true;caps.replaceChildren();capNodes=[];faceNodes=[];endCard.hidden=false;$('flash').style.opacity='0';$('btn-replay').focus({preventScroll:true})}
$('btn-play').addEventListener('click',start);$('btn-replay').addEventListener('click',start);$('btn-skip').addEventListener('click',finish);
$('btn-pause').addEventListener('click',()=>playing?pause():resume());
$('btn-mute').addEventListener('click',()=>{muted=!muted;audio.muted=muted;$('btn-mute').textContent=muted?'🔇':'🔊';$('btn-mute').setAttribute('aria-label',muted?'Bật tiếng':'Tắt tiếng');$('btn-mute').setAttribute('aria-pressed',String(muted))});
seek.addEventListener('input',()=>{position=Math.max(0,Math.min(duration,Number(seek.value)));syncAudio();draw(true);if(position>=duration)finish()});
audio.addEventListener('loadedmetadata',()=>{if(!player.hidden)syncAudio()});
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!player.hidden)finish()});
[...new Set(shots.map(s=>bg(s.bg)))].forEach(src=>{const img=new Image();img.src=src});
})();
