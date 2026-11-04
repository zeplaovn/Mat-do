(() => {
'use strict';
const $=id=>document.getElementById(id);
// Thứ tự cảnh, lời dẫn và ảnh của trailer gốc trên GitHub.
const shots=[
 {d:1.6,bg:'01',motion:'out',caps:[]},
 {d:6.5,bg:'01',loc:'ĐỒNG CHAY · THÁNG 3, 2026',tone:'cold',o:'30% 62%',motion:'in',caps:[[.6,'Tháng Ba, năm 2026.','small'],[2.6,'Năm người bạn lên Đồng Chay để ghi lại một truyền thuyết.','']]},
 {d:6.5,bg:'09',loc:'BIỆT THỰ VÂN HÒA · SÂN NHÀ',tone:'cold',motion:'pan',caps:[[.4,'Biệt thự Vân Hòa.','big'],[2.8,'Bị bỏ hoang từ năm 1988.','small']]},
 {d:5.5,bg:'11',loc:'ĐẠI SẢNH',tone:'cold',o:'50% 70%',motion:'in',caps:[[.6,'Không ai trong làng dám nhắc tên nó.','']]},
 {d:5,bg:'12',loc:'PHÒNG THỜ',tone:'cold',o:'60% 40%',motion:'in',flash:true,caps:[[.5,'Và cánh cổng vừa khép lại sau lưng họ.','red']]},
 {d:6,faces:true,bg:'11',tone:'cold',motion:'out',caps:[[.5,'Năm người. Một đêm. Một bí mật.','small']]},
 {d:5.5,bg:'16',loc:'PHÒNG TRẺ',o:'45% 55%',motion:'in',tone:'red',caps:[[.5,'Trong bóng tối, có một đứa trẻ vẫn đang chờ.','red']]},
 {d:2.2,bg:'13',o:'70% 40%',motion:'in',caps:[[.2,'KHÁM PHÁ','big']]},
 {d:2.2,bg:'20',o:'30% 60%',motion:'in',caps:[[.2,'GIẢI MÃ','big']]},
 {d:2.2,bg:'27',o:'55% 35%',motion:'in',caps:[[.2,'TÌM SỰ THẬT','big']]},
 {d:2.4,bg:'21',motion:'in',tone:'red shake',flash:true,caps:[[.2,'SỐNG SÓT','big red glitch']]},
 {d:6,bg:'29',loc:'VƯỜN SAU · NĂM NẤM MỘ',motion:'pan',caps:[[.5,'Năm nấm mộ. Năm cái tên bị xóa.','']]},
 {d:5.5,bg:'32',loc:'HẦM DƯỚI BIỆT THỰ',o:'50% 60%',motion:'in',tone:'red',caps:[[.5,'Sự thật nằm dưới lòng đất.','red']]},
 {d:1.2,bg:'32',motion:'in',tone:'red shake',flash:true,caps:[]},
 {d:5.5,bg:'33',o:'50% 45%',motion:'out',caps:[[.8,'Họ không muốn bị lãng quên.','']]}
];
const faces=[['01_Dong','ĐÔNG'],['02_Nam','NAM'],['03_Tuyet','TUYẾT'],['04_Anh','ÁNH'],['05_Nguyet','NGUYỆT']];
const bg=id=>`assets/background/BG${id}.webp`;
let duration=0;shots.forEach(shot=>{shot.start=duration;duration+=shot.d});
const stage=$('stage'),startCard=$('start'),endCard=$('end'),player=$('player'),hud=$('hud'),audio=$('audio'),seek=$('seek'),caps=$('caps'),layers=[...document.querySelectorAll('.shot')];
const slate=$('slate'),streak=$('streak'),dust=$('dust'),loadStatus=$('load-status'),shareBtn=$('btn-share');
let playing=false,position=0,last=0,frame=0,shown=-1,front=0,muted=false,capNodes=[],faceNodes=[],transition=0,slateNode=null;
const time=s=>`${String(Math.floor(s/60)).padStart(2,'0')}:${String(Math.floor(s%60)).padStart(2,'0')}`;
seek.max=String(duration);$('player-duration').textContent=time(duration);
function setShot(index,elapsed){
 shown=index;const shot=shots[index],next=1-front,layer=layers[next],image=layer.firstElementChild;
 layer.className='shot '+(shot.tone||'');image.className='bg '+shot.motion;
 image.style.backgroundImage=`url("${bg(shot.bg)}")`;image.style.transformOrigin=shot.o||'50% 50%';image.style.setProperty('--d',(shot.d+1.2)+'s');image.style.setProperty('--elapsed',-Math.max(0,elapsed)+'s');
 const prior=front;front=next;const ticket=++transition;
 requestAnimationFrame(()=>{if(ticket!==transition)return;layers[prior].classList.remove('on');layer.classList.add('on')});
 caps.replaceChildren();capNodes=[];faceNodes=[];
 if(slate){slate.replaceChildren();slateNode=null;if(shot.loc){const el=document.createElement('div');el.className='slate-in';el.textContent=shot.loc;el.setAttribute('aria-hidden','true');slate.appendChild(el);slateNode=el}}
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
 if(slateNode){const on=local>=1&&!leaving;if(on!==slateNode.classList.contains('show'))slateNode.classList.toggle('show',on)}
 if(streak)streak.style.opacity=shots[index].flash&&local<.9?String(Math.max(0,1-local/.9)*.5):'0';
 for(const node of [...capNodes,...faceNodes]){const visible=local>=node.at&&!leaving;if(visible===node.visible)continue;node.visible=visible;node.el.classList.toggle('show',visible);node.el.setAttribute('aria-hidden',String(!visible))}
}
/* Bụi và tàn tro bay chậm: nhẹ, tự giảm số hạt trên điện thoại, tắt khi giảm chuyển động. */
const dctx=dust&&dust.getContext?dust.getContext('2d'):null,noMotion=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
let motes=[],dw=0,dh=0;
function sizeDust(){if(!dctx)return;dw=dust.width=Math.max(1,Math.round(stage.clientWidth||1280));dh=dust.height=Math.max(1,Math.round(stage.clientHeight||720));const n=dw<700?16:38;motes=Array.from({length:n},()=>({x:Math.random()*dw,y:Math.random()*dh,r:.5+Math.random()*1.7,v:6+Math.random()*16,dx:(Math.random()-.5)*10,a:.12+Math.random()*.38,ph:Math.random()*6.3}))}
function stepDust(dt){if(!dctx||noMotion)return;dctx.clearRect(0,0,dw,dh);for(const m of motes){m.y-=m.v*dt;m.x+=(m.dx+Math.sin(m.ph+=dt*.8)*6)*dt;if(m.y<-4){m.y=dh+4;m.x=Math.random()*dw}if(m.x<-4)m.x=dw+4;if(m.x>dw+4)m.x=-4;dctx.globalAlpha=m.a*(.6+.4*Math.sin(m.ph*1.7));dctx.fillStyle='#e8c89a';dctx.beginPath();dctx.arc(m.x,m.y,m.r,0,6.283);dctx.fill()}dctx.globalAlpha=1}
if(typeof addEventListener==='function')addEventListener('resize',sizeDust);
function pause(){if(!playing)return;playing=false;cancelAnimationFrame(frame);audio.pause();$('btn-pause').textContent='▶';$('btn-pause').setAttribute('aria-label','Tiếp tục phát');stage.classList.remove('playing')}
function tick(now){if(!playing)return;const dt=Math.min(.1,(now-last)/1000);position=Math.min(duration,position+(now-last)/1000);last=now;stepDust(dt);draw();if(position>=duration){finish();return}frame=requestAnimationFrame(tick)}
function syncAudio(){try{audio.currentTime=position}catch(_){}audio.muted=muted}
function resume(){if(playing)return;playing=true;last=performance.now();$('btn-pause').textContent='Ⅱ';$('btn-pause').setAttribute('aria-label','Tạm dừng');stage.classList.add('playing');syncAudio();const p=audio.play();if(p&&p.catch)p.catch(()=>{});frame=requestAnimationFrame(tick)}
function start(){stage.classList.remove('cine');void stage.offsetWidth;stage.classList.add('cine');sizeDust();startCard.hidden=true;endCard.hidden=true;player.hidden=false;hud.hidden=false;position=0;shown=-1;draw();resume();$('btn-pause').focus({preventScroll:true})}
function finish(){stage.classList.remove('cine');if(slate){slate.replaceChildren();slateNode=null}if(streak)streak.style.opacity='0';if(dctx)dctx.clearRect(0,0,dw,dh);pause();position=duration;player.hidden=true;hud.hidden=true;caps.replaceChildren();capNodes=[];faceNodes=[];endCard.hidden=false;$('flash').style.opacity='0';$('btn-replay').focus({preventScroll:true})}
$('btn-play').addEventListener('click',start);$('btn-replay').addEventListener('click',start);$('btn-skip').addEventListener('click',finish);
$('btn-pause').addEventListener('click',()=>playing?pause():resume());
$('btn-mute').addEventListener('click',()=>{muted=!muted;audio.muted=muted;$('btn-mute').textContent=muted?'🔇':'🔊';$('btn-mute').setAttribute('aria-label',muted?'Bật tiếng':'Tắt tiếng');$('btn-mute').setAttribute('aria-pressed',String(muted))});
seek.addEventListener('input',()=>{position=Math.max(0,Math.min(duration,Number(seek.value)));syncAudio();draw(true);if(position>=duration)finish()});
audio.addEventListener('loadedmetadata',()=>{if(!player.hidden)syncAudio()});
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause()});
document.addEventListener('keydown',e=>{
 if(player.hidden)return;
 if(e.key==='Escape')finish();
 else if(e.key===' '||e.key==='k'||e.key==='K'){e.preventDefault&&e.preventDefault();playing?pause():resume()}
 else if(e.key==='m'||e.key==='M'){const mb=$('btn-mute');if(mb&&mb.click)mb.click()}
 else if(e.key==='ArrowRight'||e.key==='ArrowLeft'){position=Math.max(0,Math.min(duration,position+(e.key==='ArrowRight'?5:-5)));syncAudio();draw(true);if(position>=duration)finish()}
});
const assets=[...new Set(shots.map(s=>bg(s.bg))),...faces.map(f=>`assets/portraits/${f[0]}_portrait.webp`),'assets/logo.webp'];
let loaded=0,ready=false;const playBtn=$('btn-play');
function markReady(){if(ready)return;ready=true;if(playBtn)playBtn.disabled=false;if(loadStatus)loadStatus.textContent=''}
function bump(){loaded++;if(loadStatus&&!ready)loadStatus.textContent=`Đang tải cảnh phim ${Math.round(loaded/assets.length*100)}%`;if(loaded>=assets.length)markReady()}
if(playBtn&&typeof setTimeout==='function'){playBtn.disabled=true;setTimeout(markReady,9000)}
assets.forEach(src=>{const img=new Image();img.onload=img.onerror=bump;img.src=src;if(img.decode)img.decode().catch(()=>{})});
if(audio&&audio.load)audio.preload='auto';
if(shareBtn&&typeof navigator!=='undefined'&&(navigator.share||navigator.clipboard)){shareBtn.hidden=false;shareBtn.addEventListener('click',async()=>{const url=location.href.split('#')[0],data={title:'Lời Nguyền Rừng Thiêng',text:'Năm người bạn, một đêm, một bí mật trong biệt thự Vân Hòa.',url};try{if(navigator.share)await navigator.share(data);else{await navigator.clipboard.writeText(url);shareBtn.textContent='✓ Đã chép liên kết'}}catch(_){}})}
})();
