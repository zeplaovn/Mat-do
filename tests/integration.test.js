/* Run with node tests/integration.test.js. No browser or external packages required. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const storage = new Map();
const context = {
  window: {}, document: { getElementById: () => null },
  localStorage: {getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v)},
  setTimeout, clearTimeout, setInterval, clearInterval,
  matchMedia: () => ({matches:false}), console
};
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root,'assets/research/books-data.js'),'utf8'),context);
vm.runInContext(fs.readFileSync(path.join(root,'assets/dialogue/reviewed.js'),'utf8'),context);
let script = fs.readFileSync(path.join(root,'js/game.js'),'utf8');
const end = /\nmount\(\);\s*\}\)\(\);\s*$/;
assert.match(script,end,'Could not find the game entry point');
script = script.replace(end, `
window.testGame = {SCENES, BOOKS, RESEARCH_PUZZLES, initialState, researchActiveSpots, researchCandidates,
 endingEligibility, memoryReady, load, sig, SAVE_KEY,
 setState:value=>{state=value}, getState:()=>state};
})();`);
vm.runInContext(script,context);
const g=context.window.testGame;
const puzzles=Object.values(g.RESEARCH_PUZZLES), books=Object.values(g.BOOKS);
assert.equal(books.length,18);
assert.equal(puzzles.length,25);
assert.equal(Object.keys(context.window.LNRT_DIALOGUE).length,103);
for(const b of books){
  assert.ok(g.SCENES[b.scene],`${b.id}: missing scene`);
  assert.ok(b.pages.length>1,`${b.id}: no pages`);
}
for(const p of puzzles){
  assert.ok(g.SCENES[p.scene],`${p.id}: missing scene`);
  assert.ok(p.requires.length>0,`${p.id}: no source documents`);
  for(const b of p.requires)assert.ok(g.BOOKS[b],`${p.id}: unknown required book ${b}`);
  assert.ok(p.spot.length===4&&p.spot.every(n=>Number.isFinite(n)&&n>=0&&n<=100),`${p.id}: bad coordinates`);
  if(p.kind==='sequence'){
    const answer=p.answer.split('|');
    assert.equal(answer.length,p.options.length,`${p.id}: incomplete sequence`);
    for(const part of answer)assert.ok(p.options.includes(part),`${p.id}: sequence answer unavailable`);
  }else if(p.kind==='multi'){
    assert.ok(p.answer.length>1,`${p.id}: multi answer too short`);
    for(const part of p.answer)assert.ok(p.options.includes(part),`${p.id}: option unavailable`);
  }else if(p.kind==='choice')assert.ok(p.options.includes(p.answer),`${p.id}: answer unavailable`);
  else if(p.kind==='code')assert.match(p.answer,/^\d{4}$/);
  else assert.fail(`${p.id}: unhandled puzzle kind`);
}
assert.equal(g.BOOKS.book_lua.protectedFinalFlag,'flashDone');
// Research markers must never cover any existing target, including gated targets.
const intersects=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
for(const scene of Object.keys(g.SCENES)){
  const state=g.initialState();state.scene=scene;state.flags=new Proxy({flashDone:true,sealRecovered:true,researchSolved:[]},{get:(o,k)=>k in o?o[k]:true});g.setState(state);
  const existing=g.SCENES[scene].spots;const additions=g.researchActiveSpots();
  for(const added of additions){
    for(const old of existing)assert.ok(!intersects(added,old),`${scene}: ${added.action} overlaps ${old.action}`);
    for(const other of additions)if(other!==added)assert.ok(!intersects(added,other),`${scene}: new targets overlap`);
  }
  assert.ok(additions.length<=g.researchCandidates().length);
}
// GOOD and TRUE must stay locked until their evidence and cross-document puzzles are complete.
let state=g.initialState();state.flags={...state.flags,ritualDone:true,sixthDone:true,flashDone:true,lamDone:true,namesDone:true,scrollCompared:true,sealRecovered:true,datTrust:true};
state.evidence=['ledger','confession','archive','scrollProof'];state.items.push('simLetter','familyRecord');
state.flags.researchSolved=['pz_thong_gio','pz_ta_so'];g.setState(state);
assert.equal(g.endingEligibility().canGood,false,'Lụa confirmation must not be skipped');
state.flags.researchSolved.push('pz_chu_lua');assert.equal(g.endingEligibility().canGood,true);assert.equal(g.endingEligibility().canTrue,false);
state.flags.researchSolved.push('pz_dau_an');assert.equal(g.endingEligibility().canTrue,false,'the new story still needs its hidden evidence');
const trueFlags=['waterBookSeen','reverseSealSeen','visionDam','visionBanyan','visionWell','visionAltar','relicsVerified','returnNamesDone','truthBoardDone','nguyenConfessed'];
for(const flag of trueFlags){state.flags[flag]=true;assert.equal(g.endingEligibility().canTrue,flag==='nguyenConfessed',flag+' must be required');}
for(const flag of trueFlags){state.flags[flag]=false;assert.equal(g.endingEligibility().canTrue,false,flag+' must not be skippable');state.flags[flag]=true;}
// Camera observation is needed before the trâm memory, even if its relic was already picked up.
state=g.initialState();state.relics.push('comb');g.setState(state);assert.equal(g.memoryReady('comb'),false);state.flags.mirrorPhoto=true;assert.equal(g.memoryReady('comb'),true);
// A signed save from the current story loads without losing scene, items or flags.
state=g.initialState();state.scene='BG13';state.items.push('spoon');state.relics.push('spoon');state.flags.customProgress=true;state.endingsSeen=['forgive'];
const data=JSON.stringify(state);storage.set(g.SAVE_KEY,JSON.stringify({d:data,h:g.sig(data)}));const restored=g.load();
assert.equal(restored.scene,'BG13');assert.ok(restored.items.includes('spoon'));assert.equal(restored.flags.customProgress,true);assert.equal(restored.endingsSeen.length,0);assert.ok(restored.flags.legacyEndingsSeen.includes('forgive'));
// Older signed saves automatically discard books whose entire puzzle chain is finished.
const legacy=g.initialState();legacy.items.push('book_duong','book_mieu','phongThuyBook');
legacy.flags.researchSolved=['pz_duong_lang','pz_bia_cau','pz_danh_xung'];
legacy.flags.waterBookSeen=true;
const oldData=JSON.stringify(legacy);storage.set(g.SAVE_KEY,JSON.stringify({d:oldData,h:g.sig(oldData)}));
const migrated=g.load();
assert.ok(!migrated.items.includes('book_duong'));
assert.ok(!migrated.items.includes('phongThuyBook'));
assert.ok(migrated.items.includes('book_mieu'),'book_mieu has further puzzles');
assert.ok(migrated.used.includes('book_duong')&&migrated.used.includes('phongThuyBook'));
assert.ok(migrated.notes.some(n=>n.id==='researchArchived_book_duong'));
console.log(`OK: ${books.length} books, ${puzzles.length} puzzles, ${Object.keys(g.SCENES).length} scenes, memory and ending gates, current-save compatibility.`);
