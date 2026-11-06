/* Four ending cinematics, assembled from the game's own stills. */
(() => {
'use strict';
const ROOT='assets/background/endings-v2/';
const FRAME_MS=8200;
const LAST_FRAME_MS=12000;
const FRAMES={
 bad:[
  {file:'bad_01.webp',motion:'push',alt:'Chiếc ấn bật khỏi khe giếng trong mưa.',text:'Họ chỉ muốn kéo nhanh thôi. Chiếc ấn đã nhúc nhích.'},
  {file:'bad_02.webp',motion:'pan',alt:'Đèn pin, chiếc giày và hoa nhài rơi trên sân ướt.',text:'Ánh đèn rơi xuống đất. Không ai kịp nhặt.'},
  {file:'bad_03.webp',motion:'push',alt:'Cánh cửa gỗ cài then trong căn hầm tối.',text:'Sau cánh cửa, những tiếng gõ vẫn chưa có người trả lời.'},
  {file:'bad_04.webp',motion:'tremble',alt:'Một cô gái chạy dọc hành lang trong đêm mưa.',text:'Cô chạy, nhưng hành lang cứ dài ra mãi.'},
  {file:'bad_05.webp',motion:'pull',alt:'Những bóng người mờ đứng bên giếng trong sương.',text:'Họ đứng đó, chờ ai đó gọi đúng tên.'},
  {file:'bad_06.webp',motion:'still',alt:'Bóng người đơn độc trên con đường rừng chìm trong sương.',text:'Con đường biến mất trong sương. Không ai được gọi đúng tên.'}
 ],
 normal:[
  {file:'normal_01.webp',motion:'pull',alt:'Cổng sắt bỏ hoang mở ra con đường phủ sương.',text:'Cả nhóm chọn rời khỏi biệt thự Vân Hòa.'},
  {file:'normal_02.webp',motion:'pan',alt:'Những bước chân lặng lẽ đi trên con đường lầy.',text:'Không ai nói gì. Họ chỉ bước.'},
  {file:'normal_03.webp',motion:'still',alt:'Cả nhóm đi qua cầu gỗ về phía làng.',text:'Con đường qua rừng đưa họ trở về làng.'},
  {file:'normal_04.webp',motion:'push',alt:'Ngõ làng, cánh đồng và ánh đèn nhà trong sương sớm.',text:'Làng vẫn dậy sớm như chưa có chuyện gì.'},
  {file:'normal_05.webp',motion:'panLeft',alt:'Một người ngoái nhìn biệt thự phía xa.',text:'Ngoái lại lần cuối, ô cửa sổ ấy vẫn còn sáng.'},
  {file:'normal_06.webp',motion:'still',alt:'Cành hoa nhài nằm trên con đường vắng.',text:'Phía sau hàng cây, những câu hỏi vẫn chưa có lời đáp.'}
 ],
 good:[
  {file:'good_01.webp',motion:'push',alt:'Hồ sơ và ảnh gia đình được đặt cạnh bát hương.',text:'Những hồ sơ được đưa về cho gia đình người đã khuất.'},
  {file:'good_02.webp',motion:'still',alt:'Bàn tay người già chạm vào tấm ảnh cũ.',text:'Bao nhiêu năm, bà mới được cầm lại gương mặt ấy.'},
  {file:'good_03.webp',motion:'panUp',alt:'Người thân đứng trước bàn tưởng niệm trong sân.',text:'Một cái tên được gọi, sau gần bốn mươi năm.'},
  {file:'good_04.webp',motion:'push',alt:'Một người mẹ ôm con gái trước hiên nhà.',text:'Nhài được ở bên mẹ.'},
  {file:'good_05.webp',motion:'still',alt:'Khói hương bên chiếc giày nhỏ và hoa nhài.',text:'Khói hương lên. Có thể họ đã nghe thấy.'},
  {file:'good_06.webp',motion:'pullFade',alt:'Hoa nhài đặt trên nắp giếng vẫn còn bịt kín.',text:'Dưới giếng, chiếc ấn vẫn còn đó. Một câu chuyện vẫn chưa khép lại.'}
 ],
 true:[
  {file:'true_01.webp',motion:'push',alt:'Lược gãy, khăn thêu và mảnh áo đặt trên nền đá.',text:'Lược gãy. Khăn cũ. Mảnh áo. Những thứ cuối cùng của một gia đình.'},
  {file:'true_02.webp',riceFile:'true_02_rice.webp',motion:'pan',alt:'Cả nhóm tưởng niệm trước nền đá trong rừng.',altRice:'Cả nhóm tưởng niệm; một bát cơm được đặt cạnh nhang.',text:'Lành. Phúc. Mai. Những cái tên được gọi lại giữa rừng.'},
  {file:'true_03.webp',motion:'still',alt:'Thầy Nguyên đứng bên hiên chùa khi nhóm đối chiếu lời khai.',text:'Ông Nguyên nói ra những điều đã giấu suốt bao năm.'},
  {file:'true_04.webp',motion:'pull',alt:'Ấn đồng đã được tháo, đặt cạnh mặt nước yên.',text:'Khi sự thật được nhìn nhận, chiếc ấn mới được tháo ra.'},
  {file:'true_05.webp',motion:'panDown',alt:'Mặt nước giếng phản chiếu trời sáng và hoa nhài.',text:'Mặt nước đã lặng. Những ký ức có đường trở về.'},
  {file:'true_06.webp',motion:'pullFade',alt:'Người mẹ, con gái và con trai đứng bên nhau trước ngôi nhà cũ.',text:'Mai được trở về bên mẹ và em. Không ai buộc cô phải tha thứ hay lãng quên.'}
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
 const state={which,frames,index:0,paused:false,visibilityPaused:false,timer:null,silenceTimer:null,remaining:FRAME_MS,startedAt:null,audio:null,waterAudio:null,preload:null,done:false,riceGift:!!options.riceGift,oldInert:shell.inert,returnFocus:document.activeElement,onFinish:options.onFinish};
 active=state;shell.inert=true;screen.hidden=false;
 screen.setAttribute('aria-label','Phim kết thúc: '+({bad:'Ấn vỡ',normal:'Ra khỏi rừng',good:'Đưa những cái tên về',true:'Trả lại tên'}[which]));
 function clear(){if(state.timer!==null){clearTimeout(state.timer);state.timer=null}if(state.silenceTimer!==null){clearTimeout(state.silenceTimer);state.silenceTimer=null}}
 function soundPlay(){if(state.paused||document.hidden)return;for(const audio of [state.audio,state.waterAudio])if(audio){const p=audio.play();if(p&&typeof p.catch==='function')p.catch(()=>{})}}
 function soundPause(){for(const audio of [state.audio,state.waterAudio])if(audio)audio.pause()}
 if(options.soundOn){try{state.audio=new Audio('assets/sound/'+SOUND[which]);state.audio.loop=true;state.audio.volume=.17;if(which==='bad'){state.waterAudio=new Audio('assets/sound/nuoc_chay.mp3');state.waterAudio.loop=true;state.waterAudio.volume=.055}soundPlay()}catch(_){state.audio=null;state.waterAudio=null}}
 function finish(){
  if(state.done)return;state.done=true;clear();soundPause();for(const audio of [state.audio,state.waterAudio])if(audio){try{audio.currentTime=0}catch(_){}}state.preload=null;
  document.removeEventListener('keydown',keys,true);document.removeEventListener('visibilitychange',visibility);
  pause.onclick=null;back.onclick=null;nextButton.onclick=null;skip.onclick=null;image.onerror=null;
  screen.hidden=true;screen.classList.remove('is-paused');shell.inert=state.oldInert;active=null;
  const target=state.returnFocus&&state.returnFocus.isConnected?state.returnFocus:el('scene-stage');
  if(target&&typeof target.focus==='function')target.focus({preventScroll:true});
  if(typeof state.onFinish==='function')state.onFinish();
 }
 function fileAt(index){const frame=frames[index];return frame.riceFile&&state.riceGift?frame.riceFile:frame.file}
 function preloadNext(){if(state.index+1>=frames.length||typeof Image!=='function'){state.preload=null;return}try{const nextImage=new Image();nextImage.decoding='async';nextImage.src=ROOT+fileAt(state.index+1);state.preload=nextImage}catch(_){state.preload=null}}
 const now=()=>typeof performance!=='undefined'&&typeof performance.now==='function'?performance.now():Date.now();
 function stopClock(){if(state.startedAt!==null){state.remaining=Math.max(0,state.remaining-(now()-state.startedAt));state.startedAt=null}clear()}
 function schedule(reset=false){clear();if(reset)state.remaining=state.index===frames.length-1?LAST_FRAME_MS:FRAME_MS;if(state.paused||document.hidden)return;state.startedAt=now();state.timer=setTimeout(next,state.remaining);if(which==='true'&&state.index===frames.length-1&&state.audio){if(state.remaining<=1000)state.audio.pause();else state.silenceTimer=setTimeout(()=>{state.audio.pause();state.silenceTimer=null},state.remaining-1000)}}
 function draw(){
  if(state.done)return;const frame=frames[state.index];
  caption.textContent=frame.text;image.alt=state.riceGift&&frame.altRice?frame.altRice:frame.alt;image.dataset.motion=frame.motion;image.style.setProperty('--frame-duration',(state.index===frames.length-1?LAST_FRAME_MS:FRAME_MS)+'ms');if(state.audio)state.audio.volume=which==='true'&&state.index>=4?.22:.17;
  image.onerror=()=>{image.onerror=null;image.src='assets/background/'+({bad:'BG42',normal:'BG33',good:'BG33',true:'BG40'}[which])+'.webp'};
  image.src=ROOT+fileAt(state.index);preloadNext();
  image.classList.remove('ending-cinematic-image--enter');void image.offsetWidth;image.classList.add('ending-cinematic-image--enter');
  back.disabled=state.index===0;nextButton.textContent=state.index===frames.length-1?'Xem kết thúc':'Cảnh tiếp';
  screen.setAttribute('data-frame',String(state.index+1));soundPlay();schedule(true);
 }
 function next(){if(state.index+1>=frames.length){finish();return}state.index++;draw()}
 function previous(){if(state.index>0){state.index--;draw()}}
 function togglePause(){state.paused=!state.paused;state.visibilityPaused=false;screen.classList.toggle('is-paused',state.paused);pause.textContent=state.paused?'Tiếp tục':'Tạm dừng';pause.setAttribute('aria-pressed',state.paused?'true':'false');if(state.paused){stopClock();soundPause()}else{soundPlay();schedule()}}
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
  if(document.hidden&&!state.paused){state.visibilityPaused=true;screen.classList.add('is-paused');stopClock();soundPause()}
  else if(!document.hidden&&state.visibilityPaused){state.visibilityPaused=false;screen.classList.remove('is-paused');soundPlay();schedule()}
 }
 pause.onclick=togglePause;back.onclick=previous;nextButton.onclick=next;skip.onclick=finish;
 pause.textContent='Tạm dừng';pause.setAttribute('aria-pressed','false');
 document.addEventListener('keydown',keys,true);document.addEventListener('visibilitychange',visibility);
 draw();skip.focus({preventScroll:true});return true;
}
window.EndingCinematic={play,isActive:()=>active!==null};
})();
