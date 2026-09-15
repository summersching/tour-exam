/* 註冊 Service Worker(離線可用);file:// 直接開檔時瀏覽器不支援,會自動略過不影響功能 */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('sw.js').catch(function () {});
  });
}
