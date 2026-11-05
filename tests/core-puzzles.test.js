/* Exercise the game’s interactive puzzle mechanics without a browser. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
let nodes={},raf=[],timers=[],lastModal='',lastHTML='';
class Element{
 constructor(tag='div'){this.tagName=tag.toUpperCase();this.children=[];this.events={};this.attrs={};this.className='';this._text='';this.style={setProperty(){}};this.disabled=false;this.offsetWidth=10;this.value='';this.classList={add(){},remove(){},toggle(){}}}
 get textContent(){return this._text}set textContent(v){this._text=String(v);this.children=[]}
 get firstChild(){return this.children[0]||null}
 set innerHTML(v){this._html=v;this.children=[]}get innerHTML(){return this._html||''}
 appendChild(e){this.children.push(e);return e}append(...es){this.children.push(...es)}replaceChildren(...es){this.children=[...es]}setAttribute(k,v){this.attrs[k]=String(v)}
 addEventListener(type,fn){this.events[type]=fn}focus(){}select(){}closest(){return null}querySelector(){return null}
 dispatch(type,event={}){if(this.events[type])this.events[type]({preventDefault(){},stopPropagation(){},...event});if(this['on'+type])this['on'+type](event)}
 click(){if(!this.disabled)this.dispatch('click')}
}
const document={activeElement:null,getElementById:id=>nodes[id]||null,createElement:tag=>new Element(tag),querySelector:sel=>sel==='.lock-wheels'?nodes.lockWheels||null:null};
const window={},storage=new Map();
window.showModalStub=(html,kicker,type)=>{nodes={};for(const m of html.matchAll(/\bid="([^"]+)"/g))nodes[m[1]]=new Element();nodes['modal-body']=new Element();if(html.includes('lock-wheels'))nodes.lockWheels=new Element();lastModal=type;lastHTML=html};
const math=Object.create(Math);math.random=()=>.5;
const context={window,document,localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v)},Math:math,
 setTimeout:fn=>{timers.push(fn);return timers.length},clearTimeout(){},setInterval(){},clearInterval(){},requestAnimationFrame:fn=>{raf.push(fn);return raf.length},matchMedia:()=>({matches:false}),console};
vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(root,'assets/research/books-data.js'),'utf8'),context);vm.runInContext(fs.readFileSync(path.join(root,'assets/dialogue/reviewed.js'),'utf8'),context);
let game=fs.readFileSync(path.join(root,'game.js'),'utf8').replace(/\nmount\(\);\s*\}\)\(\);\s*$/,`
showModal=window.showModalStub;hideModal=()=>{};render=()=>{};renderSidebar=()=>{};clearDialogue=()=>{};talk=()=>{};say=()=>{};toast=()=>{};playSound=()=>{};save=()=>{};itemPop=()=>{};queueMemory=()=>{};go=x=>{state.scene=x};
window.qa={initialState,setState:s=>{state=s},act,selectItem,load,sig,SAVE_KEY,USE_ON,showLock,showCipher,showClockPuzzle,showAssemble,showOrder,showBreath,toyShelf,tornPhoto,hatchLock,showWall,showSixth,placeRelic,showGraves,showLam,GLYPH_ORDER,RELIC_ORDER};})();`);
assert.ok(game.includes('window.qa='));vm.runInContext(game,context);const q=window.qa;
const reset=(items=[])=>{const s=q.initialState();s.items.push(...items);q.setState(s);timers=[];raf=[];return s};
const button=(container,label)=>{const b=nodes[container].children.find(e=>e.textContent===label);assert.ok(b,`${container}: ${label}`);return b};
const runTimers=()=>{const run=timers;timers=[];run.forEach(fn=>fn())};
let s=reset();let opened=0;q.showLock({title:'Két',kicker:'TEST',type:'safe',code:'0317',plate:'',hint:'Mã',onOpen:()=>opened++});
for(const [i,d] of [...'0317'].entries())nodes.lockWheels.children[i].dispatch('keydown',{key:d});runTimers();assert.equal(opened,1,'number lock must open for the correct code');
s=reset();q.showCipher();button('cp-actions','XÁC NHẬN').click();assert.ok(!s.flags.cipherDone,'wrong cipher must not open');for(let i=0;i<7;i++)nodes['cp-next'].click();button('cp-actions','XÁC NHẬN').click();assert.ok(s.flags.cipherDone&&s.items.includes('fragB'));
s=reset();q.showClockPuzzle();button('ck-actions','XÁC NHẬN').click();assert.ok(!s.flags.clockDrawer);nodes['h-'].click();for(let i=0;i<3;i++)nodes['m-'].click();button('ck-actions','XÁC NHẬN').click();assert.ok(s.flags.clockDrawer&&s.items.includes('fragA'));
s=reset(['fragA','fragB','fragC']);q.showAssemble();nodes['asm-strips'].children[0].click();nodes['asm-strips'].children[1].click();nodes['asm-strips'].children[1].click();nodes['asm-strips'].children[2].click();assert.ok(s.items.includes('petition')&&s.relics.includes('petition'));assert.ok(['fragA','fragB','fragC'].every(id=>!s.items.includes(id)));runTimers();
s=reset();let ordered=0;q.showOrder({title:'Sắp thứ tự',intro:'',items:['A','B','C'],start:[2,0,1],onDone:()=>ordered++});nodes['ord-box'].children[0].click();nodes['ord-box'].children[1].click();nodes['ord-box'].children[1].click();nodes['ord-box'].children[2].click();runTimers();assert.equal(ordered,1);
s=reset(['toyDoll','paperCrane','toyCart','chalkStub']);q.toyShelf();
const toy=name=>{const b=nodes['sl-tray'].children.find(e=>e.children.some(c=>c.textContent===name));assert.ok(b,name);b.click()};
const slot=n=>nodes['sl-row'].children[n-1].click();
for(const [name,n] of [['Xe gỗ đồ chơi',1],['Hạc giấy',2],['Búp bê vải của Mơ',3],['Viên phấn trắng',4]]){toy(name);slot(n)}assert.ok(!s.flags.shelfOpen);assert.match(nodes['sl-msg'].textContent,/chưa đúng/);
slot(1);slot(3);toy('Búp bê vải của Mơ');slot(1);toy('Xe gỗ đồ chơi');slot(3);assert.ok(s.flags.shelfOpen&&s.items.includes('legendDoc'));runTimers();
s=reset();q.tornPhoto();nodes.jig.children[0].click();nodes.jig.children[1].click();assert.ok(s.flags.photoBack&&s.items.includes('backDoc'),'photo puzzle should award the back of the photo');runTimers();
s=reset();q.hatchLock();for(const [i,id] of ['pen','scale','note','flame','wave'].entries()){const n=Array.from(q.GLYPH_ORDER).indexOf(id);for(let j=0;j<n;j++)nodes.gl.children[i].click()}assert.ok(s.flags.cellOpen,'glyph order should open the hatch');runTimers();
s=reset(['crowbar']);q.showWall();assert.equal(nodes['break-wall'].disabled,true);for(let i=0;i<5;i++)nodes.handprints.children.find(e=>!e.disabled).click();assert.equal(nodes['break-wall'].disabled,false);nodes['break-wall'].click();assert.ok(s.flags.wallOpened&&!s.items.includes('crowbar')&&s.scene==='BG20');
s=reset(['musicbox']);q.showSixth();nodes['six-input'].value='sai';nodes['six-submit'].click();assert.ok(!s.flags.sixthDone);nodes['six-input'].value='Lâm Thị Mơ';nodes['six-submit'].click();assert.ok(s.flags.sixthDone&&!s.items.includes('musicbox'));
s=reset(['incense','scarf','spoon','comb','petition','sandals']);s.relics.push('scarf','spoon','comb','petition','sandals');q.placeRelic('scarf');q.placeRelic('comb');assert.equal(s.ritualProgress.length,0);assert.ok(s.items.includes('scarf'),'a wrong ritual choice must return placed relics');for(const id of q.RELIC_ORDER)q.placeRelic(id);assert.ok(s.flags.ritualDone&&s.flags.awakened);
s=reset(['incense5']);s.flags.lamDone=true;s.flags.flashDone=true;s.flags.names=['tam','hai','khoa','sen','lua'];s.selectedItem='incense5';q.showGraves();button('name-options','Lê Văn Hải').click();assert.ok(!s.flags.namesDone);for(const name of ['Nguyễn Văn Tâm','Lê Văn Hải','Đỗ Văn Khoa','Trần Thị Sen','Phạm Thị Lụa'])button('name-options',name).click();assert.ok(s.flags.namesDone&&!s.items.includes('incense5'));
s=reset(['testimony']);s.evidence.push('ledger','confession','testimony');q.showLam();button('lam-options','Bản thú tội trong hộp sắt').click();assert.ok(!s.flags.lamDone);q.showLam();for(const name of ['Sổ vật tư năm 1988','Bản thú tội trong hộp sắt','Lời khai của bà Mận'])button('lam-options',name).click();assert.ok(s.flags.lamDone&&!s.items.includes('testimony'));
function needleAt(fps){reset();q.showBreath(()=>{});const frames=fps;for(let i=0;i<=frames;i++){const fn=raf.shift();assert.ok(fn);fn(i*1000/fps)}return parseFloat(nodes['br-needle'].style.left)}
const p60=needleAt(60),p120=needleAt(120);assert.ok(Math.abs(p60-p120)<.2,`breathing speed differs: ${p60} vs ${p120}`);
reset();let breathDone=0;q.showBreath(()=>breathDone++);button('br-actions','THỞ').click();assert.match(nodes['br-msg'].textContent,/0 \/ 3/);for(let i=0;i<=75;i++){const fn=raf.shift();fn(i*1000/60)}for(let i=0;i<3;i++)button('br-actions','THỞ').click();assert.equal(breathDone,1,'breathing puzzle must remain solvable after a mistake');
s=reset();s.scene='BG07';q.act('marker');assert.ok(!s.items.includes('key'),'the new stone mechanism must not open without its clue');
s.scene='BG46';q.act('folkOffering');for(let i=0;i<4;i++)nodes['folk-slots'].children[i].click();button('folk-actions','Kiểm tra').click();assert.ok(!s.flags.folkOfferingDone);assert.match(nodes['folk-status'].textContent,/chưa|im/i);
button('folk-actions','Đặt lại').click();for(const [i,n] of [1,2,3,4].entries())for(let j=0;j<n;j++)nodes['folk-slots'].children[i].click();button('folk-actions','Kiểm tra').click();assert.ok(s.flags.folkOfferingDone&&s.items.includes('folkPrint'));assert.ok(s.notes.some(n=>n.id==='folkPrint'));
q.selectItem('folkPrint');assert.equal(lastModal,'doc');button('doc-actions','Cầm giấy để đối chiếu').click();assert.equal(s.selectedItem,'folkPrint');assert.ok(q.USE_ON.folkPrint.includes('marker'));
s.scene='BG07';q.act('marker');assert.match(lastHTML,/Xem mảnh giấy dó/,'the stone puzzle should let players review the clue');for(let i=0;i<4;i++)nodes['folk-slots'].children[i].click();button('folk-actions','Kiểm tra').click();assert.ok(!s.items.includes('key'));
button('folk-actions','Đặt lại').click();for(const [i,n] of [4,3,2,1].entries())for(let j=0;j<n;j++)nodes['folk-slots'].children[i].click();button('folk-actions','Kiểm tra').click();assert.ok(s.flags.folkMarkerDone&&s.items.includes('key'));assert.equal(s.selectedItem,null);
s.scene='BG08';q.act('gate');assert.ok(s.flags.gateOpened&&s.used.includes('key'),'the earned key must open the existing gate');
const legacy=q.initialState();legacy.scene='BG07';legacy.items.push('key');const legacyJson=JSON.stringify(legacy);storage.set(q.SAVE_KEY,JSON.stringify({d:legacyJson,h:q.sig(legacyJson)}));const restored=q.load();q.setState(restored);q.act('marker');assert.ok(restored.items.includes('key'),'existing saves must keep their key');restored.scene='BG08';q.act('gate');assert.ok(restored.flags.gateOpened,'existing saves with a key must still pass the gate');
console.log('OK: linked shrine and stone puzzles, legacy saves, locks, cipher, clock, assembly, toys, glyphs, ritual, graves and 60/120 Hz breathing.');
