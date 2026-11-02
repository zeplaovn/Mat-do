(function(){'use strict';
var $=function(i){return document.getElementById(i)};
var BG=function(n){return 'assets/background/BG'+n+'.webp'};
var FACES=[['01_Dong','ĐÔNG'],['02_Nam','NAM'],['03_Tuyet','TUYẾT'],['04_Anh','ÁNH'],['05_Nguyet','NGUYỆT']];
/* Mỗi shot: d = thời lượng (giây); bg; kb = kiểu camera; caps = [[giây, văn bản, lớp]] ; fx */
var SHOTS=[
 {d:1.6,bg:'01',kb:'out',caps:[]},
 {d:6.5,bg:'01',kb:'in',caps:[[.6,'Tháng Ba, năm 2026.','small'],[2.6,'Năm người bạn lên Đồng Chay để ghi lại một truyền thuyết.','']]},
 {d:6.5,bg:'09',kb:'pan',caps:[[.4,'Biệt thự Vân Hòa.','big'],[2.8,'Bị bỏ hoang từ năm 1988.','small']]},
 {d:5.5,bg:'11',kb:'in',caps:[[.6,'Không ai trong làng dám nhắc tên nó.','']]},
 {d:5,bg:'12',kb:'in',caps:[[.5,'Và cánh cổng vừa khép lại sau lưng họ.','red']],fx:'flash0'},
 {d:6,faces:true,bg:'11',kb:'out',caps:[]},
 {d:5.5,bg:'16',kb:'in',cls:'red',caps:[[.5,'Trong bóng tối, có một đứa trẻ vẫn đang chờ.','red']]},
 {d:2.2,bg:'13',kb:'in',caps:[[.2,'KHÁM PHÁ','big']]},
 {d:2.2,bg:'20',kb:'in',caps:[[.2,'GIẢI MÃ','big']]},
 {d:2.2,bg:'27',kb:'in',caps:[[.2,'TÌM SỰ THẬT','big']]},
 {d:2.4,bg:'21',kb:'in',cls:'red shake',caps:[[.2,'SỐNG SÓT','big red glitch']],fx:'flash0'},
 {d:6,bg:'29',kb:'pan',caps:[[.5,'Năm nấm mộ. Năm cái tên bị xóa.','']]},
 {d:5.5,bg:'32',kb:'in',cls:'red',caps:[[.5,'Sự thật nằm dưới lòng đất.','red']]},
 {d:1.2,bg:'32',kb:'in',cls:'red shake',caps:[],fx:'flash0'},
 {d:5.5,bg:'33',kb:'out',caps:[[.8,'Họ không muốn bị lãng quên.','']]}
];
var stage=$('stage'),shots=$('shots'),caps=$('caps'),timers=[],audio=null,muted=false,t0=0,total=0,raf=0,running=false;
SHOTS.forEach(function(s){total+=s.d});
function at(ms,fn){timers.push(setTimeout(fn,ms))}
function clearAll(){timers.forEach(clearTimeout);timers=[];cancelAnimationFrame(raf)}
function mkShot(s){var e=document.createElement('div');e.className='shot '+(s.cls||'');var b=document.createElement('div');b.className='bg '+s.kb;b.style.backgroundImage="url('"+BG(s.bg)+"')";b.style.setProperty('--d',(s.d+1.2)+'s');e.appendChild(b);shots.appendChild(e);return e}
function addCap(text,cls,at0){var c=document.createElement('div');c.className='cap '+(cls||'');c.textContent=text;caps.appendChild(c);requestAnimationFrame(function(){requestAnimationFrame(function(){c.classList.add('show')})});return c}
function playShot(i,skip){
 var s=SHOTS[i],el=mkShot(s);
 requestAnimationFrame(function(){el.classList.add('on')});
 if(s.fx==='flash0'){var f=$('flash');f.classList.remove('go');void f.offsetWidth;f.classList.add('go')}
 caps.textContent='';
 s.caps.forEach(function(c){at(c[0]*1000,function(){addCap(c[1],c[2])})});
 if(s.caps.length)at((s.d-.7)*1000,function(){[].forEach.call(caps.children,function(c){c.classList.add('out')})});
 if(s.faces){var row=document.createElement('div');row.className='faces';caps.appendChild(row);FACES.forEach(function(f,k){var d=document.createElement('div');d.className='face';d.innerHTML='<img alt="" src="assets/portraits/'+f[0]+'_portrait.webp"><span>'+f[1]+'</span>';row.appendChild(d);at(500+k*650,function(){d.classList.add('show')})});
  at(500,function(){var c=addCap('Năm người. Một đêm. Một bí mật.','small');caps.insertBefore(c,row)})}
 var old=shots.children.length>2?shots.children[0]:null;if(old)setTimeout(function(){old.remove()},1200);
 at(s.d*1000,function(){if(i+1<SHOTS.length)playShot(i+1);else finish()});
}
function tick(){var el=(performance.now()-t0)/1000;$('prog').firstElementChild.style.width=Math.min(100,el/total*100)+'%';if(running)raf=requestAnimationFrame(tick)}
function fade(a,to,ms){var from=a.volume,st=performance.now();(function s(){var k=Math.min(1,(performance.now()-st)/ms);a.volume=Math.max(0,Math.min(1,from+(to-from)*k));if(k<1)requestAnimationFrame(s);else if(to===0)a.pause()})()}
function start(){
 clearAll();shots.textContent='';caps.textContent='';$('start').hidden=true;$('end').hidden=true;running=true;t0=performance.now();
 if(!audio){audio=new Audio('assets/sound/trailer.mp3');audio.loop=false}
 audio.currentTime=0;audio.volume=0;audio.muted=muted;audio.play().then(function(){fade(audio,.6,2500)}).catch(function(){});
 playShot(0);tick();
 at((total-4)*1000,function(){if(audio)fade(audio,0,4000)});
}
function finish(){running=false;clearAll();$('prog').firstElementChild.style.width='100%';$('end').hidden=false;if(audio)fade(audio,0,1500)}
$('btn-play').onclick=start;$('btn-replay').onclick=start;
$('btn-skip').onclick=function(){if(running||!$('end').hidden){finish()}};
$('btn-mute').onclick=function(){muted=!muted;if(audio)audio.muted=muted;this.textContent=muted?'🔇':'🔊'};
document.addEventListener('keydown',function(e){if(e.key===' '&&$('start').hidden===false){e.preventDefault();start()}});
/* tải trước ảnh để không bị khựng */
SHOTS.forEach(function(s){var i=new Image();i.src=BG(s.bg)});FACES.forEach(function(f){var i=new Image();i.src='assets/portraits/'+f[0]+'_portrait.webp'});
})();
