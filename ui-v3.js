/* ui-v3: đánh dấu lời dẫn truyện để CSS hiển thị không khung. Không chạm logic game. */
(function(){
  var sp=document.getElementById('dialogue-speaker'),d=document.getElementById('dialogue');
  if(!sp||!d)return;
  function sync(){d.classList.toggle('is-narrator',(sp.textContent||'').trim()==='Người kể chuyện')}
  new MutationObserver(sync).observe(sp,{childList:true,characterData:true,subtree:true});
  sync();
})();
