/* Màn lưu ý xuất hiện sau khi tải và trước màn hình chính. */
(() => {
  'use strict';
  const notice = document.getElementById('notice-screen');
  const confirm = document.getElementById('notice-confirm');
  const title = document.getElementById('title-screen');
  const game = document.getElementById('app-shell');
  const intro = document.getElementById('intro');

  function syncAccess() {
    const showingNotice = !notice.hidden;
    const showingIntro = !intro.hidden;
    title.inert = showingNotice || showingIntro;
    game.inert = showingNotice || showingIntro || !title.hidden;
    if (showingNotice || showingIntro) title.setAttribute('aria-hidden', 'true');
    else title.removeAttribute('aria-hidden');
  }

  confirm.addEventListener('click', () => {
    notice.hidden = true;
    syncAccess();
    document.getElementById('btn-new-game').focus({ preventScroll: true });
  });

  new MutationObserver(syncAccess).observe(title, { attributes: true, attributeFilter: ['hidden'] });
  new MutationObserver(syncAccess).observe(intro, { attributes: true, attributeFilter: ['hidden'] });
  syncAccess();
})();
