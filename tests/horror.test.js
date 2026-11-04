/* Run: node tests/horror.test.js [--no-canvas] */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const noCanvas=process.argv.includes('--no-canvas');
let fills=0,rafId=0;const callbacks=[],observers=new Map(),windowEvents={};
const canvasContext={createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData(){},clearRect(){},fillRect(){fills++}};
class Element{
 constructor(){this.className='';this.children=[];this.hidden=false;this.textContent='';this.clientWidth=390;this.clientHeight=219;this.offsetWidth=390;this.style={setProperty(){}};
  this.classList={contains:c=>this.className.split(/\s+/).includes(c),add:c=>{if(!this.classList.contains(c))this.className+=' '+c},remove:c=>{this.className=this.className.split(/\s+/).filter(x=>x!==c).join(' ')},toggle:(c,on)=>on?this.classList.add(c):this.classList.remove(c)};
 }
 setAttribute(){} getAttribute(){return 'true'} append(...v){this.children.push(...v)} appendChild(e){this.children.push(e)} insertBefore(e){this.children.push(e)} before(){} addEventListener(){} querySelector(){return new Element()} getContext(){return noCanvas?null:canvasContext} toDataURL(){return 'data:image/png;base64,AA=='}
}
const root=new Element(),stage=new Element(),hot=new Element(),title=new Element(),idx=new Element();
title.hidden=true;idx.textContent='BG01 / 47';
const button=new Element();button.parentElement=new Element();
const ids={'scene-stage':stage,'scene-image':new Element(),hotspots:hot,'title-screen':title,'scene-index':idx,'btn-audio':new Element(),'dialogue-text':new Element(),'modal-body':new Element(),'modal-backdrop':new Element(),'btn-new-game':button,'fx-turb':new Element(),'fx-disp':new Element()};
ids['modal-backdrop'].hidden=true;
const perf={level:'low',onChange(){}};
const context={document:{documentElement:root,hidden:false,body:{insertAdjacentHTML(){}},getElementById:id=>ids[id],createElement:()=>new Element(),querySelector:()=>null,addEventListener(){}},
 window:{Perf:perf,addEventListener:(type,fn)=>{windowEvents[type]=fn}},Perf:perf,
 matchMedia:()=>({matches:false,addEventListener(){}}),localStorage:{getItem:()=>null},ResizeObserver:undefined,
 MutationObserver:class{constructor(fn){this.fn=fn}observe(el){if(!observers.has(el))observers.set(el,[]);observers.get(el).push(this.fn)}},
 requestAnimationFrame:fn=>{callbacks.push(fn);return ++rafId},setTimeout:()=>1,clearTimeout(){},setInterval:()=>1,clearInterval(){},console};
vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(__dirname,'..','horror.js'),'utf8'),context);
assert.equal(typeof windowEvents.resize,'function','missing ResizeObserver must not stop horror effects');
assert.equal(typeof context.window.HorrorFX.scare,'function');
for(const cls of ['fx-fog','fx-dust','fx-vignette','fx-glitch','fx-flash'])assert.ok(stage.children.some(e=>e.className.includes(cls)),`${cls} should exist`);
for(const fn of observers.get(title)||[])fn();
if(!noCanvas){assert.ok(callbacks.length,'low-performance mode should start the dust loop');callbacks.shift()(100);assert.ok(fills>=14,'low-performance dust should draw');}
else assert.equal(callbacks.length,0,'effects should remain available when canvas is missing');
console.log(`OK: horror effects, low-performance dust and ResizeObserver fallback${noCanvas?' without canvas':''}.`);
