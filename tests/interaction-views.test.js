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
const script=fs.readFileSync(path.join(root,'js/game.js'),'utf8').replace(/\nmount\(\);\s*\}\)\(\);\s*$/,`
render=()=>{};renderSidebar=()=>{};hideModal=()=>{};playSound=()=>{};save=()=>{};itemPop=()=>{};queueMemory=()=>{};toast=()=>{};
chooseModal=(title,body,choices)=>{window.lastChoices=choices};go=id=>{state.scene=id};
window.testGame={initialState,setState:s=>{state=s},act,nextLine,clearDialogue,showLine,showInteractionView,datTrustNo,datTrustYes,INTERACTION_VIEWS};})();`);
assert.ok(script.includes('window.testGame='));vm.runInContext(script,context);const g=window.testGame;
for(const config of Object.values(g.INTERACTION_VIEWS)){assert.ok(fs.existsSync(path.join(root,'assets/props',config.file)),config.file);if(config.nightFile)assert.ok(fs.existsSync(path.join(root,'assets/props',config.nightFile)),config.nightFile)}
const view=nodes['interaction-view'],shell=nodes['app-shell'];
let s=g.initialState();s.flags.oldwomanTalked=true;g.setState(s);column.scrollLeft=310;g.act('warning');
assert.equal(nodes['dialogue'].hidden,false);assert.match(view.src,/POV_Ba_Ban_Nuoc/);shell.scrollTop=76;nodes['scene-stage'].scrollTop=14;view.onload();assert.equal(view.hidden,false);assert.ok(shell.classList.contains('interaction-active'));
assert.equal(shell.scrollTop,0);assert.equal(nodes['scene-stage'].scrollTop,0);assert.match(nodes['scene-backdrop'].style.backgroundImage,/POV_Ba_Ban_Nuoc/);
column.scrollLeft=0;g.nextLine();assert.equal(view.hidden,true);assert.ok(!shell.classList.contains('interaction-active'),'closing dialogue restores the scene');assert.match(nodes['scene-backdrop'].style.backgroundImage,/BG01-fixed/);assert.equal(column.scrollLeft,310,'closing the view restores the player’s horizontal position');
g.act('warning');const late=view.onload;g.clearDialogue();late();assert.equal(view.hidden,true,'late image load must not reopen a closed view');
s=g.initialState();s.scene='BG45';s.flags.huuDone=true;s.items.push('phongThuyBook');g.setState(s);g.act('huu');assert.match(view.src,/POV_Ong_Huu/);view.onload();
assert.equal(nodes['dialogue-portrait-wrap'].hidden,true,'the person in the view must not be covered by a duplicate portrait');
g.nextLine();g.showLine('Thầy Nguyên','Xin chào');assert.equal(nodes['dialogue-portrait-wrap'].hidden,false,'normal dialogue still displays the portrait');g.clearDialogue();
for(const [scene,action,file,flag] of [['BG01','warning','POV_Ba_Ban_Nuoc-night.webp','oldwomanTalked'],['BG45','huu','POV_Ong_Huu-night.webp','huuDone']]){
 s=g.initialState();s.scene=scene;s.visited.push('BG05');s.flags[flag]=true;if(action==='huu')s.items.push('phongThuyBook');g.setState(s);g.act(action);
 assert.ok(view.src.endsWith(file),`${action} uses the night close-up after sunset`);view.onload();assert.ok(view.classList.contains('native-night'));assert.match(nodes['scene-backdrop'].style.backgroundImage,new RegExp(file.replace('.','\\.')));
 g.clearDialogue();assert.ok(!view.classList.contains('native-night'),'closing dialogue clears the night lighting override');
 s.flags.mo=true;g.setState(s);g.act(action);assert.ok(!view.src.endsWith(file),'flashback lighting must not use a present-day night variant');g.clearDialogue();
}
s=g.initialState();s.scene='BG05';g.setState(s);g.act('shrine');assert.ok(s.items.includes('incense'),'the incense interaction must still grant the item');assert.match(view.src,/POV_Bat_Huong/);const failed=view.onerror;failed();assert.equal(view.hidden,true,'a missing image must leave the original scene playable');
for(const [scene,action,filename] of [['BG13','spoon','POV_Muoi_Com'],['BG16','mirror','POV_Guong_Phong_Tre'],['BG21','musicbox','POV_Hop_Nhac'],['BG42','wellSealed','POV_Gieng_Tram'],['BG49','simPhoto','POV_Ong_Dat_Trong_Nha']]){
 s=g.initialState();s.scene=scene;g.setState(s);g.act(action);assert.match(view.src,new RegExp(filename),`${action} opens its dedicated view`);view.onload();assert.equal(view.hidden,false);g.clearDialogue();assert.equal(view.hidden,true);
}
s=g.initialState();s.scene='BG34';g.setState(s);g.act('fbMan');window.lastChoices[0][1]();assert.equal(s.flags.fbMan,'wake');assert.match(view.src,/POV_Ba_Man_Thuc/);view.onload();g.nextLine();assert.equal(nodes['dialogue-portrait-wrap'].hidden,true,'the awakened bà Mận speaks in her own scene');g.clearDialogue();g.act('fbMan');assert.match(view.src,/POV_Ba_Man_Thuc/,'returning to bà Mận remembers the earlier choice');g.clearDialogue();
s=g.initialState();s.scene='BG34';g.setState(s);g.act('fbMan');window.lastChoices[1][1]();assert.equal(s.flags.fbMan,'quiet');assert.match(view.src,/POV_Ba_Man_Ben_Bep/);g.clearDialogue();
s=g.initialState();s.scene='BG48';g.setState(s);g.datTrustNo(1);assert.match(view.src,/POV_Ong_Dat_Cua_Nha/);g.clearDialogue();g.datTrustYes();assert.equal(s.flags.datTrust,true);assert.match(view.src,/POV_Ong_Dat_Cua_Nha/);view.onload();for(let i=0;i<6;i++)g.nextLine();assert.equal(s.scene,'BG49','the accepted conversation still leads into the house');assert.equal(view.hidden,true);
s=g.initialState();s.scene='BG49';s.flags.datBoxDone=true;s.items.push('scrollFake');g.setState(s);g.act('compareScrolls');window.lastChoices[1][1]();assert.match(view.src,/POV_Ong_Dat_Trong_Nha/,'feedback after a choice returns to ông Đạt');g.clearDialogue();g.act('compareScrolls');window.lastChoices[0][1]();window.lastChoices[1][1]();assert.equal(s.flags.scrollCompared,true);assert.match(view.src,/POV_Ong_Dat_Trong_Nha/,'the completed comparison keeps its scene');g.clearDialogue();
console.log('OK: close-ups follow dialogue and choices, restore scenes, handle failed loads, and preserve progression.');
