/* Verify that an interaction view follows dialogue without changing story state. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
class ClassList{
 constructor(){this.values=new Set()}
 add(x){this.values.add(x)}remove(x){this.values.delete(x)}contains(x){return this.values.has(x)}
 toggle(x,on){if(on===undefined)on=!this.values.has(x);if(on)this.add(x);else this.remove(x);return on}
}
class Element{
 constructor(){this.hidden=false;this.classList=new ClassList();this.textContent='';this.innerHTML='';this.complete=false;this.naturalWidth=0;this.style={};this.children=[]}
 appendChild(x){this.children.push(x);return x}setAttribute(){}focus(){}
}
const nodes={};for(const id of ['interaction-view','app-shell','scene-stage','scene-backdrop','dialogue','dialogue-next','dialogue-portrait-wrap','dialogue-portrait','dialogue-symbol','dialogue-speaker','dialogue-text','chatter'])nodes[id]=new Element();
const column=new Element();column.scrollLeft=0;
const document={getElementById:id=>nodes[id]||null,createElement:()=>new Element(),querySelector:s=>s==='.game-column'?column:null};
const window={};const context={window,document,localStorage:{getItem:()=>null,setItem(){}},setTimeout:()=>0,clearTimeout(){},setInterval(){},clearInterval(){},requestAnimationFrame(){},matchMedia:()=>({matches:false}),console};
vm.createContext(context);
for(const file of ['assets/research/books-data.js','assets/dialogue/reviewed.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context);
const script=fs.readFileSync(path.join(root,'game.js'),'utf8').replace(/\nmount\(\);\s*\}\)\(\);\s*$/,`
render=()=>{};renderSidebar=()=>{};hideModal=()=>{};playSound=()=>{};save=()=>{};itemPop=()=>{};queueMemory=()=>{};toast=()=>{};
window.testGame={initialState,setState:s=>{state=s},act,nextLine,clearDialogue,showLine,showInteractionView,INTERACTION_VIEWS};})();`);
assert.ok(script.includes('window.testGame='));vm.runInContext(script,context);const g=window.testGame;
for(const config of Object.values(g.INTERACTION_VIEWS))assert.ok(fs.existsSync(path.join(root,'assets/props',config.file)),config.file);
const view=nodes['interaction-view'],shell=nodes['app-shell'];
let s=g.initialState();s.flags.oldwomanTalked=true;g.setState(s);column.scrollLeft=310;g.act('warning');
assert.equal(nodes['dialogue'].hidden,false);assert.match(view.src,/POV_Ba_Ban_Nuoc/);shell.scrollTop=76;nodes['scene-stage'].scrollTop=14;view.onload();assert.equal(view.hidden,false);assert.ok(shell.classList.contains('interaction-active'));
assert.equal(shell.scrollTop,0);assert.equal(nodes['scene-stage'].scrollTop,0);assert.match(nodes['scene-backdrop'].style.backgroundImage,/POV_Ba_Ban_Nuoc/);
column.scrollLeft=0;g.nextLine();assert.equal(view.hidden,true);assert.ok(!shell.classList.contains('interaction-active'),'closing dialogue restores the scene');assert.match(nodes['scene-backdrop'].style.backgroundImage,/BG01-fixed/);assert.equal(column.scrollLeft,310,'closing the view restores the player’s horizontal position');
g.act('warning');const late=view.onload;g.clearDialogue();late();assert.equal(view.hidden,true,'late image load must not reopen a closed view');
s=g.initialState();s.scene='BG45';s.flags.huuDone=true;g.setState(s);g.act('huu');assert.match(view.src,/POV_Ong_Huu/);view.onload();
assert.equal(nodes['dialogue-portrait-wrap'].hidden,true,'the person in the view must not be covered by a duplicate portrait');
g.nextLine();g.showLine('Ông Hựu','Xin chào');assert.equal(nodes['dialogue-portrait-wrap'].hidden,false,'normal dialogue still displays the portrait');g.clearDialogue();
s=g.initialState();s.scene='BG05';g.setState(s);g.act('shrine');assert.ok(s.items.includes('incense'),'the incense interaction must still grant the item');assert.match(view.src,/POV_Bat_Huong/);const failed=view.onerror;failed();assert.equal(view.hidden,true,'a missing image must leave the original scene playable');
console.log('OK: interaction view, dialogue, scene restoration, late loading, failure fallback and existing progression.');
