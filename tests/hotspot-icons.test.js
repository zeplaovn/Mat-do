/* Run with node tests/hotspot-icons.test.js. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
class Element{
 constructor(){this.style={};this.attributes={};this.children=[];this.listeners={}}
 setAttribute(name,value){this.attributes[name]=value}
 appendChild(child){this.children.push(child)}
 addEventListener(name,listener){this.listeners[name]=listener}
}
const context={window:{actions:[]},document:{getElementById:()=>null,createElement:()=>new Element()},
 localStorage:{getItem:()=>null,setItem:()=>{}},setTimeout,clearTimeout,setInterval,clearInterval,
 matchMedia:()=>({matches:false}),console};
vm.createContext(context);
let script=fs.readFileSync(path.join(root,'js/game.js'),'utf8');
const end=/\nmount\(\);\s*\}\)\(\);\s*$/;
assert.match(script,end);
script=script.replace(end,`
act=action=>{window.actions.push(action);if(window.onAction)window.onAction(action)};
window.testHotspots={SCENES,initialState,makeHotspot,setState:value=>{state=value}};
})();`);
vm.runInContext(script,context);
const g=context.window.testHotspots,state=g.initialState();g.setState(state);
const spot=(scene,action)=>g.SCENES[scene].spots.find(h=>h.action===action);
const classes=h=>g.makeHotspot(h).className.split(' ');
assert.ok(classes(spot('BG01','travel:BG02')).includes('hotspot--up'));
assert.ok(classes(spot('BG02','travel:BG01')).includes('hotspot--down'));
assert.ok(classes(spot('BG15','travel:BG16')).includes('hotspot--left'));
assert.ok(classes(spot('BG15','travel:BG17')).includes('hotspot--right'));
assert.ok(classes(spot('BG01','warning')).includes('hotspot--conversation'));
assert.ok(classes(spot('BG45','huu')).includes('hotspot--conversation'));
assert.ok(classes(spot('BG43','luaDiary')).includes('hotspot--special'));
assert.ok(classes({action:'researchPuzzle:pz',label:'Câu đố',x:1,y:1,w:8,h:12}).includes('hotspot--special'));
const gate=spot('BG08','gate');state.selectedItem='key';
let button=g.makeHotspot(gate);
assert.ok(button.className.includes('hotspot--special'));
assert.ok(button.className.includes('is-target'));
assert.equal(button.attributes['aria-label'],gate.label);
assert.equal(button.style.left,gate.x+'%');assert.equal(button.style.width,gate.w+'%');
context.window.onAction=()=>{state.flags.gateOpened=true;state.selectedItem=null};
let stopped=false;button.listeners.click({stopPropagation:()=>{stopped=true}});
assert.equal(stopped,true);assert.deepEqual(Array.from(context.window.actions),['gate']);
assert.ok(button.className.includes('hotspot--travel'));assert.ok(!button.className.includes('is-target'));
const datDoor=spot('BG48','datDoor');assert.ok(classes(datDoor).includes('hotspot--conversation'));
state.flags.datTrust=true;assert.ok(classes(datDoor).includes('hotspot--travel'));
for(const file of ['direction.png','conversation.png','marker.svg'])assert.ok(fs.statSync(path.join(root,'assets/ui/hotspots',file)).size>0);
console.log('OK: hotspot icon categories, four directions, changing story state, item target and click behavior.');
