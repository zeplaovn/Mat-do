/* Keep the victim count in discovered documents and victim memories, not ambient exposition. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const context={window:{},document:{getElementById:()=>null},localStorage:{getItem:()=>null,setItem(){}},
 setTimeout,clearTimeout,setInterval,clearInterval,matchMedia:()=>({matches:false}),console};
vm.createContext(context);
for(const file of ['assets/research/books-data.js','assets/dialogue/reviewed.js'])
 vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context);
let game=fs.readFileSync(path.join(root,'game.js'),'utf8');
game=game.replace(/\nmount\(\);\s*\}\)\(\);\s*$/,`
window.mystery={SCENES,CONVO,MORE,INSPECT2,OVERHEARD,ITEMS,ACHIEVEMENTS,MEMORY_VIEWS,ENDINGS,
 QNAMES,PETITION,BOOKS,RESEARCH_PUZZLES,initialState,getObjective,setState:value=>{state=value}};
})();`);
assert.ok(game.includes('window.mystery='));vm.runInContext(game,context);
const g=context.window.mystery;
// Temporal uses of “năm”, such as “năm 1988” or “nhiều năm”, are not the number five.
const spoiler=/(?<![\p{L}\p{N}])(?:năm|5)\s+(?:người|nạn nhân|nhà|bát|chiếc|cái|dấu|di vật|tên|vòng|nén|nấm|vị|linh hồn|sinh viên|cụm|mộ|túi|hồn|đứa|bác|chỗ|hình|vật|phần|phong bì|câu đố|bạn trẻ|khuôn mặt|ký hiệu|móc)(?![\p{L}])|\b[1-5]\s*\/\s*5\b|một, hai, ba, bốn, năm/iu;
const check=(label,text)=>assert.doesNotMatch(String(text),spoiler,`${label} reveals the count`);
const walk=(label,value)=>{
 if(typeof value==='string')check(label,value);
 else if(Array.isArray(value))value.forEach((v,i)=>walk(`${label}[${i}]`,v));
 else if(value&&typeof value==='object')for(const [k,v] of Object.entries(value))walk(`${label}.${k}`,v);
};
for(const [id,scene] of Object.entries(g.SCENES)){
 for(const key of ['name','caption','intro','look'])walk(`${id}.${key}`,scene[key]);
 scene.spots.forEach(h=>check(`${id} hotspot`,h.label));
}
for(const [id,lines] of Object.entries(g.CONVO))walk(`CONVO.${id}`,lines);
for(const [id,lines] of Object.entries(g.MORE))walk(`MORE.${id}`,lines);
for(const [id,lines] of Object.entries(g.INSPECT2))walk(`INSPECT2.${id}`,lines);
for(const [id,lines] of Object.entries(g.OVERHEARD))walk(`OVERHEARD.${id}`,lines);
for(const [id,clue] of Object.entries(g.QNAMES))walk(`QNAMES.${id}`,clue.lines);
// Inline dialogue also appears in interaction handlers, outside the scene tables.
const speakers=new Set(['Nhài','Chi','Vy','Hà','Vũ','Khôi','Người kể chuyện','Ông Hưng','Ông Tùng','Quế','Thầy Chân','Bà Tám','Thầy Nguyên','Giọng trẻ con','Bà bán nước']);
for(const pattern of [/\[\s*(['"])([^'"]{1,30})\1\s*,\s*(['"])((?:\\.|(?!\3)[^\r\n])*?)\3/g,
 /\bsay\(\s*(['"])([^'"]{1,30})\1\s*,\s*(['"])((?:\\.|(?!\3)[^\r\n])*?)\3/g]){
 for(const match of game.matchAll(pattern))if(speakers.has(match[2]))check(`inline: ${match[2]}`,match[4]);
}
for(const [id,item] of Object.entries(g.ITEMS)){check(`ITEMS.${id}`,item.name);check(`ITEMS.${id}`,item.description)}
for(const item of g.ACHIEVEMENTS){check('achievement',item.title);check('achievement',item.detail)}
for(const [id,item] of Object.entries(g.MEMORY_VIEWS)){check(`memory.${id}`,item.title);check(`memory.${id}`,item.alt)}
for(const [id,item] of Object.entries(g.ENDINGS)){check(`ending.${id}`,item.title);check(`ending.${id}`,item.text)}
for(const [id,lines] of Object.entries(context.window.LNRT_DIALOGUE))for(const [who,text] of lines){
 const victimMemory=/^(F0[1-5]|M88[A-F])$/.test(id)&&['Bình','Nụ','Quyên','Thành','Giáp','Nhài'].includes(who);
 if(!victimMemory)check(`${id}: ${who}`,text);
}
for(const [id,p] of Object.entries(g.RESEARCH_PUZZLES)){
 check(`${id} title`,p.title);check(`${id} prompt`,p.prompt);check(`${id} clue`,p.clue);
 if(id!=='pz_sau_bat'){walk(`${id} options`,p.options);walk(`${id} hints`,p.hints)}
}
for(const [id,b] of Object.entries(g.BOOKS)){check(`${id} title`,b.title);check(`${id} summary`,b.summary)}
for(const flags of [{},{gateOpened:true},{gateOpened:true,lamDone:true,flashDone:true}]){
 const state=g.initialState();Object.assign(state.flags,flags);state.relics=['scarf','spoon','comb','petition','sandals'];g.setState(state);
 walk('objective',g.getObjective());
}
assert.match(g.BOOKS.book_bep.pages[2][1],/năm bát/i,'the kitchen diary should retain the actual clue');
assert.match(g.PETITION[0],/năm người/,'the victims’ written testimony should retain the actual clue');
assert.ok(context.window.LNRT_DIALOGUE.F02.some(([who,text])=>who==='Nụ'&&/Bình, Nụ, Quyên, Thành, Giáp/.test(text)),
 'a victim’s own memory may reveal the count');
assert.doesNotMatch(game,/Năm khuôn mặt đều bị cào xước/i,'photo captions must not give away a count');
for(const file of ['intro.js','trailer.js','trailer.html'])check(file,fs.readFileSync(path.join(root,file),'utf8'));
console.log('OK: dialogue, scene labels, objectives and introductions hide the count while victim evidence retains it.');
