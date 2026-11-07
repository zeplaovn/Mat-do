/* Exercise every document puzzle with missing, wrong and correct answers. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
let nodes={},modal=null;
class Element{
 constructor(tag='div'){this.tagName=tag.toUpperCase();this.children=[];this.events={};this.className='';this.textContent='';this.value='';this.disabled=false;this.style={};this.offsetWidth=10;
  this.classList={add(){},remove(){},toggle(){}}}
 appendChild(e){this.children.push(e);return e}append(...es){this.children.push(...es)}
 setAttribute(){}focus(){}closest(){return null}querySelector(){return null}
 addEventListener(type,fn){this.events[type]=fn}dispatch(type,event={}){if(this.events[type])this.events[type]({preventDefault(){},stopPropagation(){},...event});if(this['on'+type])this['on'+type](event)}
 click(){if(!this.disabled)this.dispatch('click')}
}
const document={activeElement:null,getElementById:id=>nodes[id]||null,createElement:tag=>new Element(tag),querySelector:selector=>selector==='.research-puzzle-ui'?nodes.puzzleRoot||null:null};
const window={};
window.showModalStub=(html,kicker,type)=>{nodes={};for(const m of html.matchAll(/\bid="([^"]+)"/g))nodes[m[1]]=new Element();if(html.includes('research-puzzle-ui'))nodes.puzzleRoot=new Element();modal={type,html}};
const context={window,document,localStorage:{getItem:()=>null,setItem(){}},setTimeout,clearTimeout,setInterval,clearInterval,requestAnimationFrame(){},matchMedia:()=>({matches:false}),console};
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root,'assets/research/books-data.js'),'utf8'),context);
vm.runInContext(fs.readFileSync(path.join(root,'assets/dialogue/reviewed.js'),'utf8'),context);
let game=fs.readFileSync(path.join(root,'game.js'),'utf8');
game=game.replace(/\nmount\(\);\s*\}\)\(\);\s*$/,`
showModal=window.showModalStub;hideModal=()=>{};render=()=>{};talk=()=>{};say=()=>{};toast=()=>{};playSound=()=>{};save=()=>{};
window.qa={BOOKS,RESEARCH_PUZZLES,initialState,openResearchPuzzle,researchCandidates,retireCompletedResearchBooks,setState:s=>{state=s},getState:()=>state};
})();`);
assert.ok(game.includes('window.qa='),'game entry point not found');vm.runInContext(game,context);
const qa=window.qa;
const option=text=>{const b=nodes['research-puzzle-options'].children.find(e=>e.textContent===text);assert.ok(b,`missing option ${text}`);b.click()};
const action=text=>{const b=nodes['research-puzzle-actions'].children.find(e=>e.textContent===text);assert.ok(b,`missing action ${text}`);b.click()};
function submit(p,answer){
 if(p.kind==='choice'){option(answer);return}
 if(p.kind==='code'){const input=nodes['research-puzzle-options'].children.find(e=>e.tagName==='INPUT');assert.ok(input);input.value=answer;input.dispatch('input');action('Kiểm tra đáp án');return}
 for(const value of answer)option(value);
 if(p.kind==='multi')action('Kiểm tra đáp án');
}
for(const p of Object.values(qa.RESEARCH_PUZZLES)){
 const state=qa.initialState();state.scene=p.scene;state.items.push(...p.requires);if(p.requiresFlag)state.flags[p.requiresFlag]=true;
 state.flags.researchPageViews={book_lua:[qa.BOOKS.book_lua.pages.length-1],book_bep:[2]};qa.setState(state);
 if(p.requiresFlag){state.flags[p.requiresFlag]=false;modal=null;qa.openResearchPuzzle(p.id);assert.equal(modal,null,`${p.id}: required story flag must block the puzzle`);state.flags[p.requiresFlag]=true;}
 const missing=p.requires[0];state.items=state.items.filter(x=>x!==missing);qa.openResearchPuzzle(p.id);
 assert.equal(modal.type,'research-need',`${p.id}: missing source must block the puzzle`);
 assert.ok(!(state.flags.researchSolved||[]).includes(p.id));state.items.push(missing);
 /* Chứng cứ cụ thể: chưa đọc các trang trích dẫn thì chưa được đối chiếu */
 assert.ok(Array.isArray(p.evidence)&&p.evidence.length>=1,`${p.id}: needs concrete evidence pages`);
 for(const e of p.evidence){assert.ok(p.requires.includes(e.book),`${p.id}: evidence book must be a required source`);assert.ok(qa.BOOKS[e.book].pages[e.page],`${p.id}: evidence page must exist`)}
 const keepViews=state.flags.researchPageViews;state.flags.researchPageViews={};
 modal=null;qa.openResearchPuzzle(p.id);assert.equal(modal.type,'research-need',`${p.id}: unread evidence pages must block the puzzle`);
 const views={book_lua:keepViews.book_lua,book_bep:keepViews.book_bep};for(const e of p.evidence){views[e.book]=[...(views[e.book]||[]),e.page]}state.flags.researchPageViews=views;
 qa.openResearchPuzzle(p.id);assert.equal(modal.type,'research-puzzle',`${p.id}: should open with its sources`);
 assert.ok(/CHỨNG CỨ ĐỐI CHIẾU/.test(modal.html||modal.body||JSON.stringify(modal)),`${p.id}: evidence quotes must be shown`);
 const art=modal.html.match(/class="research-puzzle-art" src="([^"]+)"/);
 assert.ok(art&&fs.existsSync(path.join(root,art[1])),`${p.id}: the puzzle image must exist`);
 let wrong;
 if(p.kind==='code')wrong=p.answer==='0000'?'1111':'0000';
 else if(p.kind==='choice')wrong=p.options.find(x=>x!==p.answer);
 else if(p.kind==='sequence')wrong=p.answer.split('|').reverse();
 else wrong=[...p.answer.slice(0,-1),p.options.find(x=>!p.answer.includes(x))];
 submit(p,wrong);assert.ok(!(state.flags.researchSolved||[]).includes(p.id),`${p.id}: accepted a wrong answer`);
 assert.match(nodes['research-puzzle-status'].textContent,/Chưa khớp/,`${p.id}: missing wrong-answer feedback`);
 const correct=p.kind==='sequence'?p.answer.split('|'):p.answer;
 submit(p,correct);assert.ok(state.flags.researchSolved.includes(p.id),`${p.id}: did not accept the correct answer`);
 assert.ok(state.notes.some(n=>n.id==='researchSolved_'+p.id),`${p.id}: missing saved clue`);
 if(p.rewardEvidence)assert.ok(state.evidence.includes(p.rewardEvidence),`${p.id}: missing evidence`);
 for(const id of p.requires){
  const remaining=Object.values(qa.RESEARCH_PUZZLES).some(other=>other.id!==p.id&&other.requires.includes(id));
  const gated=qa.BOOKS[id].protectedFinalFlag&&!state.flags[qa.BOOKS[id].protectedFinalFlag];
  if(!remaining&&!gated){
   assert.ok(!state.items.includes(id),`${p.id}: completed book ${id} should leave the inventory`);
   assert.ok(state.used.includes(id),`${p.id}: used book ${id} must not respawn`);
   assert.ok(state.notes.some(n=>n.id==='researchArchived_'+id),`${p.id}: archived text of ${id} is missing`);
  }else{
   assert.ok(state.items.includes(id),`${p.id}: ${id} is still needed for another puzzle or hidden page`);
  }
 }
}
// A shared source only retires when its last dependent puzzle is solved.
const shared=qa.initialState();shared.scene='BG05';shared.items.push('book_mieu');qa.setState(shared);
const mieuDependencies=Object.values(qa.RESEARCH_PUZZLES).filter(p=>p.requires.includes('book_mieu')).map(p=>p.id);
shared.flags.researchSolved=mieuDependencies.slice(0,-1);
assert.equal(qa.retireCompletedResearchBooks(shared).length,0,'shared book must stay until all puzzles finish');
assert.ok(shared.items.includes('book_mieu'));
shared.flags.researchSolved.push(mieuDependencies.at(-1));
assert.deepEqual(Array.from(qa.retireCompletedResearchBooks(shared)),['book_mieu']);
assert.ok(!shared.items.includes('book_mieu'));
assert.ok(shared.used.includes('book_mieu'));
assert.ok(shared.notes.some(n=>n.id==='researchArchived_book_mieu'&&n.body.includes('Rừng')));
assert.ok(!qa.researchCandidates().some(c=>c.id==='book_mieu'),'retired books cannot be collected a second time');
assert.equal(qa.retireCompletedResearchBooks(shared).length,0,'retirement must be idempotent');
// The hidden final diary page is not lost before the flashback.
const protectedDiary=qa.initialState();protectedDiary.items.push('book_lua');
protectedDiary.flags.researchSolved=['pz_chu_lua'];
assert.equal(qa.retireCompletedResearchBooks(protectedDiary).length,0);
protectedDiary.flags.flashDone=true;
assert.deepEqual(Array.from(qa.retireCompletedResearchBooks(protectedDiary)),['book_lua']);
assert.ok(protectedDiary.notes.some(n=>n.id==='researchArchived_book_lua'));
// Older saves with the reflective page solved should not keep the grimoire.
const oldGrimoire=qa.initialState();oldGrimoire.items.push('phongThuyBook');
oldGrimoire.flags.waterBookSeen=true;
assert.deepEqual(Array.from(qa.retireCompletedResearchBooks(oldGrimoire)),['phongThuyBook']);
assert.ok(oldGrimoire.used.includes('phongThuyBook'));
const yearPages=qa.BOOKS.book_balam.pages.map(p=>p.join(' ')).join(' ');
assert.match(yearPages,/1988/,'the 1988 code must be discoverable in Bá Lâm’s diary');
const lua=qa.initialState();lua.scene='BG43';lua.items.push('book_lua');lua.flags.flashDone=true;qa.setState(lua);qa.openResearchPuzzle('pz_chu_lua');
assert.equal(modal.type,'research-need','Lụa’s protected page must be read after the flashback');
const bowl=qa.initialState();bowl.scene='BG13';bowl.items.push('book_bep');qa.setState(bowl);qa.openResearchPuzzle('pz_sau_bat');
assert.equal(modal.type,'research-need','the bowl puzzle must not reveal the count before the kitchen diary is read');
assert.doesNotMatch(modal.html,/năm người|năm bát|5 người|5 bát/i);
bowl.flags.researchPageViews={book_bep:[1,2]};qa.openResearchPuzzle('pz_sau_bat');
assert.equal(modal.type,'research-puzzle','the bowl puzzle should open after the relevant diary page is read');
console.log(`OK: all ${Object.keys(qa.RESEARCH_PUZZLES).length} document puzzles reject missing/wrong answers, accept correct answers and save their rewards.`);
