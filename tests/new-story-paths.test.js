/* Exercise the new story choices and ending gates using the real game functions. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..'),storage=new Map();
const node={classList:{add(){},remove(){},toggle(){}},style:{},hidden:false};
const context={window:{},document:{getElementById:()=>node},localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v)},setTimeout(){},clearTimeout(){},setInterval(){},clearInterval(){},requestAnimationFrame(){},matchMedia:()=>({matches:false}),console};
vm.createContext(context);
for(const file of ['assets/research/books-data.js','assets/dialogue/reviewed.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context);
let source=fs.readFileSync(path.join(root,'js/game.js'),'utf8').replace(/\nmount\(\);\s*\}\)\(\);\s*$/,`
render=()=>{};renderSidebar=()=>{};hideModal=()=>{};save=()=>{};playSound=()=>{};itemPop=()=>{};queueMemory=()=>{};toast=()=>{};
talk=(lines,done)=>{window.lastLines=lines;if(done)done()};say=(who,line)=>{window.lastLines=[[who,line]]};
chooseModal=(title,text,choices)=>{window.modal={title,text,choices}};
showOrder=options=>{window.order=options};showEnding=which=>{window.ending=which};
window.qa={initialState,setState:s=>{state=s},huuTalk,wellSealed,seeMaiTrace,returnNames,showTruthBoard,endingEligibility,showAnchorRitual};})();`);
assert.ok(source.includes('window.qa='));vm.runInContext(source,context);
const q=context.window.qa,w=context.window;
function choose(label){const choice=w.modal.choices.find(c=>c[0].includes(label));assert.ok(choice,`${label} missing in ${w.modal.title}`);choice[1]();}
const s=q.initialState();Object.assign(s.flags,{ritualDone:true,sixthDone:true,flashDone:true,lamDone:true,namesDone:true,datTrust:true,scrollCompared:true,wellPhotoSeen:true,wellFlowers:true,researchSolved:['pz_thong_gio','pz_ta_so','pz_chu_lua','pz_ba_dong_xu']});
s.evidence=['ledger','confession','archive','scrollProof'];s.items.push('simLetter','familyRecord');q.setState(s);
{const early=q.initialState();q.setState(early);w.modal=null;q.huuTalk();q.huuTalk();assert.ok(!w.modal,'no book offer before the coin reading is solved');assert.ok(!early.items.includes('phongThuyBook'));q.setState(s);}
assert.equal(q.endingEligibility().canGood,true);assert.equal(q.endingEligibility().canTrue,false);
q.huuTalk();assert.ok(!w.modal||w.modal.title!=='Huyền Ấn Bí Lục – Trấn Âm Đồ','the first meeting must not offer the book');
q.huuTalk();choose('Chưa nhận');assert.ok(!s.items.includes('phongThuyBook'));q.huuTalk();choose('Nhận cuốn sách');assert.ok(s.items.includes('phongThuyBook'),'the book may be accepted after refusal');
q.wellSealed();choose('Soi trang trắng');assert.ok(s.flags.waterBookSeen);assert.ok(!s.items.includes('phongThuyBook'),'used grimoire must disappear from inventory');assert.ok(s.used.includes('phongThuyBook'));q.wellSealed();choose('Quan sát dấu');assert.ok(s.flags.reverseSealSeen);assert.ok(!s.flags.sealRecovered,'inspection must not remove the main seal');
q.returnNames();assert.ok(!s.flags.returnNamesDone,'missing visions block the ritual');
for(const part of ['dam','banyan','well','altar'])q.seeMaiTrace(part);
for(const item of ['lanhComb','phucScarf','maiShirt'])assert.ok(s.items.includes(item),item);
q.returnNames();choose('Phúc');assert.equal(w.modal.title,'Đối chiếu di vật','wrong answers stay retryable');assert.ok(!w.ending);
choose('Lành');choose('Phúc');choose('Mai');assert.ok(s.flags.relicsVerified);choose('Thực hiện lễ trả danh');assert.ok(s.flags.returnNamesDone);assert.ok(!s.flags.sealRecovered);
q.returnNames();choose('Đặt bát cơm trắng');assert.ok(s.flags.riceGift,'the family meal is optional');
q.showTruthBoard();choose('Quế');assert.equal(w.modal.title,'Đối chiếu hồ sơ');assert.ok(!w.ending,'a wrong accusation does not end the game');choose('Thầy Chân');
assert.match(w.order.title,/1986/);w.order.onDone();assert.match(w.order.title,/1988/);w.order.onDone();assert.ok(s.flags.timelineChecked);
for(const answer of ['Không mở then','Thầy Chân','Nhận tiền và dùng ấn giam Mai','Người phát hiện bản sớ giả','Những người quyết định','Phân biệt điều biết được'])choose(answer);
assert.ok(s.flags.truthBoardDone);assert.equal(q.endingEligibility().canTrue,false,'Nguyên must answer for his silence');q.huuTalk();choose('Đưa ghi chép');assert.ok(s.flags.nguyenConfessed);assert.equal(q.endingEligibility().canTrue,false,'the seal must be compared');s.flags.researchSolved.push('pz_dau_an');assert.equal(q.endingEligibility().canTrue,true);
q.wellSealed();choose('Tháo ấn sau');assert.equal(w.ending,'true');
const bad=q.initialState();Object.assign(bad.flags,{flashDone:true,wellPhotoSeen:true,wellFlowers:true});q.setState(bad);w.ending=null;q.wellSealed();choose('Dùng móc kéo mạnh');choose('Dừng lại');assert.ok(!w.ending);q.wellSealed();choose('Dùng móc kéo mạnh');choose('Vẫn kéo ấn ra');assert.equal(w.ending,'bad');
const forged=q.initialState();forged.flags.fakeGot=true;q.setState(forged);w.ending=null;q.showAnchorRitual();choose('Giữ giấy');assert.ok(forged.flags.forgedRiteRejected);assert.ok(!w.ending,'the dubious ritual must not force a BAD ending');
console.log('OK: book refusal and retry, three visions, evidence-based guesses, timelines, Nguyên, optional meal and explicit BAD/TRUE choices.');
