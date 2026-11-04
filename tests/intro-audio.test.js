/* Simulate first-visit autoplay policies and actual loader/music controls. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'..','intro.js'),'utf8').replace(/\}\)\(\);\s*$/,`window.audioQA={finish,musicStart,musicStop,getMusic:()=>music,getWanted:()=>musicWanted};})();`);
assert.ok(source.includes('window.audioQA='));
function setup({muted=false,deferAutoplay=false,storageBlocked=false}={}){
 let now=0,next=1,gesture=false;const tasks=new Map(),audio=[],storage=new Map(),observers=new Map(),globalEvents={};
 if(muted)storage.set('lnrt-music','0');
 const schedule=(fn,ms,repeat=0)=>{const id=next++;tasks.set(id,{fn,at:now+(ms||0),repeat});return id};
 function advance(ms){const end=now+ms;for(;;){let pick=null;for(const [id,t] of tasks)if(t.at<=end&&(!pick||t.at<pick.t.at))pick={id,t};if(!pick)break;now=pick.t.at;tasks.delete(pick.id);if(pick.t.repeat)tasks.set(pick.id,{...pick.t,at:now+pick.t.repeat});pick.t.fn()}now=end}
 class Element{
  constructor(){this.children=[];this.listeners={};this.attrs={};this.dataset={};this.hidden=false;this.textContent='';this.style={setProperty(){}};this.clientWidth=300;this.className='';this.parentElement=new ElementParent();
   const set=new Set();this.classList={add:(...xs)=>xs.forEach(x=>set.add(x)),remove:(...xs)=>xs.forEach(x=>set.delete(x)),contains:x=>set.has(x),toggle:(x,on)=>{if(on)set.add(x);else set.delete(x)}}}
  addEventListener(type,fn){(this.listeners[type]||=[]).push(fn)}removeEventListener(){}appendChild(e){this.children.push(e);return e}setAttribute(k,v){this.attrs[k]=String(v)}focus(){}remove(){this.removed=true}querySelector(){return null}
  click(){gesture=true;for(const fn of this.listeners.click||[])fn({target:this,stopPropagation(){},preventDefault(){}});if(this.onclick)this.onclick({target:this,stopPropagation(){},preventDefault(){}});gesture=false}
 }
 class ElementParent{before(){}}
 const ids={};for(const id of ['loader','incense-ash','ember','loader-pct','loader-status-text','loader-tip','loader-bar','loader-sound-choice','loader-enter','loader-silent','title-screen','btn-new-game','intro','intro-text','intro-line','intro-sub','intro-card','intro-img-a','intro-img-b','intro-skip'])ids[id]=new Element();
 ids['loader-sound-choice'].hidden=true;ids.intro.hidden=true;ids['btn-new-game'].onclick=()=>{};
 const doc={documentElement:new Element(),hidden:false,getElementById:id=>ids[id],createElement:()=>new Element(),addEventListener(){},removeEventListener(){}};
 const delayed=[];
 class AudioMock{
  constructor(src){this.src=src;this.paused=true;this.volume=1;this.currentTime=0;audio.push(this)}
  play(){if(gesture){this.paused=false;return Promise.resolve()}if(deferAutoplay)return new Promise((resolve,reject)=>delayed.push({resolve:()=>{this.paused=false;resolve()},reject}));return Promise.reject(Object.assign(new Error('blocked'),{name:'NotAllowedError'}))}
  pause(){this.paused=true}addEventListener(){}
 }
 const win={requestIdleCallback(){}};
 const context={window:win,document:doc,navigator:{},Audio:AudioMock,Image:class{},Perf:{watch(){}},performance:{now:()=>now},
  localStorage:{getItem:k=>{if(storageBlocked)throw Error('storage blocked');return storage.get(k)??null},setItem:(k,v)=>{if(storageBlocked)throw Error('storage blocked');storage.set(k,String(v))}},matchMedia:()=>({matches:true}),requestAnimationFrame(){},
  setTimeout:(fn,ms)=>schedule(fn,ms),clearTimeout:id=>tasks.delete(id),setInterval:(fn,ms)=>schedule(fn,ms,ms),clearInterval:id=>tasks.delete(id),
  addEventListener:(type,fn)=>{globalEvents[type]=fn},removeEventListener:type=>{delete globalEvents[type]},
  MutationObserver:class{constructor(fn){this.fn=fn}observe(el){observers.set(el,this.fn)}},console};
 vm.createContext(context);vm.runInContext(source,context);
 return {qa:win.audioQA,ids,audio,storage,advance,delayed,observers,globalEvents};
}
const flush=()=>new Promise(resolve=>setImmediate(resolve));
function verifyLoaderFallback(waiting,choiceVisible=waiting){
 const classes=new Set(['is-loading','is-busy']),loader={hidden:false,dataset:waiting?{awaitingMusic:'1'}:{}},choice={hidden:!choiceVisible},html={dataset:{},classList:{contains:x=>classes.has(x),remove:(...xs)=>xs.forEach(x=>classes.delete(x))}};let fallback;
 const sandbox={document:{documentElement:html,getElementById:id=>id==='loader'?loader:id==='loader-sound-choice'?choice:null,hidden:false},window:{devicePixelRatio:1},navigator:{},screen:{width:390,height:800},localStorage:{getItem:()=>null},matchMedia:()=>({matches:false}),setTimeout:fn=>{fallback=fn},requestAnimationFrame(){},performance:{now:()=>0},console};
 vm.createContext(sandbox);vm.runInContext(fs.readFileSync(path.join(__dirname,'..','perf.js'),'utf8'),sandbox);fallback();
 assert.equal(loader.hidden,!(waiting&&choiceVisible),waiting&&choiceVisible?'the music choice must remain visible':'a broken loader must still be released');
}
(async()=>{
 let t=setup();t.qa.finish();t.advance(450);await flush();
 assert.equal(t.ids['loader-sound-choice'].hidden,false,'blocked autoplay must show an explicit music choice');
 assert.equal(t.ids.loader.classList.contains('done'),false,'title must wait for the first gesture');
 t.ids['loader-enter'].click();await flush();t.advance(1800);
 assert.equal(t.ids.loader.classList.contains('done'),true);assert.equal(t.audio[0].paused,false,'music must start on the entry gesture');
 assert.ok(t.audio[0].volume>.25,'title music must fade to an audible volume');
 const button=t.ids['title-screen'].children.find(e=>e.className==='music-btn');assert.ok(button);
 button.click();t.advance(500);assert.equal(t.audio[0].paused,true,'mute must stop the title music');assert.equal(t.storage.get('lnrt-music'),'0');
 button.click();await flush();t.advance(1800);assert.equal(t.audio[0].paused,false,'music button must restart playback');assert.equal(t.storage.get('lnrt-music'),'1');
 t=setup({muted:true});t.qa.finish();t.advance(450);await flush();assert.equal(t.ids.loader.classList.contains('done'),true,'a saved mute choice must not block entry');assert.equal(t.audio.length,0);
 t=setup({deferAutoplay:true});t.qa.finish();t.advance(450);t.advance(1500);assert.equal(t.ids['loader-sound-choice'].hidden,false,'a slow media load must not trap the loader');
 t.ids['loader-silent'].click();t.delayed[0].resolve();await flush();t.advance(2000);
 assert.equal(t.storage.get('lnrt-music'),'0');assert.equal(t.audio[0].paused,true,'a late play promise must not override the silent choice');
 t=setup();t.advance(15000);t.advance(450);await flush();assert.equal(t.ids['loader-sound-choice'].hidden,false,'loader timeout must continue even if animation frames stop');assert.equal(t.ids.loader.dataset.awaitingMusic,'1','fallback must preserve the explicit music choice');
 t=setup({storageBlocked:true});t.qa.finish();t.advance(450);await flush();t.ids['loader-enter'].click();await flush();const fallbackButton=t.ids['title-screen'].children.find(e=>e.className==='music-btn');fallbackButton.click();t.advance(500);assert.equal(t.audio[0].paused,true,'mute must work when storage is unavailable');assert.equal(fallbackButton.attrs['aria-pressed'],'false');
 verifyLoaderFallback(true);verifyLoaderFallback(false);verifyLoaderFallback(true,false);
 console.log('OK: first-visit autoplay blocking, user-gesture playback, mute preference and delayed-play race.');
})().catch(e=>{console.error(e);process.exitCode=1});
