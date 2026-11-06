/* Credits shown after every ending cinematic, before the ending summary. */
(() => {
'use strict';
const DURATION_MS=14000;
const byId=id=>document.getElementById(id);
let active=null;
const now=()=>typeof performance!=='undefined'&&typeof performance.now==='function'?performance.now():Date.now();

function play(options={}){
 const screen=byId('ending-credits'),shell=byId('app-shell'),continueButton=byId('ending-credits-continue');
 if(active||!screen||!shell||!continueButton)return false;
 const state={
  timer:null,remaining:DURATION_MS,startedAt:null,pausedByVisibility:document.hidden,done:false,
  oldInert:shell.inert,returnFocus:document.activeElement,onFinish:options.onFinish
 };
 active=state;
 shell.inert=true;
 screen.hidden=false;
 screen.classList.toggle('is-paused',document.hidden);
 function stopClock(){
  if(state.startedAt!==null){
   state.remaining=Math.max(0,state.remaining-(now()-state.startedAt));
   state.startedAt=null;
  }
  if(state.timer!==null){clearTimeout(state.timer);state.timer=null}
 }
 function startClock(){
  if(state.done||document.hidden)return;
  state.startedAt=now();
  state.timer=setTimeout(finish,state.remaining);
 }
 function finish(){
  if(state.done)return;
  state.done=true;stopClock();
  continueButton.onclick=null;
  document.removeEventListener('keydown',keys,true);
  document.removeEventListener('visibilitychange',visibility);
  screen.hidden=true;
  screen.classList.remove('is-paused');
  shell.inert=state.oldInert;
  active=null;
  const focus=state.returnFocus&&state.returnFocus.isConnected?state.returnFocus:byId('scene-stage');
  if(focus&&typeof focus.focus==='function')focus.focus({preventScroll:true});
  if(typeof state.onFinish==='function')state.onFinish();
 }
 function keys(event){
  if(event.key==='Escape'||event.key==='Enter'||event.key===' '){
   event.preventDefault();event.stopImmediatePropagation();finish();
  } else if(event.key==='Tab'){
   event.preventDefault();event.stopImmediatePropagation();continueButton.focus();
  }
 }
 function visibility(){
  if(document.hidden&&!state.pausedByVisibility){
   state.pausedByVisibility=true;
   screen.classList.add('is-paused');
   stopClock();
  } else if(!document.hidden&&state.pausedByVisibility){
   state.pausedByVisibility=false;
   screen.classList.remove('is-paused');
   startClock();
  }
 }
 continueButton.onclick=finish;
 document.addEventListener('keydown',keys,true);
 document.addEventListener('visibilitychange',visibility);
 startClock();
 continueButton.focus({preventScroll:true});
 return true;
}
window.EndingCredits={play,isActive:()=>active!==null};
})();
