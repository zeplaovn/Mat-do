/* Verify achievement persistence, old saves, and close-ups without altering story progress. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..'),storage=new Map();
const nodes={};let lastModal='';
class Element{
 constructor(){this.children=[];this.classList={add(){},remove(){}}}
 appendChild(child){this.children.push(child);return child}
 setAttribute(){}
}
const document={getElementById:id=>nodes[id]||null,createElement:()=>new Element()};
const window={};
window.testModal=html=>{lastModal=html;for(const m of html.matchAll(/\bid="([^"]+)"/g))nodes[m[1]]=new Element()};
const context={window,document,localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v)},
 setTimeout:()=>0,clearTimeout(){},setInterval(){},clearInterval(){},requestAnimationFrame(){},matchMedia:()=>({matches:false}),console};
vm.createContext(context);
for(const file of ['assets/research/books-data.js','assets/dialogue/reviewed.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context);
let source=fs.readFileSync(path.join(root,'game.js'),'utf8').replace(/\nmount\(\);\s*\}\)\(\);\s*$/,`
showModal=window.testModal;hideModal=()=>{};modalButton=(label,action)=>({label,action});
render=()=>{};renderSidebar=()=>{};clearDialogue=()=>{};talk=()=>{};say=()=>{};toast=()=>{};playSound=()=>{};itemPop=()=>{};queueMemory=()=>{};
window.testGame={initialState,setState:s=>{state=s},getState:()=>state,SCENES,ACHIEVEMENTS,ACHIEVEMENT_KEY,SAVE_KEY,
 save,load,sig,syncAchievements,readAchievements,closeupInfo,showAchievements,act};})();`);
assert.ok(source.includes('window.testGame='));vm.runInContext(source,context);
const g=window.testGame;
let s=g.initialState();g.setState(s);g.save();assert.equal(g.readAchievements().unlocked.length,0);
// A signed save created before achievements should grant only milestones actually reached.
s.scene='BG09';s.visited.push('BG05','BG09');s.flags.gateOpened=true;s.relics.push('scarf');
const raw=JSON.stringify(s);storage.set(g.SAVE_KEY,JSON.stringify({d:raw,h:g.sig(raw)}));
const restored=g.load();g.setState(g.initialState());g.syncAchievements(false,restored);
assert.equal(g.getState().scene,'BG01','importing old milestones must not replace the active game');
let p=g.readAchievements();for(const id of ['shrine','gate','relic'])assert.ok(p.unlocked.includes(id));
assert.ok(!p.unlocked.includes('folk'),'old saves should not claim an unsolved new puzzle');
g.setState(g.initialState());g.save();p=g.readAchievements();assert.ok(p.unlocked.includes('gate'),'new game must keep achievements');
// Endings from separate playthroughs contribute to the collection, without duplicates.
for(const ending of ['bad','normal','good','true','true']){s=g.initialState();s.endingsSeen=[ending];g.setState(s);g.save()}
p=g.readAchievements();assert.equal(p.endings.length,4);assert.ok(p.unlocked.includes('endings'));
g.showAchievements();assert.match(lastModal,/12<\/strong>|\/ 12/);assert.match(lastModal,/Thành tựu bí ẩn/);
// Every positioned hotspot has a bounded crop; special artwork files are present.
for(const scene of Object.values(g.SCENES))for(const h of scene.spots){const c=g.closeupInfo(h);if(c.special)assert.ok(fs.existsSync(path.join(root,'assets/props',c.special.file)));else{assert.ok(c.zoom>=1.35&&c.zoom<=3);assert.ok(c.x>=0&&c.x<=100&&c.y>=0&&c.y<=100)}}
// Looking at the drawing still records the story clue, and taking the doll still awards it.
s=g.initialState();s.scene='BG28';s.flags.lamDone=true;s.flags.flashDone=true;g.setState(s);g.act('kidDrawing');
assert.ok(s.flags.names.includes('lua'));assert.match(lastModal,/Mo_Tranh_Sap\.webp/);assert.match(lastModal,/cô Lụa/);
s=g.initialState();s.scene='BG43';g.setState(s);g.act('takeDoll');assert.ok(s.items.includes('toyDoll'));assert.match(lastModal,/Mo_Bup_Be\.webp/);
s=g.initialState();s.scene='BG16';g.setState(s);g.act('comb');assert.ok(s.relics.includes('comb'));assert.match(lastModal,/Mo_Tram_Go\.webp/);
s=g.initialState();s.scene='BG02';g.setState(s);g.act('inspect:jar');assert.match(lastModal,/BG02\.webp/);assert.match(lastModal,/scene-closeup/);
console.log('OK: achievement migration, replay persistence, ending collection and positioned close-ups preserve story actions.');
