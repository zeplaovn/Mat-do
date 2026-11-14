/* Deterministic checks for scene weather scheduling. Run: node tests/weather.test.js */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
let now=0,nextId=1,strokes=0;
const noCanvas=process.argv.includes('--no-canvas'),noObserver=process.argv.includes('--no-resize-observer');
const tasks=new Map(),observers=new Map(),events=[],windowEvents={};
const schedule=(fn,delay)=>{const id=nextId++;tasks.set(id,{at:now+Math.max(0,delay),fn});return id};
function advance(ms){
 const end=now+ms;
 for(;;){let chosen=null;for(const [id,task] of tasks)if(task.at<=end&&(!chosen||task.at<chosen.task.at))chosen={id,task};
  if(!chosen)break;tasks.delete(chosen.id);now=chosen.task.at;chosen.task.fn(now);
 }
 now=end;
}
const ctx2d={clearRect(){},stroke(){strokes++},beginPath(){},moveTo(){},lineTo(){},fillRect(){},createRadialGradient(){return {addColorStop(){}}}};
class Element{
 constructor(tag='div'){
  this.tag=tag;this.className='';this.children=[];this.dataset={};this.style={setProperty(){}};this.hidden=false;this.clientWidth=800;this.clientHeight=450;this.offsetWidth=800;
  this.classList={contains:c=>this.className.split(/\s+/).includes(c),add:c=>{if(!this.classList.contains(c)){this.className+=' '+c;if(c==='on')events.push({at:now,cls:this.className})}},remove:c=>{this.className=this.className.split(/\s+/).filter(x=>x!==c).join(' ')},toggle:(c,on)=>on?this.classList.add(c):this.classList.remove(c)};
 }
 setAttribute(){} appendChild(e){this.children.push(e)} insertBefore(e){this.children.push(e)} getContext(){return noCanvas?null:ctx2d} toDataURL(){return 'data:image/png;base64,AA=='}
}
const root=new Element('html'),stage=new Element(),hot=new Element(),idx=new Element(),title=new Element();
idx.textContent='BG01 / 47';title.hidden=true;
const byId={'scene-stage':stage,hotspots:hot,'scene-index':idx,'title-screen':title};
const trigger=el=>(observers.get(el)||[]).forEach(fn=>fn());
const motion={matches:false,addEventListener(type,fn){this.change=fn}};
const mobile={matches:true,addEventListener(type,fn){this.change=fn}};
const storage=new Map();
const math=Object.create(Math);math.random=()=>.5;
const context={document:{documentElement:root,hidden:false,getElementById:id=>byId[id],createElement:tag=>new Element(tag),addEventListener(){}},
 window:{Perf:{level:'low'},addEventListener:(type,fn)=>{windowEvents[type]=fn}},Perf:{level:'low'},localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v)},
 matchMedia:query=>query.includes('reduced-motion')?motion:mobile,performance:{now:()=>now},Math:math,
 ResizeObserver:noObserver?undefined:class{constructor(fn){this.fn=fn}observe(){}},
 MutationObserver:class{constructor(fn){this.fn=fn}observe(el){if(!observers.has(el))observers.set(el,[]);observers.get(el).push(this.fn)}},
 setTimeout:schedule,clearTimeout:id=>tasks.delete(id),requestAnimationFrame:fn=>schedule(fn,16),cancelAnimationFrame:id=>tasks.delete(id),console};
vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(__dirname,'..','js/weather.js'),'utf8'),context);
assert.ok(!stage.children.some(e=>e.className.includes('wx-fog')),'weather should not create a fog layer');
const scene=n=>{idx.textContent=`BG${String(n).padStart(2,'0')} / 47`;trigger(idx)};
const count=cls=>events.filter(e=>e.cls.includes(cls));
scene(9);advance(4000);
const cssRain=stage.children.find(e=>e.className.includes('wx-rain-css'));
const canvasRain=stage.children.find(e=>e.className.includes('wx-rain')&&!e.className.includes('wx-rain-css'));
assert.ok(cssRain.classList.contains('on'),'mobile should use the visible CSS rain layer');
assert.ok(!canvasRain.classList.contains('on'));
assert.equal(strokes,0,'mobile rain should not continuously redraw canvas');
if(noObserver)assert.equal(typeof windowEvents.resize,'function','older browsers need a resize fallback');
for(let i=0;i<10;i++){trigger(idx);advance(300)}
assert.equal(root.dataset.rain,'1');assert.equal(count('wx-bolt').length,1,'a storm should become visible soon even after repeated renders');
assert.ok(count('wx-bolt')[0].at>=4500&&count('wx-bolt')[0].at<8000);
mobile.matches=false;mobile.change();advance(500);
assert.equal(cssRain.classList.contains('on'),noCanvas,'CSS rain must remain available without canvas');
assert.equal(canvasRain.classList.contains('on'),!noCanvas,'desktop should use canvas when available');
if(!noCanvas)assert.ok(strokes>0,'desktop rain must draw');
mobile.matches=true;mobile.change();
scene(11);advance(3000);for(let i=0;i<7;i++){trigger(idx);advance(500)}advance(1000);
assert.ok(count('wx-lamp').length>=1,'same-scene renders must not postpone the light flicker');
context.window.WeatherFX.setEnabled(false);assert.equal(root.dataset.lightEffects,'off');
const before=events.length;advance(32000);assert.equal(events.length,before,'disabled lighting must not emit flashes');
context.window.WeatherFX.setEnabled(true);scene(38);advance(8000);
assert.ok(count('wx-bolt').length>=2,'heavy rain should trigger lightning');
const bolts=count('wx-bolt');assert.ok(bolts[1].at-bolts[0].at>=14000,'lightning must remain spaced out');
motion.matches=true;motion.change();const reduced=events.length;advance(35000);assert.equal(events.length,reduced,'reduced motion must suppress flicker and lightning');
console.log('OK: rain scenes, early lightning, repeated renders, indoor lights, light toggle and reduced motion.');
