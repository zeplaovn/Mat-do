(() => {
'use strict';
const $=id=>document.getElementById(id);
// Thứ tự cảnh, lời dẫn và ảnh của trailer gốc trên GitHub.
const shots=[
 {d:1.6,bg:'01',motion:'out',caps:[]},
 {d:6.5,bg:'01',loc:'ĐỒNG CHAY · THÁNG 3, 2026',tone:'cold',o:'30% 62%',motion:'in',caps:[[.6,'Tháng Ba, năm 2026.','small'],[2.6,'Năm người bạn lên Đồng Chay để ghi lại một truyền thuyết.','']]},
 {d:6.5,bg:'09',loc:'BIỆT THỰ VÂN HÒA · SÂN NHÀ',tone:'cold',motion:'pan',caps:[[.4,'Biệt thự Vân Hòa.','big'],[2.8,'Bị bỏ hoang từ năm 1988.','small']]},
 {d:5.5,bg:'11',loc:'ĐẠI SẢNH',tone:'cold',o:'50% 70%',tr:'dip',motion:'in',caps:[[.6,'Không ai trong làng dám nhắc tên nó.','']]},
 {d:5,bg:'12',loc:'PHÒNG THỜ',tone:'cold',o:'60% 40%',tr:'flash',motion:'in',flash:true,caps:[[.5,'Và cánh cổng vừa khép lại sau lưng họ.','red']]},
 {d:6,faces:true,bg:'11',tone:'cold',tr:'whip',motion:'out',caps:[[.5,'Năm người. Một đêm. Một bí mật.','small']]},
 {d:5.5,bg:'16',loc:'PHÒNG TRẺ',o:'45% 55%',tr:'glitch',motion:'in',tone:'red',caps:[[.5,'Trong bóng tối, có một đứa trẻ vẫn đang chờ.','red']]},
 {d:1.88,bg:'16',tone:'dread',scare:true,o:'50% 58%',tr:'dip',motion:'in',caps:[[.25,'Đừng trả lời khi bóng tối gọi tên bạn.','red small']]},
 {d:3.2,img:'gp1',pos:'72% 50%',gp:true,tr:'flash',flash:true,motion:'gp',cursor:{from:[30,18],to:[87,68],at:.5,dur:1.2,click:1.85},caps:[[.25,'KHÁM PHÁ','big']]},
 {d:3.2,img:'gp2',pos:'50% 50%',gp:true,tr:'whip',motion:'gp',cursor:{from:[78,75],to:[52.5,35.5],at:.4,dur:1,click:1.5},caps:[[.25,'GIẢI MÃ','big']]},
 {d:3.2,img:'gp3',pos:'30% 50%',gp:true,tr:'whip',motion:'gp',cursor:{from:[40,60],to:[62,92],at:.5,dur:1.1,click:1.9},caps:[[.25,'TÌM SỰ THẬT','big']]},
 {d:3.2,img:'gp4',pos:'50% 55%',gp:true,tr:'glitch',flash:true,tone:'shake',motion:'gp',scream:true,caps:[[.2,'SỐNG SÓT','big red glitch']]},
 {d:3.2,img:'gp5',pos:'30% 50%',gp:true,tr:'dip',motion:'gp',cursor:{from:[60,50],to:[90,92],at:.8,dur:1,click:2.1},caps:[[.25,'LẮNG NGHE','big']]},
 {d:6,bg:'29',loc:'VƯỜN SAU · NĂM NẤM MỘ',tr:'dip',motion:'pan',caps:[[.5,'Năm nấm mộ. Năm cái tên bị xóa.','']]},
 {d:5.5,bg:'32',loc:'HẦM DƯỚI BIỆT THỰ',o:'50% 60%',tr:'dip',motion:'in',tone:'red',caps:[[.5,'Sự thật nằm dưới lòng đất.','red']]},
 {d:1.2,bg:'32',tr:'glitch',motion:'in',tone:'red shake',flash:true,caps:[]},
 {d:5.5,bg:'33',o:'50% 45%',tr:'dip',motion:'out',caps:[[.8,'Họ không muốn bị lãng quên.','']]}
];
/* Nhịp mạnh của nhạc (phân tích từ trailer.mp3): mỗi nhịp tạo một cú giật hình + nháy sáng. Số thứ hai là độ mạnh 1-3. */
const hits=[[6.52,1],[8.12,2],[12.88,3],[19.28,1],[22.48,2],[25.68,2],[28.88,1],[32.12,2],[35.28,1],[38.48,3],[41.68,2],[44.88,2],[48.08,3],[51.3,2],[54.5,2],[57.7,2],[60.9,2],[64.1,2],[67.3,1]];
const faces=[['01_Dong','ĐÔNG'],['02_Nam','NAM'],['03_Tuyet','TUYẾT'],['04_Anh','ÁNH'],['05_Nguyet','NGUYỆT']];
const bg=id=>`assets/background/${id==='01'?'BG01-fixed':`BG${id}`}.webp`;
let duration=0;shots.forEach(shot=>{shot.start=duration;duration+=shot.d});
const stage=$('stage'),startCard=$('start'),endCard=$('end'),player=$('player'),hud=$('hud'),audio=$('audio'),seek=$('seek'),caps=$('caps'),layers=[...document.querySelectorAll('.shot')];
const cursorEl=$('cursor'),slate=$('slate'),streak=$('streak'),dust=$('dust'),loadStatus=$('load-status'),shareBtn=$('btn-share');
let playing=false,position=0,last=0,frame=0,shown=-1,front=0,muted=false,capNodes=[],faceNodes=[],transition=0,slateNode=null;
const time=s=>`${String(Math.floor(s/60)).padStart(2,'0')}:${String(Math.floor(s%60)).padStart(2,'0')}`;
seek.max=String(duration);$('player-duration').textContent=time(duration);
/* Tách chữ theo từ rồi theo ký tự để hiện lần lượt (từ mờ, nhỏ, lệch xuống sang nét). */
function splitText(el,text,cls){
 let n=0;const big=/\bbig\b/.test(cls||''),step=big?55:26;
 text.split(' ').forEach((word,wi,all)=>{
  const w=document.createElement('span');w.className='w';
  for(const ch of word){const c=document.createElement('span');c.className='c';c.textContent=ch;c.style.setProperty('--i',String(n++));c.style.setProperty('--step',step+'ms');w.appendChild(c)}
  el.appendChild(w);if(wi<all.length-1){const sp=document.createElement('span');sp.className='sp';sp.textContent=' ';el.appendChild(sp);n++}
 });
}
function setShot(index,elapsed){
 shown=index;const shot=shots[index],next=1-front,layer=layers[next],image=layer.firstElementChild;
 layer.className='shot '+(shot.tone||'')+(shot.tr?' tr-'+shot.tr:'')+(shot.gp?' gp':'');
 if(stage.classList){stage.classList.toggle('gp',!!shot.gp);stage.classList.toggle('scare',!!shot.scare)}image.className='bg '+shot.motion;
 const seed=Math.sin((index+1)*12.9898)*43758.5453,rnd=seed-Math.floor(seed);image.style.setProperty('--rot',((rnd-.5)*1.4).toFixed(2)+'deg');image.style.setProperty('--dx',((rnd-.5)*4).toFixed(2)+'%');image.style.setProperty('--dy',(((rnd*7)%1-.5)*3).toFixed(2)+'%');
 image.style.backgroundImage=`url("${shot.img?`assets/trailer/${shot.img}.webp`:bg(shot.bg)}")`;image.style.transformOrigin=shot.o||'50% 50%';image.style.backgroundPosition=shot.pos||'center';image.style.setProperty('--d',(shot.d+1.2)+'s');image.style.setProperty('--elapsed',-Math.max(0,elapsed)+'s');
 const prior=front;front=next;const ticket=++transition;
 requestAnimationFrame(()=>{if(ticket!==transition)return;layers[prior].classList.remove('on');layer.classList.add('on')});
 caps.replaceChildren();capNodes=[];faceNodes=[];
 if(slate){slate.replaceChildren();slateNode=null;if(shot.loc){const el=document.createElement('div');el.className='slate-in';el.textContent=shot.loc;el.setAttribute('aria-hidden','true');slate.appendChild(el);slateNode=el}}
 for(const [at,text,cls] of shot.caps){const el=document.createElement('div');el.className='cap '+cls;el.setAttribute('aria-hidden','true');el.setAttribute('aria-label',text);splitText(el,text,cls);caps.appendChild(el);capNodes.push({el,at,visible:false})}
 if(shot.faces){
  const row=document.createElement('div');row.className='faces';caps.appendChild(row);
  faces.forEach(([file,name],i)=>{const person=document.createElement('div');person.className='face';person.setAttribute('aria-hidden','true');const img=document.createElement('img');img.src=`assets/portraits/${file}_portrait.webp`;img.alt='';const label=document.createElement('span');label.textContent=name;person.append(img,label);row.appendChild(person);faceNodes.push({el:person,at:.5+i*.65,visible:false})});
 }
}
/* Âm thanh dọa tự tổng hợp bằng Web Audio (không cần tệp): tim đập, nhạc dâng, nổ, tiếng rít. */
let actx=null,master=null;
function sfxInit(){
 if(actx){if(actx.resume)actx.resume();return}
 const AC=typeof AudioContext!=='undefined'?AudioContext:(typeof webkitAudioContext!=='undefined'?webkitAudioContext:null);
 if(!AC)return;
 try{actx=new AC();master=actx.createGain();master.gain.value=.8;master.connect(actx.destination)}catch(_){actx=null}
}
function noiseBuf(sec){const n=Math.floor(actx.sampleRate*sec),b=actx.createBuffer(1,n,actx.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;return b}
function envOsc(type,f0,f1,dur,peak,when=0){const o=actx.createOscillator(),g=actx.createGain(),t=actx.currentTime+when;o.type=type;o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(Math.max(1,f1),t+dur);g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+.02);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);o.connect(g);g.connect(master);o.start(t);o.stop(t+dur+.05)}
const sfx={
 heart(k){envOsc('sine',72,40,.2,.95*k);envOsc('sine',64,36,.2,.6*k,.15)},
 boom(k){envOsc('sine',95,28,1.1,1*k);const src=actx.createBufferSource(),f=actx.createBiquadFilter(),g=actx.createGain(),t=actx.currentTime;src.buffer=noiseBuf(.9);f.type='lowpass';f.frequency.setValueAtTime(2400,t);f.frequency.exponentialRampToValueAtTime(120,t+.8);g.gain.setValueAtTime(.55*k,t);g.gain.exponentialRampToValueAtTime(.001,t+.85);src.connect(f);f.connect(g);g.connect(master);src.start(t)},
 screech(){envOsc('sawtooth',2100,380,.7,.22);envOsc('square',1500,260,.6,.1,.04)},
 riser(dur){const src=actx.createBufferSource(),f=actx.createBiquadFilter(),g=actx.createGain(),t=actx.currentTime;src.buffer=noiseBuf(dur+.2);f.type='bandpass';f.Q.value=2.5;f.frequency.setValueAtTime(180,t);f.frequency.exponentialRampToValueAtTime(3800,t+dur);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.5,t+dur);g.gain.linearRampToValueAtTime(.0001,t+dur+.1);src.connect(f);f.connect(g);g.connect(master);src.start(t)}
};
const cues=[[35.95,()=>sfx.riser(2.5)],[36.15,()=>sfx.heart(.7)],[36.6,()=>sfx.heart(.75)],[37.0,()=>sfx.heart(.85)],[37.35,()=>sfx.heart(.9)],[37.65,()=>sfx.heart(1)],[37.9,()=>sfx.heart(1)],[38.12,()=>sfx.heart(1)],[38.3,()=>sfx.heart(1)],[38.48,()=>sfx.boom(1)],[48.08,()=>{sfx.boom(1);sfx.screech()}]];
function playCues(from,to){if(!actx||muted)return;for(const [t,fn] of cues)if(t>from&&t<=to){try{fn()}catch(_){}}}
let lastPos=0,punchTimer=0;
function punch(power){
 if(stage.classList){stage.classList.remove('punch1','punch2','punch3');void stage.offsetWidth;stage.classList.add('punch'+power)}
 const f=$('flash');if(f&&!(shots[shown]&&shots[shown].flash&&position-shots[shown].start<.5))f.style.opacity=String(.04+power*.05);
 if(typeof setTimeout==='function'){clearTimeout(punchTimer);punchTimer=setTimeout(()=>{if(stage.classList)stage.classList.remove('punch1','punch2','punch3')},520)}
}
function beat(){
 if(position>lastPos&&position-lastPos<.3)for(const [t,power] of hits)if(t>lastPos&&t<=position){punch(power);break}
 if(!(position>lastPos&&position-lastPos<.3))lastPos=position;
 playCues(lastPos,position);
 lastPos=position;
}
function draw(force=false){
 seek.value=String(position);seek.setAttribute('aria-valuetext',`${time(position)} trên ${time(duration)}`);$('player-time').textContent=time(position);
 const duck=position>=35.9&&position<38.46?(position<36.3?1-(position-35.9)/.4*.9:.1):1;
 audio.volume=Math.max(0,Math.min(.6,position/2.5*.6,(duration-position)/4*.6))*duck;
 let index=shots.length-1;for(let i=0;i<shots.length;i++){if(position<shots[i].start+shots[i].d){index=i;break}}
 const local=Math.max(0,position-shots[index].start);
 if(index!==shown||force)setShot(index,local);
 $('flash').style.opacity=shots[index].flash&&local<.5?String((1-local/.5)*.6):$('flash').style.opacity>.001&&!force&&position-lastPos<.3?String(Math.max(0,$("flash").style.opacity-(position-lastPos)*.55)):'0';
 beat();
 const leaving=local>shots[index].d-.7;
 const sh=shots[index];
 if(cursorEl){const c=sh.cursor,show=c&&local>=c.at-.15&&local<sh.d-.35;if(show){const t=Math.min(1,Math.max(0,(local-c.at)/c.dur)),e=t*t*(3-2*t);cursorEl.style.left=(c.from[0]+(c.to[0]-c.from[0])*e)+'%';cursorEl.style.top=(c.from[1]+(c.to[1]-c.from[1])*e)+'%';cursorEl.style.opacity='1';const clicking=local>=c.click&&local<c.click+.45;if(cursorEl.classList.contains('click')!==clicking)cursorEl.classList.toggle('click',clicking)}else cursorEl.style.opacity='0'}
 if(sh.scare){const fl=$('flash');if(local>1.58&&local<1.67){fl.style.background='#fff';fl.style.opacity='.8'}else if(local>=1.74){fl.style.background='#000';fl.style.opacity='1'}else{fl.style.background='';}}else if($('flash').style.background)$('flash').style.background='';
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
function start(){sfxInit();lastPos=0;stage.classList.remove('cine');void stage.offsetWidth;stage.classList.add('cine');sizeDust();startCard.hidden=true;endCard.hidden=true;player.hidden=false;hud.hidden=false;position=0;shown=-1;draw();resume();$('btn-pause').focus({preventScroll:true})}
function finish(){if(cursorEl)cursorEl.style.opacity='0';stage.classList.remove('cine');if(slate){slate.replaceChildren();slateNode=null}if(streak)streak.style.opacity='0';if(dctx)dctx.clearRect(0,0,dw,dh);pause();position=duration;player.hidden=true;hud.hidden=true;caps.replaceChildren();capNodes=[];faceNodes=[];endCard.hidden=false;$('flash').style.opacity='0';$('btn-replay').focus({preventScroll:true})}
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
const assets=[...new Set(shots.map(s=>s.img?`assets/trailer/${s.img}.webp`:bg(s.bg))),...faces.map(f=>`assets/portraits/${f[0]}_portrait.webp`),'assets/logo.webp'];
let loaded=0,ready=false;const playBtn=$('btn-play');
function markReady(){if(ready)return;ready=true;if(playBtn)playBtn.disabled=false;if(loadStatus)loadStatus.textContent=''}
function bump(){loaded++;if(loadStatus&&!ready)loadStatus.textContent=`Đang tải cảnh phim ${Math.round(loaded/assets.length*100)}%`;if(loaded>=assets.length)markReady()}
if(playBtn&&typeof setTimeout==='function'){playBtn.disabled=true;setTimeout(markReady,9000)}
assets.forEach(src=>{const img=new Image();img.onload=img.onerror=bump;img.src=src;if(img.decode)img.decode().catch(()=>{})});
if(audio&&audio.load)audio.preload='auto';
if(shareBtn&&typeof navigator!=='undefined'&&(navigator.share||navigator.clipboard)){shareBtn.hidden=false;shareBtn.addEventListener('click',async()=>{const url=location.href.split('#')[0],data={title:'Lời Nguyền Rừng Thiêng',text:'Năm người bạn, một đêm, một bí mật trong biệt thự Vân Hòa.',url};try{if(navigator.share)await navigator.share(data);else{await navigator.clipboard.writeText(url);shareBtn.textContent='✓ Đã chép liên kết'}}catch(_){}})}
})();
