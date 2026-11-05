/* Story ordering, memory lifecycle and save compatibility across actual game functions. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
class Classes{constructor(){this.items=new Set()}add(x){this.items.add(x)}remove(x){this.items.delete(x)}contains(x){return this.items.has(x)}toggle(x,on){if(on===undefined)on=!this.items.has(x);on?this.items.add(x):this.items.delete(x);return on}}
class Element{constructor(){this.hidden=false;this.classList=new Classes();this.textContent='';this.innerHTML='';this.style={};this.children=[];this.complete=false;this.naturalWidth=0}appendChild(x){this.children.push(x);return x}setAttribute(){}focus(){}}
const ids=['interaction-view','app-shell','scene-stage','scene-backdrop','dialogue','dialogue-next','dialogue-portrait-wrap','dialogue-portrait','dialogue-symbol','dialogue-speaker','dialogue-text','chatter','memory-banner','memory-banner-time','memory-banner-title','btn-journal','title-screen'];
const nodes=Object.fromEntries(ids.map(x=>[x,new Element()]));nodes['title-screen'].hidden=true;
const column=new Element();column.scrollLeft=112;
const store=new Map(),context={window:{},document:{getElementById:id=>nodes[id]||null,createElement:()=>new Element(),querySelector:s=>s==='.game-column'?column:null},localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)},setTimeout:()=>0,clearTimeout(){},setInterval(){},clearInterval(){},requestAnimationFrame(){},matchMedia:()=>({matches:false}),console};
vm.createContext(context);
for(const file of ['assets/research/books-data.js','assets/dialogue/reviewed.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context);
const game=fs.readFileSync(path.join(root,'game.js'),'utf8').replace(/\nmount\(\);\s*\}\)\(\);\s*$/,`
render=()=>{};renderSidebar=()=>{};hideModal=()=>{modalType=null};playSound=()=>{};save=()=>{};itemPop=()=>{};toast=()=>{};
chooseModal=(title,body,choices)=>{window.choices=choices;window.choiceTitle=title};
window.game={initialState,setState:s=>{state=s},getState:()=>state,playMemory,playSimMemory,memoryLines,refreshMemoryUI,displayStoryTime,sceneBackground,sceneTimeGrade,sceneAmbience,quietVillageAtNight,startFlashbackPrompt,forestAltar,clearDialogue,nextLine,act,showWellPhoto,endingEligibility,MEMORY_ITEMS,MEMORY_VIEWS,ENDINGS,load,sig,SAVE_KEY};})();`);
vm.runInContext(game,context);const g=context.window.game,view=nodes['interaction-view'],banner=nodes['memory-banner'];
function finish(){let guard=100;while(!nodes.dialogue.hidden&&guard-->0)g.nextLine();assert.ok(guard>0,'dialogue did not finish')}
const sceneFiles=new Set();
for(const id of Object.keys(g.MEMORY_ITEMS)){
 const s=g.initialState();s.scene='BG13';s.relics.push(id);s.flags.mirrorPhoto=true;g.setState(s);
 const early=g.memoryLines(id).map(x=>x.join(' ')).join(' ');assert.doesNotMatch(early,/Mơ/,`${id} must not expose the name before it is discovered`);
 s.flags.sixthDone=true;assert.match(g.memoryLines(id).map(x=>x.join(' ')).join(' '),/Mơ|mình|Tâm|bếp/,`${id} is readable after discovery`);s.flags.sixthDone=false;
 const file=g.MEMORY_VIEWS[id].file;sceneFiles.add(file);assert.ok(fs.existsSync(path.join(root,'assets','props',file)));
 g.playMemory(id);assert.equal(s.scene,'BG13');assert.equal(banner.hidden,false);assert.match(nodes['memory-banner-time'].textContent,/HỒI ỨC · 1988/);assert.match(view.src,new RegExp(file));
 view.onload();assert.equal(view.hidden,false);assert.ok(nodes['app-shell'].classList.contains('memory-active'));
 g.clearDialogue();assert.equal(banner.hidden,true);assert.equal(view.hidden,true);assert.ok(!(s.flags.memoriesSeen||[]).includes(id),'interrupted flashbacks must not count as seen');
 g.playMemory(id);view.onload();finish();assert.ok(s.flags.memoriesSeen.includes(id),'finished flashback must be recorded');assert.equal(s.scene,'BG13');assert.equal(banner.hidden,true);assert.equal(view.hidden,true);
}
assert.equal(sceneFiles.size,5,'each relic has its own scene');
let s=g.initialState();s.scene='BG49';s.flags.simHeard=true;g.setState(s);g.playSimMemory();assert.match(nodes['memory-banner-time'].textContent,/1986/);assert.match(view.src,/Hoi_Uc_Sim_1986/);view.onload();finish();assert.equal(s.flags.simMemorySeen,true);assert.equal(banner.hidden,true);
s=g.initialState();s.scene='BG34';s.flags.mo=true;g.setState(s);g.refreshMemoryUI();assert.equal(banner.hidden,false);assert.match(nodes['memory-banner-title'].textContent,/Mơ/);g.clearDialogue();assert.equal(banner.hidden,false,'the label stays visible during interactive flashback');s.flags.mo=false;g.refreshMemoryUI();assert.equal(banner.hidden,true);
s=g.initialState();s.scene='BG21';g.setState(s);g.act('girl');assert.equal(nodes['dialogue-speaker'].textContent,'Giọng trẻ con');g.clearDialogue();s.flags.sixthDone=true;g.act('girl');assert.equal(nodes['dialogue-speaker'].textContent,'Mơ');g.clearDialogue();
s=g.initialState();s.scene='BG40';s.visited=['BG01','BG13','BG24','BG42','BG29','BG40'];g.setState(s);assert.equal(g.displayStoryTime(),'05:40');s.scene='BG13';assert.equal(g.displayStoryTime(),'05:40','returning to earlier location must not reverse time');s.scene='BG34';s.flags.mo=true;assert.equal(g.displayStoryTime(),'02:50');s.flags.mo=false;s.scene='BG13';assert.equal(g.displayStoryTime(),'05:40','coming back from 1988 restores present time');
s=g.initialState();g.setState(s);assert.match(g.sceneBackground('BG01'),/BG01-fixed\.webp$/);assert.equal(g.sceneAmbience().market,.22);
s.scene='BG04';s.visited.push('BG04');assert.equal(g.displayStoryTime(),'17:30');s.scene='BG01';assert.equal(g.sceneTimeGrade('BG01'),'dusk');assert.match(g.sceneBackground('BG01'),/BG01-fixed\.webp$/);
s.scene='BG07';s.visited.push('BG07');assert.equal(g.displayStoryTime(),'21:05');s.scene='BG01';assert.equal(g.displayStoryTime(),'21:05');assert.equal(g.quietVillageAtNight(),true);assert.equal(g.sceneAmbience().market,undefined);assert.ok(g.sceneAmbience().crickets);
for(const id of ['BG01','BG02','BG03','BG04','BG45']){const file=g.sceneBackground(id);assert.match(file,new RegExp(id+'-night\\.webp$'));assert.ok(fs.existsSync(path.join(root,file)),`${id} needs a night image`);assert.equal(g.sceneTimeGrade(id),'night-art')}
s.scene='BG40';s.visited.push('BG40');assert.equal(g.displayStoryTime(),'05:40');assert.equal(g.sceneTimeGrade('BG06'),'dawn-morning-art');assert.equal(g.sceneTimeGrade('BG01'),'dawn-art');
for(const id of ['BG05','BG06','BG07','BG08','BG09','BG10']){const file=g.sceneBackground(id);assert.match(file,new RegExp(id+'-morning\\.webp$'));assert.ok(fs.existsSync(path.join(root,file)),`${id} needs a morning image`)}
s.scene='BG41';s.visited.push('BG41');assert.equal(g.displayStoryTime(),'06:30');s.scene='BG01';assert.match(g.sceneBackground('BG01'),/BG01-fixed\.webp$/);assert.equal(g.sceneAmbience().market,.22);assert.equal(g.sceneTimeGrade('BG06'),'morning-art');assert.equal(g.sceneTimeGrade('BG04'),'morning-bridge');
s.flags.mo=true;s.scene='BG34';assert.equal(g.displayStoryTime(),'02:50');assert.equal(g.sceneTimeGrade('BG34'),'');assert.match(g.sceneBackground('BG34'),/BG34\.webp$/);s.flags.mo=false;s.scene='BG01';assert.equal(g.displayStoryTime(),'06:30');
// The confrontation is reached by the required rice-bowl scene, and can be retried after an interruption.
s=g.initialState();s.scene='BG12';s.flags.lamDone=true;g.setState(s);g.act('riceBowl');finish();assert.equal(s.flags.camp0,true,'required story scene must include the confrontation');
s=g.initialState();s.scene='BG43';s.flags.lamDone=true;g.setState(s);g.startFlashbackPrompt();assert.equal(s.flags.camp0,undefined);g.clearDialogue();assert.equal(s.flags.camp0,undefined,'an interrupted confrontation is not recorded');g.startFlashbackPrompt();finish();assert.equal(s.flags.camp0,true,'old saves can still hear the missing confrontation');
s=g.initialState();s.scene='BG42';s.flags.flashDone=true;g.setState(s);g.showWellPhoto();assert.match(view.src,/Anh_Gieng_Hai_Bong/);view.onload();finish();assert.equal(s.flags.wellPhotoSeen,true);assert.ok(s.notes.some(n=>n.id==='wellPhoto'));
function optionsFor(full){const x=g.initialState();x.scene='BG40';Object.assign(x.flags,{redSeen:true,grandSeen:true,ritualDone:true,sixthDone:true,flashDone:true,lamDone:true,namesDone:true,scrollCompared:true,sealRecovered:true,datTrust:true,researchSolved:['pz_thong_gio','pz_ta_so','pz_chu_lua',...(full?['pz_loi_khan','pz_thu_sim','pz_dau_an']:[])]});x.evidence=['ledger','confession','archive','scrollProof'];x.items.push('simLetter');g.setState(x);g.forestAltar();finish();return context.window.choices.map(x=>x[0])}
const good=optionsFor(false),complete=optionsFor(true);assert.ok(good.some(x=>x.includes('Gỡ những dấu')));assert.ok(!good.some(x=>x.includes('ấn đồng')));assert.ok(!complete.some(x=>x.includes('Gỡ những dấu')));assert.ok(complete.some(x=>x.includes('ấn đồng')));
assert.doesNotMatch(g.ENDINGS.normal.text,/Mơ|Sim|2027/,'early departure must not reveal unseen story');
s=g.initialState();s.scene='BG13';s.notes=[{id:'simStory',title:'Sim',body:'Lê Thị Sim sinh năm 1962, hái thuốc.'},{id:'testimony',title:'Mận',body:'Bà thấy ông Lâm bế cháu Mơ về phía giếng.'}];const d=JSON.stringify(s);store.set(g.SAVE_KEY,JSON.stringify({d,h:g.sig(d)}));const restored=g.load();assert.match(restored.notes[0].body,/1971/);assert.match(restored.notes[1].body,/cầu cứu/);assert.equal(restored.scene,'BG13');
console.log('OK: distinct labelled memories, completion and interruption, early-name masking, timeline, well lead, endings and save migration.');
