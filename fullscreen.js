/* Nút toàn màn hình: vào/thoát bằng Fullscreen API, tự ẩn nếu trình duyệt không hỗ trợ (vd. iPhone). */
(function(){
  'use strict';
  const root=document.documentElement,btn=document.getElementById('btn-fullscreen');
  if(!btn)return;
  const req=root.requestFullscreen||root.webkitRequestFullscreen;
  const exit=document.exitFullscreen||document.webkitExitFullscreen;
  const isFull=()=>!!(document.fullscreenElement||document.webkitFullscreenElement);
  if(!req||!exit||document.fullscreenEnabled===false){btn.hidden=true;return}
  function sync(){
    const on=isFull();
    btn.setAttribute('aria-pressed',on?'true':'false');
    const label=on?'Thoát toàn màn hình':'Toàn màn hình';
    btn.setAttribute('aria-label',label);btn.title=label;
    btn.classList.toggle('is-full',on);
  }
  btn.addEventListener('click',()=>{
    try{
      const p=isFull()?exit.call(document):req.call(root);
      if(p&&p.catch)p.catch(()=>{});
    }catch(_){}
  });
  document.addEventListener('fullscreenchange',sync);
  document.addEventListener('webkitfullscreenchange',sync);
  sync();
})();
