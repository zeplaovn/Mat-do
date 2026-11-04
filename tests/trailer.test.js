/* Run: node tests/trailer.test.js */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
let rafId=0;const frames=new Map();
const requestAnimationFrame=fn=>{const id=++rafId;frames.set(id,fn);return id};
const flush=()=>{const pending=[...frames.values()];frames.clear();pending.forEach(fn=>fn(100))};
class Element{
 constructor(){this.children=[];this.className='';this.hidden=false;this.textContent='';this.value='';this.attrs={};this.style={setProperty:(k,v)=>{this.style[k]=v}};this.listeners={};
  this.classList={contains:c=>this.className.split(/\s+/).includes(c),add:c=>{if(!this.classList.contains(c))this.className+=' '+c},remove:c=>{this.className=this.className.split(/\s+/).filter(x=>x!==c).join(' ')},toggle:(c,on)=>on?this.classList.add(c):this.classList.remove(c)};
 }
 get firstElementChild(){return this.children[0]} setAttribute(k,v){this.attrs[k]=v} append(...es){this.children.push(...es)} appendChild(e){this.children.push(e)} replaceChildren(...es){this.children=es}
 addEventListener(type,fn){this.listeners[type]=fn} dispatch(type){this.listeners[type]?.({key:''})} focus(){}
}
const ids=Object.fromEntries(['stage','start','end','player','hud','audio','seek','caps','player-duration','player-time','flash','btn-play','btn-replay','btn-skip','btn-pause','btn-mute'].map(k=>[k,new Element()]));
ids.start.hidden=false;ids.end.hidden=true;ids.player.hidden=true;ids.hud.hidden=true;
ids.audio.paused=true;ids.audio.play=function(){this.paused=false;return Promise.resolve()};ids.audio.pause=function(){this.paused=true};
const layers=[new Element(),new Element()];layers.forEach(e=>{e.className='shot';e.appendChild(new Element())});
const context={document:{hidden:false,getElementById:id=>ids[id],querySelectorAll:()=>layers,createElement:()=>new Element(),addEventListener(){}},
 Image:class{},performance:{now:()=>0},requestAnimationFrame,cancelAnimationFrame:id=>frames.delete(id),console};
vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(__dirname,'..','trailer.js'),'utf8'),context);
ids['btn-play'].dispatch('click');ids['btn-pause'].dispatch('click');flush();
assert.ok(ids.audio.paused,'pause should pause audio');
const original=[['01',1.6],['01',6.5],['09',6.5],['11',5.5],['12',5],['11',6],['16',5.5],['13',2.2],['20',2.2],['27',2.2],['21',2.4],['29',6],['32',5.5],['32',1.2],['33',5.5]];
let start=0;
for(const [bg,duration] of original){
 const position=start+Math.min(duration/2,1);ids.seek.value=String(position);ids.seek.dispatch('input');flush();
 const visible=layers.find(x=>x.classList.contains('on'));
 assert.ok(visible,`no frame at ${position}`);assert.equal(visible.firstElementChild.style.backgroundImage,`url("assets/background/BG${bg}.webp")`);
 assert.ok(fs.existsSync(path.join(__dirname,'..','assets','background',`BG${bg}.webp`)),`missing original image BG${bg}`);
 assert.ok(Math.abs(ids.audio.currentTime-position)<.001,'audio should follow seeking');start+=duration;
}
assert.ok(Math.abs(Number(ids.seek.max)-start)<.001,'duration should match the original shot sequence');
ids.seek.value='28.5';ids.seek.dispatch('input');flush();
assert.equal(ids.caps.children.at(-1).children.length,5,'five original portraits should be present');
ids['btn-skip'].dispatch('click');assert.equal(ids.end.hidden,false);assert.equal(ids.player.hidden,true);assert.equal(ids.caps.children.length,0,'ended trailer should not expose old captions');
ids['btn-replay'].dispatch('click');assert.equal(ids.end.hidden,true);assert.equal(ids.seek.value,'0');
console.log('OK: original trailer shots, images, seeking, audio, portraits, skip and replay.');
