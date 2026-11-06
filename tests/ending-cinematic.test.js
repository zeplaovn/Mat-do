/* Test cinematic controls, all ending paths, sound preference and game integration. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
class ClassList{constructor(){this.values=new Set()}add(v){this.values.add(v)}remove(v){this.values.delete(v)}toggle(v,on){if(on===undefined)on=!this.values.has(v);on?this.add(v):this.remove(v)}contains(v){return this.values.has(v)}}
class Element{
 constructor(id){this.id=id;this.classList=new ClassList();this.attrs={};this.children=[];this.hidden=false;this.disabled=false;this.inert=false;this.isConnected=true;this.offsetWidth=100;this.style={};this.textContent='';this.src='';this.alt=''}
 setAttribute(key,value){this.attrs[key]=String(value)}
 focus(){document.activeElement=this}
 appendChild(child){this.children.push(child);return child}
}
const ids=['ending-cinematic','app-shell','scene-stage','ending-cinematic-image','ending-cinematic-caption','ending-cinematic-pause','ending-cinematic-back','ending-cinematic-next','ending-cinematic-skip'];
const nodes=Object.fromEntries(ids.map(id=>[id,new Element(id)]));nodes['ending-cinematic'].hidden=true;
const listeners={};
const document={activeElement:nodes['scene-stage'],hidden:false,getElementById:id=>nodes[id]||null,
 addEventListener:(name,fn)=>{(listeners[name]??=[]).push(fn)},removeEventListener:(name,fn)=>{listeners[name]=(listeners[name]||[]).filter(x=>x!==fn)}};
let timers=new Map(),nextTimer=0,audios=[];
class Audio{constructor(src){this.src=src;this.paused=true;this.currentTime=12;audios.push(this)}play(){this.paused=false;return Promise.resolve()}pause(){this.paused=true}}
const window={},context={window,document,Audio,console,setTimeout:fn=>{const id=++nextTimer;timers.set(id,fn);return id},clearTimeout:id=>timers.delete(id)};
vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(root,'ending-cinematic.js'),'utf8'),context);
const play=window.EndingCinematic.play;
const runTimer=()=>{const entry=timers.entries().next().value;assert.ok(entry,'a frame timer is required');timers.delete(entry[0]);entry[1]()};
const key=(name,shiftKey=false)=>{let prevented=false,stopped=false;for(const fn of [...(listeners.keydown||[])])fn({key:name,shiftKey,preventDefault(){prevented=true},stopImmediatePropagation(){stopped=true}});return {prevented,stopped}};
let done=0;assert.equal(play('unknown',{onFinish:()=>done++}),false);assert.equal(play('bad',{soundOn:false,onFinish:()=>done++}),true);
assert.equal(play('good'),false,'a second film cannot overlap');assert.equal(window.EndingCinematic.isActive(),true);assert.equal(nodes['app-shell'].inert,true);assert.equal(nodes['ending-cinematic'].hidden,false);assert.match(nodes['ending-cinematic-image'].src,/bad_01\.webp$/);assert.equal(audios.length,0,'muted games must not create audio');
assert.equal(document.activeElement,nodes['ending-cinematic-skip']);assert.deepEqual(key('Tab'),{prevented:true,stopped:true});assert.equal(document.activeElement,nodes['ending-cinematic-pause']);assert.deepEqual(key('Tab'),{prevented:true,stopped:true});assert.equal(document.activeElement,nodes['ending-cinematic-next']);key('Tab',true);assert.equal(document.activeElement,nodes['ending-cinematic-pause']);
assert.equal(timers.size,1);nodes['ending-cinematic-pause'].onclick();assert.equal(timers.size,0);assert.equal(nodes['ending-cinematic-pause'].textContent,'Tiếp tục');assert.ok(nodes['ending-cinematic'].classList.contains('is-paused'));nodes['ending-cinematic-pause'].onclick();assert.equal(timers.size,1);
runTimer();assert.match(nodes['ending-cinematic-image'].src,/bad_02\.webp$/);assert.equal(nodes['ending-cinematic-back'].disabled,false);nodes['ending-cinematic-back'].onclick();assert.match(nodes['ending-cinematic-image'].src,/bad_01\.webp$/);
assert.deepEqual(key('h'),{prevented:false,stopped:false},'normal keys must still reach focused controls');assert.match(fs.readFileSync(path.join(root,'game.js'),'utf8'),/EndingCinematic\.isActive\(\)/,'game shortcuts must be disabled during the film');assert.deepEqual(key('ArrowRight'),{prevented:true,stopped:true});assert.match(nodes['ending-cinematic-image'].src,/bad_02\.webp$/);assert.deepEqual(key('Escape'),{prevented:true,stopped:true});assert.equal(done,1);assert.equal(nodes['ending-cinematic'].hidden,true);assert.equal(nodes['app-shell'].inert,false);assert.equal(timers.size,0);assert.equal((listeners.keydown||[]).length,0);assert.equal(window.EndingCinematic.isActive(),false);
for(const name of ['normal','good','true']){
 let calls=0;assert.equal(play(name,{soundOn:true,onFinish:()=>calls++}),true);const audio=audios.at(-1);assert.equal(audio.paused,false);assert.match(nodes['ending-cinematic-image'].src,new RegExp(name+'_01\\.webp$'));
 document.hidden=true;for(const fn of listeners.visibilitychange)fn();assert.equal(timers.size,0);assert.equal(audio.paused,true);assert.ok(nodes['ending-cinematic'].classList.contains('is-paused'));document.hidden=false;for(const fn of listeners.visibilitychange)fn();assert.equal(audio.paused,false);assert.equal(timers.size,1);assert.ok(!nodes['ending-cinematic'].classList.contains('is-paused'));
 runTimer();assert.match(nodes['ending-cinematic-image'].src,new RegExp(name+'_02\\.webp$'));runTimer();assert.match(nodes['ending-cinematic-image'].src,new RegExp(name+'_03\\.webp$'));assert.equal(nodes['ending-cinematic-next'].textContent,'Xem kết thúc');runTimer();assert.equal(calls,1);assert.equal(audio.paused,true);assert.equal(timers.size,0);
}
let fallback=0;play('true',{onFinish:()=>fallback++});nodes['ending-cinematic-image'].onerror();assert.match(nodes['ending-cinematic-image'].src,/BG40\.webp$/);nodes['ending-cinematic-skip'].onclick();assert.equal(fallback,1);
for(const ending of ['bad','normal','good','true'])for(let i=1;i<=3;i++)assert.ok(fs.existsSync(path.join(root,'assets/background/endings',ending+'_0'+i+'.webp')));
assert.match(fs.readFileSync(path.join(root,'ending-cinematic.css'),'utf8'),/prefers-reduced-motion:reduce/);
assert.match(fs.readFileSync(path.join(root,'index.html'),'utf8'),/ending-cinematic\.js/);

// The actual ending logic must save immediately, show the card only after the film,
// retain the checkpoint, and allow the same film to be replayed.
const extra=['scene-image','scene-backdrop','ending-actions','title-screen'];for(const id of extra)nodes[id]=new Element(id);nodes['title-screen'].hidden=true;
const gameWindow={};const gameContext={window:gameWindow,document,localStorage:{getItem:()=>null,setItem(){}},setTimeout(){},clearTimeout(){},setInterval(){},clearInterval(){},requestAnimationFrame(){},matchMedia:()=>({matches:false}),console};
vm.createContext(gameContext);
for(const file of ['assets/research/books-data.js','assets/dialogue/reviewed.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),gameContext);
let game=fs.readFileSync(path.join(root,'game.js'),'utf8').replace(/\nmount\(\);\s*\}\)\(\);\s*$/,`
showModal=(html,kicker,type)=>{window.card={html,kicker,type};document.getElementById('ending-actions').children=[]};hideModal=()=>{};
modalButton=(label,action)=>({label,action});save=()=>{};stopAmbience=()=>{};render=()=>{};renderSidebar=()=>{};clearDialogue=()=>{};syncAchievements=()=>{};load=()=>window.loaded;
window.game={initialState,setState:s=>{state=s},getState:()=>state,showEnding,continueGame};})();`);
vm.runInContext(game,gameContext);const g=gameWindow.game,s=g.initialState();s.flags.riceGift=true;g.setState(s);let queued=[];gameWindow.EndingCinematic={play:(which,opts)=>{queued.push({which,...opts});return true}};
g.showEnding('true');assert.equal(queued.length,1);assert.equal(queued[0].which,'true');assert.equal(s.flags.ending,'true');assert.ok(s.endingsSeen.includes('true'));assert.equal(gameWindow.card,undefined);
queued[0].onFinish();assert.equal(gameWindow.card.type,'ending');assert.match(gameWindow.card.html,/bát cơm trắng/i);const replay=nodes['ending-actions'].children.find(x=>x.label==='Xem lại đoạn phim');assert.ok(replay);replay.action();assert.equal(queued.length,2);queued[1].onFinish();
const restore=nodes['ending-actions'].children.find(x=>x.label==='Quay lại trước quyết định cuối');restore.action();assert.equal(g.getState().flags.ending,null);assert.ok(g.getState().endingsSeen.includes('true'));
const resumed=g.initialState();resumed.flags.ending='normal';resumed.endingsSeen.push('normal');gameWindow.loaded=resumed;g.continueGame();assert.equal(queued.at(-1).which,'normal','reload resumes an interrupted ending');
gameWindow.EndingCinematic={play:()=>false};g.setState(g.initialState());g.showEnding('bad');assert.equal(gameWindow.card.type,'ending','a missing player must fall back to the ending card');
console.log('OK: four cinematic sequences, controls, mute, pause, accessibility, fallback, ending card, replay and checkpoint.');
