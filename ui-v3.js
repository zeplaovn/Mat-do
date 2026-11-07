/* ui-v3: đánh dấu lời dẫn truyện để CSS hiển thị không khung. Không chạm logic game. */
(function(){
  var sp=document.getElementById('dialogue-speaker'),d=document.getElementById('dialogue');
  if(!sp||!d)return;
  function sync(){d.classList.toggle('is-narrator',(sp.textContent||'').trim()==='Người kể chuyện')}
  new MutationObserver(sync).observe(sp,{childList:true,characterData:true,subtree:true});
  sync();
})();

/* Căn lại điểm tương tác lệch ảnh (x,y,w,h tính theo % khung cảnh 16:9).
   Khoá theo mã cảnh + nhãn điểm. Khi sửa thẳng trong game.js (mảng spots) thì xoá mục tương ứng ở đây. */
(function(){
  var FIX={
    BG01:{'Nhìn cổng làng':[33,11,36,22]},
    BG04:{'Ván cầu mục':[29,60,18,14]},
    BG05:{'Bát hương trong miếu':[35,38,18,20],'Bước vào rừng tre':[76,40,20,38]},
    BG06:{'Dải vải đỏ buộc trên tre':[77,36,9,22]},
    BG07:{'Cột mốc đá cũ':[76,48,10,30]},
    BG08:{'Xích và khóa cổng':[43,47,15,24]},
    BG10:{'Ổ khóa đồng':[47,36,10,14]},
    BG11:{'Lối vào phòng thờ':[22,32,18,30]},
    BG14:{'Ảnh gia đình trên tường':[67,8,14,29]},
    BG19:{'Quay về cầu thang đá':[30,80,32,17]},
    BG39:{'Đốm sáng xa xa':[63,44,10,14]}
  };
  var layer=document.getElementById('hotspots'),img=document.getElementById('scene-image'),stage=document.getElementById('scene-stage');
  if(!layer||!img)return;
  function apply(){
    var m=/BG\d+b?/.exec(img.alt||''),fx=m&&FIX[m[0]];
    if(!fx)return;
    Array.prototype.forEach.call(layer.children,function(b){
      var r=fx[b.getAttribute('aria-label')];
      if(r){b.style.left=r[0]+'%';b.style.top=r[1]+'%';b.style.width=r[2]+'%';b.style.height=r[3]+'%'}
    });
  }
  new MutationObserver(apply).observe(layer,{childList:true});
  apply();

  /* Chế độ căn chỉnh: mở game với ?hot=1 để thấy khung mọi điểm bấm và toạ độ % của chỗ vừa chạm. */
  if(/[?&]hot=1/.test(location.search)&&stage){
    var css=document.createElement('style');
    css.textContent='.hotspot{outline:2px dashed #ff4d4d;background:rgba(255,77,77,.12)!important}'+
      '.hotspot .hotspot-label{opacity:1!important;font-size:10px;transform:translateX(-50%)}'+
      '#hot-readout{position:fixed;left:8px;top:8px;z-index:99999;padding:4px 8px;background:#000c;color:#7fff7f;font:12px monospace;pointer-events:none}';
    document.head.appendChild(css);
    var ro=document.createElement('div');ro.id='hot-readout';ro.textContent='Chạm vào cảnh để đọc toạ độ %';document.body.appendChild(ro);
    stage.addEventListener('click',function(e){
      var r=stage.getBoundingClientRect();
      ro.textContent=((e.clientX-r.left)/r.width*100).toFixed(1)+'% , '+((e.clientY-r.top)/r.height*100).toFixed(1)+'%';
    },true);
  }
})();
