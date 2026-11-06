/* Four ending cinematics, assembled from the game's own stills. */
(() => {
'use strict';
const ROOT='assets/background/endings/';
const FRAME_MS=8200;
const FRAMES={
 bad:[
  {file:'bad_01.webp',alt:'Miệng giếng nứt trong mưa, chiếc ấn đồng bật khỏi khe đá.',text:'Chiếc ấn bật khỏi khe đá. Tiếng nước dội lên trong đêm.'},
  {file:'bad_02.webp',alt:'Cánh cửa gỗ cài then trong căn hầm tối.',text:'Sau cánh cửa, những lời cầu cứu vẫn chưa tìm được đường về.'},
  {file:'bad_03.webp',alt:'Bóng người đơn độc trên con đường rừng chìm trong sương.',text:'Con đường biến mất trong sương. Không ai được gọi đúng tên.'}
 ],
 normal:[
  {file:'normal_01.webp',alt:'Cổng sắt bỏ hoang mở ra con đường phủ sương.',text:'Cả nhóm chọn rời khỏi biệt thự Vân Hòa.'},
  {file:'normal_02.webp',alt:'Cầu gỗ bắc qua dòng nước, dẫn về phía làng.',text:'Con đường qua rừng đưa họ trở về làng.'},
  {file:'normal_03.webp',alt:'Biệt thự mờ xa sau những hàng cây.',text:'Phía sau hàng cây, những câu hỏi vẫn chưa có lời đáp.'}
 ],
 good:[
  {file:'good_01.webp',alt:'Hồ sơ cũ và ảnh gia đình được đặt cạnh bát hương.',text:'Những hồ sơ được đưa về cho gia đình người đã khuất.'},
  {file:'good_02.webp',alt:'Một người mẹ ôm con gái trước hiên nhà.',text:'Nhài được gọi đúng tên và được ở bên mẹ.'},
  {file:'good_03.webp',alt:'Hoa nhài đặt trên nắp giếng vẫn còn bịt kín.',text:'Dưới giếng, chiếc ấn vẫn còn đó. Một câu chuyện vẫn chưa khép lại.'}
 ],
 true:[
  {file:'true_01.webp',alt:'Lược gãy, khăn thêu và mảnh áo được đặt trên nền đá phủ rêu.',text:'Lành. Phúc. Mai. Những cái tên được gọi lại giữa rừng.'},
  {file:'true_02.webp',alt:'Ấn đồng đã được tháo, đặt cạnh mặt nước yên.',text:'Khi sự thật được nhìn nhận, chiếc ấn mới được tháo ra.'},
  {file:'true_03.webp',alt:'Bóng người mẹ, con gái và con trai đứng bên nhau trước ngôi nhà cũ.',text:'Mai được trở về bên mẹ và em. Không ai buộc cô phải tha thứ.'}
 ]
};
const SOUND={bad:'ambient_house.mp3',normal:'nature_forest.mp3',good:'music_box.mp3',true:'music_box.mp3'};
let active=null;
const el=id=>document.getElementById(id);
function play(which,options={}){
 const frames=FRAMES[which],screen=el('ending-cinematic'),shell=el('app-shell');
 if(active||!frames||!screen||!shell)return false;
 const image=el('ending-cinematic-image'),caption=el('ending-cinematic-caption'),pause=el('ending-cinematic-pause'),back=el('ending-cinematic-back'),nextButton=el('ending-cinematic-next'),skip=el('ending-cinematic-skip');
 if(!image||!caption||!pause||!back||!nextButton||!skip)return false;
 const state={which,frames,index:0,paused:false,visibilityPaused:false,timer:null,audio:null,done:false,oldInert:shell.inert,returnFocus:document.activeElement,onFinish:options.onFinish};
 active=state;shell.inert=true;screen.hidden=false;
 screen.setAttribute('aria-label','Phim kết thúc: '+({bad:'Ấn vỡ',normal:'Ra khỏi rừng',good:'Đưa những cái tên về',true:'Trả lại tên'}[which]));
 function clear(){if(state.timer!==null){clearTimeout(state.timer);state.timer=null}}
 function soundPlay(){if(state.audio&&!state.paused&&!document.hidden){const p=state.audio.play();if(p&&typeof p.catch==='function')p.catch(()=>{})}}
 if(options.soundOn){try{state.audio=new Audio('assets/sound/'+SOUND[which]);state.audio.loop=true;state.audio.volume=.17;soundPlay()}catch(_){state.audio=null}}
 function finish(){
  if(state.done)return;state.done=true;clear();if(state.audio){state.audio.pause();try{state.audio.currentTime=0}catch(_){}}
  document.removeEventListener('keydown',keys,true);document.removeEventListener('visibilitychange',visibility);
  pause.onclick=null;back.onclick=null;nextButton.onclick=null;skip.onclick=null;image.onerror=null;
  screen.hidden=true;screen.classList.remove('is-paused');shell.inert=state.oldInert;active=null;
  const target=state.returnFocus&&state.returnFocus.isConnected?state.returnFocus:el('scene-stage');
  if(target&&typeof target.focus==='function')target.focus({preventScroll:true});
  if(typeof state.onFinish==='function')state.onFinish();
 }
 function schedule(){clear();if(!state.paused&&!document.hidden)state.timer=setTimeout(next,FRAME_MS)}
 function draw(){
  if(state.done)return;const frame=frames[state.index];
  caption.textContent=frame.text;image.alt=frame.alt;
  image.onerror=()=>{image.onerror=null;image.src='assets/background/'+({bad:'BG42',normal:'BG33',good:'BG33',true:'BG40'}[which])+'.webp'};
  image.src=ROOT+frame.file;
  image.classList.remove('ending-cinematic-image--enter');void image.offsetWidth;image.classList.add('ending-cinematic-image--enter');
  back.disabled=state.index===0;nextButton.textContent=state.index===frames.length-1?'Xem kết thúc':'Cảnh tiếp';
  screen.setAttribute('data-frame',String(state.index+1));schedule();
 }
 function next(){if(state.index+1>=frames.length){finish();return}state.index++;draw()}
 function previous(){if(state.index>0){state.index--;draw()}}
 function togglePause(){state.paused=!state.paused;state.visibilityPaused=false;screen.classList.toggle('is-paused',state.paused);pause.textContent=state.paused?'Tiếp tục':'Tạm dừng';pause.setAttribute('aria-pressed',state.paused?'true':'false');if(state.paused){clear();if(state.audio)state.audio.pause()}else{soundPlay();schedule()}}
 function keys(event){
  if(event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();finish();return}
  if(event.key==='ArrowRight'){event.preventDefault();event.stopImmediatePropagation();next();return}
  if(event.key==='ArrowLeft'){event.preventDefault();event.stopImmediatePropagation();previous();return}
  if(event.key==='Tab'){
   const controls=[skip,back,pause,nextButton].filter(x=>!x.disabled),index=controls.indexOf(document.activeElement);
   const next=event.shiftKey?(index<=0?controls.length-1:index-1):(index<0||index===controls.length-1?0:index+1);
   event.preventDefault();event.stopImmediatePropagation();controls[next].focus();
  }
 }
 function visibility(){
  if(document.hidden&&!state.paused){state.visibilityPaused=true;screen.classList.add('is-paused');clear();if(state.audio)state.audio.pause()}
  else if(!document.hidden&&state.visibilityPaused){state.visibilityPaused=false;screen.classList.remove('is-paused');soundPlay();schedule()}
 }
 pause.onclick=togglePause;back.onclick=previous;nextButton.onclick=next;skip.onclick=finish;
 pause.textContent='Tạm dừng';pause.setAttribute('aria-pressed','false');
 document.addEventListener('keydown',keys,true);document.addEventListener('visibilitychange',visibility);
 draw();skip.focus({preventScroll:true});return true;
}
window.EndingCinematic={play,isActive:()=>active!==null};
})();
