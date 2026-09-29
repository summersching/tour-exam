/* 註冊 Service Worker(離線可用);file:// 直接開檔時瀏覽器不支援,會自動略過不影響功能
   B7:偵測到新版內容時,右下角跳非侵入式提示,使用者自行決定何時重新整理(不打斷作答)
   變更履歷:
     v2 (2026-09-29) 加入新版偵測 + 更新提示 toast
*/
(function(){
  if(!('serviceWorker' in navigator))return;

  function showUpdateToast(){
    if(document.getElementById('swUpdateToast'))return;
    var wrap=document.createElement('div');
    wrap.id='swUpdateToast';
    wrap.style.cssText='position:fixed;left:50%;transform:translateX(-50%);'
      +'bottom:calc(16px + env(safe-area-inset-bottom));z-index:10000;'
      +'background:var(--accent,#2563eb);color:#fff;border-radius:24px;'
      +'box-shadow:0 4px 18px rgba(0,0,0,.28);padding:10px 8px 10px 16px;'
      +'display:flex;align-items:center;gap:10px;font-size:14px;font-weight:700;'
      +'font-family:"Segoe UI","Microsoft JhengHei","PingFang TC",system-ui,sans-serif;'
      +'max-width:calc(100vw - 32px)';
    var txt=document.createElement('span'); txt.textContent='🎉 有新版內容';
    var go=document.createElement('button'); go.textContent='立即更新';
    go.style.cssText='background:#fff;color:var(--accent,#2563eb);border:none;border-radius:18px;'
      +'padding:7px 14px;font-weight:700;cursor:pointer;font-family:inherit;font-size:13px';
    go.onclick=function(){ location.reload(); };
    var x=document.createElement('button'); x.textContent='✕'; x.setAttribute('aria-label','稍後再說');
    x.style.cssText='background:transparent;color:#fff;border:none;cursor:pointer;font-size:15px;padding:2px 6px';
    x.onclick=function(){ wrap.remove(); };
    wrap.appendChild(txt); wrap.appendChild(go); wrap.appendChild(x);
    (document.body||document.documentElement).appendChild(wrap);
  }

  window.addEventListener('load',function(){
    navigator.serviceWorker.register('sw.js').then(function(reg){
      // 已有控制者(非首次安裝)時,若偵測到新版 worker 安裝完成 → 提示
      reg.addEventListener('updatefound',function(){
        var nw=reg.installing; if(!nw)return;
        nw.addEventListener('statechange',function(){
          if(nw.state==='installed' && navigator.serviceWorker.controller){ showUpdateToast(); }
        });
      });
    }).catch(function(){});
  });
})();
