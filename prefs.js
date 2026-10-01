/* 全站顯示偏好(SSoT)· 字級 + 深/淺色主題
   ------------------------------------------------------------------
   B4 字級調整、B5 手動深/淺色 —— 一次設定,全站頁面共用、跨頁記住。
   作法:
     1) 載入時「立即」套用(在 <head> 非 defer 引入,盡量在畫面繪製前)
        - 主題:html[data-theme=light|dark];auto 則移除屬性,回到系統 @media
        - 字級:設 html 的 font-size(全站 rem 依此縮放)
     2) DOM 就緒後注入右下角浮動「Aa」鈕 + 設定小面板
   儲存:localStorage
     pref_theme      auto | light | dark
     pref_fontscale  15px | 16px | 18px | 20px(未設=瀏覽器預設16px)
   相依:各頁 CSS 皆定義 --card/--ink/--line/--accent/--sub(面板沿用,自動跟主題)
   需搭配:各頁深色區塊已改寫為
     @media(...dark){:root:not([data-theme="light"]){…}}  +  :root[data-theme="dark"]{…}
   變更履歷:
     v1 (2026-09-29) 初版
*/
(function(){
  'use strict';
  var LS={ get:function(k){try{return localStorage.getItem(k);}catch(e){return null;}},
           set:function(k,v){try{localStorage.setItem(k,v);}catch(e){}} };
  var FONTS=[['15px','小'],['16px','標準'],['18px','大'],['20px','特大']];
  var THEMES=[['auto','🔄 自動'],['light','☀️ 淺色'],['dark','🌙 深色']];

  /* ---- 1) 立即套用(head 期間執行,document.documentElement 已存在)---- */
  function applyTheme(t){ var el=document.documentElement;
    if(t==='light'||t==='dark')el.setAttribute('data-theme',t); else el.removeAttribute('data-theme'); }
  function applyFont(fs){ document.documentElement.style.fontSize = fs||''; }
  var curTheme=LS.get('pref_theme')||'auto';
  var curFont =LS.get('pref_fontscale')||'';
  applyTheme(curTheme); applyFont(curFont);
  /* 主題設 auto 時,同步瀏覽器原生配色(捲軸/表單元件跟著深淺) */
  try{ document.documentElement.style.colorScheme = (curTheme==='auto')?'light dark':curTheme; }catch(e){}

  /* ---- 2) DOM 就緒後注入浮動設定 ---- */
  function inject(){
    if(document.getElementById('prefsFab'))return;
    var css=document.createElement('style');
    css.textContent=[
      '#prefsFab{position:fixed;right:14px;bottom:calc(14px + env(safe-area-inset-bottom));z-index:9999;',
        'width:44px;height:44px;border-radius:50%;border:1px solid var(--line,#e2e8f2);',
        'background:var(--card,#fff);color:var(--ink,#1c2330);font-size:19px;cursor:pointer;',
        'box-shadow:0 3px 12px rgba(0,0,0,.18);display:flex;align-items:center;justify-content:center;',
        'font-family:inherit;padding:0;line-height:1}',
      '#prefsFab:active{transform:scale(.94)}',
      '#prefsPanel{position:fixed;right:14px;bottom:calc(66px + env(safe-area-inset-bottom));z-index:9999;',
        'background:var(--card,#fff);color:var(--ink,#1c2330);border:1px solid var(--line,#e2e8f2);',
        'border-radius:14px;box-shadow:0 6px 22px rgba(0,0,0,.22);padding:13px 14px;width:230px;',
        'font-family:inherit;display:none}',
      '#prefsPanel.on{display:block}',
      '#prefsPanel .pl{font-size:12px;font-weight:700;color:var(--sub,#5a6b82);margin:2px 0 6px}',
      '#prefsPanel .pl:not(:first-child){margin-top:12px}',
      '#prefsPanel .grp{display:flex;gap:6px;flex-wrap:wrap}',
      '#prefsPanel .pbtn{flex:1;min-width:44px;border:1.4px solid var(--line,#e2e8f2);background:var(--card,#fff);',
        'color:var(--ink,#1c2330);border-radius:10px;padding:7px 4px;cursor:pointer;font-size:13px;',
        'font-weight:700;font-family:inherit;transition:.12s;white-space:nowrap}',
      '#prefsPanel .pbtn.on{background:var(--accent,#2563eb);color:#fff;border-color:var(--accent,#2563eb)}',
      '#prefsPanel .aa1{font-size:12px} #prefsPanel .aa2{font-size:15px} #prefsPanel .aa3{font-size:17px} #prefsPanel .aa4{font-size:19px}',
      /* A2 觸控裝置(手機 / 平板)放大點擊範圍;滑鼠操作的電腦版外觀不變 */
      '@media (pointer:coarse){',
        '.chip2,.schip,.cbtn,.vbtn,.sbtn,.mbtn,.tabbtn,button[data-f],button[data-si]{min-height:34px}',
        '.tchip,.fchip,.home{min-height:34px;display:inline-flex;align-items:center}',
        'a.hit{min-height:30px;display:inline-flex;align-items:center}',
        '.favbtn{min-width:36px;min-height:36px}',
      '}',
      '@media print{.home{display:none!important}}'
    ].join('');
    document.head.appendChild(css);

    var fab=document.createElement('button');
    fab.id='prefsFab'; fab.type='button'; fab.textContent='Aa';
    fab.setAttribute('aria-label','顯示設定:字級與深淺色');
    fab.title='顯示設定(字級 / 深淺色)';

    var panel=document.createElement('div');
    panel.id='prefsPanel';
    panel.innerHTML=
      '<div class="pl">字級</div><div class="grp" data-g="font">'+
        FONTS.map(function(f,i){return '<button type="button" class="pbtn aa'+(i+1)+'" data-v="'+f[0]+'">'+f[1]+'</button>';}).join('')+
      '</div>'+
      '<div class="pl">主題配色</div><div class="grp" data-g="theme">'+
        THEMES.map(function(t){return '<button type="button" class="pbtn" data-v="'+t[0]+'">'+t[1]+'</button>';}).join('')+
      '</div>';
    document.body.appendChild(fab);
    document.body.appendChild(panel);

    function sync(){
      panel.querySelectorAll('[data-g="font"] .pbtn').forEach(function(b){
        b.classList.toggle('on', b.dataset.v===(LS.get('pref_fontscale')||'16px')); });
      panel.querySelectorAll('[data-g="theme"] .pbtn').forEach(function(b){
        b.classList.toggle('on', b.dataset.v===(LS.get('pref_theme')||'auto')); });
    }
    sync();

    fab.addEventListener('click',function(e){ e.stopPropagation(); panel.classList.toggle('on'); sync(); });
    panel.addEventListener('click',function(e){
      e.stopPropagation();
      var b=e.target.closest('.pbtn'); if(!b)return;
      var g=b.parentElement.dataset.g, v=b.dataset.v;
      if(g==='font'){ LS.set('pref_fontscale',v); applyFont(v); }
      else{ LS.set('pref_theme',v); applyTheme(v);
        try{ document.documentElement.style.colorScheme=(v==='auto')?'light dark':v; }catch(e){} }
      sync();
    });
    document.addEventListener('click',function(){ panel.classList.remove('on'); });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',inject);
  else inject();
})();
