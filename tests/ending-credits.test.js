/* Run: node tests/ending-credits.test.js */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
class Element{
 constructor(id){this.id=id;this.hidden=id==='ending-credits';this.inert=false;this.isConnected=true;this.attrs={};
  const classes=new Set();this.classList={add:c=>classes.add(c),remove:c=>classes.delete(c),contains:c=>classes.has(c),toggle:(c,v)=>v?classes.add(c):classes.delete(c)}}
 focus(){document.activeElement=this}
}
const ids=['ending-credits','ending-credits-continue','app-shell','scene-stage'];
const nodes=Object.fromEntries(ids.map(id=>[id,new Element(id)]));
const listeners={};
const document={hidden:false,activeElement:nodes['scene-stage'],getElementById:id=>nodes[id]||null,
 addEventListener:(name,fn)=>{(listeners[name]??=[]).push(fn)},
 removeEventListener:(name,fn)=>{listeners[name]=(listeners[name]||[]).filter(f=>f!==fn)}};
let current=0,nextId=0;
const timers=new Map();
const context={window:{},document,performance:{now:()=>current},
 setTimeout:(fn,delay)=>{const id=++nextId;timers.set(id,{fn,delay});return id},
 clearTimeout:id=>timers.delete(id)};
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root,'ending-credits.js'),'utf8'),context);
const api=context.window.EndingCredits;
function press(key){
 let prevented=false,stopped=false;
 for(const fn of [...(listeners.keydown||[])])
  fn({key,preventDefault(){prevented=true},stopImmediatePropagation(){stopped=true}});
 return {prevented,stopped};
}
let done=0;
assert.equal(api.play({onFinish:()=>done++}),true);
assert.equal(api.play(),false,'only one credits screen can run');
assert.equal(api.isActive(),true);
assert.equal(nodes['ending-credits'].hidden,false);
assert.equal(nodes['app-shell'].inert,true);
assert.equal(document.activeElement,nodes['ending-credits-continue']);
assert.equal([...timers.values()][0].delay,14000);
assert.deepEqual(press('Tab'),{prevented:true,stopped:true});
current=5000;
document.hidden=true;
for(const fn of [...(listeners.visibilitychange||[])])fn();
assert.equal(timers.size,0,'switching tabs pauses credits');
assert.equal(nodes['ending-credits'].classList.contains('is-paused'),true);
document.hidden=false;
for(const fn of [...(listeners.visibilitychange||[])])fn();
assert.equal([...timers.values()][0].delay,9000,'resume preserves elapsed viewing time');
const [timerId,timer]=[...timers.entries()][0];timers.delete(timerId);current+=timer.delay;timer.fn();
assert.equal(done,1,'credits must show the ending summary exactly once');
assert.equal(api.isActive(),false);
assert.equal(nodes['ending-credits'].hidden,true);
assert.equal(nodes['app-shell'].inert,false);
assert.equal(timers.size,0);
assert.equal((listeners.keydown||[]).length,0);
assert.equal((listeners.visibilitychange||[]).length,0);
assert.equal(api.play({onFinish:()=>done++}),true);
assert.deepEqual(press('Escape'),{prevented:true,stopped:true});
nodes['ending-credits-continue'].onclick?.();
assert.equal(done,2,'skip and button must not finish twice');
assert.equal(api.play({onFinish:()=>done++}),true);
nodes['ending-credits-continue'].onclick();
assert.equal(done,3,'continue button skips credits');
document.hidden=true;
assert.equal(api.play(),true,'credits can open while the tab is hidden');
assert.equal(timers.size,0,'hidden credits should not auto-finish');
document.hidden=false;
for(const fn of [...(listeners.visibilitychange||[])])fn();
assert.equal([...timers.values()][0].delay,14000);
nodes['ending-credits-continue'].onclick();
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const game=fs.readFileSync(path.join(root,'game.js'),'utf8');
assert.match(html,/id="ending-credits"/);
assert.match(html,/MẮT ĐỎ STUDIO/);
assert.match(html,/ending-credits\.js/);
assert.match(fs.readFileSync(path.join(root,'tools','build-css.js'),'utf8'),/ending-credits\.css/);assert.match(html,/game\.min\.css/);
assert.match(game,/function playEndingCredits\(which,checkpoint\)/);
assert.match(game,/const finish=\(\)=>playEndingCredits\(which,checkpoint\)/);
assert.match(game,/window\.EndingCredits\.isActive/);
assert.match(fs.readFileSync(path.join(root,'ending-credits.css'),'utf8'),/prefers-reduced-motion:reduce/);
console.log('OK: credits follow endings, studio branding, skip controls, timing and keyboard focus.');
