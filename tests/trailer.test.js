/* Run with: node tests/trailer.test.js
   Story & playback contract for the Mai 2026 asset-based trailer. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..');
const js=fs.readFileSync(path.join(root,'trailer.js'),'utf8');
const html=fs.readFileSync(path.join(root,'trailer.html'),'utf8');
const css=fs.readFileSync(path.join(root,'trailer.css'),'utf8');
class Element{
 constructor(){
  this.children=[];this.className='';this.hidden=false;this.textContent='';this.value='';
  this.style={setProperty:(k,v)=>{this.style[k]=v}};this.attrs={};this.listeners={};
  this.classList={
   contains:c=>this.className.split(/\s+/).includes(c),
   add:c=>{if(!this.classList.contains(c))this.className+=' '+c},
   remove:c=>{this.className=this.className.split(/\s+/).filter(x=>x!==c).join(' ')},
   toggle:(c,on)=>on?this.classList.add(c):this.classList.remove(c)
  };
 }
 get firstElementChild(){return this.children[0]}
 setAttribute(k,v){this.attrs[k]=v}
 appendChild(e){this.children.push(e)}
 replaceChildren(...es){this.children=es}
 addEventListener(type,fn){this.listeners[type]=fn}
 click(){this.dispatch('click')}
 dispatch(type,evt={}){this.listeners[type]?.({key:'',preventDefault(){},...evt})}
 focus(){}
 set innerHTML(value){this._html=value;this.children=[]}
 get innerHTML(){return this._html||''}
}
const idNames=['stage','start','end','player','hud','audio','seek','narrative','speaker','line','artifact',
 'intertitle','final-title','cut-flash','shot-counter','btn-play','btn-replay','btn-skip','btn-pause','btn-mute',
 'btn-fx','btn-share','player-time','player-duration','chapter-markers','load-status'];
const ids=Object.fromEntries(idNames.map(id=>[id,new Element()]));
ids.end.hidden=true;ids.player.hidden=true;ids.hud.hidden=true;
ids.audio.paused=true;ids.audio.readyState=0;ids.audio.currentTime=0;
ids.audio.play=function(){this.paused=false;return Promise.resolve()};
ids.audio.pause=function(){this.paused=true};
const plates=[new Element(),new Element()];
plates.forEach(el=>{el.className='plate';el.appendChild(new Element())});
let rafSeq=0;const frames=new Map();
const requestAnimationFrame=fn=>{const id=++rafSeq;frames.set(id,fn);return id};
const flush=()=>{const calls=[...frames.values()];frames.clear();calls.forEach(fn=>fn(120))};
const ImageStub=class{set src(_value){if(this.onload)this.onload()}};
const context={
 document:{
  hidden:false,
  getElementById:id=>ids[id],
  querySelectorAll:selector=>selector==='.plate'?plates:[],
  createElement:()=>new Element(),
  addEventListener(){}
 },
 Image:ImageStub,
 Audio:class{play(){return Promise.resolve()} pause(){}},
 performance:{now:()=>0},
 requestAnimationFrame,cancelAnimationFrame:id=>frames.delete(id),
 matchMedia:()=>({matches:false}),setTimeout:()=>0,
 navigator:{},console
};
vm.createContext(context);
vm.runInContext(js,context);
const time=Number(ids.seek.max);
assert.ok(time>70&&time<75,'trailer runtime should fit its music');
assert.equal(ids['chapter-markers'].children.length,4,'timeline chapters');
assert.match(html,/Trong ảnh có/,'photo contradiction hook');
assert.match(html,/Bắt đầu điều tra/,'end call to action');
assert.match(css,/\.evidence-board/,'document comparison must be illustrated');
assert.match(css,/\.choice-panel/,'ending decision must be illustrated');
const refs=[
 ...[...js.matchAll(/img:bg\('([^']+)'\)/g)].map(m=>'assets/background/'+m[1]+'.webp'),
 ...[...js.matchAll(/img:prop\('([^']+)'\)/g)].map(m=>'assets/props/'+m[1]+'.webp'),
 ...[...js.matchAll(/img:gp\('([^']+)'\)/g)].map(m=>'assets/trailer/'+m[1]+'.webp')
];
assert.ok(refs.length>=25,'broad image selection expected');
for(const file of refs)assert.ok(fs.existsSync(path.join(root,file)),'missing asset: '+file);
for(const file of ['gp3.webp','gp4.webp','gp5.webp'])assert.ok(!refs.some(x=>x.endsWith(file)),'outdated screenshot: '+file);
for(const file of ['Anh_Gieng_Hai_Bong.webp','Closeup02_Papers.webp','Hoi_Uc_Can_Ham_1988.webp','Closeup03_SquareSeal.webp']){
 assert.ok(refs.some(x=>x.endsWith(file)),'critical story asset missing: '+file);
}
for(const old of ["'ĐÔNG'","'NGUYỆT'","'SIM'","'ĐẠT'"])assert.ok(!js.includes(old),'outdated story label: '+old);
ids['btn-play'].dispatch('click');
assert.equal(ids.start.hidden,true);
assert.equal(ids.player.hidden,false);
ids['btn-pause'].dispatch('click');flush();
assert.equal(ids.audio.paused,true,'pausing must stop soundtrack');
function seekTo(t){
 ids.seek.value=String(t);ids.seek.dispatch('input');flush();
 return plates.find(x=>x.classList.contains('on'))?.firstElementChild?.style.backgroundImage;
}
assert.equal(seekTo(1),'url("assets/background/BG42.webp")');
assert.equal(seekTo(4),'url("assets/props/Anh_Gieng_Hai_Bong.webp")');
assert.match(ids.artifact.innerHTML,/CHI \/ ẢNH CHỤP/);
assert.equal(seekTo(23.4),'url("assets/trailer/gp1.webp")');
assert.equal(seekTo(25.8),'url("assets/trailer/gp2.webp")');
assert.equal(seekTo(36.3),'url("assets/props/Closeup02_Papers.webp")');
assert.match(ids.artifact.innerHTML,/Cùng một lời khấn/,'proof comparison must have a question');
assert.equal(seekTo(39.4),'url("assets/props/Closeup02_Papers.webp")');
assert.match(ids.artifact.innerHTML,/GHI VÀO HỒ SƠ/,'proof should lead to a documented finding');
assert.equal(seekTo(49),'url("assets/props/Hoi_Uc_So_Sach_1988.webp")');
assert.match(ids.artifact.innerHTML,/1986/,'timeline separates the historical events');
assert.equal(seekTo(65.2),'url("assets/props/POV_Gieng_Tram.webp")');
assert.match(ids.artifact.innerHTML,/Vẫn kéo ấn ra/);
assert.match(ids.artifact.innerHTML,/Dừng lại và điều tra tiếp/);
ids['btn-fx'].dispatch('click');
assert.ok(ids.stage.classList.contains('soft-fx'),'reduced motion option');
ids['btn-mute'].dispatch('click');
assert.equal(ids.audio.muted,true,'mute option');
ids['btn-skip'].dispatch('click');
assert.equal(ids.end.hidden,false);
assert.equal(ids.player.hidden,true);
ids['btn-replay'].dispatch('click');
assert.equal(ids.end.hidden,true);
assert.equal(ids.seek.value,'0');
console.log('OK: new story arc, asset evidence, gameplay mockups, choices, seek, pause, mute, replay.');
